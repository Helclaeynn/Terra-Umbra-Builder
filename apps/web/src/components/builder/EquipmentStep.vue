<script setup lang="ts">
import { computed, ref } from "vue";
import { cloneJson } from "../../lib/json";
import BuilderWikiLink from "./BuilderWikiLink.vue";
import {
  augmentationAccess,
  augmentationBaseKey,
  augmentationCopyCount,
  augmentationLoad,
  augmentationMaxCopies,
  augmentationSupportLabel,
  augmentationSupportSatisfied,
  canAffordRealityPurchase,
  equipmentStats,
  lifestylePressure,
  neuroCapacity,
  pureCosmeticAugmentation,
  realityEconomic,
  realityItemMap,
  realityLifestyleBase,
  realityPriceSpec,
  recurringMonthlyCost,
  uniqueUid,
  type RealityItem,
  type RealityPurchase,
  type RealityRulesPackage,
  type RealityStyle
} from "../../lib/reality";

const props=defineProps<{
  modelValue:Record<string,unknown>;
  rules:RealityRulesPackage;
  style:RealityStyle|null;
  edge:Record<string,number>;
  talentIds:string[];
  disadvantages:string[];
  neurodiveRaw:number;
  sphereId:string;
  integrity:number;
  augmentStressMax:number;
  valid:boolean;
}>();

const emit=defineEmits<{
  "update:modelValue":[value:Record<string,unknown>];
}>();

const catalogKind=ref<"equipment"|"augmentation">("equipment");
const query=ref("");
const category=ref("");
const priceDrafts=ref<Record<string,string>>({});
const variantChoice=ref<Record<string,string>>({});
const recurringId=ref("");
const recurringDraft=ref("");
const customChargeName=ref("");
const customChargeMonthly=ref("");

const state=computed(()=>props.modelValue as unknown as import("../../lib/reality").RealityState);
const items=computed(()=>realityItemMap(props.rules));
const economy=computed(()=>props.style
  ?realityEconomic(props.rules,state.value,props.style,props.edge)
  :null
);
const lifestyleBase=computed(()=>props.style
  ?realityLifestyleBase(props.rules,props.style,props.edge,props.talentIds,props.disadvantages)
  :"Standard"
);
const pressure=computed(()=>lifestylePressure(props.rules,state.value,lifestyleBase.value));
const load=computed(()=>augmentationLoad(props.rules,state.value,props.talentIds));
const neuroCap=computed(()=>neuroCapacity(props.neurodiveRaw,props.talentIds,props.disadvantages));
const loadedNeuroCount=computed(()=>state.value.equipment.filter(p=>items.value.get(p.itemId)?.neuro&&p.loaded).length);
const lifestyleTiers=computed(()=>[...props.rules.economy.lifestyle.order]
  .reverse()
  .map(name=>{
    const index=props.rules.economy.lifestyle.order.indexOf(name);
    return {
      name,
      base:index===pressure.value.baseIndex,
      effective:index===pressure.value.effectiveIndex,
      lost:index>pressure.value.effectiveIndex&&index<=pressure.value.baseIndex
    };
  })
);

const corporateHousingOptions=computed(()=>props.rules.recurring
  .filter(item=>/logement|loyer|appartement|studio|villa|penthouse|résidence|residence|dortoir|hébergement|hebergement/.test(
    norm(`${item.name} ${item.category}`)
  ))
  .sort((a,b)=>a.name.localeCompare(b.name,"fr"))
);
const corporateVehicleOptions=computed(()=>props.rules.equipment
  .filter(item=>item.vehicle)
  .sort((a,b)=>a.name.localeCompare(b.name,"fr"))
);
const corporateSupportItem=computed(()=>
  items.value.get(state.value.sphereSupportItemId) ??
  props.rules.recurring.find(item=>item.id===state.value.sphereSupportItemId) ??
  null
);

