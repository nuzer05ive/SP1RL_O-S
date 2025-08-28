import { RailParams } from "./types";

export function cycloidXY(p:RailParams, t:number):[number,number] {
  const phi = p.omega * t + p.phi0 + p.theta_prime * Math.sin(p.nu * t);
  const x = p.A * (phi - Math.sin(phi)) + p.x0;
  const y = p.A * (1 - Math.cos(phi)) + p.y0;
  return [x, y];
}
