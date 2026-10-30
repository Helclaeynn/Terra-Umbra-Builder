import { terraUmbraCreationRules } from "./rules/terra-umbra-creation.js";
import { terraUmbraCreationLore } from "./rules/terra-umbra-creation-lore.js";

type NavigationEntry = {
  id: string;
  dataset: string;
  category: string;
  group: string;
  groupOrder: number;
  subgroup: string;
  subgroupOrder: number;
  pageOrder: number;
  displayTitle: string;
};

export const BUILDER_ORIGIN_PAGE_IDS: Record<string, string> = {
  corporatiste: "regles-realite-origine-corporatiste",
  gouvernementale: "regles-realite-origine-gouvernementale",
  mafieuse: "regles-realite-origine-mafieuse",
  religieuse: "regles-realite-origine-religieuse",
  crawler: "regles-realite-origine-crawler"
};

export const BUILDER_SPHERE_PAGE_IDS: Record<string, string> = {
  corporatiste: "regles-realite-sphere-corporatiste",
  gouvernementale: "regles-realite-sphere-gouvernementale",
  mafieuse: "regles-realite-sphere-pegre",
  crawler: "regles-realite-sphere-crawler",
  religieuse: "regles-realite-sphere-religieuse"
};

/**
 * Only Styles that had no canonical Compendium page in the live coverage audit
 * of 2026-09-19 belong here. Existing pages always keep their current mapping.
 */
export const BUILDER_STYLE_PAGE_IDS: Record<string, string> = {
  manucorpo: "regles-realite-style-manucorpo",
  biocorpo: "regles-realite-style-biocorpo",
  cybercorpo: "regles-realite-style-cybercorpo",
  armacorpo: "regles-realite-style-armacorpo",
  servicorpo: "regles-realite-style-servicorpo",
  forces_armees: "regles-realite-style-forces-armees",
  agent_gouvernemental: "regles-realite-style-agent-gouvernemental",
  net_corps: "regles-realite-style-net-corps",
  service_public: "regles-realite-style-service-public",
  diplomate_administrateur: "regles-realite-style-diplomate-administrateur",
  hacker: "regles-realite-style-hacker",
  affairiste_bookmaker: "regles-realite-style-affairiste-bookmaker",
  ordre_arme: "regles-realite-style-ordre-arme",
  clerc_holonet: "regles-realite-style-clerc-holonet",
  ministeriel: "regles-realite-style-ministeriel",
  clerc_administrateur: "regles-realite-style-clerc-administrateur",
  missionnaire: "regles-realite-style-missionnaire"
};

function introBlock(text: string) {
  return {
    type: "p",
    style: "lore",
    text
  };
}

function article(
  id: string,
  title: string,
  tags: string[],
  sections: Array<{ id: string; title: string; paragraphs: string[] }>
) {
  return {
    id,
    title,
    category: "Règles",
    sourceCategory: "Règles",
    dataset: "generated-builder",
    source: "Builder V2 — catalogue canonique de création",
    status: "canon_enrichi",
    tags,
    __generatedBuilderReference: true,
    sections: sections.map((section) => ({
      id: section.id,
      title: section.title,
      level: 2,
      blocks: section.paragraphs.map(introBlock)
    }))
  };
}

