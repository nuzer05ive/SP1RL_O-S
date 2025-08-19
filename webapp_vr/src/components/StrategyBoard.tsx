import React, { useEffect, useRef, useState } from "react";
import type { Weights } from "../strategy/Scoring";
import workerUrl from "../strategy/worker/OptimizerWorker.ts?worker&url";
import { getAntonyms } from "../state/AntonymStore";

type Best = { plan: any; total: number };
const DEF_W: Weights = { profit:1.0, effort:1.2, ttf:0.9, risk:0.8, leverage:1.0, harmony:0.7 };

export default function StrategyBoard(){
  const [seed, setSeed] = useState("Passive income app for creators using assets I already have");
  const [assets, setAssets] = useState("200 blog posts\n50 paintings\nopen-source repo\nsmall email list");
  const [w, setW] = useState<Weights>(DEF_W);
  const [best, setBest] = useState<Best[]>([]);
  const [running, setRunning] = useState(false);
  const wkRef = useRef<Worker|null>(null);

  const run = ()=>{
    if (running) return;
    const wk = new Worker(workerUrl, { type:"module" });
    wkRef.current = wk;
    setRunning(true); setBest([]);
    wk.onmessage = (e:any)=>{
      if (e.data.type === "progress") setBest(e.data.best);
      if (e.data.type === "done"){ setBest(e.data.best); setRunning(false); wk.terminate(); }
    };
    // bias weights from antonyms (Wizard-of-Oz mapping)
    const ants = getAntonyms();
    const b = Object.fromEntries(ants.pairs.map(p=>[p.key,p.w]));
    const biasW = {
      profit: w.profit * (1 + 0.25*((b.bold||0) + (b.novel||0))),
      effort: w.effort * (1 + 0.25*((b.fast||0) - Math.abs(b.thorough||0))),
      ttf:    w.ttf    * (1 + 0.20*((b.fast||0))),
      risk:   w.risk   * (1 + 0.20*((-Math.abs(b.bold||0)) + (Math.abs(b.cautious||0)))),
      leverage: w.leverage * (1 + 0.25*((b.open||0))),
      harmony: w.harmony * (1 + 0.20*((b.playful||0) - Math.abs(b.solemn||0)))
    } as Weights;
    wk.postMessage({
      seed, weights:biasW,
      assets: assets.split(/\n+/).filter(Boolean),
      beam: 14, iters: 60, maxPlans: 8
    });
  };
  const stop = ()=>{ wkRef.current?.terminate(); setRunning(false); };

  const exportMd = ()=>{
    const lines:string[] = [];
    lines.push(`# Jostle Planner — Top Strategies`);
    best.forEach((b,i)=>{
      const p = b.plan;
      lines.push(`\n## ${i+1}. ${p.title}  \n**Score:** ${(b.total*100).toFixed(1)}%  \n${p.summary}`);
      lines.push(`\n**Channels:** ${p.channels.join(", ")}`);
      lines.push(`\n**Reuse:** ${p.reuse.join(", ")}`);
      lines.push(`\n**Estimates:** revenue~$${Math.round(p.est.revenue)} · hours~${Math.round(p.est.hours)} · TTF~${Math.round(p.est.ttfDays)}d · risk~${p.est.risk.toFixed(2)}`);
      lines.push(`\n**Steps:**\n${p.steps.map((s:string,i:number)=>`  ${i+1}. ${s}`).join("\n")}`);
    });
    const blob = new Blob([lines.join("\n")], {type:"text/markdown"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "jostle_planner_strategies.md";
    a.click();
  };

  const W = (k:keyof Weights)=>(
    <div><label>{k} <input type="number" step="0.1" value={(w as any)[k]}
      onChange={e=>setW({...w, [k]: +e.target.value || 0})}/></label></div>
  );

  return (
    <div style={{display:"grid", gridTemplateColumns:"320px 1fr", gap:12}}>
      <div style={{background:"#0a0f15", color:"#eaf2ff", border:"1px solid #1b2736", borderRadius:12, padding:12}}>
        <h3>Jostle Planner</h3>
        <textarea value={seed} onChange={e=>setSeed(e.target.value)} rows={5} style={{width:"100%", background:"#0f1622", color:"#eaf2ff"}} />
        <div style={{marginTop:8}}>
          <div style={{fontWeight:600, marginBottom:4}}>My existing assets</div>
          <textarea value={assets} onChange={e=>setAssets(e.target.value)} rows={6} style={{width:"100%", background:"#0f1622", color:"#eaf2ff"}} />
        </div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginTop:8}}>
          {W("profit")}{W("effort")}{W("ttf")}{W("risk")}{W("leverage")}{W("harmony")}
        </div>
        <div style={{display:"flex", gap:8, marginTop:10}}>
          <button onClick={run} disabled={running}>Run</button>
          <button onClick={stop} disabled={!running}>Stop</button>
          <button onClick={exportMd} disabled={!best.length}>Export</button>
        </div>
        <p style={{opacity:.75, marginTop:8}}>Runs entirely in your browser (Web Worker). No network.</p>
      </div>
      <div>
        {best.map((b,i)=> <PlanCard key={i} rank={i+1} total={b.total} plan={b.plan}/>)}
      </div>
    </div>
  );
}

function PlanCard({rank,total,plan}:{rank:number; total:number; plan:any}){
  return (
    <div style={{background:"#0d141e", color:"#eaf2ff", border:"1px solid #1b2736", borderRadius:12, padding:12, marginBottom:10}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
        <h4 style={{margin:0}}>{rank}. {plan.title}</h4>
        <div style={{opacity:.9}}>Score {(total*100).toFixed(1)}%</div>
      </div>
      <div style={{opacity:.85, marginTop:4}}>{plan.summary}</div>
      <div style={{marginTop:8}}><b>Channels:</b> {plan.channels.join(", ")}</div>
      <div style={{marginTop:4}}><b>Reuse:</b> {plan.reuse.join(", ")}</div>
      <div style={{marginTop:4}}><b>Est:</b> ${Math.round(plan.est.revenue)} · {Math.round(plan.est.hours)}h · {Math.round(plan.est.ttfDays)}d · risk {plan.est.risk.toFixed(2)}</div>
      <ol style={{marginTop:8}}>
        {plan.steps.map((s:string,idx:number)=><li key={idx}>{s}</li>)}
      </ol>
    </div>
  );
}
