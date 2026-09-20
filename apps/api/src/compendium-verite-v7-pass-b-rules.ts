import { editorializeTruthSections } from "./compendium-verite-v7-editorial.js";

type Block =
  | { type: "p"; text: string; style?: string }
  | { type: "table"; rows: unknown[][] };
type Section = { id: string; title: string; level: number; audience?: "mj"; blocks: Block[] };
type Article = {
  id: string;
  dataset: string;
  category: "Règles";
  sourceCategory: "Règles";
  title: string;
  source: string;
  status: string;
  rebuildV2: true;
  tags: string[];
  sections: Section[];
};

const SOURCE = "TUC_Verite_V7_CROSSAUDIT_2026-09-10.docx";

const article = (id: string, title: string, tags: string[], sections: Section[]): Article => ({
  id,
  dataset: "verite-v7",
  category: "Règles",
  sourceCategory: "Règles",
  title,
  source: SOURCE,
  status: "canon_enrichi",
  rebuildV2: true,
  tags,
  sections: editorializeTruthSections(sections) as Section[]
});

const EXILE_PROFILES: Section[] = [
  {
    id: "etats",
    title: "Profils des cinq peuples",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les modificateurs ci-dessous sont ceux de la Nature en SR et R. Ils ne remplacent jamais les Attributs bruts du personnage et suivent les règles communes de transition V/SR/R."
      },
      {
        type: "table",
        rows: [
          ["Peuple", "SR", "R", "Traits gratuits structurants"],
          ["Elyë", "+1 Agilité", "+1 Agilité, +1 Esprit, +1 Charisme", "Ambidextrie naturelle ; affinité elfique à la Magie ; longévité narrative."],
          ["Whurten", "+1 Vigueur", "+1 Vigueur, +2 Volonté", "Sens magnétique ; physiologie robuste."],
          ["Ashyll", "+1 Agilité", "+2 Agilité, +1 Esprit", "Ouïe ashyll ; petite morphologie."],
          ["Thulkar", "+1 Vigueur", "+2 Vigueur, +1 Charisme", "Puissance corporelle et progression raciale volontairement compacte."],
          ["Azménorien", "+1 Esprit", "+1 Vigueur, +1 Esprit, +1 Charisme", "Ailes sombres ; don magique azménorien."]
        ]
      }
    ]
  },
  {
    id: "limites",
    title: "Traits de Nature et limites",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les traits gratuits décrivent ce que la physiologie permet réellement ; ils ne créent jamais une action supplémentaire. L’ambidextrie elyë ne donne pas une attaque de plus, une aile azménorienne n’accorde pas un vol libre et une morphologie ashyll n’ajoute aucun bonus générique hors règle explicite."
      },
      {
        type: "p",
        text: "L’affinité elfique et le don magique azménorien sont des traits d’accès : ils permettent d’apprendre des traditions compatibles mais ne donnent aucun sort. Les différences culturelles, factions et écoles appartiennent à la page Exilés consacrée aux réseaux et traditions."
      }
    ]
  },
  {
    id: "builder",
    title: "Catalogue mécanique",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Périmètre", "Talents"],
          ["Profils raciaux des cinq peuples", 53]
        ]
      },
      {
        type: "p",
        text: "Les 53 Talents de profils restent canoniques dans le Builder. Cette page fixe les modificateurs d’état, les traits gratuits, les limites de physiologie et les règles qui permettent d’interpréter correctement ces Talents sans recopier leur catalogue."
      }
    ]
  }
];

