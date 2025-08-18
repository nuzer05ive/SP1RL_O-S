// SP1RL · address_palette.v1.js — φ‑harmonic color/glyph mapping
import { addressToView } from './prime_address.v1.js';
const H = (row,col)=> ((row*17 + col*43) % 360);     // pseudo‑prime hue spread
const S = (wing)=> wing==='R' ? 72 : 64;
const L = (k)=> 56 - Math.min(24, k*6);
const epochShift = (epoch)=> epoch ? (epoch % 43) * (360/43) * 0.15 : 0;
export function colorFor(addr){
  const baseH = H(addr.row, addr.col);
  const h = (baseH + epochShift(addr.epoch)) % 360;
  const s = S(addr.wing), l = L(addr.k);
  return `hsl(${h}deg ${s}% ${l}%)`;
}
export function glyphFor(addr){
  // Simple glyph set keyed by class/wing; expand as needed
  if (addr.class==='TP') return addr.wing==='R' ? '⇄' : '⟲';
  if (addr.class==='MP') return addr.wing==='R' ? '⚡' : '◎';
  return addr.wing==='R' ? '◇' : '◆';
}
export function decorateShard(el, addr){
  const c = colorFor(addr);
  el.style.setProperty('--shard-accent', c);
  const g = glyphFor(addr);
  const badge = document.createElement('div');
  badge.textContent = g;
  badge.className = 'glyph';
  badge.style.cssText = 'position:absolute;right:8px;top:8px;font-size:14px;opacity:.85';
  el.style.position='relative';
  el.appendChild(badge);
}
