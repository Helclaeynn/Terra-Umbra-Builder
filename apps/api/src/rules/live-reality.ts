/** Canonical Reality mechanics for live play. Values below are explicit rules,
 * never numbers extracted from narrative lore. This module is browser safe. */
import {isCybermechanicalItem,normalizeExileBuild} from './truth/exile-build.js';
import {terraUmbraCreationRules as creationRules} from './terra-umbra-creation.js';
import {terraUmbraTalentChoiceSpecs as specs} from './terra-umbra-creation-lore.js';
export type RealityLiveState={disabled?:string[];contexts?:string[];powerUses?:Record<string,number>;round?:number;pa?:number;initiative?:number|null;stress?:number;unconscious?:boolean;hp?:number|null;augmentTemporaryStress?:number;adrenaline?:{id:string;remaining:number;afterStress:1|2;round:number}|null;neuroLoaded?:string[];neuroBurned?:string[];magazines?:Record<string,{remaining:number;capacity:number}>;ammoCount?:Record<string,number>};
export type LiveRealityItem={id:string;name:string;kind?:string;category?:string;sourceCategory?:string;effect?:string;charge?:number|null;stress?:number|null;generation?:number|null;neuro?:boolean;data?:Record<string,unknown>};
export type LiveRealityCatalog={equipment?:ReadonlyArray<LiveRealityItem>;augmentations:ReadonlyArray<LiveRealityItem>};
const ids=(x:any):string[]=>Array.isArray(x)?x.filter(v=>typeof v==='string'):[];
const n=(x:any)=>Number.isFinite(Number(x))?Number(x):0;
const norm=(x:unknown)=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function realityTalentIds(data:any){return [...new Set([data.talents?.origin,data.talents?.sphere,data.talents?.common,data.talents?.expertise,...ids(data.talents?.edge),...ids(data.progression?.realityTalents)].filter((x):x is string=>typeof x==='string'))];}
export function activeAugmentationIds(data:any,state:RealityLiveState){return new Set((Array.isArray(data.reality?.augmentations)?data.reality.augmentations:[]).filter((p:any)=>p.loaded!==false&&!(state.disabled??[]).includes(p.itemId)).map((p:any)=>p.itemId));}
export function bareHandDamage(data:any){return realityTalentIds(data).includes('poings_de_fer')?2:1;}
export function permitsSurprisedDefense(data:any){return realityTalentIds(data).includes('reflexes_defensifs');}
/** Base recovery is multiplied first; Santé de fer's 2 PV are added last. */
export function realityDailyRecovery(constitution:number,prolonged:boolean,ironHealth:boolean,multiplier=1){return Math.max(1,Math.trunc(Math.max(0,n(constitution))))*(prolonged?2:1)*Math.max(1,n(multiplier))+(ironHealth?2:0);}
const socialSkills=['diplomatie','commerce','autorite','representation','seduction'];
const anySkill=creationRules.skills.map(s=>s.id);
export const realityContextMechanics:ReadonlyArray<{id:string;skills:readonly string[];bonus:number;label:string}>=[
 {id:'codes_corporatifs',skills:['diplomatie'],bonus:2,label:'Usages et hiérarchies corporatifs'},
 {id:'culture_produit',skills:['savoirs'],bonus:2,label:'Secteur corporatif choisi'},
 {id:'toujours_presentable',skills:['representation'],bonus:2,label:'Présentation dans un milieu corporatif formel'},
 {id:'education_civique',skills:['savoirs'],bonus:2,label:'Droit, administration et institutions californiennes'},
 {id:'codes_du_milieu',skills:['diplomatie'],bonus:2,label:'Codes de sa Pègre d’origine'},
 {id:'enfant_du_quartier',skills:anySkill,bonus:3,label:'Retrouver adresse, passage ou figure dans son quartier d’enfance'},
 {id:'education_doctrinale',skills:['savoirs'],bonus:2,label:'Religion dans laquelle on a été élevé'},
 {id:'vie_communautaire',skills:['diplomatie'],bonus:2,label:'Coutumes de sa communauté d’origine'},
 {id:'codes_de_rue',skills:['langages_argot'],bonus:2,label:'Argot, signes, graffitis et codes Underlives'},
 {id:'enfant_des_zones_mortes',skills:anySkill,bonus:3,label:'Circuler et s’orienter dans son ancien quartier abandonné'},
 {id:'recuperateur',skills:['investigation'],bonus:2,label:'Trouver du matériel utile parmi ruines et déchets techniques'},
 {id:'procedure_acceleree',skills:anySkill,bonus:2,label:'Faire progresser une démarche de son domaine'},
 {id:'autorite_officielle',skills:['autorite'],bonus:2,label:'Ordre d’un agent assermenté dans ses prérogatives'},
 {id:'receleur',skills:['commerce'],bonus:2,label:'Commerce de biens volés ou illégaux via son réseau'},
 {id:'fiable',skills:anySkill,bonus:2,label:'Obtenir un contrat grâce à une référence professionnelle réelle'},
 {id:'bonnes_adresses',skills:['investigation','survie','commerce'],bonus:2,label:'Trouver un service clandestin grâce à ses entrées Crawler'},
 {id:'insignifiant',skills:['furtivite'],bonus:2,label:'Se fondre dans une foule'},
 {id:'autorite_religieuse',skills:['autorite','diplomatie'],bonus:2,label:'Croyants reconnaissant réellement sa fonction'},
 {id:'presence_holonet',skills:['investigation','representation'],bonus:2,label:'Réseaux médiatiques officiels de sa religion'},
 {id:'sommeil_leger',skills:['perception'],bonus:2,label:'Remarquer un danger pendant le sommeil'},
 {id:'resistance_a_la_chaleur',skills:['constitution'],bonus:2,label:'Chaleur, déshydratation et exposition climatique chaude'},
 {id:'resistance_au_froid',skills:['constitution'],bonus:2,label:'Froid et exposition climatique glaciale'},
 {id:'nageur',skills:['athletisme'],bonus:1,label:'Nage et manœuvres aquatiques'},
 {id:'brave',skills:['maitrise_spirituelle'],bonus:2,label:'Peur d’un danger physique identifiable'},
 {id:'presence_remarquable',skills:socialSkills,bonus:2,label:'Le trait remarquable choisi constitue un avantage réel'},
 {id:'resistance_aux_toxines',skills:['constitution'],bonus:2,label:'Poisons, drogues et toxines'},
 {id:'ombre_vivante',skills:['furtivite'],bonus:2,label:'Disparaître immédiatement après avoir rompu la ligne de vue'},
 {id:'mains_lestes',skills:['larcin'],bonus:2,label:'Pickpocket, manipulation discrète ou dissimulation de petit objet'},
 {id:'sens_accru_x',skills:['perception'],bonus:2,label:'Sens choisi réellement déterminant'},
 {id:'mental_dacier',skills:['force_mentale'],bonus:2,label:'Interrogatoire ou pression psychologique profane'},
 {id:'autorite_naturelle',skills:['autorite'],bonus:2,label:'Consigne simple immédiate à un groupe reconnaissant votre légitimité'}
];
/** Merge by ID with contextualSkillBonuses. Narrated applicability remains opt-in;
 * numeric equivalent bonuses retain their maximum in playProfile. */
