export type ZcmVec = Record<"sarcasm"|"clarity"|"empathy"|"story"|"math"|"action"|"ambience"|"color"|"rhythm", number>;
export const ZCM_AXES: (keyof ZcmVec)[] = ["sarcasm","clarity","empathy","story","math","action","ambience","color","rhythm"];

export function zeros(): ZcmVec { return Object.fromEntries(ZCM_AXES.map(k=>[k,0])) as ZcmVec; }

export function zcmFromText(text: string): ZcmVec {
  const v = zeros(); const t = text || "";
  const rx = (p: RegExp) => p.test(t);
  if (rx(/lol|yeah right|sure|obviously|goo theorem|no-ether|!{2,}|\?{2,}/i)) v.sarcasm = 0.6;
  if (rx(/( is | means | define | proof | therefore )/i)) v.clarity = Math.max(v.clarity, 0.6);
  if (rx(/sorry|help|care|empathy|gentle/i)) v.empathy = 0.6;
  if (rx(/quest|lore|dialog|cutscene|story/i)) v.story = 0.6;
  if (rx(/phi|theta|ratio|euler|cycloid|venturi|math/i)) v.math = 0.7;
  if (rx(/attack|dash|jump|run|dodge/i)) v.action = 0.6;
  if (rx(/rain|wind|fog|ambience|reverb/i)) v.ambience = 0.6;
  if (rx(/violet|gold|blue|red|palette|hue/i)) v.color = 0.6;
  if (rx(/beat|tempo|meter|rhythm|drum/i)) v.rhythm = 0.6;
  if (/\?/.test(t)) v.clarity = Math.max(v.clarity, 0.3);
  return v;
}

export function zcmScore(v: ZcmVec): number {
  // Weighted sass-fit score for badge/NFT ranking
  return 0.25*v.sarcasm + 0.2*v.story + 0.2*v.clarity + 0.15*v.math + 0.2*(v.action+v.rhythm)/2;
}
