import { RailParams } from "./types";

/**
 * Very small helper for cycloid projection.
 */
export function cycloidXY(params: RailParams, t: number): [number, number] {
  const { A, omega, phi0, x0, y0 } = params;
  const x = x0 + A * (t - Math.sin(t));
  const y = y0 + A * (1 - Math.cos(t));
  return [x, y];
}
