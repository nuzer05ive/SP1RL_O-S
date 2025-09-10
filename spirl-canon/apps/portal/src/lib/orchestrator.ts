export type Bead = { id: string; moduleId: string; inputs: any; tSec?: number };
export type Recipe = { id: string; name: string; beads: Bead[]; punchWindow?: { tStartSec: number; tEndSec: number } };

export function schedule(recipe: Recipe) {
  let t = 0;
  const beads = recipe.beads.map(b => ({ ...b, tSec: ++t }));
  const punchWindow = recipe.punchWindow || { tStartSec: 616, tEndSec: 677 };
  return { ...recipe, beads, punchWindow };
}
