import {explicitPower,registeredTruthPowers,usableRegisteredPower,validatedPowerEffects,type RegisteredPowerEffect} from './live-power-registry.js';
export type RegisteredActivePower={id:string;skill?:string;until:number|null;period:'test'|'scene'|'scenario'|'round'};
type State={revelation:string;round:number;pa:number;initiative:number|null;unconscious?:boolean;swarmFunctional?:boolean;powerUses?:Record<string,number>;registeredPowers?:RegisteredActivePower[]};
export function registeredEffects(data:any,state:State):Array<RegisteredPowerEffect&{id:string;name:string}>{
 const result:Array<RegisteredPowerEffect&{id:string;name:string}>=[];
 for(const rule of registeredTruthPowers(data,state)){
  if(rule.route==='passive'&&!rule.context)result.push(...rule.effects.map(e=>({...e,id:rule.id,name:rule.name})));
  const active=state.registeredPowers?.find(p=>p.id===rule.id&&(p.until===null||p.until>=state.round));
  if(active)result.push(...rule.effects.filter(e=>e.kind!=='pa').map(e=>({...e,...(active.skill&&e.kind==='skill'?{skills:[active.skill]}:{}),id:rule.id,name:rule.name})));
 }
 return result;
}
export function registeredSkillBonus(data:any,state:State,skill:string){return Math.max(0,...registeredEffects(data,state).filter(e=>e.kind==='skill'&&(!e.skills||e.skills.includes(skill))).map(e=>e.amount));}
export function registeredBodyArmor(data:any,state:State){return Math.max(0,...registeredEffects(data,state).filter(e=>e.kind==='armor').map(e=>e.amount));}
export function registeredNaturalDamage(data:any,state:State){return Math.max(1,...registeredTruthPowers(data,state).filter(p=>p.route==='passive').flatMap(p=>p.effects.filter(e=>e.kind==='damage'&&e.mode==='replace'&&e.skills?.includes('pugilat')).map(e=>e.amount)));}
export function registeredReaction(data:any,state:State,id:string,route:string,params:any,skill?:string){
 const rule=explicitPower(id);
 if(!rule||rule.route!==route||!usableRegisteredPower(data,state,id))throw new Error('power_unavailable');
 if(rule.limit&&(state.powerUses?.[rule.limit+':'+id]??0)>0)throw new Error('power_already_used');
 const effects=validatedPowerEffects(rule,{contextConfirmed:params.contextConfirmed,skill:params.skill??skill});
 if(skill&&effects.some(e=>e.skills&&!e.skills.includes(skill)))throw new Error('power_skill_unavailable');
 return {rule,effects};
}
export function spendRegisteredUsage(state:State,id:string){const rule=explicitPower(id);if(rule?.limit){state.powerUses??={};state.powerUses[rule.limit+':'+id]=(state.powerUses[rule.limit+':'+id]??0)+1;}}
export function activateRegisteredPower(data:any,state:State,input:any,context:{fighting:boolean;participating:boolean;hp:number}){
 const rule=explicitPower(input.powerId);
 if(!rule||!['activate','roll'].includes(rule.route)||!usableRegisteredPower(data,state,rule.id)||state.unconscious||context.hp<=0)throw new Error('power_unavailable');
 if(context.fighting&&(!context.participating||state.initiative===null))throw new Error('participant_out');
 if(state.registeredPowers?.some(p=>p.id===rule.id))throw new Error('power_already_active');
 if(rule.limit&&(state.powerUses?.[rule.limit+':'+rule.id]??0)>0)throw new Error('power_already_used');
 const effects=validatedPowerEffects(rule,input);
 if(input.skill!==undefined&&effects.some(e=>e.kind==='skill'&&e.skills&&!e.skills.includes(input.skill)))throw new Error('power_skill_unavailable');
 if(context.fighting&&state.pa<rule.cost)throw new Error('insufficient_pa');
 if(rule.id==='extral-surcadence-somatique'&&state.swarmFunctional===false)throw new Error('power_unavailable');
 const paGain=effects.filter(e=>e.kind==='pa').reduce((n,e)=>n+e.amount,0);
 if(paGain&&(!context.fighting||state.powerUses?.['round:direct-pa-gain']))throw new Error('pa_gain_unavailable');
 const cost=context.fighting?rule.cost:0;state.pa-=cost;
 if(paGain){state.pa=Math.max(state.pa,Math.min(rule.maxPa??5,state.pa+paGain));state.powerUses??={};state.powerUses['round:direct-pa-gain']=1;}
 else{state.registeredPowers??=[];state.registeredPowers.push({id:rule.id,...(effects.find(e=>e.kind==='skill')?.skills?.length===1?{skill:effects.find(e=>e.kind==='skill')!.skills![0]}:{}),until:typeof rule.duration==='number'?state.round+rule.duration-1:rule.duration==='test'&&rule.limit==='round'?state.round:rule.testExpiresRounds!==undefined?state.round+rule.testExpiresRounds:null,period:typeof rule.duration==='number'?'round':rule.duration});}
 spendRegisteredUsage(state,rule.id);
 return {label:'Capacité · '+rule.name,powerId:rule.id,paCost:cost,effects,context:rule.context,duration:rule.duration};
}
export function consumeRegisteredTest(data:any,state:State,skill:string){state.registeredPowers=(state.registeredPowers??[]).filter(p=>p.period!=='test'||!registeredEffects(data,{...state,registeredPowers:[p]}).some(e=>e.kind==='skill'&&(!e.skills||e.skills.includes(skill))));}
