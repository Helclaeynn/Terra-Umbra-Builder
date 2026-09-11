const ROOT='./rulesets/terra-umbra/truth';
const get=async p=>{const r=await fetch(`${ROOT}/${p}`);if(!r.ok)throw new Error(`${p}: ${r.status}`);return r.json()};
const getOptional=async p=>{try{return await get(p)}catch{return null}};
const core=await get('core.json');
const S={nature:'humain',consciousness:'profane',choices:{hunterTradition:'aucune'},truthTalents:[],search:''};
let catalog=[];
const $=q=>document.querySelector(q);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
const nature=()=>core.natures.find(n=>n.id===S.nature)||core.natures[0];
const bought=id=>S.truthTalents.includes(id);
const talent=id=>catalog.find(t=>t.id===id);
const spent=()=>S.truthTalents.reduce((a,id)=>a+(talent(id)?.cost||0),0);
const remaining=()=>core.ptvInitial-spent();

async function loadCatalog(id){
  catalog=[];
  const mono=await getOptional(`talents/${id}.json`);
  if(Array.isArray(mono)) catalog=mono;
  else{
    const manifest=await getOptional(`talents/${id}/manifest.json`);
    if(manifest?.chunks?.length){
      const chunks=await Promise.all(manifest.chunks.map(f=>get(`talents/${id}/${f}`)));
      catalog=chunks.flat();
    }
  }
  pruneInvalid();
  render();
}

function choiceSelectedName(key){const c=nature().choices?.find(x=>x.key===key),v=S.choices[key];return c?.options?.find(x=>x.id===v)?.name||''}
function groupText(t){return norm(`${t.group||''} ${t.name||''}`)}
function choiceNeedles(){
  const n=nature(),a=[];
  for(const c of n.choices||[]){const name=choiceSelectedName(c.key);if(name)a.push(norm(name).split('—')[0].trim())}
  return a.filter(Boolean);
}
function isCommonGroup(t){const g=groupText(t);return g.includes('commun')||g.includes('nature')||g.includes('progression')||g.includes('maitrise')||g.includes('transcendance')||g.includes('doctrine commune')}
function branchVisible(t){
  if(S.nature==='humain'&&S.choices?.hunterTradition==='aucune')return false;
  const needles=choiceNeedles();
  if(!needles.length)return S.nature==='mage';
  if(S.nature==='mage')return true;
  const g=groupText(t);
  if(isCommonGroup(t))return true;
  return needles.some(n=>n&&g.includes(n));
}
function visibleTalent(t){
  if(!branchVisible(t))return false;
  const q=norm(S.search);
  return !q||norm(`${t.name} ${t.group} ${t.effect} ${t.prerequisiteName||''}`).includes(q);
}
function prereqId(t){
  if(t.prerequisite&&catalog.some(x=>x.id===t.prerequisite))return t.prerequisite;
  const raw=t.prerequisiteName||t.prerequisite||'';if(!raw)return '';
  const n=norm(raw).replace(/^prerequis /,'');
  const exact=catalog.find(x=>norm(x.name)===n);if(exact)return exact.id;
  const fuzzy=catalog.find(x=>n.includes(norm(x.name))||norm(x.name).includes(n));return fuzzy?.id||'';
}
function locked(t){const p=prereqId(t);return !!p&&!bought(p)}
function groupLabel(t){return t.group||'Talents de Vérité'}
function available(){return catalog.filter(visibleTalent)}
function pruneInvalid(){
  const branchIds=new Set(catalog.filter(branchVisible).map(t=>t.id));
  S.truthTalents=S.truthTalents.filter(id=>branchIds.has(id));
  let changed=true;
  while(changed){
    changed=false;
    for(const id of [...S.truthTalents]){
      const t=talent(id),p=t&&prereqId(t);
      if(!t||(p&&!bought(p))){S.truthTalents=S.truthTalents.filter(x=>x!==id);changed=true}
    }
  }
}

