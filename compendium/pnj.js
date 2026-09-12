import {loadSourceExtensions,loadPnjWave2} from './source-extensions.js';
const INDEX_URL='/TUC-Index-PNJ/static/contentIndex.json';
const RAW_BASE='https://raw.githubusercontent.com/Helclaeynn/TUC-Index-PNJ/main/content/';
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const slugify=s=>norm(s).replace(/\s+/g,'-')||'pnj';

function parseFrontmatter(raw){
  const out={tags:[],relations:[]};
  if(!raw.startsWith('---'))return {meta:out,body:raw};
  const end=raw.indexOf('\n---',3);if(end<0)return {meta:out,body:raw};
  const fm=raw.slice(3,end).trim().split(/\r?\n/);let listKey=null;
  for(const line of fm){
    const list=line.match(/^\s*-\s*(.+)$/);if(list&&listKey){out[listKey].push(list[1].trim().replace(/^['"]|['"]$/g,''));continue}
    const m=line.match(/^([A-Za-zÀ-ÿ_]+):\s*(.*)$/);if(!m)continue;const key=m[1],val=m[2].trim().replace(/^['"]|['"]$/g,'');
    if((key==='tags'||key==='relations')&&!val){out[key]=[];listKey=key}else{out[key]=val;listKey=null}
  }
  return {meta:out,body:raw.slice(end+4).trim()};
}

function markdownSections(body){
  const clean=body.replace(/```[\s\S]*?```/g,'').replace(/!\[\[[^\]]+\]\]/g,'').trim();
  const lines=clean.split(/\r?\n/);const sections=[];let current={id:'description',title:'Description',level:2,blocks:[]},para=[];
  const flush=()=>{const t=para.join(' ').replace(/\s+/g,' ').trim();if(t&&t!=='—')current.blocks.push({type:'p',text:t});para=[]};
  const push=()=>{flush();if(current.blocks.length||current.title!=='Description')sections.push(current)};
  for(const line of lines){const h=line.match(/^(#{1,5})\s+(.+)$/);if(h){push();current={id:slugify(h[2]),title:h[2].trim(),level:Math.max(2,h[1].length),blocks:[]};continue}if(!line.trim()){flush();continue}para.push(line.trim())}push();
  return sections.filter(s=>!(norm(s.title)==='portrait'&&!s.blocks.length));
}

function pnjFromMeta(meta){return {
  name:meta.nom_verite||meta.nom||'',race:meta.race||'',age:meta.age||'',origine:meta.origine||'',statut:meta.statut||'',statutVerite:meta.statut_verite||'',portrait:meta.portrait||'',relations:Array.isArray(meta.relations)?meta.relations:[]
}}

function articleFromIndex(slug,d){
  const filePath=d.filePath||`${slug}.md`;const title=d.title||slug.split('/').pop()||slug;
  return {id:`pnj-index-${slugify(slug)}`,title,category:'Personnages',source:'TUC-Index-PNJ',status:'source_detaillee',audience:'player',tags:[...(d.tags||[]),'PNJ','Index PNJ'],sections:[{id:'description',title:'Description',level:2,blocks:[{type:'p',text:d.content||'Fiche PNJ publiée dans l’index historique.'}]}],pnj:{completeness:(d.content||'').trim().length>80?'mini_bg':'stub',externalPath:filePath,indexSlug:slug}}
}

async function loadIndex(existingTitles){
  try{
    const r=await fetch(INDEX_URL,{cache:'no-cache'});if(!r.ok)throw new Error(`HTTP ${r.status}`);const data=await r.json();const articles=[];const duplicates=new Map();
    for(const [slug,d] of Object.entries(data)){const path=String(d.filePath||slug);if(!/(^|\/)PNJ\//i.test(path)&&!/^PNJ\//i.test(slug))continue;const a=articleFromIndex(slug,d),key=norm(a.title);if(existingTitles.has(key)){duplicates.set(key,a);continue}existingTitles.add(key);articles.push(a)}
    return {articles,duplicates,error:null};
  }catch(error){console.warn('Index PNJ externe indisponible',error);return {articles:[],duplicates:new Map(),error}}
}

async function loadSeeds(existingTitles){
  try{const r=await fetch('data/pnj-source-seed.json');if(!r.ok)throw new Error(`HTTP ${r.status}`);const rows=await r.json(),articles=[];for(const row of rows){const key=norm(row.title);if(existingTitles.has(key))continue;existingTitles.add(key);articles.push({...row,id:row.id||`pnj-source-${slugify(row.title)}`,category:'Personnages',status:row.status||'source_detaillee',audience:row.audience||'player',tags:[...(row.tags||[]),'PNJ'],pnj:{...(row.pnj||{}),completeness:row.pnj?.completeness||'stub'}})}return articles}catch(error){console.warn('Seeds PNJ indisponibles',error);return []}}

function normalizeWavePnj(rows,existingTitles){const articles=[];for(const row of rows||[]){const key=norm(row.title);if(!key||existingTitles.has(key))continue;existingTitles.add(key);articles.push({...row,id:row.id||`pnj-wave2-${slugify(row.title)}`,category:'Personnages',status:row.status||'source_detaillee',audience:row.audience||'player',tags:[...(row.tags||[]),'PNJ','Source détaillée'],pnj:{...(row.pnj||{}),completeness:row.pnj?.completeness||'mini_bg'}})}return articles}

export async function loadPnjExtensions(existingMeta=[]){
  const titles=new Set(existingMeta.map(a=>norm(a.title)));
  const sourceExt=await loadSourceExtensions(existingMeta);for(const a of sourceExt.articles)titles.add(norm(a.title));
  const seeds=await loadSeeds(titles);
  const wave2=normalizeWavePnj(await loadPnjWave2(),titles);
  const idx=await loadIndex(titles);
  return {articles:[...sourceExt.articles,...seeds,...wave2,...idx.articles],duplicates:idx.duplicates,indexError:idx.error,sourceError:sourceExt.error};
}

export async function hydratePnjArticle(article){
  if(!article?.pnj?.externalPath||article.pnj.hydrated)return article;article.pnj.hydrated=true;
  try{const path=String(article.pnj.externalPath).replace(/^content\//,'');const r=await fetch(RAW_BASE+path.split('/').map(encodeURIComponent).join('/'));if(!r.ok)throw new Error(`HTTP ${r.status}`);const raw=await r.text(),parsed=parseFrontmatter(raw),meta=pnjFromMeta(parsed.meta);article.pnj={...article.pnj,...meta,hydrated:true};article.tags=[...new Set([...(article.tags||[]),...(parsed.meta.tags||[])])];const secs=markdownSections(parsed.body);if(secs.length)article.sections=secs}catch(error){article.pnj.hydrateError=String(error)}return article
}

export function pnjCompletenessLabel(v){return v==='detailed'?'BG détaillé':v==='mini_bg'?'Mini-BG':v==='stub'?'À compléter':'PNJ'}
