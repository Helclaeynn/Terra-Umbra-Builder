import P0 from "./compendium-realite-v9-corporations-pnj-payload-0.js";
import P1 from "./compendium-realite-v9-corporations-pnj-payload-1.js";
import P2 from "./compendium-realite-v9-corporations-pnj-payload-2.js";
import P3 from "./compendium-realite-v9-corporations-pnj-payload-3.js";
import P4 from "./compendium-realite-v9-corporations-pnj-payload-4.js";
import P5 from "./compendium-realite-v9-corporations-pnj-payload-5.js";
import P6 from "./compendium-realite-v9-corporations-pnj-payload-6.js";
import P7 from "./compendium-realite-v9-corporations-pnj-payload-7.js";

const GROUPS = [
  P0,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7
] as Array<Array<Record<string, any>>>;

export const COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_ARTICLES = GROUPS.flat() as Array<Record<string, any>>;

export const COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_NAVIGATION = GROUPS.flatMap((items, familyIndex) =>
  items.map((article, articleIndex) => ({
    id: article.id,
    dataset: "realite-v9-corporations-pnj",
    category: "Personnages",
    group: "Corporations",
    groupOrder: 6,
    subgroup: String(article.pnj?.organisation ?? "Corporations"),
    subgroupOrder: familyIndex * 100 + articleIndex + 1,
    pageOrder: 1,
    displayTitle: article.title
  }))
) as Array<Record<string, any>>;
