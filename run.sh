#!/usr/bin/with-contenv sh
set -e

# Load add-on options
CONFIG_PATH="/data/options.json"
ENTITY_ID=$(jq --raw-output ".entity_id" "$CONFIG_PATH")

# Build React frontend
cd /data/frontend
npm ci
npm run build

# Serve build
cd build
exec python3 -m http.server 80