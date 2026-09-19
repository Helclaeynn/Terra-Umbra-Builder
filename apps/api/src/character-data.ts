import { terraUmbraCreationRules } from "./rules/terra-umbra-creation.js";

type JsonRecord = Record<string, unknown>;

const isRecord=(value:unknown): value is JsonRecord =>
  !!value && typeof value === "object" && !Array.isArray(value);

const asString=(value:unknown, fallback="") =>
  typeof value === "string" ? value : fallback;

const asNumber=(value:unknown, fallback=0) => {
  const n=Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const stringArray=(value:unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const cloneRecord=(value:unknown): JsonRecord =>
  isRecord(value) ? structuredClone(value) : {};

export type CharacterDataV2 = {
  schemaVersion: 2;
  rulesetId: "terra-umbra";
  identity: {
    name: string;
    firstName: string;
    alias: string;
    occupation: string;
    age: string;
    sex: string;
    height: string;
    weight: string;
    concept: string;
    objective: string;
    notes: string;
    portraitDataUrl: string;
    portraitName: string;
  };
  creation: {
    origin: string;
    sphere: string;
    style: string;
  };
  attributes: Record<string, number>;
  skills: Record<string, { style: number; free: number; edge: number }>;
  talents: {
    origin: string;
    sphere: string;
    expertise: string;
    common: string;
    edge: string[];
  };
  talentChoices: JsonRecord;
  disadvantages: string[];
  edge: Record<string, number>;
  edgeAttributes: Record<string, number>;
  truth: JsonRecord;
  equipment: unknown[];
  social: JsonRecord;
  spending: Record<string, number>;
  reality: JsonRecord;
  progression: JsonRecord;
  meta: {
    importedFrom?: "v1-json";
    sourceSchemaVersion?: number;
  };
};

export function blankCharacterData(name:string): CharacterDataV2 {
  return {
    schemaVersion:2,
    rulesetId:"terra-umbra",
    identity:{
      name,
      firstName:"",
      alias:"",
      occupation:"",
      age:"",
      sex:"",
      height:"",
      weight:"",
      concept:"",
      objective:"",
      notes:"",
      portraitDataUrl:"",
      portraitName:""
    },
    creation:{origin:"",sphere:"",style:""},
    attributes:{vigueur:3,agilite:3,esprit:3,volonte:3,charisme:3},
    skills:Object.fromEntries(
      terraUmbraCreationRules.skills.map((skill)=>[
        skill.id,
        { style:0, free:0, edge:0 }
      ])
    ),
    talents:{origin:"",sphere:"",expertise:"",common:"",edge:[]},
    talentChoices:{},
    disadvantages:[],
    edge:{
      attributePack:0,
      skillPacks:0,
      talentPacks:0,
      cashPacks:0,
      lifestylePack:0,
      augmentationPacks:0,
      renownPack:0
    },
    edgeAttributes:{},
    truth:{nature:"humain",consciousness:"profane",choices:{hunterTradition:"aucune"},truthTalents:[]},
    equipment:[],
    social:{languages:["Anglais"],contacts:[],reputation:""},
    spending:{augmentations:0,equipment:0,vehicle:0},
    reality:{
      augmentations:[],
      equipment:[],
      fixedChargeItems:[],
      mjAdvancedOverride:false,
      mjAccessOverride:false,
      sphereSupportType:"",
      sphereSupportItemId:""
    },
    progression:{
      xpEarned:0,
      ptvEarned:0,
      skillRanks:{},
      attributeRanks:{},
      realityTalents:[],
      truthTalents:[],
      flashUses:[],
      flashReady:true,
      flashArmed:false,
      cashBase:null,
      cashTransactions:[]
    },
    meta:{}
  };
}

export function normalizeCharacterData(input:unknown, fallbackName:string): CharacterDataV2 {
  const source=isRecord(input)?input:{};
  const out=blankCharacterData(fallbackName);

  const identity=cloneRecord(source.identity);
  out.identity={
    name:asString(identity.name,fallbackName).trim()||fallbackName,
    firstName:asString(identity.firstName),
    alias:asString(identity.alias),
    occupation:asString(identity.occupation,asString(identity.activity)),
    age:asString(identity.age),
    sex:asString(identity.sex),
    height:asString(identity.height),
    weight:asString(identity.weight),
    concept:asString(identity.concept),
    objective:asString(identity.objective),
    notes:asString(identity.notes),
    portraitDataUrl:asString(identity.portraitDataUrl),
    portraitName:asString(identity.portraitName)
  };

  const creation=cloneRecord(source.creation);
  out.creation={
    origin:asString(creation.origin),
    sphere:asString(creation.sphere),
    style:asString(creation.style)
  };

  const attributes=cloneRecord(source.attributes);
  for(const key of ["vigueur","agilite","esprit","volonte","charisme"]){
    out.attributes[key]=asNumber(attributes[key],out.attributes[key]);
  }

  if(isRecord(source.skills)){
    for(const [id,value] of Object.entries(source.skills)){
      if(!isRecord(value) || !(id in out.skills))continue;
      out.skills[id]={
        style:Math.max(0,asNumber(value.style)),
        free:Math.max(0,asNumber(value.free)),
        edge:Math.max(0,asNumber(value.edge))
      };
    }
  }

  const talents=cloneRecord(source.talents);
  out.talents={
    origin:asString(talents.origin),
    sphere:asString(talents.sphere),
    expertise:asString(talents.expertise),
    common:asString(talents.common),
    edge:stringArray(talents.edge)
  };

  out.talentChoices=cloneRecord(source.talentChoices);
  out.disadvantages=stringArray(source.disadvantages);

  if(isRecord(source.edge)){
    for(const [key,value] of Object.entries(source.edge))out.edge[key]=Math.max(0,asNumber(value));
  }

  if(isRecord(source.edgeAttributes)){
    for(const [key,value] of Object.entries(source.edgeAttributes))out.edgeAttributes[key]=Math.max(0,asNumber(value));
  }else if(isRecord(source.attributesEdge)){
    for(const [key,value] of Object.entries(source.attributesEdge))out.edgeAttributes[key]=Math.max(0,asNumber(value));
  }

  const truth=cloneRecord(source.truth);
  out.truth={
    nature:asString(truth.nature,"humain"),
    consciousness:asString(truth.consciousness,"profane"),
    choices:cloneRecord(truth.choices),
    truthTalents:stringArray(truth.truthTalents)
  };

  out.equipment=Array.isArray(source.equipment)?structuredClone(source.equipment):[];

  const social=cloneRecord(source.social);
  out.social={
    ...social,
    languages:stringArray(social.languages).length?stringArray(social.languages):["Anglais"],
    contacts:Array.isArray(social.contacts)?structuredClone(social.contacts):[],
    reputation:asString(social.reputation)
  };

  if(isRecord(source.spending)){
    for(const key of ["augmentations","equipment","vehicle"]){
      out.spending[key]=Math.max(0,asNumber(source.spending[key]));
    }
  }

  out.reality=cloneRecord(source.reality);
  {
    const reality=out.reality;
    const legacySupport=asString(reality.sphereSupportDetail);
    let supportType=asString(reality.sphereSupportType);
    if(!["housing","vehicle"].includes(supportType)){
      const normalized=legacySupport.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
      supportType=/logement|maison|appartement|studio|villa|hebergement/.test(normalized)
        ?"housing"
        :/vehicule|voiture|moto|transport/.test(normalized)
          ?"vehicle"
          :"";
    }
    reality.sphereSupportType=supportType;
    reality.sphereSupportItemId=asString(reality.sphereSupportItemId);
    for(const key of ["sphereSupportDetail","possessionsNotes","networks","statuses","patrimony","debts"]){
      delete reality[key];
    }
  }
  out.progression=cloneRecord(source.progression);

  const sourceSchema=Number(source.schemaVersion);
  if(sourceSchema===1){
    out.meta.importedFrom="v1-json";
    out.meta.sourceSchemaVersion=1;
  }else if(isRecord(source.meta)){
    out.meta=structuredClone(source.meta) as CharacterDataV2["meta"];
  }

  return out;
}

export function importV1CharacterData(input:unknown): CharacterDataV2 | null {
  if(!isRecord(input))return null;
  if(input.rulesetId!=="terra-umbra")return null;
  const schema=Number(input.schemaVersion);
  if(schema!==1)return null;
  const identity=cloneRecord(input.identity);
  const name=asString(identity.name).trim();
  if(!name)return null;
  return normalizeCharacterData(input,name);
}
