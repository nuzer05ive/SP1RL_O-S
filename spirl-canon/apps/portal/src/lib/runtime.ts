import { ScheduledRecipe } from './orchestrator';

export type OperatorLog = { at: number; moduleId: string; detail: string };

export async function run(recipe: ScheduledRecipe): Promise<OperatorLog[]> {
  const logs: OperatorLog[] = recipe.beads.map((bead) => ({
    at: bead.tSec ?? recipe.punchWindow.tStartSec,
    moduleId: bead.moduleId,
    detail: JSON.stringify(bead.inputs),
  }));
  logs.push({
    at: recipe.punchWindow.tStartSec,
    moduleId: 'φ-pinch',
    detail: `Prelude sealed → window ${recipe.punchWindow.tStartSec}s→${recipe.punchWindow.tEndSec}s`,
  });
  logs.push({
    at: recipe.punchWindow.tEndSec,
    moduleId: 'φ-punch',
    detail: 'Window released',
  });
  return logs.sort((a, b) => a.at - b.at);
}
