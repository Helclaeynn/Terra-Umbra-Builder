import {armorStats} from './rules/equipment-armor.js';
import {getRealityRules} from './rules/reality.js';

// Restore the missing mechanical rows while preserving lore, prices and illustrations.
export function restoreArmorProperties(articles:Map<string,any>){
 const equipment=new Map(getRealityRules().equipment.map(item=>[item.id,item]));
 for(const article of articles.values()){
  const item=equipment.get(String(article.catalog?.id??''));
  if(!item)continue;
  const stats=armorStats(item);if(!stats.length)continue;
  const sections=article.sections??(article.sections=[]);
  let properties=sections.find((section:any)=>section.id==='proprietes');
  if(!properties){properties={id:'proprietes',title:'Propriétés',level:2,blocks:[]};sections.push(properties);}
  let table=properties.blocks?.find((block:any)=>block.type==='table'&&Array.isArray(block.rows));
  if(!table){table={type:'table',rows:[]};(properties.blocks??=[]).push(table);}
  for(const [label,value] of stats){
   const row=table.rows.find((row:unknown)=>Array.isArray(row)&&row[0]===label);
   if(row)row[1]=value;else table.rows.push([label,value]);
  }
 }
}
