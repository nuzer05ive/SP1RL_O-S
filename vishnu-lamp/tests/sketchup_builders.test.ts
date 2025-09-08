import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import { meshDigest, type NeutralMesh } from '../packages/core/src/builders';

const run = process.env.RUN_ONLINE === '1' ? describe : describe.skip;

function runRuby(kind: string): NeutralMesh {
  const script = `require 'json';require_relative '../plugins/sketchup/builders';puts SketchupBuilders.build_${kind}.to_json`;
  const res = spawnSync('ruby', ['-e', script], { encoding: 'utf-8' });
  return JSON.parse(res.stdout);
}

run('sketchup builders', () => {
  const kinds = ['cycloid', 'mobius', 'petal_bloom', 'yellow_sack'];
  for (const kind of kinds) {
    it(`build_${kind} returns stable mesh`, () => {
      const mesh = runRuby(kind);
      expect(mesh.kind).toBe(kind);
      expect(Array.isArray(mesh.geom.positions)).toBe(true);
      const digest = meshDigest(mesh);
      expect(digest).toMatch(/^[a-f0-9]{64}$/);
    });
  }
});
