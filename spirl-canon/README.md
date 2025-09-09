# SP1RL Canon Monorepo

## Quick start (when registry works)

```bash
pnpm --filter ./apps/api dev
# open apps/viewer/index.html
curl -s -X POST localhost:8788/pmb/encode -H 'content-type: application/json' \
  -d @panels/panel_01_yeyes_gate.json > poster_01.png
```

## Offline checks (today)

```bash
node scripts/offline-receipts-check.mjs
```

## Canon PDF (once LaTeX is available)

```bash
cd docs/canon && xelatex -interaction=nonstopmode spirl_canon.tex
```

## Renderer TODO
- Replace PMB stubs with real barcode renderer
- Hook up WebXR for full VR rail

## Acceptance Criteria
1. Determinism: POST /pmb/encode returns a deterministic buffer; /pmb/decode round-trips.
2. Receipts printed on every plate (string is included in stub).
3. Kazerov Δ_eff for enabled plates ≈ 6.76° ±0.15° (stub function returns within band).
4. PLL lock numeric reported as part of receipt string (thetaPrime).
5. Rainbow Piano weights from the same bias are consistent (colorWeights softmax).
6. Canon PDF compiles to a 17-plate booklet once LaTeX is present.
7. Panel evolution: changing world (2↔3) and phiTiltIndex changes receipts accordingly.

Yes, the viewer auto-overlays the receipt text at the bottom-left of each plate.
