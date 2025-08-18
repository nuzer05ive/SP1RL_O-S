const $ = (s)=>document.querySelector(s);
const log = (m)=>{ const el = $('#log'); el.textContent += (typeof m==='string'?m:JSON.stringify(m,null,2)) + '\n'; el.scrollTop = el.scrollHeight; };
const LS = (k,v)=> v===undefined ? JSON.parse(localStorage.getItem(k)||'null') : localStorage.setItem(k, JSON.stringify(v));

// Elements
const repoUser = $('#repoUser'); const repoName = $('#repoName');
const urlTpl = $('#urlTpl'); const ghToken = $('#ghToken');
const fetchBtn = $('#fetchBranches'); const branchSel = $('#branch');
const appPathSel = $('#appPath'); const customPath = $('#customPath');
const openBtn = $('#openApp'); const pinBtn = $('#pin'); const status = $('#status');
const list = $('#branchList'); const stage = $('#stage'); const current = $('#current'); const reloadBtn = $('#reload');

// Defaults + restore
const DFLT = {
  user: LS('sp1rl.user') || 'nuzer05ive',
  repo: LS('sp1rl.repo') || 'SP1RL_O-S',
  tpl:  LS('sp1rl.tpl')  || 'https://rawcdn.githack.com/{user}/{repo}/{branch}/SP1RL_O-S-core/{path}',
  branch: LS('sp1rl.branch') || 'core',
  appPath: LS('sp1rl.appPath') || 'codex/captain_mints/index.html',
  token: LS('sp1rl.ghToken') || ''
};
repoUser.value = DFLT.user; repoName.value = DFLT.repo; urlTpl.value = DFLT.tpl; ghToken.value = DFLT.token;

// Static list fallback
async function loadStaticBranches(){
  try{
    const res = await fetch('branches.json'); if(!res.ok) throw 0;
    const js = await res.json();
    return js.branches || [];
  }catch(_){ return ['core']; }
}

// Optional: GitHub API
async function fetchBranches(){
  const user = repoUser.value.trim(), repo = repoName.value.trim();
  const token = ghToken.value.trim();
  const url = `https://api.github.com/repos/${user}/${repo}/branches?per_page=100`;
  const headers = token? { Authorization: `Bearer ${token}` } : {};
  const r = await fetch(url, { headers });
  if(!r.ok) throw new Error('GitHub API error '+r.status);
  const data = await r.json();
  return data.map(b=>b.name);
}

function fillBranches(arr){
  branchSel.innerHTML = arr.map(b=>`<option value="${b}">${b}</option>`).join('');
  const want = DFLT.branch; if(arr.includes(want)) branchSel.value = want;
  list.innerHTML = arr.map(b=>`<li>${b}</li>`).join('');
}

async function init(){
  status.textContent = 'idle';
  const arr = await loadStaticBranches();
  fillBranches(arr);
}

async function maybeFetch(){
  status.textContent = 'fetching…';
  try{
    const arr = await fetchBranches();
    fillBranches(arr);
    LS('sp1rl.ghToken', ghToken.value.trim());
    status.textContent = 'ok';
    log({branches: arr.length});
  }catch(e){
    status.textContent = 'warn';
    log('GitHub fetch failed; using static list. '+e);
  }
}

function buildUrl(branch, path){
  const user = repoUser.value.trim(), repo = repoName.value.trim();
  const tpl = urlTpl.value.trim();
  return tpl.replace('{user}', user).replace('{repo}', repo)
            .replace('{branch}', branch).replace('{path}', path);
}

function openApp(){
  const branch = branchSel.value;
  const path = appPathSel.value || customPath.value.trim();
  if(!branch || !path){ log('Pick branch and app path'); return; }
  const href = buildUrl(branch, path);
  stage.src = href;
  current.textContent = `${branch} — ${path}`;
  LS('sp1rl.user', repoUser.value.trim());
  LS('sp1rl.repo', repoName.value.trim());
  LS('sp1rl.tpl', urlTpl.value.trim());
  LS('sp1rl.branch', branch);
  LS('sp1rl.appPath', appPathSel.value || path);
}

// Wire UI
fetchBtn.onclick = maybeFetch;
openBtn.onclick = openApp;
reloadBtn.onclick = ()=> stage.src && (stage.src = stage.src);
pinBtn.onclick = ()=>{ log('Pinned current selection'); };

// Auto open last selection
init().then(()=>{
  if(DFLT.branch && DFLT.appPath){
    if(DFLT.appPath !== 'codex/captain_mints/index.html') customPath.value = DFLT.appPath;
    openApp();
  }
});
status.textContent = 'ready';
