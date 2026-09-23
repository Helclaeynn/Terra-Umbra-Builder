export type CompendiumTarget = { articleId: string; section: string };
type Section = { id?: string };
type Query = Record<string, unknown>;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function decode(value: string): string {
  try { return decodeURIComponent(value); } catch { return value; }
}

export function sectionDomId(section: Section, index: number): string {
  const raw = text(section.id);
  return `wiki-section-${raw ? raw.replace(/[^a-zA-Z0-9_-]+/g, "-") : index + 1}`;
}

/** Query section IDs and native fragments both name a section, never a scroll offset. */
export function compendiumTarget(query: Query, hash = ""): CompendiumTarget | null {
  const articleId = text(query.article);
  const fragment = decode(hash.replace(/^#/, ""));
  if (articleId) return { articleId, section: fragment || text(query.section) || text(query.sectionId) };
  // Shared links from the previous Compendium used #/article/id@section-id.
  const legacy = fragment.match(/^\/article\/([^@]+)(?:@(.+))?$/);
  return legacy ? { articleId: legacy[1], section: legacy[2] || "" } : null;
}

export function compendiumHref(articleId: string, section = ""): string {
  return `/compendium?article=${encodeURIComponent(articleId)}${section ? `#${encodeURIComponent(section)}` : ""}`;
}

export function compendiumLinkTarget(href: string, baseUrl: string): CompendiumTarget | null {
  try {
    const base = new URL(baseUrl);
    const url = new URL(href, base);
    if (url.origin !== base.origin || !["/", "/compendium", "/compendium/"].includes(url.pathname)) return null;
    return compendiumTarget(Object.fromEntries(url.searchParams), url.hash);
  } catch { return null; }
}

/** Only an explicit search target is followed. A snippet is not a reliable section ID. */
export function searchResultTarget(item: { id: string; sectionId?: string; section?: string; href?: string }, baseUrl: string): CompendiumTarget {
  const linked = item.href ? compendiumLinkTarget(item.href, baseUrl) : null;
  return { articleId: item.id, section: text(item.sectionId) || text(item.section) || (linked?.articleId === item.id ? linked.section : "") };
}

export function sectionTargetId(sections: Section[], target: string): string | null {
  if (!target) return null;
  // Exact source IDs take precedence over their legacy DOM representation.
  const exact = sections.findIndex(section => text(section.id) === target);
  if (exact >= 0) return sectionDomId(sections[exact], exact);
  const index = sections.findIndex((section, index) => sectionDomId(section, index) === target);
  return index >= 0 ? sectionDomId(sections[index], index) : null;
}

export function positionCompendiumArticle(panel: HTMLElement, sections: Section[], target: string): void {
  const id = sectionTargetId(sections, target);
  const destination = id ? Array.from(panel.querySelectorAll<HTMLElement>(".article-section")).find(section => section.id === id) : null;
  const element = destination || panel.querySelector<HTMLElement>(".article-header") || panel;
  const details = destination?.querySelector<HTMLDetailsElement>("details.mj-section");
  if (details) details.open = true;
  element.setAttribute("tabindex", "-1");
  element.focus({ preventScroll: true });
  element.scrollIntoView({ behavior: "instant", block: "start" });
}
