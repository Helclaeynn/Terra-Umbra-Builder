import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const BATCH='reality-dataset-v1';
const BOOK_BATCH='reality-setting-v1';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function byId(pages,id){const page=pages.find(p=>p.id===id);if(!page)throw new Error(`Page absente: ${id}`);return page}
function sectionById(page,id){const section=(page.sections||[]).find(s=>s.id===id);if(!section)throw new Error(`${page.id}: section absente ${id}`);return section}
function text(section){return [section.title||'',...(section.blocks||[]).map(block=>block.text||'')].join(' ')}

const reality=load('realite');
if(reality.length!==9)throw new Error(`Réalité finale: ${reality.length}, attendu 9`);
if(reality.filter(page=>page.realityBook?.batch===BOOK_BATCH).length!==9)throw new Error('Toutes les pages Réalité finales doivent appartenir au lot book-first V8');

const retired=[
  'realite-002-1-reperes-sociaux-de-realite','realite-007-i-augmentations-esthetiques','realite-008-ii-neuroware',
  'realite-009-iii-cyberoptique','realite-010-iv-cyberaudio','realite-011-v-augmentations-internes',
  'realite-012-vi-augmentations-dermiques-et-externes','realite-013-vii-membres-cybernetiques','realite-014-viii-cyborg-lourd',
  'realite-015-ix-biogenetique-terrestre','realite-023-8-applications-holonet','realite-024-9-catalogue-des-neuroprogrammes',
  'realite-031-4-armement-terrestre','realite-032-5-munitions-et-accessoires','realite-033-6-armures-et-protections',
  'realite-034-7-objets-usuels-et-materiel-technique','realite-035-8-nourriture-boissons-et-drogues',
  'realite-036-9-services-soins-et-divertissements','realite-037-10-logements-planques-et-securite','realite-038-11-vehicules-et-transports'
];
for(const id of retired)if(reality.some(page=>page.id===id))throw new Error(`Page résiduelle encore visible: ${id}`);

const hub=byId(reality,'realite-001-chapitre-vivre-en-grande-californie');
const identity=byId(reality,'realite-lore-identite-culture-information');
for(const page of [hub,identity]){
  if(page.realityDatasetConsolidation?.batch!==BATCH)throw new Error(`${page.id}: marqueur consolidation dataset absent`);
  if((page.realityDatasetConsolidation?.retiredIds||[]).length!==20)throw new Error(`${page.id}: liste de retrait incomplète`);
}

const spheres=sectionById(hub,'reality-dataset-social-spheres');
for(const needle of ['Corporatiste','Gouvernementale','Mafieuse','Religieuse','Crawler'])if(!text(spheres).includes(needle))throw new Error(`Sphères sociales: repère absent ${needle}`);
const apps=sectionById(identity,'reality-dataset-holonet-applications');
for(const needle of ['NavIA','Call’infornia','LadyDolla','CeltX','Securio','Shelov','BlackFlag','Vatican+','Islamaster','Boudicca','Redwish','AllBrains','Rampage X'])if(!text(apps).includes(needle))throw new Error(`Applications Holonet: repère absent ${needle}`);

const forbidden=/\bPTV\b|\bDGT\b|\b1d10e\b|\b\d+\s*PA\b|\bPRIX\b|\+\d|\bslot(?:s)?\b/i;
for(const section of [spheres,apps]){
  if(forbidden.test(text(section)))throw new Error(`${section.id}: mécanique résiduelle`);
  if((section.blocks||[]).some(block=>block.type==='table'))throw new Error(`${section.id}: table interdite`);
}

const all=manifest.datasets.flatMap(dataset=>load(dataset.id));
const ids=new Set();for(const page of all){if(ids.has(page.id))throw new Error(`ID V3 dupliqué: ${page.id}`);ids.add(page.id)}
if(ids.size!==manifest.expectedTotal)throw new Error(`IDs uniques ${ids.size}/${manifest.expectedTotal}`);
console.log(`DATASET RÉALITÉ V8 OK — 9 pages book-first · 20 vues mécaniques retirées · ${ids.size} IDs uniques.`);
