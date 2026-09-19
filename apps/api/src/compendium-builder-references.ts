import { terraUmbraCreationRules } from "./rules/terra-umbra-creation.js";

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
  text: string
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
    sections: [
      {
        id: "builder-reference",
        title: "Référence de création",
        level: 2,
        blocks: [introBlock(text)]
      }
    ]
  };
}

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
  Object.entries(BUILDER_ORIGIN_PAGE_IDS).forEach(([key, id], index) => {
    const label = String(origins[key]?.name ?? key);
    const title = `Origine — ${label}`;
    articles.push(
      article(
        id,
        title,
        ["réalité", "création", "origine", key],
        `Cette page documente l’Origine ${label} utilisée lors de la création de personnage. Les données mécaniques affichées ici proviennent directement du catalogue canonique du Builder ; le texte encyclopédique peut être enrichi sans dupliquer ces valeurs.`
      )
    );
    nav.push(navigation(id, title, "Origines", 20, 20 + index * 10));
  });

  const spheres = terraUmbraCreationRules.spheres as Record<
    string,
    { name?: string; originId?: string }
  >;
  Object.entries(BUILDER_SPHERE_PAGE_IDS).forEach(([key, id], index) => {
    const label = String(spheres[key]?.name ?? key);
    const title = `Sphère — ${label}`;
    articles.push(
      article(
        id,
        title,
        ["réalité", "création", "sphère", key],
        `Cette page documente la Sphère ${label} du Builder. Son appui et ses compétences fixes restent des données canoniques en lecture seule ; le Compendium porte le contexte, les exemples et les développements encyclopédiques.`
      )
    );
    nav.push(navigation(id, title, "Sphères", 30, 20 + index * 10));
  });

  const styles = terraUmbraCreationRules.styles as Array<{
    id?: string;
    name?: string;
    sphere?: string;
  }>;
  let styleOrder = 20;
  for (const style of styles) {
    const styleId = String(style.id ?? "");
    const id = BUILDER_STYLE_PAGE_IDS[styleId];
    if (!id) continue;

    const label = String(style.name ?? styleId);
    const sphereKey = String(style.sphere ?? "");
    const sphereLabel = String(spheres[sphereKey]?.name ?? sphereKey);
    const title = `Style — ${label}`;
    articles.push(
      article(
        id,
        title,
        ["réalité", "création", "style", sphereKey, styleId],
        `Cette page documente le Style ${label} de la Sphère ${sphereLabel}. Les compétences, familles d’expertise, Train de vie et ressources de création restent alimentés par le Builder ; la page peut développer librement le contexte du Style sans créer une seconde source mécanique.`
      )
    );
    nav.push(navigation(id, title, "Styles", 40, styleOrder));
    styleOrder += 10;
  }

  return { articles, navigation: nav };
}
