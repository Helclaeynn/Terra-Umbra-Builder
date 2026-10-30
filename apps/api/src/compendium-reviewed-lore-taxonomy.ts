import type { Article } from "./compendium.js";
import { applyContextualLinks } from "./compendium-reviewed-rule-taxonomy.js";

export const REVIEWED_LORE_LINKS = [
  {
    "articleId": "verite-v7-derriere-le-voile",
    "sectionId": "le-cas-particulier-des-chasseurs-reconnus",
    "quote": "Cette reconnaissance ne lui accorde pas pour autant une vision surnaturelle universelle",
    "label": "vision surnaturelle universelle",
    "targetId": "regles-verite-v7-voile-continuite-objets-reseaux-interfaces",
    "targetSection": "5-hologramme-voile-semi-revelation-et-revelation"
  },
  {
    "articleId": "verite-v7-derriere-le-voile",
    "sectionId": "la-limite-la-plus-importante-le-monde-doit-rester-jouable",
    "quote": "Une fissure attire l'attention",
    "label": "Une fissure",
    "targetId": "verite-v7-cycle-neant-ombremonde-histoire-cachee",
    "targetSection": "fissures-catastrophes-et-opportunistes"
  },
  {
    "articleId": "verite-v7-derriere-le-voile",
    "sectionId": "les-limites-de-la-connaissance-ce-que-meme-ce-livre-ne-rend-pas-banal",
    "quote": "Un Aseryn peut n'avoir jamais rencontré de Paleo-Atlante",
    "label": "Paleo-Atlante",
    "targetId": "regles-verite-v7-aseryn-nature-accelyr-origines",
    "targetSection": "origines-exceptionnelles-non-proposees-normalement-aux-pj"
  },
  {
    "articleId": "verite-v7-cycle-neant-ombremonde-histoire-cachee",
    "sectionId": "le-cycle-le-neant-et-ce-que-la-mort-revele",
    "quote": "Les Daemons constituent encore un autre cas : leur âme a été choisie, retirée du Cycle et reforgée par une ancienne divinité",
    "label": "leur âme a été choisie, retirée du Cycle et reforgée",
    "targetId": "regles-verite-v7-daemon-nature-fonctions-divinites-facettes",
    "targetSection": "concept-et-architecture"
  },
  {
    "articleId": "verite-v7-cycle-neant-ombremonde-histoire-cachee",
    "sectionId": "science-magie-et-technologie-sous-le-voile",
    "quote": "œuvre à laquelle l'AIDH a participé et qu'elle continue d'aider à stabiliser",
    "label": "l'AIDH a participé",
    "targetId": "verite-v7-homo-superior-adrak-profils-rares",
    "targetSection": "aidh-hologramme"
  },
  {
    "articleId": "verite-v7-cycle-neant-ombremonde-histoire-cachee",
    "sectionId": "science-magie-et-technologie-sous-le-voile",
    "quote": "comprendre ce qu'une force devrait faire lui permet de savoir exactement ce qu'il est en train de modifier",
    "label": "comprendre ce qu'une force devrait faire",
    "targetId": "regles-verite-v7-mage-maitrise-amplitude-lancement",
    "targetSection": "principe-de-designation-et-role-des-savoirs"
  },
  {
    "articleId": "verite-v7-homo-superior-adrak-profils-rares",
    "sectionId": "homo-superior",
    "quote": "Les Homo Superior ne sont pas une espèce. Ils restent Humains",
    "label": "Homo Superior",
    "targetId": "regles-verite-v7-extrals-organisations-aidh-homo-superior-adrak",
    "targetSection": "homo-superior"
  },
  {
    "articleId": "verite-v7-homo-superior-adrak-profils-rares",
    "sectionId": "adrak",
    "quote": "Sur Terre, les profils ordinaires ou jouables sont surtout des réfugiés, dissidents, descendants de communautés libres ou anciens sujets ayant échappé à l’Armée noire",
    "label": "profils ordinaires ou jouables",
    "targetId": "regles-verite-v7-extrals-organisations-aidh-homo-superior-adrak",
    "targetSection": "adrak"
  },
  {
    "articleId": "verite-v7-homo-superior-adrak-profils-rares",
    "sectionId": "aidh-hologramme",
    "quote": "invariants, capteurs, enregistrements invariants, confinement, biphysique, anti-possession et protocoles de terrain",
    "label": "invariants, capteurs, enregistrements invariants",
    "targetId": "regles-verite-v7-equipement-proprietes-acquisition",
    "targetSection": "aidh"
  },
  {
    "articleId": "verite-v7-homo-superior-adrak-profils-rares",
    "sectionId": "aidh-ichei",
    "quote": "Magie, peuples d’Aèr et surtout Hologramme rendent la planète stratégiquement unique",
    "label": "Hologramme",
    "targetId": "regles-verite-v7-voile-continuite-objets-reseaux-interfaces",
    "targetSection": "5-hologramme-voile-semi-revelation-et-revelation"
  },
  {
    "articleId": "verite-v7-delanial-pere-ombre",
    "sectionId": "classification-mj",
    "quote": "Il n’existe donc aucune Source de Corruption Delanial",
    "label": "Source de Corruption",
    "targetId": "regles-verite-v7-corruption-integrite-bascule",
    "targetSection": "sources-concurrentes"
  },
  {
    "articleId": "bestiaire-v15-delanial-le-faux-septieme-fleau",
    "sectionId": "dossier-mj",
    "quote": "cela ne fait pas de lui un « super-Fléau » et ne lui donne ni Bascule ni arbre de Dons",
    "label": "Bascule",
    "targetId": "regles-verite-v7-corruption-integrite-bascule",
    "targetSection": "bascule"
  },
  {
    "articleId": "verite-v7-garous-khinae-meutes-pelages",
    "sectionId": "heritage-khinae",
    "quote": "Les Garous sont des descendants de Khinae restés liés au Cycle",
    "label": "liés au Cycle",
    "targetId": "verite-v7-cycle-neant-ombremonde-histoire-cachee",
    "targetSection": "le-cycle-le-neant-et-ce-que-la-mort-revele"
  },
  {
    "articleId": "verite-v7-garous-khinae-meutes-pelages",
    "sectionId": "formes",
    "quote": "La Mue exige un effort réel",
    "label": "Mue",
    "targetId": "regles-verite-v7-garou-nature-formes-frenesie-pelages",
    "targetSection": "mue"
  },
  {
    "articleId": "verite-v7-garous-khinae-meutes-pelages",
    "sectionId": "formes",
    "quote": "la Frénésie ne représente pas une disparition totale de l'intelligence",
    "label": "Frénésie",
    "targetId": "regles-verite-v7-garou-nature-formes-frenesie-pelages",
    "targetSection": "frenesie"
  },
  {
    "articleId": "verite-v7-garous-khinae-meutes-pelages",
    "sectionId": "societe",
    "quote": "La société garoue commence par la Meute puis s'élargit en Familles, clans et structures de Pelage",
    "label": "Familles, clans et structures de Pelage",
    "targetId": "verite-v7-garous-khinae-meutes-pelages",
    "targetSection": "pelages-source-hierarchie"
  },
  {
    "articleId": "verite-v7-garous-khinae-meutes-pelages",
    "sectionId": "besoin-de-meute-en-2035",
    "quote": "une « Chasse » peut être une traque animale, une mission d’infiltration",
    "label": "« Chasse »",
    "targetId": "verite-v7-garous-khinae-meutes-pelages",
    "targetSection": "khinae-chasse-activite-meute"
  },
  {
    "articleId": "verite-v7-descendants-khinae",
    "sectionId": "famille",
    "quote": "Un Tigre n'éprouve pas automatiquement l'Appel de la Meute",
    "label": "Appel de la Meute",
    "targetId": "verite-v7-garous-khinae-meutes-pelages",
    "targetSection": "appel-meute"
  },
  {
    "articleId": "verite-v7-descendants-khinae",
    "sectionId": "famille",
    "quote": "Ils restent liés au Cycle",
    "label": "Cycle",
    "targetId": "verite-v7-cycle-neant-ombremonde-histoire-cachee",
    "targetSection": "le-cycle-le-neant-et-ce-que-la-mort-revele"
  },
  {
    "articleId": "verite-v7-descendants-khinae",
    "sectionId": "rarete-corruption",
    "quote": "Un Renard libre est exceptionnel parce que la majorité historique connue a cédé à V’Aagor",
    "label": "Renard libre",
    "targetId": "regles-verite-v7-khinae-moteur-lignees",
    "targetSection": "renards"
  },
  {
    "articleId": "verite-v7-descendants-khinae",
    "sectionId": "rarete-corruption",
    "quote": "Les Requins ne sont pas immunisés à Thul",
    "label": "Requins",
    "targetId": "regles-verite-v7-khinae-moteur-lignees",
    "targetSection": "requins"
  },
  {
    "articleId": "verite-v7-descendants-khinae",
    "sectionId": "therianthropes-complement-autres",
    "quote": "les berserkirs ont été les amis des ulfhednars",
    "label": "berserkirs",
    "targetId": "regles-verite-v7-khinae-moteur-lignees",
    "targetSection": "berserkirs"
  },
  {
    "articleId": "verite-v7-vampires-civilisation-cours-sangs",
    "sectionId": "branche-maudite",
    "quote": "la vraie mort du Vampire conduit son âme au Néant",
    "label": "Néant",
    "targetId": "verite-v7-cycle-neant-ombremonde-histoire-cachee",
    "targetSection": "le-cycle-le-neant-et-ce-que-la-mort-revele"
  },
  {
    "articleId": "verite-v7-vampires-civilisation-cours-sangs",
    "sectionId": "couches-identite",
    "quote": "La société vampirique superpose trois couches qu'il ne faut jamais confondre",
    "label": "trois couches qu'il ne faut jamais confondre",
    "targetId": "regles-verite-v7-vampire-nature-predation-cours",
    "targetSection": "architecture"
  },
  {
    "articleId": "verite-v7-vampires-civilisation-cours-sangs",
    "sectionId": "vivants",
    "quote": "Sa physiologie est maudite et capable de ralentir ses fonctions jusqu'à paraître cliniquement morte",
    "label": "ralentir ses fonctions jusqu'à paraître cliniquement morte",
    "targetId": "regles-verite-v7-vampire-nature-predation-cours",
    "targetSection": "proprietes"
  },
  {
    "articleId": "verite-v7-vampires-civilisation-cours-sangs",
    "sectionId": "sangs-noirs",
    "quote": "Le Sang Masqué constitue une exception de conception importante",
    "label": "Sang Masqué",
    "targetId": "regles-verite-v7-vampire-sangs-transformations",
    "targetSection": "principe"
  }
];
export const REVIEWED_LORE_TAGS = [
  {
    "articleId": "verite-v7-derriere-le-voile",
    "previousTags": [
      "Vérité",
      "Voile",
      "Profane",
      "Éveillé",
      "Initié",
      "Chasseurs",
      "monde caché"
    ],
    "tags": [
      "Vérité",
      "Voile",
      "Profane",
      "Éveillé",
      "Initié",
      "Chasseurs",
      "monde caché",
      "Initiation"
    ]
  },
  {
    "articleId": "verite-v7-cycle-neant-ombremonde-histoire-cachee",
    "previousTags": [
      "Vérité",
      "Cycle",
      "Néant",
      "Ombremonde",
      "Atlantide",
      "science",
      "magie",
      "religions",
      "mythes"
    ],
    "tags": [
      "Vérité",
      "Cycle",
      "Néant",
      "Ombremonde",
      "Atlantide",
      "science",
      "magie",
      "religions",
      "mythes",
      "Cosmologie",
      "Histoire cachée"
    ]
  },
  {
    "articleId": "verite-v7-homo-superior-adrak-profils-rares",
    "previousTags": [
      "Vérité",
      "AIDH",
      "Homo Superior",
      "Ad’rak",
      "Profils rares",
      "Armée noire"
    ],
    "tags": [
      "Vérité",
      "AIDH",
      "Homo Superior",
      "Ad’rak",
      "Profils rares",
      "Armée noire",
      "Extrals",
      "Humains galactiques"
    ]
  },
  {
    "articleId": "verite-v7-delanial-pere-ombre",
    "previousTags": [
      "Vérité",
      "Delanial",
      "Ombre-Monde",
      "Père de l’Ombre",
      "MJ",
      "Fléaux",
      "Focus Fléaux 2026-09"
    ],
    "tags": [
      "Vérité",
      "Delanial",
      "Ombre-Monde",
      "Père de l’Ombre",
      "Cultes",
      "Rumeurs"
    ]
  },
  {
    "articleId": "bestiaire-v15-delanial-le-faux-septieme-fleau",
    "previousTags": [
      "2.12 Dossiers majeurs de scénario",
      "Figures hors échelle"
    ],
    "tags": [
      "Vérité",
      "Delanial",
      "Père de l’Ombre",
      "Figures hors échelle"
    ]
  },
  {
    "articleId": "verite-v7-garous-khinae-meutes-pelages",
    "previousTags": [
      "Vérité",
      "Garous",
      "Khinae",
      "Meute",
      "Pelages",
      "Sangs vifs",
      "Héritage dévorant",
      "Appel de la Meute",
      "Multi-source",
      "Meutes",
      "Chasse",
      "Latents"
    ],
    "tags": [
      "Vérité",
      "Garous",
      "Khinae",
      "Pelages",
      "Sangs vifs",
      "Héritage dévorant",
      "Appel de la Meute",
      "Meutes",
      "Chasse",
      "Latents"
    ]
  },
  {
    "articleId": "verite-v7-descendants-khinae",
    "previousTags": [
      "Vérité",
      "Khinae",
      "thérianthropes",
      "Lignées",
      "Sangs vifs",
      "Thérianthropes",
      "Descendants de Khinae",
      "Multi-source"
    ],
    "tags": [
      "Vérité",
      "Khinae",
      "Lignées",
      "Sangs vifs",
      "Thérianthropes",
      "Descendants de Khinae"
    ]
  },
  {
    "articleId": "verite-v7-vampires-civilisation-cours-sangs",
    "previousTags": [
      "Vérité",
      "Vampires",
      "Khinae",
      "Cours",
      "Maisons",
      "Sangs noirs",
      "torpeur",
      "Fléaux",
      "Focus Fléaux 2026-09",
      "Cours vampiriques",
      "Multi-source"
    ],
    "tags": [
      "Vérité",
      "Vampires",
      "Khinae",
      "Cours",
      "Maisons",
      "Sangs noirs",
      "torpeur",
      "Fléaux",
      "Cours vampiriques"
    ]
  }
];

