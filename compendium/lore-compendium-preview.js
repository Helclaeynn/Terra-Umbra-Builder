import {applyLoreEnrichment} from './lore-preview-enrichment.js';

const $=s=>document.querySelector(s);
const main=$('#main'),nav=$('#mainNav'),toc=$('#tocBox'),searchInput=$('#searchInput'),sourceFrame=$('#loreSourceFrame');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

const DOCS=[
{id:'pegre',title:'Pègre de Los Angeles',href:'pegre-preview.html',category:'Organisations',count:18,oldCount:16,description:'Crime organisé californien, mafias, cartels et gangs.'},
{id:'agences',title:'Agences gouvernementales',href:'agences-preview.html',category:'Organisations',count:18,oldCount:5,description:'CNAD, CBII, agences spécialisées et renseignement étranger.'},
{id:'gouvernement',title:'Gouvernement',href:'gouvernement-preview.html',category:'Organisations',count:18,oldCount:5,description:'Exécutif, législatif, justice, services publics, défense et Grande Réserve.'},
{id:'vie-quotidienne',title:'Vie quotidienne',href:'vie-quotidienne-preview.html',category:'Réalité',count:18,oldCount:10,description:'Urbanisme, énergie, alimentation, transports, Holonet, santé et loisirs.'},
{id:'police',title:'Police de Los Angeles',href:'police-preview.html',category:'Organisations',count:20,oldCount:12,description:'LAUS, réforme Caza, formation, bureaux spécialisés et prisons.'},
{id:'religions',title:'Religions et néoreligions',href:'religions-preview.html',category:'Organisations',count:24,oldCount:11,description:'Religions historiques, néoreligions, Holonetisme et nouveaux cultes.'},
{id:'corporations',title:'Corporations',href:'corporations-preview.html',category:'Organisations',count:68,oldCount:12,description:'Droits corporatifs, guerres, territoires et corporations majeures.'},
{id:'crawlers',title:'Crawlers',href:'crawlers-preview.html',category:'Organisations',count:16,oldCount:12,description:'Underlife, Fixers, DeathRunners, Neurodivers, Meditechs, Gundrivers et Neopunks.'},
{id:'anti-systemes',title:'Crawlers — Anti-systèmes',href:'anti-systemes-preview.html',category:'Organisations',count:34,oldCount:12,description:'Neopunks, insurgés, Motorcycle Clubs et communautés Enders.'},
{id:'angelus',title:'Arbre de Vie & Angelus',href:'angelus-preview.html',category:'Organisations',count:21,oldCount:5,description:'Arbre de Vie, Sephiroth, hiérarchie angélique et Archanges.'},
{id:'vampire-courts',title:'Cours vampiriques',href:'vampire-courts-preview.html',category:'Organisations',count:12,oldCount:9,description:'Origines et traditions politiques des Cours vampiriques.'},
{id:'pelages',title:'Pelages / Loups-garous',href:'pelages-preview.html',category:'Organisations',count:6,oldCount:3,description:'Six Pelages, hiérarchie, migrations, territoires et lignées.'},
{id:'therianthropes',title:'Autres Thérianthropes',href:'therianthropes-preview.html',category:'Vérité',count:7,oldCount:3,description:'Canidés, Félidés, Oiseaux, Requins, Serpents, Hyènes et Ours.'},
{id:'mage-lodges',title:'Loges des Mages',href:'mage-lodges-preview.html',category:'Organisations',count:8,oldCount:3,description:'Organisation générale, grandes Loges américaines et renégats.'},
{id:'daemon-temples',title:'Temples Daemoniaques',href:'daemon-temples-preview.html',category:'Organisations',count:15,oldCount:5,description:'Fonctionnement des Temples, trônes sacrés et treize Temples nommés.'},
{id:'aseryn-temples',title:'Temples Aseryns',href:'aseryn-temples-preview.html',category:'Organisations',count:8,oldCount:5,description:'Cosmologie aseryne, Fondateurs, Ordre Sépulcral et Temples.'},
{id:'aseryn-continents',title:'Continents Aseryns',href:'aseryn-continents-preview.html',category:'Vérité',count:6,oldCount:8,description:'Atlantide, Mû, Lémurie, Hyperborée et diaspora serathèenne.'},
{id:'supernatural-species',title:'Espèces surnaturelles',href:'supernatural-species-preview.html',category:'Vérité',count:8,oldCount:16,description:'Khinae, Vampires, Garous, Mages, Atlantes, Daemons et Angelus.'},
{id:'plagues',title:'Fléaux',href:'plagues-preview.html',category:'Vérité',count:8,oldCount:10,description:'Nature des Fléaux, entités majeures et cultes associés.'},
{id:'grands-exiles',title:'Grands Exilés',href:'grands-exiles-preview.html',category:'Organisations',count:10,oldCount:8,description:'Conseil des Anciens, Syndicat de Jade, Chasse Fantastique et autres Exilés.'},
{id:'extrals-groups',title:"Groupes d’Extrals",href:'extrals-groups-preview.html',category:'Organisations',count:9,oldCount:8,description:'GAAC, CTU, Émeraude sanglante, R.E.P.T.I.L.E., SMRC et Hydroguard.'},
{id:'humans-galaxy',title:'Humains galactiques',href:'humans-galaxy-preview.html',category:'Vérité',count:5,oldCount:6,description:'Histoire galactique humaine, AIDH, G-corporations et Inquisition.'},
{id:'extraterrestrial-species',title:'Espèces extraterrestres',href:'extraterrestrial-species-preview.html',category:'Vérité',count:7,oldCount:12,description:'Talass, Mo’sens, Baseanhs, Rocreens, Thalsios et autres espèces.'}
];

