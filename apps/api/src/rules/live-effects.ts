/** Explicit, persisted table effects. Canonical presets below never parse rule prose. */
export const effectScopes = ['physical','mental','social','intellectual','visual','skill','defense-physical','defense-neuro','defense-occult','armor','damage','reduction','pa-physical','regeneration','condition'] as const;
export type EffectScope = typeof effectScopes[number];
export type EffectPhase = 'round-start'|'round-end'|'activation-start'|'activation-end';
export type EffectDuration = {unit:'round'|'activation';value:number}|{unit:'scene'|'manual';value?:never};
export type LiveEffectDraft = {
 name:string;sourceId:string;targetId:string;ruleId?:string;kind:'modifier'|'damage'|'healing'|'condition';scope:EffectScope;skill?:string;zone?:string;amount:number;
 stackKey:string;stackMode:'exclusive'|'best'|'sum';duration:EffectDuration;startDelay?:{unit:'round'|'activation';value:number};period?:EffectPhase;delay?:number;ticks?:number;armorMode?:'normal'|'ignore';damageType?:'physique'|'neuro'|'occulte';
};
export type LiveEffect = Omit<LiveEffectDraft,'duration'|'delay'|'ticks'|'startDelay'> & {
 id:string;startsAt:{unit:'round'|'activation';at:number}|null;expires:{unit:EffectDuration['unit'];at:number|null};createdRound:number;createdActivation:number;
 nextTick:number|null;remainingTicks:number|null;lastRoundTick:number|null;lastActivationTick:number|null;
};
export type EffectClock = {round:number;targetActivation:number};
export type EffectEvent = {phase:EffectPhase;round:number;actorId?:string;activation?:number};
export type EffectApplication = {effectId:string;name:string;sourceId:string;targetId:string;kind:'damage'|'healing';amount:number;armorMode:'normal'|'ignore';damageType:'physique'|'neuro'|'occulte'};
const phases:EffectPhase[]=['round-start','round-end','activation-start','activation-end'];
const token=(v:unknown,max=150):v is string=>typeof v==='string'&&v.length>0&&v.length<=max&&!/[\u0000-\u001f\u007f]/.test(v);
const integer=(v:unknown,min:number,max:number):v is number=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=min&&v<=max;
function allowedKeys(v:any,keys:string[]){return v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>keys.includes(k));}
const draftKeys=['name','sourceId','targetId','ruleId','kind','scope','skill','zone','amount','stackKey','stackMode','duration','startDelay','period','delay','ticks','armorMode','damageType'];
/** Invalid and unknown keys are rejected rather than silently becoming executable parameters. */
export function validateEffectDraft(v:unknown):v is LiveEffectDraft {
 const e=v as any;
 if(!allowedKeys(e,draftKeys)||!token(e.name)||!token(e.sourceId)||!token(e.targetId)||(e.ruleId!==undefined&&!token(e.ruleId))||!token(e.stackKey)||!['modifier','damage','healing','condition'].includes(e.kind)||!(effectScopes as readonly string[]).includes(e.scope)||!['exclusive','best','sum'].includes(e.stackMode))return false;
 if(!integer(e.amount,e.kind==='modifier'?-100:0,100)||e.kind==='modifier'&&e.amount===0||e.kind==='condition'&&e.scope!=='condition'&&e.scope!=='pa-physical'&&e.scope!=='regeneration')return false;
 if(e.kind==='modifier'&&['pa-physical','regeneration','condition'].includes(e.scope))return false;
 if(e.scope==='skill'?!token(e.skill,100):e.skill!==undefined)return false;
 if(e.zone!==undefined&&(e.scope!=='armor'||!token(e.zone,100)))return false;
 if((e.kind==='damage'||e.kind==='healing')&&e.amount===0||e.scope==='pa-physical'&&e.amount>5)return false;
 if(e.startDelay!==undefined&&(!allowedKeys(e.startDelay,['unit','value'])||!['round','activation'].includes(e.startDelay.unit)||!integer(e.startDelay.value,0,1000)||e.period!==undefined))return false;
 const d=e.duration;if(!allowedKeys(d,['unit','value'])||!['round','activation','scene','manual'].includes(d.unit))return false;
 if(['round','activation'].includes(d.unit)?!integer(d.value,0,1000):d.value!==undefined)return false;
 if(e.period!==undefined&&!phases.includes(e.period))return false;
 if(['damage','healing'].includes(e.kind)!==!!e.period)return false;
 if(e.period){if(e.delay!==undefined&&!integer(e.delay,0,1000)||e.ticks!==undefined&&!integer(e.ticks,1,1000))return false;}
 else if(e.delay!==undefined||e.ticks!==undefined)return false;
 if(e.armorMode!==undefined&&!['normal','ignore'].includes(e.armorMode)||e.damageType!==undefined&&!['physique','neuro','occulte'].includes(e.damageType))return false;
 if(e.kind!=='damage'&&(e.armorMode!==undefined||e.damageType!==undefined))return false;
 return true;
}
export function createLiveEffect(draft:LiveEffectDraft,clock:EffectClock&{id:string}):LiveEffect {
 if(!validateEffectDraft(draft)||!token(clock.id)||!integer(clock.round,1,100000)||!integer(clock.targetActivation,0,100000))throw new Error('invalid_effect');
 const {duration,delay,ticks,startDelay,...rest}=draft;const activation=rest.period?.startsWith('activation');
 return {...rest,id:clock.id,startsAt:startDelay?{unit:startDelay.unit,at:(startDelay.unit==='round'?clock.round:clock.targetActivation)+startDelay.value}:null,expires:{unit:duration.unit,at:duration.unit==='round'?clock.round+duration.value:duration.unit==='activation'?clock.targetActivation+duration.value:null},createdRound:clock.round,createdActivation:clock.targetActivation,
  nextTick:rest.period?(activation?clock.targetActivation:clock.round)+(delay??1):null,remainingTicks:rest.period?ticks??null:null,lastRoundTick:null,lastActivationTick:null};
}
export function validateLiveEffect(v:unknown):v is LiveEffect {
 const e=v as any;if(!allowedKeys(e,[...draftKeys.filter(k=>!['duration','delay','ticks','startDelay'].includes(k)),'id','startsAt','expires','createdRound','createdActivation','nextTick','remainingTicks','lastRoundTick','lastActivationTick'])||!token(e.id)||!allowedKeys(e.expires,['unit','at']))return false;
 if(e.startsAt!==null&&(!allowedKeys(e.startsAt,['unit','at'])||!['round','activation'].includes(e.startsAt.unit)||!integer(e.startsAt.at,0,101000)))return false;
 if(!['round','activation','scene','manual'].includes(e.expires.unit)||(['round','activation'].includes(e.expires.unit)?!integer(e.expires.at,0,101000):e.expires.at!==null))return false;
 if(!integer(e.createdRound,1,100000)||!integer(e.createdActivation,0,100000))return false;
 for(const key of ['nextTick','lastRoundTick','lastActivationTick'])if(e[key]!==null&&!integer(e[key],0,101000))return false;
 if(e.remainingTicks!==null&&!integer(e.remainingTicks,1,1000))return false;
 const duration:EffectDuration=e.expires.unit==='round'||e.expires.unit==='activation'?{unit:e.expires.unit,value:0}:{unit:e.expires.unit};
 const draft:any={};for(const key of draftKeys.filter(k=>!['duration','delay','ticks','startDelay'].includes(k)))if(e[key]!==undefined)draft[key]=e[key];draft.duration=duration;
 if(!validateEffectDraft(draft))return false;
 return !!e.period?e.nextTick!==null:e.nextTick===null&&e.remainingTicks===null&&e.lastRoundTick===null&&e.lastActivationTick===null;
}
/** Each actor has at most 100 effects; IDs are unique and protected state must be loaded server side. */
export function validateLiveEffects(v:unknown):v is LiveEffect[]{return Array.isArray(v)&&v.length<=100&&v.every(validateLiveEffect)&&new Set(v.map(e=>e.id)).size===v.length;}
export function addLiveEffect(effects:readonly LiveEffect[],effect:LiveEffect):LiveEffect[]{
 if(!validateLiveEffects(effects)||!validateLiveEffect(effect))throw new Error('invalid_effect');
 if(effects.some(e=>e.id===effect.id))throw new Error('effect_exists');
 const same=(e:LiveEffect)=>e.targetId===effect.targetId&&e.stackKey===effect.stackKey;
 if(effects.some(e=>same(e)&&(e.stackMode==='exclusive'||effect.stackMode==='exclusive')))throw new Error('effect_does_not_stack');
 if(effects.some(e=>same(e)&&e.stackMode!==effect.stackMode))throw new Error('effect_stacking_conflict');
 if(effects.length>=100)throw new Error('too_many_effects');
 return [...effects.map(e=>structuredClone(e)),structuredClone(effect)];
}
export function removeLiveEffect(effects:readonly LiveEffect[],id:string):LiveEffect[]{return effects.filter(e=>e.id!==id).map(e=>structuredClone(e));}
/** Finish-scene expires only explicitly scene effects; manual wounds continue until treatment. */
export function finishEffectsScene(effects:readonly LiveEffect[]){return effects.filter(e=>e.expires.unit!=='scene').map(e=>structuredClone(e));}
/** Use only when the controller deliberately resets combat clocks. No quota or HP is refreshed. */
export function rebaseLiveEffects(effects:readonly LiveEffect[],from:EffectClock,to:EffectClock):LiveEffect[]{
 if(!validateLiveEffects(effects)||!integer(from.round,0,100000)||!integer(from.targetActivation,0,100000)||!integer(to.round,0,100000)||!integer(to.targetActivation,0,100000))throw new Error('invalid_effect_clock');
 const roundDelta=to.round-from.round,activationDelta=to.targetActivation-from.targetActivation;
 return effects.map(saved=>{const e=structuredClone(saved);e.createdRound=Math.max(1,e.createdRound+roundDelta);e.createdActivation=Math.max(0,e.createdActivation+activationDelta);
  if(e.startsAt!==null)e.startsAt.at=Math.max(0,e.startsAt.at+(e.startsAt.unit==='activation'?activationDelta:roundDelta));
  if(e.expires.at!==null)e.expires.at=Math.max(0,e.expires.at+(e.expires.unit==='activation'?activationDelta:roundDelta));
  if(e.nextTick!==null)e.nextTick=Math.max(0,e.nextTick+(e.period?.startsWith('activation')?activationDelta:roundDelta));
  if(e.lastRoundTick!==null)e.lastRoundTick=e.lastRoundTick+roundDelta>=0?e.lastRoundTick+roundDelta:null;
  if(e.lastActivationTick!==null)e.lastActivationTick=e.lastActivationTick+activationDelta>=0?e.lastActivationTick+activationDelta:null;
  return e;});
}
export function effectModifiers(effects:readonly LiveEffect[],targetId:string,query:{scope:EffectScope;skill?:string;zone?:string;clock?:EffectClock}){
 const rows=effects.filter(e=>effectHasStarted(e,query.clock)&&e.targetId===targetId&&e.kind==='modifier'&&e.scope===query.scope&&(e.scope!=='skill'||e.skill===query.skill)&&(!e.zone||e.zone===query.zone));
 const groups=new Map<string,LiveEffect[]>();for(const e of rows){const key=e.stackKey+':'+Math.sign(e.amount);groups.set(key,[...(groups.get(key)??[]),e]);}
 const selected=[...groups.values()].flatMap(group=>group[0]!.stackMode==='sum'?group:[group.reduce((a,b)=>Math.abs(a.amount)>=Math.abs(b.amount)?a:b)]);
 return {amount:selected.reduce((sum,e)=>sum+e.amount,0),components:selected.map(e=>({id:e.id,name:e.name,amount:e.amount,ruleId:e.ruleId}))};
}
function effectHasStarted(e:LiveEffect,clock?:EffectClock){return !e.startsAt||!!clock&&(e.startsAt.unit==='round'?clock.round:clock.targetActivation)>=e.startsAt.at;}
export function effectConditions(effects:readonly LiveEffect[],targetId:string,scope:'pa-physical'|'regeneration'|'condition',clock?:EffectClock){
 return effects.filter(e=>effectHasStarted(e,clock)&&e.targetId===targetId&&e.kind==='condition'&&e.scope===scope).map(e=>({id:e.id,name:e.name,amount:e.amount,ruleId:e.ruleId}));
}
/** A physical-action ceiling restricts physical spending, never the total mental/social PA pool. */
export function canSpendPhysicalPA(effects:readonly LiveEffect[],actorId:string,state:{round:number;activation?:number;activationOpen?:boolean;physicalPaSpent?:number},cost:number){
 const spent=state.physicalPaSpent??0;if(!integer(cost,0,5)||!integer(spent,0,1000))throw new Error('invalid_physical_pa');
 const limits=state.activationOpen?effectConditions(effects,actorId,'pa-physical',{round:state.round,targetActivation:state.activation??0}).map(e=>e.amount):[];
 const limit=limits.length?Math.min(...limits):null;return {available:limit===null||spent+cost<=limit,limit,spent,nextSpent:spent+cost};
}
function expiredBefore(e:LiveEffect,event:EffectEvent){
 return e.expires.unit==='round'&&event.round>(e.expires.at??Infinity)||e.expires.unit==='activation'&&event.actorId===e.targetId&&(event.activation??0)>(e.expires.at??Infinity);
}
function expiresOn(e:LiveEffect,event:EffectEvent){
 return e.expires.unit==='round'&&event.phase==='round-end'&&event.round===(e.expires.at??Infinity)||e.expires.unit==='activation'&&event.phase==='activation-end'&&event.actorId===e.targetId&&event.activation===(e.expires.at??Infinity);
}
/** Apply ticks before expiration. Replaying the same phase/counter cannot apply its damage twice. */
export function tickLiveEffects(effects:readonly LiveEffect[],event:EffectEvent):{effects:LiveEffect[];applications:EffectApplication[];expired:string[]}{
 if(!validateLiveEffects(effects)||!phases.includes(event.phase)||!integer(event.round,1,100000)||event.phase.startsWith('activation')&&(!token(event.actorId)||!integer(event.activation,0,100000)))throw new Error('invalid_effect_tick');
 const out:LiveEffect[]=[],applications:EffectApplication[]=[],expired:string[]=[];
 for(const saved of effects){const e=structuredClone(saved);if(event.round<e.createdRound){out.push(e);continue;}if(expiredBefore(e,event)){expired.push(e.id);continue;}
  const activation=event.phase.startsWith('activation'),counter=activation?event.activation!:event.round,key=activation?'lastActivationTick':'lastRoundTick';
  const eligible=e.period===event.phase&&(!activation||event.actorId===e.targetId)&&counter>=(e.nextTick??Infinity)&&counter>(e[key]??-1);
  if(eligible&&(e.kind==='damage'||e.kind==='healing')){applications.push({effectId:e.id,name:e.name,sourceId:e.sourceId,targetId:e.targetId,kind:e.kind,amount:e.amount,armorMode:e.armorMode??'normal',damageType:e.damageType??'physique'});e[key]=counter;e.nextTick=counter+1;if(e.remainingTicks!==null)e.remainingTicks--;}
  if(e.remainingTicks===0||expiresOn(e,event))expired.push(e.id);else out.push(e);
 }
 return {effects:out,applications,expired};
}
/** Controller-derived authority only. Never accept these flags or a verified PA pool from the request body. */
export type EffectMutationContext={actorId:string;isManager:boolean;sourceAuthorized:boolean;targetConsents:boolean;hostile:boolean;paAvailable:number;paCost:number};
export function planEffectMutation(effects:readonly LiveEffect[],draft:LiveEffectDraft,clock:EffectClock&{id:string},ctx:EffectMutationContext){
 if(!ctx.isManager&&(!ctx.sourceAuthorized||draft.sourceId!==ctx.actorId||ctx.hostile||draft.targetId!==ctx.actorId&&!ctx.targetConsents))throw new Error('effect_requires_manager');
 if(!integer(ctx.paCost,0,5)||!integer(ctx.paAvailable,0,5)||ctx.paCost>ctx.paAvailable)throw new Error('insufficient_pa');
 return {effects:addLiveEffect(effects,createLiveEffect(draft,clock)),paCost:ctx.paCost};
}
export const canonicalEffectPresets=['maitre_des_lames','khinae-serpent-vipere','khinae-serpent-cobra','extral-venin-rocreen','munitions-speciales-phoenix-hack','munitions-lourdes-consommables-grenade-flash-doorbell','extral-jet-d-encre','extral-ouvrir-la-cuirasse'] as const;
export type CanonicalEffectId=typeof canonicalEffectPresets[number];
export type CanonicalEffectProof={sourceId:string;targetId:string;owned:boolean;access:boolean;hit?:boolean;alteration?:boolean;damage?:number;bleeds?:boolean;exposed?:boolean;resistanceFailed?:boolean;connected?:boolean;margin?:number;physicalWeapon?:boolean;affectedZone?:string};
/** Proof fields are decisions already verified by the controller/MJ, not client assertions. */
export function canonicalEffectDraft(id:CanonicalEffectId,p:CanonicalEffectProof):{draft:LiveEffectDraft;paCost:number;limit:'scene'|null;removalPaCost:number|null}{
 if(!p.owned||!p.access||!token(p.sourceId)||!token(p.targetId))throw new Error('effect_source_unavailable');
 const base={sourceId:p.sourceId,targetId:p.targetId,ruleId:id,stackMode:'exclusive' as const};let draft:LiveEffectDraft,paCost=0,limit:'scene'|null=null,removalPaCost:number|null=null;
 switch(id){
  case 'maitre_des_lames':if(!p.hit||!p.alteration||!(p.margin!>=6)||!(p.damage!>=1)||!p.bleeds)throw new Error('effect_conditions_not_met');draft={...base,name:'Plaie persistante · Maître des lames',kind:'damage',scope:'condition',amount:2,stackKey:'maitre_des_lames:plaie',duration:{unit:'manual'},period:'round-end',delay:1,armorMode:'ignore',damageType:'physique'};removalPaCost=1;break;
  case 'khinae-serpent-vipere':if(!p.hit||!(p.damage!>=1)||!p.exposed||!p.resistanceFailed)throw new Error('effect_conditions_not_met');draft={...base,name:'Venin hémotoxique · Vipère',kind:'damage',scope:'condition',amount:1,stackKey:'khinae:venin-vipere',duration:{unit:'activation',value:2},period:'activation-start',delay:1,ticks:2,armorMode:'ignore',damageType:'physique'};limit='scene';break;
  case 'khinae-serpent-cobra':if(!p.hit||!p.exposed||!p.resistanceFailed)throw new Error('effect_conditions_not_met');draft={...base,name:'Venin neurotoxique · Cobra',kind:'condition',scope:'pa-physical',amount:1,stackKey:'khinae:venin-cobra',startDelay:{unit:'activation',value:1},duration:{unit:'activation',value:1}};limit='scene';break;
  case 'extral-venin-rocreen':if(!p.hit||!p.exposed||!p.resistanceFailed)throw new Error('effect_conditions_not_met');draft={...base,name:'Venin rocréen',kind:'modifier',scope:'physical',amount:-3,stackKey:'rocreen:venin',duration:{unit:'round',value:1}};paCost=1;limit='scene';break;
  case 'munitions-speciales-phoenix-hack':if(!p.alteration||!p.connected)throw new Error('effect_conditions_not_met');draft={...base,name:'Phoenix Hack · Défense Neuro',kind:'modifier',scope:'defense-neuro',amount:-3,stackKey:'phoenix-hack',duration:{unit:'activation',value:1}};break;
  case 'munitions-lourdes-consommables-grenade-flash-doorbell':if(!p.alteration||!p.exposed)throw new Error('effect_conditions_not_met');draft={...base,name:'Flash Doorbell · Tests visuels',kind:'modifier',scope:'visual',amount:-3,stackKey:'flash-visual',duration:{unit:'activation',value:1}};break;
  case 'extral-jet-d-encre':if(!p.exposed)throw new Error('effect_conditions_not_met');draft={...base,name:'Jet d’encre · Vision gênée',kind:'modifier',scope:'visual',amount:-3,stackKey:'ink-visual',duration:{unit:'manual'}};paCost=1;limit='scene';removalPaCost=1;break;
  case 'extral-ouvrir-la-cuirasse':if(!p.alteration||!p.physicalWeapon||!token(p.affectedZone,100))throw new Error('effect_conditions_not_met');draft={...base,name:'Brèche d’Armure · '+p.affectedZone,kind:'modifier',scope:'armor',zone:p.affectedZone,amount:-2,stackKey:'armor-breach:'+p.affectedZone,duration:{unit:'scene'}};break;
  default:throw new Error('unknown_effect_preset');
 }
 return {draft,paCost,limit,removalPaCost};
}
export function formatLiveEffect(e:LiveEffect){
 const value=e.kind==='damage'?`${e.amount} PV perdus`:e.kind==='healing'?`${e.amount} PV rendus`:e.kind==='modifier'?`${e.amount>0?'+':''}${e.amount} ${e.scope==='skill'?e.skill:e.scope}`:e.scope==='pa-physical'?`maximum ${e.amount} PA physique`:e.scope==='regeneration'&&e.amount===0?'Régénération suspendue':e.name;
 const duration=e.expires.unit==='round'?`fin du round ${e.expires.at}`:e.expires.unit==='activation'?`fin de l’activation ${e.expires.at}`:e.expires.unit==='scene'?'fin de scène':'jusqu’à retrait';
 const start=e.startsAt?`à partir ${e.startsAt.unit==='activation'?'de l’activation':'du round'} ${e.startsAt.at} · `:'';
 return `${value} · ${start}${e.period??'continu'} · ${duration}`;
}
