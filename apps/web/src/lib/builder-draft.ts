import type { CharacterDataV2 } from '../types/character';
import { cloneJson } from './json';
import { ensureRealityState } from './reality';
import { ensureProgression } from './progression';

/** PostgreSQL JSONB key order and harmless default hydration are not edits. */
export function normalizeBuilderDraft(value: CharacterDataV2): CharacterDataV2 {
  const draft = cloneJson(value);
  draft.reality ||= {};
  draft.progression ||= {};
  ensureRealityState(draft.reality);
  ensureProgression(draft.progression, Object.keys(draft.skills), Object.keys(draft.attributes));
  return draft;
}
function ordered(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(ordered);
  if (value && typeof value === 'object') return Object.fromEntries(
    Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, ordered(item)])
  );
  return value;
}
export function builderDraftFingerprint(value: CharacterDataV2): string {
  return JSON.stringify(ordered(normalizeBuilderDraft(value)));
}
/** Do not replace edits made while the save request was in flight. */
export function reconcileBuilderSave(current: CharacterDataV2, sent: CharacterDataV2, received: CharacterDataV2) {
  const preserved = builderDraftFingerprint(current) !== builderDraftFingerprint(sent);
  return { draft: preserved ? cloneJson(current) : normalizeBuilderDraft(received),
    baseline: builderDraftFingerprint(received), preserved };
}
