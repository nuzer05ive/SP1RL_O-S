# spirl-storyboard

Minimal tools for TeLL’aLL Sky‑Opera storyboards.  It parses a YAML file,
validates structure, expands cues with heuristic ZCM scores, and can render a
bare‑bones HTML preview.

## Development

```bash
npm install --no-package-lock
npm run build
npm test
```

## CLI

```bash
node dist/index.js lint examples/penguin_mug.yml
node dist/index.js expand examples/penguin_mug.yml out.json
node dist/index.js html examples/penguin_mug.yml out.html
```
