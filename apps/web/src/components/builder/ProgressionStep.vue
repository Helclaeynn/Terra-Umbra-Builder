<script setup lang="ts">
import { computed, ref } from "vue";
import { sortedNames, compareTruthTalents, compareLabels } from "../../lib/catalog-order";
import { cloneJson } from "../../lib/json";
import CorruptionPanel from "./CorruptionPanel.vue";
import TruthEquipmentPanel from "./TruthEquipmentPanel.vue";
import { characterDerivedStats } from "../../lib/character-sheet";
import BuilderWikiLink from "./BuilderWikiLink.vue";
import BuilderCatalogImage from './BuilderCatalogImage.vue';
import {
  currentSkillRaw as campaignSkillRaw,
  currentSkillFinal as campaignSkillFinal,
  currentAttribute as campaignAttribute,
  addCashTransaction,
  attributeStepCost,
  campaignCash,
  commerceDegree,
  commerceDegrees,
  ensureProgression,
  flashKey,
  ptvRemaining,
  ptvSpent,
  skillStepBaseCost,
  skillStepCost,
  xpRemaining,
  xpSpent,
  progressionUid
} from "../../lib/progression";
import {
  augmentationCopyCount,
  augmentationMaxCopies,
  augmentationSupportLabel,
  augmentationSupportSatisfied,
  ensureRealityState,
  purchasePrice,
  realityItemMap,
  realityPriceSpec,
  type RealityItem,
  type RealityRulesPackage,
  type RealityStyle
} from "../../lib/reality";
import {
  truthAvailableTalents,
  truthNorm,
  truthPrerequisiteSatisfied,
  type TruthRulesPackage,
  type TruthState,
  type TruthTalent
} from "../../lib/truth";

type RuleAttribute={id:string;name:string};
type RuleSkill={id:string;name:string;attribute:string};
type RuleTalent={
  id:string;
  name:string;
  compendiumId?:string;
  effect?:string;
  attribute?:string;
  category?:string;
  sphere?:string;
};
type ProgressionRules={
  attributes:RuleAttribute[];
  skills:RuleSkill[];
  talents:{
    common:RuleTalent[];
    expertise:RuleTalent[];
    sphere:Record<string,RuleTalent[]>;
  };
};

const props=defineProps<{
  talentLore?:Record<string,string>;
  progression:Record<string,unknown>;
  reality:Record<string,unknown>;
  truthState:TruthState;
  rules:ProgressionRules;
  truthRules:TruthRulesPackage;
  realityRules:RealityRulesPackage;
  style:RealityStyle|null;
  edge:Record<string,number>;
  sphereId:string;
  sphereName:string;
  creationTalentIds:string[];
  skillTalentMap:Record<string,string>;
  disadvantages:string[];
  skillBases:Record<string,number>;
  skillFinalBases:Record<string,number>;
  attributeBases:Record<string,number>;
  creationPtvReserve:number;
  creationAccount:number;
}>();

const emit=defineEmits<{
  "update:progression":[value:Record<string,unknown>];
  "update:reality":[value:Record<string,unknown>];
  "update:truth":[value:TruthState];
}>();

const truthSearch=ref("");
const moneyLabel=ref("");
const moneyAmount=ref("");
const moneyKind=ref<"gain"|"expense">("gain");
const tradeKind=ref<"equipment"|"augmentation">("equipment");
const tradeSearch=ref("");
const tradeItemId=ref("");
const tradePrice=ref("");
const tradeDegree=ref(0);
const saleKey=ref("");
const saleDegree=ref(0);

const state=computed(()=>ensureProgression(
  cloneJson(props.progression),
  props.rules.skills.map(item=>item.id),
  props.rules.attributes.map(item=>item.id)
));
const realityState=computed(()=>ensureRealityState(cloneJson(props.reality)));
const itemMap=computed(()=>realityItemMap(props.realityRules));

function emitProgression(next=state.value){
  emit("update:progression",structuredClone(next) as unknown as Record<string,unknown>);
}
function emitReality(next=realityState.value){
  emit("update:reality",structuredClone(next) as unknown as Record<string,unknown>);
}
function money(value:number){
  return new Intl.NumberFormat("fr-FR",{maximumFractionDigits:0}).format(value)+" $";
}
function currentSkillRaw(id:string){ return campaignSkillRaw(state.value,props.skillBases,id); }
function currentSkillFinal(id:string){ return campaignSkillFinal(state.value,props.skillBases,props.skillFinalBases,props.skillTalentMap,id); }
function currentAttribute(id:string){ return campaignAttribute(state.value,props.attributeBases,id); }
const xpSpentValue=computed(()=>xpSpent(state.value,props.skillBases,props.attributeBases));
const xpRemainingValue=computed(()=>xpRemaining(state.value,props.skillBases,props.attributeBases));

const combinedTruthState=computed<TruthState>(()=>({
  ...props.truthState,
  corruptionTalents:[...new Set([...props.truthState.corruptionTalents,...state.value.corruptionTalents])],
  truthTalents:[...new Set([...props.truthState.truthTalents,...state.value.truthTalents])]
}));
const truthAvailable=computed(()=>truthAvailableTalents(props.truthRules,combinedTruthState.value));
const truthById=computed(()=>{
  const map=new Map<string,TruthTalent>();
  for(const catalog of Object.values(props.truthRules.catalogs)){
    for(const talent of catalog)map.set(talent.id,talent);
  }
  for(const talent of truthAvailable.value)map.set(talent.id,talent);
  return map;
});
function truthCost(id:string){
  return Number(truthById.value.get(id)?.cost||0);
}
const corruptionCost=(id:string)=>Number(props.truthRules.corruption.talents.find(t=>t.id===id)?.cost||0);
const campaignIntegrity=computed(()=>characterDerivedStats(currentAttribute,currentSkillFinal,props.disadvantages).integrity);
const ptvSpentValue=computed(()=>ptvSpent(state.value,truthCost,corruptionCost));
const ptvRemainingValue=computed(()=>ptvRemaining(
  state.value,
  props.creationPtvReserve,
  truthCost,corruptionCost
));
const cashValue=computed(()=>campaignCash(state.value,props.creationAccount));

function setXpEarned(value:string){
  const next=structuredClone(state.value);
  next.xpEarned=Math.max(xpSpentValue.value,Number(value)||0);
  emitProgression(next);
}
function setPtvEarned(value:string){
  const next=structuredClone(state.value);
  const minimum=Math.max(0,ptvSpentValue.value-props.creationPtvReserve);
  next.ptvEarned=Math.max(minimum,Number(value)||0);
  emitProgression(next);
}
function addSessionXp(amount:number){
  const next=structuredClone(state.value);
  next.xpEarned+=amount;
  emitProgression(next);
}

