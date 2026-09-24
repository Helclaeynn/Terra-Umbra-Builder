// MJ-only editorial purchases. They are standalone NPC Truth talents: no
// player-facing prerequisite tree and no claim that a biography lists PTV.
export const NPC_TRUTH_GENERIC_TALENTS=[
  {name:'Élan révélé',cost:6,prerequisite:'Révélé ; spécialité choisie à 6+',effect:'1/scène, avant un test de la compétence choisie : +2 au résultat. Ne se cumule pas avec une Assistance équivalente.'},
  {name:'Tenacité de Vérité',cost:7,prerequisite:'Révélé ; résistance possible dans la scène',effect:'1/scène, après un échec à un test de Constitution ou de Force Mentale : relancer le premier d10 et garder le second, y compris si celui-ci donne un échec narratif.'},
  {name:'Maîtrise révélée',cost:12,prerequisite:'Révélé ; spécialité choisie à 6+',effect:'1/scène, après un échec sur la compétence choisie : relancer le premier d10 et garder le second. Une seule relance du même dé est permise.'},
  {name:'Défense manifeste',cost:8,prerequisite:'Révélé ; attaque perçue et réaction possible',effect:'1/scène, face à une attaque perçue : +2 à une défense physique ou occulte choisie avant le jet adverse ; exige la capacité de réagir et ne modifie pas l’armure.'},
  {name:'Second domaine',cost:8,prerequisite:'Révélé ; seconde spécialité choisie à 6+',effect:'1/scène, avant un test d’une seconde compétence choisie sur la fiche : +2. Ne se cumule pas avec l’Élan révélé ni une Assistance équivalente.'},
  {name:'Surpassement singulier',cost:20,prerequisite:'Révélé ; figure exceptionnelle et spécialité à 15+',effect:'1/scénario, avant un test de la compétence de prédilection liée au dossier : +4. Un seul usage, sans cumul avec les autres bonus de ces talents.'}
] as const;
export function npcTruthTalentPack(attributes:number,highestSkill:number):number[]{
  const level=attributes+highestSkill;
  if(level>=88&&highestSkill>=15)return [0,1,2,3,4,5]; // 61 PTV · figure singulière
  if(level>=72)return [0,1,2,3,4]; // 41 PTV · exceptionnel
  if(level>=61)return [0,1,2]; // 25 PTV · confirmé
  if(level>=51)return [0,1]; // 13 PTV · éveillé
  return [0]; // 6 PTV · premiers pouvoirs
}
