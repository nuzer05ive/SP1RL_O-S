// Multi-objective scoring (all 0..1 where higher is better, except risk)
export type Weights = {
  profit:number; effort:number; ttf:number; risk:number; leverage:number; harmony:number;
};
export type Scores = {
  profit:number; effort:number; ttf:number; risk:number; leverage:number; harmony:number;
};
export type Plan = {
  id:string; title:string; summary:string;
  steps:string[]; channels:string[]; reuse:string[];
  est:{ revenue:number; hours:number; ttfDays:number; risk:number };
  features:number[];           // embedding-ish vector
  notes?:string;
};
export function normalize(v:number, lo:number, hi:number){ return Math.max(0, Math.min(1, (v-lo)/(hi-lo+1e-9))); }

export function scorePlan(p:Plan, w:Weights): {scores:Scores; total:number} {
  const profit   = normalize(p.est.revenue,  100, 50000);          // tune windows
  const effort   = 1 - normalize(p.est.hours, 4, 400);
  const ttf      = 1 - normalize(p.est.ttfDays, 1, 180);
  const risk     = 1 - Math.max(0, Math.min(1, p.est.risk));       // risk lower is better
  const leverage = Math.min(1, p.reuse.length / 8);                 // more reuse → higher leverage
  const harmony  = estimateHarmony(p);                              // TEAL-ish proxy 0..1
  const scores:Scores = { profit, effort, ttf, risk, leverage, harmony };
  const total = (w.profit*profit + w.effort*effort + w.ttf*ttf + w.risk*risk + w.leverage*leverage + w.harmony*harmony) /
                (w.profit + w.effort + w.ttf + w.risk + w.leverage + w.harmony + 1e-9);
  return { scores, total };
}

// Cheap proxy for harmony: balanced channels + modest step fan-out + diversified reuse
function estimateHarmony(p:Plan): number {
  const ch = new Set(p.channels.map(s => s.split(":")[0]));
  const balance = Math.min(1, ch.size/4);
  const stepPenalty = Math.max(0, 1 - (Math.max(0, p.steps.length - 7)/7));
  const reuseSpread = Math.min(1, p.reuse.length/6);
  return 0.4*balance + 0.35*stepPenalty + 0.25*reuseSpread;
}
