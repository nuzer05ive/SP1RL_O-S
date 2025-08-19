// PhiJostleEngine · golden spiral + monocle lens + teal cancel net (pure TS)
export type JostleCfg = {
  width:number; height:number; origin:[number,number];   // px
  baseR:number; particles:number; drift:number;          // px/frame upward
  wobble:number;                                         // 0.000437 default
  teal:{ r:number; soft:number; hard:number };           // ring radius, lock thresholds
  monocle:{ x:number; y:number; r:number; arc:number };  // arc ∈ [0..1] strength curve
};

const GOLDEN = (1+Math.sqrt(5))/2;
const GA = 2*Math.PI*(1 - 1/GOLDEN); // golden angle

export function phyllo(k:number, baseR:number, wobble:number){
  // radius grows √k; theta rotates GA+wobble
  const r = baseR * Math.sqrt(k);
  const theta = k*(GA + wobble);
  return { r, theta };
}

export function toCanvasTopLeft(ix:number, iy:number, cfg:JostleCfg){
  // origin in upper-left, positive y downward in canvas;
  // "bottom-to-top drift" simulated by subtracting drift each frame in the route
  return { x: ix + cfg.origin[0], y: iy + cfg.origin[1] };
}

export function polarToXY(r:number, theta:number){
  return { x: r*Math.cos(theta), y: r*Math.sin(theta) };
}

// monocle lens displacement: radial stretch toward/away from (cx,cy) over an arc window
export function monocleWarp(x:number, y:number, cfg:JostleCfg){
  const cx = cfg.monocle.x, cy = cfg.monocle.y, R = cfg.monocle.r, A = cfg.monocle.arc;
  const dx = x - cx, dy = y - cy; const d = Math.hypot(dx,dy);
  if (d > R*1.25) return { x, y };
  const t = Math.max(0, 1 - d/(R*1.25));
  // glassfold: compress inside, stretch just outside, continuous at edge
  const fold = (d < R) ? -(A*0.6)*t : (A*0.35)*t;
  const nx = cx + dx*(1 + fold), ny = cy + dy*(1 + fold);
  return { x:nx, y:ny };
}

// teal cancel net field: inward torque toward circle of radius cfg.teal.r
export function tealTorque(x:number, y:number, cfg:JostleCfg){
  const cx = cfg.origin[0], cy = cfg.origin[1];
  const dx = x - cx, dy = y - cy;
  const r = Math.hypot(dx,dy) || 1e-9;
  const rt = cfg.teal.r;
  // difference from target ring
  const dr = r - rt;
  // radial inward vector scaled to cancel centrifugal peek
  const k = -0.015 * dr; // tuned so that near ring drift is damped
  return { x: dx/r * k, y: dy/r * k };
}

export type Token = { text:string; k:number; color:[number,number,number], size:number };
export type FramePt = { x:number; y:number; th:number; locked:boolean };
export type SpiralSample = { token:Token; pos:FramePt };

export function stepFrame(tokens:Token[], t:number, cfg:JostleCfg, driftOffset:number){
  const cx = cfg.origin[0], cy = cfg.origin[1];
  const pts:SpiralSample[] = [];
  for (const tok of tokens){
    const { r, theta } = phyllo(tok.k, cfg.baseR, cfg.wobble);
    // clockwise spiral: invert angle sign
    const th = -(theta + 0.06*t);
    const { x, y } = polarToXY(r, th);
    let px = x, py = y - driftOffset;  // bottom->top drift (subtract)
    // apply teal torque toward ring
    const tv = tealTorque(px+cx, py+cy, cfg);
    px += tv.x; py += tv.y;
    // monocle warp last
    const w = monocleWarp(px+cx, py+cy, cfg);
    // lock feedback
    const rr = Math.hypot(w.x-cx, w.y-cy);
    const locked = Math.abs(rr - cfg.teal.r) < 8;
    pts.push({ token:tok, pos:{ x:w.x, y:w.y, th:th, locked } });
  }
  return pts;
}

