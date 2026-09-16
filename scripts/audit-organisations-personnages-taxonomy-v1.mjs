import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));

function load(id){
  const spec=manifest.datasets.find(dataset=>dataset.id===id);
  if(!spec)throw new Error(`Dataset absent: ${id}`);
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8')).map(page=>({...page,dataset:page.dataset||id}));
}
function inc(map,key){key=String(key??'—').trim()||'—';map.set(key,(map.get(key)||0)+1)}
function printMap(label,map){
  console.log(label);
  for(const [key,count] of [...map.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'fr')))console.log(`  ${count} | ${key}`);
}
function realm(page){
  const tags=(page.tags||[]).map(String);
  if(tags.includes('Réalité'))return 'Réalité';
  if(tags.includes('Vérité'))return 'Vérité';
  return 'Sans domaine';
}
function cleanTags(page){return (page.tags||[]).map(String).filter(tag=>!['PNJ','Organisation','Organisations','Réalité','Vérité','Majeur','Secondaire','Mineur'].includes(tag))}

const all=manifest.datasets.flatMap(dataset=>load(dataset.id));
const organisations=all.filter(page=>page.category==='Organisations');
const personnages=all.filter(page=>page.category==='Personnages');
if(!organisations.length)throw new Error('Aucune page Organisations trouvée');
if(!personnages.length)throw new Error('Aucune page Personnages trouvée');

console.log(`ORGANISATIONS ${organisations.length}`);
const orgRealm=new Map(),orgTags=new Map(),orgSources=new Map();
for(const page of organisations){inc(orgRealm,realm(page));for(const tag of cleanTags(page))inc(orgTags,tag);inc(orgSources,page.source||'—')}
printMap('ORG DOMAINES',orgRealm);printMap('ORG TAGS UTILES',orgTags);printMap('ORG SOURCES',orgSources);
console.log('ORG INVENTAIRE');
for(const page of [...organisations].sort((a,b)=>realm(a).localeCompare(realm(b),'fr')||a.title.localeCompare(b.title,'fr')))console.log(`  ${realm(page)} | ${page.id} | ${page.title} | tags=${cleanTags(page).join(' > ')||'—'} | source=${page.source||'—'}`);

console.log(`PERSONNAGES ${personnages.length}`);
const pnjRealm=new Map(),affiliations=new Map(),importance=new Map(),locations=new Map();
for(const page of personnages){
  const r=realm(page);inc(pnjRealm,r);inc(affiliations,`${r} | ${page.affiliation||'—'}`);inc(importance,page.importance||'—');inc(locations,page.location||'—');
}
printMap('PNJ DOMAINES',pnjRealm);printMap('PNJ AFFILIATIONS PAR DOMAINE',affiliations);printMap('PNJ IMPORTANCE',importance);printMap('PNJ LOCALISATIONS',locations);
console.log('PNJ SANS DOMAINE');
for(const page of personnages.filter(page=>realm(page)==='Sans domaine'))console.log(`  ${page.id} | ${page.title} | affiliation=${page.affiliation||'—'} | tags=${(page.tags||[]).join(' > ')}`);
console.log('PNJ SANS AFFILIATION');
for(const page of personnages.filter(page=>!String(page.affiliation||'').trim()))console.log(`  ${realm(page)} | ${page.id} | ${page.title} | tags=${cleanTags(page).join(' > ')||'—'}`);

console.log(`TAXONOMY TARGETS OK — Organisations ${organisations.length} · Personnages ${personnages.length}.`);
