// Génère infrastructure/content/vampire.sql : le Vampire en voies à paliers
// (docs/audit-game-design : page vampire-voies, lot 16, clôture du 29/10 et
// corrections du 30/10), dans les tables content_*.
//
//   node infrastructure/content/build-vampire.mjs
//
// Les textes de référence sont ceux que l'API sert aujourd'hui (le site fait
// foi, A1). Les cartes courtes ne sont remplies que là où un lot les a écrites.
// Chaque identifiant de talent actuel reste un slug, ou un legacy_id en cas de
// fusion : les fiches existantes se lisent sans conversion.
import { writeFileSync } from "node:fs";
import { truthCatalogVampire } from "../../apps/api/src/rules/truth/catalog-vampire.ts";
import { truthRuntimeStructure } from "../../apps/api/src/rules/truth/runtime-structure.ts";

const nature = truthRuntimeStructure.natures?.vampire ?? findNature(truthRuntimeStructure, "vampire");
const catalog = new Map(truthCatalogVampire.map((t) => [t.id, t]));
const option = (key, id) => nature.choices.find((c) => c.key === key).options.find((o) => o.id === id);
const empreinte = (court) => nature.freeTraitRules.find((r) => r.when.court === court).traits[0];

function findNature(tree, id) {
  const stack = [tree];
  while (stack.length) {
    const node = stack.pop();
    if (node && typeof node === "object") {
      if (node.id === id && node.choices) return node;
      stack.push(...Object.values(node));
    }
  }
  throw new Error(`Nature introuvable : ${id}`);
}

// ---------------------------------------------------------------- structure

const COURS = {
  krovni_rytsari: { forme: "une_porte", empreinte: "predateur_de_guerre", talents: ["presence_du_conquerant", "maitre_de_guerre", "ordre_imperieux"] },
  alghul_almalakiu: { forme: "une_porte", empreinte: "echo_des_morts", talents: ["sang_memoriel", "interroger_les_restes", "sang_preserve"] },
  oru_ayeraye: { forme: "une_porte", empreinte: "enfant_des_tenebres", talents: ["marche_dans_les_ombres", "ombre_predatrice", "lien_du_deimon"] },
  ihuito_meztzi: { forme: "une_porte", empreinte: "cycle_du_sang", talents: ["sang_exalte", "offrande_sanglante", "sang_du_dieu"] },
  shi_hun_zhe: { forme: "progression", empreinte: "equilibre_derobe", talents: ["souffle_du_yang", "harmonie_impossible", "union_du_hun_et_du_po"] }
};

// Sangs à deux portes : [porte A, porte B], chaque porte = paliers I puis II.
const SANGS = {
  sang_ecarlate: { identite: "chasser par le sang", portes: [["Le sang", "vision_du_sang", "traque_hematique"], ["La fureur", "deferlement_ecarlate", "surregime"]] },
  sang_primal: { identite: "changer de corps", portes: [["La bête", "forme_animale", "menagerie"], ["La brume", "corps_de_brume", "brume_etouffante"]] },
  sang_hypocrite: { identite: "tromper les sens", portes: [["Les doubles", "double_tenebreux", "double_autonome"], ["Les illusions", "fantasmagorie", "grande_illusion"]] },
  sang_venimeux: { identite: "empoisonner", portes: [["Le venin", "venin_noir", "venins_faconnes", "effluves_toxiques"], ["La chaleur", "vision_thermique"]] },
  sang_masque: { identite: "voler une identité", portes: [["Le visage", "visage_vole", "mue_complete"], ["La voix", "voix_volee", "mimetisme_parfait"]] },
  sang_aveugle: { identite: "percevoir sans voir", portes: [["L'écho", "echolocation", "sonar_predateur"], ["L'astral", "vision_astrale", "projection_astrale"]] },
  sang_traqueur: { identite: "disséquer la proie", portes: [["L'anatomie", "diagnostic_predateur", "anatomie_fatale"], ["Le sang animé", "sang_anime", "arme_hematique"]] },
  sang_glacial: { identite: "contrôler", portes: [["Le toucher", "toucher_glacial", "gel_brutal"], ["Le froid", "devorer_la_chaleur", "hiver_noir"]] },
  sang_ardent: { identite: "consumer", portes: [["La brûlure", "toucher_ardent", "marque_incandescente"], ["Le feu", "embrasement", "fournaise"]] },
  sang_orageux: { identite: "désorganiser", portes: [["La décharge", "decharge_orageuse", "surcharge_nerveuse"], ["La brume", "brume_electrostatique", "arc_orageux"]] },
  sang_revelateur: { identite: "lire les esprits", portes: [["Les pensées", "lecture_superficielle", "lecture_profonde"], ["La vérité", "sang_de_verite", "dissipation_revelatrice"]] }
};

