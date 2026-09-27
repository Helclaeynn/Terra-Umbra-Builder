// The imported baseline preserves stable IDs, acquisition rules and all 67
// talents outside the author's approved 2026-09-27 revision.
import { terraUmbraCreationRules as baseline } from "./terra-umbra-creation-base.js";
import { reviseRealityTalent, REALITY_TALENT_REVISION_VERSION } from "./reality-talents-revision.js";

function reviseGroups<T extends Record<string, readonly {id:string;effect:string}[]>>(groups:T):T {
  return Object.fromEntries(Object.entries(groups).map(([id, talents])=>[id,talents.map(reviseRealityTalent)])) as T;
}

export const terraUmbraCreationRules = {
  ...baseline,
  sourceVersion: REALITY_TALENT_REVISION_VERSION,
  talents: {
    origin: reviseGroups(baseline.talents.origin),
    sphere: reviseGroups(baseline.talents.sphere),
    common: baseline.talents.common.map(reviseRealityTalent),
    expertise: baseline.talents.expertise.map(reviseRealityTalent)
  }
} as const;

export type TerraUmbraCreationRules = typeof terraUmbraCreationRules;
