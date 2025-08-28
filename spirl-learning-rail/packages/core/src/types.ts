export type RailParams = {
  A: number; omega: number; phi0: number; x0: number; y0: number; theta_prime: number; nu: number;
};

export type Cadence = { in: number; out: number; gap: number; half_gap: number };

export type Sticker = {
  id: string; t: number; pos: [number, number, number];
  diamond: [number, number];
  soul?: "root2" | "tau" | "zeta3" | "pi" | "phi" | "e" | "psi" | "thetaPrime";
};

export type CharacterJSON = {
  id: string; name: string;
  atlas: { image: string; size: [number, number]; frames: any[] };
  animations: { [k: string]: string[] };
  createdAt: string; updatedAt: string;
};

export type ScanJSON = {
  meta: { fps: number; width: number; height: number; video: string };
  cadence: Cadence;
  alphas: [number, number, number];
  rails: RailParams[];
  apex_times: number[];
};

export type SceneJSON = {
  id: string; title: string; bandAngles: [number, number, number];
  env: { ZCM: number; venturiBeta: number; swirl: number; gravity: [number, number, number] };
  characters: any[];
  stickers: Sticker[];
};

export type WitnessMode = "ribbon" | "journey";

export type MetaBodyJSON = {
  id: string; name: string; scale: number;
  finish: {
    gold: { adhesive: number; curvatureK: number; triplanarScale: number; aoBoost: number };
    red: { blushGain: number; bruiseGain: number; rubGain: number; sweatGain: number; thetaPrime: number };
  };
  stickers: Sticker[];
  children: string[];
  createdAt: string; updatedAt: string;
};