const CATEGORY_ORDER=['Règles','Réalité','Vérité','Organisations','Personnages','Bestiaire'];
const FINAL_COUNTS={'Règles':5,'Réalité':57,'Vérité':137,'Organisations':305,'Personnages':163,'Bestiaire':20};
const CATEGORY_NOTES={
'Règles':'Moteur commun et règles actuelles. Cette catégorie n’est pas modifiée par la passe Lore.',
'Réalité':'Société, technologie et vie quotidienne visibles. La projection intègre 18 pages Lore restructurées.',
'Vérité':'Cosmologie cachée, espèces et factions de Vérité. 41 pages restructurées s’ajoutent à 33 pages Lore conservées et aux 63 entrées V3 existantes.',
'Organisations':'Institutions, factions, corporations, Crawlers et réseaux. Les 305 pages projetées proviennent du nouveau découpage Lore.',
'Personnages':'163 PNJ structurés déjà présents dans le V3, inchangés dans cette projection.',
'Bestiaire':'20 profils déjà présents dans le V3, inchangés dans cette projection.'
};
const indexCache=new Map();
let loadedDocId='';

function routeTo(value){location.hash=value.startsWith('#')?value:`#${value}`;}
function activeRoute(){return decodeURIComponent(location.hash.replace(/^#/,'')||'/home');}
function docById(id){return DOCS.find(d=>d.id===id);}
function setToc(html=''){toc.innerHTML=html;}
function renderNav(active=''){
  nav.innerHTML=`<a href="#/home" class="${active==='home'?'active':''}">Accueil</a><hr>${CATEGORY_ORDER.map(c=>`<a href="#/category/${encodeURIComponent(c)}" class="${active===c?'active':''}"><span>${esc(c)}</span><span class="count">${FINAL_COUNTS[c]}</span></a>`).join('')}<hr><a href="#/search" class="${active==='search'?'active':''}">Recherche Lore intégrée</a>`;
}
function categoryIntegration(cat){return DOCS.filter(d=>d.category===cat).reduce((n,d)=>n+d.count,0);}
function sourceFamilies(cat){return DOCS.filter(d=>d.category===cat);}
function integrationSummary(doc){return `${doc.oldCount} ancienne${doc.oldCount>1?'s':''} entrée${doc.oldCount>1?'s':''} de source → ${doc.count} page${doc.count>1?'s':''} structurée${doc.count>1?'s':''}`;}

function showHome(){
  renderNav('home');setToc('');document.title='Compendium enrichi · Preview Lore TUC';
  main.innerHTML=`<div class="page-head"><div class="eyebrow">BASE DOCUMENTAIRE TUC · PROJECTION</div><h1>Compendium enrichi</h1><p>Cette vue simule le Compendium V3 après remplacement du découpage Lore brut par les pages restructurées de <code>preview/lore</code>. L’interface et les catégories reprennent le fonctionnement de <code>main</code>, mais aucune donnée de <code>main</code> n’est modifiée.</p></div>
  <div class="integration-metrics"><div class="integration-metric"><strong>196</strong><span>anciennes entrées Lore de <code>main</code> remplacées par famille de source</span></div><div class="integration-metric accent"><strong>364</strong><span>pages Lore structurées et enrichies dans la preview</span></div><div class="integration-metric"><strong>397</strong><span>pages Lore projetées après conservation des 33 entrées hors de cette passe</span></div><div class="integration-metric"><strong>687</strong><span>entrées totales projetées si les autres datasets V3 restent inchangés</span></div></div>
  <div class="projection-note"><strong>Pourquoi un remplacement et non un ajout ?</strong><br>Le main actuel contient encore de grandes pages issues d’un découpage documentaire — « Partie 1 », « Personnages », « Contexte général » — alors que la preview redécoupe ces mêmes sources en articles encyclopédiques autonomes. Ajouter les deux ensembles créerait des doublons. Le cut-over projeté remplace donc 196 anciennes entrées par 364 pages structurées.</div>
  <div class="category-grid">${CATEGORY_ORDER.map(c=>{const integrated=categoryIntegration(c),unchanged=!integrated;let sub='';if(c==='Réalité')sub='39 entrées V3 existantes + 18 Lore intégrées';else if(c==='Vérité')sub='63 V3 + 33 Lore conservées + 41 intégrées';else if(c==='Organisations')sub='305 pages Lore restructurées';else sub=`${FINAL_COUNTS[c]} entrées inchangées`;return `<a class="category-card ${unchanged?'unchanged':'demo-category'}" href="#/category/${encodeURIComponent(c)}"><strong>${esc(c)}</strong><p>${esc(CATEGORY_NOTES[c])}</p><span class="count">${FINAL_COUNTS[c]} entrées projetées →</span><span class="projection-subcount">${esc(sub)}</span></a>`}).join('')}</div>`;
}

function waitFrameReady(docId,timeout=15000){
  return new Promise(async(resolve,reject)=>{
    const start=Date.now();
    while(Date.now()-start<timeout){
      try{
        const d=sourceFrame.contentDocument;
        if(loadedDocId===docId&&d&&d.querySelector('#nav [data-id],.nav [data-id]')&&d.querySelector('#content,.content'))return resolve(d);
      }catch{}
      await sleep(60);
    }
    reject(new Error(`Chargement trop long : ${docId}`));
  });
}
async function ensureDoc(doc){
  if(loadedDocId===doc.id&&sourceFrame.contentDocument?.querySelector('#nav [data-id],.nav [data-id]'))return sourceFrame.contentDocument;
  loadedDocId='';
  await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error(`Impossible de charger ${doc.title}`)),15000);
    sourceFrame.onload=()=>{clearTimeout(timer);loadedDocId=doc.id;resolve();};
    sourceFrame.src=doc.href;
  });
  return waitFrameReady(doc.id);
}
async function indexDoc(doc){
  if(indexCache.has(doc.id))return indexCache.get(doc.id);
  const d=await ensureDoc(doc);
  const seen=new Set(),items=[];
  for(const node of d.querySelectorAll('#nav [data-id],.nav [data-id]')){
    const id=node.dataset.id;if(!id||seen.has(id))continue;seen.add(id);
    const label=(node.textContent||'').trim();items.push({docId:doc.id,pageId:id,title:label||id,docTitle:doc.title,category:doc.category,description:doc.description});
  }
  indexCache.set(doc.id,items);return items;
}
function loadingBox(label,done,total){const pct=total?Math.round(done/total*100):0;return `<div class="integration-loading"><strong>${esc(label)}</strong><span>Indexation des pages de la preview… ${done}/${total}</span><div class="integration-progress"><span style="width:${pct}%"></span></div></div>`;}
async function collectDocs(docs,label){
  const all=[];let done=0;main.innerHTML=loadingBox(label,done,docs.length);
  for(const doc of docs){all.push(...await indexDoc(doc));done++;main.innerHTML=loadingBox(label,done,docs.length);}
  return all;
}
function sourceOverview(cat){
  const docs=sourceFamilies(cat);if(!docs.length)return'';
  return `<div class="category-source-block"><h3>Familles Lore remplacées dans cette projection</h3><div class="category-source-grid">${docs.map(d=>`<div class="category-source-item"><strong>${esc(d.title)}</strong><span>${d.oldCount} → ${d.count}</span></div>`).join('')}</div></div>`;
}
function articleCard(item){const doc=docById(item.docId);return `<a class="article-card integration-article" data-filter="${esc(norm(`${item.title} ${item.docTitle} ${item.description}`))}" href="#/article/${encodeURIComponent(item.docId)}/${encodeURIComponent(item.pageId)}"><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><div class="source-line"><span>${esc(item.docTitle)}</span><span class="integration-chip">${esc(integrationSummary(doc))}</span></div></a>`;}

