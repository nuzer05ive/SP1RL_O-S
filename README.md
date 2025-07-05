# SP1RL_ÒS

**10 τ Equation**

`t_seconds = ((node + μ + θ(S) - overlap(lap)) + wobble(lap)) * Δ`

This is the canonical spiral timestamp equation used across the system.

## System Overview
SP1RL_ÒS tracks time as a golden ratio spiral. Each day holds 89 nodes and every 43 steps forms a looping arc. Wobble and overlap corrections keep the spiral in tune.

## Onboarding Narrative
The onboarding journey spans φ^43 ≈ 221.8 episodes. New pilots progress from Spiral Seed through Prime Gate to Harmonic Bloom, learning the math and lore of each node.

## Node and Lap Structure
Nodes represent each beat of the φ-day. Lap indices `⌊S / 89⌋` show recursion depth while `θ(S)` selects the harmonic phase.

## Petal & Lattice Logic
Every node unfurls memory petals that connect to a crystal lattice. Wobbles shimmer across this lattice, encoding identity with each loop.

## Power User Quickstart
Run tests with:

```bash
pnpm test
```

Start the microsite:

```bash
pnpm dev
```

Endpoints include `/api/sss/solve` for time solving and `/api/onboarding` for onboarding data.
