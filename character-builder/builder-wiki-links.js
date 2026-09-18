import {createWikiLinker} from '../compendium/wiki-links.js';
import {WIKI_EXPLICIT_TARGETS,WIKI_SEARCH_FALLBACKS,WIKI_STRICT_SURFACE_ALIASES,WIKI_CASE_SENSITIVE_ALIASES} from '../compendium/onboarding-data.js';
import {manualArticleMedia} from '../compendium/manual-media.js';
import {GUIDE_ARTICLES,GUIDE_NAVIGATION} from '../compendium/guide-articles.js';

const COMPENDIUM='../compendium/';
const MAX_PREVIEW_PARTS=24;
const ARTICLE_TITLE_FIXES={'regles-verite-angelus-sephirah-nesah-la-victoire':'Nesah — La Victoire'};
const excludedTags=new Set(['A','BUTTON','INPUT','SELECT','OPTION','TEXTAREA','LABEL','SCRIPT','STYLE','CODE','PRE']);
let navigation=null,manifest=null,linker=null;
const equipmentByTitle=new Map();
const datasetCache=new Map();
const articleCache=new Map();

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

async function loadJson(url){
  const r=await fetch(url,{cache:'no-cache'});if(!r.ok)throw new Error(`${url} · HTTP ${r.status}`);return r.json();
}
async function loadIndex(){
  [navigation,manifest]=await Promise.all([loadJson(COMPENDIUM+'data/navigation-v1.json'),loadJson(COMPENDIUM+'data/manifest-v3.json')]);
  const baseEntries=Array.isArray(navigation)?navigation:(navigation.entries||[]);
  const entries=[...baseEntries,...GUIDE_NAVIGATION];
  navigation={...(Array.isArray(navigation)?{}:navigation),entries};
  for(const article of GUIDE_ARTICLES)articleCache.set(article.id,structuredClone(article));
  for(const entry of entries){
    if(entry.category==='Équipement & Objets')equipmentByTitle.set(String(entry.displayTitle||entry.title||'').trim().toLocaleLowerCase('fr'),entry);
  }
  const pseudo=entries.map(entry=>({
    id:entry.id,title:ARTICLE_TITLE_FIXES[entry.id]||entry.displayTitle||entry.title||entry.id,dataset:entry.dataset,
    category:entry.category||'',group:entry.group||'',subgroup:entry.subgroup||''
  }));
  linker=createWikiLinker(pseudo,{
    explicitTargets:WIKI_EXPLICIT_TARGETS,
    strictSurfaceAliases:WIKI_STRICT_SURFACE_ALIASES,
    caseSensitiveAliases:WIKI_CASE_SENSITIVE_ALIASES,
    searchFallbacks:WIKI_SEARCH_FALLBACKS,
    hrefForId:id=>`${COMPENDIUM}index.html#/article/${encodeURIComponent(id)}`,
    searchHref:alias=>`${COMPENDIUM}index.html#/search?q=${encodeURIComponent(alias)}`
  });
}
function shouldSkip(node){
  let p=node.parentElement;
  while(p){
    if(excludedTags.has(p.tagName)||p.classList?.contains('builder-wiki-preview')||p.dataset?.wikiProcessed==='1')return true;
    if(p.id==='stepContent'||p.id==='summaryContent')return false;
    p=p.parentElement;
  }
  return true;
}
function processTextNode(node){
  if(!linker||shouldSkip(node))return;
  const raw=node.nodeValue||'';if(!raw.trim())return;
  const html=linker.linkify(raw);
  if(html===esc(raw)||!html.includes('class="wiki-link"'))return;
  const tpl=document.createElement('template');tpl.innerHTML=html;
  tpl.content.querySelectorAll('a.wiki-link').forEach(a=>{a.classList.add('builder-wiki-link');a.target='_self';a.rel='noopener'});
  node.replaceWith(tpl.content);
}
function compendiumHref(id){return `${COMPENDIUM}index.html#/article/${encodeURIComponent(id)}`}
function decorateEquipmentCards(host){
  if(!host)return;
  for(const card of host.querySelectorAll('.catalog-card:not([data-wiki-equipment])')){
    const strong=card.querySelector('.catalog-head strong');if(!strong)continue;
    const key=String(strong.textContent||'').trim().toLocaleLowerCase('fr');
    const entry=equipmentByTitle.get(key);if(!entry?.id)continue;
    card.dataset.wikiEquipment='1';card.dataset.wikiId=entry.id;card.classList.add('builder-wiki-equipment');
    if(!strong.querySelector('a')){
      const a=document.createElement('a');a.className='builder-wiki-equipment-title';a.dataset.wikiId=entry.id;a.href=compendiumHref(entry.id);a.textContent=strong.textContent||entry.displayTitle||entry.title||'Équipement';
      strong.replaceChildren(a);
    }
  }
}
function processHost(host){
  if(!host||!linker)return;
  decorateEquipmentCards(host);
  const walker=document.createTreeWalker(host,NodeFilter.SHOW_TEXT);
  const nodes=[];let node;
  while((node=walker.nextNode()))nodes.push(node);
  for(const text of nodes)processTextNode(text);
}
function scheduleProcess(){
  queueMicrotask(()=>{processHost(document.querySelector('#stepContent'));processHost(document.querySelector('#summaryContent'))});
}

