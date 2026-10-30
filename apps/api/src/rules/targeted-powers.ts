import {truthPowers,powerAllowed} from './play-truth.js';
const hasPower=(data:any,state:any,id:string)=>truthPowers(data).some(p=>p.id===id&&powerAllowed(p,state.revelation));
export const targetedPowerIds=['exile-suture','exile-refection-vitale','exile-rune-de-garde'] as const;
export const targetedRules=[
 {id:'exile-suture',name:'Suture',cost:1,context:'Au contact d’une créature vivante ; la blessure peut être stabilisée par des soins physiques ordinaires.'},
 {id:'exile-refection-vitale',name:'Réfection vitale',cost:1,context:'Au contact ; les blessures sont régénérables. Difficulté 18, soin de 4 + DR, une réussite par bénéficiaire et scénario.'},
 {id:'exile-rune-de-garde',name:'Rune de Garde',cost:0,context:'Dix minutes d’inscription achevées, sur un support réellement porté par le bénéficiaire. Une rune active par runiste ; une protection par bénéficiaire et scénario.'}
] as const;
export function targetedOptions(data:any,state:any){
 const owned=truthPowers(data);
 return targetedRules.filter(r=>owned.some(p=>p.id===r.id&&powerAllowed(p,state.revelation)));
}
export function targetUsageKey(id:string){return 'scenario:received:'+id;}
export function healingTest(total:number,narrativeFailure:boolean){
 const margin=total-18,success=!narrativeFailure&&margin>=0,dr=success?Math.min(5,Math.floor(margin/3)):0;
 return {success,difficulty:18,margin,dr,healing:success?4+dr:0};
}
export const interpositionRules=[
 {id:'trait:gardien-de-la-meute',name:'Gardien de la Meute',kind:'redirect',limit:null,range:'movement'},
 {id:'aseryn_traditions_des_treize_caendis_le_protecteur_interposition',name:'Interposition de Caendis',kind:'redirect',limit:null,range:2},
 {id:'extral-interposition-doctrinale',name:'Interposition doctrinale',kind:'defense',limit:'round',range:null}
] as const;
export function interpositionOptions(data:any,state:any){
 const powers=truthPowers(data);
 return interpositionRules.filter(r=>powers.some(p=>p.id===r.id&&powerAllowed(p,state.revelation))).map(r=>({...r,cost:1,used:!!r.limit&&(state.powerUses?.[r.limit+':'+r.id]??0)>0}));
}
export function interpositionCheck(rule:any,actor:any,attack:any,input:any){
 if(attack.narrativeFailure||attack.surprise||actor.hp<=0||actor.state?.unconscious||actor.state?.muePending||actor.initiative===null||actor.pa<1||rule.used)throw new Error('reaction_unavailable');
 if(input.contextConfirmed!==true||input.allyConfirmed!==true)throw new Error('reaction_context_required');
 if(typeof input.distance!=='number'||!Number.isFinite(input.distance)||input.distance<0||input.distance>10000)throw new Error('invalid_reaction_distance');
 if(rule.kind==='redirect'&&['neuro','occulte'].includes(attack.damageType))throw new Error('reaction_physical_only');
 if(rule.range==='movement'&&input.distance>=actor.movement||typeof rule.range==='number'&&input.distance>rule.range)throw new Error('reaction_out_of_range');
 // AIDH has a fiction-defined proximity, not an invented numerical reach.
 if(rule.range===null&&input.nearbyConfirmed!==true)throw new Error('reaction_context_required');
}
export function guardianBonus(data:any,state:any,targetId:string){
 const bonus=state.targeted?.guardian;
 return bonus&&bonus.targetId===targetId&&state.round<=bonus.until&&hasPower(data,state,'riposte_du_gardien')?3:0;
}
export function ashornAvailable(data:any,state:any,attack:any,defense:any){
 return hasPower(data,state,'exile-riposte-d-ashorn')&&!(state.powerUses?.['scene:exile-riposte-d-ashorn']>0)&&attack.attackMode==='melee'&&!['neuro','occulte'].includes(attack.damageType)&&!attack.narrativeFailure&&defense?.active===true&&!defense.narrativeFailure&&defense.total>=attack.total;
}
/** A rune applies to the first actual supernatural hit, even if other reduction already cancels its damage. */
export function consumeGuard(state:any,hit:boolean,supernatural:boolean){
 if(!state.targeted?.guard||!hit||!supernatural)return 0;
 state.targeted={...state.targeted};delete state.targeted.guard;return 6;
}
