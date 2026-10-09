/** Finite equipment resources. Rules come from Réalité V9 (Ablatif) and the
 * exact TruthEquipment v6 rows, rather than properties guessed from a name.
 * Callers authorize the actor, hold its lock, and commit these mutations with
 * the action/event. None of these resources resets on an ordinary round. */
import {truthWeaponProfiles} from './live-truth-items.js';
export type ItemResourceState={pa?:number;activation?:number;initiative?:number|null;hp?:number|null;unconscious?:boolean;powerUses?:Record<string,number>;ammoCount?:Record<string,number>;itemResources?:{
 ablative?:Record<string,number>;consumed?:Record<string,number>;weaponModes?:Record<string,string>;modeChanged?:Record<string,string>;cooling?:Record<string,string>;
}};
export type ItemProtection={id:string;itemId?:string;sourceId?:string;armor?:number;body?:number;reductions:Record<string,number>;additive?:Record<string,number>;ablation?:number;[key:string]:unknown};
const ownedTruth=(data:any,id:string)=>(Array.isArray(data?.truth?.truthEquipment)?data.truth.truthEquipment:[]).filter((x:any)=>x===id).length;
const validCount=(x:unknown,max=100000):x is number=>Number.isSafeInteger(x)&&Number(x)>=0&&Number(x)<=max;
const resources=(state:ItemResourceState)=>state.itemResources??(state.itemResources={});
export const truthGuardItems={brigandine:'verite-24-brigandine-de-garde',token:'verite-24-jeton-de-garde'} as const;
const ablativeRules:Readonly<Record<string,{capacity:number;vector:string;reduction:number}>>={
 'armures-basiques-raven-black-feathers':{capacity:4,vector:'balistique',reduction:1},
 'armures-basiques-owl-bullets-fear':{capacity:2,vector:'balistique',reduction:2},
 'armures-basiques-phoenix-sun-shield':{capacity:4,vector:'melee',reduction:1},
 'armures-basiques-byron-punk-life':{capacity:4,vector:'melee',reduction:1}
};
const plates='modules-d-armure-plaques-ablatives';
function ruleFor(protection:ItemProtection){const source=protection.itemId??protection.sourceId??protection.id;return source===plates?{capacity:2,vector:null,reduction:1}:ablativeRules[source];}
function charge(state:ItemResourceState,id:string,capacity:number){const remaining=state.itemResources?.ablative?.[id];if(remaining!==undefined&&!validCount(remaining,capacity))throw new Error('invalid_ablative_state');return remaining??capacity;}
/** Apply to the owned protection projection, before choosing the best layer.
 * Punk Life's permanent Antichoc 1 survives depletion of its Mêlée layer. A
 * module grants no protection here: its mounted host is validated separately. */
export function itemProtectionWithResources(state:ItemResourceState,protection:ItemProtection):ItemProtection{
 const rule=ruleFor(protection);if(!rule)return protection;
 const remaining=charge(state,protection.id,rule.capacity),result={...protection,reductions:{...protection.reductions},additive:{...protection.additive},ablativeRemaining:remaining,ablation:rule.capacity};
 if(rule.vector&&remaining===0)result.reductions[rule.vector]=Math.max(0,(result.reductions[rule.vector]??0)-rule.reduction);
 return result;
}
/** A module is a mounted physical layer, never a free untyped supernatural
 * reduction. The caller confirms compatibility/slot use, and identifies a
 * selected worn host. Multiple identical modules provide only one +1 bonus. */
