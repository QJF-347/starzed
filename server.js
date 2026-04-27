import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
console.log(`Starting server on PORT: ${PORT}`);

// Start Test backend
const startDjango = () => {
  console.log('Starting test backend...');
  const djangoCommand = 'python';
  const djangoArgs = ['test_backend.py'];

  const django = spawn(djangoCommand, djangoArgs, {
    cwd: __dirname,
    env: { ...process.env, PATH: process.env.PATH },
    stdio: ['pipe', 'pipe', 'pipe']
  });

  django.stdout.on('data', (data) => {
    console.log(`Django Output: ${data.toString().trim()}`);
  });

  django.stderr.on('data', (data) => {
    console.error(`Django Error: ${data.toString().trim()}`);
  });

  django.on('close', (code) => {
    console.log(`Test backend process exited with code ${code}`);
  });

  django.on('error', (err) => {
    console.error(`Failed to start test backend: ${err}`);
    console.error('This might be due to missing dependencies or configuration issues.');
  });

  // Add timeout for test backend startup
  setTimeout(() => {
    if (!django.killed && django.exitCode === null) {
      console.log('Test backend process appears to be running...');
    }
  }, 30000); // 30 seconds timeout

  return django;
};

// API proxy to Django backend
const apiProxy = createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  timeout: 30000, // 30 seconds timeout
  proxyTimeout: 30000,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request: ${req.method} ${req.url} -> http://localhost:8000${req.url}`);
    console.log(`Original URL: ${req.originalUrl}, Base URL: ${req.baseUrl}, Path: ${req.path}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err.message);
    console.error('Target URL:', 'http://localhost:8000' + req.url);
    if (!res.headersSent) {
      // Check if this is an API call and return appropriate JSON error
      if (req.url.startsWith('/api/')) {
        res.status(502).json({
          success: false,
          message: 'Backend service unavailable',
          error: 'Django backend is not running or not responding',
          details: err.message,
          path: req.url
        });
      } else {
        res.status(502).send('Backend service unavailable');
      }
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Proxy response: ${req.method} ${req.url} -> ${proxyRes.statusCode}`);

    // Check if API request is getting HTML response (should be JSON)
    if (req.url.startsWith('/api/') && proxyRes.headers['content-type'] &&
        proxyRes.headers['content-type'].includes('text/html')) {
      console.error(`WARNING: API request ${req.url} received HTML response instead of JSON!`);
      console.error(`This usually indicates a Django error (500, 404, etc.)`);
    }
  }
});

// Health check endpoint (before API routes)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Starzed application is running' });
});

// Emergency database fix via health endpoint
app.get('/health-fix', async (req, res) => {
  try {
    
    // Run the direct fix script
    const pythonProcess = spawn('python', ['src/direct_fix.py'], {
      cwd: __dirname,
      env: process.env
    });
    
    let output = '';
    let error = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.json({
          success: true,
          message: 'Database fix completed successfully',
          output: output
        });
      } else {
        res.json({
          success: false,
          message: 'Database fix failed',
          error: error,
          output: output
        });
      }
    });
    
  } catch (error) {
    res.json({
      success: false,
      message: 'Error running database fix',
      error: error.message
    });
  }
});

// Emergency database fix endpoint
app.get('/fix-database', async (req, res) => {
  try {
    const pythonProcess = spawn('python', ['src/fix_server.py'], {
      cwd: __dirname,
      env: { ...process.env, PORT: '5001' }
    });
    
    // Wait a moment for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Make request to fix server
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/fix-eligibility',
      method: 'POST'
    };
    
    const fixReq = http.request(options, (fixRes) => {
      let data = '';
      fixRes.on('data', chunk => data += chunk);
      fixRes.on('end', () => {
        // Kill the fix server
        pythonProcess.kill();
        
        try {
          const result = JSON.parse(data);
          res.json(result);
        } catch (e) {
          res.json({ success: false, message: 'Invalid response', data });
        }
      });
    });
    
    fixReq.on('error', (err) => {
      pythonProcess.kill();
      res.json({ success: false, message: err.message });
    });
    
    fixReq.end();
    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Serve static files (built frontend)
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy API requests (only for /api paths)
app.use('/api', apiProxy);

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// Start Django backend
const djangoProcess = startDjango();

// Wait for Django to start before starting Node.js server
const startupDelay = process.env.NODE_ENV === 'production' ? 15000 : 5000;

// Check if Django is ready with timeout
const checkDjangoHealth = () => {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds max wait
    const checkInterval = 1000; // Check every second

    const check = () => {
      attempts++;
      const options = {
        hostname: 'localhost',
        port: 8000,
        path: '/api/health/',
        method: 'GET',
        headers: {
          'Host': 'localhost'
        }
      };

      const req = http.request(options, (res) => {
        // Only accept 200 (OK) as valid response
        if (res.statusCode === 200) {
          console.log('Django is ready!');
          resolve(true);
        } else {
          console.log(`Django returned status ${res.statusCode} (expected 200)`);
          if (attempts < maxAttempts) {
            console.log(`Django not ready yet (attempt ${attempts}/${maxAttempts}), status: ${res.statusCode}`);
            setTimeout(check, checkInterval);
          } else {
            console.log(`Django health check timed out after ${maxAttempts} attempts`);
            resolve(false);
          }
        }
      });

      req.on('error', (err) => {
        if (attempts < maxAttempts) {
          console.log(`Django not responding (attempt ${attempts}/${maxAttempts}): ${err.message}`);
          setTimeout(check, checkInterval);
        } else {
          console.log(`Django health check timed out after ${maxAttempts} attempts`);
          resolve(false);
        }
      });

      req.end();
    };
    check();
  });
};

setTimeout(async () => {
  console.log('Checking Django health...');
  const djangoReady = await checkDjangoHealth();

  if (!djangoReady) {
    console.warn('WARNING: Django backend may not be fully ready, but starting Node.js server anyway...');
    console.warn('Some API endpoints may not work until Django is fully initialized.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Unified Starzed server running on port ${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`Backend API: http://localhost:${PORT}/api`);
    if (!djangoReady) {
      console.log('NOTE: Backend API may return errors until Django is fully initialized.');
    }
  });
}, startupDelay); // Wait longer for Django to start in production

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  djangoProcess.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  djangoProcess.kill('SIGTERM');
  process.exit(0);
});
