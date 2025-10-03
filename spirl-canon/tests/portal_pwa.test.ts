import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const portalRoot = path.resolve(__dirname, '../apps/portal');

function read(rel: string) {
  return readFileSync(path.join(portalRoot, rel), 'utf8');
}

describe('Portal PWA shell', () => {
  it('ships a manifest with installable metadata', () => {
    const manifestPath = path.join(portalRoot, 'public/manifest.webmanifest');
    expect(existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(read('public/manifest.webmanifest'));
    expect(manifest.name).toBe('SP1RL Portal');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  });

  it('provides a cache-first service worker for the operator shell', () => {
    const sw = read('public/sw.js');
    expect(sw).toContain("self.addEventListener('install'");
    expect(sw).toContain("PRECACHE");
    expect(sw).toContain("'/modules.json'");
  });

  it('exports static bundles via Next.js export mode', () => {
    const cfg = read('next.config.mjs');
    expect(cfg).toContain("output: 'export'");
  });
});
