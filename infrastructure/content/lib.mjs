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

// Une voie de lot : un titre ### ou ####, une forme (fin du titre « — 1 porte »
// ou ligne en italique), des puces « **<palier> (<coût>) · <Nom>** (<accès>) :
// texte », des portes (« **Porte A · … ** » ou « Porte A — **…** »), un sommet
// « **Sommet · III (3 PTV) · <Nom>** … » et une ligne « **Changements** : … ».
// Paliers : I, II, III (suivis ou non d'une lettre : II b, IIa…), « Entrée (n
// PTV) », ou gratuits (Socle, Tradition, Signature, Don…). Une voie en ####
// garde le titre ### qui la précède dans `parent`. Les lignes de profil avant
// la première porte (Animal, Hybride, Variantes…) vont dans `profil`.
const FORME_TITRE = /^(1 porte|2 portes|progression|collection|dons|deux portes|une porte|sommet)/i;

export function parseLotVoies(markdown) {
  const voies = [];
  let voie = null;
  let porte = null;
  let inChangements = false;
  const stack = [];
  for (const line of markdown.split("\n")) {
    const h = line.match(/^(#{3,5}) (.+)$/);
    if (h) {
      let titre = h[2].trim();
      let forme = null;
      const parts = titre.split(" — ");
      if (parts.length > 1 && FORME_TITRE.test(parts.at(-1))) {
        forme = parts.pop().trim();
        titre = parts.join(" — ");
      }
      const niveau = h[1].length;
      stack.length = niveau - 3;
      const parents = stack.filter(Boolean);
      stack[niveau - 3] = titre;
      voie = { titre, niveau, parent: parents.at(-1) ?? null, parents, forme, talents: [], changements: null, portes: {}, profil: [] };
      porte = null;
      inChangements = false;
      voies.push(voie);
      continue;
    }
    if (/^#{1,2} /.test(line)) {
      voie = null;
      stack.length = 0;
      continue;
    }
    if (!voie) continue;
    // Voie écrite en ligne (lot Daemon) : « **Nom** · *forme* · identité ».
    const bv = line.match(/^\*\*([^*]+)\*\* · \*([^*]+)\* · (.+)$/);
    if (bv) {
      const heading = voies.filter((x) => !x.inline).at(-1);
      voie = {
        titre: bv[1].trim(), niveau: heading.niveau + 1, parent: heading.titre, parents: [...heading.parents, heading.titre],
        forme: bv[2].trim(), identite: bv[3].trim(), inline: true, talents: [], changements: null, portes: {}, profil: []
      };
      porte = null;
      inChangements = false;
      voies.push(voie);
      continue;
    }
    if (inChangements) {
      if (/^\s*- /.test(line)) {
        voie.changements = [voie.changements, line.replace(/^\s*- /, "").trim()].filter(Boolean).join(" ");
        continue;
      }
      if (line.trim()) inChangements = false;
    }
    const forme = line.match(/^\*(1 porte|Progression[^*]*|2 portes|Collection[^*]*)\*/i);
    if (forme && !voie.forme) voie.forme = forme[1].trim();
    const p = line.match(/^(?:\*\*)?Porte ([AB])\s*[·—-]\s*\**(.+?)\**\s*$/);
    if (p) {
      porte = p[1];
      voie.portes[porte] = p[2].trim();
      continue;
    }
    const ch = line.match(/^\*\*Changements\*\*\s*:\s*(.*)$/);
    if (ch) {
      voie.changements = ch[1].trim() || null;
      inChangements = true;
      continue;
    }
    const t = line.match(/^(?:- )?\*\*(Sommet · )?(.+?) · (.+?)\*\*\s*(\*\(livre V6\)\*)?\s*(?:\(([^)]*)\))?\s*:\s*(.+)$/);
    if (t) {
      const sommet = Boolean(t[1]);
      const head = t[2].trim();
      const pal = head.match(/^(I{1,3})\s?([a-d])?\s*\((\d) PTV\)$/);
      const entree = head.match(/^Entrée \((\d) PTV\)$/);
      const gratuit = !pal && !entree;
      if (gratuit && !/^(Socle|Tradition|Signature|Don|Empreinte)/.test(head)) continue; // titres en gras d'autres blocs
      voie.talents.push({
        label: head,
        palier: pal ? pal[1] : entree ? "entree" : null,
        palierDouble: pal && pal[2] ? pal[2] : null,
        cout: pal ? Number(pal[3]) : entree ? Number(entree[1]) : 0,
        gratuit,
        nom: t[3].trim(),
        livreV6: Boolean(t[4]),
        acces: t[5] ?? null,
        texte: t[6].trim(),
        porte: sommet ? "sommet" : gratuit ? null : porte
      });
      continue;
    }
    if (!porte && (/^- \*\*/.test(line) || /^\s+- /.test(line))) voie.profil.push(line);
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
    // Chaque bout de relation dans cette portée doit exister ; une relation en
    // double (même origine, même cible, même sorte) n'est écrite qu'une fois.
    const known = new Set(this.entries.map((e) => `${e.type}:${e.scope}:${e.slug}`));
    const written = new Set();
    for (const r of this.relations) {
      for (const [type, slug, scope = this.scope] of [r.from, r.to]) {
        if (scope === this.scope && !known.has(`${type}:${scope}:${slug}`)) {
          throw new Error(`Relation ${r.kind} vers une entrée absente : ${type} ${scope}/${slug}`);
        }
      }
      const key = JSON.stringify([r.from, r.to, r.kind]);
      if (written.has(key)) continue;
      written.add(key);
      lines.push(
        `INSERT INTO content_relation (from_id, to_id, kind, position, meta) VALUES (${this.ref(r.from)}, ${this.ref(r.to)}, ${q(r.kind)}, ${r.position ?? "NULL"}, ${j(r.meta)});`
      );
    }
    // Une entrée de cette portée que l'import ne produit plus est archivée
    // (jamais supprimée : une fiche peut encore la citer).
    const keep = this.entries.filter((e) => e.scope === this.scope).map((e) => `(${q(e.type)}, ${q(e.slug)})`);
    lines.push(
      `UPDATE content_entry SET status = 'archived', updated_at = now() WHERE scope = ${q(this.scope)} AND status <> 'archived'` +
        (keep.length ? ` AND (type, slug) NOT IN (${keep.join(", ")});` : ";")
    );
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
