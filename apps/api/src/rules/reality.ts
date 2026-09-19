import { existsSync, readFileSync, readdirSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import path from "node:path";

type AnyRecord=Record<string,unknown>;

export type RealityItem={
  id:string;
  kind:"equipment"|"augmentation";
  name:string;
  category:string;
  sourceCategory:string;
  price:number|null;
  priceMin:number|null;
  priceMax:number|null;
  priceLabel:string;
  generation:number|null;
  charge:number|null;
  stress:number|null;
  slots:string|number|null;
  effect:string;
  lore:string;
  data:AnyRecord;
  vehicle:boolean;
  neuro:boolean;
  recurring:"one_off"|"durable_purchase"|"per_use"|"monthly"|"annual";
  monthlyCost:number;
  families:string[];
};

const styleAugAccess={
  manucorpo:{text:"Gen1 : Neural, Optique/Audio, membres utilitaires. 1 système Gen2 Optique/Audio ou utilitaire.",gen1:["neural","optical","audio","utility"],gen2:["optical","audio","utility"]},
  biocorpo:{text:"Biogénétique ≤15k + Gen1 médical/interne. 1 système Gen2 médical ou dermique.",gen1:["medical","internal"],gen2:["medical","dermal"],bio:["medical","civil","sensorial"],bioCap:15000},
  cybercorpo:{text:"Gen1 Neural et Optique/Audio. 1 système Gen2 Neural ou Optique/Audio.",gen1:["neural","optical","audio"],gen2:["neural","optical","audio"]},
  armacorpo:{text:"Gen1 combat : Neural, Optique, membres. 1 système Gen2 combat ou sensoriel.",gen1:["combat","neural","optical","member"],gen2:["combat","sensorial"]},
  servicorpo:{text:"Bio civile, esthétique et sensoriel. 1 système Gen2 civil/sensoriel ; pas de combatware Gen2.",gen1:["aesthetic","civil","sensorial"],gen2:["civil","sensorial"],bio:["civil","aesthetic","sensorial"]},
  forces_armees:{text:"Gen1 combat, membres, optiques. 1 système Gen2 militaire ou sensoriel.",gen1:["combat","member","optical"],gen2:["combat","defensive","sensorial","member"]},
  agent_gouvernemental:{text:"Gen1 Neural, Optique/Audio, infiltration. 1 système Gen2 Neural ou sensoriel.",gen1:["neural","optical","audio","infiltration"],gen2:["neural","sensorial"]},
  net_corps:{text:"Gen1 Neural/Optique. 1 système Gen2 Neural.",gen1:["neural","optical"],gen2:["neural"]},
  service_public:{text:"Médical, assistif, sensoriel, Bio ≤10k. 1 système Gen2 non offensif.",gen1:["medical","utility","sensorial","defensive"],gen2:["medical","utility","sensorial","defensive","civil"],bio:["medical","civil","sensorial"],bioCap:10000},
  diplomate_administrateur:{text:"Esthétique, bio civile, sensoriel. 1 système Gen2 civil.",gen1:["aesthetic","civil","sensorial"],gen2:["civil"],bio:["civil","aesthetic","sensorial"]},
  soldato:{text:"Gen1 combat et membres. Pas de Gen2 par défaut.",gen1:["combat","member"],gen2:[]},
  tueur_a_gages:{text:"Gen1 combat/infiltration. 1 système Gen2 dissimulé ou sensoriel.",gen1:["combat","infiltration"],gen2:["infiltration","sensorial"]},
  hacker:{text:"Gen1 Neural. 1 système Gen2 Neural.",gen1:["neural"],gen2:["neural"]},
  charcudoc:{text:"Gen1 très large, Bio ≤15k. 1 système Gen2 médical ou utilitaire.",gen1:["all"],gen2:["medical","utility"],bio:["all"],bioCap:15000},
  affairiste_bookmaker:{text:"Bio civile, esthétique, sensoriel. Gen2 civil uniquement.",gen1:["aesthetic","civil","sensorial"],gen2:["civil"],bio:["civil","aesthetic","sensorial"]},
  deathrunner_merc:{text:"Gen1 combat très large. Pas de Gen2 par défaut.",gen1:["combat","member","neural","optical","audio","internal","dermal"],gen2:[]},
  neurodiver:{text:"Gen1 Neural. 1 système Gen2 Neural.",gen1:["neural"],gen2:["neural"]},
  meditech:{text:"Gen1 médical, membres, interne ; Bio ≤10k. 1 système Gen2 médical/utilitaire.",gen1:["medical","member","internal","utility"],gen2:["medical","utility"],bio:["medical","civil"],bioCap:10000},
  gundriver:{text:"Gen1 membres/sensoriel/utilitaire ; pas de Gen2. +10 000 $ de Capital véhicule.",gen1:["member","sensorial","utility"],gen2:[]},
  neopunk:{text:"Esthétique, Neural/Audio Gen1. 1 système Gen2 Neural ou sensoriel.",gen1:["aesthetic","neural","audio"],gen2:["neural","sensorial"]},
  ordre_arme:{text:"Gen1 combat. 1 système Gen2 défensif ou sensoriel.",gen1:["combat"],gen2:["defensive","sensorial"]},
  clerc_holonet:{text:"Gen1 Neural/Optique-Audio. 1 système Gen2 Neural ou sensoriel.",gen1:["neural","optical","audio"],gen2:["neural","sensorial"]},
  ministeriel:{text:"Médical/interne, Bio ≤15k. 1 système Gen2 médical ou utilitaire.",gen1:["medical","internal"],gen2:["medical","utility"],bio:["medical","civil"],bioCap:15000},
  clerc_administrateur:{text:"Bio civile, esthétique, sensoriel ; Gen2 civil.",gen1:["aesthetic","civil","sensorial"],gen2:["civil"],bio:["civil","aesthetic","sensorial"]},
  missionnaire:{text:"Médical/utilitaire Gen1, Bio ≤10k. Pas de Gen2 par défaut.",gen1:["medical","utility"],gen2:[],bio:["medical","civil"],bioCap:10000}
} as const;

const lifestyle={
  order:["Survie","Modeste","Standard","Confortable","Aisé","Luxe"],
  monthlyReference:{Survie:200,Modeste:400,Standard:650,Confortable:1200,"Aisé":2500,Luxe:5000},
  lore:{
    Survie:"Le personnage vit au jour le jour. Logement instable, alimentation minimale et mobilité choisie par nécessité ; un imprévu financier peut suffire à déstabiliser le mois.",
    Modeste:"Le quotidien est tenu mais serré : petit logement ou colocation, dépenses surveillées et peu de marge pour les extras.",
    Standard:"Un niveau de vie urbain courant : logement correct, alimentation régulière, services usuels et quelques loisirs sans que l’argent disparaisse du jeu.",
    Confortable:"Le personnage dispose d’une vraie marge : meilleur logement, mobilité plus souple, abonnements utiles et dépenses ordinaires rarement problématiques.",
    "Aisé":"Le niveau de vie devient un marqueur social : beaux quartiers, services premium, mobilité haut de gamme et capacité à absorber la plupart des dépenses communes.",
    Luxe:"Le quotidien relève du privilège : logement exceptionnel, services personnels, vraie production, déplacements coûteux et accès à des prestations que la majorité ne considère pas ordinaires."
  }
} as const;

function sourceRoot(){
  if(existsSync("/app/rules-data"))return "/app/rules-data";
  return path.resolve(process.cwd(),"../../.v2-rules-data");
}

function readJson(file:string){
  return JSON.parse(readFileSync(file,"utf8")) as AnyRecord;
}

function norm(value:unknown=""){
  return String(value??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()
    .replace(/[’']/g,"'").replace(/[^a-z0-9]+/g," ").trim();
}
function loose(value:unknown=""){return norm(value).replace(/\s+/g," ").trim();}
function slug(value:string){return norm(value).replace(/\s+/g,"-")||"item";}
function num(value:unknown){
  if(typeof value==="number")return Number.isFinite(value)?value:null;
  if(value===null||value===undefined)return null;
  const match=String(value).replace(/\u00a0/g," ").match(/-?\d[\d\s.,]*/);
  if(!match)return null;
  const parsed=Number(match[0].replace(/\s/g,"").replace(",","."));
  return Number.isFinite(parsed)?parsed:null;
}
function field(obj:AnyRecord|undefined,names:string[]){
  if(!obj)return null;
  const wanted=new Set(names.map(norm));
  for(const [key,value] of Object.entries(obj)){
    if(wanted.has(norm(key))&&value!==undefined&&value!==null&&value!=="")return value;
  }
  return null;
}
function deepField(obj:AnyRecord|undefined,names:string[]){
  for(const node of [obj,obj?.data,obj?.details]){
    if(node&&typeof node==="object"&&!Array.isArray(node)){
      const found=field(node as AnyRecord,names);
      if(found!==null)return found;
    }
  }
  return null;
}
function collect(node:unknown,pathParts:(string|number)[]=[],out:AnyRecord[]=[]){
  if(Array.isArray(node)){
    node.forEach((value,index)=>collect(value,[...pathParts,index],out));
    return out;
  }
  if(!node||typeof node!=="object")return out;
  const record=node as AnyRecord;
  const keys=Object.keys(record).map(norm);
  const hasName=keys.some(key=>["name","nom","augmentation","equipement","equipment","service","vehicule","vehicle","neuroprogramme","item","designation"].includes(key));
  const hasUseful=keys.some(key=>["prix","price","cout","cost","generation","gen","charge","stress","effet","effect","usage","fonction","fonction principale","description","dgt","degats"].includes(key));
  if(hasName&&hasUseful){
    out.push({...record,_path:pathParts.join(" / ")});
    return out;
  }
  for(const [key,value] of Object.entries(record)){
    if(value&&typeof value==="object")collect(value,[...pathParts,key],out);
  }
  return out;
}

function gunzipBase64(file:string){
  const b64=readFileSync(file,"utf8").replace(/\s+/g,"");
  return JSON.parse(gunzipSync(Buffer.from(b64,"base64")).toString("utf8")) as unknown;
}

function loreMap(root:string){
  const dir=path.join(root,"lore");
  const map=new Map<string,{text:string;priority:number}>();
  if(!existsSync(dir))return map;
  for(const file of readdirSync(dir).filter(name=>name.endsWith(".json")).sort()){
    const payload=readJson(path.join(dir,file));
    const entries=payload.entries;
    if(!entries||typeof entries!=="object"||Array.isArray(entries))continue;
    const priority=file.includes("final")?5:file.includes("curated")?4:file.includes("augmentations")?3:file.includes("firearms")||file.includes("neuro")?2:1;
    for(const [name,value] of Object.entries(entries as AnyRecord)){
      let paragraphs:string[]=[];
      if(Array.isArray(value))paragraphs=value.filter((x):x is string=>typeof x==="string");
      else if(value&&typeof value==="object"&&!Array.isArray(value)){
        const p=(value as AnyRecord).paragraphs;
        if(Array.isArray(p))paragraphs=p.filter((x):x is string=>typeof x==="string");
      }
      const text=paragraphs.map(x=>x.trim()).filter(Boolean).join("\n\n");
      if(!text)continue;
      const key=loose(name),previous=map.get(key);
      if(!previous||priority>=previous.priority)map.set(key,{text,priority});
    }
  }
  return map;
}

const legacyWeaponFamilies=new Map<string,string>([
  ["black arrow","Armement — Arcs, arbalètes & harpons"],["nextar championship","Armement — Arcs, arbalètes & harpons"],["byron tethyssette","Armement — Arcs, arbalètes & harpons"],
  ["raven ravenegg","Armement — Grenades & explosifs"],["phoenix inferno","Armement — Grenades & explosifs"],["owl dripper","Armement — Grenades & explosifs"],["phoenix helios ii","Armement — Grenades & explosifs"],["owl superchoc","Armement — Grenades & explosifs"],["biosun frog egg","Armement — Grenades & explosifs"],["byron pokeball","Armement — Grenades & explosifs"],["jagi","Armement — Grenades & explosifs"],["shadow gift","Armement — Grenades & explosifs"],
  ["owl vending machine","Armement — Lance-grenades"],["raven bomberman","Armement — Lance-grenades"],["phoenix easter bunny","Armement — Lance-grenades"],
  ["phoenix king fist","Armement — Armes de contact & outils"],["byron ginette","Armement — Armes de contact & outils"],["mary antoinette","Armement — Armes de contact & outils"],["pierrette","Armement — Armes de contact & outils"],["byron melinette","Armement — Armes de contact & outils"],["stretchy","Armement — Armes de contact & outils"],
  ["sunways hornetouch","Armement — Armes de contact hypodermiques"],["biosun blastard injector","Armement — Armes de contact hypodermiques"],
  ["sal in","Armement — Fusils d’assaut"],["morissette","Armement — Fusils d’assaut"],["biosun aciditicteeth","Armement — Fusils d’assaut"],["tortoise blastard","Armement — Fusils d’assaut"],
  ["song gos","Armement — Fusils de précision"],["byron luzette","Armement — Fusils de précision"],["abraham kennedy","Armement — Fusils de précision"],["raven sehdia hellrails","Armement — Fusils de précision"],
  ["biosun pandemic","Armement — Fusils hypodermiques"],["sunways savior dgr","Armement — Fusils hypodermiques"],
  ["disease","Armement — Pistolets hypodermiques"],["raven sunways savior dg","Armement — Pistolets hypodermiques"],["raven painkiller","Armement — Pistolets hypodermiques"],
  ["phoenix redcrush","Armement — Lanceurs hypodermiques & chimiques"],
  ["bi","Armement — Pistolets-mitrailleurs (PM)"],["sfu nebullar","Armement — Pistolets-mitrailleurs (PM)"],["monarch surge","Armement — Pistolets-mitrailleurs (PM)"],
  ["bibal","Armement — SMG"],["byron florette","Armement — SMG"],
  ["owl apex","Armement — Pistolets lourds"],["jotkka","Armement — Pistolets lourds"],["raven sehdia pacificateur x","Armement — Pistolets lourds"],
  ["byron jeanette","Armement — Pistolets légers"],["eolgul e","Armement — Pistolets de poche"],["phoenix sunnyroshima","Armement — Pistolets de poche"],
  ["reminiscer prototype","Armement — Pistolets prototypes"],["oblivion prototype","Armement — Pistolets prototypes"],["zeus prototype","Armement — Pistolets prototypes"],["dracula prototype","Armement — Pistolets prototypes"],["phoenix vader prototype","Armement — Pistolets prototypes"],
  ["flak cannon prototype","Armement — Armes lourdes prototypes"],["armcannon prototype","Armement — Armes lourdes prototypes"],
  ["sheer blueshell a prototype","Armement — Drones d’assaut & armes autonomes"],["charm prototype","Armement — Dispositifs expérimentaux"],
  ["raven sehdia railway to hell prototype","Armement — Anti-matériel & fortifications"]
]);

function equipmentCategory(name:string,category:string,data:AnyRecord){
  const key=loose(name);
  const legacy=legacyWeaponFamilies.get(key);
  if(legacy)return legacy;
  const cat=norm(category),weaponClass=norm(field(data,["Classe","Type"])),role=norm(field(data,["Rôle","Role"]));
  if(cat==="armes melee"){
    if(/trait|jet/.test(weaponClass)||/\b(?:lc|hl|jl|th|mb) \d/.test(key))return "Armement — Armes de jet & trait";
    return "Armement — Armes de mêlée";
  }
  if(cat==="armes poing tasers"){
    if(/taser/.test(weaponClass)||/\b(?:lt|ht) \d/.test(key))return "Armement — Tasers";
    if(weaponClass==="poche"||/\bpp \d/.test(key))return "Armement — Pistolets de poche";
    if(/pistolet leger/.test(weaponClass)||/\blp \d/.test(key))return "Armement — Pistolets légers";
    if(/pistolet lourd/.test(weaponClass)||/\bhp \d/.test(key))return "Armement — Pistolets lourds";
  }
  if(cat==="armes automatiques"){
    if(weaponClass==="pm"||/\bmgp \d/.test(key))return "Armement — Pistolets-mitrailleurs (PM)";
    if(weaponClass==="smg"||/\blmg \d/.test(key))return "Armement — SMG";
    if(/assaut/.test(weaponClass)||/\bar \d/.test(key))return "Armement — Fusils d’assaut";
  }
  if(cat==="armes precision"){
    if(/shotgun/.test(weaponClass)||/\bsg \d/.test(key))return "Armement — Shotguns";
    return "Armement — Fusils de précision";
  }
  if(cat==="armes lourdes"){
    if(/mitrailleuse|gatling/.test(role)||/bastion|hellstorm/.test(key))return "Armement — Mitrailleuses lourdes & Gatlings";
    if(/neutralisation/.test(role)||/manticore/.test(key))return "Armement — Neutralisation lourde";
    if(/lance grenades|lance roquette|missile/.test(role)||/doorbell|breacher|wasp/.test(key))return "Armement — Lanceurs & missiles";
    if(/anti materiel|fortification/.test(role)||/wallbreaker/.test(key))return "Armement — Anti-matériel & fortifications";
    if(/projecteur/.test(role)||/salamander|purifier/.test(key))return "Armement — Projecteurs lourds";
    return "Armement — Armes lourdes";
  }
  return category;
}

function augmentationFamilies(item:{name:string;category:string;effect:string}){
  const text=norm(`${item.category} ${item.name} ${item.effect}`),families=new Set<string>();
  const has=(...values:string[])=>values.some(value=>text.includes(norm(value)));
  if(has("biogenetique","bio tatouage","bioarme","bioware","pheromone","photosynthese","rein ameliore","regeneration passive","temps de reaction surhumain","systeme immunitaire amplifie","yeux parfaits","articulations elastiques","metabolisme propre","pigmentation dermique"))families.add("bio");
  if(has("neural","neuronal","neuro","cablage","adrenaline","bloqueur de douleur","analyseur chimique","processeur mathematique","systeme d orientation","defense electronique","ports d interface"))families.add("neural");
  if(has("cyberoeil","optique","oculaire","vision","uv","infrarouge","radiation","camera","zoom","eblouissement","lampes oculaires"))families.add("optical");
  if(has("cyberaudio","audio","auditif","auditive","oreille","echolocation","traducteur","stress vocal","brouilleur","gyroscopique","radio integree"))families.add("audio");
  if(has("cyberbras","cyberjambe","cybermain","cyberpied","membre","grappin","doigts outils","scanner meditech","scanner technique","gecko","jambes renforcees","palmes cybernetiques","pistolet integre","lame cachee","lame retractable","monofilament","griffes","ongles","poings renforces","poings blindes","ergot"))families.add("member");
  if(has("anticorps","audiovox","filtre a toxines","maillage squelettique","poumon cybernetique","branchies cybernetiques","estomac blinde","autoinjecteur"))families.add("internal");
  if(has("dermique","synthederm","systeme magnetique","poche dermique","peau"))families.add("dermal");
  if(has("support de membres surnumeraires","support multioptique","support multisenseur","support de capteurs"))families.add("heavy");
  if(has("teinte dermique","lentilles polychromes","tatouage lumineux","cheveux artificiels","maillage dermique decoratif","montre sous cutanee","implants mammaires","implant sexuel","implant contraceptif","bio tatouage","croissance capillaire","pigmentation dermique"))families.add("aesthetic");
  if(families.has("optical")||families.has("audio")||has("radar","sonar","capteur","spectre visuel","spectre auditif","ouie amelioree","yeux parfaits","sensibilite tactile"))families.add("sensorial");
  if(has("medical","meditech","anticorps","toxine","poumon","branchies","rein","immunitaire","digestion","regeneration","hormon","remplacement","organe","bloqueur de douleur","autoinjecteur"))families.add("medical");
  if(has("grappin","doigts outils","scanner","gecko","orientation","processeur","palmes","interface")||families.has("aesthetic"))families.add("utility");
  if(has("pistolet","lame","monofilament","griffes","ongles","poings","ergot","audiovox","armure","camouflage","adrenaline","defense electronique","maillage squelettique","bioarme","electrochoc","venin"))families.add("combat");
  if(has("armure","protection","defense","anti eblouissement","protection auditive","isolation electrique","maillage squelettique","peau de cuir"))families.add("defensive");
  if(has("camouflage","poche dermique","dissimule","cachee","ongles carbone","synthederm","enregistreur","filtrage","traceur","zoom","camera"))families.add("infiltration");
  if(families.has("aesthetic")||families.has("medical")||families.has("utility")||(!families.has("combat")&&!families.has("heavy")))families.add("civil");
  return [...families];
}

function recurringKind(item:{name:string;category:string;priceLabel:string;vehicle:boolean}){
  if(item.vehicle)return "durable_purchase" as const;
  const name=norm(item.name),key=loose(item.name),cat=norm(item.category),price=norm(item.priceLabel),context=norm(`${name} ${cat}`);
  if(/\btrajet\b|\bintervention\b|\bseance\b|\bheure\b|\bheures\b|\bh\b|\bjour\b|\bverre\b|\btasse\b/.test(price)||key==="metro tram"||/^mas (court trajet|trajet long urbain)$/.test(key))return "per_use" as const;
  if(/\ban\b|annuel|annuelle|annuels|annuelles/.test(price)||/abonnement annuel/.test(context)||/^(celtx|shelov|ladydolla)$/.test(key))return "annual" as const;
  if(/\bmois\b|mensuel|mensuelle|mensuels|mensuelles/.test(price)||/abonnement mensuel|dette mensuelle|pension mensuelle|loyer|leasing/.test(context))return "monthly" as const;
  if(/logement|planque/.test(cat)||/dortoir ouvrier|vladic micro logement|vladic studio|studio urbain ancien|appartement connecte|vladic familial|vladic grand|residence de cadre|penthouse|villa|cache improvisee|piece box squat discret|studio garage anonyme|planque dediee|planque securisee|reseau de planques/.test(name))return "monthly" as const;
  if(key==="pass metro tram"||/^bull (basic|standard|premium|executive)$/.test(key)||/stockage box atelier|media holonet reseaux/.test(key))return "monthly" as const;
  if(/^careforce (bronze|silver|golden)$/.test(key))return "annual" as const;
  if(/vehicule|arme|armure|augmentation|materiel|objet/.test(cat))return "durable_purchase" as const;
  return "one_off" as const;
}

function normaliseCurrentEquipment(entry:AnyRecord,lore:Map<string,{text:string;priority:number}>):RealityItem{
  const name=String(entry.name??"").trim(),sourceCategory=String(entry.category??"Équipement"),data=(entry.data&&typeof entry.data==="object"&&!Array.isArray(entry.data)?entry.data:{}) as AnyRecord;
  const priceMin=num(entry.priceMin),priceMax=num(entry.priceMax),exact=num(entry.price);
  const price=exact??priceMin;
  const category=equipmentCategory(name,sourceCategory,data);
  const vehicle=Object.keys(data).some(key=>/blindage|structure|places|vitesse|autonomie|entretien/i.test(norm(key)));
  const neuro=norm(`${sourceCategory} ${name}`).includes("neuroprogramme");
  const priceLabel=String(entry.priceLabel??(price!==null?`${price} $`:""));
  const recurring=recurringKind({name,category:sourceCategory,priceLabel,vehicle});
  return {
    id:String(entry.id??slug(`equipment-${sourceCategory}-${name}`)),
    kind:"equipment",name,category,sourceCategory,price,priceMin,priceMax,priceLabel,
    generation:null,charge:null,stress:null,slots:null,
    effect:String(entry.effect??field(data,["Fonction","Usage","Effet"])??"").trim(),
    lore:lore.get(loose(name))?.text??"",
    data,vehicle,neuro,recurring,
    monthlyCost:recurring==="annual"?(price??0)/12:recurring==="monthly"?(price??0):0,
    families:[]
  };
}

function normaliseLooseCatalog(raw:unknown,kind:"equipment"|"augmentation",lore:Map<string,{text:string;priority:number}>,force?:{vehicle?:boolean;neuro?:boolean;category?:string}){
  const seen=new Map<string,number>();
  return collect(raw).map((row,index)=>{
    const name=String(field(row,["name","nom","augmentation","equipement","equipment","service","vehicule","vehicle","neuroprogramme","item","designation"])??`Entrée ${index+1}`).trim();
    const sourceCategory=force?.category??String(field(row,["category","categorie","catégorie","section","family","famille","type","groupe"])??row._path??(kind==="augmentation"?"Augmentations":"Équipement")).trim();
    const generation=num(field(row,["generation","génération","gen"]));
    const price=num(field(row,["price","prix","cost","cout","coût"]));
    const charge=num(field(row,["charge"])),stress=num(field(row,["stress"])),slots=field(row,["slots","slot","emplacements","emplacement"]) as string|number|null;
    const effect=String(field(row,["effect","effet","fonction principale","fonction","usage","description","profil","speciaux","spéciaux"])??"").trim();
    const base=String(field(row,["id"])??slug(`${kind}-${sourceCategory}-${name}-${generation??0}-${price??"x"}`));
    const count=(seen.get(base)??0)+1;seen.set(base,count);
    const id=count===1?base:`${base}-${count}`;
    const vehicle=force?.vehicle??(kind==="equipment"&&norm(sourceCategory).includes("vehicul"));
    const neuro=force?.neuro??norm(`${sourceCategory} ${name}`).includes("neuroprogramme");
    const priceLabel=price!==null?`${price} $`:"";
    const recurring=recurringKind({name,category:sourceCategory,priceLabel,vehicle});
    const simple={name,category:sourceCategory,effect};
    return {
      id,kind,name,
      category:kind==="equipment"?equipmentCategory(name,sourceCategory,row):sourceCategory,
      sourceCategory,price,priceMin:null,priceMax:null,priceLabel,generation,charge,stress,slots,effect,
      lore:lore.get(loose(name))?.text??"",data:row,vehicle,neuro,recurring,
      monthlyCost:recurring==="annual"?(price??0)/12:recurring==="monthly"?(price??0):0,
      families:kind==="augmentation"?augmentationFamilies(simple):[]
    } satisfies RealityItem;
  }).filter(item=>item.name&&!/^entree \d+$/i.test(norm(item.name)));
}

let cache:ReturnType<typeof buildRealityRules>|null=null;

function buildRealityRules(){
  const root=sourceRoot(),lore=loreMap(root);
  const current=readJson(path.join(root,"current-equipment-catalog-v1.json"));
  const catalog=(current.catalog&&typeof current.catalog==="object"&&!Array.isArray(current.catalog)?current.catalog:{}) as AnyRecord;
  const currentEntries=Array.isArray(catalog.entries)?catalog.entries.filter((x):x is AnyRecord=>!!x&&typeof x==="object"&&!Array.isArray(x)):[];
  const equipment=currentEntries.map(entry=>normaliseCurrentEquipment(entry,lore));

  for(const [file,options] of [
    ["neuroprograms.part01.b64",{neuro:true,category:"Neuroprogrammes"}],
    ["vehicles.part01.b64",{vehicle:true,category:"Véhicules"}]
  ] as const){
    const full=path.join(root,file);
    if(!existsSync(full))continue;
    equipment.push(...normaliseLooseCatalog(gunzipBase64(full),"equipment",lore,options));
  }

  const augmentationRaw=gunzipBase64(path.join(root,"augmentations.json.gz.b64"));
  const augmentations=normaliseLooseCatalog(augmentationRaw,"augmentation",lore);

  const uniqueEquipment=[...new Map(equipment.map(item=>[item.id,item])).values()];
  const recurring=uniqueEquipment.filter(item=>item.recurring==="monthly"||item.recurring==="annual");

  return {
    source:{
      equipment:String(
        catalog.source ??
        (
          current.manifest&&typeof current.manifest==="object"
            ? (current.manifest as AnyRecord).source??""
            : ""
        )
      ),
      version:String(catalog.version??""),
      mergedLoreFiles:existsSync(path.join(root,"lore"))?readdirSync(path.join(root,"lore")).filter(name=>name.endsWith(".json")).length:0
    },
    economy:{
      advancedPurchaseThreshold:20000,
      unusedEnvelopeRefundRate:.5,
      styleAugAccess,
      lifestyle
    },
    equipment:uniqueEquipment,
    augmentations,
    recurring,
    counts:{
      equipment:uniqueEquipment.length,
      augmentations:augmentations.length,
      recurring:recurring.length,
      monthly:recurring.filter(item=>item.recurring==="monthly").length,
      annual:recurring.filter(item=>item.recurring==="annual").length,
      vehicles:uniqueEquipment.filter(item=>item.vehicle).length,
      neuroprograms:uniqueEquipment.filter(item=>item.neuro).length
    }
  };
}

export function getRealityRules(){
  cache??=buildRealityRules();
  return cache;
}
