// Outils communs aux générateurs de contenu (build-*.mjs) : lecture des lots
// docs/audit-game-design/lots/*.md et écriture du SQL idempotent des tables
// content_*. Chaque entrée appartient à une portée (scope = la Nature) : les
// identifiants de talent ne sont uniques que dans leur Nature.
import { readFileSync, writeFileSync } from "node:fs";

export const PALIER_COUT = { I: 1, II: 2, III: 3 };

export const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’'`]/g, "'")
    .replace(/œ/gi, "oe")
    .toLowerCase()
    .trim();

export function readLot(name) {
  return readFileSync(new URL(`../../docs/audit-game-design/lots/${name}`, import.meta.url), "utf8").replace(/\r\n/g, "\n");
}

// Une voie de lot : un titre ###, une ligne de forme en italique, des puces
// « **<palier> (<coût>) · <Nom>** (<accès>) : texte », des titres de porte
// « **Porte A · … ** » et une ligne « **Changements** : … ».
export function parseLotVoies(markdown) {
  const voies = [];
  let voie = null;
  let porte = null;
  for (const line of markdown.split("\n")) {
    const h = line.match(/^### (.+)$/);
    if (h) {
      voie = { titre: h[1].trim(), forme: null, talents: [], changements: null, portes: {} };
      porte = null;
      voies.push(voie);
      continue;
    }
    if (/^## /.test(line)) {
      voie = null;
      continue;
    }
    if (!voie) continue;
    const forme = line.match(/^\*(1 porte|Progression[^*]*|2 portes|Collection[^*]*)\*/i);
    if (forme && !voie.forme) voie.forme = forme[1].trim();
    const p = line.match(/^\*\*Porte ([AB]) · (.+?)\*\*/);
    if (p) {
      porte = p[1];
      voie.portes[porte] = p[2].trim();
      continue;
    }
    const ch = line.match(/^\*\*Changements\*\*\s*:\s*(.+)$/);
    if (ch) voie.changements = ch[1].trim();
    const t = line.match(/^- \*\*(.+?) · (.+?)\*\*\s*(?:\(([^)]*)\))?\s*:\s*(.+)$/);
    if (t) {
      const head = t[1].trim();
      const pal = head.match(/^(I{1,3})( b)?\s*\((\d) PTV\)$/);
      voie.talents.push({
        label: head,
        palier: pal ? pal[1] : null,
        palierDouble: pal && pal[2] ? "b" : null,
        cout: pal ? Number(pal[3]) : 0,
        gratuit: !pal,
        nom: t[2].trim(),
        acces: t[3] ?? null,
        texte: t[4].trim(),
        porte: pal ? porte : null
      });
    }
  }
  return voies;
}

// ---------------------------------------------------------------- SQL

const q = (s) => (s == null ? "NULL" : `'${String(s).replace(/'/g, "''")}'`);
const j = (v) => `${q(JSON.stringify(v))}::jsonb`;
const arr = (a) => (a.length ? `ARRAY[${a.map(q).join(",")}]::text[]` : "'{}'::text[]");

export class ContentSet {
  constructor(scope) {
    this.scope = scope;
    this.entries = [];
    this.relations = [];
  }

  entry(type, slug, title, fields, extra = {}) {
    const scope = extra.scope ?? this.scope;
    if (this.entries.some((e) => e.type === type && e.scope === scope && e.slug === slug)) {
      throw new Error(`Entrée en double : ${type} ${scope}/${slug}`);
    }
    this.entries.push({ type, slug, title, scope, fields: { nature: this.scope, ...fields }, ...extra, scope });
  }

  relation(from, to, kind, position = null, meta = {}) {
    // from / to : [type, slug] ou [type, slug, scope]
    this.relations.push({ from, to, kind, position, meta });
  }

  ref([type, slug, scope = this.scope]) {
    return `(SELECT id FROM content_entry WHERE type = ${q(type)} AND scope = ${q(scope)} AND slug = ${q(slug)})`;
  }

  sql(generator) {
    const lines = [
      `-- Généré par infrastructure/content/${generator} : ne pas modifier à la main.`,
      `-- ${this.entries.length} entrées, ${this.relations.length} relations.`,
      "BEGIN;",
      `DELETE FROM content_relation WHERE from_id IN (SELECT id FROM content_entry WHERE scope = ${q(this.scope)});`
    ];
    for (const e of this.entries) {
      const status = e.status ?? "published";
      lines.push(
        `INSERT INTO content_entry (type, scope, slug, title, summary, fields, status, legacy_ids, published_at) VALUES (` +
          `${q(e.type)}, ${q(e.scope)}, ${q(e.slug)}, ${q(e.title)}, ${q(e.summary ?? null)}, ${j(e.fields)}, ${q(status)}, ${arr(e.legacy_ids ?? [])}, ` +
          `${status === "published" ? "now()" : "NULL"}) ` +
          `ON CONFLICT (type, scope, slug) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary, fields = EXCLUDED.fields, ` +
          `status = EXCLUDED.status, legacy_ids = EXCLUDED.legacy_ids, ` +
          `version = content_entry.version + CASE WHEN content_entry.fields IS DISTINCT FROM EXCLUDED.fields OR content_entry.title IS DISTINCT FROM EXCLUDED.title THEN 1 ELSE 0 END, ` +
          `updated_at = now();`
      );
    }
    for (const r of this.relations) {
      lines.push(
        `INSERT INTO content_relation (from_id, to_id, kind, position, meta) VALUES (${this.ref(r.from)}, ${this.ref(r.to)}, ${q(r.kind)}, ${r.position ?? "NULL"}, ${j(r.meta)});`
      );
    }
    lines.push(
      "INSERT INTO content_revision (entry_id, version, snapshot, comment)",
      `SELECT e.id, e.version, to_jsonb(e) - 'id', ${q(`Import ${this.scope} (voies à paliers)`)}`,
      `FROM content_entry e WHERE e.scope = ${q(this.scope)}`,
      "ON CONFLICT (entry_id, version) DO NOTHING;",
      "COMMIT;",
      ""
    );
    return lines.join("\n");
  }

  write(generator, file) {
    writeFileSync(new URL(file, import.meta.url), this.sql(generator));
    const count = (type) => this.entries.filter((e) => e.type === type).length;
    return `${file} : ${count("nature")} Nature, ${count("couche")} couches, ${count("voie")} voies, ${count("talent")} talents, ${this.relations.length} relations`;
  }
}
