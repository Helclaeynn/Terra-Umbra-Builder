import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

export type CorruptionSourceId="vhodhal"|"vaagor"|"sharith"|"vhadhi"|"shaoggith"|"thul";
export type CorruptionTalentKind="DON"|"RITE"|"FAVEUR";
export type CorruptionDepth="Marqué"|"Envahi"|"Au bord de la Rupture"|"";

export type CorruptionTalent={
  id:string;
  name:string;
  cost:number;
  kind:CorruptionTalentKind;
  depth:CorruptionDepth;
  sourceId:CorruptionSourceId;
  sourceName:string;
  family:string;
  access:string;
  prerequisiteName:string;
  effect:string;
  group:string;
  compendiumId:string;
};

type SourceDefinition={
  id:CorruptionSourceId;
  name:string;
  corruption:string;
  principle:string;
  compendiumId:string;
};

export const corruptionSources:readonly SourceDefinition[]=[
  {id:"vhodhal",name:"Vhodhal",corruption:"Famine Blanche",principle:"Dévorer",compendiumId:"regles-verite-v7-fleau-vhodhal"},
  {id:"vaagor",name:"V’Aagor",corruption:"Sombre-Vérité",principle:"Annexer / unir",compendiumId:"regles-verite-v7-fleau-vaagor"},
  {id:"sharith",name:"Ux’Sharith",corruption:"Division",principle:"Séparer / décomposer",compendiumId:"regles-verite-v7-fleau-sharith"},
  {id:"vhadhi",name:"C’Thath Vhadhi",corruption:"Métastase",principle:"Réaffecter / adapter",compendiumId:"regles-verite-v7-fleau-vhadhi"},
  {id:"shaoggith",name:"Gajh’Shaoggith",corruption:"Germination",principle:"Engendrer / proliférer",compendiumId:"regles-verite-v7-fleau-shaoggith"},
  {id:"thul",name:"Thul",corruption:"Fixation",principle:"Fixer / empêcher le devenir",compendiumId:"regles-verite-v7-fleau-thul"}
] as const;

export const corruptionPrecedence:readonly CorruptionSourceId[]=[
  "vaagor","sharith","vhodhal","vhadhi","shaoggith","thul"
] as const;

const expectedFamilies:Record<string,{count:number;ptv:number;source:CorruptionSourceId}> = {
  "Famine Blanche":{count:11,ptv:25,source:"vhodhal"},
  "Loge d’Écume":{count:15,ptv:31,source:"vhodhal"},
  "Sombre-Vérité":{count:18,ptv:40,source:"vaagor"},
  "Deimonisme":{count:13,ptv:28,source:"vaagor"},
  "Ordre de Longinus":{count:16,ptv:34,source:"vaagor"},
  "Confrérie de la Faux":{count:8,ptv:18,source:"vaagor"},
  "Fontaine des Ténèbres":{count:6,ptv:12,source:"vaagor"},
  "Messagers de l’Œil Blanc":{count:6,ptv:13,source:"vaagor"},
  "Division":{count:14,ptv:31,source:"sharith"},
  "Grand Savoir":{count:15,ptv:32,source:"sharith"},
  "Bellatheis":{count:10,ptv:21,source:"sharith"},
  "Nucléomancie":{count:7,ptv:15,source:"sharith"},
  "Métastase":{count:14,ptv:31,source:"vhadhi"},
  "Éden Gris":{count:16,ptv:35,source:"vhadhi"},
  "Germination":{count:15,ptv:34,source:"shaoggith"},
  "Mère Primordiale":{count:15,ptv:32,source:"shaoggith"},
  "Fixation":{count:14,ptv:31,source:"thul"},
  "Sombre Culte commun":{count:6,ptv:13,source:"thul"},
  "Dagon":{count:4,ptv:9,source:"thul"},
  "Telipinu":{count:4,ptv:8,source:"thul"}
};

function clean(value:unknown){return value==null?"":String(value).trim();}
function norm(value:unknown){
  return clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("fr").replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g," ").trim();
}
function slug(value:string){return norm(value).replace(/\s+/g,"-")||"item";}

