export type CharacterIdentity = {
  name: string;
  alias: string;
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

export type CharacterDataV2 = {
  schemaVersion: 2;
  rulesetId: "terra-umbra";
  identity: CharacterIdentity;
  creation: { origin:string; sphere:string; style:string };
  attributes: Record<string, number>;
  skills: Record<string, { style:number; free:number; edge:number }>;
  talents: { origin:string; sphere:string; expertise:string; common:string; edge:string[] };
  talentChoices: Record<string, unknown>;
  disadvantages: string[];
  edge: Record<string, number>;
  edgeAttributes: Record<string, number>;
  truth: Record<string, unknown>;
  equipment: unknown[];
  social: Record<string, unknown>;
  spending: Record<string, number>;
  reality: Record<string, unknown>;
  progression: Record<string, unknown>;
  meta: { importedFrom?:"v1-json"; sourceSchemaVersion?:number };
};

export type Character = {
  id: string;
  name: string;
  data: CharacterDataV2;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type Revision = {
  revision: number;
  name: string;
  reason: string;
  createdAt: string;
};
