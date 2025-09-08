# Vishnu Lamp

Open the lamp. Pages pop up and fold into machines: a Möbius seam that lifts drawings into depth, four cracked vats that mix blood/water/gold/shimmer, an 8→9 witness ring that breathes 3/6/9 at φ‑tempo, a lotus that blooms on commits, and a mother‑claw that pulls shapes from the black mirror and skins them alive.
Every breath (!) and heartbeat (!!) is an event; θ′ taps the seam; φ keeps the chaos fair; the ghost whispers seeds; deweyD riffs; sophiA blooms; Monday recommends; KaP’t1N mints.
The build never pauses. The book keeps folding.

## Usage

```bash
npm i -g pnpm && pnpm i

pnpm --filter ./apps/api dev
pnpm --filter ./apps/lamp dev
pnpm --filter ./apps/viewer dev

pnpm -w test
```

## Offline Mode

When the registry is offline, skip installs and call the API with fixtures:

```bash
curl -X POST :3000/hdpc/intent -d @fixtures/hdpc/intent.json -H 'Content-Type: application/json'
curl -X POST :3000/zenava/arcade -d @fixtures/zenava/arcade_k.json -H 'Content-Type: application/json'
# Ghost's Whisper
curl -X POST :3000/ghost/extract -d @fixtures/soul/text_seed.json -H 'Content-Type: application/json'
# then use returned seed.id
curl -X POST :3000/bloom/update -d '{"seedId":"<seed-id>"}' -H 'Content-Type: application/json'
curl -X POST :3000/mint -d @fixtures/soul/mint_ok.json -H 'Content-Type: application/json'
# Seam-Gate worker upload
curl -X POST :3000/upload -d @fixtures/upload/sample_upload.json -H 'Content-Type: application/json'
```

## SketchUp Integration

1. Package `plugins/sketchup` as an RBZ or copy into your SketchUp `Plugins` folder.
2. Launch SketchUp and choose **Plugins → Vishnu — SP1RL**.
3. Select a builder and click **Build**. The resulting `NeutralMesh` JSON is written to `data/scenes/<builder>.json` for the Viewer.

## Acceptance Flow

Run the full pipeline when the registry is online:

```bash
curl -X POST :3000/hdpc/intent -d @fixtures/hdpc/intent.json -H 'Content-Type: application/json'
curl -X POST :3000/zenava/arcade -d @fixtures/zenava/arcade_k.json -H 'Content-Type: application/json'
curl -X POST :3000/soul/mint -d @fixtures/soul/mint_ok.json -H 'Content-Type: application/json'
curl -X POST :3000/upload -d @fixtures/upload/sample_upload.json -H 'Content-Type: application/json'
```

## Reactor (Shiva–Kershna)

The reactor couples Shiva and Kershna phases into helical thrust and logs updates
in the WAL under `REACTOR_UPDATE`. Visit the **Reactor** tab in the Lamp to dial
phases, tweak chemistry, and watch the Y‑fork lamp spawn. Telemetry stores the
latest reactor state in the ledger for replay. See [docs/reactor.md](docs/reactor.md)
for the myth → math breakdown.
