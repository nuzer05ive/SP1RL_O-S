import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'child_process';

describe('scan worker', () => {
  it('produces scan.json from sample.mp4', async () => {
    const p = spawn('python', ['workers/scan/spirl_scan.py', 'fixtures/sample.mp4'], { cwd: path.join(process.cwd(), 'spirl-video-synth') });
    await new Promise((res, rej) => { p.on('close', c => c ? rej() : res(null)); });
    const sj = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'spirl-video-synth', 'fixtures', 'scan.json'), 'utf-8'));
    expect(sj.rails.length).toBeGreaterThanOrEqual(3);
    expect(sj.apex_times.length).toBeGreaterThan(0);
    expect(sj.alphas.length).toBe(3);
  });
});
