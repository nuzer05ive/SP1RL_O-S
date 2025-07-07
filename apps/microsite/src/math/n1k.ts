import { PHI, LAP_SIZE } from '@sp1rl/core-math';

export function theta(n: number): number {
  return (n % LAP_SIZE) / LAP_SIZE;
}

export function lap(n: number): number {
  return Math.floor(n / LAP_SIZE);
}

export function kaleidoFrame(n: number): [number, number] {
  const t = theta(n);
  const l = lap(n);
  const hue = Math.floor(t * 360);
  const offset = Math.floor(n * PHI) + l;
  return [hue, offset];
}