function sourceRootCandidates(){
  return [
    process.env.TUC_TRUTH_MECHANICS_SOURCE_DIR,
    path.resolve(process.cwd(),"rules-data/truth-mechanics"),
    path.resolve(process.cwd(),"compendium/source"),
    path.resolve(process.cwd(),"../../compendium/source")
  ].filter((value):value is string=>Boolean(value));
}
function sourceRoot(){
  const found=sourceRootCandidates().find(candidate=>
    fs.existsSync(path.join(candidate,"truth-mechanics-v6-fixed.manifest.json"))
  );
  if(!found)throw new Error("Source mécanique Vérité introuvable: truth-mechanics-v6-fixed.manifest.json");
  return found;
}
function asObject(raw:unknown,columns:unknown[]):Record<string,unknown>{
  if(!Array.isArray(raw))return raw&&typeof raw==="object"?raw as Record<string,unknown>:{};
  const out:Record<string,unknown>={};
  for(let i=0;i<raw.length;i++)out[String(columns[i]??i)]=raw[i];
  return out;
}
function loadDecoded(){
  const root=sourceRoot();
  const manifest=JSON.parse(fs.readFileSync(path.join(root,"truth-mechanics-v6-fixed.manifest.json"),"utf8")) as {
    parts?:string[];entries?:number;
  };
  let b64="";
  for(const part of manifest.parts??[]){
    b64+=fs.readFileSync(path.join(root,part),"utf8").replace(/\s+/g,"");
  }
  const decoded=JSON.parse(zlib.gunzipSync(Buffer.from(b64,"base64")).toString("utf8")) as {
    columns?:unknown[];entries?:unknown[];
  };
  if(!Array.isArray(decoded.entries)||decoded.entries.length!==Number(manifest.entries??882)){
    throw new Error(`Source mécanique Vérité invalide: ${decoded.entries?.length??0} cartes.`);
  }
  return {columns:decoded.columns??[],entries:decoded.entries};
}

function sourceIdFor(text:string):CorruptionSourceId|null{
  const value=norm(text);
  if(value.includes("vhodhal"))return "vhodhal";
  if(value.includes("v'aagor")||value.includes("v aagor")||value.includes("vaagor"))return "vaagor";
  if(value.includes("sharith"))return "sharith";
  if(value.includes("vhadhi"))return "vhadhi";
  if(value.includes("shaoggith"))return "shaoggith";
  if(/(^| )thul( |$)/.test(value))return "thul";
  return null;
}
function familyFor(subheadings:string,sourceId:CorruptionSourceId):string{
  const value=norm(subheadings);
  const defs:[string,RegExp][]=[
    ["Famine Blanche",/famine blanche/],
    ["Loge d’Écume",/loge d ecume/],
    ["Sombre-Vérité",/sombre verite/],
    ["Deimonisme",/deimonisme/],
    ["Ordre de Longinus",/longinus/],
    ["Confrérie de la Faux",/confrerie de la faux/],
    ["Fontaine des Ténèbres",/fontaine des tenebres/],
    ["Messagers de l’Œil Blanc",/(messagers? de l oeil blanc|oeil blanc)/],
    ["Grand Savoir",/grand savoir/],
    ["Bellatheis",/bellatheis/],
    ["Nucléomancie",/nucleomancie/],
    ["Division",/division/],
    ["Éden Gris",/eden gris/],
    ["Métastase",/metastase/],
    ["Mère Primordiale",/mere primordiale/],
    ["Germination",/germination/],
    ["Sombre Culte commun",/sombre culte/],
    ["Dagon",/(^| )dagon( |$)/],
    ["Telipinu",/(^| )telipinu( |$)/],
    ["Fixation",/fixation/]
  ];
  for(const [label,pattern] of defs)if(pattern.test(value))return label;
  const fallback:Record<CorruptionSourceId,string>={
    vhodhal:"Famine Blanche",vaagor:"Sombre-Vérité",sharith:"Division",
    vhadhi:"Métastase",shaoggith:"Germination",thul:"Fixation"
  };
  return fallback[sourceId];
}