// ------------------------------------------------- textes et changements des lots

const PALIER_COUT = { I: 1, II: 2, III: 3 };

// Cartes courtes écrites par les lots (page vampire-voies, lot 16, vampire-voies-progression).
const CARTES = {
  // Emprise
  charme_inhumain: "Une Fascination réussie rend aussi la cible confiante : +3 aux interactions sociales avec elle jusqu'à la fin de la scène, tant que ton comportement ne brise pas l'emprise.",
  domination: "En Révélé, une Fascination à DR 2+ peut aussi imposer un geste bref, exécuté avant la fin du prochain round de la cible. Elle paie normalement ses actions ; +3 pour résister à un ordre suicidaire ou contraire à une conviction fondamentale. Domination est intime : une cible, en tête-à-tête.",
  somnambulisme: "L'emprise atteint le sommeil. Pour 2 PA, au contact d'une cible endormie, implanter une instruction simple et son déclencheur, valables le scénario.",
  // Stase
  stase_profonde: "En Stase, 2 PV par heure, et les blessures ne s'aggravent plus d'elles-mêmes.",
  dernier_sommeil: "Réaction, 1/scénario : une blessure qui franchirait le seuil de Mort laisse juste au-dessus et plonge en Stase.",
  // Prédateur (fusions)
  faveur_de_la_nuit: "Chasseur nocturne : +3 Furtivité dans l'ombre et +3 Perception pour traquer une créature vivante ou blessée.",
  regeneration_de_sang: "Corps maudit : la Prédation rend 2 + DR PV au lieu de 1 + DR, et +3 Constitution contre poisons et drogues.",
  // Shi Hun Zhe
  souffle_du_yang: "Après une Prédation dans la scène, 1 PA, 1/scène : ignorer une faiblesse jusqu'à la fin du prochain round.",
  harmonie_impossible: "L'effet dure la scène ; dégâts de la faiblesse divisés par deux. Contre un effet automatique sans dégâts : Volonté + Force Mentale contre sa Puissance.",
  union_du_hun_et_du_po: "1 PA, 1/scénario, après une Prédation dans la scène : annuler une malédiction pour la scène, y compris le Soleil.",
  // Krovni : ressorts propres (Q6)
  presence_du_conquerant: "Le rang écrase : la cible est Tendue et ne peut pas attaquer le Krovni en premier ce round, sauf si elle est elle-même noble ou officier.",
  ordre_imperieux: "Ordre martial : sur un ennemi Tendu ou un subordonné, un ordre de combat (reculer, lâcher, se jeter à terre).",
  // Primal : ressort propre (Q6)
  corps_de_brume: "Se dissoudre : en plus du +3, finir son mouvement à 3 m, à travers une fente ou une grille.",
  // Sang Condamné
  faim_condamnee: "1 PA, 10 m, Volonté + Force Mentale contre Défense occulte, drain DGT 3 ; récupère jusqu'à 1 + DR PV.",
  faim_magique: "Réaction 1 PA contre une manifestation offensive ; réduit ses DGT de 3 + DR, annule un effet sans dégâts à DR 3+.",
  changement_de_corps: "1/scénario, après une heure, se transférer dans un hôte humain.",
  // Lot 16
  decharge_orageuse: "Une attaque de contact payée normalement inflige DGT 3 électriques ; une blessure réelle impose −3 au prochain test de coordination ou de concentration de la cible avant la fin de son prochain round (1/round).",
  surcharge_nerveuse: "La Décharge inflige DGT 5 ; sur une blessure réelle à DR 3+, la cible perd 1 PA à sa prochaine activation (minimum 1). Aucun arrêt cardiaque automatique.",
  brume_electrostatique: "1 PA, maintien 1 PA/round : une brume de 5 m de rayon. Elle porte la Décharge orageuse à distance contre une cible visible dans la zone (Volonté + Force Mentale contre sa Défense physique) ; chaque attaque reste payante.",
  arc_orageux: "2 PA : jusqu'à trois cibles dans la brume, à 3 m au plus l'une de l'autre. Le même jet est comparé à chaque Défense physique ; DGT 3 électriques à chacune, sans la perte de PA de Surcharge nerveuse.",
  toucher_glacial: "Une attaque de contact payée normalement inflige DGT 3 ; une blessure réelle impose −3 au prochain test physique de la cible avant la fin de son prochain round (1/round).",
  gel_brutal: "2 PA, au contact, DGT 6 ; une blessure réelle divise le Déplacement par deux jusqu'à la fin du prochain round de la cible. Peut aussi geler un mécanisme exposé ou un petit objet.",
  devorer_la_chaleur: "1 PA, maintien 1 PA/round : zone de froid de 3 m de rayon. À l'entrée, puis à chaque activation dans la zone, Vigueur + Constitution contre la Puissance ; en échec, −3 aux tests moteurs tant que la cible y reste.",
  hiver_noir: "Le rayon passe à 6 m et un échec divise aussi le Déplacement par deux (sans cumul de ralentissements). Hors combat, dix minutes gèlent l'eau de surface ou des mécanismes ordinaires exposés.",
  toucher_ardent: "Une attaque de contact payée normalement inflige DGT 5 thermiques, soumis aux protections adaptées ; une matière réellement combustible peut s'enflammer.",
  marque_incandescente: "1/round, après une blessure réelle du Toucher ardent, la cible est marquée : 2 PV thermiques au début de ses deux prochaines activations. Protections thermiques appliquées ; pas de cumul de marques.",
  embrasement: "1 PA : à 10 m, enflamme jusqu'à un litre de matière combustible visible. N'enflamme pas d'office un être vivant.",
  fournaise: "2 PA, maintien 1 PA/round : zone de 3 m de rayon ; chaque créature présente au début de son activation subit 2 PV thermiques, alliés compris, protections adaptées appliquées.",
  venin_noir: "Pour 1 PA, une dose dans tes fluides ; elle agit par morsure blessante, ingestion ou plaie ouverte. Vigueur + Constitution contre la Puissance ; en échec, −3 aux tests physiques pour la scène, sans cumul de doses.",
  venins_faconnes: "À la préparation, choisis un venin affaiblissant, un soporifique (endort après une minute hors combat) ou un paralysant (−3 aux tests moteurs et demi-Déplacement jusqu'à la fin du prochain round de la cible).",
  effluves_toxiques: "2 PA, maintien 1 PA/round : le venin choisi se diffuse dans un rayon de 3 m. Toute créature qui respire, alliés compris, résiste à l'entrée puis à sa prochaine activation si elle reste ; une réussite la protège pour le round.",
  vision_thermique: "À 20 m, tu perçois les contrastes thermiques dans l'obscurité et les fumées non isolantes. Murs, vitres et écrans thermiques restent des obstacles.",
  visage_vole: "1 PA : pour la scène, tu prends le visage d'une personne dont tu as bu le sang. Ni corps, ni voix, ni connaissances, ni capacités.",
  mue_complete: "Avec le même PA, tu copies aussi le corps visible, à 25 % près de taille et de masse. Ni statistiques, ni équipement, ni aptitudes.",
  voix_volee: "Sans PA de plus pour parler, tu reproduis fidèlement la voix d'une personne dont tu as bu le sang. Une analyse acoustique ou une observation attentive garde son test de détection.",
  mimetisme_parfait: "Ta voix copiée trompe d'office la reconnaissance vocale ordinaire et les proches de la personne. Une contradiction de connaissances ou de comportement peut toujours te trahir ; aucun souvenir ni secret acquis."
};

