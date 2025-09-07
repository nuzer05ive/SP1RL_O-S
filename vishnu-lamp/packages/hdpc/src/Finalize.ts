import { createHmac } from 'crypto';
import type { TrialHat, HumaneConstraints, FinalCharacter } from './Types';

export function finalize(
  hats: TrialHat[],
  constraints: HumaneConstraints,
  seed: string
): FinalCharacter {
  if (
    !constraints.humane ||
    !constraints.moral ||
    !constraints.dilemma ||
    !constraints.stakes
  ) {
    throw new Error('inhumane');
  }
  const passed = hats.filter((h) => h.pass);
  if (passed.length === 0) {
    throw new Error('no_hat_pass');
  }
  const hash = createHmac('sha256', seed)
    .update(passed[0].name)
    .digest('hex')
    .slice(0, 8);
  return { primeAddress: { hash }, finish: `mix:${passed[0].name}` };
}
