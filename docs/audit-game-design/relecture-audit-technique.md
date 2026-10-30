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

La passation technique du 30/10 (agent précédent) change plusieurs points du plan. Ce qui suit vient d'elle, et de la lecture des 77 workflows.

### 4.1 Contraintes de l'hébergement

- **Serveur** : OVH VPS-1, Debian 13, environ **40 Go de disque**, déjà monté à 90 % puis 99 % (29/09 et 01/10). Il restait environ 2,5 Go de RAM libre au relevé du 01/10. Releases et images Docker occupent plus de 30 Go.
- **Pas d'environnement de recette** : `dev.terra-umbra.fr` redirige vers la production, et la passation interdit de le réactiver sans pile et base séparées.
- **La production ne correspond pas exactement au code** : beaucoup de releases sont des *overlays* posés sur les images en service. Rebuilder `feature/tuc-web-v2` ne reproduit donc pas forcément ce qui tourne. La passation classe la « reconstruction intégrale depuis une révision Git unique » parmi les points non établis.
- **Sauvegardes** : le script `backup.sh` est sérieux (dump, archive des médias, restauration témoin, empreintes). Mais tout reste sur le VPS, sans copie hors site ni test de reprise sur une machine neuve.
- **Incident Chrome en entreprise du 01/10** : non résolu. La mitigation HTTP/3 n'est pas reportée dans le modèle Caddy de production versionné.

### 4.2 Pièges dans GitHub Actions

- **Une quarantaine de workflows de production se déclenchent par un push sur `feature/tuc-web-v2`** (en général, quand leur propre fichier change). Modifier un fichier de workflow sur cette branche peut donc **lancer une opération de production**.
  - Conséquence : Prettier et ESLint doivent **exclure `.github/`**.
  - Toute PR qui touche un workflow se relit comme une mise en production.
- **Six workflows se déclenchent par un push sur `main`**. L'un d'eux, `compendium-page-overrides-sync.yml`, a le droit d'écrire et recommite sur `main`. Fusionner la V2 dans `main` les déclencherait. Il faut d'abord les archiver ou les neutraliser.
- **GitHub Pages sert la V1 depuis `main`**. Pages ne sait servir que la racine ou `/docs` d'une branche, pas un dossier `legacy/` quelconque.

### 4.3 Ce que ça change au plan

| Phase | Ajustement |
|---|---|
| 0 | **La sauvegarde hors site reste la priorité.** Avant la limite de débit : `@fastify/rate-limit` est une **nouvelle dépendance**, or les releases par overlay refusent un changement de dépendances. Il faut donc d'abord une release reconstruite depuis Git, ce qui suppose d'avoir établi que Git reproduit la production. |
| 0 bis (nouvelle) | **Rendre la production reproductible** : comparer les images en service au code (sources livrées, `build-info.json`, empreintes du corpus), puis faire une release complète depuis une révision unique. Sans elle, chaque phase suivante empile un overlay de plus. |
| 0 ter (nouvelle) | **Un environnement de recette isolé**, avec sa propre base restaurée depuis une sauvegarde. Indispensable avant la migration du contenu (phase 1) : on ne la teste pas en production. |
| 1 | La migration doit capturer **ce qui est servi en production** (images actives et éditions en base), pas le corpus de `HEAD`, qui peut différer. |
| 2 | Directus ajoute environ 300 Mo de RAM et un peu plus d'1 Go d'image sur un disque déjà serré. Il reste faisable, à condition d'avoir fait le ménage du disque (ou agrandi le VPS). |
| Fusion dans `main` | Faisable maintenant que tu acceptes de passer la V1 en legacy, mais dans cet ordre : neutraliser les 6 workflows `main`, figer la V1 sur une branche `legacy-v1` (servie par Pages ou coupée), puis fusionner. |

**Ce qui ne bouge pas** : je travaille sur une branche de travail et par PR ; je ne touche ni au serveur, ni aux secrets, ni aux workflows de production sans ton accord explicite, au cas par cas.

---

## 5. Questions pour l'auteur (reposées le 31/10)

**Q1. Où mettre la sauvegarde hors site ?**
- **A (recommandé)** : OVH Object Storage, sur ton compte OVH existant, dans une **autre région** que le VPS. Copie chiffrée avec restic, une par jour, et un test de restauration mensuel. Tu crées le conteneur et une clé d'accès, puis tu poses la clé dans `/opt/terra-umbra/secrets/`. J'écris le script et le workflow, et tu valides avant le premier lancement.
- **B** : un autre fournisseur (Backblaze B2, environ 6 $ par To et par mois). Un compte de plus à gérer.

**Q2. Où faire la recette ?**
La migration du contenu ne peut pas se tester en production, et il n'existe aucun environnement isolé.
- **A (recommandé)** : un **second petit VPS OVH** dédié à la recette (pile Compose identique, base restaurée depuis la sauvegarde, nom `recette.terra-umbra.fr` protégé par mot de passe). Il ne prend pas de place sur le disque de production.
- **B** : une seconde pile sur le même VPS. Pas de coût, mais le disque de 40 Go est déjà au bord, et une erreur peut toucher la production.
- **C** : pas de recette ; on teste en local et en CI avec des données fictives. Moins sûr pour une migration du contenu réel.

**Q3. La V1 sur GitHub Pages doit-elle rester en ligne ?**
Tu acceptes qu'elle passe en legacy. Reste à savoir si son adresse GitHub Pages doit continuer à répondre.
- **A (recommandé)** : la V1 est figée sur une branche `legacy-v1` que Pages continue de servir (même adresse, plus aucune mise à jour). Puis `feature/tuc-web-v2` est fusionnée dans `main`, une fois les 6 workflows de `main` neutralisés.
- **B** : Pages est coupé ; la V1 reste seulement dans l'historique Git et dans le dossier `legacy/`.

**Q4. CMS : Directus ou back-office maison ?**
- **A (recommandé)** : décider après la phase 1, quand le contenu sera en base et l'état du disque connu. Directus reste le favori (2 à 4 semaines, relations et révisions fournies), si la place le permet.
- **B** : trancher maintenant pour le back-office maison (pas de service de plus sur le VPS, mais 2 à 4 mois de développement).

**Q5. Par quoi je commence ?**
- **A (recommandé)** : préparer sans rien déployer.
  1. Le script de sauvegarde hors site (Q1).
  2. Un workflow **en lecture seule**, déclenché à la main par toi, qui relève les images en service et les compare au code (phase 0 bis).
  3. Le **schéma de contenu avec les voies**, sur papier, avec le Vampire en exemple.
- **B** : commencer par le schéma de contenu seul, et laisser l'exploitation pour plus tard.

