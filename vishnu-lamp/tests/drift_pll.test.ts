import { simulatePLL } from '../packages/core/src/pll';
import { describe, it, expect } from 'vitest';

describe('PLL drift', () => {
  it('drift sum bounded', () => {
    for (let k = 1.1; k <= 1.14; k += 0.01) {
      const drift = simulatePLL(Number(k.toFixed(2)), 10000);
      expect(Math.abs(drift)).toBeLessThan(1e-4);
    }
  });
});
