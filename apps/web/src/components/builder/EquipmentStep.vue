<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { cloneJson } from "../../lib/json";
import BuilderWikiLink from "./BuilderWikiLink.vue";
import BuilderCatalogImage from "./BuilderCatalogImage.vue";
import {
  augmentationAccess,
  augmentationSupportAlternatives,
  augmentationBaseKey,
  augmentationCopyCount,
  augmentationLoad,
  augmentationMaxCopies,
  augmentationSupportLabel,
  augmentationSupportSatisfied,
  isAugmentationSupport,
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

const equipmentQuery=ref("");
const augmentationQuery=ref("");
const equipmentCategory=ref("");
const augmentationCategory=ref("");
const equipmentCatalogOpen=ref(false);
const augmentationCatalogOpen=ref(false);
const priceDrafts=ref<Record<string,string>>({});
const variantChoice=ref<Record<string,string>>({});
const recurringDrafts=ref<Record<string,string>>({});
const customChargeName=ref("");
const customChargeMonthly=ref("");

const state=computed(()=>props.modelValue as unknown as import("../../lib/reality").RealityState);
function housingArtwork(item:RealityItem){return /^equipement-(?:219|22\d|23[0-4])-/.test(item.compendiumId||"")||/logement|studio|dortoir|résidence|appartement|penthouse|villa|squat|planque|cache improvisée/i.test(item.name);}
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
function wikiBadges(item:RealityItem,selectedPrice?:number|null){
  const badges=[item.category];
  const price=selectedPrice??item.price;
  if(price!==null&&price!==undefined)badges.push(money(price));
  if(item.generation)badges.push(`Gen ${item.generation}`);
  if(item.charge!==null)badges.push(`Charge ${item.charge}`);
  if(item.stress!==null)badges.push(`Stress ${item.stress}`);
  if(item.vehicle)badges.push("Véhicule");
  if(item.neuro)badges.push("Neuroprogramme");
  return badges.slice(0,5);
}
function wikiDetail(item:RealityItem){
  return item.effect||item.lore||"";
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
)].sort((a,b)=>catalogRank(a)-catalogRank(b)||a.localeCompare(b,"fr")));
const augmentationCategories=computed(()=>[...new Set(
  props.rules.augmentations.filter(visibleAugmentation).map(item=>item.category)
)].sort((a,b)=>catalogRank(a)-catalogRank(b)||a.localeCompare(b,"fr")));

function catalogRank(label:string){const text=label.toLocaleLowerCase('fr');return /arme|pistolet|fusil|munition|grenade/.test(text)?1:/armure|protection/.test(text)?2:/neuro|holo|réseau/.test(text)?3:/augment|cyber|bio/.test(text)?4:/véhicule|transport|logement/.test(text)?5:/service|quotidien/.test(text)?6:7;}

const recurringGroups=computed(()=>{
  const groups=new Map<string,RealityItem[]>();
  for(const item of props.rules.recurring){
    const label=item.category||"Divers";
    if(!groups.has(label))groups.set(label,[]);
    groups.get(label)!.push(item);
  }
  return [...groups.entries()]
    .map(([label,items])=>({label,items:items.sort((a,b)=>a.name.localeCompare(b.name,"fr"))}))
    .sort((a,b)=>a.label.localeCompare(b.label,"fr"));
});

