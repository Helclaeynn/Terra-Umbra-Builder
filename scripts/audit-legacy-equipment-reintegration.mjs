import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT='character-builder/rulesets/terra-umbra/reality';
const SAFE=path.join(ROOT,'safe');
const CANDIDATES='compendium/source/legacy-equipment-candidates-v1.json';
const OUT='compendium/source/legacy-equipment-audit-v1.json';
const NAME_KEYS=['name','nom','equipement','equipment','item','designation'];
const CATEGORY_KEYS=['category','categorie','catégorie','section','family','famille','type','groupe'];

function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function field(obj,names){for(const [k,v] of Object.entries(obj||{})){if(names.map(norm).includes(norm(k))&&v!==null&&v!==undefined&&String(v).trim())return v;}return null;}
function collect(node,pathParts=[],out=[]){
  if(Array.isArray(node)){node.forEach((v,i)=>collect(v,pathParts.concat(i),out));return out;}
  if(!node||typeof node!=='object')return out;
  const keys=Object.keys(node).map(norm);const hasName=keys.some(k=>NAME_KEYS.map(norm).includes(k));
  if(hasName){const name=field(node,NAME_KEYS);if(name)out.push({name:String(name).trim(),category:String(field(node,CATEGORY_KEYS)||pathParts.join(' / ')).trim(),raw:node});}
  for(const [k,v] of Object.entries(node))if(v&&typeof v==='object')collect(v,pathParts.concat(k),out);
  return out;
}
function cleanB64(s){return String(s).replace(/^\uFEFF/,'').replace(/\s+/g,'');}
function loadEquipment(){const m=JSON.parse(fs.readFileSync(path.join(SAFE,'equipment.manifest.json'),'utf8'));const b64=m.chunks.map(f=>cleanB64(fs.readFileSync(path.join(SAFE,f),'utf8'))).join('');return {manifest:m,data:JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))};}
function stripLegacyPrefix(name){return norm(name).replace(/^(pw|p|cos|bk|bh|wm|gl|b|cb|esw|wsg|ar|sr|dgr|dg|lmg|mg|pp|hp|lp|spc|sba|bpv|lba|hba)\s+/,'').trim();}
function tokens(s){return new Set(norm(s).split(/\s+/).filter(x=>x.length>1));}
function score(a,b){const A=tokens(a),B=tokens(b);if(!A.size||!B.size)return 0;let inter=0;for(const t of A)if(B.has(t))inter++;return 2*inter/(A.size+B.size);}

const source=JSON.parse(fs.readFileSync(CANDIDATES,'utf8'));
const loaded=loadEquipment();
const rows=collect(loaded.data);
const unique=[];const seen=new Set();
for(const row of rows){const k=norm(`${row.name}|${row.category}`);if(seen.has(k))continue;seen.add(k);unique.push(row);}
const currentByName=new Map(unique.map(x=>[norm(x.name),x]));
const aliases=source.rules?.confirmedAliases||{};
const results=[];
for(const [document,names] of Object.entries(source.documents||{}))for(const legacyName of names){
  const alias=aliases[legacyName]||null;
  const exact=currentByName.get(norm(legacyName))||null;
  const aliasHit=alias?currentByName.get(norm(alias))||unique.find(x=>norm(x.name).endsWith(norm(alias).split(' ').slice(-1)[0])):null;
  const needle=stripLegacyPrefix(legacyName);
  const titleHits=unique.filter(x=>{const n=norm(x.name);return n===needle||n.endsWith(' '+needle)||n.includes(' '+needle+' ');});
  const candidates=unique.map(x=>({name:x.name,category:x.category,score:Math.max(score(needle,x.name),score(legacyName,x.name))})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name)).slice(0,5);
  let status='missing';let match=null;let confidence='none';
  if(exact){status='existing';match={name:exact.name,category:exact.category};confidence='exact';}
  else if(aliasHit){status='existing';match={name:aliasHit.name,category:aliasHit.category};confidence='confirmed-alias';}
  else if(titleHits.length===1){status='likely-existing';match={name:titleHits[0].name,category:titleHits[0].category};confidence='title';}
  else if(candidates[0]?.score>=0.74&&(!candidates[1]||candidates[0].score-candidates[1].score>=0.12)){status='likely-existing';match={name:candidates[0].name,category:candidates[0].category};confidence='fuzzy';}
  results.push({document,legacyName,status,confidence,confirmedAlias:alias,match,candidates});
}
const report={version:1,builderManifest:loaded.manifest,currentUniqueEntries:unique.length,currentEntries:unique.map(({name,category})=>({name,category})),summary:{total:results.length,existing:results.filter(x=>x.status==='existing').length,likelyExisting:results.filter(x=>x.status==='likely-existing').length,missing:results.filter(x=>x.status==='missing').length},results};
fs.writeFileSync(OUT,JSON.stringify(report,null,2)+'\n');
console.log(`Legacy audit: ${report.summary.total} candidates · ${report.summary.existing} existing · ${report.summary.likelyExisting} likely · ${report.summary.missing} missing.`);