function norm(value:string){
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("fr");
}
function money(value:number|null|undefined){
  return value===null||value===undefined?"—":new Intl.NumberFormat("fr-FR",{maximumFractionDigits:0}).format(value)+" $";
}
function notify(){
  const payload=cloneJson(props.modelValue);
  emit("update:modelValue",payload);
}
function priceValue(item:RealityItem){
  const spec=realityPriceSpec(item);
  if(!spec.configurable)return spec.defaultCost??item.price??0;
  const raw=priceDrafts.value[item.id];
  if(raw===undefined||raw==="")return spec.defaultCost;
  const value=Number(raw);
  return Number.isFinite(value)?value:null;
}
function priceValid(item:RealityItem){
  const spec=realityPriceSpec(item);
  const value=priceValue(item);
  if(!spec.configurable)return true;
  if(value===null)return false;
  if(spec.mode==="range")return spec.min!==null&&spec.max!==null&&value>=spec.min&&value<=spec.max;
  if(spec.mode==="minimum")return spec.min!==null&&value>=spec.min;
  return value>0;
}
function pricedItem(item:RealityItem){
  const value=priceValue(item);
  return value===null?item:{...item,price:value,priceMin:value,priceMax:value};
}
function addStatus(item:RealityItem){
  if(!props.style)return {ok:false,reason:"Choisissez d’abord un Style"};
  if(item.neuro&&props.disadvantages.includes("unsinkable"))return {ok:false,reason:"Unsinkable interdit les Neuroprogrammes"};
  if(!priceValid(item))return {ok:false,reason:"Prix à confirmer"};
  return canAffordRealityPurchase(props.rules,state.value,props.style,props.edge,pricedItem(item));
}
function addPurchase(item:RealityItem){
  if(!props.style)return;
  const status=addStatus(item);
  if(!status.ok)return;
  const value=priceValue(item)??0;
  const purchase:RealityPurchase={
    uid:uniqueUid(item.kind==="augmentation"?"aug":"eq"),
    itemId:item.id,
    kind:item.kind,
    selectedPrice:value,
    priceConfirmed:true
  };
  if(item.kind==="augmentation"&&item.generation===2){
    const access=augmentationAccess(props.rules,props.style,item,props.edge,state.value.mjAccessOverride);
    purchase.gen2System=access.systems?.[0]??1;
  }
  if(item.kind==="augmentation")state.value.augmentations.push(purchase);
  else state.value.equipment.push(purchase);
  notify();
}
function removePurchase(kind:"equipment"|"augmentation",uid:string){
  const list=kind==="augmentation"?state.value.augmentations:state.value.equipment;
  const index=list.findIndex(item=>item.uid===uid);
  if(index<0)return;
  const removed=list[index];
  list.splice(index,1);
  if(removed.sphereSupport){
    state.value.sphereSupportType="";
    state.value.sphereSupportItemId="";
  }
  notify();
}
function toggleNeuro(uid:string){
  const purchase=state.value.equipment.find(item=>item.uid===uid);
  if(!purchase)return;
  if(purchase.loaded){
    purchase.loaded=false;
  }else if(loadedNeuroCount.value<neuroCap.value){
    purchase.loaded=true;
  }
  notify();
}
function setGen2System(uid:string,value:string){
  const purchase=state.value.augmentations.find(item=>item.uid===uid);
  if(!purchase)return;
  purchase.gen2System=Math.max(1,Number(value)||1);
  notify();
}
function purchaseItem(id:string){return items.value.get(id)??null}
function gen2Systems(item:RealityItem){
  if(!props.style)return [] as number[];
  return augmentationAccess(props.rules,props.style,item,props.edge,state.value.mjAccessOverride).systems;
}

const equipmentCategories=computed(()=>[...new Set(
  props.rules.equipment
    .filter(item=>item.recurring!=="monthly"&&item.recurring!=="annual")
    .map(item=>item.category)
)].sort((a,b)=>a.localeCompare(b,"fr")));
const augmentationCategories=computed(()=>[...new Set(
  props.rules.augmentations.map(item=>item.category)
)].sort((a,b)=>a.localeCompare(b,"fr")));

const categories=computed(()=>catalogKind.value==="augmentation"?augmentationCategories.value:equipmentCategories.value);

function visibleAugmentation(item:RealityItem){
  if(!props.style)return false;
  if(state.value.mjAccessOverride)return true;
  return augmentationAccess(props.rules,props.style,item,props.edge,false).ok;
}
const filteredEquipment=computed(()=>{
  const q=norm(query.value.trim());
  return props.rules.equipment.filter(item=>{
    if(item.recurring==="monthly"||item.recurring==="annual")return false;
    if(category.value&&item.category!==category.value)return false;
    return !q||norm(`${item.name} ${item.category} ${item.effect} ${item.lore}`).includes(q);
  });
});
const augmentationGroups=computed(()=>{
  const q=norm(query.value.trim());
  const map=new Map<string,RealityItem[]>();
  for(const item of props.rules.augmentations){
    if(!visibleAugmentation(item))continue;
    if(category.value&&item.category!==category.value)continue;
    if(q&&!norm(`${item.name} ${item.category} ${item.effect} ${item.lore}`).includes(q))continue;
    const key=augmentationBaseKey(item);
    if(!map.has(key))map.set(key,[]);
    map.get(key)!.push(item);
  }
  return [...map.entries()]
    .map(([key,variants])=>({
      key,
      variants:variants.sort((a,b)=>(a.generation??1)-(b.generation??1)||(a.price??1e15)-(b.price??1e15))
    }))
    .sort((a,b)=>a.variants[0].name.localeCompare(b.variants[0].name,"fr"));
});
function selectedVariant(group:{key:string;variants:RealityItem[]}){
  const id=variantChoice.value[group.key];
  return group.variants.find(item=>item.id===id)??group.variants[0];
}

