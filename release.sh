#!/bin/bash
set -e

echo "📦 Building Chrome and Firefox packages..."
node build.mjs

echo "🧭 Refreshing Safari Xcode project..."
xcrun safari-web-extension-converter dist/chrome \
  --app-name "WebToMarkdown" \
  --project-location safari \
  --macos-only \
  --no-open \
  --no-prompt \
  --force

echo "✅ Build complete! release artifacts are in dist/ and safari/"
