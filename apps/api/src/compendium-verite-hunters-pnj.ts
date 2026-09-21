import P0 from "./compendium-verite-hunters-pnj-payload-0.js";
import P1 from "./compendium-verite-hunters-pnj-payload-1.js";
import P2 from "./compendium-verite-hunters-pnj-payload-2.js";
import P3 from "./compendium-verite-hunters-pnj-payload-3.js";
import P4 from "./compendium-verite-hunters-pnj-payload-4.js";
import P5 from "./compendium-verite-hunters-pnj-payload-5.js";

export const COMPENDIUM_VERITE_HUNTERS_PNJ_ARTICLES = [...P0, ...P1, ...P2, ...P3, ...P4, ...P5];

const SUBGROUP_ORDER: Record<string, number> = {"Association":10,"Xenoshield":20,"Chasseurs chrétiens":30,"Chasseurs musulmans":40,"Chasseurs hindouistes":50,"Chasseurs shientaoïstes":60,"Chasseurs kabbalistes":70,"Confréries":80,"Chasseurs extraterrestres":90,"Chasseurs fantastiques":100,"Chasseurs surnaturels":110};

export const COMPENDIUM_VERITE_HUNTERS_PNJ_NAVIGATION = COMPENDIUM_VERITE_HUNTERS_PNJ_ARTICLES.map((article) => {
  const subgroup = String(article.pnj?.source_group ?? "Chasseurs");
  return {
    id: article.id,
    dataset: "verite-hunters-pnj",
    category: "Personnages",
    group: "Personnages de Vérité",
    groupOrder: 45,
    subgroup,
    subgroupOrder: SUBGROUP_ORDER[subgroup] ?? 999,
    pageOrder: Number(article.pnj?.source_order ?? 0) + 1,
    displayTitle: article.title
  };
});
