import { createHash } from 'crypto';

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
  return createHash('sha256').update(s).digest('hex').slice(0, 16);
}
