import fs from 'node:fs';
import zlib from 'node:zlib';
import { classifyNavigation, navigationDisplayTitle } from '../navigation-schema-v3.js';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const hierarchical=['Règles','Réalité','Équipement','Augmentations','Vérité','Catalogue Vérité','Organisations','Personnages','Bestiaire'];
const catalogTitleDatasets=new Set(['equipement','augmentations','verite-catalogue']);
function load(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8')).map(page=>({...page,dataset:page.dataset||spec.id}));
}
function expectedDisplayTitle(page){return catalogTitleDatasets.has(page.dataset)?String(page.title||'').trim():navigationDisplayTitle(page.title)}
const pages=manifest.datasets.flatMap(load).filter(page=>hierarchical.includes(page.category));
const expectedCounts=Object.fromEntries(hierarchical.map(category=>[category,pages.filter(page=>page.category===category).length]));
const expectedTotal=pages.length;

const fixedCounts={'Règles':251,'Réalité':9,'Équipement':297,'Augmentations':111,'Catalogue Vérité':229,'Organisations':304,'Personnages':223,'Bestiaire':263};
for(const [category,count] of Object.entries(fixedCounts))if(expectedCounts[category]!==count)throw new Error(`${category}: ${expectedCounts[category]}, attendu ${count} — aucune entrée ne doit disparaître pendant la restructuration`);

const navPath=`${DATA}/navigation-v1.json`;
if(!fs.existsSync(navPath))throw new Error('navigation-v1.json absent');
const nav=JSON.parse(fs.readFileSync(navPath,'utf8'));
if(nav.version!==3||!Array.isArray(nav.entries))throw new Error(`navigation-v1.json invalide/version ${nav.version}`);
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
  if(entry.displayTitle!==expectedDisplayTitle(page))throw new Error(`Navigation: displayTitle incohérent ${entry.id}: ${entry.displayTitle} != ${expectedDisplayTitle(page)}`);
  for(const key of ['group','subgroup','groupOrder','subgroupOrder','pageOrder'])if(entry[key]!==classified[key])throw new Error(`Navigation: dérive ${entry.id} | ${key}: ${entry[key]} != ${classified[key]}`);
}
for(const page of pages)if(!seen.has(page.id))throw new Error(`Navigation: page oubliée ${page.id}`);
for(const [category,count] of Object.entries(expectedCounts)){
  const actual=nav.entries.filter(entry=>entry.category===category).length;
  if(actual!==count)throw new Error(`${category}: ${actual} entrées navigation, attendu ${count}`);
}
const twoFence=nav.entries.find(entry=>entry.id==='equipement-264-2-fence');
if(!twoFence||twoFence.displayTitle!=='2-Fence')throw new Error(`2-Fence: titre de navigation altéré (${twoFence?.displayTitle||'absent'})`);

function expectId(id,group,subgroup){
  const page=pageById.get(id);if(!page)throw new Error(`Page témoin absente: ${id}`);
  const entry=nav.entries.find(row=>row.id===id);if(!entry)throw new Error(`Navigation témoin absente: ${id}`);
  if(entry.group!==group||entry.subgroup!==subgroup)throw new Error(`${id}: ${entry.group} > ${entry.subgroup}, attendu ${group} > ${subgroup}`);
}
expectId('moteur-001-1-resolution-generale','Moteur commun','Règles fondamentales');
expectId('realite-003-2-talents-de-realite','Réalité — Talents & désavantages','Principes généraux');
expectId('realite-016-1-principes-du-neurodive','Réalité — Neurodive','Règles de Neurodive');
expectId('realite-022-7-corruption-de-programmes-et-materiel','Réalité — Neurodive','Règles de Neurodive');
expectId('verite-037-1-architecture-de-la-verite','Vérité — Règles communes','Cadre commun');
expectId('regles-verite-v6-corruption','Vérité — Corruption & Fléaux','Corruption');
expectId('equipement-001-couteau-de-combat','Armement','Mêlée');
expectId('augmentation-001-amplificateur-interne','Cybernétique','Audio');
expectId('augmentation-010-bio-tatouage','Biogénétique','Biogénétique');
expectId('lore-gouvernement-congres','Institutions & sécurité','Gouvernement');
expectId('lore-corporations-aces-corporation','Corporations & économie','Corporations');
expectId('pnj-044-alessandra-luciano','Pègre & réseaux criminels','Pègre, mafias & cartels');
expectId('pnj-truth-la-faucheuse-noire','Figures de Vérité','Dossiers migrés du lore Vérité');
expectId('bestiaire-v15-civil-ordinaire','PNJ de Réalité','Rue, civils et bandes');
expectId('verite-catalogue-002-phoenix-pck-08-feather','Équipement de Chasse','Armes existantes utiles à la Chasse');

const index=fs.readFileSync('compendium/index.html','utf8');
if(!/category-navigation\.js/.test(index))throw new Error('index.html ne charge pas category-navigation.js');
const runtime=fs.readFileSync('compendium/category-navigation.js','utf8');
if(!/navigation-v1\.json/.test(runtime)||!/cloneNode\(true\)/.test(runtime)||!/hierarchical-category-list/.test(runtime))throw new Error('Runtime navigation hiérarchique/cliquable incomplet');
await import('./category-navigation-runtime-check.mjs');

console.log(`NAVIGATION OK — ${nav.entries.length}/${expectedTotal} pages visibles classées sans fourre-tout.`);
for(const category of hierarchical){
  const groups=[...new Set(nav.entries.filter(entry=>entry.category===category).map(entry=>entry.group))];
  console.log(`${category}: ${expectedCounts[category]} pages · ${groups.length} groupes · ${groups.join(' · ')}`);
}
