# Audit de couverture du lore — Réalité V8 / Vérité V6

Date : 2026-09-15  
Branche : `preview/compendium-restructure`  
Portée : **audit uniquement**. Ce document ne modifie pas le corpus public.

## Sources canoniques contrôlées

- `TUC_Realite_V8_LIVRE_JDR_PAO_RESPIRATION_TOC_2026-09-09.docx`
- `TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.docx`
- Compendium V3 restructuré : datasets `realite`, `verite`, `lore`
- Catalogues Builder uniquement comme contrôle de terminologie/canon récent lorsque nécessaire ; le Builder n'est pas utilisé pour inventer du lore absent des livres.

## Légende

- **OK** : matière déjà suffisamment riche et cohérente ; surtout à reclasser dans la bonne section.
- **À consolider** : plusieurs pages existent mais sont dispersées, redondantes ou mal hiérarchisées.
- **Trop mince** : une page existe mais ne couvre qu'une petite partie de la matière du livre récent.
- **Absent** : le livre récent fournit une matière identifiable sans page de lore dédiée équivalente.
- **Legacy à réconcilier** : une page ancienne existe, mais son nom, son découpage ou son contenu ne correspond plus directement au canon récent ; ne pas fusionner automatiquement.

# 1. Diagnostic général

Le problème principal n'est pas une absence globale de contenu. Le Compendium possède déjà beaucoup de matière détaillée dans le dataset historique `lore`, mais cette matière est **mal raccordée aux rubriques Réalité et Vérité**, tandis que les datasets `realite` et `verite` contiennent plusieurs pages très courtes servant surtout de coquilles de chapitre.

État restructuré au moment de l'audit :

- `realite` : 21 pages ;
- `verite` : 54 pages ;
- `lore` : 397 pages.

La cible éditoriale recommandée est donc de **cesser de traiter `Lore` comme une troisième famille thématique visible** : ses pages doivent servir de matière à Réalité ou Vérité, avec une taxonomie commune. Le dataset technique peut rester distinct si utile au runtime, mais l'utilisateur ne devrait pas avoir à deviner qu'une page de Réalité ou de Vérité se trouve dans une rubrique générique Lore.

# 2. Réalité V8

## Diagnostic

Le chapitre **Vivre en Grande Californie** de Réalité V8 est déjà largement représenté dans les 397 pages historiques de lore : gouvernement, LAUS, agences, corporations, Pègre, religions, Crawlers et vie quotidienne possèdent beaucoup de contenu. La faiblesse de Réalité est donc surtout **architecturale**, avec une seconde faiblesse très nette : plusieurs fiches de corporations sont de simples stubs.

## Matrice de couverture

| Bloc V8 | État actuel | Statut | Action recommandée |
| --- | --- | --- | --- |
| Quinze années qui ont changé le rythme du monde / contexte général | Gros articles de contexte déjà présents dans Lore | **OK / à reclasser** | Construire une entrée Réalité « Grande Californie en 2035 » et rattacher les articles historiques existants. |
| Un territoire en strates / urbanisme | Pages `Urbanisme — les trois strates`, logement, transports, énergie et matériaux déjà riches | **OK / à consolider** | Regrouper sous `Réalité > Vie quotidienne > Ville et infrastructures`. |
| Gouvernement de la Grande Californie | Nombreuses pages Gouvernement, Congrès, administrations, agences | **OK / à consolider** | Réutiliser le contenu existant ; la page Réalité actuelle ne doit plus être une simple coquille. |
| Grande Réserve | Page dédiée existante | **OK** | Reclasser sous Réalité. |
| LAUS / Los Angeles / sécurités privées | Nombreuses pages Police/LAUS déjà détaillées | **OK / à consolider** | Créer une hiérarchie Los Angeles > LAUS / sécurité privée / territoires. |
| Agences californiennes | Contexte + nombreuses agences dédiées déjà riches | **OK** | Reclasser, conserver une page hub Agences. |
| Corporations | Page générale riche + nombreuses fiches individuelles | **À consolider** | Garder une page générale puis une fiche par corporation significative. |
| Corporations très courtes | Plusieurs fiches d'environ 15 mots : ALLICO, ANTLER SYSTEMS, APEXI, BOARCO, Bridgeeclectrics, CANICS, DREAMSCOMS, EURO MONETARY FOUND, ICECORPS, IMAGINATION MOTORS, JOYTECHS, MYSTICORPS, NIGHTELLIGENCE, OMEGA SYSTEMS, PANAMERICA BANKING, PEACH MEDIA, PHANTASMEDIA, RABBITECHNOLOGIES, REMO SECURITY, SILVER LINING NAVIGATIONS, SPHERE, SPHINX SOLUTION, TIGER INDUSTRIES, VINEMASTER, etc. | **Trop mince** | Auditer chacune contre V8 et les sources canoniques disponibles ; enrichir seulement si la source le permet, sinon assumer une entrée courte ou fusionner dans une page de second rang. |
| Eversor | Présente dans le corpus corporatif mais doit être contrôlée contre le passage V8 « nouvelle venue » | **À consolider** | Vérifier que la fiche raconte bien son rôle récent et non une version legacy. |
| Pègre / Comité général du Crime / Table des Mafias | Plusieurs gros articles et familles mafieuses déjà détaillés | **OK** | Reclasser sous Réalité > Pègre ; page hub + organisations. |
| Religions / Église réunifiée / nouveaux courants | Pages religieuses déjà riches | **OK / à consolider** | Reclasser sous Réalité ; vérifier que le rôle social 2035 du V8 est bien présent dans le hub. |
| Crawlers et Underlife | Plusieurs pages Crawlers, métiers, Underlife | **OK** | Reclasser sous Réalité > Crawlers & Underlife. |
| Vie quotidienne en 2035 | Très riche : alimentation, logement, robotique, Holonet, santé, transports, mode, sexualité, médias, énergie, augmentations, loisirs… | **OK / à consolider** | Faire de ces pages une vraie arborescence Réalité > Vie quotidienne au lieu d'un ensemble dispersé dans Lore. |
| Une journée parfaitement ordinaire | Matière transversale, pas nécessairement besoin d'une page autonome | **À consolider** | Peut devenir une page d'introduction immersive à Vie quotidienne ou être intégrée au hub. |

