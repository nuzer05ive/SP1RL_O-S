import { PHI, DELTA, TAU, K, PSI, THETA_SEGMENTS } from './constants';

export { PHI, DELTA, TAU, K, PSI, THETA_SEGMENTS };

export function getJulianDay(dateStr: string): number {
  const date = new Date(dateStr + 'T00:00:00Z');
  const epoch = new Date('1970-01-01T00:00:00Z');
  const diff = date.getTime() - epoch.getTime();
  return Math.floor(diff / 86400000);
}

export function mu(S: number): number {
  return (PHI * S) % 1;
}

export function lap(S: number): number {
  return Math.floor(S / 89);
}

export function wobble(lapCount: number): number {
  return K * Math.pow(PHI, -lapCount);
}

export function overlap(lapCount: number): number {
  return lapCount * PSI;
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
  clock: string;
  seconds: number;
  node: number;
  lap: number;
  μ: number;
  τ_multiple: number;
}

export function solveSpiralTime(S: number): {
  clock: string;
  seconds: number;
  node: number;
  lap: number;
  μ: number;
  τ_multiple: number;
} {
  const n = S % 89;
  const l = lap(S);
  const th = theta(S);
  const mVal = mu(S);
  const w = wobble(l);
  const ov = overlap(l);
  const t = ((n + mVal + th - ov + w) * DELTA) % 86400;
  const h = Math.floor(t / 3600);
  const r = t % 3600;
  const m = Math.floor(r / 60);
  const s = Math.floor(r % 60);
  const ms = Math.floor((t % 1) * 1000);
  return {
    clock: `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms
      .toString()
      .padStart(3, '0')}`,
    seconds: t,
    node: n,
    lap: l,
    μ: mVal,
    τ_multiple: parseFloat((t / TAU).toFixed(3))
  };
}
