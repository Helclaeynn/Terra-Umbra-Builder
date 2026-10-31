// Configure Directus sur les tables de contenu (content_*) : collections en
// français, relations, éditeurs de champs. Rejouable sans effet de bord :
// chaque étape regarde ce qui existe avant d'écrire.
// Lancé par deploy-recette.sh avec DIRECTUS_URL, DIRECTUS_ADMIN_EMAIL et
// DIRECTUS_ADMIN_PASSWORD.
const base = process.env.DIRECTUS_URL;

async function api(method, path, body, token) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  return { ok: res.ok, status: res.status, data: json.data, errors: json.errors };
}

const login = await api("POST", "/auth/login", { email: process.env.DIRECTUS_ADMIN_EMAIL, password: process.env.DIRECTUS_ADMIN_PASSWORD });
if (!login.ok) throw new Error(`Connexion à Directus impossible : ${JSON.stringify(login.errors)}`);
const token = login.data.access_token;
const call = (method, path, body) => api(method, path, body, token);
const fr = (singular, plural = singular) => [{ language: "fr-FR", translation: plural, singular, plural }];

async function must(promise, what) {
  const r = await promise;
  if (!r.ok) throw new Error(`${what} : ${r.status} ${JSON.stringify(r.errors)}`);
  return r.data;
}

// ---------------------------------------------------------------- collections

const COLLECTIONS = {
  content_entry: {
    icon: "article", note: "Tout le contenu du jeu : articles, Natures, voies, talents, objets…",
    display_template: "{{title}} · {{type}}", translations: fr("Contenu", "Contenus"),
    archive_field: "status", archive_value: "archived", unarchive_value: "draft", sort_field: null
  },
  content_type: { icon: "category", note: "Types de contenu (talent, voie, article…)", display_template: "{{label}}", translations: fr("Type", "Types") },
  content_relation: { icon: "link", note: "Liens entre contenus : appartient à, prérequis, voir aussi…", display_template: "{{kind}}", translations: fr("Lien", "Liens"), hidden: false },
  content_revision: { icon: "history", note: "Historique des versions publiées par les imports", display_template: "v{{version}} · {{comment}}", translations: fr("Révision", "Révisions") },
  content_media: { icon: "image", note: "Images et documents liés aux contenus", display_template: "{{file_path}}", translations: fr("Média", "Médias") },
  content_tag: { icon: "sell", note: "Étiquettes et rubriques", display_template: "{{tag}}", translations: fr("Étiquette", "Étiquettes") },
  // Comptes du site : seulement pour cocher qui connaît la Vérité.
  users: {
    icon: "group", note: "Comptes du site. Décocher « Connaît la Vérité » pour les joueurs d'une campagne profane.",
    display_template: "{{display_name}} · {{email}}", translations: fr("Joueur", "Joueurs")
  }
};

for (const [collection, meta] of Object.entries(COLLECTIONS)) {
  const existing = await call("GET", `/collections/${collection}`);
  // Une table existante est déjà connue de Directus (sans réglages) : on la
  // modifie, ce qui crée ses réglages ; on ne crée que ce qui manque vraiment.
  if (existing.ok) await must(call("PATCH", `/collections/${collection}`, { meta }), `Collection ${collection}`);
  else await must(call("POST", "/collections", { collection, meta }), `Collection ${collection}`);
}

// ---------------------------------------------------------------- relations
// Les réglages des liens sont écrits par directus-relations.sql (l'API refuse
// de compléter un lien qui existe déjà dans la base) ; on recharge le cache de
// Directus pour qu'il les lise, puis on vérifie qu'ils sont bien là.

await must(call("POST", "/utils/cache/clear"), "Rechargement du cache de Directus");
const LIENS = [["content_entry", "type"], ["content_relation", "from_id"], ["content_relation", "to_id"], ["content_revision", "entry_id"], ["content_media", "entry_id"], ["content_tag", "entry_id"]];
for (const [collection, field] of LIENS) {
  const r = await call("GET", `/relations/${collection}/${field}`);
  if (!r.ok || !r.data?.meta) throw new Error(`Lien ${collection}.${field} sans réglages Directus : directus-relations.sql a-t-il tourné ?`);
}

// Champs « liens » côté contenu : les liens qui en partent et ceux qui y arrivent.
async function alias(collection, field, translation) {
  const existing = await call("GET", `/fields/${collection}/${field}`);
  if (existing.ok) return;
  await must(call("POST", `/fields/${collection}`, {
    field, type: "alias", schema: null,
    meta: { special: ["o2m"], interface: "list-o2m", translations: [{ language: "fr-FR", translation }] }
  }), `Champ ${collection}.${field}`);
}
await alias("content_entry", "liens_sortants", "Liens sortants");
await alias("content_entry", "liens_entrants", "Liens entrants");
await alias("content_entry", "revisions", "Révisions");

// ---------------------------------------------------------------- champs

