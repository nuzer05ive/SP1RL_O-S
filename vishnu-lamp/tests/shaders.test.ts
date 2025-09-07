import { describe, it, expect } from 'vitest';
import * as skin from '../apps/viewer/shaders/skin.js';
import * as shimmer from '../apps/viewer/shaders/shimmer.js';
import * as yellowSack from '../apps/viewer/shaders/yellowSack.js';

function mockCompile(src: string) {
  if (!/void\s+main/.test(src)) {
    throw new Error('missing main');
  }
}

describe('shaders', () => {
  const list = [skin, shimmer, yellowSack];
  for (const s of list) {
    it(`${s.vertexSource.length} shader`, () => {
      expect(() => mockCompile(s.vertexSource)).not.toThrow();
      expect(() => mockCompile(s.fragmentSource)).not.toThrow();
    });
  }
});
