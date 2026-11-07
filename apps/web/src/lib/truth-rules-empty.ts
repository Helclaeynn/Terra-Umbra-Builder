// Remplace, dans le site seulement, les catalogues de Vérité du code (truth/core-rules.ts, ~1,5 Mo) :
// le navigateur reçoit les règles de l'API (/api/rulesets/terra-umbra/truth) et les verse avec useTruthRules.
import { truthVisibilityNeedles, truthSharedHunterNatures } from "../../../api/src/rules/truth/visibility";
import { truthRevelationRules } from "../../../api/src/rules/truth/revelation";

const none: never[] = [];
export const truthCoreRules = {
  structure: { ptvInitial: 0, consciousness: none, natures: {} },
  catalogs: { humain: none, vampire: none, garou: none, khinae: none, mage: none, daemon: none, angelus: none, aseryn: none, exile: none, extral: none },
  visibility: { needles: truthVisibilityNeedles, sharedHunterNatures: truthSharedHunterNatures },
  revelation: truthRevelationRules
};
