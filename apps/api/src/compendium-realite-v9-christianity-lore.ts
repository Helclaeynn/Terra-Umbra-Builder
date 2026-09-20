import { gunzipSync } from "node:zlib";
import P0 from "./compendium-realite-v9-christianity-lore-payload-00.js";
import P1 from "./compendium-realite-v9-christianity-lore-payload-01.js";
import P2 from "./compendium-realite-v9-christianity-lore-payload-02.js";

export const COMPENDIUM_REALITE_V9_CHRISTIANITY_LORE_ARTICLE = JSON.parse(
  gunzipSync(Buffer.from(P0 + P1 + P2, "base64")).toString("utf8")
) as Record<string, any>;
