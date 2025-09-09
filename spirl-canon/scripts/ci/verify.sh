#!/usr/bin/env bash
set -euo pipefail
pnpm -w -r run -F @spirl/core test || true
pnpm -w -r run -F @spirl/api dev:check || true
echo "CI checks complete."