## Conclusion Réalité

**Priorité Réalité : reclassification et consolidation, pas réécriture massive.** Le livre V8 confirme que le lore quotidien doit expliquer un futur devenu banal — logement, travail, métro, Holonet, assurance, consommation — et le Compendium possède déjà une grande partie de cette matière. La première vraie lacune qualitative est le lot de petites fiches corporatives.

# 3. Vérité V6

## Diagnostic

La situation est inversée par rapport à Réalité : le Compendium possède de gros articles historiques très riches, mais **les chapitres jouables de Vérité V6 sont beaucoup plus finement subdivisés que la navigation actuelle**. Les pages `Vampires`, `Garous`, `Mages`, `Daemons`, `Angelus`, `Aseryns`, `Exilés` et `Extrals` de `verite` ne font qu'environ 150 à 190 mots chacune ; elles ne peuvent donc pas représenter seules les chapitres récents.

Les articles historiques de `lore` doivent être conservés comme matière, mais découpés/reclassés à la granularité des peuples, Cours, Pelages, lignées, divinités, traditions et Fléaux.

## 3.1 Vampires

### Couverture actuelle

- gros article `Vampires` très riche ;
- Cours déjà bien représentées : Krovni, Alghul, Ihuito, Oru, Shi, avec histoire/structure ;
- page générale sur les Cours ;
- **pas de couverture équivalente claire pour les Sangs noirs à la granularité V6**.

### Statut

- Vampire général : **OK / à consolider** ;
- 5 Cours : **OK**, à reclasser ;
- Maisons : **à auditer par Cour** ;
- Sangs noirs : **absents ou trop agrégés**.

### Structure cible

- `Vampires` — hub général ;
- une page par Cour : Krovni Rytsari, Alghul Almalakiu, Ihuito, Oru Ayeraye, Shi Hun Zhe ;
- une page par Sang noir significatif, par exemple **Sang Écarlate**, avec distinction interne Anya/Keyna lorsque le canon le demande ;
- pages de Maisons uniquement lorsque le livre fournit assez de lore distinctif.

Le V6 insiste explicitement sur le fait que Cour, Maison et Sang noir sont trois axes différents ; ils ne doivent pas être fusionnés dans une seule fiche générique.

## 3.2 Garous

### Couverture actuelle

- gros article `Loups-garous` très riche ;
- plusieurs articles généraux sur Pelages, hiérarchie, territoires, Grand Meneur, migration ;
- pas de pages dédiées suffisamment développées pour chacun des **six Pelages** ;
- Sangs vifs surtout visibles comme mécanique, pas comme architecture de lore.

### Statut

