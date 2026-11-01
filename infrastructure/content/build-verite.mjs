// Génère infrastructure/content/verite.sql : le paquet de règles de Vérité
// tel que l'API le sert aujourd'hui (rules/truth/rules.ts), sans rien changer
// à une fiche.
//
//   TUC_TRUTH_EQUIPMENT_SOURCE=compendium/source/verite-catalog-v6.json.gz.b64 \
//     node --import ./infrastructure/content/ts-register.mjs infrastructure/content/build-verite.mjs
//
// Portée « verite », des entrées de règle :
//   - « cadre » : PTV de départ, consciences, visibilité, révélations ;
//   - « nature_<id> » : choix et traits gratuits de chaque Nature ;
//   - « catalogue_<id> » : les talents de chaque Nature, complets et dans leur
//     ordre (les voies, cartes et coûts des lots s'y ajoutent depuis les
//     portées des Natures, rules/content-rules.ts) ;
//   - « corruption » : sources, préséance et talents de Corruption.
// Les objets de Vérité sont dans la portée « objets » (build-objets.mjs).
import { terraUmbraTruthRules as truth } from "../../apps/api/src/rules/truth/rules.ts";
import { ContentSet } from "./lib.mjs";

const set = new ContentSet("verite");
const { ptvInitial, consciousness, natures } = truth.structure;
set.entry("regle", "cadre", "Vérité : cadre", { ptvInitial, consciousness, visibility: truth.visibility, revelation: truth.revelation },
  { summary: "PTV de départ, consciences, visibilité et révélations." });

let position = 0;
for (const [id, nature] of Object.entries(natures)) {
  set.entry("regle", `nature_${id}`, `${nature.name} : structure`, { nature_id: id, structure: nature });
  set.relation(["regle", `nature_${id}`], ["regle", "cadre"], "appartient_a", ++position);
}
for (const [id, talents] of Object.entries(truth.catalogs)) {
  set.entry("regle", `catalogue_${id}`, `${natures[id]?.name ?? id} : talents`, { nature_id: id, talents });
  set.relation(["regle", `catalogue_${id}`], ["regle", "cadre"], "appartient_a", ++position);
}
set.entry("regle", "corruption", "Corruption", { ...truth.corruption });

set.write("build-verite.mjs", "./verite.sql");
const talents = Object.values(truth.catalogs).reduce((n, list) => n + list.length, 0);
console.log(`verite.sql : ${Object.keys(natures).length} Natures, ${talents} talents, ${truth.corruption.talents.length} talents de Corruption.`);
