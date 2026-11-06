// État et règles du Builder de personnage, partagés par la page et ses étapes
// (components/builder/steps). Extrait tel quel de CharacterBuilderPage.vue.
import { inject, type InjectionKey } from "vue";
import { usePageTitle } from "./page-title";
import {truthUnavailableHunters} from "./truth";
import {vampireUnavailable,vampireNativeBlood} from "./vampire";
import {isKhinae,khinaeNativeBlood,khinaeUnavailable} from "./khinae";
import {truthBuildChoiceLabel,truthHasInnateBuildChoice} from "./truth-build-guidance";
import {exileOwnedItems,exileUsableTalents,normalizeExileBuild,normalizeBeneficiaryBenefits,type ExileBuild,type BeneficiaryBenefits as BeneficiaryState} from "./exile";
import {normalizeExtralBuild,extralOwnedItems,type ExtralBuild} from "./extral";
import {truthKnownTalents} from "./truth";
import {normalizeAngelusBuild,type AngelusBuild} from "./angelus";
import {normalizeDaemonBuild,type DaemonBuild} from "./daemon";
import {normalizeMageTechniques,type MageTechniques as MageTechniqueDefinitions} from "./mage";
import {appearanceGallery} from "../../../api/src/character-appearances";
import {permanentSkillBonus,pruneBenefits,uniqueTalents,renownScore as computeRenown} from "./reality-benefits";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from "vue-router";
import { builderDraftFingerprint, normalizeBuilderDraft, reconcileBuilderSave } from "./builder-draft";
import { compareTruthTalents } from "./catalog-order";
import { api, ApiError } from "./api";
import type { TalentChoiceOption, TalentChoiceSpec } from "../components/builder/TalentSelector.vue";
import type { PdfInput } from "./character-pdf-model";
import { characterDerivedStats, type CharacterSheet } from "./character-sheet";
import {
  augmentationAccess,
  augmentationCopyCount,
  augmentationLoad,
  augmentationMaxCopies,
  augmentationSupportSatisfied,
  ensureRealityState,
  neuroCapacity,
  priceSelectionValid,
  realityEconomic,
  realityItemMap,
  realityLifestyleBase,
  realityPriceSpec,
  lifestylePressure,
  syncRealityTalentBenefits,
  type RealityRulesPackage,
  type RealityState
} from "./reality";
import { campaignCash, ensureProgression, type ProgressionState } from "./progression";
import type { Character, CharacterDataV2 } from "../types/character";
import {
  ensureTruthRulesPackage,
  truthAvailableTalents,
  truthChoiceOptions,
  truthChoicesValid,
  truthCreationGroups,
  truthVoieStep,
  truthPrerequisiteSatisfied,
  truthPrerequisiteIssues,
  truthEquipmentAccess,
  truthPermanentAttributeBonus,
  truthPtvSpent,
  truthRevelationProfile,
  truthSanitizeChoices,
  truthSanitizeCorruptionTalents,
  truthSanitizeTalents,
  truthCorruptionPrerequisiteSatisfied,
  truthEquipmentInvalidIds,
  truthSelectedFreeTraits,
  type TruthChoice,
  type TruthRulesPackage,
  type TruthState,
  type TruthTalent
} from "./truth";
import type { CreationRules, CreationLore, DisadvantageOption, DisadvantageCatalog, EdgeRules, RuleTalent } from "./creation-types";
import { buildCharacterSheet } from "./character-sheet-model";

export type StepId="identity"|"origin"|"sphere"|"attributes"|"skills"|"talents"|"truth"|"truth-talents"|"disadvantages"|"edge"|"equipment"|"finish"|"progression"|"sheet";

export type KnowledgeRef={
  key:string;
  label:string;
  kind:string;
  category:string;
  articleId?:string;
  detail?:string;
  badges?:string[];
};

