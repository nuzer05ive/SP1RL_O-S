import { describe, it, expect } from 'vitest';
import { verifyWALDeterminism } from '../packages/core/src/determinism';

const run = process.env.RUN_ONLINE === '1' ? describe : describe.skip;

run('acceptance flow', () => {
  it('WAL is deterministic for identical commits', async () => {
    const chainA = new Uint8Array([1, 2, 3, 4]);
    const chainB = new Uint8Array([1, 2, 3, 4]);
    expect(verifyWALDeterminism(chainA, chainB)).toBe(true);
  });
});
