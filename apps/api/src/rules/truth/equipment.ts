import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

type TruthEquipmentRaw={
  id?:unknown;
  name?:unknown;
  chapter?:unknown;
  section?:unknown;
  status?:unknown;
  sourceKind?:unknown;
  tags?:unknown;
  loreHint?:unknown;
  rows?:unknown;
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
  compendiumId:string;
  referenceOnly:boolean;
  requiresMj:boolean;
};

function text(value:unknown){
  if(value===null||value===undefined)return "";
  if(Array.isArray(value))return value.map(text).filter(Boolean).join(" · ");
  if(typeof value==="object")return JSON.stringify(value);
  return String(value).trim();
}

function slug(value:string){
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"")||"item";
}

function sourceCandidates(){
  return [
    process.env.TUC_TRUTH_EQUIPMENT_SOURCE,
    path.resolve(process.cwd(),"rules-data/truth-equipment/verite-catalog-v6.json.gz.b64"),
    path.resolve(process.cwd(),"compendium/source/verite-catalog-v6.json.gz.b64"),
    path.resolve(process.cwd(),"../../compendium/source/verite-catalog-v6.json.gz.b64")
  ].filter((value):value is string=>Boolean(value));
}

function sourcePath(){
  const found=sourceCandidates().find(candidate=>fs.existsSync(candidate));
  if(!found){
    throw new Error(
      "Catalogue Vérité introuvable: verite-catalog-v6.json.gz.b64 n’est disponible dans aucun chemin attendu."
    );
  }
  return found;
}

function normalizeRows(value:unknown):TruthEquipmentProperty[]{
  if(!Array.isArray(value))return [];
  return value.flatMap(row=>{
    if(!Array.isArray(row)||row.length<2)return [];
    const label=text(row[0]),propertyValue=text(row[1]);
    return label&&propertyValue?[{label,value:propertyValue}]:[];
  });
}

function loadTruthEquipment():TruthEquipmentItem[]{
  const b64=fs.readFileSync(sourcePath(),"utf8").replace(/\s+/g,"");
  const parsed=JSON.parse(
    zlib.gunzipSync(Buffer.from(b64,"base64")).toString("utf8")
  ) as {entryCount?:unknown;entries?:TruthEquipmentRaw[]};

  const entries=Array.isArray(parsed.entries)?parsed.entries:[];
  if(entries.length!==229||Number(parsed.entryCount)!==229){
    throw new Error(
      `Catalogue Vérité invalide: ${entries.length} entrées, 229 attendues.`
    );
  }

  const ids=new Set<string>();
  return entries.map((raw,index)=>{
    const id=text(raw.id);
    const name=text(raw.name);
    const chapter=text(raw.chapter);
    if(!id||!name||!chapter){
      throw new Error(`Catalogue Vérité: entrée #${index+1} incomplète.`);
    }
    if(ids.has(id))throw new Error(`Catalogue Vérité: ID dupliqué ${id}.`);
    ids.add(id);

    const status=text(raw.status);
    const sourceKind=text(raw.sourceKind);
    const normalizedStatus=status.toLocaleLowerCase("fr");
    const normalizedKind=sourceKind.toLocaleLowerCase("fr");

    return {
      id,
      name,
      chapter,
      section:text(raw.section),
      status,
      sourceKind,
      tags:Array.isArray(raw.tags)?raw.tags.map(text).filter(Boolean):[],
      lore:text(raw.loreHint),
      properties:normalizeRows(raw.rows),
      compendiumId:`verite-catalogue-${String(index+1).padStart(3,"0")}-${slug(name)}`,
      referenceOnly:
        chapter==="22"||
        normalizedStatus==="reference"||
        normalizedKind==="property"||
        normalizedKind==="propriete"||
        normalizedKind==="propriété",
      requiresMj:
        normalizedStatus==="unique"||
        normalizedStatus==="hors_catalogue"||
        normalizedStatus==="hors catalogue"
    };
  });
}

export const truthEquipmentCatalog=loadTruthEquipment();
