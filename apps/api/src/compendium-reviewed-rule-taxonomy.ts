import type { Article } from "./compendium.js";

// Each entry follows an individual reading. A quote identifies one reviewed
// paragraph, including when section IDs repeat; this is not a keyword linker.
export const REVIEWED_RULE_LINKS = [
  {
    "articleId": "regles-verite-v7-exiles-silcenters-hds-croix-runes-reseaux-hordes-technomagie",
    "sectionId": "silcenters",
    "quote": "Les Protocoles de Continuité apprennent à gérer V/SR/R",
    "label": "Protocoles de Continuité",
    "targetId": "regles-verite-extral-protocoles-de-continuite",
    "targetSection": "ecole-commune"
  },
  {
    "articleId": "regles-verite-v7-exiles-silcenters-hds-croix-runes-reseaux-hordes-technomagie",
    "sectionId": "thulkars",
    "quote": "un membre réellement thulien utilise les règles de Corruption",
    "label": "règles de Corruption",
    "targetId": "regles-verite-v7-corruption-integrite-bascule",
    "targetSection": "sources-concurrentes"
  },
  {
    "articleId": "regles-verite-v7-exiles-silcenters-hds-croix-runes-reseaux-hordes-technomagie",
    "sectionId": "azmenoriens",
    "quote": "chaque dispositif doit exister, être disponible et être utilisé avec les Compétences nécessaires",
    "label": "chaque dispositif doit exister, être disponible",
    "targetId": "regles-verite-v7-equipement-proprietes-acquisition",
    "targetSection": "loi-commune"
  },
  {
    "articleId": "regles-verite-v7-extrals-profils-physiologies",
    "sectionId": "physiologie",
    "quote": "L’Armure corporelle mo’senne se cumule avec une armure portée",
    "label": "Armure corporelle",
    "targetId": "regles-verite-v7-voile-continuite-objets-reseaux-interfaces",
    "targetSection": "armure-corporelle-et-reductions"
  },
  {
    "articleId": "regles-verite-v7-extrals-profils-physiologies",
    "sectionId": "continuite",
    "quote": "Cette école commune d’adaptation au Voile",
    "label": "école commune d’adaptation au Voile",
    "targetId": "regles-verite-extral-protocoles-de-continuite",
    "targetSection": "ecole-commune"
  },
  {
    "articleId": "regles-verite-v7-extrals-profils-physiologies",
    "sectionId": "physiologie",
    "quote": "Une anatomie inhabituelle n’accorde aucun PA",
    "label": "PA",
    "targetId": "regles-initiative-pa-deplacement",
    "targetSection": "initiative-et-pa"
  },
  {
    "articleId": "regles-verite-v7-extrals-organisations-aidh-homo-superior-adrak",
    "sectionId": "homo-superior",
    "quote": "L’Homo Superior reste humain dans tous ses états",
    "label": "tous ses états",
    "targetId": "regles-verite-v7-voile-continuite-objets-reseaux-interfaces",
    "targetSection": "5-hologramme-voile-semi-revelation-et-revelation"
  },
  {
    "articleId": "regles-verite-v7-extrals-organisations-aidh-homo-superior-adrak",
    "sectionId": "homo-superior",
    "quote": "Essaim nanitique, homéostasie assistée, hémostase et organisme optimisé sont des traits intégrés",
    "label": "Essaim nanitique",
    "targetId": "regles-verite-v7-voile-continuite-objets-reseaux-interfaces",
    "targetSection": "interfaces-etrangeres-et-neurodive"
  },
  {
    "articleId": "regles-verite-v7-extrals-organisations-aidh-homo-superior-adrak",
    "sectionId": "aidh",
    "quote": "chaque appareil ou doctrine a une fonction définie",
    "label": "chaque appareil ou doctrine a une fonction définie",
    "targetId": "regles-verite-v7-equipement-proprietes-acquisition",
    "targetSection": "aidh"
  },
  {
    "articleId": "regles-verite-extral-protocoles-de-continuite",
    "sectionId": "portee",
    "quote": "Il fluidifie les changements V/SR/R",
    "label": "changements V/SR/R",
    "targetId": "regles-verite-v7-voile-continuite-objets-reseaux-interfaces",
    "targetSection": "5-hologramme-voile-semi-revelation-et-revelation"
  },
  {
    "articleId": "regles-verite-extral-protocoles-de-continuite",
    "sectionId": "ecole-commune",
    "quote": "cette école est notamment transmise par les Silcenters",
    "label": "Silcenters",
    "targetId": "regles-verite-v7-exiles-silcenters-hds-croix-runes-reseaux-hordes-technomagie",
    "targetSection": "silcenters"
  },
  {
    "articleId": "regles-verite-v7-equipement-proprietes-acquisition",
    "sectionId": "aidh",
    "quote": "Un capteur générique ne voit jamais automatiquement la Vérité d’une cible Voilée",
    "label": "la Vérité d’une cible Voilée",
    "targetId": "regles-verite-v7-voile-continuite-objets-reseaux-interfaces",
    "targetSection": "5-hologramme-voile-semi-revelation-et-revelation"
  },
  {
    "articleId": "regles-verite-v7-equipement-proprietes-acquisition",
    "sectionId": "marche-exile",
    "quote": "les ateliers whurtens fournissent runes, supports et réparations",
    "label": "ateliers whurtens",
    "targetId": "regles-verite-v7-exiles-silcenters-hds-croix-runes-reseaux-hordes-technomagie",
    "targetSection": "whurtens"
  },
  {
    "articleId": "regles-verite-v7-equipement-proprietes-acquisition",
    "sectionId": "marche-exile",
    "quote": "les réseaux azménoriens produisent des prototypes technomagiques",
    "label": "réseaux azménoriens",
    "targetId": "regles-verite-v7-exiles-silcenters-hds-croix-runes-reseaux-hordes-technomagie",
    "targetSection": "azmenoriens"
  },
  {
    "articleId": "regles-verite-v7-aseryn-nature-accelyr-origines",
    "sectionId": "voile-semi-revelation-et-revelation",
    "quote": "les PA restent déterminés par le jet d'Initiative normal",
    "label": "jet d'Initiative normal",
    "targetId": "regles-initiative-pa-deplacement",
    "targetSection": "initiative-et-pa"
  },
  {
    "articleId": "regles-verite-v7-aseryn-nature-accelyr-origines",
    "sectionId": "potentiel-foudroyant",
    "quote": "Tout Aseryn possède biologiquement le potentiel d'apprendre à maîtriser la Foudre",
    "label": "apprendre à maîtriser la Foudre",
    "targetId": "regles-verite-v7-aseryn-treize-dratyn-conseil-foudre",
    "targetSection": "dratyn-la-maitresse-de-la-foudre"
  },
  {
    "articleId": "regles-verite-v7-aseryn-treize-dratyn-conseil-foudre",
    "sectionId": "dratyn-la-maitresse-de-la-foudre",
    "quote": "Tout Aseryn possède le potentiel physiologique requis",
    "label": "potentiel physiologique requis",
    "targetId": "regles-verite-v7-aseryn-nature-accelyr-origines",
    "targetSection": "potentiel-foudroyant"
  },
  {
    "articleId": "regles-verite-v7-aseryn-treize-dratyn-conseil-foudre",
    "sectionId": "conseil-de-la-foudre",
    "quote": "les grands manieurs qui en sont issus utilisent Dratyn",
    "label": "Dratyn",
    "targetId": "regles-verite-v7-aseryn-treize-dratyn-conseil-foudre",
    "targetSection": "dratyn-la-maitresse-de-la-foudre"
  },
  {
    "articleId": "regles-verite-v7-corruption-integrite-bascule",
    "sectionId": "humanite-integrite",
    "quote": "Charge augmentique et Corruption utilisent la même limite d’Intégrité",
    "label": "Charge augmentique",
    "targetId": "regles-realite-v9-charge-stress-frenesie",
    "targetSection": "valeurs"
  },
  {
    "articleId": "regles-verite-v7-corruption-integrite-bascule",
    "sectionId": "purification",
    "quote": "Un objet corrompu indique sa Source, son vecteur, la difficulté et fréquence de Souillure",
    "label": "Souillure",
    "targetId": "regles-verite-v7-corruption-integrite-bascule",
    "targetSection": "souillure"
  },
  {
    "articleId": "regles-verite-v7-corruption-integrite-bascule",
    "sectionId": "bascule",
    "quote": "Lorsque Corruption = Intégrité",
    "label": "Intégrité",
    "targetId": "regles-verite-v7-corruption-integrite-bascule",
    "targetSection": "humanite-integrite"
  },
  {
    "articleId": "regles-pnj-talents-statistiques",
    "sectionId": "portee",
    "quote": "Les bonus de circonstances similaires ne se cumulent pas avec une Assistance équivalente",
    "label": "Assistance",
    "targetId": "regles-resolution-des-tests",
    "targetSection": "circonstances-opposition-cooperation"
  },
  {
    "articleId": "regles-verite-v7-daemon-nature-fonctions-divinites-facettes",
    "sectionId": "revelation-et-forme-exaltee",
    "quote": "conformément aux règles générales du Voile",
    "label": "règles générales du Voile",
    "targetId": "regles-verite-v7-voile-continuite-objets-reseaux-interfaces",
    "targetSection": "5-hologramme-voile-semi-revelation-et-revelation"
  },
  {
    "articleId": "regles-verite-v7-daemon-nature-fonctions-divinites-facettes",
    "sectionId": "regles-transversales-des-pouvoirs-divins",
    "quote": "Une seule Faveur de Maisonnée est active à la fois",
    "label": "Faveur de Maisonnée",
    "targetId": "regles-verite-v7-daemon-maisonnees-faveurs-patron",
    "targetSection": "maisonnees-et-faveurs-de-patron"
  },
  {
    "articleId": "regles-verite-v7-daemon-nature-fonctions-divinites-facettes",
    "sectionId": "mephisto-l-occulte-la-parole-et-le-hasard",
    "quote": "en suivant les règles normales de construction d’un sort",
    "label": "règles normales de construction d’un sort",
    "targetId": "regles-verite-v7-mage-maitrise-amplitude-lancement",
    "targetSection": "construire-et-lancer-un-sort"
  },
  {
    "articleId": "regles-verite-v7-daemon-nature-fonctions-divinites-facettes",
    "sectionId": "morrighan-la-corneille-etrangere",
    "quote": "mobilité ailée d’un oiseau selon la règle commune",
    "label": "mobilité ailée d’un oiseau selon la règle commune",
    "targetId": "regles-verite-v7-voile-continuite-objets-reseaux-interfaces",
    "targetSection": "mobilite-ailee-convention-pj"
  },
  {
    "articleId": "regles-verite-v7-daemon-nature-fonctions-divinites-facettes",
    "sectionId": "regles-transversales-des-pouvoirs-divins",
    "quote": "une imposition directe à l’âme, l’esprit ou l’organisme affronte la Défense occulte",
    "label": "Défense occulte",
    "targetId": "regles-verite-v7-pa-reactions-defense-puissance",
    "targetSection": "4-defense-occulte-et-puissance-des-effets"
  },
  {
    "articleId": "regles-verite-v7-angelus-sephiroth-archanges-seraphins",
    "sectionId": "archanges-en-fonction-dons-archangeliques",
    "quote": "Les Dons actifs coûtent généralement 2 Aura",
    "label": "Aura",
    "targetId": "regles-verite-v7-angelus-nature-revelation-transcendance",
    "targetSection": "aura-aureole-et-arbre-de-vie"
  },
  {
    "articleId": "regles-verite-v7-angelus-sephiroth-archanges-seraphins",
    "sectionId": "hesed-la-misericorde",
    "quote": "stabiliser automatiquement une cible",
    "label": "stabiliser",
    "targetId": "regles-sante-blessures-soins",
    "targetSection": "stabiliser"
  },
  {
    "articleId": "regles-verite-v7-angelus-sephiroth-archanges-seraphins",
    "sectionId": "archanges-en-fonction-dons-archangeliques",
    "quote": "Charisme + Compétence sociale contextuelle contre Défense occulte",
    "label": "Défense occulte",
    "targetId": "regles-verite-v7-pa-reactions-defense-puissance",
    "targetSection": "4-defense-occulte-et-puissance-des-effets"
  },
  {
    "articleId": "regles-verite-v7-mage-roue-5-portes-15-ecoles",
    "sectionId": "morphomancie-magie-du-modelage",
    "quote": "respecter le Principe de désignation",
    "label": "Principe de désignation",
    "targetId": "regles-verite-v7-mage-maitrise-amplitude-lancement",
    "targetSection": "principe-de-designation-et-role-des-savoirs"
  },
  {
    "articleId": "regles-verite-v7-mage-roue-5-portes-15-ecoles",
    "sectionId": "limites-et-garde-fous",
    "quote": "La Morphomancie ne remplace pas la Médéomancie",
    "label": "Médéomancie",
    "targetId": "regles-verite-v7-mage-roue-5-portes-15-ecoles",
    "targetSection": "medeomancie-magie-de-guerison"
  },
  {
    "articleId": "regles-verite-v7-mage-roue-5-portes-15-ecoles",
    "sectionId": "limites-et-garde-fous",
    "quote": "Médéomancie restaure ; elle ne remplace pas la Morphomancie",
    "label": "Morphomancie",
    "targetId": "regles-verite-v7-mage-roue-5-portes-15-ecoles",
    "targetSection": "morphomancie-magie-du-modelage"
  },
  {
    "articleId": "regles-verite-v7-mage-roue-5-portes-15-ecoles",
    "sectionId": "spectromancie-magie-spectrale",
    "quote": "Elle ne réanime pas la chair et ne remplace pas la Nécromancie",
    "label": "Nécromancie",
    "targetId": "regles-verite-v7-mage-roue-5-portes-15-ecoles",
    "targetSection": "necromancie-magie-de-la-mort"
  },
  {
    "articleId": "regles-verite-v7-mage-roue-5-portes-15-ecoles",
    "sectionId": "limites-et-garde-fous",
    "quote": "Photomancie = lumière réelle ; Pseudomancie = perception ; Skiamancie = Ombre surnaturelle",
    "label": "Photomancie",
    "targetId": "regles-verite-v7-mage-roue-5-portes-15-ecoles",
    "targetSection": "photomancie-magie-de-la-lumiere"
  },
  {
    "articleId": "regles-verite-v7-mage-roue-5-portes-15-ecoles",
    "sectionId": "limites-et-garde-fous",
    "quote": "Pseudomancie = perception ; Skiamancie = Ombre surnaturelle",
    "label": "Pseudomancie",
    "targetId": "regles-verite-v7-mage-roue-5-portes-15-ecoles",
    "targetSection": "pseudomancie-magie-des-illusions"
  },
  {
    "articleId": "regles-verite-v7-mage-roue-5-portes-15-ecoles",
    "sectionId": "limites-et-garde-fous",
    "quote": "Les formes extrêmes comme une magie sismique parfaitement contrôlée peuvent devenir des Œuvres personnelles/familiales",
    "label": "Œuvres personnelles",
    "targetId": "regles-verite-v7-mage-tension-revers-echos-oeuvres",
    "targetSection": "uvre-personnelle"
  }
];
export const REVIEWED_RULE_TAGS = [
  {
    "articleId": "regles-verite-v7-mage-roue-5-portes-15-ecoles",
    "tags": [
      "Vérité",
      "Règles",
      "Mages",
      "Roue magique",
      "Kaharal",
      "Meldir",
      "Elinaeth",
      "Mestherak",
      "Discella",
      "écoles",
      "Maîtrise",
      "Amplitude"
    ],
    "note": "Lecture des 5 portes, 15 écoles, 90 exemples et limites. Morphomancie ne soigne pas; Spectromancie ne réanime pas le cadavre; Photomancie, Pseudomancie et Skiamancie restent distinctes. Les occurrences de « famille » et « fléau » ici ne désignent pas des factions. Les identifiants répétés demandent une occurrence explicite.",
    "previousTags": [
      "Vérité",
      "Mages",
      "Roue magique",
      "Kaharal",
      "Meldir",
      "Elinaeth",
      "Mestherak",
      "Discella",
      "écoles"
    ]
  },
  {
    "articleId": "regles-verite-v7-daemon-nature-fonctions-divinites-facettes",
    "tags": [
      "Vérité",
      "Règles",
      "Daemons",
      "Nature",
      "Fonctions",
      "Divinités",
      "Facettes"
    ],
    "note": "Origine de l’âme, incarnation, Nature, Fonction, Divinité, Facettes et Maisonnée distinguées. Spectre de Mageius suit la construction des sorts mais exclut Tension/Revers. Divergence PV avec Aseryn consignée pour arbitrage mécanique.",
    "previousTags": [
      "Vérité",
      "Daemons",
      "Nature",
      "Fonctions",
      "Divinités",
      "Facettes"
    ]
  },
  {
    "articleId": "regles-verite-v7-angelus-sephiroth-archanges-seraphins",
    "tags": [
      "Vérité",
      "Règles",
      "Angelus",
      "Sephiroth",
      "Archanges",
      "Séraphins",
      "Faveurs"
    ],
    "note": "Les 10 Sephiroth, 10 Dons actifs, 20 Faveurs actives, 10 Archanges renégats et leurs 10 Faveurs ont été lus. Un Sephira, un Archange et un Patron distincts; Renégat n’implique pas traître. Le second titre Sephiroth contient la règle de profil R remplaçant SR. Saturation de l’Arbre demande une destination propre à vérifier.",
    "previousTags": [
      "Vérité",
      "Angelus",
      "Sephiroth",
      "Archanges",
      "Séraphins",
      "Faveurs"
    ]
  },
  {
    "articleId": "regles-verite-v7-exiles-silcenters-hds-croix-runes-reseaux-hordes-technomagie",
    "tags": [
      "Vérité",
      "Règles",
      "Exilés",
      "Silcenters",
      "HDS",
      "Croix d’Emphyrra",
      "Runes",
      "Hordes",
      "Technomagie"
    ],
    "note": "Formation, réseau et ressource ne confèrent pas de Talents ou matériel gratuits. Croix et Hordes ne sont pas des sous-espèces. Horde Abyssale ne donne aucune Corruption automatique; Horde Maudite sans arbre PJ.",
    "previousTags": [
      "Vérité",
      "Règles",
      "Exilés",
      "Silcenters",
      "HDS",
      "Croix d’Emphyrra",
      "Runes",
      "Hordes",
      "Technomagie"
    ]
  },
  {
    "articleId": "regles-verite-v7-extrals-profils-physiologies",
    "tags": [
      "Vérité",
      "Règles",
      "Extrals",
      "Talass",
      "Mo’sen",
      "Baséanh",
      "Rocréen",
      "Thalsios"
    ],
    "note": "Cinq profils et conditions biologiques lus; quatre bras ne donnent pas de PA supplémentaires. Armure corporelle compatible avec protection portée; protocole de transition distinct de statut légal.",
    "previousTags": [
      "Vérité",
      "Règles",
      "Extrals",
      "Talass",
      "Mo’sen",
      "Baséanh",
      "Rocréen",
      "Thalsios"
    ]
  },
  {
    "articleId": "regles-verite-v7-aseryn-nature-accelyr-origines",
    "tags": [
      "Vérité",
      "Règles",
      "Aseryns",
      "Nature",
      "Accelyr",
      "Origines",
      "Résonance",
      "Serathéens"
    ],
    "note": "Accelyr, sens EM, routes communes, cinq Origines et deux exceptions lus. Affinité foudroyante biologique ne vaut pas Affinité Mage. Traces ancestrales ne donnent pas leurs pouvoirs complets. Bloc récapitulatif des Origines mal segmenté consigné; PV divergents laissés inchangés.",
    "previousTags": [
      "Vérité",
      "Aseryns",
      "Nature",
      "Accelyr",
      "Origines",
      "Résonance",
      "Serathéens"
    ]
  },
  {
    "articleId": "regles-verite-v7-extrals-organisations-aidh-homo-superior-adrak",
    "tags": [
      "Vérité",
      "Règles",
      "Extrals",
      "GAAC",
      "AIDH",
      "Homo Superior",
      "Ad’rak"
    ],
    "note": "GAAC sans arbre PTV; Homo Superior humain technobiologique, Ad’rak véritable Extral. Institution, doctrine et espèce restent distinctes. Nanites intégrées ne donnent pas une cible Neuro automatique.",
    "previousTags": [
      "Vérité",
      "Règles",
      "Extrals",
      "GAAC",
      "AIDH",
      "Homo Superior",
      "Ad’rak"
    ]
  },
  {
    "articleId": "regles-verite-v7-aseryn-treize-dratyn-conseil-foudre",
    "tags": [
      "Vérité",
      "Règles",
      "Aseryns",
      "Treize",
      "Dratyn",
      "Foudre",
      "Conseil de la Foudre"
    ],
    "note": "Treize Traditions apprises, Kalirath exclu des Fondateurs. Theana est Fondatrice, Theanai Maison moderne. Dratyn enseigne Foudre; Conseil de la Foudre chamanique. Quatre spécialisations normalement exclusives. Table de Foudre ne suit pas les paliers de Tir.",
    "previousTags": [
      "Vérité",
      "Aseryns",
      "Treize",
      "Dratyn",
      "Foudre",
      "Conseil de la Foudre"
    ]
  },
  {
    "articleId": "regles-verite-extral-protocoles-de-continuite",
    "tags": [
      "Règles",
      "Talents",
      "principes",
      "Builder",
      "Vérité",
      "Extrals",
      "Voile",
      "Protocoles de Continuité"
    ],
    "note": "Quatre Talents, 7 PTV; école de transition V/SR/R, aucun PA gratuit ni révélation forcée d’allié. Témoignages déjà observés non effacés. Liens vers cursus et règle du Voile.",
    "previousTags": [
      "extral",
      "Talents",
      "principes",
      "Builder"
    ]
  },
  {
    "articleId": "regles-verite-v7-corruption-integrite-bascule",
    "tags": [
      "Vérité",
      "Règles",
      "Corruption",
      "Humanité",
      "Intégrité",
      "Souillure",
      "Bascule",
      "DON",
      "RITE",
      "FAVEUR",
      "Fléaux",
      "Focus Fléaux 2026-09",
      "Purification"
    ],
    "note": "Intégrité commune mais Charge et Corruption indépendantes. Une seule Source; préséance ne mesure pas puissance cosmique. Exposition, Souillure et Bascule sont trois tests distincts. DON/RITE/FAVEUR ont des conditions différentes après purification.",
    "previousTags": [
      "Vérité",
      "Corruption",
      "Humanité",
      "Intégrité",
      "Souillure",
      "Bascule",
      "DON",
      "RITE",
      "FAVEUR",
      "Fléaux",
      "Focus Fléaux 2026-09"
    ]
  },
  {
    "articleId": "regles-pnj-talents-statistiques",
    "tags": [
      "MJ",
      "Règles",
      "PNJ",
      "Talents",
      "Statistiques"
    ],
    "note": "Paliers Réalité et Vérité indépendants. Toutes les tables de talents génériques et signatures nommées lues. Budgets éditoriaux ne constituent pas des faits historiques. Restrictions MJ conservées; pas de liens publics vers signatures individuelles non encore vérifiées.",
    "previousTags": [
      "MJ",
      "PNJ",
      "Talents",
      "Statistiques"
    ]
  },
  {
    "articleId": "regles-verite-v7-equipement-proprietes-acquisition",
    "tags": [
      "Vérité",
      "Règles",
      "Équipement",
      "Chasse",
      "Raven",
      "AIDH",
      "Runes",
      "Technomagie",
      "Jade"
    ],
    "note": "Accès fictionnel, propriétés, diagnostic de confinement, marché Exilé et AIDH lus. Sacré, Solaire et EMP ne sont pas universels. Invariant résiste aux corrections sans voir au-delà du capteur. Pièces uniques restent hors catalogue.",
    "previousTags": [
      "Vérité",
      "Équipement",
      "Chasse",
      "Raven",
      "AIDH",
      "Runes",
      "Technomagie",
      "Jade"
    ]
  },
  {
    "articleId": "regles-verite-chasseur-lavandieres",
    "tags": [
      "Vérité",
      "Règles",
      "Vampires",
      "Chasse",
      "Lavandières",
      "Talents",
      "principes",
      "Builder"
    ],
    "note": "Le texte réserve explicitement cette tradition aux Vampires : suppression du tag humain.",
    "previousTags": [
      "humain",
      "Talents",
      "principes",
      "Builder"
    ]
  }
];

