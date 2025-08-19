// φ‑math helpers: ZCM, TEAL, wobble → “math receipts”
export function tealScore(rb:number, ro:number){ return 1 - Math.abs(rb-ro)/(rb+ro+1e-9); } // 0..1
export function zcmScore(z:{care:number;courage:number;trust:number}){
  // closeness to .55 hinge (5∥5 duality)
  const d = Math.sqrt((z.care-.55)**2 + (z.courage-.55)**2 + (z.trust-.55)**2);
  return Math.max(0, 1 - d/0.8);
}
export const WOBBLE = 0.000437;
export function phiAngle(k:number){ const GOLDEN=(1+Math.sqrt(5))/2; return k*(2*Math.PI*(1-1/GOLDEN) + WOBBLE); }
export function receipt(label:string, obj:any){ return { label, math: JSON.parse(JSON.stringify(obj)) }; }
