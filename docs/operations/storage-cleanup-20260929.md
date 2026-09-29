# Nettoyage du stockage de production — 29 septembre 2026

Résultat mesuré sur le VPS le 2026-09-29 à 16:28:11 UTC.
Source : journal GitHub Actions du run 36597787664, job 109507064646, événement `CLEANUP_VERIFIED`.
Journal : https://github.com/Helclaeynn/Terra-Umbra-Builder/actions/runs/36597787664/job/109507064646
Rapport privé conservé sur le serveur : `/opt/terra-umbra/storage-cleanup-36597787664.json`.

## Résultat effectif

| Mesure | Avant | Après |
|---|---:|---:|
| Espace utilisé, octets | 36322205696 | 13115908096 |
| Espace disponible, octets | 3976208384 | 27182505984 |
| Occupation hors réserve du système de fichiers | 90,1 % | 32,5 % |

Gain d'espace disponible : **23206297600 octets, soit 23,206 Go décimaux**.

## Suppressions réalisées

- 23 anciennes images de conteneurs applicatifs API/web : paquets exécutables de déploiements obsolètes, pas les illustrations du site. Les 7 images de conteneurs restantes comprennent tous les conteneurs existants et les deux paquets de retour arrière immédiat.
- 6 archives de transfert `images.tar.gz` et `apps-source.tar.gz`, vérifiées contre leurs empreintes SHA-256 : **3695392667 octets** au total. Elles appartenaient aux anciennes livraisons `reality-e396fab2`, `reality-765459a4` et `campaign-ffeb73a3`.
- Cache de compilation inutilisé depuis plus de 24 heures : **252,2 Mo** annoncés par Docker.

Aucune suppression récursive des dossiers du site, aucune suppression de volume ou de conteneur, aucun nettoyage global Docker.

## Contrôles de conservation

Les empreintes SHA-256 avant/après sont identiques pour **5300 fichiers** : application, Compendium, ancien Builder, configuration, secrets, toutes les sauvegardes, médias déposés et sources du retour arrière immédiat.

Les **18 sauvegardes privées** sont conservées sans modification. L'intégrité des archives de la dernière sauvegarde a été vérifiée avant intervention ; le catalogue de sa sauvegarde PostgreSQL a été relu avec `pg_restore --list`.

Toutes les tables de la base ont le même nombre de lignes avant et après, notamment : **7 utilisateurs, 12 personnages, 4 campagnes et 125 révisions de personnages**. La base mesure **17561267 octets**, soit environ **17,6 Mo**. Aucune requête de modification de données n'a été exécutée.

Tous les conteneurs ont conservé leur identifiant, leur image, leur état, leur date de démarrage et leurs montages. Tous les volumes sont conservés. Aucun redémarrage de l'API, du web, du proxy ou de PostgreSQL.

Le contrôle HTTPS `/api/ready` renvoie `status: ready` après nettoyage.

## Versions préservées

Production inchangée : `3a578145ceb20c892bc433886b1e8b051a1ababe` (livraison Daemon).
Retour arrière immédiat préservé, paquets et sources : `eb41675c66c8b756060086e07ee0126984e46f0c` (livraison Mage).

Cette intervention ne déploie pas les corrections Angelus. Elle nettoie uniquement les déchets techniques des anciens déploiements.
