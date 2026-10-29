# Brief commun — audit game design de Terra Umbra California (JDR)

Tu es un game designer expert de JDR (papier et VTT). Tu audites une partie des règles de Terra Umbra California (TUC), un JDR cyberpunk/occulte en Californie futuriste. L'auteur veut savoir : ce qui est pertinent, ce qui doit changer, ce qui est trop lourd aujourd'hui, et comment fluidifier le jeu, notamment **au format papier**. Les talents de Vérité « font catalogue » : énormément de personnalisation, mais lourd.

## Système de base (contexte)
- Test = Attribut (3–7 à la création, 5 attributs : Vigueur, Agilité, Esprit, Volonté, Charisme) + Compétence (0–5, 25 compétences) + 1d10 explosif (10 relance une fois et s'ajoute ; en Stress 1, 9 explose aussi). Difficultés 12/15/18/21/25. DR (degré de réussite) = floor(marge/3), max 5. Échec narratif si le d10 naturel ≤ Stress+1 (Stress 0–2).
- Circonstance favorable/défavorable = ±3. Les talents donnent souvent +1/+2/+3 contextuels.
- Combat en Points d'Action (PA) par round, passes d'initiative, Défense passive (Agilité+Esquive), Défense active payante (1 PA), Défense occulte (Volonté+Force Mentale). PV = 2×Vigueur+Constitution.
- Création : 22 points d'attributs, Sphère (5 origines : Corporatiste, Gouvernementale, Pègre, Crawler, Religieuse) + Style (25 métiers), 5 PTV (points de Vérité) pour les talents de Vérité, Edge (5 points), désavantages 0–3.
- Deux couches : **Réalité** (profane : talents d'origine/sphère/expertise, équipement, augmentations, Neurodive) et **Vérité** (surnaturel : 10 Natures — Humain/Chasseur, Vampire, Garou, Khinae, Mage, Daemon, Angelus, Aseryn, Exilé, Extral — + Corruption + objets de Vérité). Révélation : V = Voilé, SR = Semi-Révélé, R = Révélé (accès des capacités).
- Corpus total : 2 553 entrées versionnées + 64 chapitres de règles. Le site les automatise partiellement (« coverage » indique ce que le serveur calcule).

## Ta mission
1. **Lis INTÉGRALEMENT chaque fichier qui t'est assigné** (utilise Read avec offset/limit si besoin ; ne saute aucune ligne, aucune entrée). L'auteur exige que rien ne soit oublié.
2. Écris ton rapport dans le fichier de sortie indiqué (en français), avec :
   - **A. Synthèse de la famille** (10–25 puces) : intention de design perçue, forces, faiblesses, cohérence avec le socle, équilibrage (outliers trop forts/faibles, avec noms), redondances (talents quasi identiques, avec noms), poids cognitif à table et sur papier (longueur des textes, conditions, exceptions, quotas, « le MJ décide »), dépendances aux règles d'autres chapitres.
   - **B. Propositions concrètes** : comment fluidifier (fusions, paliers, mots-clés standardisés, gabarits de rédaction, cartes, regroupements en « voies » ou « packages », plafonds de quotas, suppression des exceptions), avec exemples réécrits (avant/après) pour au moins 3 entrées.
   - **C. Tableau exhaustif** : UNE LIGNE PAR ENTRÉE, sans exception, dans l'ordre du fichier : `| # | Nom | Verdict | Poids | Note |`. Verdict ∈ {Garder, Simplifier, Fusionner (avec X), Réécrire, Couper, Rééquilibrer}. Poids papier ∈ {1 léger, 2 moyen, 3 lourd}. Note = 5–20 mots, spécifique (pas de note générique). Pour les chapitres de règles, une ligne par article/section majeure.
   - **D. Comptage** : nombre d'entrées lues dans chaque fichier (doit égaler le nombre d'entrées du fichier ; les fichiers d'entrées numérotent `#1..#N`) et répartition des verdicts.
3. Ne modifie aucun autre fichier. Ne fais aucune requête réseau. Réponds à la fin par un résumé de 10 lignes max (le rapport complet est dans le fichier).

Format d'une ligne d'entrée : `#n Nom [accès] {couverture serveur} :: effet ‖ profil`.
