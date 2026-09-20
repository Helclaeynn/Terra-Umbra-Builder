import { gunzipSync } from "node:zlib";
import P0 from "./compendium-realite-v9-religion-pnj-payload-0.js";
import P1 from "./compendium-realite-v9-religion-pnj-payload-1.js";
import P2 from "./compendium-realite-v9-religion-pnj-payload-2.js";

// Source: TUC_organisations_religions(1).docx.
// Portraits reuse the existing TUC-Index-PNJ assets.
// MJ and statistical sections are intentionally present but empty for later consolidation.
const PAYLOAD = JSON.parse(
  gunzipSync(Buffer.from(P0 + P1 + P2, "base64")).toString("utf8")
) as { articles: Array<Record<string, any>>; navigation: Array<Record<string, any>> };

export const COMPENDIUM_REALITE_V9_RELIGION_PNJ_ARTICLES = PAYLOAD.articles;
export const COMPENDIUM_REALITE_V9_RELIGION_PNJ_NAVIGATION = PAYLOAD.navigation;