const EXILE_NETWORKS: Section[] = [
  {
    id: "silcenters",
    title: "Silcenters, Continuité & HDS",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Silcenters sont des infrastructures de vie et de formation. Les apprentissages ordinaires d’intégration à la Terre utilisent l’Expérience et les Compétences normales ; les PTV ne paient que les capacités de Vérité qui modifient réellement transitions, perception ou action."
      },
      {
        type: "p",
        text: "Les Protocoles de Continuité apprennent à gérer V/SR/R en situation réelle. La HDS est une spécialisation plus poussée, notamment développée dans des cursus liés à l’Union Elfique. Ni le Conseil des Anciens ni un Silcenter ne donnent automatiquement un arbre de pouvoirs."
      }
    ]
  },
  {
    id: "croix",
    title: "Croix d’Emphyrra",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Faucon de Malachite, Serpentaire de Citrine, Aigle de Larvikite et Hibou d’Onyx sont des traditions idéologiques apprises, jamais des sous-races. Leur accès demande éducation, adhésion, mentorat et parfois épreuves ; une ascendance elyë ne suffit pas à posséder leurs Talents."
      }
    ]
  },
  {
    id: "whurtens",
    title: "Runes, Atelier des Clans & Iron Law",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Ymirin, Elegarin et Traditionalistes sont d’abord des positions culturelles ou politiques. Les Runes, l’Atelier des Clans et Iron Law sont les grandes méthodes mécaniques : protection symbolique, maintenance durable, fiabilisation et intégration augmentique. Une faction sans méthode propre ne reçoit pas artificiellement un arbre PTV."
      }
    ]
  },
  {
    id: "ashylls",
    title: "Réseaux ashylls & Syndicat de Jade",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "La Green Union facilite l’accès aux Silcenters et aux Protocoles sans posséder d’arbre autonome. La Ligue des Quatre Empereurs utilise ressources, structures et pression économique qui doivent exister réellement dans la fiction. Le Syndicat de Jade ouvre des relais clandestins ; il ne matérialise jamais une marchandise à la demande."
      }
    ]
  },
  {
    id: "thulkars",
    title: "Hordes thulkars",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Hordes représentent des héritages de formation, de tactique et de communauté. Elles ne sont pas des sous-espèces. La Horde Abyssale n’accorde aucune Corruption gratuite : un membre réellement thulien utilise les règles de Corruption et certains Dons de Fixation. La Horde Maudite reste du lore sans arbre PJ propre."
      }
    ]
  },
  {
    id: "azmenoriens",
    title: "Héritages azménoriens & technomagie",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les héritages azménoriens combinent Magie, technologie xéno et technomagie. Un accès de tradition n’accorde ni équipement, ni infrastructure, ni connaissance profane gratuite : chaque dispositif doit exister, être disponible et être utilisé avec les Compétences nécessaires."
      }
    ]
  },
  {
    id: "builder",
    title: "Catalogue mécanique",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Famille", "Talents"],
          ["Silcenters & HDS", 7],
          ["Croix d’Emphyrra", 40],
          ["Héritages whurtens", 16],
          ["Réseaux ashylls & Syndicat de Jade", 23],
          ["Hordes thulkars", 22],
          ["Héritages azménoriens", 23],
          ["Total hors profils raciaux", 131]
        ]
      },
      {
        type: "p",
        text: "Le détail des 131 Talents de traditions et réseaux reste dans le Builder. Cette page porte les accès, les limites et les distinctions entre faction, formation, ressource et véritable capacité de Vérité."
      }
    ]
  }
];

const EXTRAL_PROFILES: Section[] = [
  {
    id: "profils",
    title: "Cinq profils extrals",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Peuple", "SR", "R", "Traits structurants"],
          ["Talass", "+1 Esprit", "+2 Esprit, +1 Agilité", "Anatomie segmentaire ; Bond talass ; adhérence naturelle ; soie conductrice ; affinité Talwa’Etax."],
          ["Mo’sen", "+1 Vigueur", "+2 Vigueur, +1 Agilité", "Armure corporelle 1 ; griffes/dentition Pugilat DGT 2 ; digestion absolue ; thermotolérance."],
          ["Baséanh", "+1 Volonté", "+1 Esprit, +1 Volonté, +1 Charisme", "Tardollas ; quatre bras ; immunité adaptative ; stabilité manuelle."],
          ["Rocréen", "+1 Charisme", "+2 Charisme, +1 Esprit", "Amphibie ; Noyau rocréen ; Quadrimanie ; Résonance psychique."],
          ["Thalsios", "+1 Volonté", "+2 Volonté, +1 Vigueur", "Amphibie ; charpente cartilagineuse ; Toucher thalsios."]
        ]
      }
    ]
  },
  {
    id: "physiologie",
    title: "Physiologie n’est pas économie d’action",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Une anatomie inhabituelle n’accorde aucun PA, Attaque, Défense active ou Réaction supplémentaire sans texte explicite. Les quatre bras baséanh en sont l’exemple canonique. Les avantages corporels s’appliquent uniquement dans le périmètre décrit par le trait ou le Talent."
      },
      {
        type: "p",
        text: "L’Armure corporelle mo’senne se cumule avec une armure portée, mais une protection rigide ou assistée doit être réellement compatible avec la carapace. Les capacités rocréennes et thalsiosses dépendent de leurs conditions biologiques ; le Voile ne supprime pas ces besoins."
      }
    ]
  },
  {
    id: "continuite",
    title: "Protocoles de Continuité",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Cette école commune d’adaptation au Voile est transmise notamment via le GAAC, les Silcenters ou l’AIDH. Elle modifie réellement le contrôle des transitions V/SR/R ; ce n’est pas un statut administratif. Les formations ordinaires restent des Compétences normales."
      },
      {
        type: "table",
        rows: [
          ["Périmètre", "Talents", "PTV"],
          ["Cinq profils extrals", 61, "116 PTV"],
          ["Protocoles de Continuité", 4, "7 PTV"],
          ["Total de cette page", 65, "123 PTV"]
        ]
      }
    ]
  }
];