export function useCharacterBuilder(){

const route=useRoute();
const progressionMode=route.path.endsWith("/progression");
const character=ref<Character|null>(null);
const campaignRewardsLocked=computed(()=>Boolean(character.value?.campaignId));
const draft=ref<CharacterDataV2|null>(null);
const rules=shallowRef<CreationRules|null>(null);
const lore=shallowRef<CreationLore|null>(null);
const talentChoiceSpecs=ref<Record<string,TalentChoiceSpec>>({});
const skillTalentMap=ref<Record<string,string>>({});
const disadvantages=shallowRef<DisadvantageCatalog|null>(null);
const disadvantageLore=ref<Record<string,string>>({});
const edgeRules=shallowRef<EdgeRules|null>(null);
const truthRules=shallowRef<TruthRulesPackage|null>(null);
const realityRules=shallowRef<RealityRulesPackage|null>(null);
const disadvantageCategory=ref("common");
const disadvantagePick=ref("");
const truthSearch=ref("");
const skillGroupOpen=ref<Record<string,boolean>>({});
const loading=ref(true);
const supplementalLoading=ref(false);
const saving=ref(false);
const error=ref("");
const notice=ref("");
const baseline=ref("");
const activeStep=ref<StepId>(progressionMode?"progression":"identity");
const reviewedOptionalSteps=ref<StepId[]>([]);
const sheetReturnStep=ref<StepId>(progressionMode?"progression":"identity");
const knowledgeOpen=ref(false);
const stepNavigationOpen=ref(false);
const knowledgeTrigger=ref<HTMLButtonElement|null>(null);
const knowledgeDrawer=ref<HTMLElement|null>(null);
watch(knowledgeOpen,async(open)=>{
  await nextTick();
  if(open)knowledgeDrawer.value?.querySelector<HTMLButtonElement>("button")?.focus();
  else knowledgeTrigger.value?.focus();
});
const portraitInput=ref<HTMLInputElement|null>(null);
const displayPortrait=computed(()=>draft.value?appearanceGallery(draft.value.appearances,"reality",draft.value.identity).primary?.src??"":"");
const truthConsciousnessInput=ref<HTMLSelectElement|null>(null);

const sections:Array<[StepId,string,boolean]>=progressionMode
  ? [["progression","Progression",true]]
  : [
      ["identity","Identité",true],
      ["origin","Origine",true],
      ["sphere","Sphère & Style",true],
      ["attributes","Attributs",true],
      ["skills","Compétences",true],
      ["talents","Talents",true],
      ["truth","Nature & origines",true],
      ["truth-talents","Talents & équipement de Vérité",true],
      ["disadvantages","Désavantages",true],
      ["edge","Edge",true],
      ["equipment","Équipement",true],
      ["finish","Finalisation",true]
    ];

const activeStepIndex=computed(()=>sections.findIndex(([id])=>id===activeStep.value));
const previousBuilderStep=computed(()=>{
  for(let i=activeStepIndex.value-1;i>=0;i--){
    const [id,label,enabled]=sections[i];
    if(enabled)return {id,label};
  }
  return null;
});
const nextBuilderStep=computed(()=>{
  for(let i=activeStepIndex.value+1;i<sections.length;i++){
    const [id,label,enabled]=sections[i];
    if(enabled)return {id,label};
  }
  return null;
});
function goToBuilderStep(id:StepId){
  if(id!=="sheet")sheetReturnStep.value=id;
  activeStep.value=id;
  if(["truth","disadvantages","edge"].includes(id)&&!reviewedOptionalSteps.value.includes(id))reviewedOptionalSteps.value=[...reviewedOptionalSteps.value,id];
  stepNavigationOpen.value=false;
  requestAnimationFrame(()=>{
    const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelector<HTMLElement>(".builder-main")?.scrollIntoView({block:"start",behavior:reduceMotion?"auto":"smooth"});
  });
}

async function toggleCharacterSheet(){
  const opening=activeStep.value!=="sheet";
  goToBuilderStep(opening?"sheet":sheetReturnStep.value);
  await nextTick();
  const target=document.querySelector<HTMLElement>(opening?".character-sheet h2":".sheet-toggle");
  if(opening)target?.setAttribute("tabindex","-1");
  target?.focus({preventScroll:true});
}

const edgeOptionUi=[
  {key:"attributePack",label:"+2 Attributs"},
  {key:"skillPacks",label:"+4 Compétences"},
  {key:"talentPacks",label:"+1 Talent de Réalité"},
  {key:"cashPacks",label:"+5 000 $ Compte"},
  {key:"lifestylePack",label:"+1 Train de vie"},
  {key:"augmentationPacks",label:"+5 000 $ Aug. / Gen2"},
  {key:"renownPack",label:"+1 Renommée"}
] as const;

const dirty=computed(()=>{
  if(!draft.value)return false;
  return builderDraftFingerprint(draft.value)!==baseline.value;
});

const identityDisplayName=computed(()=>{
  if(!draft.value)return character.value?.name??"";
  const firstName=draft.value.identity.firstName.trim();
  const name=draft.value.identity.name.trim();
  return [firstName,name].filter(Boolean).join(" ")||character.value?.name||"";
});

const selectedSphere=computed(()=>{
  if(!draft.value||!rules.value)return null;
  return rules.value.spheres[draft.value.creation.sphere]??null;
});

const selectedStyle=computed(()=>{
  if(!draft.value||!rules.value)return null;
  return rules.value.styles.find((style)=>style.id===draft.value?.creation.style)??null;
});

const styleOptions=computed(()=>{
  if(!draft.value||!rules.value)return [];
  return rules.value.styles.filter((style)=>style.sphere===draft.value?.creation.sphere);
});

const originTalents=computed(()=>{
  if(!draft.value||!rules.value)return [];
  return rules.value.talents.origin[draft.value.creation.origin]??[];
});

const sphereTalents=computed(()=>{
  if(!draft.value||!rules.value)return [];
  return rules.value.talents.sphere[draft.value.creation.sphere]??[];
});

const expertiseTalents=computed(()=>{
  if(!selectedStyle.value||!rules.value)return [];
  return rules.value.talents.expertise.filter((talent)=>
    !!talent.attribute&&selectedStyle.value?.expertiseFamilies.includes(talent.attribute)
  );
});

const commonTalents=computed(()=>rules.value?.talents.common??[]);

const stylePointsUsed=computed(()=>{
  if(!draft.value)return 0;
  return Object.values(draft.value.skills).reduce((sum,skill)=>sum+Number(skill.style||0),0);
});

const freeSkillPointsUsed=computed(()=>{
  if(!draft.value)return 0;
  return Object.values(draft.value.skills).reduce((sum,skill)=>sum+Number(skill.free||0),0);
});

const freeSkillBudget=computed(()=>rules.value?.creation.skills.freePoints??0);

function skillFreePointsForAttribute(attributeId:string){
  if(!draft.value||!rules.value)return 0;
  return rules.value.skills
    .filter(skill=>skill.attribute===attributeId)
    .reduce((sum,skill)=>sum+Number(draft.value?.skills[skill.id]?.free||0),0);
}
function skillGroupIsOpen(attributeId:string,index:number){
  if(Object.prototype.hasOwnProperty.call(skillGroupOpen.value,attributeId)){
    return !!skillGroupOpen.value[attributeId];
  }
  return index===0||skillFreePointsForAttribute(attributeId)>0;
}
function setSkillGroupOpen(attributeId:string,event:Event){
  skillGroupOpen.value={...skillGroupOpen.value,[attributeId]:(event.currentTarget as HTMLDetailsElement).open};
}

const edgeSkillPointsUsed=computed(()=>{
  if(!draft.value)return 0;
  return Object.values(draft.value.skills).reduce((sum,skill)=>sum+Number(skill.edge||0),0);
});

const edgeSkillBudget=computed(()=>{
  if(!draft.value||!rules.value)return 0;
  return Number(draft.value.edge.skillPacks||0)*rules.value.creation.skills.edgePackPoints;
});

const attributeTotal=computed(()=>{
  if(!draft.value||!rules.value)return 0;
  return rules.value.attributes.reduce((sum,attribute)=>sum+Number(draft.value?.attributes[attribute.id]??0),0);
});

const attributeBudget=computed(()=>rules.value?.creation.attributes.baseTotal??0);

const edgeAttributePointsUsed=computed(()=>{
  if(!draft.value)return 0;
  return Object.values(draft.value.edgeAttributes).reduce((sum,value)=>sum+Number(value||0),0);
});

const edgeAttributeBudget=computed(()=>{
  if(!draft.value||!rules.value)return 0;
  return Number(draft.value.edge.attributePack||0)*rules.value.creation.attributes.edgePackPoints;
});

const disadvantageCategories=computed(()=>{
  const rows=[{id:"common",name:"Communs"}];
  if(draft.value?.creation.sphere)rows.push({id:"sphere",name:`Sphère — ${selectedSphere.value?.name||"actuelle"}`});
  for(const attribute of rules.value?.attributes??[]){
    rows.push({id:`attr:${attribute.id}`,name:`Faiblesse ${/^[aeiouyàâéèêëîïôöûüh]/i.test(attribute.name)?"d’":"de "}${attribute.name}`});
  }
  return rows;
});

const visibleDisadvantages=computed(()=>{
  if(!disadvantages.value||!draft.value)return [];
  if(disadvantageCategory.value.startsWith("attr:")){
    const attributeId=disadvantageCategory.value.slice(5);
    return [...disadvantages.value.attribute]
      .filter(item=>item.attribute===attributeId)
      .sort((a,b)=>a.name.localeCompare(b.name,"fr"));
  }
  if(disadvantageCategory.value==="sphere"){
    return [...(disadvantages.value.sphere[draft.value.creation.sphere]??[])]
      .sort((a,b)=>a.name.localeCompare(b.name,"fr"));
  }
  return [...disadvantages.value.common].sort((a,b)=>a.name.localeCompare(b.name,"fr"));
});

const availableDisadvantages=computed(()=>{
  const selected=new Set(draft.value?.disadvantages??[]);
  const families=new Set([...selected].map(id=>disadvantageById(id)).filter((item):item is DisadvantageOption=>!!item).map(disadvantageFamily));
  return visibleDisadvantages.value.filter(item=>!selected.has(item.id)&&!families.has(disadvantageFamily(item)));
});
function disadvantageFamily(item:DisadvantageOption){return item.category==='attribute'?`attribute:${item.attribute}`:item.category;}
const selectedDisadvantageInFamily=computed(()=>{
  const family=visibleDisadvantages.value[0];
  if(!family)return null;
  return selectedDisadvantageItems().find(item=>disadvantageFamily(item)===disadvantageFamily(family))??null;
});

const disadvantagePreview=computed(()=>
  disadvantagePick.value ? disadvantageById(disadvantagePick.value) : null
);

const edgeTotal=computed(()=>{
  if(!draft.value||!edgeRules.value)return 0;
  return edgeRules.value.base+draft.value.disadvantages.length;
});

const edgePurchaseKeys=["attributePack","skillPacks","talentPacks","cashPacks","lifestylePack","augmentationPacks","renownPack"] as const;
function edgePurchaseCost(_key:string){
  // Toutes les options Edge canoniques coûtent actuellement 1 Edge.
  // Garder le coût explicite évite les erreurs de frontière quand il reste exactement 1 point.
  return 1;
}
const edgeSpent=computed(()=>{
  if(!draft.value)return 0;
  return edgePurchaseKeys.reduce((sum,key)=>sum+Number(draft.value?.edge[key]||0)*edgePurchaseCost(key),0);
});

const edgeRemaining=computed(()=>edgeTotal.value-edgeSpent.value);

const hasUnknownDisadvantage=computed(()=>draft.value?.disadvantages.includes("inconnu")??false);
const hasRenownedTalent=computed(()=>selectedRealityTalentIds().includes("renomme"));
const hasRenownContactTalent=computed(()=>selectedRealityTalentIds().includes("contact_de_renom"));

const currentTruthState=computed<TruthState|null>(()=>{
  if(!draft.value)return null;
  const raw=draft.value.truth;
  const choices=raw.choices&&typeof raw.choices==="object"&&!Array.isArray(raw.choices)
    ? raw.choices as Record<string,unknown>
    : {};
  return {
    mode:progressionMode?"progression":"creation",
    exileInventory:exileOwnedItems(draft.value.reality,progressionMode||campaignRewardsLocked.value,[...(realityRules.value?.equipment??[]),...(realityRules.value?.augmentations??[])]),
    extralInventory:extralOwnedItems(draft.value.reality,progressionMode||campaignRewardsLocked.value,[...(realityRules.value?.equipment??[]),...(realityRules.value?.augmentations??[])]),
    nature:typeof raw.nature==="string"?raw.nature:"humain",
    consciousness:typeof raw.consciousness==="string"?raw.consciousness:"profane",
    choices,
    truthTalents:Array.isArray(raw.truthTalents)
      ? raw.truthTalents.filter((id):id is string=>typeof id==="string")
      : [],
    truthEquipment:Array.isArray(raw.truthEquipment)
      ? raw.truthEquipment.filter((id):id is string=>typeof id==="string")
      : [],
    truthEquipmentMjOverride:Boolean(raw.truthEquipmentMjOverride),
    corruptionMjAuthorized:Boolean(raw.corruptionMjAuthorized),
    corruption:Math.max(0,Math.trunc(Number(raw.corruption)||0)),
    corruptionSource:typeof raw.corruptionSource==="string"?raw.corruptionSource:"",
    corruptionTalents:Array.isArray(raw.corruptionTalents)
      ? raw.corruptionTalents.filter((id):id is string=>typeof id==="string")
      : []
  };
});

const exileActiveIds=computed(()=>truthRules.value&&currentTruthState.value?[...exileUsableTalents(truthRules.value,currentTruthState.value)]:[]);

const selectedTruthNature=computed(()=>{
  if(!truthRules.value||!currentTruthState.value)return null;
  return truthRules.value.structure.natures[currentTruthState.value.nature]??null;
});

const availableTruthTalents=computed(()=>{
  if(!truthRules.value||!currentTruthState.value)return [];
  return truthAvailableTalents(truthRules.value,currentTruthState.value);
});

const selectedTruthFreeTraits=computed(()=>{
  if(!truthRules.value||!currentTruthState.value)return [];
  return truthSelectedFreeTraits(truthRules.value,currentTruthState.value);
});

const truthRevealProfile=computed(()=>{
  if(!truthRules.value||!currentTruthState.value)return null;
  return truthRevelationProfile(truthRules.value,currentTruthState.value);
});

const truthPtvSpentValue=computed(()=>{
  if(!truthRules.value||!currentTruthState.value)return 0;
  return truthPtvSpent(truthRules.value,currentTruthState.value);
});

const truthPtvRemaining=computed(()=>
  (truthRules.value?.structure.ptvInitial??0)-truthPtvSpentValue.value
);

const creationTruthChoices=computed(()=>(selectedTruthNature.value?.choices??[]).filter(c=>c.key!=='hunterTradition'||currentTruthState.value?.nature==='humain'));
const truthGroupOptions=computed(()=>truthCreationGroups(availableTruthTalents.value).map(group=>({...group,items:[...group.items].sort(compareTruthTalents)})));
const selectedTruthTalents=computed(()=>{const state=currentTruthState.value;return state&&truthRules.value?truthKnownTalents(truthRules.value,state).filter(t=>state.truthTalents.includes(t.id)):[];});
const visibleTruthGroups=computed(()=>{
  const groups=truthGroupOptions.value
    .map(group=>({...group,items:group.items.filter(talent=>!truthTalentSelected(talent.id))}));
  const query=truthSearch.value.trim().toLocaleLowerCase("fr");
  if(!query)return groups;
  return groups
    .map(group=>({
      ...group,
      items:group.items.filter(talent=>
        [talent.name,talent.group,talent.effect,talent.effectDetails,talent.runtimeLore,talent.prerequisiteName]
          .some(value=>String(value||"").toLocaleLowerCase("fr").includes(query))
      )
    }))
    .filter(group=>group.items.length);
});

const edgeTalentGroups=computed(()=>{
  if(!rules.value||!draft.value)return [];
  const usedFree=new Set([
    draft.value.talents.origin,
    draft.value.talents.sphere,
    draft.value.talents.expertise,
    draft.value.talents.common
  ].filter(Boolean));
  const currentOrigin=rules.value.talents.origin[draft.value.creation.origin]??[];
  const currentSphere=rules.value.talents.sphere[draft.value.creation.sphere]??[];
  return [
    {label:"Origine",items:currentOrigin.filter(t=>!usedFree.has(t.id))},
    {label:"Sphère",items:currentSphere.filter(t=>!usedFree.has(t.id))},
    {label:"Expertises",items:rules.value.talents.expertise.filter(t=>!usedFree.has(t.id))},
    {label:"Communs",items:rules.value.talents.common.filter(t=>!usedFree.has(t.id))}
  ];
});

function humanError(code:string){
  if(code==='campaign_rewards_managed_by_gm')return 'Le MJ gère les récompenses de cette copie de campagne. Les XP, PTV, gains d’argent, la Corruption et l’historique monétaire ne peuvent pas être modifiés ici. Utilisez les achats, ventes et prêts de Progression pour le matériel ; votre brouillon est conservé.';
  const labels:Record<string,string>={
    authentication_required:"Ta session a expiré. Reviens à l’accueil pour te reconnecter.",
    character_not_found:"Ce personnage n’existe plus ou ne t’appartient pas.",
    character_version_conflict:"Cette fiche a été enregistrée ailleurs (autre onglet ou appareil). Recharge-la : tes modifications sont gardées et te seront proposées.",
    invalid_character_data:"Les données de cette fiche ne sont pas valides.",
    truth_voie_order:"Un talent de Vérité ne respecte pas l’ordre de sa voie (paliers ou portes). Regarde l’avertissement affiché sous le talent.",
    creation_budget_exceeded:"Cette fiche dépasse un budget de création (points, Edge, PTV ou Compte). Rien n’a été enregistré ; corrige l’étape signalée en rouge puis enregistre de nouveau.",
    character_update_failed:"La sauvegarde a échoué."
  };
  return labels[code]??"Une erreur est survenue.";
}

function skillName(id:string){
  return rules.value?.skills.find((skill)=>skill.id===id)?.name??id;
}

function attributeName(id:string){
  return rules.value?.attributes.find((attribute)=>attribute.id===id)?.name??id;
}

function talentById(id:string):RuleTalent|null{
  if(!id||!rules.value)return null;
  for(const pool of Object.values(rules.value.talents.origin)){
    const found=pool.find((talent)=>talent.id===id);
    if(found)return found;
  }
  for(const pool of Object.values(rules.value.talents.sphere)){
    const found=pool.find((talent)=>talent.id===id);
    if(found)return found;
  }
  return rules.value.talents.expertise.find((talent)=>talent.id===id)
    ??rules.value.talents.common.find((talent)=>talent.id===id)
    ??null;
}

function talentNarrative(talent:RuleTalent|null){
  if(!talent||!lore.value)return "";
  if(talent.category==="origin")return lore.value.originTalent[talent.id]??"";
  if(talent.category==="sphere")return lore.value.sphereTalent[talent.id]??"";
  return lore.value.talent[talent.id]??"";
}

function talentChoiceSpec(id:string){
  return id?talentChoiceSpecs.value[id]??null:null;
}

function talentChoiceValue(id:string){
  if(!draft.value||!id)return "";
  const value=draft.value.talentChoices[id];
  return typeof value==="string"?value:"";
}

function setTalentChoice(id:string,value:string){
  if(!draft.value||!id)return;
  draft.value.talentChoices[id]=value;
}

function talentChoiceOptions(spec:TalentChoiceSpec|null):TalentChoiceOption[]{
  if(!spec||!rules.value)return [];
  if(spec.kind==="enum")return [...(spec.options??[])];
  if(spec.kind!=="skill")return [];
  const allowed=spec.skills
    ? new Set(spec.skills)
    : new Set(
        rules.value.skills
          .filter((skill)=>!spec.skillAttribute||skill.attribute===spec.skillAttribute)
          .map((skill)=>skill.id)
      );
  return rules.value.skills
    .filter((skill)=>allowed.has(skill.id)&&(!spec.styleSkills||selectedStyle.value?.skills.includes(skill.id)))
    .map((skill)=>({id:skill.id,name:skill.name}));
}

function talentChoiceValid(id:string){
  const spec=talentChoiceSpec(id);
  if(!spec)return true;
  const value=talentChoiceValue(id);
  return spec.kind==="text"?value.trim().length>0:talentChoiceOptions(spec).some(option=>option.id===value);
}

function setTalent(slot:"origin"|"sphere"|"expertise"|"common",id:string){
  if(!draft.value)return;
  draft.value.talents[slot]=id;
}

function selectedRealityTalentIds(){
  if(!draft.value)return [];
  return [
    draft.value.talents.origin,
    draft.value.talents.sphere,
    draft.value.talents.expertise,
    draft.value.talents.common,
    ...(draft.value.talents.edge||[])
  ].filter(Boolean);
}

function skillTalentBonus(id:string){
  if(!draft.value)return 0;
  let total=0;
  for(const talentId of selectedRealityTalentIds()){
    if(skillTalentMap.value[talentId]===id)total+=1;
    const spec=talentChoiceSpec(talentId);
    if(spec?.kind==="skill"&&spec.permanent&&talentChoiceValue(talentId)===id){
      total+=Number(spec.bonus||0);
    }
  }
  return total;
}

function skillFinal(id:string){
  return skillRaw(id)+skillTalentBonus(id);
}

function disadvantageNarrative(item:DisadvantageOption){
  const keyed=item.sphere?`${item.sphere}:${item.id}`:"";
  return (keyed&&disadvantageLore.value[keyed])||disadvantageLore.value[item.id]||
    `Ce Désavantage doit réellement pouvoir compliquer la vie du personnage en jeu.`;
}

function disadvantageById(id:string):DisadvantageOption|null{
  if(!disadvantages.value)return null;
  const sphereId=draft.value?.creation.sphere??"";
  return disadvantages.value.sphere[sphereId]?.find(item=>item.id===id)
    ??disadvantages.value.common.find(item=>item.id===id)
    ??disadvantages.value.attribute.find(item=>item.id===id)
    ??Object.values(disadvantages.value.sphere).flat().find(item=>item.id===id)
    ??null;
}

function disadvantagesCompatible(){
  if(!draft.value)return true;
  const selected=new Set(draft.value.disadvantages);
  const families=draft.value.disadvantages.map(disadvantageById).filter((item):item is DisadvantageOption=>!!item).map(disadvantageFamily);
  if(new Set(families).size!==families.length)return false;
  if(selected.has("sensible_a_la_chaleur")&&selectedRealityTalentIds().includes("resistance_a_la_chaleur"))return false;
  if(selected.has("sensible_au_froid")&&selectedRealityTalentIds().includes("resistance_au_froid"))return false;
  if(selected.has("lache")&&selectedRealityTalentIds().includes("brave"))return false;
  if(selected.has("unsinkable")&&selectedRealityTalentIds().includes("neurodriver"))return false;
  return true;
}

function edgeTalentValid(){
  if(!draft.value)return false;
  const count=Number(draft.value.edge.talentPacks||0);
  if(draft.value.talents.edge.length!==count)return false;
  const chosen=draft.value.talents.edge.filter(Boolean);
  if(chosen.length!==count||new Set(chosen).size!==chosen.length)return false;
  const accessible=new Set(edgeTalentGroups.value.flatMap(group=>group.items.map(talent=>talent.id)));
  return chosen.every(id=>accessible.has(id)&&talentChoiceValid(id));
}

function edgePurchaseDisabled(key:string){
  if(!draft.value)return true;
  if(key==="renownPack")return hasUnknownDisadvantage.value||hasRenownedTalent.value;
  return false;
}

function edgePurchasePlusDisabled(key:string){
  if(!draft.value||!edgeRules.value)return true;
  const current=Number(draft.value.edge[key]||0);
  const rule=edgeRules.value.options[key];
  return !rule||current>=rule.max||edgeRemaining.value<edgePurchaseCost(key)||edgePurchaseDisabled(key);
}
function edgePurchaseMinusDisabled(key:string){
  if(!draft.value||!edgeRules.value)return true;
  const current=Number(draft.value.edge[key]||0);
  if(current<=0)return true;
  const next=current-1;
  const rule=edgeRules.value.options[key];
  if(!rule)return true;
  if(key==="attributePack"&&edgeAttributePointsUsed.value>Math.max(0,next)*Number(rule.points||0))return true;
  if(key==="skillPacks"&&edgeSkillPointsUsed.value>Math.max(0,next)*Number(rule.points||0))return true;
  if(key==="talentPacks"&&draft.value.talents.edge.slice(Math.max(0,next)).some(Boolean))return true;
  return false;
}
function edgeOptionResult(key:string){
  if(!draft.value)return "";
  if(key==="attributePack")return Number(draft.value.edge.attributePack||0)>0
    ? `${edgeAttributePointsUsed.value}/${edgeAttributeBudget.value} points attribués`
    : "";
  if(key==="skillPacks")return Number(draft.value.edge.skillPacks||0)>0
    ? `${edgeSkillPointsUsed.value}/${edgeSkillBudget.value} points attribués`
    : "";
  if(key==="talentPacks")return Number(draft.value.edge.talentPacks||0)>0
    ? `${draft.value.talents.edge.filter(Boolean).length}/${draft.value.edge.talentPacks} Talent(s) choisi(s)`
    : "";
  if(key==="cashPacks")return selectedStyle.value
    ? `Compte actuel : ${formatMoney(Math.max(0,realityEconomyValue.value?.account??selectedStyle.value.account))}`
    : "";
  if(key==="lifestylePack")return selectedStyle.value
    ? `Train de vie actuel : ${lifestylePressureValue.value?.effective||lifestyleBaseValue.value}`
    : "";
  if(key==="augmentationPacks"&&selectedStyle.value){
    const extra=Number(draft.value.edge.augmentationPacks||0)*5000;
    const windows=selectedStyle.value.gen2SlotsBase+Number(draft.value.edge.augmentationPacks||0)*Number(edgeRules.value?.options.augmentationPacks?.gen2Windows||0);
    return `Enveloppe : ${formatMoney(selectedStyle.value.augmentationEnvelope+extra)} · ${windows} fenêtre(s) Gen2`;
  }
  if(key==="renownPack")return `Renommée actuelle : ${renownScore.value}`;
  return "";
}
function edgeSkillPointsForAttribute(attributeId:string){
  if(!draft.value||!rules.value)return 0;
  return rules.value.skills
    .filter(skill=>skill.attribute===attributeId)
    .reduce((sum,skill)=>sum+Number(draft.value?.skills[skill.id]?.edge||0),0);
}

function edgeSkillsForAttribute(attributeId:string){
  if(!draft.value||!rules.value)return [];
  return rules.value.skills.filter(skill=>
    skill.attribute===attributeId&&
    (Number(draft.value?.skills[skill.id]?.edge||0)>0||skillRaw(skill.id)<5)
  );
}

function selectedDisadvantageItems(){
  if(!draft.value)return [];
  return draft.value.disadvantages
    .map(disadvantageById)
    .filter((item):item is DisadvantageOption=>!!item);
}

function finalAttribute(id:string){
  if(!draft.value)return 0;
  const truthBonus=currentTruthState.value
    ? truthPermanentAttributeBonus(currentTruthState.value,id)
    : 0;
  return Number(draft.value.attributes[id]||0)+Number(draft.value.edgeAttributes[id]||0)+truthBonus;
}

function skillPermanent(id:string){return skillRaw(id)+permanentSkillBonus(selectedRealityTalentIds(),draft.value?.talentChoices??{},talentChoiceSpecs.value,id);}
function ownedRealityTalentIds(){const learned=draft.value?.progression.realityTalents;return uniqueTalents(selectedRealityTalentIds(),Array.isArray(learned)?learned.filter((id):id is string=>typeof id==='string'):[]);}
const derivedStats=computed(()=>characterDerivedStats(finalAttribute,skillPermanent,draft.value?.disadvantages??[],skillFinal));

const realityState=computed<RealityState|null>(()=>
  draft.value ? draft.value.reality as unknown as RealityState : null
);
watch([realityRules,()=>draft.value?.reality,()=>ownedRealityTalentIds().join("|"),()=>draft.value?.creation.sphere],()=>{
  if(realityRules.value&&realityState.value){syncRealityTalentBenefits(realityRules.value,realityState.value,ownedRealityTalentIds(),selectedRealityTalentIds());pruneBenefits(realityState.value,ownedRealityTalentIds(),draft.value?.creation.sphere??'');}
});
const realityItems=computed(()=>realityRules.value?realityItemMap(realityRules.value):new Map());
const realityEconomyValue=computed(()=>
  realityRules.value&&realityState.value&&selectedStyle.value
    ? realityEconomic(realityRules.value,realityState.value,selectedStyle.value,draft.value?.edge??{})
    : null
);
const lifestyleBaseValue=computed(()=>
  realityRules.value&&selectedStyle.value&&draft.value
    ? realityLifestyleBase(
        realityRules.value,
        selectedStyle.value,
        draft.value.edge,
        selectedRealityTalentIds(),
        draft.value.disadvantages
      )
    : "Standard"
);
const lifestylePressureValue=computed(()=>
  realityRules.value&&realityState.value
    ? lifestylePressure(realityRules.value,realityState.value,lifestyleBaseValue.value)
    : null
);
const augmentationLoadValue=computed(()=>
  realityRules.value&&realityState.value
    ? augmentationLoad(realityRules.value,realityState.value,selectedRealityTalentIds(),exileActiveIds.value)
    : {charge:0,stress:0,rawStress:0}
);
const requiredLanguageCount=computed(()=>Math.max(1,1+skillRaw("langages_argot")));

function socialLanguages(){
  if(!draft.value)return [];
  const values=Array.isArray(draft.value.social.languages)
    ? draft.value.social.languages.filter((value):value is string=>typeof value==="string")
    : [];
  return values;
}
// A published NPC, or one proposed from the Builder and not refused: the
// player can finish the sheet while the admins validate it.
function selectedNpcContact(value:unknown){
  if(!value||typeof value!=="object"||Array.isArray(value))return false;
  const contact=value as Record<string,unknown>;
  if(typeof contact.articleId==="string"&&contact.articleId.trim().length>0)return true;
  return typeof contact.proposalId==="string"&&contact.proposalId.length>0&&contact.status!=="rejected";
}
const socialValidation=computed(()=>{
  if(!draft.value)return {languages:false,crawler:false,renownContact:false,minorContacts:false,corporatiste:false};
  const languages=socialLanguages();
  const languageOk=languages.length===requiredLanguageCount.value&&languages.every(value=>value.trim().length>0);
  const crawler=draft.value.creation.sphere!=="crawler"||selectedNpcContact(draft.value.social.crawlerContact);
  const renownContact=!hasRenownContactTalent.value||selectedNpcContact(draft.value.social.renownContact);
  const minorContactIds=['reseau_scolaire','famille_de_fonctionnaires','vieilles_frequentations','communaute_dorigine','on_connait_quelquun'];
  const minorContacts=minorContactIds.every(id=>!selectedRealityTalentIds().includes(id)||selectedNpcContact((draft.value?.social.talentContacts as Record<string,unknown>|undefined)?.[id]));
  const supportType=String(draft.value.reality.sphereSupportType??"");
  const supportItem=String(draft.value.reality.sphereSupportItemId??"");
  const corporatiste=draft.value.creation.sphere!=="corporatiste"||
    (["housing","vehicle"].includes(supportType)&&supportItem.length>0);
  return {languages:languageOk,crawler,renownContact,minorContacts,corporatiste};
});

const equipmentValidation=computed(()=>{
  if(!draft.value||!realityRules.value||!selectedStyle.value||!realityState.value)return false;
  const pkg=realityRules.value;
  const state=realityState.value;
  const itemMap=realityItems.value;
  const eco=realityEconomyValue.value;
  if(!eco||eco.account<0)return false;

  for(const purchase of state.augmentations){
    const item=itemMap.get(purchase.itemId);
    if(!item)return false;
    if(
      realityPriceSpec(item).configurable&&
      (!purchase.priceConfirmed||!priceSelectionValid(item,Number.isFinite(Number(purchase.cataloguePrice??purchase.selectedPrice))?Number(purchase.cataloguePrice??purchase.selectedPrice):null))
    ) return false;
    if(!purchase.sphereSupport&&(purchase.cataloguePrice??purchase.selectedPrice??item.price??0)>pkg.economy.advancedPurchaseThreshold&&!state.mjAdvancedOverride)return false;
    if(!augmentationSupportSatisfied(pkg,state,item))return false;
    if(augmentationCopyCount(pkg,state,item)>augmentationMaxCopies(item))return false;
    const access=augmentationAccess(pkg,selectedStyle.value,item,draft.value.edge,state.mjAccessOverride);
    if(!access.ok)return false;
    if(!state.mjAccessOverride&&item.generation===2&&!access.systems.includes(Number(purchase.gen2System)))return false;
  }

  for(const purchase of state.equipment){
    const item=itemMap.get(purchase.itemId);
    if(!item)return false;
    if(
      realityPriceSpec(item).configurable&&
      (!purchase.priceConfirmed||!priceSelectionValid(item,Number.isFinite(Number(purchase.cataloguePrice??purchase.selectedPrice))?Number(purchase.cataloguePrice??purchase.selectedPrice):null))
    ) return false;
    if(!purchase.sphereSupport&&(purchase.cataloguePrice??purchase.selectedPrice??item.price??0)>pkg.economy.advancedPurchaseThreshold&&!state.mjAdvancedOverride)return false;
    if(item.neuro&&draft.value.disadvantages.includes("unsinkable"))return false;
  }

  const loadedNeuro=state.equipment.filter(p=>itemMap.get(p.itemId)?.neuro&&p.loaded).length;
  if(loadedNeuro>neuroCapacity(skillRaw("neurodive"),selectedRealityTalentIds(),draft.value.disadvantages))return false;
  if(draft.value.creation.sphere==="corporatiste"){
    if(!["housing","vehicle"].includes(state.sphereSupportType)||!state.sphereSupportItemId)return false;
    if(state.sphereSupportType==="housing"){
      if(!state.fixedChargeItems.some(charge=>charge.sphereSupport&&charge.sourceItemId===state.sphereSupportItemId&&charge.monthly===0))return false;
    }else if(!state.equipment.some(purchase=>purchase.sphereSupport&&purchase.itemId===state.sphereSupportItemId&&Number(purchase.selectedPrice)===0)){
      return false;
    }
  }
  const load=augmentationLoadValue.value;
  return load.charge<=derivedStats.value.integrity&&load.stress<=derivedStats.value.augmentStressMax;
});

function formatMoney(value:number){
  return new Intl.NumberFormat("fr-FR").format(value)+" $";
}

const validationReasons:Partial<Record<StepId,string>>={
  identity:"Nom et âge requis.",
  origin:"Origine, Talent d’Origine et choix secondaire éventuel requis.",
  sphere:"Sphère, Style et 5 points guidés requis.",
  attributes:"Budget d’Attributs à terminer.",
  skills:"Répartition des Compétences à terminer.",
  talents:"Choix de Talents ou prérequis à corriger.",
  truth:"Choix de Nature incomplets.",
  "truth-talents":"Talents, équipement de Vérité ou PTV à corriger.",
  disadvantages:"Désavantages incompatibles ou trop nombreux.",
  edge:"Dépenses ou allocations Edge à corriger.",
  equipment:"Budget, accès, Charge, Stress, Gen2 ou Neuroprogrammes à corriger."
};

const creationStepIds:StepId[]=[
  "identity","origin","sphere","attributes","skills","talents","truth","truth-talents","disadvantages","edge","equipment"
];

const creationValidationMap=computed<Record<string,boolean>>(()=>{
  if(!draft.value||!rules.value)return {};
  const result:Record<string,boolean>={};

  result.identity=!!draft.value.identity.name.trim()&&!!draft.value.identity.age.trim();
  result.origin=!!draft.value.creation.origin&&!!draft.value.talents.origin&&talentChoiceValid(draft.value.talents.origin);
  result.sphere=!!draft.value.creation.sphere&&!!draft.value.creation.style&&stylePointsUsed.value===rules.value.creation.skills.stylePoints;

  const bounds=rules.value.creation.attributes;
  result.attributes=attributeTotal.value===attributeBudget.value&&rules.value.attributes.every(attribute=>{
    const value=Number(draft.value?.attributes[attribute.id]??0);
    return value>=bounds.min&&value<=bounds.max;
  });

  const skillMax=rules.value.creation.skills.rawMax;
  result.skills=!!selectedStyle.value&&
    stylePointsUsed.value===rules.value.creation.skills.stylePoints&&
    freeSkillPointsUsed.value===freeSkillBudget.value&&
    rules.value.skills.every(skill=>skillRaw(skill.id)<=skillMax);

  const selected=[
    draft.value.talents.origin,
    draft.value.talents.sphere,
    draft.value.talents.expertise,
    draft.value.talents.common
  ];
  const expertise=talentById(draft.value.talents.expertise);
  result.talents=selected.every(Boolean)&&
    !!expertise?.attribute&&
    !!selectedStyle.value?.expertiseFamilies.includes(expertise.attribute)&&
    selected.filter(Boolean).every(talentChoiceValid)&&
    (draft.value.talents.expertise!=="neurodriver"||skillRaw("neurodive")>=1);

  const corruptionSourceValid=!!truthRules.value&&!!currentTruthState.value&&(
    currentTruthState.value.corruption===0
      ? !currentTruthState.value.corruptionSource
      : currentTruthState.value.corruption<=derivedStats.value.integrity&&
        truthRules.value.corruption.sources.some(source=>source.id===currentTruthState.value?.corruptionSource)
  );
  const corruptionTalentsValid=!!truthRules.value&&!!currentTruthState.value&&
    currentTruthState.value.corruptionTalents.every(id=>{
      const talent=truthRules.value?.corruption.talents.find(item=>item.id===id);
      return !!talent&&truthCorruptionPrerequisiteSatisfied(truthRules.value!,currentTruthState.value!,talent);
    });
  const corruptionAuthorizationValid=!!currentTruthState.value&&(
    currentTruthState.value.corruptionMjAuthorized||
    (
      currentTruthState.value.corruption===0&&
      !currentTruthState.value.corruptionSource&&
      currentTruthState.value.corruptionTalents.length===0
    )
  );
  const truthEquipmentAccessValid=!!truthRules.value&&!!currentTruthState.value&&
    truthEquipmentInvalidIds(truthRules.value,currentTruthState.value).length===0;

  result["truth-talents"]=!!truthRules.value&&!!currentTruthState.value&&
    !!currentTruthState.value.nature&&
    !!currentTruthState.value.consciousness&&
    truthChoicesValid(truthRules.value,currentTruthState.value)&&
    corruptionAuthorizationValid&&corruptionSourceValid&&corruptionTalentsValid&&
    truthEquipmentAccessValid&&truthUnavailableHunters(truthRules.value,currentTruthState.value).length===0&&
    truthPtvSpentValue.value<=truthRules.value.structure.ptvInitial;

  result.truth=!!truthRules.value&&!!currentTruthState.value&&truthChoicesValid(truthRules.value,currentTruthState.value);

  result.disadvantages=draft.value.disadvantages.length<=3&&disadvantagesCompatible();

  const attrOk=Number(draft.value.edge.attributePack||0)===0
    ?edgeAttributePointsUsed.value===0
    :edgeAttributePointsUsed.value===edgeAttributeBudget.value;
  const skillsOk=edgeSkillPointsUsed.value===edgeSkillBudget.value;
  const renownOk=Number(draft.value.edge.renownPack||0)===0||(!hasUnknownDisadvantage.value&&!hasRenownedTalent.value);
  result.edge=edgeRemaining.value>=0&&attrOk&&skillsOk&&edgeTalentValid()&&renownOk;

  result.equipment=equipmentValidation.value;
  return result;
});

const finalValidationStatuses=computed(()=>
  creationStepIds.map(id=>{
    const section=sections.find(([step])=>step===id);
    return {
      id,
      label:section?.[1]??id,
      ok:!!creationValidationMap.value[id],
      reason:validationReasons[id]??"À compléter"
    };
  })
);

const progressionSkillBases=computed(()=>Object.fromEntries(
  (rules.value?.skills??[]).map(skill=>[skill.id,skillRaw(skill.id)])
));
const progressionSkillFinalBases=computed(()=>Object.fromEntries(
  (rules.value?.skills??[]).map(skill=>[skill.id,skillFinal(skill.id)])
));
const progressionAttributeBases=computed(()=>Object.fromEntries(
  (rules.value?.attributes??[]).map(attribute=>[attribute.id,finalAttribute(attribute.id)])
));
const truthConsciousnessName=computed(()=>
  currentTruthState.value&&truthRules.value
    ? truthRules.value.structure.consciousness.find(item=>item.id===currentTruthState.value?.consciousness)?.name??currentTruthState.value.consciousness
    : ""
);
const originNameValue=computed(()=>draft.value&&rules.value
  ? rules.value.origins[draft.value.creation.origin]?.name??""
  : ""
);

usePageTitle(()=>[draft.value?.identity.firstName,draft.value?.identity.name].filter(Boolean).join(' ') + (route.path.endsWith('/progression')?' — Progression':' — Création'));
const sphereNameValue=computed(()=>selectedSphere.value?.name??"");
const styleNameValue=computed(()=>selectedStyle.value?.name??"");
const renownScore=computed(()=>draft.value?computeRenown(selectedRealityTalentIds(),progressionMode?(draft.value.progression.realityTalents as string[]??[]):[],Number(draft.value.edge.renownPack||0),hasUnknownDisadvantage.value,progressionMode?Number(draft.value.progression.renownAdjustment||0):0):0);
const campaignCashValue=computed(()=>{
  if(!draft.value)return 0;
  const progression=draft.value.progression as unknown as ProgressionState;
  return campaignCash(progression,Math.max(0,realityEconomyValue.value?.account||0));
});

const pdfInput=computed<PdfInput|null>(()=>{
  if(!draft.value||!rules.value||!lore.value||!disadvantages.value||!edgeRules.value||!truthRules.value||!realityRules.value)return null;
  return {data:draft.value,core:{rules:rules.value,lore:lore.value,talentChoiceSpecs:talentChoiceSpecs.value,skillTalentMap:skillTalentMap.value,
    disadvantages:disadvantages.value,edgeRules:edgeRules.value},truth:truthRules.value,reality:realityRules.value,campaign:progressionMode,fallbackName:character.value?.name};
});
const characterSheet=computed<CharacterSheet|null>(()=>{
  if(!draft.value||!rules.value||!lore.value||!disadvantages.value||!edgeRules.value||!truthRules.value||!realityRules.value)return null;
  return buildCharacterSheet(draft.value,{
    rules:rules.value,lore:lore.value,talentChoiceSpecs:talentChoiceSpecs.value,skillTalentMap:skillTalentMap.value,
    disadvantages:disadvantages.value,edgeRules:edgeRules.value
  },truthRules.value,realityRules.value,progressionMode,character.value?.name);
});

const knowledgeRefs=computed<KnowledgeRef[]>(()=>{
  if(!draft.value||!rules.value)return [];
  const refs:KnowledgeRef[]=[];
  const add=(entry:KnowledgeRef|null)=>{
    if(!entry?.label)return;
    const duplicate=refs.some(item=>
      (entry.articleId&&item.articleId===entry.articleId)||
      (!entry.articleId&&!item.articleId&&item.label===entry.label&&item.kind===entry.kind)
    );
    if(!duplicate)refs.push(entry);
  };

  const origin=rules.value.origins[draft.value.creation.origin];
  if(origin)add({
    key:"origin",label:origin.name,kind:"Origine",category:"Réalité",
    articleId:origin.compendiumId,detail:lore.value?.origin[draft.value.creation.origin]??""
  });

  if(selectedSphere.value)add({
    key:"sphere",label:selectedSphere.value.name,kind:"Sphère",category:"Réalité",
    articleId:selectedSphere.value.compendiumId,detail:lore.value?.sphere[draft.value.creation.sphere]??""
  });

  if(selectedStyle.value)add({
    key:"style",label:selectedStyle.value.name,kind:"Style",category:"Réalité",
    articleId:selectedStyle.value.compendiumId,detail:lore.value?.style[selectedStyle.value.id]??"",
    badges:[selectedStyle.value.lifestyle]
  });

  if(selectedTruthNature.value)add({
    key:"nature",label:selectedTruthNature.value.name,kind:"Nature",category:"Vérité",
    articleId:selectedTruthNature.value.compendiumId,detail:selectedTruthNature.value.description,
    badges:[truthConsciousnessName.value].filter(Boolean)
  });

  for(const id of selectedRealityTalentIds()){
    const talent=talentById(id);
    if(talent)add({
      key:`talent-reality-${id}`,label:talent.name,kind:"Talent",category:"Règles",
      articleId:talent.compendiumId,detail:[talentNarrative(talent),talent.effect??talent.description??""].filter(Boolean).join("\n\n"),
      badges:["Réalité"]
    });
  }

  const truthById=new Map(availableTruthTalents.value.map(talent=>[talent.id,talent]));
  for(const id of currentTruthState.value?.truthTalents??[]){
    const talent=truthById.get(id);
    if(talent)add({
      key:`talent-truth-${id}`,label:talent.name,kind:"Talent",category:"Règles",
      articleId:talent.compendiumId,detail:[talent.runtimeLore,talent.effect].filter(Boolean).join("\n\n"),
      badges:[`${talent.cost} PTV`,talent.access??"Vérité"].filter(Boolean)
    });
  }

  const corruptionById=new Map((truthRules.value?.corruption.talents??[]).map(talent=>[talent.id,talent]));
  for(const id of currentTruthState.value?.corruptionTalents??[]){
    const talent=corruptionById.get(id);
    if(talent)add({
      key:`talent-corruption-${id}`,
      label:talent.name,
      kind:talent.kind==="DON"?"Don de Fléau":talent.kind==="RITE"?"Rite de Fléau":"Faveur de Fléau",
      category:"Règles",
      articleId:talent.compendiumId,
      detail:talent.effect,
      badges:[talent.sourceName,talent.family,`${talent.cost} PTV`].filter(Boolean)
    });
  }

  const truthEquipmentById=new Map((truthRules.value?.equipment??[]).map(item=>[item.id,item]));
  for(const id of currentTruthState.value?.truthEquipment??[]){
    const item=truthEquipmentById.get(id);
    if(item)add({
      key:`truth-equipment-${id}`,
      label:item.name,
      kind:"Objet de Vérité",
      category:"Équipement & Objets",
      articleId:item.compendiumId,
      detail:item.lore||item.properties.map(property=>`${property.label} : ${property.value}`).join(" · "),
      badges:[item.section||`Chapitre ${item.chapter}`,item.requiresMj?"Accès exceptionnel":"Vérité"].filter(Boolean)
    });
  }

  for(const item of selectedDisadvantageItems()){
    add({
      key:`disadvantage-${item.id}`,label:item.name,kind:"Désavantage",category:"Règles",
      articleId:item.compendiumId,detail:item.effect,badges:["+1 Edge"]
    });
  }

  if(realityState.value){
    for(const purchase of [...realityState.value.augmentations,...realityState.value.equipment]){
      const item=realityItems.value.get(purchase.itemId);
      if(!item)continue;
      const badges=[item.kind==="augmentation"?"Augmentation":"Équipement"];
      if(item.generation)badges.push(`Gen ${item.generation}`);
      add({
        key:`reality-${item.id}`,label:item.name,kind:item.kind==="augmentation"?"Augmentation":"Équipement",
        category:"Équipement & Objets",articleId:item.compendiumId,
        detail:item.effect||item.lore,badges
      });
    }
  }

  return refs;
});

const knowledgeGroups=computed(()=>{
  const map=new Map<string,KnowledgeRef[]>();
  for(const item of knowledgeRefs.value){
    if(!map.has(item.kind))map.set(item.kind,[]);
    map.get(item.kind)!.push(item);
  }
  return [...map.entries()].map(([name,items])=>({name,items}));
});

function navigateFromFinalization(id:string){
  if(sections.some(([step])=>step===id))goToBuilderStep(id as StepId);
}

const builderProgress = computed(() => {
  const enabled = sections.filter(([, , active]) => active);
  const done = enabled.filter(([id]) => stepDone(id)).length;
  return {
    done,
    total: enabled.length,
    percent: enabled.length ? Math.round((done / enabled.length) * 100) : 0
  };
});

function stepDone(id:StepId):boolean{
  if(id==="progression")return true;
  if(["truth","disadvantages","edge"].includes(id)&&!reviewedOptionalSteps.value.includes(id))return false;
  if(id==="finish"){
    return creationStepIds.every(step=>stepDone(step))&&
      socialValidation.value.languages&&
      socialValidation.value.crawler&&
      socialValidation.value.renownContact&&socialValidation.value.minorContacts&&
      socialValidation.value.corporatiste;
  }
  return !!creationValidationMap.value[id];
}

async function loadCharacter(){
  loading.value=true;
  supplementalLoading.value=false;
  error.value="";
  const id=String(route.params.id??"");
  try{
    // First paint only waits for the character and the creation core.
    // Vérité and Réalité catalogs are deliberately deferred so they cannot
    // hold the whole Builder behind their larger payloads.
    const [characterResult,rulesResult]=await Promise.all([
      api<{character:Character}>(`/api/characters/${encodeURIComponent(id)}`),
      api<{
        rules:CreationRules;
        lore:CreationLore;
        talentChoiceSpecs:Record<string,TalentChoiceSpec>;
        skillTalentMap:Record<string,string>;
        disadvantages:DisadvantageCatalog;
        disadvantageLore:Record<string,string>;
        edgeRules:EdgeRules;
      }>("/api/rulesets/terra-umbra/creation")
    ]);

    character.value=characterResult.character;
    draft.value=structuredClone(characterResult.character.data);
    ensureRealityState(draft.value.reality);
    ensureProgression(
      draft.value.progression,
      rulesResult.rules.skills.map(skill=>skill.id),
      rulesResult.rules.attributes.map(attribute=>attribute.id)
    );
    rules.value=rulesResult.rules;
    lore.value=rulesResult.lore;
    talentChoiceSpecs.value=rulesResult.talentChoiceSpecs;
    skillTalentMap.value=rulesResult.skillTalentMap;
    disadvantages.value=rulesResult.disadvantages;
    disadvantageLore.value=rulesResult.disadvantageLore;
    edgeRules.value=rulesResult.edgeRules;

    if(
      disadvantageCategory.value==="sphere" &&
      !draft.value.creation.sphere
    ) disadvantageCategory.value="common";

    baseline.value=builderDraftFingerprint(draft.value);
    loading.value=false;
    readLocalDraft();

    supplementalLoading.value=true;
    void Promise.all([
      api<TruthRulesPackage>("/api/rulesets/terra-umbra/truth"),
      api<RealityRulesPackage>("/api/rulesets/terra-umbra/reality")
    ]).then(async([truthResult,realityResult])=>{
      const wasClean=!dirty.value;
      const normalizedTruthResult=ensureTruthRulesPackage(truthResult);
      truthRules.value=normalizedTruthResult;
      realityRules.value=realityResult;

      const loadedTruth=currentTruthState.value;
      if(loadedTruth&&wasClean){
        const nature=normalizedTruthResult.structure.natures[loadedTruth.nature]??normalizedTruthResult.structure.natures.humain;
        const normalized:TruthState={
          nature:nature.id,
          consciousness:loadedTruth.consciousness==="initie"?"initie":"profane",
          choices:truthSanitizeChoices(nature,loadedTruth.choices),
          truthTalents:[...loadedTruth.truthTalents],
          truthEquipment:[...loadedTruth.truthEquipment],
          truthEquipmentMjOverride:Boolean(loadedTruth.truthEquipmentMjOverride),
          corruptionMjAuthorized:Boolean(loadedTruth.corruptionMjAuthorized),
          corruption:Math.max(0,loadedTruth.corruption),
          corruptionSource:loadedTruth.corruption>0?loadedTruth.corruptionSource:"",
          corruptionTalents:[...loadedTruth.corruptionTalents]
        };
        normalized.truthTalents=truthSanitizeTalents(normalizedTruthResult,normalized);
        normalized.corruptionTalents=truthSanitizeCorruptionTalents(normalizedTruthResult,normalized);
        writeTruthState(normalized);
        await nextTick();
        if(draft.value)baseline.value=builderDraftFingerprint(draft.value);
      }
    }).catch(cause=>{
      error.value=`Les catalogues avancés n’ont pas pu être chargés : ${humanError((cause as Error).message)}`;
    }).finally(()=>{
      supplementalLoading.value=false;
    });
  }catch(cause){
    error.value=humanError((cause as Error).message);
    loading.value=false;
  }
}

async function saveCharacter(){
  if(!character.value||!draft.value||saving.value)return;
  saving.value=true;
  error.value="";
  notice.value="";
  try{
    await nextTick();
    const surname=draft.value.identity.name.trim()||character.value.name;
    draft.value.identity.name=surname;
    const name=[draft.value.identity.firstName.trim(),surname].filter(Boolean).join(" ");
    const sent=normalizeBuilderDraft(draft.value);
    const result=await api<{character:Character}>(`/api/characters/${character.value.id}`,{
      method:"PATCH",
      body:JSON.stringify({
        name,
        data:sent,
        version:character.value.version
      })
    });
    const reconciled=reconcileBuilderSave(draft.value,sent,result.character.data);
    character.value=result.character;
    draft.value=reconciled.draft;
    baseline.value=reconciled.baseline;
    // Flush synchronous benefit/default watchers before recording the clean view.
    // Browser input events cannot interleave with this Vue microtask flush.
    if(!reconciled.preserved){await nextTick();baseline.value=builderDraftFingerprint(draft.value);}
    notice.value=`Fiche enregistrée · version ${result.character.version}.`+(reconciled.preserved?" Vos modifications plus récentes restent à enregistrer.":"");
    saveConflict.value=false;
    if(!reconciled.preserved)removeLocalDraft();
  }catch(cause){
    const err=cause as Error;
    error.value=humanError(err.message);
    const violations=cause instanceof ApiError&&Array.isArray(cause.body.violations)?cause.body.violations as Array<{detail?:string}>:[];
    if(err.message==="creation_budget_exceeded"&&violations.length)error.value+=` Détail : ${violations.map(v=>v.detail).filter(Boolean).join(" ; ")}.`;
    if(cause instanceof ApiError&&cause.status===409){
      writeLocalDraft();
      saveConflict.value=true;
      notice.value="Aucune donnée locale n’a été écrasée.";
    }
  }finally{
    saving.value=false;
  }
}

// Brouillon local (06/11) : la création en cours est copiée dans ce navigateur
// tant qu'elle n'est pas enregistrée, pour survivre à un onglet fermé ou planté.
const localDraft=ref<{savedAt:number;version:number;data:CharacterDataV2}|null>(null);
const saveConflict=ref(false);
const localDraftKey=()=>character.value?`tu-builder-brouillon:${character.value.id}`:null;
function writeLocalDraft(){
  const key=localDraftKey();
  if(!key||!draft.value||!character.value||!dirty.value)return;
  try{localStorage.setItem(key,JSON.stringify({savedAt:Date.now(),version:character.value.version,data:draft.value}));}
  catch{/* navigateur plein ou privé : la fiche reste protégée par l'avertissement avant de quitter */}
}
function removeLocalDraft(){
  const key=localDraftKey();
  localDraft.value=null;
  try{if(key)localStorage.removeItem(key);}catch{/* rien à nettoyer */}
}
function readLocalDraft(){
  const key=localDraftKey();
  localDraft.value=null;
  if(!key||!draft.value)return;
  try{
    const stored=JSON.parse(localStorage.getItem(key)??"null");
    if(!stored?.data)return;
    if(builderDraftFingerprint(stored.data)===baseline.value){localStorage.removeItem(key);return;}
    localDraft.value=stored;
  }catch{/* copie illisible : ignorée */}
}
function discardLocalDraft(){
  if(window.confirm("Effacer la création gardée dans ce navigateur ? Elle ne pourra pas être reprise."))removeLocalDraft();
}
function restoreLocalDraft(){
  if(!localDraft.value||!draft.value)return;
  draft.value=structuredClone(localDraft.value.data);
  localDraft.value=null;
  notice.value="Création reprise. Pense à l’enregistrer.";
}
async function reloadAfterConflict(){
  writeLocalDraft();
  saveConflict.value=false;
  await loadCharacter();
}
let localDraftTimer:ReturnType<typeof setTimeout>|undefined;
watch(draft,()=>{
  clearTimeout(localDraftTimer);
  localDraftTimer=setTimeout(writeLocalDraft,800);
},{deep:true});

function readImage(file:File){
  return new Promise<string>((resolve,reject)=>{
    const reader=new FileReader();
    reader.onerror=()=>reject(new Error("Lecture de l’image impossible."));
    reader.onload=()=>resolve(String(reader.result??""));
    reader.readAsDataURL(file);
  });
}

function loadImage(src:string){
  return new Promise<HTMLImageElement>((resolve,reject)=>{
    const image=new Image();
    image.onerror=()=>reject(new Error("Format d’image illisible."));
    image.onload=()=>resolve(image);
    image.src=src;
  });
}

function canvasData(image:HTMLImageElement,max:number,quality:number){
  const ratio=Math.min(1,max/Math.max(image.naturalWidth||1,image.naturalHeight||1));
  const canvas=document.createElement("canvas");
  canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));
  canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));
  const context=canvas.getContext("2d");
  if(!context)throw new Error("Impossible de préparer le portrait.");
  context.drawImage(image,0,0,canvas.width,canvas.height);
  let data=canvas.toDataURL("image/webp",quality);
  if(!data.startsWith("data:image/webp"))data=canvas.toDataURL("image/jpeg",quality);
  return data;
}

