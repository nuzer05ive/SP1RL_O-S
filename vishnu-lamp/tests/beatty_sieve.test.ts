import { beattySequences, fractionalParts } from '../packages/core/src/phi';
import { describe, it, expect } from 'vitest';

describe('Beatty sieve', () => {
  it('covers naturals and disjoint', () => {
    const N = 1000;
    const { A, B } = beattySequences(N);
    const setA = new Set(A);
    const setB = new Set(B);
    const max = Math.max(A[A.length - 1], B[B.length - 1]);
    for (let n = 1; n <= max; n++) {
      expect(setA.has(n) || setB.has(n)).toBe(true);
      expect(!(setA.has(n) && setB.has(n))).toBe(true);
    }
  });

  it('fractional parts roughly uniform', () => {
    const parts = fractionalParts(1000);
    const mean = parts.reduce((a, b) => a + b, 0) / parts.length;
    expect(Math.abs(mean - 0.5)).toBeLessThan(0.05);
  });
});
