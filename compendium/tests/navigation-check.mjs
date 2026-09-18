// Canonical V3 navigation guard: keep this file in the Compendium gate path set.
import fs from 'node:fs';
import zlib from 'node:zlib';
import { classifyNavigation, isHierarchicalCategory, navigationDisplayTitle } from '../navigation-schema-v3.js';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const rawHierarchical=['Règles','Réalité','Équipement','Augmentations','Vérité','Catalogue Vérité','Organisations','Personnages','Bestiaire'];
const displayCategories=['Règles','Réalité','Vérité','Équipement & Objets','Personnages','Bestiaire'];
const catalogTitleDatasets=new Set(['equipement','augmentations','verite-catalogue']);

function load(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8')).map(page=>({...page,dataset:page.dataset||spec.id}));
}
function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function expectedDisplayTitle(page){return catalogTitleDatasets.has(page.dataset)?String(page.title||'').trim():navigationDisplayTitle(page.title)}
function displayCategory(page,nav){
  if(['Équipement','Augmentations','Catalogue Vérité'].includes(page.category))return 'Équipement & Objets';
  if(page.category==='Organisations'){
    const tags=(page.tags||[]).map(norm);
    if(tags.includes('verite'))return 'Vérité';
    if(tags.includes('realite'))return 'Réalité';
    if(/faction|vampir|garou|mage|daemon|angelus|aseryn|exile|extral|chasseur|fleau/.test(norm(`${nav?.group||''} ${nav?.subgroup||''}`)))return 'Vérité';
    return 'Réalité';
  }
  return page.category;
}
function presentationNavigation(page,nav,targetCategory){
  if(targetCategory!=='Équipement & Objets')return nav;
  const [group,groupOrder]=page.category==='Équipement'
    ?['Équipement de Réalité',10]
    :page.category==='Augmentations'
      ?['Augmentations',20]
      :['Objets de Vérité',30];
  return {
    ...nav,
    group,
    groupOrder,
    subgroup:[nav.group,nav.subgroup].filter(Boolean).join(' — ')||'Références',
    subgroupOrder:(Number(nav.groupOrder)||0)*1000+(Number(nav.subgroupOrder)||0),
  };
}

const pages=manifest.datasets.flatMap(load).filter(page=>isHierarchicalCategory(page.category));
const expectedRawCounts=Object.fromEntries(rawHierarchical.map(category=>[category,pages.filter(page=>page.category===category).length]));
const expectedTotal=pages.length;
const fixedCounts={'Règles':251,'Réalité':9,'Équipement':357,'Augmentations':111,'Catalogue Vérité':229,'Organisations':304,'Personnages':223,'Bestiaire':263};
for(const [category,count] of Object.entries(fixedCounts))if(expectedRawCounts[category]!==count)throw new Error(`${category}: ${expectedRawCounts[category]}, attendu ${count} — aucune entrée ne doit disparaître pendant la restructuration`);

const expectedById=new Map();
for(const page of pages){
  const classified=classifyNavigation(page);
  if(!classified)throw new Error(`Navigation attendue absente: ${page.category} | ${page.dataset} | ${page.title}`);
  const category=displayCategory(page,classified);
  const nav=presentationNavigation(page,classified,category);
  expectedById.set(page.id,{
    id:page.id,
    category,
    group:nav.group,
    groupOrder:nav.groupOrder,
    subgroup:nav.subgroup,
    subgroupOrder:nav.subgroupOrder,
    pageOrder:nav.pageOrder,
    displayTitle:expectedDisplayTitle(page),
  });
}

const navPath=`${DATA}/navigation-v1.json`;
if(!fs.existsSync(navPath))throw new Error('navigation-v1.json absent');
const nav=JSON.parse(fs.readFileSync(navPath,'utf8'));
if(nav.version!==3||!Array.isArray(nav.entries))throw new Error(`navigation-v1.json invalide/version ${nav.version}`);
if(JSON.stringify(nav.categories)!==JSON.stringify(displayCategories))throw new Error(`Catégories V3 invalides: ${JSON.stringify(nav.categories)}`);
if(nav.entries.length!==expectedTotal)throw new Error(`navigation-v1.json: ${nav.entries.length} entrées, attendu ${expectedTotal}`);

const catchAll=/^(?:autre(?:s)?(?:\s+règle(?:s)?)?|divers|misc(?:ellaneous)?)$/i;
const seen=new Set();
for(const entry of nav.entries){
  if(seen.has(entry.id))throw new Error(`Navigation: ID dupliqué ${entry.id}`);seen.add(entry.id);
  const expected=expectedById.get(entry.id);if(!expected)throw new Error(`Navigation: page absente du corpus ${entry.id}`);
  if(!displayCategories.includes(entry.category))throw new Error(`Navigation: catégorie V3 invalide ${entry.id} | ${entry.category}`);
  for(const key of ['group','subgroup'])if(!entry[key]||catchAll.test(entry[key].trim()))throw new Error(`Navigation: groupe interdit ${entry.id} | ${entry[key]}`);
  for(const key of ['groupOrder','subgroupOrder','pageOrder'])if(!Number.isFinite(entry[key]))throw new Error(`Navigation: ordre invalide ${entry.id} | ${key}`);
  for(const key of ['category','group','subgroup','groupOrder','subgroupOrder','pageOrder','displayTitle'])if(entry[key]!==expected[key])throw new Error(`Navigation: dérive ${entry.id} | ${key}: ${entry[key]} != ${expected[key]}`);
}
for(const page of pages)if(!seen.has(page.id))throw new Error(`Navigation: page oubliée ${page.id}`);

