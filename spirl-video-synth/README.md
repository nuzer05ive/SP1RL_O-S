# SP1RL-Q.us Video Synth

## Setup
```bash
npm i -g pnpm && pnpm i
# Python worker venv is optional; uses system python by default

Run (dev)

# 1) Start API
pnpm dev:api
# 2) Start web (or open viewer static)
pnpm dev:web
# 3) (optional) start Python HTTP worker separately
pnpm worker
```

Verify
1.Open web → upload fixtures/sample.mp4.
2.Wait for scan.json response → download.
3.Open /apps/viewer/index.html (or pnpm dev:viewer) → load scan.json.
Result: cycloid rails animate, logo flashes at apex, sliders remix scene.

Notes
•workers/scan/spirl_scan.py fits cycloids + θ′ wobble, estimates band angles, finds 3-cone apex.
•Viewer can replace groups with sprite→3D billboards (todo: upload atlas in web).

---

## Acceptance Tests
/spirl-video-synth/tests/api.test.ts
```ts
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "child_process";

describe("scan worker", ()=> {
  it("produces scan.json from sample.mp4", async ()=>{
    const p = spawn("python", ["workers/scan/spirl_scan.py", "fixtures/sample.mp4"], { cwd: path.join(process.cwd(),"spirl-video-synth") });
    await new Promise((res,rej)=>{ p.on("close", c=> c?rej():res(null)); });
    const sj = JSON.parse(fs.readFileSync(path.join(process.cwd(),"spirl-video-synth","fixtures","scan.json"),"utf-8"));
    expect(sj.rails.length).toBeGreaterThanOrEqual(3);
    expect(sj.apex_times.length).toBeGreaterThan(0);
    expect(sj.alphas.length).toBe(3);
  });
});
```
