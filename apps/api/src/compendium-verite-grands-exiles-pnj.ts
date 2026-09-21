import P0 from "./compendium-verite-grands-exiles-pnj-payload-0.js";
import P1 from "./compendium-verite-grands-exiles-pnj-payload-1.js";
import P2 from "./compendium-verite-grands-exiles-pnj-payload-2.js";
import P3 from "./compendium-verite-grands-exiles-pnj-payload-3.js";

export const COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_ARTICLES = [...P0, ...P1, ...P2, ...P3];
const SUBGROUP_ORDER: Record<string, number> = {"Conseil des Anciens":10,"Syndicat de Jade":20,"Chasse Fantastique":30,"Croix d’Emphyrra":40,"Hordes orques":50,"Enfants de Nidavellir":60,"Ligue des Quatre Empereurs":70,"Cercle Écarlate":80,"Autres factions":90};
export const COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_NAVIGATION =
  COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_ARTICLES.map((article, index) => {
    const subgroup = String(article.pnj?.source_group ?? "Exilés");
    return {
      id: article.id,
      dataset: "verite-grands-exiles-pnj",
      category: "Personnages",
      group: "Personnages de Vérité",
      groupOrder: 45,
      subgroup: `Exilés — ${subgroup}`,
      subgroupOrder: SUBGROUP_ORDER[subgroup] ?? 999,
      pageOrder: Number(article.pnj?.source_pages?.[0] ?? 0) * 100 + index,
      displayTitle: article.title
    };
  });
