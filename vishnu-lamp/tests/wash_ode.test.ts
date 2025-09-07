import { softmaxPhi, washStep } from '../packages/core/src/washODE';
import { describe, it, expect } from 'vitest';

describe('wash ODE', () => {
  it('softmax sums to 1', () => {
    const r = softmaxPhi([1, 2, 3, 4]);
    const sum = r.reduce((a, b) => a + b, 0);
    expect(Math.abs(sum - 1)).toBeLessThan(1e-6);
  });

  it('volumes non-negative and monotone', () => {
    const V = [1, 1, 1, 1];
    const next = washStep(V, [1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0], 0.1);
    next.forEach((v) => expect(v).toBeGreaterThanOrEqual(0));
    const totalBefore = V.reduce((a, b) => a + b, 0);
    const totalAfter = next.reduce((a, b) => a + b, 0);
    expect(totalAfter).toBeLessThanOrEqual(totalBefore);
  });
});
