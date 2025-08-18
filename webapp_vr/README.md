# SP1RL Idea-Mapper (VR)

## Run locally

```bash
cd webapp_vr
npm ci
npm run dev
```

## Overview
- Visualizes ideas along a spiral in VR or 2D.
- Scores Care, Courage, Trust (ZCM) and computes a TEAL hinge.
- Layout jostle uses Δθ = 0.000437 rad per "fire!".
- Spiral addresses encode idea state reversibly.

Deploys on Netlify using the included `netlify.toml`.
