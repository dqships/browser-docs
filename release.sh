#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REFRESH_SAFARI=false
SAFARI_BUILD=""

usage() {
  cat <<'EOF'
Usage: ./release.sh [--refresh-safari] [--safari-build <number>]

Options:
  --refresh-safari       Re-run the Safari wrapper converter before syncing version metadata.
  --safari-build <n>     Set a specific Safari CURRENT_PROJECT_VERSION build number.
  --help                 Show this help text.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --refresh-safari)
      REFRESH_SAFARI=true
      shift
      ;;
    --safari-build)
      if [[ $# -lt 2 ]]; then
        echo "❌ --safari-build requires a numeric value."
        exit 1
      fi
      SAFARI_BUILD="$2"
      shift 2
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "❌ Unknown argument: $1"
      usage
      exit 1
      ;;
  esac
done

if [[ "$REFRESH_SAFARI" == true ]]; then
  echo "🧭 Refreshing Safari wrapper and rebuilding extension artifacts..."
  "$ROOT_DIR/scripts/refresh-safari-project.sh"
else
  echo "📦 Building Chrome and Firefox packages..."
  node "$ROOT_DIR/build.mjs"
fi

echo "🔢 Syncing Safari version metadata..."
if [[ -n "$SAFARI_BUILD" ]]; then
  node "$ROOT_DIR/scripts/sync-safari-version.mjs" --build "$SAFARI_BUILD"
else
  node "$ROOT_DIR/scripts/sync-safari-version.mjs" --increment-build
fi

echo "✅ Release artifacts are ready in dist/, and the Safari wrapper version was synced."
if [[ "$REFRESH_SAFARI" == true ]]; then
  echo "ℹ️ Safari wrapper was refreshed as part of this release run."
else
  echo "ℹ️ Safari wrapper was not regenerated. Add --refresh-safari when you intentionally want to refresh it."
fi