function profileParts(rawTitle:string){
  const marker=rawTitle.search(/Profil\s*:/i);
  if(marker<0)return null;
  const name=rawTitle.slice(0,marker).trim().replace(/[|•—–-]+$/g,"").trim();
  const profile=rawTitle.slice(marker).replace(/^Profil\s*:\s*/i,"").trim();
  const cost=Number(profile.match(/(\d+)\s*PTV/i)?.[1]??0);
  const kind=(profile.match(/\b(DON|RITE|FAVEUR)\b/i)?.[1]??"").toUpperCase() as CorruptionTalentKind;
  if(!name||!cost||!["DON","RITE","FAVEUR"].includes(kind))return null;
  const depthMatch=profile.match(/Au bord de la Rupture|Envahi|Marqué/i)?.[0]??"";
  const depth=(depthMatch
    ? depthMatch.toLocaleLowerCase("fr").startsWith("au bord")?"Au bord de la Rupture"
      :depthMatch.toLocaleLowerCase("fr").startsWith("envahi")?"Envahi":"Marqué"
    :"") as CorruptionDepth;
  const prerequisiteName=(profile.match(/Pr[eé]requis\s*:\s*([^•|]+)/i)?.[1]??"").trim();
  return {name,profile,cost,kind,depth,prerequisiteName};
}

function buildCatalog():CorruptionTalent[]{
  const decoded=loadDecoded();
  const rows:CorruptionTalent[]=[];
  for(const raw of decoded.entries){
    const card=asObject(raw,decoded.columns);
    if(clean(card.chapter)!=="21")continue;
    const rawTitle=clean(card.title);
    const parsed=profileParts(rawTitle);
    if(!parsed)continue;
    const h3=clean(card.heading3);
    const subheadings=[clean(card.heading4),clean(card.heading5)].filter(Boolean);
    const headings=[h3,...subheadings].filter(Boolean);
    const sourceId=sourceIdFor(h3||headings.join(" "));
    if(!sourceId)throw new Error(`Fléau indéterminé pour ${parsed.name}: ${headings.join(" › ")}`);
    const source=corruptionSources.find(item=>item.id===sourceId)!;
    const eyeWhiteNames=new Set(["Voir la couture","Masse empruntée","Pression invisible","Ancre gravitationnelle","Étouffement du Mageius","Écarter la couture"]);
    const family=sourceId==="vaagor"&&eyeWhiteNames.has(parsed.name)
      ?"Messagers de l’Œil Blanc"
      :familyFor(subheadings.join(" "),sourceId);
    rows.push({
      id:`fleau_${sourceId}_${slug(family)}_${slug(parsed.name)}`,
      name:parsed.name,
      cost:parsed.cost,
      kind:parsed.kind,
      depth:parsed.depth,
      sourceId,
      sourceName:source.name,
      family,
      access:parsed.profile,
      prerequisiteName:parsed.prerequisiteName,
      effect:clean(card.text),
      group:`${source.name} — ${family}`,
      compendiumId:source.compendiumId
    });
  }

  if(rows.length!==227)throw new Error(`Catalogue Fléaux: ${rows.length} capacités, 227 attendues.`);
  if(new Set(rows.map(row=>row.id)).size!==rows.length)throw new Error("Catalogue Fléaux: IDs dupliqués.");

  const total=rows.reduce((sum,row)=>sum+row.cost,0);
  if(total!==493)throw new Error(`Catalogue Fléaux: ${total} PTV, 493 attendus.`);

  const families=new Map<string,CorruptionTalent[]>();
  for(const row of rows){
    if(!families.has(row.family))families.set(row.family,[]);
    families.get(row.family)!.push(row);
  }
  for(const [family,expected] of Object.entries(expectedFamilies)){
    const actual=families.get(family)??[];
    const ptv=actual.reduce((sum,row)=>sum+row.cost,0);
    if(actual.length!==expected.count||ptv!==expected.ptv){
      throw new Error(`Catalogue Fléaux / ${family}: ${actual.length} talents / ${ptv} PTV, attendu ${expected.count} / ${expected.ptv}.`);
    }
    if(actual.some(row=>row.sourceId!==expected.source)){
      throw new Error(`Catalogue Fléaux / ${family}: Source incohérente.`);
    }
  }
  if(families.size!==Object.keys(expectedFamilies).length){
    throw new Error(`Catalogue Fléaux: ${families.size} familles, ${Object.keys(expectedFamilies).length} attendues.`);
  }

  return rows;
}

export const corruptionTalents=buildCatalog();
