import fs from 'fs';

export function alignPairs(weight: number, seed: number, variants: number = 88) {
  const rng = mulberry32(seed);
  const scores: number[] = [];
  for (let i = 0; i < variants; i++) {
    scores.push(weight + rng() * 0.1);
  }
  let bestIndex = 0;
  scores.forEach((s, i) => { if (s > scores[bestIndex]) bestIndex = i; });
  return { victor89: { index: bestIndex + 1, score: parseFloat(scores[bestIndex].toFixed(2)) }, report: scores };
}

export function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

if (require.main === module) {
  const infile = process.argv[2];
  const payload = JSON.parse(fs.readFileSync(infile, 'utf-8'));
  const result = alignPairs(payload.pairs[0].weight, payload.meta.seed);
  console.log(JSON.stringify(result));
}
