/** Gallery metadata only. Image bytes are stored once, outside character revisions. */
export const MAX_APPEARANCES = 12;
export type AppearanceLayer = 'reality' | 'truth';
export type CharacterAppearance = { mediaId: string; label: string };
export type CharacterAppearances = {
  reality: CharacterAppearance[]; truth: CharacterAppearance[];
  primaryReality: string; primaryTruth: string;
};
export const mediaIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function normalizeAppearances(value: unknown): CharacterAppearances {
  const r = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string,unknown> : {};
  const list = (v: unknown): CharacterAppearance[] => {
    const seen = new Set<string>();
    return (Array.isArray(v) ? v : []).flatMap(a => {
      if (!a || typeof a !== 'object' || typeof a.mediaId !== 'string' || !mediaIdPattern.test(a.mediaId)) return [];
      const mediaId = a.mediaId.toLowerCase();
      if (seen.has(mediaId)) return [];
      seen.add(mediaId);
      return [{mediaId, label: typeof a.label === 'string' ? a.label.trim().slice(0,100) : ''}];
    }).slice(0,MAX_APPEARANCES);
  };
  const reality = list(r.reality), truth = list(r.truth);
  const primary = (v: unknown, rows: CharacterAppearance[], legacy = false) =>
    typeof v === 'string' && (legacy && v === 'legacy' || rows.some(a => a.mediaId === v)) ? v : rows[0]?.mediaId ?? '';
  return {reality,truth,primaryReality:primary(r.primaryReality,reality,true),primaryTruth:primary(r.primaryTruth,truth)};
}
export function appearanceUrl(mediaId: string): string {
  return mediaIdPattern.test(mediaId) ? '/api/character-media/' + mediaId.toLowerCase() : '';
}
export function appearanceGallery(value: unknown, layer: AppearanceLayer, legacy?: {portraitDataUrl?:string;portraitName?:string}) {
  const a = normalizeAppearances(value);
  const rows = a[layer].map(row => ({id:row.mediaId,label:row.label||'Apparence',src:appearanceUrl(row.mediaId)}));
  if (layer === 'reality' && legacy?.portraitDataUrl) rows.unshift({id:'legacy',label:legacy.portraitName||'Portrait',src:legacy.portraitDataUrl});
  const key = layer === 'reality' ? a.primaryReality : a.primaryTruth;
  const primary = rows.find(row => row.id === key) ?? rows[0];
  return {rows:primary?[primary,...rows.filter(row=>row.id!==primary.id)]:rows,primary};
}
