import { gunzipSync } from "node:zlib";
import P0 from "./compendium-realite-v9-religion-pnj-payload-0.js";
import R0 from "./compendium-realite-v9-religion-pnj-repair-00.js";
import R1 from "./compendium-realite-v9-religion-pnj-repair-01.js";
import R2 from "./compendium-realite-v9-religion-pnj-repair-02.js";
import R3 from "./compendium-realite-v9-religion-pnj-repair-03.js";
import R4 from "./compendium-realite-v9-religion-pnj-repair-04.js";
import R5 from "./compendium-realite-v9-religion-pnj-repair-05.js";
import R6 from "./compendium-realite-v9-religion-pnj-repair-06.js";
import R7 from "./compendium-realite-v9-religion-pnj-repair-07.js";

// Source: TUC_organisations_religions(1).docx.
// Portraits are matched by PNJ name; MJ and statistical sections remain intentionally empty.
const PAYLOAD = JSON.parse(
  gunzipSync(Buffer.from(P0 + R0 + R1 + R2 + R3 + R4 + R5 + R6 + R7, "base64")).toString("utf8")
) as { articles: Array<Record<string, any>>; navigation: Array<Record<string, any>> };

export const COMPENDIUM_REALITE_V9_RELIGION_PNJ_ARTICLES = PAYLOAD.articles;
export const COMPENDIUM_REALITE_V9_RELIGION_PNJ_NAVIGATION = PAYLOAD.navigation;
