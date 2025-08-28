export function stp(mismatch, kl, tau, dRho, w = { mismatch:1, kl:1, tau:1, dRho:1 }) {
  const m = Math.max(0, mismatch) * w.mismatch;
  const k = Math.max(0, kl) * w.kl;
  const t = Math.abs(tau) * w.tau;
  const d = Math.abs(dRho) * w.dRho;
  return m + k + t + d;
}
