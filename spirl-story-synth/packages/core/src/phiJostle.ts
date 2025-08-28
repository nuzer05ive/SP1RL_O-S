export function phiJostle(v:[number,number,number], phi:number){
  return v.map((c,i)=>c + Math.sin(phi + i)) as [number,number,number];
}
