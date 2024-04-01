#!/bin/bash
set -e

MODE=${DEPLOYMENT_MODE:-development}

# If production, clean the directory first
if [[ $MODE == "production" ]]; then
  npm run clean
fi

# Run webpack
npm run build:webpack -- --mode ${MODE}

# Copy the other files across
cp ./manifest.json dist/
cp -r icons dist/
cp -r html dist/

# Create the zip
pushd ./dist
zip -x *.zip -r SilverDollar.zip .
popd