const originEditorial: Record<string, { learned: string; tensions: string }> = {
  corporatiste: {
    learned: "On y apprend à reconnaître les rangs, les services, les marques et les comportements attendus. La compétence utile est valorisée très tôt, tout comme la capacité à présenter un profil cohérent à ceux qui décident d’une formation ou d’une carrière.",
    tensions: "Les anciens camarades, formateurs et collègues peuvent ouvrir des portes, mais ils rappellent aussi ce que l’institution a investi. Quitter cet environnement ne coupe pas automatiquement assurances, dettes, réputation ni loyautés familiales."
  },
  gouvernementale: {
    learned: "Les procédures, responsabilités publiques et limites d’une fonction deviennent des réalités concrètes. Cette éducation apprend autant où demander de l’aide que la manière dont un dossier peut se perdre entre deux services.",
    tensions: "Famille de fonctionnaires, école publique ou première affectation laissent des contacts durables. Ils facilitent l’accès aux institutions sans supprimer les habilitations, la hiérarchie ni les comptes que chacun doit rendre."
  },
  mafieuse: {
    learned: "Le milieu enseigne à lire réputation, dette, silence et territoire. On y distingue vite la petite combine tolérée de l’acte qui engage toute une famille, ainsi que la différence entre être connu et être protégé.",
    tensions: "Les vieilles fréquentations peuvent fournir une adresse ou transmettre un avertissement, mais chaque service crée une mémoire. Les liens affectifs, commerciaux et criminels se superposent sans que l’un efface les autres."
  },
  religieuse: {
    learned: "Rites, textes et vie communautaire donnent un langage partagé. La discipline personnelle s’accompagne souvent d’un apprentissage très pratique de l’accueil, du soin, de l’enseignement ou de l’organisation collective.",
    tensions: "Une communauté d’origine peut rester un refuge, une responsabilité ou un lieu de désaccord. Appartenir à une tradition ne signifie pas partager chaque décision de ses dirigeants ni disposer partout de la même autorité."
  },
  crawler: {
    learned: "La débrouille, les codes de rue et la récupération apprennent à distinguer ce qui peut encore servir de ce qui devient un piège. Un réseau fiable compte souvent davantage qu’un statut administratif impeccable.",
    tensions: "Les relations sont locales, personnelles et fondées sur la réputation. Connaître quelqu’un permet d’entamer une recherche ou une négociation ; cela ne crée ni stock, ni compétence, ni secours automatique."
  }
};

const sphereEditorial: Record<string, { offers: string; paths: string }> = {
  corporatiste: {
    offers: "Elle offre salaires, outils, assurance, accès et continuité logistique. En retour, elle attend performance, confidentialité, mobilité et respect d’une chaîne de décision dont le contrat ne montre pas toujours tous les usages.",
    paths: "On peut y entrer par la technique, la sécurité, les services ou l’administration, puis progresser, changer de branche ou devenir dépendant d’un employeur. Une carrière corporative ouvre des moyens réels sans confondre ressources de poste et patrimoine personnel."
  },
  gouvernementale: {
    offers: "Elle donne mandat, légitimité, accès aux services publics et capacité de réquisition encadrée. Elle exige procédures, traçabilité et responsabilité : l’urgence élargit parfois les moyens, jamais rétroactivement les prérogatives.",
    paths: "Forces armées, agences, police, santé, secours et haute administration offrent des trajectoires différentes. Elles peuvent se croiser au fil des affectations sans former une institution unique."
  },
  mafieuse: {
    offers: "Elle apporte protection, marché, crédit et intermédiaires là où les circuits légaux ne répondent pas. Elle exige loyauté compréhensible, discrétion et règlement des dettes ; sa solidarité reste liée à l’organisation et au territoire concernés.",
    paths: "Combattants, médecins clandestins, hackers et affairistes n’occupent pas la même place. Certains deviennent membres d’une structure, d’autres restent prestataires ou partenaires, avec des risques et des droits très différents."
  },
  crawler: {
    offers: "La Sphère offre autonomie, contrats et réseaux souples. Elle exige de construire soi-même sa réputation, son matériel et ses solutions de secours : aucune administration centrale ne garantit l’après-mission.",
    paths: "Un Crawler peut combattre, infiltrer le Holonet, soigner, transporter ou organiser une scène culturelle. Ces métiers se combinent parfois, mais le nom de Crawler décrit une façon de travailler plus qu’une compétence universelle."
  },
  religieuse: {
    offers: "Elle fournit communauté, mission, locaux et services portés par une institution de foi. Elle exige de représenter une doctrine et de répondre à une hiérarchie ou à des fidèles, même lorsque le travail quotidien paraît purement technique.",
    paths: "Ordres armés, communication Holonet, ministères spécialisés, administration et mission de terrain donnent des carrières très différentes. Toutes servent une institution religieuse sans faire de chaque membre un prédicateur."
  }
};

