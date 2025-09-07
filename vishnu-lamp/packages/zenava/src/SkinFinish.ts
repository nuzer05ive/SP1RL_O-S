export interface CoatParams {
  finish: string;
  color: string;
}

const coats = ['gold', 'red', 'blue', 'shimmer'];
const colors = ['#ffd700', '#ff0000', '#0000ff', '#8888ff'];

export function coat(seed: string): CoatParams {
  const idx = seed.charCodeAt(0) % coats.length;
  return { finish: coats[idx], color: colors[idx] };
}