function setNature(id){
  S.nature=id;S.choices={};S.search='';S.truthTalents=[];
  for(const c of nature().choices||[]){if(c.optional&&c.options?.some(o=>o.id==='aucune'))S.choices[c.key]='aucune'}
  loadCatalog(id);
}
function setChoice(key,val){S.choices[key]=val;pruneInvalid();render()}
function toggleTalent(t,checked){
  if(checked){if(locked(t)||spent()+Number(t.cost||0)>core.ptvInitial)return;S.truthTalents.push(t.id)}
  else{S.truthTalents=S.truthTalents.filter(x=>x!==t.id);pruneInvalid()}
  render();
}

function renderNatureList(){const box=$('#natureList');box.innerHTML='';for(const n of core.natures){const b=document.createElement('button');b.className=`nature-btn ${n.id===S.nature?'selected':''}`;b.innerHTML=`<strong>${esc(n.name)}</strong><span>${esc(n.description||'')}</span>`;b.onclick=()=>setNature(n.id);box.append(b)}}
function renderMain(){
  const n=nature(),m=$('#truthMain');
  m.innerHTML=`<div class="section-title"><div><h2>${esc(n.name)}</h2><p>${esc(n.description||'')}</p></div><div class="kpi ${remaining()>=0?'good':'bad'}">PTV ${spent()} / ${core.ptvInitial}</div></div>`;
  const top=document.createElement('div');top.className='truth-controls';
  top.append(makeSelect('État de conscience',core.consciousness||[{id:'profane',name:'Profane'},{id:'eveille',name:'Éveillé'},{id:'initie',name:'Initié'}],S.consciousness,v=>{S.consciousness=v;render()}));m.append(top);
  if(n.choices?.length){const row=document.createElement('div');row.className='choice-row';for(const c of n.choices){row.append(makeSelect(c.label+(c.optional?' (optionnel)':''),c.options||[],S.choices[c.key]||'',v=>setChoice(c.key,v),c.optional?'— Aucun —':'— Choisir —'))}m.append(row)}
  m.append(ptvCard());
  if(n.freeTraits?.length){m.append(sectionTitle('Dons gratuits de Nature'));const g=document.createElement('div');g.className='trait-grid';for(const t of n.freeTraits){const d=document.createElement('div');d.className='trait';d.innerHTML=`<div class="trait-head"><strong>${esc(t.name)}</strong><span class="chip">${esc(t.access||'—')}</span></div><p>${esc(t.effect||'')}</p>`;g.append(d)}m.append(g)}
  m.append(sectionTitle('Talents, Voies & Traditions PTV'));
  const tb=document.createElement('div');tb.className='truth-toolbar';tb.innerHTML=`<input id="truthSearch" placeholder="Rechercher un Talent, une branche, un effet…" value="${esc(S.search)}"><span class="chip">${available().length} affiché(s) / ${catalog.length} importé(s)</span>`;m.append(tb);tb.querySelector('input').oninput=e=>{S.search=e.target.value;renderTalentsOnly()};
  const list=document.createElement('div');list.id='truthTalentList';m.append(list);renderTalentsOnly();
  if(!catalog.length)m.insertBefore(notice('Le squelette de cette Nature est disponible, mais son catalogue PTV n’est pas encore importé sur la branche de test.'),list);
}
function renderTalentsOnly(){const list=$('#truthTalentList');if(!list)return;list.innerHTML='';const groups=new Map();for(const t of available()){const g=groupLabel(t);if(!groups.has(g))groups.set(g,[]);groups.get(g).push(t)}
  if(!groups.size){list.append(notice(catalog.length?'Aucun Talent ne correspond aux choix/recherche actuels.':'Catalogue PTV non importé pour cette Nature.'));return}
  for(const [name,items] of groups){const d=document.createElement('details');d.className='truth-group';d.open=groups.size<8||items.some(x=>bought(x.id));const s=document.createElement('summary');s.textContent=`${name} (${items.length})`;d.append(s);const inner=document.createElement('div');inner.className='truth-list';for(const t of items)inner.append(talentRow(t));d.append(inner);list.append(d)}
}
function talentRow(t){const l=locked(t),is=bought(t.id),row=document.createElement('label');row.className=`truth-talent ${l?'locked':''}`;const p=prereqId(t),pn=p?talent(p)?.name:(t.prerequisiteName||'');row.innerHTML=`<input type="checkbox" ${is?'checked':''} ${l?'disabled':''}><div><strong>${esc(t.name)}</strong><div class="chips"><span class="chip cost">${Number(t.cost||0)} PTV</span><span class="chip">${esc(t.access||'—')}</span>${pn?`<span class="chip lock">Prérequis : ${esc(pn)}</span>`:''}${is?'<span class="chip status-ok">Acheté</span>':''}</div><span class="desc">${esc(t.effect||'')}</span></div><span>${is?'✓':''}</span>`;row.querySelector('input').onchange=e=>toggleTalent(t,e.target.checked);return row}
function ptvCard(){const d=document.createElement('div');d.className='ptv-card';d.innerHTML=`<div><strong>Réserve de Vérité</strong><div class="muted">Les PTV achètent une maîtrise, une Voie ou un Talent — jamais un objet. V/SR/R reste une condition d’utilisation en jeu.</div></div><div class="ptv-num ${remaining()<0?'status-bad':''}">${remaining()} PTV</div>`;return d}
function makeSelect(label,items,val,cb,placeholder='— Choisir —'){const f=document.createElement('div');f.className='field';f.innerHTML=`<label>${esc(label)}</label>`;const s=document.createElement('select');s.innerHTML=`<option value="">${esc(placeholder)}</option>`+items.map(x=>`<option value="${esc(x.id)}" ${x.id===val?'selected':''}>${esc(x.name)}</option>`).join('');s.onchange=e=>cb(e.target.value);f.append(s);return f}
function sectionTitle(t){const h=document.createElement('h3');h.className='subhead';h.textContent=t;return h}
function notice(t){const d=document.createElement('div');d.className='notice';d.textContent=t;return d}
function renderSummary(){const s=$('#truthSummary'),n=nature(),chosen=(n.choices||[]).map(c=>[c.label,choiceSelectedName(c.key)]).filter(x=>x[1]);s.innerHTML=`<div class="side-line"><span>Nature</span><strong>${esc(n.name)}</strong></div><div class="side-line"><span>Conscience</span><strong>${esc((core.consciousness||[]).find(x=>x.id===S.consciousness)?.name||S.consciousness)}</strong></div><div class="side-line"><span>PTV dépensés</span><strong>${spent()} / ${core.ptvInitial}</strong></div><div class="side-line"><span>Réserve</span><strong>${remaining()}</strong></div>`;for(const [a,b] of chosen)s.innerHTML+=`<div class="side-line"><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`;const o=document.createElement('div');o.className='owned';o.innerHTML='<h4>Capacités achetées</h4>';if(!S.truthTalents.length)o.innerHTML+='<div class="muted">Aucune.</div>';for(const id of S.truthTalents){const t=talent(id);if(t)o.innerHTML+=`<div class="owned-item"><strong>${esc(t.name)}</strong><small>${t.cost} PTV · condition ${esc(t.access||'—')}</small></div>`}s.append(o)}
function render(){renderNatureList();renderMain();renderSummary();localStorage.setItem('tuc-truth-preview',JSON.stringify(S))}
try{
  const saved=JSON.parse(localStorage.getItem('tuc-truth-preview')||'{}');
  if(Array.isArray(saved.talents)&&!Array.isArray(saved.truthTalents))saved.truthTalents=saved.talents;
  delete saved.talents;delete saved.revelation;
  Object.assign(S,saved);
  if(!S.choices)S.choices={};if(!Array.isArray(S.truthTalents))S.truthTalents=[];
}catch{}
try{await loadCatalog(S.nature)}catch(e){$('#loadError').innerHTML=`<div class="alert">Erreur de chargement : ${esc(e.message)}</div>`;render()}