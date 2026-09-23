import { applyNamedPnjStatProfile, type StatProfile } from "./compendium-pnj-corporate-stats.js";

type Article={id:string;title?:string;pnj?:Record<string,any>;sections?:Array<Record<string,any>>;[key:string]:any};
type Entry=StatProfile & {id:string};
const PROFILES:Entry[]=[
  {"id":"pnj-crawlers-docx-adam-nevine-qigang-xuyin-carmello-shen","tier":"heroique","shape":"social","skills":["Commerce","Autorité","Investigation","Diplomatie"],"anchor":"Adam Nevine, ancien cadre de Nextar, devenu Fixer stratège ; Qigang Xuyin et Carmello Shen sont des noms qu'il utilise.","talents":["Réseau mobilisable — Crawlers","Dossier préparé — contrats"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"pnj-115-myra-allan","tier":"haute","shape":"social","skills":["Autorité","Survie","Investigation","Diplomatie"],"anchor":"Myra Allan est une Crawler canadienne engagée dans les réseaux insurgés de défense de l'environnement.","talents":["Réseau mobilisable — insurgés","Terrain reconnu — littoral"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"pnj-071-luke-cypher","tier":"heroique","shape":"terrain","skills":["Investigation","Mêlée","Survie","Perception"],"anchor":"Luke Cypher est un chasseur d'élite du Hunt-15 ; ses aptitudes angéliques ne sont pas chiffrées ici.","talents":["Dossier préparé — proie","Terrain reconnu — chasse"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"pnj-truth-kerys","tier":"heroique","shape":"terrain","skills":["Investigation","Mêlée","Survie","Furtivité"],"anchor":"Kerys poursuit seule ses contrats de chasse, sans ordre ou association permanente.","talents":["Dossier préparé — cible","Terrain reconnu — traque"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"pnj-truth-neals-corvo","tier":"heroique","shape":"terrain","skills":["Furtivité","Mêlée","Survie","Perception"],"anchor":"Neals Corvo travaille comme assassin Crawler ; sa confrérie et ses mutations restent MJ.","talents":["Désarmement net — Mêlée","Terrain reconnu — infiltration"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"pnj-truth-yun","tier":"haute","shape":"terrain","skills":["Furtivité","Mêlée","Survie","Perception"],"anchor":"Yun exerce comme Voidrunner lié à la Blanchisserie, réputé pour traquer des Nord-Coréens.","talents":["Terrain reconnu — chasse","Expertise éprouvée — Furtivité"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"personnages-verite-chasseurs-sharam-yeganeh","tier":"heroique","shape":"terrain","skills":["Savoirs","Investigation","Survie","Perception"],"anchor":"Sharam Yeganeh exerce comme chasseur dualiste, mais ses flammes surnaturelles ne relèvent pas de la Réalité.","talents":["Dossier préparé — créature","Terrain reconnu — traque"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"personnages-verite-chasseurs-sahadeva-parekh","tier":"haute","shape":"terrain","skills":["Mêlée","Survie","Perception","Savoirs"],"anchor":"Sahadeva Parekh est chasseur issu d'une lignée religieuse de Shiva.","talents":["Terrain reconnu — chasse","Expertise éprouvée — Mêlée"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"personnages-verite-chasseurs-daryl-graves","tier":"haute","shape":"esprit","skills":["Investigation","Savoirs","Survie","Perception"],"anchor":"Daryl Graves recherche des reliques dans un ordre de chasseurs apparenté aux chevaliers de la Table ronde.","talents":["Dossier préparé — relique","Terrain reconnu — site"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"personnages-verite-chasseurs-valle-von-hardenberg","tier":"heroique","shape":"esprit","skills":["Savoirs","Investigation","Diplomatie","Perception"],"anchor":"Valle von Hardenberg pratique l'étude kabbalistique et la chasse rituelle ; sa magie est un profil distinct.","talents":["Expertise éprouvée — Savoirs","Dossier préparé — rituel"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
];
const NO_PROJECTION:string[]=[
  "pnj-aseryns-terres-temples-leder-caendis-02",
  "pnj-aseryns-terres-temples-kyleane-natyel-04",
  "personnages-verite-especes-quetzalcoatl",
  "pnj-aseryns-terres-temples-erlaris-selerias-09",
  "personnages-verite-humains-galactiques-alkiwa-sebeth-mir",
  "pnj-aseryns-terres-temples-shanelias-duria-29",
  "pnj-aseryns-terres-temples-siegorn-akryth-30",
  "pnj-aseryns-terres-temples-hildeveig-eijnir-31",
  "personnages-verite-extraterrestres-rsheraag",
  "personnages-verite-extraterrestres-dsherraneth",
  "pnj-aseryns-terres-temples-ashilirei-saebbidottir-35",
  "pnj-aseryns-terres-temples-hjor-ornsson-37",
  "pnj-aseryns-terres-temples-thorgerd-glamdottir-39",
  "personnages-verite-extraterrestres-peste-des-vases",
  "pnj-aseryns-terres-temples-naedessia-valendis-46",
  "pnj-aseryns-terres-temples-kyrtareth-48",
  "pnj-aseryns-terres-temples-urekai-serath-49",
  "pnj-aseryns-terres-temples-rhenylia-naranos-nysalia-50",
  "pnj-aseryns-terres-temples-kalireth-renathe-53",
  "personnages-verite-especes-lombre-pape",
  "personnages-verite-especes-mloxol-vaagor",
  "personnages-verite-especes-vhodhalnactru",
  "personnages-verite-especes-gajh-shaoggith",
  "personnages-verite-especes-cthath-vhadhi",
  "personnages-verite-especes-ravana",
  "personnages-verite-especes-angrboda",
  "personnages-verite-especes-akvan",
  "personnages-verite-chasseurs-mrallgirncllg",
  "pnj-aseryns-terres-temples-kalurdia-eineris-56",
  "pnj-aseryns-terres-temples-dycardion-57",
  "pnj-aseryns-terres-temples-taelibatha-58",
  "pnj-aseryns-terres-temples-lorieth-59",
  "pnj-aseryns-terres-temples-edrynae-melemnis-60",
  "pnj-aseryns-terres-temples-irinaeth-eydreas-62",
  "pnj-aseryns-terres-temples-rylias-63",
  "pnj-088-cthulhu",
  "pnj-fleaux-am-mleeac",
  "pnj-091-lidira",
  "pnj-fleaux-dagon",
  "pnj-fleaux-telipinu",
  "pnj-fleaux-roi-du-givre",
  "personnages-verite-vampires-p46-adinhazu",
  "personnages-verite-vampires-p15-ankhsebek",
  "personnages-verite-extrals-groupes-elleth-dyx",
  "personnages-verite-vampires-p07-haimanax",
  "personnages-verite-humains-galactiques-jol-la-etrys",
  "personnages-verite-vampires-p39-kali",
  "personnages-verite-humains-galactiques-karina-kelack",
  "personnages-verite-vampires-p48-kragen-aagor",
  "personnages-verite-extrals-groupes-otrax-01",
  "personnages-verite-vampires-p17-shul-alghul-dite-shula",
  "personnages-verite-vampires-p25-trauco",
  "personnages-verite-extrals-groupes-zirine-fa-meonn"
];
const NEEDS_ARBITRATION:string[]=[
  "pnj-108-asheylinn-medira",
  "pnj-121-zoran-kozic",
  "pnj-122-steeve-golden-hood",
  "personnages-verite-chasseurs-isabella-mironescu",
  "personnages-verite-humains-galactiques-moira-blake",
  "personnages-verite-chasseurs-tiamandra-vecellio",
  "personnages-verite-fantastiques-theoderid",
  "personnages-verite-fantastiques-fredegonda",
  "pnj-loges-mages-morgane-o-broin-04",
  "pnj-loges-mages-arash-ostaan-05",
  "pnj-loges-mages-gwendoleen-macguire-06",
  "pnj-loges-mages-zhao-guanyu-10",
  "pnj-loges-mages-anayah-kumba-11",
  "pnj-loges-mages-sergio-venegas-12",
  "pnj-loges-mages-adrien-daigremont-14",
  "pnj-loges-mages-melina-apapoulos-15",
  "pnj-loges-mages-adalardo-gravina-16",
  "pnj-loges-mages-zephia-brummer-17",
  "pnj-loges-mages-mertkan-sabanci-20",
  "pnj-loges-mages-bassaam-el-akram-21",
  "pnj-loges-mages-hassan-abate-yideg-22",
  "pnj-loges-mages-asuka-yamamuro-23",
  "personnages-verite-humains-galactiques-kenneth-shatter",
  "pnj-loges-mages-anggriawan-yang-24",
  "pnj-loges-mages-jin-tian-myong-25",
  "pnj-loges-mages-robert-peng-26",
  "pnj-loges-mages-roowinu-27",
  "pnj-loges-mages-mike-michabou-28",
  "pnj-loges-mages-muna-29",
  "pnj-loges-mages-lara-steven-30",
  "pnj-loges-mages-edwin-kelly-31",
  "pnj-loges-mages-nike-celio-37",
  "pnj-loges-mages-alice-carroll-38",
  "personnages-verite-humains-galactiques-kay-salzer",
  "personnages-verite-fantastiques-marjolein-enneman",
  "personnages-verite-chasseurs-verawati-yenny-pranoto",
  "personnages-verite-fantastiques-tharlal-rark",
  "personnages-verite-chasseurs-charunee-sawasdipon",
  "personnages-verite-chasseurs-jude-riot",
  "personnages-verite-fantastiques-koldraalsheroh",
  "personnages-verite-chasseurs-raekath-lee",
  "pnj-136-alisa-svalisdottir",
  "pnj-fleaux-focus-olayinka-najja-8-olayinka-najja",
  "pnj-truth-beatrix-kruger",
  "pnj-truth-cassandra-helen",
  "pnj-truth-kevin-eckker",
  "pnj-fleaux-focus-anastasia-vargas-awan-aklima-anastasia-vargas",
  "pnj-fleaux-siadara",
  "pnj-fleaux-focus-tellia-fedirivna-skrypnyk-dirivna-skrypnyk",
  "pnj-fleaux-focus-ana-diana-de-la-caza-diana-de-la-caza",
  "pnj-fleaux-focus-arkady-karamov-4-arkady-karamov",
  "pnj-fleaux-focus-azaliah-springer-azaliah-springer",
  "pnj-fleaux-focus-margareta-diaconescu-areta-diaconescu",
  "pnj-fleaux-focus-mila-shilove-094-mila-shilove",
  "pnj-fleaux-focus-mira-stephens-5-mir-a-stephens",
  "pnj-fleaux-focus-noah-brenneman-6-noah-brenneman",
  "pnj-fleaux-focus-nora-shakir--097-nora-shakir",
  "pnj-fleaux-raghnaid-maccalmain",
  "pnj-fleaux-focus-yegor-karamov-05-yegor-karamov"
];

export function applyPnjStatBatch16(byId:Map<string,Article>):void {
  if(PROFILES.length!==10||NO_PROJECTION.length+NEEDS_ARBITRATION.length!==112||
     new Set([...PROFILES.map(p=>p.id),...NO_PROJECTION,...NEEDS_ARBITRATION]).size!==122)
     throw new Error("PNJ · résolution finale incomplète ou dupliquée");
  for(const profile of PROFILES){
    const article=byId.get(profile.id);
    if(!article)throw new Error(`PNJ · fiche active introuvable : ${profile.id}`);
    if(profile.id==="pnj-crawlers-docx-adam-nevine-qigang-xuyin-carmello-shen")repairAdamIdentity(article);
    if(profile.id==="pnj-115-myra-allan")repairMyraIntroduction(article);
    if(!article.sections?.some(section=>section.id==="profil-statistique"))
      (article.sections??=[]).push({id:"profil-statistique",title:"Profil statistique",audience:"mj",blocks:[]});
    applyNamedPnjStatProfile(article,profile);
  }
  for(const [ids,note] of [
    [NO_PROJECTION,"Aucune projection civile individuelle n'est documentée. Bloc de statistiques de Réalité non applicable ; seules les capacités révélées pourront être chiffrées après arbitrage MJ."],
    [NEEDS_ARBITRATION,"Le corpus conserve une identité ou un rôle, sans parcours civil assez précis pour attribuer des compétences et des talents chiffrés avec fiabilité. Arbitrage éditorial requis avant de créer ce profil de Réalité."]
  ] as const)for(const id of ids){
    const article=byId.get(id);
    if(!article)throw new Error(`PNJ · fiche active introuvable : ${id}`);
    let stats=article.sections?.find(section=>section.id==="profil-statistique");
    if(!stats){stats={id:"profil-statistique",title:"Profil statistique · à qualifier",audience:"mj",blocks:[]};(article.sections??=[]).push(stats);}
    if(article.sections?.at(-1)!==stats||stats.blocks?.length)throw new Error(`PNJ · dossier statistique déjà exploité : ${id}`);
    stats.audience="mj";
    stats.blocks=[{type:"p",text:note}];
  }
}
function repairAdamIdentity(article:Article):void {
  const card=article.sections?.find(section=>section.id==="identite-realite-consolidee")?.blocks?.[0];
  const name=card?.rows?.find((row:string[])=>row[0]==="Nom");
  const aliases=card?.rows?.find((row:string[])=>row[0]==="Alias");
  if(!name||!aliases||!String(name[1]).includes("Carmello SHEN"))throw new Error("PNJ · identité d'Adam modifiée");
  name[1]="Adam Nevine";aliases[1]="Qigang Xuyin · Carmello Shen · L’omniscient";
  article.title="Adam Nevine";
  if(article.pnj){article.pnj.real_name="Adam Nevine";article.pnj.identity_keys=["Adam Nevine","Qigang Xuyin","Carmello Shen","L’omniscient"];}
}
function repairMyraIntroduction(article:Article):void {
  const section=article.sections?.find(section=>section.id==="pnj-115-s2");
  if(!section?.blocks?.length||!String(section.blocks[0].text).startsWith("Mettre de côté l’environnement"))throw new Error("PNJ · histoire de Myra modifiée");
  section.blocks.unshift({type:"p",text:"Myra Allan est une Crawler canadienne proche des milieux insurgés qui défendent l’environnement."});
}