const EXTRAL_ORGS: Section[] = [
  {
    id: "gaac",
    title: "GAAC — représenter sans gouverner",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Le GAAC assure représentation, auto-encadrement, médiation et intégration légale. Il ne possède aucun arbre PTV propre : savoir qui appeler, constituer un dossier, demander un recours ou utiliser son réseau relève des Compétences, du statut et de la fiction."
      }
    ]
  },
  {
    id: "organisations",
    title: "Organisations Extrals",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "CTU, Croix Verte, REPTILE, Mafia Shaediri, Hydroguard et autres réseaux disposent de méthodes distinctes. Une organisation donne accès à une formation ou à une infrastructure ; elle ne transforme pas automatiquement l’adhérent en détenteur de chaque Talent, appareil ou ressource du groupe."
      }
    ]
  },
  {
    id: "homo-superior",
    title: "Homo Superior — Humain AIDH",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["État", "Modificateurs"],
          ["SR", "+1 Vigueur"],
          ["R", "+1 Vigueur, +1 Agilité, +1 Volonté"]
        ]
      },
      {
        type: "p",
        text: "L’Homo Superior reste humain dans tous ses états. À V, l’Hologramme normalise l’expression de ses performances technobiologiques ; SR puis R libèrent cette contrainte sans lui donner une forme non humaine. Cette origine est réservée aux Humains de l’AIDH."
      },
      {
        type: "p",
        text: "Essaim nanitique, homéostasie assistée, hémostase et organisme optimisé sont des traits intégrés, pas des équipements interchangeables. La progression PJ Homo Superior ne mène jamais au statut de Seigneur-Général, qui reste hors échelle."
      }
    ]
  },
  {
    id: "adrak",
    title: "Ad’rak — origine restreinte",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["État", "Modificateurs"],
          ["SR", "+1 Vigueur"],
          ["R", "+3 Vigueur"]
        ]
      },
      {
        type: "p",
        text: "L’Ad’rak est un véritable Extral. La progression PJ représente normalement réfugiés, dissidents, descendants de communautés libres ou anciens sujets ayant fui l’Armée noire. Un loyaliste actif de l’Armée noire n’est pas le cadre ordinaire de cette origine."
      }
    ]
  },
  {
    id: "aidh",
    title: "Doctrines AIDH",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les doctrines AIDH utilisent cohérence, biphysique, invariants, confinement et anti-possession. Elles n’accordent jamais une lecture universelle du surnaturel : chaque appareil ou doctrine a une fonction définie et ne remplace ni les Compétences, ni les Talents de Cohérence, ni une identification correcte de la menace."
      }
    ]
  },
  {
    id: "builder",
    title: "Catalogue mécanique",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Famille", "Talents"],
          ["Homo Superior", 12],
          ["Ad’rak", 20],
          ["Organisations Extrals", 56],
          ["Doctrines AIDH", 8],
          ["Total de cette page", 96]
        ]
      },
      {
        type: "p",
        text: "Le Builder porte les 96 Talents détaillés. Cette page fixe la différence entre espèce, origine rare, institution et doctrine, afin qu’aucune appartenance ne soit transformée par erreur en capacité automatique."
      }
    ]
  }
];

