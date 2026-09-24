import {NPC_TIERS,npcTalents} from './npc-rules.js';
import {NPC_TRUTH_TIERS,NPC_EXCEPTIONAL_SKILLS} from './npc-truth-tiers.js';
import {NPC_TRUTH_GENERIC_TALENTS} from './npc-truth-generic-talents.js';
type Block = { type:"p"; text:string } | { type:"table"; rows:string[][] };
type Section = { id:string; title:string; level:2; audience:"mj"; blocks:Block[] };
type Article = { id:string; title?:string; sections?:Array<Record<string,any>>; [key:string]:any };

const table=(rows:string[][]):Block=>({type:"table",rows});
const paragraph=(text:string):Block=>({type:"p",text});



export const COMPENDIUM_PNJ_TALENTS_ARTICLE={
  id:"regles-pnj-talents-statistiques",dataset:"pnj-stat-profiles",category:"Règles",sourceCategory:"Règles",
  title:"Talents et profils statistiques des PNJ",source:"Construction MJ des PNJ nommés · étalon validé",status:"canon_enrichi",rebuildV2:true,
  audience:"mj",tags:["MJ","PNJ","Talents","Statistiques"],
  sections:[
    {id:"portee",title:"Périmètre",level:2,blocks:[
      paragraph("Ces talents sont attribués fiche par fiche aux PNJ nommés. Ils ne sont ni un équipement automatique du Bestiaire ni un catalogue achetable par les PJ. Réutiliser les talents de Réalité ou de Vérité existants lorsqu'ils produisent déjà l'effet voulu."),
      paragraph("Les budgets de compétences incluent les rangs Apex. Les bonus de circonstances similaires ne se cumulent pas avec une Assistance équivalente : conserver le meilleur. Les capacités achetées en PTV et les statuts singuliers, notamment Pilier et Nnyrss, restent distincts.")
    ]},
    {id:"echelle",title:"Échelle de Réalité",level:2,blocks:[table([
      ["Palier","Attributs","Compétences","Plafond ordinaire","Talents PNJ indicatifs"],
      ...NPC_TIERS.map(t=>[t.name,String(t.attributes),String(t.skills),String(t.cap),t.talents])
    ])]},
    {id:"echelle-verite",title:"Échelle de Vérité",level:2,audience:"mj",blocks:[
      paragraph("Le palier de Vérité est indépendant de celui de Réalité. Un cadre civil peut être un souverain surnaturel ; ses pouvoirs, ses formes et ses rapports de force ne sont jamais déduits de sa fonction publique. Cette échelle guide la construction des prétirés, sans plafonner les personnages canoniques."),
      table([["Profil de Vérité","PTV dépensés indicatifs","Repère de création"],
        ...NPC_TRUTH_TIERS.map(t=>[t.name,t.maxPtv===null?`${t.minPtv}+`:`${t.minPtv}–${t.maxPtv}`,t.guidance])]),
      paragraph("Pour les Dons, Rites et Talents canoniques, additionner seulement les coûts des achats retenus après contrôle de leurs prérequis. Les PNJ disposent aussi des talents génériques MJ décrits plus bas : leur coût et leur total PTV sont des estimations éditoriales explicites, déterminées par la puissance de la fiche et ses compétences propres. Les propriétés gratuites de Nature ne s'achètent pas. Ni ce total ni un titre ne mesurent à eux seuls le pouvoir d'un ancien souverain : noter séparément lignage, transformations, contraintes et capacités singulières."),
      paragraph("Noter distinctement les états Voilé, Semi-Révélé et Révélé ; Révélé remplace Semi-Révélé, sans cumul. Les chiffres de Réalité restent le point de départ du corps Voilé, tandis que les modificateurs de Nature et les capacités effectivement acquises sont appliqués selon leur état. Toute information de Vérité sur un PNJ doit rester dans une section MJ.")
    ]},
    {id:"exceptions-verite",title:"Exceptions des figures singulières",level:2,audience:"mj",blocks:[
      paragraph("Le plafond ordinaire de compétence du palier Supérieur est 15. Certains PNJ nommés hors de portée des PJ peuvent le dépasser dans leur profil de Vérité. Chaque exception est attribuée fiche par fiche à une compétence justifiée par le récit ; elle ne modifie ni leur profil de Réalité ni les règles des PJ. Un titre seul ne suffit pas."),
      table([["Rang de compétence","Usage réservé au MJ"],...NPC_EXCEPTIONAL_SKILLS.map(row=>[row.range,row.scope])]),
      paragraph("Le PNJ peut aussi recevoir un Talent signature inédit. Sa fiche indique le déclencheur, le coût ou la fréquence, l'effet exact, les limites et le fait établi dans le lore qui justifie ce choix. Une capacité déjà présente dans le catalogue conserve sa règle et son coût canonique ; une signature ne donne pas gratuitement tous les pouvoirs d'une Nature.")
    ]},
    {id:"talents-verite-pnj-generiques",title:"Talents de Vérité génériques des PNJ",level:2,audience:"mj",blocks:[
      paragraph("Ces achats éditoriaux réservés aux PNJ permettent de jouer les profils de Vérité sans attribuer à chaque individu tout un arbre de Dons de PJ. Chaque fiche donne ses talents effectivement retenus, leur dépense PTV et la compétence concernée. Le budget n'est pas un fait historique du dossier. Une capacité de Nature ou un Don décrit par la source conserve ses propres contraintes ; ne pas lui substituer automatiquement un talent générique."),
      table([["Talent PNJ de Vérité","Coût PTV","Prérequis","Effet et limite"],...NPC_TRUTH_GENERIC_TALENTS.map(t=>[t.name,String(t.cost),t.prerequisite,t.effect])])
    ]},
    ...["Expertise","Combat","Ressources","Vérité"].map((group)=>({
      id:`talents-${group.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}`,
      title:`Talents — ${group}`,level:2,blocks:[table([
        ["Talent","Prérequis","Effet et limite"],
        ...npcTalents.filter((row)=>row[0]===group).map((row)=>row.slice(1))
      ])]
    }))
  ]
};

