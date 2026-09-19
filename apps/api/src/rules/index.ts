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

export async function registerRulesRoutes(app:FastifyInstance){
  app.get("/api/rulesets/terra-umbra/creation", async (request, reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    const enriched=await enrichCreationRules();
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
    return enrichTruthRules();
  });

  app.get("/api/rulesets/terra-umbra/reality", async (request, reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    return enrichRealityRules();
  });
}