const HUNTER_CORE: Section[] = [
  {
    id: "doctrine",
    title: "Doctrine commune",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "La Doctrine commune formalise quatre savoir-faire qu’un véritable Chasseur peut apprendre quelle que soit son origine. Elle ne remplace pas une tradition : elle couvre expérience de l’horreur, maintien de la chasse, lecture opérationnelle et réflexes communs."
      },
      {
        type: "p",
        text: "L’identification reste prioritaire. Une faiblesse folklorique, une munition ou un dispositif ne fonctionne que si la cible possède réellement la vulnérabilité ou le mécanisme correspondant. La Chasse n’accorde aucun bonus universel contre « le surnaturel »."
      }
    ]
  },
  {
    id: "association",
    title: "Association des Chasseurs",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "L’Association fondée par Morrighan est une infrastructure opérationnelle : points de rencontre, contrats, conseils, matériel, casiers, anciens Chasseurs et certains prototypes Raven. Elle n’a aucun arbre de PTV propre et n’offre jamais gratuitement une ressource qui doit être acquise."
      }
    ]
  },
  {
    id: "gt",
    title: "Habilitations GT",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Code", "Domaine"],
          ["GT-01", "Surnaturel général / opérations de base"],
          ["GT-11", "Surnaturels civilisés, notamment Vampires et Garous"],
          ["GT-02", "Féerique et petites créatures monstrueuses"],
          ["GT-22", "Elfique / Aèr / Exilés"],
          ["GT-03", "Extrals invasifs de danger limité"],
          ["GT-33", "Domaine Extral large"],
          ["GT-00", "Habilitation transversale exceptionnelle"]
        ]
      },
      {
        type: "p",
        text: "Une habilitation ouvre dossiers, contrats, casiers, interlocuteurs et degrés de confiance. Elle ne fournit jamais gratuitement une arme, un prototype ou une relique."
      }
    ]
  },
  {
    id: "hunt",
    title: "Hunt & fonctions",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Statut", "Règle"],
          ["Hunt100", "Reconnaissance tardive exceptionnelle ; narrative et jamais achetée en PTV."],
          ["Hunt15", "Worldbuilding légendaire ; inaccessible comme progression PJ."],
          ["Observers", "Fonction ou statut ; aucun arbre PTV."],
          ["Confrérie du Bestiaire", "Experts et dossiers nécessairement imparfaits ; aucune progression PTV."]
        ]
      }
    ]
  },
  {
    id: "builder",
    title: "Catalogue mécanique",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Le registre du Builder contient 4 Talents de Doctrine commune. Association, GT, Hunt, Observers et Confrérie sont volontairement absents des arbres PTV lorsqu’ils représentent statut, infrastructure ou reconnaissance plutôt qu’une capacité surnaturelle."
      }
    ]
  }
];

const HUNTER_TRADITIONS: Section[] = [
  {
    id: "principe",
    title: "Une tradition est une méthode apprise",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les traditions de Chasse sont des corpus de méthodes, rites, héritages ou techniques. L’accès suppose une transmission réelle, un contexte ou une appartenance compatible ; lire le nom d’une tradition ne suffit jamais à acquérir ses Talents."
      }
    ]
  },
  {
    id: "traditions",
    title: "Treize grandes traditions",
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Tradition", "Talents", "Repère"],
          ["Lavandières", 4, "Vampires indépendants spécialisés contre Vampires dangereux, Moroï et Strygoï."],
          ["Chasseurs catholiques", 40, "Arianwen, Ephraïm et Magdalena : traque, exorcisme, jugement et scellement."],
          ["Khālsā", 20, "Serment, protection, liberté et rupture des emprises."],
          ["Taoïstes", 20, "Gu, Shimazu et secrets Shi autour du Yin/Yang et du Néant."],
          ["Kabbale", 20, "Travail sur les dix Sephiroth sans devenir Angelus."],
          ["Nizarites / Asāsīyūn", 18, "Arts du Djinn et doctrine de Chasse."],
          ["Onmyoji", 20, "Shikigami, sceaux, noms et pactes spirituels."],
          ["Néopaïens", 20, "Morts, terre, seuils, présages et serments."],
          ["Chasse Fantastique", 20, "Héritage de la Vénerie elfique."],
          ["Lueurs d’Azménor", 20, "Visions réelles du Néant sans interprétation infaillible."],
          ["Xenoshield", 20, "Contre-intrusion Extral ; compétence technique greffée à une idéologie xénophobe."],
          ["Indépendants", 20, "Héritages familiaux, traumatismes et spécialisations sans doctrine unique."],
          ["Table Ronde", 20, "Lignées des chevaliers de Merlin et armes uniques liées à cet héritage."],
          ["Total", 262, "Le détail mécanique reste dans le Builder."]
        ]
      }
    ]
  },
  {
    id: "limites",
    title: "Limites transversales",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Une tradition spécialisée ne devient jamais une vérité universelle. Xenoshield ne prouve pas qu’un Extral est hostile ; une tradition sacrée ne rend pas toute cible impure ; une méthode contre les Vampires n’accorde pas la même efficacité contre une autre Nature."
      },
      {
        type: "p",
        text: "Les armes de Merlin, reliques, Patrons et objets uniques restent des éléments réels de fiction. Acheter les Talents d’une tradition ne matérialise pas l’objet, ne remplace pas son héritier et ne donne aucune ressource qui n’est pas explicitement accordée."
      }
    ]
  }
];