for(const category of displayCategories){
  const expected=[...expectedById.values()].filter(entry=>entry.category===category).length;
  const actual=nav.entries.filter(entry=>entry.category===category).length;
  if(actual!==expected)throw new Error(`${category}: ${actual} entrées navigation, attendu ${expected}`);
  if(actual<1)throw new Error(`${category}: rubrique V3 vide`);
}

const twoFence=nav.entries.filter(entry=>entry.displayTitle==='2-Fence');
if(twoFence.length!==1)throw new Error(`2-Fence: ${twoFence.length} entrée(s) de navigation, attendu 1`);

function expectId(id,category,group,subgroup){
  const entry=nav.entries.find(row=>row.id===id);if(!entry)throw new Error(`Navigation témoin absente: ${id}`);
  if(entry.category!==category||entry.group!==group||entry.subgroup!==subgroup)throw new Error(`${id}: ${entry.category} | ${entry.group} > ${entry.subgroup}, attendu ${category} | ${group} > ${subgroup}`);
}
expectId('moteur-001-1-resolution-generale','Règles','Moteur commun','Règles fondamentales');
expectId('realite-003-2-talents-de-realite','Règles','Réalité — Talents & désavantages','Principes généraux');
expectId('realite-016-1-principes-du-neurodive','Règles','Réalité — Neurodive','Règles de Neurodive');
expectId('verite-037-1-architecture-de-la-verite','Règles','Vérité — Règles communes','Cadre commun');
expectId('regles-verite-v6-corruption','Règles','Vérité — Corruption & Fléaux','Corruption');
expectId('equipement-001-couteau-de-combat','Équipement & Objets','Équipement de Réalité','Armement — Mêlée');
expectId('augmentation-001-amplificateur-interne','Équipement & Objets','Augmentations','Cybernétique — Audio');
expectId('augmentation-010-bio-tatouage','Équipement & Objets','Augmentations','Biogénétique — Biogénétique');
expectId('lore-gouvernement-congres','Réalité','Institutions & sécurité','Gouvernement');
expectId('lore-corporations-aces-corporation','Réalité','Corporations & économie','Corporations');
expectId('pnj-044-alessandra-luciano','Personnages','Pègre & réseaux criminels','Pègre, mafias & cartels');
expectId('pnj-truth-la-faucheuse-noire','Personnages','Figures de Vérité','Dossiers migrés du lore Vérité');
expectId('bestiaire-v15-civil-ordinaire','Bestiaire','PNJ de Réalité','Rue, civils et bandes');
expectId('verite-catalogue-002-phoenix-pck-08-feather','Équipement & Objets','Objets de Vérité','Équipement de Chasse — Armes existantes utiles à la Chasse');

const index=fs.readFileSync('compendium/index.html','utf8');
if(!/category-navigation\.js/.test(index))throw new Error('index.html ne charge pas category-navigation.js');
const runtime=fs.readFileSync('compendium/category-navigation.js','utf8');
if(!/navigation-v1\.json/.test(runtime)||!/cloneNode\(true\)/.test(runtime)||!/hierarchical-category-list/.test(runtime))throw new Error('Runtime navigation hiérarchique/cliquable incomplet');
await import('./category-navigation-runtime-check.mjs');

const legacyBroadWeaponGroups=new Set(['Armement — Mêlée','Armement — Poing & Tasers','Armement — Automatiques','Armement — Précision','Armement — Lourdes']);
const realityWeapons=entries.filter(entry=>entry.dataset==='equipement'&&String(entry.subgroup||'').startsWith('Armement — '));
const broadWeapons=realityWeapons.filter(entry=>legacyBroadWeaponGroups.has(entry.subgroup));
if(broadWeapons.length)throw new Error(`Navigation armes encore trop large: ${broadWeapons.map(x=>`${x.displayTitle} -> ${x.subgroup}`).join(' | ')}`);
for(const id of ['equipement-043-raven-sg-025-riot-control','equipement-044-raven-sg-039-croaker','equipement-045-owl-sg-016-boss','equipement-046-phoenix-sg-042-fire-rain']){
  const entry=entries.find(x=>x.id===id);
  if(entry?.subgroup!=='Armement — Shotguns')throw new Error(`Shotgun mal classé: ${id} -> ${entry?.subgroup}`);
}
console.log(`NAVIGATION V3 OK — ${nav.entries.length}/${expectedTotal} pages visibles classées dans 6 rubriques sans fourre-tout.`);
for(const category of displayCategories){
  const rows=nav.entries.filter(entry=>entry.category===category);
  const groups=[...new Set(rows.map(entry=>entry.group))];
  console.log(`${category}: ${rows.length} pages · ${groups.length} groupes · ${groups.join(' · ')}`);
}
