import {getRealityRules} from './rules/reality.js';
import {activateAdrenaline,configureNeuroLoad,rebootNeuro,reloadWeapon,configureWeaponMagazine} from './rules/live-reality.js';
import {randomInt} from 'node:crypto';
import {applyVampireAction,vampireMaximum} from './rules/live-vampire.js';
import {applyNatureResourceAction,natureHpCeiling,consumeNatureTest} from './rules/live-nature-resources.js';
import {activateRegisteredPower,consumeRegisteredTest} from './rules/registered-power-state.js';
import {removeLiveEffect} from './rules/live-effects.js';
import {playProfile,rollD10,type PlayState} from './rules/play-state.js';
export function liveHealingMaximum(data:any,state:PlayState,maximum:number){return natureHpCeiling(data,state,vampireMaximum(maximum,state));}
export function applyExtendedPlayAction(data:any,original:PlayState,input:any,ctx:{fighting:boolean;participating:boolean;manager:boolean;actorId:string}){
 let state=structuredClone(original),profile=playProfile(data,state),payload:Record<string,any>={};
 if(input.action.startsWith('vampire-')){
  const result=applyVampireAction(data,state,input,{maximum:profile.derived.pvMax,death:profile.derived.death,inCombat:ctx.fighting,participating:ctx.participating,manager:ctx.manager});if('error'in result)throw new Error(result.error);state=result.state;payload=result.payload;
 }else if(input.action.startsWith('nature-')){
  if(ctx.fighting&&!ctx.participating)throw new Error('participant_out');
  if(input.action==='nature-angelus-egide')throw new Error('use_attack_resolution');
  const rollSkill=input.action==='nature-mage-backlash'?'force_mentale':'maitrise_spirituelle';
  const needsRoll=['nature-mage-release','nature-mage-backlash','nature-mage-discharge','nature-daemon-spectrum-release'].includes(input.action),die=needsRoll?rollD10(profile.stress,()=>randomInt(1,11)):null;
  const skill=profile.skills.find(s=>s.id===rollSkill),result=applyNatureResourceAction(data,state,input,{inCombat:ctx.fighting,manager:ctx.manager,hp:profile.hp,pvMax:profile.derived.pvMax,death:profile.derived.death,permanentFortitude:profile.skills.find(s=>s.id==='force_mentale')?.rank??0,rollResult:die?skill!.total+die.sum:undefined,narrativeFailure:die?.narrativeFailure});
  state=result.state;payload={...result.payload,...(die?{...die,modifier:skill!.total,total:skill!.total+die.sum,components:{attribute:skill!.attributeValue,rank:skill!.rank,bonus:skill!.bonus,skillName:skill!.name}}:{})};

 if(die){consumeNatureTest(data,state,rollSkill);consumeRegisteredTest(data,state,rollSkill);}
 }else if(input.action==='power-activate')payload=activateRegisteredPower(data,state,input,{fighting:ctx.fighting,participating:ctx.participating,hp:profile.hp});
 else if(input.action==='reality-adrenaline'){if(!ctx.fighting||!ctx.participating)throw new Error('participant_out');const result=activateAdrenaline(data,state,input.implantId);if(result.error)throw new Error(result.error);payload=result.payload!;}
 else if(input.action==='reality-neuro-reboot'){const result=rebootNeuro(data,state,{inCombat:ctx.fighting,safeRestart:input.safeRestart});if(result.error)throw new Error(result.error);payload=result.payload!;}
 else if(input.action==='reality-neuro-load'){if(ctx.fighting&&!ctx.participating)throw new Error('participant_out');const result=configureNeuroLoad(data,state,getRealityRules(),input.programs,ctx.fighting);if(result.error)throw new Error(result.error);payload=result.payload!;}
 else if(input.action==='reality-reload'||input.action==='reality-magazine'){if(ctx.fighting&&!ctx.participating)throw new Error('participant_out');const result=input.action==='reality-reload'?reloadWeapon(data,state,getRealityRules(),input,{inCombat:ctx.fighting}):configureWeaponMagazine(data,state,getRealityRules(),input,{inCombat:ctx.fighting,manager:ctx.manager});if(result.error)throw new Error(result.error);payload=result.payload!;}
 else if(input.action==='power-stop'){
  if(typeof input.powerId!=='string'||!state.registeredPowers?.some(p=>p.id===input.powerId))throw new Error('power_unavailable');state.registeredPowers=state.registeredPowers.filter(p=>p.id!==input.powerId);payload={label:'Fin de capacité',powerId:input.powerId};
 }else if(input.action==='effect-remove'){
  const effect=state.effects?.find(e=>e.id===input.effectId);if(!effect||!ctx.manager&&(effect.sourceId!==ctx.actorId||effect.kind!=='modifier'))throw new Error('effect_requires_manager');state.effects=removeLiveEffect(state.effects??[],input.effectId);payload={label:'Fin d’effet · '+effect.name,effectId:effect.id};
 }else throw new Error('unknown_mechanics_action');
 if(state.hp!==null)state.hp=Math.max(profile.derived.death,Math.min(liveHealingMaximum(data,state,profile.derived.pvMax),state.hp));
 return {state,payload};
}
