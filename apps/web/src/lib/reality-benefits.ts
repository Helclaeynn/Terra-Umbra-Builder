import type {RealityItem, RealityPurchase, RealityRulesPackage, RealityState} from './reality';
import {realityPriceSpec,specialRealityAcquisition,uniqueUid} from './reality';
import {purchaseWithTalents,dailyRecovery,injuryStress,loanBudgets} from '../../../api/src/rules/reality-talents-policy';
export {renownScore,renownScale,protectionRenown} from '../../../api/src/rules/renown-rules';
export type ChoiceSpec={kind:string;label:string;bonus?:number;permanent?:boolean;skills?:readonly string[];skillAttribute?:string;styleSkills?:boolean;options?:readonly {id:string;name:string}[];help?:string;placeholder?:string};
export type BenefitSettings={insuredAssetUid:string;additionalSupportType:''|'housing'|'vehicle';additionalSupportItemId:string;religiousHousingId:string;prototypeEffect:string};
export function benefitSettings(state:RealityState):BenefitSettings{
  const raw=(state as unknown as Record<string,unknown>).talentBenefits;
  const v=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw as Record<string,unknown>:{};
  return {insuredAssetUid:String(v.insuredAssetUid??''),additionalSupportType:v.additionalSupportType==='housing'||v.additionalSupportType==='vehicle'?v.additionalSupportType:'',additionalSupportItemId:String(v.additionalSupportItemId??''),religiousHousingId:String(v.religiousHousingId??''),prototypeEffect:String(v.prototypeEffect??'')};
}
export function setBenefitSettings(state:RealityState,patch:Partial<BenefitSettings>){(state as unknown as Record<string,unknown>).talentBenefits={...benefitSettings(state),...patch};}
export function uniqueTalents(initial:readonly string[],learned:readonly string[]=[]){return [...new Set([...initial,...learned].filter(Boolean))];}
export function permanentSkillBonus(ids:readonly string[],choices:Record<string,unknown>,specs:Record<string,ChoiceSpec>,skill:string){
  return [...new Set(ids)].reduce((sum,id)=>{const s=specs[id];return sum+(s?.kind==='skill'&&s.permanent&&choices[id]===skill?Number(s.bonus||0):0);},0);
}
const norm=(text:unknown)=>String(text??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function supplierEligible(item:RealityItem|null|undefined){return !!item&&!specialRealityAcquisition(item)&&!['monthly','annual','per_use'].includes(item.recurring)&&! /prototype|unique|prestation medicale|operation chirurgicale/.test(norm(`${item.category} ${item.name}`));}
export function acquisitionCost(reference:number,item:RealityItem,ids:readonly string[],supplier=false){return purchaseWithTalents(reference,1,ids.includes('maitre_du_troc'),supplier&&ids.includes('acces_fournisseur')&&supplierEligible(item));}
export function isLoan(p:RealityPurchase){return !!p.sphereSupport||!!p.talentGrant;}
export function saleAllowed(p:RealityPurchase){return !isLoan(p);}
export function loanLabel(id:string){return ({dotation_standard:'Dotation standard',dotation_de_service:'Dotation de service',armurier_du_milieu:'Armurier du milieu',programme_pilote:'Programme pilote',avantages_salaries:'Deuxième Appui corporatif',hebergement_religieux:'Hébergement religieux'} as Record<string,string>)[id]??id;}
export function referencePrice(p:RealityPurchase,item?:RealityItem|null){return Math.max(0,Number(p.cataloguePrice??p.campaignCatalogPrice??p.selectedPrice??item?.price??item?.priceMin??0)||0);}
const spheres:Record<string,string>={dotation_standard:'corporatiste',dotation_de_service:'gouvernementale',armurier_du_milieu:'mafieuse',programme_pilote:'corporatiste',avantages_salaries:'corporatiste',assurance_corporative:'corporatiste',hebergement_religieux:'religieuse'};
export function activeBenefit(id:string,ids:readonly string[],sphere:string){return ids.includes(id)&&(!spheres[id]||spheres[id]===sphere);}
export function loanBudget(id:string){return loanBudgets[id]??null;}
export function loanSpent(state:RealityState,pkg:RealityRulesPackage,id:string){const map=new Map(pkg.equipment.map(item=>[item.id,item]));return state.equipment.filter(p=>p.talentGrant===id).reduce((sum,p)=>sum+referencePrice(p,map.get(p.itemId)),0);}
export function loanItemReason(item:RealityItem,id:string){
  if(item.kind!=='equipment'||item.vehicle||['monthly','annual','per_use'].includes(item.recurring))return 'Ce prêt concerne de l’équipement, hors véhicule et augmentation.';
  if(specialRealityAcquisition(item))return 'Acquisition spéciale : aucun prêt automatique.';
  const spec=realityPriceSpec(item);if(spec.configurable||spec.defaultCost===null||spec.defaultCost<=0)return 'Choisir un modèle à prix catalogue défini.';
  if(id==='armurier_du_milieu'&&(!/arme|pistolet|fusil|carabine|lame|matraque/.test(norm(`${item.category} ${item.sourceCategory} ${item.name}`))||/munition|cartouche|grenade|explosif/.test(norm(`${item.category} ${item.name}`))))return 'Une arme individuelle, hors consommables.';
  return '';
}
/** Add a distinct loan. A paid possession is never silently converted into a refund. */
export function grantLoan(state:RealityState,pkg:RealityRulesPackage,id:string,itemId:string,ids:readonly string[],sphere:string,campaign=false,prototypeEffect=''){
  if(!['dotation_standard','dotation_de_service','armurier_du_milieu','programme_pilote'].includes(id)||!activeBenefit(id,ids,sphere))throw new Error('Talent ou Sphère requis.');
  const item=pkg.equipment.find(row=>row.id===itemId);if(!item)throw new Error('Matériel absent du catalogue.');
  const reason=loanItemReason(item,id);if(reason)throw new Error(reason);
  if(['armurier_du_milieu','programme_pilote'].includes(id)&&state.equipment.some(p=>p.talentGrant===id))throw new Error('Restituer le prêt actuel avant de changer de matériel.');
  const cost=realityPriceSpec(item).defaultCost!,budget=loanBudget(id);
  if(budget!==null&&loanSpent(state,pkg,id)+cost>budget)throw new Error('Plafond de dotation dépassé.');
  if(cost>pkg.economy.advancedPurchaseThreshold&&!state.mjAdvancedOverride)throw new Error('Accord MJ requis au-delà du seuil du catalogue.');
  if(id==='programme_pilote'&&!prototypeEffect.trim())throw new Error('Définir la fonction expérimentale avec le MJ.');
  const p:RealityPurchase={uid:uniqueUid('talent-loan'),itemId:item.id,kind:'equipment',selectedPrice:0,cataloguePrice:cost,priceConfirmed:true,talentGrant:id,grantCreated:true,acquiredInCampaign:campaign,loanEffect:id==='programme_pilote'?prototypeEffect.trim():undefined};
  state.equipment.push(p);return p;
}
export function returnLoan(state:RealityState,uid:string){const p=state.equipment.find(row=>row.uid===uid);if(!p?.talentGrant)return false;state.equipment=state.equipment.filter(row=>row.uid!==uid);return true;}
/** Restore an existing paid charge, deleting only a record explicitly created by a grant. */
export function clearGrant(state:RealityState,id:string){
  state.fixedChargeItems=state.fixedChargeItems.flatMap(c=>{if(c.talentGrant!==id)return [c];if(c.grantCreated)return [];const {talentGrant,grantCreated,grantOriginalMonthly,grantAcquiredInCampaign,sphereSupport,...rest}=c;return [{...rest,monthly:Math.max(0,Number(grantOriginalMonthly)||0)}];});
  state.equipment=state.equipment.filter(p=>p.talentGrant!==id);
}
export function clearAdditionalSupport(state:RealityState){clearGrant(state,'avantages_salaries');setBenefitSettings(state,{additionalSupportType:'',additionalSupportItemId:''});}
export function isHousing(item:RealityItem){return /logement|loyer|appartement|studio|villa|penthouse|residence|dortoir|hebergement/.test(norm(`${item.name} ${item.category}`));}
function grantHousing(state:RealityState,item:RealityItem,id:string,campaign:boolean){
  const existing=state.fixedChargeItems.find(c=>c.sourceItemId===item.id&&!c.sphereSupport&&!c.talentGrant);
  if(existing){existing.grantOriginalMonthly=existing.monthly;existing.monthly=0;existing.talentGrant=id;existing.sphereSupport=id==='avantages_salaries';existing.grantAcquiredInCampaign=campaign;}
  else state.fixedChargeItems.push({uid:uniqueUid('talent-housing'),sourceItemId:item.id,name:item.name,monthly:0,talentGrant:id,sphereSupport:id==='avantages_salaries',grantCreated:true,grantAcquiredInCampaign:campaign});
}
export function grantAdditionalSupport(state:RealityState,pkg:RealityRulesPackage,type:'housing'|'vehicle',itemId:string,ids:readonly string[],sphere:string,campaign=false){
  if(!activeBenefit('avantages_salaries',ids,sphere))throw new Error('Avantages salariés et Sphère corporatiste requis.');
  if(itemId===state.sphereSupportItemId)throw new Error('Cette prestation est déjà couverte par le premier Appui.');
  const item=(type==='housing'?pkg.recurring:pkg.equipment).find(row=>row.id===itemId);
  if(!item||(type==='vehicle'?!item.vehicle:!isHousing(item)))throw new Error('Prestation incompatible.');
  clearAdditionalSupport(state);
  if(type==='housing')grantHousing(state,item,'avantages_salaries',campaign);
  else state.equipment.push({uid:uniqueUid('additional-vehicle'),itemId:item.id,kind:'equipment',selectedPrice:0,cataloguePrice:Math.max(0,Number(item.price??item.priceMin)||0),priceConfirmed:true,sphereSupport:true,talentGrant:'avantages_salaries',grantCreated:true,acquiredInCampaign:campaign});
  setBenefitSettings(state,{additionalSupportType:type,additionalSupportItemId:item.id});
}
export function grantReligiousHousing(state:RealityState,pkg:RealityRulesPackage,itemId:string,ids:readonly string[],sphere:string,campaign=false){
  if(!activeBenefit('hebergement_religieux',ids,sphere))throw new Error('Hébergement religieux requis.');
  const item=pkg.recurring.find(i=>i.id===itemId&&isHousing(i));if(!item)throw new Error('Logement à préciser.');
  clearGrant(state,'hebergement_religieux');grantHousing(state,item,'hebergement_religieux',campaign);setBenefitSettings(state,{religiousHousingId:item.id});
}
export function pruneBenefits(state:RealityState,ids:readonly string[],sphere:string){
  for(const id of Object.keys(spheres))if(!activeBenefit(id,ids,sphere))clearGrant(state,id);
  if(!activeBenefit('avantages_salaries',ids,sphere))setBenefitSettings(state,{additionalSupportType:'',additionalSupportItemId:''});
  // Keep the insured UID as an unresolved reference after sale, never silently insure another asset.
}
export function projectBenefits(state:RealityState,ids:readonly string[],sphere:string,campaign:boolean){
  pruneBenefits(state,ids,sphere);
  if(!campaign){for(const id of ['avantages_salaries','hebergement_religieux','assurance_silver'])if(state.fixedChargeItems.some(c=>c.talentGrant===id&&c.grantAcquiredInCampaign))clearGrant(state,id);state.equipment=state.equipment.filter(p=>!p.acquiredInCampaign);}
}
export function benefitProblems(state:RealityState,pkg:RealityRulesPackage,ids:readonly string[],sphere:string){
  const errors:string[]=[],settings=benefitSettings(state);
  for(const id of ['dotation_standard','dotation_de_service','armurier_du_milieu','programme_pilote']){
    if(!activeBenefit(id,ids,sphere))continue;
    const rows=state.equipment.filter(p=>p.talentGrant===id),budget=loanBudget(id);
    if(!rows.length)errors.push(`${loanLabel(id)} : matériel à choisir.`);
    if(['armurier_du_milieu','programme_pilote'].includes(id)&&rows.length>1)errors.push(`${loanLabel(id)} : un seul prêt à la fois.`);
    if(budget!==null&&loanSpent(state,pkg,id)>budget)errors.push(`${loanLabel(id)} : plafond dépassé.`);
  }
  if(activeBenefit('avantages_salaries',ids,sphere)){
    if(!settings.additionalSupportItemId||![...state.equipment,...state.fixedChargeItems].some(p=>p.talentGrant==='avantages_salaries'))errors.push('Avantages salariés : deuxième Appui à choisir.');
    if(settings.additionalSupportItemId&&settings.additionalSupportItemId===state.sphereSupportItemId)errors.push('Les deux Appuis couvrent la même prestation.');
  }
  if(activeBenefit('assurance_corporative',ids,sphere)&&![...state.equipment,...state.augmentations].some(p=>p.uid===settings.insuredAssetUid&&!isLoan(p)))errors.push('Assurance corporative : choisir un bien personnel réellement possédé.');
  return errors;
}
export function recoverySummary(constitution:number,ids:readonly string[]){return {normal:dailyRecovery(constitution,false,ids.includes('sante_de_fer')),prolonged:dailyRecovery(constitution,true,ids.includes('sante_de_fer')),half:injuryStress(5,10,ids.includes('insensibilite_a_la_douleur')),quarter:injuryStress(2,10,ids.includes('insensibilite_a_la_douleur'))};}
