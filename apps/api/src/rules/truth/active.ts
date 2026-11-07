// Règles de Vérité de la fiche en partie (live-*, play-truth), partagées par le
// serveur et le navigateur : sans dépendance au serveur. Ce sont d'abord les
// catalogues du code ; le serveur y verse les règles lues dans la base
// (truth-content.ts), le navigateur celles que l'API lui sert
// (/api/rulesets/terra-umbra/truth). Lire les champs à chaque appel : ils
// changent quand le contenu est modifié.
import { truthCoreRules } from "./core-rules.js";

type Rules = { -readonly [K in keyof typeof truthCoreRules]: (typeof truthCoreRules)[K] };
export const activeTruthRules: Rules = { ...truthCoreRules };

export function useTruthRules(next: Partial<Record<keyof Rules, unknown>> | null | undefined) {
  if (!next) return;
  for (const key of Object.keys(truthCoreRules) as (keyof Rules)[]) {
    if (next[key]) (activeTruthRules as Record<string, unknown>)[key] = next[key];
  }
}
