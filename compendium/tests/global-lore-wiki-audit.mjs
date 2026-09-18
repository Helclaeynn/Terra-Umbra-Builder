import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {createWikiLinker} from '../wiki-links.js';
import {WIKI_EXPLICIT_TARGETS,WIKI_SEARCH_FALLBACKS} from '../onboarding-data.js';

const root=new URL('../',import.meta.url);
const manifest=JSON.parse(fs.readFileSync(new URL('data/manifest-v3.json',root),'utf8'));
const navigation=JSON.parse(fs.readFileSync(new URL('data/navigation-v1.json',root),'utf8'));
const navEntries=Array.isArray(navigation)?navigation:(navigation.entries||[]);
const navById=new Map(navEntries.map(entry=>[entry.id,entry]));

function loadDataset(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(new URL(`data/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,root),'utf8');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64.replace(/\s+/g,''),'base64')).toString('utf8'));
}
function norm(value=''){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function articleText(article){
  const out=[];
  for(const section of article.sections||[])for(const block of section.blocks||[]){
    if(block?.type==='p')out.push(block.text||'');
    else if(block?.type==='table')for(const row of block.rows||[])out.push(...row);
  }
  return out.join(' ').replace(/\s+/g,' ').trim();
}
function context(article,dataset){
  const nav=navById.get(article.id)||{};
  return {...article,dataset,category:nav.category||article.category||'',group:nav.group||'',subgroup:nav.subgroup||'',title:article.title||nav.displayTitle||nav.title||article.id};
}
const articles=[];
for(const spec of manifest.datasets)for(const row of loadDataset(spec))articles.push(context(row,spec.id));
const byId=new Map(articles.map(a=>[a.id,a]));
const linker=createWikiLinker(articles,{explicitTargets:WIKI_EXPLICIT_TARGETS,searchFallbacks:WIKI_SEARCH_FALLBACKS});
const anchorRe=/<a class="wiki-link"[^>]*data-wiki-id="([^"]+)"[^>]*>([^<]*)<\/a>/g;
const inbound=new Map(),outbound=new Map(),labels=new Map();
for(const article of articles){
  let count=0;
  const text=articleText(article);
  const html=linker.linkify(text,article);
  anchorRe.lastIndex=0;let m;
  while((m=anchorRe.exec(html))){
    count++;
    inbound.set(m[1],(inbound.get(m[1])||0)+1);
    const label=norm(m[2]);if(label)labels.set(label,(labels.get(label)||0)+1);
  }
  outbound.set(article.id,count);
}
const titleGroups=new Map();
for(const article of articles){
  const k=norm(article.title);if(!k)continue;
  if(!titleGroups.has(k))titleGroups.set(k,[]);
  titleGroups.get(k).push(article);
}
const collisions=[...titleGroups.entries()].filter(([,rows])=>rows.length>1).map(([key,rows])=>({key,rows:rows.map(x=>({id:x.id,title:x.title,category:x.category,dataset:x.dataset}))}));
const zeroOutbound=articles.filter(a=>(outbound.get(a.id)||0)===0).map(a=>({id:a.id,title:a.title,category:a.category,dataset:a.dataset,text:articleText(a).length})).sort((a,b)=>b.text-a.text);
const zeroInbound=articles.filter(a=>(inbound.get(a.id)||0)===0).map(a=>({id:a.id,title:a.title,category:a.category,dataset:a.dataset}));
const concepts=['Vérité','Réalité','Voile','Hologramme','Khinae','Fléaux','Corruption','Ombremonde','Neurodive','Crawlers','Chasseurs','Vampires','Garous','Mages','Daemons','Angelus','Aseryns','Exilés','Extrals'];
const conceptStats=concepts.map(label=>{
  const key=norm(label),mentioning=articles.filter(a=>norm(articleText(a)).includes(key)).length;
  const target=WIKI_EXPLICIT_TARGETS[label]||WIKI_EXPLICIT_TARGETS[label.replace(/s$/,'')]||'';
  return {label,mentioning,target,inbound:target?(inbound.get(target)||0):0};
});
const selectedIds=[
  'realite-001-chapitre-vivre-en-grande-californie',
  'verite-001-la-verite-n-est-pas-un-second-monde',
  'verite-002-le-voile-et-l-hologramme',
  'verite-046-10-vampires',
  'verite-047-11-garous-loups-descendants-de-khinae',
  'verite-048-12-autres-descendants-de-khinae',
  'verite-057-21-les-six-fleaux-et-le-faux-septieme'
];
const selected=selectedIds.map(id=>{const a=byId.get(id);return a?{id,title:a.title,category:a.category,text:articleText(a)}:{id,missing:true}});

const builderDir=new URL('../character-builder/app.parts/',root);
const builderFiles=fs.readdirSync(builderDir).filter(name=>name.endsWith('.txt'));
const builderSource=builderFiles.map(name=>fs.readFileSync(new URL(name,builderDir),'utf8')).join('\n');
const builderConcepts=concepts.map(label=>({label,occurrences:(norm(builderSource).match(new RegExp(`\\b${norm(label).replace(/ /g,'\\s+')}\\b`,'g'))||[]).length,target:WIKI_EXPLICIT_TARGETS[label]||''}));

const report={
  corpus:{articles:articles.length,aliases:linker.stats.aliases,ambiguous:linker.stats.ambiguous,directLinks:[...outbound.values()].reduce((a,b)=>a+b,0)},
  coverage:{zeroOutbound:zeroOutbound.length,zeroInbound:zeroInbound.length,zeroOutboundSample:zeroOutbound.slice(0,40),zeroInboundSample:zeroInbound.slice(0,40)},
  titleCollisions:collisions.slice(0,80),
  conceptStats,
  builderConcepts,
  selected
};
fs.writeFileSync('/tmp/tuc-global-lore-wiki-audit.json',JSON.stringify(report,null,2));
console.log('GLOBAL LORE/WIKI AUDIT');
console.log(JSON.stringify(report,null,2));
