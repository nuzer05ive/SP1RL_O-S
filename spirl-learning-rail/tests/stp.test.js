import assert from 'assert';
import { stp } from '../packages/core/src/stp.js';

assert.strictEqual(stp(0,0,0,0), 0);
const base = stp(1,0,0,0);
const higherMismatch = stp(2,0,0,0);
const higherTau = stp(1,0,1,0);
assert(higherMismatch > base);
assert(higherTau > base);
console.log('offline');
