import {explicitPower,usableRegisteredPower} from './live-power-registry.js';
import {registeredSkillBonus,type RegisteredActivePower} from './registered-power-state.js';

export const actionRestrictionIds={crest:'extral-crete-de-mosenine',between:'exile-entre-deux-etats'} as const;
export const actionRestrictionPowerIds=new Set<string>(Object.values(actionRestrictionIds));
export type RestrictedActionKind='movement'|'pugilat'|'melee'|'physical-defense'|'physical-effort'|'ranged-attack'|'occult'|'neuro'|'manipulation-heavy'|'other';
export type ActionRestrictionState={revelation:string;round:number;pa:number;initiative:number|null;activation?:number;activationOpen?:boolean;unconscious?:boolean;muePending?:number|null;powerUses?:Record<string,number>;registeredPowers?:RegisteredActivePower[]};
const reserveKey='round:reserved-physical-pa',spentKey='round:action-restrictions-started',activationSpentKey='activation:restricted-action';
const eligible=new Set<RestrictedActionKind>(['movement','pugilat','melee','physical-defense','physical-effort']);
const attacking=new Set<RestrictedActionKind>(['pugilat','melee','ranged-attack']);
const kinds=new Set<RestrictedActionKind>([...eligible,'ranged-attack','occult','neuro','manipulation-heavy','other']);

/** The reserved point is part of total PA, never a second action currency. */
export function reservedPhysicalPA(state:ActionRestrictionState){return Math.min(state.pa,Math.max(0,Math.min(1,state.powerUses?.[reserveKey]??0)));}
export const unrestrictedPA=(state:ActionRestrictionState)=>Math.max(0,state.pa-reservedPhysicalPA(state));
export const atRestrictedRoundStart=(state:ActionRestrictionState)=>!state.powerUses?.[spentKey];
export const atRestrictedActivationStart=(state:ActionRestrictionState)=>state.activationOpen===true&&state.powerUses?.[activationSpentKey]!==((state.activation??0)+1);
export function resetRestrictedActivationWindow(state:ActionRestrictionState){if(state.powerUses)delete state.powerUses[activationSpentKey];}
/** Restrictions survive a save changing Revelation; stopping the state is a separate command. */
export const betweenStatesActive=(state:ActionRestrictionState)=>!!state.registeredPowers?.some(p=>p.id===actionRestrictionIds.between&&(p.until===null||p.until>=state.round));
export function restrictedActionCheck(state:ActionRestrictionState,kind:RestrictedActionKind,cost:number){
 if(!kinds.has(kind))throw new Error('invalid_restricted_action_kind');
 if(!Number.isSafeInteger(cost)||cost<0)throw new Error('invalid_pa_cost');
 if(betweenStatesActive(state)&&(attacking.has(kind)||kind==='manipulation-heavy'))throw new Error('between_states_action_forbidden');
 if(state.pa<cost||!eligible.has(kind)&&unrestrictedPA(state)<cost)throw new Error(reservedPhysicalPA(state)>0?'physical_pa_reserved':'insufficient_pa');
 return {reserved:eligible.has(kind)?Math.min(cost,reservedPhysicalPA(state)):0,cost};
}
/** Call for every paid action/reaction after its other guards and before persisting. */
export function spendRestrictedPA(state:ActionRestrictionState,cost:number,kind:RestrictedActionKind){
 const checked=restrictedActionCheck(state,kind,cost);
 state.pa-=cost;state.powerUses??={};
 if(checked.reserved)state.powerUses[reserveKey]=Math.max(0,(state.powerUses[reserveKey]??0)-checked.reserved);
 if(cost>0)markRestrictedRoundAction(state);
 return checked;
}
/** Covers other command handlers which paid from the ordinary pool themselves. */
export function markRestrictedRoundAction(state:ActionRestrictionState){state.powerUses??={};state.powerUses[spentKey]=1;if(state.activationOpen)state.powerUses[activationSpentKey]=(state.activation??0)+1;}

