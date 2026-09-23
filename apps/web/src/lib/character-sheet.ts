import type { CharacterIdentity } from "../types/character";

export type SheetValue = { id:string; name:string; value:number; raw?:number; bonus?:number; attribute?:string; base?:number };
export type SheetEntry = { id:string; name:string; detail?:string; lore?:string; compendiumId?:string; group?:string };
export type DerivedStats = ReturnType<typeof characterDerivedStats>;

/** Existing Builder formulas, shared unchanged by creation and campaign views. */
export function characterDerivedStats(attribute:(id:string)=>number, skill:(id:string)=>number, disadvantages:readonly string[]){
  const vigor=attribute("vigueur"), agility=attribute("agilite"), will=attribute("volonte");
  const constitution=skill("constitution"), athletics=skill("athletisme"), dodge=skill("esquive");
  const fortitude=skill("force_mentale"), humanity=skill("humanite");
  return {
    pvMax:2*vigor+constitution, death:-(vigor+constitution),
    initiative:agility+athletics-(disadvantages.includes("lent_a_reagir")?2:0),
    passiveDefense:agility+dodge, occultDefense:will+fortitude, movement:5+athletics,
    integrity:Math.max(1,fortitude+humanity-(disadvantages.includes("integrite_defaillante")?2:0)),
    augmentStressMax:vigor+humanity, melee:vigor+skill("melee"), pugilat:vigor+skill("pugilat"),
    shooting:agility+skill("tir"), neurodive:will+skill("neurodive")
  };
}

export type CharacterSheet = {
  mode:"creation"|"campaign"; name:string; identity:CharacterIdentity;
  origin:string; sphere:string; style:string; lifestyle:string; lifestyleBase:string; renown:number;
  attributes:SheetValue[]; skills:SheetValue[]; derived:DerivedStats;
  edge:number; xpRemaining:number; ptvRemaining:number; account:number; cash:number;
  realityTalents:SheetEntry[]; truthTalents:SheetEntry[]; disadvantages:SheetEntry[]; inventory:SheetEntry[];
  truthNature:string; truthConsciousness:string; corruption:number; corruptionSource:string;
  languages:string[]; contacts:string[]; reputation:string; renownMilieu:string;
};