async function resizePortrait(file:File){
  if(!file.type.startsWith("image/"))throw new Error("Le fichier choisi n’est pas une image.");
  if(file.size>12*1024*1024)throw new Error("Image trop lourde : 12 Mo maximum avant redimensionnement.");
  const image=await loadImage(await readImage(file));
  let data=canvasData(image,640,.82);
  if(data.length>700_000)data=canvasData(image,480,.7);
  if(data.length>800_000)throw new Error("Le portrait reste trop lourd après compression.");
  return data;
}

async function setPortrait(event:Event){
  if(!draft.value)return;
  const input=event.target as HTMLInputElement;
  const file=input.files?.[0];
  if(!file)return;
  error.value="";
  try{
    draft.value.identity.portraitDataUrl=await resizePortrait(file);
    draft.value.identity.portraitName=file.name;
    if(draft.value.appearances)draft.value.appearances.primaryReality="legacy";
  }catch(cause){
    error.value=(cause as Error).message;
  }finally{
    input.value="";
  }
}

function removePortrait(){
  if(!draft.value)return;
  draft.value.identity.portraitDataUrl="";
  draft.value.identity.portraitName="";
}

function selectOrigin(id:string){
  if(!draft.value||draft.value.creation.origin===id)return;
  draft.value.creation.origin=id;
  draft.value.talents.origin="";
}

