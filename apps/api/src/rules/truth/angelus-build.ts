// Persisted choices describe abilities. They never approve a GM action or activate a power.
export const angelusTalentIds={
 cherub:'progression_de_transcendance_transcendance_cherubique',
 reserve:'nature_commune_pouvoirs_angeliques_talents_communs_reserve_transcendee',
 liaison:'nature_commune_pouvoirs_angeliques_talents_communs_porte_du_paradis',
 sin:'nature_vertu_chatiment_capital',
 construct:'les_dix_sephiroth_yessod_la_fondation_facette_imagination_reve_rendu_reel',
 shape:'les_dix_sephiroth_yessod_la_fondation_facette_imagination_idee_incarnee'
} as const;
export const angelusNatures=[{id:'trone',name:'Trône'},{id:'vertu',name:'Vertu'},{id:'domination',name:'Domination'}] as const;
export const angelusSins=[
 {id:'colere',name:'Colère',effect:'+3 aux attaques physiques, +2 DGT, −3 Défense occulte.'},
 {id:'orgueil',name:'Orgueil',effect:'+3 à la Compétence sociale contextuelle et aux résistances à l’intimidation ; impossible de bénéficier d’Assistance.'},
 {id:'luxure',name:'Luxure',effect:'+3 aux interactions fondées sur désir/charme et +3 pour lire le désir ; −3 contre distractions affectives.'},
 {id:'envie',name:'Envie',effect:'+2 dans une Compétence réellement observée chez une cible, sans transfert de talent, connaissance secrète ou prérequis biologique.'},
 {id:'avarice',name:'Avarice',effect:'+3 pour acquérir, conserver, protéger ou arracher un objet/ressource clairement désiré ; −3 pour l’abandonner volontairement.'},
 {id:'gourmandise',name:'Gourmandise',effect:'Première mise hors combat significative ou consommation d’une ressource importante : récupérer 3 PV ou 2 Aura si Angelus. Les 3 PV comptent pour la Saturation.'},
 {id:'paresse',name:'Paresse',effect:'Si le bénéficiaire ne se Déplace pas pendant son round : +3 Défense physique et occulte jusqu’au prochain round ; son Déplacement est divisé par deux.'}
] as const;
export const angelusConstructKinds=[{id:'carrier',name:'Porteur',effect:'Charge jusqu’à 200 kg ; aucune action autonome.'},{id:'manipulator',name:'Manipulateur simple',effect:'Une tâche déterminée ; Compétence pertinente du créateur pour les actions incertaines.'},{id:'bulwark',name:'Rempart mobile',effect:'Un obstacle matériel mobile ; ni invulnérabilité ni PA indépendants.'}] as const;
export type AngelusConstruct={name:string;kind:string;purpose:string;limits:string};
export type AngelusBuild={secondaryNature:string;transcendenceEvent:string;preferredSin:string;observedSkill:string;bladeForm:string;bladeSacrifice:number;liaisonContact:string;heartLink:string;shapeDescription:string;construct:AngelusConstruct};
const record=(v:unknown):Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const text=(v:unknown,max=400)=>typeof v==='string'?v.replace(/\u0000/g,'').slice(0,max):'';
const choice=(value:unknown,rows:readonly {id:string}[])=>rows.some(r=>r.id===value)?String(value):'';
export function normalizeAngelusBuild(value:unknown):AngelusBuild{
 const r=record(value),c=record(r.construct);
 return {secondaryNature:choice(r.secondaryNature,angelusNatures),transcendenceEvent:text(r.transcendenceEvent,800),preferredSin:choice(r.preferredSin,angelusSins),observedSkill:text(r.observedSkill,100),bladeForm:r.bladeForm==='ranged'?'ranged':'melee',bladeSacrifice:r.bladeSacrifice===2?2:r.bladeSacrifice===3?3:1,liaisonContact:text(r.liaisonContact),heartLink:text(r.heartLink),shapeDescription:text(r.shapeDescription,800),construct:{name:text(c.name,160),kind:choice(c.kind,angelusConstructKinds),purpose:text(c.purpose,1000),limits:text(c.limits,1000)}};
}
export function angelusConstructIssues(c:AngelusConstruct):string[]{
 return [!c.name.trim()?'Nommez l’auxiliaire.':'',!c.kind?'Choisissez sa fonction.':'',!c.purpose.trim()?'Décrivez sa tâche unique.':'',!c.limits.trim()?'Précisez les limites convenues avec le MJ.':''].filter(Boolean);
}
/** Permanent maximum only: never fills, resets or persists a current Aura reserve. */
export function angelusAuraCapacity(talents:readonly string[],permanentFortitude:number){
 const rankBonus=talents.includes(angelusTalentIds.cherub)?2:0;
 const fortitude=Number.isFinite(permanentFortitude)?Math.max(0,Math.trunc(permanentFortitude)):0;
 return {rank:rankBonus?'cherub':'angelus',maximum:Math.min(8+rankBonus,3+fortitude+rankBonus)+(talents.includes(angelusTalentIds.reserve)?2:0)};
}
