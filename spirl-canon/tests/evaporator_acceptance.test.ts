import { describe, it, expect } from 'vitest';
import { evaporate } from '../packages/core/src/cycloid';

describe('cycloidal evaporator', () => {
  it('compRatio decreases and floors', () => {
    const signal = [0.1,0.2,0.3,0.2,0.1];
    let prev = Infinity;
    for(let k=1;k<=5;k++){
      const { compRatio } = evaporate(signal, k);
      expect(compRatio).toBeLessThan(prev);
      prev = compRatio;
    }
    const floor1 = evaporate(signal,100).compRatio;
    const floor2 = evaporate(signal,101).compRatio;
    expect(Math.abs(floor1-floor2)).toBeLessThan(0.001);
  });
});
