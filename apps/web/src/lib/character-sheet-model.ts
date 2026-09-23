import type { CharacterDataV2 } from "../types/character";
import type { CreationRules, CreationLore, DisadvantageCatalog, EdgeRules } from "./creation-types";
import type { TalentChoiceSpec } from "../components/builder/TalentSelector.vue";
import { characterDerivedStats, type CharacterSheet, type SheetEntry } from "./character-sheet";
import { ensureProgression, currentAttribute, currentSkillRaw, currentSkillFinal, campaignCash, xpRemaining, ptvRemaining } from "./progression";
import { ensureRealityState, realityEconomic, realityItemMap, realityLifestyleBase, lifestylePressure, type RealityRulesPackage } from "./reality";
import { truthCorruptionTalentActive, truthAvailableTalents, truthPermanentAttributeBonus, truthPtvSpent, type TruthRulesPackage, type TruthState } from "./truth";

export type SheetCore = {
  rules:CreationRules; lore:CreationLore; talentChoiceSpecs:Record<string,TalentChoiceSpec>;
  skillTalentMap:Record<string,string>; disadvantages:DisadvantageCatalog; edgeRules:EdgeRules;
};

/** Read-only projection shared by the Builder, progression and standalone sheet. */
export function buildCharacterSheet(data:CharacterDataV2, core:SheetCore, truth:TruthRulesPackage, reality:RealityRulesPackage, campaign=true, fallbackName=""):CharacterSheet {
  const creation=core.rules, raw=data.truth;
  const ids=(value:unknown):string[]=>Array.isArray(value)?value.filter((id):id is string=>typeof id==="string"):[];
  const state:TruthState={
    nature:typeof raw.nature==="string"?raw.nature:"humain",
    consciousness:typeof raw.consciousness==="string"?raw.consciousness:"profane",
    choices:raw.choices&&typeof raw.choices==="object"&&!Array.isArray(raw.choices)?raw.choices as Record<string,unknown>:{},
    truthTalents:ids(raw.truthTalents), truthEquipment:ids(raw.truthEquipment), corruptionTalents:ids(raw.corruptionTalents),
    truthEquipmentMjOverride:Boolean(raw.truthEquipmentMjOverride), corruptionMjAuthorized:Boolean(raw.corruptionMjAuthorized),
    corruption:Math.max(0,Math.trunc(Number(raw.corruption)||0)), corruptionSource:typeof raw.corruptionSource==="string"?raw.corruptionSource:""
  };
  const progress=ensureProgression({...data.progression},creation.skills.map(item=>item.id),creation.attributes.map(item=>item.id));
  const realityState=ensureRealityState({...data.reality});
  const sphere=creation.spheres[data.creation.sphere];
  const style=creation.styles.find(item=>item.id===data.creation.style);
  const creationIds=[data.talents.origin,data.talents.sphere,data.talents.expertise,data.talents.common,...data.talents.edge].filter(Boolean);
  const choiceValue=(id:string)=>typeof data.talentChoices[id]==="string"?data.talentChoices[id] as string:"";
  const talentById=(id:string)=>[...Object.values(creation.talents.origin).flat(),...Object.values(creation.talents.sphere).flat(),...creation.talents.expertise,...creation.talents.common].find(item=>item.id===id);
  const talentNarrative=(talent:ReturnType<typeof talentById>)=>talent?(talent.category==="origin"?core.lore.originTalent:talent.category==="sphere"?core.lore.sphereTalent:core.lore.talent)[talent.id]??"":"";
  const finalAttribute=(id:string)=>Number(data.attributes[id]||0)+Number(data.edgeAttributes[id]||0)+truthPermanentAttributeBonus(state,id);
  const skillRaw=(id:string)=>{
    const value=data.skills[id];
    return (sphere?.fixedSkills.includes(id)?1:0)+Number(value?.style||0)+Number(value?.free||0)+Number(value?.edge||0);
  };
  const skillFinal=(id:string)=>skillRaw(id)+creationIds.reduce((sum,tid)=>{
    const spec=core.talentChoiceSpecs[tid];
    return sum+(core.skillTalentMap[tid]===id?1:0)+(spec?.kind==="skill"&&spec.permanent&&choiceValue(tid)===id?Number(spec.bonus||0):0);
  },0);
  const skillBases=Object.fromEntries(creation.skills.map(item=>[item.id,skillRaw(item.id)]));
  const skillFinalBases=Object.fromEntries(creation.skills.map(item=>[item.id,skillFinal(item.id)]));
  const attributeBases=Object.fromEntries(creation.attributes.map(item=>[item.id,finalAttribute(item.id)]));
  const attribute=(id:string)=>campaign?currentAttribute(progress,attributeBases,id):finalAttribute(id);
  const rawSkill=(id:string)=>campaign?currentSkillRaw(progress,skillBases,id):skillRaw(id);
  const skill=(id:string)=>campaign?currentSkillFinal(progress,skillBases,skillFinalBases,core.skillTalentMap,id):skillFinal(id);
  const derived=characterDerivedStats(attribute,skill,data.disadvantages);
  const items=realityItemMap(reality);
  const economy=style?realityEconomic(reality,realityState,style,data.edge):null;
  const lifestyleBase=style?realityLifestyleBase(reality,style,data.edge,creationIds,data.disadvantages):"Standard";
  const pressure=lifestylePressure(reality,realityState,lifestyleBase);
  const renown=data.disadvantages.includes("inconnu")?0:creationIds.includes("renomme")||Number(data.edge.renownPack||0)>0?2:1;
  const cash=campaignCash(progress,Math.max(0,economy?.account||0));
  const edgeRemaining=core.edgeRules.base+data.disadvantages.length-["attributePack","skillPacks","talentPacks","cashPacks","lifestylePack","augmentationPacks","renownPack"].reduce((sum,key)=>sum+Number(data.edge[key]||0),0);
  const ptvReserve=truth.structure.ptvInitial-truthPtvSpent(truth,state);
  const allDisadvantages=[...(core.disadvantages.sphere[data.creation.sphere]??[]),...core.disadvantages.common,...core.disadvantages.attribute,...Object.values(core.disadvantages.sphere).flat()];
  const selectedDisadvantages=data.disadvantages.flatMap(id=>{const item=allDisadvantages.find(item=>item.id===id);return item?[item]:[];});
  const realityIds=[...new Set([...creationIds,...(campaign?progress.realityTalents:[])])];
  const truthState={...state,corruptionTalents:[...new Set([...state.corruptionTalents,...(campaign?progress.corruptionTalents:[])])],truthTalents:[...new Set([...state.truthTalents,...(campaign?progress.truthTalents:[])])]};
  const truthMap=new Map(Object.values(truth.catalogs).flat().map(item=>[item.id,item]));
  for(const item of truthAvailableTalents(truth,truthState))truthMap.set(item.id,item);
  const corruptionMap=new Map(truth.corruption.talents.map(item=>[item.id,item]));
  const truthCost=(id:string)=>Number(truthMap.get(id)?.cost??0);
  const toRealityTalent=(id:string):SheetEntry=>{
    const talent=talentById(id);
    const choice=choiceValue(id);
    return {id,name:talent?.name??id,compendiumId:talent?.compendiumId,detail:talent?.effect,lore:talentNarrative(talent),group:choice?`Choix : ${creation.skills.find(item=>item.id===choice)?.name??choice}`:undefined};
  };
  const inventory:SheetEntry[]=[];
  for(const purchase of [...(realityState?.equipment??[]),...(realityState?.augmentations??[])]){
    if(!campaign&&purchase.acquiredInCampaign)continue;
    const item=items.get(purchase.itemId);
    inventory.push({id:purchase.uid,name:item?.name??purchase.itemId,detail:item?.effect,compendiumId:item?.compendiumId,
      group:[purchase.kind==="augmentation"?"Augmentation":"Équipement",purchase.sphereSupport?"Appui de Sphère":"",purchase.loaded?"Chargé":""].filter(Boolean).join(" · ")});
  }
  for(const id of state.truthEquipment){
    const item=truth.equipment.find(item=>item.id===id);
    inventory.push({id:`truth-${id}`,name:item?.name??id,detail:item?.lore,compendiumId:item?.compendiumId,group:"Objet de Vérité"});
  }
  const strings=(value:unknown)=>Array.isArray(value)?value.filter((item):item is string=>typeof item==="string"&&Boolean(item.trim())):[];
  return {
    mode:campaign?"campaign":"creation",name:[data.identity.firstName.trim(),data.identity.name.trim()].filter(Boolean).join(" ")||fallbackName,identity:data.identity,
    origin:creation.origins[data.creation.origin]?.name??"",sphere:sphere?.name??"",style:style?.name??"",
    lifestyle:pressure?.effective??lifestyleBase,lifestyleBase:lifestyleBase,renown:renown,
    attributes:creation.attributes.map(item=>({...item,value:attribute(item.id),base:finalAttribute(item.id)})),
    skills:creation.skills.map(item=>({...item,value:skill(item.id),raw:rawSkill(item.id),bonus:skill(item.id)-rawSkill(item.id)})),
    derived,edge:edgeRemaining,
    xpRemaining:xpRemaining(progress,skillBases,attributeBases),
    ptvRemaining:campaign?ptvRemaining(progress,Math.max(0,ptvReserve),truthCost,id=>Number(corruptionMap.get(id)?.cost||0)):ptvReserve,
    account:economy?.account??0,cash:cash,
    realityTalents:realityIds.map(toRealityTalent),
    truthTalents:[...truthState.truthTalents.map(id=>({id,name:truthMap.get(id)?.name??id,detail:truthMap.get(id)?.effect,lore:truthMap.get(id)?.runtimeLore,compendiumId:truthMap.get(id)?.compendiumId})),
      ...truthState.corruptionTalents.map(id=>{
        const item=corruptionMap.get(id);
        const dormant=item?.kind==="DON"&&!truthCorruptionTalentActive(item,state,derived.integrity);
        return {id,name:item?.name??id,detail:item?.effect,compendiumId:item?.compendiumId,group:[item?.sourceName,dormant?"Dormant":""].filter(Boolean).join(" · ")};
      })],
    disadvantages:selectedDisadvantages.map(item=>({id:item.id,name:item.name,detail:item.effect,compendiumId:item.compendiumId})),inventory,
    truthNature:truth.structure.natures[state.nature]?.name??state.nature,truthConsciousness:truth.structure.consciousness.find(item=>item.id===state.consciousness)?.name??state.consciousness,corruption:state.corruption,
    corruptionSource:truth.corruption.sources.find(item=>item.id===state.corruptionSource)?.name??state.corruptionSource,
    languages:strings(data.social.languages),contacts:strings(data.social.contacts),reputation:String(data.social.reputation??""),renownMilieu:String(data.social.renownMilieu??"")
  };
}
