import fs from 'node:fs';
import zlib from 'node:zlib';

const file='character-builder/rulesets/terra-umbra/reality/augmentations.json.gz.b64';
const clean=fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'').replace(/\s+/g,'');
const buf=Buffer.from(clean,'base64');

function gzipPayload(bytes){
  if(bytes.length<18||bytes[0]!==0x1f||bytes[1]!==0x8b||bytes[2]!==8)throw new Error('En-tête gzip invalide');
  const flg=bytes[3];
  let p=10;
  if(flg&0x04){if(p+2>bytes.length)throw new Error('Gzip FEXTRA tronqué');const xlen=bytes[p]|(bytes[p+1]<<8);p+=2+xlen;}
  const skipZ=()=>{while(p<bytes.length&&bytes[p]!==0)p++;p++;};
  if(flg&0x08)skipZ();
  if(flg&0x10)skipZ();
  if(flg&0x02)p+=2;
  if(p>=bytes.length-8)throw new Error('Flux gzip sans payload exploitable');
  return bytes.subarray(p,bytes.length-8);
}

let text;
try{
  text=zlib.gunzipSync(buf).toString('utf8');
  console.log('Augmentations: gzip source valide, aucune récupération nécessaire.');
}catch(error){
  console.warn(`Augmentations: contrôle gzip source invalide (${error.code||error.message}); lecture du flux DEFLATE avec validation JSON.`);
  text=zlib.inflateRawSync(gzipPayload(buf)).toString('utf8');
}

const parsed=JSON.parse(text);
if(!parsed||typeof parsed!=='object')throw new Error('Augmentations: JSON récupéré invalide');
const normalized=zlib.gzipSync(Buffer.from(JSON.stringify(parsed),'utf8'),{level:9}).toString('base64');
fs.writeFileSync(file,normalized+'\n');
console.log(`Augmentations: source de travail normalisée (${Buffer.byteLength(text)} octets JSON).`);
