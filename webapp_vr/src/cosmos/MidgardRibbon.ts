// MidgardRibbon · φ‑ouroboros simulator (math only; render in View)
export type Tier = { R:number; modes:number; color:[number,number,number] };
export type Config = {
  phi:number; wobble:number; tiers:Tier[]; twistLimit:number; reconRate:number; seed:number;
};
export type RingPt = { x:number; y:number; z:number; th:number; sheath:number };
export type Torus = { pts:RingPt[]; plasmoids:{ x:number;y:number;z:number;r:number }[] };
const TAU = Math.PI*2;

export function goldenAngle(){ const PHI=(1+Math.sqrt(5))/2; return TAU*(1-1/PHI); }

export function genTorus(R:number, modes:number, count=1024, wobble=0){
  const pts:RingPt[] = [];
  const GA = goldenAngle() + wobble;
  const rMinor = Math.max(0.03*R, Math.sqrt(R)*0.12); // heuristic
  for (let k=0;k<count;k++){
    const th = k*GA % TAU;
    // 2‑filament Birkeland sheath around the ring (sheath=±1)
    const sheath = (k%2===0)? +1 : -1;
    const phi = th*modes + sheath*0.5;
    // torus param
    const x = (R + rMinor*Math.cos(phi)) * Math.cos(th);
    const y = (R + rMinor*Math.cos(phi)) * Math.sin(th);
    const z = rMinor * Math.sin(phi);
    pts.push({ x, y, z, th, sheath });
  }
  return { pts, plasmoids:[] } as Torus;
}

export function reconnect(parent:Torus, cfg:Config){
  // Wizard-of-Oz plasmoid cascade: when local twist exceeds limit, spawn child torus φ‑scaled
  const out:Torus[] = [];
  const PHI = cfg.phi;
  const childScale = 1/PHI;
  for (let i=0;i<parent.pts.length;i+=Math.max(8, Math.floor(1/cfg.reconRate))){
    const p = parent.pts[i];
    // heuristic twist proxy: |sin(modes*th)| > threshold → pinch site
    const twist = Math.abs(Math.sin(p.th*cfg.tiers[0].modes));
    if (twist > cfg.twistLimit){
      const Rchild = cfg.tiers[0].R * childScale;
      const child = genTorus(Rchild, cfg.tiers[0].modes, 256, cfg.wobble);
      // place child centered at pinch site
      for (const q of child.pts){ q.x += p.x; q.y += p.y; q.z += p.z; }
      out.push(child);
      parent.plasmoids.push({ x:p.x, y:p.y, z:p.z, r:Rchild*0.18 });
    }
  }
  return out;
}

export function makeLadder(cfg:Config){
  // tiers with φ² spacing optionally; build primary and children
  const torii:Torus[] = [];
  const children:Torus[] = [];
  for (const t of cfg.tiers){
    const T = genTorus(t.R, t.modes, 1024, cfg.wobble);
    torii.push(T);
    // run one reconnection pass for demo
    const kids = reconnect(T, cfg);
    for (const c of kids) children.push(c);
  }
  return { root: torii, kids: children };
}
