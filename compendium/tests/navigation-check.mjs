import fs from 'node:fs';
import zlib from 'node:zlib';
import { classifyNavigation, navigationDisplayTitle } from '../navigation-schema.js';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){
  const spec=manifest.datasets.find(dataset=>dataset.id===id);
  if(!spec) throw new Error(`Dataset absent: ${id}`);
  let b64='';
  for(let i=0;i<spec.parts;i++) b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}

const pages=[...load('moteur'),...load('realite'),...load('verite')];
const expectedCounts={Règles:247,Réalité:21,Vérité:54};
const expectedTotal=Object.values(expectedCounts).reduce((a,b)=>a+b,0);
if(pages.length!==expectedTotal) throw new Error(`Navigation: ${pages.length} pages sources, attendu ${expectedTotal}`);

const navPath=`${DATA}/navigation-v1.json`;
if(!fs.existsSync(navPath)) throw new Error('navigation-v1.json absent');
const nav=JSON.parse(fs.readFileSync(navPath,'utf8'));
if(nav.version!==1||!Array.isArray(nav.entries)) throw new Error('navigation-v1.json invalide');
if(nav.entries.length!==expectedTotal) throw new Error(`navigation-v1.json: ${nav.entries.length} entrées, attendu ${expectedTotal}`);

const pageById=new Map(pages.map(page=>[page.id,page]));
const seen=new Set();
for(const entry of nav.entries){
  if(seen.has(entry.id)) throw new Error(`Navigation: ID dupliqué ${entry.id}`);
  seen.add(entry.id);
  const page=pageById.get(entry.id);
  if(!page) throw new Error(`Navigation: page absente du corpus ${entry.id}`);
  if(entry.category!==page.category) throw new Error(`Navigation: catégorie incohérente ${entry.id}`);
  const classified=classifyNavigation(page);
  if(!classified) throw new Error(`Navigation: page non classée ${page.category} | ${page.title}`);
  for(const key of ['group','subgroup']) if(!entry[key]||/^(autre|autres|divers|misc)/i.test(entry[key])) throw new Error(`Navigation: groupe interdit ${entry.id} | ${entry[key]}`);
  for(const key of ['groupOrder','subgroupOrder','pageOrder']) if(!Number.isFinite(entry[key])) throw new Error(`Navigation: ordre invalide ${entry.id} | ${key}`);
  if(entry.displayTitle!==navigationDisplayTitle(page.title)) throw new Error(`Navigation: displayTitle incohérent ${entry.id}`);
  for(const key of ['group','subgroup','groupOrder','subgroupOrder','pageOrder']) if(entry[key]!==classified[key]) throw new Error(`Navigation: dérive ${entry.id} | ${key}: ${entry[key]} != ${classified[key]}`);
}
for(const page of pages) if(!seen.has(page.id)) throw new Error(`Navigation: page oubliée ${page.id}`);

for(const [category,count] of Object.entries(expectedCounts)){
  const actual=nav.entries.filter(entry=>entry.category===category).length;
  if(actual!==count) throw new Error(`${category}: ${actual} entrées navigation, attendu ${count}`);
}

const byTitle=new Map(pages.map(page=>[page.title,page]));
function expect(title,group,subgroup){
  const page=byTitle.get(title);
  if(!page) throw new Error(`Page témoin absente: ${title}`);
  const entry=nav.entries.find(row=>row.id===page.id);
  if(!entry) throw new Error(`Navigation témoin absente: ${title}`);
  if(entry.group!==group||entry.subgroup!==subgroup) throw new Error(`${title}: ${entry.group} > ${entry.subgroup}, attendu ${group} > ${subgroup}`);
}
expect('1. Résolution générale','Moteur commun','Règles fondamentales');
expect('Talents de Réalité — règles générales','Réalité — Talents & désavantages','Principes généraux');
expect('1. Principes du Neurodive','Réalité — Neurodive','Règles de Neurodive');
expect('1. Architecture de la Vérité','Vérité — Règles communes','Cadre commun');
expect('20. Corruption','Corruption & Fléaux','Corruption');
expect('23. Équipement de Chasse','Équipement & marchés de Vérité','Pages transitoires à auditer');

const vampireNature=nav.entries.find(entry=>entry.id==='regles-verite-nature-vampire');
if(!vampireNature||vampireNature.group!=='Vérité — Natures & capacités'||vampireNature.subgroup!=='Vampires') throw new Error('Nature Vampire mal classée');
const sangEcarlate=nav.entries.find(entry=>/sang-ecarlate/.test(entry.id));
if(!sangEcarlate||sangEcarlate.group!=='Vérité — Natures & capacités'||sangEcarlate.subgroup!=='Vampires') throw new Error('Sang Écarlate mal classé');

const index=fs.readFileSync('compendium/index.html','utf8');
if(!/category-navigation\.js/.test(index)) throw new Error('index.html ne charge pas category-navigation.js');
const runtime=fs.readFileSync('compendium/category-navigation.js','utf8');
if(!/navigation-v1\.json/.test(runtime)||!/hierarchical-category-list/.test(runtime)) throw new Error('Runtime navigation hiérarchique incomplet');

console.log(`NAVIGATION OK — ${nav.entries.length}/${expectedTotal} pages classées sans fourre-tout.`);
for(const category of ['Règles','Réalité','Vérité']){
  const groups=[...new Set(nav.entries.filter(entry=>entry.category===category).map(entry=>entry.group))];
  console.log(`${category}: ${groups.length} groupes · ${groups.join(' · ')}`);
}
