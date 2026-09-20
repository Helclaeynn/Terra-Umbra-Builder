import type { FastifyInstance, FastifyReply } from "fastify";
import { requireUser } from "../auth.js";
import { terraUmbraCreationRules } from "./terra-umbra-creation.js";
import { terraUmbraCreationLore, terraUmbraTalentChoiceSpecs, terraUmbraRealitySkillTalentMap } from "./terra-umbra-creation-lore.js";
import { terraUmbraDisadvantages, terraUmbraDisadvantageLore, terraUmbraEdgeRules } from "./terra-umbra-disadvantages-edge.js";
import { terraUmbraTruthRules } from "./truth/rules.js";
import { getRealityRules } from "./reality.js";
import {
  findActiveCompendiumArticleById,
  findCompendiumHubMatches,
  findCompendiumMatches,
  resolveCompendiumHubId,
  resolveCompendiumId
} from "../compendium.js";
import { getTalentRegistry, queryTalentRegistry, talentRegistryMeta } from "./talent-registry.js";
import {
  BUILDER_ORIGIN_PAGE_IDS,
  BUILDER_SPHERE_PAGE_IDS,
  BUILDER_STYLE_PAGE_IDS
} from "../compendium-builder-references.js";

type NamedEntry={name?:string;compendiumId?:string|null;[key:string]:unknown};

const BUILDER_COMPENDIUM_ID_OVERRIDES:Record<string,string>={
  "armes-melee-phoenix-pck-08-feather":"equipement-003-phoenix-pck-08-feather",
  "armes-melee-phoenix-ba-037-sun-axe":"equipement-004-phoenix-ba-037-sun-axe",
  "armes-melee-raven-cl-038-claymore":"equipement-005-raven-cl-038-claymore",
  "armes-melee-raven-sp-016-raven-spear":"equipement-006-raven-sp-016-raven-spear",
  "armes-melee-phoenix-pw-026-vampire-killer":"equipement-009-phoenix-pw-026-vampire-killer",
  "armes-melee-raven-mc-025-hitman":"equipement-010-raven-mc-025-hitman",
  "armes-melee-owl-lc-014-chasseur":"equipement-011-owl-lc-014-chasseur",
  "armes-poing-tasers-raven-ht-014-immobilisateur":"equipement-017-raven-ht-014-immobilisateur",
  "armes-lourdes-bastion":"equipement-047-bastion",
  "munitions-speciales-raven-flash":"equipement-061-raven-flash",
  "munitions-speciales-raven-volto":"equipement-062-raven-volto",
  "munitions-speciales-raven-drill":"equipement-063-raven-drill",
  "munitions-speciales-phoenix-pyro":"equipement-065-phoenix-pyro",
  "armures-basiques-raven-black-feathers":"equipement-083-raven-black-feathers",
  "armures-basiques-raven-black-dog":"equipement-087-raven-black-dog",
  "armures-combat-raven-gallowglass-ii-legere":"equipement-091-raven-gallowglass-ii-legere",
  "armures-combat-raven-gallowglass-ii-lourde":"equipement-094-raven-gallowglass-ii-lourde"
};

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


const REALITY_TALENT_HUB_IDS={
  common:"regles-realite-talents-communs",
  expertise:{
    vigueur:"regles-realite-talents-expertise-vigueur",
    agilite:"regles-realite-talents-expertise-agilite",
    esprit:"regles-realite-talents-expertise-esprit",
    volonte:"regles-realite-talents-expertise-volonte",
    charisme:"regles-realite-talents-expertise-charisme"
  } as Record<string,string>,
  origin:{
    corporatiste:"regles-realite-talents-origine-origine-corporatiste",
    crawler:"regles-realite-talents-origine-origine-crawler",
    gouvernementale:"regles-realite-talents-origine-origine-gouvernementale",
    mafieuse:"regles-realite-talents-origine-origine-mafieuse",
    religieuse:"regles-realite-talents-origine-origine-religieuse"
  } as Record<string,string>,
  sphere:{
    corporatiste:"regles-realite-talents-sphere-corporatiste",
    crawler:"regles-realite-talents-sphere-crawler",
    gouvernementale:"regles-realite-talents-sphere-gouvernemental",
    mafieuse:"regles-realite-talents-sphere-pegre",
    religieuse:"regles-realite-talents-sphere-religieux"
  } as Record<string,string>
};

