#!/usr/bin/with-contenv sh

# Navigate to frontend, install dependencies, and build
cd /data/frontend
npm ci
npm run build

# Serve the build via a simple HTTP server
cd build
exec python3 -m http.server 80