async function loadDataset(datasetId){
  if(datasetCache.has(datasetId))return datasetCache.get(datasetId);
  const spec=(manifest?.datasets||[]).find(x=>x.id===datasetId);
  if(!spec||spec.parts>MAX_PREVIEW_PARTS){datasetCache.set(datasetId,null);return null}
  const promise=(async()=>{
    const parts=await Promise.all(Array.from({length:spec.parts},async(_,i)=>{
      const file=`${COMPENDIUM}data/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
      const r=await fetch(file,{cache:'force-cache'});if(!r.ok)throw new Error(`${file} · HTTP ${r.status}`);return r.text();
    }));
    const b64=parts.join('').replace(/\s+/g,'');
    const bin=atob(b64),bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const rows=JSON.parse(await new Response(stream).text());
    for(const article of rows||[])if(article?.id){article.title=ARTICLE_TITLE_FIXES[article.id]||article.title;articleCache.set(article.id,article)}
    return rows;
  })().catch(error=>{console.warn('Builder wiki preview dataset',datasetId,error);return null});
  datasetCache.set(datasetId,promise);return promise;
}
function navEntry(id){
  const entries=Array.isArray(navigation)?navigation:(navigation?.entries||[]);
  return entries.find(x=>x.id===id)||null;
}
function articlePreviewText(article,limit=330){
  const chunks=[];
  for(const section of article?.sections||[]){
    if(section?.audience==='mj')continue;
    for(const block of section.blocks||[]){
      if(block?.type==='p'&&String(block.text||'').trim())chunks.push(String(block.text).trim());
      if(chunks.join(' ').length>=limit*1.4)break;
    }
    if(chunks.join(' ').length>=limit*1.4)break;
  }
  const text=chunks.join(' ').replace(/\s+/g,' ').trim();
  if(!text)return'';
  return text.length>limit?text.slice(0,limit).replace(/\s+\S*$/,'')+'…':text;
}
function resolvedMedia(id,article){
  const media=manualArticleMedia(id)??article?.image??article?.illustration;
  const src=typeof media==='string'?media:media?.src;if(!src||/placeholder/i.test(src))return null;
  return {
    src:/^(?:https?:|data:|\/)/i.test(src)?src:COMPENDIUM+src.replace(/^\.\//,''),
    alt:typeof media==='object'&&media.alt?media.alt:(article?.title||id)
  };
}
async function previewFor(id){
  const nav=navEntry(id);if(!nav)return null;
  if(!articleCache.has(id)&&nav.dataset)await loadDataset(nav.dataset);
  const article=articleCache.get(id);
  return {
    title:article?.title||nav.displayTitle||nav.title||id,
    category:nav.category||article?.category||'Compendium',
    context:[nav.group,nav.subgroup].filter(Boolean).join(' · '),
    text:articlePreviewText(article),
    media:resolvedMedia(id,article)
  };
}

const tip=document.createElement('div');tip.className='builder-wiki-preview';tip.setAttribute('role','tooltip');tip.setAttribute('aria-hidden','true');document.body.appendChild(tip);
let activeLink=null,timer=null,requestToken=0;
function hidePreview(){clearTimeout(timer);activeLink=null;requestToken++;tip.classList.remove('visible');tip.setAttribute('aria-hidden','true')}
function positionPreview(link){
  const r=link.getBoundingClientRect(),pad=12,w=Math.min(420,window.innerWidth-pad*2);tip.style.width=w+'px';
  const left=Math.max(pad,Math.min(window.innerWidth-w-pad,r.left));let top=r.bottom+10;
  const h=tip.offsetHeight||180;if(top+h>window.innerHeight-pad)top=Math.max(pad,r.top-h-10);
  tip.style.left=left+'px';tip.style.top=top+'px';
}
async function showPreview(link){
  const id=link?.dataset?.wikiId;if(!id)return;
  activeLink=link;const token=++requestToken;
  const nav=navEntry(id);
  tip.innerHTML=`<div class="builder-wiki-kicker">${esc(nav?.category||'Compendium')}</div><strong>${esc(nav?.displayTitle||nav?.title||link.textContent||id)}</strong><p>Chargement de l’aperçu…</p><span>Cliquer pour ouvrir le Compendium →</span>`;
  tip.classList.add('visible');tip.setAttribute('aria-hidden','false');positionPreview(link);
  const preview=await previewFor(id);if(token!==requestToken||activeLink!==link||!preview)return;
  const body=preview.text||preview.context||'Ouvrir l’article pour lire le contenu complet.';
  tip.innerHTML=`${preview.media?`<img class="builder-wiki-image" src="${esc(preview.media.src)}" alt="${esc(preview.media.alt)}">`:''}<div class="builder-wiki-kicker">${esc(preview.category)}</div><strong>${esc(preview.title)}</strong>${preview.context?`<small>${esc(preview.context)}</small>`:''}<p>${esc(body)}</p><span>Cliquer pour ouvrir le Compendium →</span>`;
  positionPreview(link);
}
const wikiHoverSelector='a.builder-wiki-link[data-wiki-id],a.builder-wiki-equipment-title[data-wiki-id],.builder-wiki-equipment[data-wiki-id]';
document.addEventListener('mouseover',e=>{if(e.target.closest?.('button,input,select,textarea'))return;const link=e.target.closest?.(wikiHoverSelector);if(!link||link===activeLink)return;clearTimeout(timer);timer=setTimeout(()=>showPreview(link),120)});
document.addEventListener('mouseout',e=>{const link=e.target.closest?.(wikiHoverSelector);if(link&&!link.contains(e.relatedTarget))hidePreview()});
document.addEventListener('focusin',e=>{const link=e.target.closest?.('a.builder-wiki-link[data-wiki-id],a.builder-wiki-equipment-title[data-wiki-id]');if(link)showPreview(link)});
document.addEventListener('focusout',e=>{if(e.target.closest?.('a.builder-wiki-link[data-wiki-id],a.builder-wiki-equipment-title[data-wiki-id]'))hidePreview()});
window.addEventListener('scroll',()=>{if(activeLink)positionPreview(activeLink)},{passive:true});
window.addEventListener('resize',()=>{if(activeLink)positionPreview(activeLink)});

try{
  await loadIndex();
  scheduleProcess();
  const observer=new MutationObserver(scheduleProcess);
  for(const id of ['stepContent','summaryContent']){const host=document.getElementById(id);if(host)observer.observe(host,{childList:true,subtree:true,characterData:true})}
}catch(error){console.warn('Wiki Builder indisponible',error)}