export function ablativeModuleReduction(state:ItemResourceState,selected:ItemProtection[],vector:string,input:{hostId?:unknown;mountedConfirmed?:unknown},material:boolean){
 const modules=selected.filter(p=>(p.itemId??p.sourceId??p.id)===plates);
 if(!modules.length)return {reduction:0,moduleId:null};
 if(!material||!['melee','balistique','antichoc','feu','froid','electricite','chimique'].includes(vector))return {reduction:0,moduleId:null};
 if(input.mountedConfirmed!==true||typeof input.hostId!=='string')throw new Error('ablative_host_required');
 const host=selected.find(p=>p.id===input.hostId&&(p.itemId??p.sourceId??p.id)!==plates);
 if(!host||!((host.armor??0)>0||Object.values(host.reductions).some(v=>v>0)))throw new Error('ablative_host_required');
 const module=modules.find(p=>charge(state,p.id,2)>0);return {reduction:module?1:0,moduleId:module?.id??null};
}
/** One actual applicable impact consumes one charge, even if protection absorbs
 * every PV. Misses, electrical Foudre through ordinary physical armour, and a
 * different vector do not consume an unrelated layer. */
export function consumeAblativeImpact(state:ItemResourceState,selected:ItemProtection[],ctx:{hit:boolean;material:boolean;vector:string;moduleId?:string|null}){
 if(!ctx.hit||!ctx.material)return [];
 const spent:Array<{id:string;before:number;after:number}>=[];
 for(const protection of [...new Map(selected.map(p=>[p.id,p])).values()]){
  const rule=ruleFor(protection);if(!rule||rule.vector!==null&&rule.vector!==ctx.vector||rule.vector===null&&ctx.moduleId!==protection.id)continue;
  const before=charge(state,protection.id,rule.capacity);if(!before)continue;
  resources(state).ablative={...state.itemResources?.ablative,[protection.id]:before-1};spent.push({id:protection.id,before,after:before-1});
 }
 return spent;
}
/** Replacement/recharge is a concrete inventory action, not a scene reset.
 * Authorizing a manager correction versus an out-of-combat declaration belongs
 * to the caller. Ownership is checked here, so a UID cannot recharge another
 * actor's armour. */
export function restoreAblativeItem(data:any,state:ItemResourceState,input:{itemId?:unknown;replacementAvailable?:unknown},ctx:{inCombat:boolean;manager:boolean}){
 if(ctx.inCombat&&!ctx.manager)throw new Error('ablative_requires_manager');
 if(input.replacementAvailable!==true)throw new Error('ablative_replacement_required');
 if(typeof input.itemId!=='string')throw new Error('ablative_item_unavailable');
 const purchase=(data?.reality?.equipment??[]).find((p:any)=>(p.uid??p.itemId)===input.itemId&&p.quantity!==0);
 const rule=purchase&&(purchase.itemId===plates?{capacity:2}:ablativeRules[purchase.itemId]);if(!rule)throw new Error('ablative_item_unavailable');
 const before=charge(state,input.itemId,rule.capacity);if(before===rule.capacity)throw new Error('ablative_already_full');
 resources(state).ablative={...state.itemResources?.ablative,[input.itemId]:rule.capacity};
 return {label:'Remplacement de protection ablative',itemId:input.itemId,before,after:rule.capacity,managerCorrection:ctx.manager};
}
export function truthGuardItemProfile(data:any,state:ItemResourceState){
 const tokenOwned=ownedTruth(data,truthGuardItems.token),tokenConsumed=state.itemResources?.consumed?.[truthGuardItems.token]??0;if(!validCount(tokenConsumed))throw new Error('invalid_consumable_state');
 return {brigandine:{owned:ownedTruth(data,truthGuardItems.brigandine)>0,available:ownedTruth(data,truthGuardItems.brigandine)>0&&!(state.powerUses?.['scenario:item:'+truthGuardItems.brigandine]??0)},token:{owned:tokenOwned,remaining:Math.max(0,tokenOwned-tokenConsumed)}};
}
/** Brigandine is already worn/selected; owning it is not enough. Consume only
 * when a positive supernatural damage source actually reaches the guard. The
 * standard scenario reset of powerUses restores the stabilised rune. */
export function consumeBrigandineGuard(data:any,state:ItemResourceState,ctx:{worn:boolean;supernatural:boolean;hit:boolean;damage:number}){
 if(!ctx.worn||!ctx.supernatural||!ctx.hit||ctx.damage<=0||!truthGuardItemProfile(data,state).brigandine.available)return 0;
 state.powerUses={...state.powerUses,['scenario:item:'+truthGuardItems.brigandine]:1};return Math.min(3,ctx.damage);
}
/** A token is destroyed once. The caller validates that a Reaction is possible
 * and pays the ordinary Reaction PA in the same locked transaction. It cannot
 * be used as an unrelated permanent armour/reduction toggle. */
