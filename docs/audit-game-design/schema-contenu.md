# Schéma de contenu — proposition sur papier (31/10)

Étape 1 de la relecture technique : faire de la base de données la seule source de vérité du contenu (règles, talents, objets, articles, PNJ). Ce document est à valider **avant** d'écrire la moindre migration. Exemple suivi de bout en bout : le Vampire.

---

## 1. Principes

1. **Une entrée = un objet de contenu typé** : un article, une Nature, une voie, un talent, un objet, un PNJ…
   - Les champs communs sont de vraies colonnes.
   - Les champs propres au type vivent dans `fields` (JSONB), validés à l'écriture par un schéma JSON par type, partagé entre l'API et le front.
2. **Les identifiants actuels sont conservés.**
   - Les fiches de personnage enregistrent les talents par identifiant (`truthTalents`, `corruptionTalents`, par exemple `faveur_de_la_nuit`). Les éditions du compendium sont rangées par `article_id`.
   - La migration garde donc chaque identifiant existant comme `slug`. Aucune fiche n'a besoin d'être réécrite.
   - Un talent renommé garde son ancien identifiant dans `legacy_ids`.
3. **Deux textes par talent** (décision 1) : `texte_court` (la carte joueur) et `texte_reference` (MJ et moteur). Les notes de moteur (« ‖ … ») vont dans `note_moteur`, jamais affichée aux joueurs.
4. **Les relations sont des lignes, pas du texte** : prérequis, appartenance à une voie, renvoi, membre d'une organisation. Liens internes et rétroliens en découlent.
5. **Chaque publication crée une révision** : historique, comparaison et restauration.
6. **Statut et visibilité** :
   - statut : brouillon, en relecture, publié ou archivé ;
   - visibilité : public, joueurs connectés ou MJ.

   On garde ce que les tables actuelles savent déjà faire (`compendium_review_state`, visibilité des portraits).
7. **Le moteur de règles lit la base, pas des modules TypeScript.** Les « types d'effets » exécutables (phase 4) s'ajouteront plus tard dans `fields.effets`, sans changer le schéma.

---

## 2. Tables

```sql
CREATE TABLE content_type (
  id          text PRIMARY KEY,          -- 'talent', 'voie', 'nature', 'article', …
  label       text NOT NULL,
  json_schema jsonb NOT NULL             -- validation de content_entry.fields pour ce type
);

CREATE TABLE content_entry (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type          text NOT NULL REFERENCES content_type(id),
  slug          text NOT NULL,           -- identifiant stable, = identifiant actuel
  title         text NOT NULL,
  summary       text,                    -- carte courte / chapeau d'article
  body          jsonb,                   -- blocs : paragraphe, tableau, encadré MJ, exemple, image
  fields        jsonb NOT NULL DEFAULT '{}',
  status        text NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','review','published','archived')),
  visibility    text NOT NULL DEFAULT 'public'
                CHECK (visibility IN ('public','players','gm')),
  legacy_ids    text[] NOT NULL DEFAULT '{}',
  version       integer NOT NULL DEFAULT 1,
  created_by    uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_by    uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  published_at  timestamptz,
  UNIQUE (type, slug)
);

CREATE TABLE content_relation (
  from_id   uuid NOT NULL REFERENCES content_entry(id) ON DELETE CASCADE,
  to_id     uuid NOT NULL REFERENCES content_entry(id) ON DELETE RESTRICT,
  kind      text NOT NULL,   -- voir § 4
  position  integer,         -- ordre dans une voie, une liste
  meta      jsonb NOT NULL DEFAULT '{}',
  PRIMARY KEY (from_id, to_id, kind)
);

CREATE TABLE content_revision (
  id         bigserial PRIMARY KEY,
  entry_id   uuid NOT NULL REFERENCES content_entry(id) ON DELETE CASCADE,
  version    integer NOT NULL,
  snapshot   jsonb NOT NULL,             -- entrée complète + relations sortantes
  author     uuid REFERENCES users(id) ON DELETE SET NULL,
  comment    text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (entry_id, version)
);

CREATE TABLE content_media (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id   uuid REFERENCES content_entry(id) ON DELETE SET NULL,
  file_path  text NOT NULL,              -- volume des médias éditoriaux existant
  alt        text, credit text,
  visibility text NOT NULL DEFAULT 'public'
);

CREATE TABLE content_tag (
  entry_id uuid REFERENCES content_entry(id) ON DELETE CASCADE,
  tag      text NOT NULL,                -- rubrique ou étiquette libre
  PRIMARY KEY (entry_id, tag)
);
```

