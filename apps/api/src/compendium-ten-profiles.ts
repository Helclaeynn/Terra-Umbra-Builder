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
const truthSkillTotal=(reality:readonly (readonly [string,number])[],truth:readonly (readonly [string,number])[])=>{
  const ranks=new Map(reality);
  for(const [name,rank] of truth)ranks.set(name,rank);
  return [...ranks.values()].reduce((sum,rank)=>sum+rank,0);
};
const table=(rows:string[][]):Block=>({type:"table",rows});
const p=(text:string):Block=>({type:"p",text});
const attrRow=(label:string,value:Attrs)=>[label,String(value.vigueur),String(value.agilite),String(value.esprit),String(value.volonte),String(value.charisme),String(sumAttrs(value))];

export const COMPENDIUM_TEN_PROFILE_CALIBRATION=[
  {
    sourceId:"pnj-crawlers-docx-veronica-silver",name:"Veronica Silver",
    reality:{attributes:attrs(7,8,10,9,8),skills:skills(["Investigation","Perception","Autorité","Tir","Furtivité","Diplomatie","Force Mentale","Survie","Esquive","Athlétisme","Savoirs","Constitution","Mêlée","Langages & Argot"])},
    truth:{ptv:48,semi:attrs(9,10,15,16,14),revealed:attrs(10,11,16,17,14),skills:[["Investigation",24],["Autorité",22],["Force Mentale",23]] as Skill[],signature:"Grande reine Aseryn et Architecte : commandement, lecture des structures et souveraineté."}
  },
  {
    sourceId:"pnj-police-catalina-de-la-caza",name:"Catalina de la Caza",
    reality:{attributes:attrs(9,10,7,9,7),skills:skills(["Tir","Pugilat","Mêlée","Athlétisme","Esquive","Autorité","Perception","Survie","Force Mentale","Investigation","Constitution","Pilotage","Furtivité","Diplomatie"])},
    truth:{ptv:48,semi:attrs(11,11,15,16,13),revealed:attrs(12,12,16,17,13),skills:[["Pugilat",20],["Force Mentale",27],["Autorité",22]] as Skill[],signature:"V’Aagorlina : profil comparable avant le pic de fusion avec V’Aagor ; ce pic exceptionnel reste chiffré séparément."}
  },
  {
    sourceId:"pnj-gouvernement-dina-page",name:"Dina Page",
    reality:{attributes:attrs(8,10,8,9,7),skills:skills(["Pilotage","Athlétisme","Savoirs","Force Mentale","Pugilat","Autorité","Esquive","Diplomatie","Perception","Tir","Constitution","Survie","Investigation","Langages & Argot"])},
    truth:{ptv:48,semi:attrs(10,10,14,16,12),revealed:attrs(10,10,16,17,13),skills:[["Force Mentale",22],["Autorité",19],["Savoirs",20],["Pugilat",18]] as Skill[],signature:"Manifestation de Helheim : esprits, mort et fonction psychopompe."}
  },
  {
    sourceId:"pnj-gouvernement-farah-el-arshad",name:"Farah el Arshad",
    reality:{attributes:attrs(8,8,10,9,7),skills:skills(["Autorité","Diplomatie","Investigation","Savoirs","Force Mentale","Tir","Mêlée","Pugilat","Perception","Esquive","Athlétisme","Constitution","Pilotage","Survie"])},
    truth:{ptv:48,semi:attrs(11,10,13,14,14),revealed:attrs(12,11,14,15,14),skills:[["Autorité",21],["Force Mentale",23],["Survie",18]] as Skill[],signature:"Héritière d’Akvan et Gaïa : souveraineté des Dives et des Nymphes."}
  },
  {
    sourceId:"pnj-crawlers-docx-leslie-wright",name:"Leslie Wright",
    reality:{attributes:attrs(6,7,10,10,9),skills:skills(["Savoirs","Mécanique","Investigation","Neurodive","Force Mentale","Perception","Représentation","Pugilat","Mêlée","Diplomatie","Autorité","Athlétisme","Esquive","Constitution"])},
    truth:{ptv:48,semi:attrs(6,7,19,17,12),revealed:attrs(7,8,20,18,12),skills:[["Savoirs",24],["Investigation",22],["Mécanique",21]] as Skill[],signature:"Attribut Divin du Génie et Mageius Merlin : savoir, invention et architecture magique."}
  },
  {
    sourceId:"pnj-agences-makana-keahi",name:"Makana Keahi",
    reality:{attributes:attrs(9,10,7,9,7),skills:skills(["Mêlée","Pilotage","Perception","Pugilat","Force Mentale","Survie","Athlétisme","Autorité","Tir","Esquive","Furtivité","Investigation","Langages & Argot","Constitution"])},
    truth:{ptv:48,semi:attrs(14,12,12,13,10),revealed:attrs(15,13,13,14,10),skills:[["Mêlée",24],["Pugilat",21],["Force Mentale",20]] as Skill[],signature:"Incarnation de Sumarbrander : feu, mer et puissance de l’épée de Surtr."}
  },
  {
    sourceId:"pnj-corporations-wei-shi",name:"Wei Shi",
    reality:{attributes:attrs(8,9,9,9,7),skills:skills(["Investigation","Représentation","Autorité","Pugilat","Mêlée","Perception","Diplomatie","Furtivité","Force Mentale","Savoirs","Tir","Esquive","Athlétisme","Langages & Argot"])},
    truth:{ptv:48,semi:attrs(9,11,17,16,12),revealed:attrs(10,12,18,17,12),skills:[["Force Mentale",25],["Mêlée",22],["Savoirs",20]] as Skill[],signature:"Clan Shi puis Légionnaire du Néant accidentelle : discipline, enquête et rupture du Néant."}
  },
  {
    sourceId:"pnj-corporations-siobhain-nic-siridean",name:"Siobhain Nic Sirideain",
    reality:{attributes:attrs(8,9,8,9,8),skills:skills(["Représentation","Autorité","Diplomatie","Mêlée","Pugilat","Athlétisme","Esquive","Force Mentale","Perception","Savoirs","Investigation","Tir","Commerce","Langages & Argot"])},
    truth:{ptv:48,semi:attrs(10,9,16,15,14),revealed:attrs(11,10,17,16,14),skills:[["Autorité",20],["Force Mentale",24],["Représentation",18]] as Skill[],signature:"Héritière de Morrighan et ancre du Sidh : présence, souveraineté et canalisation du Sidh."}
  },
  {
    sourceId:"pnj-corporations-tokala",name:"Tokala",
    reality:{attributes:attrs(9,9,7,9,8),skills:skills(["Mêlée","Pugilat","Athlétisme","Esquive","Survie","Perception","Autorité","Tir","Force Mentale","Constitution","Diplomatie","Investigation","Furtivité","Savoirs"])},
    truth:{ptv:48,semi:attrs(17,14,8,12,10),revealed:attrs(19,15,9,13,10),skills:[["Pugilat",24],["Survie",22],["Mêlée",21]] as Skill[],signature:"Khinae éveillée : base Exceptionnelle commune. L’état Nnyrss parfait reste un état canonique singulier hors étalon."}
  },
  {
    sourceId:"pnj-ten-svetlana-konstantinovna",name:"Svetlana Konstantinovna",
    reality:{attributes:attrs(8,8,9,9,8),skills:skills(["Savoirs","Autorité","Diplomatie","Perception","Force Mentale","Pugilat","Mêlée","Investigation","Furtivité","Représentation","Commerce","Esquive","Athlétisme","Constitution"])},
    truth:{ptv:48,semi:attrs(12,9,14,15,13),revealed:attrs(13,10,15,16,13),skills:[["Force Mentale",21],["Investigation",20],["Autorité",23]] as Skill[],signature:"Mashia’h, Nephilim divin et prophète : lumière, anges, marques et Attributs divins."}
  }
] as const;

