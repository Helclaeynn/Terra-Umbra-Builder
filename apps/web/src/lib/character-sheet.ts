import {characterDerivedStats} from '../../../api/src/rules/character-derived-stats';
export {characterDerivedStats};
import type { CharacterIdentity } from "../types/character";

export type SheetValue = { id:string; name:string; value:number; raw?:number; bonus?:number; attribute?:string; base?:number };
export type SheetEntry = { id:string; name:string; detail?:string; lore?:string; compendiumId?:string; group?:string };
export type DerivedStats = ReturnType<typeof characterDerivedStats>;


export type CharacterSheet = {
  mode:"creation"|"campaign"; name:string; identity:CharacterIdentity;
  origin:string; sphere:string; style:string; lifestyle:string; lifestyleBase:string; renown:number;
  attributes:SheetValue[]; skills:SheetValue[]; derived:DerivedStats;
  edge:number; xpRemaining:number; ptvRemaining:number; account:number; cash:number;
  realityTalents:SheetEntry[]; truthTalents:SheetEntry[]; disadvantages:SheetEntry[]; inventory:SheetEntry[];
  truthNature:string; truthConsciousness:string; corruption:number; corruptionSource:string;
  languages:string[]; contacts:string[]; reputation:string; renownMilieu:string;
};
