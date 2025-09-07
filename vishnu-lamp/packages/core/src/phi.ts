export const PHI = (1 + Math.sqrt(5)) / 2;

export function beattyFront(k: number): number[] {
  const arr: number[] = [];
  for (let n = 1; n <= k; n++) {
    arr.push(Math.floor(n * PHI));
  }
  return arr;
}

export function beattyBack(k: number): number[] {
  const arr: number[] = [];
  for (let n = 1; n <= k; n++) {
    arr.push(Math.floor(n * PHI * PHI));
  }
  return arr;
}

export function beattySequences(k: number): { A: number[]; B: number[] } {
  return { A: beattyFront(k), B: beattyBack(k) };
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
  const ang = 2 * Math.PI * ((n * PHI) % 1);
  const diff = Math.abs(Math.atan2(Math.sin(ang - theta), Math.cos(ang - theta)));
  return diff <= delta;
}
