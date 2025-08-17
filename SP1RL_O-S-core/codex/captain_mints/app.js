const key = 'cm_ledger';
let ledger = JSON.parse(localStorage.getItem(key) || '{"m":0,"items":[],"treasury":[]}');

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
  const item = {m: ledger.m, kappa: 0.000437, score: 0.73};
  ledger.items.push(item);
  if (item.score >= 0.72) {
    ledger.treasury.push(item);
  }
  save();
  update();
}

document.getElementById('fire').addEventListener('click', fire);

document.getElementById('teal-lock').textContent = Math.random().toString(36).slice(2, 8);
update();
