import { describe, it, expect } from 'vitest';
import { planPhiScore, scheduleScore } from '../packages/core/src/phiScore';

describe('phi score', () => {
  it('punch and seal timings', () => {
    const plan = planPhiScore(0);
    expect(plan.punchStart).toBe(616);
    expect(plan.punchEnd).toBe(677);
    const events = scheduleScore(plan);
    const punch = events.find(e=>e.kind==='punch');
    const seal = events.find(e=>e.kind==='seal');
    expect(punch?.t).toBe(plan.punchStart);
    expect(seal?.t).toBe(plan.punchEnd-2);
  });
});
