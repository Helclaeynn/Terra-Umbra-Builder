import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const dataDir=path.join(root,'compendium','data');
const pageDir=path.join(dataDir,'page-overrides');
const basePath=path.join(dataDir,'manual-overrides-base.json');
const outPath=path.join(dataDir,'manual-overrides.json');

function readJson(file){return JSON.parse(fs.readFileSync(file,'utf8'));}
function validatePayload(payload,label){
  if(payload?.version!==1||!Array.isArray(payload.entries))throw new Error(`${label}: paquet d'overrides invalide`);
  return payload;
}

const base=validatePayload(readJson(basePath),path.relative(root,basePath));
const byArticle=new Map();
for(const entry of base.entries){
  if(!entry?.articleId)throw new Error('manual-overrides-base.json: entrée sans articleId');
  byArticle.set(entry.articleId,entry);
}

if(fs.existsSync(pageDir)){
  const files=fs.readdirSync(pageDir).filter(name=>name.endsWith('.json')).sort((a,b)=>a.localeCompare(b,'fr'));
  for(const name of files){
    const file=path.join(pageDir,name),payload=validatePayload(readJson(file),path.relative(root,file));
    if(payload.entries.length!==1)throw new Error(`${path.relative(root,file)}: exactement une entrée est attendue`);
    const entry=payload.entries[0];
    if(!entry?.articleId)throw new Error(`${path.relative(root,file)}: articleId absent`);
    byArticle.set(entry.articleId,entry);
  }
}

const entries=[...byArticle.values()].sort((a,b)=>String(a.articleId).localeCompare(String(b.articleId),'fr'));
const payload={version:1,updated:new Date().toISOString().slice(0,10),entries};
const text=JSON.stringify(payload,null,2)+'\n';
const previous=fs.existsSync(outPath)?fs.readFileSync(outPath,'utf8'):'';
if(previous===text){console.log(`manual-overrides.json déjà synchronisé · ${entries.length} page(s)`);process.exit(0);}
fs.writeFileSync(outPath,text,'utf8');
console.log(`manual-overrides.json reconstruit · ${entries.length} page(s)`);
