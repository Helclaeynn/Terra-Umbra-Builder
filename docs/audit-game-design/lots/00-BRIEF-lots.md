# Consigne des lots — refonte des talents de Vérité en voies à paliers

Tu réécris **une famille de Nature** de Terra Umbra California (JDR de l'auteur, site terra-umbra.fr) en voies à paliers, **en un seul lot complet**. L'auteur relira par exception : tout ce que tu écris est appliqué par défaut, sauf s'il le refuse. Travaille donc comme si ton texte allait en jeu.

Langue : français. Ton : clair, phrases courtes, pas de jargon d'audit.

## À lire avant d'écrire (dans `docs/audit-game-design/`)

1. `README.md` : la **charte des décisions** de l'auteur (section « Décisions prises avec l'auteur ») et la méthode. Elle prime sur tout.
2. **Le modèle** : `pages/vampire-voies-source.html` (le Vampire publié) et `vampire-voies-progression.md` (textes détaillés et décisions finales, y compris la clôture en lot et la correction Shi Hun). Reproduis cette structure.
3. `relation-au-voile.md` : la règle du Voile validée.
4. Ton rapport d'audit dans `rapports/` (analyse et verdicts par entrée).
5. Tes entrées : `corpus/entrees/entries-Vérité_<nature>.txt` et `entries-Traits_<nature>.txt` (format `#n Nom [accès] {couverture} :: effet ‖ profil`). Les coûts PTV et prérequis exacts sont dans `character-builder/rulesets/terra-umbra/truth/talents/<nature>.json` ou `<nature>/*.json` (racine du dépôt).
6. Les règles : `corpus/regles/Vérité__Natures_capacités_º_<Nature>.txt`, `corpus/regles/Socle_Vérité_*`, `corpus/regles/Moteur_de_jeu.txt`.
7. Le lore : `corpus/sources-auteur/TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.txt` (cherche ta Nature avec grep) et le Bestiaire. Ne lis pas tout : cherche.

## Charte, rappel des points qui piègent

- **Voies à paliers** : I / II / III = 1 / 2 / 3 PTV, dans l'ordre. Trois formes : **progression** (un même pouvoir grandit), **collection à une porte** (talents distincts, entrée obligatoire, ordre fixé), **collection à deux portes** (deux facettes ; la seconde s'ouvre quand la première a ses deux paliers ; chaque porte = 1 puis 2 PTV). Test : si deux personnages de la même voie peuvent sembler n'avoir rien en commun → deux portes ; s'ils font la même chose plus ou moins fort → progression. Une voie peut être courte (deux paliers).
- **Aucune mécanique commune entre Natures.** Ne jamais mutualiser, ne jamais renvoyer à un pouvoir d'une autre Nature. Si un pouvoir ressemble à celui d'une autre Nature, différencie-le par un **ressort propre** à ta Nature (condition, coût ou conséquence tirés de son identité).
- **Le système est létal, voulu.** Pas de bonus défensifs permanents, pas de renforcement de la survie. Ne renforce jamais un pouvoir déjà fort. Dans le doute, garde le texte et le coût d'origine.
- **Conserver les pouvoirs.** Aucun pouvoir supprimé, sauf doublon exact, note de développement ou entrée hors sujet (à justifier dans la table de correspondance). Fusionner seulement ce qui fait la même chose.
- **Ne baisse pas un coût par commodité de format.** Si les coûts d'origine ne tombent pas sur 1/2/3, place les talents au palier qui correspond à leur coût d'origine. Un changement de coût est un changement de règle : marque-le.
- **Rédaction sur deux niveaux** : texte joueur court (une à trois phrases, chiffres compris) ; détail de référence seulement si indispensable.
- **Relation au Voile** : aucun poids par pouvoir, ne rien ajouter à ce sujet.
- **Corruption = Fléaux**, jamais tentation de pouvoir.
- **Maîtrise** (si ta Nature a des Sangs, lignées ou équivalents) : définie en paliers, avec une définition propre à la Nature (Vampire : voie au palier III ; Garou : deux voies au palier II). Éveil d'un nouveau : 3 PTV.
- **Lore** : n'invente pas de faction ni de fait. Vérifie dans les sources. Les Chasseurs et l'AIDH sont distincts.
- Corrige au passage : notes de développement visibles, références cassées, doublons, incohérences entre tableau et texte (signale-les en une ligne).
- Ne pas faire de « gestes » ni de règles transversales nouvelles. Pas de nouvelle jauge.

## Livrable

Un seul fichier : `docs/audit-game-design/lots/<NN>-<famille>.md`. **N'utilise pas git** (pas de commit, pas de push) : le coordinateur s'en charge. N'écris aucun autre fichier.

Structure, aérée (titres, listes, tableaux courts) :

1. **En bref** (5 lignes) : architecture de la Nature (couches : Nature, lignée/tradition, voies…), nombre d'entrées actuelles → nombre de cartes, ce qui change vraiment.
2. **Carte de Nature** (gratuite) : V / SR / R, traits gratuits, faiblesses, en texte joueur court.
3. **Les voies**, groupées par couche. Pour chaque voie :
   - nom, forme (progression / 1 porte / 2 portes), une ligne d'identité ;
   - *Reprend : …* (noms des entrées d'origine) ;
   - chaque palier : `**I (1 PTV) · Nom** : texte joueur` ;
   - `**Changements** :` « aucun » ou la liste précise (coût, fusion, ressort propre ajouté, correction).
4. **Table de correspondance** : chaque entrée d'origine (#n Nom) → voie et palier, ou « supprimée : raison ». Toutes les entrées doivent y être.
5. **Questions pour l'auteur** : au plus 5, uniquement ce que la charte ne tranche pas et qui change vraiment le jeu. Pour chacune : le problème en deux lignes, 2 ou 3 options, ta recommandation, un exemple concret.

Ta réponse finale au coordinateur : 10 lignes maximum (chemin du fichier, comptes, les questions en une ligne chacune, tout problème de source rencontré).
