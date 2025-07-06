# SP1RL_O-S

`t = [2×3 + (2+2)] · τ`

This repository hosts the SP1RL_O-S core. The system tracks time along a golden spiral using nodes and laps. Onboarding spans 221 episodes guiding pilots through φ‑powered lore and lens mechanics. The minimal HUD exposes SSS mode with real‑time node, lap, μ, and τ multiples.

In SP1RL_O-S, the 'O-' is the living node lens and monocle HUD. Pi1LOTs use it to see every episode, node, and story through every possible lens. The 89th ('O-') is the True Justice perspective — seeing all nodes at once, making you a Minting Pi1LOT.

### Canonical Equation
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