const REALITY_DISADVANTAGE_HUB_IDS:Record<string,string>={
  common:"regles-realite-desavantages-communs",
  attribute:"regles-realite-desavantages-attributs",
  sphere:"regles-realite-desavantages-sphere"
};

async function enrichNamed<T extends NamedEntry>(entry:T,category=""){
  const rawId=String((entry as Record<string,unknown>).id??"");
  const explicit=rawId?BUILDER_COMPENDIUM_ID_OVERRIDES[rawId]:undefined;
  const compendiumId=explicit??(
    entry.name
      ?await resolveCompendiumId(String(entry.name),category)
      :null
  );
  return compendiumId?{...entry,compendiumId}:entry;
}


async function enrichNamedWithHub<T extends NamedEntry>(
  entry:T,
  hubId:string|undefined,
  category="Règles"
){
  const enriched=await enrichNamed(entry,category);
  if(enriched.compendiumId||!hubId)return enriched;
  return {...enriched,compendiumId:hubId};
}

async function enrichCreationRules(){
  const rules=structuredClone(terraUmbraCreationRules) as any;
  for(const key of Object.keys(rules.origins??{})){
    rules.origins[key]={
      ...rules.origins[key],
      compendiumId:BUILDER_ORIGIN_PAGE_IDS[key]
    };
  }
  for(const key of Object.keys(rules.spheres??{})){
    rules.spheres[key]={
      ...rules.spheres[key],
      compendiumId:BUILDER_SPHERE_PAGE_IDS[key]
    };
  }
  rules.styles=await Promise.all((rules.styles??[]).map(async(entry:NamedEntry)=>{
    const enriched=await enrichNamed(entry,"Réalité");
    if(enriched.compendiumId)return enriched;
    const styleId=String((entry as Record<string,unknown>).id??"");
    const compendiumId=BUILDER_STYLE_PAGE_IDS[styleId];
    return compendiumId?{...enriched,compendiumId}:enriched;
  }));
  for(const poolName of ["origin","sphere"] as const){
    for(const key of Object.keys(rules.talents?.[poolName]??{})){
      const hubId=REALITY_TALENT_HUB_IDS[poolName][key];
      rules.talents[poolName][key]=await Promise.all(
        rules.talents[poolName][key].map((entry:NamedEntry)=>enrichNamedWithHub(entry,hubId))
      );
    }
  }
  rules.talents.common=await Promise.all(
    (rules.talents?.common??[]).map((entry:NamedEntry)=>
      enrichNamedWithHub(entry,REALITY_TALENT_HUB_IDS.common)
    )
  );
  rules.talents.expertise=await Promise.all(
    (rules.talents?.expertise??[]).map((entry:NamedEntry)=>
      enrichNamedWithHub(
        entry,
        REALITY_TALENT_HUB_IDS.expertise[String((entry as Record<string,unknown>).attribute??"")]
      )
    )
  );

  const disadvantages=structuredClone(terraUmbraDisadvantages) as any;
  for(const poolName of ["common","attribute"] as const){
    disadvantages[poolName]=await Promise.all(
      (disadvantages?.[poolName]??[]).map((entry:NamedEntry)=>
        enrichNamedWithHub(entry,REALITY_DISADVANTAGE_HUB_IDS[poolName])
      )
    );
  }
  for(const key of Object.keys(disadvantages?.sphere??{})){
    disadvantages.sphere[key]=await Promise.all(
      disadvantages.sphere[key].map((entry:NamedEntry)=>
        enrichNamedWithHub(entry,REALITY_DISADVANTAGE_HUB_IDS.sphere)
      )
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
      truth.catalogs[key].map(async(entry:NamedEntry)=>{
        const enriched=await enrichNamed(entry,"Règles");
        if(enriched.compendiumId)return enriched;
        const group=String((entry as Record<string,unknown>).group??"").trim();
        if(!group)return enriched;
        const hubId=await resolveCompendiumHubId(group,key);
        return hubId?{...enriched,compendiumId:hubId}:enriched;
      })
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

let creationPromise:Promise<any>|null=null;
let truthPromise:Promise<any>|null=null;
let realityPromise:Promise<any>|null=null;

function getEnrichedCreation(){
  creationPromise??=enrichCreationRules();
  return creationPromise;
}
function getEnrichedTruth(){
  truthPromise??=enrichTruthRules();
  return truthPromise;
}
function getEnrichedReality(){
  realityPromise??=enrichRealityRules();
  return realityPromise;
}

export async function preloadBuilderRules():Promise<void>{
  const started=performance.now();
  const [creation,truth,reality]=await Promise.all([
    getEnrichedCreation(),
    getEnrichedTruth(),
    getEnrichedReality()
  ]);
  const elapsed=Math.round(performance.now()-started);
  const equipmentCount=Number(reality?.equipment?.length??0);
  const truthTalentCount=Object.values(truth?.catalogs??{}).reduce(
    (sum:number,entries:any)=>sum+(Array.isArray(entries)?entries.length:0),
    0
  );
  console.info(
    `Builder rules preloaded in ${elapsed} ms · ${creation?.rules?.styles?.length??0} styles · ${truthTalentCount} talents Vérité · ${equipmentCount} équipements`
  );
}

function usagePush(rows:BuilderUsage[],seen:Set<string>,entry:BuilderUsage){
  const key=`${entry.step}|${entry.kind}|${entry.label}`;
  if(seen.has(key))return;
  seen.add(key);
  rows.push(entry);
}

type BuilderCatalogEntry={
  key:string;
  family:string;
  kind:string;
  label:string;
  category:string;
  step:BuilderUsage["step"];
  compendiumId?:string|null;
  mechanics:Record<string,unknown>;
};

function mechanicalSnapshot(entry:Record<string,unknown>):Record<string,unknown>{
  const keys=[
    "id","name","category","sourceCategory","effect","prerequisite","prerequisiteName",
    "cost","access","group","generation","price","priceMin","priceMax","priceLabel",
    "charge","stress","slots","lifestyle","account","augmentationEnvelope","vehicleCapital",
    "skills","expertiseFamilies","support","fixedSkills","recurring","monthlyCost","vehicle","neuro",
    "attribute","skill","sphere","originId"
  ];
  const result:Record<string,unknown>={};
  for(const key of keys){
    const value=entry[key];
    if(value===undefined||value===null||value==="")continue;
    result[key]=value;
  }
  return result;
}

function catalogPush(
  rows:BuilderCatalogEntry[],
  seen:Set<string>,
  entry:NamedEntry,
  meta:{key:string;family:string;kind:string;category:string;step:BuilderUsage["step"]}
){
  const label=String(entry.name??"").trim();
  if(!label)return;
  const identity=`${meta.family}|${String((entry as any).id??meta.key)}|${label}`;
  if(seen.has(identity))return;
  seen.add(identity);
  rows.push({
    ...meta,
    label,
    compendiumId:entry.compendiumId,
    mechanics:mechanicalSnapshot(entry)
  });
}

async function builderCatalogEntries():Promise<BuilderCatalogEntry[]>{
  const [creation,truth,reality]=await Promise.all([
    getEnrichedCreation(),
    getEnrichedTruth(),
    getEnrichedReality()
  ]);
  const rows:BuilderCatalogEntry[]=[];
  const seen=new Set<string>();

  for(const [key,entry] of Object.entries(creation.rules.origins??{}) as Array<[string,NamedEntry]>){
    catalogPush(rows,seen,entry,{key,family:"origins",kind:"Origine",category:"Réalité",step:"origin"});
  }
  for(const [key,entry] of Object.entries(creation.rules.spheres??{}) as Array<[string,NamedEntry]>){
    catalogPush(rows,seen,entry,{key,family:"spheres",kind:"Sphère",category:"Réalité",step:"sphere"});
  }
  for(const entry of creation.rules.styles??[]){
    catalogPush(rows,seen,entry,{key:String(entry.id??entry.name??""),family:"styles",kind:"Style",category:"Réalité",step:"sphere"});
  }

  for(const [poolName,pools] of Object.entries({
    origin:creation.rules.talents?.origin??{},
    sphere:creation.rules.talents?.sphere??{}
  })){
    for(const [scope,entries] of Object.entries(pools) as Array<[string,NamedEntry[]]>){
      for(const entry of entries){
        catalogPush(rows,seen,entry,{
          key:`${poolName}:${scope}:${String((entry as any).id??entry.name??"")}`,
          family:"reality-talents",kind:"Talent",category:"Règles",step:"talents"
        });
      }
    }
  }
  for(const poolName of ["common","expertise"]){
    for(const entry of creation.rules.talents?.[poolName]??[]){
      catalogPush(rows,seen,entry,{
        key:`${poolName}:${String(entry.id??entry.name??"")}`,
        family:"reality-talents",kind:"Talent",category:"Règles",step:"talents"
      });
    }
  }

  for(const [poolName,entries] of Object.entries({
    common:creation.disadvantages?.common??[],
    attribute:creation.disadvantages?.attribute??[]
  }) as Array<[string,NamedEntry[]]>){
    for(const entry of entries){
      catalogPush(rows,seen,entry,{
        key:`${poolName}:${String((entry as any).id??entry.name??"")}`,
        family:"disadvantages",kind:"Désavantage",category:"Règles",step:"disadvantages"
      });
    }
  }
  for(const [scope,entries] of Object.entries(creation.disadvantages?.sphere??{}) as Array<[string,NamedEntry[]]>){
    for(const entry of entries){
      catalogPush(rows,seen,entry,{
        key:`sphere:${scope}:${String((entry as any).id??entry.name??"")}`,
        family:"disadvantages",kind:"Désavantage",category:"Règles",step:"disadvantages"
      });
    }
  }

  for(const [key,entry] of Object.entries(truth.structure?.natures??{}) as Array<[string,NamedEntry]>){
    catalogPush(rows,seen,entry,{key,family:"natures",kind:"Nature",category:"Vérité",step:"truth"});
  }
  for(const [scope,entries] of Object.entries(truth.catalogs??{}) as Array<[string,NamedEntry[]]>){
    for(const entry of entries){
      catalogPush(rows,seen,entry,{
        key:`${scope}:${String((entry as any).id??entry.name??"")}`,
        family:"truth-talents",kind:"Talent de Vérité",category:"Règles",step:"truth"
      });
    }
  }

  for(const entry of reality.equipment??[]){
    catalogPush(rows,seen,entry,{
      key:String(entry.id??entry.name??""),family:"equipment",kind:"Équipement",
      category:"Équipement & Objets",step:"equipment"
    });
  }
  for(const entry of reality.augmentations??[]){
    catalogPush(rows,seen,entry,{
      key:String(entry.id??entry.name??""),family:"augmentations",kind:"Augmentation",
      category:"Équipement & Objets",step:"equipment"
    });
  }
  for(const entry of reality.recurring??[]){
    catalogPush(rows,seen,entry,{
      key:String(entry.id??entry.name??""),family:"recurring",kind:"Charge / service",
      category:"Équipement & Objets",step:"equipment"
    });
  }

  return rows;
}

async function builderCoverage(){
  const entries=await builderCatalogEntries();
  const audited=await Promise.all(entries.map(async(entry)=>{
    if(entry.compendiumId){
      return {...entry,status:"linked" as const,matches:[{id:entry.compendiumId,title:entry.label,category:entry.category}]};
    }
    const matches=await findCompendiumMatches(entry.label,entry.category);
    return {
      ...entry,
      status:(matches.length>1?"ambiguous":"missing") as "ambiguous"|"missing",
      matches
    };
  }));
  const familyMap=new Map<string,{family:string;total:number;linked:number;missing:number;ambiguous:number}>();
  for(const item of audited){
    const row=familyMap.get(item.family)??{family:item.family,total:0,linked:0,missing:0,ambiguous:0};
    row.total+=1;
    row[item.status]+=1;
    familyMap.set(item.family,row);
  }
  return {
    summary:{
      total:audited.length,
      linked:audited.filter(item=>item.status==="linked").length,
      missing:audited.filter(item=>item.status==="missing").length,
      ambiguous:audited.filter(item=>item.status==="ambiguous").length
    },
    families:[...familyMap.values()].sort((a,b)=>a.family.localeCompare(b.family)),
    items:audited
  };
}

async function builderSourceFor(articleId:string){
  const entries=await builderCatalogEntries();
  return entries.filter(entry=>entry.compendiumId===articleId);
}

async function requireEditorUser(request:any,reply:FastifyReply){
  const user=await requireUser(request,reply);
  if(!user)return null;
  if(user.role!=="editor"&&user.role!=="admin"){
    reply.code(403).send({error:"editor_required"});
    return null;
  }
  return user;
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
    if(!id)return {articleId:id,usage:[],sources:[]};
    const [usage,sources]=await Promise.all([
      builderUsageFor(id),
      builderSourceFor(id)
    ]);
    return {articleId:id,usage,sources};
  });

  app.get("/api/compendium/editor/builder-coverage", async (request,reply)=>{
    const user=await requireEditorUser(request,reply);
    if(!user)return;
    return builderCoverage();
  });

  app.get<{Params:{id:string}}>("/api/compendium/editor/builder-source/:id", async (request,reply)=>{
    const user=await requireEditorUser(request,reply);
    if(!user)return;
    const id=String(request.params.id??"").trim();
    return {articleId:id,records:id?await builderSourceFor(id):[]};
  });

  app.get<{Querystring:{natureId?:string;groupId?:string;ids?:string}}>("/api/compendium/talents", async (request)=>{
    const natureId=String(request.query.natureId??"").trim()||undefined;
    const groupId=String(request.query.groupId??"").trim()||undefined;
    const ids=String(request.query.ids??"")
      .split(",")
      .map(value=>value.trim())
      .filter(Boolean);
    const items=queryTalentRegistry({natureId,groupId,ids});
    return {items,total:items.length};
  });

  app.get("/api/compendium/talents/meta", async ()=>{
    return talentRegistryMeta();
  });

  app.get("/api/compendium/editor/talent-hub-audit", async (request,reply)=>{
    const user=await requireEditorUser(request,reply);
    if(!user)return;
    const meta=talentRegistryMeta();
    const registry=getTalentRegistry();
    const groups=await Promise.all(meta.groups.map(async group=>{
      const rows=registry.filter(row=>row.groupId===group.groupId);
      const boundIds=[...new Set(rows.map(row=>row.compendiumId).filter((id):id is string=>Boolean(id)))];
      if(boundIds.length){
        const resolved=(await Promise.all(boundIds.map(id=>findActiveCompendiumArticleById(id))))
          .filter((match):match is NonNullable<typeof match>=>Boolean(match));
        return {...group,matches:resolved,matchType:"binding",boundIds};
      }

      const exactMatches=(await findCompendiumMatches(group.label,"Règles"))
        .filter(match=>match.category!=="OLD");
      const matches=exactMatches.length
        ?exactMatches
        :await findCompendiumHubMatches(group.label,group.natureId);
      return {...group,matches,matchType:exactMatches.length?"exact":"hub",boundIds:[]};
    }));
    const natures=await Promise.all(meta.natures.map(async natureId=>{
      const rows=registry.filter(row=>row.natureId===natureId);
      return {natureId,count:rows.length};
    }));
    const resolvedTargetMatches=groups.filter(group=>group.matches.length===1).length;
    const directBindingMatches=groups.filter(group=>group.matchType==="binding"&&group.matches.length===1).length;
    return {
      totalTalents:meta.total,
      exactGroupMatches:groups.filter(group=>group.matchType==="exact"&&group.matches.length===1).length,
      directBindingMatches,
      resolvedTargetMatches,
      // Backward-compatible alias: this now means a resolved Compendium target,
      // not that a generated one-page-per-group hub exists.
      resolvedHubMatches:resolvedTargetMatches,
      inferredHubMatches:groups.filter(group=>group.matchType==="hub"&&group.matches.length===1).length,
      ambiguousGroupMatches:groups.filter(group=>group.matches.length>1).length,
      missingGroupMatches:groups.filter(group=>group.matches.length===0).length,
      groups,
      natures
    };
  });
}
