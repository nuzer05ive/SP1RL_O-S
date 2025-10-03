import { describe, expect, it } from 'vitest';
import { recipeToPMB } from '../packages/core/src/pmbAssign';
import { serializePMBPayload } from '../apps/portal/src/lib/pmb/encode';
import { decodePMBBytes } from '../apps/portal/src/lib/pmb/decode';

const sampleRecipe = {
  id: 'demo-recipe',
  name: 'Rainbow Prelude',
  beads: [
    { id: 'b1', moduleId: 'oscillator', inputs: { frequency: 432, waveform: 'sine' } },
    { id: 'b2', moduleId: 'lattice', inputs: { stages: 3, pattern: '1-1-2-3-5' } },
  ],
  punchWindow: { tStartSec: 616, tEndSec: 677 },
};

describe('PMB encode/decode', () => {
  it('round-trips a recipe payload through PNG trailer bytes', () => {
    const payload = recipeToPMB(sampleRecipe, 'α=37.5° | ε₃=0.03934→Δ≈7.08° | θ′(κ=1.12)≈8.35×10⁻⁷ rad | φ-tilt=0°');
    const pngBytes = serializePMBPayload(payload);
    const decoded = decodePMBBytes(pngBytes);
    expect(decoded).toEqual(payload);
  });
});
