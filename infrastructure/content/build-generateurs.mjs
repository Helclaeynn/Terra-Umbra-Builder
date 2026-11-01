// Génère infrastructure/content/generateurs.sql : les listes d'ambiance du
// générateur de PNJ (apps/api/src/npc-flavor.ts, npc-identities.ts), telles
// qu'il les utilise aujourd'hui.
//
//   node --import ./infrastructure/content/ts-register.mjs infrastructure/content/build-generateurs.mjs
//
// Portée « generateurs », une règle par liste. Les réglages de calcul des
// générateurs (rangs, statistiques, armes du bestiaire) restent dans le code :
// ce sont des formules, pas du contenu.
import { NPC_FIRST_NAMES, NPC_LAST_NAMES, NPC_APPEARANCE, NPC_PERSONALITY, NPC_MOTIVATIONS, NPC_HOOKS } from "../../apps/api/src/npc-flavor.ts";
import { NPC_NATIONALITIES } from "../../apps/api/src/npc-identities.ts";
import { ContentSet } from "./lib.mjs";

const set = new ContentSet("generateurs");
const lists = [
  ["pnj_prenoms", "PNJ : prénoms", NPC_FIRST_NAMES],
  ["pnj_noms", "PNJ : noms de famille", NPC_LAST_NAMES],
  ["pnj_nationalites", "PNJ : nationalités et leurs noms", NPC_NATIONALITIES],
  ["pnj_apparence", "PNJ : apparence", NPC_APPEARANCE],
  ["pnj_personnalite", "PNJ : personnalité", NPC_PERSONALITY],
  ["pnj_motivations", "PNJ : motivations", NPC_MOTIVATIONS],
  ["pnj_accroches", "PNJ : secrets et accroches", NPC_HOOKS]
];
for (const [slug, title, value] of lists) set.entry("regle", slug, title, { valeurs: value });
set.write("build-generateurs.mjs", "./generateurs.sql");
console.log(`generateurs.sql : ${lists.length} listes du générateur de PNJ.`);
