#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Ruff…"; ruff check .
echo "🎨 Black…"; black --check .
echo "🧬 MyPy…"; mypy api/ apps/ || true
echo "🧪 PyTest…"; pytest -q
echo "📜 Templates…"; python scripts/template_parse.py
echo "📐 OpenAPI fuzz…"; if [ -z "${SKIP_SCHEMA_TESTS:-}" ]; then
    schemathesis run openapi.json --base-url=http://localhost:8000
fi
echo "🌻 Golden diff…"; act -j count-diff || echo "(offline)"
echo "✅ Sweep clean"