// Changements par rapport au site actuel. statut : correction (appliquée par
// les lots) ou proposition (écrite sur la page, jamais tranchée).
const CHANGEMENTS = {
  domination: ["correction", "Plus de jet séparé (Charisme + Autorité, 10 m) : se déclenche sur la Fascination à DR 2+."],
  somnambulisme: ["correction", "Coût 2 → 3 (palier III)."],
  ordre_imperieux: ["correction", "Coût 2 → 3 (palier III) ; ressort martial (Q6)."],
  lien_du_deimon: ["correction", "Coût 2 → 3 (palier III)."],
  maitre_de_guerre: ["correction", "Passe au palier II, avant Ordre impérieux."],
  presence_du_conquerant: ["correction", "Ressort propre du Krovni (Q6)."],
  corps_de_brume: ["correction", "Ressort propre du Vampire (Q6)."],
  faveur_de_la_nuit: ["correction", "Fusion avec Sens du chasseur (Prédateur I)."],
  regeneration_de_sang: ["correction", "Fusion avec Insensibilité améliorée (Prédateur II)."],
  toucher_ardent: ["origine", "DGT 5 rétabli (lot 16)."],
  deferlement_ecarlate: ["proposition", "1/scène au lieu de 1/round : proposition de la page, non tranchée."],
  arme_hematique: ["proposition", "Réduire la portée (DGT 5 à 20 m sans équipement) : proposition de la page, non tranchée."],
  enfant_des_tenebres: ["correction", "L'effet cesse dès qu'il attaque ou agit contre quelqu'un (clôture du 29/10, Q3)."],
  cycle_du_sang: ["correction", "La réduction de 1 PA vaut pour le premier talent de Sang de chaque round jusqu'à la fin de la scène (clôture du 29/10, Q3)."]
};

