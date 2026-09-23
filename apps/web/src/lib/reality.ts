export {purchasePrice,realityEconomic} from '../../../api/src/rules/economy-model';
import {purchasePrice,realityEconomic} from '../../../api/src/rules/economy-model';
export type RealityItem={
  id:string;
  compendiumId?:string;
  kind:"equipment"|"augmentation";
  name:string;
  category:string;
  sourceCategory:string;
  price:number|null;
  priceMin:number|null;
  priceMax:number|null;
  priceLabel:string;
  generation:number|null;
  charge:number|null;
  stress:number|null;
  slots:string|number|null;
  effect:string;
  lore:string;
  data:Record<string,unknown>;
  vehicle:boolean;
  neuro:boolean;
  recurring:"one_off"|"durable_purchase"|"per_use"|"monthly"|"annual";
  monthlyCost:number;
  families:string[];
};

export type RealityRulesPackage={
  source:{equipment:string;version:string;mergedLoreFiles:number};
  economy:{
    advancedPurchaseThreshold:number;
    unusedEnvelopeRefundRate:number;
    styleAugAccess:Record<string,{
      text:string;
      gen1:readonly string[];
      gen2:readonly string[];
      bio?:readonly string[];
      bioCap?:number;
    }>;
    lifestyle:{
      order:readonly string[];
      monthlyReference:Record<string,number>;
      lore:Record<string,string>;
    };
  };
  equipment:RealityItem[];
  augmentations:RealityItem[];
  recurring:RealityItem[];
  counts:{
    equipment:number;
    augmentations:number;
    recurring:number;
    monthly:number;
    annual:number;
    vehicles:number;
    neuroprograms:number;
  };
};

export type RealityPurchase={
  uid:string;
  itemId:string;
  kind:"equipment"|"augmentation";
  gen2System?:number;
  selectedPrice?:number;
  priceConfirmed?:boolean;
  loaded?:boolean;
  acquiredInCampaign?:boolean;
  campaignCatalogPrice?:number;
  campaignCommerceDegree?:number;
  sphereSupport?:boolean;
  supportCreated?:boolean;
  supportOriginalPrice?:number;
};

export type FixedCharge={
  uid:string;
  name:string;
  monthly:number;
  sourceItemId?:string;
  sphereSupport?:boolean;
  supportCreated?:boolean;
  supportOriginalMonthly?:number;
};

export type RealityState={
  augmentations:RealityPurchase[];
  equipment:RealityPurchase[];
  fixedChargeItems:FixedCharge[];
  mjAdvancedOverride:boolean;
  mjAccessOverride:boolean;
  sphereSupportType:""|"housing"|"vehicle";
  sphereSupportItemId:string;
};

export type RealityStyle={
  id:string;
  name:string;
  expertiseFamilies:string[];
  lifestyle:string;
  account:number;
  augmentationEnvelope:number;
  gen2SlotsBase:number;
  vehicleCapital:number;
};

export type RealityEconomy={
  account:number;
  startAccount:number;
  envelope:number;
  vehicleCapital:number;
  gen2:number;
  augUnused:number;
  vehUnused:number;
  augOverflow:number;
  vehOverflow:number;
  augSpend:number;
  equipSpend:number;
  vehSpend:number;
};

