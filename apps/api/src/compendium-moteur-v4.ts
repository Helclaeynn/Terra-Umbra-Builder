import { COMPENDIUM_MOTEUR_V4_ARTICLES as baseline } from "./compendium-moteur-v4-base.js";
import { renownSections } from "./rules/renown-rules.js";

// Keep article IDs and the two existing Renommée anchors stable for wiki links.
export const COMPENDIUM_MOTEUR_V4_ARTICLES = baseline.map(article =>
  article.id !== "regles-profil-valeurs-derivees-statut" ? article : {
    ...article,
    source: article.source + " · Renommée : arbitrages auteurs 2026-09-27",
    sections: [
      ...article.sections.filter(section => !["renommee","renommee-reputation"].includes(section.id)),
      ...renownSections
    ]
  }
);
export { COMPENDIUM_MOTEUR_V4_NAVIGATION } from "./compendium-moteur-v4-base.js";
