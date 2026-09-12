import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {applyOperations,articleHash} from '../editor/override-engine.js';

const root=process.cwd();
const compendium=path.join(root,'compendium');
const dataDir=path.join(compendium,'data');
const manifest=JSON.parse(fs.readFileSync(path.join(dataDir,'manifest-v3.json'),'utf8'));
const store=JSON.parse(fs.readFileSync(path.join(dataDir,'manual-overrides.json'),'utf8'));
const allowedRoots=new Set(['title','source','status','tags','sections','pnj','image','illustration']);

assert.equal(store.version,1,'manual-overrides.json: version attendue = 1');
assert.ok(Array.isArray(store.entries),'manual-overrides.json: entries doit être un tableau');
if(store.updated)assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(store.updated),'manual-overrides.json: updated doit être YYYY-MM-DD');

function loadDataset(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++){
    const file=path.join(dataDir,`${spec.prefix}-${String(i).padStart(2,'0')}.b64part`);
    assert.ok(fs.existsSync(file),`Dataset manquant: ${path.basename(file)}`);
    b64+=fs.readFileSync(file,'utf8').replace(/\s+/g,'');
  }
  const json=zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8');
  const rows=JSON.parse(json);
  assert.ok(Array.isArray(rows),`${spec.id}: dataset non tabulaire`);
  return rows;
}
const articles=new Map();
for(const spec of manifest.datasets){
  for(const article of loadDataset(spec))if(article?.id)articles.set(article.id,article);
}

function mediaRefs(article){
  const refs=[];
  if(article?.pnj?.portrait)refs.push(article.pnj.portrait);
  for(const media of [article?.image,article?.illustration]){
    if(typeof media==='string')refs.push(media);
    else if(media?.src)refs.push(media.src);
  }
  return refs.filter(Boolean);
}
function isRemote(ref){return /^(?:https?:|data:|blob:)/i.test(ref);}
function checkLocalMedia(article){
  for(const ref of mediaRefs(article)){
    if(isRemote(ref))continue;
    const clean=String(ref).replace(/^\.\//,'').replace(/^compendium\//,'');
    assert.ok(!clean.includes('..'),`${article.id}: chemin média interdit: ${ref}`);
    assert.ok(fs.existsSync(path.join(compendium,clean)),`${article.id}: média local introuvable: ${ref}`);
  }
}

const seen=new Set();
for(const entry of store.entries){
  assert.ok(entry&&typeof entry==='object','Override invalide: entrée non objet');
  assert.ok(typeof entry.articleId==='string'&&entry.articleId,`Override sans articleId`);
  assert.ok(!seen.has(entry.articleId),`${entry.articleId}: plusieurs overrides commités pour la même page`);
  seen.add(entry.articleId);
  const raw=articles.get(entry.articleId);
  assert.ok(raw,`${entry.articleId}: page cible absente du corpus actif`);
  assert.match(entry.baseHash||'',/^[a-f0-9]{64}$/,`${entry.articleId}: baseHash invalide`);
  const currentHash=await articleHash(raw);
  assert.equal(entry.baseHash,currentHash,`${entry.articleId}: baseHash obsolète — réconcilier l'override avec la source actuelle`);
  assert.ok(!Number.isNaN(Date.parse(entry.updatedAt)),`${entry.articleId}: updatedAt invalide`);
  if(entry.note!==undefined)assert.equal(typeof entry.note,'string',`${entry.articleId}: note doit être une chaîne`);
  assert.ok(Array.isArray(entry.operations)&&entry.operations.length>0,`${entry.articleId}: aucune opération`);
  for(const operation of entry.operations){
    assert.ok(operation&&['add','replace','remove'].includes(operation.op),`${entry.articleId}: op invalide`);
    assert.ok(typeof operation.path==='string'&&operation.path.startsWith('/'),`${entry.articleId}: path invalide`);
    const rootKey=operation.path.slice(1).split('/',1)[0];
    assert.ok(allowedRoots.has(rootKey),`${entry.articleId}: champ protégé/non éditable: ${operation.path}`);
    if(operation.op==='remove')assert.ok(!Object.prototype.hasOwnProperty.call(operation,'value'),`${entry.articleId}: remove ne doit pas porter de value`);
    else assert.ok(Object.prototype.hasOwnProperty.call(operation,'value'),`${entry.articleId}: ${operation.op} doit porter une value`);
  }
  let effective;
  try{effective=applyOperations(raw,entry.operations);}catch(error){throw new Error(`${entry.articleId}: override inapplicable — ${error.message}`);}
  assert.equal(effective.id,raw.id,`${entry.articleId}: l'ID canonique ne peut pas être modifié`);
  assert.equal(effective.category,raw.category,`${entry.articleId}: la catégorie ne peut pas être modifiée par l'éditeur v1`);
  checkLocalMedia(effective);
}

console.log(`Manual overrides OK: ${store.entries.length} override(s), ${articles.size} pages actives contrôlées.`);