export function extraRealityContexts(data:any,skill:string,total:number){
 const owned=new Set(realityTalentIds(data)),choices={...data.talentChoices,...data.progression?.realityTalentChoices};
 return realityContextMechanics.filter(r=>owned.has(r.id)&&r.skills.includes(skill)).filter(r=>r.id!=='sens_accru_x'||['vue','ouie','odorat','toucher','gout'].includes(choices[r.id])).filter(r=>!['culture_produit','presence_remarquable'].includes(r.id)||typeof choices[r.id]==='string'&&choices[r.id].trim()).map(r=>({id:r.id,label:r.label+(choices[r.id]?` · ${choices[r.id]}`:''),bonus:r.bonus,total:total+r.bonus}));
}
export const realityAugmentationBonuses:ReadonlyArray<{id:string;skills:readonly string[];bonus:number;label:string}>=[
 {id:'augmentation-v9-booster-sensoriel-g1',skills:['perception'],bonus:3,label:'Booster sensoriel G1 · stimulus bref, soudain ou difficile à suivre'},
 {id:'augmentation-v9-booster-sensoriel-g2',skills:['perception'],bonus:2,label:'Booster sensoriel G2 · stimulus fugace ou réaction sensorielle rapide'},
 {id:'augmentation-v9-scanner-technique-g2',skills:['mecanique'],bonus:2,label:'Scanner technique · diagnostic d’une machine accessible'},
 {id:'augmentation-v9-main-gecko-g2',skills:['athletisme'],bonus:2,label:'Main Gecko · adhérence manuelle directe sur surface compatible'},
 {id:'augmentation-v9-pied-gecko-g2',skills:['athletisme'],bonus:2,label:'Pied Gecko · adhérence des pieds directement utile'},
];
const boosters=[{id:'booster_d_adrenaline_g1',label:'Booster d’adrénaline G1',rounds:2,afterStress:2 as const},{id:'booster_d_adrenaline_g2',label:'Booster d’adrénaline G2',rounds:1,afterStress:1 as const}];
export function adrenalineOptions(data:any,state:RealityLiveState){const owned=activeAugmentationIds(data,state);return boosters.filter(b=>owned.has(b.id)).map(b=>({...b,used:(state.powerUses?.[`scene:${b.id}`]??0)>0,active:state.adrenaline?.id===b.id&&state.adrenaline.remaining>0,available:!(state.powerUses?.[`scene:${b.id}`]??0)&&!state.powerUses?.['round:direct-pa-gain']&&!state.adrenaline?.remaining&&!state.unconscious&&(state.hp===null||state.hp===undefined||state.hp>0)&&state.initiative!=null}));}
export function activateAdrenaline(data:any,state:RealityLiveState,implantId:string){const b=adrenalineOptions(data,state).find(b=>b.id===implantId);if(!b?.available)return {error:'adrenaline_unavailable'};
 state.powerUses={...state.powerUses,[`scene:${b.id}`]:1};state.adrenaline={id:b.id,remaining:b.rounds,afterStress:b.afterStress,round:state.round??1};const before=state.pa??0;state.pa=Math.max(before,Math.min(4,before+1));if(state.pa>before)state.powerUses['round:direct-pa-gain']=1;return {payload:{label:b.label,paGranted:state.pa-before,rounds:b.rounds,afterStress:b.afterStress,powerId:b.id}};}
