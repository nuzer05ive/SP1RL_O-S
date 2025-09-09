export type Palette = "O"|"B"|"K"|"R"|"G"|"Au"|"Si"|"BW";
export function colorWeights(A: number, bias: Record<Palette, number>) {
  const keys = Object.keys(bias) as Palette[];
  const exps = keys.map(k => Math.exp((bias[k] || 0) * A));
  const sum = exps.reduce((a,b)=>a+b,0) || 1;
  const out: Record<string, number> = {};
  keys.forEach((k,i)=> out[k] = exps[i] / sum);
  return out;
}
