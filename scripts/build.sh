#!/bin/bash
set -e

npm run build
cp ./manifest.json dist/
cp -r icons dist/