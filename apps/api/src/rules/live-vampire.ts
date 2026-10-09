import {supernaturalHealingMaximum,lightningAutomaticSurvivalAllowed} from './lightning-wounds.js';
import type {PlayState} from './play-state.js';
import {truthCoreRules} from './truth/core-rules.js';
import {liveTruthState} from './play-truth.js';
import type {TruthTalent} from './truth/types.js';

/** Protected session state. Client save requests must never replace this object. */
export type VampireLiveState={
 stasis:boolean;fedThisScene:boolean;cycleUntilRound:number|null;exaltedBlood:boolean;
 bloodWeapon:'lame'|'fouet'|'projectile'|null;animalForm:string|null;
 anchor:boolean;
 suppressedWeakness:{id:string;source:string;mode:'ignore'|'half';untilRound:number|null}|null;
};
export type VampireState=PlayState&{vampire?:VampireLiveState};
export const blankVampireState=():VampireLiveState=>({stasis:false,fedThisScene:false,cycleUntilRound:null,exaltedBlood:false,bloodWeapon:null,animalForm:null,anchor:false,suppressedWeakness:null});
export const vampireState=(state:VampireState):VampireLiveState=>({...blankVampireState(),...state.vampire});
const copy=(state:VampireState):VampireState=>({...state,powerUses:{...state.powerUses},vampire:{...vampireState(state)}});
const usage=(state:PlayState,period:string,id:string)=>(state.powerUses?.[period+':'+id]??0)>0;
const consume=(state:PlayState,period:string,id:string)=>{state.powerUses??={};state.powerUses[period+':'+id]=(state.powerUses[period+':'+id]??0)+1;};
const vampire=(data:any,state:PlayState)=>data.truth?.nature==='vampire'&&data.truth?.consciousness==='initie'&&state.revelation==='r';
const catalog=truthCoreRules.catalogs.vampire as unknown as readonly TruthTalent[];
export function vampireTalent(data:any,state:PlayState,id:string){
 const t=liveTruthState(data),row=catalog.find(p=>p.id===id);
 if(t.nature!=='vampire'||t.consciousness!=='initie'||!row||!t.truthTalents.includes(id))return false;
 const prerequisite=row.prerequisite;
 if(prerequisite&&prerequisite!=='echo_des_morts'&&!t.truthTalents.includes(prerequisite))return false;
 if(prerequisite==='echo_des_morts'&&t.choices.court!=='alghul_almalakiu')return false;
 // All saved acquisitions are usable; selecting a second Sang during progression is legal.
 return row.access==='SR'?state.revelation!=='v':state.revelation==='r';
}
export function vampireStatus(data:any,state:VampireState){
 const v=vampireState(state),available=vampire(data,state);
 return {available,stasis:v.stasis,stasisRate:available?(vampireTalent(data,state,'stase_profonde')?2:1):0,
  lastSleep:vampireTalent(data,state,'dernier_sommeil'),lastSleepUsed:usage(state,'scenario','dernier_sommeil'),
  surregime:vampireTalent(data,state,'surregime'),surregimeUsed:usage(state,'scene','surregime'),
  cycle:available&&data.truth?.choices?.court==='ihuito_meztzi',cycleReady:v.cycleUntilRound!==null&&v.cycleUntilRound>=state.round,
  exaltedBlood:v.exaltedBlood,bloodWeapon:v.bloodWeapon,animalForm:v.animalForm,anchor:v.anchor,
  fedThisScene:v.fedThisScene,suppressedWeakness:v.suppressedWeakness};
}
export type VampireAction=
 |{action:'vampire-stasis';active:boolean}
 |{action:'vampire-stasis-recovery';hours:number;regenerable:boolean}
 |{action:'vampire-surregime'}
 |{action:'vampire-cycle'}
 |{action:'vampire-yang';weakness:string}
 |{action:'vampire-union';weakness:string}
 |{action:'vampire-anchor';hours:number}
 |{action:'vampire-anchor-destroy'}
 |{action:'vampire-anchor-restore';hours:number;bodyRepairable:boolean;practitioner:boolean};