function selectOriginTalent(id:string){
  if(!draft.value)return;
  draft.value.talents.origin=id;
}

function resetStyleAllocations(){
  if(!draft.value)return;
  for(const skill of Object.values(draft.value.skills))skill.style=0;
}

function selectSphere(id:string){
  if(!draft.value||draft.value.creation.sphere===id)return;
  draft.value.creation.sphere=id;
  if(disadvantages.value){
    const sphereIds=new Set(Object.values(disadvantages.value.sphere).flat().map(item=>item.id));
    const allowed=new Set((disadvantages.value.sphere[id]??[]).map(item=>item.id));
    draft.value.disadvantages=draft.value.disadvantages.filter(disId=>!sphereIds.has(disId)||allowed.has(disId));
  }
  draft.value.creation.style="";
  draft.value.talents.sphere="";
  draft.value.talents.expertise="";
  resetStyleAllocations();
}

function selectStyle(id:string){
  if(!draft.value||draft.value.creation.style===id)return;
  draft.value.creation.style=id;
  draft.value.talents.expertise="";
  resetStyleAllocations();
}

function sphereFixed(id:string){
  return selectedSphere.value?.fixedSkills.includes(id)?1:0;
}

function skillRaw(id:string){
  if(!draft.value)return 0;
  const data=draft.value.skills[id]??{style:0,free:0,edge:0};
  return sphereFixed(id)+Number(data.style||0)+Number(data.free||0)+Number(data.edge||0);
}

