export function randomnessEdge(history:number[], compRatio:number, epsilon=0.01, N=3){
  const next = [...history, compRatio].slice(-N);
  const edge = next.length===N && Math.abs(next[0]-next[next.length-1]) < epsilon;
  return { history: next, edge };
}
