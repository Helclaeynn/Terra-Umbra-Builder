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
  name:string;
  description:string;
  choices:TruthChoice[];
  baseFreeTraits:TruthTrait[];
  freeTraitRules:TruthFreeTraitRule[];
};

export type TruthTalent={
  id:string;
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
  visibility:{
    needles:Record<string,Record<string,string[]>>;
    sharedHunterNatures:readonly string[];
  };
};

export type TruthState={
  nature:string;
  consciousness:string;
  choices:Record<string,unknown>;
  truthTalents:string[];
};

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

export function truthChoiceOptions(choice:TruthChoice,choices:Record<string,unknown>){
  if(choice.optionsBy&&choice.dependsOn){
    return choice.optionsBy[stringChoice(choices,choice.dependsOn)]??[];
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
    if(tradition==="aucune")return false;
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
  return state.truthTalents.reduce((sum,id)=>sum+Number(all.get(id)?.cost||0),0);
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

export function truthGroups(talents:TruthTalent[]){
  const groups=new Map<string,TruthTalent[]>();
  for(const talent of talents){
    const group=talent.group||"Talents";
    if(!groups.has(group))groups.set(group,[]);
    groups.get(group)!.push(talent);
  }
  return [...groups.entries()].map(([name,items])=>({name,items}));
}
