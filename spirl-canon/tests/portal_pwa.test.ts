import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('portal PWA', () => {
  const root = path.resolve(__dirname, '../apps/portal/public');
  it('has manifest', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
    expect(manifest.name).toBe('SP1RL Portal');
  });
  it('has service worker', () => {
    const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
    expect(sw).toMatch('self.addEventListener');
  });
});