const fleauPage = (
  source: string,
  principle: string,
  temptation: string,
  vector: string,
  impulse: string,
  catalogRows: unknown[][],
  rupture: string,
  notes: string[]
): Section[] => [
  {
    id: "source",
    title: `Source — ${source}`,
    level: 2,
    blocks: [
      {
        type: "table",
        rows: [
          ["Principe", principle],
          ["Tentation", temptation],
          ["Vecteur / résistance typique", vector]
        ]
      },
      ...notes.map((text) => ({ type: "p" as const, text }))
    ]
  },
  {
    id: "impulsion",
    title: "Impulsion à partir d’Envahi",
    level: 2,
    blocks: [
      {
        type: "p",
        text: impulse
      }
    ]
  },
  {
    id: "progression",
    title: "Progression DON / RITE / FAVEUR",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Les Dons suivent la profondeur Marqué, Envahi puis Au bord. Les Rites et Faveurs suivent les règles communes de Souillure ; un Don personnel ne provoque pas de Souillure à chaque usage sauf texte explicite. Le détail de chaque capacité reste dans le registre canonique du Builder."
      },
      {
        type: "table",
        rows: [["Famille", "Talents", "PTV"], ...catalogRows]
      }
    ]
  },
  {
    id: "rupture",
    title: "Bascule & Rupture",
    level: 2,
    blocks: [
      {
        type: "p",
        text: rupture
      }
    ]
  }
];

const VHODHAL = fleauPage(
  "Vhodhal — Famine Blanche",
  "Dévorer",
  "Tout peut devenir nourriture.",
  "Exposition généralement physique : Vigueur + Constitution ; une atteinte explicitement spirituelle utilise la résistance mentale appropriée.",
  "Après privation significative, usage prolongé ou scène où la faim devient centrale, le MJ peut demander Volonté + Maîtrise spirituelle difficulté 15. En échec, au moins 1 PA de la prochaine activation doit servir à chercher, saisir ou consommer une nourriture plausible s’il en existe une. Aucun allié n’est imposé comme cible si une alternative réelle existe.",
  [
    ["Famine Blanche", 11, 25],
    ["Loge d’Écume", 15, 31],
    ["Total", 26, 56]
  ],
  "La Rupture adapte la Famine à la Nature d’origine : Wendigo pour beaucoup d’Humains, Bête Faramine chez les Garous, Sang d’Ivoire chez les Vampires, Noctiel chez les Angelus, Cyclope/Egam dans certains cas Mageius. Ces formes relèvent du Bestiaire, pas de la progression PJ.",
  [
    "La Famine Blanche étend progressivement ce qui peut être consommé : matière, énergie, distance ou manifestation peuvent devenir des objets de dévoration seulement lorsque le Don correspondant l’autorise.",
    "La Loge d’Écume est une voie cultuelle fondée sur sacrifice, Miettes de Vérité et transmission de la Famine. Ses Rites n’accordent jamais automatiquement les Dons de Vhodhal."
  ]
);

const VAAGOR = fleauPage(
  "V’Aagor — Sombre-Vérité",
  "Annexer / unir",
  "Tout peut devenir une partie de moi.",
  "Le vecteur dépend du rite ou de la manifestation. La Sombre-Vérité n’implique jamais automatiquement loyauté envers V’Aagor.",
  "Lorsqu’une autre personne tente brutalement d’arracher, purifier, détruire ou voler quelque chose effectivement intégré par un Don aagorien, Volonté + Maîtrise spirituelle difficulté 15. En échec, au moins 1 PA avant la fin de la prochaine activation doit servir à empêcher la séparation ou récupérer ce qui a été arraché si une option réelle existe.",
  [
    ["Sombre-Vérité", 18, 40],
    ["Deimonisme", 13, 28],
    ["Ordre de Longinus", 16, 34],
    ["Confrérie de la Faux", 8, 18],
    ["Fontaine des Ténèbres", 6, 12],
    ["Messagers de l’Œil Blanc", 6, 13],
    ["Total", 67, 145]
  ],
  "La Rupture dépend de la trajectoire : Assimilé ou Fragment mineur, Abomination liée au Père, Oshirique pour certains Vampires, forme gravitationnelle de l’Œil Blanc ou autre résultat aagorien. Un Deimon corrompu reste fondamentalement un Deimon mais devient structurellement aagorien.",
  [
    "Deimonisme, Longinus, Confrérie de la Faux, Fontaine et Œil Blanc sont des voies distinctes, pas les branches d’une religion unifiée.",
    "Les Deimons ont volonté, Nature et limites propres. Aucun Rite ne les transforme par défaut en serviteurs gratuits ni en réserve de PA."
  ]
);