const ownsFlash=computed(()=>
  props.creationTalentIds.includes("apprentissage_fulgurant")||
  state.value.realityTalents.includes("apprentissage_fulgurant")
);
function nextSkillCost(id:string){
  const base=Number(props.skillBases[id]||0);
  const step=Number(state.value.skillRanks[id]||0)+1;
  const ordinary=skillStepBaseCost(base,step);
  return ownsFlash.value&&state.value.flashReady&&state.value.flashArmed
    ?Math.max(1,ordinary-2)
    :ordinary;
}
function increaseSkill(id:string){
  const next=structuredClone(state.value);
  const base=Number(props.skillBases[id]||0);
  const ranks=Number(next.skillRanks[id]||0);
  if(base+ranks>=15)return;
  const step=ranks+1;
  const ordinary=skillStepBaseCost(base,step);
  const useFlash=ownsFlash.value&&next.flashReady&&next.flashArmed;
  const cost=useFlash?Math.max(1,ordinary-2):ordinary;
  if(xpRemainingValue.value<cost)return;
  next.skillRanks[id]=step;
  if(useFlash){
    next.flashUses.push(flashKey(id,step));
    next.flashReady=false;
    next.flashArmed=false;
  }
  emitProgression(next);
}
function decreaseSkill(id:string){
  const next=structuredClone(state.value);
  const ranks=Number(next.skillRanks[id]||0);
  if(!ranks)return;
  const key=flashKey(id,ranks);
  next.skillRanks[id]=ranks-1;
  if(next.flashUses.includes(key)){
    next.flashUses=next.flashUses.filter(item=>item!==key);
    next.flashReady=true;
  }
  emitProgression(next);
}
function increaseAttribute(id:string){
  const next=structuredClone(state.value);
  const base=Number(props.attributeBases[id]||0);
  const ranks=Number(next.attributeRanks[id]||0);
  if(base+ranks>=10)return;
  const cost=attributeStepCost(base,ranks+1);
  if(xpRemainingValue.value<cost)return;
  next.attributeRanks[id]=ranks+1;
  emitProgression(next);
}
function decreaseAttribute(id:string){
  const next=structuredClone(state.value);
  const ranks=Number(next.attributeRanks[id]||0);
  if(!ranks)return;
  next.attributeRanks[id]=ranks-1;
  emitProgression(next);
}
function toggleFlash(){
  if(!state.value.flashReady)return;
  const next=structuredClone(state.value);
  next.flashArmed=!next.flashArmed;
  emitProgression(next);
}
function resetFlash(){
  const next=structuredClone(state.value);
  next.flashReady=true;
  next.flashArmed=false;
  emitProgression(next);
}

const creationTalentSet=computed(()=>new Set(props.creationTalentIds));
const learnedTalentSet=computed(()=>new Set(state.value.realityTalents));
function realityTalentAllowed(talent:RuleTalent){
  if(creationTalentSet.value.has(talent.id)||learnedTalentSet.value.has(talent.id)){
    return {ok:false,reason:"Déjà acquis"};
  }
  if(talent.id==="neurodriver"&&(currentSkillRaw("neurodive")<1||props.disadvantages.includes("unsinkable"))){
    return {ok:false,reason:"Neurodive 1+ requis et incompatible avec Unsinkable"};
  }
  if(talent.id==="brave"&&props.disadvantages.includes("lache"))return {ok:false,reason:"Incompatible avec Lâche"};
  if(talent.id==="resistance_a_la_chaleur"&&props.disadvantages.includes("sensible_a_la_chaleur"))return {ok:false,reason:"Incompatible avec Sensible à la chaleur"};
  if(talent.id==="resistance_au_froid"&&props.disadvantages.includes("sensible_au_froid"))return {ok:false,reason:"Incompatible avec Sensible au froid"};
  return {ok:true,reason:""};
}
const realityTalentGroups=computed(()=>{
  const groups:Array<{label:string;help:string;items:RuleTalent[]}>= [];
  const common=props.rules.talents.common.filter(talent=>realityTalentAllowed(talent).reason!=="Déjà acquis");
  if(common.length)groups.push({
    label:"Talents communs",
    help:"Aptitudes générales acquises par expérience, entraînement ou évolution personnelle.",
    items:common
  });
  const expertise=props.rules.talents.expertise.filter(talent=>
    !!props.style?.expertiseFamilies.includes(talent.attribute||"")&&
    realityTalentAllowed(talent).reason!=="Déjà acquis"
  );
  if(expertise.length)groups.push({
    label:"Talents d’Expertise",
    help:"Après création, l’Expertise reste limitée aux familles du Style.",
    items:expertise
  });
  const sphere=(props.rules.talents.sphere[props.sphereId]||[])
    .filter(talent=>realityTalentAllowed(talent).reason!=="Déjà acquis");
  if(sphere.length)groups.push({
    label:"Talents de Sphère — "+(props.sphereName||"Sphère actuelle"),
    help:"Ils supposent un accès réel au réseau, à la fonction ou à l’institution correspondante.",
    items:sphere
  });
  return groups;
});
function buyRealityTalent(talent:RuleTalent){
  const allowed=realityTalentAllowed(talent);
  if(!allowed.ok||xpRemainingValue.value<10)return;
  const next=structuredClone(state.value);
  next.realityTalents.push(talent.id);
  emitProgression(next);
}
function removeRealityTalent(id:string){
  const next=structuredClone(state.value);
  next.realityTalents=next.realityTalents.filter(item=>item!==id);
  emitProgression(next);
}
function ruleTalentById(id:string){
  for(const talent of props.rules.talents.common)if(talent.id===id)return talent;
  for(const talent of props.rules.talents.expertise)if(talent.id===id)return talent;
  for(const pool of Object.values(props.rules.talents.sphere)){
    for(const talent of pool)if(talent.id===id)return talent;
  }
  return null;
}

