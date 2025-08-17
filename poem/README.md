# SP1RL‑OS Poem Viewer (Fetch‑from‑File)

**Why this exists:** If prior messages redacted the poem, drop the full, exact text into `/site/poem.txt`. The web page and LaTeX output are generated from that single source of truth.

## Quick Start

```bash
# 1) Serve the site locally
cd site
python3 -m http.server 5173
# Visit http://localhost:5173 and edit poem.txt in the same folder. The page reloads with no cache.

# 2) Build the PDF (requires XeLaTeX)
cd ..
bash tools/build.sh
```

## Stanza Rules
- Separate stanzas with **one blank line** in `poem.txt`.
- Text is used **verbatim**; no spell or punctuation edits.
- Emoji are supported if your fonts handle them.

## Deploy (Netlify)
- Push `/site` as the publish directory, keep `netlify.toml` as provided.
- Ensure `poem.txt` is included; headers force `Cache-Control: no-store`.
