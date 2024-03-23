#!/bin/bash
set -e

npm run build:webpack
cp ./manifest.json dist/
cp -r icons dist/