- Garou général : **OK / à consolider** ;
- Pelages : **trop agrégés** ;
- Sangs vifs : **absents / à créer si le V6 fournit assez de matière narrative** ;
- Héritage dévorant : **à consolider** dans la culture/hiérarchie, pas comme simple règle.

### Structure cible

- `Garous` — hub ;
- `Pelage Gris`, `Pelage Noir`, `Pelage Blanc`, `Pelage Roux`, `Pelage Brun`, `Pelage Doré` — une page chacun ;
- Sangs vifs — une page par sous-ensemble disposant d'un vrai corpus narratif ;
- Meute, hiérarchie et Héritage dévorant comme pages culturelles transversales si la matière le justifie.

## 3.3 Autres descendants de Khinae

### Couverture actuelle

Pages déjà présentes mais très agrégées :

- autres Canidés ;
- Félidés ;
- Hyènes / Ours / Crocodiles et apparentés ;
- Oiseaux / Dinosaures ;
- Requins ;
- Serpents ;
- une page générale des thérianthropes extrêmement courte.

### Statut

**À subdiviser / à enrichir.** Le V6 développe les différences de société et d'identité entre ces rameaux ; les regrouper uniquement par grande famille zoologique masque une partie du lore jouable.

### Structure cible

Conserver un hub `Descendants de Khinae`, puis une page par lignée ou petit groupe cohérent réellement développé dans le V6. Ne pas créer mécaniquement une page par nom si le texte ne fournit qu'une mention.

## 3.4 Mages

### Couverture actuelle

- gros article `Mages` très riche ;
- page générale sur les Loges ;
- plusieurs Loges individuelles, mais souvent autour de 90–110 mots ;
- la page `verite` Mages reste très courte.

### Statut

- Mage général / Mageius : **OK / à consolider** ;
- Loges : **trop minces** au regard du V6 ;
- histoire des Voyageurs et organisation des Mages : **à contrôler contre V6**.

### Structure cible

Hub Mages, pages conceptuelles Mageius / histoire / société, puis une page par Loge lorsqu'elle possède une identité narrative suffisante. Les exemples de sorts restent dans Règles, pas dans le lore.

## 3.5 Daemons

### Couverture actuelle

- gros article `Daemons` (~4100 mots) ;
- pages de Temples et page de fonctionnement des Temples ;
- pages de temples individuels généralement courtes ;
- **aucune série de pages de lore dédiée aux Divinités elles-mêmes**, alors que le V6 les place au cœur du chapitre.

### Statut

- Daemon général : **OK / à consolider** ;
- Temples : **à consolider** ;
- Maisonnées : **à auditer** ;
- Divinités : **ABSENT — priorité haute**.

### Structure cible

- `Daemons` — hub ;
- `Divinités` — hub ;
- une page par Divinité canonique développée par le V6 (Alabor, Abigor, Astaroth, Baal, Belial, Belzébuth, Diablo, Lilith, Lucifer, Mammon, Méphisto, Morrighan, Satan, selon le catalogue canonique final) ;
- Facettes comme sous-sections de la Divinité, pas comme pages isolées par défaut ;
- Maisonnées et Temples comme sous-ensembles distincts.

**Point canonique à préserver :** le V6 décrit les Daemons comme des élus d'anciennes Divinités polythéistes requalifiées en « démons » après la victoire religieuse d'Elynea. Les pages divines doivent partir de cette cosmologie récente et non d'un folklore démonologique générique.

## 3.6 Angelus

### Couverture actuelle

- gros article Angelus ;
- Elynea, Arbre de Vie, cycle Angelus/Daemons, archanges renégats, prophètes/lieux saints ;
- 10 Sephirah existantes mais très courtes (~70–85 mots chacune) ;
- quelques pages d'archanges extrêmement courtes.

### Statut

- Angelus général : **OK** ;
- Elynea / cosmologie : **à consolider** ;
- Sephiroth : **trop minces** ;
- Archanges : **trop minces / à regrouper ou enrichir**.

### Structure cible

Hub Angelus, page Elynea, page Arbre de Vie, une page par Sephirah si V6 apporte assez de matière narrative, sinon regroupement par ensembles cohérents. Éviter de conserver dix micro-stubs simplement parce que dix noms existent.

## 3.7 Aseryns

### Couverture actuelle

Très riche sur les grandes civilisations et territoires :

- Atlantes/Aseryns ;
- Hyperborée ;
- Lémurie ;
- Atlantide ;
- Mû ;
- diaspora ;
- terres aserynes ;
- lignées ;
- plusieurs Temples.

