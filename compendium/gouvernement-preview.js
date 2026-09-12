const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const visualSrc=v=>String(v??'').replace('assets/gouvernement-preview/grande-californie.jpg','assets/gouvernement-preview/grande-californie.webp');
let DB=null;
const slugFromHash=()=>decodeURIComponent(location.hash.replace(/^#\/?/,''))||'gouvernement-grande-californie';
async function loadDB(){
  const bin=Uint8Array.from(atob(window.GOUVERNEMENT_PREVIEW_GZ||''),c=>c.charCodeAt(0));
  const stream=new Blob([bin]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(stream).text());
}
function renderNav(){
  const nav=$('#nav');nav.innerHTML='';let g='';
  for(const p of DB.pages){
    if(p.group!==g){g=p.group;const h=document.createElement('div');h.className='nav-group';h.textContent=g;nav.appendChild(h)}
    const a=document.createElement('a');a.href='#/'+encodeURIComponent(p.id);a.dataset.id=p.id;a.innerHTML=`<span>${esc(p.title)}</span>`;nav.appendChild(a)
  }
}
function render(){
  const id=slugFromHash();const p=DB.pages.find(x=>x.id===id)||DB.pages[0];
  document.title=`${p.title} · Preview TUC`;
  document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('active',a.dataset.id===p.id));
  const flags=(p.flags||[]).map(x=>`<div class="flag-box"><strong>À statuer avant intégration</strong><br>${esc(x)}</div>`).join('');
  const canon=(p.canon||[]).map(x=>`<div class="canon-box"><strong>Arbitrage / confirmation récente</strong><br>${esc(x)}</div>`).join('');
  const visuals=p.visuals?.length?`<div class="preview-visuals${p.visualKind==='map'?' maps':''}">${p.visuals.map((v,i)=>`<img loading="lazy" src="${esc(visualSrc(v))}" alt="Illustration source ${i+1} — ${esc(p.title)}">`).join('')}</div>`:'';
  const scheme=p.structure?.length?`<section class="scheme"><h2>Structure · synthèse documentaire</h2><div class="scheme-flow">${p.structure.map(n=>`<div class="scheme-node level-${n.level??1}"><strong>${esc(n.label)}</strong><span>${esc(n.note||'')}</span></div>`).join('')}</div></section>`:'';
  const sections=(p.sections||[]).map(s=>`<section class="preview-section section"><h2>${esc(s.title)}</h2>${(s.blocks||[]).map(b=>`<p class="body-p${b.type==='list'?' list':''}">${esc(b.text)}</p>`).join('')}</section>`).join('');
  $('#content').innerHTML=`<header class="page-head preview-hero"><div class="eyebrow">${esc(p.group)} · preview recette</div><h1>${esc(p.title)}</h1><p>${esc(p.summary)}</p><div class="preview-meta"><span class="badge source">${esc(p.source)}</span><span class="badge">${esc(p.target)}</span><span class="badge canon">Lore non-personnage</span></div></header>${visuals}${canon}${flags}${scheme}${sections}<div class="preview-foot">Source principale : ${esc(DB.source)} · Arbitrage : ${esc(DB.arbitration)} · ${DB.excludedProfiles} profils individuels détectés et volontairement exclus du chantier Lore.</div>`;
  window.scrollTo({top:0,behavior:'instant'});
}
function applyFilter(){const q=$('#filter').value.trim().toLowerCase();document.querySelectorAll('#nav a').forEach(a=>{const p=DB.pages.find(x=>x.id===a.dataset.id);a.classList.toggle('hidden-nav',!!q&&!`${p.title} ${p.group} ${p.summary}`.toLowerCase().includes(q))})}
(async()=>{try{DB=await loadDB();if(!DB||!Array.isArray(DB.pages)||DB.pages.length!==18)throw new Error('18 pages attendues');renderNav();render();$('#filter').addEventListener('input',applyFilter);window.addEventListener('hashchange',render)}catch(e){console.error(e);$('#content').innerHTML=`<div class="notice">Preview invalide : ${esc(e.message)}</div>`}})();
