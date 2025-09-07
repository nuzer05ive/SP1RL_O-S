import { createHash } from 'crypto';

export function phiBackdoor(value: number): number {
  return value * 0.61803398875;
}

export function scoreHat(name: string): number {
  const hash = createHash('sha256').update(name).digest('hex');
  const n = parseInt(hash.slice(0, 8), 16);
  return (n % 1000) / 1000;
}
