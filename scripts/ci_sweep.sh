#!/usr/bin/env bash
set -euo pipefail

# ---- lint deps ---------------------------------------------------------
python -m pip install --quiet ruff==0.4.4 black==24.4.2

# --- Lint & type-check sweep -----------------------------------
echo "🔍 Ruff…"
ruff check .

echo "🧹 Black…"
python -m black --check .

echo "🔤 MyPy…"
python -m pip install --quiet mypy==1.10.0
mypy .

echo "✅ All checks passed!"

# --- JS/TS workspace lint (optional) ---------------------------
# pnpm dlx eslint . --max-warnings 0