const json = (translation, note) => ({ interface: "input-code", options: { language: "json", lineNumber: true }, translations: [{ language: "fr-FR", translation }], note });
const text = (translation, extra = {}) => ({ interface: "input", translations: [{ language: "fr-FR", translation }], ...extra });
const tags = (translation, note) => ({ interface: "tags", special: ["cast-json"], width: "full", translations: [{ language: "fr-FR", translation }], note });
const FIELDS = {
  content_entry: {
    title: text("Titre", { width: "half", required: true }),
    slug: text("Identifiant", { width: "half", note: "Identifiant stable : les fiches de personnage s'en servent. Ne pas le changer." }),
    scope: text("Portée", { width: "half", note: "La Nature ou le catalogue d'origine." }),
    type: { interface: "select-dropdown-m2o", options: { template: "{{label}}" }, width: "half", translations: [{ language: "fr-FR", translation: "Type" }] },
    status: {
      interface: "select-dropdown", width: "half", display: "labels",
      translations: [{ language: "fr-FR", translation: "Statut" }],
      note: "Seul le contenu publié est utilisé par le site.",
      options: { choices: [
        { text: "Brouillon", value: "draft" }, { text: "En relecture", value: "review" },
        { text: "Publié", value: "published" }, { text: "Archivé", value: "archived" }
      ] }
    },
    visibility: {
      interface: "select-dropdown", width: "half", translations: [{ language: "fr-FR", translation: "Visibilité" }],
      note: "Public : tout le monde. Vérité : joueurs qui connaissent la Vérité (et MJ). MJ : meneurs seulement.",
      options: { choices: [{ text: "Public", value: "public" }, { text: "Vérité", value: "verite" }, { text: "MJ", value: "gm" }] }
    },
    tags: tags("Étiquettes publiques", "Vues de tous."),
    tags_verite: tags("Étiquettes Vérité", "Vues des joueurs qui connaissent la Vérité et des MJ."),
    tags_mj: tags("Étiquettes MJ", "Vues des MJ seulement."),
    summary: { interface: "input-multiline", translations: [{ language: "fr-FR", translation: "Résumé" }] },
    body: json("Corps de l'article", "Blocs du texte (format du compendium)."),
    fields: json("Champs propres au type", "Coût, palier, porte, carte courte, texte de référence…"),
    // Liste PostgreSQL native (text[]) : Directus ne sait pas l'éditer, on l'affiche seulement.
    legacy_ids: { readonly: true, translations: [{ language: "fr-FR", translation: "Anciens identifiants" }], note: "Identifiants fondus dans cette entrée : les fiches qui les portent la retrouvent." },
    version: { readonly: true, width: "half", translations: [{ language: "fr-FR", translation: "Version" }] },
    id: { hidden: true, readonly: true },
    // Directus date chaque écriture : le site voit le changement et relit le contenu.
    created_at: { special: ["date-created"], readonly: true, width: "half", translations: [{ language: "fr-FR", translation: "Créé le" }] },
    updated_at: { special: ["date-updated"], readonly: true, width: "half", translations: [{ language: "fr-FR", translation: "Modifié le" }] },
    published_at: { readonly: true, width: "half", translations: [{ language: "fr-FR", translation: "Publié le" }] },
    created_by: { hidden: true }, updated_by: { hidden: true }
  },
  content_relation: {
    kind: text("Sorte de lien", { note: "appartient_a, prerequis, voir_aussi…" }),
    position: { interface: "input", translations: [{ language: "fr-FR", translation: "Place" }] },
    meta: json("Précisions"),
    from_id: { interface: "select-dropdown-m2o", options: { template: "{{title}}" }, translations: [{ language: "fr-FR", translation: "De" }] },
    to_id: { interface: "select-dropdown-m2o", options: { template: "{{title}}" }, translations: [{ language: "fr-FR", translation: "Vers" }] }
  },
  content_revision: { snapshot: json("Instantané"), entry_id: { interface: "select-dropdown-m2o", options: { template: "{{title}}" } } },
  content_type: { json_schema: json("Schéma JSON") }
};

// Comptes : tout est masqué sauf le nom, l'adresse, le rôle et la case Vérité.
const usersFields = await must(call("GET", "/fields/users"), "Champs des comptes");
FIELDS.users = Object.fromEntries(usersFields.map((f) => [f.field, { hidden: true, readonly: true }]));
Object.assign(FIELDS.users, {
  display_name: { readonly: true, width: "half", translations: [{ language: "fr-FR", translation: "Nom" }] },
  email: { readonly: true, width: "half", translations: [{ language: "fr-FR", translation: "Adresse" }] },
  role: { readonly: true, width: "half", translations: [{ language: "fr-FR", translation: "Rôle" }] },
  truth_access: {
    interface: "boolean", display: "boolean", width: "half", special: ["cast-boolean"],
    translations: [{ language: "fr-FR", translation: "Connaît la Vérité" }],
    note: "Décoché : le joueur ne voit ni les articles, ni les sections, ni les étiquettes « Vérité »."
  }
});

for (const [collection, fields] of Object.entries(FIELDS)) {
  for (const [field, meta] of Object.entries(fields)) {
    await must(call("PATCH", `/fields/${collection}/${field}`, { meta }), `Champ ${collection}.${field}`);
  }
}

console.log("Directus configuré : 7 collections, 6 liens, champs en français.");