const SHARITH = fleauPage(
  "Sharith — Division",
  "Séparer / décomposer",
  "Tout possède une ligne de coupe.",
  "La Division peut viser matière, fonction, énergie, identité ou structure ; le vecteur dépend de ce qui est effectivement séparé.",
  "Face à une possession, fusion, symbiose, artefact lié, pouvoir composite ou ensemble réellement constitué d’éléments distincts, Volonté + Maîtrise spirituelle difficulté 15. En échec, au moins 1 PA avant la fin de la prochaine activation doit servir à examiner, exposer ou tenter de séparer une composante si une option réelle existe.",
  [
    ["Division", 14, 31],
    ["Grand Savoir", 15, 32],
    ["Bellatheis", 10, 21],
    ["Nucléomancie", 7, 15],
    ["Total", 46, 99]
  ],
  "La Rupture peut produire une Abomination fracturée ou un Éclat de Sharith, un organisme polymorphe de Bellatheis, une entité restructurée par le Grand Savoir, un réacteur vivant de Nucléomancie ou une conscience scindée. Les Psycolors restent hors progression PJ et relèvent du Bestiaire.",
  [
    "Sharith révèle, sépare, isole, redistribue ou dégrade une propriété existante ; elle ne crée normalement pas une propriété nouvelle.",
    "Les Rites [Irradiant] de Nucléomancie ajoutent leur Retour fissile au praticien sans supprimer la Souillure."
  ]
);

const VHADHI = fleauPage(
  "Vhadhi — Métastase",
  "Réaffecter / adapter",
  "Je peux devenir la solution.",
  "Transformation corporelle : Vigueur + Constitution ; altération de l’âme, de l’identité ou d’une fonction surnaturelle : Volonté + Force Mentale.",
  "Si exactement la même méthode échoue une deuxième fois contre le même obstacle significatif, Volonté + Maîtrise spirituelle difficulté 15. En échec, le personnage doit changer de méthode, se repositionner, employer une adaptation ou renoncer temporairement à cette approche.",
  [
    ["Métastase", 14, 31],
    ["Éden Gris", 16, 35],
    ["Total", 30, 66]
  ],
  "La Bascule produit une Finalité structurante. Le MJ examine dernière exposition, Dons, adaptations, contexte, rite et Nature d’origine, puis décide ce que le nouvel être a appris qu’il devait être. La Rupture peut rester consciente ; elle n’en redevient pas pour autant une progression PJ.",
  [
    "Vhadhi ne change pas pour explorer toutes les possibilités : elle réaffecte un corps, un objet ou un système vers une fonction jugée plus utile.",
    "L’Éden Gris est une tradition de recherche et d’évolution dirigée. Grades, Éveillées, laboratoires et Nacre noire sont des ressources institutionnelles, jamais une monnaie de PTV."
  ]
);

const SHAOGGITH = fleauPage(
  "Shaoggith — Germination",
  "Engendrer / proliférer",
  "Je peux mettre la solution au monde.",
  "Vecteur typique physique : Vigueur + Constitution via tissu, écaille, sécrétion, greffe, parasite ou contamination biologique.",
  "Lorsqu’une création vivante issue du personnage, une masse importante de tissu viable ou un organisme qu’il cultive va être détruit ou stérilisé, Volonté + Maîtrise spirituelle difficulté 15. En échec, au moins 1 PA doit servir à préserver, récupérer ou mettre à l’abri ce potentiel si c’est possible.",
  [
    ["Germination", 15, 34],
    ["Mère Primordiale", 15, 32],
    ["Total", 30, 66]
  ],
  "La Bascule produit une Abomination germinative : le corps cesse de respecter le principe qu’un organisme est un individu fermé. Les Cycles appartiennent à l’après-Rupture et peuvent ensuite reconfigurer profondément l’Abomination ; ils ne sont jamais une progression PJ.",
  [
    "Les mutations anciennes liées à l’histoire de certains peuples ne signifient pas une Corruption héréditaire actuelle.",
    "Les neuf Maîtres des Abominations sont un statut de culte, pas neuf classes. Toute créature durable créée par une Culture est un PNJ réel et ne fournit aucun pool de PA gratuit."
  ]
);