const FUSIONS = { faveur_de_la_nuit: "sens_du_chasseur", regeneration_de_sang: "insensibilite_amelioree" };

// ---------------------------------------------------------------- assemblage

const entries = [];
const relations = [];
const seen = new Set();

function entry(type, slug, title, fields, extra = {}) {
  entries.push({ type, slug, title, fields: { nature: "vampire", ...fields }, ...extra });
}
function relation(fromType, from, toType, to, kind, position = null, meta = {}) {
  relations.push({ fromType, from, toType, to, kind, position, meta });
}

function talentFromCatalog(id, voie, palier, porte, position, more = {}) {
  const t = catalog.get(id);
  if (!t) throw new Error(`Talent absent du catalogue : ${id}`);
  seen.add(id);
  const legacy = FUSIONS[id];
  let reference = t.effect;
  if (legacy) {
    seen.add(legacy);
    reference = `${t.effect}\n${catalog.get(legacy).effect}`;
  }
  const [statut, note] = CHANGEMENTS[id] ?? ["origine", null];
  const cout = more.cout ?? PALIER_COUT[palier];
  entry("talent", id, legacy ? `${t.name} et ${catalog.get(legacy).name}` : t.name, {
    cout,
    cout_actuel: t.cost,
    palier,
    porte,
    palier_double: more.palier_double ?? null,
    acces: t.access,
    texte_court: CARTES[id] ?? null,
    texte_reference: reference,
    lore: t.runtimeLore ?? null,
    statut_regle: statut,
    changements: note
  }, { legacy_ids: legacy ? [legacy] : [], status: statut === "proposition" ? "review" : "published" });
  relation("talent", id, "voie", voie, "appartient_a", position);
  if (t.prerequisite && t.prerequisite !== "echo_des_morts") relation("talent", id, "talent", t.prerequisite, "prerequis");
  if (t.prerequisite === "echo_des_morts") relation("talent", id, "talent", "echo_des_morts", "prerequis");
}

// Nature
entry("nature", "vampire", "Vampire", {
  description: nature.description,
  etats: {
    V: "Corps humain, aucun bonus. Rester Voilé trop longtemps fait vieillir (Petite immortalité).",
    SR: "+1 Vigueur, +1 Volonté. Sens prédateurs ; Fascination (1 PA).",
    R: "+2 Vigueur, +1 Volonté. Prédation (1 PA), Stase (2 PA), Effacement, Physiologie maudite."
  },
  traits_gratuits: nature.baseFreeTraits,
  malediction: "Au soleil direct, 2 PV irréductibles par round. Âme condamnée : à la mort véritable, le Néant.",
  choix_creation: ["cour", "sang_noir"],
  maitrise: "Un Sang est maîtrisé après 4 PTV investis (règle de la carte Vampire) ; on peut alors éveiller un autre Sang.",
  cout_eveil: 3,
  faim: false
}, { summary: "Prédateur maudit : une Cour, un Sang noir, des voies communes.", status: "published" });

