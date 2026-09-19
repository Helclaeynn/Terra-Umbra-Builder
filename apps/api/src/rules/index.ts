import type { FastifyInstance } from "fastify";
import { requireUser } from "../auth.js";
import { terraUmbraCreationRules } from "./terra-umbra-creation.js";
import { terraUmbraCreationLore, terraUmbraTalentChoiceSpecs, terraUmbraRealitySkillTalentMap } from "./terra-umbra-creation-lore.js";
import { terraUmbraDisadvantages, terraUmbraDisadvantageLore, terraUmbraEdgeRules } from "./terra-umbra-disadvantages-edge.js";
import { terraUmbraTruthRules } from "./truth/rules.js";
import { getRealityRules } from "./reality.js";
import { resolveCompendiumId } from "../compendium.js";

type NamedEntry={name?:string;compendiumId?:string|null;[key:string]:unknown};

const NATURE_COMPENDIUM_IDS:Record<string,string>={
  humain:"verite-055-19-formation-et-doctrine-de-chasseur",
  vampire:"verite-046-10-vampires",
  garou:"verite-047-11-garous-loups-descendants-de-khinae",
  khinae:"verite-048-12-autres-descendants-de-khinae",
  mage:"verite-049-13-mages",
  daemon:"verite-050-14-daemons",
  angelus:"verite-051-15-angelus",
  aseryn:"verite-052-16-aseryns",
  exile:"verite-053-17-exiles-peuples-fonctions-et-traditions",
  extral:"verite-054-18-extrals-homo-superior-et-adrak"
};

async function enrichNamed<T extends NamedEntry>(entry:T,category=""){
  const compendiumId=entry.name
    ?await resolveCompendiumId(String(entry.name),category)
    :null;
  return compendiumId?{...entry,compendiumId}:entry;
}

async function enrichCreationRules(){
  const rules=structuredClone(terraUmbraCreationRules) as any;
  for(const key of Object.keys(rules.origins??{})){
    rules.origins[key]=await enrichNamed(rules.origins[key],"Réalité");
  }
  for(const key of Object.keys(rules.spheres??{})){
    rules.spheres[key]=await enrichNamed(rules.spheres[key],"Réalité");
  }
  rules.styles=await Promise.all((rules.styles??[]).map((entry:NamedEntry)=>enrichNamed(entry,"Réalité")));
  for(const poolName of ["origin","sphere"]){
    for(const key of Object.keys(rules.talents?.[poolName]??{})){
      rules.talents[poolName][key]=await Promise.all(
        rules.talents[poolName][key].map((entry:NamedEntry)=>enrichNamed(entry,"Règles"))
      );
    }
  }
  for(const poolName of ["common","expertise"]){
    rules.talents[poolName]=await Promise.all(
      (rules.talents?.[poolName]??[]).map((entry:NamedEntry)=>enrichNamed(entry,"Règles"))
    );
  }

  const disadvantages=structuredClone(terraUmbraDisadvantages) as any;
  for(const poolName of ["common","attribute"]){
    disadvantages[poolName]=await Promise.all(
      (disadvantages?.[poolName]??[]).map((entry:NamedEntry)=>enrichNamed(entry,"Règles"))
    );
  }
  for(const key of Object.keys(disadvantages?.sphere??{})){
    disadvantages.sphere[key]=await Promise.all(
      disadvantages.sphere[key].map((entry:NamedEntry)=>enrichNamed(entry,"Règles"))
    );
  }

  return {rules,disadvantages};
}

async function enrichTruthRules(){
  const truth=structuredClone(terraUmbraTruthRules) as any;
  for(const [id,nature] of Object.entries(truth.structure?.natures??{})){
    const entry=nature as NamedEntry;
    truth.structure.natures[id]={
      ...entry,
      ...(NATURE_COMPENDIUM_IDS[id]?{compendiumId:NATURE_COMPENDIUM_IDS[id]}:{})
    };
  }
  for(const key of Object.keys(truth.catalogs??{})){
    truth.catalogs[key]=await Promise.all(
      truth.catalogs[key].map((entry:NamedEntry)=>enrichNamed(entry,"Règles"))
    );
  }
  return truth;
}

async function enrichRealityRules(){
  const reality=structuredClone(getRealityRules()) as any;
  reality.equipment=await Promise.all(
    (reality.equipment??[]).map((entry:NamedEntry)=>enrichNamed(entry,"Équipement & Objets"))
  );
  reality.augmentations=await Promise.all(
    (reality.augmentations??[]).map((entry:NamedEntry)=>enrichNamed(entry,"Équipement & Objets"))
  );
  reality.recurring=await Promise.all(
    (reality.recurring??[]).map((entry:NamedEntry)=>enrichNamed(entry,"Équipement & Objets"))
  );
  return reality;
}

type BuilderUsage={
  kind:string;
  label:string;
  step:"origin"|"sphere"|"talents"|"truth"|"disadvantages"|"equipment";
  detail?:string;
};

type TimedCache<T>={expires:number;promise:Promise<T>};
const RULE_CACHE_MS=60_000;
let creationCache:TimedCache<any>|null=null;
let truthCache:TimedCache<any>|null=null;
let realityCache:TimedCache<any>|null=null;

