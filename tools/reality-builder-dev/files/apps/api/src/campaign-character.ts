import {terraUmbraCreationRules as rules} from './rules/terra-umbra-creation.js';
import {terraUmbraTalentChoiceSpecs as choiceSpecs} from './rules/terra-umbra-creation-lore.js';
import {getRealityRules} from './rules/reality.js';
import {realityEconomic} from './rules/economy-model.js';

/** Use permanent scores, not bonuses to tests, for the campaign Integrity ceiling. */
export function campaignCharacterState(data:any){
  const style=rules.styles.find(s=>s.id===data.creation?.style);
  const reality=data.reality||{},progress=data.progression||{};
  const rows=(value:any)=>Array.isArray(value)?value.filter(x=>x&&typeof x==='object'):[];
  const ids=(value:any):string[]=>Array.isArray(value)?value.filter((x:any)=>typeof x==='string'):[];
  const base=progress.cashBase==null
    ?Math.max(0,style?realityEconomic(getRealityRules(),{equipment:rows(reality.equipment),augmentations:rows(reality.augmentations)},style,data.edge||{}).account:0)
    :Number(progress.cashBase);
  const money=base+rows(progress.cashTransactions).reduce((sum,row)=>sum+Number(row.amount||0),0);
  const sphere=rules.spheres[data.creation?.sphere as keyof typeof rules.spheres];
  const talents=[...new Set([
    ...ids([data.talents?.origin,data.talents?.sphere,data.talents?.expertise,data.talents?.common]),
    ...ids(data.talents?.edge),...ids(progress.realityTalents)
  ])];
  const selections={...(data.talentChoices||{}),...(progress.realityTalentChoices||{})};
  const permanentSkill=(id:string)=>{
    const value=data.skills?.[id]||{};
    const bonus=talents.reduce((sum,talentId)=>{
      const spec=(choiceSpecs as Record<string,any>)[talentId];
      return sum+(spec?.kind==='skill'&&spec.permanent&&selections[talentId]===id?Number(spec.bonus||0):0);
    },0);
    return ((sphere?.fixedSkills as readonly string[]|undefined)?.includes(id)?1:0)
      +Number(value.style||0)+Number(value.free||0)+Number(value.edge||0)
      +Number(progress.skillRanks?.[id]||0)+bonus;
  };
  const integrity=Math.max(1,permanentSkill('force_mentale')+permanentSkill('humanite')-((data.disadvantages||[]).includes('integrite_defaillante')?2:0));
  const corruption=Number(data.truth?.corruption||0),source=String(data.truth?.corruptionSource||'');
  if(![base,money,integrity,corruption].every(Number.isFinite)||!Number.isInteger(corruption)||corruption<0||integrity<1)throw new Error('invalid_character_progression');
  return {base,money,integrity,corruption,source};
}