`ON DELETE RESTRICT` sur `to_id` : on ne peut pas supprimer un talent dont un autre dépend. Il faut l'archiver.

---

## 3. Types et champs (`fields`)

### Règles de Vérité

| Type | Champs |
|---|---|
| `nature` | `etats` (V, SR, R : texte et modificateurs), `traits_gratuits`, `faiblesses`, `choix_creation` (Cour, Lignée, Pelage…), `maitrise` (règle propre : « voie au palier III », « deux voies au palier II »…), `cout_eveil` (3) |
| `couche` | ce qu'est la couche pour la Nature (Cour, Pelage, Lignée, tradition, Divinité, culte, Source…), `gratuit` (empreinte ou signature), `choix` (unique ou cumulable) |
| `voie` | `forme` : `progression` · `une_porte` · `deux_portes` · `deux_portes_sommet` · `dons` ; `verrou` : `ordre_paliers` (Natures) · `profondeur` (Dons de Corruption) · `prerequis` (cultes) ; `identite` (la ligne d'accroche) ; `changements` (note d'édition) |
| `talent` | `cout` (1, 2, 3), `palier` (I, II, III), `porte` (A, B, sommet ou vide), `palier_double` (a, b), `acces` (V, SR, R et leurs combinaisons), `activation` (passif, n PA, Réaction, rituel…), `quota` (round, scène, scénario), `texte_court`, `texte_reference`, `note_moteur`, `statut_regle` (`origine`, `correction`, `proposition`) |
| `talent` (Corruption, en plus) | `kind` (DON, RITE, FAVEUR), `profondeur` (Marqué, Envahi, Au bord), `souillure` (15, 18, 21, 25), `corruption_auto` (+1) |
| `rupture` | `nature`, `source`, `condition`, `perd`, `garde`, `capacites`, `dependance`, `issue_second_echec` |
| `source_corruption` | `principe`, `tentation`, `vecteur`, `impulsion`, `ruptures`, `preseance` |
| `faveur_maisonnee` | `divinite`, `maisonnee`, `levier` (information, moment, cible, économie d'action) |

### Réalité, objets, lore

| Type | Champs |
|---|---|
| `talent_realite` | `categorie` (Origine, Sphère, commun, expertise), `milieu` (Corporatiste…), `cout_xp` (10), `texte_court`, `texte_reference`, `note_moteur` |
| `objet` | `reseau` (Chasse, Exilés, xéno, AIDH, Calamitechnologie), `acces` (C/A/T/R/P + GT, V0–V4, M0–M4, D/O/L/S/X), `prix`, `monnaie` ($, Dykal, PdC, dotation), `profil` (DGT, portée, réserve), `proprietes` (mots-clés du glossaire), `souillure`, `instable` |
| `equipement`, `augmentation` | profils Réalité existants, plus `generation` (Gen1, Gen2) pour les augmentations |
| `glossaire` | `mot`, `regle` (une ligne) : Biphysique, Perforant X, etc. |
| `article`, `regle` | corps en blocs ; `rubrique` |
| `pnj`, `creature`, `lieu`, `organisation` | champs de lore existants ; `profil` (bloc de stats) |

---

## 4. Relations (`content_relation.kind`)

| kind | De → vers | Exemple |
|---|---|---|
| `appartient_a` | talent → voie, voie → couche, couche → nature | Décharge orageuse → Sang Orageux |
| `prerequis` | talent → talent | Surcharge nerveuse → Décharge orageuse |
| `prerequis_un_de` | talent → talents (`meta.groupe`) | les `anyRequiredTalentIds` actuels |
| `source` | talent de Corruption → Source | Récolter les miettes → Vhodhal |
| `culte` | talent → culte | Récolter les miettes → Loge d'Écume |
| `mentionne` | entrée → entrée | lien interne `[[Vampire]]` dans un article |
| `voir_aussi`, `remplace` | entrée → entrée | renvoi FaceCaster #145 → #61 |
| `membre_de`, `fabrique_par` | PNJ → organisation, objet → réseau | |
| `rupture_de` | rupture → nature et source | Sang d'Ivoire → Vampire, Vhodhal |

Le palier, la porte et l'ordre dans la voie sont des champs du talent (`palier`, `porte`) et `position` sur la relation `appartient_a`. Le moteur en déduit ce qui est achetable.

---

## 5. Règles d'achat que le moteur en déduit

- **`ordre_paliers`** : un talent de palier II n'est achetable que si la même porte a son palier I ; un palier III, si la porte a son II.
  - **`deux_portes`** : la seconde porte s'ouvre quand la première a tous ses paliers.
  - **`deux_portes_sommet`** : le sommet s'ouvre au même moment.
- **`profondeur`** (Dons de Corruption) : il faut la bonne Source dominante et la profondeur ; aucun ordre de palier (lot 12, Q1).
- **`prerequis`** (cultes) : seuls les prérequis écrits comptent, plus l'appartenance réelle au culte (fait de fiction, coché par le MJ).
- **Maîtrise et éveil** : lus dans `nature.maitrise` et `nature.cout_eveil`.

Ce sont les contrôles que l'API fait déjà (coûts, quotas, prérequis), lus désormais dans les données au lieu de code ad hoc.

---

## 6. Exemple : le Vampire

**La Nature et une couche**
```json
{ "type": "nature", "slug": "vampire", "title": "Vampire",
  "fields": { "etats": { "V": "corps humain, aucun bonus", "SR": "…", "R": "…" },
              "choix_creation": ["cour", "sang_noir"],
              "maitrise": "voie au palier III, ou les deux portes d'un Sang", "cout_eveil": 3 } }

{ "type": "couche", "slug": "vampire_sang_noir", "title": "Sang noir",
  "fields": { "gratuit": false, "choix": "unique_a_la_creation" } }
```

**Une voie à deux portes et deux de ses talents**
```json
{ "type": "voie", "slug": "vampire_sang_orageux", "title": "Sang Orageux · Branimir",
  "fields": { "forme": "deux_portes", "verrou": "ordre_paliers", "identite": "désorganiser" } }

{ "type": "talent", "slug": "decharge_orageuse", "title": "Décharge orageuse",
  "fields": { "cout": 1, "palier": "I", "porte": "A", "acces": "R",
              "activation": "attaque de contact payée", "quota": "1/round (effet secondaire)",
              "texte_court": "Contact : DGT 3 électriques ; une blessure réelle impose −3 au prochain test de coordination ou de concentration.",
              "texte_reference": "Une attaque de contact normalement payée inflige DGT 3 électriques ; …",
              "statut_regle": "origine" } }

{ "type": "talent", "slug": "surcharge_nerveuse", "title": "Surcharge nerveuse",
  "fields": { "cout": 2, "palier": "II", "porte": "A", "acces": "R", … } }
```

Relations : `decharge_orageuse —appartient_a(position 1)→ vampire_sang_orageux`, `surcharge_nerveuse —prerequis→ decharge_orageuse`, `vampire_sang_orageux —appartient_a→ vampire_sang_noir —appartient_a→ vampire`.

**Une voie en progression** : Emprise (`forme: progression`), avec sa Fascination gratuite (`palier: "socle"`, `cout: 0`), puis ses paliers I, II et III.

**Les identifiants** : `decharge_orageuse`, `faveur_de_la_nuit`, etc. restent ceux du catalogue actuel. Une fiche qui contient `"truthTalents": ["decharge_orageuse"]` se lit sans conversion.

---

## 7. Migration (rappel du plan)

1. En **recette** (seconde pile sur le VPS, après le ménage du disque), restaurer une sauvegarde récente.
2. Exécuter une dernière fois la composition actuelle du corpus **depuis l'image servie en production**, éditions en base comprises, et écrire le résultat dans `content_*`.
   - Chaque article garde son `article_id` comme `slug`.
   - Chaque talent garde son identifiant.
3. Comparer, entrée par entrée, ce que l'ancienne API et la nouvelle renvoient : même nombre d'articles, mêmes textes, mêmes fiches calculées pour toutes les fiches existantes.
4. Importer ensuite les lots (1b), Nature par Nature, en commençant par le Vampire. C'est là que voies, paliers et portes entrent dans les données.
5. Supprimer les modules de contenu du code une fois la recette validée.

---

## 8. Points à trancher plus tard (pas maintenant)

- **Le CMS** (Directus ou maison) : le schéma ci-dessus marche avec les deux. Directus lit directement `content_entry` et `content_relation` ; les relations y sont des tables de liaison classiques.
- **Le format des blocs** de `body` : à aligner sur l'éditeur retenu.
- **La phase 4** (effets exécutables) : `fields.effets` reste vide pour l'instant.
