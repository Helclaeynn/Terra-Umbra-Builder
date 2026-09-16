import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const SOURCE='compendium/source/truth-legacy-consolidation-v1.json';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const plan=JSON.parse(fs.readFileSync(SOURCE,'utf8'));

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function slug(value){return norm(value).replace(/\s+/g,'-')||'section'}
function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function loadDataset(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function removePrefix(prefix){if(!prefix)return;for(const file of fs.readdirSync(DATA))if(file.startsWith(`${prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`)}
function writeDataset(id,pages,prefix){
  const spec=specFor(id),previousPrefix=spec.prefix;
  removePrefix(prefix);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9,mtime:0}).toString('base64');
  const size=8000,parts=Math.ceil(b64.length/size);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');
  Object.assign(spec,{prefix,parts,count:pages.length,sha256:crypto.createHash('sha256').update(b64).digest('hex')});
  if(previousPrefix!==prefix)removePrefix(previousPrefix);
  return spec;
}
function sectionFrom(source,legacySourceId){
  const id=`legacy-consolidation-${slug(source.title)}`;
  return {id,title:source.title,level:3,legacySourceId,blocks:(source.paragraphs||[]).map(text=>({type:'p',style:'lore',text:String(text).trim()})).filter(block=>block.text)};
}
function textOfSection(section){return [section.title||'',...(section.blocks||[]).flatMap(block=>block.type==='table'?(block.rows||[]).flat():[block.text||''])].join(' ')}
function upsertSection(page,section){
  page.sections=Array.isArray(page.sections)?page.sections:[];
  const matches=page.sections.map((item,index)=>({item,index})).filter(({item})=>item.id===section.id);
  if(matches.length>1)throw new Error(`${page.id}: section de consolidation dupliquée ${section.id}`);
  if(matches.length===1)page.sections[matches[0].index]=section;else page.sections.push(section);
}
function assertUniqueIds(pages,label){const seen=new Set();for(const page of pages){if(!page?.id)throw new Error(`${label}: page sans ID`);if(seen.has(page.id))throw new Error(`${label}: ID dupliqué ${page.id}`);seen.add(page.id)}}

if(plan.schemaVersion!==1||plan.batch!=='truth-legacy-hubs-v1')throw new Error('Plan de consolidation legacy invalide');
if(!Array.isArray(plan.retiredIds)||plan.retiredIds.length!==5||new Set(plan.retiredIds).size!==5)throw new Error('Cinq IDs legacy à retirer sont requis');
if(!Array.isArray(plan.migrations)||plan.migrations.length!==5)throw new Error(`Cinq migrations attendues, ${plan.migrations?.length||0}`);

let truth=loadDataset('verite');
let lore=loadDataset('lore');
const startingLoreLength=lore.length;
// La Vérité peut être rejouée avant (84 pages) ou après (78 pages) la fermeture des chapitres transitoires.
// Le volume global de lore n'est volontairement pas figé : les consolidations Réalité et futures peuvent le réduire sans toucher aux invariants Vérité.
if(![84,78].includes(truth.length))throw new Error(`Vérité: ${truth.length}, attendu 84 avant fermeture ou 78 après fermeture`);
if(!lore.length)throw new Error('Lore: dataset vide');
const finalState=truth.length===78;

const datasets={verite:truth,lore};
const migrated=[];
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bdifficult[eé]\s*\d+|TUC Talent|\bProfil\s*:/i;

for(const migration of plan.migrations){
  if(!['verite','lore'].includes(migration.dataset))throw new Error(`Dataset de migration invalide: ${migration.dataset}`);
  if(!plan.retiredIds.includes(migration.legacySourceId))throw new Error(`${migration.targetId}: source legacy non déclarée`);
  const pages=datasets[migration.dataset];
  const target=pages.find(page=>page.id===migration.targetId);
  if(!target)throw new Error(`Cible de consolidation absente: ${migration.dataset}/${migration.targetId}`);
  if(!Array.isArray(migration.sections)||migration.sections.length<2)throw new Error(`${migration.targetId}: migration trop mince`);
  for(const raw of migration.sections){
    const section=sectionFrom(raw,migration.legacySourceId);
    if(forbidden.test(textOfSection(section)))throw new Error(`${migration.targetId}/${section.title}: mécanique détectée`);
    if((section.blocks||[]).some(block=>block.type==='table'))throw new Error(`${migration.targetId}/${section.title}: table interdite`);
    upsertSection(target,section);
  }
  target.legacyConsolidation={batch:plan.batch,sources:[...new Set([...(target.legacyConsolidation?.sources||[]),migration.legacySourceId])]};
  migrated.push(migration.targetId);
}

const presentRetired=plan.retiredIds.filter(id=>lore.some(page=>page.id===id));
if(presentRetired.length!==0&&presentRetired.length!==plan.retiredIds.length)throw new Error(`État legacy partiel interdit: ${presentRetired.length}/5 hubs présents`);
if(presentRetired.length===plan.retiredIds.length)lore=lore.filter(page=>!plan.retiredIds.includes(page.id));
datasets.lore=lore;

const expectedTruth=truth.length;
const expectedLore=startingLoreLength-presentRetired.length;
if(truth.length!==expectedTruth)throw new Error(`Vérité: ${truth.length}, attendu ${expectedTruth} après consolidation`);
if(lore.length!==expectedLore)throw new Error(`Lore: ${lore.length}, attendu ${expectedLore} après consolidation`);
for(const id of plan.retiredIds)if([...truth,...lore].some(page=>page.id===id))throw new Error(`Hub legacy encore présent: ${id}`);

const requiredMigrations=[
  ['verite','verite-047-11-garous-loups-descendants-de-khinae',2],
  ['lore','lore-mage-lodges-loges-organisation',2],
  ['verite','verite-046-10-vampires',2],
  ['verite','verite-051-15-angelus',2],
  ['verite','verite-050-14-daemons',4],
];
for(const [dataset,id,count] of requiredMigrations){
  const page=datasets[dataset].find(item=>item.id===id);
  const sections=(page?.sections||[]).filter(section=>String(section.id||'').startsWith('legacy-consolidation-'));
  if(sections.length<count)throw new Error(`${id}: ${sections.length} sections legacy consolidées, attendu au moins ${count}`);
  for(const section of sections)if(forbidden.test(textOfSection(section)))throw new Error(`${id}/${section.title}: mécanique résiduelle`);
}

assertUniqueIds(truth,'Vérité');
assertUniqueIds(lore,'Lore');

const truthSpec=writeDataset('verite',truth,'v3-verite-lore-v9');
const loreSpec=writeDataset('lore',lore,'v3-lore-v6');
manifest.expectedTotal=manifest.datasets.reduce((sum,d)=>sum+Number(d.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');

console.log(`CONSOLIDATION LEGACY VÉRITÉ — ${migrated.length} cibles enrichies · ${presentRetired.length} hubs retirés sur cette passe · état ${finalState?'final':'pré-final'}.`);
console.log(`VÉRITÉ ${truth.length} (${truthSpec.parts} fragments) · LORE ${lore.length} (${loreSpec.parts} fragments) · total V3 ${manifest.expectedTotal}.`);
