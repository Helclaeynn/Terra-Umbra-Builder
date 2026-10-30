import {truthPowers,powerAllowed} from './play-truth.js';
const base='aseryn_dratyn_la_maitresse_de_la_foudre_',prefix=base+'talents_communs_de_dratyn_',creator=base+'specialisation_de_foudre_createur_foudre_originelle_',spirit=base+'specialisation_de_foudre_esprit_noire_foudre_',erosion=base+'specialisation_de_foudre_erosion_foudre_vaporeuse_',end=base+'specialisation_de_foudre_fin_foudre_du_silence_';
export const lightningIds={conduction:prefix+'conduction',foudre:prefix+'foudre_aseryne',paratonnerre:prefix+'paratonnerre',decharge:prefix+'decharge_maitrisee',arc:prefix+'arc_en_chaine',orage:prefix+'orage_aseryn',originelle:creator+'foudre_originelle',briseMagie:creator+'brise_magie',deferlement:creator+'deferlement_originel',noire:spirit+'noire_foudre',atteindre:spirit+'atteindre_l_immateriel',fulguration:spirit+'fulguration_spirituelle',eclipse:spirit+'eclipse_noire',vaporeuse:erosion+'foudre_vaporeuse',affliction:erosion+'eroder_l_affliction',ruine:erosion+'ruine_des_protections',poussiere:erosion+'reduire_en_poussiere',silence:end+'foudre_du_silence',trace:end+'trace_du_neant',trait:end+'trait_du_silence',fin:end+'fin_veritable'};
const I=lightningIds;
const prerequisites:Record<string,string[]>={[I.foudre]:[I.conduction],[I.paratonnerre]:[I.foudre],[I.decharge]:[I.foudre],[I.arc]:[I.foudre],[I.orage]:[I.foudre],[I.originelle]:[I.foudre],[I.briseMagie]:[I.originelle],[I.deferlement]:[I.briseMagie],[I.noire]:[I.foudre],[I.atteindre]:[I.noire],[I.fulguration]:[I.noire],[I.eclipse]:[I.fulguration],[I.vaporeuse]:[I.foudre],[I.affliction]:[I.vaporeuse],[I.ruine]:[I.vaporeuse],[I.poussiere]:[I.affliction],[I.silence]:[I.foudre],[I.trace]:[I.silence],[I.trait]:[I.silence],[I.fin]:[I.trace,I.trait]};
const sceneIds=new Set<string>([I.arc,I.orage,I.deferlement,I.fulguration,I.eclipse,I.poussiere,I.trait]);
export function lightningKnown(data:any,id:string){const owned=new Set(truthPowers(data).map(p=>p.id));const valid=(key:string):boolean=>owned.has(key)&&(prerequisites[key]??[]).every(valid);return valid(id);}
export function lightningAvailable(data:any,state:any,id:string){const p=truthPowers(data).find(p=>p.id===id);return !!p&&lightningKnown(data,id)&&powerAllowed(p,state.revelation)&&!(sceneIds.has(id)&&(state.powerUses?.['scene:'+id]??0)>0);}
/** Explicit prerequisite chain: the imported prerequisiteName is not an owned talent ID. */
export function lightningAccess(data:any,state:any){
 return {foudre:lightningAvailable(data,state,I.foudre),paratonnerre:lightningAvailable(data,state,I.paratonnerre),paratonnerreUsed:(state.powerUses?.['round:'+I.paratonnerre]??0)>0,paratonnerreAllyRange:5};
}
export function lightningAttack(data:any,state:any){
 return lightningAttacks(data,state).find(p=>p.id===I.foudre)??null;
}
export function lightningRange(input:any){
 if(input.contextConfirmed!==true||typeof input.distance!=='number'||!Number.isFinite(input.distance)||input.distance<0||input.distance>20)throw new Error('foudre_range_required');
}
export function paratonnerreTest(total:number,narrativeFailure:boolean,attackTotal:number){return !narrativeFailure&&total>=attackTotal;}

