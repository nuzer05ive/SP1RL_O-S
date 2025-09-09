import { describe, it, expect } from 'vitest';
import { pmbEncodeStub, pmbDecodeStub, PMBPayload } from '../packages/core/src/pmb';

const ONLINE = process.env.RUN_ONLINE === '1';
(ONLINE ? describe : describe.skip)('pmb encode/decode', () => {
  it('round trips core fields', () => {
    const payload: PMBPayload = {
      id: 'test', version: 'v1', world: 3, phiTiltIndex: 0,
      alphaDeg: 37.5, epsilon: 0.03934, thetaPrimeKappa: 1.12,
      glyph: { type: 'test', caption: 'Test' }
    };
    const buf = pmbEncodeStub(payload);
    const decoded = pmbDecodeStub(buf);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.world).toBe(payload.world);
    expect(decoded.alphaDeg).toBe(payload.alphaDeg);
  });
});
