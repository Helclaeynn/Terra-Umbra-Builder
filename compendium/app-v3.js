import {applyCommittedOverridesToMap} from './editor/native-overrides.js';
import {createWikiLinker} from './wiki-links.js';
import {PLAYER_START,WIKI_EXPLICIT_TARGETS,WIKI_SEARCH_FALLBACKS} from './onboarding-data.js';
import {manualArticleMedia} from './manual-media.js';

const $=s=>document.querySelector(s);
const main=$('#main'),toc=$('#tocBox'),nav=$('#mainNav'),searchInput=$('#searchInput');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const CATEGORY_ORDER=['Règles','Réalité','Vérité','Équipement & Objets','Personnages','Bestiaire'];

let manifest=null;
let wikiLinker=null;
const articleCache=new Map();
const datasetCache=new Map();
const statusClass=s=>['canon_recent','canon_enrichi'].includes(s)?'canon':s==='source_detaillee'?'source':s==='obsolete'?'obsolete':'';
const statusLabel=s=>manifest?.statusLabels?.[s]||s||'';

function corpusAssetUrl(relativePath){
  return String(relativePath||'').replace(/^\.?\//,'');
}

function routeTo(x){location.hash=x.startsWith('#')?x:'#'+x}
function setToc(html=''){toc.innerHTML=html}

function organisationRealm(article){
  const tags=(article?.tags||[]).map(norm);
  if(tags.includes('verite'))return 'Vérité';
  if(tags.includes('realite'))return 'Réalité';
  const text=norm(`${article?.title||''} ${(article?.tags||[]).join(' ')} ${article?.source||''}`);
  if(/vampir|garou|loup garou|mage|daemon|angelus|aseryn|atlante|exile|extral|chasseur|fleau|occulte|khinae/.test(text))return 'Vérité';
  return 'Réalité';
}
function displayCategory(article){
  const source=article?.sourceCategory||article?.category||'';
  if(source==='Équipement'||source==='Augmentations'||source==='Catalogue Vérité')return 'Équipement & Objets';
  if(source==='Organisations')return organisationRealm(article);
  return source;
}

async function loadManifest(){
  const r=await fetch('data/manifest-v3.json',{cache:'no-cache'});
  if(!r.ok)throw new Error(`manifest-v3.json · HTTP ${r.status}`);
  const data=await r.json();
  if(!Array.isArray(data.datasets)||!Array.isArray(data.categories))throw new Error('Manifest V3 invalide');
  return data;
}
async function loadCommittedOverrides(){
  try{
    const r=await fetch('data/manual-overrides.json',{cache:'no-cache'});
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    const data=await r.json();
    if(data?.version!==1||!Array.isArray(data.entries))throw new Error('format invalide');
    return data;
  }catch(error){
    console.warn('Overrides éditoriaux indisponibles : chargement du corpus brut.',error);
    return {version:1,entries:[]};
  }
}
async function loadDataset(spec){
  const key=spec.id||spec.prefix;if(datasetCache.has(key))return datasetCache.get(key);
  const p=(async()=>{
    const texts=await Promise.all(Array.from({length:spec.parts},async(_,i)=>{const file=`${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;const r=await fetch(corpusAssetUrl(`data/${file}`),{cache:'no-cache'});if(!r.ok)throw new Error(`${file} · HTTP ${r.status}`);return r.text()}));
    const b64=texts.join('').replace(/\s+/g,'');
    let bin;try{bin=atob(b64)}catch{throw new Error(`${key} · Base64 invalide`)}
    const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    if(!('DecompressionStream' in window))throw new Error('Ce navigateur ne prend pas en charge la décompression du Compendium.');
    let text;try{const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));text=await new Response(stream).text()}catch{throw new Error(`${key} · gzip invalide`)}
    let rows;try{rows=JSON.parse(text)}catch{throw new Error(`${key} · JSON invalide`)}
    if(!Array.isArray(rows))throw new Error(`${key} · racine non tabulaire`);
    return rows;
  })();
  datasetCache.set(key,p);return p;
}
async function loadCorpus(){
  const loaded=await Promise.all(manifest.datasets.map(async spec=>[spec.id,await loadDataset(spec)]));
  for(const [dataset,rows] of loaded){
    for(const article of rows){
      if(!article?.id)continue;
      article.dataset=article.dataset||dataset;
      article.sourceCategory=article.category;
      article.category=displayCategory(article);
      articleCache.set(article.id,article);
    }
  }
  const summary=await applyCommittedOverridesToMap(articleCache,await loadCommittedOverrides());
  if(summary.conflicts.length)console.warn(`${summary.conflicts.length} override(s) éditorial(aux) ignoré(s) car le corpus source a changé.`,summary.conflicts);
  if(summary.missing.length)console.warn(`${summary.missing.length} override(s) ciblent une page absente.`,summary.missing);
  wikiLinker=createWikiLinker(articles(),{explicitTargets:WIKI_EXPLICIT_TARGETS,searchFallbacks:WIKI_SEARCH_FALLBACKS});
  console.info(`Wiki interne : ${wikiLinker.stats.aliases} alias directs, ${wikiLinker.stats.ambiguous} ambigus ignorés.`);
}
function articles(){return [...articleCache.values()]}

function ensureCategories(){
  const found=new Set(articles().map(a=>a.category).filter(Boolean));
  manifest.categories=CATEGORY_ORDER.filter(category=>found.has(category));
}
function renderNav(active=''){
  const counts={};for(const a of articles())counts[a.category]=(counts[a.category]||0)+1;
  nav.innerHTML=`<a href="#/start" class="${active==='start'?'active':''}">Nouveau joueur</a><a href="#/home" class="${active==='home'?'active':''}">Index du Compendium</a><hr>${manifest.categories.map(c=>`<a href="#/category/${encodeURIComponent(c)}" class="${active===c?'active':''}"><span>${esc(c)}</span><span class="count">${counts[c]||0}</span></a>`).join('')}<hr><a href="#/search" class="${active==='search'?'active':''}">Recherche globale</a>`;
}
function metaBadges(a){return `<div class="meta"><span class="badge ${statusClass(a.status)}">${esc(statusLabel(a.status))}</span>${a.__editorialOverride?'<span class="badge canon">Édité</span>':''}${a.audience==='mj'?'<span class="badge mj">Contenu MJ</span>':''}${a.pnj?.completeness?`<span class="badge pnj-state ${esc(a.pnj.completeness)}">${esc(pnjCompletenessLabel(a.pnj.completeness))}</span>`:''}${(a.tags||[]).filter(Boolean).slice(0,8).map(t=>`<span class="badge">${esc(t)}</span>`).join('')}</div>`}
function flattenText(a){const bits=[a.title,a.source||'',...(a.tags||[])];if(a.pnj){const p=a.pnj;bits.push(p.nom_verite||'',p.race||'',p.age||'',p.origine||'',p.statut||'',p.statut_verite||'',...(p.relations||[]))}for(const s of a.sections||[]){bits.push(s.title||'');for(const b of s.blocks||[]){if(b.type==='p')bits.push(b.text||'');else if(b.type==='table')for(const r of b.rows||[])bits.push(...r)}}return bits.join(' ')}

function linkify(raw,currentArticle=''){return wikiLinker?.linkify(raw,currentArticle)??esc(raw)}
function blockHtml(b,currentArticle=''){if(b.type==='table')return `<div class="doc-table-wrap"><table class="doc-table"><tbody>${(b.rows||[]).map(r=>`<tr>${r.map(c=>`<td>${linkify(c,currentArticle)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;const style=(b.style||'').toLowerCase();const cls=style.includes('list')?' list':style.includes('spec')?' spec':style.includes('callout')?' callout':style.includes('lore')?' lore':'';return `<p class="body-p${cls}">${linkify(b.text||'',currentArticle)}</p>`}
function sectionHtml(s,currentArticle=''){const lv=Math.min(5,Math.max(2,Number(s.level)||3)),content=(s.blocks||[]).map(block=>blockHtml(block,currentArticle)).join('');if(s.status==='obsolete')return `<section id="${esc(s.id)}" class="section"><div class="obsolete-block"><strong>${esc(s.title)} — source explicitement signalée comme obsolète</strong><div>${content}</div></div></section>`;const inner=`<section id="${esc(s.id)}" class="section"><h${lv}>${esc(s.title)}</h${lv}>${content}</section>`;return s.audience==='mj'?`<details class="mj-block"><summary>${esc(s.title)}</summary><div class="mj-inner">${inner}</div></details>`:inner}
function articleSnippet(a,limit=220){const t=flattenText(a).replace(/\s+/g,' ').trim();return t.slice(0,limit)+(t.length>limit?'…':'')}
function categoryDescription(c){return c==='Règles'?'Moteur commun, combat, santé, ressources et progression.':c==='Réalité'?'Grande Californie, société, technologie, économie, vie quotidienne et organisations visibles.':c==='Vérité'?'Voile, peuples, traditions, factions, pouvoirs, lieux et cosmologie cachée.':c==='Équipement & Objets'?'Équipement de Réalité, augmentations et objets de Vérité réunis dans une même rubrique.':c==='Personnages'?'PNJ issus des dossiers détaillés, structurés sur le modèle de l’Index PNJ.':'Profils de créatures, PNJ génériques et figures de scénario.'}
function pnjCompletenessLabel(v){return v==='detailed'?'BG détaillé':v==='mini_bg'?'Mini-BG':v==='stub'?'À compléter':'PNJ'}
function pageMediaHtml(a){
  if(a.category==='Personnages'&&a.pnj)return'';
  const media=manualArticleMedia(a.id)??a.image??a.illustration;if(!media)return'';
  const src=typeof media==='string'?media:media?.src;if(!src)return'';
  const alt=typeof media==='object'&&media.alt?media.alt:a.title;
  const caption=typeof media==='object'?media.caption||'':'';
  return `<figure class="editor-media-preview article-media"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">${caption?`<figcaption>${esc(caption)}</figcaption>`:''}</figure>`;
}
function pnjFactsHtml(a){
  if(a.category!=='Personnages'||!a.pnj)return'';const p=a.pnj;
  const items=[['Âge',p.age],['Origine',p.origine],['Statut',p.statut]].filter(x=>x[1]);
  const portrait=p.portrait?`<figure class="pnj-portrait"><img src="${esc(p.portrait)}" alt="${esc(p.portrait_alt||`Portrait de ${a.title}`)}" loading="lazy">${p.portrait_caption?`<figcaption>${esc(p.portrait_caption)}</figcaption>`:''}</figure>`:'';
  const facts=items.length?`<div class="pnj-facts">${items.map(([k,v])=>`<div><span>${esc(k)}</span><strong>${linkify(v,a)}</strong></div>`).join('')}</div>`:'';
  const relations=(p.relations||[]).filter(Boolean);const rel=relations.length?`<div class="pnj-relations"><strong>Relations</strong><div class="related-links">${relations.map(r=>`<a href="#/search?q=${encodeURIComponent(String(r).replace(/[:–—].*$/,''))}">${esc(r)}</a>`).join('')}</div></div>`:'';
  return `${portrait}${facts}${rel}`;
}
function statObjectHtml(obj,currentArticle=''){if(!obj)return'<p class="muted">Statistiques non encore établies.</p>';if(typeof obj==='string')return `<p>${linkify(obj,currentArticle)}</p>`;if(Array.isArray(obj))return `<ul>${obj.map(v=>`<li>${linkify(typeof v==='string'?v:JSON.stringify(v),currentArticle)}</li>`).join('')}</ul>`;return `<div class="pnj-stat-grid">${Object.entries(obj).map(([k,v])=>`<div><span>${esc(k)}</span><strong>${esc(typeof v==='object'?JSON.stringify(v):v)}</strong></div>`).join('')}</div>`}
function pnjMjHtml(a){
  if(a.category!=='Personnages'||!a.pnj)return'';const p=a.pnj,stats=a.stats||p.stats;
  const truth=[['Nom / identité de Vérité',p.nom_verite],['Race / nature réelle',p.race],['Statut de Vérité',p.statut_verite]].filter(x=>x[1]);
  if(!truth.length&&!stats)return'';
  return `<details class="mj-block pnj-mj"><summary>Dossier MJ · Vérité & statistiques</summary><div class="mj-inner">${truth.map(([k,v])=>`<div class="pnj-secret-line"><span>${esc(k)}</span><strong>${linkify(v,a.id)}</strong></div>`).join('')}<div class="pnj-stat-columns"><section><h3>Profil Réalité</h3>${statObjectHtml(stats?.reality,a)}</section><section><h3>Profil Vérité</h3>${statObjectHtml(stats?.truth,a)}</section></div><p class="pnj-stat-note">Les statistiques absentes ne sont pas inventées : elles seront ajoutées depuis le Bestiaire ou lors d’un arbitrage canonique.</p></div></details>`;
}

function relatedTo(a){const text=norm(flattenText(a)),tags=new Set((a.tags||[]).map(norm));return articles().filter(x=>x.id!==a.id&&x.audience!=='mj').map(x=>{let score=x.category===a.category?.25:0;const title=norm(x.title);if(title.length>4&&text.includes(title))score+=5;for(const t of x.tags||[])if(tags.has(norm(t)))score++;return[score,x]}).filter(x=>x[0]>1).sort((x,y)=>y[0]-x[0]||x[1].title.localeCompare(y[1].title,'fr')).slice(0,12).map(x=>x[1])}

function startArticleHref(id){return `#/article/${encodeURIComponent(id)}`}
function startArticleTitle(id,fallback=''){return articleCache.get(id)?.title||fallback||id}
function startCard(item){
  const href=startArticleHref(item.id);
  return `<a class="start-card" href="${href}" data-wiki-id="${esc(item.id)}"><strong>${esc(item.label)}</strong><p>${esc(item.summary)}</p><span>Lire : ${esc(startArticleTitle(item.id,item.label))} →</span></a>`;
}
function natureCard(item){
  const rulesId=item.rulesId||'',loreId=item.loreId||'';
  return `<article class="nature-card"><div class="nature-copy"><div><strong>${esc(item.label)}</strong>${item.note?`<span class="start-pill">${esc(item.note)}</span>`:''}</div><p>${esc(item.summary||'')}</p></div><div class="nature-links">${rulesId?`<a class="wiki-link" data-wiki-id="${esc(rulesId)}" href="#/article/${encodeURIComponent(rulesId)}">Règles de Nature</a>`:''}${loreId?`<a class="wiki-link" data-wiki-id="${esc(loreId)}" href="#/article/${encodeURIComponent(loreId)}">Présentation & lore</a>`:''}</div></article>`;
}
function wikiPreviewText(article,limit=360){
  const chunks=[];
  for(const section of article?.sections||[]){
    if(section?.audience==='mj')continue;
    for(const block of section.blocks||[]){
      if(block?.type==='p'&&String(block.text||'').trim())chunks.push(String(block.text).trim());
      if(chunks.join(' ').length>=limit*1.4)break;
    }
    if(chunks.join(' ').length>=limit*1.4)break;
  }
  const text=(chunks.join(' ')||articleSnippet(article,limit)).replace(/\s+/g,' ').trim();
  return text.length>limit?text.slice(0,limit).replace(/\s+\S*$/,'')+'…':text;
}
const wikiPreview=el('div',{class:'wiki-hover-preview',role:'tooltip','aria-hidden':'true'});document.body.appendChild(wikiPreview);
let wikiPreviewTimer=null,wikiPreviewLink=null;
function hideWikiPreview(){clearTimeout(wikiPreviewTimer);wikiPreviewLink=null;wikiPreview.classList.remove('visible');wikiPreview.setAttribute('aria-hidden','true')}
function positionWikiPreview(link){
  const r=link.getBoundingClientRect(),pad=12,w=Math.min(420,window.innerWidth-pad*2);
  wikiPreview.style.width=w+'px';
  let left=Math.max(pad,Math.min(window.innerWidth-w-pad,r.left));
  let top=r.bottom+10;
  const h=wikiPreview.offsetHeight||180;if(top+h>window.innerHeight-pad)top=Math.max(pad,r.top-h-10);
  wikiPreview.style.left=left+'px';wikiPreview.style.top=top+'px';
}
function showWikiPreview(link){
  const id=link?.dataset?.wikiId,article=id?articleCache.get(id):null;if(!article)return;
  wikiPreviewLink=link;
  wikiPreview.innerHTML=`<div class="wiki-hover-kicker">${esc(article.category||'Compendium')}</div><strong>${esc(article.title)}</strong><p>${esc(wikiPreviewText(article))}</p><span>Cliquer pour ouvrir l’article →</span>`;
  wikiPreview.classList.add('visible');wikiPreview.setAttribute('aria-hidden','false');positionWikiPreview(link);
}
main.addEventListener('mouseover',event=>{const link=event.target.closest?.('a[data-wiki-id]');if(!link||!main.contains(link)||link===wikiPreviewLink)return;clearTimeout(wikiPreviewTimer);wikiPreviewTimer=setTimeout(()=>showWikiPreview(link),120)});
main.addEventListener('mouseout',event=>{const link=event.target.closest?.('a[data-wiki-id]');if(link&&!link.contains(event.relatedTarget))hideWikiPreview()});
main.addEventListener('focusin',event=>{const link=event.target.closest?.('a[data-wiki-id]');if(link)showWikiPreview(link)});
main.addEventListener('focusout',event=>{if(event.target.closest?.('a[data-wiki-id]'))hideWikiPreview()});
window.addEventListener('scroll',()=>{if(wikiPreviewLink)positionWikiPreview(wikiPreviewLink)},{passive:true});
window.addEventListener('resize',()=>{if(wikiPreviewLink)positionWikiPreview(wikiPreviewLink)});

async function showStart(){
  renderNav('start');
  setToc(`<div class="toc-title">Commencer par</div><div class="toc-links"><a href="#/article/realite-001-chapitre-vivre-en-grande-californie">La Réalité</a><a href="#/article/verite-001-la-verite-n-est-pas-un-second-monde">La Vérité</a><a href="#/article/verite-002-le-voile-et-l-hologramme">Voile & Hologramme</a><a href="#/article/realite-005-4-creation-et-progression">Création</a></div>`);
  main.innerHTML=`<div class="page-head start-hero"><div class="eyebrow">PREMIERS PAS</div><h1>Découvrir Terra Umbra California</h1><p>${linkify('Terra Umbra California se lit sur deux niveaux superposés : la Réalité, le monde visible et quotidien, et la Vérité, le monde caché derrière le Voile. Commence ici, puis suis les liens selon le personnage que tu veux découvrir ou créer.')}</p><div class="start-actions"><a class="builder-link" href="../character-builder/">Créer un personnage</a><a class="builder-link secondary" href="#/home">Explorer tout le Compendium</a></div></div><section class="start-section"><h2>Les quatre pages à lire d’abord</h2><div class="start-grid">${PLAYER_START.basics.map(startCard).join('')}</div></section><section class="start-section"><h2>Natures et espèces disponibles</h2><p class="start-intro">Chaque entrée ci-dessous renvoie à sa page de règles de Nature et, lorsqu’elle existe séparément, à sa présentation dans le lore. Les accès particuliers sont isolés juste après.</p><div class="nature-grid">${PLAYER_START.natures.map(natureCard).join('')}</div>${PLAYER_START.restricted.length?`<h3 class="start-subtitle">Accès particuliers</h3><div class="nature-grid">${PLAYER_START.restricted.map(natureCard).join('')}</div>`:''}</section><section class="start-section"><h2>Explorer ensuite</h2><div class="start-grid compact">${PLAYER_START.categories.map(item=>`<a class="start-card" href="${item.href}"><strong>${esc(item.label)}</strong><p>${esc(item.summary)}</p><span>Ouvrir la rubrique →</span></a>`).join('')}</div></section>`;
}
async function showHome(){renderNav('home');setToc('');const counts={};for(const a of articles())counts[a.category]=(counts[a.category]||0)+1;main.innerHTML=`<div class="page-head"><div class="eyebrow">BASE DOCUMENTAIRE TUC</div><h1>Compendium</h1><p>${articles().length.toLocaleString('fr-FR')} entrées chargées depuis le corpus V3. Les dossiers détaillés constituent la matière encyclopédique ; les livres récents apportent règles, Bestiaire, catalogues et arbitrages canoniques.</p></div><div class="notice"><strong>Principe éditorial :</strong> une omission dans un livre récent n’efface pas un détail de lore compatible. Une décision récente explicite prime en cas de conflit ; un point non tranché reste signalé « À statuer ».</div><div class="category-grid">${manifest.categories.map(c=>`<a class="category-card" href="#/category/${encodeURIComponent(c)}"><strong>${esc(c)}</strong><p>${categoryDescription(c)}</p><span class="count">${counts[c]||0} entrées →</span></a>`).join('')}</div>`}
async function showCategory(cat){renderNav(cat);setToc('');const list=articles().filter(a=>a.category===cat).sort((a,b)=>a.title.localeCompare(b.title,'fr',{numeric:true,sensitivity:'base'}));main.innerHTML=`<div class="page-head"><div class="eyebrow">COMPENDIUM · ${esc(cat)}</div><h1>${esc(cat)}</h1><p>${list.length} entrées actuellement indexées.</p></div><div class="field category-filter"><label for="categoryFilter">Filtrer cette rubrique</label><input id="categoryFilter" type="search" placeholder="Nom, source, tag…" autocomplete="off"></div><div id="categoryVisible" class="search-status">${list.length} entrées affichées</div><div class="article-list">${list.map(a=>`<a class="article-card" data-filter="${esc(norm(`${a.title} ${a.source} ${(a.tags||[]).join(' ')} ${a.pnj?.completeness||''}`))}" href="#/article/${encodeURIComponent(a.id)}"><h3>${esc(a.title)}</h3><p>${esc(a.source||'')} · ${esc(statusLabel(a.status))}${a.pnj?.completeness?` · ${esc(pnjCompletenessLabel(a.pnj.completeness))}`:''}${a.audience==='mj'?' · MJ':''}</p></a>`).join('')}</div>`;const input=$('#categoryFilter'),cards=[...main.querySelectorAll('.article-card')],visible=$('#categoryVisible');input?.addEventListener('input',()=>{const q=norm(input.value);let n=0;for(const card of cards){const ok=!q||q.split(' ').every(t=>card.dataset.filter.includes(t));card.style.display=ok?'block':'none';if(ok)n++}visible.textContent=`${n} entrée${n>1?'s':''} affichée${n>1?'s':''}`})}
async function showArticle(id,anchor=''){const a=articleCache.get(id);if(!a){renderNav();setToc('');main.innerHTML='<div class="empty">Article introuvable.</div>';return}renderNav(a.category);const secs=a.sections||[];setToc(`<div class="toc-title">Sur cette page</div><div class="toc-links">${secs.filter(s=>s.title).slice(0,160).map(s=>`<a href="#/article/${encodeURIComponent(a.id)}@${encodeURIComponent(s.id)}">${esc(s.title)}</a>`).join('')}</div>`);const sourceText=a.status==='source_detaillee'?'Lore détaillé servant de matière encyclopédique. Les arbitrages récents priment lorsqu’un conflit explicite existe.':a.status==='canon_enrichi'?'Contenu détaillé recoupé et/ou enrichi par le corpus récent.':'Surcouche récente de règles, données ou état canonique.';const core=`<div class="page-head"><div class="eyebrow">${esc(a.category)}</div><h1>${esc(a.title)}</h1>${metaBadges(a)}</div>${pageMediaHtml(a)}${pnjFactsHtml(a)}<div class="source-box"><strong>Source :</strong> ${esc(a.source||'')}<br>${sourceText}</div>${secs.map(s=>sectionHtml(s,a)).join('')}${pnjMjHtml(a)}`;const related=relatedTo(a),body=`${core}${related.length?`<section class="related"><h2>Voir aussi</h2><div class="related-links">${related.map(r=>`<a href="#/article/${encodeURIComponent(r.id)}">${esc(r.title)}</a>`).join('')}</div></section>`:''}`;main.innerHTML=a.audience==='mj'?`<div class="page-head"><div class="eyebrow">${esc(a.category)}</div><h1>${esc(a.title)}</h1>${metaBadges(a)}</div><details class="mj-block"><summary>Afficher le contenu MJ de cette page</summary><div class="mj-inner">${core}</div></details>`:body;hideWikiPreview();if(anchor)setTimeout(()=>document.getElementById(anchor)?.scrollIntoView(),40);else requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}))}
function excerptFor(a,q){const nq=norm(q);for(const s of a.sections||[])for(const b of s.blocks||[])if(b.type==='p'&&norm(b.text).includes(nq))return{sec:s,text:b.text};return{sec:null,text:articleSnippet(a)}}
function highlight(t,q){let out=esc(t);for(const w of norm(q).split(' ').filter(x=>x.length>1)){const re=new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`,'ig');out=out.replace(re,'<mark>$1</mark>')}return out}
async function showSearch(q=''){renderNav('search');searchInput.value=q;setToc('');if(!q){main.innerHTML='<div class="page-head"><div class="eyebrow">RECHERCHE GLOBALE</div><h1>Rechercher dans TUC</h1><p>La recherche porte sur le lore, les PNJ, les règles, le Bestiaire, l’équipement, les augmentations et les surcouches récentes.</p></div>';return}const terms=norm(q).split(' ').filter(Boolean),scored=[];for(const a of articles()){const text=norm(flattenText(a));if(!terms.every(t=>text.includes(t)))continue;let score=terms.reduce((n,t)=>n+(norm(a.title).includes(t)?8:0)+(norm((a.tags||[]).join(' ')).includes(t)?3:0),0);score+=Math.min(10,terms.reduce((n,t)=>n+(text.match(new RegExp(t,'g'))||[]).length,0)*.15);scored.push([score,a])}scored.sort((x,y)=>y[0]-x[0]||x[1].title.localeCompare(y[1].title,'fr'));const results=scored.slice(0,200);main.innerHTML=`<div class="page-head"><div class="eyebrow">RECHERCHE GLOBALE</div><h1>${esc(q)}</h1><p>${scored.length} résultat${scored.length>1?'s':''}${scored.length>200?' · 200 premiers affichés':''}.</p></div><div class="search-results">${results.map(([,a])=>{const ex=excerptFor(a,q),href=`#/article/${encodeURIComponent(a.id)}${ex.sec?'@'+encodeURIComponent(ex.sec.id):''}`;return`<a class="search-result" href="${href}"><div class="crumb">${esc(a.category)} · ${esc(statusLabel(a.status))}${a.pnj?.completeness?` · ${esc(pnjCompletenessLabel(a.pnj.completeness))}`:''}</div><h3>${highlight(a.title,q)}</h3><p>${highlight(ex.text,q)}</p></a>`}).join('')||'<div class="empty">Aucun résultat.</div>'}</div>`}
async function router(){const raw=location.hash.slice(1)||'/start';if(raw==='/start')return showStart();if(raw.startsWith('/article/')){let x=decodeURIComponent(raw.slice(9)),anchor='';if(x.includes('@')){const parts=x.split('@',2);x=parts[0];anchor=decodeURIComponent(parts[1]||'')}return showArticle(x,anchor)}if(raw.startsWith('/category/'))return showCategory(decodeURIComponent(raw.slice(10)));if(raw.startsWith('/search'))return showSearch(new URLSearchParams(raw.split('?')[1]||'').get('q')||'');return showHome()}

$('#globalSearch').addEventListener('submit',e=>{e.preventDefault();routeTo(`/search?q=${encodeURIComponent(searchInput.value.trim())}`)});window.addEventListener('hashchange',router);

(async()=>{
  manifest=await loadManifest();
  const firstRoute=location.hash.slice(1)||'/start';
  if(firstRoute==='/start')await showStart();
  await loadCorpus();
  ensureCategories();
  const currentRoute=location.hash.slice(1)||'/start';
  if(currentRoute==='/start')return showStart();
  await router();
})().catch(error=>{console.error(error);main.innerHTML=`<div class="empty"><strong>Impossible de charger le Compendium.</strong><br>${esc(error.message)}</div>`});
