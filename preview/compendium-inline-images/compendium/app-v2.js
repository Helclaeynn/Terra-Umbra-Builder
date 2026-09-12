import {loadPnjExtensions,hydratePnjArticle,pnjCompletenessLabel} from './pnj.js';

const $=s=>document.querySelector(s);
const main=$('#main'),toc=$('#tocBox'),nav=$('#mainNav'),searchInput=$('#searchInput');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

let manifest=null;
const fileCache=new Map(),articleCache=new Map(),bundleCache=new Map(),bundleForFile=new Map();
const CATEGORY_ORDER=['Règles','Réalité','Vérité','Organisations','Personnages','Bestiaire'];
const statusClass=s=>['canon_recent','canon_enrichi'].includes(s)?'canon':s==='source_detaillee'?'source':s==='obsolete'?'obsolete':'';
const statusLabel=s=>manifest?.statusLabels?.[s]||s||'';

function routeTo(x){location.hash=x.startsWith('#')?x:'#'+x}
function articleMeta(id){return manifest?.articles?.find(a=>a.id===id)}

async function decodePackedResponse(r,label){
  if(!r.ok)throw new Error(`${label} · HTTP ${r.status}`);
  const b64=(await r.text()).replace(/\s+/g,'');
  let bin;try{bin=atob(b64)}catch(error){throw new Error(`${label} · Base64 invalide`)}
  const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  if(!('DecompressionStream' in window))throw new Error('Ce navigateur ne prend pas en charge la décompression du Compendium.');
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(stream).text());
}
async function loadPacked(file){return decodePackedResponse(await fetch(`data/${file}`),file)}
async function loadBundle(n){
  if(bundleCache.has(n))return bundleCache.get(n);
  const p=loadPacked(`bundle-${n}.json.gz.b64`);bundleCache.set(n,p);return p;
}
function cacheArticles(rows){for(const a of rows||[])if(a?.id)articleCache.set(a.id,a);return rows||[]}
async function loadFile(file){
  if(fileCache.has(file))return fileCache.get(file);
  const p=(async()=>{
    const n=bundleForFile.get(file);let data;
    if(n){
      const bundle=await loadBundle(n);data=bundle?.[file];
    }else{
      const direct=await loadPacked(file);
      data=Array.isArray(direct)?direct:(Array.isArray(direct?.[file])?direct[file]:(Array.isArray(direct?.articles)?direct.articles:null));
    }
    if(!Array.isArray(data))throw new Error(`Dataset illisible : ${file}`);
    return cacheArticles(data);
  })();
  fileCache.set(file,p);return p;
}
async function loadArticle(id){
  let a=articleCache.get(id);
  if(!a){const meta=articleMeta(id);if(!meta)return null;if(meta.file)await loadFile(meta.file);a=articleCache.get(id)||null}
  if(a?.category==='Personnages'&&a.pnj?.externalPath)await hydratePnjArticle(a);
  return a;
}
async function loadAll(){
  const files=[...new Set(Object.values(manifest.sets||{}).flat())];
  const settled=await Promise.allSettled(files.map(loadFile));
  const failed=settled.filter(x=>x.status==='rejected');if(failed.length)console.warn(`${failed.length} pack(s) du corpus de base n'ont pas pu être indexés`,failed.map(x=>x.reason));
  return [...articleCache.values()];
}

function ensureCategories(){
  const found=new Set((manifest.articles||[]).map(a=>a.category).filter(Boolean));
  const base=new Set(manifest.categories||[]);for(const c of found)base.add(c);
  manifest.categories=[...base].sort((a,b)=>{const ia=CATEGORY_ORDER.indexOf(a),ib=CATEGORY_ORDER.indexOf(b);if(ia<0&&ib<0)return a.localeCompare(b,'fr');if(ia<0)return 1;if(ib<0)return-1;return ia-ib});
}
function renderNav(active=''){
  const counts={};for(const a of manifest.articles||[])counts[a.category]=(counts[a.category]||0)+1;
  nav.innerHTML=`<a href="#/home" class="${active==='home'?'active':''}">Accueil</a><hr>${manifest.categories.map(c=>`<a href="#/category/${encodeURIComponent(c)}" class="${active===c?'active':''}"><span>${esc(c)}</span><span class="count">${counts[c]||0}</span></a>`).join('')}<hr><a href="#/search" class="${active==='search'?'active':''}">Recherche globale</a>`;
}
function setToc(html=''){toc.innerHTML=html}
function metaBadges(a){return `<div class="meta"><span class="badge ${statusClass(a.status)}">${esc(statusLabel(a.status))}</span>${a.audience==='mj'?'<span class="badge mj">Contenu MJ</span>':''}${a.pnj?.completeness?`<span class="badge pnj-state ${esc(a.pnj.completeness)}">${esc(pnjCompletenessLabel(a.pnj.completeness))}</span>`:''}${(a.tags||[]).filter(Boolean).slice(0,7).map(t=>`<span class="badge">${esc(t)}</span>`).join('')}</div>`}
function flattenText(a){const bits=[a.title,...(a.tags||[]),a.source||''];if(a.pnj)bits.push(a.pnj.race||'',a.pnj.age||'',a.pnj.origine||'',a.pnj.statut||'',a.pnj.statutVerite||'');for(const s of a.sections||[]){bits.push(s.title||'');for(const b of s.blocks||[]){if(b.type==='p')bits.push(b.text||'');else if(b.type==='table')for(const r of b.rows||[])bits.push(...r)}}return bits.join(' ')}

