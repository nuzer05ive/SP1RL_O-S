const $=s=>document.querySelector(s); const TAU=Math.PI*2, PHI=(1+Math.sqrt(5))/2, GA=TAU*(1-1/PHI);
const state={ user:localStorage.getItem('sp.user')||'nuzer05ive', repo:localStorage.getItem('sp.repo')||'SP1RL_O-S',
  tpl:localStorage.getItem('sp.tpl')||'https://rawcdn.githack.com/{user}/{repo}/{branch}/SP1RL_O-S-core/{path}',
  token:localStorage.getItem('sp.token')||'', branch:localStorage.getItem('sp.branch')||'core',
  mod:localStorage.getItem('sp.mod')||'codex/captain_mints/index.html', custom:localStorage.getItem('sp.custom')||'' };
const els={ repoUser:$('#repoUser'),repoName:$('#repoName'),urlTpl:$('#urlTpl'),token:$('#ghToken'),
  fetchBtn:$('#fetchBranches'),branch:$('#branch'),module:$('#module'),customPath:$('#customPath'),
  status:$('#status'),hint:$('#hint'), portalBtn:$('#portalBtn'), overlay:$('#overlay'),
  stage:$('#stage'), targetLbl:$('#targetLbl'), close:$('#closeOverlay'), settingsBtn:$('#settingsBtn') };
[els.repoUser.value,els.repoName.value,els.urlTpl.value,els.token.value]=[state.user,state.repo,state.tpl,state.token];
const scope=document.getElementById('scope'), R={outer:410, mid:300, inner:190}, C={x:500,y:500};
const angles={ outer:0, mid:0, inner:0 }, vel={ outer:0.00042, mid:0.00026, inner:0.00068 }, drift=0.000437;
let branches=['core'], modules=['codex/captain_mints/index.html','codex/_registry/deploy/portal.html','codex/home/index.html'], timeSlots=Array.from({length:21},(_,i)=>i);
function buildUrl(branch,path){ return state.tpl.replace('{user}',state.user).replace('{repo}',state.repo).replace('{branch}',branch).replace('{path}',path); }
async function loadStatic(){ try{ const r=await fetch('branches.json'); const j=await r.json(); branches=j.branches||branches; }catch{} fillBranchSel(); }
function fillBranchSel(){ els.branch.innerHTML=branches.map(b=>`<option value="${b}">${b}</option>`).join(''); els.branch.value=state.branch; }
async function fetchBranches(){ if(!state.token){els.status.textContent='no token'; return;}
  els.status.textContent='fetching…'; try{ const r=await fetch(`https://api.github.com/repos/${state.user}/${state.repo}/branches?per_page=100`,{headers:{Authorization:`Bearer ${state.token}`}}); const d=await r.json(); branches=d.map(b=>b.name); fillBranchSel(); els.status.textContent='ok'; }catch(e){ els.status.textContent='error'; } }
function setLS(){ localStorage.setItem('sp.user',state.user); localStorage.setItem('sp.repo',state.repo);
  localStorage.setItem('sp.tpl',state.tpl); localStorage.setItem('sp.token',state.token);
  localStorage.setItem('sp.branch',state.branch); localStorage.setItem('sp.mod',state.mod);
  localStorage.setItem('sp.custom',state.custom); }
function polar(angle,r){ return {x:C.x+Math.cos(angle)*r,y:C.y+Math.sin(angle)*r}; }
function drawRing(g, cnt, r, a0, tickClass, labels){ g.innerHTML=''; const step=TAU/cnt;
  for(let i=0;i<cnt;i++){ const a=a0 + i*step, p1=polar(a,r-12), p2=polar(a,r+12);
    const ln=document.createElementNS('http://www.w3.org/2000/svg','line'); ln.setAttribute('x1',p1.x); ln.setAttribute('y1',p1.y); ln.setAttribute('x2',p2.x); ln.setAttribute('y2',p2.y); ln.setAttribute('class','tick'); ln.setAttribute('vector-effect','non-scaling-stroke');
    ln.setAttribute('stroke-width','2'); ln.classList.add(tickClass); g.appendChild(ln);
    if(labels && labels[i]){ const t=polar(a,r+26); const tx=document.createElementNS('http://www.w3.org/2000/svg','text'); tx.textContent=labels[i].slice(0,14); tx.setAttribute('x',t.x); tx.setAttribute('y',t.y); tx.setAttribute('class','label'); tx.setAttribute('text-anchor','middle'); g.appendChild(tx); }
  } }
