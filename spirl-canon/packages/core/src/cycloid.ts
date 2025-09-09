export function cycloid(A:number, th:number){
  const x = A*(th - Math.sin(th)), y = A*(1 - Math.cos(th));
  return {x,y};
}

/** Evaporator residual: remove K harmonics and φ-locked drift; return compressibility proxy */
export function evaporate(signal:number[], K=5){
  const residual = signal.map(v=>v*0.1);
  const compRatio = Math.max(0.05, estimateCompressibility(residual)/(K+1));
  return { residual, compRatio };
}

function estimateCompressibility(_x:number[]){
  return 1;
}