export function consumeGuardToken(data:any,state:ItemResourceState,ctx:{supernatural:boolean;damage:number;reactionAllowed:boolean}){
 if(!ctx.supernatural||ctx.damage<=0)throw new Error('guard_token_not_applicable');
 if(!ctx.reactionAllowed)throw new Error('guard_token_reaction_unavailable');
 if(truthGuardItemProfile(data,state).token.remaining<1)throw new Error('guard_token_empty');
 resources(state).consumed={...state.itemResources?.consumed,[truthGuardItems.token]:(state.itemResources?.consumed?.[truthGuardItems.token]??0)+1};
 return Math.min(2,ctx.damage);
}
const modeRules:Readonly<Record<string,{modes:string[];cost:number;oncePerActivation?:boolean;locked?:boolean}>>={
 'verite-25-blaster-atomus':{modes:['rafale','concentre'],cost:0,oncePerActivation:true},
 'verite-26-custodian-ar-9':{modes:['standard','perforant'],cost:1,locked:true},
 'verite-26-duplex-ar-12':{modes:['assaut','dispersion'],cost:1,locked:true}
};
export function truthWeaponResourceProfile(data:any,state:ItemResourceState){
 return Object.entries(modeRules).filter(([id])=>ownedTruth(data,id)>0).map(([id,r])=>({id,modes:r.modes,current:state.itemResources?.weaponModes?.[id]??r.modes[0],changePa:r.cost,oncePerActivation:!!r.oncePerActivation}));
}
/** Compact private projection for the owner's/MJ's equipment drawer. Catalog
 * names are looked up only for explicitly owned items, never read as rules. */
export function liveItemResourceProfile(data:any,state:ItemResourceState,catalog:{equipment?:ReadonlyArray<{id:string;name:string}>}={}){
 const ablative=(Array.isArray(data?.reality?.equipment)?data.reality.equipment:[]).filter((p:any)=>p.quantity!==0).flatMap((p:any)=>{
  const rule=p.itemId===plates?{capacity:2}:ablativeRules[p.itemId];if(!rule)return [];
  const id=p.uid??p.itemId;return [{id,itemId:p.itemId,name:catalog.equipment?.find(item=>item.id===p.itemId)?.name??p.itemId,capacity:rule.capacity,remaining:charge(state,id,rule.capacity)}];
 });
 const weaponReserves=[...new Set(truthWeaponProfiles.filter(p=>ownedTruth(data,p.sourceId)>0).map(p=>p.sourceId))].map(id=>{
  const remaining=state.ammoCount?.[id];if(remaining!==undefined&&!validCount(remaining))throw new Error('invalid_truth_reserve');return {id,name:truthWeaponProfiles.find(p=>p.sourceId===id)!.label,remaining:remaining??null};
 });
 return {ablative,guards:truthGuardItemProfile(data,state),modes:truthWeaponResourceProfile(data,state),weaponReserves};
}
/** An approximate catalogue reserve never creates a full battery/material
 * container. Track only a reserve explicitly declared from actual inventory. */
export function configureTruthWeaponReserve(data:any,state:ItemResourceState,input:{sourceId?:unknown;remaining?:unknown},ctx:{inCombat:boolean;manager:boolean}){
 if(ctx.inCombat&&!ctx.manager)throw new Error('truth_reserve_requires_manager');
 if(typeof input.sourceId!=='string'||!truthWeaponProfiles.some(p=>p.sourceId===input.sourceId)||ownedTruth(data,input.sourceId)<1)throw new Error('truth_weapon_unavailable');
 if(!validCount(input.remaining))throw new Error('invalid_truth_reserve');
 const before=state.ammoCount?.[input.sourceId]??null;state.ammoCount={...state.ammoCount,[input.sourceId]:input.remaining};
 return {label:'Réserve réelle d’arme de Vérité',sourceId:input.sourceId,before,after:input.remaining,managerCorrection:ctx.manager};
}
/** Call before launch; return the extra PA to include in the server's complete
 * attack cost. Mutations must roll back if any later validation/roll fails.
 * A regime is persistent. Mode selections are not separate free attacks. The
 * activation key is supplied by the server (combat+activation), never input. */
