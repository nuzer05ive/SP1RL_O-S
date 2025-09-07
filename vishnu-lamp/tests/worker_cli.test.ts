import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import crypto from 'crypto';

const RUN = process.env.RUN_ONLINE === '1';

(RUN ? describe : describe.skip)('worker cli', () => {
  it('produces deterministic mesh', () => {
    const out = 'vishnu-lamp/data/uploads/cli_mesh.json';
    execSync(
      `python vishnu-lamp/workers/sgk/seam_gate.py --in vishnu-lamp/fixtures/sample.png --out ${out} --seed deadbeef`
    );
    const data1 = fs.readFileSync(out, 'utf-8');
    const h1 = crypto.createHash('sha256').update(data1).digest('hex');
    execSync(
      `python vishnu-lamp/workers/sgk/seam_gate.py --in vishnu-lamp/fixtures/sample.png --out ${out} --seed deadbeef`
    );
    const data2 = fs.readFileSync(out, 'utf-8');
    const h2 = crypto.createHash('sha256').update(data2).digest('hex');
    expect(h1).toBe(h2);
    const json = JSON.parse(data1);
    expect(Array.isArray(json.meshes)).toBe(true);
  });
});
