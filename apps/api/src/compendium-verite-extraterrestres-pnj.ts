import P0 from "./compendium-verite-extraterrestres-pnj-payload-0.js";
import P1 from "./compendium-verite-extraterrestres-pnj-payload-1.js";
import P2 from "./compendium-verite-extraterrestres-pnj-payload-2.js";
import P3 from "./compendium-verite-extraterrestres-pnj-payload-3.js";
import { editorializeExtraterrestresPnj } from "./compendium-verite-extraterrestres-pnj-editorial.js";

export const COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES = editorializeExtraterrestresPnj([...P0, ...P1, ...P2, ...P3]);

const GROUP_ORDER: Record<string, number> = {
  "Talass": 10,
  "Mo’sens": 20,
  "Baséanhs": 30,
  "Rocréens": 40,
  "Thalsios": 50,
  "Autres": 60
};

export const COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_NAVIGATION = COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES.map((article) => {
  const subgroup = String(article.pnj?.source_group ?? "Autres");
  return {
    id: article.id,
    dataset: "verite-extraterrestres-pnj",
    category: "Personnages",
    group: "Personnages de Vérité",
    groupOrder: 45,
    subgroup,
    subgroupOrder: GROUP_ORDER[subgroup] ?? 99,
    pageOrder: Number(article.pnj?.source_order ?? 0) + 1,
    displayTitle: article.title
  };
});
