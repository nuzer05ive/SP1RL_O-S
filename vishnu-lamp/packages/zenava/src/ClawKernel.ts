export interface Candidate {
  id: string;
  L: number;
}

export function chooseMin(candidates: Candidate[]): Candidate {
  return candidates.reduce((min, c) => (c.L < min.L ? c : min));
}
