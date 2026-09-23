type Block = { type:"p"; text:string } | { type:"table"; rows:string[][] };
type Section = { id:string; title:string; level:2; audience:"mj"; blocks:Block[] };
type Article = { id:string; title?:string; sections?:Array<Record<string,any>>; [key:string]:any };

const table=(rows:string[][]):Block=>({type:"table",rows});
const paragraph=(text:string):Block=>({type:"p",text});

const npcTalents:Array<[string,string,string,string]>= [
  ["Expertise","Apex — compétence","PNJ nommé Héroïque ou Légendaire, spécialité documentée","Une compétence à 15 dans le budget de son palier, une seule par personnage ; aucun bonus au jet."],
  ["Expertise","Dossier préparé","Investigation 6+ et recherches préalables effectives","1/scène : +2 à un test d'Investigation, d'Autorité ou de Diplomatie fondé sur ce dossier ; une cible précise."],
  ["Expertise","Expertise éprouvée","Une compétence définie à 7+","1/scène : relancer le premier d10 d'un test de cette compétence et garder le second, y compris un échec narratif."],
  ["Expertise","Lecture des failles","Investigation ou Perception 7+ et observation réelle","1/scène : relever une faiblesse, routine ou ouverture effectivement accessible à l'observation ; aucune exploitation automatique."],
  ["Expertise","Fausse piste administrative","Investigation ou Savoirs 6+ et accès institutionnel","1/scénario : retarder ou orienter une consultation administrative vers une piste préparée ; n'efface aucune preuve déjà détenue."],
  ["Combat","Tir maîtrisé","Tir 7+ et 1 PA consacré à Viser","1/scène : relancer le premier d10 d'une attaque de Tir et garder le second ; exige arme et ligne de vue."],
  ["Combat","Désarmement net","Mêlée ou Pugilat 8+","1/scène, après une attaque réussie de marge 3+ : tenter un désarmement d'arme exposée comme Altération ; opposition physique appropriée."],
  ["Combat","Lutte brève","Pugilat 7+","1/scène, après une attaque de Pugilat réussie : engager une saisie contre une cible de gabarit compatible ; libération par opposition normale."],
  ["Combat","Décrochage préparé","Athlétisme ou Esquive 6+ et 1 PA disponible","1/scène, en réaction à une attaque déclarée : se déplacer de 2 m vers un espace réellement atteignable, avant sa résolution."],
  ["Combat","Terrain reconnu","Survie ou Perception 7+ et repérage préalable","1/scène : +2 à un test d'Athlétisme, de Survie ou de Perception lié à ce terrain réellement reconnu."],
  ["Combat","Chef de manœuvre","Autorité 6+ et allié en mesure d'entendre","1/scène : +2 au prochain test d'un allié pour un ordre tactique précis avant la fin du round ; ne se cumule pas avec l'Assistance."],
  ["Ressources","Réseau mobilisable","Autorité 6+ et réseau documenté","1/scénario : solliciter un service plausible ; la fiche précise personnes, délai, portée et traces. Aucun renfort instantané."],
  ["Ressources","Chaîne de commandement","Autorité 7+ et mandat réel","Accès prioritaire à une ressource conforme à la fonction ; les contrôles et contestations de l'institution demeurent."],
  ["Ressources","Plan de sortie","Investigation ou Autorité 6+ et itinéraire préparé","1/scène : signaler un repli crédible à un groupe briefé ; chacun paie ses PA et affronte les obstacles réels."],
  ["Vérité","Enveloppe vide","PNJ nommé, enveloppe effectivement préparée avant la scène","La présence détruite ne contient personne. La vraie position du PNJ et les indices de substitution sont établis à l'avance."],
  ["Vérité","Correction fatale","PNJ nommé explicitement protégé par l'Hologramme","Au plus 1/scénario, avant une blessure mortelle établie : infléchir l'événement si la cohérence locale le permet ; effets matériels conservés."],
  ["Vérité","Continuité du Pilier","Pilier identifié, par exemple Belyandra Queen","Permanent : une atteinte réelle à la personne rencontre les protections de sa Nature véritable ; aucune mort constatée n'est effacée."],
  ["Vérité","Éveil singulier","Transformation canonique propre à un PNJ nommé","Décrit les états et permissions propres à son histoire ; n'accorde aucun bonus numérique générique."]
];

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
      ["Sbire","20","20","4","0"],["Ennemi lambda","22","25","5","0–1"],
      ["Entraîné","25","40","7","1–2"],["Élite","28","55","9","2–3"],
      ["Haute élite","32","75","10","3–4"],["Héroïque","38","110","13","3–5"],
      ["Légendaire","42","140","14","4–6"],["Supérieur","46","170","15","sur mesure"]
    ])]},
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
