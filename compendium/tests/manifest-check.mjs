import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));

if(manifest.version!==3) throw new Error(`Manifest: version ${manifest.version}, attendu 3`);
if(!Array.isArray(manifest.datasets)||manifest.datasets.length!==6) throw new Error('Manifest: six datasets V3 attendus');

const expectedCounts={moteur:5,realite:39,verite:63,bestiaire:263,lore:397,pnj:163};
const expectedTotal=Object.values(expectedCounts).reduce((sum,n)=>sum+n,0);
if(manifest.expectedTotal!==expectedTotal) throw new Error(`Manifest: expectedTotal ${manifest.expectedTotal}, attendu ${expectedTotal}`);

const seen=new Set();
let total=0;

for(const spec of manifest.datasets){
  if(!(spec.id in expectedCounts)) throw new Error(`Dataset V3 inattendu: ${spec.id}`);
  if(spec.count!==expectedCounts[spec.id]) throw new Error(`${spec.id}: count manifeste ${spec.count}, attendu ${expectedCounts[spec.id]}`);
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

console.log(`OK corpus V3: ${total} entrées, ${seen.size} IDs uniques.`);
console.log(`OK runtime V3: ${runtimeMatches[0]} actif, aucune référence legacy dans l’index ou le runtime.`);
