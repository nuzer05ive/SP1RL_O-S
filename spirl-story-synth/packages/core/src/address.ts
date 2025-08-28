export function primeAddress(ring:number, step=34, jitter=0){
  const human = `PP:TP(89)@φ43:${ring}:step${step}~J:${jitter}`;
  return { ring, step, jitter, human };
}
export function soulDefaults(soul:"root2"|"tau"|"zeta3"|"pi"|"phi"|"e"|"psi"|"thetaPrime"){
  switch(soul){
    case "root2": return { edgy:0.85, flow:0.55, sarcasm:0.2, coherence:0.7 };
    case "tau":   return { edgy:0.35, flow:0.9, sarcasm:0.8, coherence:0.75 };
    case "zeta3": return { edgy:0.25, flow:0.4, sarcasm:0.6, coherence:0.95 };
    case "pi":    return { edgy:0.6, flow:0.65, sarcasm:0.7, coherence:0.6 };
    case "phi":   return { edgy:0.4, flow:0.8, sarcasm:0.3, coherence:0.92 };
    case "e":     return { edgy:0.55, flow:0.7, sarcasm:0.4, coherence:0.88 };
    case "psi":   return { edgy:0.5, flow:0.5, sarcasm:0.5, coherence:0.5 };
    case "thetaPrime": return { edgy:0.7, flow:0.7, sarcasm:0.5, coherence:0.7 };
  }
}