export type VampireContext={maximum:number;death:number;inCombat:boolean;participating?:boolean;manager?:boolean};
export type VampireResult={state:VampireState;payload:Record<string,unknown>}|{error:string};
const failed=(error:string):VampireResult=>({error});
function actionCost(state:VampireState,cost:number,ctx:VampireContext):string|null{
 if(!ctx.inCombat)return null;
 if(state.initiative===null)return 'initiative_required';
 if(ctx.participating===false)return 'out_of_combat';
 if(state.pa<cost)return 'not_enough_pa';
 state.pa-=cost;return null;
}
/** Deterministic action handler; campaign lock/version/idempotency belong to its caller. */
export function applyVampireAction(data:any,original:VampireState,action:VampireAction,ctx:VampireContext):VampireResult{
 const state=copy(original),v=state.vampire!,hp=state.hp??ctx.maximum;
 if(!vampire(data,state))return failed('vampire_revelation_required');
 if(action.action==='vampire-anchor-destroy'){
  if(!ctx.manager)return failed('mj_only');if(!v.anchor)return failed('no_anchor');v.anchor=false;
  return {state,payload:{label:'Ancrage sanguin détruit',anchor:false}};
 }
 if(action.action==='vampire-anchor-restore'){
  if(!ctx.manager)return failed('mj_only');if(ctx.inCombat)return failed('finish_combat_first');
  if(!lightningAutomaticSurvivalAllowed(state))return failed('foudre_final_destruction');
  if(!v.anchor||hp>ctx.death)return failed('no_death_anchor');
  if(action.hours<24||!Number.isSafeInteger(action.hours)||action.bodyRepairable!==true||action.practitioner!==true)return failed('ritual_conditions_required');
  v.anchor=false;v.stasis=true;state.hp=1;state.stabilized=true;state.unconscious=true;state.pa=0;
  return {state,payload:{label:'Restauration Alghul · ancrage consommé',hours:action.hours,hpBefore:hp,hpAfter:1,stasis:true}};
 }
 if(hp<=ctx.death)return failed('character_dead');
 if(action.action==='vampire-stasis'){
  if(typeof action.active!=='boolean')return failed('invalid_action');
  if(action.active===v.stasis)return failed('already_applied');
  if(action.active&&(state.unconscious||hp<=0))return failed('cannot_act');
  if(!action.active&&hp<=0)return failed('cannot_leave_stasis');
  const cost=action.active?2:1,error=actionCost(state,cost,ctx);if(error)return failed(error);
  v.stasis=action.active;state.unconscious=action.active;state.stabilized=action.active||state.stabilized;
  return {state,payload:{label:action.active?'Entrée en Stase':'Sortie de Stase',stasis:v.stasis,paCost:ctx.inCombat?cost:0}};
 }
 if(action.action==='vampire-stasis-recovery'){
  if(ctx.inCombat||state.initiative!==null)return failed('finish_combat_first');
  if(!v.stasis)return failed('stasis_required');
  if(!Number.isSafeInteger(action.hours)||action.hours<1||action.hours>8760||action.regenerable!==true)return failed('regenerable_hours_required');
  const rate=vampireStatus(data,state).stasisRate,maximum=supernaturalHealingMaximum(state,vampireMaximum(ctx.maximum,state),hp);
  state.hp=Math.min(maximum,hp+rate*action.hours);state.stabilized=true;
  return {state,payload:{label:'Récupération en Stase',hours:action.hours,rate,recovered:state.hp-hp,hpBefore:hp,hpAfter:state.hp}};
 }
 if(v.stasis||state.unconscious||hp<=0)return failed('cannot_act');
 if(action.action==='vampire-surregime'){
  if(!vampireTalent(data,state,'surregime'))return failed('power_unavailable');
  if(!ctx.inCombat||state.initiative===null)return failed('combat_required');
  if(ctx.participating===false)return failed('out_of_combat');
  if(usage(state,'scene','surregime'))return failed('power_already_used');
  consume(state,'scene','surregime');state.pa+=1;
  return {state,payload:{label:'Surrégime',paGained:1,pa:state.pa,powerId:'surregime'}};
 }
 if(action.action==='vampire-cycle'){
  if(data.truth?.choices?.court!=='ihuito_meztzi'||!v.fedThisScene)return failed('predation_required');
  if(usage(state,'scene','trait:cycle-du-sang'))return failed('power_already_used');
  if(!ctx.inCombat||state.initiative===null)return failed('combat_required');
  consume(state,'scene','trait:cycle-du-sang');v.cycleUntilRound=state.round;
  return {state,payload:{label:'Cycle du Sang · prochain talent de Sang −1 PA',untilRound:state.round,powerId:'trait:cycle-du-sang'}};
 }
 if(action.action==='vampire-yang'||action.action==='vampire-union'){
  const id=action.action==='vampire-yang'?'souffle_du_yang':'union_du_hun_et_du_po',period=id==='souffle_du_yang'?'scene':'scenario';
  if(!vampireTalent(data,state,id))return failed('power_unavailable');if(!v.fedThisScene)return failed('predation_required');
  if(usage(state,period,id))return failed('power_already_used');
  if(typeof action.weakness!=='string'||!action.weakness.trim()||action.weakness.length>120)return failed('invalid_weakness');
  const error=actionCost(state,1,ctx);if(error)return failed(error);
  consume(state,period,id);
  const harmony=id==='souffle_du_yang'&&vampireTalent(data,state,'harmonie_impossible');
  v.suppressedWeakness={id:action.weakness.trim(),source:id,mode:harmony?'half':'ignore',untilRound:id==='souffle_du_yang'&&!harmony?state.round+1:null};
  return {state,payload:{label:id==='souffle_du_yang'?'Souffle du Yang':'Union du Hun et du Po',...v.suppressedWeakness,paCost:ctx.inCombat?1:0,powerId:id}};
 }
 if(action.action==='vampire-anchor'){
  if(!vampireTalent(data,state,'sang_preserve'))return failed('power_unavailable');
  if(ctx.inCombat)return failed('finish_combat_first');if(v.anchor)return failed('anchor_exists');
  if(!Number.isSafeInteger(action.hours)||action.hours<1||action.hours>8760)return failed('ritual_conditions_required');
  state.hp=hp-3;v.anchor=true;
  return {state,payload:{label:'Sang préservé · ancrage préparé',sacrifice:3,hpBefore:hp,hpAfter:state.hp,hours:action.hours}};
 }
 return failed('invalid_action');
}
/** Reserved anchor vitality reduces the healing ceiling, not the permanent PV statistic. */
export function vampireMaximum(maximum:number,state:VampireState){return Math.max(1,maximum-(vampireState(state).anchor?3:0));}

