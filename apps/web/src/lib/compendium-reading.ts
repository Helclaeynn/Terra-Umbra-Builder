export type ReadingPosition = { sectionId: string; updatedAt: number };
export type ReadingPositions = Record<string, ReadingPosition>;
const MAX_READINGS = 50;

/** Store identifiers only: no article body, private title, or MJ content. */
export function parseReadingPositions(raw: string | null): ReadingPositions {
  try {
    const value: unknown = JSON.parse(raw || "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([id, position]) => {
      if (!id || id.length > 240 || !position || typeof position !== "object") return false;
      const saved = position as ReadingPosition;
      return typeof saved.sectionId === "string" && saved.sectionId.length > 0 && saved.sectionId.length <= 240 && Number.isFinite(saved.updatedAt) && saved.updatedAt > 0;
    }).sort(([, a], [, b]) => (b as ReadingPosition).updatedAt - (a as ReadingPosition).updatedAt).slice(0, MAX_READINGS).map(([id, position]) => {
      const saved = position as ReadingPosition;
      return [id, { sectionId: saved.sectionId, updatedAt: saved.updatedAt }];
    }));
  } catch { return {}; }
}

export function rememberReading(positions: ReadingPositions, articleId: string, sectionId: string, updatedAt = Date.now()): ReadingPositions {
  return parseReadingPositions(JSON.stringify({ ...positions, [articleId]: { sectionId, updatedAt } }));
}
