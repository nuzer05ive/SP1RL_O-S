export type Palette = "O"|"B"|"K"|"R"|"G"|"Au"|"Si"|"BW";
// Softmax helper used to bias palettes toward a set of weights.
export function colorWeights(A: number, bias: Record<Palette, number>) {
  const keys = Object.keys(bias) as Palette[];
  const exps = keys.map((k) => Math.exp((bias[k] || 0) * A));
  const sum = exps.reduce((a, b) => a + b, 0) || 1;
  const out: Record<string, number> = {};
  keys.forEach((k, i) => (out[k] = exps[i] / sum));
  return out;
}

const NOTE_TO_PALETTE: Palette[] = [
  "O", "B", "K", "R", "G", "Au", "Si", "BW",
  "O", "B", "K", "R"
];

/**
 * Map a MIDI note/velocity to an HSV triple.
 * The hue derives from the palette weight selected by the note class,
 * while velocity modulates saturation/value.
 */
export function noteToColor(
  note: number,
  vel: number,
  bias: Record<Palette, number>
) {
  const cls = NOTE_TO_PALETTE[note % 12];
  const weights = colorWeights(vel, bias);
  const hue = weights[cls] || 0;
  const saturation = Math.max(0, Math.min(1, vel));
  const value = saturation;
  return { palette: cls, hue, saturation, value, weights };
}

/** Determine a lane index for radial onsets. */
export function onsetToLane(time: number, breathPhase: number) {
  const phase = breathPhase || 1;
  return Math.floor((time / phase) % 6); // 6 lanes for stub
}
