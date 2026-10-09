export type AttackMode='melee'|'ranged'|'fixed'|'margin'|'foudre';
/** Tir: weapon damage, an alteration at margin 6, doubled weapon damage at 11.
 * Damage type selects protection; it does not select the attack formula (e.g. a taser).
 */
export function damageCalculation(a:{total:number;damage:number;bonusDamage:number;penetration:number;narrativeFailure?:boolean;attackMode?:AttackMode;damageType?:string},defense:number,armor:number,reduction:number){
 const margin=Math.max(0,a.total-defense),hit=!a.narrativeFailure&&margin>0,material=a.attackMode==='foudre'?0:Math.max(0,armor-a.penetration);
 const attackMode=a.attackMode??(a.damageType==='balistique'?'ranged':'melee');
 const multiplier=attackMode==='ranged'&&margin>=11?2:1,marginDamage=['melee','margin','foudre'].includes(attackMode)?margin:0;
 return {hit,margin,attackMode,multiplier,marginDamage,alteration:hit&&attackMode==='ranged'&&margin>=6,defense,armor,penetration:a.penetration,material,reduction,weaponDamage:a.damage,bonusDamage:a.bonusDamage,damage:hit?Math.max(0,marginDamage+multiplier*a.damage+a.bonusDamage-material-reduction):0};
}
export function weaponMechanics(w:{range:string;properties:string}){
 return {attackMode:w.range==='Contact'?'melee' as const:'ranged' as const,penetration:Number(/Perforant\s+(\d+)/i.exec(w.properties)?.[1]??0),damageType:/[ée]lectri/i.test(w.properties)?'electricite':/occulte/i.test(w.properties)?'occulte':w.range==='Contact'?'melee':'balistique'};
}
