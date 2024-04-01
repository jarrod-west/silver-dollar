#!/bin/bash
set -e

# Build a production version of the extension as well as source code for review.

export DEPLOYMENT_MODE=production

# Regular build script to build the extension
source ./scripts/build.sh

# The source code zip
FILENAME=SilverDollarReview.zip

rm "$FILENAME" || true # Don't fail if it doesn't exist

zip \
  -x '/**/__tests__/*' 'node_modules/*' 'coverage/*' 'dist/*' '.vscode/*' \
  -r \
  "$FILENAME" \
  . \
  -i 'src/*.ts' '*.css' '*.html' './*.json' 'webpack.config.js' 'scripts/build.sh' 'icons/*'

# Copy the review readme into the zip
REVIEW_README=./readme.md
cp ./docs/review.md "$REVIEW_README"
zip -u "$FILENAME" "$REVIEW_README"
rm "$REVIEW_README"