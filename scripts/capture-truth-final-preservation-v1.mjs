import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const OUTPUT='compendium/source/truth-final-preservation-v1.json';
if(fs.existsSync(OUTPUT)){
  console.log(`PRESERVATION VÉRITÉ — source déjà présente: ${OUTPUT}`);
  process.exit(0);
}
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function clone(v){return JSON.parse(JSON.stringify(v))}
function collectSections(pages,id,prefix='legacy-final-'){const page=pages.find(p=>p.id===id);if(!page)throw new Error(`Page absente pour préservation: ${id}`);const sections=(page.sections||[]).filter(s=>String(s.id||'').startsWith(prefix)).map(clone);if(!sections.length)throw new Error(`${id}: aucune section ${prefix} à préserver`);return {dataset:pages===truth?'verite':'lore',targetId:id,sections}}

const truth=load('verite');
const lore=load('lore');
const rules=load('moteur');
const pageRecords=[];
for(const id of [
  'verite-052-16-aseryns',
  'verite-048-12-autres-descendants-de-khinae',
  'verite-053-17-exiles-peuples-fonctions-et-traditions',
  'verite-lore-whurtens',
  'verite-054-18-extrals-homo-superior-et-adrak',
  'verite-056-20-corruption',
]) pageRecords.push(collectSections(truth,id));
for(const id of ['lore-aidh','lore-creatures-autres']){
  const page=lore.find(p=>p.id===id);
  if(page){const sections=(page.sections||[]).filter(s=>String(s.id||'').startsWith('legacy-final-')).map(clone);if(sections.length)pageRecords.push({dataset:'lore',targetId:id,sections});}
}
const fullLorePages=['verite-lore-points-de-rencontre','verite-lore-traditions-chasseurs-detaillees'].map(id=>{const page=lore.find(p=>p.id===id);if(!page)throw new Error(`Page consolidée absente: ${id}`);return clone(page)});
const rulePages=['rules-truth-equipment-properties','rules-truth-hunter-equipment-reference','rules-truth-aidh-arsenal-reference','rules-truth-corrupted-equipment-reference'].map(id=>{const page=rules.find(p=>p.id===id);if(!page)throw new Error(`Page Règles préservée absente: ${id}`);return clone(page)});
const source={schemaVersion:1,batch:'truth-final-preservation-v1',capturedFrom:manifest.generated,description:'Matière utile extraite des conteneurs Vérité legacy et des pages transitoires 22–27 avant leur suppression définitive. Cette source rend la reconstruction idempotente.',pageRecords,fullLorePages,rulePages};
fs.writeFileSync(OUTPUT,`${JSON.stringify(source,null,2)}\n`,'utf8');
console.log(`PRESERVATION VÉRITÉ — ${pageRecords.length} cibles enrichies · ${fullLorePages.length} pages lore consolidées · ${rulePages.length} pages Règles figées.`);
