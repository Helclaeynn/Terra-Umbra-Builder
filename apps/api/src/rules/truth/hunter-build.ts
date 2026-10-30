/** Descriptive choices only: never creates companions, items, statistics or PTV. */
export const hunterDoctrines = [
 {id:'doctrine_commune',name:'Doctrine commune de Chasse'}, {id:'lavandiere',name:'Lavandières'},
 {id:'catholique',name:'Chasseurs catholiques'}, {id:'khalsa',name:'Khālsā'},
 {id:'taoiste',name:'Taoïstes'}, {id:'kabbale',name:'Kabbale'},
 {id:'nizarite',name:'Nizarites'}, {id:'onmyoji',name:'Onmyōji'},
 {id:'neopaien',name:'Néopaïens'}, {id:'chasse_fantastique',name:'Chasse fantastique'},
 {id:'lueurs_azmenor',name:'Lueurs d’Azmenor'}, {id:'xenoshield',name:'XenoShield'},
 {id:'independant',name:'Chasseurs indépendants'}, {id:'table_ronde',name:'Table ronde'}
] as const;
export type HunterBuild={doctrines:string[];records:Record<string,{reference:string;agreement:string;profile:string;limits:string}>};
const record=(v:unknown):Record<string,unknown>=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const text=(v:unknown)=>typeof v==='string'?v.trim().slice(0,1600):'';
export function normalizeHunterBuild(raw:unknown):HunterBuild{
 const source=record(raw), known=new Set<string>(hunterDoctrines.map(d=>d.id));
 const doctrines=Array.isArray(source.doctrines)?[...new Set(source.doctrines.filter((v):v is string=>typeof v==='string'&&known.has(v)))]:[];
 const records:HunterBuild['records']={};
 for(const [id,value] of Object.entries(record(source.records)).slice(0,80)){
  if(!/^[a-z0-9_]{1,240}$/.test(id))continue;
  const r=record(value);records[id]={reference:text(r.reference),agreement:text(r.agreement),profile:text(r.profile),limits:text(r.limits)};
 }
 return {doctrines,records};
}