export function activateRestrictedPower(data:any,state:ActionRestrictionState,input:any,ctx:{fighting:boolean;participating:boolean;hp:number;atRoundStart:boolean}){
 const rule=explicitPower(input.powerId);
 if(!rule||!actionRestrictionPowerIds.has(rule.id)||!usableRegisteredPower(data,state,rule.id)||state.unconscious||state.muePending||ctx.hp<=0)throw new Error('power_unavailable');
 if(ctx.fighting&&(!ctx.participating||state.initiative===null))throw new Error('participant_out');
 if(input.contextConfirmed!==true)throw new Error('power_context_required');
 if(state.powerUses?.['scene:'+rule.id])throw new Error('power_already_used');
 if(rule.id===actionRestrictionIds.crest){
  if(!ctx.fighting||!ctx.atRoundStart||!atRestrictedRoundStart(state))throw new Error('crest_round_start_required');
  if(state.powerUses?.['round:direct-pa-gain'])throw new Error('pa_gain_unavailable');
  // At the cap there is no point to reserve; do not waste the scene quota.
  if(state.pa>=(rule.maxPa??4))throw new Error('pa_gain_unavailable');
  state.pa++;state.powerUses??={};state.powerUses['round:direct-pa-gain']=1;state.powerUses[reserveKey]=1;state.powerUses['scene:'+rule.id]=1;
  return {label:'Crête de Mosenine · 1 PA physique réservé',powerId:rule.id,paCost:0,paGranted:1,paScope:'physical',duration:1};
 }
 if(betweenStatesActive(state))throw new Error('power_already_active');
 const cost=ctx.fighting?1:0;spendRestrictedPA(state,cost,'other');
 state.registeredPowers??=[];state.registeredPowers.push({id:rule.id,until:null,period:'scene'});state.powerUses??={};state.powerUses['scene:'+rule.id]=1;
 return {label:'Entre deux états · semi-immatériel',powerId:rule.id,paCost:cost,duration:'scene',physicalActiveDefenseBonus:3,attacksForbidden:true,heavyManipulationForbidden:true};
}
export function stopRestrictedPower(state:ActionRestrictionState,input:any,ctx:{fighting:boolean;atActivationStart:boolean}){
 if(input.powerId!==actionRestrictionIds.between||!betweenStatesActive(state))throw new Error('power_unavailable');
 if(ctx.fighting&&!ctx.atActivationStart)throw new Error('between_states_activation_start_required');
 if(input.safeExitConfirmed!==true)throw new Error('between_states_safe_exit_required');
 state.registeredPowers=(state.registeredPowers??[]).filter(p=>p.id!==actionRestrictionIds.between);
 return {label:'Fin d’Entre deux états',powerId:input.powerId,paCost:0};
}
/** No passive-defense bonus and no universal +3 Esquive. */
export function betweenStatesDefenseBonus(state:ActionRestrictionState,attack:{damageType:string;supernatural?:boolean;biphysical?:boolean;attackMode?:string},active:boolean){
 const purelyPhysical=!attack.supernatural&&!attack.biphysical&&attack.attackMode!=='foudre'&&!['occulte','neuro'].includes(attack.damageType);
 return active&&state.revelation==='r'&&betweenStatesActive(state)&&purelyPhysical?3:0;
}
/** Match playProfile's equivalent skill-circumstance pool; manual extras and effect modifiers remain additive. */
export function betweenStatesDefenseDelta(data:any,state:ActionRestrictionState,attack:{damageType:string;supernatural?:boolean;biphysical?:boolean;attackMode?:string},active:boolean,profile:any,otherDefenseBonus=0){
 const offered=Math.max(betweenStatesDefenseBonus(state,attack,active),otherDefenseBonus),skill=profile.skills?.find((s:any)=>s.id==='esquive');
 if(!active||!skill)return {bonus:offered,betweenBonus:0,existingCircumstance:0};
 const staticBonus=(skill.automatic??[]).filter((b:any)=>b.enabled).reduce((sum:number,b:any)=>sum+b.amount,0);
 const pendingFavor=(state as any).natureResources?.daemon?.pendingFavor;
 const favorBonus=data.truth?.nature==='daemon'&&data.truth?.consciousness!=='profane'&&state.revelation!=='v'&&pendingFavor?.skill==='esquive'?3:0;
 const existingCircumstance=Math.max(0,staticBonus,...(skill.contexts??[]).filter((b:any)=>b.enabled).map((b:any)=>b.bonus),...(skill.prepared??[]).filter((b:any)=>b.active).map((b:any)=>b.bonus),registeredSkillBonus(data,state,'esquive'),...(profile.powers??[]).filter((b:any)=>b.skill==='esquive').map((b:any)=>b.amount),profile.frenzy?.physicalBonus??0,profile.frenzy?.survivalFury??0,favorBonus);
 const bonus=Math.max(0,offered-existingCircumstance);
 return {bonus,betweenBonus:betweenStatesDefenseBonus(state,attack,active)?Math.max(0,3-Math.max(existingCircumstance,otherDefenseBonus)):0,existingCircumstance};
}
export function actionRestrictionsProfile(state:ActionRestrictionState){return {reservedPhysicalPA:reservedPhysicalPA(state),unrestrictedPA:unrestrictedPA(state),atRoundStart:atRestrictedRoundStart(state),betweenStates:betweenStatesActive(state)};}
