import React, { useEffect, useState } from "react";
import { ghostAnswer } from "../ghost/GhostPersona";
export default function GhostCLI(){
  const [open,setOpen]=useState(false);
  const [q,setQ]=useState(""); const [a,setA]=useState<any|null>(null);
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{ if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){ e.preventDefault(); setOpen(v=>!v);} };
    window.addEventListener("keydown", onKey); return ()=>window.removeEventListener("keydown", onKey);
  },[]);
  if(!open) return null;
  const ask=()=>{
    const scope = { local: (window as any).__SP1RL_LOCAL__||{}, global: (window as any).__SP1RL_GLOBAL__||{} };
    setA( ghostAnswer(q, scope) );
  };
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,.45)", display:"grid", placeItems:"center"}}>
      <div style={{width:720, background:"#0b1119", color:"#eaf2ff", border:"1px solid #1b2736", borderRadius:12, padding:12}}>
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <b>SP1RL G‑host · .55 ZCM</b><button onClick={()=>setOpen(false)}>Close</button>
        </div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask the Ghost… (Ctrl/⌘+K to toggle)" style={{width:"100%", marginTop:8, background:"#0f1622", color:"#eaf2ff"}}/>
        <div style={{marginTop:8}}><button onClick={ask}>Answer</button></div>
        {a && (
          <div style={{marginTop:10, display:"grid", gridTemplateColumns:"1fr 320px", gap:10}}>
            <pre style={{whiteSpace:"pre-wrap", background:"#0f1622", padding:10, borderRadius:8}}>{a.text}</pre>
            <div style={{background:"#0f1622", padding:10, borderRadius:8}}>
              <b>Receipts</b>
              <pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(a.receipts,null,2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