function render(){ drawRing(document.getElementById('outerRing'), Math.max(branches.length,12), R.outer, angles.outer, 'outer', branches);
  const mods=modules.map(m=>m.split('/').slice(-2)[0]); drawRing(document.getElementById('midRing'), Math.max(mods.length,8), R.mid, angles.mid, 'mid', mods);
  drawRing(document.getElementById('innerRing'), timeSlots.length, R.inner, angles.inner, 'inner'); updateLock(); }
function updateLock(){ const e=0.035; const a=((x)=>((x%TAU)+TAU)%TAU);
  const d1=Math.min(Math.abs(a(angles.outer-angles.mid)), TAU-Math.abs(a(angles.outer-angles.mid)));
  const d2=Math.min(Math.abs(a(angles.mid-angles.inner)), TAU-Math.abs(a(angles.mid-angles.inner)));
  const locked=(d1<e && d2<e); els.portalBtn.style.opacity=locked?1:0.35; els.portalBtn.disabled=!locked;
  document.getElementById('tealLock').style.opacity=locked?1:0.15; }
let last=0; function tick(t){ if(!last) last=t; const dt=(t-last); last=t;
  angles.outer += vel.outer*dt + drift*0.2; angles.mid += vel.mid*dt + drift*0.15; angles.inner += vel.inner*dt + drift*0.1;
  render(); requestAnimationFrame(tick); }
// gestures
function attachGestures(){ let a0=null, ring=''; scope.addEventListener('touchstart',e=>{ const p=e.touches[0]; const dx=p.clientX-window.innerWidth/2, dy=p.clientY-0.44*window.innerHeight; const r=Math.hypot(dx,dy);
    ring = r>250? 'outer' : r>180? 'mid' : 'inner'; a0=Math.atan2(dy,dx); e.preventDefault(); },{passive:false});
  scope.addEventListener('touchmove',e=>{ if(a0==null) return; const p=e.touches[0]; const dx=p.clientX-window.innerWidth/2, dy=p.clientY-0.44*window.innerHeight; const a=Math.atan2(dy,dx); const da=a-a0; a0=a; angles[ring]+=da; e.preventDefault(); },{passive:false});
  scope.addEventListener('touchend',()=>{ a0=null; }); }
function currentPath(){ return (els.module.value || state.mod) || state.custom || els.customPath.value.trim(); }
function openPortal(){ const path = (els.module.value===''? els.customPath.value.trim() : els.module.value) || state.mod;
  const href = buildUrl(state.branch, path); els.targetLbl.textContent = `${state.branch} · ${path}`; els.stage.src = href; els.overlay.classList.remove('hidden'); }
// UI wire
els.fetchBranches.onclick=()=>{ state.token=els.token.value.trim(); setLS(); fetchBranches(); };
els.repoUser.oninput=()=>{ state.user=els.repoUser.value.trim(); setLS(); };
els.repoName.oninput=()=>{ state.repo=els.repoName.value.trim(); setLS(); };
els.urlTpl.oninput = ()=>{ state.tpl=els.urlTpl.value.trim(); setLS(); };
els.branch.onchange=()=>{ state.branch=els.branch.value; setLS(); };
els.module.onchange=()=>{ state.mod=els.module.value; setLS(); };
els.customPath.oninput=()=>{ state.custom=els.customPath.value.trim(); setLS(); };
$('#savePin').onclick=()=>{ setLS(); els.hint.textContent='Pinned.'; setTimeout(()=>els.hint.textContent='',1500); };
els.portalBtn.onclick=openPortal; els.close.onclick=()=>{ els.overlay.classList.add('hidden'); };
els.settingsBtn.onclick=()=>{ document.querySelector('.panel').scrollIntoView({behavior:'smooth'}); };
// init
(async()=>{ await loadStatic(); render(); attachGestures(); requestAnimationFrame(tick);
  // restore selections
  els.branch.value=state.branch; const opt=[...els.module.options].find(o=>o.value===state.mod); if(!opt) els.customPath.value=state.mod;
})();
