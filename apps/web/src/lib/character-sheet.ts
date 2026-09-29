import {characterDerivedStats} from '../../../api/src/rules/character-derived-stats';
export {characterDerivedStats};
import type { CharacterIdentity } from "../types/character";

export type SheetValue = { id:string; name:string; value:number; raw?:number; bonus?:number; attribute?:string; base?:number; contexts?:Array<{id:string;label:string;bonus:number;total:number}> };
export type SheetEntry = { effectDetails?:string; activation?:string; id:string; name:string; detail?:string; lore?:string; compendiumId?:string; group?:string };
export type SheetContact = { id:string; name:string; articleId?:string; group?:string; detail?:string };
export type DerivedStats = ReturnType<typeof characterDerivedStats>;


export type CharacterSheet = {
  angelusDetails?:import("./angelus").AngelusSheetEntry[];
  angelusAura?:{rank:string;maximum:number}|null;
  daemonDetails?:import("./daemon").DaemonSheetEntry[];
  mageTechniques?:import("./mage").MageTechniqueView[];
  appearances?:import("../../../api/src/character-appearances").CharacterAppearances;
  legacyPortrait?:{portraitDataUrl:string;portraitName:string};
  truthDetails?:import("./truth-sheet-details").TruthSheetDetail[];
  truthFreeTraits?:SheetEntry[];
  mode:"creation"|"campaign"; name:string; identity:CharacterIdentity;
  origin:string; sphere:string; style:string; lifestyle:string; lifestyleBase:string; renown:number;
  attributes:SheetValue[]; skills:SheetValue[]; derived:DerivedStats;
  talentRules?:SheetEntry[];
  edge:number; xpRemaining:number; ptvRemaining:number; account:number; cash:number;
  realityTalents:SheetEntry[]; truthTalents:SheetEntry[]; disadvantages:SheetEntry[]; inventory:SheetEntry[];
  truthNature:string; truthConsciousness:string; corruption:number; corruptionSource:string;
  truthStages:Array<{id:string;name:string;description:string;stats:string;traits:Array<{name:string;effect:string}>}>;
  languages:string[]; contacts:SheetContact[]; reputation:string; renownMilieu:string;
};
