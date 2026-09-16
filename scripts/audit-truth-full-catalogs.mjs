import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT='character-builder/rulesets/terra-umbra/truth/full';

function jsonSummary(value){
  const rootType=Array.isArray(value)?'array':value===null?'null':typeof value;
  const keys=value&&typeof value==='object'&&!Array.isArray(value)?Object.keys(value):[];
  const arrays=[];
  function walk(node,prefix='',depth=0){
    if(depth>4||node==null)return;
    if(Array.isArray(node)){
      arrays.push({path:prefix||'$',count:node.length,sampleKeys:node[0]&&typeof node[0]==='object'&&!Array.isArray(node[0])?Object.keys(node[0]).slice(0,16):[]});
      for(let i=0;i<Math.min(node.length,2);i++) walk(node[i],`${prefix}[${i}]`,depth+1);
      return;
    }
    if(typeof node==='object') for(const [key,child] of Object.entries(node)) walk(child,prefix?`${prefix}.${key}`:key,depth+1);
  }
  walk(value);
  return {rootType,keys,arrays};
}

function decodeGzipB64(file){
  const b64=fs.readFileSync(file,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}

function tryDecodePlainB64(parts){
  const b64=parts.map(file=>fs.readFileSync(file,'utf8').replace(/\s+/g,'')).join('');
  const buf=Buffer.from(b64,'base64');
  const attempts=[()=>JSON.parse(buf.toString('utf8')),()=>JSON.parse(zlib.gunzipSync(buf).toString('utf8'))];
  for(const attempt of attempts){try{return attempt()}catch{}}
  return null;
}

const names=fs.readdirSync(ROOT).sort();
console.log(`TRUTH/FULL — ${names.length} fichiers`);

for(const name of names.filter(n=>n.endsWith('.json.gz.b64'))){
  const file=path.join(ROOT,name);
  try{
    const parsed=decodeGzipB64(file),summary=jsonSummary(parsed);
    console.log(`GZIP | ${name} | root=${summary.rootType} | keys=${summary.keys.join(',')||'—'}`);
    for(const a of summary.arrays.slice(0,16)) console.log(`  ARRAY | ${a.path} | ${a.count} | ${a.sampleKeys.join(',')||'—'}`);
  }catch(error){console.log(`GZIP_ERROR | ${name} | ${error.message}`)}
}

for(const name of names.filter(n=>n.endsWith('.manifest.json'))){
  const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,name),'utf8'));
  console.log(`MANIFEST | ${name} | ${JSON.stringify(manifest)}`);
  const base=name.replace(/\.manifest\.json$/,'');
  const candidates=names.filter(n=>n.startsWith(`${base}.part`)&&n.endsWith('.b64')).map(n=>path.join(ROOT,n));
  if(!candidates.length) continue;
  const parsed=tryDecodePlainB64(candidates);
  if(!parsed){console.log(`  PARTS_UNDECODED | ${candidates.map(f=>path.basename(f)).join(',')}`);continue}
  const summary=jsonSummary(parsed);
  console.log(`  PARTS | ${candidates.map(f=>path.basename(f)).join(',')} | root=${summary.rootType} | keys=${summary.keys.join(',')||'—'}`);
  for(const a of summary.arrays.slice(0,16)) console.log(`    ARRAY | ${a.path} | ${a.count} | ${a.sampleKeys.join(',')||'—'}`);
}