const THUL = fleauPage(
  "Thul — Fixation",
  "Fixer / empêcher le devenir",
  "Pourquoi laisser quoi que ce soit changer ?",
  "Le vecteur dépend du Patron, du rite ou de l’émanation. Thul demeure endormi ou emprisonné sous Mû en 2035.",
  "Lorsqu’une chose à laquelle le personnage est personnellement attaché va subir un changement important et irréversible, Volonté + Maîtrise spirituelle difficulté 15. En échec, au moins 1 PA doit servir à retarder, empêcher ou préserver quelque chose de l’état précédent si une option réelle existe.",
  [
    ["Fixation", 14, 31],
    ["Sombre Culte commun", 6, 13],
    ["Dagon", 4, 9],
    ["Telipinu", 4, 8],
    ["Total", 28, 61]
  ],
  "La Bascule thulienne fixe la nouvelle Nature au lieu de la laisser continuer à évoluer : Fossile vivant, Abyssal profondément métissé, Myxinien, hybride, organisme pathologique ou âme figée selon le Patron et la contamination. Les Grands Thuliens relèvent du Bestiaire et du scénario.",
  [
    "Sombre Culte, Dagon, Telipinu et Horde Abyssale ne forment pas une Église centralisée ; ce sont des foyers différents autour d’une Source emprisonnée.",
    "La Horde Abyssale n’a pas d’arbre PTV propre. Elle utilise la formation normale de Horde et, pour les membres réellement corrompus, les règles de Fixation."
  ]
);

export const COMPENDIUM_VERITE_V7_PASS_B_RULE_ARTICLES: Article[] = [
  article(
    "regles-verite-v7-exiles-profils-cinq-peuples",
    "Profils raciaux des cinq peuples",
    ["Vérité", "Règles", "Exilés", "Elyë", "Whurten", "Ashyll", "Thulkar", "Azménorien"],
    EXILE_PROFILES
  ),
  article(
    "regles-verite-v7-exiles-silcenters-hds-croix-runes-reseaux-hordes-technomagie",
    "Silcenters, HDS, Croix d’Emphyrra, Runes, réseaux, Hordes & technomagie",
    ["Vérité", "Règles", "Exilés", "Silcenters", "HDS", "Croix d’Emphyrra", "Runes", "Hordes", "Technomagie"],
    EXILE_NETWORKS
  ),
  article(
    "regles-verite-v7-extrals-profils-physiologies",
    "Cinq profils extrals & physiologies",
    ["Vérité", "Règles", "Extrals", "Talass", "Mo’sen", "Baséanh", "Rocréen", "Thalsios"],
    EXTRAL_PROFILES
  ),
  article(
    "regles-verite-v7-extrals-organisations-aidh-homo-superior-adrak",
    "Organisations, fonctions & doctrines AIDH",
    ["Vérité", "Règles", "Extrals", "GAAC", "AIDH", "Homo Superior", "Ad’rak"],
    EXTRAL_ORGS
  ),
  article(
    "regles-verite-v7-chasseurs-doctrine-association-gt-hunt",
    "Doctrine commune, Association, GT & Hunt",
    ["Vérité", "Règles", "Chasseurs", "Association", "GT", "Hunt", "Confrérie du Bestiaire"],
    HUNTER_CORE
  ),
  article(
    "regles-verite-v7-chasseurs-traditions",
    "Traditions de Chasse",
    ["Vérité", "Règles", "Chasseurs", "Traditions de Chasse"],
    HUNTER_TRADITIONS
  ),
  article("regles-verite-v7-fleau-vhodhal", "Vhodhal — Famine Blanche", ["Vérité", "Règles", "Fléaux", "Vhodhal", "Famine Blanche"], VHODHAL),
  article("regles-verite-v7-fleau-vaagor", "V’Aagor — Sombre-Vérité", ["Vérité", "Règles", "Fléaux", "V’Aagor", "Sombre-Vérité"], VAAGOR),
  article("regles-verite-v7-fleau-sharith", "Sharith — Division", ["Vérité", "Règles", "Fléaux", "Sharith", "Division"], SHARITH),
  article("regles-verite-v7-fleau-vhadhi", "Vhadhi — Métastase", ["Vérité", "Règles", "Fléaux", "Vhadhi", "Métastase"], VHADHI),
  article("regles-verite-v7-fleau-shaoggith", "Shaoggith — Germination", ["Vérité", "Règles", "Fléaux", "Shaoggith", "Germination"], SHAOGGITH),
  article("regles-verite-v7-fleau-thul", "Thul — Fixation", ["Vérité", "Règles", "Fléaux", "Thul", "Fixation"], THUL)
];