export type LightningAttack={id:string;label:string;group:string;damage:number;penetration:number;attackMode:'foudre';damageType:'electricite';skill:'maitrise_spirituelle';range:number;condition:string;actionCost:number;usageLimit:'scene'|null;requiresTeaching?:'createur'|'esprit'|'erosion'|'fin';areaRadius?:number;maxTargets?:number;requiresOccultTarget?:boolean;requiresExposedComponent?:boolean;requiresPerceivedTarget?:boolean;ignoreMagicProtection?:boolean;halfElectricProtection?:boolean;quiet?:boolean;nearlyInvisible?:boolean;erodesProtection?:boolean;preventsRegeneration?:boolean;finVeritable?:boolean;passesMaterialObstacles?:boolean};
const definitions:Partial<LightningAttack>[]=[
 {id:I.foudre,label:'Foudre aseryne',damage:7,actionCost:1},
 {id:I.orage,label:'Orage aseryn',damage:7,actionCost:2,areaRadius:3},
 {id:I.originelle,label:'Foudre originelle',damage:9,actionCost:1,requiresTeaching:'createur'},
 {id:I.deferlement,label:'Déferlement originel',damage:13,actionCost:2,requiresTeaching:'createur',ignoreMagicProtection:true},
 {id:I.noire,label:'Noire-Foudre',damage:7,actionCost:1,requiresTeaching:'esprit',nearlyInvisible:true},
 {id:I.fulguration,label:'Fulguration spirituelle',damage:7,actionCost:1,requiresTeaching:'esprit',nearlyInvisible:true,requiresExposedComponent:true,requiresPerceivedTarget:true},
 {id:I.eclipse,label:'Éclipse noire',damage:9,actionCost:2,requiresTeaching:'esprit',nearlyInvisible:true,maxTargets:3,requiresOccultTarget:true,requiresPerceivedTarget:true},
 {id:I.vaporeuse,label:'Foudre vaporeuse',damage:7,actionCost:1,requiresTeaching:'erosion',erodesProtection:true},
 {id:I.silence,label:'Foudre du Silence',damage:7,actionCost:1,requiresTeaching:'fin',quiet:true},
 // Final aseryn-revision supersedes the older catalogue's 2 PA.
 {id:I.trait,label:'Trait du Silence',damage:9,actionCost:1,requiresTeaching:'fin',quiet:true,halfElectricProtection:true}
];
export function lightningAttacks(data:any,state:any):LightningAttack[]{return definitions.filter(d=>lightningAvailable(data,state,d.id!)).map(d=>({...d,group:'Foudre',penetration:0,attackMode:'foudre',damageType:'electricite',skill:'maitrise_spirituelle',range:20,usageLimit:sceneIds.has(d.id!)?'scene':null,condition:d.areaRadius?'Centre de zone à 20 m maximum ; cibles dans un rayon de 3 m.':d.requiresOccultTarget?'Cible immatérielle ou effet métaphysique réellement perçu à 20 m maximum.':d.requiresExposedComponent?'Composante immatérielle réellement exposée et perçue à 20 m maximum.':'Cible réellement à portée (20 m maximum) ; trajectoire de Foudre possible.',...(d.requiresTeaching==='esprit'?{passesMaterialObstacles:lightningAvailable(data,state,I.atteindre)}:{}),...(d.requiresTeaching==='fin'?{preventsRegeneration:lightningAvailable(data,state,I.trace),finVeritable:lightningAvailable(data,state,I.fin)}:{})} as LightningAttack));}
const nonNegative=(v:any)=>typeof v==='number'&&Number.isFinite(v)&&v>=0;
export type LightningTarget={id:string;distance?:number;immaterial?:boolean;exposed?:boolean;perceived?:boolean;metaphysical?:boolean;kind?:'creature'|'effect'};
/** Validate before spending resources; target classifications require a fresh MJ ruling. */
export function lightningPlan(data:any,state:any,id:string,input:any){
 const option=lightningAttacks(data,state).find(p=>p.id===id);if(!option)throw new Error('foudre_variant_unavailable');
 const targets:LightningTarget[]=input.targets??[{id:input.targetId,distance:input.distance,immaterial:input.immaterial,exposed:input.exposed,perceived:input.perceived,metaphysical:input.metaphysical,kind:input.targetKind??'creature'}];
 if(!Array.isArray(targets)||!targets.length||targets.some(t=>!t||typeof t.id!=='string'||!t.id.trim())||new Set(targets.map(t=>t.id)).size!==targets.length)throw new Error('foudre_targets_required');
 if(option.areaRadius){lightningRange({distance:input.areaDistance??input.distance,contextConfirmed:input.contextConfirmed});if(targets.some(t=>!nonNegative(t.distance)||t.distance!>option.areaRadius!))throw new Error('foudre_area_required');}
 else{if(targets.length>(option.maxTargets??1))throw new Error('foudre_too_many_targets');for(const t of targets)lightningRange({distance:t.distance??input.distance,contextConfirmed:input.contextConfirmed});}
 if((option.requiresOccultTarget||option.requiresExposedComponent||targets.some(t=>t.immaterial||t.kind==='effect'))&&input.targetNatureConfirmed!==true)throw new Error('foudre_target_ruling_required');
 if(option.requiresOccultTarget&&targets.some(t=>!t.immaterial&&!(t.kind==='effect'&&t.metaphysical)))throw new Error('foudre_occult_target_required');
 if(option.requiresExposedComponent&&targets.some(t=>!t.exposed))throw new Error('foudre_exposed_component_required');
 if(targets.some(t=>(option.requiresPerceivedTarget||t.immaterial||t.kind==='effect')&&!t.perceived))throw new Error('foudre_perceived_target_required');
 return {option,actionCost:option.actionCost,usageKey:option.usageLimit?'scene:'+option.id:null,targets:targets.map(t=>({...t,defenseKind:t.immaterial||option.requiresOccultTarget||option.requiresExposedComponent?'occult':'relevant'}))};
}
export function consumeLightningUsage(state:any,id:string){if(sceneIds.has(id))state.powerUses={...state.powerUses,['scene:'+id]:(state.powerUses?.['scene:'+id]??0)+1};}
/** Final Aseryn revision permits one ally within 5 m; never every target of a zone. */
export function paratonnerreTarget(input:{actorId:string;targetId:string;allyDistance?:unknown;allyConfirmed?:boolean;destination?:unknown;safeDestinationConfirmed?:boolean;contextConfirmed?:boolean}){
 if(input.contextConfirmed!==true||input.safeDestinationConfirmed!==true||typeof input.destination!=='string'||!input.destination.trim()||input.destination.trim().length>200)throw new Error('paratonnerre_destination_required');
 if(input.actorId!==input.targetId&&(input.allyConfirmed!==true||!nonNegative(input.allyDistance)||Number(input.allyDistance)>5))throw new Error('paratonnerre_ally_range_required');
 return {protectedTargetId:input.targetId,destination:input.destination.trim(),ally:input.actorId!==input.targetId};
}
export function lightningArcPlan(data:any,state:any,input:{attackId:string;firstTargetId:string;secondTargetId:string;total:number;narrativeFailure:boolean;firstHit:boolean;alreadyBounced?:boolean;distance?:unknown;contextConfirmed?:boolean}){
 if(!lightningAvailable(data,state,I.arc)||!input.firstHit||input.narrativeFailure||input.alreadyBounced)throw new Error('foudre_arc_unavailable');
 if(!input.attackId||!input.firstTargetId||!input.secondTargetId||input.firstTargetId===input.secondTargetId||!Number.isFinite(input.total)||input.contextConfirmed!==true||!nonNegative(input.distance)||Number(input.distance)>3)throw new Error('foudre_arc_range_required');
 return {id:I.arc,attackId:input.attackId,targetId:input.secondTargetId,total:input.total,damage:5,actionCost:0,usageKey:'scene:'+I.arc,canBounce:false};
}
/** Magic's known portion is separate from ordinary electric/occult protection. */
export function lightningProtection(option:Pick<LightningAttack,'ignoreMagicProtection'|'halfElectricProtection'>,protection:{electric:number;occult?:number;magicalElectric?:number;magicalOccult?:number},occultTarget=false){
 const total=occultTarget?(protection.occult??0):protection.electric,magical=occultTarget?(protection.magicalOccult??0):(protection.magicalElectric??0);
 if(!nonNegative(total)||!nonNegative(magical)||magical>total)throw new Error('foudre_protection_invalid');
 const applicable=option.ignoreMagicProtection?total-magical:total;return option.halfElectricProtection?Math.floor(applicable/2):applicable;
}
export function lightningErosion(data:any,state:any,input:{hit:boolean;rawDamage:number;layerId:string;protection:number;material:boolean;directlyHitConfirmed:boolean;alreadyEroded?:boolean}){
 if(!lightningAvailable(data,state,I.vaporeuse)||!input.hit||!nonNegative(input.rawDamage)||input.rawDamage<2||!input.layerId.trim()||!input.directlyHitConfirmed||input.alreadyEroded||!nonNegative(input.protection))throw new Error('foudre_erosion_unavailable');
 const stronger=lightningAvailable(data,state,I.ruine);if(!input.material&&!stronger)throw new Error('foudre_erosion_material_required');
 const reduction=Math.min(input.protection,stronger?3:2);return {layerId:input.layerId,rawDamage:input.rawDamage-2,sacrificedDamage:2,reduction,protection:input.protection-reduction,until:'scene' as const};
}
export type LightningEffect={id:string;kind:'temporary'|'maintained'|'permanent'|'place'|'artifact';threshold?:number;originalTotal?:number;interruptible?:boolean;primordial?:boolean;indestructible?:boolean;creature?:boolean;metaphysical?:boolean;perceived?:boolean};
export function lightningEffectPlan(data:any,state:any,id:string,effect:LightningEffect,input:{distance?:number;contextConfirmed?:boolean;targetNatureConfirmed?:boolean;sourceRoll?:{id:string;total:number;narrativeFailure:boolean;success:boolean}}){
 if(![I.briseMagie,I.affliction,I.poussiere,I.eclipse].includes(id)||!lightningAvailable(data,state,id))throw new Error('foudre_effect_unavailable');
 lightningRange(input);if(input.targetNatureConfirmed!==true||!effect.id.trim()||effect.creature||effect.primordial||effect.indestructible)throw new Error('foudre_effect_ruling_required');
 if(id===I.eclipse&&(!effect.metaphysical||!effect.perceived||!['temporary','maintained'].includes(effect.kind)))throw new Error('foudre_occult_target_required');
 const difficulty=effect.originalTotal??effect.threshold;if(!nonNegative(difficulty)||effect.originalTotal===undefined&&![15,18,21,25].includes(difficulty!))throw new Error('foudre_effect_difficulty_required');
 if(id===I.poussiere&&(!input.sourceRoll?.id||!input.sourceRoll.success||input.sourceRoll.narrativeFailure||!Number.isFinite(input.sourceRoll.total)||input.sourceRoll.total<=difficulty!))throw new Error('foudre_effect_source_roll_required');
 return {powerId:id,effect:{...effect},difficulty:difficulty!,actionCost:id===I.eclipse?2:id===I.poussiere?0:1,usageKey:sceneIds.has(id)?'scene:'+id:null,...(id===I.poussiere?{sourceRoll:{...input.sourceRoll!}}:{})};
}
/** Caller records the jet, quota and accepted ruling. Cannot remove creatures or their Nature. */
export function lightningEffectResult(plan:ReturnType<typeof lightningEffectPlan>,total:number,narrativeFailure:boolean){
 if(!Number.isFinite(total))throw new Error('foudre_effect_invalid_result');if(narrativeFailure||total<=plan.difficulty)return {success:false,result:'unchanged' as const};
 if(plan.sourceRoll&&(plan.sourceRoll.total!==total||plan.sourceRoll.narrativeFailure!==narrativeFailure))throw new Error('foudre_effect_source_roll_required');
 if(plan.powerId===I.affliction)return {success:true,result:'weaken-scene' as const,penaltyReduction:3,resistanceLevels:1,corruptionChange:0};
 if(['temporary','maintained'].includes(plan.effect.kind))return {success:true,result:'destroy' as const};
 return plan.effect.interruptible?{success:true,result:'suspend-scene' as const}:{success:true,result:'unchanged' as const};
}
