# SP1RL-Q.us Story Synth

**Tagline:** Scan once. Poop patterns. Re-animate forever.

Monorepo containing a minimal implementation of the SP1RL story synthesis
pipeline. It contains a React web UI, an Express API, a Three.js viewer and a
Python worker that performs a tiny "micro-cycloid" scan. Data is persisted as
JSON files under `data/`.

## One-line setup

```bash
npm i -g pnpm && pnpm i
```

## Run

```bash
pnpm --filter ./apps/api dev   # API
pnpm --filter ./apps/web dev   # Web UI
pnpm --filter ./apps/viewer dev || pnpm --filter ./apps/viewer serve # Viewer
python spirl-story-synth/workers/scan/run_worker.py  # optional HTTP worker
```

### Fixtures

Generate a tiny demo video if needed:

```bash
python fixtures/make_sample.py
```

## Verify

```bash
npm test
```

## License

MIT
