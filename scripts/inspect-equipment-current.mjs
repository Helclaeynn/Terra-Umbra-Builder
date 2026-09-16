import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root='character-builder/rulesets/terra-umbra/reality/safe';
const manifest=JSON.parse(fs.readFileSync(path.join(root,'equipment.manifest.json'),'utf8'));
const b64=manifest.chunks.map(file=>fs.readFileSync(path.join(root,file),'utf8').replace(/\s+/g,'')).join('');
const raw=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
const nameKeys=['name','nom','equipement','equipment','designation','item'];
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function get(obj,keys){for(const [k,v] of Object.entries(obj||{})){if(keys.some(x=>norm(x)===norm(k))&&v!==null&&v!==undefined&&v!=='')return v;}return null;}
const rows=[];
function walk(node,pathParts=[]){
  if(Array.isArray(node)){node.forEach((v,i)=>walk(v,pathParts.concat(i)));return;}
  if(!node||typeof node!=='object')return;
  const name=get(node,nameKeys);
  if(name){
    const category=get(node,['category','categorie','catégorie','family','famille','type','groupe']);
    const description=get(node,['description','effect','effet','usage','fonction']);
    rows.push({name:String(name),category:category??null,description:description??null,path:pathParts.join(' / '),raw:node});
  }
  for(const [k,v] of Object.entries(node))if(v&&typeof v==='object')walk(v,pathParts.concat(k));
}
walk(raw);
const terms=/cuchul|tomah|bola|feather|ravenegg|inferno|dripper|helio|superchoc|frog|pokeball|jagi|shadow|vending|bomberman|easter|black arrow|hunter|chasseur|championship|immobil|inabil|incap|poseidon|tethys|riot|sun wukong|sunwukong|king fist|ginette|antoinette|pierrette|melinette|stretch|grenade|doorbell/i;
const out=rows.filter(r=>terms.test(`${r.name} ${r.category||''} ${r.description||''}`));
console.log(JSON.stringify(out,null,2));
console.error(`MATCHES ${out.length} / ROWS ${rows.length}`);