function changeStylePoint(id:string,delta:number){
  if(!draft.value||!selectedStyle.value?.skills.includes(id))return;
  const skill=draft.value.skills[id];
  if(!skill)return;
  const next=Number(skill.style||0)+delta;
  if(next<0||next>2)return;
  if(delta>0&&stylePointsUsed.value>=5)return;
  if(delta>0&&skillRaw(id)>=5)return;
  skill.style=next;
}

function changeFreeSkillPoint(id:string,delta:number){
  if(!draft.value||!rules.value)return;
  const skill=draft.value.skills[id];
  if(!skill)return;
  const next=Number(skill.free||0)+delta;
  if(next<0)return;
  if(delta>0&&freeSkillPointsUsed.value>=freeSkillBudget.value)return;
  if(delta>0&&skillRaw(id)>=rules.value.creation.skills.rawMax)return;
  skill.free=next;
}

function writeTruthState(state:TruthState){
  if(!draft.value)return;
  if(campaignRewardsLocked.value)state={...state,corruption:Number(draft.value.truth.corruption||0),corruptionSource:String(draft.value.truth.corruptionSource||''),corruptionMjAuthorized:Boolean(draft.value.truth.corruptionMjAuthorized)};
  draft.value.truth={
    nature:state.nature,
    consciousness:state.consciousness,
    choices:{...state.choices},
    truthTalents:[...state.truthTalents],
    truthEquipment:[...state.truthEquipment],
    truthEquipmentMjOverride:Boolean(state.truthEquipmentMjOverride),
    corruptionMjAuthorized:Boolean(state.corruptionMjAuthorized),
    corruption:Math.max(0,Math.trunc(Number(state.corruption)||0)),
    corruptionSource:String(state.corruptionSource||""),
    corruptionTalents:[...state.corruptionTalents]
  };
}

