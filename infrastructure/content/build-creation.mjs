// Génère infrastructure/content/creation.sql : les règles de création de
// Réalité, telles que l'API les sert aujourd'hui (rules/terra-umbra-*.ts),
// sans rien changer à une fiche.
//
//   node --import ./infrastructure/content/ts-register.mjs infrastructure/content/build-creation.mjs
//
// Portée « creation » :
//   - regle « cadre » : attributs, compétences, points de création, Origines, Sphères ;
//   - style (25) : un Style par entrée, dans l'ordre du Builder ;
//   - regle « talents » : place et mécanique des 122 talents de Réalité (Origine,
//     Sphère, communs, expertises). Leur nom et leur texte restent dans les
//     entrées talent_realite (portée « realite », build-realite.mjs) ;
//   - desavantage (55) : slug « groupe.identifiant » (un même désavantage peut
//     figurer dans deux groupes) ;
//   - regle « edge », « aides » (textes d'aide du Builder, choix des talents,
//     talents liés aux compétences) et « desavantages_aides ».
import { terraUmbraCreationRules as rules } from "../../apps/api/src/rules/terra-umbra-creation.ts";
import {
  terraUmbraCreationLore as lore,
  terraUmbraTalentChoiceSpecs as choices,
  terraUmbraRealitySkillTalentMap as skillMap
} from "../../apps/api/src/rules/terra-umbra-creation-lore.ts";
import {
  terraUmbraDisadvantages as disadvantages,
  terraUmbraDisadvantageLore as disadvantageLore,
  terraUmbraEdgeRules as edge
} from "../../apps/api/src/rules/terra-umbra-disadvantages-edge.ts";
import { ContentSet } from "./lib.mjs";

const set = new ContentSet("creation");
const { attributes, skills, creation, origins, spheres, id, name, sourceVersion } = rules;
set.entry("regle", "cadre", "Création de personnage", { id, name, sourceVersion, attributes, skills, creation, origins, spheres },
  { summary: "Attributs, compétences, points de création, Origines et Sphères." });

rules.styles.forEach((style, index) => {
  const { id: slug, name: title, ...fields } = style;
  set.entry("style", slug, title, fields);
  set.relation(["style", slug], ["regle", "cadre"], "appartient_a", index + 1);
});

// Mécanique seule : nom et texte viennent des entrées talent_realite.
const mechanics = ({ name: _name, effect: _effect, ...rest }) => rest;
const groups = (byKey) => Object.fromEntries(Object.entries(byKey).map(([key, list]) => [key, list.map(mechanics)]));
set.entry("regle", "talents", "Talents de Réalité : place et mécanique", {
  origin: groups(rules.talents.origin),
  sphere: groups(rules.talents.sphere),
  common: rules.talents.common.map(mechanics),
  expertise: rules.talents.expertise.map(mechanics),
  // Repli si une entrée talent_realite manque : jamais de talent sans nom.
  textes: Object.fromEntries([
    ...Object.values(rules.talents.origin).flat(), ...Object.values(rules.talents.sphere).flat(),
    ...rules.talents.common, ...rules.talents.expertise
  ].map((t) => [t.id, { name: t.name, effect: t.effect }]))
});

let position = 0;
const addDisadvantage = (path, item) => {
  const slug = `${path}.${item.id}`;
  const { name: title, ...fields } = item;
  set.entry("desavantage", slug, title, { groupe: path, ...fields });
  set.relation(["desavantage", slug], ["regle", "edge"], "appartient_a", ++position);
};
disadvantages.common.forEach((item) => addDisadvantage("common", item));
disadvantages.attribute.forEach((item) => addDisadvantage("attribute", item));
for (const [sphere, list] of Object.entries(disadvantages.sphere)) list.forEach((item) => addDisadvantage(`sphere.${sphere}`, item));

set.entry("regle", "edge", "Edge et désavantages", { edge });
set.entry("regle", "aides", "Textes d'aide de la création", { lore, choices, skillMap });
set.entry("regle", "desavantages_aides", "Textes d'aide des désavantages", { lore: disadvantageLore });

const count = (type) => set.entries.filter((e) => e.type === type).length;
set.write("build-creation.mjs", "./creation.sql");
console.log(`creation.sql : ${count("style")} styles, ${count("desavantage")} désavantages, ${count("regle")} règles.`);
