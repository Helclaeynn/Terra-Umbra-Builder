import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const SAFE='character-builder/rulesets/terra-umbra/reality/safe';
const DATA='compendium/data';
const PARTS=[1,2,3].map(n=>`compendium/source/legacy-reintegration-part${n}-v1.json`);
const RESULT='compendium/source/legacy-reintegration-result-v1.json';
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const clean=s=>String(s).replace(/^\uFEFF/,'').replace(/\s+/g,'');

function loadBuilder(){
  const m=JSON.parse(fs.readFileSync(path.join(SAFE,'equipment.manifest.json'),'utf8'));
  const b64=m.chunks.map(f=>clean(fs.readFileSync(path.join(SAFE,f),'utf8'))).join('');
  return {manifest:m,catalog:JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))};
}
function loadDataset(spec){
  let b64='';for(let i=0;i<spec.parts;i++)b64+=clean(fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8'));
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
const source=PARTS.flatMap(file=>JSON.parse(fs.readFileSync(file,'utf8')).entries||[]);
if(source.length!==60)throw new Error(`Sources legacy ${source.length}/60.`);
if(new Set(source.map(x=>norm(x.name))).size!==60)throw new Error('Noms canoniques legacy non uniques.');
const {manifest:builderManifest,catalog}=loadBuilder();
if(builderManifest.entries!==321||catalog.entries.length!==321)throw new Error(`Builder équipement attendu 321, manifeste ${builderManifest.entries}, catalogue ${catalog.entries.length}.`);
for(const item of source){const hits=catalog.entries.filter(x=>norm(x.name)===norm(item.name));if(hits.length!==1)throw new Error(`${item.name}: ${hits.length} occurrence(s) dans le Builder.`);}
for(const alias of ['Raven LMG-027 Executionner','Phoenix LP-028 Sun Blast','Raven Gallowglass II lourde']){const hits=catalog.entries.filter(x=>norm(x.name)===norm(alias));if(hits.length!==1)throw new Error(`${alias}: alias profond dupliqué ou absent (${hits.length}).`);}
const result=JSON.parse(fs.readFileSync(RESULT,'utf8'));if(result.sourceCount!==60||result.finalCount!==321)throw new Error('Résultat intégration legacy incohérent.');
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const spec=manifest.datasets.find(x=>x.id==='equipement');if(!spec)throw new Error('Dataset Compendium equipement absent.');
const pages=loadDataset(spec);
if(spec.count!==357||pages.length!==357)throw new Error(`Compendium équipement attendu 357, manifeste ${spec.count}, pages ${pages.length}.`);
if(manifest.expectedTotal!==1862)throw new Error(`Total Compendium attendu 1862, reçu ${manifest.expectedTotal}.`);
for(const item of source){const hits=pages.filter(x=>norm(x.title)===norm(item.name));if(hits.length!==1)throw new Error(`${item.name}: ${hits.length} page(s) Compendium.`);const context=(hits[0].sections||[]).find(s=>s.id==='contexte');if(!context||context.blocks?.length!==2)throw new Error(`${item.name}: lore source-driven absent/incomplet.`);}
console.log('Réintégration legacy validée: 60 sources · Builder 321 · Compendium équipement 357 · total 1862 · alias non dupliqués.');
