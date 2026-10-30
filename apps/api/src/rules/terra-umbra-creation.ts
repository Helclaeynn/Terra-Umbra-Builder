// Preserve stable IDs, acquisition rules and the 67 talents outside this revision.
import { terraUmbraCreationRules as baseline } from "./terra-umbra-creation-base.js";
import { reviseRealityTalent, REALITY_TALENT_REVISION_VERSION } from "./reality-talents-revision.js";

function reviseGroups<T extends Record<string, readonly {id:string;effect:string}[]>>(groups:T):T {
  // Only effect values change; every group key, tuple member and metadata field survives.
  return Object.fromEntries(Object.entries(groups).map(([id, talents])=>[id,talents.map(reviseRealityTalent)])) as unknown as T;
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