export type PredationResult={actualLoss:number;dr:number;success:boolean;exalt?:boolean;source?:'blood'|'drain'};
/** Call only with the committed target damage result; never trust submitted actualLoss/DR. */
export function applyVampirePredation(data:any,original:VampireState,result:PredationResult,maximum:number):VampireResult{
 const state=copy(original),v=state.vampire!,hp=state.hp??maximum;
 if(!vampire(data,state)||v.stasis||state.unconscious||hp<=0)return failed('cannot_predate');
 if(!Number.isSafeInteger(result.actualLoss)||result.actualLoss<0||!Number.isSafeInteger(result.dr)||result.dr<0||result.dr>5)return failed('invalid_predation');
 if(!result.success||result.actualLoss===0)return {state,payload:{label:'Prédation sans vitalité prélevée',recovered:0,actualLoss:result.actualLoss,dr:result.dr}};
 const base=result.source!=='drain'&&vampireTalent(data,state,'regeneration_de_sang')?2:1;
 const possible=Math.min(base+result.dr,result.actualLoss,Math.max(0,supernaturalHealingMaximum(state,vampireMaximum(maximum,state),hp)-hp));
 if(result.exalt){
  if(!vampireTalent(data,state,'sang_exalte'))return failed('power_unavailable');
  if(v.exaltedBlood)return failed('exalted_blood_already_pending');
  if(possible<2)return failed('not_enough_actual_healing');v.exaltedBlood=true;
 }
 const recovered=possible-(result.exalt?2:0);state.hp=hp+recovered;v.fedThisScene=true;
 return {state,payload:{label:'Prédation sanguine',actualLoss:result.actualLoss,dr:result.dr,recovered,sangExalte:result.exalt===true,healingForfeited:result.exalt?2:0,hpBefore:hp,hpAfter:state.hp}};
}
/** Explicit lethal-wound reaction; bodies annihilated/destroyed must pass bodySurvivable=false. */
export function applyVampireLastSleep(data:any,original:VampireState,after:number,death:number,bodySurvivable:boolean):VampireResult{
 const state=copy(original),before=state.hp;state.hp=after;
 if(before===null)return failed('resolved_hp_required');
 if(!lightningAutomaticSurvivalAllowed(state)||before<=death||after>death||!bodySurvivable||!vampireTalent(data,state,'dernier_sommeil')||usage(state,'scenario','dernier_sommeil'))return {state,payload:{saved:false,hpAfter:after}};
 consume(state,'scenario','dernier_sommeil');state.hp=death+1;state.pa=0;state.stabilized=true;state.unconscious=true;state.vampire!.stasis=true;
 return {state,payload:{label:'Dernier sommeil · Stase de survie',saved:true,hpBefore:before,hpAfter:state.hp,powerId:'dernier_sommeil'}};
}