function visibleAugmentation(item:RealityItem){
  if(!props.style)return false;
  if(state.value.mjAccessOverride)return true;
  return augmentationAccess(props.rules,props.style,item,props.edge,false).ok;
}
const filteredEquipment=computed(()=>{
  const q=norm(equipmentQuery.value.trim());
  return props.rules.equipment.filter(item=>{
    if(!equipmentCategory.value&&!q)return false;
    if(item.recurring==="monthly"||item.recurring==="annual")return false;
    if(equipmentCategory.value&&item.category!==equipmentCategory.value)return false;
    return !q||norm(`${item.name} ${item.category} ${item.effect} ${item.lore}`).includes(q);
  });
});
const augmentationGroups=computed(()=>{
  const q=norm(augmentationQuery.value.trim());
  const map=new Map<string,RealityItem[]>();
  for(const item of props.rules.augmentations){
    if(!augmentationCategory.value&&!q)continue;
    if(!visibleAugmentation(item))continue;
    if(augmentationCategory.value&&item.category!==augmentationCategory.value)continue;
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

const equipmentCatalogGroups=computed(()=>{
  const groups=new Map<string,RealityItem[]>();
  for(const item of filteredEquipment.value){
    const label=item.category||"Divers";
    if(!groups.has(label))groups.set(label,[]);
    groups.get(label)!.push(item);
  }
  return [...groups.entries()]
    .map(([label,items])=>({label,items:items.sort((a,b)=>a.name.localeCompare(b.name,"fr"))}))
    .sort((a,b)=>a.label.localeCompare(b.label,"fr"));
});
const augmentationCatalogGroups=computed(()=>{
  const groups=new Map<string,Array<{key:string;variants:RealityItem[]}>>();
  for(const group of augmentationGroups.value){
    const label=selectedVariant(group).category||"Divers";
    if(!groups.has(label))groups.set(label,[]);
    groups.get(label)!.push(group);
  }
  return [...groups.entries()]
    .map(([label,items])=>({label,items}))
    .sort((a,b)=>a.label.localeCompare(b.label,"fr"));
});
function selectedVariant(group:{key:string;variants:RealityItem[]}){
  const id=variantChoice.value[group.key];
  return group.variants.find(item=>item.id===id)??group.variants[0];
}
async function showRequiredSupport(item:RealityItem){
  const names=augmentationSupportAlternatives(item).flat();
  const support=props.rules.augmentations.find(candidate=>isAugmentationSupport(candidate)&&names.some(name=>norm(candidate.name).includes(name)));
  if(!support)return;
  augmentationCategory.value='';augmentationQuery.value=support.name;augmentationCatalogOpen.value=true;
  await nextTick();document.getElementById('augmentation-catalog')?.scrollIntoView({block:'start',behavior:'smooth'});
}

const purchasedAugmentations=computed(()=>state.value.augmentations.map(p=>({purchase:p,item:purchaseItem(p.itemId)})));
const purchasedEquipment=computed(()=>state.value.equipment.map(p=>({purchase:p,item:purchaseItem(p.itemId)})));
function ownedCount(id:string){return [...state.value.augmentations,...state.value.equipment].filter(p=>p.itemId===id).length;}

function defaultRecurringCost(item:RealityItem){return Math.round(recurringMonthlyCost(item));}
function recurringMonthly(item:RealityItem){
  const draft=recurringDrafts.value[item.id];
  return draft===undefined||draft===""?defaultRecurringCost(item):Math.max(0,Number(draft)||0);
}
function addRecurring(item:RealityItem){
  const monthly=recurringMonthly(item);
  state.value.fixedChargeItems.push({
    uid:uniqueUid("fc"),
    name:item.name,
    monthly,
    sourceItemId:item.id
  });
  delete recurringDrafts.value[item.id];
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
      Équipez votre personnage et suivez ce qu’il vous reste à dépenser. Les achats comptants,
      enveloppes augmentiques, véhicules, Neuroprogrammes et charges fixes suivent des règles distinctes.
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

      <details class="reality-panel section-disclosure">
        <summary class="section-summary"><div class="subsection-title">
          <div>
            <h3>Train de vie & Charges fixes</h3>
            <p>{{ rules.economy.lifestyle.lore[lifestyleBase] }}</p>
          </div>
          <span class="schema-badge">{{ pressure.base }} → {{ pressure.effective }}</span>
        </div></summary>
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

        <div class="recurring-catalog">
          <details v-for="group in recurringGroups" :key="group.label" class="catalog-family catalog-family-disclosure">
            <summary><span>{{ group.label }}</span><span class="family-count">{{ group.items.length }}</span></summary>
            <div class="catalog-grid">
              <article v-for="item in group.items" :key="item.id" class="catalog-card recurring-card">
                <BuilderCatalogImage :article-id="item.compendiumId" :name="item.name" category="Équipement & Objets" :large="housingArtwork(item)" />
                <span v-if="state.fixedChargeItems.some(charge=>charge.sourceItemId===item.id)" class="owned-indicator">✓ Sélectionné · {{ state.fixedChargeItems.filter(charge=>charge.sourceItemId===item.id).length }}</span>
                <div class="catalog-head"><div>
                  <strong><BuilderWikiLink :label="item.name" :article-id="item.compendiumId" category="Équipement & Objets" :detail="wikiDetail(item)" :badges="wikiBadges(item)" /></strong>
                  <small>{{ item.category }} · {{ item.recurring === "annual" ? "facturation annuelle" : "facturation mensuelle" }}</small>
                </div></div>
                <p v-if="item.lore">{{ item.lore }}</p>
                <p v-if="item.effect"><b>Service :</b> {{ item.effect }}</p>
                <label class="recurring-price">Reste payé / mois
                  <input v-model="recurringDrafts[item.id]" type="number" min="0" step="1" :placeholder="String(defaultRecurringCost(item))" />
                </label>
                <button class="secondary compact" type="button" @click="addRecurring(item)">Ajouter · {{ money(recurringMonthly(item)) }}/mois</button>
              </article>
            </div>
          </details>
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
      </details>

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

      <details class="reality-panel section-disclosure">
        <summary class="section-summary"><div class="subsection-title">
          <div>
            <h3>Augmentations installées</h3>
            <p>
              Charge {{ load.charge }}/{{ integrity }} · Stress {{ load.stress }}/{{ augmentStressMax }}
              <template v-if="load.rawStress !== load.stress"> ({{ load.rawStress }} avant Stabilité augmentique)</template>
            </p>
          </div>
          <span class="schema-badge">{{ purchasedAugmentations.length }}</span>
        </div></summary>
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
              <strong><BuilderWikiLink
                  :label="row.item.name"
                  :article-id="row.item.compendiumId"
                  category="Équipement & Objets"
                  :detail="wikiDetail(row.item)"
                  :badges="wikiBadges(row.item,row.purchase.selectedPrice)"
                  compact
                /></strong>
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
      <details
        id="augmentation-catalog"
        class="reality-panel catalog-panel catalog-disclosure"
        :open="augmentationCatalogOpen"
        @toggle="augmentationCatalogOpen=($event.currentTarget as HTMLDetailsElement).open"
      >
        <summary class="catalog-summary">
          <span>
            <strong>Choisir des augmentations</strong>
            <small>Catalogue trié par famille · versions Gen1/Gen2 regroupées</small>
          </span>
          <span class="schema-badge">{{ augmentationGroups.length }}</span>
        </summary>

        <div class="catalog-body">
          <div class="catalog-tools">
            <label>
              Famille
              <select v-model="augmentationCategory">
                <option value="">Toutes les catégories</option>
                <option v-for="value in augmentationCategories" :key="value" :value="value">{{ value }}</option>
              </select>
            </label>
            <label>
              Recherche
              <input v-model="augmentationQuery" type="search" placeholder="Rechercher une augmentation…" />
            </label>
          </div>

          <div class="override-grid">
            <label class="permission-switch">
              <span>
                <strong>Autorisation MJ — achats avancés</strong>
                <small>Permet les achats et augmentations au-delà de {{ money(rules.economy.advancedPurchaseThreshold) }}, avec l’accord du MJ.</small>
              </span>
              <input v-model="state.mjAdvancedOverride" type="checkbox" role="switch" aria-label="Autorisation MJ pour les achats avancés" @change="notify" />
            </label>
            <label class="permission-switch">
              <span>
                <strong>Autorisation MJ — accès aux augmentations</strong>
                <small>Ouvre les augmentations hors du package de votre Style, avec l’accord du MJ.</small>
              </span>
              <input v-model="state.mjAccessOverride" type="checkbox" role="switch" aria-label="Autorisation MJ pour les augmentations hors du Style" @change="notify" />
            </label>
          </div>

          <div class="catalog-count" role="status">{{ augmentationGroups.length }} augmentation(s) correspondante(s)</div>
          <div v-if="!augmentationGroups.length" class="empty-line">
            {{ !augmentationCategory&&!augmentationQuery ? 'Choisis une famille pour voir les augmentations illustrées, ou saisis une recherche.' : 'Aucune augmentation ne correspond à ces critères et aux accès de votre personnage.' }}
            <button v-if="augmentationQuery || augmentationCategory" class="ghost compact" type="button" @click="augmentationQuery=''; augmentationCategory=''">Effacer les filtres</button>
          </div>
          <div class="catalog-category-stack">
            <details v-for="family in augmentationCatalogGroups" :key="family.label" class="catalog-family catalog-family-disclosure" :open="Boolean(augmentationCategory || augmentationQuery)">
              <summary>
                <span>{{ family.label }}</span>
                <span class="family-count">{{ family.items.length }}</span>
              </summary>
              <div class="catalog-grid">
                <article v-for="group in family.items" :key="group.key" class="catalog-card">
                  <BuilderCatalogImage :article-id="selectedVariant(group).compendiumId" :name="selectedVariant(group).name" :generation="selectedVariant(group).generation" category="Équipement & Objets" />
                  <div class="catalog-head">
                    <div>
                      <strong><BuilderWikiLink
                        :label="selectedVariant(group).name"
                        :article-id="selectedVariant(group).compendiumId"
                        category="Équipement & Objets"
                        :detail="wikiDetail(selectedVariant(group))"
                        :badges="wikiBadges(selectedVariant(group),priceValue(selectedVariant(group)))"
                      /></strong>
                      <small>{{ selectedVariant(group).category }}</small>
                    </div>
                    <button
                      class="primary compact"
                      type="button"
                      :disabled="!addStatus(selectedVariant(group)).ok"
                      @click="addPurchase(selectedVariant(group))"
                    >{{ ownedCount(selectedVariant(group).id) ? 'Ajouter encore' : 'Ajouter' }}</button>
                  </div>

                  <label v-if="group.variants.length > 1">
                    Génération / version
                    <select :value="selectedVariant(group).id" @change="variantChoice[group.key]=($event.target as HTMLSelectElement).value">
                      <option v-for="variant in group.variants" :key="variant.id" :value="variant.id">
                        {{ variant.generation ? `Gen ${variant.generation}` : "Version" }} · {{ realityPriceSpec(variant).label }}
                      </option>
                    </select>
                  </label>

                  <div class="pillbar">
                    <span v-if="ownedCount(selectedVariant(group).id)" class="owned-indicator">✓ Installé · {{ ownedCount(selectedVariant(group).id) }}</span>
                    <span>{{ realityPriceSpec(selectedVariant(group)).label }}</span>
                    <span v-if="selectedVariant(group).generation">Gen {{ selectedVariant(group).generation }}</span>
                    <span v-if="selectedVariant(group).charge !== null">Charge {{ selectedVariant(group).charge }}</span>
                    <span v-if="selectedVariant(group).stress !== null">Stress {{ selectedVariant(group).stress }}</span>
                    <span v-for="familyName in selectedVariant(group).families" :key="familyName">{{ familyName }}</span>
                    <span>{{ augmentationCopyCount(rules,state,selectedVariant(group)) }}/{{ augmentationMaxCopies(selectedVariant(group)) }}</span>
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
                    <strong>Support requis :</strong> <button type="button" class="support-jump" @click="showRequiredSupport(selectedVariant(group))">{{ augmentationSupportLabel(selectedVariant(group)) }} → Voir le support</button>
                  </div>
                  <div v-if="pureCosmeticAugmentation(selectedVariant(group))" class="support-line">
                    Esthétique sans effet mécanique : accessible à tous les Styles.
                  </div>
                  <details v-if="selectedVariant(group).lore || selectedVariant(group).effect" class="catalog-card-details">
                    <summary>Effet et description</summary>
                    <p v-if="selectedVariant(group).effect"><b>Effet :</b> {{ selectedVariant(group).effect }}</p>
                    <p v-if="selectedVariant(group).lore">{{ selectedVariant(group).lore }}</p>
                  </details>
                  <small v-if="!addStatus(selectedVariant(group)).ok" class="bad-text">{{ addStatus(selectedVariant(group)).reason }}</small>
                </article>
              </div>
            </details>
          </div>
        </div>
      </details>
      </details>

      <details class="reality-panel section-disclosure">
        <summary class="section-summary"><div class="subsection-title">
          <div>
            <h3>Équipement & véhicules possédés</h3>
            <p>Les Neuroprogrammes possédés sont distincts des programmes actuellement chargés.</p>
          </div>
          <span class="schema-badge">{{ purchasedEquipment.length }}</span>
        </div></summary>
        <div v-if="!purchasedEquipment.length" class="empty-line">Aucun achat.</div>
        <div class="picked-list">
          <div v-for="row in purchasedEquipment" :key="row.purchase.uid" class="picked-row rich">
            <div v-if="row.item">
              <strong><BuilderWikiLink
                  :label="row.item.name"
                  :article-id="row.item.compendiumId"
                  category="Équipement & Objets"
                  :detail="wikiDetail(row.item)"
                  :badges="wikiBadges(row.item,row.purchase.selectedPrice)"
                  compact
                /></strong>
              <span>
                {{ row.item.category }} · {{ money(row.purchase.selectedPrice ?? row.item.price) }}
                <template v-if="row.purchase.sphereSupport"> · véhicule de fonction</template>
              </span>
              <label v-if="row.item.neuro" class="neuro-toggle">
                <input
                  type="checkbox"
                  role="switch"
                  :aria-label="`Charger le Neuroprogramme ${row.item.name}`"
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
      <details
        class="reality-panel catalog-panel catalog-disclosure"
        :open="equipmentCatalogOpen"
        @toggle="equipmentCatalogOpen=($event.currentTarget as HTMLDetailsElement).open"
      >
        <summary class="catalog-summary">
          <span>
            <strong>Choisir équipement, services & véhicules</strong>
            <small>Catalogue trié par famille · achats ponctuels distincts des Charges fixes</small>
          </span>
          <span class="schema-badge">{{ filteredEquipment.length }}</span>
        </summary>

        <div class="catalog-body">
          <div class="catalog-tools">
            <label>
              Famille
              <select v-model="equipmentCategory">
                <option value="">Toutes les catégories</option>
                <option v-for="value in equipmentCategories" :key="value" :value="value">{{ value }}</option>
              </select>
            </label>
            <label>
              Recherche
              <input v-model="equipmentQuery" type="search" placeholder="Rechercher équipement, service ou véhicule…" />
            </label>
          </div>

          <div class="override-grid">
            <label class="permission-switch">
              <span>
                <strong>Autorisation MJ — achats avancés</strong>
                <small>Permet les achats au-delà de {{ money(rules.economy.advancedPurchaseThreshold) }}, avec l’accord du MJ. Ce réglage est commun aux deux catalogues.</small>
              </span>
              <input v-model="state.mjAdvancedOverride" type="checkbox" role="switch" aria-label="Autorisation MJ pour les achats avancés" @change="notify" />
            </label>
          </div>

          <div class="catalog-count" role="status">{{ filteredEquipment.length }} entrée(s) correspondante(s)</div>
          <div v-if="!filteredEquipment.length" class="empty-line">
            {{ !equipmentCategory&&!equipmentQuery ? 'Choisis une famille dans la liste pour voir ses cartes illustrées, ou saisis une recherche.' : 'Aucun équipement ne correspond à ces critères.' }}
            <button v-if="equipmentQuery || equipmentCategory" class="ghost compact" type="button" @click="equipmentQuery=''; equipmentCategory=''">Effacer les filtres</button>
          </div>
          <div class="catalog-category-stack">
            <details v-for="group in equipmentCatalogGroups" :key="group.label" class="catalog-family catalog-family-disclosure" :open="Boolean(equipmentCategory || equipmentQuery)">
              <summary>
                <span>{{ group.label }}</span>
                <span class="family-count">{{ group.items.length }}</span>
              </summary>
              <div class="catalog-grid">
                <article v-for="item in group.items" :key="item.id" class="catalog-card">
                  <BuilderCatalogImage :article-id="item.compendiumId" :name="item.name" category="Équipement & Objets" :large="housingArtwork(item)" />
                  <div class="catalog-head">
                    <div><strong><BuilderWikiLink
                        :label="item.name"
                        :article-id="item.compendiumId"
                        category="Équipement & Objets"
                        :detail="wikiDetail(item)"
                        :badges="wikiBadges(item,priceValue(item))"
                      /></strong><small>{{ item.category }}</small></div>
                    <button class="primary compact" type="button" :disabled="!addStatus(item).ok" @click="addPurchase(item)">{{ ownedCount(item.id) ? 'Ajouter encore' : 'Ajouter' }}</button>
                  </div>
                  <div class="pillbar">
                    <span v-if="ownedCount(item.id)" class="owned-indicator">✓ Possédé · {{ ownedCount(item.id) }}</span>
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
            </details>
          </div>
        </div>
      </details>
      </details>





      
    </template>
  </article>
</template>

<style scoped>
.equipment-step{
  --equipment-border:#30465b;
  --equipment-muted:#a4b8ca;
  display:grid;
  gap:24px;
  min-width:0;
  color:#e7eef8;
  font:400 15px/1.6 Inter,"Segoe UI",sans-serif;
  container-type:inline-size;
}
.equipment-step h2,.equipment-step h3,.equipment-step h4{
  color:#e7eef8;
  font-family:Inter,"Segoe UI",sans-serif;
  letter-spacing:-.02em;
}
.section-heading,.subsection-title{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.section-heading h2{margin:4px 0 0;font-size:clamp(22px,2.4vw,30px);line-height:1.25}
.eyebrow{margin:0;color:#86dff4;font-size:12px;font-weight:600;letter-spacing:.14em}
.builder-intro{margin:0;color:var(--equipment-muted);max-width:82ch}
.equipment-step label{display:grid;gap:8px;color:#c5d4e2;font-size:14px;min-width:0}
.equipment-step input:not([type="checkbox"]),.equipment-step select{
  box-sizing:border-box;width:100%;max-width:100%;min-width:0;min-height:44px;margin:0;padding:10px 12px;
  border:1px solid #3a5267;border-radius:7px;background:#091522;color:#e7eef8;font:inherit;
}
.equipment-step input::placeholder{color:#8da3b8;opacity:1}
.equipment-step button{min-height:44px;padding:10px 15px;border-radius:7px;font:600 14px/1.35 Inter,"Segoe UI",sans-serif;white-space:normal}
.equipment-step button.primary{border:1px solid #98e5f6;background:#9ce8fb;color:#06151e}
.equipment-step button.secondary,.equipment-step button.ghost{border:1px solid #3b5268;background:#101e2d;color:#d5e6f4}
.equipment-step button.danger{color:#ffc0bc}
.equipment-step button:disabled{opacity:.5;cursor:not-allowed}
.equipment-step button:not(:disabled):hover{filter:brightness(1.12)}
.equipment-step :is(input,select,button,summary):focus-visible{outline:2px solid #92e7fc;outline-offset:3px}
.schema-badge{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;min-height:28px;padding:3px 10px;border:1px solid #34576a;border-radius:5px;color:#99e5f5;font-size:12px;line-height:1.4;text-align:center}
.schema-badge.bad{border-color:#78505a;color:#ffc0bc}
.economy-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.economy-grid>div{display:grid;align-content:start;gap:6px;padding:18px;border:1px solid var(--equipment-border);border-radius:8px;background:linear-gradient(135deg,#132638,#0d1927)}
.economy-grid small{color:#b4c7d9;font-size:13px}
.economy-grid strong{color:#b1edfb;font:600 clamp(20px,2vw,26px)/1.2 Inter,"Segoe UI",sans-serif;font-variant-numeric:tabular-nums}
.economy-grid span{color:var(--equipment-muted);font-size:14px}
.reality-panel{min-width:0;margin:0;padding:22px;border:1px solid var(--equipment-border);border-radius:9px;background:#0e1a28}
.section-disclosure>.section-summary{cursor:pointer;list-style:none}.section-disclosure>.section-summary::-webkit-details-marker{display:none}.section-disclosure>.section-summary .subsection-title{margin:0}.section-disclosure>.section-summary::after{content:'⌄';float:right;color:#8dded9}.section-disclosure[open]>.section-summary::after{transform:rotate(180deg)}.section-disclosure[open]>.section-summary{margin-bottom:18px}
.reality-panel h3{margin:0 0 8px;font-size:19px;line-height:1.3}
.subsection-title p{margin:0;color:var(--equipment-muted);font-size:14px}
.charge-summary{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0}
.charge-summary>span,.pillbar span,.statbar span{padding:5px 9px;border:1px solid #334c60;border-radius:5px;background:#0b1623;color:#bed0e0;font-size:13px}
.owned-indicator{display:inline-flex;align-self:start;padding:6px 10px;border:1px solid #58bbae;border-radius:5px;background:#153b38;color:#d1fff6;font-size:13px;font-weight:700}.pillbar .owned-indicator{border-color:#58bbae;background:#153b38;color:#d1fff6;font-weight:700}
.support-jump{padding:3px 5px;border:0;background:none;color:#a4edff;text-decoration:underline;cursor:pointer;font:inherit}
.catalog-family-disclosure{border:1px solid #304b62;border-radius:7px}.catalog-family-disclosure>summary{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:48px;padding:10px 14px;color:#e8f2ff;font-weight:650;cursor:pointer;list-style:none;user-select:none}.catalog-family-disclosure>summary::-webkit-details-marker{display:none}.catalog-family-disclosure>summary:before{content:'›';color:#89dce8;font-size:21px}.catalog-family-disclosure[open]>summary:before{transform:rotate(90deg)}.catalog-family-disclosure>.catalog-grid{padding:12px}.catalog-family-disclosure>summary:focus-visible{outline:2px solid #a3eaff}
.charge-summary strong{color:#e4eff9;font-weight:600}
.lifestyle-tier-box{display:grid;gap:14px;margin:16px 0 20px;padding:16px;border:1px solid #2c4255;border-radius:8px;background:#0a1522}
.lifestyle-tier-box p{margin:0;color:var(--equipment-muted);font-size:14px}
.lifestyle-tier-track{display:flex;flex-wrap:wrap;gap:7px}
.lifestyle-tier{display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:7px 10px;border:1px solid #2f4356;border-radius:5px;color:#a6b9ca;font-size:14px}
.lifestyle-tier.base{border-color:#456c84;color:#b6e6f2}
.lifestyle-tier.effective{border-color:#72c9e0;color:#b4effc;background:#153749}
.lifestyle-tier.lost{color:#899ba9;text-decoration:line-through}
.lifestyle-tier small{font-size:11px;text-transform:uppercase;letter-spacing:.04em}
.corporate-support-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:20px}
.charge-add-grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(120px,1fr) auto;gap:14px;align-items:end;margin-top:16px}
.charge-add-grid.custom{padding-top:18px;border-top:1px solid #293e52}
.recurring-catalog{display:grid;gap:20px;margin-top:20px}.recurring-catalog .catalog-family{padding-top:0}.recurring-card .recurring-price{margin-top:auto}.recurring-card>button{align-self:flex-start}
.picked-list{display:grid;gap:10px;margin-top:18px}
.picked-row{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:16px;border:1px solid #30465b;border-radius:7px;background:#0a1623}
.picked-row>div{display:grid;gap:5px;min-width:0;overflow-wrap:anywhere}
.picked-row>button{flex-shrink:0}
.picked-row span,.picked-row small{color:var(--equipment-muted);font-size:14px}
.picked-row.rich{align-items:flex-start}
.equipment-step .inline-select,.equipment-step .neuro-toggle{display:flex;align-items:center;flex-wrap:wrap;gap:10px;min-height:44px;margin-top:8px;color:#b8cada;font-size:14px}
.inline-select select{width:auto;max-width:100%}
.catalog-tools{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:16px;margin:20px 0}
.catalog-count{margin:0 0 16px;color:var(--equipment-muted);font-size:14px}
.override-grid{display:grid;gap:12px;margin-bottom:20px}
.equipment-step .permission-switch{display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:64px;padding:16px 18px;border:1px solid #365267;border-radius:8px;background:#102330;cursor:pointer}
.permission-switch>span{display:grid;gap:5px;min-width:0}
.permission-switch strong{color:#c8eefa;font-size:14px;font-weight:600}
.permission-switch small{color:#a9c0d2;font-size:13px;line-height:1.5}
.equipment-step input[type="checkbox"]{
  appearance:none;-webkit-appearance:none;position:relative;display:block;flex:0 0 42px;width:42px!important;min-width:42px!important;max-width:42px;height:24px;min-height:24px!important;max-height:24px;padding:0;margin:0;
  border:1px solid #57788e;border-radius:999px;background:#203749;cursor:pointer;box-shadow:none;transition:background .15s,border-color .15s;
}
.equipment-step input[type="checkbox"]::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#b2c8d9;transition:transform .15s}
.equipment-step input[type="checkbox"]:checked{background:#8adcf0;border-color:#a6edfc}
.equipment-step input[type="checkbox"]:checked::after{background:#0e2735;transform:translateX(18px)}
.equipment-step input[type="checkbox"]:disabled{opacity:.5;cursor:not-allowed}
.catalog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,270px),1fr));gap:16px}
.catalog-disclosure{padding:0!important}
.catalog-summary{cursor:pointer;display:flex;align-items:center;gap:16px;min-height:78px;padding:20px 22px;list-style:none}
.catalog-summary::-webkit-details-marker{display:none}
.catalog-summary>span:first-child{display:grid;flex:1;gap:6px;min-width:0}
.catalog-summary strong{font:600 18px/1.35 Inter,"Segoe UI",sans-serif;color:#e7eef8}
.catalog-summary small{color:var(--equipment-muted);font-size:14px;line-height:1.5}
.catalog-summary::after{content:"›";flex-shrink:0;color:#9be5f8;font-size:25px;line-height:1;transform:rotate(90deg);transition:transform .15s}
.catalog-disclosure[open]>.catalog-summary::after{transform:rotate(-90deg)}
.catalog-body{padding:0 22px 22px;border-top:1px solid var(--equipment-border)}
.catalog-category-stack{display:grid;gap:24px}
.catalog-family{min-width:0;padding-top:22px;border-top:1px solid #30475b}
.catalog-family:first-child{border-top:0;padding-top:4px}
.catalog-family>h4{display:flex;align-items:center;gap:10px;margin:0 0 14px;color:#d5e8f6;font:600 14px/1.4 Inter,"Segoe UI",sans-serif;letter-spacing:.05em;text-transform:uppercase}
.family-count{display:inline-flex;align-items:center;justify-content:center;min-width:30px;min-height:24px;padding:2px 6px;border:1px solid #416276;border-radius:5px;color:#a1e5f5;font-size:12px}
.catalog-card{display:flex;flex-direction:column;gap:14px;min-width:0;padding:18px;border:1px solid #344d63;border-radius:8px;background:#101f30;overflow-wrap:anywhere}
.catalog-card-details{padding:10px 12px;border:1px solid #344d63;border-radius:6px}.catalog-card-details>summary{cursor:pointer;color:#a4edff;font-size:14px;font-weight:600}.catalog-card-details>p{margin:12px 0 0}.catalog-card-details:not([open]){margin-top:auto}
.catalog-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}
.catalog-head>div{display:grid;gap:6px;min-width:0}
.catalog-head>button{flex-shrink:0}
.catalog-head small{color:var(--equipment-muted);font-size:13px}
.pillbar,.statbar{display:flex;flex-wrap:wrap;gap:7px}
.catalog-card em{color:#b5c8d9;font-size:14px;line-height:1.6;font-style:normal}
.catalog-card p{margin:0;color:#c5d6e5;font-size:14px;line-height:1.6}
.price-config{max-width:260px}
.support-line{padding:10px 12px;border:1px solid #3b6074;border-radius:6px;background:#112b3b;color:#c3e5f1;font-size:14px}
.support-line.bad{border-color:#78515a;background:#30232e;color:#ffc4bc}
.bad-text{color:#ffc4bc!important;font-size:14px;line-height:1.5}
.rule-note{margin-top:16px;padding:14px 16px;border:1px solid #3f6072;border-radius:7px;background:#112838;color:#c5e7f2;font-size:14px;line-height:1.6}
.rule-note.bad{border-color:#79535c;background:#30232e;color:#ffc4bc}
.rule-note.good{border-color:#41667b;background:#112d3c;color:#c9eaf4}
.empty-line{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-top:16px;padding:16px;border:1px dashed #3b5368;border-radius:7px;color:#b9cbdb;font-size:14px}
@container (max-width:850px){
  .economy-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .charge-add-grid{grid-template-columns:minmax(0,1.5fr) minmax(100px,1fr)}
  .charge-add-grid>button{grid-column:1/-1;justify-self:start}
}
@container (max-width:540px){
  .section-heading,.subsection-title{flex-wrap:wrap}
  .reality-panel{padding:16px}
  .catalog-summary{padding:18px 16px;gap:12px}
  .catalog-summary strong{font-size:16px}
  .catalog-summary small{font-size:13px}
  .catalog-body{padding:0 16px 16px}
  .catalog-tools,.corporate-support-grid,.charge-add-grid{grid-template-columns:minmax(0,1fr)}
  .charge-add-grid>button{justify-self:stretch}
  .equipment-step .permission-switch{gap:16px;padding:14px}
  .picked-row{align-items:stretch;flex-direction:column}
  .picked-row>button{align-self:flex-start}
}
@container (max-width:360px){
  .economy-grid{grid-template-columns:minmax(0,1fr)}
  .catalog-head{flex-direction:column}
}
@media(prefers-reduced-motion:reduce){
  .equipment-step input[type="checkbox"],.equipment-step input[type="checkbox"]::after,.catalog-summary::after{transition:none}
}
</style>
