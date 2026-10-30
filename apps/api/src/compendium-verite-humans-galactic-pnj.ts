import P0 from "./compendium-verite-humans-galactic-pnj-payload-0.js";
import P1 from "./compendium-verite-humans-galactic-pnj-payload-1.js";
import P2 from "./compendium-verite-humans-galactic-pnj-payload-2.js";
import { editorializeHumansGalacticPnj } from "./compendium-verite-humans-galactic-pnj-editorial.js";

export const COMPENDIUM_VERITE_HUMAN_GALACTIC_PNJ_ARTICLES = editorializeHumansGalacticPnj([...P0, ...P1, ...P2]);

const ORDER: Record<string, number> = {
  "AIDH": 10,
  "G-Corporations & Corp’+": 20,
  "Inquisition galactique": 30,
  "Autres organisations humaines": 40
};

export const COMPENDIUM_VERITE_HUMAN_GALACTIC_PNJ_NAVIGATION =
  COMPENDIUM_VERITE_HUMAN_GALACTIC_PNJ_ARTICLES
    .filter((article) => article.audience !== "mj")
    .map((article) => {
      const subgroup = String(article.pnj?.source_group ?? "Humanité galactique");
      return {
        id: article.id,
        dataset: "verite-humains-galactiques-pnj",
        category: "Personnages",
        group: "Personnages de Vérité",
        groupOrder: 45,
        subgroup,
        subgroupOrder: ORDER[subgroup] ?? 99,
        pageOrder: Number(article.pnj?.source_order ?? 0) + 1,
        displayTitle: article.title
      };
    });
