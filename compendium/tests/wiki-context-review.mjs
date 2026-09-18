import fs from 'node:fs';
import zlib from 'node:zlib';
import {createWikiLinker} from '../wiki-links.js';
import {WIKI_EXPLICIT_TARGETS,WIKI_SEARCH_FALLBACKS,WIKI_STRICT_SURFACE_ALIASES} from '../onboarding-data.js';
import {GUIDE_ARTICLES,GUIDE_NAVIGATION} from '../guide-articles.js';

const root=new URL('../',import.meta.url);
const manifest=JSON.parse(fs.readFileSync(new URL('data/manifest-v3.json',root),'utf8'));
const navigation=JSON.parse(fs.readFileSync(new URL('data/navigation-v1.json',root),'utf8'));
const navEntries=[...(navigation.entries||[]),...GUIDE_NAVIGATION];
const navById=new Map(navEntries.map(x=>[x.id,x]));

function loadDataset(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(new URL(`data/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,root),'utf8');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64.replace(/\s+/g,''),'base64')).toString('utf8'));
}
function norm(value=''){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function surface(value=''){return String(value).normalize('NFC').toLocaleLowerCase('fr').replace(/[’]/g,"'").replace(/\s+/g,' ').trim()}
function context(article,dataset){
  const nav=navById.get(article.id)||{};
  return {...article,dataset,category:nav.category||article.category||'',group:nav.group||'',subgroup:nav.subgroup||'',title:article.title||nav.displayTitle||article.id};
}
function blocksOf(article){
  const out=[];
  for(const section of article.sections||[])for(const block of section.blocks||[]){
    if(block?.type==='p'&&block.text)out.push({section:section.title||'',text:String(block.text)});
    else if(block?.type==='table')for(const row of block.rows||[])for(const cell of row||[])if(cell)out.push({section:section.title||'',text:String(cell)});
  }
  return out;
}
const articles=[];
for(const spec of manifest.datasets)for(const row of loadDataset(spec))articles.push(context(row,spec.id));
for(const row of GUIDE_ARTICLES)articles.push(context(structuredClone(row),'guide'));
const byId=new Map(articles.map(a=>[a.id,a]));
const linker=createWikiLinker(articles,{explicitTargets:WIKI_EXPLICIT_TARGETS,strictSurfaceAliases:WIKI_STRICT_SURFACE_ALIASES,searchFallbacks:WIKI_SEARCH_FALLBACKS});
const explicitByNorm=new Map();
for(const [alias,id] of Object.entries(WIKI_EXPLICIT_TARGETS)){
  const k=norm(alias);if(!explicitByNorm.has(k))explicitByNorm.set(k,[]);
  explicitByNorm.get(k).push({alias,id,surface:surface(alias)});
}
const risky=new Set(['cycle','corruption','chasseur','chasseurs','fleau','fleaux','revelation','revele','revelee','voile','nature']);
const anchorRe=/<a class="wiki-link"[^>]*data-wiki-id="([^"]+)"[^>]*>([^<]*)<\/a>/g;
const groups=new Map(),review=[];
let total=0;
for(const article of articles){
  for(const block of blocksOf(article)){
    const html=linker.linkify(block.text,article);anchorRe.lastIndex=0;let m;
    while((m=anchorRe.exec(html))){
      total++;
      const targetId=m[1],label=m[2].replace(/&#39;/g,"'").replace(/&amp;/g,'&'),target=byId.get(targetId)||navById.get(targetId)||{};
      const key=`${targetId}||${surface(label)}||${article.dataset}`;
      if(!groups.has(key))groups.set(key,{targetId,targetTitle:target.title||target.displayTitle||targetId,label,count:0,sources:new Set(),samples:[]});
      const g=groups.get(key);g.count++;g.sources.add(article.id);if(g.samples.length<5)g.samples.push({sourceId:article.id,sourceTitle:article.title,sourceCategory:article.category,section:block.section,text:block.text.slice(0,700)});
      const n=norm(label),aliases=explicitByNorm.get(n)||[];
      const flags=[];
      if(risky.has(n))flags.push('high-risk-word');
      if(aliases.length&&aliases.every(a=>a.id===targetId)&&!aliases.some(a=>a.surface===surface(label)))flags.push('surface-drift');
      if(['equipement','augmentations','verite-catalogue'].includes(article.dataset)&&target.category==='Vérité')flags.push('material-to-lore');
      if(norm(article.title).includes(n)&&n.length>=4)flags.push('label-in-current-title');
      if(article.id==='realite-022-7-corruption-de-programmes-et-materiel'&&targetId==='verite-056-20-corruption')flags.push('neurodive-corruption');
      if(flags.length)review.push({flags,targetId,targetTitle:target.title||target.displayTitle||targetId,label,sourceId:article.id,sourceTitle:article.title,sourceCategory:article.category,dataset:article.dataset,section:block.section,text:block.text.slice(0,900)});
    }
  }
}
const grouped=[...groups.values()].map(g=>({...g,sources:[...g.sources]})).sort((a,b)=>b.count-a.count||a.targetTitle.localeCompare(b.targetTitle,'fr'));
const dedupReview=[];const seen=new Set();
for(const row of review){const k=`${row.flags.join(',')}|${row.targetId}|${surface(row.label)}|${row.sourceId}|${row.section}`;if(seen.has(k))continue;seen.add(k);dedupReview.push(row)}
const report={generatedAt:new Date().toISOString(),articles:articles.length,totalLinks:total,distinctGroups:grouped.length,reviewCount:dedupReview.length,review:dedupReview,groups:grouped};
fs.writeFileSync('/tmp/tuc-wiki-context-review.json',JSON.stringify(report,null,2));
console.log(`WIKI CONTEXT REVIEW — ${articles.length} articles · ${total} links · ${grouped.length} groups · ${dedupReview.length} review flags`);
for(const row of dedupReview.slice(0,120))console.log(JSON.stringify(row));
