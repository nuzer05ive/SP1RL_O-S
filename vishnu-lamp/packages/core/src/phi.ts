export const PHI = (1 + Math.sqrt(5)) / 2;

export function beattySequences(k: number): { A: number[]; B: number[] } {
  const A: number[] = [];
  const B: number[] = [];
  for (let n = 1; n <= k; n++) {
    A.push(Math.floor(n * PHI));
    B.push(Math.floor(n * PHI * PHI));
  }
  return { A, B };
}

export function fractionalParts(n: number): number[] {
  const arr: number[] = [];
  for (let i = 1; i <= n; i++) {
    const frac = (i * PHI) % 1;
    arr.push(frac);
  }
  return arr;
}

export function phiWindow(n: number, theta: number, delta: number): boolean {
  const ang = (2 * Math.PI * ((n * PHI) % 1));
  const diff = Math.abs(Math.atan2(Math.sin(ang - theta), Math.cos(ang - theta)));
  return diff <= delta;
}