export function adrenalinePace(state:RealityLiveState){return state.adrenaline&&state.adrenaline.remaining>0?1:0;}
export function finishAdrenaline(state:RealityLiveState,effectiveStress=state.stress??0){const a=state.adrenaline;if(!a)return null;state.stress=Math.min(2,Math.max(state.stress??0,effectiveStress)+a.afterStress);state.adrenaline=null;return {label:'Contrecoup d’adrénaline',powerId:a.id,stress:state.stress};}
/** Call once after increasing round; retries in the same round are harmless. */
export function advanceAdrenaline(state:RealityLiveState){const a=state.adrenaline;if(!a||(state.round??1)<=a.round)return null;const elapsed=(state.round??1)-a.round;a.remaining=Math.max(0,a.remaining-elapsed);a.round=state.round??1;return a.remaining===0?finishAdrenaline(state):null;}
export function limitAdrenalinePa(state:RealityLiveState,base:number){const total=adrenalinePace(state)?Math.max(base,Math.min(4,base+1)):base;if(total>base)state.powerUses={...state.powerUses,'round:direct-pa-gain':1};return total;}
const defensePrograms=[{id:'d-fence',bonus:1,reflection:0},{id:'shieldic',bonus:1,reflection:1},{id:'mywall',bonus:2,reflection:0},{id:'2-fence',bonus:1,reflection:0,interceptions:2},{id:'omnithorns',bonus:1,reflection:2},{id:'castland',bonus:3,reflection:0}];
const offensePrograms=[{id:'datablast',damage:0},{id:'dark-holes',damage:1},{id:'darksword',damage:0},{id:'langoliers',damage:1},{id:'calamities-reign',damage:3},{id:'darkalibur',damage:0}];
export function permanentRealitySkill(data:any,skill:string){const p=data.progression??{},sphere=creationRules.spheres[data.creation?.sphere as keyof typeof creationRules.spheres];const sphereFixed=(sphere?.fixedSkills??[]) as readonly string[];
 const choices={...data.talentChoices,...p.realityTalentChoices};return (sphereFixed.includes(skill)?1:0)+n(data.skills?.[skill]?.style)+n(data.skills?.[skill]?.free)+n(data.skills?.[skill]?.edge)+n(p.skillRanks?.[skill])+realityTalentIds(data).reduce((sum,id)=>{const s=(specs as Record<string,any>)[id];return sum+(s?.kind==='skill'&&s?.permanent&&choices[id]===skill?n(s.bonus):0);},0);}
