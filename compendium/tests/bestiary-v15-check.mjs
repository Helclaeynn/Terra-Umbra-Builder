import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const spec=manifest.datasets.find(x=>x.id==='bestiaire');
if(!spec) throw new Error('Dataset bestiaire absent');
if(spec.count!==262) throw new Error(`Bestiaire: ${spec.count} entrées, attendu 262`);

let b64='';
for(let i=0;i<spec.parts;i++){
  const path=`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
  if(!fs.existsSync(path)) throw new Error(`Fragment absent: ${path}`);
  b64+=fs.readFileSync(path,'utf8').replace(/\s+/g,'');
}
const sha=crypto.createHash('sha256').update(b64).digest('hex');
if(sha!==spec.sha256) throw new Error(`SHA bestiaire invalide ${sha} != ${spec.sha256}`);

const rows=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
if(rows.length!==262) throw new Error(`Bestiaire décodé: ${rows.length}, attendu 262`);
if(new Set(rows.map(x=>x.id)).size!==262) throw new Error('IDs Bestiaire non uniques');

const chapter1=rows.filter(x=>x.bestiary?.chapter?.startsWith('1.'));
const chapter2=rows.filter(x=>x.bestiary?.chapter?.startsWith('2.'));
if(chapter1.length!==131||chapter2.length!==131){
  throw new Error(`Répartition Bestiaire invalide: chapitre 1=${chapter1.length}, chapitre 2=${chapter2.length}`);
}

for(const row of rows){
  if(row.category!=='Bestiaire') throw new Error(`${row.title}: catégorie ${row.category}`);
  const description=(row.sections||[]).find(s=>s.id==='description');
  const mj=(row.sections||[]).find(s=>s.id==='dossier-mj');
  if(!description?.blocks?.some(b=>String(b.text||'').trim())) throw new Error(`${row.title}: description publique absente`);
  if(description.audience==='mj') throw new Error(`${row.title}: description marquée MJ`);
  if(mj?.audience!=='mj'||!mj.blocks?.length) throw new Error(`${row.title}: dossier MJ absent`);
  if(!row.bestiary?.hook) throw new Error(`${row.title}: hook MJ absent`);
  if(!row.illustration?.src) throw new Error(`${row.title}: emplacement illustration absent`);
  if(!Array.isArray(row.tags)||!row.tags.includes(row.bestiary.chapter)) throw new Error(`${row.title}: chapitre absent des tags`);
  if(row.bestiary.family&&!row.tags.includes(row.bestiary.family)) throw new Error(`${row.title}: famille absente des tags`);
  if(row.bestiary.subfamily&&!row.tags.includes(row.bestiary.subfamily)) throw new Error(`${row.title}: sous-famille absente des tags`);
}

const wendigo=rows.find(x=>x.title==='Wendigo');
if(!wendigo) throw new Error('Wendigo absent');
if(wendigo.bestiary.chapter!=='2.10 Fléaux, Ruptures et Abominations') throw new Error('Wendigo: mauvais chapitre');
if(wendigo.bestiary.family!=='Vhodhal — la Famine Blanche') throw new Error('Wendigo: mauvaise famille');
if(wendigo.tags.some(t=>/revenant/i.test(t))) throw new Error('Wendigo classé à tort parmi les Revenants');

const civil=rows.find(x=>x.title==='Civil ordinaire');
if(!civil||civil.bestiary.chapter!=='1.1 PNJ Réalité') throw new Error('Civil ordinaire / Bestiaire Réalité absent');

console.log(`Bestiaire V15 OK — ${rows.length} fiches · ${chapter1.length} chapitre 1 · ${chapter2.length} chapitre 2 · descriptions publiques, dossiers MJ, hooks, hiérarchie et illustrations prêts.`);
