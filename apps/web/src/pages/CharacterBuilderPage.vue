<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { compareLabels, compareTruthTalents } from "../lib/catalog-order";
import { api, ApiError } from "../lib/api";
import TalentSelector, {
  type TalentChoiceOption,
  type TalentChoiceSpec,
} from "../components/builder/TalentSelector.vue";
import BuilderWikiLink from "../components/builder/BuilderWikiLink.vue";
import BuilderCatalogImage from "../components/builder/BuilderCatalogImage.vue";
import TruthEquipmentPanel from "../components/builder/TruthEquipmentPanel.vue";
import CorruptionPanel from "../components/builder/CorruptionPanel.vue";
import TerraUmbraBrand from "../components/TerraUmbraBrand.vue";
import EquipmentStep from "../components/builder/EquipmentStep.vue";
import FinalizationStep from "../components/builder/FinalizationStep.vue";
import CharacterSummary from "../components/builder/CharacterSummary.vue";
import { characterDerivedStats, type CharacterSheet } from "../lib/character-sheet";
import ProgressionStep from "../components/builder/ProgressionStep.vue";
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
  type RealityRulesPackage,
  type RealityState
} from "../lib/reality";
import { campaignCash, ensureProgression, type ProgressionState } from "../lib/progression";
import type { Character, CharacterDataV2 } from "../types/character";
import {
  ensureTruthRulesPackage,
  truthAvailableTalents,
  truthChoiceOptions,
  truthChoicesValid,
  truthGroups,
  truthPrerequisiteSatisfied,
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
} from "../lib/truth";

import type { CreationRules, CreationLore, DisadvantageOption, DisadvantageCatalog, EdgeRules, RuleTalent } from "../lib/creation-types";
import { buildCharacterSheet } from "../lib/character-sheet-model";

type StepId="identity"|"origin"|"sphere"|"attributes"|"skills"|"talents"|"truth"|"disadvantages"|"edge"|"equipment"|"finish"|"progression"|"sheet";
type KnowledgeRef={
  key:string;
  label:string;
  kind:string;
  category:string;
  articleId?:string;
  detail?:string;
  badges?:string[];
};

const route=useRoute();
const progressionMode=route.path.endsWith("/progression");
const character=ref<Character|null>(null);
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
const truthGroupChoice=ref("");
const skillGroupOpen=ref<Record<string,boolean>>({});
const loading=ref(true);
const supplementalLoading=ref(false);
const saving=ref(false);
const error=ref("");
const notice=ref("");
const baseline=ref("");
const activeStep=ref<StepId>(progressionMode?"progression":"identity");
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
      ["truth","Vérité",true],
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
  return JSON.stringify(draft.value)!==baseline.value;
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
    rows.push({id:`attr:${attribute.id}`,name:`Faiblesse de ${attribute.name}`});
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
  return visibleDisadvantages.value.filter(item=>!selected.has(item.id));
});

const disadvantagePreview=computed(()=>
  disadvantagePick.value ? disadvantageById(disadvantagePick.value) : null
);

const edgeTotal=computed(()=>{
  if(!draft.value||!edgeRules.value)return 0;
  return edgeRules.value.base+draft.value.disadvantages.length;
});

const edgeSpent=computed(()=>{
  if(!draft.value)return 0;
  return ["attributePack","skillPacks","talentPacks","cashPacks","lifestylePack","augmentationPacks","renownPack"]
    .reduce((sum,key)=>sum+Number(draft.value?.edge[key]||0),0);
});

const edgeRemaining=computed(()=>edgeTotal.value-edgeSpent.value);

const hasUnknownDisadvantage=computed(()=>draft.value?.disadvantages.includes("inconnu")??false);
const hasRenownedTalent=computed(()=>selectedRealityTalentIds().includes("renomme"));

