import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT='character-builder/rulesets/terra-umbra/reality';

function cleanBase64(text){return String(text).replace(/^\uFEFF/,'').replace(/\s+/g,'');}
function validateJsonGzip(label,b64){
  const text=zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8');
  const data=JSON.parse(text);
  if(!data||typeof data!=='object')throw new Error(`${label}: racine JSON invalide`);
  return {data,text};
}

// Augmentations: le Builder charge directement ce paquet.
const augPath=path.join(ROOT,'augmentations.json.gz.b64');
const augB64=cleanBase64(fs.readFileSync(augPath,'utf8'));
const aug=validateJsonGzip('Augmentations',augB64);
fs.writeFileSync(augPath,zlib.gzipSync(Buffer.from(JSON.stringify(aug.data),'utf8'),{level:9}).toString('base64')+'\n');
console.log(`Augmentations: paquet actif validé (${Buffer.byteLength(aug.text)} octets JSON).`);

// Équipement: reproduit le shim 06b-reality-safe-fetch utilisé par le Builder.
const safeDir=path.join(ROOT,'safe');
const equipManifest=JSON.parse(fs.readFileSync(path.join(safeDir,'equipment.manifest.json'),'utf8'));
if(!Array.isArray(equipManifest.chunks)||!equipManifest.chunks.length)throw new Error('Équipement: manifeste safe sans fragments');
const equipB64=equipManifest.chunks.map(file=>cleanBase64(fs.readFileSync(path.join(safeDir,file),'utf8'))).join('');
if(!/^[A-Za-z0-9+/]*={0,2}$/.test(equipB64)||equipB64.length%4!==0)throw new Error('Équipement: Base64 safe reconstruit invalide');
const equip=validateJsonGzip('Équipement safe',equipB64);
fs.writeFileSync(path.join(ROOT,'equipment.json.gz.b64'),zlib.gzipSync(Buffer.from(JSON.stringify(equip.data),'utf8'),{level:9}).toString('base64')+'\n');
console.log(`Équipement: ${equipManifest.chunks.length} fragments safe validés · ${equipManifest.entries??'?'} entrées annoncées · ${Buffer.byteLength(equip.text)} octets JSON.`);
