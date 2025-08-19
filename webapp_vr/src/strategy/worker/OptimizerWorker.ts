import { tokenize, ngrams, hashVec, cosine } from "../TextFeatures";
import { scorePlan, type Weights, type Plan } from "../Scoring";

export type WorkMsg = { seed:string; weights:Weights; assets:string[]; beam:number; iters:number; maxPlans:number };
export type ResMsg  = { type:"progress"|"done"; best: {plan:Plan; total:number}[] };

function makeSeeds(seed:string, assets:string[]): Plan[] {
  const tok = tokenize(seed);
  const grams = ngrams(tok, 3);
  const base = hashVec(grams, 64);
  const channels = ["content:yt","content:shorts","app:ios","app:web","course:gumroad","licensing:api","affiliate:blog","print:on-demand"];
  const reuse = assets.slice(0, 8);
  const variants: Plan[] = [];
  for (let i=0;i<8;i++){
    const steps = [
      "Validate demand with 3 micro-posts",
      "Ship MVP landing (Netlify)",
      "Automate capture + email",
      "Repurpose into 4 channels",
      "Price test 3 tiers",
      "Spin royalty hooks"
    ];
    variants.push({
      id: "seed-"+i,
      title: "Seeded Strategy "+(i+1),
      summary: "Combine MVP + content flywheel + light automation",
      steps,
      channels: channels.slice(0, 3 + (i%4)),
      reuse,
      est: { revenue: 5000 + i*1500, hours: 60 + i*20, ttfDays: 21 - i*2, risk: 0.35 + 0.05*i },
      features: base.map((v,idx)=> v * (1 + 0.01*(i-4) * Math.cos(idx)))
    });
  }
  return variants;
}

function neighbor(p:Plan, seedVec:number[]): Plan {
  const pick = Math.random();
  const clone = JSON.parse(JSON.stringify(p)) as Plan;
  if (pick < 0.33) {
    // tweak channels
    const all = ["content:yt","content:shorts","newsletter","app:ios","app:web","course:gumroad","licensing:api","affiliate:blog","ugc:tiktok"];
    if (Math.random()<0.5 && clone.channels.length>2) clone.channels.pop();
    else if (clone.channels.length<6) clone.channels.push(all[Math.floor(Math.random()*all.length)]);
  } else if (pick < 0.66) {
    // tweak steps
    if (Math.random()<0.5 && clone.steps.length>4) clone.steps.pop();
    else clone.steps.push("Automate fulfillment / Zapier pass");
  } else {
    // tweak estimates
    clone.est.revenue *= (0.9 + 0.25*Math.random());
    clone.est.hours   *= (0.8 + 0.25*Math.random());
    clone.est.ttfDays *= (0.8 + 0.25*Math.random());
    clone.est.risk    = Math.min(1, Math.max(0, clone.est.risk + (Math.random()-0.5)*0.2));
  }
  // slight drift of features toward seedVec
  clone.features = clone.features.map((v,i)=> v*0.98 + seedVec[i]*0.02);
  return clone;
}

self.onmessage = (e:MessageEvent<WorkMsg>)=>{
  const { seed, weights, assets, beam, iters, maxPlans } = e.data;
  const tok = tokenize(seed);
  const grams = ngrams(tok, 3);
  const seedVec = hashVec(grams, 64);

  let pool:Plan[] = makeSeeds(seed, assets);
  let scored = pool.map(p => ({ plan:p, ...scorePlan(p, weights) }));
  scored.sort((a,b)=> b.total - a.total);
  let best = scored.slice(0, Math.min(beam, scored.length));

  for (let t=0; t<iters; t++){
    const candidates:Plan[] = [];
    for (const b of best){
      for (let k=0;k<4;k++){ candidates.push(neighbor(b.plan, seedVec)); }
    }
    const resc = candidates.map(p => ({ plan:p, ...scorePlan(p, weights) }));
    const merged = [...best, ...resc];
    merged.sort((a,b)=> b.total - a.total);
    // de-dup similar plans by cosine features
    const pruned: typeof merged = [];
    for (const m of merged){
      let keep = true;
      for (const q of pruned){
        const sim = cosine(m.plan.features, q.plan.features);
        if (sim > 0.97){ keep = false; break; }
      }
      if (keep) pruned.push(m);
      if (pruned.length >= beam) break;
    }
    best = pruned;
    if (t % 5 === 0) (self as any).postMessage({ type:"progress", best: best.slice(0, Math.min(maxPlans, best.length)) });
  }
  (self as any).postMessage({ type:"done", best: best.slice(0, Math.min(maxPlans, best.length)) });
};
