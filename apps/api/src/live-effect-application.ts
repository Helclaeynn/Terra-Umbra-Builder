import {vampireMaximum,applyVampireLastSleep} from './rules/live-vampire.js';
import {natureHpCeiling} from './rules/live-nature-resources.js';
import {tickLiveEffects,type EffectEvent} from './rules/live-effects.js';
import {consumeGuard} from './rules/targeted-powers.js';
import {playProfile,type PlayState} from './rules/play-state.js';
/** Only the server may move effect clocks or apply their resulting wounds. */
export function applyCharacterEffectTick(data:any,state:PlayState,event:EffectEvent){
 const result=tickLiveEffects(state.effects??[],event),profile=playProfile(data,state),applications:any[]=[];
 for(const a of result.applications){
  const before=state.hp??profile.hp;
  if(a.kind==='damage'&&state.vampire?.stasis&&(state.effects??[]).find(e=>e.id===a.effectId)?.ruleId==='maitre_des_lames'){applications.push({...a,before,after:before,net:0,suspended:'stase'});continue;}
  const guardReduction=a.kind==='damage'?consumeGuard(state,true,a.damageType==='occulte'):0;
  const net=a.kind==='damage'?Math.max(0,a.amount-(a.armorMode==='ignore'?0:state.effectArmor??0)-guardReduction):a.amount;
  if(a.kind==='healing'&&before<=profile.derived.death)continue;
  state.hp=Math.max(profile.derived.death,Math.min(natureHpCeiling(data,state,vampireMaximum(profile.derived.pvMax,state)),before+(a.kind==='healing'?net:-net)));
  if(net>0)state.stabilized=false;
  if(a.kind==='damage'&&net>0&&data.truth?.nature==='vampire'){const saved=applyVampireLastSleep(data,{...state,hp:before},state.hp??before,profile.derived.death,true);if(!('error'in saved))Object.assign(state,saved.state);}
  applications.push({...a,before,after:state.hp,net});
 }
 state.effects=result.effects;return {...result,applications};
}
export function applyNpcEffectTick(actor:any,event:EffectEvent){
 const result=tickLiveEffects(actor.data.liveEffects??[],event),applications:any[]=[];
 for(const a of result.applications){const before=actor.hp,guardReduction=a.kind==='damage'?consumeGuard(actor.data,true,a.damageType==='occulte'):0,net=a.kind==='damage'?Math.max(0,a.amount-(a.armorMode==='ignore'?0:actor.data.effectArmor??0)-guardReduction):a.amount;
  if(a.kind==='healing'&&before<=actor.death)continue;
  actor.hp=Math.max(actor.death,Math.min(actor.pv_max,before+(a.kind==='healing'?net:-net)));applications.push({...a,before,after:actor.hp,net});}
 actor.data.liveEffects=result.effects;actor.pa=actor.hp<=actor.death?0:actor.hp<=0?Math.min(actor.pa,1):actor.pa;return {...result,applications};
}
