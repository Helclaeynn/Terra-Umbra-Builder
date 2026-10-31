# Audit 04 — Vérité : Vampire, Garou, descendants de Khinae

Fichiers lus intégralement :
- `rules/Vérité__Natures_capacités_º_Vampires.txt` (2 articles), `rules/Vérité__Natures_capacités_º_Garous.txt` (2 articles), `rules/Vérité__Natures_capacités_º_Khinae.txt` (1 article)
- `entries-Vérité_vampire.txt` (71), `entries-Vérité_garou.txt` (68), `entries-Vérité_khinae.txt` (68)
- `entries-Traits_vampire.txt` (14), `entries-Traits_garou.txt` (13), `entries-Traits_khinae.txt` (55)

Constat préalable vérifié par `diff` : **les lignes #21 à #68 de `entries-Vérité_khinae.txt` sont une copie exacte, caractère pour caractère, des lignes #21 à #68 de `entries-Vérité_garou.txt`** (les 12 Sangs vifs). Le catalogue Khinae ne possède donc en propre que 20 talents (2 par Lignée).

Rattachement des entrées aux groupes, déduit des règles et de l'ordre des fichiers (les fichiers d'entrées n'indiquent pas le groupe) :
- **Vampire** : communs #1–9 ; Cours — Krovni #10–12, Alghul #13–15, Oru #16–18, Ihuito #19–21, Shi Hun #22–24 ; Sangs noirs (4 talents chacun) — Écarlate #25–28, Primal #29–32, Hypocrite #33–36, Venimeux #37–40, Masqué #41–44, Aveugle #45–48, Traqueur #49–52, Glacial #53–56, Ardent #57–60, Orageux #61–64, Révélateur #65–68 ; Condamné #69–71 (3 seulement).
- **Garou** : communs #1–8 ; Pelages (2 chacun) — Gris #9–10, Noirs #11–12, Blancs #13–14, Roux #15–16, Bruns #17–18, Dorés #19–20 ; Sangs vifs (2 voies × 2 paliers) — Naturel #21–24, Alpha #25–28, Révélateur #29–32, Écarlate #33–36, Sculpteur #37–40, Funeste #41–44, Primal #45–48, Chasseur #49–52, Sagesse #53–56, Enragé #57–60, Enchaîné #61–64, Vengeur #65–68.
- **Khinae** : Lignées (2 chacune) — Canidés #1–2, Renards #3–4, Grands Félins #5–6, Chats #7–8, Rapaces #9–10, Requins #11–12, Serpents #13–14, Boudas #15–16, Berserkirs #17–18, Crocodiliens #19–20 ; Sangs vifs #21–68 (copie Garou).

---

## A. Synthèses

### A1. Vampire

