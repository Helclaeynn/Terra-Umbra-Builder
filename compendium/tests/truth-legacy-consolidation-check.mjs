import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const BATCH='truth-legacy-hubs-v1';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(dataset=>dataset.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function byId(pages,id){const page=pages.find(item=>item.id===id);if(!page)throw new Error(`Page absente: ${id}`);return page}
function flatSection(section){return [section.title||'',...(section.blocks||[]).flatMap(block=>block.type==='table'?(block.rows||[]).flat():[block.text||''])].join(' ')}
function flatPage(page){return [page.title||'',...(page.sections||[]).map(flatSection)].join(' ')}
function consolidated(page){return (page.sections||[]).filter(section=>String(section.id||'').startsWith('legacy-consolidation-'))}
function requireText(page,...needles){const text=flatPage(page);for(const needle of needles)if(!text.includes(needle))throw new Error(`${page.id}: contexte consolidé absent (${needle})`)}

const truth=load('verite'),lore=load('lore');
if(truth.length!==84)throw new Error(`Vérité: ${truth.length}, attendu 84`);
if(lore.length!==392)throw new Error(`Lore: ${lore.length}, attendu 392`);
if(manifest.expectedTotal!==1807)throw new Error(`Total V3: ${manifest.expectedTotal}, attendu 1807`);

const retired=[
  'lore-supernatural-species-vampires',
  'lore-supernatural-species-loups-garous',
  'lore-supernatural-species-mages',
  'lore-supernatural-species-daemons',
  'lore-supernatural-species-angelus',
];
for(const id of retired)if([...truth,...lore].some(page=>page.id===id))throw new Error(`Hub legacy encore visible: ${id}`);

const garous=byId(truth,'verite-047-11-garous-loups-descendants-de-khinae');
const mageLodges=byId(lore,'lore-mage-lodges-loges-organisation');
const vampires=byId(truth,'verite-046-10-vampires');
const angelus=byId(truth,'verite-051-15-angelus');
const daemons=byId(truth,'verite-050-14-daemons');

for(const [page,min] of [[garous,2],[mageLodges,2],[vampires,2],[angelus,2],[daemons,4]]){
  if(page.legacyConsolidation?.batch!==BATCH)throw new Error(`${page.id}: marqueur de consolidation absent`);
  if(consolidated(page).length<min)throw new Error(`${page.id}: consolidation trop mince (${consolidated(page).length}/${min})`);
}

requireText(garous,'La Chasse comme activité de Meute','latents','partenaires');
requireText(mageLodges,'Magister','Référent','Tuteur','Singularis','apprentissage');
requireText(vampires,'principauté','serfs','Cryptes profondes','Veilleurs');
if(/ni vivants ni morts/i.test(flatPage(vampires)))throw new Error('Vampires: ancien postulat « ni vivants ni morts » réintroduit');
requireText(angelus,'Seigneurs angéliques','Nephilim','Azraël','Gabriel','Michael','Raphaël','Uriel','Remiel');
requireText(daemons,'Nevaerkal','Deimons','possession','invocation','Tentateurs','Oracles','Châtiments','Chevaliers','Prophète','Héros','Éveillé');

const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bdifficult[eé]\s*\d+|TUC Talent|\bProfil\s*:/i;
for(const page of [garous,mageLodges,vampires,angelus,daemons]){
  for(const section of consolidated(page)){
    if(forbidden.test(flatSection(section)))throw new Error(`${page.id}/${section.title}: mécanique résiduelle`);
    if((section.blocks||[]).some(block=>block.type==='table'))throw new Error(`${page.id}/${section.title}: table interdite`);
  }
}

const all=manifest.datasets.flatMap(spec=>load(spec.id));
const ids=new Set();
for(const page of all){if(ids.has(page.id))throw new Error(`ID V3 dupliqué: ${page.id}`);ids.add(page.id)}
if(ids.size!==1807)throw new Error(`IDs uniques: ${ids.size}, attendu 1807`);

console.log(`CONSOLIDATION LEGACY VÉRITÉ OK — 5 hubs retirés · lore utile migré sur 5 cibles · Vérité 84 · Lore 392 · ${ids.size} IDs uniques.`);