export function applyReviewedRuleTaxonomy(byId: Map<string, Article>): void {
  for (const entry of REVIEWED_RULE_TAGS) {
    const article = byId.get(entry.articleId);
    if (article && JSON.stringify(article.tags) === JSON.stringify(entry.previousTags)) article.tags = [...entry.tags];
  }
  applyContextualLinks(byId, REVIEWED_RULE_LINKS);
}

export function applyContextualLinks(byId: Map<string, Article>, entries: typeof REVIEWED_RULE_LINKS): void {
  for (const entry of entries) {
    const article = byId.get(entry.articleId);
    const blocks = (article?.sections ?? [])
      .filter((section: { id?: string }) => section.id === entry.sectionId)
      .flatMap((section: { blocks?: Array<{ type?: string; text?: string }> }) => section.blocks ?? [])
      .filter((block: { type?: string; text?: string }) => block.type === "p" && block.text?.includes(entry.quote));
    // Preserve later author edits if a reviewed passage has changed.
    if (blocks.length !== 1) continue;
    const block = blocks[0];
    const replacement = entry.quote.replace(entry.label,
      `[${entry.label}](/compendium?article=${entry.targetId}#wiki-section-${entry.targetSection})`);
    block.text = block.text!.replace(entry.quote, replacement);
  }
}