// Couches
entry("couche", "vampire_cour", "Cour d'origine", { gratuit: "Empreinte", choix: "unique_a_la_creation" }, { status: "published" });
entry("couche", "vampire_sang_noir", "Sang noir", { gratuit: null, choix: "unique_a_la_creation", eveil: "3 PTV une fois un Sang maîtrisé" }, { status: "published" });
entry("couche", "vampire_voies_communes", "Voies communes", { gratuit: null, choix: "cumulable" }, { status: "published" });
for (const c of ["vampire_cour", "vampire_sang_noir", "vampire_voies_communes"]) relation("couche", c, "nature", "vampire", "appartient_a");

// Voies de Cour
for (const [court, def] of Object.entries(COURS)) {
  const voie = `vampire_cour_${court}`;
  const opt = option("court", court);
  entry("voie", voie, opt.name, { forme: def.forme, verrou: "ordre_paliers", cour: court, description: opt.description }, { status: "published" });
  relation("voie", voie, "couche", "vampire_cour", "appartient_a");
  const e = empreinte(court);
  const [statut, note] = CHANGEMENTS[def.empreinte] ?? ["origine", null];
  entry("talent", def.empreinte, e.name, {
    cout: 0, palier: "empreinte", porte: null, acces: e.access,
    texte_court: null, texte_reference: e.effect, statut_regle: statut, changements: note
  }, { status: "published" });
  relation("talent", def.empreinte, "voie", voie, "appartient_a", 0);
  def.talents.forEach((id, i) => talentFromCatalog(id, voie, ["I", "II", "III"][i], null, i + 1));
}

// Voies communes
const COMMUNES = [
  ["vampire_emprise", "Emprise", "progression", "Fascination (carte de Nature)", [["charme_inhumain", "I"], ["domination", "II"], ["somnambulisme", "III"]]],
  ["vampire_predateur", "Prédateur", "une_porte", null, [["faveur_de_la_nuit", "I"], ["regeneration_de_sang", "II"]]],
  ["vampire_stase", "Stase", "progression", "Stase (carte de Nature)", [["stase_profonde", "I"], ["dernier_sommeil", "II", { cout: 3 }]]]
];
for (const [voie, titre, forme, socle, talents] of COMMUNES) {
  entry("voie", voie, titre, { forme, verrou: "ordre_paliers", socle }, { status: "published" });
  relation("voie", voie, "couche", "vampire_voies_communes", "appartient_a");
  talents.forEach(([id, palier, more], i) => talentFromCatalog(id, voie, palier, null, i + 1, more));
}

// Sangs noirs
for (const [blood, def] of Object.entries(SANGS)) {
  const voie = `vampire_${blood}`;
  const opt = option("blood", blood);
  entry("voie", voie, opt.name, {
    forme: "deux_portes", verrou: "ordre_paliers", identite: def.identite, sang: blood,
    portes: { A: def.portes[0][0], B: def.portes[1][0] }, description: opt.description
  }, { status: "published" });
  relation("voie", voie, "couche", "vampire_sang_noir", "appartient_a");
  let position = 1;
  def.portes.forEach(([, ...ids], p) => {
    ids.forEach((id, i) => {
      const palier = i === 0 ? "I" : "II";
      talentFromCatalog(id, voie, palier, p === 0 ? "A" : "B", position++, i === 2 ? { palier_double: "b" } : {});
    });
  });
}

