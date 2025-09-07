import { createHash } from 'crypto';
import type { FoldSpec } from './types';

export type BuilderKind =
  | 'cycloid'
  | 'mobius'
  | 'petal_bloom'
  | 'yellow_sack';

export interface NeutralGeom {
  positions: number[];
  indices: number[];
  uvs?: number[];
}

export interface NeutralMesh {
  kind: BuilderKind;
  geom: NeutralGeom;
}

export function buildFromFold(
  fold: FoldSpec & { kind: BuilderKind }
): NeutralMesh[] {
  const { hinge = 1, slider = 0, kind } = fold;
  const segments = 8;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const r = hinge;
    positions.push(r * Math.cos(t), r * Math.sin(t), slider);
    indices.push(i, (i + 1) % segments);
  }
  return [{ kind, geom: { positions, indices } }];
}

export function meshDigest(mesh: NeutralMesh): string {
  const hash = createHash('sha256');
  const json = JSON.stringify(mesh.geom);
  hash.update(json);
  return hash.digest('hex');
}
