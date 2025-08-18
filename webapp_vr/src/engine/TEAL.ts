export const TEAL_LOCK = 0.72;

export function tealScore(care:number, courage:number, trust:number):number{
  const d = Math.abs(care - courage);
  return 1 - d*(1-trust); // convex hinge
}

export const isTeal = (t:number)=> t>=TEAL_LOCK;

export function tealColor(t:number){
  return `rgba(0,128,128,${t})`;
}

export function hingeLine(){
  return { start:[-1,0,0], end:[1,0,0], color:tealColor(1) };
}