// Restore the imported overview without changing any listed value or anchor.
export function repairReviewedAserynOverview(byId: Map<string, Article>): void {
  const article = byId.get("regles-verite-v7-aseryn-nature-accelyr-origines");
  const origin = article?.sections?.find((section: { id?: string }) => section.id === "aerilien-neo-atlante");
  const overview = article?.sections?.find((section: { id?: string }) => section.id === "origines-jouables");
  if (origin && overview && JSON.stringify(origin.blocks) === JSON.stringify([{"type": "p", "text": "SR: +1 Agi, +1 Vol"}, {"type": "p", "text": "• R: +2 Agi, +1 Vol Orientation: Affinité magique, lecture des flux Mûlien SR: +1 Agi, +1 Esp", "style": "list"}, {"type": "p", "text": "• R: +2 Agi, +1 Esp Orientation: Psychisme, télépathie Hyperboréen SR: +1 Agi, +1 Vig", "style": "list"}, {"type": "p", "text": "• R: +2 Agi, +1 Vig Orientation: Physique, endurance, explosivité Lémurian SR: +1 Agi, +1 Vol", "style": "list"}, {"type": "p", "text": "• R: +2 Agi, +1 Vol Orientation: Héritage nymphal et élémentaire Serathèen SR: +1 Agi", "style": "list"}, {"type": "p", "text": "• R: +2 Agi Orientation: Ascendance composite, Traces multiples Aérilien / Néo-Atlante", "style": "list"}])) {
    overview.blocks.push({ type: "table", rows: [["Origine", "SR", "R", "Orientation"], ["Aérilien / Néo-Atlante", "+1 Agi, +1 Vol", "+2 Agi, +1 Vol", "Affinité magique, lecture des flux"], ["Mûlien", "+1 Agi, +1 Esp", "+2 Agi, +1 Esp", "Psychisme, télépathie"], ["Hyperboréen", "+1 Agi, +1 Vig", "+2 Agi, +1 Vig", "Physique, endurance, explosivité"], ["Lémurian", "+1 Agi, +1 Vol", "+2 Agi, +1 Vol", "Héritage nymphal et élémentaire"], ["Serathèen", "+1 Agi", "+2 Agi", "Ascendance composite, Traces multiples"]] });
    origin.blocks = [];
  }
}
