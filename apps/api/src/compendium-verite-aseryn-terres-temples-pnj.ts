import P0 from "./compendium-verite-aseryn-terres-temples-pnj-payload-0.js";
import P1 from "./compendium-verite-aseryn-terres-temples-pnj-payload-1.js";
import P2 from "./compendium-verite-aseryn-terres-temples-pnj-payload-2.js";
import P3 from "./compendium-verite-aseryn-terres-temples-pnj-payload-3.js";

export const COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_ARTICLES = [...P0, ...P1, ...P2, ...P3];

const SUBGROUP_ORDER: Record<string, number> = {"Atlantide":10,"Mû":20,"Lémurie":30,"Hyperborée":40,"Diaspora & Altéras":50,"Ordre Sépulcral":60,"Temple du Créateur":70,"Temple de l’Esprit":80,"Temple de l’Érosion":90,"Temple de la Fin":100,"Temple du Créateur — Mû":110,"Mû / Temple du Créateur":120};

export const COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_NAVIGATION =
  COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_ARTICLES.map((article) => {
    const subgroup = String(article.pnj?.source_group ?? "Aseryns");
    return {
      id: article.id,
      dataset: "verite-aseryns-terres-temples-pnj",
      category: "Personnages",
      group: "Personnages de Vérité",
      groupOrder: 45,
      subgroup: `Aseryns — ${subgroup}`,
      subgroupOrder: SUBGROUP_ORDER[subgroup] ?? 999,
      pageOrder: Number(article.pnj?.source_order ?? 0) + 1,
      displayTitle: article.title
    };
  });
