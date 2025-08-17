#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 tools/poem2tex.py
cd latex
xelatex -interaction=nonstopmode poem.tex
