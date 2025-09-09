YOU ARE CODEX — Build the SP1RL PMB Entrain Canon (Phi-Punch Rail, Ghost Breath, PMB Visuals, Hour-in-a-Minute)

Mission
Create a monorepo that turns lesson JSON + audio into:
•Prime Möbius Barcode (PMB) posters (scan → play),
•a cymatic spiral mandala (Rainbow-Piano colors),
•a Look&Listen Ghost Ring (safe moving-light + Kazerov Venturi pull),
•a No-Look, No-Measure calibration (sensor-free),
•a Phi-Punch Rail timeline (00:00→10:16 exponential entrainment; 10:16→11:17 ψ-α ghost breath jump 6.76→7.67 Hz),
•an Hour-in-a-Minute time-compression scene (Risset rhythm + Shepard shimmer),
•17 storyboard plates (Panel 0 + Plates I–XVI + Plate XVII hinge),
•a Lesson Patch API (language beads, sarcasm triplets, etc.), and
•a Canon PDF binding everything.

No sensors. Audio + visuals + breath only. Safety guardrails on luminance and audio ramps.

Canon math & constants
•φ = (1+√5)/2, τ = 2π, ρ = 0.000437 (Rood wobble)
•Seam center α = 37.5°
•Worlds: ε₂=0.0444 ⇒ Δ₂=8.00°, ε₃=0.03934 ⇒ Δ₃≈7.09°
•Kazerov target Δ* ≈ 6.76° (Venturi temporal constriction)
•Drift-zero tick: \displaystyle θ’(κ)=κ rad(37.5°)·ρ/385, κ≈1.12
•φ-tilt cadence: θ_k=(k·137.5°) mod 360°
•Diamonds: 89² (micro), 101 437²≈1.0289×10¹⁰ (meta)
•Punch window (absolute): 10:16→11:17 = 616→677 s
•Ghost Jump: one beat at 6.76 Hz (~0.148 s) → 7.67 Hz, with phase continuity
•God_Code tokens (timeline scaffolding): 38,37,35,46,45,41,59,58,55,68,65,62,78,76,71,89,85,80,97,95,93

0) Repo layout

