# SPIRL Ghost Build Spec

## Codex Ingest

The Codex ingest pipeline transforms an iN-SeRT payload into a rail map, chapter
text and deterministic UI layout.

```bash
python cli/spirl_ghost.py codex ingest --in fixtures/insert.sample.json --seed 221 --variants 88 --alpha 0.618033 --theta 0.1416 --switcharoo
```