export function loadedNeuroPrograms(data:any,state:RealityLiveState,catalog:LiveRealityCatalog){
 const equipment=Array.isArray(data.reality?.equipment)?data.reality.equipment:[],owned=equipment.filter((p:any)=>p.quantity!==0),programs=owned.filter((p:any)=>catalog.equipment?.some(e=>e.id===p.itemId&&e.neuro));
 const rankValue=permanentRealitySkill(data,'neurodive'),rank=rankValue<=0?0:rankValue<=3?1:rankValue<=6?2:rankValue<=9?3:4;
 const capacity=rank+(rank>0&&realityTalentIds(data).includes('neurodriver')?1:0),unsinkable=ids(data.disadvantages).includes('unsinkable');
 const aug=activeAugmentationIds(data,state),hasInterface=aug.has('cablage_neuronal_g1')||aug.has('cablage_neuronal_g2')||owned.some((p:any)=>['objets-usuels-neurodive-cyberconsole-neurodive','armures-specialisees-arcanetwork-neuromaster'].includes(p.itemId));
 const requested=state.neuroLoaded===undefined?programs.filter((p:any)=>p.loaded===true).map((p:any)=>p.uid??p.itemId):state.neuroLoaded;
 const burned=new Set(state.neuroBurned??[]),selected=programs.filter((p:any)=>requested.includes(p.uid??p.itemId)&&!burned.has(p.uid??p.itemId));
 const eligible=!unsinkable&&rank>0&&hasInterface,availableCapacity=Math.max(0,capacity-burned.size),overCapacity=selected.length>availableCapacity;
 const loaded=eligible&&!overCapacity?selected.map((p:any)=>({...p,item:catalog.equipment!.find(i=>i.id===p.itemId)!})):[];
 return {rank,capacity,availableCapacity,unsinkable,hasInterface,overCapacity,eligible,loaded,owned:programs.map((p:any)=>({...p,item:catalog.equipment!.find(i=>i.id===p.itemId)!}))};
}
export function liveRealityProfile(data:any,state:RealityLiveState,catalog:LiveRealityCatalog){
 const owned=Array.isArray(data.reality?.augmentations)?data.reality.augmentations:[],talents=realityTalentIds(data),truthIds=[...ids(data.truth?.truthTalents),...ids(data.progression?.truthTalents)],active=activeAugmentationIds(data,state);
 const entries:Array<{uid:string;itemId:string;name:string;charge:number;stress:number;cyber:boolean;active:boolean}>=owned.flatMap((p:any)=>{const item=catalog.augmentations.find(i=>i.id===p.itemId);return item?[{uid:p.uid??p.itemId,itemId:item.id,name:item.name,charge:Math.max(0,n(item.charge)),stress:Math.max(0,n(item.stress)),cyber:isCybermechanicalItem(item),active:active.has(item.id)}]:[];});
 const charge=entries.reduce((s,e)=>s+e.charge,0),rawStress=entries.reduce((s,e)=>s+e.stress,0),penalty=rawStress>0&&ids(data.disadvantages).includes('neurocompatibilite_nulle')?2:0;
 // Iron Law is an Exilé passive trait. No revelation transition renews/changes load.
 const ironLawAccess=data.truth?.choices?.network==='iron_law'||normalizeExileBuild(data.truth?.choices?.exileBuild).trainings.some(t=>t.network==='iron_law'&&t.learned);
 const ironLaw=data.truth?.nature==='exile'&&data.truth?.consciousness!=='profane'&&ironLawAccess&&truthIds.includes('exile-stabilite-augmentique')?entries.filter(e=>e.cyber).reduce((s,e)=>s+Math.min(1,e.stress),0):0;
 const reduction=Math.max(talents.includes('stabilite_augmentique')?1:0,ironLaw),baseStress=Math.max(0,rawStress+penalty-reduction),temporaryStress=Math.max(0,n(state.augmentTemporaryStress));
 const neuroDefenseBonus=Math.max(active.has('defense_electronique_g1')?2:0,active.has('defense_electronique_g2')?1:0),neuro=loadedNeuroPrograms(data,state,catalog);
 const neuroDefense=neuro.loaded.flatMap((p:any)=>{const r=defensePrograms.find(r=>r.id===p.itemId);return r?[{...r,id:p.uid??p.itemId,programId:p.itemId,label:p.item.name,available:true}]:[];});
 const neuroAttacks=neuro.loaded.flatMap((p:any)=>{const r=offensePrograms.find(r=>r.id===p.itemId);return r?[{...r,id:p.uid??p.itemId,programId:p.itemId,label:p.item.name,bonus:0,damageMode:'margin' as const,attackMode:'margin' as const,damageType:'neuro',skill:'neurodive'}]:[];});
 const chargedWeapons=(data.reality?.equipment??[]).filter((p:any)=>p.quantity!==0).flatMap((p:any)=>{const item=catalog.equipment?.find(i=>i.id===p.itemId),weapon=item&&realityWeaponProfile(item,n(data.attributes?.vigueur));if(!weapon?.capacity)return [];const uid=p.uid??p.itemId;return [{weaponId:uid,inventoryUID:uid,id:uid,name:item!.name,...weaponMagazine(state,{inventoryUID:uid,capacity:weapon.capacity})!}];});
 return {entries,charge,rawStress,penalty,reduction,baseStress,temporaryStress,totalStress:baseStress+temporaryStress,neuroDefenseBonus,recoveryMultiplier:active.has('regeneration_passive')?2:1,permanentAthleticsBonus:active.has('realignement_spinal')?1:0,neuro,neuroDefense,neuroAttacks,chargedWeapons};
}
export function augmenticCrisis(charge:number,integrity:number,stress:number,maximum:number){const over=Math.max(charge-integrity,stress-maximum);return {over,difficulty:over<0?null:over===0?15:over===1?18:over===2?21:25,required:over>=0};}
/** Structured equipment data is authoritative, while narrative exceptions remain
 * explicitly conditional and must be selected only when their condition applies. */