function setTruthNature(id:string){
  if(!draft.value||!truthRules.value)return;
  const nature=truthRules.value.structure.natures[id];
  if(!nature)return;
  const current=currentTruthState.value;
  const next:TruthState={
    nature:id,
    consciousness:current?.consciousness??"profane",
    choices:truthSanitizeChoices(nature,{}),
    truthTalents:[],
    truthEquipment:[...(current?.truthEquipment??[])],
    truthEquipmentMjOverride:Boolean(current?.truthEquipmentMjOverride),
    corruptionMjAuthorized:Boolean(current?.corruptionMjAuthorized),
    corruption:Number(current?.corruption??0),
    corruptionSource:String(current?.corruptionSource??""),
    corruptionTalents:[...(current?.corruptionTalents??[])]
  };
  writeTruthState(next);
  truthSearch.value="";
}

function setTruthConsciousness(id:string){
  if(!truthRules.value||!currentTruthState.value)return;
  const next:TruthState={...currentTruthState.value,consciousness:id};
  next.truthTalents=truthSanitizeTalents(truthRules.value,next);
  writeTruthState(next);
}

async function focusTruthConsciousness(){
  activeStep.value="truth";await nextTick();
  truthConsciousnessInput.value?.focus();
  truthConsciousnessInput.value?.scrollIntoView({block:"center"});
}

