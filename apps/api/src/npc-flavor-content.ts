// Listes d'ambiance du générateur de PNJ lues dans les tables de contenu
// (portée « generateurs », infrastructure/content/build-generateurs.mjs).
// Actif seulement si CONTENT_SOURCE=db. Les générateurs gardent leurs objets
// importés : on en remplace le contenu, et on revient au code si la base est vide.
import { pool } from "./db.js";
import { contentRulesEnabled } from "./rules/content-rules.js";
import { refreshNpcVariety } from "./campaign-npc-generator.js";
import { NPC_APPEARANCE, NPC_FIRST_NAMES, NPC_HOOKS, NPC_LAST_NAMES, NPC_MOTIVATIONS, NPC_PERSONALITY } from "./npc-flavor.js";
import { NPC_NATIONALITIES } from "./npc-identities.js";

const targets: Record<string, any> = {
  pnj_prenoms: NPC_FIRST_NAMES,
  pnj_noms: NPC_LAST_NAMES,
  pnj_nationalites: NPC_NATIONALITIES,
  pnj_apparence: NPC_APPEARANCE,
  pnj_personnalite: NPC_PERSONALITY,
  pnj_motivations: NPC_MOTIVATIONS,
  pnj_accroches: NPC_HOOKS
};
const pristine = structuredClone(targets);

function replace(target: any, next: any) {
  if (Array.isArray(target)) {
    target.splice(0, target.length, ...next);
    return;
  }
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, next);
}

export async function loadNpcFlavorContent() {
  if (!contentRulesEnabled()) return;
  const { rows } = await pool.query<{ slug: string; fields: { valeurs?: unknown } }>(
    "SELECT slug, fields FROM content_entry WHERE scope = 'generateurs' AND type = 'regle' AND status = 'published'"
  );
  const found = new Map(rows.map((row) => [row.slug, row.fields.valeurs]));
  for (const [slug, target] of Object.entries(targets)) {
    const value = found.get(slug);
    const usable = Array.isArray(target) ? Array.isArray(value) && value.length > 0 : value && typeof value === "object" && !Array.isArray(value);
    replace(target, structuredClone(usable ? value : pristine[slug]));
  }
  refreshNpcVariety();
}
