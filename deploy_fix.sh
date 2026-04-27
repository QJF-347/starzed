#!/bin/bash

echo "Deploying fix for static assets serving..."

# Build the frontend
echo "Building frontend..."
npm run build

# Ensure the dist directory exists
if [ ! -d "dist" ]; then
    echo "Error: dist directory not found after build"
    exit 1
fi

echo "Frontend built successfully"
echo "Contents of dist/assets:"
ls -la dist/assets/ | head -5

echo "Deployment fix complete!"
echo "The Django backend should now serve static assets correctly."