export function realityProtection(item:LiveRealityItem){
 const data=item.data??{},pools=[data,data.data,data.details].filter((x):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x));
 const text=[item.effect??'',...pools.flatMap(p=>Object.entries(p).map(([k,v])=>`${k}: ${String(v)}`))].join(' · '),t=norm(text);
 const body=Number(/armure (?:corporelle|naturelle)\s*(\d+)/.exec(t)?.[1]??0),armor=body?0:Number(/armure\s*[:]?\s*(\d+)/.exec(t)?.[1]??0);
 const aliases:Record<string,string>={melee:'(?:melee|mel\\.)',balistique:'(?:balistique|bal\\.)',antichoc:'(?:antichoc|ant\\.)',feu:'feu',froid:'froid',electricite:'electricite',chimique:'chimique',occulte:'occulte',neuro:'neuro'};
 const reductions=Object.fromEntries(Object.entries(aliases).map(([id,a])=>{const direct=Number(new RegExp('(?:reduction\\s+)?'+a+'\\s*[:+]?\\s*(\\d+)').exec(t)?.[1]??0);const grouped=[...t.matchAll(/reduction\s+(\d+)\s*\[([^\]]+)\]/g)].filter(m=>m[2].split('/').map(x=>x.trim()).includes(id)).map(m=>Number(m[1]));return [id,Math.max(direct,...grouped,0)];}));
 if(item.id==='maillage_squelettique_g1')reductions.antichoc=2;if(item.id==='maillage_squelettique_g2')reductions.antichoc=1;
 // Renfort modules improve one vector; they are additions to the chosen armour.
 const moduleType=({'modules-d-armure-renfort-balistique':'balistique','modules-d-armure-renfort-melee':'melee','modules-d-armure-renfort-antichoc':'antichoc'} as Record<string,string>)[item.id];
 const additive=moduleType?{[moduleType]:1}:{};
 return {text,body,armor,reductions,additive,ablation:Number(/ablatif\s+(\d+)/.exec(t)?.[1]??0),conditional:item.id==='augmentation-v9-estomac-blinde-g2'?'Uniquement blessure interne digestive ; aucun bonus contre les poisons':item.id==='armures-specialisees-seawares-scaph-iv'?'Antichoc 6 uniquement sous l’eau ; 4 ailleurs':null};
}
/** Resolve only documented DGT number / V+number. Unknown profiles return null. */
export function realityWeaponProfile(item:LiveRealityItem,vigor:number,mode?:'melee'|'ranged'){
 const data=item.data??{},field=(names:string[])=>Object.entries(data).find(([k])=>names.includes(norm(k)))?.[1];
 const raw=String(field(['dgt','degats'])??''),formula=/^V\s*\+\s*(\d+)$/i.exec(raw),damage=/^\d+$/.test(raw)?Number(raw):formula?vigor+Number(formula[1]):null;if(damage===null)return null;
 const type=norm(field(['type','classe','role'])??''),range=String(field(['portee'])??''),properties=String(field(['proprietes','speciaux'])??''),p=norm(properties);
 const contact=range==='Contact'||/melee|contact|outil.*hydraulique|outil thermique/.test(type)&&!/^jet/.test(type),attackMode=mode??(contact?'melee':'ranged');
 const damageType=/electri/.test(p)?'electricite':/chimique|acide/.test(p)?'chimique':/\bfeu\b|incendiaire/.test(p)?'feu':attackMode==='melee'?/\bchoc\b/.test(p)?'antichoc':'melee':'balistique';
 const capacityText=String(field(['capacite','cap.','coups','chargeur'])??''),capacityMatch=/^(\d+)(?:\s+usages?)?$/.exec(capacityText);
 return {id:item.id,label:item.name,group:item.category??'Armes',skill:attackMode==='melee'?'melee':'tir',damage,damageFormula:formula?raw:null,attackMode,damageType,penetration:Number(/perforant\s+(\d+)/.exec(p)?.[1]??0),range,properties,capacity:capacityMatch?Number(capacityMatch[1]):null};
}
export function realityNaturalWeapons(data:any,state:RealityLiveState){const owned=activeAugmentationIds(data,state);return [{id:'augmentation-v9-ergot-griffes-g1',label:'Ergot / Griffes de pied G1',damage:4},{id:'augmentation-v9-ergot-griffes-g2',label:'Ergot / Griffes de pied G2',damage:2}].filter(w=>owned.has(w.id)).map(w=>({...w,group:'Armes augmentiques',skill:'pugilat',damageType:'melee',attackMode:'melee' as const,penetration:0,condition:'L’attaque utilise réellement la jambe ou le pied'}));}
/** One under-pressure change of loadout costs one PA, even if a slot is replaced.
 * Callers hold the character/campaign lock and preserve the override on save. */
