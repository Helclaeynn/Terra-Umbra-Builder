import { truthRuntimeStructure } from "./runtime-structure.js";
import { truthCatalogHumain } from "./catalog-humain.js";
import { truthCatalogVampire } from "./catalog-vampire.js";
import { truthCatalogGarou } from "./catalog-garou.js";
import { truthCatalogKhinae } from "./catalog-khinae.js";
import { truthCatalogMage } from "./catalog-mage.js";
import { truthCatalogDaemon } from "./catalog-daemon.js";
import { truthCatalogAngelus } from "./catalog-angelus.js";
import { truthCatalogAseryn } from "./catalog-aseryn.js";
import { truthCatalogExile } from "./catalog-exile.js";
import { truthCatalogExtral } from "./catalog-extral.js";
import { truthVisibilityNeedles, truthSharedHunterNatures } from "./visibility.js";
import { truthRevelationRules } from "./revelation.js";

export const terraUmbraTruthRules = {
  structure: truthRuntimeStructure,
  catalogs: {
    humain: truthCatalogHumain,
    vampire: truthCatalogVampire,
    garou: truthCatalogGarou,
    khinae: truthCatalogKhinae,
    mage: truthCatalogMage,
    daemon: truthCatalogDaemon,
    angelus: truthCatalogAngelus,
    aseryn: truthCatalogAseryn,
    exile: truthCatalogExile,
    extral: truthCatalogExtral
  },
  visibility: {
    needles: truthVisibilityNeedles,
    sharedHunterNatures: truthSharedHunterNatures
  },
  revelation: truthRevelationRules
} as const;

export type TerraUmbraTruthRules = typeof terraUmbraTruthRules;
