export type LayerEvt = { t:number; kind:"drone"|"pulse"|"ost"|"risset"|"shep"|"punch"|"seal"; params:any };
export type ScorePlan = { t0:number; buildEnd:number; accelEnd:number; punchStart:number; punchEnd:number };

export function planPhiScore(tStart=0):ScorePlan{
  // 00:00 build → 04:00 layering → 08:00 accel → 10:16 punch → 11:17 seal
  return { t0:tStart, buildEnd:tStart+240, accelEnd:tStart+496, punchStart:tStart+616, punchEnd:tStart+677 };
}

export function scheduleScore(p:ScorePlan):LayerEvt[]{
  const E:LayerEvt[]=[];
  // Build (00:00–04:00): drones + recognizer pulses
  for(let t=p.t0; t<=p.buildEnd; t+=4) E.push({t,kind:"pulse",params:{hz:1.0, gain:-18}});
  E.push({t:p.t0, kind:"drone", params:{note:"D1", gain:-16}});
  E.push({t:p.t0+60, kind:"drone", params:{note:"Eb1", gain:-18}});
  // Layering (04:00–08:00): ostinati
  for(let t=p.buildEnd; t<=p.accelEnd; t+=8) E.push({t,kind:"ost",params:{pattern:"phi-arp", gain:-14}});
  // Accel (08:00–10:16): Risset rhythm + Shepard shimmer
  E.push({t:p.buildEnd, kind:"risset", params:{layers:5, baseHz:2.0, ratio:1.08, until:p.punchStart}});
  E.push({t:p.buildEnd, kind:"shep", params:{steps:48, glide:0.5, until:p.punchStart}});
  // Punch (10:16→11:17): one-beat jump + seal chord
  E.push({t:p.punchStart, kind:"punch", params:{f0:6.76, f1:7.67}});
  E.push({t:p.punchEnd-2, kind:"seal", params:{prog:["Dm","Bb","F","C"], gain:-10}});
  return E;
}
