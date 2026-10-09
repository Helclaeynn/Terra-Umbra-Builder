import {truthPowers,powerAllowed,liveTruthState} from './play-truth.js';
import {augmenticCrisis} from './live-reality.js';
import {spendRestrictedPA} from './live-action-restrictions.js';
import {frenzyPowerIds} from './live-frenzy-ids.js';
export {frenzyPowerIds,frenzyDedicatedIds,frenzyActions} from './live-frenzy-ids.js';

export type FrenzyOrigin='khinae'|'augmentic'|'supernatural'|'voluntary';
export type LiveFrenzy={origin:FrenzyOrigin;sourceId:string;cause:string;impulse:string;enteredRound:number;elapsedRounds:number;lastRound:number;impulseSpentRound:number|null;impulseImpossibleRound:number|null;fearSuppressed:boolean;growing:boolean;physicalBonus:number;lucid:boolean;hostileObstacle?:{id:string;until:number}|null};
export type LiveFear={level:0|1|2;sourceId:string;cause:string}|null;
export type SurvivalFury={until:number}|null;
export type FrenzyState={revelation:string;round:number;pa:number;initiative:number|null;unconscious?:boolean;stress:number;powerUses?:Record<string,number>;frenzy?:LiveFrenzy|null;fear?:LiveFear;survivalFury?:SurvivalFury};
export const frenzyPhysicalSkills=new Set(['athletisme','pugilat','melee','constitution','tir','pilotage','furtivite','esquive','larcin']);
type Context={manager:boolean;fighting:boolean;participating:boolean;hp:number};
type DieResult={total:number;narrativeFailure:boolean};
const text=(v:unknown)=>typeof v==='string'&&v.trim().length>0&&v.length<=300?v.trim():null;
function usable(data:any,state:FrenzyState,id:string){
 if(id==='morrighan_la_corneille_etrangere_facette_guerre_frenesie_fureur_de_la_corneille'&&data.truth?.choices?.divinity!=='morrighan')return false;
 const rule=truthPowers(data).find(r=>r.id===id);return !!rule&&powerAllowed(rule,state.revelation);
}
function able(state:FrenzyState,ctx:Context){if(state.unconscious||ctx.hp<=0||ctx.fighting&&(!ctx.participating||state.initiative===null))throw new Error('frenzy_actor_unavailable');}
function initialFrenzy(state:FrenzyState,origin:FrenzyOrigin,input:any,options:Partial<LiveFrenzy>={}):LiveFrenzy{
 const sourceId=text(input.sourceId),cause=text(input.cause),impulse=text(input.impulse);
 if(!sourceId||!cause||!impulse||input.contextConfirmed!==true)throw new Error('frenzy_context_required');
 return {origin,sourceId,cause,impulse,enteredRound:state.round,elapsedRounds:1,lastRound:state.round,impulseSpentRound:null,impulseImpossibleRound:null,fearSuppressed:origin==='khinae',growing:false,physicalBonus:0,lucid:false,...options};
}

/** Voluntary entry requires the real purchased talent. Other entries are rulings tied to an explicit source. */
export function enterFrenzy(data:any,state:FrenzyState,input:any,ctx:Context){
 able(state,ctx);if(state.frenzy)throw new Error('frenzy_already_active');
 const t=liveTruthState(data),id=input.powerId;
 if(frenzyPowerIds.has(id)){
  if(!usable(data,state,id))throw new Error('power_unavailable');
  const asulf=id==='fureur_croissante'||id==='khinae_blood_fureur_croissante';
  if(!asulf&&(t.nature!=='daemon'||t.choices.divinity!=='morrighan'))throw new Error('power_unavailable');
  const lucidId=t.nature==='khinae'?'khinae_blood_rage_lucide':'rage_lucide';
  const frenzy=initialFrenzy(state,'voluntary',{...input,sourceId:id},{growing:asulf,physicalBonus:asulf?1:3,fearSuppressed:true,lucid:asulf&&usable(data,state,lucidId)});
  // Asulf's canonical access specifies 1 PA; Morrighan's reviewed activation has no PA cost.
  const cost=asulf&&ctx.fighting?1:0;spendRestrictedPA(state,cost,'other');state.frenzy=frenzy;
  return {label:'Frénésie · '+frenzy.impulse,sourceId:frenzy.sourceId,origin:frenzy.origin,impulse:frenzy.impulse,physicalBonus:frenzy.physicalBonus,paCost:cost};
 }else{
  if(!ctx.manager)throw new Error('frenzy_requires_manager');
  if(!['khinae','supernatural'].includes(input.origin))throw new Error('invalid_frenzy_origin');
  if(input.origin==='khinae'&&!['garou','khinae'].includes(t.nature))throw new Error('invalid_frenzy_origin');
  state.frenzy=initialFrenzy(state,input.origin,input);
 }
 return {label:'Frénésie · '+state.frenzy!.impulse,sourceId:state.frenzy!.sourceId,origin:state.frenzy!.origin,impulse:state.frenzy!.impulse,physicalBonus:state.frenzy!.physicalBonus,paCost:0};
}

