import {truthCoreRules} from './truth/core-rules.js';
import {khinaeBodyProfile,khinaeUsableTalents} from './truth/khinae.js';
import type {TruthRulesPackage,TruthState} from './truth/types.js';
const pkg=truthCoreRules as unknown as TruthRulesPackage;
export type BodyForm='human'|'animal'|'hybrid';
export type ActivePower={id:string;until:number|null;skill:string;amount:number;note:string};
export function liveTruthState(data:any):TruthState{return {...data.truth,choices:data.truth?.choices??{},truthTalents:[...new Set<string>([...(data.truth?.truthTalents??[]),...(data.progression?.truthTalents??[])])]};}
export function liveBody(data:any,state:{revelation:string;form?:BodyForm;inWater?:boolean}){
 const truth=liveTruthState(data);
 if(!['garou','khinae'].includes(truth.nature)||truth.consciousness==='profane'||state.revelation!=='r')return null;
 const body=khinaeBodyProfile(pkg,truth,state.form??'human',state.inWater);
 return body.available?body:null;
}
export function formAvailable(data:any,form:BodyForm){const t=liveTruthState(data);return ['garou','khinae'].includes(t.nature)&&khinaeBodyProfile(pkg,t,form).available;}
export function usableKhinaeTalent(data:any,id:string){const t=liveTruthState(data);return khinaeUsableTalents(pkg,t).has((t.nature==='khinae'?'khinae_blood_':'')+id);}
export const mechanicalPowerRoutes:Record<string,string>={'extral-reflexe-de-chasse':'defense','extral-reflexe-conditionne':'defense',vitesse_impossible:'defense',khinae_blood_vitesse_impossible:'defense','extral-cycle-de-reparation':'heal','extral-reserve-nanitique':'passive'};
const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function truthPowers(data:any){
 const t=liveTruthState(data);if(t.consciousness==='profane')return [];
 const nature=pkg.structure.natures[t.nature];if(!nature)return [];
 const owned=new Set(t.truthTalents);
 const rows=(pkg.catalogs[t.nature]??[]).filter(p=>owned.has(p.id)&&(!p.prerequisite||owned.has(p.prerequisite)));
 const free=[...nature.baseFreeTraits,...nature.freeTraitRules.filter(r=>Object.entries(r.when).every(([key,value])=>Array.isArray(value)?value.includes(String(t.choices[key])):value===t.choices[key])).flatMap(r=>r.traits)];
 return [...rows,...free.map((p,i)=>({...p,id:'trait:'+norm(p.name).replace(/[^a-z0-9]+/g,'-'),activation:'',effectDetails:p.effect}))].map(p=>{
  const text=p.effectDetails||p.effect,activation=p.activation??'',access=p.access??'R';
  const costText=norm(activation+' '+text),costMatch=/(?:^|pour |reaction[ ·:]*)\s*(\d+)\s*pa\b/.exec(costText);
  const limit=/1\s*\/\s*round|une fois par round/.test(costText)?'round':/1\s*\/\s*scene|une fois par scene/.test(costText)?'scene':/1\s*\/\s*jour|une fois par jour/.test(costText)?'day':/1\s*\/\s*scenario|une fois par scenario/.test(costText)?'scenario':null;
  const stage=/(?:^|\W)V(?:\W|$)/.test(access)?'v':/(?:^|\W)SR(?:\W|$)/.test(access)?'sr':'r';
  return {execution:mechanicalPowerRoutes[p.id]??'assisted',id:p.id,name:p.name,text,activation,access,cost:costMatch?Number(costMatch[1]):null,limit,stage};
 });
}
export function powerAllowed(power:{stage:string},revelation:string){return power.stage==='v'||power.stage==='sr'&&revelation!=='v'||revelation==='r';}
export function activeTruthPowers(data:any,state:{powers?:ActivePower[];revelation:string;round:number}){
 const available=truthPowers(data);
 return (state.powers??[]).filter(p=>{const rule=available.find(r=>r.id===p.id);return rule&&rule.execution==='assisted'&&powerAllowed(rule,state.revelation)&&(p.until===null||p.until>=state.round);});
}