const purchasedAugmentations=computed(()=>state.value.augmentations.map(p=>({purchase:p,item:purchaseItem(p.itemId)})));
const purchasedEquipment=computed(()=>state.value.equipment.map(p=>({purchase:p,item:purchaseItem(p.itemId)})));

function defaultRecurringCost(item:RealityItem){return Math.round(recurringMonthlyCost(item));}
function selectedRecurring(){return props.rules.recurring.find(item=>item.id===recurringId.value)??null}
function onRecurringChanged(){
  const item=selectedRecurring();
  recurringDraft.value=item?String(defaultRecurringCost(item)):"";
}
function addRecurring(){
  const item=selectedRecurring();
  if(!item)return;
  const monthly=Math.max(0,Number(recurringDraft.value)||0);
  state.value.fixedChargeItems.push({
    uid:uniqueUid("fc"),
    name:item.name,
    monthly,
    sourceItemId:item.id
  });
  recurringId.value="";
  recurringDraft.value="";
  notify();
}
function addCustomCharge(){
  const name=customChargeName.value.trim();
  if(!name)return;
  state.value.fixedChargeItems.push({
    uid:uniqueUid("fc"),
    name,
    monthly:Math.max(0,Number(customChargeMonthly.value)||0)
  });
  customChargeName.value="";
  customChargeMonthly.value="";
  notify();
}
function removeCharge(uid:string){
  const removed=state.value.fixedChargeItems.find(item=>item.uid===uid);
  state.value.fixedChargeItems=state.value.fixedChargeItems.filter(item=>item.uid!==uid);
  if(removed?.sphereSupport){
    state.value.sphereSupportType="";
    state.value.sphereSupportItemId="";
  }
  notify();
}

function clearCorporateSupportAsset(keepType=false){
  state.value.fixedChargeItems=state.value.fixedChargeItems.flatMap(charge=>{
    if(!charge.sphereSupport)return [charge];
    if(charge.supportCreated)return [];
    return [{
      ...charge,
      monthly:Math.max(0,Number(charge.supportOriginalMonthly)||0),
      sphereSupport:false,
      supportCreated:false,
      supportOriginalMonthly:undefined
    }];
  });
  state.value.equipment=state.value.equipment.flatMap(purchase=>{
    if(!purchase.sphereSupport)return [purchase];
    if(purchase.supportCreated)return [];
    return [{
      ...purchase,
      selectedPrice:Math.max(0,Number(purchase.supportOriginalPrice)||0),
      sphereSupport:false,
      supportCreated:false,
      supportOriginalPrice:undefined
    }];
  });
  state.value.sphereSupportItemId="";
  if(!keepType)state.value.sphereSupportType="";
}

function setCorporateSupportType(value:string){
  clearCorporateSupportAsset(false);
  state.value.sphereSupportType=value==="housing"||value==="vehicle"?value:"";
  notify();
}

function setCorporateSupportItem(itemId:string){
  const type=state.value.sphereSupportType;
  clearCorporateSupportAsset(true);
  if(!itemId){
    notify();
    return;
  }
  state.value.sphereSupportItemId=itemId;

  if(type==="housing"){
    const item=props.rules.recurring.find(entry=>entry.id===itemId);
    if(!item){
      state.value.sphereSupportItemId="";
      notify();
      return;
    }
    const existing=state.value.fixedChargeItems.find(charge=>charge.sourceItemId===itemId&&!charge.sphereSupport);
    if(existing){
      existing.supportOriginalMonthly=existing.monthly;
      existing.monthly=0;
      existing.sphereSupport=true;
      existing.supportCreated=false;
    }else{
      state.value.fixedChargeItems.push({
        uid:uniqueUid("corp-housing"),
        name:item.name,
        monthly:0,
        sourceItemId:item.id,
        sphereSupport:true,
        supportCreated:true
      });
    }
  }else if(type==="vehicle"){
    const item=props.rules.equipment.find(entry=>entry.id===itemId&&entry.vehicle);
    if(!item){
      state.value.sphereSupportItemId="";
      notify();
      return;
    }
    const existing=state.value.equipment.find(purchase=>purchase.itemId===itemId&&!purchase.sphereSupport);
    if(existing){
      existing.supportOriginalPrice=Number(existing.selectedPrice??item.price??item.priceMin??0);
      existing.selectedPrice=0;
      existing.priceConfirmed=true;
      existing.sphereSupport=true;
      existing.supportCreated=false;
    }else{
      state.value.equipment.push({
        uid:uniqueUid("corp-vehicle"),
        itemId:item.id,
        kind:"equipment",
        selectedPrice:0,
        priceConfirmed:true,
        sphereSupport:true,
        supportCreated:true
      });
    }
  }
  notify();
}

