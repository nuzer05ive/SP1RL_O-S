import { mathReceipt } from '../../../../packages/core/src/receipts';

export type Bead = { id: string; moduleId: string; inputs: Record<string, any>; tSec?: number };
export type Recipe = {
  id: string;
  name: string;
  beads: Bead[];
  punchWindow?: { tStartSec: number; tEndSec: number };
  receipt?: string;
};

export type ScheduledRecipe = Required<Omit<Recipe, 'receipt'>> & { receipt: string };

const DEFAULT_PUNCH = { tStartSec: 616, tEndSec: 677 };
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

export function schedule(recipe: Recipe): ScheduledRecipe {
  const punchWindow = recipe.punchWindow ?? DEFAULT_PUNCH;
  const beads = recipe.beads.slice();
  const intervals = goldenIntervals(beads.length);
  const preludeDuration = intervals.reduce((sum, value) => sum + value, 0);
  const start = punchWindow.tStartSec - preludeDuration;
  let cursor = start;
  const scheduled = beads.map((bead, index) => {
    cursor += intervals[index];
    return { ...bead, tSec: Number(cursor.toFixed(3)) };
  });
  const receipt = recipe.receipt ?? mathReceipt();
  return { ...recipe, beads: scheduled, punchWindow, receipt } as ScheduledRecipe;
}

function goldenIntervals(count: number): number[] {
  if (count === 0) return [];
  const pinchSpan = 144; // seconds of φ-pinch ramp before the punch window
  const weights: number[] = [];
  for (let i = 0; i < count; i += 1) {
    weights.push(Math.pow(GOLDEN_RATIO, i));
  }
  const weightSum = weights.reduce((sum, value) => sum + value, 0);
  return weights.map((value) => (pinchSpan * value) / weightSum);
}
