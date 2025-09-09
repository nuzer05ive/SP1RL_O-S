import { describe, it, expect } from 'vitest';
import { loadPanel } from '../apps/api/src/panels';

const ONLINE = process.env.RUN_ONLINE === '1';
(ONLINE ? describe : describe.skip)('panel manifests', () => {
  it('all panels load and have required keys', () => {
    const names = [
      'panel_00_cut_glyph.json','panel_01_yeyes_gate.json','panel_02_yy_seal.json','panel_03_thumb_duet.json',
      'panel_04_676_doorway.json','panel_05_osiris_triad.json','panel_06_wedding_89.json','panel_07_infinite_duet.json',
      'panel_08_grand_loop.json','panel_09_extra1.json','panel_10_extra2.json','panel_11_extra3.json',
      'panel_12_extra4.json','panel_13_extra5.json','panel_14_baroque_ascension.json','panel_15_meta_bridge.json',
      'panel_16_yeyy_seal.json','panel_17_onyin.json'
    ];
    names.forEach(n => {
      const p = loadPanel(n);
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('glyph');
      expect(p.glyph).toHaveProperty('caption');
    });
  });
});
