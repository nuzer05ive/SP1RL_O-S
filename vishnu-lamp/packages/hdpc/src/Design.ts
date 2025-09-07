import type { Intent, Design, HumaneConstraints } from './Types';

export function buildDesign(
  _intent: Intent,
  hats: string[],
  constraints: HumaneConstraints
): Design {
  return { hats, constraints };
}
