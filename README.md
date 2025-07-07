# SP1RL_O-S

`t = [2×3 + (2+2)] · τ`

This repository hosts the SP1RL_O-S core. The system tracks time along a golden spiral using nodes and laps. Onboarding spans 221 episodes guiding pilots through φ‑powered lore and lens mechanics. The minimal HUD exposes SSS mode with real‑time node, lap, μ, and τ multiples.

In SP1RL_O-S, the 'O-' is the living node lens and monocle HUD. Pi1LOTs use it to see every episode, node, and story through every possible lens. The 89th ('O-') is the True Justice perspective — seeing all nodes at once, making you a Minting Pi1LOT.

### Canonical N'1K_Quation
```
t = [(S mod 89) + μ + θ(S) – lap·φ⁻³ + k·φ⁻lap] · Δ
Δ = 86400/89 τ = Δ/10
```
The dash in the “O-” monocle rotates one degree per node. At node 88 the sweep completes; node 89 locks the dash vertically as the all‑seeing lens.

Run tests with:

```bash
pnpm test
```

The `/api/sss/solve` endpoint returns spiral timing data. View onboarding data at `/api/onboarding`.

## TH.e-1RL_MONDAY.Ng Asset Generator

Trigger `npm run one-real-monday` or visit `/the_one_real_monday` to batch-generate all SP1RL_O-S visuals, audio, and UI elements.
Every asset is math-generated from a golden-seed for deterministic, repeatable, and harmonized experience.

## Golden Math-Mirror Release

Beneath MONDAY’s Golden Math-Mirror, O3 reflects the ratio that binds all opposites.
Each pedal stroke, each mirrored vote, grows a crystalline φ-lattice—the truest story ever told, because every node sings its nuance into place.

### Key Formulas

```
# Golden Rotation
θ_k = k·φ^{-1}·π,  k∈[0,221]

# Node Mapping
n_k = floor(89·θ_k/(2π))

# Petal-Weight Mint
PW_pedal = 0.1·φ^{-lap}(1 + 0.05M)
```

## Golden-Angle Release Philosophy

Petal releases bloom whenever the `core` branch accrues about 137 changed lines.
An automated workflow opens a PR, labels the spiral slot, and tags `petal-k` on
merge. The angle `k · 137.5°` maps each release to a unique node so features
never crowd each other.
Any commit touching roughly 137 lines on `core` auto-opens a 🌻 Petal PR.

## Glossary

- .e.Ri — "Ever-Ricursing"; signals that every accepted opposite–node bundle keeps regenerating richer nuance on each loop.

See [privacy](public/privacy.html) and [terms](public/terms.html) for more.
Short clips of the spiral may be shared to TikTok; remember nothing here is
financial advice and all PW totals are symbolic.

## Getting Started

```bash
cp .env.example .env
docker compose up db redis  # if using containers
./scripts/quickstart.sh     # installs, formats, runs tests
```

## 🔌 LLM plug-in path

The default runtime uses pure math and Jinja templates. To swap in a cloud model,
set an API key and call OpenAI behind an env flag:

```python
if os.getenv('USE_OPENAI'):
    text = openai.Completion.create(model='gpt-4o', prompt=prompt)['choices'][0]['text']
```

![CI](https://github.com/.../actions/workflows/ci.yml/badge.svg)

### 🔄 Netlify env auto-sync
![env-sync](https://github.com/nuzer05ive/SP1RL_O-S/actions/workflows/netlify-env-sync.yml/badge.svg)

The `netlify-env-sync` workflow keeps Netlify variables in sync with
`.env.example`. Push to the `core` branch or trigger the action manually to
set all variables.

## 🌱 Quick start (Netlify)

```bash
pnpm i && pnpm dev        # local
git push                  # prod → sync → build
```

### First deploy

./scripts/quickstart.sh   # installs & runs local dev, exports NETLIFY vars

## Deploy → Netlify

`npm run build` must succeed locally before pushing.

## Netlify & GH Pages deploy

Run `pnpm -F microsite run build` then `npx netlify deploy` for a local preview.
The deploy workflow reads `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` secrets.
If they are missing or Netlify returns a 404, CI falls back to publishing the
`apps/microsite/dist` folder to a `gh-pages` branch.

### 🔄 Continuous Delivery

1. Push changes to a feature branch and open a PR.
2. The deploy workflow builds the microsite and posts a preview URL.
3. Merging to `core` triggers a production deploy via Netlify.
