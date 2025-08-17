SP1RL Deploy Portal
-------------------
What it does:
  • Hot‑swap a module live (no reload) using Blob URLs.
  • Persist overrides via Service Worker cache (survives navigation).
  • Export a ZIP (manifest + modules) for manual Netlify upload.
  • Optional: deploy to Netlify if you paste a personal access token + siteId.

How to open:
  • Go to: /SP1RL_O-S-core/codex/_registry/deploy/portal.html
  • Or use the “Registry” button inside Captain Mints.

Netlify (optional):
  • Token scope: Sites: Deploys (create)
  • Site ID: find in Site settings → Site information
  • If API is blocked by CORS, use “Export ZIP” and drag‑drop to Netlify.
