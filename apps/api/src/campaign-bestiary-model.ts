import {BESTIARY_WEAPONS} from './campaign-bestiary-weapons.js';

export const BESTIARY_DIFFICULTIES=[
 {id:'figurant',name:'Figurant',hint:'Obstacle isolé ou figurant ordinaire.'},
 {id:'standard',name:'Standard',hint:'Rencontre équilibrée selon le nombre et le terrain.'},
 {id:'dangereux',name:'Dangereux',hint:'Adversaire sérieux pour un groupe préparé.'},
 {id:'majeur',name:'Majeur',hint:'Menace centrale de la scène.'},
 {id:'exceptionnel',name:'Exceptionnel',hint:'Créature singulière ; à ajuster pour la table.'}
] as const;
export const BESTIARY_ARCHETYPES=[
 {id:'civil',name:'Civil ou animal ordinaire',realm:'realite'},
 {id:'combattant',name:'Combattant',realm:'realite'},
 {id:'tireur',name:'Tireur',realm:'realite'},
 {id:'drone',name:'Drone ou machine',realm:'realite'},
 {id:'predateur',name:'Prédateur surnaturel',realm:'verite'},
 {id:'spectre',name:'Spectre ou esprit',realm:'verite'},
 {id:'colosse',name:'Colosse',realm:'verite'},
 {id:'occultiste',name:'Entité occulte',realm:'verite'}
] as const;
export const BESTIARY_STAT_KEYS=['movement','actions','initiative','perception','mastery','physicalDefense','occultDefense','pv','armor','attack'] as const;
export type BestiaryStat=typeof BESTIARY_STAT_KEYS[number];
export type BestiaryStats=Record<BestiaryStat,number>;
export type BestiaryWeapon={id:string;name:string;group:string;damage:number;range:string;properties:string};
export type BestiaryAttack={name:string;score:number;damage:number;range:string;properties:string;weaponId:string};
export type BestiaryData={name:string;realm:'realite'|'verite';difficultyId:string;archetypeId:string;description:string;role:string;hook:string;abilities:string[];weaknesses:string[];equipment:string;tags:string[];stats:BestiaryStats;attacks:BestiaryAttack[];source?:'custom'|'generated';image?:string};
export type BestiarySummary={id:string;name:string;realm:string;difficultyId:string;role:string;version:number;archived:boolean;hasImage?:boolean};
export type BestiaryRecord=BestiarySummary&{data:BestiaryData};
export type BestiaryCatalog={difficulties:typeof BESTIARY_DIFFICULTIES;archetypes:typeof BESTIARY_ARCHETYPES;weapons:readonly BestiaryWeapon[];ranges:Record<string,Record<BestiaryStat,{min:number;max:number}>>};
export const BESTIARY_WEAPON_GROUPS=['Aucune',...new Set(BESTIARY_WEAPONS.map(w=>w.group))];
export function bestiaryIssues(value:unknown):string[]{
 const errors:string[]=[];
 if(!value||typeof value!=='object'||Array.isArray(value))return ['Fiche invalide.'];
 const d=value as BestiaryData,text=(s:unknown,max:number)=>typeof s==='string'&&s.length<=max;
 if(!text(d.name,120)||!d.name.trim()||!text(d.description,3000)||!text(d.role,160)||!text(d.hook,2000)||!text(d.equipment,1000))errors.push('Identité, rôle ou description invalide.');
 const archetype=BESTIARY_ARCHETYPES.find(a=>a.id===d.archetypeId);
 if(!archetype||archetype.realm!==d.realm||!BESTIARY_DIFFICULTIES.some(t=>t.id===d.difficultyId))errors.push('Type ou difficulté inconnu.');
 if(!d.stats||typeof d.stats!=='object'||Array.isArray(d.stats)||Object.keys(d.stats).length!==BESTIARY_STAT_KEYS.length||BESTIARY_STAT_KEYS.some(k=>!Number.isSafeInteger(d.stats[k])||d.stats[k]<(k==='armor'?0:1)||d.stats[k]>(k==='pv'?500:k==='armor'?30:k==='actions'?8:k==='movement'?60:50)))errors.push('Bloc de statistiques incomplet ou hors limites.');
 if(!Array.isArray(d.attacks)||d.attacks.length>3||d.attacks.some(a=>!a||!text(a.name,120)||!a.name.trim()||!Number.isSafeInteger(a.score)||a.score<1||a.score>50||!Number.isSafeInteger(a.damage)||a.damage<0||a.damage>100||!text(a.range,120)||!text(a.properties,300)||!text(a.weaponId,120)))errors.push('Attaque invalide.');
 else if(d.attacks.some(a=>a.weaponId&&(!BESTIARY_WEAPONS.some(w=>w.id===a.weaponId&&w.name===a.name&&w.damage===a.damage&&w.range===a.range&&w.properties===a.properties)||d.realm!=='realite')))errors.push('Arme de Réalité inconnue ou caractéristiques modifiées.');
 if(!Array.isArray(d.abilities)||d.abilities.length>8||d.abilities.some(a=>!text(a,500))||!Array.isArray(d.weaknesses)||d.weaknesses.length>8||d.weaknesses.some(a=>!text(a,500))||!Array.isArray(d.tags)||d.tags.length>12||d.tags.some(t=>!text(t,60)))errors.push('Capacités, faiblesses ou tags invalides.');
 if(d.source!==undefined&&d.source!=='custom'&&d.source!=='generated')errors.push('Origine de la fiche invalide.');
 if(d.image!==undefined&&(!text(d.image,700000)||Boolean(d.image)&&d.source!=='custom'))errors.push('L’image est réservée aux créations personnalisées.');
 return errors;
}
export function weaponAttack(weapon:BestiaryWeapon,score:number):BestiaryAttack{return {name:weapon.name,score,damage:weapon.damage,range:weapon.range,properties:weapon.properties,weaponId:weapon.id};}