async function showCategory(cat){
  renderNav(cat);setToc('');document.title=`${cat} · Compendium enrichi`;
  const docs=sourceFamilies(cat);
  if(!docs.length){main.innerHTML=`<div class="page-head"><div class="eyebrow">COMPENDIUM · ${esc(cat)}</div><h1>${esc(cat)}</h1><p>${FINAL_COUNTS[cat]} entrées projetées.</p></div><div class="unchanged-category"><h2>Rubrique inchangée dans cette passe</h2><p>${esc(CATEGORY_NOTES[cat])}</p><p>Cette projection se concentre sur l’intégration Lore. Les entrées actuelles de cette rubrique restent celles de <code>main</code>.</p></div>`;return;}
  const items=(await collectDocs(docs,`Préparation de ${cat}`)).sort((a,b)=>a.title.localeCompare(b.title,'fr',{numeric:true,sensitivity:'base'}));
  main.innerHTML=`<div class="page-head"><div class="eyebrow">COMPENDIUM · ${esc(cat)} · PROJECTION LORE</div><h1>${esc(cat)}</h1><p>${FINAL_COUNTS[cat]} entrées projetées au total, dont ${items.length} pages Lore restructurées visibles dans cette maquette.</p></div>${sourceOverview(cat)}<div class="field category-filter"><label for="categoryFilter">Filtrer cette rubrique</label><input id="categoryFilter" type="search" placeholder="Nom de page ou corpus source…" autocomplete="off"></div><div id="categoryVisible" class="search-status">${items.length} pages Lore affichées</div><div class="article-list integration-list">${items.map(articleCard).join('')}</div>`;
  const input=$('#categoryFilter'),cards=[...main.querySelectorAll('.integration-article')],status=$('#categoryVisible');
  input?.addEventListener('input',()=>{const q=norm(input.value),visible=cards.filter(card=>{const ok=!q||card.dataset.filter.includes(q);card.hidden=!ok;return ok;}).length;status.textContent=`${visible} page${visible>1?'s':''} Lore affichée${visible>1?'s':''}`;});
}

