import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const TARGET_DATASETS=new Set(['equipement','augmentations','verite-catalogue']);
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const navigationPath=`${DATA}/navigation-v1.json`;
const navigation=JSON.parse(fs.readFileSync(navigationPath,'utf8'));

function loadDataset(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8')).map(page=>({...page,dataset:page.dataset||spec.id}));
}

const targetSpecs=manifest.datasets.filter(spec=>TARGET_DATASETS.has(spec.id));
if(targetSpecs.length!==TARGET_DATASETS.size)throw new Error(`Datasets catalogue manquants dans manifest-v3.json: ${targetSpecs.map(spec=>spec.id).join(', ')}`);
const pages=targetSpecs.flatMap(loadDataset);
const pageById=new Map(pages.map(page=>[page.id,page]));
if(pageById.size!==pages.length)throw new Error(`IDs catalogue dupliqués pendant la synchronisation navigation: ${pages.length-pageById.size}`);

let touched=0,checked=0;
const missing=[];
for(const entry of navigation.entries||[]){
  if(!TARGET_DATASETS.has(entry.dataset))continue;
  checked++;
  const page=pageById.get(entry.id);
  if(!page){missing.push(entry.id);continue;}
  const title=String(page.title||'').trim();
  if(!title)throw new Error(`Titre catalogue vide: ${entry.id}`);
  if(entry.displayTitle!==title){entry.displayTitle=title;touched++;}
}
if(missing.length)throw new Error(`Pages catalogue absentes du corpus pendant la synchronisation navigation (${missing.length}): ${missing.slice(0,20).join(', ')}`);
if(checked!==pages.length)throw new Error(`Parité navigation/catalogues: ${checked} entrées navigation pour ${pages.length} pages catalogue`);

fs.writeFileSync(navigationPath,`${JSON.stringify(navigation,null,2)}\n`,'utf8');
console.log(`Navigation catalogue synchronisée — ${checked} titres contrôlés · ${touched} corrigés · version ${navigation.version}.`);
