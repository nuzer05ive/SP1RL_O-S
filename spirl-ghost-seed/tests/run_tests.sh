#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf out && mkdir -p out
python3 py/normalize.py tests/sample_conversations.json out/export.ndjson
python3 py/petalize.py  out/export.ndjson out
python3 py/stats.py     out

# simple assertions
[ -s out/export.ndjson ] || (echo "NDJSON missing" && exit 1)
[ -s out/ghost-starter.jsonl ] || (echo "ghost starter missing" && exit 1)
[ -s out/stickers.jsonl ] || (echo "stickers missing" && exit 1)
echo "OK"
