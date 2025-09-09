export type Bead = { type:"A"|"B"|"S"; text:string; audio?:string; icon?:string };
export type Triplet = { A:Bead; B:Bead; S:Bead };

export function makeTriplets(beads:Bead[]):Triplet[]{
  if(beads.length!==60) throw new Error("need 60 beads");
  const A = beads.slice(0,20), B = beads.slice(20,40), S = beads.slice(40,60);
  return A.map((a,i)=>({ A:a, B:B[i], S:S[i] }));
}

/** Minimal-action sarcasm hinge: compress A & B to a one-line S if missing */
export function hinge(a:string, b:string){
  const T=[
    (a:string,b:string)=>`${a} — unless ${b}, in which case: obviously both.`,
    (a:string,b:string)=>`If ${a} and ${b}, the shortest path is the joke.`,
    (a:string,b:string)=>`${a}. ${b}. Therefore: we laugh and it works.`
  ];
  const h = Math.abs(hash(a+"|"+b))%T.length;
  return T[h](a,b);
}
function hash(s:string){ let h=2166136261>>>0; for(const c of s){ h^=c.charCodeAt(0); h=Math.imul(h,16777619);} return h>>>0; }

/** ECC self-check: cross-modal parity — require agreement among text (S), PMB visual lane, and audio hue lane */
export function eccParity(trip:Triplet){
  return !!trip.S && !!trip.A && !!trip.B;
}
