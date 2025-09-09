import { describe, it, expect } from 'vitest';
import { makeTriplets, hinge, eccParity } from '../packages/core/src/las';

describe('LAS triplets', () => {
  it('generates triplets and checks parity', () => {
    const beads = Array.from({length:60}, (_,i)=>({
      type: i<20?'A': i<40?'B':'S',
      text: i>=40? '' : `b${i}`
    }));
    const trips = makeTriplets(beads);
    expect(trips.length).toBe(20);
    const filled = trips.map(t=> t.S && t.S.text ? t : ({...t, S:{...t.S, text: hinge(t.A.text, t.B.text)}}));
    expect(filled.every(tr=>tr.S.text.length>0)).toBe(true);
    expect(filled.every(eccParity)).toBe(true);
  });
});
