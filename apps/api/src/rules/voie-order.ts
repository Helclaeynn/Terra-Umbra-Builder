// Ordre des paliers et des portes d'une voie, vérifié par le serveur à
// l'enregistrement d'une fiche. Même règle que truthVoieIssues
// (apps/web/src/lib/truth.ts) : seuls les talents nouvellement ajoutés sont
// contrôlés, un talent déjà acquis n'est jamais remis en cause (décision 20).
import type { TruthTalent } from "./truth/types.js";

type Catalogs = Record<string, TruthTalent[]>;

const VOIE_RANK: Record<string, number> = { entree: 0, I: 1, II: 2, III: 3 };

function voiePeers(catalogs: Catalogs, talent: TruthTalent) {
  const id = talent.voie?.id;
  if (!id) return [];
  const peers = new Map<string, TruthTalent>();
  for (const list of Object.values(catalogs)) for (const t of list) if (t.voie?.id === id && !t.aliasOf) peers.set(t.id, t);
  return [...peers.values()];
}

function porteComplete(peers: TruthTalent[], porte: string | null, owned: Set<string>) {
  const inPorte = peers.filter((t) => (t.voie?.porte ?? null) === porte && t.voie?.palier != null && t.voie.palier in VOIE_RANK);
  const paliers = new Set(inPorte.map((t) => t.voie!.palier!));
  return inPorte.length > 0 && [...paliers].every((p) => inPorte.some((t) => t.voie!.palier === p && owned.has(t.id)));
}

function issuesFor(catalogs: Catalogs, talent: TruthTalent, owned: Set<string>): string[] {
  const voie = talent.voie;
  if (!voie?.palier || !(voie.palier in VOIE_RANK)) return [];
  const peers = voiePeers(catalogs, talent);
  const issues: string[] = [];
  const portes = [...new Set(peers.map((t) => t.voie?.porte ?? null).filter((p) => p === "A" || p === "B"))] as string[];
  if (voie.porte === "sommet") {
    if (!portes.some((p) => porteComplete(peers, p, owned))) issues.push(`Le sommet de ${voie.title} s'ouvre quand une porte a tous ses paliers.`);
    return issues;
  }
  if (voie.porte === "A" || voie.porte === "B") {
    const other = portes.find((p) => p !== voie.porte);
    if (other && peers.some((t) => t.voie?.porte === other && owned.has(t.id)) && !porteComplete(peers, other, owned)) {
      issues.push(`${voie.title} : la porte ${voie.porte} s'ouvre quand la porte ${other} a tous ses paliers.`);
    }
  }
  const rank = VOIE_RANK[voie.palier];
  const samePorte = peers.filter((t) => (t.voie?.porte ?? null) === (voie.porte ?? null));
  for (const [palier, r] of Object.entries(VOIE_RANK)) {
    if (r >= rank || !samePorte.some((t) => t.voie?.palier === palier)) continue;
    if (!samePorte.some((t) => t.voie?.palier === palier && owned.has(t.id))) {
      issues.push(`${voie.title} : il faut d'abord un talent du palier ${palier === "entree" ? "d'entrée" : palier}${voie.porte ? ` (porte ${voie.porte})` : ""}.`);
    }
  }
  return issues;
}

/** Talents ajoutés (absents de `before`) qui ne respectent pas l'ordre de leur voie. */
export function voieOrderViolations(catalogs: Catalogs, nature: string, before: string[], after: string[]) {
  const previous = new Set(before);
  const added = after.filter((id) => !previous.has(id));
  if (!added.length) return [];
  const aliases = new Map<string, string>();
  for (const list of Object.values(catalogs)) for (const t of list) if (t.aliasOf) aliases.set(t.id, t.aliasOf);
  const owned = new Set<string>();
  const own = (id: string) => { owned.add(id); const alias = aliases.get(id); if (alias) owned.add(alias); };
  for (const id of after) if (previous.has(id)) own(id);
  const mine = catalogs[nature] ?? [];
  let pending = added.flatMap((id) => {
    const talent = mine.find((t) => t.id === id) ?? Object.values(catalogs).flat().find((t) => t.id === id);
    if (!talent?.voie) { own(id); return []; }
    return [talent];
  });
  // Plusieurs talents ajoutés d'un coup : on les prend dans l'ordre d'achat
  // possible (entrée, puis I, puis porte complète…), comme dans le Builder.
  for (let progress = true; progress && pending.length;) {
    progress = false;
    pending = pending.filter((talent) => {
      if (issuesFor(catalogs, talent, owned).length) return true;
      own(talent.id);
      progress = true;
      return false;
    });
  }
  return pending.map((talent) => ({ talentId: talent.id, issues: issuesFor(catalogs, talent, owned) }));
}
