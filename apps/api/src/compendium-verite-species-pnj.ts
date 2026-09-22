import P0 from "./compendium-verite-species-pnj-payload-0.js";
import P1 from "./compendium-verite-species-pnj-payload-1.js";
import P2 from "./compendium-verite-species-pnj-payload-2.js";
import { editorializeSpeciesPnj } from "./compendium-verite-species-pnj-editorial.js";

// Source: TUC_Vérité_ les espèces  surnaturelles(1).docx.
// Active profiles are recreated independently from archived PNJs.
// Informations MJ and Statistiques are intentionally empty for a later consolidation pass.
// Complete source Truth extracts remain preserved in pnj.source_verite/source_extract.
export const COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES = editorializeSpeciesPnj([...P0, ...P1, ...P2]);

const SUBGROUP_ORDER: Record<string, number> = {
  "Vampires": 10,
  "Loups-garous": 20,
  "Mages": 30,
  "Atlantes": 40,
  "Daemons": 50,
  "Angelus": 60,
  "Autres créatures": 70
};

export const COMPENDIUM_VERITE_SPECIES_PNJ_NAVIGATION = COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES.map((article) => {
  const subgroup = String(article.pnj?.source_group ?? "Vérité");
  return {
    id: article.id,
    dataset: "verite-species-pnj",
    category: "Personnages",
    group: "Personnages de Vérité",
    groupOrder: 45,
    subgroup,
    subgroupOrder: SUBGROUP_ORDER[subgroup] ?? 99,
    pageOrder: Number(article.pnj?.source_order ?? 0) + 1,
    displayTitle: article.title
  };
});
