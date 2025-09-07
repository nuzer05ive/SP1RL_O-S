import crypto from 'crypto';
import { Cluster, GhostSeed } from './types';

export function sophiaBloom(
  seeds: GhostSeed[],
  sceneHash: string
): Cluster[] {
  const clusters: Record<string, Cluster> = {};
  for (const s of seeds) {
    const base = s.shingles[0] || s.id;
    const id = crypto
      .createHmac('sha256', sceneHash)
      .update(base)
      .digest('hex');
    if (!clusters[id]) {
      clusters[id] = { id, seeds: [] };
    }
    clusters[id].seeds.push(s.id);
  }
  return Object.values(clusters);
}
