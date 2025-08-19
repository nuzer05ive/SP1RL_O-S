import React, { useEffect, useRef, useState } from "react";
import { stepFrame, type Token, type JostleCfg } from "./PhiJostleEngine";
import { getAntonyms } from "../state/AntonymStore";

function hex(c:[number,number,number]){ return `rgb(${c[0]},${c[1]},${c[2]})`; }

const ROAD:[number,number,number] = [245,205,70];
const TEAL:[number,number,number] = [16,198,178];
const BLUE:[number,number,number] = [80,150,255];
const YG:[number,number,number] = [190,230,100];
const RO:[number,number,number] = [255,110,60];

const palette = [ROAD, BLUE, YG, RO];

export default function PhiJostleMonocle(){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [cfg, setCfg] = useState<JostleCfg>({
    width: 1024, height: 640,
    origin: [40, 40],
    baseR: 4.5, particles: 480, drift: 0.9,
    wobble: 0.000437,
    teal: { r: 260, soft: 0.62, hard: 0.72 },
    monocle: { x: 420, y: 300, r: 120, arc: 0.9 }
  });
  const [tokens, setTokens] = useState<Token[]>(()=> demoTokens("Welcome to the Throng Spiral where letters remember their birth"));
  const tRef = useRef(0); const driftRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(()=>{
    const cvs = canvasRef.current!;
    const ctx = cvs.getContext("2d")!;
      const render = ()=>{
        const t = tRef.current++;
        const b = Object.fromEntries(getAntonyms().pairs.map(p=>[p.key,p.w]));
        const sat = 0.85 + 0.15*Math.max(0,b.playful||0);
        const ring = cfg.teal.r * (1 - 0.06*Math.max(0,b.solemn?Math.abs(b.solemn):0));
        const arc = Math.min(1, cfg.monocle.arc + 0.3*Math.max(0,b.abstract||0));
        driftRef.current += cfg.drift;
        ctx.clearRect(0,0,cfg.width,cfg.height);
        // bg
        ctx.fillStyle = "rgb(8,12,20)"; ctx.fillRect(0,0,cfg.width,cfg.height);
        // teal ring
        ctx.strokeStyle = hex(TEAL as any); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cfg.origin[0], cfg.origin[1], ring, 0, Math.PI*2); ctx.stroke();

        const pts = stepFrame(tokens, t, { ...cfg, monocle:{...cfg.monocle, arc} }, driftRef.current);
        // draw teal lattice nodes when locked
        for (const s of pts){
          if (s.pos.locked){
            ctx.fillStyle = hex(TEAL as any);
            ctx.fillRect(s.pos.x-1.2, s.pos.y-1.2, 2.4, 2.4);
          }
        }
        // draw tokens
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        for (const s of pts){
          const c = s.token.color;
          const col = `rgba(${Math.round(c[0]*sat)},${Math.round(c[1]*sat)},${Math.round(c[2]*sat)},0.92)`;
          ctx.save();
          ctx.translate(s.pos.x, s.pos.y);
          ctx.rotate(s.pos.th);
          ctx.font = `bold ${s.token.size}px system-ui`;
          ctx.fillStyle = col;
          ctx.fillText(s.token.text, 0, 0);
          ctx.restore();
        }
        rafRef.current = requestAnimationFrame(render);
      };
    rafRef.current = requestAnimationFrame(render);
    return ()=> cancelAnimationFrame(rafRef.current);
  }, [cfg, tokens]);

  const startRec = ()=>{
    const cvs = canvasRef.current!;
    const stream = (cvs as any).captureStream(30);
    const rec = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
    rec.ondataavailable = e => { if (e.data.size) chunksRef.current.push(e.data); };
    rec.onstop = ()=>{
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      chunksRef.current = [];
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "phi_jostle_demo.webm";
      a.click();
    };
    recRef.current = rec; rec.start();
  };
  const stopRec = ()=> recRef.current?.stop();

  return (
    <div style={{position:"relative"}}>
      <canvas ref={canvasRef} width={cfg.width} height={cfg.height} style={{width:"100%", background:"#080c14", border:"1px solid #1b2736", borderRadius:12}}/>
      <div style={{position:"absolute", left:12, top:12, display:"flex", gap:8}}>
        <button onClick={startRec}>Record</button>
        <button onClick={stopRec}>Stop</button>
        <button onClick={()=>setTokens(demoTokens(prompt("Enter text:", "Emergent language through φ‑jostle")||""))}>Load Text</button>
        <button onClick={()=>setCfg({...cfg, monocle:{...cfg.monocle, x: cfg.monocle.x+30}})}>Nudge Monocle →</button>
      </div>
    </div>
  );
}

function demoTokens(text:string){
  // Wizard-of-Oz tokenizer: split to word-bubbles + a few glyphs
  const words = text.split(/\s+/).filter(Boolean).slice(0, 64);
  const tokens = [] as Token[];
  let k = 0;
  for (const w of words){
    const color = k%4===0? ROAD : (k%4===1? BLUE : (k%4===2? YG : RO));
    const size = 12 + Math.min(22, Math.floor(Math.sqrt(k+1)*1.6));
    tokens.push({ text:w, k, color, size });
    k += 7; // sparse along spiral to avoid overlap
  }
  return tokens;
}

