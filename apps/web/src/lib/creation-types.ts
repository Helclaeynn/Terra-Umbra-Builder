import type { TalentOption } from "../components/builder/TalentSelector.vue";
export type RuleAttribute={id:string;name:string};
export type RuleSkill={id:string;name:string;attribute:string};
export type RuleOrigin={name:string;compendiumId?:string};
export type RuleSphere={name:string;compendiumId?:string;originId:string;support:string;fixedSkills:string[]};
export type RuleStyle={
  id:string;
  sphere:string;
  name:string;
  compendiumId?:string;
  skills:string[];
  expertiseFamilies:string[];
  lifestyle:string;
  account:number;
  augmentationEnvelope:number;
  gen2SlotsBase:number;
  vehicleCapital:number;
};
export type RuleTalent=TalentOption&{
  category?:string;
  sphere?:string;
  attribute?:string;
  skill?:string;
  prerequisite?:string|null;
};
export type CreationLore={
  origin:Record<string,string>;
  originTalent:Record<string,string>;
  sphere:Record<string,string>;
  style:Record<string,string>;
  skill:Record<string,string>;
  attribute:Record<string,string>;
  talent:Record<string,string>;
  sphereTalent:Record<string,string>;
};
export type CreationRules={
  id:string;
  name:string;
  sourceVersion:string;
  attributes:RuleAttribute[];
  skills:RuleSkill[];
  creation:{
    attributes:{baseTotal:number;min:number;max:number;edgePackPoints:number;edgePackMax:number};
    skills:{sphereFixedPoints:number;stylePoints:number;stylePerSkillMax:number;freePoints:number;rawMax:number;edgePackPoints:number;edgePackMax:number};
  };
  origins:Record<string,RuleOrigin>;
  spheres:Record<string,RuleSphere>;
  styles:RuleStyle[];
  talents:{
    origin:Record<string,RuleTalent[]>;
    sphere:Record<string,RuleTalent[]>;
    common:RuleTalent[];
    expertise:RuleTalent[];
  };
};

export type DisadvantageOption={
  id:string;
  name:string;
  compendiumId?:string;
  effect:string;
  category:"common"|"attribute"|"sphere";
  attribute?:string;
  sphere?:string;
};
export type DisadvantageCatalog={
  common:readonly DisadvantageOption[];
  attribute:readonly DisadvantageOption[];
  sphere:Record<string,readonly DisadvantageOption[]>;
};
export type EdgeOptionRule={max:number;points?:number;amount?:number;steps?:number;gen2Windows?:number};
export type EdgeLore={lore:string;mechanic:string};
export type EdgeRules={
  base:number;
  maxHeld:number;
  options:Record<string,EdgeOptionRule>;
  lore:Record<string,EdgeLore>;
};