</script>

<template>
  <article class="equipment-step">
    <div class="section-heading">
      <div>
        <p class="eyebrow">10 · ÉQUIPEMENT</p>
        <h2>Réalité, équipement & augmentations</h2>
      </div>
      <span class="schema-badge" :class="{ bad: !valid }">{{ valid ? "cohérent" : "à vérifier" }}</span>
    </div>

    <p class="builder-intro">
      Ce bloc utilise le catalogue Réalité consolidé côté serveur. Les achats comptants,
      enveloppes augmentiques, véhicules, Neuroprogrammes et charges fixes restent des mécanismes distincts.
    </p>

    <div v-if="!style" class="rule-note bad">Choisissez d’abord une Sphère et un Style.</div>

    <template v-else>
      <section class="economy-grid">
        <div>
          <small>Compte de départ</small>
          <strong>{{ money(economy?.startAccount) }}</strong>
          <span>Reste {{ money(economy?.account) }}</span>
        </div>
        <div>
          <small>Enveloppe augmentique</small>
          <strong>{{ money(economy?.envelope) }}</strong>
          <span>Dépensé {{ money(economy?.augSpend) }}</span>
        </div>
        <div>
          <small>Capital véhicule</small>
          <strong>{{ money(economy?.vehicleCapital) }}</strong>
          <span>Dépensé {{ money(economy?.vehSpend) }}</span>
        </div>
        <div>
          <small>Fenêtres Gen2</small>
          <strong>{{ economy?.gen2 || 0 }}</strong>
          <span>Style + Edge</span>
        </div>
      </section>

      <section class="reality-panel">
        <div class="subsection-title">
          <div>
            <h3>Train de vie & Charges fixes</h3>
            <p>{{ rules.economy.lifestyle.lore[lifestyleBase] }}</p>
          </div>
          <span class="schema-badge">{{ pressure.base }} → {{ pressure.effective }}</span>
        </div>
        <div class="charge-summary">
          <span>Référence <strong>{{ money(pressure.reference) }}/mois</strong></span>
          <span>Charges <strong>{{ money(pressure.total) }}/mois</strong></span>
          <span>Tranches consommées <strong>{{ pressure.drops }}</strong></span>
          <span>Entretien aug. <strong>{{ money(pressure.augment) }}/mois</strong></span>
          <span>Entretien véhicules <strong>{{ money(pressure.vehicles) }}/mois</strong></span>
        </div>

        <div class="lifestyle-tier-box">
          <div class="lifestyle-tier-track">
            <span
              v-for="tier in lifestyleTiers"
              :key="tier.name"
              class="lifestyle-tier"
              :class="{base:tier.base,effective:tier.effective,lost:tier.lost}"
            >
              {{ tier.name }}
              <small v-if="tier.base">base</small>
              <small v-if="tier.effective">actuel</small>
            </span>
          </div>
          <p v-if="!pressure.atFloor">
            Prochain cran perdu dans <strong>{{ money(pressure.remainingToNext) }}/mois</strong>
            de charges supplémentaires. Le calcul est actualisé immédiatement à chaque ajout ou retrait.
          </p>
          <p v-else>
            Le Train de vie effectif est déjà à <strong>Survie</strong>.
          </p>
        </div>

        <div v-if="pressure.deficit" class="rule-note bad">
          Déficit structurel : {{ money(pressure.deficit) }}/mois au-delà de Survie.
        </div>

        <div class="charge-add-grid">
          <label>
            Ajouter depuis le catalogue
            <select v-model="recurringId" @change="onRecurringChanged">
              <option value="">— Choisir —</option>
              <option v-for="item in rules.recurring" :key="item.id" :value="item.id">
                {{ item.name }} · {{ item.recurring === "annual" ? "annuel" : "mensuel" }}
              </option>
            </select>
          </label>
          <label>
            Reste payé / mois
            <input v-model="recurringDraft" type="number" min="0" step="1" />
          </label>
          <button class="secondary compact" type="button" :disabled="!recurringId" @click="addRecurring">Ajouter</button>
        </div>

        <div class="charge-add-grid custom">
          <label>
            Charge personnalisée
            <input v-model="customChargeName" placeholder="Pension, dette, avantage fourni…" />
          </label>
          <label>
            Montant / mois
            <input v-model="customChargeMonthly" type="number" min="0" step="1" />
          </label>
          <button class="ghost compact" type="button" :disabled="!customChargeName.trim()" @click="addCustomCharge">Ajouter</button>
        </div>

        <div v-if="state.fixedChargeItems.length" class="picked-list">
          <div v-for="charge in state.fixedChargeItems" :key="charge.uid" class="picked-row">
            <div>
              <strong>{{ charge.name }}</strong>
              <span>
                {{ money(charge.monthly) }}/mois
                <template v-if="charge.sphereSupport"> · pris en charge par la corporation</template>
              </span>
            </div>
            <button class="ghost danger compact" type="button" @click="removeCharge(charge.uid)">Retirer</button>
          </div>
        </div>
      </section>

      <section class="reality-panel">
        <div class="subsection-title">
          <div>
            <h3>Augmentations installées</h3>
            <p>
              Charge {{ load.charge }}/{{ integrity }} · Stress {{ load.stress }}/{{ augmentStressMax }}
              <template v-if="load.rawStress !== load.stress"> ({{ load.rawStress }} avant Stabilité augmentique)</template>
            </p>
          </div>
          <span class="schema-badge">{{ purchasedAugmentations.length }}</span>
        </div>
        <div v-if="load.charge > integrity" class="rule-note bad">
          Charge augmentique permanente {{ load.charge }} &gt; Intégrité {{ integrity }}.
        </div>
        <div v-else-if="load.charge === integrity && load.charge > 0" class="rule-note">
          Charge exactement au seuil d’Intégrité : autorisé, mais dangereux.
        </div>
        <div v-if="load.stress > augmentStressMax" class="rule-note bad">
          Stress augmentique {{ load.stress }} &gt; maximum {{ augmentStressMax }}.
        </div>
        <div v-else-if="load.stress === augmentStressMax && load.stress > 0" class="rule-note">
          Stress exactement au maximum : autorisé, mais dangereux.
        </div>
        <div v-if="!purchasedAugmentations.length" class="empty-line">Aucune augmentation.</div>
        <div class="picked-list">
          <div v-for="row in purchasedAugmentations" :key="row.purchase.uid" class="picked-row rich">
            <div v-if="row.item">
              <strong><BuilderWikiLink :label="row.item.name" :article-id="row.item.compendiumId" category="Équipement & Objets" compact /></strong>
              <span>
                {{ money(row.purchase.selectedPrice ?? row.item.price) }}
                <template v-if="row.item.generation"> · Gen {{ row.item.generation }}</template>
                <template v-if="row.item.charge !== null"> · Charge {{ row.item.charge }}</template>
                <template v-if="row.item.stress !== null"> · Stress {{ row.item.stress }}</template>
              </span>
              <small v-if="!augmentationSupportSatisfied(rules,state,row.item)" class="bad-text">
                Support manquant : {{ augmentationSupportLabel(row.item) }}
              </small>
              <label v-if="row.item.generation === 2" class="inline-select">
                Fenêtre Gen2
                <select :value="row.purchase.gen2System || 1" @change="setGen2System(row.purchase.uid,($event.target as HTMLSelectElement).value)">
                  <option
                    v-for="system in gen2Systems(row.item)"
                    :key="system"
                    :value="system"
                  >Système {{ system }}</option>
                </select>
              </label>
            </div>
            <div v-else><strong>Entrée legacy introuvable</strong><span>{{ row.purchase.itemId }}</span></div>
            <button class="ghost danger compact" type="button" @click="removePurchase('augmentation',row.purchase.uid)">Retirer</button>
          </div>
        </div>
      </section>

      <section class="reality-panel">
        <div class="subsection-title">
          <div>
            <h3>Équipement & véhicules possédés</h3>
            <p>Les Neuroprogrammes possédés sont distincts des programmes actuellement chargés.</p>
          </div>
          <span class="schema-badge">{{ purchasedEquipment.length }}</span>
        </div>
        <div v-if="!purchasedEquipment.length" class="empty-line">Aucun achat.</div>
        <div class="picked-list">
          <div v-for="row in purchasedEquipment" :key="row.purchase.uid" class="picked-row rich">
            <div v-if="row.item">
              <strong><BuilderWikiLink :label="row.item.name" :article-id="row.item.compendiumId" category="Équipement & Objets" compact /></strong>
              <span>
                {{ row.item.category }} · {{ money(row.purchase.selectedPrice ?? row.item.price) }}
                <template v-if="row.purchase.sphereSupport"> · véhicule de fonction</template>
              </span>
              <label v-if="row.item.neuro" class="neuro-toggle">
                <input
                  type="checkbox"
                  :checked="!!row.purchase.loaded"
                  :disabled="!row.purchase.loaded && loadedNeuroCount >= neuroCap"
                  @change="toggleNeuro(row.purchase.uid)"
                />
                Chargé · {{ loadedNeuroCount }}/{{ neuroCap }} emplacement(s)
              </label>
            </div>
            <div v-else><strong>Entrée legacy introuvable</strong><span>{{ row.purchase.itemId }}</span></div>
            <button class="ghost danger compact" type="button" @click="removePurchase('equipment',row.purchase.uid)">Retirer</button>
          </div>
        </div>
      </section>

      <section class="reality-panel catalog-panel">
        <div class="subsection-title">
          <div>
            <h3>Catalogue</h3>
            <p>
              {{ rules.counts.equipment }} entrées Équipement · {{ rules.counts.augmentations }} augmentations.
              Les charges mensuelles/annuelles restent dans le panneau Train de vie.
            </p>
          </div>
          <div class="catalog-kind">
            <button type="button" :class="{ selected: catalogKind === 'equipment' }" @click="catalogKind='equipment';category=''">Équipement</button>
            <button type="button" :class="{ selected: catalogKind === 'augmentation' }" @click="catalogKind='augmentation';category=''">Augmentations</button>
          </div>
        </div>

        <div class="catalog-tools">
          <select v-model="category">
            <option value="">Toutes les catégories</option>
            <option v-for="value in categories" :key="value" :value="value">{{ value }}</option>
          </select>
          <input v-model="query" type="search" :placeholder="catalogKind === 'augmentation' ? 'Rechercher une augmentation…' : 'Rechercher équipement, service ou véhicule…'" />
        </div>

        <div class="override-grid">
          <label>
            <input v-model="state.mjAdvancedOverride" type="checkbox" @change="notify" />
            Accord MJ pour achats/augmentations avancés &gt; {{ money(rules.economy.advancedPurchaseThreshold) }}
          </label>
          <label v-if="catalogKind === 'augmentation'">
            <input v-model="state.mjAccessOverride" type="checkbox" @change="notify" />
            Accord MJ pour sortir du package augmentique du Style
          </label>
        </div>

        <div v-if="catalogKind === 'equipment'" class="catalog-grid">
          <article v-for="item in filteredEquipment" :key="item.id" class="catalog-card">
            <div class="catalog-head">
              <div><strong><BuilderWikiLink :label="item.name" :article-id="item.compendiumId" category="Équipement & Objets" /></strong><small>{{ item.category }}</small></div>
              <button class="primary compact" type="button" :disabled="!addStatus(item).ok" @click="addPurchase(item)">Ajouter</button>
            </div>
            <div class="pillbar">
              <span>{{ realityPriceSpec(item).label }}</span>
              <span v-if="item.vehicle">Véhicule</span>
              <span v-if="item.neuro">Neuroprogramme</span>
            </div>
            <label v-if="realityPriceSpec(item).configurable" class="price-config">
              Prix retenu
              <input
                v-model="priceDrafts[item.id]"
                type="number"
                min="0"
                :placeholder="String(realityPriceSpec(item).defaultCost ?? '')"
              />
            </label>
            <div v-if="equipmentStats(item).length" class="statbar">
              <span v-for="[label,value] in equipmentStats(item)" :key="label"><b>{{ label }}</b> {{ value }}</span>
            </div>
            <em v-if="item.lore">{{ item.lore }}</em>
            <p v-if="item.effect"><b>Effet :</b> {{ item.effect }}</p>
            <small v-if="!addStatus(item).ok" class="bad-text">{{ addStatus(item).reason }}</small>
          </article>
        </div>

        <div v-else class="catalog-grid">
          <article v-for="group in augmentationGroups" :key="group.key" class="catalog-card">
            <div class="catalog-head">
              <div>
                <strong><BuilderWikiLink :label="selectedVariant(group).name" :article-id="selectedVariant(group).compendiumId" category="Équipement & Objets" /></strong>
                <small>{{ selectedVariant(group).category }}</small>
              </div>
              <button
                class="primary compact"
                type="button"
                :disabled="!addStatus(selectedVariant(group)).ok"
                @click="addPurchase(selectedVariant(group))"
              >Ajouter</button>
            </div>

            <label v-if="group.variants.length > 1">
              Génération / version
              <select v-model="variantChoice[group.key]">
                <option v-for="variant in group.variants" :key="variant.id" :value="variant.id">
                  {{ variant.generation ? `Gen ${variant.generation}` : "Version" }} · {{ realityPriceSpec(variant).label }}
                </option>
              </select>
            </label>

            <div class="pillbar">
              <span>{{ realityPriceSpec(selectedVariant(group)).label }}</span>
              <span v-if="selectedVariant(group).generation">Gen {{ selectedVariant(group).generation }}</span>
              <span v-if="selectedVariant(group).charge !== null">Charge {{ selectedVariant(group).charge }}</span>
              <span v-if="selectedVariant(group).stress !== null">Stress {{ selectedVariant(group).stress }}</span>
              <span v-for="family in selectedVariant(group).families" :key="family">{{ family }}</span>
              <span>
                {{ augmentationCopyCount(rules,state,selectedVariant(group)) }}/{{ augmentationMaxCopies(selectedVariant(group)) }}
              </span>
            </div>

            <label v-if="realityPriceSpec(selectedVariant(group)).configurable" class="price-config">
              Prix retenu
              <input
                v-model="priceDrafts[selectedVariant(group).id]"
                type="number"
                min="0"
                :placeholder="String(realityPriceSpec(selectedVariant(group)).defaultCost ?? '')"
              />
            </label>

            <div v-if="augmentationSupportLabel(selectedVariant(group))" class="support-line" :class="{ bad: !augmentationSupportSatisfied(rules,state,selectedVariant(group)) }">
              <strong>Support requis :</strong> {{ augmentationSupportLabel(selectedVariant(group)) }}
            </div>
            <div v-if="pureCosmeticAugmentation(selectedVariant(group))" class="support-line">
              Esthétique sans effet mécanique : accessible à tous les Styles.
            </div>
            <em v-if="selectedVariant(group).lore">{{ selectedVariant(group).lore }}</em>
            <p v-if="selectedVariant(group).effect"><b>Effet :</b> {{ selectedVariant(group).effect }}</p>
            <small v-if="!addStatus(selectedVariant(group)).ok" class="bad-text">{{ addStatus(selectedVariant(group)).reason }}</small>
          </article>
        </div>
      </section>

      <section v-if="sphereId === 'corporatiste'" class="reality-panel corporate-support-panel">
        <div class="subsection-title">
          <div>
            <h3>Appui Corporatiste</h3>
            <p>
              L’Avantage contractuel prend en charge une prestation concrète tant que le contrat existe.
              Sa valeur réelle est retirée des dépenses du personnage plutôt que convertie en bonus abstrait.
            </p>
          </div>
          <span class="schema-badge">{{ corporateSupportItem ? "pris en charge" : "à choisir" }}</span>
        </div>

        <div class="corporate-support-grid">
          <label>
            Type de prestation
            <select
              :value="state.sphereSupportType"
              @change="setCorporateSupportType(($event.target as HTMLSelectElement).value)"
            >
              <option value="">— Choisir —</option>
              <option value="housing">Logement de fonction</option>
              <option value="vehicle">Véhicule de fonction</option>
            </select>
          </label>

          <label v-if="state.sphereSupportType === 'housing'">
            Logement pris en charge
            <select
              :value="state.sphereSupportItemId"
              @change="setCorporateSupportItem(($event.target as HTMLSelectElement).value)"
            >
              <option value="">— Choisir dans les logements —</option>
              <option v-for="item in corporateHousingOptions" :key="item.id" :value="item.id">
                {{ item.name }} · {{ item.priceLabel }}
              </option>
            </select>
          </label>

          <label v-else-if="state.sphereSupportType === 'vehicle'">
            Véhicule fourni
            <select
              :value="state.sphereSupportItemId"
              @change="setCorporateSupportItem(($event.target as HTMLSelectElement).value)"
            >
              <option value="">— Choisir dans les véhicules —</option>
              <option v-for="item in corporateVehicleOptions" :key="item.id" :value="item.id">
                {{ item.name }} · {{ item.priceLabel }}
              </option>
            </select>
          </label>
        </div>

        <div v-if="state.sphereSupportType === 'housing' && corporateSupportItem" class="rule-note good">
          <strong>{{ corporateSupportItem.name }}</strong> passe à 0 $/mois :
          la pression sur le Train de vie est recalculée immédiatement.
        </div>
        <div v-else-if="state.sphereSupportType === 'vehicle' && corporateSupportItem" class="rule-note good">
          <strong>{{ corporateSupportItem.name }}</strong> est fourni à 0 $ :
          son prix n’est pas débité du Compte ni du Capital véhicule, et son entretien est pris en charge.
        </div>
      </section>
    </template>
  </article>
