export type RealityItem={
  id:string;
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
};

export type FixedCharge={
  uid:string;
  name:string;
  monthly:number;
  sourceItemId?:string;
};

export type RealityState={
  augmentations:RealityPurchase[];
  equipment:RealityPurchase[];
  fixedChargeItems:FixedCharge[];
  mjAdvancedOverride:boolean;
  mjAccessOverride:boolean;
  sphereSupportDetail:string;
  possessionsNotes:string;
  networks:string;
  statuses:string;
  patrimony:string;
  debts:string;
};

export type RealityStyle={
  id:string;
  name:string;
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
  Object.assign(raw,{
    augmentations,
    equipment,
    fixedChargeItems,
    mjAdvancedOverride:Boolean(raw.mjAdvancedOverride),
    mjAccessOverride:Boolean(raw.mjAccessOverride),
    sphereSupportDetail:String(raw.sphereSupportDetail??""),
    possessionsNotes:String(raw.possessionsNotes??""),
    networks:String(raw.networks??""),
    statuses:String(raw.statuses??""),
    patrimony:String(raw.patrimony??""),
    debts:String(raw.debts??"")
  });
  return raw as unknown as RealityState;
}

export function realityItemMap(pkg:RealityRulesPackage){
  return new Map([...pkg.equipment,...pkg.augmentations].map(item=>[item.id,item]));
}

export function purchasePrice(purchase:RealityPurchase,item:RealityItem|null){
  if(!item)return 0;
  const selected=Number(purchase.selectedPrice);
  if(Number.isFinite(selected)&&selected>=0)return selected;
  if(item.price!==null)return item.price;
  if(item.priceMin!==null)return item.priceMin;
  return 0;
}

export function realityEconomic(
  pkg:RealityRulesPackage,
  state:RealityState,
  style:RealityStyle,
  edge:Record<string,number>
):RealityEconomy{
  const items=realityItemMap(pkg);
  const augSpend=state.augmentations
    .filter(p=>!p.acquiredInCampaign)
    .reduce((sum,p)=>sum+purchasePrice(p,items.get(p.itemId)??null),0);
  const equipmentRows=state.equipment
    .filter(p=>!p.acquiredInCampaign)
    .map(p=>({p,item:items.get(p.itemId)??null}));
  const equipSpend=equipmentRows
    .filter(row=>!row.item?.vehicle)
    .reduce((sum,row)=>sum+purchasePrice(row.p,row.item),0);
  const vehSpend=equipmentRows
    .filter(row=>row.item?.vehicle)
    .reduce((sum,row)=>sum+purchasePrice(row.p,row.item),0);

  const envelope=style.augmentationEnvelope+Number(edge.augmentationPacks||0)*5000;
  const vehicleCapital=style.vehicleCapital||0;
  const augOverflow=Math.max(0,augSpend-envelope);
  const augUnused=Math.max(0,envelope-augSpend);
  const vehOverflow=Math.max(0,vehSpend-vehicleCapital);
  const vehUnused=Math.max(0,vehicleCapital-vehSpend);
  const startAccount=style.account+Number(edge.cashPacks||0)*5000;
  const refund=pkg.economy.unusedEnvelopeRefundRate;
  const account=startAccount-equipSpend-augOverflow-vehOverflow+augUnused*refund+vehUnused*refund;

  return {
    account,startAccount,envelope,vehicleCapital,
    gen2:(style.gen2SlotsBase||0)+Number(edge.augmentationPacks||0),
    augUnused,vehUnused,augOverflow,vehOverflow,augSpend,equipSpend,vehSpend
  };
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
    return item?.vehicle
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
  return {
    base,effective,reference,total,drops,
    deficit:Math.max(0,drops-baseIndex)*reference,
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
    const access=augmentationAccess(pkg,style,item,edge,state.mjAccessOverride);
    if(!access.ok)return access;
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