function truthConsciousnessHelp(id:string){
  return id==="profane"
    ? "Ignore encore la Vérité ou n’y a pas accès consciemment. Aucun PTV de Vérité ne peut être dépensé tant que le personnage reste Profane."
    : "Connaît l’existence de la Vérité et peut employer ses acquis surnaturels et dépenser ses PTV dans les branches ouvertes par sa Nature.";
}

function setTruthChoice(key:string,value:string){
  if(!truthRules.value||!currentTruthState.value||!selectedTruthNature.value)return;
  const choices=truthSanitizeChoices(
    selectedTruthNature.value,
    {...currentTruthState.value.choices,[key]:value}
  );
  const next:TruthState={...currentTruthState.value,choices};
  next.truthTalents=truthSanitizeTalents(truthRules.value,next);
  writeTruthState(next);
}

const configuredTruthTalent=ref("");
function setGuidedTruthChoices(patch:Record<string,unknown>){
 if(!currentTruthState.value)return;
 const allowed=Object.fromEntries(Object.entries(patch).filter(([key])=>['hunterBuild','vampireBuild','daemonBuild','angelusBuild','extralBuild','exileBuild','mageTechniques'].includes(key)));
 writeTruthState({...currentTruthState.value,choices:{...currentTruthState.value.choices,...allowed}});
}

function setExileBuild(value:ExileBuild){
 if(!currentTruthState.value)return;
 writeTruthState({...currentTruthState.value,choices:{...currentTruthState.value.choices,exileBuild:normalizeExileBuild(value)}});
}
function setBeneficiaryBenefits(value:BeneficiaryState){
 if(!currentTruthState.value)return;
 writeTruthState({...currentTruthState.value,choices:{...currentTruthState.value.choices,beneficiaryBenefits:normalizeBeneficiaryBenefits(value)}});
}
function setExtralBuild(value:ExtralBuild){
 if(!currentTruthState.value)return;
 writeTruthState({...currentTruthState.value,choices:{...currentTruthState.value.choices,extralBuild:normalizeExtralBuild(value)}});
}

function setAngelusBuild(value:AngelusBuild){
 if(!currentTruthState.value)return;
 writeTruthState({...currentTruthState.value,choices:{...currentTruthState.value.choices,angelusBuild:normalizeAngelusBuild(value)}});
}

function setDaemonBuild(value:DaemonBuild){
 if(!currentTruthState.value)return;
 writeTruthState({...currentTruthState.value,choices:{...currentTruthState.value.choices,daemonBuild:normalizeDaemonBuild(value)}});
}

function setMageTechniques(value:MageTechniqueDefinitions){
 if(!currentTruthState.value)return;
 writeTruthState({...currentTruthState.value,choices:{...currentTruthState.value.choices,mageTechniques:normalizeMageTechniques(value)}});
}

function truthChoiceValue(choice:TruthChoice){
  const value=currentTruthState.value?.choices[choice.key];
  return typeof value==="string"?value:"";
}

function resolvedTruthChoiceOptions(choice:TruthChoice){
  const state=currentTruthState.value,options=truthChoiceOptions(choice,state?.choices??{});
  if(state?.nature==='vampire'&&choice.key==='blood'&&state.truthTalents.some(id=>id.startsWith('vampire_awaken_')))return options.filter(o=>o.id===vampireNativeBlood(state));
  return state&&isKhinae(state)&&choice.key==='blood'&&state.truthTalents.some(id=>id.startsWith('khinae_awaken_'))?options.filter(o=>o.id===khinaeNativeBlood(state)):options;
}

function selectedTruthChoice(choice:TruthChoice){
  const value=truthChoiceValue(choice);
  return resolvedTruthChoiceOptions(choice).find(option=>option.id===value)??null;
}

function truthTalentSelected(id:string){
  return currentTruthState.value?.truthTalents.includes(id)??false;
}

function truthTalentPrereqOk(talent:TruthTalent){
  if(!truthRules.value||!currentTruthState.value)return false;
  return truthPrerequisiteSatisfied(
    truthRules.value,
    currentTruthState.value,
    talent,
    availableTruthTalents.value
  );
}

function truthTalentCanAdd(talent:TruthTalent){
  if(!truthRules.value||!currentTruthState.value)return false;
  if(truthTalentSelected(talent.id))return true;
  if(!truthTalentPrereqOk(talent))return false;
  return truthPtvSpentValue.value+Number(talent.cost||0)<=truthRules.value.structure.ptvInitial;
}

function toggleTruthTalent(talent:TruthTalent){
  if(!truthRules.value||!currentTruthState.value)return;
  const selected=currentTruthState.value.truthTalents.includes(talent.id);
  if(!selected&&!truthTalentCanAdd(talent))return;
  const truthTalents=selected
    ? currentTruthState.value.truthTalents.filter(id=>id!==talent.id)
    : [...currentTruthState.value.truthTalents,talent.id];
  const next:TruthState={...currentTruthState.value,truthTalents};
  next.truthTalents=truthSanitizeTalents(truthRules.value,next);
  writeTruthState(next);
}

function toggleDisadvantage(id:string){
  if(!draft.value)return;
  const selected=draft.value.disadvantages.includes(id);
  if(selected){
    draft.value.disadvantages=draft.value.disadvantages.filter(item=>item!==id);
  }else if(draft.value.disadvantages.length<3&&availableDisadvantages.value.some(item=>item.id===id)){
    draft.value.disadvantages.push(id);
  }
  if(id==="inconnu"&&draft.value.disadvantages.includes(id))draft.value.edge.renownPack=0;
}

function addDisadvantagePick(){
  if(!disadvantagePick.value||!draft.value||draft.value.disadvantages.length>=3)return;
  if(!draft.value.disadvantages.includes(disadvantagePick.value))toggleDisadvantage(disadvantagePick.value);
  disadvantagePick.value="";
}

function trimEdgeTalentSlots(){
  if(!draft.value)return;
  const count=Math.max(0,Number(draft.value.edge.talentPacks||0));
  draft.value.talents.edge=draft.value.talents.edge.slice(0,count);
  while(draft.value.talents.edge.length<count)draft.value.talents.edge.push("");
}

