export type TruthChoiceOption={
  id:string;
  name:string;
  description?:string;
};

export type TruthChoice={
  key:string;
  label:string;
  optional:boolean;
  dependsOn?:string;
  options:TruthChoiceOption[];
  optionsBy?:Record<string,TruthChoiceOption[]>;
};

export type TruthTrait={
  name:string;
  access:string;
  effect:string;
  source?:string;
};

export type TruthFreeTraitRule={
  when:Record<string,string|string[]>;
  traits:TruthTrait[];
};

export type TruthNature={
  id:string;
  compendiumId?:string;
  name:string;
  description:string;
  choices:TruthChoice[];
  baseFreeTraits:TruthTrait[];
  freeTraitRules:TruthFreeTraitRule[];
};

export type TruthEquipmentProperty={
  label:string;
  value:string;
};

export type TruthEquipmentItem={
  id:string;
  name:string;
  chapter:string;
  section:string;
  status:string;
  sourceKind:string;
  tags:string[];
  lore:string;
  properties:TruthEquipmentProperty[];
  compendiumId?:string;
  referenceOnly:boolean;
  requiresMj:boolean;
};

export type CorruptionSource={
  id:string;
  name:string;
  corruption:string;
  principle:string;
  compendiumId?:string;
};

export type CorruptionTalent={
  id:string;
  name:string;
  cost:number;
  kind:"DON"|"RITE"|"FAVEUR";
  depth:"Marqué"|"Envahi"|"Au bord de la Rupture"|"";
  sourceId:string;
  sourceName:string;
  family:string;
  access:string;
  prerequisiteName:string;
  effect:string;
  group:string;
  compendiumId?:string;
};

export type TruthTalent={
  anyRequiredTalentIds?:readonly string[];
  requiredTalentIds?:readonly string[];
  effectDetails?:string;
  activation?:string;
  elementEffects?:Record<string,string>;
  id:string;
  compendiumId?:string;
  name:string;
  cost:number;
  access?:string;
  prerequisite?:string;
  prerequisiteName?:string;
  group:string;
  effect:string;
  runtimeLore?:string;
  when?:Record<string,string|string[]>;
  mageAffinity?:string;
  mageProgress?:boolean;
  mageAwaken?:string;
  mageOpening?:"native"|"additional"|"adjacent"|"traverse";
  mageTargetType?:string;
};

export type TruthRulesPackage={
  structure:{
    ptvInitial:number;
    consciousness:Array<{id:string;name:string}>;
    natures:Record<string,TruthNature>;
  };
  catalogs:Record<string,TruthTalent[]>;
  equipment:TruthEquipmentItem[];
  corruption:{
    sources:CorruptionSource[];
    precedence:string[];
    talents:CorruptionTalent[];
  };
  visibility:{
    needles:Record<string,Record<string,string[]>>;
    sharedHunterNatures:readonly string[];
  };
  revelation:{
    stages:Record<"v"|"sr"|"r",{code:string;name:string}>;
    rules:{
      revealedReplacesSemiRevealed:boolean;
      vigorPvMultiplier:number;
      vigorShapeChangeDoesNotHeal:boolean;
    };
    bodies:Record<string,{v:string;sr:string;r:string}>;
    daemonStats:Record<string,{sr:string;r:string}>;
    angelusStats:Record<string,{sr:string;r:string}>;
    aserynStats:Record<string,{sr:string;r:string}>;
    exileStats:Record<string,{sr:string;r:string}>;
    extralStats:Record<string,{sr:string;r:string}>;
    khinaeBase:Record<string,{animal:string;hybrid:string}>;
    khinaeVariant:Record<string,Record<string,string>>;
  };
};

export type TruthState={
  /** Transient UI context: creation excludes external doctrines and exceptional equipment. */
  mode?:"creation"|"progression";
  exileInventory?:import("./exile-build.js").ExileOwnedItem[];
  /** Transient inventory projection, never accepted as a source of purchases. */
  extralInventory?:import("./extral-build.js").ExtralOwnedItem[];
  nature:string;
  consciousness:string;
  choices:Record<string,unknown>;
  truthTalents:string[];
  truthEquipment:string[];
  truthEquipmentMjOverride:boolean;
  corruptionMjAuthorized:boolean;
  corruption:number;
  corruptionSource:string;
  corruptionTalents:string[];
};
