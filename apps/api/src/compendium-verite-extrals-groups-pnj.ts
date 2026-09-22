import P0 from "./compendium-verite-extrals-groups-pnj-payload-0.js";
import P1 from "./compendium-verite-extrals-groups-pnj-payload-1.js";
import P2 from "./compendium-verite-extrals-groups-pnj-payload-2.js";
import P3 from "./compendium-verite-extrals-groups-pnj-payload-3.js";
import { editorializeExtralsGroupsPnj } from "./compendium-verite-extrals-groups-pnj-editorial.js";

export const COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_ARTICLES = editorializeExtralsGroupsPnj([...P0, ...P1, ...P2, ...P3]);

const ORDER: Record<string, number> = {
  "GAAC": 10,
  "CTU": 20,
  "Émeraude Sanglante": 30,
  "R.E.P.T.I.L.E.": 40,
  "Mafia Shaediri": 50,
  "SMRC": 60,
  "Hydroguard": 70,
  "Autres groupes extrals": 80
};

export const COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_NAVIGATION =
  COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_ARTICLES
    .filter((article) => article.audience !== "mj")
    .map((article) => {
      const subgroup = String(article.pnj?.source_group ?? "Extrals");
      return {
        id: article.id,
        dataset: "verite-extrals-groupes-pnj",
        category: "Personnages",
        group: "Personnages de Vérité",
        groupOrder: 45,
        subgroup,
        subgroupOrder: ORDER[subgroup] ?? 99,
        pageOrder: Number(article.pnj?.source_order ?? 0) + 1,
        displayTitle: article.title
      };
    });