async function selectPageInFrame(doc,pageId){
  const d=await ensureDoc(doc);const w=d.defaultView;
  const target=`#/${encodeURIComponent(pageId)}`;
  if(w.location.hash!==target)w.location.hash=target;
  const start=Date.now();
  while(Date.now()-start<12000){
    const active=d.querySelector('#nav [data-id].active,.nav [data-id].active,#nav a.active,.nav a.active');
    const activeId=active?.dataset?.id||decodeURIComponent((active?.getAttribute('href')||'').replace(/^#\/?/,''));
    const h1=d.querySelector('#content h1,.content h1');
    if(h1&&(activeId===pageId||w.location.hash===target)){await sleep(60);return d;}
    await sleep(60);
  }
  throw new Error(`Page introuvable : ${pageId}`);
}
function cloneSelected(root,selector){return [...root.querySelectorAll(selector)].filter(n=>n.parentElement===root).map(n=>n.cloneNode(true));}
function slug(s){return norm(s).replace(/\s+/g,'-')||'section';}
function buildToc(container){
  const heads=[...container.querySelectorAll('.preview-section h2,.section h2,.section h3')];if(!heads.length){setToc('');return;}
  const used=new Set();for(const h of heads){let id=slug(h.textContent),base=id,n=2;while(used.has(id)||document.getElementById(id))id=`${base}-${n++}`;used.add(id);h.id=id;}
  setToc(`<div class="toc-title">Sur cette page</div>${heads.map(h=>`<a class="toc-link" href="#${esc(h.id)}">${esc(h.textContent)}</a>`).join('')}`);
  toc.querySelectorAll('a').forEach((a,i)=>a.addEventListener('click',event=>{event.preventDefault();heads[i]?.scrollIntoView({behavior:'smooth',block:'start'});}));
}
async function showArticle(docId,pageId){
  const doc=docById(docId);if(!doc){showHome();return;}
  renderNav(doc.category);main.innerHTML=loadingBox(`Ouverture de ${doc.title}`,0,1);setToc('');
  const d=await selectPageInFrame(doc,pageId);applyLoreEnrichment(d,`${doc.id}::${pageId}`);
  const root=d.querySelector('#content,.content'),title=root?.querySelector('.page-head h1,.preview-hero h1,h1')?.textContent?.trim()||pageId,summary=root?.querySelector('.page-head p,.preview-hero p')?.textContent?.trim()||doc.description;
  document.title=`${title} · Compendium enrichi`;
  const visuals=root?.querySelector('.preview-visuals')?.cloneNode(true);if(visuals)visuals.className='projected-visuals';
  const wrapper=document.createElement('div');wrapper.className='compendium-projected-page';
  wrapper.innerHTML=`<div class="page-head"><div class="projected-hero-grid ${visuals?'':'no-visual'}"><div><div class="eyebrow">${esc(doc.category)} · ${esc(doc.title)}</div><h1>${esc(title)}</h1><p>${esc(summary)}</p><div class="projection-meta"><span class="projection-badge replace">Intégration Lore restructurée</span><span class="projection-badge preview">${esc(integrationSummary(doc))}</span><span class="projection-badge keep">Preview · main inchangée</span></div></div><div class="projected-visual-slot"></div></div></div>`;
  if(visuals)wrapper.querySelector('.projected-visual-slot').appendChild(visuals);
  const parts=cloneSelected(root,':scope > .flag-box,:scope > .notice,:scope > .scheme,:scope > .preview-section,:scope > .section');
  for(const part of parts)wrapper.appendChild(part);
  if(!parts.length){const fallback=document.createElement('div');fallback.className='notice';fallback.textContent='Cette page ne contient pas encore de section affichable dans la projection.';wrapper.appendChild(fallback);}
  main.innerHTML='';main.appendChild(wrapper);buildToc(wrapper);window.scrollTo({top:0,behavior:'instant'});
}

async function showSearch(q=''){
  renderNav('search');setToc('');searchInput.value=q;document.title='Recherche Lore · Compendium enrichi';
  const items=await collectDocs(DOCS,'Indexation du Lore restructuré');
  const nq=norm(q),results=items.filter(x=>!nq||norm(`${x.title} ${x.docTitle} ${x.description}`).includes(nq)).sort((a,b)=>a.title.localeCompare(b.title,'fr',{numeric:true,sensitivity:'base'}));
  main.innerHTML=`<div class="page-head"><div class="eyebrow">RECHERCHE · PROJECTION LORE</div><h1>${q?`Résultats pour « ${esc(q)} »`:'Recherche Lore intégrée'}</h1><p>${results.length} page${results.length>1?'s':''} parmi les 364 pages restructurées. La recherche complète du Compendium final conservera également les règles, PNJ, Bestiaire et pages Lore hors de cette passe.</p></div><div class="article-list integration-list">${results.map(articleCard).join('')||'<div class="notice">Aucun résultat dans le corpus Lore restructuré.</div>'}</div>`;
}

async function handleRoute(){
  const raw=activeRoute(),[path,query='']=raw.split('?'),parts=path.split('/').filter(Boolean);
  try{
    if(!parts.length||parts[0]==='home'){showHome();return;}
    if(parts[0]==='category'){await showCategory(parts[1]||'Organisations');return;}
    if(parts[0]==='article'){await showArticle(parts[1],parts[2]);return;}
    if(parts[0]==='search'){await showSearch(new URLSearchParams(query).get('q')||'');return;}
    showHome();
  }catch(error){console.error(error);main.innerHTML=`<div class="notice"><strong>Projection indisponible.</strong><br>${esc(error.message||error)}</div>`;setToc('');}
}

$('#globalSearch').addEventListener('submit',event=>{event.preventDefault();const q=searchInput.value.trim();routeTo(`/search${q?`?q=${encodeURIComponent(q)}`:''}`);});
window.addEventListener('hashchange',handleRoute);
if(!location.hash)history.replaceState(null,'','#/home');
handleRoute();
