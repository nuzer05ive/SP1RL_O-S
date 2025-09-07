import { expect, it } from 'vitest';
import { simulateDrift } from '../apps/lamp/src/pages/Witness';

it('drift meter monotone to zero', () => {
  let prev = 1;
  for (let i = 1; i <= 10; i++) {
    const d = simulateDrift(i);
    expect(d).toBeLessThanOrEqual(prev);
    prev = d;
  }
  expect(Math.abs(prev)).toBeLessThan(1e-3);
});
