import { describe, it, expect } from 'vitest';
import { schedule } from '../apps/portal/src/lib/orchestrator';

describe('recipe orchestrator', () => {
  it('schedules beads and preserves punch window', () => {
    const recipe = { id: 'r1', name: 'demo', beads: [
      { id: 'b1', moduleId: 'm1', inputs: {} },
      { id: 'b2', moduleId: 'm2', inputs: {} },
    ] };
    const out = schedule(recipe);
    expect(out.punchWindow.tStartSec).toBe(616);
    expect(out.punchWindow.tEndSec).toBe(677);
    expect(out.beads[0].tSec).toBeLessThan(out.beads[1].tSec);
  });
});