const truthFamily=ref('');
const learnedRealityIds=computed(()=>[...state.value.realityTalents].sort((a,b)=>compareLabels(ruleTalentById(a)?.name??a,ruleTalentById(b)?.name??b)));
const learnedTruthIds=computed(()=>[...state.value.truthTalents].sort((a,b)=>compareLabels(truthById.value.get(a)?.name??a,truthById.value.get(b)?.name??b)));
const truthCandidates=computed(()=>{
  const q=truthNorm(truthSearch.value);
  return truthAvailable.value
    .filter(talent=>!combinedTruthState.value.truthTalents.includes(talent.id))
    .filter(talent=>(talent.group||'Vérité')===truthFamily.value||!truthFamily.value&&Boolean(q))
    .filter(talent=>!q||[
      talent.name,talent.group,talent.effect,talent.runtimeLore,talent.prerequisiteName
    ].some(value=>truthNorm(String(value||"")).includes(q)))
    .sort(compareTruthTalents);
});
const truthFamilies=computed(()=>[...new Set(truthAvailable.value.filter(talent=>!combinedTruthState.value.truthTalents.includes(talent.id)).map(talent=>talent.group||'Vérité'))].sort(compareLabels));
function truthCanBuy(talent:TruthTalent){
  return truthPrerequisiteSatisfied(
    props.truthRules,
    combinedTruthState.value,
    talent,
    truthAvailable.value
  )&&ptvRemainingValue.value>=Number(talent.cost||0);
}
function buyTruthTalent(talent:TruthTalent){
  if(!truthCanBuy(talent))return;
  const next=structuredClone(state.value);
  next.truthTalents.push(talent.id);
  emitProgression(next);
}
function removeTruthTalent(id:string){
  const next=structuredClone(state.value);
  next.truthTalents=next.truthTalents.filter(item=>item!==id);
  let changed=true;
  while(changed){
    changed=false;
    const combined:TruthState={
      ...props.truthState,
      truthTalents:[...new Set([...props.truthState.truthTalents,...next.truthTalents])]
    };
    const available=truthAvailableTalents(props.truthRules,combined);
    const byId=new Map(available.map(talent=>[talent.id,talent]));
    for(const ownedId of [...next.truthTalents]){
      const talent=byId.get(ownedId)??truthById.value.get(ownedId);
      if(!talent||!truthPrerequisiteSatisfied(props.truthRules,combined,talent,available)){
        next.truthTalents=next.truthTalents.filter(item=>item!==ownedId);
        changed=true;
      }
    }
  }
  emitProgression(next);
}
function initiateTruth(){
  if(props.truthState.consciousness!=="profane")return;
  if(!window.confirm("Confirmer que le personnage a été initié à la Vérité en campagne ?"))return;
  emit("update:truth",{...props.truthState,consciousness:"initie"});
}

function updateCampaignCorruption(value:TruthState){
  const next=structuredClone(state.value);
  next.corruptionTalents=value.corruptionTalents.filter(id=>!props.truthState.corruptionTalents.includes(id));
  emitProgression(next);
  emit('update:truth',{...props.truthState,corruption:value.corruption,corruptionSource:value.corruptionSource,corruptionMjAuthorized:value.corruptionMjAuthorized});
}
function updateCampaignEquipment(value:TruthState){
  emit('update:truth',{...props.truthState,truthEquipment:value.truthEquipment,truthEquipmentMjOverride:value.truthEquipmentMjOverride});
}

function addMoneyMovement(){
  const amount=Math.max(0,Number(moneyAmount.value)||0);
  if(!amount)return;
  const next=structuredClone(state.value);
  addCashTransaction(
    next,
    props.creationAccount,
    moneyKind.value==="expense"?-amount:amount,
    moneyLabel.value.trim()||(moneyKind.value==="expense"?"Dépense":"Gain"),
    "manual"
  );
  moneyAmount.value="";
  moneyLabel.value="";
  emitProgression(next);
}

const tradeCatalog=computed(()=>
  tradeKind.value==="augmentation"?props.realityRules.augmentations:props.realityRules.equipment
);
const tradeRows=computed(()=>{
  const q=tradeSearch.value.trim().toLocaleLowerCase("fr");
  return tradeCatalog.value
    .filter(item=>!q||[item.name,item.category,item.effect].some(value=>
      String(value||"").toLocaleLowerCase("fr").includes(q)
    ))
    .sort((a,b)=>a.name.localeCompare(b.name,"fr"))
    .slice(0,300);
});
const tradeGroups=computed(()=>{
  const groups=new Map<string,RealityItem[]>();
  for(const item of tradeRows.value){
    const label=item.category||"Divers";
    if(!groups.has(label))groups.set(label,[]);
    groups.get(label)!.push(item);
  }
  return [...groups.entries()]
    .map(([label,items])=>({label,items}))
    .sort((a,b)=>a.label.localeCompare(b.label,"fr"));
});
const tradeItem=computed(()=>tradeCatalog.value.find(item=>item.id===tradeItemId.value)??null);
function suggestedListPrice(item:RealityItem){
  const spec=realityPriceSpec(item);
  if(spec.mode==="exact"||spec.mode==="included")return Number(spec.defaultCost||0);
  if(spec.mode==="range"&&spec.min!==null)return Math.round((Number(spec.min)+(Number(spec.max??spec.min)))/2);
  if(spec.mode==="minimum"&&spec.min!==null)return Number(spec.min);
  return Number.isFinite(Number(item.price))?Number(item.price):0;
}
function selectTradeItem(){
  tradePrice.value=tradeItem.value?String(suggestedListPrice(tradeItem.value)):"";
}
const tradePreview=computed(()=>{
  const list=Math.max(0,Number(tradePrice.value)||0);
  const degree=commerceDegree(tradeDegree.value);
  return {list,degree,total:Math.round(list*degree.buy)};
});
function campaignPurchaseBlockReason(item:RealityItem|null){
  if(!item)return "Choisissez un article";
  if(!tradePreview.value.list)return "Prix catalogue à renseigner";
  if(tradePreview.value.total>cashValue.value)return "Solde insuffisant";
  if(item.kind==="augmentation"){
    if(!augmentationSupportSatisfied(props.realityRules,realityState.value,item)){
      return "Support requis : "+augmentationSupportLabel(item);
    }
    if(augmentationCopyCount(props.realityRules,realityState.value,item)>=augmentationMaxCopies(item)){
      return "Maximum d’installations atteint";
    }
    if(item.generation===2){
      const windows=(props.style?.gen2SlotsBase||0)+Number(props.edge.augmentationPacks||0);
      if(windows<1)return "Aucune fenêtre Gen2 disponible";
    }
  }
  return "";
}
function buyCampaignItem(){
  const item=tradeItem.value;
  if(!item||campaignPurchaseBlockReason(item))return;
  const progress=structuredClone(state.value);
  const reality=structuredClone(realityState.value);
  const degree=commerceDegree(tradeDegree.value);
  const list=tradePreview.value.list;
  const cost=tradePreview.value.total;
  const purchase={
    uid:progressionUid("camp"),
    itemId:item.id,
    kind:item.kind,
    selectedPrice:cost,
    priceConfirmed:true,
    acquiredInCampaign:true,
    campaignCatalogPrice:list,
    campaignCommerceDegree:degree.id,
    ...(item.kind==="augmentation"&&item.generation===2?{gen2System:1}:{})
  };
  if(item.kind==="augmentation")reality.augmentations.push(purchase);
  else reality.equipment.push(purchase);
  addCashTransaction(progress,props.creationAccount,-cost,"Achat · "+item.name,"purchase");
  emitProgression(progress);
  emitReality(reality);
}