const linkTerms=['Grande Californie','Los Angeles','LAUS','CBII','CNAD','AIDH','GAAC','Pègre','Crawlers','Underlife','Vladivostokskaïa','Neurodive','Voile','Hologramme','Ombremonde','Vampires','Garous','Mages','Aseryns','Exilés','Extrals','Angelus','Daemons','Chasseurs','Fléaux','Revenants','Katanja','Morrighan'];
function linkify(raw){let out=esc(raw);for(const term of linkTerms){const re=new RegExp(`\\b(${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})\\b`,'gi');out=out.replace(re,m=>`<a class="wiki-link" href="#/search?q=${encodeURIComponent(term)}">${m}</a>`)}return out}
function blockHtml(b){if(b.type==='table')return `<div class="doc-table-wrap"><table class="doc-table"><tbody>${(b.rows||[]).map(r=>`<tr>${r.map(c=>`<td>${linkify(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;const style=(b.style||'').toLowerCase();const cls=style.includes('list')?' list':style.includes('spec')?' spec':style.includes('callout')?' callout':style.includes('lore')?' lore':'';return `<p class="body-p${cls}">${linkify(b.text||'')}</p>`}
function sectionHtml(s){const lv=Math.min(5,Math.max(2,Number(s.level)||3)),content=(s.blocks||[]).map(blockHtml).join('');if(s.status==='obsolete')return `<section id="${esc(s.id)}" class="section"><div class="obsolete-block"><strong>${esc(s.title)} — source explicitement signalée comme obsolète</strong><div>${content}</div></div></section>`;const inner=`<section id="${esc(s.id)}" class="section"><h${lv}>${esc(s.title)}</h${lv}>${content}</section>`;return s.audience==='mj'?`<details class="mj-block"><summary>${esc(s.title)}</summary><div class="mj-inner">${inner}</div></details>`:inner}
function articleSnippet(a,limit=180){const t=flattenText(a).replace(/\s+/g,' ').trim();return t.slice(0,limit)+(t.length>limit?'…':'')}
function categoryDescription(c){return c==='Règles'?'Moteur commun, combat, santé, ressources et progression.':c==='Réalité'?'Grande Californie, société, technologie, économie et vie quotidienne.':c==='Vérité'?'Voile, peuples, traditions, pouvoirs, lieux et cosmologie cachée.':c==='Organisations'?'Institutions, corporations, Pègre, Crawlers et réseaux de Vérité.':c==='Personnages'?'PNJ issus des dossiers détaillés, mini-BG et personnages encore à compléter.':'Profils de créatures, PNJ génériques et figures de scénario.'}

function pnjFactsHtml(a){if(a.category!=='Personnages'||!a.pnj)return'';const p=a.pnj,items=[['Âge',p.age],['Origine',p.origine],['Statut',p.statut],['Race / nature connue',p.race]].filter(x=>x[1]);return items.length?`<div class="pnj-facts">${items.map(([k,v])=>`<div><span>${esc(k)}</span><strong>${linkify(v)}</strong></div>`).join('')}</div>`:''}
function statObjectHtml(obj){if(!obj)return'<p class="muted">Statistiques non encore établies.</p>';if(typeof obj==='string')return `<p>${linkify(obj)}</p>`;if(Array.isArray(obj))return `<ul>${obj.map(v=>`<li>${linkify(typeof v==='string'?v:JSON.stringify(v))}</li>`).join('')}</ul>`;return `<div class="pnj-stat-grid">${Object.entries(obj).map(([k,v])=>`<div><span>${esc(k)}</span><strong>${esc(typeof v==='object'?JSON.stringify(v):v)}</strong></div>`).join('')}</div>`}
function pnjMjHtml(a){if(a.category!=='Personnages'||!a.pnj)return'';const p=a.pnj,stats=a.stats||p.stats;if(!p.statutVerite&&!stats)return'';return `<details class="mj-block pnj-mj"><summary>Dossier MJ · Vérité & statistiques</summary><div class="mj-inner">${p.statutVerite?`<div class="pnj-secret-line"><span>Statut / nature de Vérité</span><strong>${linkify(p.statutVerite)}</strong></div>`:''}<div class="pnj-stat-columns"><section><h3>Profil Réalité</h3>${statObjectHtml(stats?.reality)}</section><section><h3>Profil Vérité</h3>${statObjectHtml(stats?.truth)}</section></div></div></details>`}

async function showHome(){
  renderNav('home');setToc('');const counts={};for(const a of manifest.articles||[])counts[a.category]=(counts[a.category]||0)+1;
  main.innerHTML=`<div class="page-head"><div class="eyebrow">BASE DOCUMENTAIRE TUC</div><h1>Compendium</h1><p>${manifest.articles.length.toLocaleString('fr-FR')} entrées actuellement indexées. Les dossiers détaillés constituent la matière encyclopédique ; les livres récents contrôlent les arbitrages et mécaniques statués.</p></div><div class="notice"><strong>Principe éditorial :</strong> un détail compatible reste du lore ; une décision récente explicite prime ; un conflit non tranché est signalé au lieu d'être gommé.</div><div class="category-grid">${manifest.categories.map(c=>`<a class="category-card" href="#/category/${encodeURIComponent(c)}"><strong>${esc(c)}</strong><p>${categoryDescription(c)}</p><span class="count">${counts[c]||0} entrées →</span></a>`).join('')}</div>`;
}
async function showCategory(cat){
  renderNav(cat);setToc('');const list=(manifest.articles||[]).filter(a=>a.category===cat).sort((a,b)=>a.title.localeCompare(b.title,'fr',{numeric:true,sensitivity:'base'}));
  main.innerHTML=`<div class="page-head"><div class="eyebrow">COMPENDIUM · ${esc(cat)}</div><h1>${esc(cat)}</h1><p>${list.length} entrées actuellement indexées.</p></div><div class="field category-filter"><label for="categoryFilter">Filtrer cette rubrique</label><input id="categoryFilter" type="search" placeholder="Nom, source, tag…" autocomplete="off"></div><div id="categoryVisible" class="search-status">${list.length} entrées affichées</div><div class="article-list">${list.map(a=>`<a class="article-card" data-filter="${esc(norm(`${a.title} ${a.source} ${(a.tags||[]).join(' ')} ${a.pnj?.completeness||''}`))}" href="#/article/${encodeURIComponent(a.id)}"><h3>${esc(a.title)}</h3><p>${esc(a.source||'')} · ${esc(statusLabel(a.status))}${a.pnj?.completeness?` · ${esc(pnjCompletenessLabel(a.pnj.completeness))}`:''}${a.audience==='mj'?' · MJ':''}</p></a>`).join('')}</div>`;
  const input=$('#categoryFilter'),cards=[...main.querySelectorAll('.article-card')],visible=$('#categoryVisible');input?.addEventListener('input',()=>{const q=norm(input.value);let n=0;for(const card of cards){const ok=!q||q.split(' ').every(t=>card.dataset.filter.includes(t));card.style.display=ok?'block':'none';if(ok)n++}visible.textContent=`${n} entrée${n>1?'s':''} affichée${n>1?'s':''}`});
}
function relatedTo(a){const text=norm(flattenText(a)),tags=new Set((a.tags||[]).map(norm));return (manifest.articles||[]).filter(x=>x.id!==a.id&&x.audience!=='mj').map(x=>{let score=x.category===a.category?.25:0;const title=norm(x.title);if(title.length>4&&text.includes(title))score+=5;for(const t of x.tags||[])if(tags.has(norm(t)))score++;return [score,x]}).filter(x=>x[0]>1).sort((x,y)=>y[0]-x[0]).slice(0,10).map(x=>x[1])}
async function showArticle(id,anchor=''){
  const a=await loadArticle(id);if(!a){renderNav();setToc('');main.innerHTML='<div class="empty">Article introuvable.</div>';return}
  renderNav(a.category);const secs=a.sections||[];setToc(`<div class="toc-title">Sur cette page</div><div class="toc-links">${secs.filter(s=>s.title).slice(0,120).map(s=>`<a href="#/article/${encodeURIComponent(a.id)}@${encodeURIComponent(s.id)}">${esc(s.title)}</a>`).join('')}</div>`);
  const sourceText=a.status==='source_detaillee'?'Lore détaillé servant de matière encyclopédique. Les arbitrages récents priment lorsqu’un conflit explicite existe.':a.status==='canon_enrichi'?'Contenu consolidé et/ou recoupé avec le corpus récent.':'Corpus récent de contrôle / état canonique actuel.';
  const core=`<div class="page-head"><div class="eyebrow">${esc(a.category)}</div><h1>${esc(a.title)}</h1>${metaBadges(a)}</div>${pnjFactsHtml(a)}<div class="source-box"><strong>Source :</strong> ${esc(a.source||'')}<br>${sourceText}</div>${secs.map(sectionHtml).join('')}${pnjMjHtml(a)}`;
  const related=relatedTo(a),withRelated=`${core}${related.length?`<section class="related"><h2>Voir aussi</h2><div class="related-links">${related.map(r=>`<a href="#/article/${encodeURIComponent(r.id)}">${esc(r.title)}</a>`).join('')}</div></section>`:''}`;
  main.innerHTML=a.audience==='mj'?`<div class="page-head"><div class="eyebrow">${esc(a.category)}</div><h1>${esc(a.title)}</h1>${metaBadges(a)}</div><details class="mj-block"><summary>Afficher le contenu MJ de cette page</summary><div class="mj-inner">${withRelated}</div></details>`:withRelated;
  if(anchor)setTimeout(()=>document.getElementById(anchor)?.scrollIntoView(),40);
}
function excerptFor(a,q){const nq=norm(q);for(const s of a.sections||[])for(const b of s.blocks||[])if(b.type==='p'&&norm(b.text||'').includes(nq))return {sec:s,text:(b.text||'').slice(0,320)};return {sec:null,text:articleSnippet(a,260)}}
function highlight(t,q){let out=esc(t);for(const w of norm(q).split(' ').filter(x=>x.length>1)){const re=new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`,'ig');out=out.replace(re,'<mark>$1</mark>')}return out}
async function showSearch(q=''){
  renderNav('search');searchInput.value=q;setToc('');main.innerHTML=`<div class="page-head"><div class="eyebrow">RECHERCHE GLOBALE</div><h1>Rechercher dans TUC</h1></div><div class="loading">${q?'Indexation et recherche…':'Saisissez un terme dans la barre supérieure.'}</div>`;if(!q)return;
  const all=await loadAll(),terms=norm(q).split(' ').filter(Boolean),scored=[];
  for(const a of all){const text=norm(flattenText(a));if(!terms.every(t=>text.includes(t)))continue;let score=0;for(const t of terms){if(norm(a.title).includes(t))score+=8;if(norm((a.tags||[]).join(' ')).includes(t))score+=3}scored.push([score,a])}
  scored.sort((x,y)=>y[0]-x[0]||x[1].title.localeCompare(y[1].title,'fr'));const results=scored.slice(0,200);
  main.innerHTML=`<div class="page-head"><div class="eyebrow">RECHERCHE GLOBALE</div><h1>${esc(q)}</h1><p>${scored.length} résultat${scored.length>1?'s':''}${scored.length>200?' · 200 premiers affichés':''}.</p></div><div class="search-results">${results.map(([,a])=>{const ex=excerptFor(a,q),href=`#/article/${encodeURIComponent(a.id)}${ex.sec?'@'+encodeURIComponent(ex.sec.id):''}`;return `<a class="search-result" href="${href}"><div class="crumb">${esc(a.category)} · ${a.audience==='mj'?'MJ · ':''}${esc(statusLabel(a.status))}</div><h3>${highlight(a.title,q)}</h3><p>${highlight(ex.text,q)}</p></a>`}).join('')||'<div class="empty">Aucun résultat.</div>'}</div>`;
}
async function router(){const raw=location.hash.slice(1)||'/home';if(raw.startsWith('/article/')){let x=decodeURIComponent(raw.slice(9)),anchor='';if(x.includes('@')){[x,anchor]=x.split('@',2);anchor=decodeURIComponent(anchor||'')}return showArticle(x,anchor)}if(raw.startsWith('/category/'))return showCategory(decodeURIComponent(raw.slice(10)));if(raw.startsWith('/search'))return showSearch(new URLSearchParams(raw.split('?')[1]||'').get('q')||'');return showHome()}

$('#globalSearch').addEventListener('submit',e=>{e.preventDefault();routeTo(`/search?q=${encodeURIComponent(searchInput.value.trim())}`)});window.addEventListener('hashchange',router);

(async()=>{
  manifest=await loadPacked('manifest.json.gz.b64');
  for(const [file,n] of Object.entries(manifest.fileBundles||{}))bundleForFile.set(file,n);
  const ext=await loadPnjExtensions(manifest.articles||[]);
  for(const a of ext.articles){cacheArticles([a]);manifest.articles.push({id:a.id,title:a.title,category:a.category,source:a.source,status:a.status,audience:a.audience,tags:a.tags,pnj:a.pnj})}
  ensureCategories();renderNav();await router();
})().catch(error=>{console.error(error);main.innerHTML=`<div class="empty"><strong>Impossible de charger le Compendium.</strong><br>${esc(error.message)}</div>`});
