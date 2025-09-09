import { describe, it, expect } from 'vitest';
import { deltaEffDeg } from '../apps/viewer/src/kazerov';

const ONLINE = process.env.RUN_ONLINE === '1';
(ONLINE ? describe : describe.skip)('kazerov delta eff', () => {
  it('approx 6.76', () => {
    const d = deltaEffDeg(0.35, 2.0, 34);
    expect(d).toBeGreaterThan(6.61);
    expect(d).toBeLessThan(6.91);
  });
});
