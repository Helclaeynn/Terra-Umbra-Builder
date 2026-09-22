import P0 from "./compendium-verite-fantastiques-pnj-payload-0.js";
import P1 from "./compendium-verite-fantastiques-pnj-payload-1.js";
import P2 from "./compendium-verite-fantastiques-pnj-payload-2.js";
import { editorializeFantastiquesPnj } from "./compendium-verite-fantastiques-pnj-editorial.js";

export const COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES = editorializeFantastiquesPnj([...P0, ...P1, ...P2]);

const SUBGROUP_ORDER: Record<string, number> = {
  "Elyë": 10, "Whurtens": 20, "Ashylls": 30, "Thulkars": 40,
  "Azménoriens": 50, "Nareysvors": 60, "Autres créatures": 70
};

export const COMPENDIUM_VERITE_FANTASTIQUES_PNJ_NAVIGATION = COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES.map((article) => {
  const subgroup = String(article.pnj?.source_group ?? "Exilés");
  return {
    id: article.id, dataset: "verite-fantastiques-pnj", category: "Personnages",
    group: "Personnages de Vérité", groupOrder: 45, subgroup,
    subgroupOrder: SUBGROUP_ORDER[subgroup] ?? 99,
    pageOrder: Number(article.pnj?.source_order ?? 0) + 1,
    displayTitle: article.title
  };
});
