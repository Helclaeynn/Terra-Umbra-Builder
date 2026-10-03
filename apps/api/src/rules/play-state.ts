import {truthRevelationRules} from './truth/revelation.js';
import {extralPlayBonuses,exilePlayBonuses,augmentationPlayBonuses} from './play-bonuses.js';
import { terraUmbraCreationRules as rules } from './terra-umbra-creation.js';
import { terraUmbraTalentChoiceSpecs as specs, terraUmbraRealitySkillTalentMap as skillMap } from './terra-umbra-creation-lore.js';
import { contextualSkillBonuses } from './reality-conditional-bonuses.js';
import { dailyRecovery, injuryStress } from './reality-talents-policy.js';
import { characterDerivedStats } from './character-derived-stats.js';
export type PlayBonus={id:string;label:string;skill:string;amount:number;truth:boolean;enabled:boolean};
export type PlayState={hp:number|null;stress:0|1|2;revelation:'v'|'sr'|'r';pa:number;round:number;initiative:number|null;paPerRound:number;stabilized:boolean;share:boolean;disabled:string[];contexts:string[];bonuses:PlayBonus[]};
export const blankPlayState=():PlayState=>({hp:null,stress:0,revelation:'v',pa:0,round:1,initiative:null,paPerRound:0,stabilized:false,share:true,disabled:[],contexts:[],bonuses:[]});
export function validatePlayState(v:any):v is PlayState {
  return !!v && (v.hp===null||Number.isSafeInteger(v.hp)&&Math.abs(v.hp)<=10000) && [0,1,2].includes(v.stress) && ['v','sr','r'].includes(v.revelation)
    && Number.isInteger(v.pa)&&v.pa>=0&&v.pa<=5 && Number.isInteger(v.round)&&v.round>=1&&v.round<=100000
    && typeof v.stabilized==='boolean'&&typeof v.share==='boolean'&&Array.isArray(v.disabled)&&v.disabled.length<=300&&v.disabled.every((id:any)=>typeof id==='string'&&id.length<=150)
    && Array.isArray(v.contexts)&&v.contexts.length<=300&&v.contexts.every((id:any)=>typeof id==='string'&&id.length<=150)
    && Array.isArray(v.bonuses)&&v.bonuses.length<=100&&new Set(v.bonuses.map((b:any)=>b?.id)).size===v.bonuses.length
    && v.bonuses.every((b:any)=>b&&typeof b.id==='string'&&b.id.length>0&&b.id.length<=100&&typeof b.label==='string'&&b.label.trim().length>0&&b.label.length<=150
      && rules.skills.some(s=>s.id===b.skill)&&Number.isInteger(b.amount)&&Math.abs(b.amount)<=100&&typeof b.truth==='boolean'&&typeof b.enabled==='boolean');
}
/** Explicit projection from saved ranks; situational bonuses never change derived health. */
export function playProfile(data:any,state:PlayState){
  const ids=(v:any):string[]=>Array.isArray(v)?v.filter((x:any)=>typeof x==='string'):[];
  const n=(v:any)=>Number.isFinite(Number(v))?Number(v):0;
  const p=data.progression??{},creation=data.creation??{};
  const talents=[...new Set([data.talents?.origin,data.talents?.sphere,data.talents?.expertise,data.talents?.common,...ids(data.talents?.edge),...ids(p.realityTalents)].filter(Boolean))] as string[];
  const choices={...data.talentChoices,...p.realityTalentChoices};
  const sphere=rules.spheres[creation.sphere as keyof typeof rules.spheres];
  const permanent=(id:string)=>talents.reduce((sum,t)=>{const spec=(specs as Record<string,any>)[t];return sum+(spec?.permanent&&spec.kind==='skill'&&choices[t]===id?n(spec.bonus):0);},0);
  const nativeDoctrine=data.truth?.choices?.hunterTradition;
  const hunterMemory=data.truth?.nature==='humain'&&data.truth?.consciousness==='initie'&&((typeof nativeDoctrine==='string'&&nativeDoctrine!==''&&nativeDoctrine!=='aucune')||ids(data.truth?.choices?.hunterBuild?.doctrines).length>0);
  const attributeBonuses:Array<{id:string;label:string;amount:number;attribute:string;truth:boolean;enabled:boolean}>=hunterMemory?[{id:'hunter-memory',label:'Mémoire du Chasseur · Volonté permanente',attribute:'volonte',amount:1,truth:false,enabled:!state.disabled.includes('hunter-memory')}]:[];
  const choicesTruth=data.truth?.choices??{};
  const nature=data.truth?.nature;
  const table=({daemon:truthRevelationRules.daemonStats,angelus:truthRevelationRules.angelusStats,aseryn:truthRevelationRules.aserynStats,exile:truthRevelationRules.exileStats,extral:truthRevelationRules.extralStats} as Record<string,Record<string,{sr:string;r:string}>>)[nature];
  const key=({daemon:choicesTruth.divinity,angelus:choicesTruth.sephirah,aseryn:choicesTruth.origin,exile:choicesTruth.people,extral:choicesTruth.species} as Record<string,string>)[nature];
  // These are the canonical attribute tables, not arbitrary effect prose.
  const stage=state.revelation;
  const natureStats=stage==='v'?'':nature==='vampire'?(stage==='sr'?'+1 Vigueur · +1 Volonté':'+2 Vigueur · +1 Volonté'):nature==='mage'?(stage==='sr'?'+1 Esprit · +1 Volonté':'+1 Esprit · +2 Volonté'):table?.[key]?.[stage]??'';
  if(data.truth?.consciousness!=='profane')for(const token of natureStats.split(' · ')){
    const match=/^\+(\d+) (Vigueur|Agilité|Esprit|Volonté|Charisme)$/.exec(token);if(!match)continue;
    const attribute=rules.attributes.find(a=>a.name===match[2])!.id,id='nature-'+attribute;
    attributeBonuses.push({id,label:(stage==='sr'?'Nature Semi-révélée · ':'Nature Révélée · ')+match[2],attribute,amount:Number(match[1]),truth:true,enabled:true});
  }
  const attributes=rules.attributes.map(a=>({...a,value:n(data.attributes?.[a.id])+n(data.edgeAttributes?.[a.id])+n(p.attributeRanks?.[a.id])+attributeBonuses.filter(b=>b.attribute===a.id&&b.enabled&&(!b.truth||state.revelation!=='v')).reduce((sum,b)=>sum+b.amount,0)}));
  const raw=(id:string)=>((sphere?.fixedSkills as readonly string[]|undefined)?.includes(id)?1:0)+n(data.skills?.[id]?.style)+n(data.skills?.[id]?.free)+n(data.skills?.[id]?.edge)+n(p.skillRanks?.[id]);
  const attribute=(id:string)=>attributes.find(a=>a.id===id)?.value??0;
  const allTalents=[...Object.values(rules.talents.origin).flat(),...Object.values(rules.talents.sphere).flat(),...rules.talents.common,...rules.talents.expertise];
  const truthIds=new Set([...ids(data.truth?.truthTalents),...ids(p.truthTalents)]);
  const implants=new Set((Array.isArray(data.reality?.augmentations)?data.reality.augmentations:[]).filter((a:any)=>a.loaded!==false).map((a:any)=>a.itemId));
  const mechanics=[
    {id:'temps_de_reaction_surhumain',label:'Temps de réaction surhumain · +2 Initiative',pain:0},
    {id:'bloqueur_de_douleur_g1',label:'Bloqueur de douleur G1 · blessures : −2 niveaux de Stress',pain:2},
    {id:'bloqueur_de_douleur_g2',label:'Bloqueur de douleur G2 · blessures : −1 niveau de Stress',pain:1}
  ].filter(b=>implants.has(b.id)).map(b=>({...b,enabled:!state.disabled.includes(b.id)}));
  const skills=rules.skills.map(s=>{
    const automatic=talents.filter(t=>(skillMap as Record<string,string>)[t]===s.id).map(t=>({id:t,label:allTalents.find(x=>x.id===t)?.name??t,amount:1,enabled:!state.disabled.includes(t)}));
    const staticBonus=automatic.filter(b=>b.enabled).reduce((sum,b)=>sum+b.amount,0);
    const contexts=contextualSkillBonuses(talents,choices,specs,skillMap,s.id,raw(s.id)+permanent(s.id)+staticBonus).map(c=>({...c,enabled:state.contexts.includes(c.id)}));
    // Contexts are opt-in. Equivalent test bonuses take the best, not their sum.
    const contextual=Math.max(0,...contexts.filter(c=>c.enabled).map(c=>c.bonus));
    const extras=state.bonuses.filter(b=>b.skill===s.id&&b.enabled&&(!b.truth||state.revelation==='r'));
    const prepared=[
      ...augmentationPlayBonuses.filter(b=>implants.has(b.id)&&b.skills.includes(s.id)).map(b=>({...b,truth:false})),
      ...(data.truth?.nature==='extral'?extralPlayBonuses.map(b=>({...b,id:'extral-'+b.id})):data.truth?.nature==='exile'?exilePlayBonuses.filter(b=>b.id!=='exile-pas-leger'):[]).filter(b=>truthIds.has(b.id)&&b.skills.includes(s.id)).map(b=>({...b,truth:true}))
    ].map(b=>({...b,enabled:state.contexts.includes(b.id),active:state.contexts.includes(b.id)&&(!b.truth||state.revelation==='r')}));
    const preparedBonus=Math.max(0,...prepared.filter(b=>b.active).map(b=>b.bonus));
    const bonus=Math.max(staticBonus,contextual,preparedBonus)+extras.reduce((sum,b)=>sum+b.amount,0);
    const rank=raw(s.id)+permanent(s.id);
    return {...s,rank,attributeValue:attribute(s.attribute),automatic,contexts,prepared,extras,bonus,total:attribute(s.attribute)+rank+bonus};
  });
  const derived=characterDerivedStats(attribute,id=>raw(id)+permanent(id),ids(data.disadvantages));
  if(implants.has('temps_de_reaction_surhumain')&&!state.disabled.includes('temps_de_reaction_surhumain'))derived.initiative+=2;
  const recoveryMultiplier=data.truth?.nature==='extral'&&data.truth?.consciousness!=='profane'&&data.truth?.choices?.species==='homo_superior'&&truthIds.has('extral-cycle-de-reparation')?2:1;
  const hp=Math.min(state.hp??derived.pvMax,derived.pvMax);
  const painReduction=Math.max(talents.includes('insensibilite_a_la_douleur')?1:0,...mechanics.filter(b=>b.enabled).map(b=>b.pain));
  const stress=Math.max(state.stress,hp<=0?2:Math.max(0,injuryStress(hp,derived.pvMax,false)-painReduction)) as 0|1|2;
  const health=hp<=derived.death?'Mort':hp<=0?(state.stabilized?'Stabilisé':'Agonisant'):hp<=derived.pvMax*.25?'Gravement blessé':hp<=derived.pvMax*.5?'Blessé':hp<derived.pvMax?'Légèrement blessé':'Indemne';
  return {attributes,attributeBonuses,mechanics,skills,derived,hp,stress,health,pa:hp<=derived.death?0:hp<=0?Math.min(state.pa,1):state.pa,
    recovery:{normal:dailyRecovery(raw('constitution')+permanent('constitution'),false,talents.includes('sante_de_fer'))*recoveryMultiplier,prolonged:dailyRecovery(raw('constitution')+permanent('constitution'),true,talents.includes('sante_de_fer'))*recoveryMultiplier}};
}
export function rollD10(stress:0|1|2,draw:()=>number){
  const first=draw(),explodes=first===10||stress===1&&first===9;
  const dice=explodes?[first,draw()]:[first];
  return {dice,narrativeFailure:first<=stress+1,exploded:explodes,sum:dice.reduce((a,b)=>a+b,0)};
}