</template>

<style scoped>
.equipment-step{display:grid;gap:1rem}.economy-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.7rem}.economy-grid>div{display:grid;gap:.3rem;padding:.85rem;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.015)}.economy-grid small{color:#79736a}.economy-grid strong{font-family:Georgia,serif;font-size:1.25rem}.economy-grid span{color:#a79f92;font-size:.75rem}.reality-panel{margin-top:.4rem;padding:1rem;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.012)}.reality-panel h3{margin:.1rem 0 .55rem;font-family:Georgia,serif}.charge-summary{display:flex;flex-wrap:wrap;gap:.45rem;margin:.8rem 0}.lifestyle-tier-box{display:grid;gap:.55rem;margin:.75rem 0 1rem;padding:.75rem;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.012)}.lifestyle-tier-box p{margin:0;color:#8f887e;font-size:.75rem}.lifestyle-tier-track{display:flex;flex-wrap:wrap;gap:.35rem}.lifestyle-tier{display:flex;align-items:center;gap:.3rem;padding:.35rem .5rem;border:1px solid rgba(255,255,255,.08);color:#766f66;font-size:.72rem}.lifestyle-tier.base{border-color:rgba(199,173,120,.3);color:#c7ad78}.lifestyle-tier.effective{border-color:rgba(112,168,121,.38);color:#b6cfb4;background:rgba(49,80,54,.1)}.lifestyle-tier.lost{opacity:.42;text-decoration:line-through}.lifestyle-tier small{font-size:.58rem;text-transform:uppercase;letter-spacing:.05em}.corporate-support-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem;margin-top:.9rem}.charge-summary>span,.pillbar span,.statbar span{padding:.28rem .45rem;border:1px solid rgba(255,255,255,.08);color:#928b80;font-size:.68rem}.charge-add-grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(120px,1fr) auto;gap:.7rem;align-items:end;margin-top:.7rem}.charge-add-grid.custom{padding-top:.7rem;border-top:1px solid rgba(255,255,255,.06)}.picked-list{display:grid;gap:.5rem;margin-top:.85rem}.picked-row{display:flex;justify-content:space-between;align-items:center;gap:.8rem;padding:.7rem .8rem;border:1px solid rgba(255,255,255,.08)}.picked-row>div{display:grid;gap:.2rem}.picked-row span,.picked-row small{color:#8f887e;font-size:.72rem}.picked-row.rich{align-items:flex-start}.inline-select,.neuro-toggle{display:flex;align-items:center;gap:.5rem;margin-top:.4rem;color:#8f887e;font-size:.72rem}.inline-select select{width:auto}.catalog-kind{display:flex;gap:.35rem}.catalog-kind button{padding:.45rem .65rem;border:1px solid rgba(255,255,255,.09);color:#918a80;background:#11100e}.catalog-kind button.selected{border-color:#9d7c48;color:#dfd2ba}.catalog-tools{display:grid;grid-template-columns:minmax(180px,.7fr) minmax(240px,1.3fr);gap:.7rem;margin:1rem 0}.override-grid{display:flex;flex-wrap:wrap;gap:1rem;margin-bottom:1rem;color:#90897f;font-size:.76rem}.override-grid label{display:flex;gap:.45rem;align-items:center}.catalog-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:.75rem}.catalog-card{display:flex;flex-direction:column;gap:.65rem;padding:.9rem;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.012)}.catalog-head{display:flex;justify-content:space-between;gap:.8rem;align-items:flex-start}.catalog-head>div{display:grid;gap:.2rem}.catalog-head small{color:#777169}.pillbar,.statbar{display:flex;flex-wrap:wrap;gap:.35rem}.catalog-card em{color:#928b80;font-size:.77rem;line-height:1.5}.catalog-card p{margin:0;color:#b6ada0;font-size:.77rem;line-height:1.5}.price-config{max-width:220px}.support-line{padding:.45rem .55rem;border:1px solid rgba(112,168,121,.18);color:#a7bca5;font-size:.72rem}.support-line.bad{border-color:rgba(166,81,72,.28);color:#d0a29c}.bad-text{color:#d0a29c!important}.schema-badge.bad{border-color:rgba(166,81,72,.35);color:#d0a29c}.empty-line{color:#787168;font-size:.8rem}@media(max-width:900px){.economy-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.charge-add-grid,.catalog-tools,.corporate-support-grid{grid-template-columns:1fr}.catalog-grid{grid-template-columns:1fr}}@media(max-width:560px){.economy-grid{grid-template-columns:1fr}.picked-row{align-items:stretch;flex-direction:column}.catalog-head{flex-direction:column}}
</style>