const currentTruthState=computed<TruthState|null>(()=>{
  if(!draft.value)return null;
  const raw=draft.value.truth;
  const choices=raw.choices&&typeof raw.choices==="object"&&!Array.isArray(raw.choices)
    ? raw.choices as Record<string,unknown>
    : {};
  return {
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

const truthGroupOptions=computed(()=>truthGroups(availableTruthTalents.value).map(group=>({...group,items:[...group.items].sort(compareTruthTalents)})).sort((a,b)=>compareLabels(a.name,b.name)));
const visibleTruthGroups=computed(()=>{
  const groups=truthGroupOptions.value.filter(group=>group.name===truthGroupChoice.value||!truthGroupChoice.value&&Boolean(truthSearch.value.trim()));
  const query=truthSearch.value.trim().toLocaleLowerCase("fr");
  if(!query)return groups;
  return groups
    .map(group=>({
      ...group,
      items:group.items.filter(talent=>
        [talent.name,talent.group,talent.effect,talent.runtimeLore,talent.prerequisiteName]
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
  const labels:Record<string,string>={
    authentication_required:"Ta session a expiré. Reviens à l’accueil pour te reconnecter.",
    character_not_found:"Ce personnage n’existe plus ou ne t’appartient pas.",
    character_version_conflict:"Cette fiche a été modifiée ailleurs. Recharge-la avant d’enregistrer de nouveau.",
    invalid_character_data:"Les données de cette fiche ne sont pas valides.",
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
    .filter((skill)=>allowed.has(skill.id))
    .map((skill)=>({id:skill.id,name:skill.name}));
}

function talentChoiceValid(id:string){
  const spec=talentChoiceSpec(id);
  return !spec||talentChoiceValue(id).trim().length>0;
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
  return !rule||current>=rule.max||edgeRemaining.value<=0||edgePurchaseDisabled(key);
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

const derivedStats=computed(()=>characterDerivedStats(finalAttribute,skillFinal,draft.value?.disadvantages??[]));

const realityState=computed<RealityState|null>(()=>
  draft.value ? draft.value.reality as unknown as RealityState : null
);
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
    ? augmentationLoad(realityRules.value,realityState.value,selectedRealityTalentIds())
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
function socialContacts(){
  if(!draft.value)return [];
  return Array.isArray(draft.value.social.contacts)
    ? draft.value.social.contacts.filter((value):value is string=>typeof value==="string")
    : [];
}
const socialValidation=computed(()=>{
  if(!draft.value)return {languages:false,crawler:false,corporatiste:false};
  const languages=socialLanguages();
  const languageOk=languages.length===requiredLanguageCount.value&&languages.every(value=>value.trim().length>0);
  const crawler=draft.value.creation.sphere!=="crawler"||socialContacts().some(value=>value.trim().length>0);
  const supportType=String(draft.value.reality.sphereSupportType??"");
  const supportItem=String(draft.value.reality.sphereSupportItemId??"");
  const corporatiste=draft.value.creation.sphere!=="corporatiste"||
    (["housing","vehicle"].includes(supportType)&&supportItem.length>0);
  return {languages:languageOk,crawler,corporatiste};
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
      (!purchase.priceConfirmed||!priceSelectionValid(item,Number.isFinite(Number(purchase.selectedPrice))?Number(purchase.selectedPrice):null))
    ) return false;
    if((purchase.selectedPrice??item.price??0)>pkg.economy.advancedPurchaseThreshold&&!state.mjAdvancedOverride)return false;
    if(!augmentationSupportSatisfied(pkg,state,item))return false;
    if(augmentationCopyCount(pkg,state,item)>augmentationMaxCopies(item))return false;
    const access=augmentationAccess(pkg,selectedStyle.value,item,draft.value.edge,state.mjAccessOverride);
    if(!access.ok)return false;
    if(item.generation===2&&!access.systems.includes(Number(purchase.gen2System)))return false;
  }

  for(const purchase of state.equipment){
    const item=itemMap.get(purchase.itemId);
    if(!item)return false;
    if(
      realityPriceSpec(item).configurable&&
      (!purchase.priceConfirmed||!priceSelectionValid(item,Number.isFinite(Number(purchase.selectedPrice))?Number(purchase.selectedPrice):null))
    ) return false;
    if((purchase.selectedPrice??item.price??0)>pkg.economy.advancedPurchaseThreshold&&!state.mjAdvancedOverride)return false;
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
  truth:"Choix de Vérité incomplet ou PTV de création dépassés.",
  disadvantages:"Désavantages incompatibles ou trop nombreux.",
  edge:"Dépenses ou allocations Edge à corriger.",
  equipment:"Budget, accès, Charge, Stress, Gen2 ou Neuroprogrammes à corriger."
};

const creationStepIds:StepId[]=[
  "identity","origin","sphere","attributes","skills","talents","truth","disadvantages","edge","equipment"
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

  result.truth=!!truthRules.value&&!!currentTruthState.value&&
    !!currentTruthState.value.nature&&
    !!currentTruthState.value.consciousness&&
    truthChoicesValid(truthRules.value,currentTruthState.value)&&
    corruptionAuthorizationValid&&corruptionSourceValid&&corruptionTalentsValid&&
    truthEquipmentAccessValid&&
    truthPtvSpentValue.value<=truthRules.value.structure.ptvInitial;

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
const sphereNameValue=computed(()=>selectedSphere.value?.name??"");
const styleNameValue=computed(()=>selectedStyle.value?.name??"");
const renownScore=computed(()=>{
  if(!draft.value)return 0;
  if(hasUnknownDisadvantage.value)return 0;
  if(hasRenownedTalent.value||Number(draft.value.edge.renownPack||0)>0)return 2;
  return 1;
});
const campaignCashValue=computed(()=>{
  if(!draft.value)return 0;
  const progression=draft.value.progression as unknown as ProgressionState;
  return campaignCash(progression,Math.max(0,realityEconomyValue.value?.account||0));
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
  if(id==="finish"){
    return creationStepIds.every(step=>!!creationValidationMap.value[step])&&
      socialValidation.value.languages&&
      socialValidation.value.crawler&&
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

    baseline.value=JSON.stringify(draft.value);
    loading.value=false;

    supplementalLoading.value=true;
    void Promise.all([
      api<TruthRulesPackage>("/api/rulesets/terra-umbra/truth"),
      api<RealityRulesPackage>("/api/rulesets/terra-umbra/reality")
    ]).then(([truthResult,realityResult])=>{
      const normalizedTruthResult=ensureTruthRulesPackage(truthResult);
      truthRules.value=normalizedTruthResult;
      realityRules.value=realityResult;

      const loadedTruth=currentTruthState.value;
      if(loadedTruth&&!dirty.value){
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
        baseline.value=JSON.stringify(draft.value);
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
    const surname=draft.value.identity.name.trim()||character.value.name;
    draft.value.identity.name=surname;
    const name=[draft.value.identity.firstName.trim(),surname].filter(Boolean).join(" ");
    const result=await api<{character:Character}>(`/api/characters/${character.value.id}`,{
      method:"PATCH",
      body:JSON.stringify({
        name,
        data:draft.value,
        version:character.value.version
      })
    });
    character.value=result.character;
    draft.value=structuredClone(result.character.data);
    baseline.value=JSON.stringify(draft.value);
    notice.value=`Fiche enregistrée · version ${result.character.version}.`;
  }catch(cause){
    const err=cause as Error;
    error.value=humanError(err.message);
    if(cause instanceof ApiError&&cause.status===409){
      notice.value="Aucune donnée locale n’a été écrasée.";
    }
  }finally{
    saving.value=false;
  }
}

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

function focusTruthConsciousness(){
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

function truthChoiceValue(choice:TruthChoice){
  const value=currentTruthState.value?.choices[choice.key];
  return typeof value==="string"?value:"";
}

function resolvedTruthChoiceOptions(choice:TruthChoice){
  return truthChoiceOptions(choice,currentTruthState.value?.choices??{});
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
  }else if(draft.value.disadvantages.length<3){
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
  if(delta>0&&edgeRemaining.value<=0)return;
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

onBeforeRouteLeave(()=>{
  if(!dirty.value)return true;
  return window.confirm("Des modifications ne sont pas enregistrées. Quitter quand même ?");
});

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
onMounted(()=>{
  window.addEventListener("beforeunload",beforeUnload);
  window.addEventListener("keydown",handleBuilderKeydown);
  void loadCharacter();
});
onBeforeUnmount(()=>{
  window.removeEventListener("beforeunload",beforeUnload);
  window.removeEventListener("keydown",handleBuilderKeydown);
});
</script>

<template>
  <div class="builder-v2-shell">
    <header class="topbar builder-topbar">
      <div class="builder-topbar-start">
        <RouterLink class="brand builder-brand-lockup" to="/">
          <TerraUmbraBrand />
        </RouterLink>
        <a class="builder-compendium-return" href="/compendium" target="_blank" rel="noopener">
          Compendium ↗
        </a>
      </div>

      <div class="top-actions">
        <span v-if="character" class="api-pill ok">v{{ character.version }}</span>
        <button class="ghost compact sheet-toggle" type="button" :disabled="!characterSheet" :aria-pressed="activeStep==='sheet'" @click="toggleCharacterSheet">
          {{ activeStep==='sheet' ? 'Revenir à '+(progressionMode?'la progression':'la création') : 'Fiche du personnage' }}
        </button>
        <button
          ref="knowledgeTrigger"
          class="ghost compact references-button"
          type="button"
          :aria-expanded="knowledgeOpen"
          @click="knowledgeOpen=!knowledgeOpen"
        >
          Références
          <span v-if="knowledgeRefs.length">{{ knowledgeRefs.length }}</span>
        </button>
        <RouterLink
          v-if="character"
          class="ghost compact back-link"
          :to="progressionMode ? `/characters/${character.id}/builder` : `/characters/${character.id}/progression`"
        >
          {{ progressionMode ? "Builder" : "Progression" }}
        </RouterLink>
        <RouterLink v-if="character&&progressionMode" class="ghost compact back-link" :to="`/characters/${character.id}/history`">Historique</RouterLink>
        <RouterLink class="ghost compact back-link" to="/account">Mes personnages</RouterLink>
        <button class="primary compact" type="button" :disabled="saving || loading || !dirty" @click="saveCharacter">
          {{ saving ? "Enregistrement…" : dirty ? "Enregistrer" : "Enregistré" }}
        </button>
      </div>
    </header>

    <button
      v-if="knowledgeOpen"
      class="knowledge-backdrop"
      type="button"
      aria-label="Fermer les références"
      @click="knowledgeOpen=false"
    ></button>
    <aside
      v-show="knowledgeOpen"
      ref="knowledgeDrawer"
      class="knowledge-drawer"
      :class="{ open: knowledgeOpen }"
      role="dialog"
      :aria-modal="knowledgeOpen ? true : undefined"
      aria-label="Références Compendium du personnage"
      :aria-hidden="!knowledgeOpen"
      :inert="!knowledgeOpen"
    >
      <header class="knowledge-head">
        <div>
          <p class="eyebrow">COMPENDIUM</p>
          <h2>Comprendre mes choix</h2>
          <p>Les pages de référence liées au personnage actuel, sans quitter {{ progressionMode ? "son suivi" : "la création" }}.</p>
        </div>
        <button class="ghost compact" type="button" @click="knowledgeOpen=false">Fermer</button>
      </header>

      <div v-if="!knowledgeRefs.length" class="knowledge-empty">
        {{ progressionMode ? "Les références liées au personnage apparaîtront ici automatiquement." : "Fais quelques choix dans le Builder : leurs références apparaîtront ici automatiquement." }}
      </div>

      <section v-for="group in knowledgeGroups" :key="group.name" class="knowledge-group">
        <h3>{{ group.name }}</h3>
        <article v-for="item in group.items" :key="item.key" class="knowledge-item">
          <strong v-if="item.kind.includes('Talent') || item.kind.includes('Fléau')">{{ item.label }}</strong>
          <BuilderWikiLink v-else
            :label="item.label"
            :article-id="item.articleId"
            :category="item.category"
            :detail="item.detail"
            :badges="item.badges"
          />
          <p v-if="item.detail">{{ item.detail }}</p>
        </article>
      </section>
    </aside>

    <main v-if="loading" class="builder-loading">
      Chargement de la fiche…
    </main>

    <main v-else-if="error && !draft" class="builder-loading error-state">
      <strong>Impossible d’ouvrir cette fiche.</strong>
      <span>{{ error }}</span>
      <RouterLink class="secondary back-link" to="/account">Retour à Mes personnages</RouterLink>
    </main>

    <main v-else-if="draft && character && rules && lore" class="builder-workspace">
      <aside class="builder-sidebar panel">
        <div class="builder-character">
          <div class="builder-mini-portrait" :class="{ empty: !draft.identity.portraitDataUrl }">
            <img
              v-if="draft.identity.portraitDataUrl"
              :src="draft.identity.portraitDataUrl"
              :alt="`Portrait de ${identityDisplayName || character.name}`"
            />
            <span v-else>TU</span>
          </div>
          <div>
            <p class="eyebrow">{{ progressionMode ? "SUIVI PERSONNAGE" : "PERSONNAGE" }}</p>
            <h1>{{ identityDisplayName || character.name }}</h1><p v-if="character.campaignName" class="builder-campaign-context">Campagne · {{ character.campaignName }} — cette version progresse indépendamment des autres campagnes.</p>
            <small>
              {{ originNameValue || "Origine à choisir" }} · {{ sphereNameValue || "Sphère à choisir" }}
            </small>
          </div>
        </div>

        <div v-if="!progressionMode" class="builder-progress">
          <div class="builder-progress-head">
            <span>Création</span>
            <strong>{{ builderProgress.done }}/{{ builderProgress.total }}</strong>
          </div>
          <div class="builder-progress-track" aria-hidden="true">
            <span :style="{ width: builderProgress.percent + '%' }"></span>
          </div>
          <small>{{ builderProgress.percent }}% de la fiche structurée</small>
        </div>
        <div v-else class="progression-sidebar-note">
          <strong>Progression en campagne</strong>
          <span>XP, PTV, acquisitions et évolution après la création.</span>
        </div>

        <div class="builder-quick-summary" aria-label="Résumé des ressources">
          <div><small>Edge</small><strong>{{ edgeRemaining }}/{{ edgeTotal }}</strong></div>
          <div><small>PTV</small><strong>{{ progressionMode ? (characterSheet?.ptvRemaining ?? truthPtvRemaining) : truthPtvRemaining }}</strong></div>
          <div><small>Train de vie</small><strong>{{ lifestylePressureValue?.effective || lifestyleBaseValue }}</strong></div>
          <div><small>Compte</small><strong>{{ formatMoney(Math.max(0,realityEconomyValue?.account || 0)) }}</strong></div>
        </div>

        <button
          v-if="!progressionMode"
          class="builder-mobile-steps"
          type="button"
          :aria-expanded="stepNavigationOpen"
          aria-controls="builder-step-navigation"
          @click="stepNavigationOpen=!stepNavigationOpen"
        >
          <span v-if="activeStep==='sheet'">Fiche du personnage</span><span v-else>Étape {{ activeStepIndex + 1 }} / {{ sections.length }} · {{ sections[activeStepIndex]?.[1] }}</span>
          <strong>{{ stepNavigationOpen ? "Masquer" : "Changer" }}</strong>
        </button>
        <nav v-if="!progressionMode" id="builder-step-navigation" class="builder-nav" :class="{ 'mobile-open': stepNavigationOpen }" aria-label="Étapes du Builder">
          <button
            v-for="([id,label,enabled],index) in sections"
            :key="id"
            type="button"
            :class="{ active: id === activeStep, done: enabled && stepDone(id) }"
            :disabled="!enabled"
            :aria-current="id === activeStep ? 'step' : undefined"
            @click="enabled && goToBuilderStep(id)"
          >
            <span>{{ index + 1 }}.</span>
            <strong>{{ label }}</strong>
            <small v-if="enabled">{{ stepDone(id) ? "ok" : "à compléter" }}</small>
            <small v-else>à reconstruire</small>
          </button>
        </nav>
      </aside>

      <section class="builder-main">
        <div v-if="notice || error" class="feedback" :class="{ error: !!error }" :role="error ? 'alert' : 'status'">
          {{ error || notice }}
        </div>

        <article v-if="activeStep === 'sheet' && characterSheet" class="panel builder-card sheet-view">
          <p class="sheet-save-state">{{ dirty ? 'La fiche reflète tes modifications non enregistrées.' : 'La fiche reflète les données enregistrées.' }}</p>
          <CharacterSummary :sheet="characterSheet" />
        </article>
        <article v-else-if="activeStep === 'identity'" class="panel builder-card">
          <div class="section-heading builder-heading">
            <div>
              <p class="eyebrow">01 · IDENTITÉ</p>
              <h2>Concept et identité</h2>
            </div>
            <span class="schema-badge">{{ stepDone("identity") ? "complet" : "à compléter" }}</span>
          </div>

          <p class="builder-intro">
            Commencez par la personne avant les chiffres. Le portrait est stocké avec la fiche
            après redimensionnement ; il suivra donc le personnage sur les autres navigateurs.
          </p>

          <div class="identity-layout">
            <aside class="portrait-card">
              <div class="portrait-frame" :class="{ empty: !draft.identity.portraitDataUrl }">
                <img
                  v-if="draft.identity.portraitDataUrl"
                  :src="draft.identity.portraitDataUrl"
                  :alt="`Portrait de ${identityDisplayName || 'personnage'}`"
                />
                <div v-else class="portrait-empty">
                  <strong>Portrait</strong>
                  <span>Ajoutez une image pour incarner visuellement le personnage.</span>
                </div>
              </div>

              <button class="ghost" type="button" @click="portraitInput?.click()">
                {{ draft.identity.portraitDataUrl ? "Changer le portrait" : "Choisir une image" }}
              </button>
              <input ref="portraitInput" type="file" accept="image/*" hidden @change="setPortrait" />
              <button
                v-if="draft.identity.portraitDataUrl"
                class="ghost danger"
                type="button"
                @click="removePortrait"
              >
                Retirer le portrait
              </button>
              <small>Image redimensionnée à 640 px maximum avant enregistrement.</small>
            </aside>

            <div>
              <div class="identity-grid">
                <label>
                  Nom
                  <input v-model="draft.identity.name" maxlength="120" />
                  <small class="field-help">Le nom principal sous lequel le personnage est identifié.</small>
                </label>
                <label>
                  Prénom
                  <input v-model="draft.identity.firstName" maxlength="120" />
                  <small class="field-help">Le prénom courant du personnage.</small>
                </label>
                <label>
                  Alias
                  <input v-model="draft.identity.alias" />
                  <small class="field-help">Surnom, indicatif, nom de scène, pseudonyme de réseau ou identité utilisée dans certains milieux.</small>
                </label>
                <label>
                  Occupation
                  <input v-model="draft.identity.occupation" />
                  <small class="field-help">Ce que le personnage fait aujourd’hui ; la Sphère et le Style préciseront son milieu et sa pratique de départ.</small>
                </label>
                <label>
                  Âge
                  <input v-model="draft.identity.age" />
                  <small class="field-help">Âge réel, légal ou apparent si cela a du sens pour le concept.</small>
                </label>
                <label>
                  Sexe
                  <select v-model="draft.identity.sex">
                    <option value="">— Choisir —</option>
                    <option>Femme</option><option>Homme</option><option>Non binaire</option><option>Autre</option>
                    <option v-if="draft.identity.sex && !['Femme','Homme','Non binaire','Autre'].includes(draft.identity.sex)" :value="draft.identity.sex">{{ draft.identity.sex }}</option>
                  </select>
                  <small class="field-help">Information descriptive sans conséquence mécanique.</small>
                </label>
                <label>
                  Taille
                  <input v-model="draft.identity.height" />
                  <small class="field-help">Information descriptive ; gardez l’unité qui vous convient.</small>
                </label>
                <label>
                  Poids
                  <input v-model="draft.identity.weight" />
                  <small class="field-help">Information descriptive sans conséquence mécanique.</small>
                </label>
              </div>

              <div class="narrative-grid">
                <label>
                  Concept
                  <textarea v-model="draft.identity.concept" rows="3"></textarea>
                  <small class="field-help">Une phrase qui résume l’idée du personnage : rôle, tempérament, contradiction ou image forte.</small>
                </label>
                <label>
                  Objectif
                  <textarea v-model="draft.identity.objective" rows="3"></textarea>
                  <small class="field-help">Ce que le personnage veut concrètement aujourd’hui : retrouver quelqu’un, gagner une place, payer une dette, comprendre un secret…</small>
                </label>
                <label>
                  Notes / background
                  <textarea v-model="draft.identity.notes" rows="7"></textarea>
                  <small class="field-help">Caractère, apparence, relations, histoire ou événements marquants ; inutile d’écrire une biographie complète avant de jouer.</small>
                </label>
              </div>
            </div>
          </div>
        </article>

        <article v-else-if="activeStep === 'origin'" class="panel builder-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">02 · ORIGINE</p>
              <h2>Origine sociale</h2>
            </div>
            <span class="schema-badge">{{ stepDone("origin") ? "complet" : "à compléter" }}</span>
          </div>

          <p class="builder-intro">
            L’Origine décrit le milieu dans lequel le personnage a grandi ou reçu l’essentiel
            de son éducation. Elle ne détermine pas sa Sphère actuelle.
          </p>

          <div class="rule-note">
            <strong>Ce que ce choix représente :</strong> des habitudes, des codes et un acquis durable
            de l’enfance ou de la formation initiale. Le Talent d’Origine choisi n’est pas perdu si
            le personnage change ensuite de métier, de Sphère ou de loyauté.
          </div>

          <div class="choice-grid">
            <div v-for="(origin,id) in rules.origins" :key="id" class="choice-card-shell">
              <button
                type="button"
                class="choice-card"
                :class="{ selected: draft.creation.origin === id }"
                @click="selectOrigin(String(id))"
              >
                <strong>{{ origin.name }}</strong>
                <span>{{ lore.origin[String(id)] }}</span>
              </button>
              <div class="choice-card-wiki">
                <BuilderWikiLink :label="origin.name" :article-id="origin.compendiumId" compact>
                  <span>Compendium</span>
                </BuilderWikiLink>
              </div>
            </div>
          </div>

          <div v-if="draft.creation.origin" class="subsection">
            <TalentSelector
              label="Talent d’Origine gratuit"
              placeholder="— Choisir un acquis de votre Origine —"
              :groups="[{ label: `Origine — ${rules.origins[draft.creation.origin]?.name || ''}`, items: originTalents }]"
              :model-value="draft.talents.origin"
              :selected-lore="talentNarrative(talentById(draft.talents.origin))"
              :choice-spec="talentChoiceSpec(draft.talents.origin)"
              :choice-value="talentChoiceValue(draft.talents.origin)"
              :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.origin))"
              @update:model-value="setTalent('origin',$event)"
              @update:choice-value="setTalentChoice(draft.talents.origin,$event)"
            />
          </div>
        </article>

        <article v-else-if="activeStep === 'sphere'" class="panel builder-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">03 · SPHÈRE & STYLE</p>
              <h2>Sphère actuelle & Style</h2>
            </div>
            <span class="schema-badge">Style {{ stylePointsUsed }}/5</span>
          </div>

          <p class="builder-intro">
            La Sphère décrit le milieu dans lequel vous vivez et travaillez aujourd’hui.
            Elle pose cinq Compétences fixes à +1. Le Style décrit votre pratique de départ
            et fournit cinq points guidés à répartir.
          </p>

          <div class="rule-note">
            <strong>Sphère ≠ Origine :</strong> l’Origine raconte d’où vous venez ; la Sphère raconte
            où vous vivez et travaillez aujourd’hui. <strong>Style ≠ classe :</strong> il décrit votre
            pratique de départ mais ne vous enferme pas dans une progression. L’Enveloppe augmentique
            d’un Style représente ce qui a déjà pu être investi dans le corps avant le scénario 1 :
            ce n’est pas de l’argent liquide.
          </div>

          <div class="choice-grid">
            <div v-for="(sphere,id) in rules.spheres" :key="id" class="choice-card-shell">
              <button
                type="button"
                class="choice-card sphere-card"
                :class="{ selected: draft.creation.sphere === id }"
                @click="selectSphere(String(id))"
              >
                <strong>{{ sphere.name }}</strong>
                <span>{{ lore.sphere[String(id)] }}</span>
                <small><b>5 points fixes :</b> {{ sphere.fixedSkills.map((skill)=>skillName(skill)+" +1").join(" · ") }}</small>
                <small><b>Appui :</b> {{ sphere.support }}</small>
              </button>
              <div class="choice-card-wiki">
                <BuilderWikiLink :label="sphere.name" :article-id="sphere.compendiumId" compact>
                  <span>Compendium</span>
                </BuilderWikiLink>
              </div>
            </div>
          </div>

          <template v-if="selectedSphere">
            <div class="subsection">
              <h3>Choisir le Style</h3>
              <div class="choice-grid">
                <div v-for="style in styleOptions" :key="style.id" class="choice-card-shell">
                  <button
                    type="button"
                    class="choice-card style-card"
                    :class="{ selected: draft.creation.style === style.id }"
                    @click="selectStyle(style.id)"
                  >
                    <strong>{{ style.name }}</strong>
                    <span>{{ lore.style[style.id] }}</span>
                    <small>
                      <b>Train de vie :</b> {{ style.lifestyle }} · <b>Compte :</b> {{ formatMoney(style.account) }}
                      · <b>Augmentique :</b> {{ formatMoney(style.augmentationEnvelope) }}
                      <template v-if="style.vehicleCapital"> · <b>Véhicule :</b> {{ formatMoney(style.vehicleCapital) }}</template>
                    </small>
                  </button>
                  <div class="choice-card-wiki">
                    <BuilderWikiLink :label="style.name" :article-id="style.compendiumId" compact>
                      <span>Compendium</span>
                    </BuilderWikiLink>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedStyle" class="subsection">
              <div class="subsection-title">
                <div>
                  <h3>Répartir les 5 points du Style</h3>
                  <p>Maximum +2 dans une même Compétence. Le brut de création ne peut pas dépasser 5.</p>
                </div>
                <span class="schema-badge">{{ stylePointsUsed }}/5</span>
              </div>

              <div class="allocator-grid">
                <div v-for="skillId in selectedStyle.skills" :key="skillId" class="allocator-card">
                  <div class="allocator-copy">
                    <strong>{{ skillName(skillId) }}</strong>
                    <small>Brut actuel {{ skillRaw(skillId) }}/5</small>
                    <p>{{ lore.skill[skillId] }}</p>
                  </div>
                  <div class="allocator-point-line">
                    <span>Points du Style</span>
                    <div class="stepper">
                      <button type="button" @click="changeStylePoint(skillId,-1)">−</button>
                      <strong>{{ draft.skills[skillId]?.style || 0 }}</strong>
                      <button type="button" @click="changeStylePoint(skillId,1)">+</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rule-note">
                <strong>Expertises autorisées :</strong>
                {{ selectedStyle.expertiseFamilies.map(attributeName).join(" / ") }}
                <br />
                <strong>Appui de Sphère :</strong> {{ selectedSphere.support }}
              </div>
            </div>
          </template>
        </article>

        <article v-else-if="activeStep === 'attributes'" class="panel builder-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">04 · ATTRIBUTS</p>
              <h2>Attributs</h2>
            </div>
            <span class="schema-badge">{{ attributeTotal }} / {{ attributeBudget }}</span>
          </div>

          <p class="builder-intro">
            Répartissez le budget entre les cinq Attributs. Base {{ rules.creation.attributes.baseTotal }}
            points, minimum {{ rules.creation.attributes.min }}, maximum {{ rules.creation.attributes.max }}.
            Les éventuels +2 Attributs achetés avec Edge sont attribués séparément à l’étape Edge et ne modifient jamais ce budget de 22 points.
          </p>

          <div class="attribute-grid">
            <div v-for="attribute in rules.attributes" :key="attribute.id" class="attribute-card">
              <div class="attribute-card-head">
                <strong>{{ attribute.name }}</strong>
                <span>{{ finalAttribute(attribute.id) }}/7</span>
              </div>
              <p>{{ lore.attribute[attribute.id] }}</p>
              <div class="stepper large">
                <button type="button" @click="changeAttribute(attribute.id,-1)">−</button>
                <span>{{ draft.attributes[attribute.id] }}</span>
                <button type="button" @click="changeAttribute(attribute.id,1)">+</button>
              </div>
            </div>
          </div>

          <div class="rule-note" :class="{ bad: attributeTotal !== attributeBudget }">
            <strong v-if="attributeTotal === attributeBudget">Budget entièrement réparti.</strong>
            <strong v-else-if="attributeTotal < attributeBudget">
              Il reste {{ attributeBudget - attributeTotal }} point{{ attributeBudget - attributeTotal > 1 ? "s" : "" }} à répartir.
            </strong>
            <strong v-else>
              Budget dépassé de {{ attributeTotal - attributeBudget }}.
            </strong>
          </div>
        </article>

        <article v-else-if="activeStep === 'skills'" class="panel builder-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">05 · COMPÉTENCES</p>
              <h2>Compétences libres</h2>
            </div>
            <span class="schema-badge">{{ freeSkillPointsUsed }} / {{ freeSkillBudget }}</span>
          </div>

          <p class="builder-intro">
            Les cinq points fixes de Sphère et les cinq points de Style sont déjà intégrés.
            Répartissez ici uniquement les {{ rules.creation.skills.freePoints }} points libres.
            Les éventuels points achetés avec Edge sont affichés dans les valeurs mais se répartissent
            à l’étape Edge. Le Brut ne peut pas dépasser {{ rules.creation.skills.rawMax }} à la création.
          </p>

          <div v-if="!selectedStyle" class="rule-note bad">
            Choisissez d’abord une Sphère et un Style.
          </div>

          <template v-else>
            <div v-if="edgeSkillBudget > 0" class="rule-note">
              <strong>Edge déjà acheté :</strong> {{ edgeSkillPointsUsed }} / {{ edgeSkillBudget }}
              point{{ edgeSkillBudget > 1 ? "s" : "" }} attribué{{ edgeSkillPointsUsed > 1 ? "s" : "" }}.
              Cette enveloppe sera modifiable uniquement au bloc Edge.
            </div>

            <details
              v-for="(attribute,index) in rules.attributes"
              :key="attribute.id"
              class="skill-family skill-group"
              :open="skillGroupIsOpen(attribute.id,index)"
              @toggle="setSkillGroupOpen(attribute.id,$event)"
            >
              <summary>
                <span>
                  <strong>{{ attribute.name }}</strong>
                  <small>{{ rules.skills.filter((item)=>item.attribute===attribute.id).length }} Compétences</small>
                </span>
                <span class="schema-badge">{{ skillFreePointsForAttribute(attribute.id) }} point{{ skillFreePointsForAttribute(attribute.id) > 1 ? 's' : '' }} attribué{{ skillFreePointsForAttribute(attribute.id) > 1 ? 's' : '' }} ici</span>
              </summary>
              <div class="skill-grid">
                <div
                  v-for="skill in rules.skills.filter((item)=>item.attribute===attribute.id)"
                  :key="skill.id"
                  class="skill-card"
                >
                  <div class="skill-head">
                    <strong>{{ skill.name }}</strong>
                    <span>
                      {{ skillRaw(skill.id) }}/{{ rules.creation.skills.rawMax }}
                      <template v-if="skillTalentBonus(skill.id)"> · final {{ skillFinal(skill.id) }}</template>
                    </span>
                  </div>

                  <p class="skill-lore">{{ lore.skill[skill.id] }}</p>

                  <div class="skill-free-line">
                    <span>Points libres</span>
                    <div class="stepper">
                      <button type="button" @click="changeFreeSkillPoint(skill.id,-1)">−</button>
                      <strong>{{ draft.skills[skill.id]?.free || 0 }}</strong>
                      <button type="button" @click="changeFreeSkillPoint(skill.id,1)">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </details>

            <div class="rule-note" :class="{ bad: freeSkillPointsUsed !== freeSkillBudget }">
              <strong v-if="freeSkillPointsUsed === freeSkillBudget">
                Tous les points libres sont répartis.
              </strong>
              <strong v-else-if="freeSkillPointsUsed < freeSkillBudget">
                Il reste {{ freeSkillBudget - freeSkillPointsUsed }} point{{ freeSkillBudget - freeSkillPointsUsed > 1 ? "s" : "" }} libre{{ freeSkillBudget - freeSkillPointsUsed > 1 ? "s" : "" }}.
              </strong>
              <strong v-else>
                Budget dépassé de {{ freeSkillPointsUsed - freeSkillBudget }}.
              </strong>
            </div>
          </template>
        </article>

        <article v-else-if="activeStep === 'talents'" class="panel builder-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">06 · TALENTS</p>
              <h2>Talents de Réalité</h2>
            </div>
            <span class="schema-badge">{{ stepDone("talents") ? "complet" : "à compléter" }}</span>
          </div>

          <p class="builder-intro">
            Choisissez un Talent gratuit pour chacune des quatre provenances de création.
            Les Talents d’Expertise proposés sont limités aux deux familles ouvertes par votre Style.
            Les précisions et choix secondaires sont enregistrés avec la fiche.
          </p>

          <div v-if="!draft.creation.origin || !draft.creation.sphere || !selectedStyle" class="rule-note bad">
            Choisissez d’abord Origine, Sphère et Style.
          </div>

          <template v-else>
            <TalentSelector
              label="Talent d’Origine"
              placeholder="— Choisir le Talent d’Origine —"
              :groups="[{ label: `Origine — ${rules.origins[draft.creation.origin]?.name || ''}`, items: originTalents }]"
              :model-value="draft.talents.origin"
              :selected-lore="talentNarrative(talentById(draft.talents.origin))"
              :choice-spec="talentChoiceSpec(draft.talents.origin)"
              :choice-value="talentChoiceValue(draft.talents.origin)"
              :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.origin))"
              @update:model-value="setTalent('origin',$event)"
              @update:choice-value="setTalentChoice(draft.talents.origin,$event)"
            />

            <TalentSelector
              label="Talent de Sphère"
              placeholder="— Choisir le Talent de Sphère —"
              :groups="[{ label: `Sphère — ${rules.spheres[draft.creation.sphere]?.name || ''}`, items: sphereTalents }]"
              :model-value="draft.talents.sphere"
              :selected-lore="talentNarrative(talentById(draft.talents.sphere))"
              :choice-spec="talentChoiceSpec(draft.talents.sphere)"
              :choice-value="talentChoiceValue(draft.talents.sphere)"
              :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.sphere))"
              @update:model-value="setTalent('sphere',$event)"
              @update:choice-value="setTalentChoice(draft.talents.sphere,$event)"
            />

            <TalentSelector
              label="Talent d’Expertise"
              placeholder="— Choisir une Expertise —"
              :groups="selectedStyle.expertiseFamilies.map((attribute)=>({
                label: attributeName(attribute),
                items: expertiseTalents.filter((talent)=>talent.attribute===attribute)
              }))"
              :model-value="draft.talents.expertise"
              :selected-lore="talentNarrative(talentById(draft.talents.expertise))"
              :choice-spec="talentChoiceSpec(draft.talents.expertise)"
              :choice-value="talentChoiceValue(draft.talents.expertise)"
              :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.expertise))"
              @update:model-value="setTalent('expertise',$event)"
              @update:choice-value="setTalentChoice(draft.talents.expertise,$event)"
            />

            <TalentSelector
              label="Talent Commun"
              placeholder="— Choisir un Talent Commun —"
              :groups="[{ label: 'Communs', items: commonTalents }]"
              :model-value="draft.talents.common"
              :selected-lore="talentNarrative(talentById(draft.talents.common))"
              :choice-spec="talentChoiceSpec(draft.talents.common)"
              :choice-value="talentChoiceValue(draft.talents.common)"
              :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.common))"
              @update:model-value="setTalent('common',$event)"
              @update:choice-value="setTalentChoice(draft.talents.common,$event)"
            />

            <div v-if="draft.talents.expertise === 'neurodriver' && skillRaw('neurodive') < 1" class="rule-note bad">
              Neurodriver exige Neurodive 1+.
            </div>

            <div v-if="Number(draft.edge.talentPacks || 0) > 0" class="rule-note">
              <strong>Talents achetés avec Edge :</strong>
              ils restent enregistrés dans la fiche importée et seront configurés nativement à l’étape Edge.
            </div>
          </template>
        </article>

        <article v-else-if="activeStep === 'truth'" class="panel builder-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">07 · VÉRITÉ</p>
              <h2>Nature & Vérité</h2>
            </div>
            <span class="schema-badge">
              {{ truthPtvRemaining }} / {{ truthRules?.structure.ptvInitial || 0 }} PTV restant
            </span>
          </div>

          <p class="builder-intro">
            La Nature décrit ce que le personnage est réellement derrière le Voile. Les choix
            structurels ouvrent uniquement les branches qui lui appartiennent ; les Traits gratuits
            sont accordés automatiquement et les Talents de Vérité consomment les PTV de création.
          </p>

          <div v-if="!truthRules || !currentTruthState" class="rule-note" :class="{ bad: !supplementalLoading }">
            {{ supplementalLoading ? "Chargement des règles de Vérité…" : "Règles de Vérité indisponibles." }}
          </div>

          <template v-else>
            <section class="truth-picker">
              <div class="truth-picker-grid">
                <label>
                  <span>Nature</span>
                  <div class="v1-select-shell">
                    <select
                      :value="currentTruthState.nature"
                      @change="setTruthNature(($event.target as HTMLSelectElement).value)"
                    >
                      <option
                        v-for="nature in Object.values(truthRules.structure.natures)"
                        :key="nature.id"
                        :value="nature.id"
                        :title="nature.description"
                      >
                        {{ nature.name }}
                      </option>
                    </select>
                  </div>
                </label>

                <label>
                  <span>Conscience</span>
                  <div class="v1-select-shell">
                    <select
                      ref="truthConsciousnessInput"
                      :value="currentTruthState.consciousness"
                      @change="setTruthConsciousness(($event.target as HTMLSelectElement).value)"
                    >
                      <option
                        v-for="entry in truthRules.structure.consciousness"
                        :key="entry.id"
                        :value="entry.id"
                        :title="truthConsciousnessHelp(entry.id)"
                      >
                        {{ entry.name }}
                      </option>
                    </select>
                  </div>
                  <small class="field-help">{{ truthConsciousnessHelp(currentTruthState.consciousness) }}</small>
                </label>
              </div>

              <article v-if="selectedTruthNature" class="truth-nature-summary">
                <div class="truth-nature-summary-copy">
                  <p class="eyebrow">NATURE</p>
                  <h3>
                    <BuilderWikiLink
                      :label="selectedTruthNature.name"
                      :article-id="selectedTruthNature.compendiumId"
                      category="Vérité"
                    />
                  </h3>
                  <p>{{ selectedTruthNature.description }}</p>
                  <small v-if="currentTruthState.consciousness === 'profane'">
                    Profane : les PTV restent en réserve tant que le personnage n’est pas Initié.
                  </small>
                  <small v-else>
                    Initié : les branches réellement ouvertes par cette Nature sont accessibles.
                  </small>
                </div>
                <div class="truth-reserve">
                  <strong>{{ truthPtvRemaining }}</strong>
                  <span>PTV en réserve</span>
                </div>
              </article>
            </section>

            <template v-if="selectedTruthNature">
              <section v-if="selectedTruthNature.choices.length" class="truth-choice-section">
                <div class="subsection-title">
                  <div>
                    <h3>Choix structurels</h3>
                    <p>Ces choix déterminent les branches, traditions, lignées ou écoles réellement accessibles.</p>
                  </div>
                  <span class="schema-badge">{{ truthChoicesValid(truthRules,currentTruthState) ? "complet" : "à compléter" }}</span>
                </div>

                <div class="truth-choice-grid">
                  <label v-for="choice in selectedTruthNature.choices" :key="choice.key" class="truth-choice-field">
                    <span>
                      <strong>{{ choice.label }}</strong>
                      <small v-if="choice.optional">optionnel</small>
                    </span>
                    <div class="v1-select-shell">
                      <select
                        :value="truthChoiceValue(choice)"
                        @change="setTruthChoice(choice.key,($event.target as HTMLSelectElement).value)"
                      >
                        <option value="">{{ choice.optional ? "— Aucun —" : "— Choisir —" }}</option>
                        <option
                          v-for="option in resolvedTruthChoiceOptions(choice)"
                          :key="option.id"
                          :value="option.id"
                          :title="option.description || ''"
                        >
                          {{ option.name }}
                        </option>
                      </select>
                    </div>
                    <em v-if="selectedTruthChoice(choice)?.description">
                      {{ selectedTruthChoice(choice)?.description }}
                    </em>
                    <em v-if="choice.key === 'dominantAffinity'">L’Affinité dominante est le domaine magique que le Mage maîtrise en premier. Par exemple, la Photomancie agit sur la lumière.</em>
                    <em v-else-if="choice.dependsOn && !String(currentTruthState.choices[choice.dependsOn] || '')">
                      Choisissez d’abord {{ selectedTruthNature.choices.find(item=>item.key===choice.dependsOn)?.label || choice.dependsOn }}.
                    </em>
                  </label>
                </div>
              </section>

              <details v-if="truthRevealProfile" class="truth-reveal-section">
                <summary class="truth-disclosure-summary"><span><strong>Voile & Révélation</strong><small>Profils de manifestation</small></span><span class="schema-badge">{{ truthRevealProfile.label }}</span></summary>
                <p class="truth-disclosure-intro">
                  Chaque état détermine ce que la Nature matérialise réellement et quelles
                  capacités peuvent fonctionner. Le profil Révélé remplace toujours le
                  Semi-Révélé : les deux ne se cumulent jamais.
                </p>

                <div class="truth-reveal-grid">
                  <article
                    v-for="stage in (['v','sr','r'] as const)"
                    :key="stage"
                    class="truth-reveal-card"
                  >
                    <div class="truth-reveal-head">
                      <strong>{{ truthRevealProfile.stages[stage].name }}</strong>
                      <span>{{ truthRevealProfile.stages[stage].code }}</span>
                    </div>
                    <div class="truth-reveal-stats">
                      {{ truthRevealProfile.stats[stage] }}
                    </div>
                    <p>{{ truthRevealProfile.body[stage] }}</p>
                    <div
                      v-if="truthRevealProfile.stages[stage].traits.length"
                      class="truth-reveal-traits"
                    >
                      <small>Capacités de Nature accessibles</small>
                      <span
                        v-for="trait in truthRevealProfile.stages[stage].traits"
                        :key="`${stage}:${trait.name}:${trait.source || ''}`"
                      >
                        {{ trait.name }}
                      </span>
                    </div>
                  </article>
                </div>

                <div v-if="truthRevealProfile.vigorAffectsPv" class="rule-note">
                  <strong>Vigueur et PV :</strong>
                  lorsqu’un état ou une forme modifie la Vigueur, le maximum et les PV actuels
                  varient immédiatement de
                  {{ truthRevealProfile.rules.vigorPvMultiplier }} × cette variation.
                  Changer de forme ne soigne jamais les blessures déjà subies.
                </div>
              </details>

              <details v-if="selectedTruthFreeTraits.length" class="truth-free-section">
                <summary class="truth-disclosure-summary"><span><strong>Traits gratuits de Vérité</strong><small>Acquis automatiques de la Nature</small></span><span class="schema-badge">{{ selectedTruthFreeTraits.length }}</span></summary>
                <p class="truth-disclosure-intro">
                  Ils découlent directement de la Nature et des choix structurels. Ils ne coûtent aucun PTV.
                </p>

                <div class="truth-free-grid">
                  <article
                    v-for="trait in selectedTruthFreeTraits"
                    :key="`${trait.name}:${trait.source || ''}:${trait.effect}`"
                    class="truth-free-card"
                  >
                    <div class="truth-talent-head">
                      <strong>{{ trait.name }}</strong>
                      <span>{{ trait.access || "Gratuit" }}</span>
                    </div>
                    <small v-if="trait.source">{{ trait.source }}</small>
                    <p>{{ trait.effect }}</p>
                  </article>
                </div>
              </details>

              <section class="truth-talents-section">
                <div class="subsection-title">
                  <div>
                    <h3>Talents de Vérité</h3>
                    <p>
                      Seuls les Talents compatibles avec la Nature et les choix ci-dessus sont proposés.
                      Retirer un prérequis retire aussi automatiquement les Talents qui en dépendent.
                    </p>
                  </div>
                  <span class="schema-badge">
                    {{ truthPtvSpentValue }} / {{ truthRules.structure.ptvInitial }} PTV
                  </span>
                </div>

                <div v-if="currentTruthState.consciousness === 'profane'" class="rule-note">
                  <strong>Profane :</strong> aucun Talent de Vérité n’est achetable. Les PTV restent disponibles
                  tant que le personnage n’est pas Initié.
                </div>

                <div
                  v-else-if="!truthChoicesValid(truthRules,currentTruthState)"
                  class="rule-note bad"
                >
                  Complétez d’abord les choix structurels obligatoires de cette Nature.
                </div>

                <template v-else>
                  <label class="truth-search">
                    Catégorie de talents
                    <select v-model="truthGroupChoice"><option value="">— Choisir une catégorie —</option><option v-for="group in truthGroupOptions" :key="group.name" :value="group.name">{{ group.name }} · {{ group.items.length }}</option></select>
                  </label>
                  <label class="truth-search">
                    Rechercher dans les Talents accessibles
                    <input
                      v-model="truthSearch"
                      type="search"
                      placeholder="Nom, groupe, effet, prérequis…"
                    />
                  </label>

                  <div v-if="!visibleTruthGroups.length" class="rule-note">
                    {{ !truthGroupChoice&&!truthSearch ? 'Choisis une catégorie pour voir les cartes de ses Talents, ou recherche un Talent par son nom.' : 'Aucun Talent ne correspond aux choix actuels ou à la recherche.' }}
                  </div>

                  <details
                    v-for="group in visibleTruthGroups"
                    :key="group.name"
                    class="truth-group"
                    :open="group.items.some(talent=>truthTalentSelected(talent.id))"
                  >
                    <summary>
                      <span>
                        <strong>{{ group.name }}</strong>
                        <small>{{ group.items.length }} Talent{{ group.items.length > 1 ? "s" : "" }}</small>
                      </span>
                    </summary>

                    <div class="truth-talent-grid">
                      <div
                        v-for="talent in group.items"
                        :key="talent.id"
                        class="truth-talent-entry"
                      >
                        <button
                          type="button"
                          class="truth-talent-card"
                          :class="{ selected: truthTalentSelected(talent.id) }"
                          :disabled="!truthTalentSelected(talent.id) && !truthTalentCanAdd(talent)"
                          @click="toggleTruthTalent(talent)"
                        >
                          <BuilderCatalogImage :article-id="talent.compendiumId" :name="talent.name" category="Règles" />
                          <div class="truth-talent-head">
                            <strong>{{ talent.name }}</strong>
                            <span>{{ talent.cost }} PTV</span>
                          </div>
                          <div class="truth-talent-meta">
                            <span v-if="talent.access">{{ talent.access }}</span>
                            <span v-if="talent.prerequisiteName">
                              Prérequis : {{ talent.prerequisiteName }}
                              <template v-if="!truthTalentPrereqOk(talent)"> · non rempli</template>
                            </span>
                          </div>
                          <em v-if="talent.runtimeLore">{{ talent.runtimeLore }}</em>
                          <p><b>Effet :</b> {{ talent.effect }}</p>
                        </button>
                      </div>
                    </div>
                  </details>
                </template>
              </section>

              <TruthEquipmentPanel
                :model-value="currentTruthState"
                :rules="truthRules"
                @update:model-value="writeTruthState($event)"
              />

              <CorruptionPanel
                :model-value="currentTruthState"
                :rules="truthRules"
                :integrity="derivedStats.integrity"
                :ptv-remaining="truthPtvRemaining"
                @update:model-value="writeTruthState($event)"
                @request-initiation="focusTruthConsciousness"
              />

              <div class="rule-note" :class="{ bad: !stepDone('truth') }">
                <strong v-if="stepDone('truth')">Vérité cohérente.</strong>
                <strong v-else>Vérité à compléter.</strong>
                {{ truthPtvRemaining }} PTV restent disponibles à la création.
              </div>
            </template>
          </template>
        </article>

        <article v-else-if="activeStep === 'disadvantages'" class="panel builder-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">08 · DÉSAVANTAGES</p>
              <h2>Désavantages</h2>
            </div>
            <span class="schema-badge">{{ draft.disadvantages.length }}/3 · Edge {{ edgeTotal }}</span>
          </div>

          <p class="builder-intro">
            Les Désavantages sont facultatifs, de 0 à 3. Chacun rapporte +1 Edge, mais doit
            représenter une faiblesse ou une complication qui peut réellement peser dans la fiction.
          </p>

          <div v-if="!disadvantages" class="rule-note bad">Catalogue indisponible.</div>

          <template v-else>
            <div class="disadvantage-controls">
              <label>
                <span>Famille de Désavantage</span>
                <select v-model="disadvantageCategory" @change="disadvantagePick=''">
                  <option v-for="category in disadvantageCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </label>

              <label>
                <span>Désavantage</span>
                <div class="v1-select-shell">
                  <select v-model="disadvantagePick" :disabled="draft.disadvantages.length >= 3">
                    <option value="">— Choisir —</option>
                    <option
                      v-for="item in availableDisadvantages"
                      :key="item.id"
                      :value="item.id"
                      :title="`Ambiance : ${disadvantageNarrative(item)}\nMécanique : ${item.effect}`"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </div>
              </label>

              <button
                class="secondary compact disadvantage-add"
                type="button"
                :disabled="!disadvantagePick || draft.disadvantages.length >= 3"
                @click="addDisadvantagePick"
              >
                Ajouter le Désavantage
              </button>
            </div>

            <article v-if="disadvantagePreview" class="choice-preview">
              <div>
                <strong>{{ disadvantagePreview.name }}</strong>
                <span>Prévisualisation — pas encore ajouté</span>
              </div>
              <em>{{ disadvantageNarrative(disadvantagePreview) }}</em>
              <p><b>Effet mécanique :</b> {{ disadvantagePreview.effect }}</p>
            </article>

            <div v-if="draft.disadvantages.length" class="selected-disadvantage-list">
              <article
                v-for="item in selectedDisadvantageItems()"
                :key="`${item.sphere || item.category}:${item.id}`"
                class="selected-disadvantage-card"
              >
                <div class="selected-disadvantage-head">
                  <div>
                    <strong>{{ item.name }}</strong>
                    <small v-if="item.category === 'sphere'">Sphère — {{ selectedSphere?.name || item.sphere }}</small>
                    <small v-else-if="item.category === 'attribute'">Faiblesse de {{ attributeName(item.attribute || "") }}</small>
                    <small v-else>Commun</small>
                  </div>
                  <button class="ghost danger compact" type="button" @click="toggleDisadvantage(item.id)">
                    Retirer
                  </button>
                </div>
                <em>{{ disadvantageNarrative(item) }}</em>
                <p><b>Effet mécanique :</b> {{ item.effect }}</p>
                <BuilderWikiLink :label="item.name" :article-id="item.compendiumId" category="Règles" compact>
                  <span>Compendium</span>
                </BuilderWikiLink>
              </article>
            </div>
            <div v-else class="disadvantage-empty">
              Aucun Désavantage choisi.
            </div>

            <div v-if="!disadvantagesCompatible()" class="rule-note bad">
              Une combinaison choisie se neutralise ou est incompatible avec un Talent :
              vérifiez notamment Résistance/Sensible à la chaleur ou au froid, Brave/Lâche
              et Neurodriver/Unsinkable.
            </div>
          </template>
        </article>

        <article v-else-if="activeStep === 'edge'" class="panel builder-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">09 · EDGE</p>
              <h2>Edge</h2>
            </div>
            <span class="schema-badge">{{ edgeRemaining }} restant / {{ edgeTotal }}</span>
          </div>

          <p class="builder-intro">
            Vous commencez avec {{ edgeRules?.base || 5 }} Edge, plus 1 par Désavantage.
            Ce qui n’est pas dépensé à la création reste disponible en jeu. L’Edge ne peut jamais acheter de PTV.
          </p>

          <div v-if="!edgeRules" class="rule-note bad">Règles Edge indisponibles.</div>

          <template v-else>
            <div class="edge-grid">
              <section v-for="option in edgeOptionUi" :key="option.key" class="edge-card">
                <div class="edge-card-head">
                  <strong>{{ option.label }}</strong>
                  <span>{{ Number(draft.edge[option.key] || 0) }}/{{ edgeRules.options[option.key]?.max || 0 }}</span>
                </div>
                <em>{{ edgeRules.lore[option.key]?.lore }}</em>
                <p>{{ edgeRules.lore[option.key]?.mechanic }}</p>
                <div v-if="edgeOptionResult(option.key)" class="edge-result">
                  {{ edgeOptionResult(option.key) }}
                </div>
                <div class="stepper">
                  <button
                    type="button"
                    :disabled="edgePurchaseMinusDisabled(option.key)"
                    @click="changeEdgePurchase(option.key,-1)"
                  >−</button>
                  <strong>{{ Number(draft.edge[option.key] || 0) }}</strong>
                  <button
                    type="button"
                    :disabled="edgePurchasePlusDisabled(option.key)"
                    @click="changeEdgePurchase(option.key,1)"
                  >+</button>
                </div>
              </section>
            </div>

            <div v-if="hasUnknownDisadvantage" class="rule-note">
              <strong>Inconnu :</strong> Renommée initiale 0 et achat de Renommée interdit à la création.
            </div>
            <div v-if="hasRenownedTalent" class="rule-note">
              <strong>Renommé :</strong> la Renommée initiale est déjà fixée à 2 ; acheter +1 Renommée par Edge serait sans effet.
            </div>

            <section v-if="Number(draft.edge.attributePack || 0) > 0" class="edge-allocation">
              <div class="subsection-title">
                <div>
                  <h3>Attribuer les +2 Attributs</h3>
                  <p>Ces points sont séparés du budget de base de 22 et le plafond final reste 7.</p>
                </div>
                <span class="schema-badge">{{ edgeAttributePointsUsed }}/{{ edgeAttributeBudget }}</span>
              </div>
              <div class="edge-five-grid">
                <div v-for="attribute in rules.attributes" :key="attribute.id" class="edge-alloc-card">
                  <div class="edge-card-head">
                    <strong>{{ attribute.name }}</strong>
                    <span>{{ finalAttribute(attribute.id) }}/7</span>
                  </div>
                  <p>{{ lore.attribute[attribute.id] }}</p>
                  <div class="stepper">
                    <button type="button" @click="changeEdgeAttribute(attribute.id,-1)">−</button>
                    <strong>+{{ Number(draft.edgeAttributes[attribute.id] || 0) }}</strong>
                    <button type="button" @click="changeEdgeAttribute(attribute.id,1)">+</button>
                  </div>
                </div>
              </div>
            </section>

            <section v-if="Number(draft.edge.skillPacks || 0) > 0" class="edge-allocation">
              <div class="subsection-title">
                <div>
                  <h3>Attribuer les points de Compétence Edge</h3>
                  <p>{{ draft.edge.skillPacks }} achat(s) donnent {{ edgeSkillBudget }} points, sans dépasser 5 brut.</p>
                </div>
                <span class="schema-badge">{{ edgeSkillPointsUsed }}/{{ edgeSkillBudget }}</span>
              </div>

              <details
                v-for="attribute in rules.attributes"
                :key="attribute.id"
                class="edge-skill-group"
                :open="edgeSkillPointsForAttribute(attribute.id) > 0"
              >
                <summary>
                  <span>
                    <strong>{{ attribute.name }}</strong>
                    <small>Compétences liées à cet Attribut</small>
                  </span>
                  <span class="schema-badge">{{ edgeSkillPointsForAttribute(attribute.id) }} Edge</span>
                </summary>
                <div class="edge-five-grid">
                  <div
                    v-for="skill in edgeSkillsForAttribute(attribute.id)"
                    :key="skill.id"
                    class="edge-alloc-card"
                  >
                    <div class="edge-card-head">
                      <strong>{{ skill.name }}</strong>
                      <span>{{ skillRaw(skill.id) }}/5</span>
                    </div>
                    <p>{{ lore.skill[skill.id] }}</p>
                    <div class="stepper">
                      <button type="button" @click="changeEdgeSkill(skill.id,-1)">−</button>
                      <strong>+{{ Number(draft.skills[skill.id]?.edge || 0) }}</strong>
                      <button type="button" @click="changeEdgeSkill(skill.id,1)">+</button>
                    </div>
                  </div>
                </div>
              </details>
            </section>

            <section v-if="Number(draft.edge.talentPacks || 0) > 0" class="edge-allocation">
              <div class="subsection-title">
                <div>
                  <h3>Choisir les Talents achetés avec Edge</h3>
                  <p>Une Expertise achetée avec Edge n’est pas limitée aux familles du Style.</p>
                </div>
                <span class="schema-badge">
                  {{ draft.talents.edge.filter(Boolean).length }}/{{ draft.edge.talentPacks }}
                </span>
              </div>

              <TalentSelector
                v-for="(_,index) in draft.talents.edge"
                :key="index"
                :label="`Talent Edge ${index + 1}`"
                placeholder="— Choisir un Talent —"
                :groups="edgeTalentGroupsFor(index)"
                :model-value="draft.talents.edge[index] || ''"
                :selected-lore="talentNarrative(talentById(draft.talents.edge[index] || ''))"
                :choice-spec="talentChoiceSpec(draft.talents.edge[index] || '')"
                :choice-value="talentChoiceValue(draft.talents.edge[index] || '')"
                :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.edge[index] || ''))"
                @update:model-value="setEdgeTalent(index,$event)"
                @update:choice-value="setTalentChoice(draft.talents.edge[index] || '', $event)"
              />
            </section>

            <div class="rule-note" :class="{ bad: !stepDone('edge') }">
              <strong>Edge conservé : {{ edgeRemaining }}.</strong>
              <template v-if="!stepDone('edge')">
                Terminez les allocations correspondant aux achats effectués et corrigez les incompatibilités éventuelles.
              </template>
              <template v-else>
                Le reliquat pourra notamment servir à Forcer le Destin ou Échapper au Destin.
              </template>
            </div>
          </template>
        </article>

        <article
          v-else-if="activeStep === 'equipment' && !realityRules"
          class="panel builder-card"
        >
          <p class="eyebrow">10 · ÉQUIPEMENT</p>
          <h2>Chargement du catalogue…</h2>
          <p class="builder-intro">La fiche est déjà disponible ; le catalogue Réalité termine son chargement en arrière-plan.</p>
        </article>

        <EquipmentStep
          v-else-if="activeStep === 'equipment' && realityRules"
          class="panel builder-card"
          :model-value="draft.reality"
          :rules="realityRules"
          :style="selectedStyle"
          :edge="draft.edge"
          :talent-ids="selectedRealityTalentIds()"
          :disadvantages="draft.disadvantages"
          :neurodive-raw="skillRaw('neurodive')"
          :sphere-id="draft.creation.sphere"
          :integrity="derivedStats.integrity"
          :augment-stress-max="derivedStats.augmentStressMax"
          :valid="equipmentValidation"
          @update:model-value="draft.reality=$event"
        />

        <FinalizationStep
          v-else-if="activeStep === 'finish'"
          class="panel builder-card"
          :social="draft.social"
          :sphere-id="draft.creation.sphere"
          :required-language-count="requiredLanguageCount"
          :statuses="finalValidationStatuses"
          :valid="stepDone('finish')"
          :sheet="characterSheet"
          :renown-score="renownScore"
          @update:social="draft.social=$event"
          @navigate="navigateFromFinalization"
        />

        <article
          v-else-if="activeStep === 'progression' && supplementalLoading"
          class="panel builder-card"
        >
          <p class="eyebrow">PROGRESSION</p>
          <h2>Chargement des catalogues…</h2>
          <p class="builder-intro">La progression sera disponible dès que les règles Vérité et Réalité auront fini de charger.</p>
        </article>

        <template v-else-if="activeStep === 'progression' && truthRules && realityRules && currentTruthState">
          <section v-if="characterSheet" class="panel progression-sheet-preview" aria-label="Aperçu de la fiche actuelle">
            <div><p class="eyebrow">FICHE ACTUELLE</p><h2>{{ characterSheet.name }}</h2><p>PV max. <strong>{{ characterSheet.derived.pvMax }}</strong> · Défense <strong>{{ characterSheet.derived.passiveDefense }}</strong> · Intégrité <strong>{{ characterSheet.derived.integrity }}</strong></p></div>
            <button type="button" class="ghost" @click="toggleCharacterSheet">Consulter la fiche complète</button>
          </section>
        <ProgressionStep
          class="panel builder-card"
          :talent-lore="{...lore?.originTalent,...lore?.sphereTalent,...lore?.talent}"
          :progression="draft.progression"
          :reality="draft.reality"
          :truth-state="currentTruthState"
          :rules="rules"
          :truth-rules="truthRules"
          :reality-rules="realityRules"
          :style="selectedStyle"
          :edge="draft.edge"
          :sphere-id="draft.creation.sphere"
          :sphere-name="sphereNameValue"
          :creation-talent-ids="selectedRealityTalentIds()"
          :skill-talent-map="skillTalentMap"
          :disadvantages="draft.disadvantages"
          :skill-bases="progressionSkillBases"
          :skill-final-bases="progressionSkillFinalBases"
          :attribute-bases="progressionAttributeBases"
          :creation-ptv-reserve="Math.max(0,truthPtvRemaining)"
          :creation-account="Math.max(0,realityEconomyValue?.account || 0)"
          @update:progression="draft.progression=$event"
          @update:reality="draft.reality=$event"
          @update:truth="writeTruthState($event)"
        />
        </template>

        <article v-else class="panel builder-card">
          <p class="eyebrow">BUILDER V2</p>
          <h2>Bloc indisponible</h2>
          <p class="builder-intro">
            Le bloc demandé n’a pas pu être initialisé. Recharge la fiche ; si le problème
            persiste, le message d’erreur affiché en haut du Builder permettra de l’identifier.
          </p>
        </article>

        <nav v-if="!progressionMode && activeStep!=='sheet'" class="builder-step-controls" aria-label="Navigation entre les étapes">
          <button
            v-if="previousBuilderStep"
            class="ghost"
            type="button"
            @click="goToBuilderStep(previousBuilderStep.id)"
          >
            ← Précédent
            <small>{{ previousBuilderStep.label }}</small>
          </button>
          <span v-else></span>
          <button
            v-if="nextBuilderStep"
            class="primary"
            type="button"
            @click="goToBuilderStep(nextBuilderStep.id)"
          >
            <span>Suivant →</span>
            <small>{{ nextBuilderStep.label }}</small>
          </button>
        </nav>
      </section>
    </main>
  </div>
</template>

<style scoped>

.builder-v2-shell{min-height:100vh}
.sheet-save-state{margin:0 0 22px;color:#a8bfd2;font-size:13px;line-height:1.6}
.progression-sheet-preview{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:24px;margin-bottom:24px;background:linear-gradient(110deg,#142937,#101d30);border-color:#36576d}
.progression-sheet-preview h2{margin:6px 0;font-size:23px;overflow-wrap:anywhere}.progression-sheet-preview p{margin:0;color:#adc4d7;line-height:1.7}.progression-sheet-preview strong{color:#9ce5f4}.progression-sheet-preview button{min-height:44px}
@media(max-width:650px){.progression-sheet-preview{align-items:stretch;flex-direction:column;padding:20px}.progression-sheet-preview button{white-space:normal}}

.references-button{display:inline-flex;align-items:center;gap:.4rem}
.references-button span{display:grid;place-items:center;min-width:1.2rem;height:1.2rem;padding:0 .25rem;border:1px solid rgba(100,222,245,.25);color:#c5ddf3;font-size:.8125rem}
.knowledge-backdrop{position:fixed;inset:0;z-index:39;border:0;background:rgba(0,0,0,.48);backdrop-filter:blur(2px)}
.knowledge-drawer{visibility:hidden;position:fixed;top:0;right:0;z-index:40;width:min(440px,92vw);height:100dvh;padding:1.5rem;overflow:auto;border-left:1px solid rgba(70,126,148,.18);background:#0c1727;box-shadow:-24px 0 70px rgba(0,0,0,.38);transform:translateX(104%);opacity:0;transition:transform .24s cubic-bezier(.2,.7,.2,1),opacity .18s ease;pointer-events:none}
.knowledge-drawer.open{visibility:visible;transform:none;opacity:1;pointer-events:auto}
.knowledge-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:.45rem 0 1rem;border-bottom:1px solid #25374c}
.knowledge-head h2{margin:.15rem 0 .35rem;font:500 1.6rem/1.1 Inter,"Segoe UI",sans-serif}
.knowledge-head p:not(.eyebrow){margin:0;color:#a1b5cc;font-size:.8125rem;line-height:1.5}
.knowledge-empty{margin-top:1rem;padding:1rem;border:1px dashed rgba(255,255,255,.12);color:#a1b5cc;line-height:1.55}
.knowledge-group{padding:1rem 0;border-bottom:1px solid rgba(255,255,255,.07)}
.knowledge-group h3{margin:0 0 .55rem;color:#b1cbe3;font-size:.8125rem;letter-spacing:.08em;text-transform:uppercase}
.knowledge-item{padding:.65rem 0}
.knowledge-item+.knowledge-item{border-top:1px solid rgba(255,255,255,.045)}
.knowledge-item>p{margin:.3rem 0 0;color:#a1b5cc;font-size:.8125rem;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.builder-topbar{position:sticky}
.builder-topbar-start{display:flex;align-items:center;gap:1rem;min-width:0}
.builder-compendium-return{display:inline-flex;align-items:center;min-height:34px;padding:.4rem .7rem;border-left:1px solid rgba(100,222,245,.2);color:#6fcff1;font-size:.8125rem;font-weight:700;text-decoration:none;letter-spacing:.03em}
.builder-compendium-return:hover{color:#edf4ff}
.back-link{text-decoration:none;display:inline-flex;align-items:center}
.builder-loading{min-height:calc(100vh - 74px);display:grid;place-content:center;gap:1rem;color:#b3c5d9;text-align:center}
.error-state strong{color:#e2b0aa}
.builder-workspace{width:min(1640px,calc(100% - clamp(24px,4vw,80px)));margin:0 auto;padding:2rem 0 5rem;display:grid;grid-template-columns:264px minmax(0,1fr);gap:1.25rem;align-items:start}
.builder-sidebar{position:sticky;top:94px;max-height:calc(100vh - 112px);overflow:auto;scrollbar-width:thin}
.builder-character{padding:1.1rem;display:grid;grid-template-columns:54px 1fr;gap:.8rem;align-items:center;border-bottom:1px solid rgba(255,255,255,.07);background:linear-gradient(135deg,rgba(108,181,255,.06),transparent)}

.builder-progress{padding:.85rem 1rem;border-bottom:1px solid rgba(255,255,255,.07);background:rgba(0,0,0,.08)}
.builder-progress-head{display:flex;justify-content:space-between;align-items:center;gap:.6rem;color:#a1b5cc;font-size:.8125rem;text-transform:uppercase;letter-spacing:.08em}
.builder-progress-head strong{color:#c5ddf3;font:500 .82rem/1 Inter,"Segoe UI",sans-serif}
.builder-progress-track{height:3px;margin:.55rem 0;background:rgba(255,255,255,.07);overflow:hidden}
.builder-progress-track span{display:block;height:100%;background:linear-gradient(90deg,#365f73,#64def5);transition:width .24s ease}
.builder-progress small{color:#a1b5cc;font-size:.8125rem}
.progression-sidebar-note{display:grid;gap:.3rem;padding:.8rem 1rem;border-bottom:1px solid rgba(255,255,255,.07);background:linear-gradient(135deg,rgba(100,222,245,.055),rgba(108,181,255,.02))}
.progression-sidebar-note strong{color:#c5ddf3;font:600 .82rem/1.25 Inter,"Segoe UI",sans-serif}
.progression-sidebar-note span{color:#a1b5cc;font-size:.8125rem;line-height:1.45}
.builder-quick-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;padding:1px;border-bottom:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.05)}
.builder-quick-summary>div{display:grid;gap:.15rem;padding:.55rem .65rem;background:#0b1524}
.builder-quick-summary small{color:#a1b5cc;font-size:.8125rem;text-transform:uppercase;letter-spacing:.06em}
.builder-quick-summary strong{color:#c5ddf3;font-size:.8125rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.builder-character h1{margin:.15rem 0 .35rem;font-family:Inter,"Segoe UI",sans-serif;font-size:1.35rem;font-weight:500}
.builder-character small{color:#a1b5cc}
.builder-mini-portrait{width:54px;height:68px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:#0b1524;display:grid;place-items:center}
.builder-mini-portrait img{width:100%;height:100%;object-fit:cover}
.builder-mini-portrait.empty span{color:#5b93ad;font-family:Inter,"Segoe UI",sans-serif}
.builder-nav{display:grid;padding:.55rem}
.builder-nav button{position:relative;display:grid;grid-template-columns:1.6rem 1fr auto;align-items:center;gap:.45rem;width:100%;padding:.72rem .65rem;border:0;border-left:2px solid transparent;text-align:left;color:#a1b5cc;background:transparent;transition:background .16s ease,color .16s ease,border-color .16s ease}
.builder-nav button:hover:not(:disabled){color:#edf4ff;background:rgba(255,255,255,.018)}
.builder-nav button.active{border-left-color:#64def5;color:#edf4ff;background:linear-gradient(90deg,rgba(108,181,255,.13),rgba(108,181,255,.035))}
.builder-nav button.done:not(.active){color:#b3c5d9}
.builder-nav button.done:not(.active)::after{content:"";position:absolute;right:.45rem;width:5px;height:5px;border-radius:50%;background:#64def5;opacity:.75}
.builder-nav button:disabled{opacity:.5}
.builder-nav button span,.builder-nav button small{font-size:.8125rem}
.builder-nav button small{color:#a1b5cc}
.builder-nav button.done small{color:#99c8d5}
.builder-main{min-width:0}
.builder-card{padding:clamp(1.2rem,3vw,2rem);animation:builder-step-in .2s cubic-bezier(.2,.7,.2,1) both}
@keyframes builder-step-in{from{opacity:0;transform:translateY(6px)}
to{opacity:1;transform:none}
}
.builder-heading{align-items:center}
.schema-badge{padding:.35rem .55rem;border:1px solid rgba(100,222,245,.25);color:#64def5;font-size:.8125rem;white-space:nowrap}
.builder-intro{color:#b3c5d9;line-height:1.65}
.identity-layout{display:grid;grid-template-columns:230px minmax(0,1fr);gap:1.4rem;margin-top:1.4rem;align-items:start}
.portrait-card{display:grid;gap:.65rem}
.portrait-card>small{color:#a1b5cc;line-height:1.45}
.portrait-frame{aspect-ratio:4/5;overflow:hidden;border:1px solid rgba(255,255,255,.14);background:#080f1b;display:grid;place-items:center}
.portrait-frame img{width:100%;height:100%;object-fit:cover}
.portrait-frame.empty{border-style:dashed}
.portrait-empty{padding:1rem;display:grid;gap:.5rem;text-align:center;color:#a1b5cc}
.portrait-empty strong{color:#edf4ff;font-family:Inter,"Segoe UI",sans-serif;font-size:1.2rem}
.identity-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
.field-help{color:#a1b5cc;font-size:.8125rem;line-height:1.4}
.narrative-grid{display:grid;gap:1rem;margin-top:1rem}
textarea{width:100%;padding:.7rem .75rem;border:1px solid rgba(255,255,255,.12);outline:none;resize:vertical;color:#edf4ff;background:#0c1727;font:inherit}
textarea:focus{border-color:#6cb5ff;box-shadow:0 0 0 2px rgba(108,181,255,.14)}
.choice-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:.8rem;margin-top:1.25rem}
.choice-grid>.choice-card-shell{flex:0 1 calc(33.333% - .55rem);min-width:0}
.choice-card{display:grid;gap:.45rem;min-height:94px;padding:1rem;border:1px solid #344a62;text-align:left;color:#edf4ff;background:rgba(255,255,255,.018)}
.choice-card:hover{border-color:rgba(100,222,245,.38);transform:translateY(-1px)}
.choice-card.selected{border-color:#6cb5ff;background:rgba(108,181,255,.1)}
.choice-card span{color:#a1b5cc;font-size:.8125rem;line-height:1.45}
.choice-card small{color:#a1b5cc;font-size:.8125rem;line-height:1.45}
.choice-card-shell,.disadvantage-entry{position:relative;display:grid}
.choice-card-shell>.choice-card,.disadvantage-entry>.disadvantage-card{width:100%;height:100%;padding-bottom:2.05rem}
.choice-card-wiki{position:absolute;left:1rem;bottom:.55rem;z-index:2;font-size:.8125rem;color:#6fb9d6}
.sphere-card{min-height:150px}
.style-card{min-height:120px}
.subsection{margin-top:2rem;padding-top:1.4rem;border-top:1px solid rgba(255,255,255,.07)}
.subsection h3{margin:0 0 .7rem;font-family:Inter,"Segoe UI",sans-serif;font-size:1.25rem}
.subsection-title{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start}
.subsection-title p{margin:.35rem 0 0;color:#b3c5d9;font-size:.85rem}
.talent-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem}
.allocator-grid,.attribute-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:.75rem;margin-top:1rem}
.allocator-card,.attribute-card{padding:.85rem;border:1px solid #2b3b51;background:rgba(255,255,255,.015)}
.allocator-card{display:flex;flex:0 1 calc(33.333% - .5rem);min-width:0;flex-direction:column;align-items:stretch;gap:.8rem}
.allocator-copy{display:grid;gap:.2rem}
.allocator-card small{color:#a1b5cc}
.allocator-card p{margin:.3rem 0 0;color:#a1b5cc;font-size:.8125rem;line-height:1.4}
.allocator-point-line{display:flex;justify-content:space-between;align-items:center;gap:.7rem;margin-top:auto;padding-top:.65rem;border-top:1px solid rgba(255,255,255,.06);color:#b3c5d9;font-size:.8125rem}
.stepper{display:grid;grid-template-columns:44px 38px 44px;align-items:center;text-align:center}
.stepper button{min-width:44px;height:44px;border:1px solid rgba(255,255,255,.12);color:#edf4ff;background:#0c1727}
.stepper button:hover{border-color:#6cb5ff}
.attribute-card{display:flex;flex:0 1 calc(33.333% - .5rem);min-width:220px;flex-direction:column;gap:.75rem}
.attribute-card-head{display:flex;justify-content:space-between;align-items:center;gap:.6rem}
.attribute-card-head strong{font-family:Inter,"Segoe UI",sans-serif}
.attribute-card-head span{color:#64def5;font-size:.8125rem}
.attribute-card p{margin:0;color:#a1b5cc;font-size:.8125rem;line-height:1.45;text-align:left}
.attribute-card .stepper{margin-top:auto;align-self:stretch}
.stepper.large{grid-template-columns:44px 1fr 44px}
.stepper.large span{font-family:Inter,"Segoe UI",sans-serif;font-size:1.7rem}
.rule-note{margin-top:1rem;padding:.85rem 1rem;border:1px solid rgba(112,168,121,.22);color:#c3d6e8;background:rgba(49,80,54,.1);line-height:1.55}
.rule-note.bad{border-color:rgba(166,81,72,.28);color:#f0bdc0;background:rgba(93,42,37,.12)}
.skill-family{margin-top:.75rem}
.skill-group{border:1px solid #25374c;border-radius:10px;background:rgba(255,255,255,.01);overflow:hidden}
.skill-group>summary{cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:.8rem;padding:.85rem 1rem;list-style:none}
.skill-group>summary::-webkit-details-marker{display:none}
.skill-group>summary>span:first-child{display:grid;gap:.15rem}
.skill-group>summary strong{font-family:Inter,"Segoe UI",sans-serif;font-size:1.05rem}
.skill-group>summary small{color:#a1b5cc;font-size:.8125rem}
.skill-group>summary::after{content:"›";color:#64def5;font-size:1.05rem;transform:rotate(90deg);transition:transform .15s ease}
.skill-group[open]>summary::after{transform:rotate(-90deg)}
.skill-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:.7rem;padding:0 .8rem .8rem}
.skill-grid>.skill-card{flex:0 1 calc(33.333% - .5rem);min-width:220px}
.skill-card{display:flex;flex-direction:column;gap:.7rem;padding:.85rem;border:1px solid #2b3b51;background:rgba(255,255,255,.015)}
.skill-head,.skill-free-line{display:flex;justify-content:space-between;align-items:center;gap:.7rem}
.skill-head span{color:#64def5;font-size:.8125rem}
.skill-lore{margin:0;color:#a1b5cc;font-size:.8125rem;line-height:1.45}
.skill-free-line{margin-top:auto;padding-top:.55rem;border-top:1px solid rgba(255,255,255,.06);color:#b3c5d9;font-size:.8125rem}
.truth-choice-section,.truth-free-section,.truth-talents-section{margin-top:1.8rem;padding-top:1.3rem;border-top:1px solid rgba(255,255,255,.07)}
.truth-picker{margin-top:1rem;padding-top:1.2rem;border-top:1px solid rgba(255,255,255,.07)}
.truth-picker-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.85rem;max-width:760px}
.truth-picker-grid label{display:grid;gap:.4rem;color:#c5ddf3;font-size:.8125rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.truth-picker-grid label{align-content:start}.truth-picker-grid label>span{min-height:20px}
.truth-nature-summary{display:grid;grid-template-columns:minmax(0,1fr) 118px;gap:1rem;align-items:center;margin-top:1rem;padding:1rem;border:1px solid rgba(100,222,245,.28);background:rgba(100,222,245,.035)}
.truth-nature-summary-copy{display:grid;gap:.45rem}
.truth-nature-summary-copy h3{margin:0;font:600 1.35rem/1.15 Inter,"Segoe UI",sans-serif}
.truth-nature-summary-copy>p:not(.eyebrow){margin:0;color:#b3c5d9;line-height:1.6}
.truth-nature-summary-copy small{color:#a1b5cc;line-height:1.45}
.truth-reserve{display:grid;place-items:center;gap:.2rem;min-height:92px;border:1px solid rgba(100,222,245,.28);background:rgba(0,0,0,.08);text-align:center}
.truth-reserve strong{color:#64def5;font:700 1.75rem/1 Inter,"Segoe UI",sans-serif}
.truth-reserve span{color:#b3c5d9;font-size:.8125rem;text-transform:uppercase;letter-spacing:.07em}
.truth-choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.85rem;margin-top:1rem}
.truth-choice-field{display:grid;gap:.55rem;padding:.15rem 0 .8rem;border-bottom:1px solid rgba(255,255,255,.06)}
.truth-choice-field>span{display:flex;justify-content:space-between;gap:.6rem}
.truth-choice-field small{color:#a1b5cc;font-size:.8125rem}
.truth-choice-field em{color:#a1b5cc;font-size:.8125rem;line-height:1.5}
.truth-reveal-section{margin-top:1.8rem;padding-top:1.3rem;border-top:1px solid rgba(255,255,255,.07)}
.truth-reveal-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.75rem;margin-top:1rem}
.truth-reveal-card{display:flex;flex-direction:column;gap:.65rem;padding:1rem;border:1px solid #2b3b51;background:rgba(255,255,255,.015)}
.truth-reveal-head{display:flex;justify-content:space-between;gap:.75rem;align-items:center}
.truth-reveal-head strong{font-family:Inter,"Segoe UI",sans-serif;font-size:1.05rem}
.truth-reveal-head span{padding:.22rem .4rem;border:1px solid rgba(100,222,245,.28);color:#64def5;font-size:.8125rem}
.truth-reveal-stats{padding:.55rem .65rem;border:1px solid rgba(112,168,121,.18);color:#d2c2ff;background:rgba(49,80,54,.08);font-size:.8125rem;line-height:1.45}
.truth-reveal-card>p{margin:0;color:#b3c5d9;font-size:.8125rem;line-height:1.55}
.truth-reveal-traits{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:auto;padding-top:.5rem;border-top:1px solid rgba(255,255,255,.06)}
.truth-reveal-traits small{width:100%;color:#a1b5cc}
.truth-reveal-traits span{padding:.22rem .38rem;border:1px solid rgba(255,255,255,.07);color:#b3c5d9;font-size:.8125rem}
.truth-free-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:.7rem;margin-top:1rem}
.truth-free-grid>.truth-free-card{flex:0 1 calc(33.333% - .48rem);min-width:0}
.truth-free-card{display:grid;gap:.5rem;padding:.9rem;border:1px solid rgba(98,147,114,.2);background:rgba(49,80,54,.07)}
.truth-free-card small{color:#b5a2da}
.truth-free-card p{margin:0;color:#b3c5d9;font-size:.8125rem;line-height:1.5}
.truth-search{display:grid;gap:.4rem;max-width:560px;margin:1rem 0;color:#b3c5d9;font-size:.8125rem}
.truth-group{margin-top:.75rem;border:1px solid #25374c;background:rgba(255,255,255,.01)}
.truth-group>summary{cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:.8rem;padding:.85rem 1rem;list-style:none}
.truth-group>summary::-webkit-details-marker{display:none}
.truth-group>summary::after{content:"›";color:#64def5;font-size:1.1rem;transform:rotate(90deg);transition:transform .15s ease}
.truth-group[open]>summary::after{transform:rotate(-90deg)}
.truth-group>summary>span{display:flex;justify-content:space-between;gap:.75rem;align-items:center;flex:1}
.truth-group>summary small{color:#a1b5cc}
.truth-disclosure-summary{cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.85rem 0;list-style:none}
.truth-disclosure-summary::-webkit-details-marker{display:none}
.truth-disclosure-summary>span:first-child{display:grid;gap:.2rem}
.truth-disclosure-summary strong{font:500 1.18rem/1.2 Inter,"Segoe UI",sans-serif;color:#edf4ff}
.truth-disclosure-summary small{color:#a1b5cc;font-size:.8125rem}
.truth-disclosure-intro{margin:.1rem 0 1rem;color:#b3c5d9;font-size:.84rem;line-height:1.55}
.truth-reveal-section,.truth-free-section{margin-top:1.5rem;padding:0 0 .25rem;border-top:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.05)}
.truth-talent-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.65rem;padding:.75rem;border-top:1px solid rgba(255,255,255,.06)}
.truth-talent-entry{display:grid;position:relative}
.truth-talent-card{display:grid;gap:.55rem;width:100%;padding:.9rem;padding-bottom:2.05rem;border:1px solid #2b3b51;text-align:left;color:#edf4ff;background:rgba(255,255,255,.015)}
.truth-talent-wiki{position:absolute;left:.9rem;bottom:.55rem;font-size:.8125rem;color:#6fb9d6}
.truth-talent-card:hover:not(:disabled){border-color:rgba(100,222,245,.38)}
.truth-talent-card.selected{border-color:#6cb5ff;background:rgba(108,181,255,.1)}
.truth-talent-card:disabled{opacity:.45}
.truth-talent-head{display:flex;justify-content:space-between;gap:.75rem;align-items:flex-start}
.truth-talent-head span{color:#64def5;font-size:.8125rem;white-space:nowrap}
.truth-talent-meta{display:flex;flex-wrap:wrap;gap:.35rem}
.truth-talent-meta span{padding:.24rem .4rem;border:1px solid rgba(255,255,255,.07);color:#a1b5cc;font-size:.8125rem}
.truth-talent-card em{color:#a1b5cc;font-size:.8125rem;line-height:1.5}
.truth-talent-card p{margin:0;color:#b3c5d9;font-size:.8125rem;line-height:1.5}
.disadvantage-controls{display:grid;grid-template-columns:minmax(180px,.7fr) minmax(240px,1fr);gap:.8rem;align-items:end;margin-top:1rem;max-width:900px}
.v1-select-shell{position:relative;display:flex;align-items:center}
.v1-select-shell select{width:100%;min-width:0}
.choice-preview{display:grid;gap:.45rem;max-width:900px;margin:.65rem 0 0;padding:.8rem 1rem;border:1px solid rgba(100,222,245,.2);border-radius:8px;background:rgba(100,222,245,.035)}
.choice-preview>div{display:flex;align-items:baseline;gap:.6rem;flex-wrap:wrap}
.choice-preview>div span{color:#64def5;font-size:.8125rem}
.choice-preview em{color:#b1cbe3;font-size:.8125rem;line-height:1.5}
.choice-preview p{margin:0;color:#edf4ff;font-size:.8125rem;line-height:1.5}
.disadvantage-controls label{display:grid;gap:.4rem;color:#c5ddf3;font-size:.8125rem;font-weight:700;letter-spacing:.04em}
.disadvantage-add{grid-column:1/-1;justify-self:start}
.selected-disadvantage-list{display:grid;gap:.65rem;margin-top:1rem}
.selected-disadvantage-card{display:grid;gap:.5rem;padding:.85rem 1rem;border:1px solid #2b3b51;background:rgba(255,255,255,.015)}
.selected-disadvantage-head{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem}
.selected-disadvantage-head>div{display:flex;align-items:baseline;gap:.4rem;flex-wrap:wrap}
.selected-disadvantage-head small{color:#6fb9d6;font-size:.8125rem}
.selected-disadvantage-card em{color:#b1cbe3;font-size:.8125rem;line-height:1.5}
.selected-disadvantage-card p{margin:0;color:#edf4ff;font-size:.8125rem;line-height:1.5}
.disadvantage-empty{margin-top:1rem;padding:.8rem 0;color:#a1b5cc;font-size:.8125rem}
.edge-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:.8rem;margin-top:1.2rem}
.edge-grid>.edge-card{flex:0 1 calc(33.333% - .55rem);min-width:0}
.edge-card{display:flex;flex-direction:column;gap:.65rem;padding:1rem;border:1px solid #2b3b51;background:rgba(255,255,255,.015)}
.edge-card-head{display:flex;justify-content:space-between;gap:.7rem}
.edge-card-head span{color:#64def5;font-size:.8125rem}
.edge-card em{color:#a1b5cc;font-size:.8125rem;line-height:1.5}
.edge-card p{margin:0;color:#b3c5d9;font-size:.8125rem;line-height:1.45}
.edge-result{margin-top:auto;padding:.5rem .6rem;border:1px solid rgba(100,222,245,.14);color:#c5ddf3;background:rgba(100,222,245,.03);font-size:.8125rem;line-height:1.4}
.edge-card .stepper{margin-top:.1rem}
.edge-allocation{margin-top:2rem;padding-top:1.4rem;border-top:1px solid rgba(255,255,255,.07)}
.edge-five-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:.75rem;margin-top:1rem}
.edge-alloc-card{display:flex;flex:0 1 calc(33.333% - .5rem);min-width:0;flex-direction:column;gap:.65rem;padding:.85rem;border:1px solid #2b3b51;background:rgba(255,255,255,.015)}
.edge-alloc-card p{margin:0;color:#a1b5cc;font-size:.8125rem;line-height:1.45}
.edge-alloc-card .stepper{margin-top:auto}
.edge-skill-group{margin-top:.75rem;border:1px solid #25374c;background:rgba(255,255,255,.01)}
.edge-skill-group>summary{cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:.8rem;padding:.8rem 1rem;list-style:none}
.edge-skill-group>summary::-webkit-details-marker{display:none}
.edge-skill-group>summary>span:first-child{display:grid;gap:.15rem}
.edge-skill-group>summary small{color:#a1b5cc;font-size:.8125rem}
.edge-skill-group>summary::after{content:"›";color:#64def5;font-size:1.05rem;transform:rotate(90deg);transition:transform .15s ease}
.edge-skill-group[open]>summary::after{transform:rotate(-90deg)}
.edge-skill-group>.edge-five-grid{padding:0 .75rem .85rem}
.attribute-card small{color:#a1b5cc}
.builder-step-controls{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem}
.builder-step-controls>button{display:flex;align-items:center;justify-content:space-between;gap:.75rem;min-height:46px;padding:.7rem .9rem}
.builder-step-controls>button:last-child{justify-self:end}
.builder-step-controls small{font-size:.8125rem;opacity:.72}
.builder-step-controls .primary small{color:inherit}
@media(max-width:1180px){.choice-grid>.choice-card-shell,.truth-free-grid>.truth-free-card,.edge-grid>.edge-card,.allocator-card,.attribute-card,.edge-alloc-card,.skill-grid>.skill-card{flex-basis:calc(50% - .4rem)}
.talent-grid,.truth-talent-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:900px){.truth-picker-grid,.truth-choice-grid,.disadvantage-controls{grid-template-columns:1fr}
.truth-nature-summary{grid-template-columns:1fr}
.truth-reserve{min-height:72px}
.truth-reveal-grid{grid-template-columns:1fr}
.builder-workspace{grid-template-columns:1fr}
.builder-sidebar{position:static}
.builder-nav{grid-template-columns:repeat(2,minmax(0,1fr))}
.identity-layout{grid-template-columns:1fr}
.portrait-card{max-width:260px}
.builder-topbar{flex-wrap:wrap}
.top-actions{width:100%;justify-content:flex-end}
}
@media(max-width:620px){.choice-grid>.choice-card-shell,.truth-free-grid>.truth-free-card,.edge-grid>.edge-card,.allocator-card,.attribute-card,.edge-alloc-card,.skill-grid>.skill-card{flex-basis:100%;min-width:0}
.talent-grid,.truth-talent-grid{grid-template-columns:1fr}
.truth-consciousness-grid{grid-template-columns:1fr}
.identity-grid{grid-template-columns:1fr}
.builder-nav{grid-template-columns:1fr}
.subsection-title{flex-direction:column}
.builder-step-controls{grid-template-columns:1fr}
.builder-step-controls>span{display:none}
.builder-step-controls>button,.builder-step-controls>button:last-child{width:100%;justify-self:stretch}
}



/* Orbital Builder: shared structure for every creation step. */
.builder-v2-shell{background:radial-gradient(ellipse at 95% 0,#17172f66,transparent 40rem),#050a12;color:#edf4ff;font-family:Inter,"Segoe UI",sans-serif}
.builder-topbar{min-height:80px;background:#050a12f5;border-bottom:1px solid #25374c;backdrop-filter:blur(16px)}
.builder-workspace{padding:24px 0 72px;gap:24px}
.builder-sidebar,.builder-card{background:#0b1524;border:1px solid #2b3b51;border-radius:8px}
.builder-card{padding:clamp(20px,2.3vw,36px)}
.builder-main{scroll-margin-top:104px}
.builder-character h1{font-weight:650;line-height:1.3;overflow-wrap:anywhere}
.builder-character .eyebrow{font-size:11px;letter-spacing:.12em;color:#64def5}
.builder-character small{font-size:12px;line-height:1.5}
.builder-mini-portrait{border-radius:6px}
.builder-progress-track{height:4px;border-radius:4px}
.builder-progress-track span{background:linear-gradient(90deg,#64def5,#6cb5ff 55%,#b79aff)}
.builder-progress small{font-size:12px;line-height:1.5}
.builder-quick-summary>div{padding:12px 14px}
.builder-quick-summary small{font-size:11px;line-height:1.5}
.builder-quick-summary strong{font-size:14px;line-height:1.5}
.builder-nav{padding:8px;gap:3px}
.builder-nav button{min-height:48px;border-radius:5px;padding:10px 8px;font-size:14px;grid-template-columns:20px minmax(0,1fr) auto}
.builder-nav button span,.builder-nav button small{font-size:11px}
.builder-nav button.active{background:#183047;border-left-color:#64def5}
.builder-nav button.done:not(.active)::after{display:none}
.builder-nav button strong{font-weight:600}
.builder-mobile-steps{display:none}
.builder-intro{font-size:15px;max-width:85ch;line-height:1.7}
:is(.choice-card,.allocator-card,.attribute-card,.skill-card,.truth-reveal-card,.truth-free-card,.truth-talent-card,.selected-disadvantage-card,.edge-card,.edge-alloc-card){border-radius:8px;background:#0e1b2d;overflow-wrap:anywhere}
:is(.choice-card,.allocator-card,.attribute-card,.skill-card,.edge-card,.edge-alloc-card) p{font-size:14px;line-height:1.6}
.choice-card>strong,.edge-card-head>strong,.skill-head>strong{font-size:15px;line-height:1.4}
.choice-card span{font-size:14px;line-height:1.6}
.choice-card small{font-size:13px;line-height:1.5}
.choice-card.selected{border-color:#64def5;background:#142c40;box-shadow:inset 0 2px #64def5}
:is(.truth-nature-summary,.truth-reserve){border-radius:8px;border-color:#51416a;background:#1a1b30}
.truth-nature-summary-copy h3,.truth-reserve strong{color:#d2c2ff}
.truth-picker-grid label{font-size:13px;letter-spacing:.02em;text-transform:none}
.truth-free-card{border-color:#493956;background:#191b2c}
.truth-talent-card.selected{border-color:#b79aff;background:#211f3a;box-shadow:inset 0 2px #b79aff}
.truth-talent-card:disabled{opacity:.72}
.truth-talent-card p,.truth-reveal-card>p,.truth-free-card p{font-size:14px;line-height:1.6}
.truth-reveal-stats{border-color:#493956;background:#191b2c}
:is(.truth-group,.edge-skill-group){border-radius:8px;background:#0c1727}
.truth-disclosure-summary{min-height:64px}
.truth-disclosure-summary small{font-size:13px;line-height:1.5}
.subsection h3{font-weight:650}
.field-help{font-size:13px;line-height:1.55}
.portrait-frame{border-radius:8px}
.rule-note{border:1px solid #344a62;border-radius:8px;background:#122337;color:#c3d6e8;font-size:14px;line-height:1.65}
.rule-note.bad{border-color:#794850;background:#241820;color:#f0bdc0}
.stepper{gap:4px}
.stepper button{padding:0;border-radius:6px;font-size:20px;line-height:1}
.stepper button:disabled{opacity:.5}
.stepper span{font-variant-numeric:tabular-nums}
.knowledge-drawer{width:min(460px,96vw);background:#0b1524;border-left:1px solid #344a62;overscroll-behavior:contain}
.knowledge-head h2{font-weight:650}
.knowledge-head p:not(.eyebrow),.knowledge-item>p{font-size:14px;line-height:1.6}
.knowledge-item>p{display:block;overflow:visible}
.knowledge-group h3{font-size:12px;color:#64def5}
.knowledge-head button{min-height:44px}
.builder-step-controls small{font-size:12px}
@media(max-width:900px){
 .builder-workspace{width:calc(100% - 24px);gap:18px;padding-top:16px}
 .builder-sidebar{max-height:none;overflow:visible}
 .builder-nav{display:none}
 .builder-nav.mobile-open{display:grid}
 .builder-mobile-steps{display:flex;width:100%;justify-content:space-between;gap:12px;align-items:center;min-height:52px;padding:14px 16px;border:0;border-top:1px solid #2b3b51;border-radius:0 0 8px 8px;text-align:left;background:#14263a;color:#edf4ff;font-size:13px}
 .builder-mobile-steps strong{color:#64def5;font-size:12px}
 .builder-quick-summary{grid-template-columns:repeat(4,minmax(0,1fr))}
 .builder-quick-summary>div{padding:10px}
 .builder-progress{display:none}
 .builder-topbar{position:static}
 .builder-main{scroll-margin-top:16px}
 .top-actions{justify-content:flex-start;gap:8px}
 .builder-topbar .top-actions :is(button,a){min-height:44px}
}
@media(max-width:620px){
 .builder-card{padding:18px 14px}
 .builder-character{padding:14px 16px}
 .builder-quick-summary{grid-template-columns:repeat(2,minmax(0,1fr))}
 .builder-nav button{grid-template-columns:24px minmax(0,1fr) auto}
 .builder-nav button span,.builder-nav button small{font-size:12px}
 .selected-disadvantage-head{flex-wrap:wrap}
 .knowledge-drawer{padding:20px 16px}
 .builder-topbar-start{flex-wrap:wrap}
}
@media(prefers-reduced-motion:reduce){.builder-card{animation:none}.knowledge-drawer,.choice-card,.builder-progress-track span{transition:none}}

.truth-talent-grid{display:grid;grid-template-columns:1fr!important;gap:10px}.truth-talent-entry{min-width:0}.truth-talent-card{text-align:left;width:100%;padding:16px 20px}.truth-talent-head{display:flex;justify-content:space-between;gap:20px}.truth-talent-head>span{white-space:nowrap;color:#a3ecfa}.knowledge-item>p{white-space:pre-line}
</style>
