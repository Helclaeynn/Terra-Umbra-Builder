import P0 from "./compendium-verite-angelus-pnj-payload-0.js";
import P1 from "./compendium-verite-angelus-pnj-payload-1.js";
import P2 from "./compendium-verite-angelus-pnj-payload-2.js";

export const COMPENDIUM_VERITE_ANGELUS_PNJ_ARTICLES = [...P0, ...P1, ...P2];

const ORDER: Record<string, number> = {
  "Kether · Remiel": 10,
  "Kether · Metatron": 11,
  "Hokhma · Gabrielle": 20,
  "Hokhma · Manakielle": 21,
  "Bina · Barachiel": 30,
  "Bina · Razielle": 31,
  "Hesed · Raphael": 40,
  "Hesed · Tsadqiel": 41,
  "Gueburah · Michel": 50,
  "Gueburah · Selaphielle": 51,
  "Tiph’Ereth · Zophielle": 60,
  "Tiph’Ereth · Sachielle": 61,
  "Nesah · Azazel": 70,
  "Nesah · Hanaelle": 71,
  "Hod · Urielle": 80,
  "Hod · Sandalphon": 81,
  "Yessod · Camaelle": 90,
  "Yessod · Mebahel": 91,
  "Malkhouth · Azrael": 100,
  "Malkhouth · Muriel": 101,
  "Autres Angelus": 110
};

export const COMPENDIUM_VERITE_ANGELUS_PNJ_NAVIGATION =
  COMPENDIUM_VERITE_ANGELUS_PNJ_ARTICLES.map((article) => {
    const subgroup = String(article.pnj?.source_group ?? "Angelus");
    return {
      id: article.id,
      dataset: "verite-angelus-pnj",
      category: "Personnages",
      group: "Personnages de Vérité",
      groupOrder: 45,
      subgroup,
      subgroupOrder: ORDER[subgroup] ?? 119,
      pageOrder: Number(article.pnj?.source_order ?? 0) + 1,
      displayTitle: article.title
    };
  });
