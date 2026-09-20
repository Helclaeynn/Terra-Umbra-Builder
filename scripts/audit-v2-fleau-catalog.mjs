import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT="compendium/source";
const MANIFEST="truth-mechanics-v6-fixed.manifest.json";
const expected={
  "Famine Blanche":[11,25],
  "Loge d’Écume":[15,31],
  "Sombre-Vérité":[18,40],
  "Deimonisme":[13,28],
  "Ordre de Longinus":[16,34],
  "Confrérie de la Faux":[8,18],
  "Fontaine des Ténèbres":[6,12],
  "Messagers de l’Œil Blanc":[6,13],
  "Division":[14,31],
  "Grand Savoir":[15,32],
  "Bellatheis":[10,21],
  "Nucléomancie":[7,15],
  "Métastase":[14,31],
  "Éden Gris":[16,35],
  "Germination":[15,34],
  "Mère Primordiale":[15,32],
  "Fixation":[14,31],
  "Sombre Culte commun":[6,13],
  "Dagon":[4,9],
  "Telipinu":[4,8]
};

const clean=v=>v==null?"":String(v).trim();
const norm=v=>clean(v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g," ").trim();
const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,MANIFEST),"utf8"));
let b64="";
for(const part of manifest.parts??[])b64+=fs.readFileSync(path.join(ROOT,part),"utf8").replace(/\s+/g,"");
const decoded=JSON.parse(zlib.gunzipSync(Buffer.from(b64,"base64")).toString("utf8"));
const asObject=raw=>{
  if(!Array.isArray(raw))return raw??{};
  return Object.fromEntries(raw.map((value,index)=>[String(decoded.columns?.[index]??index),value]));
};

function family(subheadings,source){
  const value=norm(subheadings);
  const defs=[
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
  for(const [label,re] of defs)if(re.test(value))return label;
  return {vhodhal:"Famine Blanche",vaagor:"Sombre-Vérité",sharith:"Division",vhadhi:"Métastase",shaoggith:"Germination",thul:"Fixation"}[source]??"";
}
function source(headings){
  const v=norm(headings);
  if(v.includes("vhodhal"))return"vhodhal";
  if(v.includes("v'aagor")||v.includes("v aagor")||v.includes("vaagor"))return"vaagor";
  if(v.includes("sharith"))return"sharith";
  if(v.includes("vhadhi"))return"vhadhi";
  if(v.includes("shaoggith"))return"shaoggith";
  if(/(^| )thul( |$)/.test(v))return"thul";
  return"";
}

const rows=[];
const rejected=[];
for(const raw of decoded.entries??[]){
  const card=asObject(raw);
  if(clean(card.chapter)!=="21")continue;
  const rawTitle=clean(card.title);
  const marker=rawTitle.search(/Profil\s*:/i);
  if(marker<0)continue;
  const name=rawTitle.slice(0,marker).trim().replace(/[|•—–-]+$/g,"").trim();
  const profile=rawTitle.slice(marker).replace(/^Profil\s*:\s*/i,"").trim();
  const cost=Number(profile.match(/(\d+)\s*PTV/i)?.[1]??0);
  const kind=(profile.match(/\b(DON|RITE|FAVEUR)\b/i)?.[1]??"").toUpperCase();
  const h3=clean(card.heading3);
  const subheadings=[card.heading4,card.heading5].map(clean).filter(Boolean).join(" › ");
  const headings=[h3,subheadings].filter(Boolean).join(" › ");
  const sourceId=source(h3||headings);
  if(!name||!cost||!kind||!sourceId){
    rejected.push({name,profile,headings,cost,kind,sourceId});
    continue;
  }
  const eyeWhiteNames=new Set(["Voir la couture","Masse empruntée","Pression invisible","Ancre gravitationnelle","Étouffement du Mageius","Écarter la couture"]);
  rows.push({
    name,cost,kind,sourceId,
    family:sourceId==="vaagor"&&eyeWhiteNames.has(name)?"Messagers de l’Œil Blanc":family(subheadings,sourceId),
    headings
  });
}

const byFamily=new Map();
for(const row of rows){
  if(!byFamily.has(row.family))byFamily.set(row.family,[]);
  byFamily.get(row.family).push(row);
}
const total=rows.reduce((sum,row)=>sum+row.cost,0);
console.log(`FLÉAUX SOURCE AUDIT — ${rows.length} capacités · ${total} PTV · ${byFamily.size} familles`);
for(const [name,[count,ptv]] of Object.entries(expected)){
  const actual=byFamily.get(name)??[];
  const actualPtv=actual.reduce((sum,row)=>sum+row.cost,0);
  console.log(`${name}: ${actual.length}/${count} · ${actualPtv}/${ptv} PTV`);
  if(actual.length!==count||actualPtv!==ptv)process.exitCode=1;
}
const unexpected=[...byFamily.keys()].filter(name=>!(name in expected));
if(unexpected.length){
  console.error("Familles inattendues:",unexpected);
  process.exitCode=1;
}
if(rows.length!==227||total!==493||byFamily.size!==20){
  console.error(`Total invalide: ${rows.length}/227 · ${total}/493 PTV · ${byFamily.size}/20 familles`);
  if(rejected.length)console.error("Cartes Profil rejetées:",rejected.slice(0,20));
  process.exitCode=1;
}
if(!process.exitCode)console.log("FLÉAUX SOURCE AUDIT OK — 227/227 capacités · 493/493 PTV · 20/20 familles");
