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

export function ensureTruthRulesPackage(pkg:TruthRulesPackage):TruthRulesPackage{
  return {
    ...pkg,
    equipment:Array.isArray(pkg.equipment)?pkg.equipment:[],
    corruption:{
      sources:Array.isArray(pkg.corruption?.sources)?pkg.corruption.sources:[],
      precedence:Array.isArray(pkg.corruption?.precedence)?pkg.corruption.precedence:[],
      talents:Array.isArray(pkg.corruption?.talents)?pkg.corruption.talents:[]
    }
  };
}

export function truthNorm(value=""){
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase()
    .replace(/[’']/g,"'")
    .replace(/[^a-z0-9]+/g," ")
    .trim();
}

function stringChoice(choices:Record<string,unknown>,key:string){
  const value=choices[key];
  return typeof value==="string"?value:"";
}

export type TruthEquipmentAccess={
  ok:boolean;
  natural:boolean;
  reason:string;
};

export function truthEquipmentAccess(item:TruthEquipmentItem,state:TruthState):TruthEquipmentAccess{
  if(item.referenceOnly){
    return {ok:true,natural:true,reason:"Référence commune"};
  }
  if(state.truthEquipmentMjOverride){
    return {ok:true,natural:false,reason:"Autorisation MJ exceptionnelle"};
  }
  if(item.requiresMj){
    return {ok:false,natural:false,reason:"Autorisation MJ requise"};
  }

  const hunterTradition=stringChoice(state.choices,"hunterTradition");
  const species=stringChoice(state.choices,"species");
  const network=stringChoice(state.choices,"network");

  if(item.chapter==="23"){
    const ok=!!hunterTradition&&hunterTradition!=="aucune";
    return {
      ok,
      natural:ok,
      reason:ok?"Tradition de Chasse":"Réservé aux personnages ayant une tradition de Chasse"
    };
  }
  if(item.chapter==="24"){
    const ok=state.nature==="exile";
    return {
      ok,
      natural:ok,
      reason:ok?"Accès Exilé / Aèr":"Réservé aux Exilés ou à une autorisation MJ"
    };
  }
  if(item.chapter==="25"){
    const ok=state.nature==="extral";
    return {
      ok,
      natural:ok,
      reason:ok?"Accès Extral / marché xéno":"Réservé aux Extrals ou à une autorisation MJ"
    };
  }
  if(item.chapter==="26"){
    const aidhNetwork=network==="aidh_intervention"||network==="aidh_coherence";
    const ok=state.nature==="extral"&&(species==="homo_superior"||aidhNetwork);
    return {
      ok,
      natural:ok,
      reason:ok?"Habilitation AIDH":"Réservé aux Homo Superior / personnels AIDH autorisés"
    };
  }
  if(item.chapter==="27"){
    return {ok:false,natural:false,reason:"Équipement corrompu : autorisation MJ requise"};
  }

  return {ok:false,natural:false,reason:"Accès fictionnel non ouvert par la fiche"};
}

export function truthEquipmentVisible(item:TruthEquipmentItem,state:TruthState){
  return item.referenceOnly||truthEquipmentAccess(item,state).ok;
}

export function truthEquipmentInvalidIds(pkg:TruthRulesPackage,state:TruthState){
  const byId=new Map((pkg.equipment??[]).map(item=>[item.id,item]));
  return (state.truthEquipment??[]).filter(id=>{
    const item=byId.get(id);
    return !item||!truthEquipmentAccess(item,state).ok;
  });
}

export function truthChoiceOptions(choice:TruthChoice,choices:Record<string,unknown>){
  if(choice.optionsBy&&choice.dependsOn){
    return choice.optionsBy[stringChoice(choices,choice.dependsOn)]??choice.options??[];
  }
  return choice.options??[];
}

export function truthSanitizeChoices(nature:TruthNature,source:Record<string,unknown>){
  const next:{[key:string]:string}={};
  for(const choice of nature.choices){
    const options=truthChoiceOptions(choice,{...source,...next});
    const value=stringChoice(source,choice.key);
    const valid=options.some(option=>option.id===value);
    if(valid)next[choice.key]=value;
    else if(choice.optional&&options.some(option=>option.id==="aucune"))next[choice.key]="aucune";
    else next[choice.key]="";
  }
  return next;
}

function whenMatches(when:Record<string,string|string[]>|undefined,choices:Record<string,unknown>){
  if(!when)return null;
  const pairs=Object.entries(when);
  if(!pairs.length)return null;
  return pairs.every(([key,want])=>{
    const got=stringChoice(choices,key);
    return Array.isArray(want)?want.includes(got):got===want;
  });
}

function groupHas(group:string,needles:readonly string[]|undefined){
  const normalized=truthNorm(group);
  return !!needles?.some(needle=>normalized.includes(truthNorm(needle)));
}

function hunterDoctrine(talent:TruthTalent){
  const group=truthNorm(talent.group||"");
  const name=truthNorm(talent.name||"");
  return group.includes("doctrine commune de chasse")||
    ["rompu aux horreurs","fenetre de chasse","frapper la faiblesse","mise a mort preparee"].includes(name);
}

function visibleNativeTalent(pkg:TruthRulesPackage,state:TruthState,talent:TruthTalent){
  const nature=state.nature;
  const group=truthNorm(talent.group||"");
  const cost=Number(talent.cost||0);
  if(!(cost>0&&cost<=3))return false;

  const exact=whenMatches(talent.when,state.choices);
  if(exact!==null)return exact;

  const needles=pkg.visibility.needles;
  if(nature==="humain"){
    const tradition=stringChoice(state.choices,"hunterTradition")||"aucune";
    if(tradition==="aucune"||tradition==="chasse_fantastique")return false;
    return groupHas(group,needles.humain?.[tradition]);
  }
  if(nature==="vampire"){
    if(group.includes("vampire commun"))return true;
    return groupHas(group,needles.vampire?.[stringChoice(state.choices,"court")])||
      groupHas(group,needles.vampire?.[stringChoice(state.choices,"blood")]);
  }
  if(nature==="garou"){
    if(group.includes("garou commun")||group.includes("maitrise d un sang")||group.includes("eveiller d autres sangs"))return true;
    return groupHas(group,needles.garou?.[stringChoice(state.choices,"pelage")])||
      groupHas(group,needles.garou?.[stringChoice(state.choices,"blood")]);
  }
  if(nature==="khinae"){
    return groupHas(group,needles.khinae?.[stringChoice(state.choices,"lineage")])||
      groupHas(group,needles.garou?.[stringChoice(state.choices,"blood")]);
  }
  if(nature==="daemon"){
    if(group.includes("talents communs de nature"))return true;
    if(group.includes("formation secondaire"))return false;
    return groupHas(group,needles.daemon?.[stringChoice(state.choices,"function")])||
      groupHas(group,needles.daemon?.[stringChoice(state.choices,"divinity")]);
  }
  if(nature==="angelus"){
    if(group.includes("talents communs")||group.includes("progression de transcendance"))return true;
    return groupHas(group,needles.angelus?.[stringChoice(state.choices,"angelNature")])||
      groupHas(group,needles.angelus?.[stringChoice(state.choices,"sephirah")]);
  }
  if(nature==="aseryn"){
    if(group.includes("routes communes aserynes"))return true;
    return groupHas(group,needles.aseryn?.[stringChoice(state.choices,"origin")])||
      groupHas(group,needles.aseryn?.[stringChoice(state.choices,"tradition")])||
      groupHas(group,needles.aseryn?.[stringChoice(state.choices,"seratheenTradition")]);
  }
  if(nature==="exile"){
    return groupHas(group,needles.exile?.[stringChoice(state.choices,"people")])||
      groupHas(group,needles.exile?.[stringChoice(state.choices,"network")]);
  }
  if(nature==="extral"){
    return groupHas(group,needles.extral?.[stringChoice(state.choices,"species")])||
      groupHas(group,needles.extral?.[stringChoice(state.choices,"network")]);
  }
  return true;
}

function mageTemplates(pkg:TruthRulesPackage){
  return pkg.catalogs.mage??[];
}

function mageTemplate(pkg:TruthRulesPackage,kind:"mastery"|"amplitude",name:string){
  return mageTemplates(pkg).find(talent=>
    truthNorm(talent.group).includes(kind==="mastery"?"maitrise":"amplitude")&&
    truthNorm(talent.name)===truthNorm(name)
  );
}

function mageNativeAffinities(pkg:TruthRulesPackage,state:TruthState){
  const nature=pkg.structure.natures.mage;
  const choice=nature?.choices.find(item=>item.key==="dominantAffinity");
  return choice?truthChoiceOptions(choice,state.choices):[];
}

function mageProgression(pkg:TruthRulesPackage,affinity:TruthChoiceOption){
  const defs:Array<[string,string,number,string,"mastery"|"amplitude",string]>=[
    ["mastery_affinee","Maîtrise Affinée",1,"","mastery","Affinée"],
    ["mastery_superieure","Maîtrise Supérieure",2,`Maîtrise Affinée — ${affinity.name}`,"mastery","Supérieure"],
    ["mastery_magistrale","Maîtrise Magistrale",3,`Maîtrise Supérieure — ${affinity.name}`,"mastery","Magistrale"],
    ["amplitude_significative","Amplitude Significative",1,"","amplitude","Significative"],
    ["amplitude_majeure","Amplitude Majeure",2,`Amplitude Significative — ${affinity.name}`,"amplitude","Majeure"],
    ["amplitude_cataclysmique","Amplitude Cataclysmique",3,`Amplitude Majeure — ${affinity.name}`,"amplitude","Cataclysmique"]
  ];
  return defs.map(([suffix,label,cost,prerequisiteName,kind,templateName])=>{
    const template=mageTemplate(pkg,kind,templateName);
    return {
      id:`mage_${affinity.id}_${suffix}`,
      name:`${label} — ${affinity.name}`,
      cost,
      access:"Progression",
      prerequisiteName,
      group:`Affinité — ${affinity.name}`,
      effect:template?.effect??`Progression de ${affinity.name}.`,
      runtimeLore:template?.runtimeLore??"",
      mageAffinity:affinity.id,
      mageProgress:true
    } satisfies TruthTalent;
  });
}

function mageAllTalents(pkg:TruthRulesPackage,state:TruthState){
  const dominant=stringChoice(state.choices,"dominantAffinity");
  const common=mageTemplates(pkg).filter(talent=>{
    const group=truthNorm(talent.group||"");
    return !group.includes("maitrise")&&!group.includes("amplitude");
  });
  const entries:TruthTalent[]=[...common];
  for(const affinity of mageNativeAffinities(pkg,state)){
    if(affinity.id!==dominant){
      entries.push({
        id:`mage_awaken_${affinity.id}`,
        name:`Éveiller ${affinity.name}`,
        cost:1,
        access:"Progression",
        prerequisiteName:"Progression préalable dans une Affinité native",
        group:"Affinités natives supplémentaires",
        effect:`Ouvre ${affinity.name} au niveau Maîtrise Initiale / Amplitude Mineure.`,
        runtimeLore:`Le Mageius possède déjà cette Affinité dans sa structure native. Le Mage apprend à l’ouvrir consciemment comme une seconde voie réelle, distincte de son Affinité dominante.`,
        mageAwaken:affinity.id
      });
    }
    entries.push(...mageProgression(pkg,affinity));
  }
  return entries;
}

function mageOwnedAffinities(state:TruthState){
  const owned=new Set<string>();
  const dominant=stringChoice(state.choices,"dominantAffinity");
  if(dominant)owned.add(dominant);
  for(const id of state.truthTalents){
    const match=id.match(/^mage_awaken_(.+)$/);
    if(match)owned.add(match[1]);
  }
  return owned;
}

function availableMageTalents(pkg:TruthRulesPackage,state:TruthState){
  if(!stringChoice(state.choices,"mageiusType")||!stringChoice(state.choices,"dominantAffinity"))return [];
  const owned=mageOwnedAffinities(state);
  return mageAllTalents(pkg,state).filter(talent=>!talent.mageProgress||owned.has(talent.mageAffinity||""));
}

export function truthAvailableTalents(pkg:TruthRulesPackage,state:TruthState){
  if(state.consciousness==="profane")return [];
  let rows:TruthTalent[];
  if(state.nature==="mage")rows=availableMageTalents(pkg,state);
  else rows=(pkg.catalogs[state.nature]??[]).filter(talent=>visibleNativeTalent(pkg,state,talent));

  const hunterTradition=stringChoice(state.choices,"hunterTradition")||"aucune";
  if(pkg.visibility.sharedHunterNatures.includes(state.nature as never)&&hunterTradition!=="aucune"){
    const hunterNeedles=pkg.visibility.needles.humain?.[hunterTradition];
    const hunter=(pkg.catalogs.humain??[]).filter(talent=>
      hunterDoctrine(talent)||groupHas(talent.group,hunterNeedles)
    );
    rows=[...rows,...hunter];
  }

  const unique=new Map<string,TruthTalent>();
  for(const talent of rows)unique.set(talent.id,talent);
  return [...unique.values()];
}

export function truthSelectedFreeTraits(pkg:TruthRulesPackage,state:TruthState){
  const nature=pkg.structure.natures[state.nature];
  if(!nature)return [];
  const rows:TruthTrait[]=[...(nature.baseFreeTraits??[])];
  for(const rule of nature.freeTraitRules??[]){
    if(whenMatches(rule.when,state.choices))rows.push(...rule.traits);
  }
  const unique=new Map<string,TruthTrait>();
  for(const trait of rows){
    unique.set(`${trait.name}|${trait.source||""}|${trait.effect}`,trait);
  }
  return [...unique.values()];
}

export type TruthRevealStage="v"|"sr"|"r";

export function truthTraitStages(access=""){
  const value=access.toUpperCase();
  return {
    v:value.includes("V"),
    sr:value.includes("SR"),
    r:value.includes("R")
  };
}

export function truthTraitsForStage(
  pkg:TruthRulesPackage,
  state:TruthState,
  stage:TruthRevealStage
){
  return truthSelectedFreeTraits(pkg,state)
    .filter(trait=>truthTraitStages(trait.access)[stage]);
}

function truthChoiceLabel(pkg:TruthRulesPackage,state:TruthState,key:string){
  const nature=pkg.structure.natures[state.nature];
  const choice=nature?.choices.find(item=>item.key===key);
  if(!choice)return "";
  const selected=stringChoice(state.choices,key);
  return truthChoiceOptions(choice,state.choices).find(option=>option.id===selected)?.name??"";
}

export function truthPermanentAttributeBonus(
  state:TruthState,
  attributeId:string
){
  const hunterMemory=
    state.nature==="humain"&&
    state.consciousness==="initie"&&
    (stringChoice(state.choices,"hunterTradition")||"aucune")!=="aucune";
  return hunterMemory&&attributeId==="volonte"?1:0;
}

export function truthRevelationProfile(pkg:TruthRulesPackage,state:TruthState){
  const nature=state.nature;
  const choices=state.choices;
  const revelation=pkg.revelation;
  const defaultBody=revelation.bodies[nature]??{
    v:"État voilé.",
    sr:"État semi-révélé.",
    r:"État révélé."
  };
  let body={...defaultBody};
  let label=pkg.structure.natures[nature]?.name??"Nature";
  let stats={v:"Aucun bonus chiffré renseigné",sr:"Voir capacités SR",r:"Voir capacités R"};

  const hunterMemory=
    nature==="humain"&&
    state.consciousness==="initie"&&
    (stringChoice(choices,"hunterTradition")||"aucune")!=="aucune";

  if(nature==="humain"){
    label=hunterMemory?"Humain Chasseur · mémoire du Voile":"Humain";
    stats=hunterMemory
      ? {
          v:"+1 Volonté permanent",
          sr:"+1 Volonté permanent · aucun bonus SR supplémentaire",
          r:"+1 Volonté permanent · aucun bonus R supplémentaire"
        }
      : {
          v:"Aucun bonus de Nature",
          sr:"Aucun bonus racial : être Initié n’est pas une transformation physique",
          r:"Aucun bonus racial : un Humain ne possède pas de forme Révélée propre"
        };
    if(hunterMemory){
      body={
        v:"Le Chasseur reste humain, mais sa mémoire a franchi le seuil : le +1 Volonté est permanent, même Voilé.",
        sr:"Toujours humain. Les capacités SR de sa tradition peuvent s’exprimer ; le +1 Volonté permanent reste inclus et aucun second bonus racial ne s’ajoute.",
        r:"Toujours humain d’apparence. Sa condition de Chasseur est pleinement lisible aux perceptions adaptées ; le +1 Volonté permanent reste son seul modificateur commun."
      };
    }
  }else if(nature==="vampire"){
    label="Nature Vampire";
    stats={
      v:"Aucun bonus de Nature",
      sr:"+1 Vigueur · +1 Volonté",
      r:"+2 Vigueur · +1 Volonté"
    };
  }else if(nature==="mage"){
    label="Mageius ouvert";
    stats={
      v:"Aucune modification",
      sr:"+1 Esprit · +1 Volonté",
      r:"+1 Esprit · +2 Volonté"
    };
  }else if(nature==="daemon"){
    const id=stringChoice(choices,"divinity");
    const row=revelation.daemonStats[id];
    label=truthChoiceLabel(pkg,state,"divinity")||"Divinité à choisir";
    stats={
      v:"Aucun bonus daemoniaque d’Attribut",
      sr:row?.sr??"Choisir une Divinité",
      r:row?.r??"Choisir une Divinité"
    };
  }else if(nature==="angelus"){
    const id=stringChoice(choices,"sephirah");
    const row=revelation.angelusStats[id];
    label=truthChoiceLabel(pkg,state,"sephirah")||"Sephirah à choisir";
    stats={
      v:"Aucun bonus céleste d’Attribut",
      sr:row?.sr??"Choisir une Sephirah",
      r:row?.r??"Choisir une Sephirah"
    };
  }else if(nature==="aseryn"){
    const id=stringChoice(choices,"origin");
    const row=revelation.aserynStats[id];
    label=truthChoiceLabel(pkg,state,"origin")||"Origine aseryne à choisir";
    stats={
      v:"Aucun modificateur racial commun",
      sr:row?.sr??"+1 Agilité commun, puis empreinte de l’Origine",
      r:row?.r??"+2 Agilité commun, puis empreinte de l’Origine"
    };
  }else if(nature==="exile"){
    const id=stringChoice(choices,"people");
    const row=revelation.exileStats[id];
    label=truthChoiceLabel(pkg,state,"people")||"Peuple exilé à choisir";
    stats={
      v:"Traduction humaine/plausible · aucun bonus racial",
      sr:row?.sr??"Choisir un peuple",
      r:row?.r??"Choisir un peuple"
    };
  }else if(nature==="extral"){
    const id=stringChoice(choices,"species");
    const row=revelation.extralStats[id];
    label=truthChoiceLabel(pkg,state,"species")||"Profil extral à choisir";
    stats={
      v:"Traduction humaine/plausible · aucun bonus racial",
      sr:row?.sr??"Choisir un profil",
      r:row?.r??"Choisir un profil"
    };
  }else if(nature==="garou"){
    const chained=stringChoice(choices,"blood")==="sang_enchaine";
    label=chained?"Garou · Sang Enchaîné":"Garou";
    stats=chained
      ? {
          v:"Aucun bonus de Nature",
          sr:"Aucun bonus d’Attribut automatique · instincts/sens SR",
          r:"+2 Vigueur · +2 Agilité · +3 Pugilat · +1 PA/round · forme hybride interdite"
        }
      : {
          v:"Aucun bonus de Nature",
          sr:"Aucun bonus d’Attribut automatique · instincts/sens SR",
          r:"Humain révélé : aucun gros bonus automatique · Loup : +2 Agilité · morsure DGT 3 · Hybride : +3 Vigueur · +2 Agilité · +3 Pugilat · griffes/crocs DGT 5 · Armure 2 · Régénération 2 PV/round · +1 PA/round"
        };
  }else if(nature==="khinae"){
    const lineage=stringChoice(choices,"lineage");
    const variant=stringChoice(choices,"variant");
    const base=revelation.khinaeBase[lineage];
    const variantStats=revelation.khinaeVariant[lineage]?.[variant];
    const suffix=variantStats?` · Variante hybride sélectionnée : ${variantStats}`:"";
    label=[
      truthChoiceLabel(pkg,state,"lineage"),
      truthChoiceLabel(pkg,state,"variant")
    ].filter(Boolean).join(" · ")||"Lignée à choisir";
    stats={
      v:"Aucun bonus de Nature",
      sr:"Aucun bonus d’Attribut commun · instincts/perceptions SR de Lignée",
      r:base
        ? `Humain révélé : aucun bonus d’Attribut automatique · Animal : ${base.animal} · Hybride : ${base.hybrid}${suffix}`
        : "Choisir une Lignée"
    };
  }

  return {
    label,
    body,
    stats,
    stages:{
      v:{...revelation.stages.v,traits:truthTraitsForStage(pkg,state,"v")},
      sr:{...revelation.stages.sr,traits:truthTraitsForStage(pkg,state,"sr")},
      r:{...revelation.stages.r,traits:truthTraitsForStage(pkg,state,"r")}
    },
    vigorAffectsPv:/Vigueur/i.test(`${stats.sr} ${stats.r}`),
    rules:revelation.rules
  };
}

function matchingPrerequisites(talent:TruthTalent,available:TruthTalent[]){
  const raw=truthNorm(talent.prerequisiteName||"");
  if(!raw)return [];
  return available.filter(other=>
    other.id!==talent.id&&raw.includes(truthNorm(other.name))
  );
}

export function truthPrerequisiteSatisfied(
  pkg:TruthRulesPackage,
  state:TruthState,
  talent:TruthTalent,
  available=truthAvailableTalents(pkg,state)
){
  if(talent.prerequisite&&state.truthTalents.includes(talent.prerequisite))return true;
  if(talent.prerequisite&&!talent.prerequisiteName)return false;
  if(!talent.prerequisiteName)return true;

  if(state.nature==="mage"&&talent.mageAwaken){
    const owned=mageOwnedAffinities(state);
    const progressed=[...owned].filter(affinity=>
      state.truthTalents.some(id=>id.startsWith(`mage_${affinity}_`)&&!id.startsWith("mage_awaken_"))
    );
    return owned.size<=1?progressed.length>=1:progressed.length>=2;
  }

  if(state.nature==="mage"&&truthNorm(talent.name)==="oeuvre personnelle"){
    const affinity=stringChoice(state.choices,"dominantAffinity");
    return !!affinity&&
      state.truthTalents.includes(`mage_${affinity}_mastery_magistrale`)&&
      state.truthTalents.includes(`mage_${affinity}_amplitude_majeure`);
  }

  if(state.nature==="mage"&&truthNorm(talent.name)==="heritage familial"){
    return state.truthTalents.some(id=>/_mastery_(affinee|superieure|magistrale)$/.test(id));
  }

  const matches=matchingPrerequisites(talent,available);
  if(matches.length){
    const raw=truthNorm(talent.prerequisiteName);
    const owned=matches.filter(item=>state.truthTalents.includes(item.id)).length;
    if(raw.includes("deux talents parmi"))return owned>=2;
    if(raw.includes(" ou ")&&!raw.includes(" et "))return owned>=1;
    return owned===matches.length;
  }

  const raw=truthNorm(talent.prerequisiteName);
  const free=truthSelectedFreeTraits(pkg,state).map(trait=>truthNorm(trait.name));
  if(free.some(name=>raw.includes(name)))return true;

  return false;
}

export function truthPtvSpent(pkg:TruthRulesPackage,state:TruthState){
  const available=truthAvailableTalents(pkg,state);
  const all=new Map(available.map(talent=>[talent.id,talent]));
  if(state.nature==="mage"){
    for(const talent of mageAllTalents(pkg,state))all.set(talent.id,talent);
  }
  const native=state.truthTalents.reduce((sum,id)=>sum+Number(all.get(id)?.cost||0),0);
  const corruptionById=new Map((pkg.corruption?.talents??[]).map(talent=>[talent.id,talent]));
  const corrupted=(state.corruptionTalents??[]).reduce(
    (sum,id)=>sum+Number(corruptionById.get(id)?.cost||0),
    0
  );
  return native+corrupted;
}

export function truthChoicesValid(pkg:TruthRulesPackage,state:TruthState){
  const nature=pkg.structure.natures[state.nature];
  if(!nature)return false;
  const clean=truthSanitizeChoices(nature,state.choices);
  return nature.choices.every(choice=>{
    if(choice.optional)return true;
    return !!clean[choice.key];
  });
}

export function truthSanitizeTalents(pkg:TruthRulesPackage,state:TruthState){
  if(state.consciousness==="profane")return [];
  let selected=[...state.truthTalents];
  let changed=true;
  while(changed){
    changed=false;
    const current={...state,truthTalents:selected};
    const available=truthAvailableTalents(pkg,current);
    const byId=new Map(available.map(talent=>[talent.id,talent]));
    const pruned=selected.filter(id=>{
      const talent=byId.get(id);
      return !!talent&&truthPrerequisiteSatisfied(pkg,current,talent,available);
    });
    if(pruned.length!==selected.length){
      selected=pruned;
      changed=true;
    }
  }
  return selected;
}

export function truthCorruptionDepth(corruption:number,integrity:number){
  const max=Math.max(1,Math.floor(integrity||1));
  const value=Math.max(0,Math.min(max,Math.floor(corruption||0)));
  if(value===0)return "Sain";
  if(value>=max)return "Seuil atteint";
  if(value>=Math.max(1,max-1))return "Au bord de la Rupture";
  if(value>=Math.ceil(max/2))return "Envahi";
  return "Marqué";
}

function corruptionDepthRank(depth:string){
  if(depth==="Seuil atteint"||depth==="Au bord de la Rupture")return 3;
  if(depth==="Envahi")return 2;
  if(depth==="Marqué")return 1;
  return 0;
}

export function truthCorruptionTalentActive(
  talent:CorruptionTalent,
  state:TruthState,
  integrity:number
){
  if(talent.kind==="RITE")return true;
  if(talent.kind==="FAVEUR")return true;
  if(!state.corruptionSource||talent.sourceId!==state.corruptionSource)return false;
  const current=truthCorruptionDepth(state.corruption,integrity);
  return corruptionDepthRank(current)>=corruptionDepthRank(talent.depth);
}

export function truthCorruptionPrerequisiteSatisfied(
  pkg:TruthRulesPackage,
  state:TruthState,
  talent:CorruptionTalent
){
  const raw=truthNorm(talent.prerequisiteName||"");
  if(!raw)return true;
  const selected=new Set(state.corruptionTalents??[]);
  const candidates=(pkg.corruption?.talents??[]).filter(other=>
    other.id!==talent.id&&raw.includes(truthNorm(other.name))
  );
  return candidates.length>0&&candidates.every(other=>selected.has(other.id));
}

export function truthSanitizeCorruptionTalents(pkg:TruthRulesPackage,state:TruthState){
  const known=new Set((pkg.corruption?.talents??[]).map(talent=>talent.id));
  return [...new Set((state.corruptionTalents??[]).filter(id=>known.has(id)))];
}

export function truthGroups(talents:TruthTalent[]){
  const groups=new Map<string,TruthTalent[]>();
  for(const talent of talents){
    const group=talent.group||"Talents";
    if(!groups.has(group))groups.set(group,[]);
    groups.get(group)!.push(talent);
  }
  return [...groups.entries()].map(([name,items])=>({name,items}));
}
