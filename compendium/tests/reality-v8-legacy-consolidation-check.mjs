import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const BATCH='reality-v8-legacy-v1';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function byId(pages,id){const page=pages.find(p=>p.id===id);if(!page)throw new Error(`Page absente: ${id}`);return page}
function sectionById(page,id){const section=(page.sections||[]).find(s=>s.id===id);if(!section)throw new Error(`${page.id}: section absente ${id}`);return section}
function text(section){return [section.title||'',...(section.blocks||[]).map(block=>block.text||'')].join(' ')}

const reality=load('realite'),lore=load('lore');
if(reality.length!==9)throw new Error(`Réalité finale: ${reality.length}, attendu 9`);
if(lore.length!==341)throw new Error(`Lore consolidé: ${lore.length}, attendu 341 après retrait des 18 pages quotidiennes`);

const retired=[
  'lore-vie-quotidienne-urbanisme-strates','lore-vie-quotidienne-alimentation-base','lore-vie-quotidienne-alimentation',
  'lore-vie-quotidienne-logement-robotique','lore-vie-quotidienne-transports-urbains','lore-vie-quotidienne-transports-longue-distance',
  'lore-vie-quotidienne-energie','lore-vie-quotidienne-materiaux','lore-vie-quotidienne-holonet','lore-vie-quotidienne-realite-augmentee-ia',
  'lore-vie-quotidienne-musique-mode','lore-vie-quotidienne-cinema-jeux-sport','lore-vie-quotidienne-sante','lore-vie-quotidienne-sexualite',
  'lore-vie-quotidienne-medias-drogues','lore-vie-quotidienne-augmentations-organiques','lore-vie-quotidienne-augmentations-cyber','lore-vie-quotidienne-troubles-augmentiques'
];
for(const id of retired)if(lore.some(page=>page.id===id))throw new Error(`Scorie Réalité legacy encore visible: ${id}`);

const material=byId(reality,'realite-lore-vie-materielle-2035');
const identity=byId(reality,'realite-lore-identite-culture-information');
for(const page of [material,identity]){
  if(page.realityLegacyConsolidation?.batch!==BATCH)throw new Error(`${page.id}: marqueur de consolidation absent`);
  if((page.realityLegacyConsolidation?.sources||[]).length!==18)throw new Error(`${page.id}: sources legacy incomplètes`);
}

const food=sectionById(material,'legacy-reality-alimentation-base-editee');
for(const needle of ['ration universelle','céréales','insectes','famines'])if(!text(food).includes(needle))throw new Error(`Alimentation éditée: repère absent ${needle}`);
const intimacy=sectionById(identity,'legacy-reality-intimite-sexualite');
for(const needle of ['prostitution','Holonet','sexbots','mariage'])if(!text(intimacy).includes(needle))throw new Error(`Intimité: repère absent ${needle}`);
const drugs=sectionById(material,'legacy-reality-drogues-regulation');
for(const needle of ['psychotropes','augmentations organiques','virtuelles','Crawler'])if(!text(drugs).includes(needle))throw new Error(`Drogues: repère absent ${needle}`);
const culture=sectionById(identity,'legacy-reality-cyber-bio-culture');
for(const needle of ['Cybermécanique','biogénétique','modularité','patrimoine du bénéficiaire'])if(!text(culture).includes(needle))throw new Error(`Cyber/Bio: repère absent ${needle}`);
const troubles=sectionById(identity,'legacy-reality-troubles-augmentiques');
for(const needle of ['Stress augmentique','Frénésie augmentique','dépendance','ne signifient pas','automatiquement'])if(!text(troubles).includes(needle))throw new Error(`Troubles augmentiques: repère absent ${needle}`);

const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bdifficult[eé]\s*\d+/i;
for(const section of [food,intimacy,drugs,culture,troubles]){
  if(forbidden.test(text(section)))throw new Error(`${section.id}: mécanique chiffrée détectée`);
  if((section.blocks||[]).some(block=>block.type==='table'))throw new Error(`${section.id}: table interdite`);
}

const all=manifest.datasets.flatMap(d=>load(d.id));
const ids=new Set();for(const page of all){if(ids.has(page.id))throw new Error(`ID dupliqué: ${page.id}`);ids.add(page.id)}
if(ids.size!==manifest.expectedTotal)throw new Error(`IDs uniques ${ids.size}/${manifest.expectedTotal}`);
if(manifest.expectedTotal!==1802)throw new Error(`Total V3 ${manifest.expectedTotal}, attendu 1802 après consolidation finale Réalité`);
console.log(`CONSOLIDATION RÉALITÉ V8 OK — 18 pages legacy retirées · 5 thèmes fusionnés · ${ids.size} IDs uniques.`);