const ownedForSale=computed(()=>{
  const rows:Array<{kind:"equipment"|"augmentation";purchase:any;item:RealityItem;key:string}>=[];
  for(const purchase of realityState.value.equipment){
    const item=itemMap.value.get(purchase.itemId);
    if(item)rows.push({kind:"equipment",purchase,item,key:"equipment:"+purchase.uid});
  }
  for(const purchase of realityState.value.augmentations){
    const item=itemMap.value.get(purchase.itemId);
    if(item)rows.push({kind:"augmentation",purchase,item,key:"augmentation:"+purchase.uid});
  }
  return rows;
});
const saleRow=computed(()=>ownedForSale.value.find(row=>row.key===saleKey.value)??null);
function saleReference(row:typeof saleRow.value){
  if(!row)return 0;
  const purchase=row.purchase;
  return Math.max(
    0,
    Number(purchase.campaignCatalogPrice??purchase.selectedPrice??purchasePrice(purchase,row.item))||0
  );
}
const salePreview=computed(()=>{
  const degree=commerceDegree(saleDegree.value);
  const reference=saleReference(saleRow.value);
  return {degree,reference,total:Math.round(reference*degree.sale)};
});
function sellCampaignItem(){
  const row=saleRow.value;
  if(!row||!salePreview.value.reference)return;
  if(!window.confirm("Revendre "+row.item.name+" pour "+money(salePreview.value.total)+" ?"))return;
  const progress=structuredClone(state.value);
  const reality=structuredClone(realityState.value);
  const list=row.kind==="augmentation"?reality.augmentations:reality.equipment;
  const index=list.findIndex(item=>item.uid===row.purchase.uid);
  if(index<0)return;
  list.splice(index,1);
  addCashTransaction(progress,props.creationAccount,salePreview.value.total,"Revente · "+row.item.name,"sale");
  emitProgression(progress);
  emitReality(reality);
  saleKey.value="";
}
</script>

