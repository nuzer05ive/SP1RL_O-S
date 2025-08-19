import React, { useState } from "react";
import { analyzeConstant, analyzeShard, anchorsDemo, wobbleStep } from "../constants/SpiralConstants";
export default function SpiralConstantsLab(){
  const [num,setNum]=useState("3.43");
  const [shard,setShard]=useState("359976232289");
  const [out,setOut]=useState<any>(null);
  const [shOut,setShOut]=useState<any>(null);
  const runNum = ()=> setOut(analyzeConstant(num));
  const runShard = ()=> setShOut(analyzeShard(shard));
  const wob = wobbleStep(1.0,false);
  const wobFrac = wobbleStep(0.343,true);
  return (
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
      <div style={{background:"#0a0f15",color:"#eaf2ff",border:"1px solid #1b2736",borderRadius:12,padding:12}}>
        <h3>Spiral Constants</h3>
        <div>number <input value={num} onChange={e=>setNum(e.target.value)} style={{marginLeft:6, width:160, background:"#0f1622", color:"#eaf2ff"}}/></div>
        <div style={{marginTop:8}}><button onClick={runNum}>Analyze</button></div>
        {out && <pre style={{marginTop:8, whiteSpace:"pre-wrap"}}>{JSON.stringify(out,null,2)}</pre>}
        <div style={{marginTop:10, opacity:.8}}>
          <b>Anchors demo</b>
          <pre>{JSON.stringify(anchorsDemo(),null,2)}</pre>
          <b>Wobble to 1.0</b><pre>{JSON.stringify(wob,null,2)}</pre>
          <b>Wobble to .343 (mod1)</b><pre>{JSON.stringify(wobFrac,null,2)}</pre>
        </div>
      </div>
      <div style={{background:"#0a0f15",color:"#eaf2ff",border:"1px solid #1b2736",borderRadius:12,padding:12}}>
        <h3>Digit Shard</h3>
        <div>digits <input value={shard} onChange={e=>setShard(e.target.value)} style={{marginLeft:6, width:220, background:"#0f1622", color:"#eaf2ff"}}/></div>
        <div style={{marginTop:8}}><button onClick={runShard}>Analyze Shard</button></div>
        {shOut && <pre style={{marginTop:8, whiteSpace:"pre-wrap"}}>{JSON.stringify(shOut,null,2)}</pre>}
      </div>
    </div>
  );
}
