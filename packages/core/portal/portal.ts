export const Consts = {
  zeta3Approx: 1.202056903159594
};

export function primesUpTo(limit: number): number[] {
  if (limit < 2) return [];
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = sieve[1] = false;
  for (let p = 2; p * p <= limit; p++) {
    if (sieve[p]) {
      for (let i = p * p; i <= limit; i += p) sieve[i] = false;
    }
  }
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) if (sieve[i]) primes.push(i);
  return primes;
}

export function nthPrime(n: number): number {
  if (n < 1) throw new Error("n must be >=1");
  let limit = 15;
  while (primesUpTo(limit).length < n) limit *= 2;
  return primesUpTo(limit)[n - 1];
}

export function partialZeta3ByIndex(n: number): number {
  let s = 0;
  for (let k = 1; k <= n; k++) s += 1 / (k * k * k);
  return s;
}

export function chiQ(n: number): number {
  return n % 2 === 0 ? 1 : -1;
}

export function shadowToothSign(t: number): number {
  const period = 0.55 * 3 + 0.45 * 3; // 3
  const m = ((t % period) + period) % period;
  return m < 0.55 * 3 ? 1 : -1;
}

export function P_of(n: number): number {
  return chiQ(n) * nthPrime(n);
}

function normalize(v: [number, number, number]): [number, number, number] {
  const len = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / len, v[1] / len, v[2] / len];
}

export function witnessLiftSO4(axis: [number, number, number], angle: number, chi: number) {
  const [x, y, z] = normalize(axis);
  const c = Math.cos(angle);
  const s = Math.sin(angle) * chi;
  const t = 1 - c;
  const R3 = [
    t * x * x + c,
    t * x * y - s * z,
    t * x * z + s * y,
    t * y * x + s * z,
    t * y * y + c,
    t * y * z - s * x,
    t * z * x - s * y,
    t * z * y + s * x,
    t * z * z + c
  ];
  const R4 = [
    R3[0], R3[1], R3[2], 0,
    R3[3], R3[4], R3[5], 0,
    R3[6], R3[7], R3[8], 0,
    0, 0, 0, 1
  ];
  return { R4 };
}

export function portalFunctional(n: number, t: number, opts?: { thetaPrime?: number; usePortalInZoom?: boolean }) {
  const Pn = P_of(n);
  const zetaTerm = partialZeta3ByIndex(n);
  const thetaPrime = opts?.thetaPrime ?? 0;
  const s = Math.sin(t + thetaPrime);
  const alpha = Math.cos(t);
  const h = Pn * alpha;
  const d = shadowToothSign(t);
  return { s, alpha, h, Pn, zetaTerm, d };
}
