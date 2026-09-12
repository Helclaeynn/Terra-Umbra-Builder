import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
// Only validate datasets currently loaded by source-extensions.js / pnj.js.
// Prepared but inactive overlays are validated separately before activation.
const specs=[
  ['wave2-org',8],
  ['wave2-pnj',2],
  ['wave3-mini-org',5],
  ['wave3-mini-pnj',1],
  ['wave4-org',1],
  ['wave4-pnj',1],
  ['wave5-verite',1],
  ['wave6-gangs',3]
];

function readWave(prefix,count){
  let b64='';
  for(let i=0;i<count;i++){
    const name=`${prefix}-${String(i).padStart(2,'0')}.b64part`;
    const path=`${DATA}/${name}`;
    if(!fs.existsSync(path))throw new Error(`${prefix}: segment manquant ${name}`);
    b64+=fs.readFileSync(path,'utf8').replace(/\s+/g,'');
  }
  let json;
  try{json=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
  catch(error){throw new Error(`${prefix}: paquet invalide (${error.message})`)}
  if(!Array.isArray(json))throw new Error(`${prefix}: racine non tabulaire`);
  return json;
}

const seen=new Map();let total=0;
for(const [prefix,count] of specs){
  const rows=readWave(prefix,count);total+=rows.length;
  for(const [i,row] of rows.entries()){
    if(!row?.title)throw new Error(`${prefix}[${i}]: titre absent`);
    if(!row?.category)throw new Error(`${prefix}[${i}] ${row.title}: catégorie absente`);
    if(row.sections&&!Array.isArray(row.sections))throw new Error(`${prefix}[${i}] ${row.title}: sections invalides`);
    const key=`${row.category}::${row.title}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if(seen.has(key))console.warn(`Doublon recouvrable: ${row.title} (${seen.get(key)} / ${prefix})`);
    seen.set(key,prefix);
  }
  console.log(`OK ${prefix}: ${rows.length} entrées`);
}

const seedPath=`${DATA}/pnj-source-seed.json`;
if(fs.existsSync(seedPath)){
  const seeds=JSON.parse(fs.readFileSync(seedPath,'utf8'));
  if(!Array.isArray(seeds))throw new Error('pnj-source-seed.json: racine non tabulaire');
  total+=seeds.length;
  console.log(`OK pnj-source-seed: ${seeds.length} entrées`);
}

console.log(`Compendium actif: ${total} entrées locales validées hors ancien stockage.`);
console.log('Les overlays préparés mais non encore branchés sont volontairement hors de ce contrôle actif.');
