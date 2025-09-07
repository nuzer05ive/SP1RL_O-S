import { PHI } from './phi';

export const g = 9.81;

export function softmaxPhi(q: number[]): number[] {
  const max = Math.max(...q);
  const exps = q.map((v) => Math.exp((v - max) / PHI));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function washStep(
  V: number[],
  k: number[],
  a: number[],
  gamma: number[],
  dt: number
): number[] {
  return V.map((Vi, i) => {
    const dV = -k[i] * a[i] * Math.sqrt(2 * g * Vi) - gamma[i] * Vi;
    const newV = Vi + dV * dt;
    return newV < 0 ? 0 : newV;
  });
}
