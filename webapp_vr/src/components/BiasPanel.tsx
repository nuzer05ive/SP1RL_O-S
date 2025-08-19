import React, { useEffect, useState } from "react";
import { getAntonyms, setWeight, setZCM, subscribe } from "../state/AntonymStore";
export default function BiasPanel(){
  const [, setTick]=useState(0);
  useEffect(()=>subscribe(()=>setTick(t=>t+1)),[]);
  const s=getAntonyms();
  return (
    <div style={{position:"absolute", left:12, bottom:12, background:"#0a0f15f0", color:"#eaf2ff", padding:12, border:"1px solid #1b2736", borderRadius:10, font:"12px system-ui", width:340}}>
      <div style={{marginBottom:6, display:"flex", justifyContent:"space-between"}}><b>Ghost Bias</b><span>ZCM:{s.zcm.care.toFixed(2)}/{s.zcm.courage.toFixed(2)}/{s.zcm.trust.toFixed(2)}</span></div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 60px 1fr", gap:6}}>
        {s.pairs.map(p=>(
          <React.Fragment key={p.key}>
            <div style={{textAlign:"right"}}>{p.left}</div>
            <input type="range" min={-1} max={1} step={0.01} value={p.w} onChange={e=>setWeight(p.key, +e.target.value)} />
            <div>{p.right}</div>
          </React.Fragment>
        ))}
      </div>
      <div style={{marginTop:8}}>
        <label>care <input type="number" step="0.01" value={s.zcm.care} onChange={e=>setZCM({...s.zcm, care:+e.target.value})}/></label>
        <label> courage <input type="number" step="0.01" value={s.zcm.courage} onChange={e=>setZCM({...s.zcm, courage:+e.target.value})}/></label>
        <label> trust <input type="number" step="0.01" value={s.zcm.trust} onChange={e=>setZCM({...s.zcm, trust:+e.target.value})}/></label>
      </div>
    </div>
  );
}
