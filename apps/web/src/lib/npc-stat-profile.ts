/** Presentation helpers only: source values are never parsed or recalculated. */
export type NpcProfileBlock = {
  type?: string;
  text?: unknown;
  style?: unknown;
  rows?: unknown[][];
};

export type NpcProfileSection = {
  id?: string;
  title?: string;
  blocks?: NpcProfileBlock[];
};

export type NpcProfileBlockKind = "attributes" | "skills" | "derived" | "talents" | "table" | "paragraph" | "unknown";

const normalized = (value: unknown) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("fr");

export function isNpcStatProfileSection(section: NpcProfileSection): boolean {
  return normalized(section.id) === "profil-statistique" || /^(?:profil statistique(?:\s*[·:—–-]|$)|statistiques$)/.test(normalized(section.title));
}

export function profileTableRows(block: NpcProfileBlock): string[][] {
  if (!Array.isArray(block.rows)) return [];
  return block.rows.map(row => Array.isArray(row) ? row.map(value => String(value ?? "")) : [String(row ?? "")]);
}

export function profileBlockKind(block: NpcProfileBlock): NpcProfileBlockKind {
  if (block.type !== "table") return block.text !== undefined ? "paragraph" : "unknown";
  const rows = profileTableRows(block);
  if (rows.length < 2 || !rows[0].length || !rows.every(row => row.length === rows[0].length)) return "table";
  const headers = rows[0].map(normalized);
  if (rows.length === 2 && headers.length > 1 && /^(?:attribut|attribut revele)$/.test(headers[0]) && /^(?:valeur|valeur proposee)$/.test(normalized(rows[1][0]))) return "attributes";
  if (headers.length === 2 && /^(?:competences?|competence de verite (?:saillante|revelee))$/.test(headers[0]) && /^(?:rang|rang propose)$/.test(headers[1])) return "skills";
  if (headers.join("|") === "valeur derivee|calcul|resultat" || headers.join("|") === "valeur derivee|resultat") return "derived";
  if (headers.length === 2 && headers.join("|") === "talent pnj|application sur la fiche") return "talents";
  if (headers.length === 3 && headers.join("|") === "talent|prerequis|effet et limite") return "talents";
  return "table";
}