export function configureNeuroLoad(data:any,state:RealityLiveState,catalog:LiveRealityCatalog,requested:unknown,inCombat:boolean){
 if(state.unconscious||state.hp!==undefined&&state.hp!==null&&state.hp<=0)return {error:'actor_unavailable'};
 if(!Array.isArray(requested)||requested.length>5||requested.some(v=>typeof v!=='string'||v.length>150)||new Set(requested).size!==requested.length)return {error:'invalid_neuro_load'};
 const p=loadedNeuroPrograms(data,state,catalog),allowed=new Set(p.owned.map((p:any)=>p.uid??p.itemId));
 if(requested.some(v=>!allowed.has(v)||(state.neuroBurned??[]).includes(v)))return {error:'neuro_program_unavailable'};
 if(requested.length&&(p.unsinkable||!p.hasInterface||p.rank<1))return {error:'neuro_unavailable'};
 const burnedSlots=new Set(state.neuroBurned??[]).size;
 if(requested.length>Math.max(0,p.capacity-burnedSlots))return {error:'neuro_capacity_exceeded'};
 const previous:string[]=state.neuroLoaded??p.owned.filter((p:any)=>p.loaded===true).map((p:any)=>p.uid??p.itemId);
 if(previous.length===requested.length&&previous.every(v=>requested.includes(v)))return {error:'neuro_load_unchanged'};
 const cost=inCombat?1:0;if(cost&&(state.initiative==null||state.unconscious||(state.pa??0)<cost))return {error:'insufficient_pa'};
 state.neuroLoaded=[...requested];state.pa=(state.pa??0)-cost;
 return {payload:{label:'Chargement de Neuroprogrammes',before:previous,after:state.neuroLoaded,paCost:cost}};
}
export function neuroSacrifice(data:any,state:RealityLiveState,catalog:LiveRealityCatalog,requested:unknown){
 if(!Array.isArray(requested)||!requested.length||requested.length>5||new Set(requested).size!==requested.length)return {error:'invalid_neuro_sacrifice'};
 const p=loadedNeuroPrograms(data,state,catalog),selected=p.loaded.filter((p:any)=>requested.includes(p.uid??p.itemId));
 if(selected.length!==requested.length)return {error:'neuro_program_unavailable'};
 const loaded=state.neuroLoaded??p.loaded.map((p:any)=>p.uid??p.itemId);
 state.neuroBurned=[...new Set([...(state.neuroBurned??[]),...requested])];state.neuroLoaded=loaded.filter((uid:string)=>!requested.includes(uid));
 // A sacrificed local copy is lost. Extra copies, if explicitly owned, remain.
 for(const selectedProgram of selected){const purchase=data.reality.equipment.find((x:any)=>(x.uid??x.itemId)===(selectedProgram.uid??selectedProgram.itemId));purchase.quantity=Math.max(0,(Number.isSafeInteger(purchase.quantity)?purchase.quantity:1)-1);purchase.loaded=false;}
 return {payload:{label:'Neuroprogrammes sacrifiés',programs:selected.map((p:any)=>({uid:p.uid??p.itemId,name:p.item.name})),reduction:3*selected.length}};
}
/** A safe restart after pressure ends restores slots, never local copies or
 * licences destroyed by sacrifice. Loading fresh copies remains a separate act. */
