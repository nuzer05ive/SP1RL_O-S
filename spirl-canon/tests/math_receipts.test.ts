import { describe, it, expect } from 'vitest';
import { DELTA_2_DEG, DELTA_3_DEG, thetaPrime, phiTilt } from '../packages/core/src';

const ONLINE = process.env.RUN_ONLINE === '1';
(ONLINE ? describe : describe.skip)('math receipts', () => {
  it('delta constants', () => {
    expect(DELTA_2_DEG).toBeCloseTo(8.0, 2);
    expect(DELTA_3_DEG).toBeCloseTo(7.09, 2);
  });
  it('thetaPrime', () => {
    const val = thetaPrime(1.12);
    expect(val).toBeGreaterThanOrEqual(8.0e-7);
    expect(val).toBeLessThanOrEqual(8.7e-7);
  });
  it('phi tilt', () => {
    expect(phiTilt(123)).toBe((123 * 137.5) % 360);
  });
});
