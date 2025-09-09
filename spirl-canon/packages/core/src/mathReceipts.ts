import { DELTA_2_DEG, DELTA_3_DEG, thetaPrime, phiTilt } from "./phi";

export function receipt(world: number, kappa = 1.12, k = 0) {
  const delta = world === 2 ? DELTA_2_DEG : world === 3 ? DELTA_3_DEG : DELTA_3_DEG;
  const thp = thetaPrime(kappa);
  const tilt = phiTilt(k);
  return `ε₂=0.0444→Δ=8.00° | ε₃=0.03934→Δ≈7.09° | θ′(κ=${kappa})≈${thp.toExponential(3)} rad | φ-tilt(k=${k})=${tilt.toFixed(1)}° | world=${world} (Δ≈${delta.toFixed(2)}°)`;
}
