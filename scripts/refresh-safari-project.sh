#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$BACKUP_DIR"
}

backup_path() {
  local relative_path="$1"
  local source_path="$ROOT_DIR/$relative_path"
  local backup_path="$BACKUP_DIR/$relative_path"

  if [[ -e "$source_path" ]]; then
    mkdir -p "$(dirname "$backup_path")"
    cp -R "$source_path" "$backup_path"
  fi
}

restore_path() {
  local relative_path="$1"
  local source_path="$BACKUP_DIR/$relative_path"
  local restore_path="$ROOT_DIR/$relative_path"

  if [[ -e "$source_path" ]]; then
    rm -rf "$restore_path"
    mkdir -p "$(dirname "$restore_path")"
    cp -R "$source_path" "$restore_path"
  fi
}

trap cleanup EXIT

echo "📦 Building extension artifacts..."
node "$ROOT_DIR/build.mjs"

echo "🗂️ Backing up native Safari customizations..."
backup_path "safari/WebToMarkdown/WebToMarkdown/Assets.xcassets/AppIcon.appiconset"
backup_path "safari/WebToMarkdown/WebToMarkdown/Assets.xcassets/LargeIcon.imageset"
backup_path "safari/WebToMarkdown/WebToMarkdown/PrivacyInfo.xcprivacy"
backup_path "safari/WebToMarkdown/WebToMarkdown Extension/PrivacyInfo.xcprivacy"

echo "🧭 Refreshing Safari Xcode project..."
xcrun safari-web-extension-converter "$ROOT_DIR/dist/safari" \
  --app-name "WebToMarkdown" \
  --project-location "$ROOT_DIR/safari" \
  --macos-only \
  --no-open \
  --no-prompt \
  --force

echo "♻️ Restoring native Safari customizations..."
restore_path "safari/WebToMarkdown/WebToMarkdown/Assets.xcassets/AppIcon.appiconset"
restore_path "safari/WebToMarkdown/WebToMarkdown/Assets.xcassets/LargeIcon.imageset"
restore_path "safari/WebToMarkdown/WebToMarkdown/PrivacyInfo.xcprivacy"
restore_path "safari/WebToMarkdown/WebToMarkdown Extension/PrivacyInfo.xcprivacy"

echo "🩹 Reapplying Safari Xcode project patches..."
node "$ROOT_DIR/scripts/apply-safari-customizations.mjs"

echo "🔢 Re-syncing Safari marketing version from manifest.json..."
node "$ROOT_DIR/scripts/sync-safari-version.mjs"

echo "✅ Safari project refreshed. Native icons, privacy manifests, targeted Xcode patches, and versioning were preserved."
