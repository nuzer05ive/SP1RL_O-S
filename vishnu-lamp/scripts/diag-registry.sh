#!/usr/bin/env bash
set -euo pipefail
echo "node: $(node -v)"
echo "pnpm: $(pnpm -v || true)"
echo "npm ping:" && npm ping || true
echo "pnpm ping:" && pnpm ping || true
echo "workspace .npmrc:" && cat .npmrc || true
echo "home .npmrc:" && [ -f "$HOME/.npmrc" ] && cat "$HOME/.npmrc" || echo "(none)"
