import { gunzipSync } from "node:zlib";
import P0 from "./compendium-realite-v9-religions-payload-0.js";
import P1 from "./compendium-realite-v9-religions-payload-1.js";
import P2 from "./compendium-realite-v9-religions-payload-2.js";

// Sources: TUC_organisations_religions(1).docx.
// Christianity is consolidated against Eglise chrétiennne TUC(2).pdf, the priority source.
// The Moon movement is the user-approved fictional branch specific to this setting.
const PAYLOAD = JSON.parse(
  gunzipSync(Buffer.from(P0 + P1 + P2, "base64")).toString("utf8")
) as { articles: Array<Record<string, any>>; navigation: Array<Record<string, any>> };

export const COMPENDIUM_REALITE_V9_RELIGION_ARTICLES = PAYLOAD.articles;
export const COMPENDIUM_REALITE_V9_RELIGION_NAVIGATION = PAYLOAD.navigation;
