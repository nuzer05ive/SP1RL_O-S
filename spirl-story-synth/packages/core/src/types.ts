export type RailParams = {
  A:number; omega:number; phi0:number; x0:number; y0:number; theta_prime:number; nu:number; err?:number;
};
export type Cadence = { in:number; out:number; gap:number; half_gap:number };
export type ApexEvent = { t:number; pos?:[number,number] };
export type BandAngles = [number,number,number];

export type CharacterSoul = "root2"|"tau"|"zeta3"|"pi"|"phi"|"e"|"psi"|"thetaPrime";
export type PrimeAddress = { ring:number; step:number; jitter:number; human:string };

export type CharacterJSON = {
  id:string; name:string; soul:CharacterSoul;
  prime:PrimeAddress;
  traits:{ edgy:number; coherence:number; sarcasm:number; flow:number };
  rail:RailParams;            // canonical cycloid fit (2D)
  telemetry3D?:{ axis:[number,number,number]; depth?:number };
  phiRing:number[];           // 89 histogram
  masks?:Array<{t:number; rle:string}>;
  createdAt:string; updatedAt:string;
};

export type ScanJSON = {
  meta:{ fps:number; width:number; height:number; video:string };
  cadence:Cadence;
  alphas:BandAngles;
  rails:RailParams[];
  apex_times:number[];
  objects:Array<{
    id:string; frames:number[]; trajectory:Array<[number,number,number]>;
    phiRing:number[]; cone_group?:number; apex_hits?:number[];
  }>;
};

export type SceneJSON = {
  id:string; title:string;
  intention:{ vector:[number,number,number]; phiJostle:number; seed:number };
  env:{ ZCM:number; venturiBeta:number; swirl:number; gravity:[number,number,number] };
  bandAngles:BandAngles;
  characters:string[];    // character IDs
  placements:Array<{ id:string; pos:[number,number,number]; rot:[number,number,number]; scale:number }>;
  timeline:Array<{ t:number; action:"enter"|"exit"|"speak"|"attack"|"dance"|"merge"; id?:string; params?:any }>;
  createdAt:string; updatedAt:string;
};
