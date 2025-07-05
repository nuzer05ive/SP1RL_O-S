const fs = require('fs');
const { solveSpiralTime } = require('../libs/spiral-time-ts');

const episodes = [];
for (let i = 0; i <= 220; i++) {
  const res = solveSpiralTime(i);
  episodes.push({
    episode: i + 1,
    phi_power: Number((i / ((1 + Math.sqrt(5)) / 2)).toFixed(6)),
    node: res.node,
    lap: res.lap,
    seconds: res.seconds,
    glyph: '',
    lore: ''
  });
}
fs.writeFileSync('data/onboarding_221.json', JSON.stringify(episodes, null, 2));
