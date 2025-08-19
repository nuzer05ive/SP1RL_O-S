import React, { useEffect, useRef, useState } from "react";
import { makeLadder, type Config } from "./MidgardRibbon";

const BLUE:[number,number,number] = [90,140,255];
const YG:[number,number,number] = [190,230,100];
const RO:[number,number,number] = [255,110,60];

export default function MidgardRibbonView(){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cfg, setCfg] = useState<Config>({
    phi:(1+Math.sqrt(5))/2, wobble:0.000437,
    tiers:[
      { R: 220, modes:13, color: BLUE },
      { R: 220*(1.618**2), modes:13*2, color: YG },
      { R: 220*(1.618**4), modes:13*4, color: RO }
    ],
    twistLimit:0.72, reconRate:0.08, seed:113
  });

  useEffect(()=>{
    const cvs = canvasRef.current!; const ctx = cvs.getContext("2d")!;
    let t=0; let raf=0;
    const render = ()=>{
      t++;
      ctx.clearRect(0,0,cvs.width,cvs.height);
      ctx.fillStyle = "rgb(8,12,20)"; ctx.fillRect(0,0,cvs.width,cvs.height);
      ctx.translate(cvs.width/2, cvs.height/2);
      ctx.scale(1, 1);
      // ladder
      const ladder = makeLadder(cfg);
      // draw root torii
      for (let ti=0; ti<ladder.root.length; ti++){
        const T = ladder.root[ti];
        const col = cfg.tiers[ti]?.color || [180,200,220];
        ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},0.9)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (const p of T.pts){ ctx.lineTo(p.x*0.9, p.y*0.9); }
        ctx.stroke();
        // plasmoid cores
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        for (const s of T.plasmoids){ ctx.beginPath(); ctx.arc(s.x*0.9, s.y*0.9, s.r*0.9, 0, Math.PI*2); ctx.fill(); }
      }
      // draw children
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = "rgba(16,198,178,0.8)";
      for (const C of ladder.kids){
        ctx.beginPath();
        for (const p of C.pts){ ctx.lineTo(p.x*0.9, p.y*0.9); }
        ctx.stroke();
      }
      ctx.setTransform(1,0,0,1,0,0);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return ()=> cancelAnimationFrame(raf);
  }, [cfg]);

  return (
    <div style={{display:"grid", gridTemplateColumns:"320px 1fr", gap:12}}>
      <div style={{background:"#0a0f15", color:"#eaf2ff", border:"1px solid #1b2736", borderRadius:12, padding:12}}>
        <h3>Midgard Ribbon</h3>
        <div>φ wobble <input type="number" step="0.000001" defaultValue={cfg.wobble} onBlur={e=>setCfg({...cfg, wobble:+e.target.value||0})}/></div>
        <div>twist limit <input type="number" step="0.01" defaultValue={cfg.twistLimit} onBlur={e=>setCfg({...cfg, twistLimit:+e.target.value||0.72})}/></div>
        <div>recon rate <input type="number" step="0.01" defaultValue={cfg.reconRate} onBlur={e=>setCfg({...cfg, reconRate:+e.target.value||0.08})}/></div>
        <p style={{opacity:.75}}>Modes default ~13; tiers spaced by φ²; children (teal) appear at pinch sites.</p>
      </div>
      <canvas ref={canvasRef} width={1024} height={640} style={{width:"100%", background:"#060a10", border:"1px solid #1b2736", borderRadius:12}}/>
    </div>
  );
}
