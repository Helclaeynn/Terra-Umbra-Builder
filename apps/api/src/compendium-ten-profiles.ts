import { NPC_TIERS } from "./npc-tiers.js";
import { NPC_TRUTH_TIERS } from "./npc-truth-tiers.js";

type Block = {type:"p";text:string}|{type:"table";rows:string[][]};
type Article = {id:string;title?:string;tags?:string[];sections?:Array<Record<string,any>>;[key:string]:any};
type Attrs = {vigueur:number;agilite:number;esprit:number;volonte:number;charisme:number};
type Skill = [string,number];

const realityTier=NPC_TIERS.find(tier=>tier.id==="legendaire") ?? (()=>{throw new Error("Ten · étalon PNJ Légendaire introuvable");})();
const truthTier=NPC_TRUTH_TIERS.find(tier=>tier.id==="exceptionnel") ?? (()=>{throw new Error("Ten · étalon Vérité Exceptionnel introuvable");})();

const ranks=[14,13,12,12,11,11,10,10,10,9,8,7,7,6] as const;
const skills=(names:string[]):Skill[]=>{
  if(names.length!==ranks.length)throw new Error(`Ten · 14 compétences attendues, reçu ${names.length}`);
  return names.map((name,index)=>[name,ranks[index]]);
};
const attrs=(vigueur:number,agilite:number,esprit:number,volonte:number,charisme:number):Attrs=>({vigueur,agilite,esprit,volonte,charisme});
const sumAttrs=(value:Attrs)=>Object.values(value).reduce((sum,n)=>sum+n,0);
const table=(rows:string[][]):Block=>({type:"table",rows});
const p=(text:string):Block=>({type:"p",text});
const attrRow=(label:string,value:Attrs)=>[label,String(value.vigueur),String(value.agilite),String(value.esprit),String(value.volonte),String(value.charisme),String(sumAttrs(value))];

