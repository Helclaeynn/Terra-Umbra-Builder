import assert from 'node:assert/strict';
import {getRealityRules} from '../dist/rules/reality.js';
import {armorStats} from '../dist/rules/equipment-armor.js';
import {restoreArmorProperties} from '../dist/compendium-armor-properties.js';
import {getCompendiumQualityCorpus} from '../dist/compendium.js';
import {pool} from '../dist/db.js';
try{
 const items=getRealityRules().equipment.filter(item=>item.sourceCategory.startsWith('Armures'));
 assert.equal(items.length,27);
 const corpus=await getCompendiumQualityCorpus();
 const map=new Map(corpus.articles.map(article=>[article.id,article]));
 for(const item of items){
  const stats=armorStats(item);assert.ok(stats.length,item.name);
  const article=corpus.articles.find(article=>article.catalog?.id===item.id);assert.ok(article,item.name+' article');
  const table=article.sections.find(section=>section.id==='proprietes').blocks.find(block=>block.type==='table');
  for(const [label,value] of stats)assert.ok(table.rows.some(row=>row[0]===label&&row[1]===value),item.name+' '+label);
 }
 const before=JSON.stringify(corpus.articles.filter(article=>items.some(item=>item.id===article.catalog?.id)));
 restoreArmorProperties(map);
 assert.equal(JSON.stringify(corpus.articles.filter(article=>items.some(item=>item.id===article.catalog?.id))),before,'Restoration is idempotent');
 assert.deepEqual(armorStats({category:'Armures',data:{Armure:0}}),[['Armure','0']]);
 assert.deepEqual(armorStats({category:'Services',data:{Profil:'Not armour'}}),[]);
 console.log('ARMOR PROPERTIES OK — 27 canonical profiles, full Compendium corpus, original typed values, zero and idempotence');
}finally{await pool.end();}
