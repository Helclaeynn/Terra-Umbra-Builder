# Relecture de l'audit technique (31/10)

L'audit technique du 29/10 est relu ici à la lumière des 15 lots de game design. Il a aussi été revérifié sur le code de la branche `feature/tuc-web-v2`.

---

## 1. L'audit tient toujours

La branche de production `feature/tuc-web-v2` n'a reçu **aucun commit depuis le 22/10**. Tout ce que l'audit décrit est donc encore vrai. Contrôles refaits aujourd'hui :

| Constat de l'audit | Vérifié le 31/10 |
|---|---|
| Contenu écrit dans le code | 221 modules `compendium-*.ts` dans `apps/api/src` |
| `loadCorpus()` empile les couches | toujours à la ligne 2055 de `compendium.ts` (5 316 lignes) |
| Fichiers géants | `CompendiumPage.vue` 4 374 lignes, `CharacterBuilderPage.vue` 3 426 |
| Talents de Corruption hors du code lisible | dans les jeux de données compressés (`compendium/data`), pas dans `rules/` |
| Sondage HTTP au lieu d'un flux poussé | 18 `setInterval` dans les composants Vue, aucun Server-Sent Events |
| Pas de limite de débit sur l'authentification | aucune trace de `rate-limit` |
| Pas de formateur ni de linter | ni Prettier ni ESLint |
| Sauvegardes sur le même serveur | `/opt/terra-umbra/private-backups` seulement |
| 77 workflows GitHub Actions | 77 |

**Le verdict reste le même** : pas de changement de langage. Il faut d'abord faire de la base de données la source de vérité du contenu, puis brancher un CMS dessus.

---

## 2. Ce que les lots de game design changent pour le chantier technique

### 2.1 Le modèle de contenu doit connaître les voies

L'audit proposait des entrées typées (`talent`, `trait`, `objet`…) avec des champs structurés. Les lots ajoutent une structure que le schéma doit porter dès le départ, sinon il faudra le refaire :

- **Voie** : une entrée à part, avec sa **forme** (progression, une porte, deux portes, deux portes et sommet). Les voies de Corruption ont un cas propre : leur verrou est la profondeur de Corruption, pas l'ordre d'achat.
- **Talent** : son **palier** (I, II, III), sa **porte** (A, B ou sommet), son coût, son accès (V, SR, R), son quota, ses PA et ses prérequis.
  - Pour la Corruption, il faut en plus le **type** (DON, RITE, FAVEUR), la **profondeur** (Marqué, Envahi, Au bord) et la **Souillure**.