<template>
  <article class="progression-step">
    <div class="section-heading">
      <div>
        <p class="eyebrow">SUIVI · XP & PTV</p>
        <h2>Progression de campagne</h2>
      </div>
      <span class="schema-badge">après création</span>
    </div>

    <p class="builder-intro">
      XP, PTV, argent, Renommée et Edge restent des ressources distinctes. La progression
      ne modifie jamais rétroactivement les budgets de création.
    </p>

    <section class="pool-grid">
      <div><small>XP reçus</small><strong>{{ state.xpEarned }}</strong><span>depuis la création</span></div>
      <div><small>XP dépensés</small><strong>{{ xpSpentValue }}</strong><span>Compétences, Attributs, Talents</span></div>
      <div class="good"><small>XP disponibles</small><strong>{{ xpRemainingValue }}</strong><span>réserve actuelle</span></div>
      <div><small>PTV de création</small><strong>{{ creationPtvReserve }}</strong><span>réserve non dépensée</span></div>
      <div><small>PTV attribués</small><strong>{{ state.ptvEarned }}</strong><span>gagnés en campagne</span></div>
      <div class="good"><small>PTV disponibles</small><strong>{{ ptvRemainingValue }}</strong><span>après achats de Vérité</span></div>
    </section>

    <section class="progress-panel">
      <div class="ledger-grid">
        <label>
          XP reçus depuis la création
          <input :value="state.xpEarned" type="number" :min="xpSpentValue" step="1" @change="setXpEarned(($event.target as HTMLInputElement).value)" />
        </label>
        <label>
          PTV attribués depuis la création
          <input :value="state.ptvEarned" type="number" :min="Math.max(0,ptvSpentValue-creationPtvReserve)" step="1" @change="setPtvEarned(($event.target as HTMLInputElement).value)" />
        </label>
      </div>
      <div class="session-grid">
        <button type="button" class="session-card" @click="addSessionXp(2)"><strong>Courte / transition</strong><span>+2 XP</span><small>Séance brève ou de liaison.</small></button>
        <button type="button" class="session-card" @click="addSessionXp(3)"><strong>Normale</strong><span>+3 XP</span><small>Référence d’une séance complète.</small></button>
        <button type="button" class="session-card" @click="addSessionXp(4)"><strong>Finale / événement majeur</strong><span>+4 XP</span><small>Conclusion d’arc ou événement décisif.</small></button>
      </div>
    </section>

    <section v-if="ownsFlash" class="flash-panel">
      <div>
        <strong>Apprentissage fulgurant</strong>
        <span>Une fois par scénario, une hausse de Compétence réellement pratiquée coûte 2 XP de moins, minimum 1. La réduction peut s’appliquer à 0→1.</span>
      </div>
      <div class="action-row">
        <button type="button" :class="state.flashArmed?'primary compact':'ghost compact'" :disabled="!state.flashReady" @click="toggleFlash">
          {{ state.flashReady ? (state.flashArmed ? "Réduction armée ✓" : "Utiliser sur la prochaine hausse") : "Déjà utilisé ce scénario" }}
        </button>
        <button type="button" class="ghost compact" @click="resetFlash">Nouveau scénario · réinitialiser</button>
      </div>
    </section>

    <details class="progress-panel" :open="Object.values(state.attributeRanks).some(Number)">
      <summary><strong>Augmenter les Attributs</strong><span>+1 coûte 3 × la nouvelle valeur · maximum 10</span></summary>
      <div class="progress-grid">
        <article v-for="attribute in rules.attributes" :key="attribute.id">
          <div class="card-head"><strong>{{ attribute.name }}</strong><span>{{ currentAttribute(attribute.id) }}/10</span></div>
          <small>Création {{ attributeBases[attribute.id] || 0 }} · +{{ state.attributeRanks[attribute.id] || 0 }} en campagne</small>
          <div class="action-row">
            <button class="ghost compact" type="button" :disabled="!(state.attributeRanks[attribute.id] || 0)" @click="decreaseAttribute(attribute.id)">−1</button>
            <button
              class="primary compact"
              type="button"
              :disabled="currentAttribute(attribute.id)>=10 || xpRemainingValue<attributeStepCost(attributeBases[attribute.id] || 0,(state.attributeRanks[attribute.id] || 0)+1)"
              @click="increaseAttribute(attribute.id)"
            >
              {{ currentAttribute(attribute.id)>=10 ? "Maximum" : "Passer à "+(currentAttribute(attribute.id)+1)+" · "+attributeStepCost(attributeBases[attribute.id] || 0,(state.attributeRanks[attribute.id] || 0)+1)+" XP" }}
            </button>
          </div>
        </article>
      </div>
    </details>

    <details class="progress-panel" :open="Object.values(state.skillRanks).some(Number)">
      <summary><strong>Augmenter les Compétences</strong><span>0→1 = 3 XP ; ensuite la nouvelle valeur · maximum brut 15</span></summary>
      <div v-for="attribute in rules.attributes" :key="attribute.id" class="skill-family">
        <h3>{{ attribute.name }}</h3>
        <div class="progress-grid">
          <article v-for="skill in rules.skills.filter(item=>item.attribute===attribute.id)" :key="skill.id">
            <div class="card-head"><strong>{{ skill.name }}</strong><span>Brut {{ currentSkillRaw(skill.id) }}/15</span></div>
            <small>Final {{ currentSkillFinal(skill.id) }} · création {{ skillBases[skill.id] || 0 }}</small>
            <div class="action-row">
              <button class="ghost compact" type="button" :disabled="!(state.skillRanks[skill.id] || 0)" @click="decreaseSkill(skill.id)">−1</button>
              <button
                class="primary compact"
                type="button"
                :disabled="currentSkillRaw(skill.id)>=15 || xpRemainingValue<nextSkillCost(skill.id)"
                @click="increaseSkill(skill.id)"
              >
                {{ currentSkillRaw(skill.id)>=15 ? "Maximum" : "Passer à "+(currentSkillRaw(skill.id)+1)+" · "+nextSkillCost(skill.id)+" XP"+(ownsFlash&&state.flashReady&&state.flashArmed?" ⚡":"") }}
              </button>
            </div>
          </article>
        </div>
      </div>
    </details>

    <details class="progress-panel" :open="state.realityTalents.length>0">
      <summary><strong>Apprendre un Talent de Réalité</strong><span>10 XP · accès fictionnels applicables</span></summary>
      <div class="rule-note">
        Les Talents communs s’apprennent lorsque la fiction le permet. Les Expertises restent limitées aux familles du Style.
        Les Talents de Sphère demandent un accès réel. Les Talents d’Origine restent normalement réservés à la création.
      </div>
      <div v-if="state.realityTalents.length" class="owned-list">
        <div v-for="id in learnedRealityIds" :key="id" class="owned-row">
          <div><strong>{{ ruleTalentById(id)?.name || id }}</strong><span>Talent de Réalité · 10 XP</span><p>{{ ruleTalentById(id)?.effect }}</p><details v-if="talentLore?.[id]" class="talent-lore"><summary>Contexte et lore</summary><p>{{ talentLore[id] }}</p></details></div>
          <button class="ghost danger compact" type="button" @click="removeRealityTalent(id)">Retirer</button>
        </div>
      </div>
      <p class="catalog-sort-hint">Talents illustrés par famille, classés par ordre alphabétique.</p>
      <p v-if="!realityTalentGroups.length" class="rule-note">Tous les Talents accessibles ont déjà été acquis.</p>
      <details v-for="group in realityTalentGroups" :key="group.label" class="talent-group reality-talent-family" :open="group.label==='Talents communs'">
        <summary class="reality-family-summary"><span><strong>{{ group.label }}</strong><small>{{ group.help }}</small></span><span class="schema-badge">{{ group.items.length }}</span></summary>
        <div class="reality-talent-grid">
          <article v-for="talent in sortedNames(group.items)" :key="talent.id" class="reality-talent-card" :class="{locked:!realityTalentAllowed(talent).ok}">
            <BuilderCatalogImage :article-id="talent.compendiumId" :name="talent.name" category="Règles" :image-src="`/images/talents/${talent.category}/${encodeURIComponent(talent.id)}.webp`" />
            <strong>{{ talent.name }}</strong>
            <p>{{ talent.effect || "—" }}</p>
            <details v-if="talentLore?.[talent.id]" class="talent-lore"><summary>Contexte et lore</summary><p>{{ talentLore[talent.id] }}</p></details>
            <small v-if="!realityTalentAllowed(talent).ok">{{ realityTalentAllowed(talent).reason }}</small>
            <button class="primary compact" type="button" :disabled="!realityTalentAllowed(talent).ok||xpRemainingValue<10" @click="buyRealityTalent(talent)">Apprendre · 10 XP</button>
          </article>
        </div>
      </details>
    </details>

    <details class="progress-panel" :open="state.truthTalents.length>0">
      <summary><strong>Dépenser des PTV</strong><span>La Vérité progresse par les PTV, jamais par l’XP</span></summary>
      <div v-if="truthState.consciousness==='profane'" class="initiation-row">
        <div><strong>Passer de Profane à Initié</strong><span>Changement fictionnel permanent validé par le MJ ; aucun coût automatique en XP ou PTV.</span></div>
        <button class="primary compact" type="button" @click="initiateTruth">Devenir Initié</button>
      </div>
      <div v-if="state.truthTalents.length" class="owned-list">
        <div v-for="id in learnedTruthIds" :key="id" class="owned-row">
          <div><strong>{{ truthById.get(id)?.name || id }}</strong><span>{{ truthCost(id) }} PTV · {{ truthById.get(id)?.group || "Vérité" }}</span><p>{{ truthById.get(id)?.effect }}</p><details v-if="truthById.get(id)?.runtimeLore" class="talent-lore"><summary>Contexte et lore</summary><p>{{ truthById.get(id)?.runtimeLore }}</p></details></div>
          <button class="ghost danger compact" type="button" @click="removeTruthTalent(id)">Retirer</button>
        </div>
      </div>
      <label class="truth-search">Catégorie de Talents de Vérité<select v-model="truthFamily"><option value="">— Choisir une catégorie —</option><option v-for="name in truthFamilies" :key="name" :value="name">{{ name }}</option></select></label><label class="truth-search">
        Rechercher dans les Talents accessibles
        <input v-model="truthSearch" type="search" placeholder="Nom, branche, effet, prérequis…" />
      </label>
      <p class="catalog-sort-hint">Par famille, puis coût croissant et nom.</p>
      <p v-if="!truthCandidates.length" class="rule-note">{{ !truthFamily&&!truthSearch?'Choisis une catégorie pour voir les Talents, ou cherche un Talent.':'Aucun Talent ne correspond aux choix actuels ou à la recherche.' }}</p>
      <div class="talent-list truth-talent-list">
        <article v-for="talent in truthCandidates" :key="talent.id" :class="{locked:!truthCanBuy(talent)}">
          <details class="talent-disclosure"><summary class="card-head">
            <div class="progress-card-title">
              <strong>{{ talent.name }}</strong>
              <small>{{ talent.group }}</small>
            </div>
            <span>{{ talent.cost }} PTV</span>
          </summary>
          <details v-if="talent.runtimeLore" class="talent-lore"><summary>Contexte et lore</summary><p>{{ talent.runtimeLore }}</p></details>
          <p v-if="talent.prerequisiteName"><b>Prérequis :</b> {{ talent.prerequisiteName }}</p>
          <p>{{ talent.effect }}</p>
          <button class="primary compact" type="button" :disabled="!truthCanBuy(talent)" @click="buyTruthTalent(talent)">Apprendre · {{ talent.cost }} PTV</button>
        </details>
          </article>
      </div>
    </details>

    <details class="progress-panel campaign-corruption">
      <summary><strong>Corruption &amp; Fléaux</strong><span>{{ truthState.corruption || 0 }} point(s) de Corruption · {{ combinedTruthState.corruptionTalents.length }} capacité(s) acquise(s)</span></summary>
      <CorruptionPanel :model-value="combinedTruthState" :rules="truthRules" :integrity="campaignIntegrity" :ptv-remaining="ptvRemainingValue" :locked-talent-ids="truthState.corruptionTalents" campaign @update:model-value="updateCampaignCorruption" @request-initiation="initiateTruth" />
      <p class="rule-note">Les acquisitions de campagne utilisent la même réserve de PTV que les Talents de Vérité. Les capacités acquises à la création restent conservées. Changer de Source ou revenir à Sain ne rembourse aucun Don.</p>
    </details>
    <section class="progress-panel campaign-truth-equipment">
      <TruthEquipmentPanel :model-value="combinedTruthState" :rules="truthRules" @update:model-value="updateCampaignEquipment" />
    </section>

    <details class="progress-panel campaign-money" open>
      <summary><strong>Argent &amp; possessions de campagne</strong><span>{{ money(cashValue) }}</span></summary>
      <p class="rule-note">Le premier mouvement fige le solde issu de la création. Les achats de campagne ne consomment jamais rétroactivement les enveloppes initiales.</p>

      <div class="money-grid">
        <label>Libellé<input v-model="moneyLabel" placeholder="Prime de mission, loyer exceptionnel…" /></label>
        <label>Nature<select v-model="moneyKind"><option value="gain">Gain / entrée</option><option value="expense">Dépense / sortie</option></select></label>
        <label>Montant<input v-model="moneyAmount" type="number" min="0" step="50" /></label>
        <button class="secondary compact" type="button" :disabled="!Number(moneyAmount)" @click="addMoneyMovement">Enregistrer</button>
      </div>

      <details class="trade-block">
        <summary><strong>Acheter en campagne</strong><span>débit immédiat du solde</span></summary>
        <div class="trade-grid">
          <label>Catalogue<select v-model="tradeKind" @change="tradeItemId='';tradePrice=''"><option value="equipment">Équipement</option><option value="augmentation">Augmentations</option></select></label>
          <label>Recherche<input v-model="tradeSearch" placeholder="Nom, catégorie…" /></label>
          <label class="wide">Article<select v-model="tradeItemId" @change="selectTradeItem"><option value="">— Choisir —</option><optgroup v-for="group in tradeGroups" :key="group.label" :label="group.label.toUpperCase()"><option v-for="item in group.items" :key="item.id" :value="item.id">{{ item.name }} · {{ realityPriceSpec(item).label }}</option></optgroup></select></label>
          <label>Prix catalogue retenu<input v-model="tradePrice" type="number" min="0" step="25" /></label>
          <label>Jet de Commerce<select v-model.number="tradeDegree"><option v-for="degree in commerceDegrees" :key="degree.id" :value="degree.id">{{ degree.label }}</option></select></label>
        </div>
        <div v-if="tradeItem" class="trade-preview">
          <BuilderCatalogImage :article-id="tradeItem.compendiumId" :name="tradeItem.name" :generation="tradeItem.generation" category="Équipement & Objets" />
          <span>Référence <strong>{{ money(tradePreview.list) }}</strong></span>
          <span>Commerce <strong>{{ tradePreview.degree.id===0 ? "sans jet" : tradePreview.degree.delta+" %" }}</strong></span>
          <span>À payer <strong>{{ money(tradePreview.total) }}</strong></span>
          <p>{{ tradeItem.effect || tradeItem.lore }}</p>
          <BuilderWikiLink
            :label="tradeItem.name"
            :article-id="tradeItem.compendiumId"
            category="Équipement & Objets"
            :detail="tradeItem.effect || tradeItem.lore"
            :badges="[tradeItem.category, realityPriceSpec(tradeItem).label]"
            compact
          >
            <span>Voir la fiche Compendium</span>
          </BuilderWikiLink>
          <small v-if="campaignPurchaseBlockReason(tradeItem)">{{ campaignPurchaseBlockReason(tradeItem) }}</small>
          <button class="primary compact" type="button" :disabled="!!campaignPurchaseBlockReason(tradeItem)" @click="buyCampaignItem">Acheter et débiter</button>
        </div>
      </details>

      <details class="trade-block">
        <summary><strong>Revendre</strong><span>50 % du neuf sans jet · +5 points par degré de réussite</span></summary>
        <div v-if="ownedForSale.length" class="trade-grid">
          <label class="wide">Possession<select v-model="saleKey"><option value="">— Choisir —</option><option v-for="row in ownedForSale" :key="row.key" :value="row.key">{{ row.item.name }} · {{ row.kind==='equipment'?'Équipement':'Augmentation' }}</option></select></label>
          <label>Jet de Commerce<select v-model.number="saleDegree"><option v-for="degree in commerceDegrees" :key="degree.id" :value="degree.id">{{ degree.label }}</option></select></label>
        </div>
        <div v-if="saleRow" class="trade-preview">
          <span>Référence neuf <strong>{{ money(salePreview.reference) }}</strong></span>
          <span>Taux <strong>{{ Math.round(salePreview.degree.sale*100) }} %</strong></span>
          <span>À récupérer <strong>{{ money(salePreview.total) }}</strong></span>
          <button class="ghost danger compact" type="button" :disabled="!salePreview.reference" @click="sellCampaignItem">Revendre</button>
        </div>
        <div v-else-if="!ownedForSale.length" class="empty-line">Aucune possession revendable.</div>
      </details>

      <details v-if="state.cashTransactions.length" class="trade-block">
        <summary><strong>Journal d’argent</strong><span>{{ state.cashTransactions.length }} mouvement(s)</span></summary>
        <div class="owned-list">
          <div v-for="transaction in [...state.cashTransactions].reverse()" :key="transaction.uid" class="owned-row">
            <div><strong>{{ transaction.label }}</strong><span>{{ transaction.type }}</span></div>
            <strong :class="transaction.amount>=0?'positive':'negative'">{{ transaction.amount>=0?"+":"" }}{{ money(transaction.amount) }}</strong>
          </div>
        </div>
      </details>
    </details>
  </article>
