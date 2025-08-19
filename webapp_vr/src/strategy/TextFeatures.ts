// Lightweight tokenizer + co-occur graph + hashed n-gram features (no heavy deps)
export function tokenize(s:string){ return (s.toLowerCase().match(/[a-z0-9'\-]+/g)||[]).slice(0,256); }
export function ngrams(tokens:string[], n=3){
  const grams:string[] = [];
  for (let i=0;i<tokens.length;i++){
    for (let k=1;k<=n;k++){
      const t = tokens.slice(i,i+k).join(" ");
      if (t) grams.push(t);
    }
  }
  return grams;
}
export function hashVec(grams:string[], dim=64){
  const v=new Array(dim).fill(0);
  for (const g of grams){
    let h=2166136261;
    for (let i=0;i<g.length;i++){ h ^= g.charCodeAt(i); h += (h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24); }
    const idx = Math.abs(h|0) % dim;
    v[idx] += 1;
  }
  const norm = Math.sqrt(v.reduce((a,c)=>a+c*c,0))||1;
  return v.map(x=>x/norm);
}
export function cosine(a:number[], b:number[]){ let s=0; for (let i=0;i<a.length;i++) s+=a[i]*b[i]; return s; }
export function cooccur(tokens:string[], window=3){
  const edges = new Map<string, number>();
  for (let i=0;i<tokens.length;i++){
    for (let j=i+1;j<Math.min(tokens.length, i+1+window); j++){
      const key = tokens[i] < tokens[j] ? tokens[i]+"|"+tokens[j] : tokens[j]+"|"+tokens[i];
      edges.set(key, (edges.get(key)||0)+1);
    }
  }
  return edges;
}
