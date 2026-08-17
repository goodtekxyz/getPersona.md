#!/usr/bin/env bash
# Placeholder: wrap commands with Infisical when configured.
# Usage: ./scripts/infisical-run.sh -- pnpm --filter @getpersona/api dev
set -euo pipefail
if [[ "${1:-}" == "--" ]]; then
  shift
fi
exec "$@"