export const COMPENDIUM_PNJ_TALENTS_NAVIGATION={
  id:"regles-pnj-talents-statistiques",dataset:"pnj-stat-profiles",category:"Règles",
  group:"PNJ · règles MJ",groupOrder:90,pageOrder:1,displayTitle:"Talents et profils statistiques des PNJ"
};

const coleSkills:Array<[string,string]>= [
  ["Investigation","9"],["Autorité","7"],["Furtivité","6"],["Perception, Savoirs","5 chacun"],
  ["Force Mentale, Esquive","4 chacun"],["Tir, Athlétisme, Constitution, Diplomatie","3 chacun"],
  ["Langages & Argot, Survie, Mêlée","1 chacun"],["Autres compétences canoniques (11)","0"]
];

export function applyCompendiumPnjStatProfiles(byId:Map<string,Article>):void {
  const cole=byId.get("pnj-agences-cole-gallagher");
  if(!cole)throw new Error("PNJ · fiche canonique de Cole Gallagher introuvable");
  const sections=Array.isArray(cole.sections)?cole.sections:[];
  const stats=sections.filter((s)=>s.id==="profil-statistique"||/^(profil statistique|statistiques)$/i.test(String(s.title??"")));
  if(stats.length!==1)throw new Error(`PNJ · profil statistique Cole ambigu : ${stats.length}`);
  if(sections[sections.length-1]!==stats[0])throw new Error("PNJ · profil statistique Cole doit rester terminal");
  stats[0].id="profil-statistique";
  stats[0].title="Profil statistique · Cole Gallagher";
  stats[0].audience="mj";
  stats[0].blocks=[
    paragraph("Élite · Réalité · 28 points d'Attributs · 55 points de Compétences. Aucune Vérité personnelle, augmentation ou protection de l'Hologramme attribuée sans source."),
    table([["Attribut","Vigueur","Agilité","Esprit","Volonté","Charisme"],["Valeur","5","5","7","6","5"]]),
    table([["Compétences","Rang"],...coleSkills]),
    table([
      ["Valeur dérivée","Calcul","Résultat"],
      ["PV maximum","2 × Vigueur + Constitution","13"],
      ["Seuil de Mort","−(Vigueur + Constitution)","−8"],
      ["Défense passive / active","Agilité + Esquive ; active 1 PA","9 / 9 + 1d10e"],
      ["Défense occulte passive / active","Volonté + Force Mentale ; active 1 PA","10 / 10 + 1d10e"],
      ["Initiative / PA","Agilité + Athlétisme + 1d10e ; 1 naturel = 1 PA","8 + 1d10e / 1 à 3 PA"],
      ["Déplacement","5 + Athlétisme","8 m par PA"],
      ["Intégrité / Stress augmentique max","Force Mentale + Humanité / Vigueur + Humanité","4 / 5"],
      ["Armure portée","Tenue civile","0"]
    ]),
    paragraph("Jets rapides : Investigation 16 + 1d10e ; Autorité 12 + 1d10e ; Furtivité et Perception 11 + 1d10e ; Diplomatie et Tir 8 + 1d10e. Le Tir exige une arme réellement portée ou disponible. Sans arme : Pugilat 5 + 1d10e, DGT de base 1."),
    table([
      ["Talent PNJ","Application sur la fiche"],
      ["Dossier préparé","Après recherches réelles sur une cible précise, 1/scène : +2 à un test lié au dossier."],
      ["Lecture des failles","Après observation réelle, 1/scène : un indice accessible sur une faiblesse ou routine existante."],
      ["Réseau mobilisable — CBII","1/scénario : demander personnel ou appui relevant de son poste ; délai et traces institutionnelles réels."]
    ]),
    paragraph("Scène étalon : tenue civile, communicateur professionnel, sans arme ni armure portée. Cole cherche à identifier les PJ et leurs preuves, négocie ou appelle des appuis. Ses liens passés et ses pratiques confidentielles concernant les Logifate restent dans le dossier MJ. Une attaque réussie contre lui a les conséquences normales.")
  ];
  const replaceStats=(id:string,title:string,blocks:Block[]):void=>{
    const person=byId.get(id);
    if(!person)throw new Error(`PNJ · fiche canonique introuvable : ${id}`);
    const all=person.sections??[];
    const matches=all.filter((section)=>section.id==="profil-statistique");
    if(matches.length>1||(matches.length===1&&all.at(-1)!==matches[0]))throw new Error(`PNJ · profil statistique ambigu : ${id}`);
    if(!matches.length){
      person.sections=[...all,{id:"profil-statistique",level:2,title:`Profil statistique · ${title}`,audience:"mj",blocks}];
    }else{
      matches[0].title=`Profil statistique · ${title}`;
      matches[0].audience="mj";
      matches[0].blocks=blocks;
    }
  };
  replaceStats("pnj-148-kai-gehrman","Kai Gehrman",[
    paragraph("Élite · Réalité · 28 points d'Attributs · 55 points de Compétences. Spécialités documentées : économie et holomatique au service d'Arcanet. Ce profil estime sa capacité professionnelle ; il ne chiffre pas sa magie."),
    table([["Attribut","Vigueur","Agilité","Esprit","Volonté","Charisme"],["Valeur","3","4","9","7","5"]]),
    table([["Compétence","Rang"],["Savoirs (économie, holomatique)","9"],["Investigation","7"],["Mécanique","5"],["Perception, Diplomatie","6 chacun"],["Autorité","5"],["Force Mentale, Langages & Argot","4 chacun"],["Esquive, Athlétisme","2 chacun"],["Constitution","1"],["Autres","0"]]),
    table([["Valeur dérivée","Résultat"],["PV maximum / Seuil de Mort","7 / −4"],["Défense passive / active","6 / 6 + 1d10e"],["Défense occulte passive / active","11 / 11 + 1d10e"],["Initiative / déplacement","6 + 1d10e / 7 m par PA"]]),
    paragraph("Talents : Expertise éprouvée (Savoirs, 1/scène) ; Dossier préparé (recherches économiques ou holomatiques préalables, 1/scène) ; Lecture des failles (Investigation, 1/scène). Équipement : aucun armement déduit du dossier."),
    paragraph("Vérité : le dossier MJ atteste une identité de Mage, sans caractéristiques magiques chiffrées assez sûres pour fixer ses PTV, son amplitude ou sa maîtrise. Arbitrage requis avant tout bloc de Vérité.")
  ]);
  replaceStats("pnj-corporations-baldwin-vandrick","Baldwin Vandrick",[
    paragraph("Élite · Réalité · 28 points d'Attributs · 55 points de Compétences. Banquier et président de Laguna Bank Corporation : ses moyens sont institutionnels et soumis à des délais."),
    table([["Attribut","Vigueur","Agilité","Esprit","Volonté","Charisme"],["Valeur","4","4","8","7","5"]]),
    table([["Compétence","Rang"],["Autorité","9"],["Diplomatie","8"],["Investigation, Savoirs (finance)","7 chacun"],["Force Mentale, Perception","5 chacun"],["Langages & Argot","4"],["Esquive","3"],["Tir, Athlétisme, Constitution","2 chacun"],["Pugilat","1"],["Autres","0"]]),
    table([["Valeur dérivée","Résultat"],["PV maximum / Seuil de Mort","10 / −6"],["Défense passive / active","7 / 7 + 1d10e"],["Défense occulte passive / active","12 / 12 + 1d10e"],["Initiative / déplacement","6 + 1d10e / 7 m par PA"]]),
    paragraph("Talents : Réseau mobilisable (Laguna Bank, 1/scénario) ; Chaîne de commandement (ressources de la corporation dans le cadre de ses fonctions) ; Dossier préparé (finance et dossiers institutionnels, après recherches réelles). Aucun garde ou équipement de combat automatique."),
    paragraph("Profil de Vérité : la fiche conserve son dossier MJ ; aucun PTV ni pouvoir supplémentaire n'est déduit de sa fonction publique.")
  ]);
  replaceStats("personnages-verite-especes-tokala","Tokala",[
    paragraph("Légendaire · Réalité · Ten · 42 points d'Attributs · 140 points de Compétences. Ancienne béret vert, spécialiste du tomahawk et du pugilat ; son Tir 9 rappelle sa formation militaire. Le profil chiffré décrit sa présence dans la Réalité, sans limiter sa forme révélée."),
    table([["Attribut","Vigueur","Agilité","Esprit","Volonté","Charisme"],["Valeur","9","9","7","9","8"]]),
    table([["Compétence","Rang"],["Mêlée (tomahawk)","15 · Apex"],["Pugilat, Athlétisme, Esquive","12 chacun"],["Survie","11"],["Perception, Autorité","10 chacun"],["Tir, Force Mentale","9 chacun"],["Constitution","8"],["Diplomatie, Investigation","7 chacun"],["Savoirs, Furtivité","6 chacun"],["Langages & Argot","5"],["Mécanique","1"],["Autres","0"]]),
    table([["Valeur dérivée","Résultat"],["PV maximum / Seuil de Mort","26 / −17"],["Défense passive / active","21 / 21 + 1d10e"],["Défense occulte passive / active","18 / 18 + 1d10e"],["Initiative / déplacement","21 + 1d10e / 17 m par PA"]]),
    paragraph("Talents : Apex — Mêlée ; Désarmement net ; Terrain reconnu ; Chef de manœuvre. Aucun talent de tir ne suppose qu'elle porte systématiquement une arme à feu. Ses ressources de présidente et de cheffe politique requièrent les délais et alliés du scénario."),
    paragraph("Vérité révélée : Khinae devenue Nnyrss après plusieurs éveils. Éveil singulier décrit ses transformations et la mémoire des reines Khinae. À ce stade, elle est hors de portée d'un PJ ; aucune valeur finie de défense ou de PV ne prétend représenter la Nnyrss. PTV, amplitude et maîtrise exacts restent à fixer avec le canon des Ten.")
  ]);
  byId.set(COMPENDIUM_PNJ_TALENTS_ARTICLE.id,COMPENDIUM_PNJ_TALENTS_ARTICLE as unknown as Article);
}
