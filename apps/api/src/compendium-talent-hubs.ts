import { talentRegistryMeta } from "./rules/talent-registry.js";

type CatalogueRow = {
  label: string;
  count: number;
};

type EditorialSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

type TalentHubSpec = {
  id: string;
  title: string;
  natureId: string;
  groupPrefix: string;
  subgroup: string;
  pageOrder: number;
  source: string;
  catalogue: CatalogueRow[];
  sections: EditorialSection[];
};

const HUNTER_SOURCE =
  "TUC_Chasseurs_V1_finalise.docx ; Builder V2 — registre canonique des Talents";
const EXTRAL_SOURCE =
  "TUC_Extrals_AIDH_Adrak_V1.docx ; Builder V2 — registre canonique des Talents";

const TALENT_HUB_SPECS: TalentHubSpec[] = [
  {
    id: "regles-verite-chasseur-lavandieres",
    title: "Lavandières — tradition vampirique de Chasse",
    natureId: "humain",
    groupPrefix: "Lavandières — tradition vampirique de Chasse",
    subgroup: "Humains & Chasseurs",
    pageOrder: 20,
    source: HUNTER_SOURCE,
    catalogue: [{ label: "Tradition des Lavandières", count: 4 }],
    sections: [
      {
        id: "identite",
        title: "Une tradition vampirique spécialisée",
        paragraphs: [
          "Les Lavandières sont des Vampires indépendants spécialisés dans la chasse des Vampires non alignés ou traîtres, des Moroï et des Strygoï. Leur voie courte ne remplace pas une Nature vampirique : elle se greffe sur la progression déjà acquise.",
          "Leur méthode suit la souillure sanguine, reconnaît une signature déjà connue malgré les masques, neutralise brièvement l’usage du Sang noir et peut empêcher une proie vampirique de soustraire son corps à la chasse."
        ]
      },
      {
        id: "acces-et-limites",
        title: "Accès et limites",
        paragraphs: [
          "L’accès est naturel pour une véritable Lavandière, restreint pour un Vampire recruté et incompatible avec un non-Vampire. Cette spécialisation demeure donc un prolongement de la condition vampirique, non une école générale de Chasse.",
          "Lire une souillure n’offre jamais une fiche complète : une trace ne livre ni Cour, ni Sang, ni âge, ni position. La tradition identifie et retient une proie précise ; elle ne devient pas un contre-pouvoir universel contre les Vampires."
        ]
      }
    ]
  },
  {
    id: "regles-verite-chasseur-catholiques",
    title: "Chasseurs catholiques",
    natureId: "humain",
    groupPrefix: "Chasseurs catholiques",
    subgroup: "Humains & Chasseurs",
    pageOrder: 30,
    source: HUNTER_SOURCE,
    catalogue: [
      { label: "Liturgie de terrain", count: 6 },
      { label: "Ordre d’Arianwen — Traque", count: 12 },
      { label: "Ordre d’Ephraïm — Exorcistat", count: 12 },
      { label: "Ordre de Magdalena — Jugement", count: 10 }
    ],
    sections: [
      {
        id: "socle-commun",
        title: "Une liturgie commune, trois ordres",
        paragraphs: [
          "Les trois ordres secrets partagent une liturgie de terrain : consécration, fermeté, intercession, sanctuaire provisoire, derniers rites et restauration du sacré. Ce socle donne un langage rituel commun sans effacer leurs fonctions propres.",
          "Arianwen poursuit et retient les proies ; Ephraïm diagnostique les possessions, protège les seuils et expulse les occupants ; Magdalena enquête sur les marques, les pactes, les objets et les influences afin de les juger, les placer sous scellés ou les rompre."
        ]
      },
      {
        id: "institution-et-talents",
        title: "Institution, foi et Talents",
        paragraphs: [
          "Les locaux, armureries, dossiers, véhicules, personnels et contacts de l’Église sont des ressources institutionnelles. Ils ne deviennent pas des Talents et ne sont pas achetés en PTV.",
          "Les rites exigent toujours une cible ou une relation surnaturelle réelle. Consacrer ne fabrique pas une faiblesse, exorciser ne remplace pas l’identification d’une possession et juger ne crée pas la culpabilité que l’enquête n’a pas établie."
        ]
      }
    ]
  },
  {
    id: "regles-verite-chasseur-khalsa",
    title: "Khālsā — Serment, protection et liberté",
    natureId: "humain",
    groupPrefix: "Khālsā — Serment, protection et liberté",
    subgroup: "Humains & Chasseurs",
    pageOrder: 40,
    source: HUNTER_SOURCE,
    catalogue: [
      { label: "Arme du Serment", count: 5 },
      { label: "Briseur de chaînes", count: 5 },
      { label: "Devoir de Protection", count: 5 },
      { label: "Volonté libre", count: 5 }
    ],
    sections: [
      {
        id: "doctrine",
        title: "Le Serment comme doctrine de Chasse",
        paragraphs: [
          "La voie du Khālsā fait du Serment une force de protection et de libération. Elle défend le droit de rester soi-même face à la possession, à la domination, aux pactes contraints et aux chaînes surnaturelles.",
          "L’arme consacrée, le devoir de protection, la volonté libre et l’art de briser les chaînes forment quatre expressions d’un même engagement : reconnaître une emprise réelle, défendre une personne et tenir une parole donnée."
        ]
      },
      {
        id: "perimetre",
        title: "Périmètre de la tradition",
        paragraphs: [
          "Dans TUC, le Khālsā est une tradition fictionnelle de Chasse. Cette construction de jeu ne prétend pas décrire les pratiques réelles du sikhisme.",
          "Ses voies ne suppriment ni blessure, ni poison, ni contrainte naturelle sous prétexte de liberté. Elles agissent sur des serments, des emprises et des entraves surnaturelles effectivement identifiés."
        ]
      }
    ]
  },
  {
    id: "regles-verite-chasseur-taoistes",
    title: "Taoïstes — Gu, Shimazu et secrets Shi",
    natureId: "humain",
    groupPrefix: "Taoïstes — Gu, Shimazu et secrets Shi",
    subgroup: "Humains & Chasseurs",
    pageOrder: 50,
    source: HUNTER_SOURCE,
    catalogue: [
      { label: "Fondamentaux du Qi", count: 4 },
      { label: "Voie du Yin", count: 4 },
      { label: "Voie du Yang", count: 4 },
      { label: "Harmonie", count: 4 },
      { label: "Art du Néant des Shi", count: 4 }
    ],
    sections: [
      {
        id: "ecoles-parentes",
        title: "Deux écoles parentes, deux finalités",
        paragraphs: [
          "Les Gu et leurs descendants Shimazu cultivent l’harmonie du Yin et du Yang. Leur pratique lit les circulations du Qi, ouvre ou ferme les méridiens et déplace l’équilibre entre deux souffles contraires.",
          "Les Shi historiques se concentrent sur le Vide. Dans la cosmologie actuelle, ce Vide est un contact méthodique avec le Néant : leur Art annule, dévore ou scelle certaines manifestations au lieu de reprendre les anciennes voies élémentaires du clan."
        ]
      },
      {
        id: "piste-de-qi",
        title: "La piste de Qi",
        paragraphs: [
          "Le pratiquant commence à l’Équilibre et peut progresser vers Yin profond ou Yang profond. Les deux extrêmes décrivent un état de circulation, non un alignement moral ; l’Harmonie organise leur tension autour d’un centre volontaire.",
          "Sentir un Qi perturbé ne révèle ni espèce, ni identité, ni fiche. Le Grand Scellement des Shi exige pour sa part une cible déjà vaincue, contenue ou consentante et un ancrage adapté."
        ]
      }
    ]
  },
  {
    id: "regles-verite-chasseur-kabbale",
    title: "Kabbale — les Dix Sephiroth",
    natureId: "humain",
    groupPrefix: "Kabbale — les Dix Sephiroth",
    subgroup: "Humains & Chasseurs",
    pageOrder: 60,
    source: HUNTER_SOURCE,
    catalogue: [
      { label: "Kether — Unité", count: 2 },
      { label: "Hokhma — Pureté", count: 2 },
      { label: "Bina — Limite", count: 2 },
      { label: "Hesed — Grâce", count: 2 },
      { label: "Gueburah — Sévérité", count: 2 },
      { label: "Tiph’ereth — Harmonie et offrande", count: 2 },
      { label: "Nesah — Victoire", count: 2 },
      { label: "Hod — Forme et analyse", count: 2 },
      { label: "Yessod — Image et rêve", count: 2 },
      { label: "Malkhouth — Royaume et incarnation", count: 2 }
    ],
    sections: [
      {
        id: "arbre-de-vie",
        title: "Les dix principes de l’Arbre",
        paragraphs: [
          "Les Kabbalistes exploitent séparément les principes des dix Sephiroth sans porter la marque naturelle d’un Angelus. Chaque Sephira ouvre une paire cohérente d’interventions, de Malkhouth et l’incarnation jusqu’à Kether et l’unité.",
          "La progression ne transforme pas le Chasseur en Angelus et ne lui donne pas tous les pouvoirs associés à une Sephira. Elle formalise vingt usages précis dont les effets complets restent dans le Builder."
        ]
      },
      {
        id: "acces",
        title: "Initiation et exclusion",
        paragraphs: [
          "L’accès est naturel pour un initié et peut s’ouvrir, avec une formation crédible, à un extérieur. Il reste restreint lorsque l’apprentissage ou le contexte l’exigent.",
          "Le Sephirien demeure strictement hors progression PJ. La voie kabbaliste approche une architecture spirituelle ; elle ne constitue pas une route détournée vers ce statut."
        ]
      }
    ]
  },
  {
    id: "regles-verite-chasseur-nizarites-asasiyun",
    title: "Nizarites / Asāsīyūn — Arts du Djinn et doctrine de chasse",
    natureId: "humain",
    groupPrefix: "Nizarites / Asāsīyūn — Arts du Djinn et doctrine de chasse",
    subgroup: "Humains & Chasseurs",
    pageOrder: 70,
    source: HUNTER_SOURCE,
    catalogue: [
      { label: "Arts du Djinn", count: 8 },
      { label: "Doctrine Asāsīyūn", count: 10 }
    ],
    sections: [
      {
        id: "deux-blocs",
        title: "Le pacte et la doctrine",
        paragraphs: [
          "Les Arts du Djinn fixent une relation consentie avec un compagnon réellement rencontré. Ils règlent la voix partagée, les sens jumelés, l’invocation et les échanges d’ancrage sans abolir l’existence propre de l’esprit.",
          "La Doctrine Asāsīyūn transforme ce lien en méthode de Chasse : marquer la proie, poursuivre un pacte, lier un projectile, préparer un contre-rite et empêcher certaines fuites locales d’essence."
        ]
      },
      {
        id: "acces-et-compagnon",
        title: "Accès et compagnon lié",
        paragraphs: [
          "Les Arts du Djinn ne sont pas intrinsèquement réservés aux Chasseurs ; la Doctrine Asāsīyūn exige en revanche d’être un véritable Chasseur. Les entités tutélaires majeures restent hors du calibrage ordinaire.",
          "Les PTV donnent les moyens de former et d’exploiter un lien, jamais le Djinn lui-même. Le compagnon garde sa personnalité et ne fournit pas une réserve indépendante d’actions contrôlée par le joueur."
        ]
      }
    ]
  },
  {
    id: "regles-verite-chasseur-onmyoji",
    title: "Onmyoji — Shikigami, sceaux et pactes spirituels",
    natureId: "humain",
    groupPrefix: "Onmyoji — Shikigami, sceaux et pactes spirituels",
    subgroup: "Humains & Chasseurs",
    pageOrder: 80,
    source: HUNTER_SOURCE,
    catalogue: [
      { label: "Shikigami", count: 5 },
      { label: "Fūin — Sceaux", count: 6 },
      { label: "Exorcisme et noms", count: 5 },
      { label: "Pactes d’esprits", count: 4 }
    ],
    sections: [
      {
        id: "quatre-voies",
        title: "Quatre relations aux esprits",
        paragraphs: [
          "Les Onmyoji sont des Chasseurs shinto spécialisés dans les entités nuisibles, les Shikigami et les sceaux. Leur pratique distingue le compagnon lié, le confinement, l’extraction d’un parasite et le pacte consenti.",
          "Les quatre voies permettent d’invoquer, protéger, entraver, faire comparaître ou extraire. La foudre exceptionnelle de Koji n’est pas une capacité générique de la tradition."
        ]
      },
      {
        id: "regle-des-sceaux",
        title: "La règle des sceaux",
        paragraphs: [
          "Un sceau se prépare sur un support physique approprié : papier, bois, tissu, plaque, gravure ou équivalent. Son placement et sa conservation comptent réellement dans la fiction.",
          "Un sceau ne remplace pas toute négociation et ne rend pas automatiquement un esprit coupable ou hostile. De même, les PTV d’un lien donnent accès à la relation avec un Shikigami ; ils n’achètent pas la créature."
        ]
      }
    ]
  },
  {
    id: "regles-verite-chasseur-neopaiens",
    title: "Néopaïens — pratiques communes et Mystères",
    natureId: "humain",
    groupPrefix: "Néopaïens — pratiques communes et Mystères",
    subgroup: "Humains & Chasseurs",
    pageOrder: 90,
    source: HUNTER_SOURCE,
    catalogue: [
      { label: "Pratiques néopaïennes", count: 5 },
      { label: "Mystère des Morts et des Ancêtres", count: 3 },
      { label: "Mystère de la Terre et de la Chasse", count: 3 },
      { label: "Mystère du Foyer et des Seuils", count: 3 },
      { label: "Mystère des Présages et du Destin", count: 3 },
      { label: "Mystère des Serments et du Sacrifice", count: 3 }
    ],
    sections: [
      {
        id: "pratiques-et-mysteres",
        title: "Pratiques communes et Mystères",
        paragraphs: [
          "Le néopaganisme de TUC est syncrétique, moderne et pluriel. Les pratiques communes reposent sur les correspondances sacrées, la mémoire des lieux, les témoins du rite et les offrandes.",
          "Les cinq Mystères organisent les Morts et les Ancêtres, la Terre et la Chasse, le Foyer et les Seuils, les Présages et le Destin, puis les Serments et le Sacrifice. Ils décrivent de grandes familles de culte, non une religion unifiée."
        ]
      },
      {
        id: "acces-pluriel",
        title: "Une progression liée au culte réel",
        paragraphs: [
          "Une tradition concrète n’enseigne pas nécessairement les cinq Mystères. Les pratiques communes et un ou deux Mystères directement liés au culte sont naturels ; les autres demandent apprentissage ou deviennent restreints en cas de contradiction réelle.",
          "Une correspondance ou une offrande doit être culturellement et métaphysiquement pertinente. Elle ne fabrique ni faiblesse arbitraire, ni équivalence facile avec un sacrifice réellement significatif."
        ]
      }
    ]
  },
  {
    id: "regles-verite-chasseur-chasse-fantastique",
    title: "Chasse Fantastique — la Vénerie surnaturelle",
    natureId: "humain",
    groupPrefix: "Chasse Fantastique — la Vénerie surnaturelle",
    subgroup: "Humains & Chasseurs",
    pageOrder: 100,
    source: HUNTER_SOURCE,
    catalogue: [
      { label: "Voie des Limiers", count: 5 },
      { label: "Art de la Vénerie", count: 5 },
      { label: "Chevauchée", count: 5 },
      { label: "Tempête de la Chasse", count: 5 }
    ],
    sections: [
      {
        id: "armee-et-tradition",
        title: "D’une armée elfique à une tradition de Chasse",
        paragraphs: [
          "La Chasse Fantastique est une ancienne armée punitive elfique née pendant la Guerre de la Magie, puis modernisée en faction de Chasseurs. Elle poursuit les puissances qui menacent l’équilibre magique et se déploie avec une force capable de déchirer localement l’Hologramme.",
          "Sa Vénerie réunit la marque et le flair des Limiers, la coordination de la battue, la mobilité de la Chevauchée et une Tempête historiquement conçue pour aspirer puis disperser la Magie."
        ]
      },
      {
        id: "rangs-et-moyens",
        title: "Rangs, montures et coordination",
        paragraphs: [
          "Limier, Piqueur, Officier de Vénerie, Grand Veneur et Roi ou Reine sont des rangs narratifs. Une place dans la hiérarchie n’est pas achetée en PTV.",
          "La tradition suppose une chasse réellement coordonnée, une proie identifiée et des positions exploitables. Elle ne crée ni localisation absolue, ni attaque gratuite, ni monture ou véhicule acheté par un Talent."
        ]
      }
    ]
  },
  {
    id: "regles-verite-chasseur-lueurs-azmenor",
    title: "Lueurs d’Azménor — visions et Néant",
    natureId: "humain",
    groupPrefix: "Lueurs d’Azménor — visions et Néant",
    subgroup: "Humains & Chasseurs",
    pageOrder: 110,
    source: HUNTER_SOURCE,
    catalogue: [
      { label: "Visions des Menaces", count: 5 },
      { label: "Purge du Néant", count: 5 },
      { label: "Extinction", count: 5 },
      { label: "Les Voix dans le Vide", count: 5 }
    ],
    sections: [
      {
        id: "heritage-et-neant",
        title: "Un héritage azménorien déformé",
        paragraphs: [
          "Les Lueurs d’Azménor forment une petite tradition issue d’un héritage azménorien déformé par les siècles. Leurs dons viennent réellement du Néant, mais la doctrine religieuse construite autour d’eux peut être fausse.",
          "Leurs voies couvrent les visions de Menaces, la purge de corruptions, l’extinction d’une fonction surnaturelle et les avertissements des Voix dans le Vide. Les visions brutes sont authentiques ; leur interprétation ne l’est pas nécessairement."
        ]
      },
      {
        id: "menaces-et-acces",
        title: "Menaces, présages et accès",
        paragraphs: [
          "Une Menace n’est jamais une détection du Mal. C’est une puissance, un phénomène ou une chaîne surnaturelle déjà engagée dans une trajectoire capable d’entraîner une conséquence importante.",
          "L’accès est naturel pour le noyau historique et les véritables initiés, restreint pour un recrutement extérieur exceptionnel. Aucun Talent ne prouve que les Lueurs comprennent correctement la source de leurs Voix."
        ]
      }
    ]
  },
  {
    id: "regles-verite-chasseur-xenoshield",
    title: "Xenoshield — contre-intrusion Extral",
    natureId: "humain",
    groupPrefix: "Xenoshield — contre-intrusion Extral",
    subgroup: "Humains & Chasseurs",
    pageOrder: 120,
    source: HUNTER_SOURCE,
    catalogue: [
      { label: "Détection d’intrusion", count: 5 },
      { label: "Xénobiologie hostile", count: 5 },
      { label: "Contre-technologie", count: 5 },
      { label: "Confinement et interception", count: 5 }
    ],
    sections: [
      {
        id: "doctrine-materielle",
        title: "Une doctrine de faits matériels",
        paragraphs: [
          "Le Xenoshield descend des anciennes sentinelles du ciel et s’est reconstruit en 2032 comme une armée internationale indépendante vouée à la lutte contre les intrusions extraterrestres. Ses soldats opèrent infiltrés et ne disposent souvent que d’une compréhension partielle de leurs adversaires.",
          "La doctrine combine détection d’intrusion, xénobiologie hostile, contre-technologie, confinement et interception. Elle établit une origine non terrestre, un paradigme ou une incompatibilité exploitable ; elle ne détecte pas les « méchants aliens »."
        ]
      },
      {
        id: "formation-et-loyaute",
        title: "Formation, espèce et loyauté",
        paragraphs: [
          "L’accès dépend d’une formation réelle, non de l’espèce. Un Humain ou un Extral sincèrement formé peut posséder ces techniques ; une recrue crédible peut les apprendre et un extérieur ne les obtient pas par simple observation.",
          "Aucun diagnostic de l’arbre ne certifie une culpabilité, une intention ou une loyauté politique. Les faits révélés doivent encore être interprétés par l’enquête et replacés dans leur contexte."
        ]
      }
    ]
  },
  {
    id: "regles-verite-chasseur-independants",
    title: "Chasseurs indépendants — Héritages modulaires",
    natureId: "humain",
    groupPrefix: "Chasseurs indépendants — Héritages modulaires",
    subgroup: "Humains & Chasseurs",
    pageOrder: 130,
    source: HUNTER_SOURCE,
    catalogue: [
      { label: "Survivant de l’impossible", count: 4 },
      { label: "Tradition familiale", count: 4 },
      { label: "Bricoleur de Vérité", count: 4 },
      { label: "Marqué par la proie", count: 4 },
      { label: "Obsession d’une seule proie", count: 4 }
    ],
    sections: [
      {
        id: "heritages",
        title: "Des héritages, pas une institution",
        paragraphs: [
          "Les indépendants n’ont ni doctrine institutionnelle unique ni uniforme. Leur savoir vient d’un traumatisme survécu, d’une tradition familiale, d’un assemblage improvisé, d’une marque laissée par la proie ou d’une obsession entretenue pendant des années.",
          "Chaque Héritage transforme une expérience précise en méthode de Chasse. Ces blocs peuvent coexister lorsque l’histoire le justifie, mais ils ne supposent ni hiérarchie commune, ni doctrine partagée, ni réseau unique."
        ]
      },
      {
        id: "progression-modulaire",
        title: "Une progression modulaire et justifiée",
        paragraphs: [
          "Un personnage possède normalement un Héritage naturel, éventuellement un second ouvert si son histoire le justifie. Les autres commencent comme restreints et peuvent s’ouvrir en jeu par de nouveaux événements ou apprentissages.",
          "Un Héritage reste attaché à ce qui a été réellement vécu ou transmis. Il n’accorde pas une compétence universelle contre toutes les créatures ni un accès automatique aux moyens d’une organisation."
        ]
      }
    ]
  },
  {
    id: "regles-verite-chasseur-table-ronde",
    title: "Table Ronde — lignées et armes de Merlin",
    natureId: "humain",
    groupPrefix: "Table Ronde — lignées et armes de Merlin",
    subgroup: "Humains & Chasseurs",
    pageOrder: 140,
    source: HUNTER_SOURCE,
    catalogue: [
      { label: "Résonance de Merlin", count: 5 },
      { label: "Formes de la Lame", count: 5 },
      { label: "Héritage chevaleresque", count: 5 },
      { label: "La Table", count: 5 }
    ],
    sections: [
      {
        id: "descendants-et-armes",
        title: "Descendants, non réincarnations",
        paragraphs: [
          "La Table Ronde actuelle rassemble les descendants des chevaliers historiques choisis autrefois par Merlin. Ses membres ordinaires ne sont pas les réincarnations de ces chevaliers.",
          "Chaque lignée est associée à une arme magique unique conçue pour son chevalier d’origine. La puissance moderne vient de la résonance entre le descendant et cette arme, de ses formes, de l’héritage chevaleresque et des liens reformés entre les membres de la Table."
        ]
      },
      {
        id: "devenir-chevalier",
        title: "Devenir un véritable chevalier",
        paragraphs: [
          "Trois conditions ne coûtent aucun PTV : descendre réellement d’un chevalier historique, retrouver l’Arme de Merlin liée à cette lignée et être reconnu par elle. Plusieurs descendants peuvent exister, mais l’artefact est unique et ne reconnaît normalement qu’un héritier actif à la fois.",
          "Les Armes de Merlin sont des objets narratifs réels, jamais achetés en PTV. Excalibur est l’épée de Ymir et demeure un artefact cosmique séparé ; elle n’est pas une récompense ordinaire de cet arbre."
        ]
      }
    ]
  },
  {
    id: "regles-verite-extral-protocoles-de-continuite",
    title: "Extral — Protocoles de Continuité",
    natureId: "extral",
    groupPrefix: "Protocoles de Continuité — 7 PTV",
    subgroup: "Extrals",
    pageOrder: 100,
    source: EXTRAL_SOURCE,
    catalogue: [{ label: "Protocoles de Continuité", count: 4 }],
    sections: [
      {
        id: "ecole-commune",
        title: "Une école commune d’adaptation au Voile",
        paragraphs: [
          "Les Protocoles de Continuité entraînent les Extrals à changer d’état sans rompre le rythme d’une scène ni exposer inutilement leur Vérité. Révélation et repli deviennent des réflexes disciplinés soumis aux contraintes qui empêchent ou rendent visible une transition.",
          "Chez les Extrals légaux, cette école est notamment transmise par les Silcenters ou des programmes reconnus par le GAAC. L’AIDH en enseigne également une version aux personnels concernés."
        ]
      },
      {
        id: "portee",
        title: "Portée des protocoles",
        paragraphs: [
          "Le cursus complet regroupe quatre Talents pour 7 PTV. Il fluidifie les changements V/SR/R et autorise une coordination technique non offensive en combat ; ce n’est pas un arbre administratif ni un simple statut légal.",
          "Ces protocoles ne créent aucune action supplémentaire, ne révèlent jamais un allié à sa place et n’effacent rien de ce qu’un témoin ou une caméra a déjà observé."
        ]
      }
    ]
  }
];

