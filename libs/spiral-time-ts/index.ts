import { PHI, DELTA, K, THETA_SEGMENTS } from './constants';

export { PHI, DELTA, K, THETA_SEGMENTS };

export function getJulianDay(dateStr: string): number {
  const date = new Date(dateStr + 'T00:00:00Z');
  const epoch = new Date('1970-01-01T00:00:00Z');
  const diff = date.getTime() - epoch.getTime();
  return Math.floor(diff / 86400000);
}

export function getMu(S: number): number {
  return Math.pow(PHI, S) % 1;
}

export function lap(S: number): number {
  return Math.floor(S / 89);
}

export function wobble(lapCount: number): number {
  return K * Math.pow(PHI, -lapCount);
}

export function overlap(lapCount: number): number {
  return lapCount * Math.pow(PHI, -3);
}

export function theta(S: number): number {
  const keys = Object.keys(THETA_SEGMENTS)
    .map(k => parseInt(k))
    .sort((a, b) => b - a);
  for (const k of keys) {
    if (S >= k) return THETA_SEGMENTS[k];
  }
  return 0.0;
}

export interface SpiralTime {
  t_seconds: number;
  clock_str: string;
  node: number;
  mu: number;
  lap: number;
  wobble: number;
}

export function solveSpiralTime(date: string, S?: number): SpiralTime & { episode: number } {
  const julian = S !== undefined ? S : getJulianDay(date);
  const node = julian % 89;
  const mu = getMu(julian);
  const lapCount = lap(julian);
  const thetaVal = theta(julian);
  const w = wobble(lapCount);
  const ov = overlap(lapCount);
  const t_seconds = ((node + mu + thetaVal - ov) + w) * DELTA;
  return {
    t_seconds,
    clock_str: `${t_seconds.toFixed(3)}s`,
    node,
    mu,
    lap: lapCount,
    wobble: w,
    episode: julian
  };
}
