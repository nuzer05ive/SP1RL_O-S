// Minimal global store (no deps). Antonym pairs steer the system.
export type Pair = { key:string; left:string; right:string; w:number }; // w∈[-1,1]
export type AntonymModel = {
  pairs: Pair[];
  zcm: { care:number; courage:number; trust:number }; // live hinge; default ~.55
};
const DEF: AntonymModel = {
  pairs: [
    { key:"playful", left:"playful", right:"solemn", w: +0.20 },
    { key:"novel",   left:"novel",   right:"classic", w: +0.15 },
    { key:"fast",    left:"fast",    right:"thorough", w: +0.10 },
    { key:"bold",    left:"bold",    right:"cautious", w: +0.12 },
    { key:"abstract",left:"abstract",right:"literal",  w: +0.18 },
    { key:"spicy",   left:"spicy",   right:"mild",     w: +0.07 },
    { key:"cheap",   left:"cheap",   right:"premium",  w: -0.05 },
    { key:"open",    left:"open",    right:"closed",   w: +0.25 }
  ],
  zcm: { care:0.55, courage:0.55, trust:0.55 }
};
let state = load() || DEF; const listeners = new Set<() => void>();
function load(){ try{ return JSON.parse(localStorage.getItem("antonyms")||""); }catch{return null;} }
function save(){ localStorage.setItem("antonyms", JSON.stringify(state)); }
export function getAntonyms(){ return state; }
export function setWeight(key:string, w:number){ const p=state.pairs.find(x=>x.key===key); if(p){ p.w=Math.max(-1,Math.min(1,w)); save(); emit(); } }
export function setZCM(z:{care:number;courage:number;trust:number}){ state.zcm=z; save(); emit(); }
export function subscribe(fn:()=>void){ listeners.add(fn); return ()=>listeners.delete(fn); }
function emit(){ for(const f of listeners) f(); }
// Utility: return left/right bias scalar in [−1,+1] dict
export function biasMap(){ const m:Record<string,number>={}; for(const p of state.pairs) m[p.key]=p.w; return m; }
