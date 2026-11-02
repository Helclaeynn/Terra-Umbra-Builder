// Budgets de création vérifiés par le serveur à l'enregistrement d'une fiche.
// Mêmes règles que le Builder (apps/web/src/pages/CharacterBuilderPage.vue) :
// on refuse un DÉPASSEMENT (trop de points, Compte négatif…), jamais une fiche
// incomplète, que le joueur remplit au fil des étapes.
// Seules les entorses nouvelles sont refusées : une fiche déjà hors budget
// avant ce contrôle reste enregistrable tant qu'elle ne s'aggrave pas.
import { realityEconomic } from "./economy-model.js";

type Num = Record<string, unknown>;
type CreationRules = {
  attributes: Array<{ id: string }>;
  skills: Array<{ id: string }>;
  spheres: Record<string, { fixedSkills?: string[] }>;
  styles: Array<{ id: string; sphere?: string; skills?: string[]; account: number; augmentationEnvelope: number; vehicleCapital: number; gen2SlotsBase?: number }>;
  creation: {
    attributes: { baseTotal: number; min: number; max: number; edgePackPoints: number };
    skills: { stylePoints: number; stylePerSkillMax: number; freePoints: number; rawMax: number; edgePackPoints: number };
  };
};
type EdgeRules = { base: number; options: Record<string, { max: number }> };
type RealityRules = Parameters<typeof realityEconomic>[0];

export type BudgetViolation = { code: string; detail: string };

const num = (value: unknown) => (Number.isFinite(Number(value)) ? Number(value) : 0);
const MAX_DISADVANTAGES = 3;

export function creationBudgetViolations(data: Num, rules: CreationRules, edgeRules: EdgeRules, reality: RealityRules | null): BudgetViolation[] {
  const out: BudgetViolation[] = [];
  const add = (code: string, detail: string) => out.push({ code, detail });
  const attributes = (data.attributes ?? {}) as Num;
  const edgeAttributes = (data.edgeAttributes ?? {}) as Num;
  const skills = (data.skills ?? {}) as Record<string, Num>;
  const edge = (data.edge ?? {}) as Num;
  const creation = (data.creation ?? {}) as Num;
  const disadvantages = Array.isArray(data.disadvantages) ? data.disadvantages : [];
  const a = rules.creation.attributes;
  const s = rules.creation.skills;

  // Attributs : bornes, budget de base, points Edge.
  let attributeTotal = 0;
  for (const { id } of rules.attributes) {
    const value = num(attributes[id] ?? a.min);
    attributeTotal += value;
    if (value < a.min || value > a.max) add(`attribute_bounds:${id}`, `${id} = ${value} (entre ${a.min} et ${a.max})`);
    if (value + num(edgeAttributes[id]) > a.max) add(`attribute_final:${id}`, `${id} avec Edge = ${value + num(edgeAttributes[id])} (maximum ${a.max})`);
  }
  if (attributeTotal > a.baseTotal) add("attribute_budget", `${attributeTotal} points d'Attribut pour ${a.baseTotal}`);
  const edgeAttributeTotal = Object.values(edgeAttributes).reduce((sum: number, v) => sum + num(v), 0);
  const edgeAttributeBudget = num(edge.attributePack) * a.edgePackPoints;
  if (edgeAttributeTotal > edgeAttributeBudget) add("edge_attribute_budget", `${edgeAttributeTotal} points d'Attribut Edge pour ${edgeAttributeBudget}`);

  // Compétences : points de Style, points libres, points Edge, plafond brut.
  const sphere = rules.spheres[String(creation.sphere ?? "")];
  const style = rules.styles.find((row) => row.id === creation.style);
  let styleTotal = 0, freeTotal = 0, edgeSkillTotal = 0;
  for (const { id } of rules.skills) {
    const row = skills[id] ?? {};
    const styled = num(row.style), free = num(row.free), edgePoints = num(row.edge);
    styleTotal += styled; freeTotal += free; edgeSkillTotal += edgePoints;
    if (styled > s.stylePerSkillMax) add(`style_per_skill:${id}`, `${styled} points de Style en ${id} (maximum ${s.stylePerSkillMax})`);
    if (styled > 0 && style?.skills && !style.skills.includes(id)) add(`style_skill:${id}`, `points de Style en ${id}, hors du Style`);
    const raw = (sphere?.fixedSkills?.includes(id) ? 1 : 0) + styled + free + edgePoints;
    if (raw > s.rawMax) add(`skill_raw:${id}`, `${id} brut ${raw} (maximum ${s.rawMax})`);
  }
  if (styleTotal > s.stylePoints) add("style_budget", `${styleTotal} points de Style pour ${s.stylePoints}`);
  if (freeTotal > s.freePoints) add("free_budget", `${freeTotal} points libres pour ${s.freePoints}`);
  const edgeSkillBudget = num(edge.skillPacks) * s.edgePackPoints;
  if (edgeSkillTotal > edgeSkillBudget) add("edge_skill_budget", `${edgeSkillTotal} points de Compétence Edge pour ${edgeSkillBudget}`);

  // Désavantages et Edge (toutes les options coûtent 1 Edge).
  if (disadvantages.length > MAX_DISADVANTAGES) add("disadvantage_count", `${disadvantages.length} Désavantages (maximum ${MAX_DISADVANTAGES})`);
  let edgeSpent = 0;
  for (const [key, option] of Object.entries(edgeRules.options)) {
    const bought = num(edge[key]);
    edgeSpent += bought;
    if (bought > option.max) add(`edge_option:${key}`, `${key} acheté ${bought} fois (maximum ${option.max})`);
  }
  const edgeTotal = edgeRules.base + disadvantages.length;
  if (edgeSpent > edgeTotal) add("edge_budget", `${edgeSpent} Edge dépensés pour ${edgeTotal}`);

  // Compte de création : jamais négatif (achats, dépassements d'enveloppe).
  const realityState = data.reality as { equipment?: unknown; augmentations?: unknown } | undefined;
  if (reality && style && Array.isArray(realityState?.equipment) && Array.isArray(realityState?.augmentations)) {
    const economy = realityEconomic(reality, realityState as Parameters<typeof realityEconomic>[1],
      { ...style, gen2SlotsBase: style.gen2SlotsBase ?? 0 }, edge as Record<string, number>);
    if (economy.account < 0) add("account_negative", `Compte de création à ${economy.account} $`);
  }
  return out;
}

/** Entorses présentes après l'enregistrement et absentes avant. */
export function newBudgetViolations(before: BudgetViolation[], after: BudgetViolation[]) {
  const known = new Set(before.map((v) => v.code));
  return after.filter((v) => !known.has(v.code));
}