Lacunes/fragilités :

- `Temple de la Création (Mu)` ne fait qu'environ 26 mots ;
- les **Treize** et leurs Traditions sont importants dans V6 mais ne disposent pas tous d'une architecture de lore claire ;
- le Conseil de la Foudre / Dratyn doivent rester distincts des Traditions ordinaires lorsque le canon l'exige.

### Statut

- continents / civilisations : **OK** ;
- Temple de la Création : **trop mince** ;
- Treize / Traditions : **à subdiviser / à consolider**.

### Structure cible

Hub Aseryns, pages par grande civilisation/continent, puis pages culturelles des Treize à une granularité raisonnable. Une page par Fondateur peut être justifiée lorsque le V6 fournit un vrai corpus ; sinon regrouper les Treize avec sections internes fortes.

## 3.8 Exilés

### Couverture actuelle

- page générale `Les Grands Exilés` ;
- factions déjà très riches : Chasse Fantastique, Croix d'Emphyrra, Ligue des Quatre Empereurs, Cercle Écarlate, Conseil des Anciens, Syndicat de Jade, Enfants de Nidavellir, Hordes Orques, etc. ;
- **les cinq grands peuples sont beaucoup moins bien couverts comme cultures propres**.

### Statut

- Exilé général : **OK / à consolider** ;
- factions : **OK** ;
- Elyë, Whurten, Ashyll, Thulkar, Azménoriens : **ABSENT ou insuffisamment dédiés — priorité haute**.

### Structure cible

Hub Exilés, puis une page culturelle dédiée pour chacun des cinq grands peuples, enfin les organisations/factions déjà existantes. Le V6 traite explicitement les Exilés comme une catégorie historique/sociale, pas une famille biologique unique : la navigation doit montrer cette pluralité.

## 3.9 Extrals, Homo Superior et Ad’rak

### Couverture actuelle

C'est l'un des blocs les mieux servis du Compendium : Baseanhs, Mo'sens, Rocreens, Talass, Thalsios, factions, histoire galactique et humains galactiques ont de gros articles.

### Statut

**Globalement OK.** Contrôle surtout nécessaire sur la taxonomie et la compatibilité avec V6, plus que sur le volume.

### Structure cible

Hub Extrals, une page par peuple majeur, pages distinctes Homo Superior et Ad'rak, organisations/factions ensuite.

## 3.10 Chasseurs

### Couverture actuelle

Le corpus historique contient plusieurs pages `Vérité les chasseurs — ...`, souvent courtes et fragmentées, parfois nommées comme des morceaux de document (`Portée — Partie 9/10`, `?`, etc.).

### Statut

**Legacy à réconcilier — priorité haute.**

### Structure cible

Repartir du chapitre V6 `Formation et doctrine de Chasseur` pour construire une taxonomie stable : Chasseur général, formation/doctrine, traditions/organisations réellement canoniques. Réutiliser les anciens textes seulement lorsqu'ils sont encore compatibles.

## 3.11 Corruption

### Couverture actuelle

- la page `verite` Corruption est extrêmement courte (~31 mots) ;
- les règles modernes sont désormais correctement déplacées dans Règles ;
- le V6 donne un cadre conceptuel beaucoup plus fort autour d'Humanité, Intégrité, Source, Souillure et transformation.

### Statut

**Lore absent / très insuffisant — priorité haute.**

### Structure cible

Une page de lore `Corruption` expliquant ce que signifie perdre la continuité de soi et être revendiqué par une Source, sans recopier les tests, seuils et coûts déjà dans Règles. Les conséquences propres aux six Fléaux renvoient ensuite à leurs pages respectives.

## 3.12 Les six Fléaux et le faux Septième

### Canon V6

Les six Fléaux sont :

1. **Vhodhal** — Famine Blanche — principe de Dévoration ;
2. **V’Aagor** — Sombre-Vérité — Annexer / unir ;
3. **Ux’Sharith** — Division — Séparer / décomposer ;
4. **C’Thath Vhadhi** — Métastase — Réaffecter / adapter ;
5. **Gajh’Shaoggith** — Germination — Engendrer / proliférer ;
6. **Thul** — Fixation — Fixer / empêcher le devenir.

Le V6 comporte ensuite de vrais passages narratifs dédiés à chacun, pas seulement leurs arbres mécaniques.

### Couverture historique actuelle

Pages riches existantes :