</template>

<style scoped>

.progression-step{display:grid;gap:1rem}
.progress-card-title{display:grid;gap:.18rem;min-width:0}
.progress-card-title :deep(.builder-wiki-ref){font-size:.875rem;color:#b1cbe3}
.pool-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.65rem}
.pool-grid>div{display:grid;gap:.25rem;padding:.8rem;border:1px solid #2b3b51}
.pool-grid small,.pool-grid span{color:#a1b5cc;font-size:.875rem}
.pool-grid strong{font-family:Inter,"Segoe UI",sans-serif;font-size:1.35rem}
.pool-grid .good strong{color:#9eeafd}
.progress-panel,.flash-panel{padding:1rem;border:1px solid #2b3b51;background:rgba(255,255,255,.012)}
.progress-panel>summary,.trade-block>summary{cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:.8rem;list-style:none}
.progress-panel>summary::-webkit-details-marker,.trade-block>summary::-webkit-details-marker{display:none}
.progress-panel>summary::after,.trade-block>summary::after{content:"›";color:#64def5;font-size:1.05rem;transform:rotate(90deg);transition:transform .15s ease}
.progress-panel[open]>summary::after,.trade-block[open]>summary::after{transform:rotate(-90deg)}
.progress-panel>summary span,.trade-block>summary span{color:#a1b5cc;font-size:.875rem}
.ledger-grid,.money-grid,.trade-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem;margin-top:1rem}
.session-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem;margin-top:.8rem}
.session-card{display:grid;gap:.35rem;padding:.75rem;border:1px solid #2b3b51;text-align:left;background:#0b1524;color:#c3d2e4}
.session-card span{color:#64def5}
.session-card small{color:#a1b5cc}
.flash-panel{display:flex;justify-content:space-between;gap:1rem;align-items:center;border-color:rgba(183,152,84,.3)}
.flash-panel>div:first-child{display:grid;gap:.25rem}
.flash-panel span{color:#a1b5cc;font-size:.875rem;line-height:1.45}
.action-row{display:flex;gap:.45rem;flex-wrap:wrap;margin-top:.7rem}
.progress-grid,.talent-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.65rem;margin-top:.8rem}
.progress-grid article,.talent-grid article{display:flex;flex-direction:column;gap:.55rem;padding:.75rem;border:1px solid #2b3b51}
.talent-grid article.locked{opacity:.65}
.card-head{display:flex;justify-content:space-between;gap:.7rem}
.card-head>div{display:grid;gap:.15rem}
.card-head span{color:#64def5;font-size:.875rem}
.card-head small,.progress-grid article>small,.talent-grid article>small{color:#a1b5cc}
.talent-grid article p,.talent-grid article em{margin:0;color:#a1b5cc;font-size:.875rem;line-height:1.5}
.talent-grid article .primary{margin-top:auto}
.skill-family{margin-top:1rem}
.skill-family h3{margin:.5rem 0;font-family:Inter,"Segoe UI",sans-serif}
.talent-group{padding-top:1rem;border-top:1px solid rgba(255,255,255,.06)}
.owned-list{display:grid;gap:.5rem;margin-top:.8rem}
.owned-row{display:flex;justify-content:space-between;gap:.7rem;align-items:center;padding:.65rem .75rem;border:1px solid #2b3b51}
.owned-row>div{display:grid;gap:.15rem}
.owned-row span{color:#a1b5cc;font-size:.875rem}
.truth-search{display:grid;gap:.4rem;margin-top:.8rem}
.initiation-row{display:flex;justify-content:space-between;gap:1rem;align-items:center;margin-top:.8rem;padding:.8rem;border:1px solid rgba(100,222,245,.2)}
.initiation-row>div{display:grid;gap:.25rem}
.initiation-row span{color:#a1b5cc;font-size:.875rem}
.cash-badge{padding:.45rem .65rem;border:1px solid rgba(89,133,91,.3);color:#9eeafd;font-family:Inter,"Segoe UI",sans-serif}
.money-grid{grid-template-columns:minmax(180px,2fr) minmax(140px,1fr) minmax(120px,1fr) auto;align-items:end}
.trade-block{margin-top:.9rem;padding-top:.8rem;border-top:1px solid rgba(255,255,255,.07)}
.trade-grid .wide{grid-column:1/-1}
.trade-preview{display:flex;flex-wrap:wrap;gap:.45rem;align-items:center;margin-top:.8rem;padding:.8rem;border:1px solid #2b3b51}
.trade-preview span{padding:.3rem .45rem;border:1px solid rgba(255,255,255,.07);color:#a1b5cc;font-size:.875rem}
.trade-preview p{width:100%;margin:.25rem 0;color:#a1b5cc;font-size:.875rem}
.trade-preview small{width:100%;color:#f0bdc0}
.positive{color:#9eeafd}
.negative{color:#f0bdc0}
.empty-line{margin-top:.8rem;color:#a1b5cc}
@media(max-width:1180px){.progress-grid,.talent-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:900px){.pool-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.session-grid{grid-template-columns:1fr}
.flash-panel{align-items:stretch;flex-direction:column}
.money-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:600px){.progress-grid,.talent-grid,.pool-grid,.ledger-grid,.money-grid,.trade-grid{grid-template-columns:1fr}
.owned-row,.initiation-row{align-items:stretch;flex-direction:column}
.trade-grid .wide{grid-column:auto}
}


:where(.section-heading,.subsection-title){display:flex;justify-content:space-between;align-items:flex-start;gap:18px}
.subsection-title h3{margin:0;font-size:18px;line-height:1.4;letter-spacing:-.02em}
.subsection-title p{margin:8px 0 0;color:#b3c5d9;font-size:14px;line-height:1.65;max-width:78ch}
.builder-intro{margin:0;color:#b3c5d9;font-size:15px;line-height:1.7;max-width:85ch}
.schema-badge{padding:6px 10px;border:1px solid #344a62;border-radius:6px;white-space:nowrap;color:#9eeafd;background:#14263a;font-size:12px}
.schema-badge.bad{border-color:#794850;color:#f0bdc0;background:#241820}
.rule-note{padding:16px;border:1px solid #344a62;border-radius:8px;color:#c3d6e8;background:#122337;font-size:14px;line-height:1.65}
.rule-note.bad{border-color:#794850;color:#f0bdc0;background:#241820}
:is(input,select,textarea){min-width:0;min-height:44px;border-radius:6px;font:inherit}
button{min-height:44px;border-radius:6px;font-size:14px}
label{font-size:14px;line-height:1.5}
@media(max-width:620px){.section-heading,.subsection-title{flex-wrap:wrap}.section-heading .schema-badge{align-self:flex-start}}

.progression-step{gap:24px;color:#edf4ff;font-family:Inter,"Segoe UI",sans-serif}
.pool-grid{gap:12px}
.pool-grid>div{padding:18px;gap:8px;background:#0e1b2d;border-radius:8px}
.pool-grid strong{font-size:30px;font-weight:650;line-height:1.2;font-variant-numeric:tabular-nums}
.pool-grid .good{border-color:#36596b;background:#102738}
.pool-grid small,.pool-grid span{font-size:13px;line-height:1.5}
.progress-panel,.flash-panel{padding:22px;border-radius:8px;background:#0e1b2d}
.progress-panel>summary,.trade-block>summary{min-height:48px;flex-wrap:wrap;font-size:16px;line-height:1.5}
.progress-panel>summary span,.trade-block>summary span{font-size:13px}
.progress-panel[open]>summary{padding-bottom:14px;border-bottom:1px solid #2b3b51}
.ledger-grid,.money-grid,.trade-grid{gap:16px}
.session-card{padding:18px;gap:8px;border-radius:8px}
.session-card:hover{border-color:#64def5;background:#122337}
.session-card strong{font-size:15px;line-height:1.45}
.session-card small{font-size:13px;line-height:1.5}
.flash-panel{border-color:#665377;background:#201d33}
.progress-grid,.talent-grid{gap:14px;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr))}
.progress-grid article,.talent-grid article{min-width:0;padding:18px;gap:12px;border-radius:8px;background:#0b1524}
.card-head{gap:12px;flex-wrap:wrap}
.card-head strong{font-size:15px;line-height:1.45}
.card-head span{font-size:13px;white-space:nowrap}
.talent-grid article p,.talent-grid article em{font-size:14px;line-height:1.65}
.talent-grid article.locked{opacity:1;border-style:dashed}
.talent-grid article.locked .primary{opacity:.5}
.progress-card-title :deep(.builder-wiki-ref){font-size:12px}
.action-row{margin-top:auto;padding-top:8px;gap:8px}
.action-row .primary{flex:1}
.owned-row{padding:16px;border-radius:8px;background:#101d30}
.owned-row span{font-size:13px;line-height:1.5}
.initiation-row{padding:18px;gap:16px;border-color:#51416a;border-radius:8px;background:#1a1b30}
.initiation-row span{font-size:14px;line-height:1.6}
.cash-badge{white-space:nowrap;border-radius:6px;border-color:#36596b;font-size:16px;font-weight:650}
.trade-preview{padding:18px;border-radius:8px;gap:10px}
.trade-preview p{font-size:14px;line-height:1.6}
.empty-line{padding:16px;border:1px dashed #344a62;border-radius:8px;font-size:14px;line-height:1.6}
@media(max-width:1100px){.money-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:620px){.progress-panel,.flash-panel{padding:16px}.money-grid{grid-template-columns:1fr}.card-head{flex-wrap:wrap}}

/* Stable 3 + 2 attribute layout, including wide screens. */
.progress-grid{display:flex;flex-wrap:wrap;justify-content:center}.progress-grid>article{box-sizing:border-box;flex:0 1 calc((100% - 28px)/3)}
.talent-list{display:grid;gap:10px;margin-top:16px}.talent-list>article{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 24px;padding:16px 18px;border:1px solid #344b63;border-radius:6px;background:#0c192a;min-width:0}
.talent-list .card-head{grid-column:1;gap:16px}.talent-list .card-head>span{color:#a3ecfa;white-space:nowrap}.talent-list .progress-card-title{min-width:0}.talent-list .progress-card-title>strong{font-size:16px;color:#edf4ff}
.talent-list article>p,.talent-list article>small,.talent-list .talent-lore{grid-column:1;margin:0;color:#c0d2e2;font-size:14px;line-height:1.6;overflow-wrap:anywhere}
.talent-list article>.primary{grid-column:2;grid-row:1 / span 4;align-self:center;min-height:44px;white-space:nowrap;margin:0}.talent-list article.locked{border-style:dashed}.talent-list article.locked>.primary{opacity:.6}
.talent-lore summary{cursor:pointer;min-height:44px;display:list-item;padding:10px 0;color:#a5def0}.talent-lore p{margin:4px 0 0;white-space:pre-line;color:#c0c6e1}.catalog-sort-hint{color:#a7bdcf;font-size:13px;line-height:1.5;margin:12px 0}
@media(max-width:760px){.progress-grid>article{flex-basis:calc((100% - 14px)/2)}}
@media(max-width:600px){.progress-grid>article{flex-basis:100%}.talent-list>article{grid-template-columns:1fr;padding:16px}.talent-list article>.primary{grid-column:1;grid-row:auto;justify-self:stretch}.talent-list .card-head{flex-wrap:wrap}}

.talent-list>article{display:block;padding:0}
.talent-disclosure>summary{display:flex;align-items:center;justify-content:space-between;min-height:56px;padding:12px 16px;cursor:pointer;list-style:revert}
.talent-disclosure>summary::after{content:'＋';color:#a3ecfa}
.talent-disclosure[open]>summary::after{content:'−'}
.talent-disclosure>p,.talent-disclosure>small,.talent-disclosure>.talent-lore{display:block;margin:12px 16px;line-height:1.6}
.talent-disclosure>button{margin:0 16px 16px;min-height:44px}
.talent-disclosure .progress-card-title{flex:1;display:grid;gap:4px}
.reality-talent-family{margin-top:16px;border:1px solid #344b63;border-radius:8px;padding:0 14px 14px;background:#0c192a}
.reality-family-summary{display:flex;align-items:center;gap:16px;min-height:64px;cursor:pointer;list-style:none;user-select:none}
.reality-family-summary::-webkit-details-marker{display:none}
.reality-family-summary>span:first-child{display:grid;gap:4px;flex:1;min-width:0}
.reality-family-summary strong{color:#edf4ff;font-size:16px}
.reality-family-summary small{color:#a7bdcf;font-size:13px;line-height:1.45}
.reality-talent-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;padding-top:12px;border-top:1px solid #344b63}
.reality-talent-card{box-sizing:border-box;flex:0 1 calc((100% - 20px)/3);min-width:0;display:grid;align-content:start;gap:10px;padding:12px;border:1px solid #36536b;border-radius:8px;background:#101e30}
.reality-talent-card :deep(.catalog-art){height:132px}
.reality-talent-card>strong{color:#edf4ff;font-size:15px;line-height:1.4}
.reality-talent-card>p{margin:0;color:#b3c5d9;font-size:13px;line-height:1.5}
.reality-talent-card>small{color:#f0bdc0;font-size:12px;line-height:1.45}
.reality-talent-card>button{align-self:end;min-height:44px;margin-top:auto}
.reality-talent-card.locked{border-style:dashed}
@media(max-width:850px){.reality-talent-card{flex-basis:calc((100% - 10px)/2)}}
@media(max-width:550px){.reality-talent-card{flex-basis:100%}}
</style>
