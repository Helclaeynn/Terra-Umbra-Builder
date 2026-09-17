import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MAP='compendium/source/legacy-equipment-media-v1.json';
const RESULT='compendium/source/legacy-equipment-media-result-v1.json';
const EXPECTED_SOURCE=124;
const EXPECTED_INSTALLED=123;
const EXPECTED_SKIPPED=1;
const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function load(spec){let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));}
function webp(file){const b=fs.readFileSync(file);return b.length>=12&&b.subarray(0,4).toString('ascii')==='RIFF'&&b.subarray(8,12).toString('ascii')==='WEBP';}

const media=JSON.parse(fs.readFileSync(MAP,'utf8'));
if(media.count!==EXPECTED_SOURCE||media.installCount!==EXPECTED_INSTALLED||media.entries.length!==EXPECTED_SOURCE)throw new Error(`Carte média ${media.entries.length}/${EXPECTED_SOURCE} · installables ${media.installCount}/${EXPECTED_INSTALLED}`);
const composite=new Set(),paths=new Set();let installables=0,skips=0;
for(const item of media.entries){
  const k=`${norm(item.source)}|${norm(item.legacyName)}`;
  if(composite.has(k))throw new Error(`Source média dupliquée: ${k}`);composite.add(k);
  if(paths.has(item.image))throw new Error(`Chemin média dupliqué: ${item.image}`);paths.add(item.image);
  if(!item.image.startsWith('images/manual/equipment-legacy/')||!item.image.endsWith('.webp'))throw new Error(`Chemin média non géré: ${item.image}`);
  const file=`compendium/${item.image}`;
  if(!fs.existsSync(file)||!webp(file))throw new Error(`WebP absent/invalide: ${file}`);
  const sha=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if(sha!==item.sha256)throw new Error(`SHA média différent: ${item.image}`);
  if(Number(item.width)<100||Number(item.height)<100)throw new Error(`Dimensions média invalides: ${item.image}`);
  if(item.install===false){skips++;if(norm(item.legacyName)!==norm('CB Hunter')||norm(item.collisionTarget)!==norm('Owl LC-014 Chasseur'))throw new Error('Collision média inattendue.');}
  else installables++;
}
if(installables!==EXPECTED_INSTALLED||skips!==EXPECTED_SKIPPED)throw new Error(`Carte média: ${installables} installables, ${skips} ignorés.`);

const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
if(manifest.expectedTotal!==1862)throw new Error(`Total V3 ${manifest.expectedTotal}/1862`);
const spec=manifest.datasets.find(item=>item.id==='equipement');
const pages=load(spec);if(pages.length!==357)throw new Error(`Équipement ${pages.length}/357`);
const result=JSON.parse(fs.readFileSync(RESULT,'utf8'));
if(result.sourceCount!==EXPECTED_SOURCE||result.count!==EXPECTED_INSTALLED||result.skippedCount!==EXPECTED_SKIPPED||result.entries.length!==EXPECTED_INSTALLED||result.skipped.length!==EXPECTED_SKIPPED)throw new Error(`Résultat média incohérent: ${result.entries.length} installés / ${result.skipped.length} ignorés.`);
const byId=new Map(pages.map(page=>[page.id,page]));const resultPages=new Set();
for(const row of result.entries){
  if(resultPages.has(row.pageId))throw new Error(`Page média dupliquée dans le résultat: ${row.pageId}`);resultPages.add(row.pageId);
  const page=byId.get(row.pageId);if(!page)throw new Error(`Page média absente: ${row.pageId}`);
  if(page.illustration?.src!==row.image)throw new Error(`${row.title}: illustration ${page.illustration?.src||'absente'} != ${row.image}`);
  if(page.catalog?.mediaSource!=='legacy-tuc-docx')throw new Error(`${row.title}: provenance média absente`);
  if(norm(page.catalog?.mediaLegacyName)!==norm(row.legacyName))throw new Error(`${row.title}: legacyName média différent`);
  if(norm(page.catalog?.mediaLegacyDocument)!==norm(row.source))throw new Error(`${row.title}: document média différent`);
}
const hunter=pages.find(page=>norm(page.title)===norm('Owl LC-014 Chasseur'));
if(!hunter)throw new Error('Owl LC-014 Chasseur absent.');
if(norm(hunter.catalog?.mediaLegacyName)!==norm('+B Hunter'))throw new Error(`Chasseur utilise ${hunter.catalog?.mediaLegacyName||'aucune'} au lieu de +B Hunter.`);
if(norm(result.skipped[0]?.legacyName)!==norm('CB Hunter'))throw new Error('Le média ignoré attendu CB Hunter est absent.');
console.log(`Médias legacy OK — ${EXPECTED_INSTALLED} fiches reliées à ${EXPECTED_SOURCE} illustrations source, collision CB Hunter documentée · équipement ${pages.length} · total V3 ${manifest.expectedTotal}.`);