1. **Intention lisible et solide** : quatre couches distinctes (Nature gratuite → Empreinte de Cour gratuite → Sang noir → talents communs/de Cour), avec la séparation explicite « Cour d'origine ≠ allégeance politique ». C'est la meilleure architecture des trois Natures.
2. **Le socle gratuit est riche** (9 propriétés) : Prédation, Fascination, Stase, Effacement, sens… Le Vampire Voilé n'a rien, le Révélé a presque tout. Bonne lisibilité de la polarité V/R.
3. **Incohérence de règles** : le tableau des états donne en R « +2 Vigueur, +1 Volonté », le texte du diagramme dit « +2 Vigueur, **+1 Agilité**, +1 Volonté ». Forme animale (#29) confirme la version sans Agilité. À corriger dans le SVG.
4. **Textes courts et propres** (~240 octets en moyenne, contre ~450 pour Garou/Khinae) : le gabarit « Pour X PA à Y m, jet contre défense ; effet ; limite » est déjà presque standard. C'est le modèle à généraliser aux deux autres Natures.
5. **Empreintes de Cour très déséquilibrées** : *Prédateur de guerre* (Krovni, +3 Défense passive ET active contre le physique, permanent en R) et *Enfant des Ténèbres* (Oru, inciblable dans l'ombre) sont des pouvoirs de combat majeurs gratuits ; *Écho des Morts* (Alghul) est un sens d'enquête narratif ; *Cycle du Sang* (Ihuito) n'économise qu'1 PA par scène sous double condition ; *Équilibre dérobé* (Shi Hun) est flou (« une résistance »). Écart d'un facteur 3 ou plus entre Cours.
6. **Asymétrie** : seule Krovni a une « signature culturelle » (+1 Diplomatie) en plus de son Empreinte, alors qu'elle a déjà l'Empreinte la plus forte.
7. **Redondances internes « commande mentale »** : Domination (#6), Ordre impérieux (#11), et à l'extérieur Regard d'Alpha/Autorité absolue (Garou) sont quatre variantes de « 1 PA, Charisme + Autorité contre Défense occulte, geste/ordre bref ». Domination et Ordre impérieux sont quasi identiques à 10 m pour 1 PA.
8. **Chaîne Shi Hun en quatre étages sur le même effet** : Équilibre dérobé (Empreinte) → Souffle du Yang (#22) → Harmonie impossible (#23) → Union du Hun et du Po (#24). Quatre textes pour « ignorer une faiblesse après s'être nourri », avec trois fréquences différentes (1/scène, 1/scène, 1/scénario).
9. **Trois Sangs élémentaires parallèles mais mal calibrés** (Glacial, Ardent, Orageux) : même squelette (toucher → toucher amélioré → zone → zone améliorée), mais Toucher ardent (#57) inflige DGT 5 dès le palier 1 quand Toucher glacial (#53) et Décharge orageuse (#61) infligent DGT 3 avec un malus. Fournaise (#60) inflige 2 PV/round sans jet, alliés compris.
10. **Cinq zones maintenues aux coûts hétérogènes** : Brume étouffante (2 PA, 3 m), Effluves toxiques (2 PA, 3 m), Dévorer la chaleur (1 PA, 3 m), Fournaise (2 PA, 3 m), Brume électrostatique (1 PA, 5 m) — toutes « maintenue pour 1 PA par round ». Un mot-clé *Zone* unique éviterait cinq rédactions.
11. **Outliers forts** : Déferlement écarlate (#27, +3 à un test physique par round sans coût), Arme hématique (#52, arme DGT 5 à 20 m sans équipement), Changement de corps (#71, quasi-immortalité stratégique), Prédateur de guerre (Empreinte gratuite). **Outliers faibles** : Cycle du Sang (Empreinte), Sang exalté (#19, renoncer à 2 PV de soin pour +3), Mimétisme parfait (#44, devrait être inclus dans Voix volée), Vision thermique (#37) sans palier R.
12. **Sang Condamné incomplet** : 3 talents au lieu de 4, sans le talent SR d'entrée commun aux autres Sangs.
13. **Règle de maîtrise des Sangs noirs à 4 PTV** alors que les Sangs vifs (Garou/Khinae) sont à 6 PTV, pour le même coût d'éveil (3 PTV). Le Vampire multiclasse plus vite sans justification énoncée.
14. **Poids papier** : le chapitre de règles est léger ; le poids vient des 71 talents à retenir, des multiples « contre la Puissance » (dont la valeur n'est jamais rappelée), et des 1/scène, 1/scénario, 1/round dispersés. Sang préservé (#15) est un mini-rituel de 600+ caractères.
15. **Dépendances** : Compagnons liés (Lien du Deimon), Défense occulte, états Tendu/Paniqué, Surprise, « Puissance » (définie ailleurs), Néant/Cycle, Corruption (Sangs rares), Strygoi (#71, non défini ici).
16. **Traits (14)** : fidèles mais abrégés jusqu'à perdre des données utiles : Malédiction (#9) ne mentionne plus les 2 PV irréductibles/round, aucun trait ne porte son accès (R/SR) entre crochets, Fascination n'indique pas son coût d'1 PA.

### A2. Garou

1. **Intention claire** : « explosif mais coûteux ». L'hybride est le pic physique du jeu ; son prix est le round de Mue et l'épuisement progressif (Auto/15/18/21/25). Bon levier de design, lisible en un tableau.
2. **Trois formes R bien distinctes** (humain révélé polyvalent, loup éclaireur, hybride machine de guerre), et la règle « une forme animale = quelques propriétés, jamais une seconde fiche » est excellente.
3. **Frénésie bien bornée** : ni jauge ni Stress, déclenchée seulement par un effet qui le dit. Mais du coup **le sous-système (6 lignes) ne sert presque qu'au Sang Enragé** (#57–60) et à quelques effets externes : coût d'apprentissage élevé pour une fréquence faible.
4. **Problème majeur de rédaction : les textes contiennent des notes de développeur/serveur** qui n'ont rien à faire dans un texte de joueur : « Le texte actuel ne limite pas explicitement cette relance… ne pas introduire silencieusement cette restriction » (#17), « Une interface doit afficher les deux traits » (#16), « ne rend pas automatiquement des PV dans le Builder » (#6), « Ces échelles et le jet sont nouveaux » (#21), « La seconde fonction est nouvelle » (#60), « Prix de 2 PTV : total 3 » (#50), « Remplace, et ne complète pas, l'ancien effet » (#62), « Afficher +1 au premier round » (#57), « Le coût supplémentaire doit rester visible dans la fiche de forme » (#51), « Bibliothèque vivante sera différenciée… » (#53). Sur papier, c'est du bruit pur et cela double la longueur moyenne.
5. **Sur-défense rédactionnelle** : presque chaque talent énumère 3–5 choses qu'il ne fait pas (« ni… ni… ni… »), souvent redites deux fois dans la même entrée (#13, #15, #34, #45). Le mot « réellement » apparaît dans 21 entrées. Ces garde-fous devraient être une règle générale unique (« un talent ne fait que ce qu'il dit »).
6. **Outlier fort n°1 : le Sang Enchaîné** (Corps Enchaîné : +2 Vig, +2 Agi, +1 PA, Déplacement ×2 en humain révélé, sans round de Mue, sans épuisement, avec armes, armures et augmentations) + Prédateur debout (+3 Pugilat) + Vitesse impossible (#62, Défense active gratuite chaque round même Surpris). En TUC, garder fusils, armure et implants vaut davantage que DGT 5/Armure 2 naturels. C'est l'option la plus forte des trois Natures.
7. **Outlier fort n°2 : Déferlement écarlate (#35)** cumulé avec l'hybride (+3 Vig, +3 Pugilat) : +3 supplémentaire gratuit chaque round.
8. **Outliers faibles** : Mémoire absolue (#53, purement narratif à 1 PTV), Furie de survie (#5, suivi de seuils 50 %/25 % pour un +3 ponctuel), Esprit calme (#17, relance 1/scène d'un test rare), Aura effacée (#2, doublon de bonus Furtivité animale).
9. **Redondances** : Terreur du prédateur (#3) = Présence du Conquérant (Vampire #10) mot pour mot ; Regard d'Alpha (#25) ≈ Domination (Vampire #6) ; Autorité absolue (#26) ≈ Ordre impérieux (Vampire #11) ; Brume défensive (#47) ≈ Corps de brume (Vampire #31) ; Chasse coordonnée (#12) et Ordre de bataille (#13) lèvent tous deux l'interdiction d'Assistance en combat ; Hurlement du Rempart (#10), Ralliement (#27), Hurlement d'Alpha (#28) et Bravoure lupine traitent la peur de meute en quatre textes qui se renvoient l'un à l'autre ; Traque infatigable (#8) / Marque indélébile (#49) / Traque parfaite (#50) / Traque hématique (#34) = quatre pistages.
10. **Pelages** : bonnes traditions gratuites (Gardien, Territoire, Fenrir, Mue partielle, Kami, Trace), très différenciantes. Mais les arbres de 2 talents sont minces et parfois hors thème (Esprit calme chez les Bruns spirituels). Le Pelage Doré (Trace, 3 types, Digestion, Vol de secret) est un mini-système fortement « défini avec le MJ ».
11. **Discipline de Fenrir** (banque d'1 PA) est élégante mais demande un suivi inter-round ; Vitesse impossible (Enchaîné) la rend obsolète.
12. **Sangs vifs : structure « 2 voies × 2 paliers » propre** (maîtrise = les deux paliers avancés, 6 PTV), meilleure que celle du Vampire. Mais elle est copiée telle quelle dans Khinae, dupliquant 48 entrées.
13. **Poids papier élevé** : ~450 octets par entrée, nombreux 1/scène + 1/round + 1/scénario dans la même fiche, Mue (round complet, compteur depuis repos, test, forçage, échec narratif, +1 PA différé) à suivre en combat.
14. **Données manquantes** : la propriété gratuite *Aura prédatrice* (règles) n'a pas d'entrée dans `entries-Traits_garou.txt` ; Corps Enchaîné y figure alors qu'il n'est pas un don de Nature mais un trait de Sang.
15. **Dépendances** : Compagnons liés (Pacte mineur), Assistance (règles de base), Surprise, Séquelles (#66), Défense occulte, Puissance, HDS (#60, non défini ici), Khinae (moteur commun), Corruption.

### A3. Descendants de Khinae

1. **Intention** : dix Lignées animales qui ne sont pas des « Garous repeints » ; elles partagent le moteur Mue/Frénésie/régénération mais pas les dons sociaux lupins. Le concept *Variante morphologique gratuite et non achetable* est sain et peu coûteux.
2. **Profils de forme compacts** (une ligne Animal, une ligne Hybride) : excellent format papier, à reproduire pour le Garou.
3. **Contenu propre très mince** : 2 talents par Lignée (20 au total), aucun talent commun, puis les 48 talents de Sangs vifs copiés du Garou. Une Lignée offre donc 2 achats identitaires contre 22 (communs + Pelage) au Garou.
4. **Duplication de données** : #21–68 copient Garou #21–68 y compris des références hors sujet pour un Khinae : « Mémoire absolue… du **Garou** » (#53), cumul avec « Chimère fonctionnelle » (#46, talent Roux inaccessible), « sans besoin de payer également le talent commun » (#50, il n'existe pas de talent commun Khinae), « Mue hybride pour Jayanti » (#60), « Hurlement du Rempart » (#28, talent Gris). Toute correction devra être faite deux fois.
5. **Équilibrage des hybrides** (somme Vig+Agi, DGT, Armure) : Garou 5/5/2 ; Canidés 5/5/1 ; Renards 5/4/1 ; Grands Félins **6/6/2** ; Chats 5/3/0 ; Rapaces 5/5/1 + Bond ailé ; Requins 6/6/2 (eau) ; Serpents 4–5/2–4/0–2 + venin ; Boudas 5/6/2 ; Berserkirs 5/6/3 ; Crocodiliens **5(7 dans l'eau)/6/4**. Le Grand Félin domine strictement l'hybride Garou ; le Crocodilien (Armure 4 + 2 PV/round) est le tank absolu ; le Chat (Armure 0, DGT 3) est faible en combat sans compensation mécanique équivalente.
6. **Variantes ambiguës** : « Lion +4 Vigueur/+1 Agilité » — on ne sait pas si cela modifie la forme animale, hybride ou les deux. Les Traits correspondants (#25, #26…) ont perdu ces chiffres : le serveur et le papier divergent.
7. **Signatures gratuites inégales** : Bond ailé (Rapaces, mobilité tactique majeure), Corps ophidien et Masse ursine (forts), contre Sang qui refuse l'abysse (relance 1/scène sur un cas très rare) ou Inoffensif par nature (anti-détection narrative).
8. **Étiquettes d'accès incohérentes** : #2 et #3 sont tagués [R] mais leur texte commence par « SR — 1 PA » ; #8, #10, #13, #15, #18 recopient l'accès au début du texte (« R — Animal/Hybride »). Les Traits ne portent aucun accès.
9. **Redondances de Lignées** : Saisie du fauve (#6), Mâchoire verrouillée (#19) et Étreinte d'ours (#17) sont la même mécanique « saisie gratuite après morsure/attaque blessante ».
10. **Frénésie reprise mais sans objet** : le moteur est importé alors qu'aucun talent de Lignée ne la déclenche ; seul le Sang Enragé y touche.
11. **Mue/épuisement copiés** : le même tableau Auto/15/18/21/25 est réécrit dans les deux chapitres. À mutualiser.
12. **Talents de Lignée de qualité variable** : bons (Piste bifurquée, Relais de chasse, Bond souverain, Vue plongeante, Frappe ophidienne) ; trop niches pour un achat PTV (Mue de peau, Torpeur profonde, Charognard increvable, Toujours retomber, Apnée séculaire).
13. **Poids papier** : faible pour les profils, moyen pour les talents de Lignée (~350 octets, avec des notes de développeur : « Le modèle doit connaître la distance de bond de référence » #5, « Distinguer cette détection… » #11).
14. **Traits (55)** : 15 traits de Nature/signature + 40 Variantes à une ligne. Les Variantes sans chiffres sont inutiles mécaniquement ; la Bande de ricanement (#13) ajoute « pour les Talents de Lignée » absent des règles.
15. **Dépendances** : Garou (Frénésie, Mue), Corruption de Thul/V'Aagor/Shaoggith, venin (règle de poison générale), saisie (règle de combat générale), « cadre de campagne » pour l'accès.

### A4. Comparaison croisée

1. **Équilibre global des pics de puissance**
   - Vampire R : +2 Vig, +1 Vol, pas d'arme naturelle, pas d'Armure ; puissance via talents de Sang activés (PA) et Empreinte. Disponible instantanément.
   - Garou hybride : +3 Vig, +2 Agi, +3 Pugilat, DGT 5, Armure 2, +2 PV/round, +1 PA ; coûte 1 round + épuisement.
   - Garou Enchaîné : +2/+2, +1 PA, équipement complet, **sans coût de transformation** → meilleur ratio des trois Natures.
   - Khinae hybride : de 4 à 7 points d'Attribut, Armure 0–4.
   Le Vampire est nettement plus faible au corps à corps de base mais plus polyvalent (social, illusion, ombre). C'est cohérent avec le lore, sauf que les talents « Déferlement écarlate » et « Surrégime » (Écarlate) existent aussi chez le Vampire, réduisant l'écart sans coût de Mue.
2. **Sangs partagés entre Vampire et Garou** : Écarlate (Anya/Keyna : Vision du Sang, Traque hématique, Déferlement, Surrégime — **noms identiques, textes différents**), Révélateur (Zhi Xia/Ceallachán : Lecture superficielle/profonde, Dissipation révélatrice — **même nom, effets différents** : la version vampire suspend aussi « une capacité de Vérité identifiée », la version garou non), Primal (Lyssa/Khuyildar : brume défensive dans les deux). Deux règles différentes sous le même nom = erreurs garanties à table. Il faut soit un texte unique, soit des noms différents.
3. **Règle d'éveil des Sangs incohérente** : maîtrise à 4 PTV (Vampire) contre 6 PTV (Garou/Khinae), éveil à 3 PTV pour tous. À unifier (recommandation : « maîtrise = tous les talents de palier 2 du Sang », quel que soit le nombre de PTV).
4. **Frénésie** : propre au moteur Khinae ; absente du Vampire alors que celui-ci « descend de Khinae ». Choix défendable, mais à énoncer explicitement dans le chapitre Vampire. Le sous-système est surdimensionné par rapport à sa fréquence ; il gagnerait à devenir un **état standard** sur une carte (Impulsion, −3 calme, peur ignorée, sortie 15/12).
5. **Sang / Prédation** : le Vampire a un vrai moteur de ressource (Prédation → soin → Sang exalté/Offrande/Cycle du Sang/Souffle du Yang/Sang du Dieu) ; c'est le seul de la famille. Mais il est éparpillé en conditions « après une Prédation dans la scène » toutes rédigées différemment. Un état **« Repu »** (activé par une Prédation réussie, dure la scène) unifierait 6 textes.
6. **Dévoration** : Sang du Dieu (Vampire #21), Trace dévorée/Digestion/Vol de secret (Pelage Doré), Assimilation de chair (Primal Garou), Dévoration de savoir/Héritage de chair (Sagesse) = cinq façons de « manger pour copier ». Un mot-clé **Dévorer (X)** avec une table commune (Sens / Chair / Essence / Savoir / Forme) les absorberait.
7. **Pelage vs Cour vs Lignée** : trois « appartenances » avec tradition gratuite. Cour = 1 Empreinte + 3 talents ; Pelage = 1 tradition + 2 talents ; Lignée = signature + Variante + 2 talents. Les volumes et la puissance des gratuités diffèrent fortement ; harmoniser sur « 1 gratuit + 3 talents » partout.
8. **Commandes mentales, peur, lecture, dissipation** existent en double ou triple entre Natures avec des formulations divergentes. Un **lexique transversal** (Effroi, Injonction, Ordre, Lecture, Dévoilement, Dissipation) réduirait d'environ 15 entrées.
9. **Régénération** : Vampire (Prédation + Stase 1→2 PV/h), Garou/Khinae (Régénération lente 1 PV/h, hybride 2 PV/round, Régénération acharnée 3). Lisible ; à garder.
10. **Qualité rédactionnelle** : Vampire > Khinae > Garou. Le gabarit Vampire doit devenir la norme.

---

## B. Propositions concrètes

### B1. Nettoyage immédiat (sans changer l'équilibre)
1. **Sortir toutes les notes de développeur/serveur** des textes joueurs vers un champ `note_impl` : Garou #5, #6, #9, #13, #16, #17, #19, #20, #21, #34, #36, #45, #50, #51, #53, #54, #57, #60, #61, #62 et leurs copies Khinae ; Khinae #5, #11.
2. **Une règle générale « Portée stricte »** dans le chapitre Vérité : « Un talent ne fait que ce qu'il énonce. Il ne crée pas de piste, de matière, d'information ou d'immunité non mentionnées ; les bonus de même source ne se cumulent pas ; les protections adaptées s'appliquent. » Puis supprimer les phrases « ni… ni… » redondantes (gain estimé : −35 % de texte Garou/Khinae).
3. **Dédupliquer Khinae #21–68** : un seul registre « Sangs vifs (descendants de Khinae) » référencé par les deux Natures, avec un texte neutre (« le porteur », pas « le Garou ») et les renvois Pelage-spécifiques retirés.
4. **Corriger les incohérences** : diagramme des états Vampire (+1 Agilité parasite) ; tags d'accès Khinae #2, #3 (SR) et préfixes en texte #8, #10, #13, #15, #18 ; ajouter Aura prédatrice aux Traits Garou ; rétablir les chiffres des Variantes dans les Traits Khinae ; Traits Vampire #9 avec les 2 PV/round ; lien « héritage Khinae » du chapitre Vampire qui pointe vers l'article Garou.
5. **Unifier la maîtrise des Sangs** (Vampire 4 PTV vs Garou/Khinae 6 PTV).

### B2. Mots-clés standardisés (une carte de référence)
- **Effroi** (1 PA, 10 m, Charisme + Autorité vs Défense occulte → Tendu pour la scène face à vous ; DR 3+ : Paniqué jusqu'à la fin de son prochain round). Remplace Présence du Conquérant (V#10) et Terreur du prédateur (G#3).
- **Injonction** (geste bref) / **Ordre** (action d'un round, résistance 1 PA). Remplace Domination, Ordre impérieux, Regard d'Alpha, Autorité absolue.
- **Zone (r m)** : « Coût 2 PA (1 PA si r ≤ 3 m), entretien 1 PA/round, affecte tout le monde, test à l'entrée et au début de chaque activation. » Remplace 5 rédactions vampiriques et Brume gardienne.
- **Toucher élémentaire (DGT n, effet)** : même squelette pour Glacial/Ardent/Orageux, DGT 3 + effet au palier 1, DGT 5 + effet amélioré au palier 2.
- **Repu** : état acquis par une Prédation réussie, dure la scène ; Sang exalté, Cycle du Sang, Souffle du Yang, Union, Sang du Dieu s'en servent.
- **Dévorer (type)** : table commune Sens / Chair / Essence / Savoir / Forme.
- **Parade surnaturelle** : « Réaction 1 PA : Défense active +3 contre une attaque physique perçue. » Remplace Corps de brume, Brume défensive, et sert de base à Mue réflexe, Déchaînement élémentaire (option défensive).
- **Assistance de combat** : exception unique qui lève l'interdiction d'Assistance en combat ; Chasse coordonnée et Ordre de bataille en deviennent deux déclencheurs.
- **Frénésie** et **Mue hybride** : une carte chacune, imprimée une seule fois pour Garou et Khinae.

### B3. Gabarit de rédaction (maximum ~220 caractères)
`Nom [Accès · Coût · Fréquence] — Jet : X vs Y. Effet : … Palier sup. : … Limite : (une seule, si non couverte par la règle générale).`

### B4. Rééquilibrages
- **Empreintes de Cour** : Prédateur de guerre → +3 Défense **active** seulement (ou +2 aux deux) ; Cycle du Sang → « 1/scène, après une Prédation, votre prochain talent de Sang de la scène coûte 1 PA de moins » (supprimer « avant la fin du round ») ; Équilibre dérobé → fusionner avec Souffle du Yang (devient l'Empreinte), et l'arbre Shi Hun passe à Harmonie impossible / Union / un nouveau talent.
- **Sang Enchaîné** : Corps Enchaîné → +1 PA seulement en « posture de guerre » (1 PA d'activation, ou 1 round sans épuisement) ; Vitesse impossible → Défense active gratuite 1/round mais **pas** en Surprise, ou 1/scène en Surprise.
- **Déferlement écarlate** (V#27, G#35) → 1/scène, ou +3 « sauf si vous êtes déjà en hybride ».
- **Hybrides Khinae** : borner à « somme Vig+Agi = 5, DGT 5, Armure 2 » pour la référence, avec un seul échange autorisé par Lignée (+1 Armure contre −1 Agilité, etc.) : Grands Félins → +3/+2 DGT 6 Armure 1 ; Crocodiliens → Armure 3 ; Chats → Armure 1 et +3 Défense active contre les attaques de mêlée (survie par esquive).
- **Toucher ardent** → DGT 3 (inflammation au palier 2), aligné sur Glacial/Orageux.
- **Sang Condamné** : ajouter un talent SR d'entrée (« Odeur de magie » : percevoir une manifestation active à 10 m).
- **Signatures Khinae faibles** : Sang qui refuse l'abysse → +3 permanent contre la Corruption de Thul ; Inoffensif par nature → ajouter +3 Diplomatie/Duperie pour se faire passer pour non-menaçant.

### B5. Paquets / voies papier
- **Carte Nature** recto (états, gratuits) + verso (Mue/Frénésie ou Prédation/Stase).
- **Carte d'appartenance** (Cour/Pelage/Lignée) : gratuit + 3 talents.
- **Carte de Sang** : 4 talents en 2 voies × 2 paliers, mêmes dimensions pour Sangs noirs et Sangs vifs.
- Un personnage = 1 carte Nature + 1 carte d'appartenance + 1–2 cartes de Sang. Les talents « communs » répétitifs se fondent dans les cartes Nature (ex. Insensibilité améliorée + Physiologie maudite ; Stase profonde + Stase).

### B6. Exemples avant/après

**Exemple 1 — Garou #17 Esprit calme**
- *Avant (≈ 520 caractères)* : « Une fois par scène, relancez immédiatement le jet raté contre une Frénésie, une perte de contrôle instinctive ou une domination exploitant votre nature animale et conservez le second résultat. La relance elle-même ne consomme pas de PA supplémentaire et ne s'ajoute pas à une autre relance de Talent. Le texte actuel ne limite pas explicitement cette relance aux échecs non narratifs : ne pas introduire silencieusement cette restriction. Elle n'annule pas une conséquence irréversible déjà résolue avant son déclenchement. »
- *Après (≈ 150)* : « **Esprit calme** [SR · 0 PA · 1/scène] — Relancez un test raté contre une Frénésie, une perte de contrôle ou une domination instinctive ; gardez le second résultat. »

**Exemple 2 — Vampire #10 Présence du Conquérant + Garou #3 Terreur du prédateur**
- *Avant* : deux textes de ~350 caractères, quasi identiques.
- *Après* : « **Présence du Conquérant** (Krovni) / **Terreur du prédateur** (Garou) [R · 1 PA · 10 m] — *Effroi*. » La définition d'Effroi figure une seule fois sur la carte de mots-clés.

**Exemple 3 — Garou #5 Furie de survie**
- *Avant* : seuils 50 % puis 25 %, non-redéclenchement après soin, gestion du changement de PV max par forme, non-cumul…
- *Après* : « **Furie de survie** [R · passif · 1/scène] — La première fois dans la scène que vous êtes blessé à moitié de vos PV ou moins, votre prochain test physique de ce round ou du suivant gagne +3. » (un seul seuil, plus de suivi).

**Exemple 4 — Vampire #22–24 + Empreinte Shi Hun**
- *Avant* : 4 textes (Équilibre dérobé, Souffle du Yang, Harmonie impossible, Union du Hun et du Po) à fréquences différentes.
- *Après* : Empreinte **Souffle du Yang** [R · 1 PA · 1/scène, si Repu] — ignorez une faiblesse jusqu'à la fin de votre prochain round. *Harmonie impossible* : la durée devient la scène, dégâts de la faiblesse ÷2. *Union du Hun et du Po* : 1/scénario, inclut le Soleil et annule totalement.

**Exemple 5 — Khinae #2 Relais de chasse**
- *Avant* : tag [R], texte « SR — 1 PA Un allié pouvant l'entendre… » répétant deux fois les conditions.
- *Après* : « **Relais de chasse** [SR · 1 PA] — Un allié qui vous perçoit et poursuit la même proie reprend la piste sans la redécouvrir. »

---

## C. Tableaux exhaustifs

### C0. Chapitres de règles (une ligne par section majeure)

| # | Section | Verdict | Poids | Note |
|---|---|---|---|---|
| V-R1 | Architecture du Vampire | Garder | 1 | Quatre couches claires ; lien « héritage Khinae » pointe vers l'article Garou. |
| V-R2 | Voilé / Semi-Révélé / Révélé | Réécrire | 1 | Diagramme ajoute +1 Agilité en R, contredit le tableau et Forme animale. |
| V-R3 | Propriétés gratuites (9) | Simplifier | 2 | Riches ; regrouper sens/Effacement, Stase sur une carte verso. |
| V-R4 | Talents communs + progression du charme | Garder | 1 | Échelle Fascination→Charme→Domination→Somnambulisme lisible. |
| V-R5 | Empreintes des cinq Cours | Rééquilibrer | 2 | Krovni/Oru très forts, Ihuito/Shi Hun faibles ou flous. |
| V-R6 | Traditions de Cour (5 sous-sections) | Simplifier | 1 | Signature +1 Diplomatie seulement chez Krovni : asymétrie. |
| V-R7 | Principe des Sangs noirs | Garder | 1 | Convention SR/R claire, exception Masqué assumée. |
| V-R8 | Douze Sangs noirs (sous-sections) | Simplifier | 2 | Trois Sangs élémentaires parallèles à normaliser par mot-clé. |
| V-R9 | Sangs rares et transformations | Garder | 1 | Bonne mise hors catalogue des cas narratifs. |
| V-R10 | Éveiller d'autres Sangs | Rééquilibrer | 1 | Maîtrise 4 PTV contre 6 PTV chez Garou/Khinae. |
| G-R1 | Architecture du Garou | Garder | 1 | Intention « explosif mais coûteux » explicite. |
| G-R2 | Nature commune et états | Garder | 1 | Distinction Révélation / forme bien posée. |
| G-R3 | Dons gratuits (7) | Simplifier | 2 | Hiérarchie/Bravoure/Appel se chevauchent ; Aura prédatrice absente des Traits. |
| G-R4 | Forme humaine révélée | Garder | 1 | Courte, claire. |
| G-R5 | Forme animale — Loup | Garder | 1 | Tableau modèle ; principe « jamais une seconde fiche » excellent. |
| G-R6 | Forme hybride | Garder | 2 | Neuf lignes ; référence de puissance du jeu. |
| G-R7 | Transformation et épuisement de Mue | Simplifier | 2 | Dupliqué chez Khinae ; mettre sur une carte commune. |
| G-R8 | Frénésie | Simplifier | 2 | Six règles pour un état rare ; carte d'état. |
| G-R9 | Talents communs | Garder | 1 | Renvoi registre. |
| G-R10 | Pelages : six traditions gratuites | Rééquilibrer | 2 | Doré = mini-système ; Fenrir demande un suivi inter-round. |
| G-R11 | Sangs vifs : progression et éveil | Garder | 1 | Maîtrise = deux paliers avancés : meilleure règle que Vampire. |
| G-R12 | Douze Sangs vifs (sous-sections) | Fusionner (avec Khinae) | 1 | Registre unique partagé avec les descendants de Khinae. |
| G-R13 | Cas particulier — Sang Enchaîné | Rééquilibrer | 2 | +1 PA permanent sans Mue avec équipement complet : trop fort. |
| K-R1 | Nature commune des descendants | Garder | 1 | Exclusions lupines bien énoncées. |
| K-R2 | Propriétés communes, Mue, Frénésie | Fusionner (avec Garou G-R7/G-R8) | 2 | Tableau de Mue recopié ; référencer la carte commune. |
| K-R3 | Variantes & Sangs vifs | Simplifier | 1 | Préciser si les chiffres de Variante touchent l'animal ou l'hybride. |
| K-R4 | Canidés errants | Garder | 1 | Profil équilibré, quatre Variantes utiles. |
| K-R5 | Renards | Garder | 1 | Profil et signature cohérents. |
| K-R6 | Grands Félins | Rééquilibrer | 1 | Hybride +4/+2 DGT 6 Armure 2 domine l'hybride Garou. |
| K-R7 | Chats | Rééquilibrer | 1 | Armure 0, DGT 3 : compensation de combat insuffisante. |
| K-R8 | Rapaces | Garder | 1 | Bond ailé bien borné, sans vol stationnaire. |
| K-R9 | Requins | Simplifier | 2 | Double profil eau/terre ; signature anti-Thul trop étroite. |
| K-R10 | Serpents | Simplifier | 2 | Venins Vipère/Cobra à suivre par activation ; texte dense. |
| K-R11 | Boudas | Garder | 1 | Bande distincte de la Meute, bien posée. |
| K-R12 | Berserkirs | Garder | 1 | Armure 3 compensée par Agilité +0. |
| K-R13 | Crocodiliens | Rééquilibrer | 1 | Armure 4 + régénération : tank hors norme. |
| K-R14 | Accès, rareté et cas corrompus | Garder | 1 | Cadre de campagne utile, court. |

### C1. `entries-Vérité_vampire.txt` (71)

| # | Nom | Verdict | Poids | Note |
|---|---|---|---|---|
| 1 | Faveur de la nuit | Garder | 1 | +3 Furtivité simple, complète bien Effacement prédateur. |
| 2 | Sens du chasseur | Garder | 1 | +3 Perception de traque, clair ; proche de Traque infatigable Garou. |
| 3 | Régénération de sang | Garder | 1 | Améliore Prédation de 1 PV, lisible. |
| 4 | Insensibilité améliorée | Fusionner (avec Physiologie maudite) | 1 | Même logique +3 Constitution ; un seul trait « corps mort ». |
| 5 | Charme inhumain | Garder | 1 | Palier social clair après Fascination. |
| 6 | Domination | Fusionner (avec Ordre impérieux #11) | 2 | Quasi identique à Ordre impérieux ; mot-clé Injonction. |
| 7 | Somnambulisme | Garder | 2 | Suggestion post-hypnotique originale ; SR étonnant mais justifié. |
| 8 | Stase profonde | Fusionner (avec Stase) | 1 | Simple doublement ; peut devenir palier de la propriété Stase. |
| 9 | Dernier sommeil | Garder | 1 | Anti-mort 1/scénario élégant, bien borné. |
| 10 | Présence du Conquérant | Fusionner (avec Garou #3) | 1 | Texte identique à Terreur du prédateur ; mot-clé Effroi. |
| 11 | Ordre impérieux | Fusionner (avec Domination #6) | 2 | Différence avec Domination réduite à la résistance 1 PA. |
| 12 | Maître de guerre | Garder | 1 | +2 à un allié 1/round, simple et thématique. |
| 13 | Sang mémoriel | Garder | 1 | Enquête par le sang, jet et DR clairs. |
| 14 | Interroger les restes | Simplifier | 2 | Chevauche Sang mémoriel et Écho des Morts ; préciser différence. |
| 15 | Sang préservé | Simplifier | 3 | Texte de 600+ caractères ; à transformer en rituel encadré. |
| 16 | Marche dans les ombres | Garder | 1 | Extension naturelle d'Enfant des Ténèbres. |
| 17 | Ombre prédatrice | Garder | 1 | Surprise en sortie d'ombre, une phrase. |
| 18 | Lien du Deimon | Garder | 2 | S'appuie bien sur le moteur Compagnons liés. |
| 19 | Sang exalté | Rééquilibrer | 1 | Renoncer à 2 PV pour +3 une fois : trop faible. |
| 20 | Offrande sanglante | Garder | 1 | Sacrifice de PV contre PA, clair. |
| 21 | Sang du Dieu | Fusionner (avec mot-clé Dévorer) | 2 | Même concept que Trace dévorée du Pelage Doré. |
| 22 | Souffle du Yang | Fusionner (avec Équilibre dérobé) | 1 | Devient l'Empreinte Shi Hun ; doublon fonctionnel. |
| 23 | Harmonie impossible | Simplifier | 2 | Résistance « contre sa Puissance » floue sans valeur de référence. |
| 24 | Union du Hun et du Po | Garder | 1 | Sommet de chaîne, annulation du Soleil 1/scénario. |
| 25 | Vision du Sang | Fusionner (avec Garou #33) | 1 | Même nom que Garou, texte différent ; unifier. |
| 26 | Traque hématique | Fusionner (avec Garou #34) | 1 | Doublon de nom avec Garou ; texte unique requis. |
| 27 | Déferlement écarlate | Rééquilibrer | 1 | +3 gratuit chaque round : outlier fort. |
| 28 | Surrégime | Fusionner (avec Garou #36) | 1 | Version Garou ajoute plafond 5 PA ; harmoniser. |
| 29 | Forme animale | Simplifier | 2 | Liste de restrictions longue ; donner un profil type comme Khinae. |
| 30 | Ménagerie | Garder | 1 | Quatre formes, extension claire. |
| 31 | Corps de brume | Fusionner (avec Garou #47) | 1 | Identique à Brume défensive ; mot-clé Parade surnaturelle. |
| 32 | Brume étouffante | Simplifier | 2 | Zone 2 PA à normaliser avec mot-clé Zone. |
| 33 | Double ténébreux | Garder | 1 | Leurre clair, coûts explicites. |
| 34 | Double autonome | Simplifier | 2 | Feinte avec jet opposé puis +3 : deux étages pour un bonus. |
| 35 | Fantasmagorie | Garder | 1 | Illusion bornée par cube et doute. |
| 36 | Grande illusion | Garder | 1 | Palier d'échelle propre. |
| 37 | Vision thermique | Garder | 1 | Sens simple ; palier d'entrée correct. |
| 38 | Venin noir | Garder | 1 | Poison simple, −3 scène sans cumul. |
| 39 | Venins façonnés | Simplifier | 2 | Trois venins à mémoriser ; présenter en tableau. |
| 40 | Effluves toxiques | Simplifier | 2 | Zone 2 PA ; règle « protégé pour le round » à standardiser. |
| 41 | Visage volé | Garder | 1 | Clair ; proche de Visage sculpté Garou. |
| 42 | Voix volée | Fusionner (avec Mimétisme parfait #44) | 1 | Mimétisme n'est qu'une amélioration de détection. |
| 43 | Mue complète | Garder | 1 | Extension corporelle claire avec limite 25 %. |
| 44 | Mimétisme parfait | Fusionner (avec Voix volée #42) | 1 | Talent quasi vide seul ; à fondre. |
| 45 | Écholocation | Garder | 1 | Sens tactique, simple. |
| 46 | Sonar prédateur | Garder | 1 | Palier portée, sans complication. |
| 47 | Vision astrale | Garder | 1 | Clair, limite d'attaque utile. |
| 48 | Projection astrale | Simplifier | 2 | Double durée (combat/hors combat) à condenser. |
| 49 | Diagnostic prédateur | Garder | 1 | Analyse bornée, prépare Anatomie fatale. |
| 50 | Anatomie fatale | Simplifier | 2 | Dépend de règles de localisation par marge non rappelées. |
| 51 | Sang animé | Garder | 1 | Télékinésie limitée, coût clair. |
| 52 | Arme hématique | Rééquilibrer | 1 | Projectile DGT 5 à 20 m sans arme : très rentable. |
| 53 | Toucher glacial | Garder | 1 | Référence palier 1 élémentaire (DGT 3 + malus). |
| 54 | Gel brutal | Garder | 1 | DGT 6 pour 2 PA, ralentissement clair. |
| 55 | Dévorer la chaleur | Simplifier | 2 | Zone 1 PA contre 2 PA ailleurs : mot-clé Zone. |
| 56 | Hiver noir | Garder | 1 | Palier d'échelle propre. |
| 57 | Toucher ardent | Rééquilibrer | 1 | DGT 5 au palier 1 contre DGT 3 chez Glacial/Orageux. |
| 58 | Marque incandescente | Garder | 1 | DoT court, non cumulable, clair. |
| 59 | Embrasement | Garder | 1 | Utilitaire d'allumage borné. |
| 60 | Fournaise | Rééquilibrer | 2 | 2 PV/round sans jet à tous, alliés compris : à tester. |
| 61 | Décharge orageuse | Garder | 1 | Palier 1 aligné sur Toucher glacial. |
| 62 | Surcharge nerveuse | Garder | 1 | Perte de PA forte mais conditionnée DR 3+. |
| 63 | Brume électrostatique | Simplifier | 2 | Zone 5 m pour 1 PA + attaque à distance : deux règles. |
| 64 | Arc orageux | Garder | 1 | Chaîne de trois cibles, un seul jet : élégant. |
| 65 | Lecture superficielle | Fusionner (avec Garou #29) | 1 | Même nom et effet que Garou ; texte unique. |
| 66 | Lecture profonde | Fusionner (avec Garou #30) | 1 | Doublon Garou ; garder la version courte vampire. |
| 67 | Sang de Vérité | Garder | 1 | Détection de falsification au contact, simple. |
| 68 | Dissipation révélatrice | Réécrire | 1 | Même nom que Garou #32 mais cible plus large (capacité de Vérité). |
| 69 | Faim condamnée | Garder | 1 | Drain DGT 3 cohérent avec Prédation. |
| 70 | Faim magique | Garder | 1 | Réaction anti-sort chiffrée, claire. |
| 71 | Changement de corps | Simplifier | 3 | Très long ; Strygoi non défini ici ; enjeu de campagne. |

### C2. `entries-Vérité_garou.txt` (68)

| # | Nom | Verdict | Poids | Note |
|---|---|---|---|---|
| 1 | Grand instinct | Simplifier | 2 | Classification proie/rival/prédateur sans effet propre ; garder +3 Défense. |
| 2 | Aura effacée | Rééquilibrer | 1 | Non-cumul avec bonus animal la rend souvent vide. |
| 3 | Terreur du prédateur | Fusionner (avec Vampire #10) | 1 | Identique à Présence du Conquérant ; mot-clé Effroi. |
| 4 | Déplacement agile | Garder | 1 | +3 Athlétisme contextuel ; couper les garde-fous. |
| 5 | Furie de survie | Réécrire | 2 | Double seuil 50/25 % trop de suivi pour +3. |
| 6 | Régénération acharnée | Simplifier | 2 | Note « Builder » à retirer ; effet chiffré correct. |
| 7 | Métabolisme de Khinae | Garder | 1 | Mue gratuite 1/scénario, bien bornée. |
| 8 | Traque infatigable | Fusionner (avec Traque parfaite #50) | 2 | Texte renvoie lui-même à Traque parfaite ; pistage dispersé. |
| 9 | Riposte du Gardien | Simplifier | 1 | Note répète deux fois délai et cible. |
| 10 | Hurlement du Rempart | Fusionner (avec Ralliement #27) | 2 | Peur de meute traitée en quatre textes croisés. |
| 11 | Appel silencieux | Garder | 1 | Lien empathique 1 km, net. |
| 12 | Chasse coordonnée | Fusionner (avec Ordre de bataille #13) | 2 | Même exception d'Assistance en combat ; mot-clé unique. |
| 13 | Ordre de bataille | Fusionner (avec Chasse coordonnée #12) | 1 | Conditions répétées deux fois dans l'entrée. |
| 14 | Mémoire d'Ulfhednar | Garder | 1 | +3 Compétence 1/scénario, saveur Blancs forte. |
| 15 | Mue réflexe | Simplifier | 2 | Bonne idée, texte saturé de négations. |
| 16 | Chimère fonctionnelle | Simplifier | 2 | Note d'interface à retirer ; effet deux propriétés clair. |
| 17 | Esprit calme | Réécrire | 2 | Contient une note de développeur ; hors thème Bruns. |
| 18 | Pacte mineur | Garder | 2 | Moteur Compagnons liés réutilisé ; « défini avec le MJ ». |
| 19 | Digestion des essences | Simplifier | 1 | Coquilles (« conserverdeux », « différenteset ») ; note serveur. |
| 20 | Vol de secret | Simplifier | 3 | Copie de pouvoir entièrement à négocier avec le MJ. |
| 21 | Appel élémentaire | Simplifier | 2 | « Ces échelles et le jet sont nouveaux » : note à retirer. |
| 22 | Déchaînement élémentaire | Garder | 2 | DGT 6 à 20 m ou parade +3 ; bon palier. |
| 23 | Marque tellurique | Garder | 1 | Alarme territoriale claire. |
| 24 | Domaine primordial | Garder | 2 | Contre-sort local en territoire, bien borné. |
| 25 | Regard d'Alpha | Fusionner (avec Vampire #6) | 2 | Doublon de Domination ; mot-clé Injonction. |
| 26 | Autorité absolue | Fusionner (avec Vampire #11) | 2 | Doublon d'Ordre impérieux ; mot-clé Ordre. |
| 27 | Ralliement de meute | Garder | 2 | Nouveau test +3 à un allié : utile, à raccourcir. |
| 28 | Hurlement d'Alpha | Simplifier | 1 | Version zone du Ralliement ; renvoi au Rempart superflu. |
| 29 | Lecture superficielle | Fusionner (avec Vampire #65) | 2 | Même talent que Vampire, texte deux fois plus long. |
| 30 | Lecture profonde | Fusionner (avec Vampire #66) | 2 | Doublon Vampire ; garder version courte. |
| 31 | Œil de Vérité | Garder | 1 | Détection d'illusion à distance, distincte du Vampire. |
| 32 | Dissipation révélatrice | Réécrire | 2 | Même nom que Vampire #68, portée différente : source d'erreurs. |
| 33 | Vision du Sang | Fusionner (avec Vampire #25) | 1 | Même nom, texte différent ; unifier. |
| 34 | Traque hématique | Fusionner (avec Vampire #26) | 1 | Texte quasi uniquement des consignes serveur. |
| 35 | Déferlement écarlate | Rééquilibrer | 1 | +3 gratuit par round cumulé à l'hybride : trop fort. |
| 36 | Surrégime | Simplifier | 1 | Plafond 5 PA utile ; jargon « troisième gain direct » à couper. |
| 37 | Sculpture de matière | Garder | 2 | Utilitaire créatif, garde-fous longs mais nécessaires. |
| 38 | Grand remodelage | Garder | 2 | Palier d'échelle cohérent. |
| 39 | Visage sculpté | Fusionner (avec Vampire #41) | 1 | Même usage que Visage volé ; formulation commune. |
| 40 | Sculpture de chair | Simplifier | 3 | Répertoire utile noyé dans un texte de 700 caractères. |
| 41 | Vision funeste | Garder | 1 | Sens spectral clair. |
| 42 | Interroger le trépas | Simplifier | 2 | Proche d'Interroger les restes ; condenser l'opposition. |
| 43 | Hurlement funeste | Simplifier | 2 | Phrase sur le palier supérieur à retirer. |
| 44 | Cri d'outre-tombe | Garder | 1 | DGT 6 à 20 m plus immatériel ; palier clair. |
| 45 | Assimilation de chair | Fusionner (avec mot-clé Dévorer) | 2 | Concept partagé avec Trace et Sang du Dieu. |
| 46 | Chimère primale | Simplifier | 2 | Renvoi à Chimère fonctionnelle inutile hors Roux. |
| 47 | Brume défensive | Fusionner (avec Vampire #31) | 1 | Identique à Corps de brume ; Parade surnaturelle. |
| 48 | Brume gardienne | Garder | 1 | Zone défensive sans entretien, 1/scène : bon design. |
| 49 | Marque indélébile | Garder | 1 | Marqueur de pistage clair. |
| 50 | Traque parfaite | Simplifier | 1 | Note de prix PTV dans le texte à retirer. |
| 51 | Disparition | Garder | 2 | Invisibilité visuelle maintenue ; note de fiche à retirer. |
| 52 | Embuscade parfaite | Garder | 1 | Analogue à Ombre prédatrice, cohérent. |
| 53 | Mémoire absolue | Rééquilibrer | 1 | Purement narratif, note de développeur incluse. |
| 54 | Bibliothèque vivante | Simplifier | 2 | Consigne au MJ superflue ; effet +3 correct. |
| 55 | Dévoration de savoir | Fusionner (avec Héritage de chair #56) | 1 | Palier +2 scène / +3 scénario fusionnable. |
| 56 | Héritage de chair | Fusionner (avec Dévoration de savoir #55) | 1 | Simple amélioration chiffrée du précédent. |
| 57 | Fureur croissante | Garder | 1 | Montée +1/+2/+3, retirer la consigne d'affichage. |
| 58 | Rage lucide | Garder | 1 | Annule le −3 de Frénésie, clé de voûte du Sang. |
| 59 | Morsure furieuse | Garder | 2 | Contagion de Frénésie originale, bien bornée. |
| 60 | Éveil furieux | Simplifier | 3 | Deux fonctions sans lien ; « HDS » non défini ; note « nouvelle ». |
| 61 | Prédateur debout | Rééquilibrer | 1 | +3 Pugilat ajouté au Corps Enchaîné déjà dominant. |
| 62 | Vitesse impossible | Rééquilibrer | 1 | Défense gratuite chaque round même Surpris : outlier fort. |
| 63 | Griffe d'entrave | Garder | 1 | Anti-régénération ciblée, utile contre Garous/Vampires. |
| 64 | Sceller la Nature | Garder | 2 | Verrou de talent 1/scène, puissant mais conditionné. |
| 65 | Hurlement des plaies | Simplifier | 2 | Phrase cassée (« une cicatrice… ») ; DGT 5 sans armure fort. |
| 66 | Déchirer les cicatrices | Garder | 1 | Extension Séquelles, cohérente. |
| 67 | Onde de Mue | Garder | 1 | Donne une valeur au round de Mue : bon design. |
| 68 | Mue cataclysmique | Garder | 1 | Palier zone 5 m simple. |

### C3. `entries-Vérité_khinae.txt` (68)

| # | Nom | Verdict | Poids | Note |
|---|---|---|---|---|
| 1 | Chemin de traverse | Simplifier | 1 | Phrase de différenciation Garou/Félin à retirer. |
| 2 | Relais de chasse | Réécrire | 1 | Tag [R] contredit « SR — 1 PA » ; conditions dites deux fois. |
| 3 | Odeur empruntée | Réécrire | 1 | Tag [R] contredit SR ; limites répétées en fin. |
| 4 | Piste bifurquée | Garder | 1 | Jet opposé clair, fausse piste élégante. |
| 5 | Bond souverain | Simplifier | 1 | Note « le modèle doit connaître… » à retirer. |
| 6 | Saisie du fauve | Fusionner (avec Mâchoire verrouillée #19) | 1 | Même mécanique de saisie gratuite après blessure. |
| 7 | Toujours retomber | Rééquilibrer | 1 | Trop niche pour un achat PTV ; intégrer au profil Chat. |
| 8 | Passer partout | Simplifier | 1 | Accès recopié dans le texte ; garde-fous répétés. |
| 9 | Vue plongeante | Garder | 1 | +3 Perception en hauteur, net. |
| 10 | Perchoir impossible | Simplifier | 1 | Préfixe d'accès en texte ; dernière phrase superflue. |
| 11 | Sang dans l'eau | Simplifier | 1 | Phrase de distinction avec Sang Écarlate à retirer. |
| 12 | Lecture électrique | Garder | 1 | Sens aquatique chiffré, bien différencié. |
| 13 | Frappe ophidienne | Simplifier | 1 | « L'attaque n'est pas gratuite » répété deux fois. |
| 14 | Mue de peau | Rééquilibrer | 1 | Évasion 1/scène très niche pour un talent payant. |
| 15 | Mâchoire broyeuse | Simplifier | 1 | Exclusion surnaturelle écrite deux fois. |
| 16 | Charognard increvable | Rééquilibrer | 1 | +3 contre poisons ingérés seulement : faible. |
| 17 | Étreinte d'ours | Fusionner (avec Saisie du fauve #6) | 1 | Troisième talent de saisie ; regrouper en mot-clé Prise. |
| 18 | Torpeur profonde | Rééquilibrer | 1 | Purement narratif, zéro impact de session. |
| 19 | Mâchoire verrouillée | Fusionner (avec Saisie du fauve #6) | 1 | Doublon fonctionnel de Saisie du fauve. |
| 20 | Apnée séculaire | Rééquilibrer | 1 | Devrait être inclus dans le profil Crocodilien. |
| 21 | Appel élémentaire | Fusionner (avec Garou #21) | 2 | Copie exacte de Garou #21 ; registre unique. |
| 22 | Déchaînement élémentaire | Fusionner (avec Garou #22) | 2 | Copie exacte ; maintenance double. |
| 23 | Marque tellurique | Fusionner (avec Garou #23) | 1 | Copie exacte ; mention Pelage Noir hors sujet. |
| 24 | Domaine primordial | Fusionner (avec Garou #24) | 2 | Copie exacte de Garou #24. |
| 25 | Regard d'Alpha | Fusionner (avec Garou #25) | 2 | Copie exacte ; aussi doublon de Domination vampirique. |
| 26 | Autorité absolue | Fusionner (avec Garou #26) | 2 | Copie exacte de Garou #26. |
| 27 | Ralliement de meute | Fusionner (avec Garou #27) | 2 | Copie exacte ; « meute » à remplacer par « proches ». |
| 28 | Hurlement d'Alpha | Fusionner (avec Garou #28) | 1 | Renvoie au Hurlement du Rempart, inaccessible au Khinae. |
| 29 | Lecture superficielle | Fusionner (avec Garou #29) | 2 | Copie exacte ; triple doublon avec Vampire. |
| 30 | Lecture profonde | Fusionner (avec Garou #30) | 2 | Copie exacte de Garou #30. |
| 31 | Œil de Vérité | Fusionner (avec Garou #31) | 1 | Copie exacte de Garou #31. |
| 32 | Dissipation révélatrice | Fusionner (avec Garou #32) | 2 | Copie exacte ; conflit de nom avec Vampire #68. |
| 33 | Vision du Sang | Fusionner (avec Garou #33) | 1 | Copie exacte ; doublon de nom Vampire. |
| 34 | Traque hématique | Fusionner (avec Garou #34) | 1 | Copie exacte, texte essentiellement consignes serveur. |
| 35 | Déferlement écarlate | Fusionner (avec Garou #35) | 1 | Copie exacte ; même rééquilibrage requis. |
| 36 | Surrégime | Fusionner (avec Garou #36) | 1 | Copie exacte ; mention « Enchaîné » hors Lignée. |
| 37 | Sculpture de matière | Fusionner (avec Garou #37) | 2 | Copie exacte de Garou #37. |
| 38 | Grand remodelage | Fusionner (avec Garou #38) | 2 | Copie exacte de Garou #38. |
| 39 | Visage sculpté | Fusionner (avec Garou #39) | 1 | Copie exacte ; proche de Visage volé vampirique. |
| 40 | Sculpture de chair | Fusionner (avec Garou #40) | 3 | Copie exacte du texte le plus lourd. |
| 41 | Vision funeste | Fusionner (avec Garou #41) | 1 | Copie exacte de Garou #41. |
| 42 | Interroger le trépas | Fusionner (avec Garou #42) | 2 | Copie exacte de Garou #42. |
| 43 | Hurlement funeste | Fusionner (avec Garou #43) | 2 | Copie exacte de Garou #43. |
| 44 | Cri d'outre-tombe | Fusionner (avec Garou #44) | 1 | Copie exacte de Garou #44. |
| 45 | Assimilation de chair | Fusionner (avec Garou #45) | 2 | Copie exacte ; recoupe déjà les formes de Lignée. |
| 46 | Chimère primale | Fusionner (avec Garou #46) | 2 | Renvoie à Chimère fonctionnelle (Roux) inaccessible. |
| 47 | Brume défensive | Fusionner (avec Garou #47) | 1 | Copie exacte ; doublon Corps de brume vampirique. |
| 48 | Brume gardienne | Fusionner (avec Garou #48) | 1 | Copie exacte de Garou #48. |
| 49 | Marque indélébile | Fusionner (avec Garou #49) | 1 | Copie exacte de Garou #49. |
| 50 | Traque parfaite | Fusionner (avec Garou #50) | 1 | Cite un « talent commun » inexistant chez les Khinae. |
| 51 | Disparition | Fusionner (avec Garou #51) | 2 | Copie exacte de Garou #51. |
| 52 | Embuscade parfaite | Fusionner (avec Garou #52) | 1 | Copie exacte de Garou #52. |
| 53 | Mémoire absolue | Fusionner (avec Garou #53) | 1 | Texte dit « le Garou » dans le registre Khinae. |
| 54 | Bibliothèque vivante | Fusionner (avec Garou #54) | 2 | Copie exacte de Garou #54. |
| 55 | Dévoration de savoir | Fusionner (avec Garou #55) | 1 | Copie exacte de Garou #55. |
| 56 | Héritage de chair | Fusionner (avec Garou #56) | 1 | Copie exacte de Garou #56. |
| 57 | Fureur croissante | Fusionner (avec Garou #57) | 1 | Copie exacte ; seul déclencheur de Frénésie Khinae. |
| 58 | Rage lucide | Fusionner (avec Garou #58) | 1 | Copie exacte ; mention « non-Loups » correcte ici. |
| 59 | Morsure furieuse | Fusionner (avec Garou #59) | 2 | Copie exacte ; « pas de Garou par infection » à neutraliser. |
| 60 | Éveil furieux | Fusionner (avec Garou #60) | 3 | Copie exacte ; mention Jayanti hors contexte. |
| 61 | Prédateur debout | Fusionner (avec Garou #61) | 1 | Copie exacte ; Enchaîné + Lignée animale : interaction non définie. |
| 62 | Vitesse impossible | Fusionner (avec Garou #62) | 1 | Copie exacte ; même outlier fort. |
| 63 | Griffe d'entrave | Fusionner (avec Garou #63) | 1 | Copie exacte de Garou #63. |
| 64 | Sceller la Nature | Fusionner (avec Garou #64) | 2 | Copie exacte de Garou #64. |
| 65 | Hurlement des plaies | Fusionner (avec Garou #65) | 2 | Copie exacte, y compris la phrase cassée. |
| 66 | Déchirer les cicatrices | Fusionner (avec Garou #66) | 1 | Copie exacte de Garou #66. |
| 67 | Onde de Mue | Fusionner (avec Garou #67) | 1 | Copie exacte de Garou #67. |
| 68 | Mue cataclysmique | Fusionner (avec Garou #68) | 1 | Copie exacte de Garou #68. |

### C4. `entries-Traits_vampire.txt` (14)

| # | Nom | Verdict | Poids | Note |
|---|---|---|---|---|
| 1 | Âme condamnée | Garder | 1 | Fidèle aux règles, purement narratif. |
| 2 | Petite immortalité | Garder | 1 | Fidèle ; accès R absent des crochets. |
| 3 | Physiologie maudite | Fusionner (avec Insensibilité améliorée) | 1 | Deux +3 Constitution voisins sur deux fiches. |
| 4 | Sens prédateurs | Garder | 1 | Fidèle ; recoupe Vision du Sang (#25). |
| 5 | Prédation sanguine | Réécrire | 1 | Perd le coût 1 PA et la formule 1 + DR. |
| 6 | Effacement prédateur | Garder | 1 | Fidèle et court. |
| 7 | Fascination vampirique | Réécrire | 1 | Coût 1 PA et accès SR absents du trait. |
| 8 | Stase | Réécrire | 1 | Perd 2 PA, 1 PV/heure et sortie 1 PA. |
| 9 | Malédiction vampirique | Réécrire | 1 | Les 2 PV irréductibles/round au soleil ont disparu. |
| 10 | Prédateur de guerre | Rééquilibrer | 1 | +3 aux deux Défenses gratuit : Empreinte la plus forte. |
| 11 | Écho des Morts | Garder | 1 | Fidèle ; Empreinte faible mais thématique. |
| 12 | Enfant des Ténèbres | Rééquilibrer | 1 | Inciblable dans l'ombre gratuitement : très fort. |
| 13 | Cycle du Sang | Rééquilibrer | 1 | Fenêtre « avant la fin du round » trop étroite. |
| 14 | Équilibre dérobé | Fusionner (avec Souffle du Yang) | 1 | « Une résistance » floue ; fusion avec #22. |

### C5. `entries-Traits_garou.txt` (13)

| # | Nom | Verdict | Poids | Note |
|---|---|---|---|---|
| 1 | Âme du Cycle | Garder | 1 | Fidèle, narratif. |
| 2 | Appel de la Meute | Garder | 1 | Fidèle ; conséquence Stress omise mais narrative. |
| 3 | Hiérarchie instinctive | Simplifier | 1 | Recoupe Grand instinct ; fusion possible en un sens. |
| 4 | Sens éveillés | Garder | 1 | Fidèle, sans bonus universel. |
| 5 | Bravoure lupine | Fusionner (avec Hurlement du Rempart) | 1 | Peur de meute dispersée en quatre textes. |
| 6 | Régénération lente | Réécrire | 1 | Valeur 1 PV/heure absente du trait. |
| 7 | Gardien de la Meute | Garder | 1 | Interposition claire, coût 1 PA à rappeler. |
| 8 | Territoire de la Meute | Garder | 1 | Anti-Surprise territorial élégant. |
| 9 | Discipline de Fenrir | Simplifier | 2 | Banque de PA inter-round à suivre ; rendue obsolète par Vitesse impossible. |
| 10 | Mue partielle | Garder | 1 | Polyvalence Roux bien bornée. |
| 11 | Accord des Kami | Garder | 1 | Fidèle, sens spirituel utile. |
| 12 | Trace dévorée | Simplifier | 2 | Table Sens/Chair/Essence absente du trait. |
| 13 | Corps Enchaîné | Rééquilibrer | 1 | Trait de Sang classé en Nature ; +1 PA sans Mue trop fort. |

### C6. `entries-Traits_khinae.txt` (55)

| # | Nom | Verdict | Poids | Note |
|---|---|---|---|---|
| 1 | Âme du Cycle | Garder | 1 | Identique au Garou, narratif. |
| 2 | Régénération lente | Réécrire | 1 | Omet la restriction R humain/animal. |
| 3 | Instinct de Lignée | Garder | 1 | Clarifie l'absence de dons lupins. |
| 4 | Corps de guerre | Garder | 1 | +3 Pugilat et 2 PV/round, fidèle. |
| 5 | Rythme Khinae | Garder | 1 | +1 PA différé, fidèle. |
| 6 | Piste nomade | Garder | 1 | Signature Canidés, fidèle. |
| 7 | Odeur mouvante | Garder | 1 | Signature Renards ; prépare Odeur empruntée. |
| 8 | Silence du grand fauve | Garder | 1 | Signature Félins, fidèle. |
| 9 | Inoffensif par nature | Rééquilibrer | 1 | Signature Chat faible face au Bond ailé. |
| 10 | Bond ailé | Garder | 1 | Mobilité forte mais bornée. |
| 11 | Sang qui refuse l'abysse | Rééquilibrer | 1 | Relance anti-Thul rarissime ; accès absent. |
| 12 | Corps ophidien | Garder | 1 | Signature forte et évidente. |
| 13 | Bande de ricanement | Réécrire | 1 | Ajoute « pour les Talents de Lignée » absent des règles. |
| 14 | Masse ursine | Garder | 1 | Omet la restriction Hybride. |
| 15 | Fossile de vase | Simplifier | 1 | Omet les détections qui fonctionnent (thermique, odorat). |
| 16 | Variante — Coyote | Garder | 1 | Terrain urbain adapté, utile en Californie. |
| 17 | Variante — Chacal / Dhole | Garder | 1 | Avantage charognard clair. |
| 18 | Variante — Lycaon | Garder | 1 | Poursuite sans fatigue, perd la précision des règles. |
| 19 | Variante — Dingo | Garder | 1 | Aridophile, net. |
| 20 | Variante — Roux | Garder | 1 | Profil de référence Renard. |
| 21 | Variante — Fennec | Garder | 1 | Chaleur et écoute. |
| 22 | Variante — Arctique | Garder | 1 | Froid et camouflage. |
| 23 | Variante — Gris / forestier | Garder | 1 | Escalade forestière. |
| 24 | Variante — Tigre | Garder | 1 | Référence ; nage. |
| 25 | Variante — Lion | Réécrire | 1 | Chiffres +4/+1 des règles absents du trait. |
| 26 | Variante — Panthère | Réécrire | 1 | +3/+3, DGT 5, Armure 1 absents du trait. |
| 27 | Variante — Jaguar | Garder | 1 | Profil de référence, milieu clair. |
| 28 | Variante — Puma | Réécrire | 1 | +3/+3, DGT 5, Armure 1 absents du trait. |
| 29 | Variante — Domestique | Garder | 1 | Couverture sociale utile. |
| 30 | Variante — Sauvage | Réécrire | 1 | +2/+3, DGT 4, Armure 1 absents du trait. |
| 31 | Variante — Nocturne | Garder | 1 | Faible lumière, net. |
| 32 | Variante — Grimpeur | Garder | 1 | Surfaces verticales, net. |
| 33 | Variante — Aigle | Réécrire | 1 | +3 Vigueur/+2 Agilité absents du trait. |
| 34 | Variante — Faucon | Réécrire | 1 | +1/+4 absents du trait. |
| 35 | Variante — Hibou | Réécrire | 1 | +1/+3 absents du trait. |
| 36 | Variante — Vautour | Réécrire | 1 | +2/+2 absents du trait. |
| 37 | Variante — Requin blanc | Garder | 1 | Référence, profondeur/froid. |
| 38 | Variante — Bouledogue | Réécrire | 1 | +3/+2, DGT 5, Armure 2 absents. |
| 39 | Variante — Requin tigre | Garder | 1 | Référence robuste, digestion. |
| 40 | Variante — Requin marteau | Réécrire | 1 | +3/+3, DGT 5, Armure 1 absents. |
| 41 | Variante — Requin baleine | Réécrire | 1 | « Moins prédateur » mais +5 Vig, Armure 3 dans les règles. |
| 42 | Variante — Vipère — hémotoxique | Simplifier | 2 | Venin réel détaillé seulement dans les règles. |
| 43 | Variante — Cobra — neurotoxique | Simplifier | 2 | Limite de PA forte non reprise dans le trait. |
| 44 | Variante — Python / Boa — constricteur | Réécrire | 1 | +4/+1, DGT 4, Armure 2 absents. |
| 45 | Variante — Couleuvre / petite lignée furtive | Réécrire | 1 | +1/+4, DGT 2, Armure 0 absents. |
| 46 | Variante — Hyène tachetée | Réécrire | 1 | +4/+1 absents du trait. |
| 47 | Variante — Hyène rayée | Réécrire | 1 | +2/+3 absents du trait. |
| 48 | Variante — Hyène brune | Garder | 1 | Référence, charogne et aridité. |
| 49 | Variante — Brun / Grizzly | Garder | 1 | Référence Berserkir. |
| 50 | Variante — Polaire | Garder | 1 | Froid et immersion. |
| 51 | Variante — Ours noir | Réécrire | 1 | +4/+1, DGT 6, Armure 2 absents. |
| 52 | Variante — Crocodile du Nil / marin | Garder | 1 | Référence ; Armure 4 à rééquilibrer côté profil. |
| 53 | Variante — Alligator | Réécrire | 1 | +4/+1 à terre, Armure 4 absents. |
| 54 | Variante — Caïman | Réécrire | 1 | +4/+1, DGT 5, Armure 3 absents. |
| 55 | Variante — Gavial | Réécrire | 1 | +3/+2 dans l'eau, DGT 5, Armure 2 absents. |

---

## D. Comptage

### D1. Entrées lues

| Fichier | Entrées attendues | Lignes dans le tableau C |
|---|---|---|
| entries-Vérité_vampire.txt | 71 | 71 |
| entries-Vérité_garou.txt | 68 | 68 |
| entries-Vérité_khinae.txt | 68 | 68 (dont #21–68 = copie exacte de Garou #21–68) |
| entries-Traits_vampire.txt | 14 | 14 |
| entries-Traits_garou.txt | 13 | 13 |
| entries-Traits_khinae.txt | 55 | 55 |
| **Total entrées** | **289** | **289** |
| Chapitres de règles (sections) | 5 articles | 36 lignes (C0) |

### D2. Répartition des verdicts (entrées, hors C0)

| Fichier | Total | Garder | Simplifier | Fusionner | Réécrire | Couper | Rééquilibrer |
|---|---|---|---|---|---|---|---|
| Vérité vampire | 71 | 37 | 13 | 15 | 1 | 0 | 5 |
| Vérité garou | 68 | 26 | 18 | 16 | 3 | 0 | 5 |
| Vérité khinae | 68 | 3 | 7 | 51 | 2 | 0 | 5 |
| Traits vampire | 14 | 5 | 0 | 2 | 4 | 0 | 3 |
| Traits garou | 13 | 7 | 3 | 1 | 1 | 0 | 1 |
| Traits khinae | 55 | 29 | 3 | 0 | 21 | 0 | 2 |
| **Total** | **289** | **107** | **44** | **85** | **32** | **0** | **21** |

Lecture : aucune coupe sèche n'est proposée ; l'essentiel du gain vient des fusions (dont 48 dédoublonnages Khinae/Garou et une douzaine de doublons Vampire/Garou) et de la simplification rédactionnelle (retrait des notes serveur et des négations redondantes).

