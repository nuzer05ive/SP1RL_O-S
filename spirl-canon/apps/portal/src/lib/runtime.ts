import { Recipe } from './orchestrator';

export async function run(recipe: Recipe): Promise<string[]> {
  return recipe.beads.map(b => `run:${b.moduleId}`);
}
