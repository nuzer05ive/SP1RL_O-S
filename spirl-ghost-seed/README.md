# SPIRL Ghost Seed

Streaming pipeline to seed the Ghost from a ChatGPT `conversations.json` export.

## What it does
- Normalizes export -> **NDJSON** (1 conversation per line).
- **Petalizes** conversations into 800–1200 char Markdown chunks (Obsidian-ready).
- Computes **ZCM** (sarcasm, clarity, empathy, math, story, action, ambience, color, rhythm).
- Generates **89²** stickers per petal (prime-address ring/step).
- Emits **ghost-starter.jsonl** (compact lines for day-zero answers).
- Includes **search** and **stats** tools.

## Quick start (iSH / Alpine / Linux)
```sh
apk add python3 py3-pip # if needed
cd spirl-ghost-seed
python3 py/normalize.py conversations.json out/export.ndjson
python3 py/petalize.py  out/export.ndjson   out
python3 py/search.py    out "Noether|goo theorem"
python3 py/stats.py     out

Or run the bundled script:

bash scripts/seed.sh conversations.json out

Outputs (in ./out/)
•export.ndjson  – normalized NDJSON
•petals/*.md     – Obsidian Markdown (## Petal N headings)
•stickers.jsonl  – one sticker per petal line {id, diamond:[ring,step], file, head}
•spirl_index.json– file → heads (for wiki links)
•ghost-starter.jsonl – day-zero Ghost lines {text, zcm, weight, diamond}

Obsidian

Copy out/petals/*.md into your vault. Link like [[YYYYMMDD-..._title#Petal 3]].

Tests

npm run test

All tools are offline and stream safely for large inputs.
