#!/bin/bash

set -e

EXT_NAME="vuex-reference-helper"
VERSION=$(node -p "require('./package.json').version")

echo "📦 Packaging extension v$VERSION..."
vsce package

VSIX_FILE="$EXT_NAME-$VERSION.vsix"

echo "🚀 Publishing to VS Code Marketplace..."
vsce publish -p $VSCE_PAT

echo "🌍 Publishing to Open VSX..."
ovsx publish "$VSIX_FILE" -p $OVSX_PAT

echo "✅ Done! Published $EXT_NAME v$VERSION to both VS Code Marketplace and Open VSX."