export function applyReviewedLoreTaxonomy(byId: Map<string, Article>): void {
  for (const entry of REVIEWED_LORE_TAGS) {
    const article = byId.get(entry.articleId);
    if (article && JSON.stringify(article.tags) === JSON.stringify(entry.previousTags)) article.tags = [...entry.tags];
  }
  const lore = byId.get("verite-v7-delanial-pere-ombre");
  if (lore) {
    if (lore.title === "Delanial — le faux Septième") lore.title = "Delanial — Père de l’Ombre";
    const source = lore.sections?.find((section: { id?: string }) => section.id === "fleaux-focus-pere-ombre");
    const target = lore.sections?.find((section: { id?: string }) => section.id === "classification-mj");
    const sentence = "Ces interprétations ne changent pas sa véritable classification : Delanial n’est pas un Fléau.";
    const paragraph = source?.blocks?.find((block: { text?: string }) => block.text?.includes(sentence));
    if (paragraph && target?.audience === "mj") {
      paragraph.text = paragraph.text.replace(` ${sentence}`, "");
      if (!target.blocks.some((block: { text?: string }) => block.text === sentence)) target.blocks.push({type: "p", style: "lore", text: sentence});
    }
  }
  const bestiary = byId.get("bestiaire-v15-delanial-le-faux-septieme-fleau");
  if (bestiary) {
    if (bestiary.title === "Delanial — le faux Septième Fléau") bestiary.title = "Delanial — Père de l’Ombre";
    if (bestiary.illustration?.alt === "Illustration à venir — Delanial — le faux Septième Fléau") bestiary.illustration.alt = "Illustration à venir — Delanial — Père de l’Ombre";
    const source = bestiary.sections?.find((section: { id?: string }) => section.id === "description");
    const target = bestiary.sections?.find((section: { id?: string }) => section.id === "dossier-mj");
    const sentence = "Il est pourtant d'une autre nature, un Légionnaire des Puissances si ancien et si puissant que son refuge dans l'Ombre-Monde a suffi à donner l'illusion d'une puissance primordiale comparable aux grandes corruptions.";
    const paragraph = source?.blocks?.find((block: { text?: string }) => block.text?.includes(sentence));
    if (paragraph && target?.audience === "mj") {
      paragraph.text = paragraph.text.replace(` ${sentence}`, "");
      if (!target.blocks.some((block: { text?: string }) => block.text === sentence)) target.blocks.push({type: "p", style: "lore", text: sentence});
    }
  }
  applyContextualLinks(byId, REVIEWED_LORE_LINKS);
}
