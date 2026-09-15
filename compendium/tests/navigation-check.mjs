import fs from 'node:fs';
import zlib from 'node:zlib';
import { classifyNavigation, navigationDisplayTitle } from '../navigation-schema-v2.js';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8')).map(page=>({...page,dataset:page.dataset||spec.id}));
}
const pages=manifest.datasets.flatMap(load).filter(page=>['Règles','Réalité','Vérité'].includes(page.category));
const expectedCounts=Object.fromEntries(['Règles','Réalité','Vérité'].map(category=>[category,pages.filter(page=>page.category===category).length]));
const expectedTotal=pages.length;

const navPath=`${DATA}/navigation-v1.json`;
if(!fs.existsSync(navPath))throw new Error('navigation-v1.json absent');
const nav=JSON.parse(fs.readFileSync(navPath,'utf8'));
if(nav.version!==2||!Array.isArray(nav.entries))throw new Error(`navigation-v1.json invalide/version ${nav.version}`);
if(nav.entries.length!==expectedTotal)throw new Error(`navigation-v1.json: ${nav.entries.length} entrées, attendu ${expectedTotal}`);

const catchAll=/^(?:autre(?:s)?(?:\s+règle(?:s)?)?|divers|misc(?:ellaneous)?)$/i;
const pageById=new Map(pages.map(page=>[page.id,page]));
const seen=new Set();
for(const entry of nav.entries){
  if(seen.has(entry.id))throw new Error(`Navigation: ID dupliqué ${entry.id}`);seen.add(entry.id);
  const page=pageById.get(entry.id);if(!page)throw new Error(`Navigation: page absente du corpus ${entry.id}`);
  if(entry.category!==page.category)throw new Error(`Navigation: catégorie incohérente ${entry.id}`);
  const classified=classifyNavigation(page);if(!classified)throw new Error(`Navigation: page non classée ${page.category} | ${page.dataset} | ${page.title}`);
  for(const key of ['group','subgroup'])if(!entry[key]||catchAll.test(entry[key].trim()))throw new Error(`Navigation: groupe interdit ${entry.id} | ${entry[key]}`);
  for(const key of ['groupOrder','subgroupOrder','pageOrder'])if(!Number.isFinite(entry[key]))throw new Error(`Navigation: ordre invalide ${entry.id} | ${key}`);
  if(entry.displayTitle!==navigationDisplayTitle(page.title))throw new Error(`Navigation: displayTitle incohérent ${entry.id}`);
  for(const key of ['group','subgroup','groupOrder','subgroupOrder','pageOrder'])if(entry[key]!==classified[key])throw new Error(`Navigation: dérive ${entry.id} | ${key}: ${entry[key]} != ${classified[key]}`);
}
for(const page of pages)if(!seen.has(page.id))throw new Error(`Navigation: page oubliée ${page.id}`);
for(const [category,count] of Object.entries(expectedCounts)){
  const actual=nav.entries.filter(entry=>entry.category===category).length;
  if(actual!==count)throw new Error(`${category}: ${actual} entrées navigation, attendu ${count}`);
}

const byTitle=new Map(pages.map(page=>[page.title,page]));
function expect(title,group,subgroup){
  const page=byTitle.get(title);if(!page)throw new Error(`Page témoin absente: ${title}`);
  const entry=nav.entries.find(row=>row.id===page.id);if(!entry)throw new Error(`Navigation témoin absente: ${title}`);
  if(entry.group!==group||entry.subgroup!==subgroup)throw new Error(`${title}: ${entry.group} > ${entry.subgroup}, attendu ${group} > ${subgroup}`);
}
expect('1. Résolution générale','Moteur commun','Règles fondamentales');
expect('Talents de Réalité — règles générales','Réalité — Talents & désavantages','Principes généraux');
expect('1. Principes du Neurodive','Réalité — Neurodive','Règles de Neurodive');
expect('1. Architecture de la Vérité','Vérité — Règles communes','Cadre commun');
expect('20. Corruption','Corruption & Fléaux','Corruption');

const index=fs.readFileSync('compendium/index.html','utf8');
if(!/category-navigation\.js/.test(index))throw new Error('index.html ne charge pas category-navigation.js');
const runtime=fs.readFileSync('compendium/category-navigation.js','utf8');
if(!/navigation-v1\.json/.test(runtime)||!/cloneNode\(true\)/.test(runtime)||!/hierarchical-category-list/.test(runtime))throw new Error('Runtime navigation hiérarchique/cliquable incomplet');
await import('./category-navigation-runtime-check.mjs');

console.log(`NAVIGATION OK — ${nav.entries.length}/${expectedTotal} pages visibles classées sans fourre-tout.`);
for(const category of ['Règles','Réalité','Vérité']){
  const groups=[...new Set(nav.entries.filter(entry=>entry.category===category).map(entry=>entry.group))];
  console.log(`${category}: ${expectedCounts[category]} pages · ${groups.length} groupes · ${groups.join(' · ')}`);
}