/** Fixed, audited activation data. Modifiers/passives are not independent activations. */
export const vampirePowerRules:Record<string,{cost:number;maintenance?:number;limit?:'round'|'scene'|'scenario';route:'assisted'|'passive'|'modifier'|'defense'|'vampire'}>={
 faveur_de_la_nuit:{cost:0,route:'passive'},sens_du_chasseur:{cost:0,route:'passive'},regeneration_de_sang:{cost:0,route:'passive'},insensibilite_amelioree:{cost:0,route:'passive'},
 charme_inhumain:{cost:0,route:'modifier'},domination:{cost:1,route:'assisted'},somnambulisme:{cost:2,route:'assisted'},stase_profonde:{cost:0,route:'passive'},dernier_sommeil:{cost:0,limit:'scenario',route:'vampire'},
 presence_du_conquerant:{cost:1,route:'assisted'},ordre_imperieux:{cost:1,route:'assisted'},maitre_de_guerre:{cost:0,limit:'round',route:'assisted'},
 sang_memoriel:{cost:1,route:'assisted'},interroger_les_restes:{cost:0,route:'assisted'},sang_preserve:{cost:0,route:'vampire'},
 marche_dans_les_ombres:{cost:0,route:'modifier'},ombre_predatrice:{cost:0,route:'modifier'},lien_du_deimon:{cost:0,route:'assisted'},
 sang_exalte:{cost:0,route:'vampire'},offrande_sanglante:{cost:0,route:'vampire'},sang_du_dieu:{cost:0,limit:'scenario',route:'assisted'},
 souffle_du_yang:{cost:1,limit:'scene',route:'vampire'},harmonie_impossible:{cost:0,route:'modifier'},union_du_hun_et_du_po:{cost:1,limit:'scenario',route:'vampire'},
 vision_du_sang:{cost:0,route:'passive'},traque_hematique:{cost:0,route:'assisted'},deferlement_ecarlate:{cost:0,limit:'round',route:'assisted'},surregime:{cost:0,limit:'scene',route:'vampire'},
 forme_animale:{cost:1,route:'vampire'},menagerie:{cost:0,route:'modifier'},corps_de_brume:{cost:1,route:'defense'},brume_etouffante:{cost:2,maintenance:1,route:'assisted'},
 double_tenebreux:{cost:1,maintenance:1,route:'assisted'},double_autonome:{cost:1,route:'assisted'},fantasmagorie:{cost:1,maintenance:1,route:'assisted'},grande_illusion:{cost:2,maintenance:1,route:'assisted'},
 vision_thermique:{cost:0,route:'passive'},venin_noir:{cost:1,route:'assisted'},venins_faconnes:{cost:0,route:'modifier'},effluves_toxiques:{cost:2,maintenance:1,route:'assisted'},
 visage_vole:{cost:1,route:'assisted'},voix_volee:{cost:0,route:'assisted'},mue_complete:{cost:0,route:'modifier'},mimetisme_parfait:{cost:0,route:'passive'},
 echolocation:{cost:0,route:'passive'},sonar_predateur:{cost:0,route:'passive'},vision_astrale:{cost:0,route:'assisted'},projection_astrale:{cost:2,maintenance:1,route:'assisted'},
 diagnostic_predateur:{cost:1,route:'assisted'},anatomie_fatale:{cost:0,route:'modifier'},sang_anime:{cost:1,maintenance:1,route:'assisted'},arme_hematique:{cost:0,route:'modifier'},
 toucher_glacial:{cost:1,route:'assisted'},gel_brutal:{cost:2,route:'assisted'},devorer_la_chaleur:{cost:1,maintenance:1,route:'assisted'},hiver_noir:{cost:0,route:'modifier'},
 toucher_ardent:{cost:1,route:'assisted'},marque_incandescente:{cost:0,limit:'round',route:'modifier'},embrasement:{cost:1,route:'assisted'},fournaise:{cost:2,maintenance:1,route:'assisted'},
 decharge_orageuse:{cost:1,route:'assisted'},surcharge_nerveuse:{cost:0,route:'modifier'},brume_electrostatique:{cost:1,maintenance:1,route:'assisted'},arc_orageux:{cost:2,route:'assisted'},
 lecture_superficielle:{cost:1,route:'assisted'},lecture_profonde:{cost:2,route:'assisted'},sang_de_verite:{cost:1,route:'assisted'},dissipation_revelatrice:{cost:1,route:'assisted'},
 faim_condamnee:{cost:1,route:'assisted'},faim_magique:{cost:1,route:'defense'},changement_de_corps:{cost:0,limit:'scenario',route:'assisted'}
};
export const vampireBloodTalent=(id:string)=>catalog.find(p=>p.id===id)?.group?.startsWith('Sang ')??false;
/** Charge only after all other cost reductions; callers execute the resulting ability atomically. */
export function prepareVampireBlood(data:any,original:VampireState,request:{id:string;cost:number;offering?:boolean;test?:boolean},ctx:VampireContext):VampireResult{
 const state=copy(original),v=state.vampire!,hp=state.hp??ctx.maximum;
 if(!vampireBloodTalent(request.id)||!vampireTalent(data,state,request.id))return failed('power_unavailable');
 if(v.stasis||state.unconscious||hp<=0)return failed('cannot_act');
 if(!Number.isSafeInteger(request.cost)||request.cost<0||request.cost>5)return failed('invalid_cost');
 const cycle=v.cycleUntilRound!==null&&v.cycleUntilRound>=state.round;
 let cost=Math.max(0,request.cost-(cycle?1:0));
 if(request.offering){if(!vampireTalent(data,state,'offrande_sanglante'))return failed('power_unavailable');cost=Math.max(0,cost-1);}
 const error=actionCost(state,cost,ctx);if(error)return failed(error);
 if(request.offering)state.hp=hp-2;
 if(cycle)v.cycleUntilRound=null;
 const bonus=request.test&&v.exaltedBlood?3:0;if(bonus)v.exaltedBlood=false;
 return {state,payload:{label:'Activation de Sang',powerId:request.id,paCost:ctx.inCombat?cost:0,listedCost:request.cost,cycleReduction:cycle?1:0,sacrifice:request.offering?2:0,exaltedBonus:bonus,hpBefore:hp,hpAfter:state.hp??hp}};
}
export function vampireDefenseBonus(data:any,state:VampireState,attack:{damageType:string;surprise:boolean}){
 return vampire(data,state)&&!vampireState(state).stasis&&!state.unconscious&&data.truth?.choices?.court==='krovni_rytsari'&&!attack.surprise&&!['occulte','neuro'].includes(attack.damageType)?3:0;
}
export const vampireDefensePower={id:'corps_de_brume',nature:'vampire',name:'Corps de brume',cost:1,bonus:3,surprise:false,limit:null} as const;
export function vampireWeaknessDamage(data:any,state:VampireState,weakness:string,damage:number){
 const s=vampireState(state).suppressedWeakness;
 if(!vampire(data,state)||!s||s.id!==weakness||s.untilRound!==null&&s.untilRound<state.round)return damage;
 return s.mode==='half'?Math.ceil(damage/2):0;
}
/** Scene/scenario boundaries are MJ actions; combat resets must not call this helper. */
export function resetVampirePeriod(original:VampireState):VampireState{
 const state=copy(original),v=state.vampire!;
 v.fedThisScene=false;v.cycleUntilRound=null;v.exaltedBlood=false;v.suppressedWeakness=null;v.bloodWeapon=null;v.animalForm=null;
 return state;
}
export function nextVampireRound(original:VampireState):VampireState{
 const state=copy(original),v=state.vampire!;
 if(v.cycleUntilRound!==null&&v.cycleUntilRound<state.round)v.cycleUntilRound=null;
 if(v.suppressedWeakness?.untilRound!==null&&v.suppressedWeakness&&v.suppressedWeakness.untilRound<state.round)v.suppressedWeakness=null;
 return state;
}
