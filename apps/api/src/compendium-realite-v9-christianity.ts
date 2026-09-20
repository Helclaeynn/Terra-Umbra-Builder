import { gunzipSync } from "node:zlib";
import P0 from "./compendium-realite-v9-christianity-payload-00.js";
import P1 from "./compendium-realite-v9-christianity-payload-01.js";
import P2 from "./compendium-realite-v9-christianity-payload-02.js";
import P3 from "./compendium-realite-v9-christianity-payload-03.js";

const PAYLOAD = JSON.parse(
  gunzipSync(Buffer.from(P0 + P1 + P2 + P3, "base64")).toString("utf8")
) as { articles: Array<Record<string, any>>; navigation: Array<Record<string, any>> };

export const COMPENDIUM_REALITE_V9_CHRISTIANITY_ARTICLES = PAYLOAD.articles;
export const COMPENDIUM_REALITE_V9_CHRISTIANITY_NAVIGATION = PAYLOAD.navigation;