- **Deux textes par talent** (décision 1) : la **carte courte** pour le joueur, le **texte de référence** pour le MJ et le moteur. Le gabarit de l'audit avait déjà un `texte_court` : c'est le même besoin.
- **Notes de moteur à part** : les notes « ‖ … » que les lots retirent du texte joueur (75 talents de Réalité, 103 augmentations, 343 objets) doivent aller dans un champ technique, jamais dans la carte.
- **Rupture jouable** : une entrée de type propre (Oshirique, Sang d'Ivoire), reliée à une Nature et à une Source.

### 2.2 Une bonne partie du nouveau contenu n'existe pas dans le code

Les lots ont rétabli ou créé du contenu absent du site. Exemples vérifiés dans `apps/api/src` :

| Contenu | Dans le code ? |
|---|---|
| 30 talents de Lignée Khinae (livre V6) | non (« Fermer l'étau », « Entre les monstres » : 0 occurrence) |
| Organisations des Exilés (82 entrées) et des Extrals (65) en PTV | très incomplet (le lot Exilés relevait 23 talents sur 184 dans les JSON du Builder) |
| Faveur de Seere, cartes Oshirique et Sang d'Ivoire | non |
| Relation au Voile | absente du site (décision 3) |
| Structure en voies (paliers, portes) | absente |

**Conséquence** : il ne faut **pas** écrire les lots dans les modules TypeScript actuels. Ce serait une septième couche au-dessus des six que `loadCorpus()` empile déjà, exactement ce que l'audit déconseille. Les lots entrent **après** la migration du contenu en base.

### 2.3 Un point confirmé par le code

Le fichier `apps/api/src/rules/truth/mage-techniques.ts` ne connaît que trois « Techniques » : Écho du Mageius, Œuvre personnelle et Héritage familial. C'est exactement la définition validée hier (lot 15, question 1). Il n'y a pas de catalogue caché.

---

## 3. Plan révisé

L'ordre de l'audit est gardé, avec une étape en plus (1b) pour faire entrer les lots.

| Phase | Contenu | Remarque |
|---|---|---|
| **0. Filets de sécurité** | Sauvegarde chiffrée hors serveur, limite de débit sur `/api/auth/*`, Prettier et ESLint en un commit dédié, fusion de `feature/tuc-web-v2` dans `main` | Indépendante du reste ; la sauvegarde est la plus urgente (une panne du serveur fait tout perdre). |
| **1. Contenu en base** | Schéma `content_*` **avec les voies** (2.1), migration unique du corpus fusionné, suppression des modules de contenu, API de lecture inchangée pour le front | Le schéma est le point qui engage le plus : je le propose d'abord sur papier. |
| **1b. Import des lots** | Convertir les lots en fichiers de données structurés par famille (un par Nature, plus Corruption, Objets, Réalité), validés par le schéma, puis importés | C'est là que les 15 lots arrivent sur le site. Nature pilote : le Vampire. |
| **2. CMS** | Directus sur les tables de contenu (ou back-office maison), rôles, relations, liens internes, rétroliens, révisions | Décision à prendre, voir question 1. |
| **3. Temps réel** | Server-Sent Events et `LISTEN/NOTIFY`, fin des sondages | Indépendante du contenu. |
| **4. Règles en données** | Gabarit de talent exécutable (types d'effets), Nature par Nature | Facilitée par 1b : les champs structurés existent déjà. |
| **5. Front** | Audit UI/UX : découpage des pages, système de design, URL d'articles propres | En parallèle. |

**Ce que je peux faire depuis ici** : tout ce qui est code, schéma, scripts de migration, conversion des lots et tests, sur une branche, avec une PR vers `feature/tuc-web-v2`.

**Ce que je ne peux pas faire** : accéder au serveur de production, déployer, créer un compte de stockage pour les sauvegardes, ni lancer la migration sur la vraie base. Ces gestes restent les tiens.

---

## 4. Questions pour l'auteur

**Q1. Directus ou back-office maison ?**
- **A (recommandé par l'audit)** : Directus, branché sur la même base PostgreSQL. Compter 2 à 4 semaines pour un usage confortable. Relations, rétroliens, rôles et révisions sont fournis. Il faut un service de plus sur le serveur (environ 300 Mo de RAM) et l'interface est distincte du site.
- **B** : étendre l'éditeur actuel (`CompendiumEditorPage.vue`). L'interface est cohérente avec le site, mais compter 2 à 4 mois et tout à construire.
- *À vérifier de ton côté* : la mémoire libre du serveur pour Directus.

**Q2. Par quoi je commence ?**
- **A (recommandé)** : la phase 0 côté code (limite de débit, Prettier et ESLint) et, en parallèle, le **schéma de contenu** de la phase 1, proposé sur papier avec le Vampire comme exemple, pour validation avant toute migration. La sauvegarde hors serveur demande ton action (choix d'un stockage, OVH ou Backblaze) : je prépare le script.
- **B** : d'abord la conversion des lots en fichiers de données (1b), même avant le schéma définitif. C'est plus rapide à voir, mais au risque de refaire le format ensuite.

**Q3. Sur quelle branche travailler ?**
La V2 vit sur `feature/tuc-web-v2`, environ 1 700 commits devant `main`. Je propose une branche de travail tirée de `feature/tuc-web-v2`, avec une PR par phase. Faut-il d'abord fusionner `feature/tuc-web-v2` dans `main` (phase 0) ? Cette fusion touche le déploiement de la V1 sur GitHub Pages : c'est à toi de dire si la V1 peut partir dans un dossier `legacy/`.
