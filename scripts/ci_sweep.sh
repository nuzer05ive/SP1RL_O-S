#!/usr/bin/env bash
set -euo pipefail

# --- Lint & type-check sweep -----------------------------------
echo "🔍 Ruff…"
ruff check .

echo "🧹 Black…"
# Ensure Black is available even in fresh runners
python -m pip install --quiet black==24.4.2
black --check .

echo "🔤 MyPy…"
python -m pip install --quiet mypy==1.10.0
mypy .

echo "✅ All checks passed!"

# --- JS/TS workspace lint (optional) ---------------------------
# pnpm dlx eslint . --max-warnings 0
