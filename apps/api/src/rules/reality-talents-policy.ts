/** Arithmetic for the approved fictional RPG talents; no network or persistence. */
export function finiteMoney(value:unknown):number {
  const n=Number(value);
  return Number.isFinite(n)?Math.max(0,n):0;
}
export function purchaseWithTalents(reference:number,negotiatedRate:number,troc:boolean,supplier:boolean):number {
  const rate=Number.isFinite(negotiatedRate)?negotiatedRate:1;
  return Math.round(finiteMoney(reference)*Math.max(0,rate-(troc?.05:0)-(supplier?.10:0)));
}
export function saleWithTalents(catalogue:number,negotiatedRate:number,troc:boolean):number {
  const reference=finiteMoney(catalogue),rate=Number.isFinite(negotiatedRate)?negotiatedRate:.5;
  // Existing Commerce rates use catalogue value. The talent adds five percent
  // of the ordinary buyback reference (50% of catalogue), not retail value.
  return Math.round(reference*Math.max(0,rate)+(troc?reference*.5*.05:0));
}
export function dailyRecovery(constitution:number,prolongedCare:boolean,ironHealth:boolean):number {
  return Math.max(1,Math.trunc(finiteMoney(constitution)))*(prolongedCare?2:1)+(ironHealth?2:0);
}
export function injuryStress(pv:number,maximum:number,insensitive:boolean):0|1|2 {
  if(maximum<=0||pv<=0)return 2;
  const raw=pv<=maximum*.25?2:pv<=maximum*.5?1:0;
  return Math.max(0,raw-(insensitive?1:0)) as 0|1|2;
}
export function omertaBonus(family:boolean,organization:boolean,familyApplies:boolean,organizationApplies:boolean):number {
  return (family&&familyApplies?2:0)+(organization&&organizationApplies?2:0);
}
export const loanBudgets:Record<string,number>={dotation_standard:5000,dotation_de_service:5000,armurier_du_milieu:5000};
export const nonResalableLoanIds=new Set([...Object.keys(loanBudgets),"programme_pilote"]);
