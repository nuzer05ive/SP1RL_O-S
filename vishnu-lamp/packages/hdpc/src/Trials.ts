import type { Design, TrialHat } from './Types';
import { scoreHat } from './Score';

export function runTrials(design: Design): TrialHat[] {
  return design.hats.map((name) => ({
    name,
    pass: scoreHat(name) < 0.5,
    score: scoreHat(name),
  }));
}
