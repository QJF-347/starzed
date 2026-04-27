import http from 'http';

// Test if Django is running on localhost:8000
function testDjangoDirect() {
  const options = {
    hostname: '127.0.0.1',
    port: 8000,
    path: '/api/health/',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`Django Direct Test - Status: ${res.statusCode}`);
    console.log(`Django Direct Test - Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Django Direct Test - Response: ${data}`);
    });
  });

  req.on('error', (err) => {
    console.log(`Django Direct Test - Error: ${err.message}`);
  });

  req.on('timeout', () => {
    console.log('Django Direct Test - Timeout');
    req.destroy();
  });

  req.end();
}

// Test the proxy endpoint
function testProxy() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/health/',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`Proxy Test - Status: ${res.statusCode}`);
    console.log(`Proxy Test - Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Proxy Test - Response: ${data}`);
    });
  });

  req.on('error', (err) => {
    console.log(`Proxy Test - Error: ${err.message}`);
  });

  req.on('timeout', () => {
    console.log('Proxy Test - Timeout');
    req.destroy();
  });

  req.end();
}

console.log('=== Testing Django and Proxy ===');
console.log('1. Testing Django directly on port 8000...');
testDjangoDirect();

setTimeout(() => {
  console.log('\n2. Testing proxy on port 3000...');
  testProxy();
}, 2000);
