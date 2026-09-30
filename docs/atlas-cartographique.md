# Atlas cartographique

Route publique : `/atlas`. Le menu du Compendium et les articles associés y donnent accès.

- Sept vues : Grande Californie, Grande Réserve, Los Angeles, littoral/ports, est, cœur et nord.
- Les marqueurs liés ouvrent une vraie URL `/compendium?article=…`. Les autres ouvrent une notice. Les liens d'organisation sont présentés comme tels ; ils ne créent pas de fiches de lieux fictives.
- Les liens de retour sont limités aux articles présents dans `atlas-article-maps.json` et conservent le repère dans `?map=…&spot=…`.
- Galerie d'images classiques sous `#cartes-classiques`, avec JPEG haute définition, dimensions et miniatures chargées à la demande.

## Données et fichiers

`apps/web/src/lib/atlas-data.json` contient les vues, repères, positions normalisées, articles liés et galerie. `atlas-article-maps.json` est l'index inverse. Les 56 articles liés ont été vérifiés sur l'API publique le 30 septembre 2026. Les données sont publiques ; aucun contenu MJ ou profil utilisateur n'est embarqué.

Les fichiers résident sous `/map-assets/v1/`, distinct du chemin de page `/atlas` pour éviter qu'une directory du serveur statique masque la route Vue. Les originaux PNG restent dans les livrables locaux ; le site distribue des JPEG haute qualité aux dimensions identiques. Le fond régional pour écran est indépendant des versions d'impression ; LA conserve l'illustration validée et ses noms intégrés.

Les vues LA utilisent toutes un seul raster et un rectangle de découpe normalisé. Chaque position dans un zoom s'inverse vers la même position de la carte maîtresse. Ne pas géoréférencer l'illustration LA comme si elle avait la précision du fond géographique régional. Ses images de 5016 pixels dérivent de l'illustration d'origine de 1254 pixels ; aucun détail natif supplémentaire n'est revendiqué.

## Vérification

`npm run build` et `npm run test:atlas` dans `apps/web`. Le contrôle atlas est aussi inclus dans `test:ui` : coordonnées, raccords LA, assets, encodage, lien Mannan, Cour suprême et liens de retour. Vérifier en navigateur un clic carte→article→carte, le changement des sept vues, une notice sans article sur mobile, recherche, filtres, zoom et galerie.

Les emprises agricoles, sites régionaux, relais et communautés proposés restent des interprétations explicites de 2035. Sources géographiques et notices sont jointes dans le dossier d'images.

La publication utilise `v2-production-atlas.yml` : seuls les fichiers atlas sont appliqués à la version actuellement publiée (base figée et vérifiée avant déploiement). Le conteneur web est remplacé avec sauvegarde et retour automatique si les contrôles échouent. API, données et médias restent en place. Les changements atlas sont également intégrés à la branche courante pour les publications suivantes. Toute évolution de la version en ligne impose de réexaminer la base du workflow.
