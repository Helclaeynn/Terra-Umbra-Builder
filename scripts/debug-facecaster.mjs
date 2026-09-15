import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root='character-builder/rulesets/terra-umbra/reality/safe';
const manifest=JSON.parse(fs.readFileSync(path.join(root,'equipment.manifest.json'),'utf8'));
const b64=manifest.chunks.map(file=>fs.readFileSync(path.join(root,file),'utf8').replace(/\s+/g,'')).join('');
const raw=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const hits=[];
function walk(node,path=[]){
  if(Array.isArray(node)){node.forEach((v,i)=>walk(v,path.concat(i)));return;}
  if(!node||typeof node!=='object')return;
  const name=Object.entries(node).find(([k])=>['name','nom','equipement','equipment','service','item','designation'].includes(norm(k)))?.[1];
  if(norm(name)==='facecaster dfl')hits.push({path:path.join(' / '),row:node});
  for(const [k,v] of Object.entries(node))if(v&&typeof v==='object')walk(v,path.concat(k));
}
walk(raw);
console.log(JSON.stringify({entries:manifest.entries,faceCasterHits:hits},null,2));
