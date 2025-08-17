const key = 'cm_ledger';
let ledger = JSON.parse(localStorage.getItem(key) || '{}');
ledger = Object.assign({m:0, items:[], treasury:[], streams:{d:[], d1:[], d2:[], d3:[]}}, ledger);
const prefKey = 'cm_pref';

const mathMod = MODS['teal-math@stable'] || {};
const plotMod = MODS['plots@stable'] || {};

const essenceScore = mathMod.essenceScore || ((k) => 0.73);
const updateStreams = mathMod.updateStreams || (() => {});
const tealLock = mathMod.tealLock || (() => false);
const drawSpiral = plotMod.drawSpiral || (() => {});
const drawHinges = plotMod.drawHinges || (() => {});

const badge = document.getElementById('teal-lock');
if (!mathMod.essenceScore) {
  badge.textContent = Math.random().toString(36).slice(2, 8);
}

function save() {
  localStorage.setItem(key, JSON.stringify(ledger));
}

function update() {
  document.getElementById('m-count').textContent = ledger.m;
  document.getElementById('t-count').textContent = ledger.treasury.length;
  const list = document.getElementById('treasury');
  list.innerHTML = '';
  ledger.treasury.forEach(i => {
    const li = document.createElement('li');
    li.textContent = `#${i.m} κ=${i.kappa}`;
    list.appendChild(li);
  });
}

function fire() {
  ledger.m += 1;
  const kappa = 0.000437;
  const score = essenceScore(kappa, ledger.streams);
  updateStreams(ledger.streams, score);
  const item = {m: ledger.m, kappa, score};
  item.treasury = score >= 0.72;
  ledger.items.push(item);
  if (item.treasury) {
    ledger.treasury.push(item);
  }
  save();
  update();
  drawSpiral(document.getElementById('spiral'), ledger.items);
  drawHinges(document.getElementById('chart'), ledger.streams);
  const locked = tealLock(ledger.streams);
  if (mathMod.essenceScore) {
    badge.textContent = locked ? 'locked' : '';
  }
  if (ledger.m === 8) {
    const hasCanary = MODS['teal-math@canary'] || MODS['plots@canary'];
    localStorage.setItem(prefKey, JSON.stringify({prefer: hasCanary ? '@canary' : '@stable'}));
  }
}

document.getElementById('fire').addEventListener('click', fire);
update();
drawSpiral(document.getElementById('spiral'), ledger.items);
drawHinges(document.getElementById('chart'), ledger.streams);
