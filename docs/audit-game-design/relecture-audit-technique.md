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

## 4. Ajustements après la passation technique OVH (31/10)

**Statut de cette passation (consigne de l'auteur, 31/10)** : elle décrit **ce qui existe**, pas ce qu'il faut suivre. Ses pratiques sont un état des lieux, et beaucoup doivent changer :
- releases par overlay sur les images en service ;
- dizaines de workflows ponctuels ;
- interdiction de fusionner dans `main` ;
- sauvegardes locales seulement ;
- `dev` redirigé vers la production.

Ce qui fait foi, c'est l'audit technique et les décisions de l'auteur. La passation sert seulement à savoir **ce qui existe aujourd'hui**, pour ne rien casser ni perdre en le changeant.

### 4.1 Décisions de l'auteur (31/10)

- **Pas de second VPS.** Tout tient sur le VPS-1 actuel.
- **La V1 ne reste pas en ligne.** GitHub Pages est coupé ; la V1 part dans `legacy/` (et reste dans l'historique Git). `feature/tuc-web-v2` devient `main`.
- **On assainit au lieu de prolonger** : fin des releases par overlay, retour à une release reconstruite depuis Git, workflows ponctuels archivés.

### 4.2 Ce qu'il faut savoir de l'existant pour le changer sans casse

- **Disque** : environ 40 Go, déjà monté à 99 %. Sur ce total, environ 12 Go d'archives de releases et 18,6 Go d'images Docker (relevé du 01/10), en grande partie des restes des releases par overlay. Le ménage libère la place d'une recette.
- **Production ≠ code** : à cause des overlays, il faut d'abord relever ce qui tourne (images, sources livrées, corpus) et le ramener dans Git. La migration du contenu (phase 1) part de **ce qui est servi**, éditions en base comprises.
- **Workflows piégés** :
  - une quarantaine se lancent en production quand on pousse une modification de leur propre fichier sur `feature/tuc-web-v2` ;
  - six se lancent sur `main`, dont `compendium-page-overrides-sync.yml`, qui recommite sur `main`.

  Ils sont archivés **avant** la fusion dans `main` et avant tout formatage. Prettier et ESLint excluent `.github/` tant que le ménage n'est pas fait.
- **Sauvegardes** : le script `backup.sh` est bon (dump, médias, restauration témoin) ; il manque seulement la copie hors site.

### 4.3 Plan ajusté

| Étape | Contenu |
|---|---|
| **0. Filets** | Copie hors site des sauvegardes. Archivage des workflows ponctuels (on garde : CI, déploiement, sauvegarde). Relevé de ce qui tourne en production et rapatriement dans Git. Ménage du disque. |
| **0 bis. Base saine** | Coupure de Pages, V1 dans `legacy/`, `feature/tuc-web-v2` fusionnée dans `main`. **Un seul workflow de déploiement**, qui reconstruit depuis Git. Prettier et ESLint. Limite de débit sur l'authentification. |
| **0 ter. Recette** | Une seconde pile Compose **sur le même VPS** (projet, base et volume séparés, `dev.terra-umbra.fr` protégé par mot de passe), avec des limites de mémoire. Elle ne tourne que pendant les essais et repart d'une sauvegarde restaurée. |
| **1. Contenu en base** | Schéma `content_*` avec les voies, migration du corpus servi, suppression des modules de contenu. Testée en recette. |
| **1b. Import des lots** | Les 15 lots en données structurées ; Vampire en pilote. |
| **2 à 5** | CMS, temps réel, règles en données, front (inchangé). |

---

## 5. Questions restantes (31/10)

**Q1. Copie hors site des sauvegardes : OVH Object Storage ?**
Les sauvegardes actuelles pèsent environ 400 Mo. En stockage objet, cela revient à quelques centimes par mois : ce n'est pas un second serveur.
- **A (recommandé)** : OVH Object Storage, sur ton compte, dans une autre région que le VPS, avec une copie chiffrée chaque jour. Tu crées le conteneur et la clé ; j'écris le script.
- **B** : une copie sur ton propre ordinateur, récupérée à la main (gratuit, mais dépend de toi).

**Q2. Recette sur le même VPS : d'accord ?**
- **A (recommandé)** : oui, après le ménage du disque. Une pile séparée, allumée seulement pendant les essais.
- **B** : non ; on teste uniquement en local et en CI, avec des données fictives. La migration du contenu réel serait alors moins sûre.

**Q3. Par quoi je commence ?**
- **A (recommandé)** : l'étape 0, préparée sans rien déployer :
  - archivage des workflows ponctuels ;
  - script de sauvegarde hors site ;
  - workflow de relevé de la production en lecture seule.

  En parallèle, le schéma de contenu avec les voies, sur papier.
- **B** : d'abord le schéma de contenu seul.

*Le choix du CMS (Directus ou maison) attend la fin de la phase 1, quand on connaîtra la place réelle sur le disque.*