export const COMPENDIUM_VERITE_V7_PASS_B_RULE_NAVIGATION = [
  { id:"regles-verite-v7-exiles-profils-cinq-peuples",dataset:"verite-v7",category:"Règles",group:"Vérité — Natures & capacités",groupOrder:80,subgroup:"Exilés",subgroupOrder:60,pageOrder:10,displayTitle:"Profils raciaux des cinq peuples" },
  { id:"regles-verite-v7-exiles-silcenters-hds-croix-runes-reseaux-hordes-technomagie",dataset:"verite-v7",category:"Règles",group:"Vérité — Natures & capacités",groupOrder:80,subgroup:"Exilés",subgroupOrder:60,pageOrder:20,displayTitle:"Silcenters, HDS, Croix d’Emphyrra, Runes, réseaux, Hordes & technomagie" },
  { id:"regles-verite-v7-extrals-profils-physiologies",dataset:"verite-v7",category:"Règles",group:"Vérité — Natures & capacités",groupOrder:80,subgroup:"Extrals",subgroupOrder:70,pageOrder:10,displayTitle:"Cinq profils extrals & physiologies" },
  { id:"regles-verite-v7-extrals-organisations-aidh-homo-superior-adrak",dataset:"verite-v7",category:"Règles",group:"Vérité — Natures & capacités",groupOrder:80,subgroup:"Extrals",subgroupOrder:70,pageOrder:20,displayTitle:"Organisations, fonctions & doctrines AIDH" },
  { id:"regles-verite-v7-chasseurs-doctrine-association-gt-hunt",dataset:"verite-v7",category:"Règles",group:"Vérité — Natures & capacités",groupOrder:80,subgroup:"Humains & Chasseurs",subgroupOrder:10,pageOrder:10,displayTitle:"Doctrine commune, Association, GT & Hunt" },
  { id:"regles-verite-v7-chasseurs-traditions",dataset:"verite-v7",category:"Règles",group:"Vérité — Natures & capacités",groupOrder:80,subgroup:"Humains & Chasseurs",subgroupOrder:10,pageOrder:20,displayTitle:"Traditions de Chasse" },
  { id:"regles-verite-v7-fleau-vhodhal",dataset:"verite-v7",category:"Règles",group:"Vérité — Corruption",groupOrder:85,subgroup:"Fléaux",subgroupOrder:20,pageOrder:10,displayTitle:"Vhodhal — Famine Blanche" },
  { id:"regles-verite-v7-fleau-vaagor",dataset:"verite-v7",category:"Règles",group:"Vérité — Corruption",groupOrder:85,subgroup:"Fléaux",subgroupOrder:20,pageOrder:20,displayTitle:"V’Aagor — Sombre-Vérité" },
  { id:"regles-verite-v7-fleau-sharith",dataset:"verite-v7",category:"Règles",group:"Vérité — Corruption",groupOrder:85,subgroup:"Fléaux",subgroupOrder:20,pageOrder:30,displayTitle:"Sharith — Division" },
  { id:"regles-verite-v7-fleau-vhadhi",dataset:"verite-v7",category:"Règles",group:"Vérité — Corruption",groupOrder:85,subgroup:"Fléaux",subgroupOrder:20,pageOrder:40,displayTitle:"Vhadhi — Métastase" },
  { id:"regles-verite-v7-fleau-shaoggith",dataset:"verite-v7",category:"Règles",group:"Vérité — Corruption",groupOrder:85,subgroup:"Fléaux",subgroupOrder:20,pageOrder:50,displayTitle:"Shaoggith — Germination" },
  { id:"regles-verite-v7-fleau-thul",dataset:"verite-v7",category:"Règles",group:"Vérité — Corruption",groupOrder:85,subgroup:"Fléaux",subgroupOrder:20,pageOrder:60,displayTitle:"Thul — Fixation" }
];
