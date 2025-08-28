/**
 * Backsolve teacher planner placeholder.
 */
export function backsolve(tStar: number, voidBudget: number): string[] {
  const steps = Math.min(3, Math.max(2, Math.round(voidBudget)))
  return Array.from({ length: steps }, (_, i) => `setup-${i + 1}`);
}
