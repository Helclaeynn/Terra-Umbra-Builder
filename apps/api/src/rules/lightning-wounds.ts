/** Protected wound state. Numbers represent real PV lost, independently of changing body maxima. */
export type LightningWounds={blocked:number;final?:{sourceId:string;eventId:string;note:string}};
type WoundedState={hp?:number|null;lightningWounds?:LightningWounds};
type LightningWoundProof={actualDamage:number;beforeHp:number;afterHp:number;death:number;sourceId:string;eventId:string;finalRuling?:{manager:boolean;fleauConfirmed:boolean;destructionConditionsConfirmed:boolean;note:string}};
const value=(state:WoundedState)=>Number.isSafeInteger(state.lightningWounds?.blocked)&&state.lightningWounds!.blocked>0?state.lightningWounds!.blocked:0;
/** Canonical Trace du Néant: only Silence wounds, only actual damage, until the end of this scene. */
export function recordLightningWounds(state:WoundedState,attack:{quiet?:boolean;preventsRegeneration?:boolean;finVeritable?:boolean},proof:LightningWoundProof){
 if(!Number.isSafeInteger(proof.actualDamage)||proof.actualDamage<0||!Number.isFinite(proof.beforeHp)||!Number.isFinite(proof.afterHp)||!Number.isFinite(proof.death))throw new Error('foudre_wound_invalid');
 const lost=Math.min(proof.actualDamage,Math.max(0,proof.beforeHp-proof.afterHp));
 if(proof.finalRuling&&(!attack.quiet||!lost))throw new Error('foudre_fin_ruling_required');
 if(!attack.quiet||!lost)return {blocked:0,final:false};
 const previous:LightningWounds={...state.lightningWounds,blocked:value(state)};
 if(attack.preventsRegeneration)previous.blocked=value(state)+lost;
 let final=false;
 if(proof.finalRuling){
  const r=proof.finalRuling;
  if(!attack.finVeritable||!attack.preventsRegeneration||!r.manager||r.fleauConfirmed!==true||r.destructionConditionsConfirmed!==true||typeof r.note!=='string'||!r.note.trim()||r.note.length>400||proof.beforeHp<=proof.death||proof.afterHp>proof.death)throw new Error('foudre_fin_ruling_required');
  previous.final={sourceId:proof.sourceId,eventId:proof.eventId,note:r.note.trim()};final=true;
 }
 if(attack.preventsRegeneration||final)state.lightningWounds=previous;
 return {blocked:attack.preventsRegeneration?lost:0,final};
}
/** A regeneration can heal ordinary wounds; the protected portion never makes current HP go down. */
export function supernaturalHealingMaximum(state:WoundedState,maximum:number,currentHp:number){
 if(!Number.isFinite(maximum)||!Number.isFinite(currentHp))throw new Error('foudre_wound_invalid');
 if(state.lightningWounds?.final)return currentHp;
 return Math.max(currentHp,maximum-value(state));
}
/** Ordinary recovery and genuine external healing may heal this wound; regeneration itself does not. */
export function recoverLightningWounds(state:WoundedState,before:number,after:number){
 if(!Number.isFinite(before)||!Number.isFinite(after))throw new Error('foudre_wound_invalid');
 const previous=value(state),recovered=Math.max(0,after-before),blocked=Math.max(0,previous-recovered);
 if(state.lightningWounds)state.lightningWounds={...state.lightningWounds,blocked};
 return {recovered:Math.min(recovered,previous),blocked};
}
/** Trace expires at a scene boundary. Fin véritable is an actual final destruction, not a scene malus. */
export function finishLightningWoundsScene(state:WoundedState){if(state.lightningWounds)state.lightningWounds={...state.lightningWounds,blocked:0};}
export function lightningAutomaticSurvivalAllowed(state:WoundedState){return !state.lightningWounds?.final;}
export function clearLightningWoundsByGrace(state:WoundedState,context:{manager:boolean;confirmed:boolean}){if(!context.manager||context.confirmed!==true)throw new Error('grace_mj_only');state.lightningWounds={blocked:0};}
export function lightningWoundProfile(state:WoundedState){return {blockedRegeneration:value(state),until:value(state)?'scene':null,finalDestruction:!!state.lightningWounds?.final};}
