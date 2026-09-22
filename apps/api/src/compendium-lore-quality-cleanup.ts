type JsonObject = Record<string, any>;

type ArticleLike = {
  id?: unknown;
  category?: unknown;
  pnj?: unknown;
  title?: unknown;
  tags?: unknown[];
  sections?: JsonObject[];
  [key: string]: unknown;
};

export type LoreQualityCleanupStats = {
  damagedGlyphs: number;
  mergedSections: number;
  removedEmptySections: number;
  splitParagraphs: number;
  splitBulletLists: number;
};

const STRUCTURAL_TARGETS = new Set([
  "realite-v9-cbac",
  "realite-v9-nrmd",
  "realite-v9-oglaigh",
  "realite-v9-gangs-underlife",
  "verite-v7-aseryns-serathe-atlantide-treize"
]);

export const LONG_PARAGRAPH_TARGETS = new Set([
  "verite-aseryns-hyperboree-royaume",
  "verite-aseryns-mu-royaume",
  "verite-v7-aseryns-serathe-atlantide-treize",
  "verite-aseryns-diasporas-conseil-foudre",
  "verite-v7-vampires-civilisation-cours-sangs",
  "verite-aseryns-lemurie-royaumes",
  "verite-aseryns-neo-atlantide-territoires",
  "verite-v7-habiter-la-verite",
  "verite-v7-voile-hologramme",
  "verite-v7-cycle-neant-ombremonde-histoire-cachee",
  "verite-v7-derriere-le-voile",
  "verite-v7-descendants-khinae",
  "realite-v9-crawlers-insurges",
  "realite-v9-crawlers-motards-sons-of-legba",
  "verite-v7-angelus-elynea-arbre-vie",
  "verite-v7-daemons-divinites-maisonnees-temples",
  "verite-extrals-rocreens-detail",
  "realite-v9-crawlers-underlife"
]);

export const INLINE_BULLET_TARGETS = new Set([
  "realite-v9-crawlers-gundrivers",
  "realite-v9-crawlers-insurges",
  "realite-v9-crawlers-insurges-la-grande-revolution",
  "realite-v9-crawlers-insurges-seungli",
  "realite-v9-crawlers-enders",
  "verite-v7-descendants-khinae",
  "lore-hunters-musulmans",
  "lore-hunters-shientaoistes",
  "verite-v7-aseryns-serathe-atlantide-treize",
  "verite-aseryns-neo-atlantide-territoires",
  "verite-aseryns-mu-royaume",
  "verite-aseryns-lemurie-royaumes",
  "verite-aseryns-hyperboree-royaume",
  "verite-aseryns-diasporas-conseil-foudre"
]);

const loreCategory = (article: ArticleLike) =>
  article.category === "Réalité" || article.category === "Vérité";

function replaceDamaged(value: unknown, stats: LoreQualityCleanupStats): unknown {
  if (typeof value !== "string") return value;
  const matches = value.match(/[�\ufffe\uffff]/gu);
  if (!matches?.length) return value;
  stats.damagedGlyphs += matches.length;
  return value.replace(/[�\ufffe\uffff]/gu, "-");
}

function cleanVisibleText(article: ArticleLike, stats: LoreQualityCleanupStats): void {
  article.title = replaceDamaged(article.title, stats);
  if (Array.isArray(article.tags)) {
    article.tags = article.tags.map((tag) => replaceDamaged(tag, stats));
  }
  for (const section of article.sections ?? []) {
    section.title = replaceDamaged(section.title, stats);
    for (const block of section.blocks ?? []) {
      if (block?.type === "p") block.text = replaceDamaged(block.text, stats);
      if (block?.type === "table" && Array.isArray(block.rows)) {
        block.rows = block.rows.map((row: unknown) =>
          Array.isArray(row) ? row.map((cell) => replaceDamaged(cell, stats)) : row
        );
      }
    }
  }
}