export function applyCompendiumTenProfiles(byId:Map<string,Article>,resolveTargetId:(sourceId:string)=>string):void{
  for(const profile of COMPENDIUM_TEN_PROFILE_CALIBRATION){
    const targetId=resolveTargetId(profile.sourceId);
    const article=byId.get(targetId);
    if(!article)throw new Error(`Ten · profil cible absent: ${profile.sourceId} -> ${targetId}`);
    const priorTruth=article.sections?.find(section=>String(section.id??"").startsWith("profil-verite-"));
    if(!priorTruth)throw new Error(`Ten · profil de Vérité individuel absent: ${profile.name}`);
    const revealedRow=(priorTruth.blocks??[]).find((block:Block)=>block.type==="table"&&block.rows[0]?.[0]==="Attribut révélé") as Block|undefined;
    if(revealedRow?.type==="table"){
      const expected=[profile.truth.revealed.vigueur,profile.truth.revealed.agilite,profile.truth.revealed.esprit,profile.truth.revealed.volonte,profile.truth.revealed.charisme];
      const actual=revealedRow.rows[1]?.slice(1).map(Number);
      if(JSON.stringify(actual)!==JSON.stringify(expected))throw new Error(`Ten · Vérité contradictoire entre les deux blocs: ${profile.name}`);
    }else if(profile.name==="Tokala"){
      if(!JSON.stringify(priorTruth.blocks).includes("19 / 15 / 9 / 13 / 10"))throw new Error("Ten · profil Khinae de Tokala désynchronisé");
    }else throw new Error(`Ten · chiffrage révélé introuvable: ${profile.name}`);
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
      p(`Les rangs de Vérité ci-dessus remplacent ceux des mêmes compétences de Réalité ; les autres compétences sont conservées. Total effectif : ${truthSkillTotal(profile.reality.skills,profile.truth.skills)} rangs de Compétences en Vérité, contre ${realityTier.skills} en Réalité.`),
      p(`Signature de Vérité · ${profile.truth.signature}`)
    ];
    // The statistical block is always terminal and protected.
    article.sections=[...(article.sections??[]).filter(section=>section!==stat),stat];
  }
}
