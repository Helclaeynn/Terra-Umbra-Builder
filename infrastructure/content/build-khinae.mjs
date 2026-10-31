// Génère infrastructure/content/khinae.sql : les descendants de Khinae en voies
// à paliers, d'après le lot 02 (docs/audit-game-design/lots/02-khinae.md), le
// lot 15 (talents du livre V6 rétablis) et les décisions 10 et B2.
//
//   node infrastructure/content/build-khinae.mjs
//
// Dix voies de Lignée (deux portes et un sommet) ; les Sangs vifs sont ceux du
// Garou (sangs-vifs.sql, décision 10) et portent aussi les identifiants
// khinae_blood_*. Les 30 talents du livre V6 absents du site reçoivent un
// identifiant neuf, khinae_<lignée>_<nom>.
import { truthCatalogKhinae } from "../../apps/api/src/rules/truth/catalog-khinae.ts";
import { applyKhinaeRevisions } from "../../apps/api/src/rules/truth/khinae-revision.ts";
import { truthRuntimeStructure } from "../../apps/api/src/rules/truth/runtime-structure.ts";
import { ContentSet, norm, parseLotVoies, readLot } from "./lib.mjs";

const nature = truthRuntimeStructure.natures.khinae;
const catalog = applyKhinaeRevisions(truthCatalogKhinae);
const lineageTalents = catalog.filter((t) => !t.id.startsWith("khinae_blood_"));
const option = (id) => nature.choices.find((c) => c.key === "lineage").options.find((o) => o.id === id);
const lot = readLot("02-khinae.md");
const set = new ContentSet("khinae");
const seen = new Set();
const slugify = (s) => norm(s).replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

const LIGNEES = {
  "Canidés errants": "canides_errants",
  "Renards libres": "renards",
  "Grands Félins": "grands_felins",
  Chats: "chats",
  Rapaces: "rapaces",
  Requins: "requins",
  Serpents: "serpents",
  Boudas: "boudas",
  Berserkirs: "berserkirs",
  Crocodiliens: "crocodiliens"
};
// Impulsion de Frénésie par Lignée (lot 02, Q4, recommandation B appliquée par défaut).
const IMPULSIONS = {
  canides_errants: "la poursuite",
  renards: "la fuite",
  grands_felins: "la proie isolée",
  chats: "l'issue",
  rapaces: "la proie vue d'en haut",
  requins: "le sang dans l'eau",
  serpents: "ce qui entre au contact",
  boudas: "la proie blessée de la Bande",
  berserkirs: "la menace contre un protégé",
  crocodiliens: "la proie au bord de l'eau"
};

const carte = lot.slice(lot.indexOf("## 2. Carte de Nature"), lot.indexOf("## 3. Les voies de Lignée")).replace(/^## .*\n/, "").trim();
set.entry("nature", "khinae", "Descendant de Khinae", {
  description: nature.description,
  carte,
  traits_gratuits: nature.baseFreeTraits,
  choix_creation: ["lignee", "variante", "sang_vif"],
  maitrise: "Les Sangs vifs suivent la règle du Garou : un Sang est maîtrisé quand ses deux portes sont au palier II ; éveil d'un autre Sang : 3 PTV.",
  cout_eveil: 3,
  droits_acquis: "Les talents achetés avant les voies restent acquis ; les règles de voie valent pour les achats suivants (décision 20)."
}, { summary: "L'espèce avant tout : une Lignée, sa Variante, un Sang vif partagé avec les Garous." });

set.entry("couche", "khinae_lignee", "Lignée", { gratuit: "Signature et Variante", choix: "unique_a_la_creation" });
set.entry("couche", "khinae_sang_vif", "Sang vif", { gratuit: null, choix: "unique_a_la_creation", eveil: "3 PTV une fois le Sang maîtrisé", partage: "Garous (décision 10)" });
for (const c of ["khinae_lignee", "khinae_sang_vif"]) set.relation(["couche", c], ["nature", "khinae"], "appartient_a");

const full = (x) => x.effectDetails ?? x.effect;

for (const v of parseLotVoies(lot)) {
  const entry = Object.entries(LIGNEES).find(([k]) => v.titre.startsWith(k));
  if (!entry) continue;
  const lignee = entry[1];
  const voie = `khinae_${lignee}`;
  set.entry("voie", voie, v.titre.split(" — ")[0], {
    forme: "deux_portes_sommet",
    verrou: "ordre_paliers",
    lignee,
    portes: v.portes,
    profil: v.profil.join("\n"),
    impulsion: IMPULSIONS[lignee],
    description: option(lignee)?.description ?? null,
    changements: v.changements
  });
  set.relation(["voie", voie], ["couche", "khinae_lignee"], "appartient_a");

  let position = 1;
  for (const t of v.talents) {
    const source = t.gratuit ? null : lineageTalents.find((c) => norm(c.name) === norm(t.nom) && c.id.startsWith(slugify(v.titre).slice(0, 6)));
    const id = source?.id ?? `khinae_${lignee}_${slugify(t.nom)}`;
    if (source) seen.add(source.id);
    const notes = [];
    if (t.livreV6) notes.push("Rétabli du livre V6 (chapitre 12), absent du site (lot 02, lot 15).");
    if (source && t.acces && source.access && !norm(source.access).startsWith(norm(t.acces).split(",")[0])) notes.push(`Accès ${source.access} → ${t.acces}.`);
    if (v.changements && norm(v.changements).includes(norm(t.nom))) notes.push(v.changements);
    set.entry("talent", id, t.nom, {
      cout: t.gratuit ? 0 : t.cout,
      cout_actuel: source?.cost ?? 0,
      palier: t.gratuit ? "signature" : t.palier,
      porte: t.porte,
      acces: t.acces ?? source?.access ?? null,
      activation: source?.activation ?? null,
      texte_court: t.texte,
      texte_reference: source ? full(source) : t.texte,
      lore: source?.runtimeLore ?? null,
      statut_regle: notes.length ? "correction" : "origine",
      changements: notes.join(" ") || null
    });
    set.relation(["talent", id], ["voie", voie], "appartient_a", t.gratuit ? 0 : position++);
  }
}

const missing = lineageTalents.map((t) => t.id).filter((id) => !seen.has(id));
if (missing.length) throw new Error(`Talents de Lignée non repris : ${missing.join(", ")}`);
const nouveaux = set.entries.filter((e) => e.type === "talent" && e.fields.changements?.startsWith("Rétabli")).length;
console.log(`${set.write("build-khinae.mjs", "./khinae.sql")} ; ${lineageTalents.length} talents de Lignée actuels repris, ${nouveaux} rétablis du livre V6.`);