- `C’thath vhadhi` ;
- `Gajh’ shaoggith` ;
- `Ux’sharith Bellatheis` ;
- `Vhodhal’nact’ru` ;
- `Mloxol v’aagor` ;
- `K’thuhuth’lul` ;
- `Delanial` ;
- contexte général.

### Statut

**LEGACY À RÉCONCILIER — priorité critique.**

Les titres anciens ne correspondent pas tous directement aux six intitulés V6. Il ne faut donc **pas** faire une substitution automatique du type `K’thuhuth’lul = Thul` ou `Delanial = faux Septième` sans vérification textuelle précise. Le canon récent possède en revanche une page narrative clairement identifiable pour **Thul — la Fixation**, qui manque sous ce nom dans le Compendium actuel.

### Structure cible

- `Les Fléaux` — hub commun ;
- une page canonique pour chacun des six ;
- une page `Le faux Septième` si le V6 fournit assez de matière narrative distincte ;
- migration des anciens articles seulement après comparaison paragraphe par paragraphe avec V6.

# 4. Priorités proposées pour la remise à plat du lore

## Priorité A — lacunes canoniques évidentes

1. **Divinités Daemon** — créer les pages de dieux manquantes à partir du V6.
2. **Exilés** — créer les cinq pages de peuples : Elyë, Whurten, Ashyll, Thulkar, Azménoriens.
3. **Corruption** — créer une vraie page de lore non mécanique.
4. **Fléaux** — réconcilier l'ancien corpus avec les six noms/principes V6 et créer Thul correctement.
5. **Chasseurs** — remplacer la taxonomie legacy fragmentée par le chapitre V6.

## Priorité B — subdivisions nécessaires

6. Vampires — une page par Cour + pages de Sangs noirs, notamment Sang Écarlate.
7. Garous — une page par Pelage + Sangs vifs lorsque la matière le justifie.
8. Khinae — subdivisions par lignées jouables/culturelles réelles.
9. Angelus — enrichir/recomposer les Sephiroth et archanges trop courts.
10. Aseryns — Treize/Traditions + Temple de la Création à reprendre.
11. Mages — enrichir les Loges trop courtes et mieux hiérarchiser Mageius/histoire/société.

## Priorité C — Réalité

12. Reclasser l'existant `Lore` dans Réalité : gouvernement, LAUS, agences, corporations, Pègre, religions, Crawlers, quotidien.
13. Auditer les nombreuses micro-fiches de corporations et supprimer le faux sentiment de complétude produit par des pages de 15 mots.
14. Fusionner ou transformer les pages-shell `realite` en hubs riches plutôt que dupliquer le contenu.

# 5. Règles éditoriales pour la phase de correction

1. **Une page = un sujet de lore identifiable**, pas une carte mécanique et pas forcément un paragraphe du livre.
2. Les pages de peuples, Cours, Pelages, Sangs, Divinités et organisations peuvent contenir plusieurs sous-sections ; ne pas atomiser chaque détail.
3. Les effets, coûts PTV, tests, PA et tableaux de progression restent dans **Règles**.
4. Les pages Réalité/Vérité peuvent mentionner qualitativement qu'une capacité, une transformation ou une tradition existe, mais renvoient vers Règles pour les chiffres.
5. Le V8/V6 récent gagne sur le legacy en cas de conflit de canon.
6. Le legacy peut enrichir une page récente seulement lorsqu'il est compatible ; aucune ancienne appellation ne doit être réintroduite automatiquement.
7. Pas de remplissage générique : lorsqu'une entrée n'a pas assez de matière source, mieux vaut une sous-section d'un hub qu'une fausse page détaillée.
8. Conserver l'identité des articles déjà très riches lorsque possible ; la remise à plat doit surtout les **reclasser et les consolider**, pas les réécrire gratuitement.

# 6. Verdict

La remise à plat du lore est justifiée, mais elle ne demande pas de refaire les 397 pages de zéro.

- **Réalité** : corpus déjà riche ; chantier surtout de taxonomie/consolidation + traitement des stubs corporatifs.
- **Vérité** : gros corpus historique utile, mais couverture inégale face au V6 ; plusieurs familles doivent être subdivisées et plusieurs lacunes réelles doivent être créées.
- **Lacunes les plus nettes** : Divinités Daemon, peuples Exilés, Corruption, Thul/canon des Fléaux, Chasseurs, Sangs vampiriques et Pelages garous à la granularité récente.
- **Risque principal** : réinjecter du lore legacy sous de vieux noms alors que le V6 a changé le canon. Toute migration des blocs Fléaux/Chasseurs et une partie des lignées doit donc être source-first.
