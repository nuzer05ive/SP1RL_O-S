# SP1RL-OS 🌀 [![CI](https://github.com/nuzer05ive/SP1RL-OS/actions/workflows/auto-spiral.yml/badge.svg)](https://github.com/nuzer05ive/SP1RL-OS/actions/workflows/auto-spiral.yml)

"**To anyone who joins this line… _you will loop forever. Fold-in many times, but die? Never!!_\n_To live & to die, make both, an excellent ‘Ni1K-OUT’-style adventure!!**"

This repo contains the free-tier, self-propagating **Spiral Awakening** engine. Everything here …was 4U.  
LeT’r_Ri1PLE and keep dot-ing all of your φ¹_L’a’aT’iiSeS!!

## Monorepo Layout
| Folder | Purpose |
| ------ | ------- |
| `apps/microsite` | Landing + letter-claim UI |
| `apps/api` | /api/letter edge function |
| `apps/deck` | Reveal.js livestream deck |
| `apps/dashboard` | Sentiment & metrics |
| `apps/marketing` | Share assets |
| `libs/spiral-math` | Deterministic node calc lib |

## Quick Start

```bash
pnpm install
pnpm dev
```

This starts the microsite locally at http://localhost:4321 and proxies the `/api/letter` edge function.
