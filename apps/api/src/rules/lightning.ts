import {truthPowers,powerAllowed} from './play-truth.js';
const prefix='aseryn_dratyn_la_maitresse_de_la_foudre_talents_communs_de_dratyn_';
export const lightningIds={conduction:prefix+'conduction',foudre:prefix+'foudre_aseryne',paratonnerre:prefix+'paratonnerre'};
/** Explicit prerequisite chain: the imported prerequisiteName is not an owned talent ID. */
export function lightningAccess(data:any,state:any){
 const powers=truthPowers(data),known=(id:string)=>powers.find(p=>p.id===id),allowed=(id:string)=>{const p=known(id);return !!p&&powerAllowed(p,state.revelation);};
 const prerequisites=!!known(lightningIds.conduction)&&!!known(lightningIds.foudre);
 return {foudre:prerequisites&&allowed(lightningIds.foudre),paratonnerre:prerequisites&&allowed(lightningIds.paratonnerre),paratonnerreUsed:(state.powerUses?.['round:'+lightningIds.paratonnerre]??0)>0};
}
export function lightningAttack(data:any,state:any){
 return lightningAccess(data,state).foudre?{id:lightningIds.foudre,label:'Foudre aseryne',group:'Foudre',damage:7,penetration:0,attackMode:'foudre' as const,damageType:'electricite',skill:'maitrise_spirituelle',range:20,condition:'Cible réellement à portée (20 m maximum) ; trajectoire de Foudre possible.'}:null;
}
export function lightningRange(input:any){
 if(input.contextConfirmed!==true||typeof input.distance!=='number'||!Number.isFinite(input.distance)||input.distance<0||input.distance>20)throw new Error('foudre_range_required');
}
export function paratonnerreTest(total:number,narrativeFailure:boolean,attackTotal:number){return !narrativeFailure&&total>=attackTotal;}