export function prepareTruthWeaponUse(data:any,state:ItemResourceState,profileId:string,ctx:{inCombat:boolean;activationKey:string;authorizationConfirmed?:boolean;intensiveUse?:boolean;ordinaryPaCost?:number;matterSpent?:unknown}){
 const weapon=truthWeaponProfiles.find(p=>p.id===profileId);if(!weapon||ownedTruth(data,weapon.sourceId)<1)throw new Error('truth_weapon_unavailable');
 if(typeof ctx.activationKey!=='string'||!ctx.activationKey||ctx.activationKey.length>200)throw new Error('truth_weapon_activation_required');
 const rule=modeRules[weapon.sourceId],prior=state.itemResources?.weaponModes?.[weapon.sourceId]??rule?.modes[0],changed=!!rule&&prior!==weapon.mode;
 if(rule&&(!weapon.mode||!rule.modes.includes(weapon.mode)))throw new Error('truth_weapon_mode_unavailable');
 if(rule?.locked&&ctx.authorizationConfirmed!==true)throw new Error('truth_weapon_authorization_required');
 if(changed&&rule.oncePerActivation&&state.itemResources?.modeChanged?.[weapon.sourceId]===ctx.activationKey)throw new Error('truth_weapon_mode_quota');
 const intensive=weapon.sourceId==='verite-26-helios-pr-8'&&ctx.intensiveUse===true;
 if(intensive&&state.itemResources?.cooling?.[weapon.sourceId]===ctx.activationKey)throw new Error('truth_weapon_cooling');
 const additionalPaCost=changed&&ctx.inCombat?rule!.cost:0;
 if(ctx.inCombat&&(state.unconscious||state.hp!==undefined&&state.hp!==null&&state.hp<=0||state.initiative==null||(state.pa??0)<(ctx.ordinaryPaCost??1)+additionalPaCost))throw new Error('insufficient_pa');
 const reserve=state.ammoCount?.[weapon.sourceId],knownCost=weapon.sourceId==='verite-26-duplex-ar-12'?weapon.mode==='dispersion'?3:1:weapon.sourceId==='verite-26-custodian-ar-9'&&weapon.mode==='perforant'?null:1;
 const matterSpent=ctx.matterSpent??knownCost;
 if(reserve!==undefined){
  if(!validCount(reserve))throw new Error('invalid_truth_reserve');
  if(matterSpent===null)throw new Error('truth_matter_usage_required');
  if(!validCount(matterSpent)||matterSpent<1||knownCost!==null&&matterSpent!==knownCost||knownCost===null&&matterSpent<=1)throw new Error('invalid_truth_matter_usage');
  if(matterSpent>reserve)throw new Error('insufficient_truth_reserve');
 }
 if(changed){resources(state).weaponModes={...state.itemResources?.weaponModes,[weapon.sourceId]:weapon.mode!};if(rule.oncePerActivation)resources(state).modeChanged={...state.itemResources?.modeChanged,[weapon.sourceId]:ctx.activationKey};}
 if(intensive)resources(state).cooling={...state.itemResources?.cooling,[weapon.sourceId]:ctx.activationKey};
 if(reserve!==undefined)state.ammoCount={...state.ammoCount,[weapon.sourceId]:reserve-Number(matterSpent)};
 return {additionalPaCost,sourceId:weapon.sourceId,mode:weapon.mode??null,modeChanged:changed,previousMode:prior??null,intensiveUse:intensive,mattersSpent:matterSpent,reserveTracked:reserve!==undefined,reserveBefore:reserve??null,reserveAfter:reserve===undefined?null:reserve-Number(matterSpent)};
}
