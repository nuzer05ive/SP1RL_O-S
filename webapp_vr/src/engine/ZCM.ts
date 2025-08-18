export type Pair = { a:number; b:number };
export type ZCMScore = { care:number; courage:number; trust:number; dominance:'care'|'courage'|'trust' };

const clamp = (v:number)=> Math.max(0, Math.min(1, v));
const avg = (arr:number[]) => arr.length? arr.reduce((a,b)=>a+b,0)/arr.length : 0.5;

export function scoreFromPairs(pairs:Pair[]):ZCMScore{
  const care = clamp(avg(pairs.map(p=>p.a)));
  const courage = clamp(avg(pairs.map(p=>p.b)));
  const trust = clamp(1 - Math.abs(care-courage));
  const dominance = care>=courage && care>=trust ? 'care' : courage>=trust ? 'courage' : 'trust';
  return { care, courage, trust, dominance };
}

export function scoreFromTextEmbedding(vec:number[]):ZCMScore{
  const care = clamp(Math.abs(vec[0]??0)%1);
  const courage = clamp(Math.abs(vec[1]??0)%1);
  const trust = clamp(Math.abs(vec[2]??0)%1);
  const dominance = care>=courage && care>=trust ? 'care' : courage>=trust ? 'courage' : 'trust';
  return { care, courage, trust, dominance };
}
