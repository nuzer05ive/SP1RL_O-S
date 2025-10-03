export type PMBPayload = {
  v: 'pmb1';
  id: string;
  name: string;
  beads: any[];
  punch: { tStartSec: number; tEndSec: number };
  receipt: string;
};

export function recipeToPMB(recipe: any, receipt: string): PMBPayload {
  const id = recipe.id || digest(JSON.stringify(recipe));
  return { v: 'pmb1', id, name: recipe.name, beads: recipe.beads, punch: recipe.punchWindow, receipt };
}

function digest(s: string) {
  // Fowler–Noll–Vo (FNV-1a) inspired hash that works in both Node and browser runtimes.
  let hash = 0x811c9dc5;
  for (let i = 0; i < s.length; i += 1) {
    hash ^= s.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  // produce 16 hex chars (64-bit style) by mixing with string length for determinism
  const mixed = (hash ^ s.length) >>> 0;
  const hi = ((mixed << 5) ^ (hash >>> 3)) >>> 0;
  return hi.toString(16).padStart(8, '0') + mixed.toString(16).padStart(8, '0');
}