function cached<T>(slot:TimedCache<T>|null,create:()=>Promise<T>){
  const now=Date.now();
  if(slot&&slot.expires>now)return slot;
  return {expires:now+RULE_CACHE_MS,promise:create()};
}

function getEnrichedCreation(){
  creationCache=cached(creationCache,enrichCreationRules);
  return creationCache.promise;
}
function getEnrichedTruth(){
  truthCache=cached(truthCache,enrichTruthRules);
  return truthCache.promise;
}
function getEnrichedReality(){
  realityCache=cached(realityCache,enrichRealityRules);
  return realityCache.promise;
}

function usagePush(rows:BuilderUsage[],seen:Set<string>,entry:BuilderUsage){
  const key=`${entry.step}|${entry.kind}|${entry.label}`;
  if(seen.has(key))return;
  seen.add(key);
  rows.push(entry);
}

async function builderUsageFor(articleId:string):Promise<BuilderUsage[]>{
  const [creation,truth,reality]=await Promise.all([
    getEnrichedCreation(),
    getEnrichedTruth(),
    getEnrichedReality()
  ]);
  const rows:BuilderUsage[]=[];
  const seen=new Set<string>();

  for(const entry of Object.values(creation.rules.origins??{}) as NamedEntry[]){
    if(entry.compendiumId===articleId)usagePush(rows,seen,{kind:"Origine",label:String(entry.name??""),step:"origin"});
  }
  for(const entry of Object.values(creation.rules.spheres??{}) as NamedEntry[]){
    if(entry.compendiumId===articleId)usagePush(rows,seen,{kind:"Sphère",label:String(entry.name??""),step:"sphere"});
  }
  for(const entry of creation.rules.styles??[]){
    if(entry.compendiumId===articleId)usagePush(rows,seen,{kind:"Style",label:String(entry.name??""),step:"sphere"});
  }
  for(const pools of [creation.rules.talents?.origin,creation.rules.talents?.sphere]){
    for(const entries of Object.values(pools??{}) as NamedEntry[][]){
      for(const entry of entries){
        if(entry.compendiumId===articleId)usagePush(rows,seen,{kind:"Talent",label:String(entry.name??""),step:"talents"});
      }
    }
  }
  for(const poolName of ["common","expertise"]){
    for(const entry of creation.rules.talents?.[poolName]??[]){
      if(entry.compendiumId===articleId)usagePush(rows,seen,{kind:"Talent",label:String(entry.name??""),step:"talents"});
    }
  }

  for(const entries of [
    creation.disadvantages?.common??[],
    creation.disadvantages?.attribute??[],
    ...Object.values(creation.disadvantages?.sphere??{}) as NamedEntry[][]
  ]){
    for(const entry of entries as NamedEntry[]){
      if(entry.compendiumId===articleId)usagePush(rows,seen,{kind:"Désavantage",label:String(entry.name??""),step:"disadvantages"});
    }
  }

  for(const entry of Object.values(truth.structure?.natures??{}) as NamedEntry[]){
    if(entry.compendiumId===articleId)usagePush(rows,seen,{kind:"Nature",label:String(entry.name??""),step:"truth"});
  }
  for(const entries of Object.values(truth.catalogs??{}) as NamedEntry[][]){
    for(const entry of entries){
      if(entry.compendiumId===articleId){
        usagePush(rows,seen,{
          kind:"Talent de Vérité",
          label:String(entry.name??""),
          step:"truth",
          detail:String(entry.group??entry.access??"")
        });
      }
    }
  }

  for(const entry of reality.equipment??[]){
    if(entry.compendiumId===articleId){
      usagePush(rows,seen,{kind:"Équipement",label:String(entry.name??""),step:"equipment",detail:String(entry.category??"")});
    }
  }
  for(const entry of reality.augmentations??[]){
    if(entry.compendiumId===articleId){
      usagePush(rows,seen,{kind:"Augmentation",label:String(entry.name??""),step:"equipment",detail:String(entry.category??"")});
    }
  }

  return rows;
}

export async function registerRulesRoutes(app:FastifyInstance){
  app.get("/api/rulesets/terra-umbra/creation", async (request, reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    const enriched=await getEnrichedCreation();
    return {
      rules:enriched.rules,
      lore:terraUmbraCreationLore,
      talentChoiceSpecs:terraUmbraTalentChoiceSpecs,
      skillTalentMap:terraUmbraRealitySkillTalentMap,
      disadvantages:enriched.disadvantages,
      disadvantageLore:terraUmbraDisadvantageLore,
      edgeRules:terraUmbraEdgeRules
    };
  });

  app.get("/api/rulesets/terra-umbra/truth", async (request, reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    return getEnrichedTruth();
  });

  app.get("/api/rulesets/terra-umbra/reality", async (request, reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    return getEnrichedReality();
  });

  app.get<{Params:{id:string}}>("/api/compendium/builder-usage/:id", async (request)=>{
    const id=String(request.params.id??"").trim();
    return {articleId:id,usage:id?await builderUsageFor(id):[]};
  });
}
