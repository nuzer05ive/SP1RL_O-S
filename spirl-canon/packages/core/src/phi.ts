export const PHI = 1.618033988749895;
export const TAU = Math.PI * 2;
export const ALPHA_DEG = 37.5;

export const EPS_2WORLD = 0.0444;   // Δ2 = 0.5*360*ε2 = 8.00°
export const EPS_3WORLD = 0.03934;  // Δ3 ≈ 7.09°
export const DELTA_2_DEG = 180 * EPS_2WORLD;
export const DELTA_3_DEG = 180 * EPS_3WORLD;

// Rood wobble ratio used by thetaPrime; exported for receipts/tests.
export const RHO = 0.000437;

export function thetaPrime(kappa = 1.12, rho = RHO) {
  const alphaRad = (ALPHA_DEG * Math.PI) / 180;
  return (kappa * (alphaRad * rho)) / 385; // ≈ 8.3e-7 rad
}

// Golden-angle tilt index in degrees.
export function phiTilt(k: number) {
  return (k * 137.5) % 360;
}