export function rebootNeuro(data:any,state:RealityLiveState,ctx:{inCombat:boolean;safeRestart?:unknown}){
 if(ctx.inCombat)return {error:'neuro_restart_outside_combat'};
 if(ctx.safeRestart!==true)return {error:'neuro_safe_restart_required'};
 if(state.unconscious||state.hp!==undefined&&state.hp!==null&&state.hp<=0)return {error:'actor_unavailable'};
 // Eligibility depends on explicit interface IDs and permanent rank, not on a
 // program's lore or on whether an unburned local copy remains available.
 const profile=loadedNeuroPrograms(data,state,{equipment:[],augmentations:[]});
 if(!profile.eligible)return {error:'neuro_unavailable'};
 const restored=new Set(state.neuroBurned??[]).size;
 const unloaded=state.neuroLoaded??(data.reality?.equipment??[]).filter((p:any)=>p.quantity!==0&&p.loaded===true).map((p:any)=>p.uid??p.itemId);
 state.neuroBurned=[];state.neuroLoaded=[];
 return {payload:{label:'Redémarrage sûr du système Neuro',slotsRestored:restored,unloaded,paCost:0,copiesRestored:0}};
}

type ChargedWeapon={inventoryUID?:string;capacity?:number|null;properties?:string};
const validCharge=(value:unknown,maximum=10000):value is number=>Number.isSafeInteger(value)&&Number(value)>=0&&Number(value)<=maximum;
/** First use starts with the documented ready charge. This default is never saved
 * over an existing magazine or renewed by a scene/combat/revelation transition. */
export function weaponMagazine(state:RealityLiveState,weapon:ChargedWeapon){
 const uid=weapon.inventoryUID,capacity=weapon.capacity;
 if(!uid||!validCharge(capacity)||!capacity)return null;
 const stored=state.magazines?.[uid];
 if(stored&&(!validCharge(stored.remaining,capacity)||stored.capacity!==capacity))throw new Error('invalid_magazine_state');
 return {remaining:stored?.remaining??capacity,capacity,reserve:state.ammoCount?.[uid]??null};
}
/** The Moteur states burst impacts, not how many cartridges are fired. Multi-shot
 * ammunition use is therefore declared, never guessed from damage or impacts. */
export function consumeWeaponCharge(state:RealityLiveState,weapon:ChargedWeapon,input:{mode?:'single'|'burst'|'suppression';roundsSpent?:unknown}={}){
 const magazine=weaponMagazine(state,weapon);
 if(!magazine)return {payload:{tracked:false}};
 const mode=input.mode??'single',properties=norm(weapon.properties);
 if(!['single','burst','suppression'].includes(mode))return {error:'invalid_fire_mode'};
 if(mode==='burst'&&!/\brafale\b/.test(properties)||mode==='suppression'&&!/\bautomatique\b/.test(properties))return {error:'fire_mode_unavailable'};
 const spent=input.roundsSpent??(mode==='single'?1:null);
 if(spent===null)return {error:'ammo_usage_required'};
 if(!validCharge(spent,magazine.capacity)||spent<1||mode==='single'&&spent!==1)return {error:'invalid_ammo_usage'};
 if(spent>magazine.remaining)return {error:'insufficient_ammunition'};
 state.magazines={...state.magazines,[weapon.inventoryUID!]:{capacity:magazine.capacity,remaining:magazine.remaining-spent}};
 return {payload:{tracked:true,weaponId:weapon.inventoryUID!,roundsSpent:spent,before:magazine.remaining,after:magazine.remaining-spent,capacity:magazine.capacity}};
}
function ownedChargedWeapon(data:any,catalog:LiveRealityCatalog,weaponId:unknown){
 if(typeof weaponId!=='string'||weaponId.length>150)return null;
 const purchase=(data.reality?.equipment??[]).find((p:any)=>(p.uid??p.itemId)===weaponId&&p.quantity!==0);
 const item=purchase&&catalog.equipment?.find(i=>i.id===purchase.itemId);
 if(!item)return null;
 const profile=realityWeaponProfile(item,n(data.attributes?.vigueur));
 return profile?.capacity?{...profile,inventoryUID:purchase.uid??purchase.itemId}:null;
}
/** Explicit charge/reserve correction. The caller authorizes a GM correction or
 * an out-of-combat inventory declaration; no silent ammunition reward is made. */
