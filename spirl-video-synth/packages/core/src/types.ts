export type RailParams = {
  A: number; omega: number; phi0: number;
  x0: number; y0: number; theta_prime: number; nu: number;
  err?: number;
};
export type Cadence = { in: number; out: number; gap: number; half_gap: number };
export type ApexEvent = { t: number; pos?: [number,number] };
export type BandAngles = [number, number, number];

export type ScanJson = {
  meta: { fps: number; width: number; height: number; video: string };
  cadence: Cadence;
  alphas: BandAngles;
  rails: RailParams[];
  apex_times: number[];
  cone_groups?: Array<{ ids: number[]; axis: [number,number,number]; telemetry?: any }>;
};
