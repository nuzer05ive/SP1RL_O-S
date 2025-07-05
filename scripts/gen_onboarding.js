const fs = require('fs');
const { solveSpiralTime } = require('../libs/spiral-time-ts');

const episodes = [];
for (let i = 0; i <= 221; i++) {
  const res = solveSpiralTime('1970-01-01', i);
  episodes.push({
    episode_num: i,
    phi_power: i,
    node: res.node,
    lap: res.lap,
    dt: res.t_seconds,
    glyph: '',
    lore: ''
  });
}
fs.writeFileSync('data/onboarding_221.json', JSON.stringify(episodes, null, 2));
