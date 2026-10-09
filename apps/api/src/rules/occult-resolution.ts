import {validateEffectDraft,type LiveEffectDraft,type EffectDuration} from './live-effects.js';
export const occultPowerIds={
 injunction:'belial_la_reine_des_dieux_facette_domination_injonction_souveraine',
 decree:'belial_la_reine_des_dieux_facette_domination_decret_royal',
 sovereignty:'belial_la_reine_des_dieux_facette_domination_souverainete_de_belial',
 phantasm:'daemon_clean_oracle_tentateur_fantasmagorie_fantasmagorie'
} as const;
const ints=(n:unknown,min:number,max:number)=>Number.isSafeInteger(n)&&Number(n)>=min&&Number(n)<=max;
export function occultSourceKind(kind:string){return ['nature-mage-release','nature-daemon-spectrum-release','nature-power-release','power'].includes(kind);}
export function occultRollSkill(powerId?:string){return powerId&&([occultPowerIds.injunction,occultPowerIds.decree,occultPowerIds.sovereignty] as string[]).includes(powerId)?'autorite':'maitrise_spirituelle';}
export function occultDamage(total:number,defense:number,amplitude:number,protection:number,narrativeFailure=false){
 if(![total,defense,amplitude,protection].every(Number.isFinite)||!ints(amplitude,0,100)||!ints(protection,0,1000))throw new Error('invalid_occult_damage');
 const hit=!narrativeFailure&&total>defense,margin=hit?total-defense:0;
 return {hit,margin,amplitude,protection,damage:hit?Math.max(0,margin+amplitude-protection):0};
}
/** A table ruling has one principal function, never an unpriced bundle of damage and modifiers. */
export function occultEffectDrafts(input:any,ctx:{sourceId:string;targetId:string;ruleId:string;maintained:boolean}):LiveEffectDraft[]{
 if(!Array.isArray(input)||input.length!==1)throw new Error('occult_one_function_required');
 return input.map((raw:any)=>{
  const draft={...raw,sourceId:ctx.sourceId,targetId:ctx.targetId,ruleId:ctx.ruleId,stackKey:'occult:'+ctx.ruleId+':'+ctx.sourceId,stackMode:'exclusive'};
  if(!validateEffectDraft(draft)||!['modifier','condition'].includes(draft.kind)||!['round','scene'].includes(draft.duration.unit)||draft.duration.unit==='round'&&(draft.duration.value<1||draft.duration.value>100)||draft.startDelay||draft.period)throw new Error('invalid_occult_effect');
  if(ctx.maintained)draft.duration={unit:'round',value:1};
  return draft;
 });
}
/** Exact canonical conditions; their narrative execution remains the table's decision. */
export function occultCondition(powerId:string,note:string,sourceId:string,targetId:string,duration?:EffectDuration):LiveEffectDraft|null{
 if(!note.trim()||note.length>500)throw new Error('occult_ruling_required');
 const names:Record<string,string>={[occultPowerIds.injunction]:'Injonction souveraine',[occultPowerIds.decree]:'Décret royal',[occultPowerIds.sovereignty]:'Injonction souveraine',[occultPowerIds.phantasm]:'Fantasmagorie'};
 const name=names[powerId];if(!name)return null;
 if(powerId===occultPowerIds.phantasm&&(!duration||!['round','scene'].includes(duration.unit)||duration.unit==='round'&&!ints(duration.value,1,100)))throw new Error('occult_duration_required');
 return {name:(name+' · '+note).slice(0,150),sourceId,targetId,ruleId:powerId,kind:'condition',scope:'condition',amount:0,stackKey:'occult:'+powerId+':'+sourceId,stackMode:'exclusive',duration:powerId===occultPowerIds.phantasm?duration!:powerId===occultPowerIds.injunction||powerId===occultPowerIds.sovereignty?{unit:'activation',value:1}:{unit:'scene'}};
}