function record(value:unknown):Record<string,unknown>{
  return value&&typeof value==="object"&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function array(value:unknown){return Array.isArray(value)?value:[];}

export function ensureRealityState(raw:Record<string,unknown>):RealityState{
  const augmentations=array(raw.augmentations).filter(x=>x&&typeof x==="object") as RealityPurchase[];
  const equipment=array(raw.equipment).filter(x=>x&&typeof x==="object") as RealityPurchase[];
  const fixedChargeItems=array(raw.fixedChargeItems).filter(x=>x&&typeof x==="object") as FixedCharge[];
  const legacySupport=String(raw.sphereSupportDetail??"");
  let sphereSupportType=String(raw.sphereSupportType??"");
  if(!["housing","vehicle"].includes(sphereSupportType)){
    const normalized=legacySupport.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    sphereSupportType=/logement|maison|appartement|studio|villa|hebergement/.test(normalized)
      ?"housing"
      :/vehicule|voiture|moto|transport/.test(normalized)
        ?"vehicle"
        :"";
  }
  Object.assign(raw,{
    augmentations,
    equipment,
    fixedChargeItems,
    mjAdvancedOverride:Boolean(raw.mjAdvancedOverride),
    mjAccessOverride:Boolean(raw.mjAccessOverride),
    sphereSupportType,
    sphereSupportItemId:String(raw.sphereSupportItemId??"")
  });
  for(const key of ["sphereSupportDetail","possessionsNotes","networks","statuses","patrimony","debts"]){
    delete raw[key];
  }
  return raw as unknown as RealityState;
}

export function realityItemMap(pkg:RealityRulesPackage){
  return new Map([...pkg.equipment,...pkg.augmentations].map(item=>[item.id,item]));
}


export function realityLifestyleBase(
  pkg:RealityRulesPackage,
  style:RealityStyle,
  edge:Record<string,number>,
  talentIds:string[],
  disadvantages:string[]
){
  const order=[...pkg.economy.lifestyle.order];
  let index=Math.max(0,order.indexOf(style.lifestyle||"Standard"));
  if(talentIds.includes("fier_heritier")){
    index=Math.max(order.indexOf("Confortable"),Math.min(order.length-1,index+1));
  }
  if(Number(edge.lifestylePack||0)>0&&index<order.indexOf("Aisé"))index++;
  if(disadvantages.includes("miserable_endette"))index=Math.max(0,index-1);
  return order[index]??"Standard";
}

export function automaticAugmentationMaintenance(
  pkg:RealityRulesPackage,
  state:RealityState
){
  const items=realityItemMap(pkg);
  const value=state.augmentations.reduce((sum,p)=>{
    const item=items.get(p.itemId);
    return sum+purchasePrice(p,item??null);
  },0);
  if(value<=0)return 0;
  const levels=[25,100,250,500,1000,1500];
  let index=value<=5000?0:value<=20000?1:value<=50000?2:value<=100000?3:value<=200000?4:5;
  const majors=state.augmentations
    .map(p=>items.get(p.itemId))
    .filter(item=>
      item?.generation===1&&
      /cablage neuronal|cyberoeil|cyberaudio|cyberbras|cyberjambe|support/i.test(item.name)
    ).length;
  if(majors>=2)index=Math.min(levels.length-1,index+1);
  return levels[index];
}

function moneyField(item:RealityItem,names:string[]){
  const wanted=new Set(names.map(x=>x.toLocaleLowerCase("fr")));
  for(const [key,value] of Object.entries(record(item.data))){
    if(wanted.has(key.toLocaleLowerCase("fr"))){
      if(typeof value==="number")return value;
      const match=String(value??"").replace(/\s/g,"").match(/\d+(?:[.,]\d+)?/);
      if(match)return Number(match[0].replace(",","."));
    }
  }
  return 0;
}

export function automaticVehicleMaintenance(pkg:RealityRulesPackage,state:RealityState){
  const items=realityItemMap(pkg);
  return state.equipment.reduce((sum,p)=>{
    const item=items.get(p.itemId);
    return item?.vehicle&&!p.sphereSupport
      ?sum+moneyField(item,["Entretien/mois","Entretien mensuel","Maintenance/mois"])
      :sum;
  },0);
}

export function lifestylePressure(
  pkg:RealityRulesPackage,
  state:RealityState,
  base:string
){
  const manual=state.fixedChargeItems.reduce((sum,item)=>sum+Math.max(0,Number(item.monthly)||0),0);
  const augment=automaticAugmentationMaintenance(pkg,state);
  const vehicles=automaticVehicleMaintenance(pkg,state);
  const total=manual+augment+vehicles;
  const order=[...pkg.economy.lifestyle.order];
  const baseIndex=Math.max(0,order.indexOf(base));
  const reference=pkg.economy.lifestyle.monthlyReference[base]??200;
  const drops=Math.floor(total/reference);
  const effective=order[Math.max(0,baseIndex-drops)]??order[0]??"Survie";
  const effectiveIndex=Math.max(0,baseIndex-drops);
  const atFloor=effectiveIndex===0;
  const nextDropAt=(drops+1)*reference;
  return {
    base,effective,reference,total,drops,
    baseIndex,effectiveIndex,
    deficit:Math.max(0,drops-baseIndex)*reference,
    nextDropAt,
    remainingToNext:atFloor?0:Math.max(0,nextDropAt-total),
    atFloor,
    manual,augment,vehicles
  };
}

export function neuroRank(raw:number){
  if(raw<=0)return 0;
  if(raw<=3)return 1;
  if(raw<=6)return 2;
  if(raw<=9)return 3;
  return 4;
}

export function neuroCapacity(raw:number,talentIds:string[],disadvantages:string[]){
  if(disadvantages.includes("unsinkable"))return 0;
  return neuroRank(raw)+(talentIds.includes("neurodriver")?1:0);
}

export function augmentationAccess(
  pkg:RealityRulesPackage,
  style:RealityStyle,
  item:RealityItem,
  edge:Record<string,number>,
  override=false
){
  if(override)return {ok:true,systems:[] as number[],reason:"Autorisation MJ"};
  const access=pkg.economy.styleAugAccess[style.id];
  if(!access)return {ok:false,systems:[] as number[],reason:"Accès augmentique non documenté"};
  const families=item.families;
  if(pureCosmeticAugmentation(item)){
    if(item.generation===2){
      const windows=(style.gen2SlotsBase||0)+Number(edge.augmentationPacks||0);
      const systems=Array.from({length:windows},(_,index)=>index+1);
      return systems.length?{ok:true,systems,reason:""}:{ok:false,systems,reason:"Aucune fenêtre Gen2"};
    }
    return {ok:true,systems:[],reason:""};
  }
  const allowed=(tags:readonly string[])=>tags.includes("all")||families.some(family=>tags.includes(family));
  const bio=families.includes("bio");
  if(bio){
    if(!access.bio?.length)return {ok:false,systems:[],reason:"Biogénétique hors package de Style"};
    if(access.bioCap&&Number(item.price||0)>access.bioCap)return {ok:false,systems:[],reason:`Biogénétique limitée à ${access.bioCap.toLocaleString("fr-FR")} $`};
    return allowed(access.bio)?{ok:true,systems:[],reason:""}:{ok:false,systems:[],reason:"Type de Biogénétique hors accès du Style"};
  }
  if(item.generation===2){
    const windows=(style.gen2SlotsBase||0)+Number(edge.augmentationPacks||0);
    const systems:number[]=[];
    for(let index=1;index<=windows;index++){
      const tags=index<=(style.gen2SlotsBase||0)?access.gen2:access.gen1;
      if(allowed(tags))systems.push(index);
    }
    return systems.length
      ?{ok:true,systems,reason:""}
      :{ok:false,systems,reason:"Aucune fenêtre Gen2 compatible avec cette famille"};
  }
  return allowed(access.gen1)
    ?{ok:true,systems:[],reason:""}
    :{ok:false,systems:[],reason:`Famille Gen1 hors package (${families.join(", ")||"non classée"})`};
}

function realityNorm(value:unknown=""){
  return String(value??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()
    .replace(/[’']/g,"'").replace(/[^a-z0-9]+/g," ").trim();
}

function realityDeepField(item:RealityItem,names:string[]){
  const wanted=new Set(names.map(realityNorm));
  const pools=[item.data,record(item.data?.data),record(item.data?.details)];
  for(const pool of pools){
    for(const [key,value] of Object.entries(pool)){
      if(wanted.has(realityNorm(key))&&value!==undefined&&value!==null&&value!=="")return value;
    }
  }
  return null;
}

export function isAugmentationSupport(item:RealityItem){
  const name=realityNorm(item.name);
  const type=realityNorm(`${item.category} ${realityDeepField(item,["Type"])??""}`);
  return type.includes("support")||
    /cablage neuronal|cyberoeil|cyberaudio|cyberbras|cyberjambe|cybermain|cyberpied|support de membres|support multi/.test(name);
}

export function augmentationSupportAlternatives(item:RealityItem){
  if(item.kind!=="augmentation"||isAugmentationSupport(item))return [] as string[][];
  const explicit=realityNorm(realityDeepField(item,["Support","Support requis","Support nécessaire","Support necessaire"])??"");
  const name=realityNorm(item.name),families=item.families,groups:string[][]=[];
  const add=(...values:(string|null)[])=>{
    const clean=values.filter((value):value is string=>!!value);
    if(clean.length)groups.push(clean);
  };
  if(explicit){
    if(explicit.includes("cablage neuronal"))add("cablage neuronal");
    if(explicit.includes("cyberoeil"))add("cyberoeil");
    if(explicit.includes("cyberaudio"))add("cyberaudio");
    if(explicit.includes("cybermain")||explicit.includes("cyberbras")){
      add(explicit.includes("cybermain")?"cybermain":null,explicit.includes("cyberbras")?"cyberbras":null);
    }
    if(explicit.includes("cyberpied")||explicit.includes("cyberjambe")){
      add(explicit.includes("cyberpied")?"cyberpied":null,explicit.includes("cyberjambe")?"cyberjambe":null);
    }
  }
  if(!groups.length){
    if(families.includes("neural"))add("cablage neuronal");
    else if(families.includes("optical"))add("cyberoeil");
    else if(families.includes("audio"))add("cyberaudio");
    else if(families.includes("member")){
      if(/jambe|pied|palme/.test(name))add("cyberjambe","cyberpied");
      else add("cyberbras","cybermain");
    }
  }
  return groups;
}

export function augmentationSupportLabel(item:RealityItem){
  const explicit=String(realityDeepField(item,["Support","Support requis","Support nécessaire","Support necessaire"])??"").trim();
  if(explicit)return explicit;
  return augmentationSupportAlternatives(item)
    .map(group=>group.map(value=>value.replace(/\b\w/g,char=>char.toUpperCase())).join(" ou "))
    .join(" + ");
}

export function pureCosmeticAugmentation(item:RealityItem){
  if(item.kind!=="augmentation"||!item.families.includes("aesthetic"))return false;
  const source=realityNorm(String(item.name)+" "+String(item.category)+" "+String(item.effect));
  const effect=realityNorm(item.effect);
  if(!effect)return true;
  const cosmetic=/aucun effet|sans effet|cosmet|esthet|decoratif|decoration|apparence|teinte|couleur|tatouage|capillaire/.test(source);
  const mechanical=/\b(dgt|armure|defense|initiative|charge|stress|bonus|malus|pa|pv)\b|\+\s*\d|\-\s*\d/.test(effect);
  return cosmetic&&!mechanical;
}

export function augmentationBaseKey(item:RealityItem){
  return realityNorm(item.name).replace(/\bgen\s*[12]\b/g,"").trim();
}

export function augmentationMaxCopies(item:RealityItem){
  if(item.kind!=="augmentation")return Number.POSITIVE_INFINITY;
  const name=realityNorm(item.name);
  if(item.families.includes("member")&&!item.families.includes("heavy"))return 2;
  if(/\bcyber(bras|jambe|main|pied|oeil)\b/.test(name))return 2;
  return 1;
}

export function augmentationCopyCount(
  pkg:RealityRulesPackage,
  state:RealityState,
  item:RealityItem
){
  const items=realityItemMap(pkg),key=augmentationBaseKey(item);
  return state.augmentations.filter(p=>{
    const installed=items.get(p.itemId);
    return !!installed&&augmentationBaseKey(installed)===key;
  }).length;
}

export function augmentationSupportSatisfied(
  pkg:RealityRulesPackage,
  state:RealityState,
  item:RealityItem
){
  const requirements=augmentationSupportAlternatives(item);
  if(!requirements.length)return true;
  const items=realityItemMap(pkg);
  const installed=state.augmentations
    .map(p=>items.get(p.itemId))
    .filter((value):value is RealityItem=>!!value)
    .map(value=>realityNorm(value.name));
  return requirements.every(group=>
    group.some(needle=>installed.some(name=>name.includes(realityNorm(needle))))
  );
}

export function augmentationLoad(
  pkg:RealityRulesPackage,
  state:RealityState,
  talentIds:string[]
){
  const items=realityItemMap(pkg);
  let charge=0,stress=0;
  for(const purchase of state.augmentations){
    const item=items.get(purchase.itemId);
    if(!item)continue;
    charge+=Number(item.charge||0);
    stress+=Number(item.stress||0);
  }
  const rawStress=stress;
  if(talentIds.includes("stabilite_augmentique"))stress=Math.max(0,stress-1);
  return {charge,stress,rawStress};
}

export function equipmentStats(item:RealityItem){
  const specs:Array<[string,string[]]>= [
    ["DGT",["DGT","Dégâts","Degats"]],
    ["Portée",["Portée","Portee"]],
    ["Capacité",["Capacité","Capacite","Coups","Chargeur","Cap."]],
    ["Propriétés",["Propriétés","Proprietes","Spéciaux","Speciaux"]],
    ["Armure",["Armure","Valeur d’Armure","Valeur Armure"]],
    ["Balistique",["Balistique"]],
    ["Énergie",["Énergie","Energie"]],
    ["Protection",["Protection"]],
    ["Blindage",["Blindage","Blind."]],
    ["Structure",["Structure","Str."]],
    ["Places",["Places"]],
    ["Vitesse",["Vitesse"]],
    ["Autonomie",["Autonomie"]],
    ["Entretien/mois",["Entretien/mois","Entretien mensuel","Maintenance/mois"]]
  ];
  return specs.flatMap(([label,names])=>{
    const value=realityDeepField(item,names);
    return value===null||value===undefined||String(value).trim()===""?[]:[[label,String(value).trim()] as const];
  });
}

export type RealityPriceSpec={
  mode:"exact"|"range"|"minimum"|"included"|"manual"|"multiplier";
  label:string;
  exact:number|null;
  min:number|null;
  max:number|null;
  configurable:boolean;
  defaultCost:number|null;
};

export function realityPriceSpec(item:RealityItem):RealityPriceSpec{
  const raw=record(item.data);
  let mode=realityNorm(raw.priceMode??raw.price_mode??"");
  const label=String(item.priceLabel||raw.priceLabel||raw.price_label||"").trim()||
    (item.price!==null?item.price.toLocaleString("fr-FR")+" $":"Prix à définir");
  let exact=Number.isFinite(Number(raw.price))?Number(raw.price):item.price;
  let min=Number.isFinite(Number(raw.priceMin))?Number(raw.priceMin):item.priceMin;
  let max=Number.isFinite(Number(raw.priceMax))?Number(raw.priceMax):item.priceMax;
  if(!mode){
    const normalized=realityNorm(label);
    if(/\bx\s*\d/.test(normalized)||normalized.includes("prix normal"))mode="multiplier";
    else if(item.priceMin!==null&&item.priceMax!==null&&item.priceMin!==item.priceMax)mode="range";
    else if(/\$\s*\+|\+\s*$/.test(label))mode="minimum";
    else if(normalized.includes("inclus")||normalized.includes("gratuit"))mode="included";
    else if(item.price!==null)mode="exact";
    else mode="manual";
  }
  if(["fixed","prix de reference"].includes(mode))mode="exact";
  if(mode==="reference")mode=exact!==null?"exact":"manual";
  if(["min","minimum plus","at least"].includes(mode))mode="minimum";
  if(["variable","custom","unknown","indicatif"].includes(mode))mode="manual";
  if(["free","gratuit","included","inclus"].includes(mode))mode="included";
  if(mode==="included"){exact=0;min=0;max=0;}
  if(mode==="range"){
    min??=item.price??0;
    max??=min;
  }
  if(mode==="minimum")min??=item.price??0;
  const typedMode=(["exact","range","minimum","included","manual","multiplier"].includes(mode)?mode:"manual") as RealityPriceSpec["mode"];
  return {
    mode:typedMode,label,exact,min,max,
    configurable:["range","minimum","manual","multiplier"].includes(typedMode),
    defaultCost:typedMode==="exact"?exact:typedMode==="included"?0:["range","minimum"].includes(typedMode)?min:null
  };
}

export function priceSelectionValid(item:RealityItem,value:number|null){
  const spec=realityPriceSpec(item);
  if(spec.mode==="exact"||spec.mode==="included")return true;
  if(value===null||!Number.isFinite(value))return false;
  if(spec.mode==="range")return spec.min!==null&&spec.max!==null&&value>=spec.min&&value<=spec.max;
  if(spec.mode==="minimum")return spec.min!==null&&value>=spec.min;
  return value>0;
}

export function recurringMonthlyCost(item:RealityItem){
  const min=Number(item.priceMin);
  const max=Number(item.priceMax);
  const exact=Number(item.price);
  const base=
    item.priceMin!==null&&item.priceMax!==null&&Number.isFinite(min)&&Number.isFinite(max)
      ?(min+max)/2
      :Number.isFinite(exact)?exact:0;
  return item.recurring==="annual"?base/12:item.recurring==="monthly"?base:0;
}

export function canAffordRealityPurchase(
  pkg:RealityRulesPackage,
  state:RealityState,
  style:RealityStyle,
  edge:Record<string,number>,
  item:RealityItem,
  override=false
){
  const price=item.price??item.priceMin;
  if(price===null)return {ok:false,reason:"Prix non exploitable"};
  if(price>pkg.economy.advancedPurchaseThreshold&&!state.mjAdvancedOverride)return {ok:false,reason:"Accord MJ requis (> 20 000 $)"};
  if(item.kind==="augmentation"){
    if(augmentationCopyCount(pkg,state,item)>=augmentationMaxCopies(item)){
      return {ok:false,reason:"Maximum d’installations atteint"};
    }
    const access=augmentationAccess(pkg,style,item,edge,state.mjAccessOverride);
    if(!access.ok)return access;
    if(!augmentationSupportSatisfied(pkg,state,item)){
      return {ok:false,reason:`Support requis : ${augmentationSupportLabel(item)}`};
    }
  }
  if(item.neuro&&override)return {ok:true,reason:""};
  const eco=realityEconomic(pkg,state,style,edge);
  if(item.kind==="equipment"&&!item.vehicle)return eco.account-price>=0?{ok:true,reason:""}:{ok:false,reason:"Compte insuffisant"};
  if(item.kind==="augmentation"){
    const oldOver=Math.max(0,eco.augSpend-eco.envelope),newOver=Math.max(0,eco.augSpend+price-eco.envelope);
    const oldUnused=Math.max(0,eco.envelope-eco.augSpend),newUnused=Math.max(0,eco.envelope-eco.augSpend-price);
    const delta=-(newOver-oldOver)+(newUnused-oldUnused)*pkg.economy.unusedEnvelopeRefundRate;
    return eco.account+delta>=0?{ok:true,reason:""}:{ok:false,reason:"Compte insuffisant après dépassement de l’enveloppe"};
  }
  if(item.vehicle){
    const oldOver=Math.max(0,eco.vehSpend-eco.vehicleCapital),newOver=Math.max(0,eco.vehSpend+price-eco.vehicleCapital);
    const oldUnused=Math.max(0,eco.vehicleCapital-eco.vehSpend),newUnused=Math.max(0,eco.vehicleCapital-eco.vehSpend-price);
    const delta=-(newOver-oldOver)+(newUnused-oldUnused)*pkg.economy.unusedEnvelopeRefundRate;
    return eco.account+delta>=0?{ok:true,reason:""}:{ok:false,reason:"Compte insuffisant après dépassement du Capital véhicule"};
  }
  return {ok:true,reason:""};
}

export function uniqueUid(prefix:string){
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}
