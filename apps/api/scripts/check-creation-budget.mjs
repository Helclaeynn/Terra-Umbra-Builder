// Contrôle des budgets de création par le serveur (src/rules/creation-check.ts).
import assert from "node:assert/strict";
import { creationBudgetViolations, newBudgetViolations } from "../dist/rules/creation-check.js";
import { terraUmbraCreationRules as rules } from "../dist/rules/terra-umbra-creation.js";
import { terraUmbraEdgeRules as edgeRules } from "../dist/rules/terra-umbra-disadvantages-edge.js";
import { blankCharacterData } from "../dist/character-data.js";

const codes = (data, reality = null) => creationBudgetViolations(data, rules, edgeRules, reality).map((v) => v.code);
const blank = () => structuredClone(blankCharacterData("Essai"));

assert.deepEqual(codes(blank()), [], "Fiche vierge : rien à refuser (incomplet n'est pas dépassé)");

const full = blank();
full.creation = { origin: rules.styles[0].sphere, sphere: rules.styles[0].sphere, style: rules.styles[0].id };
Object.assign(full.attributes, { vigueur: 7, agilite: 5, esprit: 4, volonte: 3, charisme: 3 });
assert.deepEqual(codes(full), [], "22 points d'Attribut : dans le budget");
full.attributes.charisme = 4;
assert.ok(codes(full).includes("attribute_budget"), "23 points refusés");
full.attributes.charisme = 3;
full.attributes.vigueur = 8;
assert.ok(codes(full).includes("attribute_bounds:vigueur"), "Attribut au-dessus du maximum");
full.attributes.vigueur = 7;

const styleSkill = rules.styles[0].skills[0];
full.skills[styleSkill].style = 3;
assert.ok(codes(full).includes(`style_per_skill:${styleSkill}`), "Plus de 2 points de Style dans une Compétence");
full.skills[styleSkill].style = 2;
const other = rules.skills.map((s) => s.id).find((id) => !rules.styles[0].skills.includes(id));
full.skills[other].style = 1;
assert.ok(codes(full).includes(`style_skill:${other}`), "Points de Style hors du Style");
full.skills[other].style = 0;
full.skills[other].free = 6;
assert.ok(codes(full).includes(`skill_raw:${other}`), "Brut au-dessus de 5");
full.skills[other].free = 0;

full.edge.cashPacks = 3; full.edge.skillPacks = 3;
assert.ok(codes(full).includes("edge_budget"), "6 Edge dépensés pour 5");
full.disadvantages = ["impulsif"];
assert.ok(!codes(full).includes("edge_budget"), "Un Désavantage rapporte 1 Edge");
full.edge.cashPacks = 4;
assert.ok(codes(full).includes("edge_option:cashPacks"), "Option Edge au-delà de son maximum");
full.edge.cashPacks = 0; full.edge.skillPacks = 0; full.disadvantages = [];

const reality = { equipment: [{ id: "cher", price: 1_000_000, priceMin: null, vehicle: false }], augmentations: [], economy: { unusedEnvelopeRefundRate: 0.5 } };
full.reality.equipment = [{ itemId: "cher" }];
assert.ok(codes(full, reality).includes("account_negative"), "Compte de création négatif");

const before = creationBudgetViolations(full, rules, edgeRules, reality);
assert.deepEqual(newBudgetViolations(before, before), [], "Une entorse déjà présente n'est pas refusée de nouveau");
full.attributes.charisme = 4;
assert.deepEqual(newBudgetViolations(before, creationBudgetViolations(full, rules, edgeRules, reality)).map((v) => v.code), ["attribute_budget"], "Seule la nouvelle entorse est refusée");

console.log("BUDGETS DE CRÉATION OK — fiche vierge acceptée ; Attributs, Style, brut, Edge et Compte refusés au-delà du budget ; entorses anciennes tolérées");