function coalesceSections(article: ArticleLike, stats: LoreQualityCleanupStats): void {
  if (!STRUCTURAL_TARGETS.has(String(article.id ?? ""))) return;
  const articleId = String(article.id ?? "");
  const merged: JsonObject[] = [];
  const byId = new Map<string, JsonObject>();
  for (const section of article.sections ?? []) {
    const id = String(section.id ?? "");
    const previous = id ? byId.get(id) : undefined;
    if (!previous) {
      const clone = { ...section, blocks: [...(section.blocks ?? [])] };
      merged.push(clone);
      if (id) byId.set(id, clone);
      continue;
    }
    if (articleId === "verite-v7-aseryns-serathe-atlantide-treize") {
      const clone = {
        ...section,
        id: `${id}-complements`,
        title: section.title === "Les Treize comme langage commun"
          ? "Les Treize comme héritage commun"
          : section.title,
        blocks: [...(section.blocks ?? [])]
      };
      merged.push(clone);
      byId.set(String(clone.id), clone);
      stats.mergedSections += 1;
      continue;
    }
    previous.blocks = [...(previous.blocks ?? []), ...(section.blocks ?? [])];
    stats.mergedSections += 1;
  }
  article.sections = merged.filter((section) => {
    const keep = (section.blocks ?? []).some((block: unknown) => {
      if (!block || typeof block !== "object") return false;
      const value = block as JsonObject;
      if (value.type === "p") return String(value.text ?? "").trim().length > 0;
      if (value.type === "table") return Array.isArray(value.rows) && value.rows.length > 0;
      return true;
    });
    if (!keep) stats.removedEmptySections += 1;
    return keep;
  });
}

function splitInlineBullets(text: string): string[] {
  const parts = text.split(/\s+[•]\s+/u);
  if (parts.length < 2) return [text];
  return [parts[0].trim(), ...parts.slice(1).map((part) => `• ${part.trim()}`)].filter(Boolean);
}

function sentencePieces(text: string): string[] {
  return text.split(/(?<=[.!?…])\s+(?=[A-ZÀ-ÖØ-ÞÉÈÊËÎÏÔÙÛÜÇ«“])/u).filter(Boolean);
}

function splitOversizedPiece(piece: string, maximum: number): string[] {
  const result: string[] = [];
  let rest = piece.trim();
  while (rest.length > maximum) {
    const window = rest.slice(0, maximum + 1);
    const minimum = Math.floor(maximum * 0.55);
    let cut = Math.max(window.lastIndexOf("; "), window.lastIndexOf(": "));
    if (cut < minimum) cut = window.lastIndexOf(", ");
    if (cut < minimum) cut = window.lastIndexOf(" ");
    if (cut < 1) break;
    result.push(rest.slice(0, cut + 1).trim());
    rest = rest.slice(cut + 1).trim();
  }
  if (rest) result.push(rest);
  return result;
}

function splitLongParagraph(text: string, maximum = 600): string[] {
  if (text.length <= maximum) return [text];
  const pieces = sentencePieces(text).flatMap((piece) => splitOversizedPiece(piece, maximum));
  const result: string[] = [];
  let current = "";
  for (const piece of pieces) {
    if (!current) {
      current = piece;
      continue;
    }
    if (`${current} ${piece}`.length <= maximum) current = `${current} ${piece}`;
    else {
      result.push(current);
      current = piece;
    }
  }
  if (current) result.push(current);
  return result.length > 1 ? result : [text];
}

function reflowParagraphs(article: ArticleLike, stats: LoreQualityCleanupStats): void {
  const id = String(article.id ?? "");
  const splitBullets = INLINE_BULLET_TARGETS.has(id);
  const splitLong = LONG_PARAGRAPH_TARGETS.has(id);
  if (!splitBullets && !splitLong) return;

  for (const section of article.sections ?? []) {
    const next: JsonObject[] = [];
    for (const block of section.blocks ?? []) {
      if (block?.type !== "p" || typeof block.text !== "string") {
        next.push(block);
        continue;
      }
      const bulletParts = splitBullets ? splitInlineBullets(block.text) : [block.text];
      if (bulletParts.length > 1) stats.splitBulletLists += 1;
      const finalParts = bulletParts.flatMap((part) => splitLong ? splitLongParagraph(part) : [part]);
      if (finalParts.length > 1) stats.splitParagraphs += finalParts.length - 1;
      next.push(...finalParts.map((text) => ({ ...block, text })));
    }
    section.blocks = next;
  }
}

export function applyLoreQualityCleanup(article: ArticleLike): LoreQualityCleanupStats {
  const stats: LoreQualityCleanupStats = {
    damagedGlyphs: 0,
    mergedSections: 0,
    removedEmptySections: 0,
    splitParagraphs: 0,
    splitBulletLists: 0
  };
  if (article.pnj || !loreCategory(article)) return stats;
  cleanVisibleText(article, stats);
  coalesceSections(article, stats);
  reflowParagraphs(article, stats);
  return stats;
}

export function removeInternalPublicMetadata(article: ArticleLike): void {
  delete article.source;
  delete article.sourceCategory;
  delete article.rebuildV2;
  delete article.loreBook;
  delete article.legacyTargetId;
  delete article.__searchText;
}