function changeEdgePurchase(key:string,delta:number){
  if(!draft.value||!edgeRules.value)return;
  const rule=edgeRules.value.options[key];
  if(!rule)return;
  const current=Number(draft.value.edge[key]||0);
  const next=current+delta;
  if(next<0||next>rule.max)return;
  if(delta>0&&edgeRemaining.value<edgePurchaseCost(key))return;
  if(key==="renownPack"&&delta>0&&(hasUnknownDisadvantage.value||hasRenownedTalent.value))return;

  if(delta<0&&key==="attributePack"&&edgeAttributePointsUsed.value>Math.max(0,next)*Number(rule.points||0))return;
  if(delta<0&&key==="skillPacks"&&edgeSkillPointsUsed.value>Math.max(0,next)*Number(rule.points||0))return;

  draft.value.edge[key]=next;
  if(key==="talentPacks")trimEdgeTalentSlots();
}

function changeEdgeAttribute(id:string,delta:number){
  if(!draft.value||!rules.value)return;
  const current=Number(draft.value.edgeAttributes[id]||0);
  const next=current+delta;
  if(next<0)return;
  if(delta>0&&edgeAttributePointsUsed.value>=edgeAttributeBudget.value)return;
  if(delta>0&&finalAttribute(id)>=rules.value.creation.attributes.max)return;
  draft.value.edgeAttributes[id]=next;
}

function changeEdgeSkill(id:string,delta:number){
  if(!draft.value||!rules.value)return;
  const skill=draft.value.skills[id];
  if(!skill)return;
  const next=Number(skill.edge||0)+delta;
  if(next<0)return;
  if(delta>0&&edgeSkillPointsUsed.value>=edgeSkillBudget.value)return;
  if(delta>0&&skillRaw(id)>=rules.value.creation.skills.rawMax)return;
  skill.edge=next;
}

function setEdgeTalent(index:number,id:string){
  if(!draft.value)return;
  trimEdgeTalentSlots();
  draft.value.talents.edge[index]=id;
}

function edgeTalentGroupsFor(index:number){
  if(!draft.value)return [];
  const others=new Set(draft.value.talents.edge.filter((_,i)=>i!==index).filter(Boolean));
  return edgeTalentGroups.value.map(group=>({
    label:group.label,
    items:group.items.filter(talent=>!others.has(talent.id))
  }));
}

function changeAttribute(id:string,delta:number){
  if(!draft.value||!rules.value)return;
  const config=rules.value.creation.attributes;
  const current=Number(draft.value.attributes[id]??config.min);
  const next=current+delta;
  if(next<config.min||next>config.max)return;
  if(delta>0&&attributeTotal.value>=attributeBudget.value)return;
  draft.value.attributes[id]=next;
}

function beforeUnload(event:BeforeUnloadEvent){
  if(!dirty.value)return;
  event.preventDefault();
  event.returnValue="";
}

function confirmBuilderLeave(){
  return !dirty.value||window.confirm("Des modifications ne sont pas enregistrées. Quitter quand même ?");
}
onBeforeRouteLeave(confirmBuilderLeave);
onBeforeRouteUpdate((to,from)=>to.path===from.path||confirmBuilderLeave());

function handleBuilderKeydown(event:KeyboardEvent){
  if(!knowledgeOpen.value)return;
  if(event.key==="Escape"){
    event.preventDefault();
    knowledgeOpen.value=false;
    return;
  }
  if(event.key!=="Tab"||!knowledgeDrawer.value)return;
  const focusable=Array.from(knowledgeDrawer.value.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex='0']"))
    .filter(element=>element.offsetParent!==null);
  const first=focusable[0];
  const last=focusable[focusable.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
}
// Phone: the export block folds behind one line so the step starts near the top.
const phoneQuery=typeof window.matchMedia==="function"?window.matchMedia("(max-width: 620px)"):null;
const isPhone=ref(Boolean(phoneQuery?.matches));
const syncPhone=(event:MediaQueryListEvent)=>{isPhone.value=event.matches;};
onMounted(()=>{
  phoneQuery?.addEventListener("change",syncPhone);
  window.addEventListener("beforeunload",beforeUnload);
  window.addEventListener("keydown",handleBuilderKeydown);
  void loadCharacter();
});
onBeforeUnmount(()=>{
  phoneQuery?.removeEventListener("change",syncPhone);
  window.removeEventListener("beforeunload",beforeUnload);
  window.removeEventListener("keydown",handleBuilderKeydown);
});

  return {
    route, progressionMode, character, campaignRewardsLocked, draft, rules, lore, talentChoiceSpecs, skillTalentMap, disadvantages, disadvantageLore,
    edgeRules, truthRules, realityRules, disadvantageCategory, disadvantagePick, truthSearch, skillGroupOpen, loading, supplementalLoading, saving,
    error, notice, baseline, localDraft, saveConflict, restoreLocalDraft, discardLocalDraft, reloadAfterConflict, activeStep, reviewedOptionalSteps, sheetReturnStep, knowledgeOpen, stepNavigationOpen, knowledgeTrigger, knowledgeDrawer,
    portraitInput, displayPortrait, truthConsciousnessInput, sections, activeStepIndex, previousBuilderStep, nextBuilderStep, goToBuilderStep,
    toggleCharacterSheet, edgeOptionUi, dirty, identityDisplayName, selectedSphere, selectedStyle, styleOptions, originTalents, sphereTalents,
    expertiseTalents, commonTalents, stylePointsUsed, freeSkillPointsUsed, freeSkillBudget, skillFreePointsForAttribute, skillGroupIsOpen,
    setSkillGroupOpen, edgeSkillPointsUsed, edgeSkillBudget, attributeTotal, attributeBudget, edgeAttributePointsUsed, edgeAttributeBudget,
    disadvantageCategories, visibleDisadvantages, availableDisadvantages, disadvantageFamily, selectedDisadvantageInFamily, disadvantagePreview,
    edgeTotal, edgePurchaseKeys, edgePurchaseCost, edgeSpent, edgeRemaining, hasUnknownDisadvantage, hasRenownedTalent, hasRenownContactTalent,
    currentTruthState, exileActiveIds, selectedTruthNature, availableTruthTalents, selectedTruthFreeTraits, truthRevealProfile, truthPtvSpentValue,
    truthPtvRemaining, creationTruthChoices, truthGroupOptions, selectedTruthTalents, visibleTruthGroups, edgeTalentGroups, humanError, skillName,
    attributeName, talentById, talentNarrative, talentChoiceSpec, talentChoiceValue, setTalentChoice, talentChoiceOptions, talentChoiceValid,
    setTalent, selectedRealityTalentIds, skillTalentBonus, skillFinal, disadvantageNarrative, disadvantageById, disadvantagesCompatible,
    edgeTalentValid, edgePurchaseDisabled, edgePurchasePlusDisabled, edgePurchaseMinusDisabled, edgeOptionResult, edgeSkillPointsForAttribute,
    edgeSkillsForAttribute, selectedDisadvantageItems, finalAttribute, skillPermanent, ownedRealityTalentIds, derivedStats, realityState,
    realityItems, realityEconomyValue, lifestyleBaseValue, lifestylePressureValue, augmentationLoadValue, requiredLanguageCount, socialLanguages,
    selectedNpcContact, socialValidation, equipmentValidation, formatMoney, validationReasons, creationStepIds, creationValidationMap,
    finalValidationStatuses, progressionSkillBases, progressionSkillFinalBases, progressionAttributeBases, truthConsciousnessName, originNameValue,
    sphereNameValue, styleNameValue, renownScore, campaignCashValue, pdfInput, characterSheet, knowledgeRefs, knowledgeGroups,
    navigateFromFinalization, builderProgress, stepDone, loadCharacter, saveCharacter, readImage, loadImage, canvasData, resizePortrait, setPortrait,
    removePortrait, selectOrigin, selectOriginTalent, resetStyleAllocations, selectSphere, selectStyle, sphereFixed, skillRaw, changeStylePoint,
    changeFreeSkillPoint, writeTruthState, setTruthNature, setTruthConsciousness, focusTruthConsciousness, truthConsciousnessHelp, setTruthChoice,
    configuredTruthTalent, setGuidedTruthChoices, setExileBuild, setBeneficiaryBenefits, setExtralBuild, setAngelusBuild, setDaemonBuild,
    setMageTechniques, truthChoiceValue, resolvedTruthChoiceOptions, selectedTruthChoice, truthTalentSelected, truthTalentPrereqOk, truthTalentCanAdd,
    toggleTruthTalent, toggleDisadvantage, addDisadvantagePick, trimEdgeTalentSlots, changeEdgePurchase, changeEdgeAttribute, changeEdgeSkill,
    setEdgeTalent, edgeTalentGroupsFor, changeAttribute, beforeUnload, confirmBuilderLeave, handleBuilderKeydown, phoneQuery, isPhone, syncPhone,
    usePageTitle, truthUnavailableHunters, vampireUnavailable, vampireNativeBlood, isKhinae, khinaeNativeBlood, khinaeUnavailable,
    truthBuildChoiceLabel, truthHasInnateBuildChoice, exileOwnedItems, exileUsableTalents, normalizeExileBuild, normalizeBeneficiaryBenefits,
    normalizeExtralBuild, extralOwnedItems, truthKnownTalents, normalizeAngelusBuild, normalizeDaemonBuild, normalizeMageTechniques,
    appearanceGallery, permanentSkillBonus, pruneBenefits, uniqueTalents, computeRenown, builderDraftFingerprint, normalizeBuilderDraft,
    reconcileBuilderSave, compareTruthTalents, api, ApiError, characterDerivedStats, augmentationAccess, augmentationCopyCount, augmentationLoad,
    augmentationMaxCopies, augmentationSupportSatisfied, ensureRealityState, neuroCapacity, priceSelectionValid, realityEconomic, realityItemMap,
    realityLifestyleBase, realityPriceSpec, lifestylePressure, syncRealityTalentBenefits, campaignCash, ensureProgression, ensureTruthRulesPackage,
    truthAvailableTalents, truthChoiceOptions, truthChoicesValid, truthCreationGroups, truthVoieStep, truthPrerequisiteSatisfied,
    truthPrerequisiteIssues, truthEquipmentAccess, truthPermanentAttributeBonus, truthPtvSpent, truthRevelationProfile, truthSanitizeChoices,
    truthSanitizeCorruptionTalents, truthSanitizeTalents, truthCorruptionPrerequisiteSatisfied, truthEquipmentInvalidIds, truthSelectedFreeTraits,
    buildCharacterSheet
  };
}

export type CharacterBuilder=ReturnType<typeof useCharacterBuilder>;
export const builderKey:InjectionKey<CharacterBuilder>=Symbol("character-builder");
/** L'état du Builder fourni par CharacterBuilderPage. */
export function useBuilder():CharacterBuilder{
  const builder=inject(builderKey);
  if(!builder)throw new Error("useBuilder() hors du Builder de personnage");
  return builder;
}
