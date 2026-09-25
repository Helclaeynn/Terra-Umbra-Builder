import type { Article } from "./compendium.js";

type CataloguePage = {
  id?: string;
  title?: string;
  audience?: string;
  semanticReading?: { candidateReferences?: unknown[] };
};

type CatalogueLink = {
  articleId: string;
  sectionId: string;
  quote: string;
  label: string;
  targetId: string;
};

function norm(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function linkUrl(targetId: string): string {
  return `/compendium?article=${encodeURIComponent(targetId)}`;
}

function containsReference(text: string, reference: string): boolean {
  return text.toLocaleLowerCase().includes(reference.toLocaleLowerCase());
}

function catalogueLinks(byId: Map<string, Article>, pages: CataloguePage[]): CatalogueLink[] {
  const titleTargets = new Map<string, string[]>();
  for (const page of pages) {
    const key = norm(page.title);
    if (!page.id || !key || page.title === "_") continue;
    const ids = titleTargets.get(key) ?? [];
    ids.push(page.id);
    titleTargets.set(key, ids);
  }

  const links: CatalogueLink[] = [];
  for (const page of pages) {
    const source = page.id ? byId.get(page.id) : undefined;
    if (!source) continue;
    const references = page.semanticReading?.candidateReferences ?? [];
    for (const reference of references) {
      const label = String(reference ?? "").trim();
      const targetIds = titleTargets.get(norm(label)) ?? [];
      if (targetIds.length !== 1 || !byId.has(targetIds[0]) || targetIds[0] === source.id) continue;
      const target = byId.get(targetIds[0]);
      for (const section of source.sections ?? []) {
        const sourceAudience = section.audience ?? source.audience ?? "public";
        const targetIsMjOnly = target?.audience === "mj" ||
          (target?.sections?.length && target.sections.every((candidate) => candidate.audience === "mj"));
        if (targetIsMjOnly && sourceAudience !== "mj") continue;
        for (const block of section.blocks ?? []) {
          if (block.type === "p" && typeof block.text === "string" && containsReference(block.text, label)) {
            links.push({ articleId: source.id, sectionId: section.id, quote: label, label, targetId: targetIds[0] });
          }
          if (block.type === "table" && Array.isArray(block.rows) && block.rows.some((row: unknown) =>
            Array.isArray(row) && row.some((cell) => typeof cell === "string" && containsReference(cell, label))
          )) {
            links.push({ articleId: source.id, sectionId: section.id, quote: label, label, targetId: targetIds[0] });
          }
        }
      }
    }
  }
  return links;
}

export function applyCatalogueContextualLinks(byId: Map<string, Article>, pages: CataloguePage[]): { applied: number; skipped: number } {
  let applied = 0;
  let skipped = 0;
  const seen = new Set<string>();
  for (const entry of catalogueLinks(byId, pages)) {
    const key = JSON.stringify([entry.articleId, entry.sectionId, entry.quote, entry.targetId]);
    if (seen.has(key)) continue;
    seen.add(key);
    const article = byId.get(entry.articleId);
    const section = article?.sections?.find((candidate) => candidate.id === entry.sectionId);
    const marker = `[${entry.label}](${linkUrl(entry.targetId)})`;
    let changed = false;
    for (const block of section?.blocks ?? []) {
      if (block.type === "p" && typeof block.text === "string" && containsReference(block.text, entry.quote)) {
        if (block.text.includes(marker)) continue;
        const pattern = new RegExp(entry.quote.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        block.text = block.text.replace(pattern, marker);
        changed = true;
      }
      if (block.type === "table" && Array.isArray(block.rows)) {
        block.rows = block.rows.map((row: unknown) => Array.isArray(row) ? row.map((cell: unknown) => {
          if (typeof cell !== "string" || !containsReference(cell, entry.quote) || cell.includes(marker)) return cell;
          const pattern = new RegExp(entry.quote.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
          changed = true;
          return cell.replace(pattern, marker);
        }) : row);
      }
    }
    if (changed) applied += 1;
    else skipped += 1;
  }
  return { applied, skipped };
}

/** Remove only duplicate/empty tags; preserve the first existing spelling. */
export function normalizeCatalogueTags(byId: Map<string, Article>): number {
  let changed = 0;
  for (const article of byId.values()) {
    if (!Array.isArray(article.tags)) continue;
    const seen = new Set<string>();
    const tags = article.tags.map((tag) => String(tag).trim()).filter((tag) => {
      if (!tag) return false;
      const key = norm(tag);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (tags.length !== article.tags.length || tags.some((tag, index) => tag !== article.tags?.[index])) {
      article.tags = tags;
      changed += 1;
    }
  }
  return changed;
}
