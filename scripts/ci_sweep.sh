#!/usr/bin/env bash
set -euo pipefail

# --- bootstrap -------------------------------------------------
# Ensure Ruff is available (avoids “command not found” in GH runner)
python - <<'PY'
import importlib, subprocess, sys
try:
    importlib.import_module("ruff")
except ModuleNotFoundError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet", "ruff==0.4.4"])
PY

# --- Lint & type-check sweep -----------------------------------
echo "🔍  Ruff…"      && ruff check .
echo "🧹  Black…"     && black  --check .
echo "🔠  MyPy…"      && mypy   .

# --- JS/TS workspace lint (optional) ---------------------------
# pnpm dlx eslint . --max-warnings 0
