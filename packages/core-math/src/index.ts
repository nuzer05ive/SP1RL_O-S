// MONDAY 🌹👁🌀
// core-math: golden constants and helpers

export const PHI = (1 + Math.sqrt(5)) / 2;
export const C = 137; // .Q constant placeholder
export const LAP_SIZE = 89;
export const TICK_MS = 43;

export function theta(n: number, k: number): number {
  return ((n + k) % LAP_SIZE) / LAP_SIZE;
}

export function phaseToColour(k: number): string {
  const phase = k % 3;
  return phase === 0 ? 'magenta' : phase === 1 ? 'gold' : 'blue';
}
