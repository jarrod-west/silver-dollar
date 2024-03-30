#!/bin/bash
set -e

MODE=${DEPLOYMENT_MODE:-development}

npm run build:webpack -- --mode ${MODE}
cp ./manifest.json dist/
cp -r icons dist/
cp -r html dist/