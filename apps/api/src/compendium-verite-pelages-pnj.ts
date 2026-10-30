import P0 from "./compendium-verite-pelages-pnj-payload-0.js";
import P1 from "./compendium-verite-pelages-pnj-payload-1.js";
import { editorializePelagesPnj } from "./compendium-verite-pelages-pnj-editorial.js";

export const COMPENDIUM_VERITE_PELAGES_PNJ_ARTICLES = editorializePelagesPnj([...P0, ...P1]);

const ORDER: Record<string, number> = {
  "Pelages blancs": 10,
  "Pelages noirs": 20,
  "Pelages gris": 30,
  "Pelages dorés": 40,
  "Pelages bruns": 50,
  "Pelages roux": 60,
  "Autres Pelages": 70
};

export const COMPENDIUM_VERITE_PELAGES_PNJ_NAVIGATION =
  COMPENDIUM_VERITE_PELAGES_PNJ_ARTICLES.map((article) => ({
    id: article.id,
    dataset: "verite-pelages-pnj",
    category: "Personnages",
    group: "Personnages de Vérité",
    groupOrder: 45,
    subgroup: String(article.pnj?.source_group ?? "Pelages"),
    subgroupOrder: ORDER[String(article.pnj?.source_group ?? "")] ?? 99,
    pageOrder: Number(article.pnj?.source_order ?? 0) + 1,
    displayTitle: article.title
  }));
