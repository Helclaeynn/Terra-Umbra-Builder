// Read original armour values without deriving a generic score from typed protection.
type ArmorEntry={category?:unknown;sourceCategory?:unknown;data?:unknown};
const norm=(value:unknown)=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function armorStats(entry:ArmorEntry):Array<readonly [string,string]>{
 if(!/armur/.test(norm(entry.sourceCategory??entry.category)))return [];
 const data=entry.data&&typeof entry.data==='object'&&!Array.isArray(entry.data)?entry.data as Record<string,unknown>:{};
 const pools=[data,data.data,data.details].filter((value):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value));
 const fields:Array<[string,string[]]>=[
  ['Armure',['Armure','Valeur d’Armure','Valeur Armure']],
  ['Protection',['Protection']],
  ['Balistique',['Balistique','Bal.']],
  ['Mêlée',['Mêlée','Melee','Mél.','Mel.']],
  ['Antichoc',['Antichoc','Ant.']],
  ['Énergie',['Énergie','Energie']],
  ['Profil',['Profil']],
  ['Camouflage',['Camouflage','Camo']],
 ];
 return fields.flatMap(([label,aliases])=>{
  const wanted=new Set(aliases.map(norm));
  for(const pool of pools)for(const [key,value] of Object.entries(pool)){
   if(wanted.has(norm(key))&&value!==undefined&&value!==null&&String(value).trim()!=='')return [[label,String(value).trim()] as const];
  }
  return [];
 });
}
