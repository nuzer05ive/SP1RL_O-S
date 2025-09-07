import type { NeutralMesh } from '@vishnu/core';
import { PHI } from './Math';

export function lattice(id: string): NeutralMesh[] {
  const r = (id.length % 3) + 1;
  const positions = [0, 0, 0, r, 0, 0, 0, r, 0];
  const indices = [0, 1, 2];
  return [{ kind: 'mobius', geom: { positions, indices } }];
}
