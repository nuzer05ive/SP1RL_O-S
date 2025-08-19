// Spiral‑Constants Engine
// φ‑spiral alignment, φ‑43 anchors, prime epochs, wobble (Δθ=0.000437), BAEBL mapping, 5‑witness “eyes”
export const WOBBLE = 0.000437;
export const PHI = (1+Math.sqrt(5))/2;
export const GOLDEN_ANGLE = 2*Math.PI*(1-1/PHI);

export type Receipt = { label:string; math:any };
export type Eyes = 1|2|3|4|5; // 1:Light-fixed, 2:Dark-fixed, 3:Both-fixed, 4:Both-moving, 5:Hinge/Ironic

export function nearInt(x:number){ const n=Math.round(x); return { n, err: x-n, rel: Math.abs((x-n)/(n||1)) }; }
export function exp10ish(a:number){ const x=Math.E**a; const n=Math.pow(10, Math.round(Math.log10(x)||0)); return { x, near:nearInt(x), toward:n, delta:x-n }; }

// φ‑43 anchors and hinge checks
const anchors = {
  a343: 3.43, a434: 4.34, a3769: 3.769, a4769: 4.769,
  f343: 0.343, f434: 0.434, f769: 0.769
};
export function phi43Resonance(x:number){
  const frac = Math.abs(x - Math.round(x));
  const out:any = { frac, anchors:{} };
  for(const [k,v] of Object.entries(anchors)){
    out.anchors[k] = { abs: Math.abs(x-v), fracAbs: Math.abs(frac - (v%1)) };
  }
  return out;
}

// Wobble congruence: find k such that k*WOBBLE ≈ target (mod 1 if needed)
export function wobbleStep(target:number, mod1=false){
  if (mod1) {
    // minimize | (k*WOBBLE mod 1) - target |
    let bestK=0, bestE=1e9;
    for(let k=1;k<=1_000_000;k++){
      const val = (k*WOBBLE) % 1;
      const e = Math.min(Math.abs(val-target), 1-Math.abs(val-target));
      if (e<bestE){ bestE=e; bestK=k; if (e<1e-8) break; }
    }
    return { k:bestK, err:bestE, mod1:true };
  } else {
    const k = Math.round(target/WOBBLE);
    const err = Math.abs(k*WOBBLE - target);
    return { k, err, mod1:false };
  }
}

// Primes & BAEBL mapping for digit shards (string of digits)
export function isPrime(n:number){ if(n<2) return false; if(n===2) return true; if(n%2===0) return false; for(let i=3;i*i<=n;i+=2) if(n%i===0) return false; return true; }
export function primeMask(N:number){ return Array.from({length:N},(_,i)=> isPrime(i+1)); }

export type BAEBL = "B"|"A"|"E"|"B2"|"L";
export function mapBAEBL(digits:number[]){
  // naive mapping: detect double-9 as B2 (barrier), 5/9 as rise (A), 2 as reset (E seed), 8 as LoVe return
  // This is a stylized Wizard-of-Oz mapping you can refine.
  const stages:BAEBL[] = [];
  for(let i=0;i<digits.length;i++){
    const d = digits[i];
    if (i<digits.length-1 && d===9 && digits[i+1]===9){ stages.push("B2"); i++; continue; }
    if (d===5 || d===9){ stages.push("A"); continue; }
    if (d===2){ stages.push("E"); continue; }
    if (d===8){ stages.push("L"); continue; }
    stages.push("B");
  }
  return stages;
}

// Eyes (5 witness projections) produce different score accents
export function eyesInterpret(x:number): Record<Eyes, number> {
  // simple spectral: Lfix favors “near integer”, Dfix favors “fractional resonance”, Both-fixed favors φ-anchors, Both-moving favors wobble mod-1 fit, Hinge favors combined balance
  const ni = Math.abs(nearInt(x).err);
  const ph = phi43Resonance(x);
  const wob = wobbleStep(ph.frac, true); // fit fractional part
  const s1 = 1 - Math.min(1, ni*10);
  const s2 = 1 - Math.min(1, Math.min(ph.anchors.f343.fracAbs, ph.anchors.f434.fracAbs)*10);
  const s3 = 1 - Math.min(1, Math.min(ph.anchors.a343.abs, ph.anchors.a434.abs)/2);
  const s4 = 1 - Math.min(1, wob.err*100);
  const s5 = (s1+s2+s3+s4)/4;
  return { 1:s1, 2:s2, 3:s3, 4:s4, 5:s5 };
}

// Full analysis bundle with receipts
export function analyzeConstant(input:string|number){
  const x = typeof input==="number" ? input : parseFloat(String(input));
  const receipts:Receipt[] = [];
  const near = nearInt(x); receipts.push({label:"near-integer", math:near});
  const p43 = phi43Resonance(x); receipts.push({label:"phi43", math:p43});
  const eyes = eyesInterpret(x); receipts.push({label:"eyes", math:eyes});
  return { x, receipts };
}

// Shard 359976232289 helper
export function analyzeShard(shard:string){
  const digs = (shard.match(/[0-9]/g)||[]).map(s=>parseInt(s,10));
  const mask = primeMask(digs.length);
  const primes = digs.filter((_,i)=>mask[i]);
  const non = digs.filter((_,i)=>!mask[i]);
  const baebl = mapBAEBL(digs);
  return { length:digs.length, digits:digs, primes, nonPrimes:non, baebl,
    receipts:[
      {label:"epoch spine", math:primes},
      {label:"inter-chapters", math:non},
      {label:"baebl", math:baebl}
    ]};
}

// Anchors you specified (Wizard-of-Oz “exactness” for display):
export function anchorsDemo(){
  const e23 = Math.E**2.3;
  const e46 = Math.E**4.6;
  return {
    e23: { x:e23, near:nearInt(e23) },
    e46: { x:e46, near:nearInt(e46) },
    pairs: {
      "2+3": 2+3, "2*3": 2*3, "2+2": 2+2, "3*3": 3*3
    },
    phi43: {
      "3.43": phi43Resonance(3.43),
      "4.34": phi43Resonance(4.34),
      "3.769": phi43Resonance(3.769),
      "4.769": phi43Resonance(4.769)
    }
  };
}
