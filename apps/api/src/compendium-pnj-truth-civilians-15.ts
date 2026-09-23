import { applyNamedPnjStatProfile, type StatProfile } from "./compendium-pnj-corporate-stats.js";

type Article={id:string;dataset?:string;audience?:string;sections?:Array<Record<string,any>>;[key:string]:any};
type Entry=StatProfile & {id:string};

const PROFILES:Entry[]=[
  {"id":"personnages-verite-chasseurs-liliana-harper-ex-dorner","tier":"haute","shape":"social","skills":["Représentation","Commerce","Diplomatie","Autorité"],"anchor":"Musicienne indépendante du groupe Last Chase, défend la MAP et l'environnement.","talents":["Expertise éprouvée — Représentation","Réseau mobilisable — groupe"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"personnages-verite-chasseurs-kimberley-vasquez","tier":"heroique","shape":"terrain","skills":["Autorité","Tir","Survie","Pugilat"],"anchor":"Vétérane du Mexique dirigeant l'académie militaire MNA et entraînant personnellement les élèves.","talents":["Chef de manœuvre — académie","Terrain reconnu — guerre"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"personnages-verite-chasseurs-mike-kirk","tier":"haute","shape":"terrain","skills":["Survie","Tir","Perception","Autorité"],"anchor":"Plongeur de sécurité Seawares et bras droit d'Alexander Shorolth sur les sites sous-marins.","talents":["Terrain reconnu — fonds marins","Chef de manœuvre — plongeurs"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"personnages-verite-chasseurs-lisbeth-brunn","tier":"heroique","shape":"esprit","skills":["Investigation","Furtivité","Perception","Langages & Argot"],"anchor":"Détective Crawler danoise multilingue, sait retrouver ou faire disparaître des personnes.","talents":["Dossier préparé — enquête","Lecture des failles — piste"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"personnages-verite-chasseurs-gill-karvin","tier":"heroique","shape":"esprit","skills":["Savoirs","Investigation","Perception","Diplomatie"],"anchor":"Professeur de neurosciences à New York, voyage pour présenter ses travaux en congrès.","talents":["Expertise éprouvée — Savoirs","Dossier préparé — cerveau"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"personnages-verite-chasseurs-kennisha-arnold","tier":"elite","shape":"social","skills":["Commerce","Savoirs","Diplomatie","Perception"],"anchor":"Tient et cuisine au Gore'Tex's Diner avec quatre employées malgré la pression des gangs.","talents":["Expertise éprouvée — Commerce","Réseau mobilisable — diner"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"personnages-verite-especes-veronica-silver","tier":"heroique","shape":"esprit","skills":["Investigation","Tir","Autorité","Perception"],"anchor":"Ancienne militaire et stratège reconnue, arbitre parmi les Crawlers et enquêtrice occasionnelle du LAUS.","talents":["Dossier préparé — enquête","Lecture des failles — tactique"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"personnages-verite-angelus-murton-blade","tier":"heroique","shape":"terrain","skills":["Mêlée","Tir","Survie","Perception"],"anchor":"Murton Blade sert de couverture à un combattant extrêmement violent ; ses pouvoirs de Vérité sont exclus.","talents":["Désarmement net — Mêlée","Terrain reconnu — affrontement"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"personnages-verite-angelus-katerinochkina-angelika-ruslanovna","tier":"heroique","shape":"terrain","skills":["Furtivité","Tir","Survie","Perception"],"anchor":"Katerina Angelika a été assassine à Moscou puis proche de Svetlana pendant la guerre.","talents":["Terrain reconnu — infiltration","Expertise éprouvée — Furtivité"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"pnj-truth-morgan-nic-brandubh","tier":"heroique","shape":"social","skills":["Commerce","Autorité","Investigation","Diplomatie"],"anchor":"Morgan nic Brandubh préside Raven Corporation et dirige un vaste réseau d'armement.","talents":["Réseau mobilisable — Raven","Dossier préparé — stratégie"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"pnj-truth-phoebe-edgar","tier":"heroique","shape":"esprit","skills":["Mécanique","Investigation","Neurodive","Perception"],"anchor":"Phoebe Edgar est une jeune mécanicienne Crawler reconnue pour son génie technique.","talents":["Expertise éprouvée — Mécanique","Dossier préparé — prototype"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"pnj-126-katell-odalaigh","tier":"heroique","shape":"esprit","skills":["Investigation","Perception","Autorité","Tir"],"anchor":"Ancienne cheffe du LAPD et détective d'exception, incarcérée après avoir tué un supérieur corrompu.","talents":["Dossier préparé — enquête","Lecture des failles — suspect"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"pnj-loges-mages-shane-rosenberg-18","tier":"haute","shape":"esprit","skills":["Mécanique","Investigation","Survie","Neurodive"],"anchor":"Shane Rosenberg exerce comme Crawler Cypper spécialisé dans les sabotages et pièges à San Diejuana.","talents":["Expertise éprouvée — Mécanique","Dossier préparé — sabotage"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"pnj-loges-mages-mada-oromo-nerayo-19","tier":"haute","shape":"esprit","skills":["Soin","Savoirs","Investigation","Perception"],"anchor":"Mada travaille comme Crawler Meditech indépendante, parfois avec Elizabeth Karnstein.","talents":["Expertise éprouvée — Soin","Dossier préparé — intervention"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
  {"id":"pnj-truth-kain-ferno","tier":"haute","shape":"terrain","skills":["Tir","Survie","Mêlée","Perception"],"anchor":"Kain Ferno prend des missions de mercenaire ; son héritage divin relève du MJ.","talents":["Terrain reconnu — contrats","Expertise éprouvée — Tir"],"truth":"Les pouvoirs et lignages révélés sont réservés à un autre profil MJ."},
];

export function applyPnjStatBatch15(byId:Map<string,Article>):void {
  if(PROFILES.length!==15||new Set(PROFILES.map(p=>p.id)).size!==15)throw new Error("PNJ · lot 15 incomplet ou dupliqué");
  const occultIds=new Set(["personnages-verite-especes-mloxol-vaagor","personnages-verite-especes-vhodhalnactru",
    "personnages-verite-especes-gajh-shaoggith","personnages-verite-especes-cthath-vhadhi"]);
  const occult=[...byId.values()].filter(article=>
    ["verite-aseryns-terres-temples-pnj","verite-vampire-courts-pnj","verite-extrals-groupes-pnj"].includes(article.dataset??"") || occultIds.has(article.id))
    .filter(article=>!article.sections?.some(section=>section.id==="profil-statistique"&&section.blocks?.length>=6));
  if(occult.length!==35)throw new Error("PNJ · coquilles occultes modifiées dans la source");
  for(const article of occult){
    if(article.sections?.some(section=>section.audience!=="mj"&&section.blocks?.some((block:Record<string,any>)=>block.type==="p"&&String(block.text??"").trim())))throw new Error(`PNJ · texte public conservé : ${article.id}`);
    const publicName=article.sections?.find(section=>section.id==="identite-realite-consolidee")?.blocks?.[0]?.rows?.find((row:string[])=>row[0]==="Nom")?.[1];
    if(publicName&&String(publicName).toLowerCase()!==String(article.title).toLowerCase())throw new Error(`PNJ · alias civil potentiel : ${article.id}`);
    article.audience="mj";
  }
  for(const profile of PROFILES){
    const article=byId.get(profile.id);
    if(!article)throw new Error(`PNJ · fiche active introuvable : ${profile.id}`);
    if(profile.id==="personnages-verite-especes-veronica-silver"){
      const stat=article.sections?.find(section=>section.id==="profil-statistique");
      const dossier=article.sections?.find(section=>section.id==="dossier-mj-consolide"&&section.audience==="mj");
      if(!stat||stat.blocks?.length!==1||!dossier||!String(stat.blocks[0].text).includes("grande reine Aseryn"))throw new Error("PNJ · souveraineté de Veronica non récupérée");
      dossier.blocks.push(stat.blocks[0]);stat.blocks=[];
    }
    if(!article.sections?.some(section=>section.id==="profil-statistique"))
      (article.sections??=[]).push({id:"profil-statistique",title:"Profil statistique",audience:"mj",blocks:[]});
    applyNamedPnjStatProfile(article,profile);
  }
}
