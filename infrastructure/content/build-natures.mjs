// Génère infrastructure/content/<nature>.sql pour les Natures sans générateur
// propre : Humains et Chasseurs (lot 03), Mage (04), Daemon (05), Angelus (06),
// Aseryn (07), Exilés (08), Extrals (09), et la Corruption (lot 12).
//
//   node --import ./infrastructure/content/ts-register.mjs infrastructure/content/build-natures.mjs
//
// Même règle que les autres générateurs : cartes courtes du lot, textes de
// référence servis par l'API (révisions comprises), chaque identifiant actuel
// gardé comme slug ou legacy_id. Les entrées du catalogue qu'un lot laisse
// hors des voies (moteur du Mage, règles de rang) restent des talents
// « hors voie » rattachés à la Nature. Les correspondances qui ne passent pas
// par le nom sont écrites ci-dessous, avec leur source dans le lot.
import { truthCoreRules } from "../../apps/api/src/rules/truth/core-rules.ts";
import { ContentSet, norm, parseLotVoies, readLot } from "./lib.mjs";

const slugify = (s) => norm(s).replace(/^\d+(\.\d+)*\s*/, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const cleanTitle = (s) => s.replace(/^\d+(\.\d+)*\s*/, "").trim();

const NATURES = {
  humain: { lot: "03-humains-chasseurs.md", titre: "Humain conscient" },
  mage: {
    lot: "04-mage.md",
    titre: "Mage",
    // Lot 04 : Décharge contrôlée et Ancrage du Mageius fusionnés au palier II ;
    // Sort reçu = deux variantes du palier II, coût inchangé (2 PTV chacune).
    fusions: { "tenir le conduit": ["Décharge contrôlée", "Ancrage du Mageius"] },
    variantes: { "sort recu": ["Résonance héritée", "Héritage familial"] },
    // Le moteur de sorts (non modifié, lot 04) fabrique ses identifiants par
    // Affinité (apps/web/src/lib/truth.ts, mageProgression et mageAllTalents) :
    // mage_<affinité>_<palier>, mage_awaken_<affinité>, mage_accord_…, mage_traversee_….
    moteur: (structure) => {
      const choice = structure.choices.find((c) => c.key === "dominantAffinity");
      const affinites = Object.values(choice.optionsBy).flat().map((o) => o.id);
      const paliers = { maitrise_affinee: "mastery_affinee", maitrise_superieure: "mastery_superieure", maitrise_magistrale: "mastery_magistrale", amplitude_significative: "amplitude_significative", amplitude_majeure: "amplitude_majeure", amplitude_cataclysmique: "amplitude_cataclysmique" };
      return {
        legacy: (t) => {
          const suffix = Object.entries(paliers).find(([k]) => t.id.endsWith(k))?.[1];
          return suffix ? affinites.map((a) => `mage_${a}_${suffix}`) : [];
        },
        extras: [
          ["mage_eveil_affinite", "Éveiller une Affinité", 1, "Éveille une Affinité en Maîtrise Initiale / Amplitude Mineure (moteur de sorts).", affinites.map((a) => `mage_awaken_${a}`)],
          ["mage_accord_adjacent", "Accord adjacent", 3, "Ouvre une Affinité d'un Mageius voisin sur la Roue (moteur de sorts).", affinites.map((a) => `mage_accord_${a}`)],
          ["mage_traversee_roue", "Traversée de la Roue", 2, "Ouvre une Affinité d'un Mageius à deux pas sur la Roue, après un Accord (moteur de sorts).", affinites.map((a) => `mage_traversee_${a}`)]
        ]
      };
    }
  },
  daemon: {
    lot: "05-daemon.md",
    titre: "Daemon",
    // Lot 05 : Ancrage de l'Élu et Résonance profonde fusionnés (Âme élue II) ;
    // Mauvais présage renommé Présage funeste.
    fusions: { "lien divin": ["Ancrage de l’Élu", "Résonance profonde"] },
    renommages: { "presage funeste": "Mauvais présage" }
  },
  angelus: { lot: "06-angelus.md", titre: "Angelus" },
  aseryn: { lot: "07-aseryn.md", titre: "Aseryn" },
  exile: {
    lot: "08-exiles.md",
    titre: "Exilé",
    renommages: {
      "transition en chaine": "Transition’en chaîne",
      "bloquer (hdb)": "HDB - Hologram Distorsion Block",
      "punir (hdp)": "HDP - Hologram Distorsion Punishment"
    }
  },
  corruption: {
    lot: "12-corruption-fleaux.md",
    titre: "Corruption",
    rootType: "regle",
    catalog: async () => (await import("../../apps/api/src/rules/truth/corruption.ts")).corruptionTalents,
    champs: (t) => ({ kind: t.kind, profondeur: t.depth || null, source: t.sourceId, famille: t.family, prerequis_texte: t.prerequisiteName || null })
  },
  extral: {
    lot: "09-extrals.md",
    titre: "Extral",
    // Lot 09 : Ventouses devient le texte du trait Quadrimanie rocréenne (−1 PTV).
    traitsFusionnes: { Ventouses: { titre: "Quadrimanie rocréenne (Ventouses)", voie: "Glandes rocréennes" } }
  }
};

const FORMES = [
  [/progression/i, "progression"],
  [/deux portes|2 portes/i, "deux_portes"],
  [/une porte|1 porte/i, "une_porte"],
  [/dons/i, "dons"]
];
const forme = (s) => (s ? FORMES.find(([re]) => re.test(s))?.[1] ?? s : null);
const full = (x) => x.effectDetails ?? x.effect;

const resume = [];
for (const [scope, conf] of Object.entries(NATURES)) {
  const catalog = conf.catalog ? await conf.catalog() : truthCoreRules.catalogs[scope];
  const structure = truthCoreRules.structure.natures[scope];
  const byName = new Map(catalog.map((t) => [norm(t.name), t]));
  const named = (name) => {
    const t = byName.get(norm(name));
    if (!t) throw new Error(`${scope} : « ${name} » absent du catalogue`);
    return t;
  };
  const lot = readLot(conf.lot);
  const voies = parseLotVoies(lot);
  const set = new ContentSet(scope);
  const seen = new Set();
  const slugs = new Set();
  const unique = (base) => {
    let s = base.slice(0, 80);
    for (let i = 2; slugs.has(s); i++) s = `${base.slice(0, 76)}_${i}`;
    slugs.add(s);
    return s;
  };

  // Carte de Nature : la section « ## … Carte de Nature … » du lot, telle quelle.
  const start = lot.search(/^## [^\n]*Carte de Nature/m);
  const end = start >= 0 ? lot.indexOf("\n## ", start + 3) : -1;
  const carte = start >= 0 ? lot.slice(start, end > 0 ? end : undefined).replace(/^## .*\n/, "").trim() : null;
  set.entry(conf.rootType ?? "nature", scope, structure?.name ?? conf.titre, {
    description: structure?.description ?? null,
    carte,
    traits_gratuits: structure?.baseFreeTraits ?? [],
    droits_acquis: "Les talents achetés avant les voies restent acquis ; les règles de voie valent pour les achats suivants (décision 20)."
  });
  slugs.add(scope);

  // Couches : une par chemin de titres au-dessus des voies (tradition, peuple,
  // Fonction, Divinité…). Une voie sans parent va dans « Voies ».
  const couches = new Map();
  const couche = (path) => {
    const key = path.join(" > ") || "Voies";
    if (!couches.has(key)) {
      const slug = unique(`${scope}_${slugify(path.at(-1) ?? "voies")}`);
      set.entry("couche", slug, cleanTitle(path.at(-1) ?? "Voies"), { chemin: path.map(cleanTitle) });
      const parent = path.length > 1 ? couche(path.slice(0, -1)) : null;
      set.relation(["couche", slug], parent ? ["couche", parent] : [conf.rootType ?? "nature", scope], "appartient_a");
      couches.set(key, slug);
    }
    return couches.get(key);
  };

  function addTalent(t, from, position, changements) {
    const nom = norm(t.nom);
    let sources;
    let titre = t.nom;
    if (conf.fusions?.[nom]) sources = conf.fusions[nom].map(named);
    else if (conf.renommages?.[nom]) sources = [named(conf.renommages[nom])];
    else if (t.gratuit) sources = [];
    else sources = [named(t.nom)];

    const [main, ...legacy] = sources;
    const id = main?.id ?? unique(`${scope}_${slugify(t.nom)}`);
    if (main && seen.has(main.id)) {
      set.relation(["talent", id], from, "appartient_a", position);
      return;
    }
    sources.forEach((s) => seen.add(s.id));
    slugs.add(id);
    const notes = [];
    const coutActuel = sources.reduce((a, s) => a + (s.cost ?? 0), 0);
    if (!t.gratuit && sources.length && t.cout !== coutActuel) notes.push(`Coût ${coutActuel} → ${t.cout}.`);
    if (legacy.length) notes.push(`Fusion de ${sources.map((s) => s.name).join(" et ")}.`);
    if (conf.renommages?.[nom]) notes.push(`${main.name} renommé ${t.nom}.`);
    if (changements && norm(changements).includes(nom)) notes.push(changements);
    set.entry("talent", id, titre, {
      cout: t.gratuit ? 0 : t.cout,
      cout_actuel: coutActuel,
      palier: t.gratuit ? slugify(t.label.split(" ")[0]) : t.palier,
      porte: t.porte,
      palier_double: t.palierDouble,
      acces: t.acces ?? main?.access ?? null,
      activation: main?.activation ?? null,
      texte_court: t.texte,
      texte_reference: sources.length ? sources.map(full).join("\n") : t.texte,
      lore: main?.runtimeLore ?? null,
      groupe_actuel: main?.group ?? null,
      ...(main && conf.champs ? conf.champs(main) : {}),
      statut_regle: notes.length ? "correction" : "origine",
      changements: notes.join(" ") || null
    }, { legacy_ids: legacy.map((s) => s.id) });
    set.relation(["talent", id], from, "appartient_a", position);
    if (main?.prerequisite && main.prerequisite !== id) set.relation(["talent", id], ["talent", main.prerequisite], "prerequis");
  }

  const withTalents = voies.filter((v) => v.talents.length);
  const holders = new Set(voies.filter((v) => v.inline).map((v) => v.parent));
  let nVoies = 0;
  for (const v of withTalents) {
    // Un titre qui ne porte que des dons gratuits et chapeaute des voies en
    // ligne (Fonction ou Divinité du Daemon) est une couche, pas une voie.
    if (holders.has(v.titre) && !v.inline && v.talents.every((t) => t.gratuit)) {
      const c = couche([...v.parents, v.titre]);
      v.talents.forEach((t) => addTalent(t, ["couche", c], 0, v.changements));
      continue;
    }
    const c = couche(v.parents);
    const slug = unique(`${scope}_${slugify([v.parents.at(-1) ?? "", v.titre].join(" "))}`);
    set.entry("voie", slug, cleanTitle(v.titre), {
      forme: forme(v.forme),
      forme_lot: v.forme,
      verrou: "ordre_paliers",
      portes: Object.keys(v.portes).length ? v.portes : null,
      identite: v.identite ?? null,
      profil: v.profil.length ? v.profil.join("\n") : null,
      changements: v.changements
    });
    set.relation(["voie", slug], ["couche", c], "appartient_a");
    nVoies++;
    let position = 1;
    for (const t of v.talents) {
      if (t.label.startsWith("Socle")) continue; // repris de la carte de Nature
      const variantes = conf.variantes?.[norm(t.nom)];
      if (variantes) {
        for (const name of variantes) addTalent({ ...t, nom: name, texte: `${t.texte} (${name})` }, ["voie", slug], position++, v.changements);
        continue;
      }
      addTalent(t, ["voie", slug], t.gratuit ? 0 : position++, v.changements);
    }
  }

  // Ventouses (Extrals) : fondu dans un trait gratuit, identifiant gardé.
  for (const [name, def] of Object.entries(conf.traitsFusionnes ?? {})) {
    const src = named(name);
    seen.add(src.id);
    const voie = set.entries.find((e) => e.type === "voie" && e.title === def.voie);
    set.entry("talent", src.id, def.titre, {
      cout: 0, cout_actuel: src.cost, palier: "trait", porte: null, acces: src.access,
      texte_court: null, texte_reference: full(src), statut_regle: "correction",
      changements: `${name} devient le texte d'un trait gratuit (lot 09, −${src.cost} PTV).`
    });
    if (voie) set.relation(["talent", src.id], ["voie", voie.slug], "appartient_a", 0);
    else set.relation(["talent", src.id], [conf.rootType ?? "nature", scope], "appartient_a");
  }

  // Entrées du catalogue laissées hors des voies par le lot.
  const moteur = conf.moteur?.(structure);
  const horsVoie = catalog.filter((t) => !seen.has(t.id));
  for (const t of horsVoie) {
    set.entry("talent", t.id, t.name, {
      cout: t.cost, cout_actuel: t.cost, palier: null, porte: null, hors_voie: true,
      acces: t.access, activation: t.activation ?? null, texte_court: t.effect, texte_reference: full(t),
      lore: t.runtimeLore ?? null, groupe_actuel: t.group ?? null, statut_regle: "origine",
      changements: "Laissé hors des voies par le lot (moteur, maîtrise ou rang)."
    }, { legacy_ids: moteur?.legacy(t) ?? [] });
    set.relation(["talent", t.id], [conf.rootType ?? "nature", scope], "appartient_a");
  }
  for (const [id, titre, cout, texte, legacy] of moteur?.extras ?? []) {
    set.entry("talent", id, titre, {
      cout, cout_actuel: cout, palier: null, porte: null, hors_voie: true, moteur: true,
      texte_court: texte, texte_reference: texte, statut_regle: "origine",
      changements: "Entrée du moteur de sorts, fabriquée par Affinité côté site (lot 04 : moteur non modifié)."
    }, { legacy_ids: legacy });
    set.relation(["talent", id], ["nature", scope], "appartient_a");
  }

  // Un prérequis peut viser un identifiant fusionné : on le redirige vers
  // l'entrée qui le porte en legacy_ids, et on écarte un lien sans cible.
  const target = new Map();
  for (const e of set.entries) {
    target.set(`${e.type}:${e.slug}`, e.slug);
    for (const l of e.legacy_ids ?? []) target.set(`${e.type}:${l}`, e.slug);
  }
  set.relations = set.relations.filter((r) => {
    const key = `${r.to[0]}:${r.to[1]}`;
    if (!target.has(key)) return false;
    r.to = [r.to[0], target.get(key), ...r.to.slice(2)];
    return r.to[1] !== r.from[1] || r.to[0] !== r.from[0];
  });

  const out = set.write("build-natures.mjs", `./${scope}.sql`);
  resume.push(`${out} ; ${catalog.length} talents actuels repris (${horsVoie.length} hors voie : ${horsVoie.map((t) => t.name).join(", ") || "aucun"}).`);
  if (nVoies === 0) throw new Error(`${scope} : aucune voie lue dans ${conf.lot}`);
}
console.log(resume.join("\n"));
