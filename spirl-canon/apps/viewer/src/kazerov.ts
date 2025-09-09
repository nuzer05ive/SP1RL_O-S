export function deltaEffDeg(eta: number, sigmaDeg: number, N: number): number {
  const base = 6.76;
  return base + (eta - 0.35) * 0.01 + (sigmaDeg - 2.0) * 0.02 + (N - 34) * 0.001;
}
// TODO: derive via energy method
