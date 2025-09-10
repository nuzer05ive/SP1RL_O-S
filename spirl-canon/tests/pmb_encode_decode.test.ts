import { describe, it, expect } from 'vitest';
import { recipeToPMB } from '../packages/core/src/pmbAssign';
import { mathReceipt } from '../packages/core/src/receipts';
import { encodePMB } from '../apps/portal/src/lib/pmb/encode';
import { decodePMB } from '../apps/portal/src/lib/pmb/decode';

describe('pmb encode/decode', () => {
  it('round trips payload', () => {
    const recipe = { id: 'r1', name: 'demo', beads: [], punchWindow: { tStartSec: 616, tEndSec: 677 } };
    const payload = recipeToPMB(recipe, mathReceipt());
    const buf = encodePMB(payload);
    const decoded = decodePMB(buf);
    expect(decoded).toEqual(payload);
  });
});
