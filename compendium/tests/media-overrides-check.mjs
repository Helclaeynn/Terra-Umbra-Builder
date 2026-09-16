import fs from 'node:fs';

const payload=JSON.parse(fs.readFileSync('compendium/data/media-overrides-v1.json','utf8'));
if(payload.version!==1||!Array.isArray(payload.entries)||payload.entries.length!==4)throw new Error(`4 médias attendus, ${payload.entries?.length||0}`);
const ids=new Set(),paths=new Set();
for(const entry of payload.entries){
  if(!entry.articleId||!entry.image?.src)throw new Error('Entrée média incomplète');
  if(ids.has(entry.articleId))throw new Error(`Article dupliqué: ${entry.articleId}`);ids.add(entry.articleId);
  if(paths.has(entry.image.src))throw new Error(`Chemin média dupliqué: ${entry.image.src}`);paths.add(entry.image.src);
  const file=`compendium/${entry.image.src}`;
  if(!fs.existsSync(file))throw new Error(`Image absente: ${file}`);
  const bytes=fs.readFileSync(file);
  if(bytes.length<100||bytes.subarray(0,4).toString('ascii')!=='RIFF'||bytes.subarray(8,12).toString('ascii')!=='WEBP')throw new Error(`WebP invalide: ${file}`);
}
console.log(`MEDIA OVERRIDES OK — ${payload.entries.length} images.`);
