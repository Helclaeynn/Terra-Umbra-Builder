import fs from 'node:fs';
import zlib from 'node:zlib';

const file='character-builder/rulesets/terra-umbra/reality/equipment.json.gz.b64';
const raw=JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync(file,'utf8').replace(/\s+/g,''),'base64')).toString('utf8'));
const nameKeys=['name','nom','equipement','equipment','designation','item'];
const useful=['category','categorie','catégorie','family','famille','type','groupe','description','effect','effet','usage','fonction','dgt','degats','dégâts','price','prix','cost','cout','coût','portee','portée','chargeur'];
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function get(obj,keys){for(const [k,v] of Object.entries(obj||{})){if(keys.some(x=>norm(x)===norm(k))&&v!==null&&v!==undefined&&v!=='')return v;}return null;}
const rows=[];
function walk(node,path=[]){
  if(Array.isArray(node)){node.forEach((v,i)=>walk(v,path.concat(i)));return;}
  if(!node||typeof node!=='object')return;
  const name=get(node,nameKeys);
  if(name){
    const category=get(node,['category','categorie','catégorie','family','famille','type','groupe']);
    const description=get(node,['description','effect','effet','usage','fonction']);
    rows.push({name:String(name),category:category??null,description:description??null,path:path.join(' / '),raw:node});
  }
  for(const [k,v] of Object.entries(node))if(v&&typeof v==='object')walk(v,path.concat(k));
}
walk(raw);
const terms=/cuchul|tomah|bola|feather|ravenegg|inferno|dripper|helio|superchoc|frog|pokeball|jagi|shadow|vending|bomberman|easter|black arrow|hunter|chasseur|championship|immobil|inabil|incap|poseidon|tethys|riot|sun wukong|sunwukong|king fist|ginette|antoinette|pierrette|melinette|stretch|grenade|doorbell/i;
const out=rows.filter(r=>terms.test(`${r.name} ${r.category||''} ${r.description||''}`));
console.log(JSON.stringify(out,null,2));
console.error(`MATCHES ${out.length} / ROWS ${rows.length}`);