const styleEditorial: Record<string, { daily: string; place: string }> = {
  manucorpo: {
    daily: "Ateliers, lignes automatisées, centrales et réseaux logistiques rythment le travail. Le poste alterne diagnostic, planification, contrôle des machines et intervention lorsqu’une chaîne cesse de produire correctement.",
    place: "Le Manucorpo transforme les décisions de la corporation en objets et infrastructures. Sa valeur augmente avec sa capacité à maintenir la production sans perdre de vue sécurité, coût et délais."
  },
  biocorpo: {
    daily: "Laboratoires, cliniques et unités de culture imposent protocoles, traçabilité et contrôle biologique. Une erreur peut concerner un patient, une lignée cellulaire ou toute une production.",
    place: "Le Biocorpo relie recherche, médecine et industrie du vivant. Il travaille sous des contraintes scientifiques mais aussi commerciales et réglementaires particulièrement fortes."
  },
  cybercorpo: {
    daily: "Réseaux, IA, implants et cybersécurité forment un même environnement de travail. Le spécialiste passe de l’analyse à l’intégration, puis à la réponse aux incidents qui touchent données, machines ou utilisateurs augmentés.",
    place: "Le Cybercorpo protège et développe l’infrastructure nerveuse de son employeur. Son accès technique peut être vaste, mais demeure segmenté par les habilitations et la responsabilité du poste."
  },
  armacorpo: {
    daily: "Contrôle d’accès, escorte, patrouille et intervention alternent avec entraînement et rédaction de rapports. L’usage de la force s’inscrit dans les règles du territoire et le contrat de sécurité concerné.",
    place: "L’Armacorpo défend les personnes, sites et intérêts de la corporation. Il représente son autorité sur le terrain sans être pour autant un policier public."
  },
  servicorpo: {
    daily: "Clients, équipes, contrats, agendas et objectifs font circuler le travail d’un service à l’autre. La journée demande autant de suivi que de présentation, de négociation et d’arbitrage.",
    place: "Le Servicorpo rend l’organisation lisible et utilisable pour ses partenaires comme pour ses propres cadres. Son influence vient de sa place dans les flux d’information et de décision."
  },
  forces_armees: {
    daily: "Entraînement, maintenance, exercices et périodes d’attente préparent des engagements où l’unité doit agir comme un ensemble. Mobilité et discipline comptent autant que la spécialité individuelle.",
    place: "Le militaire sert une chaîne de commandement et un mandat de défense. Son équipement et son autorité dépendent de l’affectation, pas de sa seule maîtrise personnelle."
  },
  agent_gouvernemental: {
    daily: "Dossiers, surveillance, auditions et opérations de terrain se succèdent selon la mission du service. Collecter une information exploitable demande de préserver procédure, preuve et coordination.",
    place: "L’agent exerce une part précise de l’autorité publique. Badge et habilitation ouvrent les moyens de son institution seulement dans le cadre où ils ont été accordés."
  },
  net_corps: {
    daily: "Le Net Corps cartographie réseaux, prépare défenses et intrusions, puis suit les effets numériques d’une opération réelle. Il travaille avec les unités de terrain plutôt que dans un conflit séparé du monde physique.",
    place: "Cette spécialité donne aux forces publiques une capacité de cybercombat et de guerre électronique. Elle reste soumise aux objectifs, règles d’engagement et priorités du commandement."
  },
  service_public: {
    daily: "Urgences, soins, réparations et permanence imposent de travailler quand l’environnement ne fonctionne plus normalement. Les ressources disponibles et la gravité des besoins déterminent sans cesse les priorités.",
    place: "Le Service public maintient personnes et infrastructures au-delà de leur rentabilité immédiate. Il bénéficie d’une mission officielle, mais doit composer avec budgets, territoire et coopération des autres services."
  },
  diplomate_administrateur: {
    daily: "Réunions, notes, négociations, droit pratique et représentation occupent un quotidien où une formulation peut engager une institution. Comprendre les intérêts derrière une procédure est essentiel.",
    place: "Le diplomate ou haut administrateur relie décision politique et exécution. Son pouvoir repose sur une délégation identifiable et sur la confiance de ceux qu’il représente."
  },
  hacker: {
    daily: "Repérage, intrusion, extraction et effacement de traces alternent avec la revente ou l’exploitation de l’information. Chaque cible combine défenses techniques, habitudes humaines et risques de représailles.",
    place: "Le Hacker fournit à la Pègre accès, données et levier de chantage. Il peut être membre, protégé ou simple prestataire ; cette position change ce que l’organisation attend de lui."
  },
  affairiste_bookmaker: {
    daily: "Comptes, paris, sociétés-écrans, dettes et renseignements doivent rester suffisamment cohérents pour circuler. Le travail se fait par rendez-vous, vérifications et négociations plus que par confrontation ouverte.",
    place: "L’Affairiste transforme argent gris et relations en ressources utilisables. Il relie activités légales et clandestines sans rendre les secondes légales pour autant."
  },
  ordre_arme: {
    daily: "Garde de lieux, escorte de responsables, protection de convois et entraînement structurent le service. Les règles de l’Ordre s’ajoutent aux lois du territoire où il intervient.",
    place: "Le membre d’un Ordre armé protège une institution religieuse et ses œuvres. Son statut dépend de cette organisation ; il n’acquiert pas une autorité publique générale."
  },
  clerc_holonet: {
    daily: "Production de contenus, modération, veille et réponse aux crises construisent une présence religieuse continue en ligne. Il faut comprendre à la fois doctrine, publics et fonctionnement des réseaux.",
    place: "Le Clerc Holonet porte une parole institutionnelle dans les espaces connectés. Sa visibilité peut être forte sans lui donner la direction doctrinale de toute sa communauté."
  },
  ministeriel: {
    daily: "Santé, ressources, enseignement, sciences ou infrastructures donnent au ministère un travail technique comparable à celui d’une administration spécialisée, mais organisé par une institution religieuse.",
    place: "Le Ministériel rend possibles les œuvres concrètes de sa communauté. Il répond à des responsables confessionnels tout en restant jugé sur une expertise professionnelle réelle."
  },
  clerc_administrateur: {
    daily: "Célébrations, accueil, médiation, gestion des équipes et entretien des ressources se mêlent. La parole publique ne représente qu’une partie d’un travail continu de cohésion.",
    place: "Le Clerc-administrateur donne une forme locale à l’institution. Son autorité dépend de la fonction reconnue par les fidèles et de la structure qui l’a mandaté."
  },
  missionnaire: {
    daily: "Le terrain impose polyvalence, déplacement et adaptation : écouter, distribuer, enseigner, négocier un hébergement ou installer un service minimal. Le soutien central peut être lointain.",
    place: "Le Missionnaire étend ou maintient une présence là où son institution est faible. Il représente celle-ci sans pouvoir promettre plus de moyens qu’elle n’est prête à engager."
  }
};