export const COMPENDIUM_TEN_PROFILE_CALIBRATION=[
  {
    sourceId:"pnj-crawlers-docx-veronica-silver",name:"Veronica Silver",
    reality:{attributes:attrs(7,8,10,9,8),skills:skills(["Investigation","Perception","Autorité","Tir","Furtivité","Diplomatie","Force Mentale","Survie","Esquive","Athlétisme","Savoirs","Constitution","Mêlée","Langages & Argot"])},
    truth:{ptv:48,semi:attrs(8,9,11,10,8),revealed:attrs(9,10,12,11,8),skills:[["Investigation",16],["Autorité",15],["Force Mentale",14]] as Skill[],signature:"Grande reine Aseryn et Architecte : commandement, lecture des structures et souveraineté."}
  },
  {
    sourceId:"pnj-police-catalina-de-la-caza",name:"Catalina de la Caza",
    reality:{attributes:attrs(9,10,7,9,7),skills:skills(["Tir","Pugilat","Mêlée","Athlétisme","Esquive","Autorité","Perception","Survie","Force Mentale","Investigation","Constitution","Pilotage","Furtivité","Diplomatie"])},
    truth:{ptv:48,semi:attrs(10,11,7,10,8),revealed:attrs(12,12,7,11,8),skills:[["Pugilat",16],["Force Mentale",15],["Autorité",14]] as Skill[],signature:"V’Aagorlina : puissance de confrontation et autorité du Roi des Fléaux, sans effacer la volonté de Catalina."}
  },
  {
    sourceId:"pnj-gouvernement-dina-page",name:"Dina Page",
    reality:{attributes:attrs(8,10,8,9,7),skills:skills(["Pilotage","Athlétisme","Pugilat","Autorité","Esquive","Force Mentale","Diplomatie","Perception","Tir","Constitution","Survie","Investigation","Savoirs","Langages & Argot"])},
    truth:{ptv:48,semi:attrs(9,10,9,10,8),revealed:attrs(10,11,10,11,8),skills:[["Force Mentale",16],["Autorité",15],["Savoirs",14]] as Skill[],signature:"Manifestation de Helheim : esprits, mort et fonction psychopompe."}
  },
  {
    sourceId:"pnj-gouvernement-farah-el-arshad",name:"Farah el Arshad",
    reality:{attributes:attrs(8,8,10,9,7),skills:skills(["Autorité","Diplomatie","Investigation","Savoirs","Force Mentale","Tir","Mêlée","Pugilat","Perception","Esquive","Athlétisme","Constitution","Pilotage","Langages & Argot"])},
    truth:{ptv:48,semi:attrs(8,9,11,10,8),revealed:attrs(9,10,12,11,8),skills:[["Autorité",16],["Force Mentale",15],["Diplomatie",14]] as Skill[],signature:"Héritière d’Akvan et Gaïa : souveraineté des Dives et des Nymphes."}
  },
  {
    sourceId:"pnj-crawlers-docx-leslie-wright",name:"Leslie Wright",
    reality:{attributes:attrs(6,7,10,10,9),skills:skills(["Savoirs","Mécanique","Investigation","Neurodive","Force Mentale","Perception","Représentation","Pugilat","Mêlée","Diplomatie","Autorité","Athlétisme","Esquive","Constitution"])},
    truth:{ptv:48,semi:attrs(6,8,12,11,9),revealed:attrs(7,9,13,12,9),skills:[["Savoirs",16],["Force Mentale",15],["Mécanique",14]] as Skill[],signature:"Attribut Divin du Génie et Mageius Merlin : savoir, invention et architecture magique."}
  },
  {
    sourceId:"pnj-agences-makana-keahi",name:"Makana Keahi",
    reality:{attributes:attrs(9,10,7,9,7),skills:skills(["Pilotage","Perception","Pugilat","Survie","Athlétisme","Autorité","Tir","Esquive","Furtivité","Force Mentale","Investigation","Langages & Argot","Constitution","Diplomatie"])},
    truth:{ptv:48,semi:attrs(10,11,7,10,8),revealed:attrs(12,12,7,11,8),skills:[["Mêlée",16],["Force Mentale",15],["Survie",14]] as Skill[],signature:"Incarnation de Sumarbrander : feu, mer et puissance de l’épée de Surtr."}
  },
  {
    sourceId:"pnj-corporations-wei-shi",name:"Wei Shi",
    reality:{attributes:attrs(8,9,9,9,7),skills:skills(["Investigation","Représentation","Autorité","Pugilat","Mêlée","Perception","Diplomatie","Furtivité","Force Mentale","Savoirs","Tir","Esquive","Athlétisme","Langages & Argot"])},
    truth:{ptv:48,semi:attrs(8,10,10,10,8),revealed:attrs(9,11,11,11,8),skills:[["Force Mentale",16],["Investigation",15],["Mêlée",14]] as Skill[],signature:"Clan Shi puis Légionnaire du Néant accidentelle : discipline, enquête et rupture du Néant."}
  },
  {
    sourceId:"pnj-corporations-siobhain-nic-siridean",name:"Siobhain Nic Sirideain",
    reality:{attributes:attrs(8,9,8,9,8),skills:skills(["Représentation","Autorité","Diplomatie","Mêlée","Pugilat","Athlétisme","Esquive","Force Mentale","Perception","Savoirs","Investigation","Tir","Commerce","Langages & Argot"])},
    truth:{ptv:48,semi:attrs(8,10,9,10,9),revealed:attrs(9,11,10,11,9),skills:[["Autorité",16],["Force Mentale",15],["Représentation",14]] as Skill[],signature:"Héritière de Morrighan et ancre du Sidh : présence, souveraineté et canalisation du Sidh."}
  },
  {
    sourceId:"pnj-corporations-tokala",name:"Tokala",
    reality:{attributes:attrs(9,9,7,9,8),skills:skills(["Mêlée","Pugilat","Athlétisme","Esquive","Survie","Perception","Autorité","Tir","Force Mentale","Constitution","Diplomatie","Investigation","Furtivité","Savoirs"])},
    truth:{ptv:48,semi:attrs(11,10,7,10,8),revealed:attrs(13,11,8,10,8),skills:[["Pugilat",16],["Survie",15],["Mêlée",14]] as Skill[],signature:"Khinae éveillée : base Exceptionnelle commune. L’état Nnyrss parfait reste un état canonique singulier hors étalon."}
  },
  {
    sourceId:"pnj-ten-svetlana-konstantinovna",name:"Svetlana Konstantinovna",
    reality:{attributes:attrs(8,8,9,9,8),skills:skills(["Savoirs","Autorité","Diplomatie","Perception","Force Mentale","Pugilat","Mêlée","Investigation","Furtivité","Représentation","Commerce","Esquive","Athlétisme","Constitution"])},
    truth:{ptv:48,semi:attrs(8,9,10,10,9),revealed:attrs(9,10,11,11,9),skills:[["Force Mentale",16],["Savoirs",15],["Autorité",14]] as Skill[],signature:"Mashia’h, Nephilim divin et prophète : lumière, anges, marques et Attributs divins."}
  }
] as const;