/** The server supplies actual Charge/Stress/permanent limits; the client cannot choose DD. */
export function augmenticFrenzyDifficulty(values:{charge:number;integrity:number;stress:number;maximum:number}){return augmenticCrisis(values.charge,values.integrity,values.stress,values.maximum).difficulty;}
export function resolveAugmenticFrenzy(data:any,state:FrenzyState,input:any,result:DieResult,ctx:Context,values:{charge:number;integrity:number;stress:number;maximum:number}){
 able(state,ctx);if(state.frenzy)throw new Error('frenzy_already_active');
 const difficulty=augmenticFrenzyDifficulty(values);if(difficulty===null)throw new Error('augmentic_crisis_unavailable');
 if(!ctx.manager||input.triggerConfirmed!==true)throw new Error('augmentic_trigger_requires_manager');
 const frenzy=initialFrenzy(state,'augmentic',input),success=!result.narrativeFailure&&result.total>=difficulty;
 if(!success)state.frenzy=frenzy;
 return {label:'Résistance à la Frénésie augmentique',difficulty,success,sourceId:frenzy.sourceId,origin:'augmentic',impulse:frenzy.impulse,paCost:0};
}

export function frenzyExitDifficulty(state:FrenzyState,input:any){
 if(!state.frenzy)throw new Error('frenzy_unavailable');
 if(typeof input.causeGone!=='boolean'||input.contextConfirmed!==true)throw new Error('frenzy_context_required');
 return input.causeGone?12:15;
}
export function resolveFrenzyExit(state:FrenzyState,input:any,result:DieResult,ctx:Context){
 able(state,ctx);const difficulty=frenzyExitDifficulty(state,input),source=state.frenzy!,success=!result.narrativeFailure&&result.total>=difficulty;
 if(success)state.frenzy=null;
 return {label:success?'Frénésie terminée':'Sortie de Frénésie · échec',difficulty,success,sourceId:source.sourceId,paCost:0};
}
export function resolveFrenzyObstacle(state:FrenzyState,input:any,result:DieResult,ctx:Context){
 able(state,ctx);const f=state.frenzy;
 if(!f||!f.fearSuppressed||f.lucid&&state.revelation==='r'||!ctx.manager||!text(input.obstacleId)||input.recognizedCloseConfirmed!==true||input.impulseBlockedConfirmed!==true)throw new Error('frenzy_obstacle_unavailable');
 const success=!result.narrativeFailure&&result.total>=15;
 f.hostileObstacle=success?null:{id:input.obstacleId.trim(),until:state.round};
 return {label:'Frénésie · reconnaître le proche qui fait obstacle',difficulty:15,success,obstacleId:input.obstacleId.trim(),hostileUntil:success?null:state.round,paCost:0};
}

/** Does not merge fear into the generic stress field: injuries/other causes must survive suppression. */
export function setLiveFear(state:FrenzyState,input:any,ctx:{manager:boolean}){
 if(!ctx.manager)throw new Error('fear_requires_manager');
 if(![0,1,2].includes(input.level)||!text(input.sourceId)||!text(input.cause)||input.contextConfirmed!==true)throw new Error('fear_context_required');
 state.fear=input.level===0?null:{level:input.level,sourceId:input.sourceId.trim(),cause:input.cause.trim()};
 return {label:input.level?'Peur · '+(input.level===1?'Tendu':'Paniqué'):'Peur terminée',level:input.level,sourceId:input.sourceId.trim()};
}
export const psychologicalStress=(state:FrenzyState)=>Math.max(state.stress,state.frenzy?.fearSuppressed?0:state.fear?.level??0);
export function frenzyProfile(data:any,state:FrenzyState){
 const f=state.frenzy,activeFury=!!state.survivalFury&&state.survivalFury.until>=state.round&&usable(data,state,'furie_de_survie');
 const available=f?.origin!=='voluntary'||usable(data,state,f.sourceId),lucid=!!f?.lucid&&available&&state.revelation==='r';
 return {active:!!f,origin:f?.origin??null,impulse:f?.impulse??null,physicalBonus:available?f?.physicalBonus??0:0,concentrationPenalty:f&&!lucid?-3:0,lucid,fearSuppressed:f?.fearSuppressed??false,fear:state.fear??null,impulseRequired:!!f&&f.impulseSpentRound!==state.round&&f.impulseImpossibleRound!==state.round,survivalFury:activeFury?3:0,survivalFuryUntil:activeFury?state.survivalFury!.until:null,hostileObstacle:f?.hostileObstacle&&f.hostileObstacle.until>=state.round?f.hostileObstacle:null};
}
export function frenzyTestBonus(data:any,state:FrenzyState,skill:string){const p=frenzyProfile(data,state);return frenzyPhysicalSkills.has(skill)?Math.max(p.physicalBonus,p.survivalFury):0;}
export function frenzyConcentrationPenalty(state:FrenzyState,requiresCalm:boolean,data?:any){
 const lucid=data?frenzyProfile(data,state).lucid:state.frenzy?.lucid&&state.revelation==='r';
 return requiresCalm&&state.frenzy&&!lucid?-3:0;
}