export function configureWeaponMagazine(data:any,state:RealityLiveState,catalog:LiveRealityCatalog,input:{weaponId?:unknown;remaining?:unknown;reserve?:unknown},ctx:{inCombat:boolean;manager:boolean}){
 if(ctx.inCombat&&!ctx.manager)return {error:'magazine_requires_manager'};
 const weapon=ownedChargedWeapon(data,catalog,input.weaponId);
 if(!weapon)return {error:'weapon_charge_unavailable'};
 if(!validCharge(input.remaining,weapon.capacity!))return {error:'invalid_ammo_count'};
 if(input.reserve!==undefined&&!validCharge(input.reserve))return {error:'invalid_ammo_count'};
 const previous=weaponMagazine(state,weapon)!;
 state.magazines={...state.magazines,[weapon.inventoryUID]:{remaining:input.remaining,capacity:weapon.capacity!}};
 if(input.reserve!==undefined)state.ammoCount={...state.ammoCount,[weapon.inventoryUID]:input.reserve};
 return {payload:{label:'Munitions déclarées · '+weapon.label,weaponId:weapon.inventoryUID,before:previous.remaining,after:input.remaining,capacity:weapon.capacity,reserve:state.ammoCount?.[weapon.inventoryUID]??null,managerCorrection:ctx.manager}};
}
/** Normal reload is one PA under pressure. A validated exception (e.g. Baséanh
 * quadrimanual, once/round) can be supplied by the server, never by user input.
 * A reserve is decremented when declared. Otherwise real ammunition must be
 * explicitly confirmed; this does not create an unlimited reserve. */
export function reloadWeapon(data:any,state:RealityLiveState,catalog:LiveRealityCatalog,input:{weaponId?:unknown;roundsLoaded?:unknown;ammunitionAvailable?:unknown},ctx:{inCombat:boolean;freeReload?:boolean}){
 if(state.unconscious||state.hp!==undefined&&state.hp!==null&&state.hp<=0)return {error:'actor_unavailable'};
 const weapon=ownedChargedWeapon(data,catalog,input.weaponId);
 if(!weapon)return {error:'weapon_charge_unavailable'};
 const magazine=weaponMagazine(state,weapon)!,needed=magazine.capacity-magazine.remaining;
 if(!needed)return {error:'magazine_full'};
 const reserve=state.ammoCount?.[weapon.inventoryUID];
 if(reserve!==undefined&&!validCharge(reserve))return {error:'invalid_ammo_count'};
 if(reserve===undefined&&input.ammunitionAvailable!==true)return {error:'ammunition_confirmation_required'};
 const loaded=input.roundsLoaded??(reserve===undefined?needed:Math.min(needed,reserve));
 if(!validCharge(loaded,needed)||loaded<1)return {error:reserve===0?'insufficient_ammunition':'invalid_ammo_count'};
 if(reserve!==undefined&&loaded>reserve)return {error:'insufficient_ammunition'};
 const cost=ctx.inCombat&&!ctx.freeReload?1:0;
 if(ctx.inCombat&&(state.initiative==null||(state.pa??0)<cost))return {error:'insufficient_pa'};
 state.magazines={...state.magazines,[weapon.inventoryUID]:{remaining:magazine.remaining+loaded,capacity:magazine.capacity}};
 if(reserve!==undefined)state.ammoCount={...state.ammoCount,[weapon.inventoryUID]:reserve-loaded};
 state.pa=(state.pa??0)-cost;
 return {payload:{label:'Rechargement · '+weapon.label,weaponId:weapon.inventoryUID,before:magazine.remaining,after:magazine.remaining+loaded,roundsLoaded:loaded,capacity:magazine.capacity,reserve:state.ammoCount?.[weapon.inventoryUID]??null,paCost:cost}};
}
