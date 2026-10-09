import {validateLiveEffect,rebaseLiveEffects,type LiveEffect,type EffectClock} from './live-effects.js';
type Change={effectId:string;before:LiveEffect;applied:LiveEffect};
const effects=(state:any,npc:boolean):LiveEffect[]=>state[npc?'liveEffects':'effects']??[];
/** The live effect stays present so suspension cannot erase maintenance links or become permanent. */
export function applyLightningEffectChange(state:any,effectId:string,result:'destroy'|'suspend-scene'|'weaken-scene'|'unchanged',npc=false){
 const key=npc?'liveEffects':'effects',list=effects(state,npc),before=list.find(e=>e.id===effectId);if(!before||!validateLiveEffect(before))throw new Error('foudre_effect_closed');
 if(result==='unchanged')return {changed:false};
 if(result==='destroy'){state[key]=list.filter(e=>e.id!==effectId);state.lightningEffectChanges=(state.lightningEffectChanges??[]).filter((c:Change)=>c.effectId!==effectId);return {changed:true};}
 const previous=(state.lightningEffectChanges??[]).find((c:Change)=>c.effectId===effectId);
 if(previous&&(result!=='suspend-scene'||previous.applied.startsAt?.at===101000))throw new Error('foudre_effect_already_weakened');
 let applied=structuredClone(before);
 if(result==='weaken-scene'){
  // Numeric maluses can be weakened; arbitrary labels, damage ticks or Corruption are never parsed.
  if(before.kind!=='modifier'||before.amount>=0)throw new Error('foudre_affliction_not_numeric');
  applied.amount=Math.min(0,before.amount+3);
 }
 if(result==='suspend-scene'||applied.amount===0){applied=structuredClone(before);applied.startsAt={unit:'round',at:101000};if(applied.nextTick!==null)applied.nextTick=101000;}
 if(!validateLiveEffect(applied))throw new Error('foudre_effect_state_invalid');
 state[key]=list.map(e=>e.id===effectId?applied:e);state.lightningEffectChanges=[...(state.lightningEffectChanges??[]).filter((c:Change)=>c.effectId!==effectId),{effectId,before:structuredClone(previous?.before??before),applied:structuredClone(applied)}];
 return {changed:true,before:before.amount,after:result==='weaken-scene'?Math.min(0,before.amount+3):null};
}
/** Call before ordinary scene expiration. An expired/removed/replaced effect is never resurrected. */
export function finishLightningEffectScene(state:any,npc=false){
 const key=npc?'liveEffects':'effects',changes:Change[]=state.lightningEffectChanges??[];
 state[key]=effects(state,npc).map(e=>{const change=changes.find(c=>c.effectId===e.id);return change&&JSON.stringify(change.applied)===JSON.stringify(e)?structuredClone(change.before):e;});
 state.lightningEffectChanges=[];
}
/** A new combat can reset clocks within the same scene; rebase both restoration snapshots with it. */
export function rebaseLightningEffectChanges(state:any,from:EffectClock,to:EffectClock){state.lightningEffectChanges=(state.lightningEffectChanges??[]).map((c:Change)=>({...c,before:rebaseLiveEffects([c.before],from,to)[0],applied:rebaseLiveEffects([c.applied],from,to)[0]}));}
