import type { Candidate } from './ClawKernel';
import { lattice } from './Lattice';
import { coat } from './SkinFinish';

export function fabricate(candidate: Candidate) {
  const meshes = lattice(candidate.id);
  const coatParams = coat(candidate.id);
  return { meshes, coat: coatParams };
}