export function applyCompendiumTenProfiles(byId:Map<string,Article>,resolveTargetId:(sourceId:string)=>string):void{
  for(const profile of COMPENDIUM_TEN_PROFILE_CALIBRATION){
    const targetId=resolveTargetId(profile.sourceId);
    const article=byId.get(targetId);
    if(!article)throw new Error(`Ten · profil cible absent: ${profile.sourceId} -> ${targetId}`);
    article.tags=[...new Set([...(article.tags??[]),"Ten"])];
    article.status="canon_enrichi";
    article.rebuildV2=true;

    const sections=article.sections??[];
    let stat=sections.find(section=>String(section.id??"")==="profil-statistique");
    if(!stat){
      stat={id:"profil-statistique",title:`Profil statistique · ${profile.name}`,level:2,audience:"mj",blocks:[]};
      article.sections=[...sections,stat];
    }
    stat.title=`Profil statistique · ${profile.name}`;
    stat.audience="mj";
    stat.blocks=[
      p(`Ten · Légendaire · Réalité · ${realityTier.attributes} points d’Attributs · ${realityTier.skills} points de Compétences · plafond ${realityTier.cap}. Ce socle commun rend les dix Ten comparables sans effacer leurs spécialités.`),
      table([
        ["Attribut","Vigueur","Agilité","Esprit","Volonté","Charisme","Total"],
        attrRow("Valeur",profile.reality.attributes)
      ]),
      table([
        ["Compétence","Rang"],
        ...profile.reality.skills.map(([name,rank])=>[name,String(rank)]),
        ["Total des rangs retenus",String(profile.reality.skills.reduce((sum,[,rank])=>sum+rank,0))]
      ]),
      p(`Vérité · Exceptionnel · calibration commune à ${profile.truth.ptv} PTV génériques MJ. Les capacités de Nature, Dons, Rites et formes singulières du canon restent distincts de ce budget de comparaison.`),
      table([
        ["État","Vigueur","Agilité","Esprit","Volonté","Charisme","Total"],
        attrRow("Voilé · profil de Réalité",profile.reality.attributes),
        attrRow("Semi-Révélé · Exceptionnel",profile.truth.semi),
        attrRow("Révélé · Exceptionnel",profile.truth.revealed)
      ]),
      table([
        ["Compétence de Vérité signature","Rang"],
        ...profile.truth.skills.map(([name,rank])=>[name,String(rank)])
      ]),
      p(`Signature de Vérité · ${profile.truth.signature}`)
    ];
    // The statistical block is always terminal and protected.
    article.sections=[...(article.sections??[]).filter(section=>section!==stat),stat];
  }
}
