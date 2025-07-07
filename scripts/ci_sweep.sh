#!/usr/bin/env bash
set -euo pipefail

# Ensure JS deps and Ruff are available
pnpm install --no-frozen-lockfile
pip install --quiet ruff

echo "🔍 Ruff…"; ruff check .
echo "🎨 Black…"; black --check .
echo "🧬 MyPy…"; mypy .
echo "🧪 PyTest…"; PYTHONPATH=. pytest -q
if grep -q '"status": *"failed"' ./netlify/*.json 2>/dev/null; then
  echo "\e[31mNetlify build failed\e[0m" && exit 1
fi
echo "✅ Sweep clean"
