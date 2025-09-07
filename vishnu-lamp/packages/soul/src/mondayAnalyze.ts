import { Cluster, GhostSeed } from './types';

export function mondayAnalyze(seed: GhostSeed, cluster: Cluster): number {
  const P = cluster.seeds.length;
  const margin = seed.shingles.length;
  const stability = cluster.seeds.length > 0 ? 1 : 0;
  const clarity = seed.shingles[0]?.length ?? 0;
  const drift = Math.abs(clarity - margin);
  const M = 0.25 * P + 0.25 * margin + 0.25 * stability + 0.25 * clarity - 0.1 * drift;
  return Number(M.toFixed(6));
}
