/** Fixed native traits only. Morphology is visible at R unless its own text explicitly grants SR. */
export type FreeTraitState={revelation:'v'|'sr'|'r'};
export type FreeTraitProfile={bodyArmor:number;naturalDamage:number;occultDefense:number;components:Array<{id:string;name:string;kind:'armor'|'damage'|'occult-defense';amount:number;mode:'replace'|'bonus'}>};
export function freeTraitProfile(data:any,state:FreeTraitState):FreeTraitProfile {
 const result:FreeTraitProfile={bodyArmor:0,naturalDamage:1,occultDefense:0,components:[]};
 if(data?.truth?.consciousness!=='initie'||state.revelation==='v')return result;
 const nature=data.truth.nature,species=data.truth.choices?.species;
 if(nature==='mage'){
  result.occultDefense=3;result.components.push({id:'trait:protection-du-mageius',name:'Protection du Mageius',kind:'occult-defense',amount:3,mode:'bonus'});
 }
 if(nature==='extral'&&species==='mosen'&&state.revelation==='r'){
  result.bodyArmor=1;result.naturalDamage=2;
  result.components.push({id:'trait:cuirasse-mo-senne',name:'Cuirasse mo’senne',kind:'armor',amount:1,mode:'replace'},{id:'trait:griffes-et-dentition',name:'Griffes et dentition',kind:'damage',amount:2,mode:'replace'});
 }
 if(nature==='extral'&&species==='adrak'){
  result.naturalDamage=state.revelation==='r'?3:2;result.components.push({id:'trait:pugilat-ad-rak',name:'Pugilat Ad’rak',kind:'damage',amount:result.naturalDamage,mode:'replace'});
 }
 return result;
}
