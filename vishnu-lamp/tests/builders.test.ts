import { describe, it, expect } from 'vitest';
import { buildFromFold, meshDigest, type BuilderKind } from '@vishnu/core';

describe('builders', () => {
  const kinds: BuilderKind[] = ['cycloid', 'mobius', 'petal_bloom', 'yellow_sack'];
  for (const kind of kinds) {
    it(`${kind} stable digest`, () => {
      const [mesh] = buildFromFold({ kind, hinge: 1 });
      expect(mesh.geom.positions.length).toBeGreaterThan(0);
      const d1 = meshDigest(mesh);
      const d2 = meshDigest(mesh);
      expect(d1).toBe(d2);
      const [mesh2] = buildFromFold({ kind, hinge: 1.1 });
      const d3 = meshDigest(mesh2);
      expect(d3).not.toBe(d1);
    });
  }
});