// Sang Condamné : une porte et un sommet, plus l'entrée Semi-Révélée (clôture Q4).
{
  const voie = "vampire_sang_condamne";
  const opt = option("blood", "sang_condamne");
  entry("voie", voie, opt.name, {
    forme: "une_porte", verrou: "ordre_paliers", identite: "dévorer la magie", sang: "sang_condamne", description: opt.description
  }, { status: "published" });
  relation("voie", voie, "couche", "vampire_sang_noir", "appartient_a");
  [["faim_condamnee", "I"], ["faim_magique", "II"], ["changement_de_corps", "III"]].forEach(([id, palier], i) => talentFromCatalog(id, voie, palier, null, i + 1));
  entry("talent", "sens_de_la_magie", "Sens de la magie", {
    cout: 1, palier: "I", porte: null, entree_alternative: true, acces: "SR",
    texte_court: "Tu sens une magie active à 10 m : sa présence et sa direction, pas sa nature.",
    texte_reference: "Entrée Semi-Révélée optionnelle du Sang Condamné : perçoit à 10 m la présence et la direction d'une magie active, sans en connaître la nature.",
    statut_regle: "proposition", changements: "Nouveau talent (clôture du 29/10, Q4). Nom et place dans la voie à valider."
  }, { status: "review" });
  relation("talent", "sens_de_la_magie", "voie", voie, "appartient_a", 0);
}

// Tous les talents actuels doivent être repris.
const missing = [...catalog.keys()].filter((id) => !seen.has(id));
if (missing.length) throw new Error(`Talents non repris : ${missing.join(", ")}`);

// ---------------------------------------------------------------- SQL

const q = (s) => (s == null ? "NULL" : `'${String(s).replace(/'/g, "''")}'`);
const j = (v) => `${q(JSON.stringify(v))}::jsonb`;
const arr = (a) => (a.length ? `ARRAY[${a.map(q).join(",")}]::text[]` : "'{}'::text[]");
const ref = (type, slug) => `(SELECT id FROM content_entry WHERE type = ${q(type)} AND slug = ${q(slug)})`;

const lines = [
  "-- Généré par infrastructure/content/build-vampire.mjs : ne pas modifier à la main.",
  `-- ${entries.length} entrées, ${relations.length} relations.`,
  "BEGIN;",
  "DELETE FROM content_relation WHERE from_id IN (SELECT id FROM content_entry WHERE fields->>'nature' = 'vampire');"
];
for (const e of entries) {
  lines.push(
    `INSERT INTO content_entry (type, slug, title, summary, fields, status, legacy_ids, published_at) VALUES (` +
      `${q(e.type)}, ${q(e.slug)}, ${q(e.title)}, ${q(e.summary ?? null)}, ${j(e.fields)}, ${q(e.status ?? "published")}, ${arr(e.legacy_ids ?? [])}, ` +
      `${e.status === "review" ? "NULL" : "now()"}) ` +
      `ON CONFLICT (type, slug) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary, fields = EXCLUDED.fields, ` +
      `status = EXCLUDED.status, legacy_ids = EXCLUDED.legacy_ids, ` +
      `version = content_entry.version + CASE WHEN content_entry.fields IS DISTINCT FROM EXCLUDED.fields OR content_entry.title IS DISTINCT FROM EXCLUDED.title THEN 1 ELSE 0 END, ` +
      `updated_at = now();`
  );
}
for (const r of relations) {
  lines.push(
    `INSERT INTO content_relation (from_id, to_id, kind, position, meta) VALUES (${ref(r.fromType, r.from)}, ${ref(r.toType, r.to)}, ${q(r.kind)}, ${r.position ?? "NULL"}, ${j(r.meta)});`
  );
}
lines.push(
  "INSERT INTO content_revision (entry_id, version, snapshot, comment)",
  "SELECT e.id, e.version, to_jsonb(e) - 'id', 'Import Vampire (voies à paliers)'",
  "FROM content_entry e WHERE e.fields->>'nature' = 'vampire'",
  "ON CONFLICT (entry_id, version) DO NOTHING;",
  "COMMIT;",
  ""
);

const out = new URL("./vampire.sql", import.meta.url);
writeFileSync(out, lines.join("\n"));
const count = (type) => entries.filter((e) => e.type === type).length;
console.log(`vampire.sql : ${count("nature")} Nature, ${count("couche")} couches, ${count("voie")} voies, ${count("talent")} talents, ${relations.length} relations ; ${catalog.size} talents actuels tous repris.`);
