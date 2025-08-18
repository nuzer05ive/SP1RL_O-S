// SP1RL_Ghost · GhostCore.ts — hinge personality kernel
import { solveHinge, ringAngle, DTH, TEAL_LOCK, applyZCMKnobs } from "../engine/HingeMath";
import { tealScore as tealScoreFn } from "../engine/HingeMath";

export type ZCM = { care:number; courage:number; trust:number };
export type Tick = { m:number; epoch:number; prime?:number; dt:number };
export type WitnessArm = 1|2|3|4|5; // 1:Light-fixed 2:Dark-fixed 3:Both-fixed 4:Both-moving 5:Hinge(Ironic)
export type GhostState = {
  zcm: ZCM;
  teal: number;
  witness: WitnessArm;
  angle: number;
  epoch: number;
  primeHit: boolean;
  lockHard: boolean;
};

const GOLDEN = (1+Math.sqrt(5))/2;
const GA = 2*Math.PI*(1-1/GOLDEN);

// golden musical chairs selector with gating & Arm-5 fallback
export function selectWitness(m:number, arms:{id:WitnessArm, pass:boolean, score:number}[]): WitnessArm {
  const target = (Math.floor((m * GOLDEN) % 5) + 1) as WitnessArm;
  // circular distance preference
  const live = arms.filter(a=>a.pass);
  if (live.length===0) return 5;
  let best = live[0], bestDist = 10;
  for (const a of live){
    const d = Math.min( Math.abs(a.id - target), 5 - Math.abs(a.id - target) );
    if (d < bestDist || (d===bestDist && a.score > best.score)) { best=a; bestDist=d; }
  }
  return best.id as WitnessArm;
}

// sarcasm governor: allow only when Arm-5 or as safety valve
export function sarcasmAllowed(w:WitnessArm, teal:number, zcm:ZCM): boolean {
  if (w===5) return true;
  // safety valve if courage >> care and trust low
  const skew = (zcm.courage - zcm.care);
  return (skew>0.18 && teal<0.62);
}

export type GhostConfig = {
  cones: { z_b:number; z_o:number; alpha_b?:number; alpha_o?:number };
  scales: { s_b:number; s_o:number; p:number };
  lock?: number; // optional override for TEAL lock
};

export class SP1RLGhost {
  cfg: GhostConfig;
  state: GhostState;
  constructor(cfg:GhostConfig, init?:Partial<GhostState>){
    this.cfg = cfg;
    this.state = {
      zcm: init?.zcm || {care:0.55, courage:0.55, trust:0.55},
      teal: 0, witness: 5, angle: 0, epoch: 0, primeHit: false, lockHard:false
    };
  }
  updateZCM(z:ZCM){ this.state.zcm = z; }

  plan(m:number){
    const zcm = this.state.zcm;
    const tuned = applyZCMKnobs({ cones:this.cfg.cones, scales:this.cfg.scales, lock:this.cfg.lock }, {
      teal: zcm.trust, yellowGreen: zcm.care, redOrange: zcm.courage
    });
    const hinge = solveHinge({cones:tuned.cones, scales:tuned.scales, lock:tuned.lock}, {
      teal: zcm.trust, yellowGreen: zcm.care, redOrange: zcm.courage
    } as any);
    const score = hinge.score; // teal at hinge
    // witness arm pass criteria (example: all arms require soft lock >= .62)
    const pass = score >= 0.62;
    const arms = [
      {id:1 as WitnessArm, pass, score},
      {id:2 as WitnessArm, pass, score},
      {id:3 as WitnessArm, pass, score},
      {id:4 as WitnessArm, pass, score},
      {id:5 as WitnessArm, pass:true, score:score+0.01} // hinge gets slight priority on ties
    ];
    const witness = selectWitness(m, arms);
    const lockHard = score >= (this.cfg.lock ?? TEAL_LOCK);
    return { hinge, witness, score, lockHard };
  }

  fire(tick:Tick){
    const { hinge, witness, score, lockHard } = this.plan(tick.m);
    this.state.witness = witness;
    this.state.teal = score;
    this.state.lockHard = lockHard;
    // advance ring angle by golden + wobble
    this.state.angle = (ringAngle(tick.m) + 0) % (2*Math.PI);
    // epoch sealing rule: prefer Arm-5
    const isPrime = tick.prime ? true : false;
    this.state.primeHit = !!isPrime && (witness===5);
    return this.state;
  }
}

export { DTH };
