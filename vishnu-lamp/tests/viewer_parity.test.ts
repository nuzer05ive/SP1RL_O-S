import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { buildFromFold, meshDigest } from '@vishnu/core';
import { hydrateNeutral } from '../apps/viewer/main.js';

describe('viewer parity', () => {
  it('neutral mesh hydrates with parity', () => {
    const fold = { kind: 'cycloid', hinge: 1 } as const;
    const [mesh] = buildFromFold(fold);
    const digestLamp = meshDigest(mesh);
    const geom = hydrateNeutral(mesh);
    const pos = Array.from(geom.getAttribute('position').array);
    expect(pos.length / 3).toBe(8);
    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
    expect(minX).toBeCloseTo(-1);
    expect(maxX).toBeCloseTo(1);
    const meshFromViewer = {
      kind: 'cycloid',
      geom: {
        positions: pos,
        indices: Array.from(geom.getIndex().array),
      },
    };
    const digestViewer = meshDigest(meshFromViewer);
    expect(digestLamp).toBe(digestViewer);
  });
});
