import fs from 'node:fs';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {createWikiLinker,WIKI_GENERIC_SINGLE} from '../wiki-links.js';
import {WIKI_EXPLICIT_TARGETS,WIKI_SEARCH_FALLBACKS} from '../onboarding-data.js';
import {GUIDE_ARTICLES,GUIDE_NAVIGATION} from '../guide-articles.js';

const root=new URL('../',import.meta.url);
const manifest=JSON.parse(fs.readFileSync(new URL('data/manifest-v3.json',root),'utf8'));
const navigation=JSON.parse(fs.readFileSync(new URL('data/navigation-v1.json',root),'utf8'));
const navEntries=[...(Array.isArray(navigation)?navigation:(navigation.entries||[])),...GUIDE_NAVIGATION];
const navById=new Map(navEntries.map(entry=>[entry.id,entry]));

function loadDataset(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(new URL(`data/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,root),'utf8');
  const rows=JSON.parse(zlib.gunzipSync(Buffer.from(b64.replace(/\s+/g,''),'base64')).toString('utf8'));
  assert.ok(Array.isArray(rows),`${spec.id}: dataset non tabulaire`);
  return rows;
}
function normalized(value=''){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function articleContext(article,dataset){
  const nav=navById.get(article.id)||{};
  return {...article,dataset,category:nav.category||article.category||'',group:nav.group||'',subgroup:nav.subgroup||'',title:article.title||nav.displayTitle||nav.title||article.id};
}

const articles=[];
for(const spec of manifest.datasets)for(const row of loadDataset(spec))articles.push(articleContext(row,spec.id));
assert.equal(articles.length,manifest.expectedTotal,`Corpus wiki source: ${articles.length} articles, attendu ${manifest.expectedTotal}`);
for(const row of GUIDE_ARTICLES)articles.push(articleContext(structuredClone(row),'guide'));
assert.equal(articles.length,manifest.expectedTotal+GUIDE_ARTICLES.length,`Corpus wiki runtime: guides éditoriaux manquants`);
const ids=new Set(articles.map(a=>a.id));
const linker=createWikiLinker(articles,{explicitTargets:WIKI_EXPLICIT_TARGETS,searchFallbacks:WIKI_SEARCH_FALLBACKS});
const explicitAliases=new Set(Object.keys(WIKI_EXPLICIT_TARGETS).map(normalized));
const anchorRe=/<a class="wiki-link"[^>]*data-wiki-id="([^"]+)"[^>]*>([^<]*)<\/a>/g;
let blocks=0,directLinks=0;
const byCategory=new Map();

function auditText(text,current){
  blocks++;
  const html=linker.linkify(text,current);anchorRe.lastIndex=0;let match;
  while((match=anchorRe.exec(html))){
    const [,targetId,label]=match;directLinks++;
    assert.ok(ids.has(targetId),`${current.id}: lien vers ID absent ${targetId}`);
    assert.notEqual(targetId,current.id,`${current.id}: auto-lien détecté sur ${label}`);
    const key=normalized(label);
    if(key&&!explicitAliases.has(key)&&!key.includes(' '))assert.ok(!WIKI_GENERIC_SINGLE.has(key),`${current.id}: nom commun auto-lié « ${label} » -> ${targetId}`);
    const target=navById.get(targetId);const cat=target?.category||'autre';byCategory.set(cat,(byCategory.get(cat)||0)+1);
  }
}

for(const article of articles){
  for(const section of article.sections||[])for(const block of section.blocks||[]){
    if(block?.type==='p')auditText(block.text||'',article);
    else if(block?.type==='table')for(const row of block.rows||[])for(const cell of row||[])auditText(cell||'',article);
  }
}

const crawlerContext={id:'audit-crawler',category:'Réalité',dataset:'lore',group:'Pègre, Crawlers & anti-systèmes',subgroup:'Crawlers',title:'Audit'};
const crawler=linker.linkify('Des réseaux de Crawlers assurent la circulation des contacts et des informations.',crawlerContext);
assert.doesNotMatch(crawler,/>réseaux<\/a>/i,'« réseaux » ne doit pas devenir un lien matériel générique');
assert.match(crawler,/data-wiki-id="realite-lore-crawlers-underlife"[^>]*>Crawlers<\/a>/i,'Crawlers doit privilégier sa page de lore');

const daemonContext={id:'audit-daemon',category:'Vérité',dataset:'verite',group:'Natures, peuples & traditions',subgroup:'Daemons',title:'Audit'};
const gods=linker.linkify('Les Daemons servent des Divinités. Belial est l’une de ces puissances.',daemonContext);
assert.match(gods,/data-wiki-id="verite-050-14-daemons"[^>]*>Daemons<\/a>/);
assert.match(gods,/data-wiki-id="verite-lore-anciennes-divinites"[^>]*>Divinités<\/a>/);
assert.match(gods,/data-wiki-id="verite-lore-divinite-belial"[^>]*>Belial<\/a>/);

const temple=linker.linkify('Le Temple de Belial organise ses fidèles.',daemonContext);
assert.match(temple,/data-wiki-id="lore-daemon-temples-temple-belial"[^>]*>Temple de Belial<\/a>/,'Le titre spécifique doit gagner sur le mot Belial seul');

const equipmentContext={id:'audit-equipment',category:'Équipement & Objets',dataset:'equipement',group:'Équipement de Réalité',subgroup:'Vie quotidienne',title:'Audit'};
const exactEquipment=linker.linkify('Media Holonet / reseaux',equipmentContext);
assert.match(exactEquipment,/data-wiki-id="equipement-212-media-holonet-reseaux"/,'Un titre matériel exact reste cliquable vers son équipement');

console.log(`WIKI CONTEXT AUDIT OK — ${articles.length} articles · ${blocks} blocs audités · ${directLinks} liens directs · destinations: ${[...byCategory.entries()].sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${v}`).join(' · ')}`);
