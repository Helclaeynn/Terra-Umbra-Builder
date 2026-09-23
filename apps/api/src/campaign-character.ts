import {terraUmbraCreationRules as rules} from './rules/terra-umbra-creation.js';
import {terraUmbraTalentChoiceSpecs as choices,terraUmbraRealitySkillTalentMap as talentSkills} from './rules/terra-umbra-creation-lore.js';
import {getRealityRules} from './rules/reality.js';
import {realityEconomic} from './rules/economy-model.js';
export function campaignCharacterState(data:any){
 const style=rules.styles.find(s=>s.id===data.creation?.style);
 const reality=data.reality||{},progress=data.progression||{};
 const rows=(v:any)=>Array.isArray(v)?v.filter(x=>x&&typeof x==='object'):[];
 const base=progress.cashBase==null?Math.max(0,style?realityEconomic(getRealityRules(),{equipment:rows(reality.equipment),augmentations:rows(reality.augmentations)},style,data.edge||{}).account:0):Number(progress.cashBase);
 const money=base+rows(progress.cashTransactions).reduce((n,t)=>n+Number(t.amount||0),0);
 const sphere=rules.spheres[data.creation?.sphere as keyof typeof rules.spheres];
 const talents=[data.talents?.origin,data.talents?.sphere,data.talents?.expertise,data.talents?.common,...(data.talents?.edge||[])].filter(Boolean);
 const skill=(id:string)=>{
  const v=data.skills?.[id]||{};
  const bonus=talents.reduce((n:number,t:string)=>{
   const spec=(choices as Record<string,any>)[t];
   return n+((talentSkills as Record<string,string>)[t]===id?1:0)+(spec?.kind==='skill'&&spec.permanent&&data.talentChoices?.[t]===id?Number(spec.bonus||0):0);
  },0);
  return ((sphere?.fixedSkills as readonly string[]|undefined)?.includes(id)?1:0)+Number(v.style||0)+Number(v.free||0)+Number(v.edge||0)+bonus+Number(progress.skillRanks?.[id]||0)+(progress.realityTalents||[]).reduce((n:number,t:string)=>n+((talentSkills as Record<string,string>)[t]===id?1:0),0);
 };
 const integrity=Math.max(1,skill('force_mentale')+skill('humanite')-((data.disadvantages||[]).includes('integrite_defaillante')?2:0));
 const corruption=Number(data.truth?.corruption||0),source=String(data.truth?.corruptionSource||'');
 if(![base,money,integrity,corruption].every(Number.isFinite)||!Number.isInteger(corruption)||corruption<0||integrity<1)throw new Error('invalid_character_progression');
 return {base,money,integrity,corruption,source};
}