function navigation(
  id: string,
  title: string,
  subgroup: string,
  subgroupOrder: number,
  pageOrder: number
): NavigationEntry {
  return {
    id,
    dataset: "generated-builder",
    category: "Règles",
    group: "Réalité — Création & progression",
    groupOrder: 20,
    subgroup,
    subgroupOrder,
    pageOrder,
    displayTitle: title
  };
}

export function generatedBuilderReferenceCorpus() {
  const articles: Record<string, unknown>[] = [];
  const nav: NavigationEntry[] = [];

  const origins = terraUmbraCreationRules.origins as Record<string, { name?: string }>;
  const originLore = terraUmbraCreationLore.origin as Record<string, string>;
  Object.entries(BUILDER_ORIGIN_PAGE_IDS).forEach(([key, id], index) => {
    const label = String(origins[key]?.name ?? key);
    const title = `Origine — ${label}`;
    const editorial = originEditorial[key];
    if (!editorial || !originLore[key]) throw new Error(`Lore d’Origine manquant: ${key}`);
    articles.push(
      article(
        id,
        title,
        ["réalité", "création", "origine", key],
        [
          {
            id: "grandir-dans-ce-milieu",
            title: "Grandir dans ce milieu",
            paragraphs: [originLore[key]]
          },
          {
            id: "ce-que-cela-apprend",
            title: "Ce que cela apprend",
            paragraphs: [editorial.learned]
          },
          {
            id: "liens-et-tensions",
            title: "Liens et tensions",
            paragraphs: [editorial.tensions]
          }
        ]
      )
    );
    nav.push(navigation(id, title, "Origines", 20, 20 + index * 10));
  });

  const spheres = terraUmbraCreationRules.spheres as Record<
    string,
    { name?: string; originId?: string }
  >;
  const sphereLore = terraUmbraCreationLore.sphere as Record<string, string>;
  Object.entries(BUILDER_SPHERE_PAGE_IDS).forEach(([key, id], index) => {
    const label = String(spheres[key]?.name ?? key);
    const title = `Sphère — ${label}`;
    const editorial = sphereEditorial[key];
    if (!editorial || !sphereLore[key]) throw new Error(`Lore de Sphère manquant: ${key}`);
    articles.push(
      article(
        id,
        title,
        ["réalité", "création", "sphère", key],
        [
          {
            id: "place-dans-la-societe",
            title: "Place dans la société",
            paragraphs: [sphereLore[key]]
          },
          {
            id: "ce-que-la-sphere-offre-et-exige",
            title: "Ce que la Sphère offre et exige",
            paragraphs: [editorial.offers]
          },
          {
            id: "trajectoires",
            title: "Trajectoires",
            paragraphs: [editorial.paths]
          }
        ]
      )
    );
    nav.push(navigation(id, title, "Sphères", 30, 20 + index * 10));
  });

  const styles = terraUmbraCreationRules.styles as ReadonlyArray<{
    readonly id?: string;
    readonly name?: string;
    readonly sphere?: string;
  }>;
  const styleLore = terraUmbraCreationLore.style as Record<string, string>;
  let styleOrder = 20;
  for (const style of styles) {
    const styleId = String(style.id ?? "");
    const id = BUILDER_STYLE_PAGE_IDS[styleId];
    if (!id) continue;

    const label = String(style.name ?? styleId);
    const sphereKey = String(style.sphere ?? "");
    const sphereLabel = String(spheres[sphereKey]?.name ?? sphereKey);
    const title = `Style — ${label}`;
    const editorial = styleEditorial[styleId];
    if (!editorial || !styleLore[styleId]) throw new Error(`Lore de Style manquant: ${styleId}`);
    articles.push(
      article(
        id,
        title,
        ["réalité", "création", "style", sphereKey, styleId],
        [
          {
            id: "role-professionnel",
            title: "Rôle professionnel",
            paragraphs: [styleLore[styleId]]
          },
          {
            id: "quotidien-et-environnement",
            title: "Quotidien et environnement",
            paragraphs: [editorial.daily]
          },
          {
            id: "place-dans-la-sphere",
            title: "Place dans la Sphère",
            paragraphs: [editorial.place, `Ce Style appartient à la Sphère ${sphereLabel}. Les compétences, ressources et choix de création restent affichés directement depuis le Builder.`]
          }
        ]
      )
    );
    nav.push(navigation(id, title, "Styles", 40, styleOrder));
    styleOrder += 10;
  }

  return { articles, navigation: nav };
}
