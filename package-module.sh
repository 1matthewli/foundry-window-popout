#!/bin/bash

# Get version from module.json
VERSION=$(grep '"version"' module.json | cut -d '"' -f 4)

# Create release directory if it doesn't exist
mkdir -p dist

# Create zip file
zip -r "dist/window-popout-v$VERSION.zip" \
    module.json \
    README.md \
    scripts/ \
    styles/ \
    LICENSE \
    --exclude ".*" \
    --exclude "__MACOSX" \
    --exclude "*.DS_Store"

echo "Created dist/window-popout-v$VERSION.zip"
