import { PHI } from '../packages/core/src/phi';
import { describe, it, expect } from 'vitest';

describe('harness', () => {
  it('phi constant', () => {
    expect(PHI).toBeGreaterThan(1.6);
  });
});
