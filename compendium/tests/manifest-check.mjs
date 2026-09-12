import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));

if(manifest.version!==3) throw new Error(`Manifest: version ${manifest.version}, attendu 3`);
if(!Number.isInteger(manifest.expectedTotal)||manifest.expectedTotal<1) throw new Error('Manifest: expectedTotal invalide');
if(!Array.isArray(manifest.datasets)||manifest.datasets.length<6) throw new Error('Manifest: au moins six datasets V3 attendus');

const coreExpected={moteur:5,realite:39,verite:63,bestiaire:20,lore:229,pnj:163};
const baseSeen=new Set();
const finalById=new Map();
let baseTotal=0;
let overlayRows=0;

for(const spec of manifest.datasets){
  const isOverlay=spec.overlay===true;
  if(!String(spec.prefix||'').startsWith('v3-')) throw new Error(`${spec.id}: préfixe non V3`);
  if(!Number.isInteger(spec.parts)||spec.parts<1) throw new Error(`${spec.id}: parts invalide`);
  if(!Number.isInteger(spec.count)||spec.count<0) throw new Error(`${spec.id}: count invalide`);

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

  if(!isOverlay){
    if(!(spec.id in coreExpected)) throw new Error(`Dataset de base V3 inattendu: ${spec.id}`);
    if(spec.count!==coreExpected[spec.id]) throw new Error(`${spec.id}: count manifeste ${spec.count}, attendu ${coreExpected[spec.id]}`);
    for(const [i,row] of rows.entries()){
      if(!row?.id||!row?.title||!row?.category) throw new Error(`${spec.id}[${i}]: id/titre/catégorie absent`);
      if(baseSeen.has(row.id)) throw new Error(`ID V3 de base dupliqué: ${row.id}`);
      baseSeen.add(row.id);
      finalById.set(row.id,row);
    }
    baseTotal+=rows.length;
    console.log(`OK base ${spec.id}: ${rows.length} entrées · SHA ${sha.slice(0,12)}…`);
    continue;
  }

  const replaceIds=Array.isArray(spec.replaceIds)?spec.replaceIds:[];
  const addIds=Array.isArray(spec.addIds)?spec.addIds:[];
  const declared=[...replaceIds,...addIds];
  if(new Set(declared).size!==declared.length) throw new Error(`${spec.id}: ID déclaré deux fois dans replaceIds/addIds`);
  if(declared.length!==rows.length) throw new Error(`${spec.id}: ${declared.length} IDs déclarés pour ${rows.length} lignes`);
  const rowIds=new Set();
  for(const [i,row] of rows.entries()){
    if(!row?.id||!row?.title||!row?.category) throw new Error(`${spec.id}[${i}]: id/titre/catégorie absent`);
    if(rowIds.has(row.id)) throw new Error(`${spec.id}: ID overlay dupliqué ${row.id}`);
    rowIds.add(row.id);
    const isReplace=replaceIds.includes(row.id),isAdd=addIds.includes(row.id);
    if(!isReplace&&!isAdd) throw new Error(`${spec.id}: ${row.id} non déclaré dans replaceIds/addIds`);
    if(isReplace&&!finalById.has(row.id)) throw new Error(`${spec.id}: remplacement sans cible ${row.id}`);
    if(isAdd&&finalById.has(row.id)) throw new Error(`${spec.id}: ajout collisionne avec un ID existant ${row.id}`);
    finalById.set(row.id,row);
  }
  overlayRows+=rows.length;
  console.log(`OK overlay ${spec.id}: ${rows.length} entrées (${replaceIds.length} remplacements, ${addIds.length} ajouts) · SHA ${sha.slice(0,12)}…`);
}

const expectedBase=Object.values(coreExpected).reduce((a,b)=>a+b,0);
if(baseTotal!==expectedBase) throw new Error(`Corpus V3 de base: ${baseTotal}, attendu ${expectedBase}`);
if(baseSeen.size!==expectedBase) throw new Error(`Corpus V3 de base: ${baseSeen.size} IDs uniques, attendu ${expectedBase}`);
if(finalById.size!==manifest.expectedTotal) throw new Error(`Corpus V3 final: ${finalById.size}, attendu ${manifest.expectedTotal}`);

const activeFiles=['compendium/index.html','compendium/app-v3.js'];
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

const index=fs.readFileSync('compendium/index.html','utf8');
if(!/src=["']app-v3\.js(?:\?[^"']*)?["']/.test(index)) throw new Error('index.html: app-v3.js non chargé');
if(/src=["']app\.js(?:\?[^"']*)?["']/.test(index)) throw new Error('index.html: ancien app.js encore chargé');

console.log(`OK corpus V3 de base: ${baseTotal} entrées, ${baseSeen.size} IDs uniques.`);
console.log(`OK overlays: ${overlayRows} lignes appliquées ; corpus final ${finalById.size} entrées.`);
console.log('OK runtime V3: aucune référence legacy active dans index.html / app-v3.js.');