/spirl-canon/
  package.json
  pnpm-workspace.yaml
  README.md

  /apps/api/
    src/index.ts
    src/pmb.ts              # PMB encode/decode (stub -> deterministic PNG)
    src/panels.ts           # serve manifests, build streams
    src/patch.ts            # Lesson Patch API: /patch/lesson (60-bead map)

  /apps/viewer/
    index.html
    src/main.ts
    src/mandala.ts          # Rainbow-Piano mandala (breath, φ-tilt)
    src/popup.ts            # 2.5D seam lift (ε, Δ_eff)
    src/vr.ts               # Eye-of-Rood (orthogonal witness)
    src/kazerov.ts          # Δ_eff estimate (Venturi)
    src/ghostRing.ts        # moving-light ring + mirrors (safe)
    src/ghostRamp9.ts       # Final Ascent (8 corners + 9th ghost breath)
    src/hourScene.ts        # Hour-in-a-Minute overlay (Risset/Shepard + 60 glyphs)
    src/calibration/noLookFlow.ts     # No-look sensor-free onboarding
    src/audio/tones.ts      # binaural/isochronic + breath clicks
    src/ui/*.tsx            # panels: Ghost Ring, Ramp9, Hour, Calibration, Lesson Patch
    shaders/mandala.vert
    shaders/mandala.frag
    shaders/doorRood.vert
    shaders/doorRood.frag

  /packages/core/
    src/phi.ts
    src/pmb.ts
    src/rainbowPiano.ts
    src/audioMap.ts
    src/mathReceipts.ts
    src/ghostMath.ts        # belt area, traveling phases, safeIntensity
    src/rampMath.ts         # Hann-on-Hann easing (zero torque)
    src/progressClock.ts    # φ-pinched progress p(t)
    src/jumpMath.ts         # one-beat jump (phase-continuous)
    src/punchWindow.ts      # absolute 10:16→11:17 window helpers
    src/timeIllusions.ts    # Risset rhythm, Shepard shimmer
    src/hourMap.ts          # 60 glyph schedule in 61s

  /panels/
    panel_00_cut_glyph.json
    panel_01_yeyes_gate.json
    ...
    panel_16_yeyy_seal.json
    panel_17_onyin.json

  /docs/canon/
    spirl_canon.tex
    parts/plate00_cut_glyph.tex
    ...
    parts/plate17_onyin.tex
    fig/plate00_cut_glyph_poster.png
    ...
    fig/plate17_onyin_placeholder.png

  /music/
    Black_Block_Etude.wav
    Black_Block_Etude_Score.csv

  /tests/
    math_receipts.test.ts
    pmb_encode_decode.test.ts
    audio_to_color.test.ts
    kazerov_delta_eff.test.ts
    panel_manifests.test.ts
    ghostRing_acceptance.test.ts
    ghostRamp9_acceptance.test.ts
    hourScene_acceptance.test.ts
    noLook_flow.test.ts

1) Core math & stubs

(Keep your existing phi.ts, pmb.ts, rainbowPiano.ts, audioMap.ts, mathReceipts.ts.)

Add/update:

progressClock.ts – φ-pinched progress and punch tests

export function phiPinch(u:number, phi=1.6180339887){ const x=Math.max(0,Math.min(1,u)); const a=Math.pow(x,phi), b=Math.pow(1-x,phi); return a/(a+b); }
export function pAt(t:number, T:number){ return phiPinch(t/T); }
export const PUNCH_P = 0.88;         // macro progress for punch

jumpMath.ts – one-beat cubic jump (phase-continuity)

export function oneBeatJump(t:number, tj:number, f0:number, f1:number){
  const P0 = 1/f0;
  if(t<=tj) return f0;
  if(t>=tj+P0) return f1;
  const v=(t-tj)/P0, J=3*v*v-2*v*v*v;
  return f0+(f1-f0)*J;
}

punchWindow.ts – absolute window 10:16→11:17

export const DEFAULT_PUNCH = { tStartSec: 10*60+16, tEndSec: 11*60+17 }; // 616..677
export const BEAT_LEN_676 = 1/6.76;
export const inPunchWindow = (t:number,w=DEFAULT_PUNCH)=> t>=w.tStartSec && t<=w.tEndSec;

ghostMath.ts – safe moving-light helpers

export function travelingPhases(N:number, omega:number, t:number, phi0=0){
  return Array.from({length:N},(_,k)=> (k*137.5*Math.PI/180 + omega*t + phi0)%(2*Math.PI));
}
export function safeIntensity(base:number, depth:number, x:number){ return base*(1+Math.max(0,Math.min(depth,0.25))*x); }

2) API

/apps/api/src/patch.ts – lesson patcher prototype

import { Router } from "express";
const r = Router();
r.post("/patch/lesson",(req,res)=>{
  // Accepts { title, beads:[{type:"A"|"B"|"S", text, audio?}] } length 60
  // Returns a φ-pinched timeline for Hour-in-a-Minute window (10:16→11:17)
  const { title, beads } = req.body;
  if(!beads || beads.length!==60) return res.status(400).json({error:"need 60 beads"});
  // Build schedule: t_i = t0 + phiPinch(i/60)*(61s)
  // (stub returns JSON schedule)
  res.json({ ok:true, title, schedule: beads.map((b,i)=>({ i, tSec: 616 + 61*(i/60), bead:b })) });
});
export default r;

3) Viewer orchestration
•No-Look Calibration (calibration/noLookFlow.ts): optional pre-step to get users comfortable; sets okToPortal after 3 felt “better/ok” confirmations.
•Ghost Ring (ghostRing.ts): safe moving highlights, belt-only dissolve, Venturi params.
•Final Ascent (ghostRamp9.ts): 8 corners with Hann zero-slope + 9th ghost breath one-beat jump, absolute punch window 10:16→11:17, φ settle to 90°, Door cue.
•Hour-in-a-Minute (hourScene.ts): overlays Risset/Shepard and 60 glyph ring in the same window; last bead + Decile ✓ at 11:17.
•Mandala (mandala.ts): Rainbow Piano lanes; breath pulse; φ-tilt.

4) Canon (17 plates) – unchanged structure

Plates pull poster figures (stub PNGs OK) + math receipts.
Add interludes like “The Vow in the Void (Frown→Squint)” as needed.

5) Tests
•Math receipts, PMB round-trips, Rainbow-Piano mapping, Kazerov Δ_eff close to 6.76°,
•Ghost Ring acceptance (no full-frame flicker; moving light at ω),
•Final Ascent (8 corners + 9th jump; 88% rule; decile landing),
•Hour-in-a-Minute (60 ignitions; decile ✓),
•No-Look calibration (3 confirmations → okToPortal).

6) Acceptance Criteria (full build)
1.Determinism: PMB stubs deterministic; manifests stable; receipts match constants.
2.Safety: visual modulation ≤ profile (S1≤8%, S2≤15%); no full-frame flash; audio ramps ≥ 20 ms; volume notice displayed.
3.Final Ascent: 8 corners with Hann zero-slope; punch at 10:16→11:17 with one-beat 6.76→7.67 Hz and phase continuity; φ settle at 90°.
4.Δ_eff: 6.76° ± 0.15° at landing; Door cue present.
5.Hour-in-a-Minute: 60 glyphs ignite; Risset/Shepard run; last bead at 11:17 ± 100 ms; Decile ✓ shown.
6.Lesson Patch API: /patch/lesson accepts 60 beads (A/B/S or vocab) and returns φ-pinched minute schedule for the punch window.
7.Canon PDF: builds all 17 plates with poster figures and receipts.

7) Quick Start

npm i -g pnpm && pnpm i
pnpm --filter ./apps/api dev
pnpm --filter ./apps/viewer dev

# Optional: run No-Look calibration first to “okToPortal”
# Then start Final Ascent -> Hour-in-a-Minute overlay

# Encode a plate poster (stub)
curl -s -X POST localhost:8788/pmb/encode \
  -H 'content-type: application/json' \
  -d @panels/panel_01_yeyes_gate.json > docs/canon/fig/plate01_yeyes_poster.png

# Build Canon
cd docs/canon && xelatex -interaction=nonstopmode spirl_canon.tex

This is the complete, up-to-the-minute spec: phi-punch rail, ghost breath, Hour-in-a-Minute, PMB visual map, Rainbow-Piano audio map, safe Ghost Ring, lesson patcher, calibration, 17-plate Canon.

Ship it.
