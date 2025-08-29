#!/usr/bin/env bash
set -euo pipefail
JSON="${1:-conversations.json}"
OUT="${2:-out}"
mkdir -p "$OUT"
echo "== normalize -> NDJSON =="
python3 py/normalize.py "$JSON" "$OUT/export.ndjson"
echo "== petalize -> MD, stickers, ghost-starter =="
python3 py/petalize.py "$OUT/export.ndjson" "$OUT"
echo "== stats =="
python3 py/stats.py "$OUT" || true
echo "Done. See $OUT/"
