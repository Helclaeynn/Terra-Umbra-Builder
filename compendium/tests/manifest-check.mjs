import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));

if(manifest.version!==3) throw new Error(`Manifest: version ${manifest.version}, attendu 3`);

// Ces datasets sont désormais reconstruits pendant la remise à plat du Compendium :
// leur nombre de pages est validé par des tests sémantiques dédiés, pas figé ici.
const mutableMinimums={moteur:5,realite:1,verite:1};
const fixedCounts={bestiaire:263,lore:397,pnj:163};
const catalogIds=new Set(['equipement','augmentations','verite-catalogue']);
const expectedIds=new Set([...Object.keys(mutableMinimums),...Object.keys(fixedCounts),...catalogIds]);
if(!Array.isArray(manifest.datasets)||manifest.datasets.length!==expectedIds.size) throw new Error(`Manifest: ${expectedIds.size} datasets V3 attendus, trouvé ${manifest.datasets?.length??0}`);
const manifestTotal=manifest.datasets.reduce((sum,spec)=>sum+Number(spec.count||0),0);
if(manifest.expectedTotal!==manifestTotal) throw new Error(`Manifest: expectedTotal ${manifest.expectedTotal}, somme des datasets ${manifestTotal}`);

const seen=new Set();
const seenDatasets=new Set();
let total=0;

for(const spec of manifest.datasets){
  if(!expectedIds.has(spec.id)) throw new Error(`Dataset V3 inattendu: ${spec.id}`);
  if(seenDatasets.has(spec.id)) throw new Error(`Dataset V3 dupliqué: ${spec.id}`);
  seenDatasets.add(spec.id);
  if(spec.id in fixedCounts && spec.count!==fixedCounts[spec.id]) throw new Error(`${spec.id}: count manifeste ${spec.count}, attendu ${fixedCounts[spec.id]}`);
  if(spec.id in mutableMinimums && (!Number.isInteger(spec.count)||spec.count<mutableMinimums[spec.id])) throw new Error(`${spec.id}: count restructuré invalide (${spec.count})`);
  if(catalogIds.has(spec.id) && (!Number.isInteger(spec.count)||spec.count<1)) throw new Error(`${spec.id}: count catalogue invalide (${spec.count})`);
  if(!String(spec.prefix||'').startsWith('v3-')) throw new Error(`${spec.id}: préfixe non V3`);
  if(!Number.isInteger(spec.parts)||spec.parts<1) throw new Error(`${spec.id}: parts invalide`);

  let b64='';
  for(let i=0;i<spec.parts;i++){
    const file=`${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
    const path=`${DATA}/${file}`;
    if(!fs.existsSync(path)) throw new Error(`${spec.id}: segment manquant ${file}`);
    b64+=fs.readFileSync(path,'utf8').replace(/\s+/g,'');
  }

  const sha=crypto.createHash('sha256').update(b64).digest('hex');
  if(sha!==spec.sha256) throw new Error(`${spec.id}: SHA-256 invalide ${sha} != ${spec.sha256}`);

  let rows;
  try{rows=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
  catch(error){throw new Error(`${spec.id}: paquet invalide (${error.message})`)}
  if(!Array.isArray(rows)) throw new Error(`${spec.id}: racine non tabulaire`);
  if(rows.length!==spec.count) throw new Error(`${spec.id}: ${rows.length} entrées, attendu ${spec.count}`);

  for(const [i,row] of rows.entries()){
    if(!row?.id||!row?.title||!row?.category) throw new Error(`${spec.id}[${i}]: id/titre/catégorie absent`);
    if(seen.has(row.id)) throw new Error(`ID V3 dupliqué: ${row.id}`);
    seen.add(row.id);
  }
  total+=rows.length;
  console.log(`OK ${spec.id}: ${rows.length} entrées · SHA ${sha.slice(0,12)}…`);
}

for(const id of expectedIds) if(!seenDatasets.has(id)) throw new Error(`Dataset V3 attendu absent: ${id}`);
if(total!==manifest.expectedTotal) throw new Error(`Corpus V3: ${total}, attendu ${manifest.expectedTotal}`);
if(seen.size!==manifest.expectedTotal) throw new Error(`Corpus V3: ${seen.size} IDs uniques, attendu ${manifest.expectedTotal}`);

const indexPath='compendium/index.html';
const index=fs.readFileSync(indexPath,'utf8');
const runtimeMatches=[...index.matchAll(/src=["'](app-v3(?:-editor)?\.js)(?:\?[^"']*)?["']/g)].map(match=>match[1]);
if(runtimeMatches.length!==1) throw new Error(`index.html: un seul runtime V3 actif attendu, trouvé ${runtimeMatches.length}`);
const activeRuntime=`compendium/${runtimeMatches[0]}`;
if(!fs.existsSync(activeRuntime)) throw new Error(`index.html: runtime actif introuvable (${activeRuntime})`);

const activeFiles=[indexPath,activeRuntime];
const legacy=[
  ['ancien manifeste',/manifest\.json\.gz\.b64/i],
  ['pack legacy',/pack-/i],
  ['bundle legacy',/bundle-/i],
  ['source-extensions',/source-extensions/i],
  ['waves legacy',/wave[2-5]/i],
  ['Index PNJ distant',/TUC-Index-PNJ/i]
];
for(const file of activeFiles){
  const text=fs.readFileSync(file,'utf8');
  for(const [label,re] of legacy) if(re.test(text)) throw new Error(`${file}: référence ${label} encore active`);
}

if(/src=["']app\.js(?:\?[^"']*)?["']/.test(index)) throw new Error('index.html: ancien app.js encore chargé');

console.log(`OK corpus V3: ${total} entrées, ${seen.size} IDs uniques, ${seenDatasets.size} datasets.`);
console.log(`OK runtime V3: ${runtimeMatches[0]} actif, aucune référence legacy dans l’index ou le runtime.`);