function catalogueTotal(spec: TalentHubSpec): number {
  return spec.catalogue.reduce((total, row) => total + row.count, 0);
}

export function generatedTalentHubCorpus() {
  const registryMeta = talentRegistryMeta();

  const articles = TALENT_HUB_SPECS.map((spec) => {
    const registryTotal = registryMeta.groups
      .filter(
        (group) =>
          group.natureId === spec.natureId &&
          (group.label === spec.groupPrefix || group.label.startsWith(spec.groupPrefix + " ›"))
      )
      .reduce((total, group) => total + group.count, 0);
    const total = catalogueTotal(spec);

    if (registryTotal !== total) {
      throw new Error(
        `${spec.id}: catalogue éditorial (${total}) désaligné du registre canonique (${registryTotal})`
      );
    }

    return {
      id: spec.id,
      title: spec.title,
      category: "Règles",
      sourceCategory: "Règles",
      dataset: "generated-talents",
      source: spec.source,
      status: "canon_enrichi",
      rebuildV2: true,
      tags: [spec.natureId, "Talents", "principes", "Builder"],
      __generatedTalentHub: true,
      sections: [
        {
          id: "catalogue-canonique",
          title: `Un catalogue canonique de ${total} Talents`,
          level: 2,
          blocks: [
            {
              type: "table",
              rows: [
                ["Voie", "Nombre"],
                ...spec.catalogue.map((row) => [row.label, String(row.count)]),
                ["Total", String(total)]
              ]
            },
            {
              type: "p",
              text: `Le détail des ${total} Talents — coûts, prérequis, effets et formulations mécaniques — est maintenu dans le catalogue canonique du Builder et n’est pas recopié ici. Cette page en conserve l’identité, l’architecture et les principes de lecture.`
            }
          ]
        },
        ...spec.sections.map((section) => ({
          id: section.id,
          title: section.title,
          level: 2,
          blocks: section.paragraphs.map((text) => ({ type: "p", text }))
        }))
      ]
    };
  });

  const navigation = TALENT_HUB_SPECS.map((spec) => ({
    id: spec.id,
    dataset: "generated-talents",
    category: "Règles",
    group: "Vérité — Natures & capacités",
    groupOrder: 80,
    subgroup: spec.subgroup,
    subgroupOrder: spec.subgroup === "Humains & Chasseurs" ? 10 : 100,
    pageOrder: spec.pageOrder,
    displayTitle: spec.title
  }));

  return { articles, navigation };
}