/** A paid action is marked as pursuing the impulse only with a declared, confirmed context. */
export function frenzyActionCheck(state:FrenzyState,cost:number,input:{pursuesImpulse?:unknown;contextConfirmed?:unknown;impulseImpossibleConfirmed?:unknown},ctx:{manager:boolean}){
 const f=state.frenzy;if(!f||cost<=0||f.impulseSpentRound===state.round||f.impulseImpossibleRound===state.round)return;
 if(input.impulseImpossibleConfirmed===true&&ctx.manager)return;
 if(input.pursuesImpulse===true&&input.contextConfirmed===true)return;
 if(state.pa-cost<1)throw new Error('frenzy_impulse_pa_required');
}
export function recordFrenzyAction(state:FrenzyState,cost:number,input:{pursuesImpulse?:unknown;contextConfirmed?:unknown;impulseImpossibleConfirmed?:unknown},ctx:{manager:boolean}){
 const f=state.frenzy;if(!f)return;
 if(input.impulseImpossibleConfirmed===true&&ctx.manager)f.impulseImpossibleRound=state.round;
 if(cost>=1&&input.pursuesImpulse===true&&input.contextConfirmed===true)f.impulseSpentRound=state.round;
}
/** Called once per actual round; combat-start rebase is not elapsed time. */
export function advanceFrenzyRound(state:FrenzyState){
 const f=state.frenzy;if(f){const elapsed=Math.max(0,state.round-f.lastRound);f.elapsedRounds+=elapsed;f.lastRound=state.round;if(f.growing)f.physicalBonus=Math.min(3,f.elapsedRounds);if(f.hostileObstacle&&f.hostileObstacle.until<state.round)f.hostileObstacle=null;}
 if(state.survivalFury&&state.survivalFury.until<state.round)state.survivalFury=null;
}
export function rebaseFrenzyRound(state:FrenzyState,oldRound:number,newRound:number){
 const f=state.frenzy;if(f){f.lastRound=newRound;f.enteredRound+=newRound-oldRound;if(f.impulseSpentRound===oldRound)f.impulseSpentRound=newRound;if(f.impulseImpossibleRound===oldRound)f.impulseImpossibleRound=newRound;if(f.hostileObstacle)f.hostileObstacle.until+=newRound-oldRound;}
 if(state.survivalFury)state.survivalFury.until+=newRound-oldRound;
}

/** Only real HP loss at a fixed maximum creates a crossing. Healing and form changes never call this. */
export function recordSurvivalFuryDamage(data:any,state:FrenzyState,input:{beforeHp:number;afterHp:number;maximum:number;realDamage:boolean}){
 if(!input.realDamage||input.afterHp>=input.beforeHp||input.maximum<=0||!usable(data,state,'furie_de_survie'))return [];
 const crossed:number[]=[];state.powerUses??={};
 for(const percent of [50,25]){
  const threshold=input.maximum*percent/100,key='scene:furie_de_survie:'+percent;
  if(input.beforeHp>=threshold&&input.afterHp<threshold&&!state.powerUses[key]){state.powerUses[key]=1;crossed.push(percent);}
 }
 if(crossed.length)state.survivalFury={until:state.round+1};
 return crossed;
}
export function consumeSurvivalFury(data:any,state:FrenzyState,skill:string){if(frenzyPhysicalSkills.has(skill)&&frenzyProfile(data,state).survivalFury)state.survivalFury=null;}
/** Ending a scene is not an automatic cure for a persistent supernatural source. */
export function resetFrenzyScene(state:FrenzyState){state.survivalFury=null;if(state.frenzy){state.frenzy.impulseSpentRound=null;state.frenzy.impulseImpossibleRound=null;state.frenzy.hostileObstacle=null;}}
