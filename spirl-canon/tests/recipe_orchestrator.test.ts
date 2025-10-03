import { describe, expect, it } from 'vitest';
import { schedule } from '../apps/portal/src/lib/orchestrator';

const baseRecipe = {
  id: 'phi-demo',
  name: 'Phi Pinch',
  beads: [
    { id: 'b1', moduleId: 'oscillator', inputs: { frequency: 432 } },
    { id: 'b2', moduleId: 'lattice', inputs: { pattern: '1-1-2-3-5' } },
    { id: 'b3', moduleId: 'render', inputs: { quality: 0.8 } },
  ],
};

describe('Recipe orchestrator', () => {
  it('applies φ-pinch scheduling and preserves punch window', () => {
    const scheduled = schedule(baseRecipe);
    expect(scheduled.punchWindow.tStartSec).toBe(616);
    expect(scheduled.punchWindow.tEndSec).toBe(677);
    const times = scheduled.beads.map((bead) => bead.tSec ?? 0);
    const sorted = [...times].sort((a, b) => a - b);
    expect(times).toEqual(sorted);
    expect(times[0]).toBeGreaterThan(470);
    expect(times[times.length - 1]).toBeLessThan(scheduled.punchWindow.tStartSec);
    expect(scheduled.receipt).toContain('α=');
  });
});
