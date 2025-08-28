/**
 * Sarcastic Tension Potential (STP)
 * A toy implementation capturing monotonic trends.
 */
export type STPWeights = { mismatch: number; kl: number; tau: number; dRho: number };

export function stp(
  mismatch: number,
  kl: number,
  tau: number,
  dRho: number,
  w: STPWeights = { mismatch: 1, kl: 1, tau: 1, dRho: 1 }
): number {
  const m = Math.max(0, mismatch) * w.mismatch;
  const k = Math.max(0, kl) * w.kl;
  const t = Math.abs(tau) * w.tau;
  const d = Math.abs(dRho) * w.dRho;
  return m + k + t + d;
}
