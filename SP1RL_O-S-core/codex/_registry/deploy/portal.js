const logEl = document.getElementById('logs');
function log(...args) {
  logEl.textContent += args.join(' ') + '\n';
  logEl.scrollTop = logEl.scrollHeight;
}

const tabs = document.querySelectorAll('.tab');
const tabBtns = document.querySelectorAll('.tab-btn');
for (const btn of tabBtns) {
  btn.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tabBtns.forEach(b => b.classList.remove('active'));
    document.getElementById(btn.dataset.tab).classList.add('active');
    btn.classList.add('active');
  });
}

let manifest = { modules: [] };
let overrides = {};
const moduleSelect = document.getElementById('module-select');
const statusChip = document.getElementById('status');
const HOST = window.opener?.SP1RL || parent.SP1RL || window.SP1RL;

async function loadManifest() {
  try {
    manifest = await fetch('../manifest.json').then(r => r.json());
    renderModules();
    statusChip.textContent = 'OK';
    statusChip.className = 'chip ok';
  } catch (e) {
    log('manifest missing, safe mode');
    statusChip.textContent = 'WARN';
    statusChip.className = 'chip warn';
  }
}

function renderModules() {
  const list = document.getElementById('module-list');
  list.innerHTML = '';
  moduleSelect.innerHTML = '';
  (manifest.modules || []).forEach(m => {
    const li = document.createElement('li');
    li.textContent = `${m.id} → ${m.entry}`;
    list.appendChild(li);
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.id;
    moduleSelect.appendChild(opt);
  });
}

loadManifest();

// drag & drop
let currentFile = null;
const dropzone = document.getElementById('dropzone');
dropzone.addEventListener('dragover', e => {
  e.preventDefault();
});
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.name.endsWith('.js')) {
    currentFile = file;
    log('file ready:', file.name);
  } else {
    log('not a .js file');
  }
});

// IndexedDB store
function putFile(id, blob) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('sp1rl-deploy', 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('files');
    };
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction('files', 'readwrite');
      tx.objectStore('files').put({ blob, ts: Date.now() }, id);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    };
  });
}

function getOverrides() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('sp1rl-deploy', 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('files');
    };
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction('files');
      const store = tx.objectStore('files');
      const out = {};
      store.openCursor().onsuccess = e => {
        const cur = e.target.result;
        if (cur) {
          out[cur.key] = cur.value;
          cur.continue();
        }
      };
      tx.oncomplete = () => resolve(out);
    };
  });
}

// Hot swap
async function hotSwap(persist) {
  const id = moduleSelect.value;
  if (!id || !currentFile) return;
  const blob = currentFile;
  const url = URL.createObjectURL(blob);
  overrides[id] = { blob, url };
  if (persist && navigator.serviceWorker?.controller) {
    const path = `/sp1rl-overrides/${id}.js`;
    navigator.serviceWorker.controller.postMessage({ op: 'put', path, blob });
    overrides[id].url = path;
    const m = (manifest.modules || []).find(m => m.id === id);
    if (m) {
      m.entry = path;
      localStorage.setItem('manifestShadow', JSON.stringify(manifest));
    }
  }
  await HOST.hotSwap(id, overrides[id].url);
  await putFile(id, blob);
  log('hot swapped', id);
}

document.getElementById('load-ram').addEventListener('click', () => hotSwap(false));
document.getElementById('persist-sw').addEventListener('click', () => hotSwap(true));

// ZIP export
async function exportZip() {
  const JSZip = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js').then(m => m.default);
  const zip = new JSZip();
  const updated = JSON.parse(JSON.stringify(manifest));
  Object.keys(overrides).forEach(id => {
    const m = updated.modules.find(m => m.id === id);
    const path = overrides[id].url.startsWith('/sp1rl-overrides/') ? overrides[id].url : `/sp1rl-overrides/${id}.js`;
    if (m) m.entry = path;
    zip.file(path.replace(/^\//, ''), overrides[id].blob);
  });
  zip.file('manifest.json', JSON.stringify(updated, null, 2));
  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sp1rl-deploy.zip';
  a.click();
  log('Export ZIP ready');
}

document.getElementById('export-zip').addEventListener('click', exportZip);

// Netlify deploy
async function deployNetlify() {
  const token = localStorage.getItem('netlifyToken');
  const siteId = localStorage.getItem('netlifySite');
  if (!token || !siteId) {
    log('missing token or siteId');
    return;
  }
  try {
    const form = new FormData();
    const updated = JSON.parse(JSON.stringify(manifest));
    Object.keys(overrides).forEach(id => {
      const m = updated.modules.find(m => m.id === id);
      if (m) m.entry = overrides[id].url;
      form.append(`files/${overrides[id].url}`, overrides[id].blob);
    });
    form.append('files/manifest.json', new Blob([JSON.stringify(updated, null, 2)], { type: 'application/json' }));
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });
    log('netlify status', res.status);
  } catch (e) {
    log('netlify deploy blocked, use Export ZIP');
  }
}

document.getElementById('deploy-netlify').addEventListener('click', deployNetlify);

// settings
const tokenInput = document.getElementById('netlify-token');
const siteInput = document.getElementById('netlify-site');
const useSw = document.getElementById('use-sw');

tokenInput.value = localStorage.getItem('netlifyToken') || '';
siteInput.value = localStorage.getItem('netlifySite') || '';
useSw.checked = localStorage.getItem('useSW') === '1';

function saveSettings() {
  localStorage.setItem('netlifyToken', tokenInput.value);
  localStorage.setItem('netlifySite', siteInput.value);
  localStorage.setItem('useSW', useSw.checked ? '1' : '0');
  if (useSw.checked) {
    navigator.serviceWorker.register('sw.js');
  }
}

tokenInput.addEventListener('change', saveSettings);
siteInput.addEventListener('change', saveSettings);
useSw.addEventListener('change', saveSettings);
if (useSw.checked) {
  navigator.serviceWorker.register('sw.js');
}

// BUS integration
function publish(ev) {
  window.dispatchEvent(new CustomEvent('SP1RL_BUS_V1', { detail: ev }));
}
window.addEventListener('SP1RL_BUS_V1', e => {
  log('BUS', JSON.stringify(e.detail));
});

export {}; // ensure module
