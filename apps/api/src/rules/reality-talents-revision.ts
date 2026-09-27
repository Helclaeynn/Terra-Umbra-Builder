// Terra Umbra California — fictional tabletop RPG rules.
// Reality talent revision approved by the authors on 2026-09-27.
// The 55 canonical IDs and their acquisition requirements are preserved.
export const realityTalentRevision: Record<string, { effect: string; lore: string }> = {
  sante_de_fer: {
    effect: "Vous bénéficiez de +2 Constitution contre les maladies et infections. Chaque période de 24 heures comportant le repos nécessaire vous rend 2 PV supplémentaires, ajoutés après les éventuels multiplicateurs de récupération. Ce bénéfice ne modifie ni vos PV maximum, ni les soins instantanés, ni les tests d’Agonie.",
    lore: "Votre organisme résiste aux infections et récupère avec une régularité peu commune. Le repos vous remet plus vite sur pied, sans rendre votre corps invulnérable."
  },
  insensibilite_a_la_douleur: {
    effect: "La douleur seule n’impose ni malus ni interruption à une action que vous restez physiquement capable d’exécuter. Tant que vos PV sont positifs, calculez le Stress minimal imposé par vos blessures un cran moins sévèrement : Tendu devient Normal ; Paniqué devient Tendu. Un Stress psychologique indépendant reste applicable : retenez le plus grave des états encore imposés. Les blessures, incapacités réelles, l’Agonie et la mort ne changent pas.",
    lore: "La douleur vous informe sans commander tous vos gestes. Vous pouvez continuer là où la souffrance ferait céder quelqu’un d’autre, mais une blessure reste une blessure."
  },
  ambidextre: {
    effect: "Vous utilisez indifféremment vos deux mains. Une fois par round, pendant votre activation, vous pouvez dépenser 1 PA pour une attaque double avec deux armes à une main que vous pouvez réellement manier : deux armes de contact ou deux armes à feu employées en tir simple. Déclarez une même cible pour les deux attaques, puis effectuez deux jets séparés, chacun avec −3. Chaque attaque réussie applique ses dégâts et l’Armure normalement ; les défenses se résolvent selon leurs règles ordinaires. L’attaque double ne bénéficie ni de Viser, ni de Rafale, ni de Suppression, et ne se déclenche pas pendant une riposte. Les autres attaques du round n’utilisent qu’une arme par PA. Aucune réserve de PA n’est augmentée.",
    lore: "Vos deux mains savent travailler ensemble plutôt que se gêner. Avec deux armes adaptées, vous pouvez concentrer deux attaques sur une même ouverture, au prix d’une précision moindre."
  },
  fier_heritier: {
    effect: "Augmente le Train de vie de base d’un cran, avec un minimum Confortable ; peut exceptionnellement faire passer Aisé à Luxe. Luxe n’est pas un niveau de départ ordinaire : ce talent constitue l’exception. Aucun versement libre n’est ajouté au Compte.",
    lore: "Un patrimoine ou une rente familiale vous donne une aisance que votre seul métier n’expliquerait pas. Les plus favorisés peuvent ainsi accéder au Luxe."
  },
  renomme: {
    effect: "Votre Renommée augmente de 1 dans son milieu de référence, dans la limite de 5. Ce talent non répétable applique les bénéfices de la règle générale de Renommée. À 5, aucune progression supplémentaire ne peut être achetée avec ce talent.",
    lore: "Votre nom circule au-delà des personnes qui vous connaissent directement. Ce que l’on raconte de vous ouvre des conversations et pèse dans les rapports de force, sans devenir une autorité universelle."
  },
  maitre_des_lames: {
    effect: "Vous bénéficiez de +1 aux tests de Mêlée avec une lame. Sur une attaque réussie avec marge 6+, infligeant au moins 1 PV à une cible capable de saigner, vous pouvez choisir une plaie persistante comme Altération. Elle fait perdre 2 PV à la fin du round suivant, puis de chaque round, jusqu’à une compression accessible de 1 PA ou un soin approprié. Une seule plaie de ce talent agit par cible. L’Armure n’est pas appliquée une seconde fois à cette perte de PV et aucune autre Altération gratuite n’est ajoutée.",
    lore: "Une lame entre vos mains ne blesse pas au hasard. Une ouverture bien exploitée laisse une plaie que l’adversaire doit traiter plutôt que simplement ignorer."
  },
  tireur_de_precision: {
    effect: "Vous bénéficiez de +1 Tir. Une fois par round, juste avant un tir simple de votre activation, vous pouvez Viser sans dépenser le PA normalement requis. Cette visée apporte le +3 normal au tir concerné et les possibilités ordinaires de localisation si une Altération est obtenue. Le tir coûte toujours son PA. Une seconde visée sur ce même tir ne double pas le bonus ; pour d’autres tirs du round, Viser conserve son coût normal. Rafale, Suppression et l’attaque double d’Ambidextre restent incompatibles avec Viser. Le seuil normal d’Altération n’est pas abaissé.",
    lore: "Vous avez assez répété l’acquisition d’une cible pour construire votre visée dans le geste de tir. Vous gagnez du temps sans transformer chaque balle en coup imparable."
  },
  reflexes_defensifs: {
    effect: "Vous bénéficiez de +1 aux tests d’Esquive et pouvez effectuer une Défense active même en étant surpris. Vous payez normalement 1 PA et devez être physiquement capable de vous défendre. Si l’attaque ouvre le combat, ce PA est décompté de votre réserve du premier round. Le talent lève seulement l’interdiction liée à la Surprise : il ne donne aucun PA et n’autorise pas une défense interdite pour une autre raison. Le +1 aux tests ne recalcule pas la Défense passive.",
    lore: "Votre corps réagit même lorsque vous n’aviez pas anticipé l’attaque. Être pris de court ne suffit plus à vous priver de toute défense."
  },
  puits_de_savoir: {
    effect: "Vous bénéficiez de +1 Savoirs et choisissez un grand domaine de connaissance. Dans ce domaine, les faits ordinaires que vous avez réellement appris sont rappelés sans test de mémoire. Lors d’une recherche spécialisée, votre travail personnel de lecture, comparaison et analyse demande deux fois moins de temps. L’accès aux documents, les délais externes et les tests nécessaires pour interpréter une question difficile restent inchangés.",
    lore: "Une discipline est devenue un territoire familier. Vous y retrouvez vos connaissances et organisez la documentation avec l’efficacité d’un véritable spécialiste."
  },
  stable: {
    effect: "Vous bénéficiez de +1 Maîtrise spirituelle aux tests de Stress. Une fois par scène, après un échec non narratif à un tel test, vous réduisez d’un cran l’aggravation qu’il devait provoquer, sans descendre sous votre état précédent. Normal → Tendu reste Normal ; Normal → Paniqué devient Tendu ; Tendu → Paniqué reste Tendu. Les autres conséquences de l’échec subsistent. Ce bénéfice ne modifie ni les minima dus aux blessures ni un état imposé sans test.",
    lore: "Vous savez absorber le premier choc sans lui laisser immédiatement dicter votre conduite. Votre calme peut vaciller sans s’effondrer."
  },
  maitre_de_la_survie: {
    effect: "Vous bénéficiez de +1 Survie. Une action réussie de collecte d’eau, de recherche de nourriture ou d’installation d’abri peut satisfaire jusqu’à cinq personnes, vous compris, sans multiplier les tests ni le temps consacré à cette même tâche par le nombre de bénéficiaires. Il doit réellement exister assez de ressources ou d’espace. Une collecte ne fournit pas simultanément les autres besoins qui n’ont pas été traités.",
    lore: "Vous pensez la survie à l’échelle du groupe. Repérage, collecte et organisation permettent aux compagnons de profiter réellement de votre expérience."
  },
  diplomate: {
    effect: "Vous bénéficiez de +1 Diplomatie. Après quelques échanges réels, vous pouvez demander quelle concession concrète, garantie ou modification de proposition pourrait faire avancer la négociation, d’après les positions et indices exposés. Le MJ fournit une piste praticable, ou indique qu’aucun compromis ne ressort de ces échanges. Ce diagnostic ne révèle pas de pensée secrète : vous devez encore pouvoir offrir la concession et conclure l’accord.",
    lore: "Vous écoutez ce qui bloque vraiment l’échange et cherchez ce que chaque partie pourrait encore accepter. Comprendre le compromis ne dispense pas de le construire."
  },
  maitre_du_troc: {
    effect: "Vous bénéficiez de +1 Commerce. Lors d’un achat, vous obtenez 5 points de pourcentage supplémentaires de réduction sur le prix de référence de la transaction ; lors d’une vente, vous obtenez 5 points de pourcentage supplémentaires de majoration sur le prix de reprise de référence. Ce bénéfice est fixe, s’applique même si aucun jet n’est nécessaire et s’ajoute au résultat d’une négociation. Il se cumule aussi avec Accès fournisseur lorsqu’il s’applique : sa remise de statut et cet avantage de négociateur sont distincts. Les autres remises de statut équivalentes restent soumises à leur règle du meilleur bonus. Le talent ne crée ni acheteur ni obligation de conclure et ne multiplie pas son effet lorsqu’on fractionne la même transaction.",
    lore: "Vous savez conserver une marge supplémentaire à l’achat comme à la vente. Votre maîtrise du commerce s’ajoute au résultat de la négociation plutôt que de simplement le décrire."
  },
  procedures_administratives: {
    effect: "Une fois par scénario, lorsqu’une institution s’apprête à exécuter une décision administrative contre vous ou une personne que vous représentez, vous pouvez exploiter une procédure recevable pour en suspendre l’exécution jusqu’à la fin de la scène, le temps d’un réexamen. Il ne faut pas réussir un second jet pour obtenir ce délai. La suspension peut retarder une saisie, une fermeture, un transfert administratif ou une expulsion ; elle ne désarme pas une intervention face à un danger immédiat. La décision n’est pas annulée : vous disposez d’une fenêtre réelle pour agir, négocier ou apporter une pièce nouvelle.",
    lore: "Vous avez appris où une décision doit encore attendre sa validation. Un recours recevable vous donne du temps lorsque quelqu’un cherche à vous mettre devant le fait accompli."
  },
  dossier_propre: {
    effect: "Votre identité civile réelle bénéficie d’un crédit de confiance renforcé. Aux contrôles de routine, lorsque votre Logifate et vos pièces correspondent à la situation, leur vérification suffit : pas de fouille approfondie, de retenue ou d’exigence d’un garant provoquées uniquement par un soupçon vague. Le talent vous fait aussi reconnaître comme client ou visiteur fiable dans les démarches ordinaires, sans garantie de faveur financière. Une preuve directe, un mandat ciblé, un objet interdit visible ou une contradiction concrète permettent une investigation normale. Aucun document absent ni fausse identité n’est créé.",
    lore: "Vos traces civiles inspirent une confiance qui écourte les contrôles ordinaires. Votre véritable identité tient sans que chaque interlocuteur vous traite comme un suspect à démasquer."
  },
  omerta_familiale: {
    effect: "Vous bénéficiez de +2 Force Mentale contre les pressions et intimidations profanes visant directement à vous faire trahir votre famille ou votre ancien milieu. Une fois par scène, vous pouvez relancer une résistance ratée dans ce cadre, hors échec narratif ; vous conservez le second résultat. Le talent protège votre résistance personnelle, pas vos proches eux-mêmes, et ne masque pas vos souvenirs à une lecture mentale directe. Lorsque le même test relève également d’Omerta, leurs deux bonus se cumulent exceptionnellement pour +4, sans troisième bonus équivalent ni deuxième relance de talent.",
    lore: "La loyauté familiale est devenue une discipline intime. Même quand la pression trouve une faille, vous pouvez encore vous reprendre avant de livrer les vôtres."
  },
  debrouille: {
    effect: "Vous conservez +1 Survie dans les milieux urbains pauvres, abandonnés ou hors système. Pour une tâche non offensive dont vous connaissez la méthode, vous pouvez compenser jusqu’à −3 de malus provenant d’un matériel courant absent ou médiocre en employant des substituts réellement disponibles. Vous ne fabriquez pas un composant indispensable et ne remplacez pas une expertise que vous ne possédez pas.",
    lore: "Vous avez grandi avec des moyens incomplets. Savoir détourner ce qui se trouve autour de vous permet de continuer quand le bon équipement manque."
  },
  dotation_standard: {
    effect: "Votre employeur vous confie un lot spécialisé supplémentaire, choisi dans l’équipement autorisé et utile à votre poste, jusqu’à 5 000 $ de valeur catalogue. Il en assure l’entretien courant et le remplacement d’usure. Ce lot s’ajoute aux outils indispensables déjà fournis par le poste ; il ne finance ni véhicule ni augmentation. Il reste propriété de l’employeur et n’est pas revendable. Une perte opérationnelle est traitée par le service, pas remplacée instantanément.",
    lore: "Votre employeur vous confie davantage que les outils indispensables. Cette dotation spécialisée est entretenue pour que vous puissiez accomplir un travail qui dépasse la routine du poste."
  },
  assurance_corporative: {
    effect: "La corporation garantit un bien professionnel non unique que vous possédez réellement, inscrit sur la fiche : arme, armure, appareil, augmentation ou véhicule. Une fois par scénario, elle finance sa remise en état après des dommages opérationnels, ou son remplacement à fonction et gamme équivalentes s’il est détruit ou irrécupérable. L’intervention est engagée sans avance de frais, avec le délai matériel ou médical nécessaire. L’objet couvert peut être changé entre deux scénarios, avant les dommages ; il ne peut être assuré rétroactivement. Aucune amélioration de gamme, duplication après récupération de l’original ou destruction volontaire destinée à encaisser une indemnité n’est couverte.",
    lore: "La corporation protège un actif dont dépend votre travail. Qu’il s’agisse d’un véhicule, d’un appareil ou d’une augmentation, sa destruction opérationnelle ne vous oblige pas à financer seul son remplacement."
  },
  badge_interne: {
    effect: "Vous détenez une accréditation confidentielle réelle au sein de votre corporation. Elle ouvre les sites sécurisés et secrets d’un programme ou d’une branche sensible choisis : laboratoire clandestin, centre d’essai, dépôt protégé ou installation analogue. La sécurité reconnaît votre droit d’entrer et de circuler sans escorte dans ce périmètre ; aucune nouvelle faveur n’est à négocier à chaque visite. Les sites appartenant au même périmètre sont couverts. L’accès physique ne donne ni commandement, ni contrôle universel des systèmes, ni extraction automatique de tous les dossiers compartimentés.",
    lore: "Votre badge ouvre des portes que les salariés ordinaires ne connaissent parfois même pas. Cette confiance reste attachée à un programme précis, avec ses secrets et ses responsabilités."
  },
  avantages_salaries: {
    effect: "Votre contrat prend en charge un deuxième Appui de Sphère corporatif, choisi selon les mêmes catégories, niveaux et limites que l’appui initial. Vous pouvez ainsi disposer d’un logement ET d’un véhicule de fonction, au lieu d’un seul avantage. Les deux prestations existent simultanément et leur prise en charge est inscrite sur la fiche. La même prestation ne peut être comptée deux fois. Ce talent n’ajoute pas d’argent au Compte et ne transfère pas la propriété des biens qui restent sous contrat.",
    lore: "Votre contrat cumule deux avantages majeurs plutôt que d’imposer un choix entre eux. Cette sécurité matérielle reste liée à l’employeur qui la finance."
  },
  profil_calibre: {
    effect: "Votre corporation vous a spécialement formé pour une Compétence professionnelle de votre Style, choisie et inscrite à l’acquisition. Une fois par scénario, après un échec non narratif à un test de cette Compétence dans une tâche correspondant à votre métier, vous pouvez relancer le 1d10e et conserver le second résultat. Le coût de l’action n’est pas payé une seconde fois et aucun PA n’est créé. Les conditions de formation nécessaires restent applicables ; ce talent n’est pas un point permanent de Compétence.",
    lore: "Votre formation a été calibrée pour une fonction concrète. Dans votre spécialité professionnelle, vous savez reprendre une exécution qui vient de dérailler, sans disposer de secondes chances inépuisables."
  },
  acces_fournisseur: {
    effect: "Vous accédez directement aux stocks professionnels ordinaires de votre corporation et de ses partenaires désignés, avec réservation et délai annoncé. Vos achats personnels ou professionnels autorisés bénéficient de 10 % de réduction sur le prix catalogue, hors prototypes, pièces uniques et prestations médicales. Cette réduction ne se cumule pas avec une autre remise de statut de même nature : retenir la meilleure. Elle ne s’applique pas aux acquisitions destinées à la revente. Les 5 points de pourcentage de Maître du Troc et le résultat d’une négociation s’ajoutent à cet avantage de statut.",
    lore: "Vous traitez directement avec le circuit professionnel de votre corporation. Ses stocks, réservations et conditions d’achat vous évitent de dépendre du marché de détail."
  },
  programme_pilote: {
    effect: "Vous recevez un prototype professionnel réellement jouable, construit sur un équipement de Réalité autorisé par votre fonction. Avant l’acquisition, sa fiche fixe le modèle de base, une amélioration expérimentale exclusive, ses valeurs, ses limites et ses conditions d’entretien. L’amélioration peut être un bonus de +2 à une fonction précisément définie, la suppression de la propriété Encombrant d’un appareil portable compatible, ou une nouvelle fonction concrète validée par le MJ. Ces options sont alternatives, pas cumulées. Le +2 remplace un éventuel bonus équivalent inférieur de la version standard. Un seul prototype est prêté à la fois, sans achat du matériel ; il reste propriété de la corporation. Il peut être remplacé entre deux missions par un autre essai du programme préalablement défini, jamais reconfiguré librement en pleine scène.",
    lore: "Vous faites partie des personnes qui éprouvent un produit avant sa diffusion. Le prototype est un outil réel, doté d’une capacité écrite et suivi par une équipe qui attend vos retours de terrain."
  },
  extraction_corporative: {
    effect: "Une fois par scénario, dans le périmètre réel d’intervention de l’employeur, vous pouvez déclencher une extraction prioritaire. L’autorisation interne est acquise : un moyen de récupération est engagé, avec rendez-vous, capacité et délai annoncés. Il peut emporter vos compagnons dans sa capacité réelle. Vous devez transmettre votre position et rejoindre ou ouvrir un accès praticable. Le talent garantit la mobilisation, pas une arrivée instantanée ni le franchissement automatique d’un blocus.",
    lore: "Votre employeur a prévu de vous récupérer lorsque la mission tourne mal. La sécurité engage de vrais moyens, mais vous devez encore tenir et atteindre le point de rendez-vous."
  },
  dotation_de_service: {
    effect: "Le service vous attribue un kit supplémentaire, jusqu’à 5 000 $ d’équipement autorisé par votre fonction, au-delà de votre matériel indispensable. Ce kit peut être échangé au dépôt entre deux missions pour une autre configuration de même plafond ; entretien courant et usure sont pris en charge. Armes, véhicules et augmentations restent soumis à leurs accès propres ; ce lot ne finance ni véhicule ni augmentation. Le matériel doit être restitué et ne peut être vendu.",
    lore: "Votre service vous laisse configurer une dotation spécialisée en fonction de la mission. Les outils nécessaires à tous les agents ne sont pas confondus avec ce complément personnel."
  },
  habilitation_administrative: {
    effect: "Vous possédez une habilitation réelle d’accès aux sites secrets d’un secteur gouvernemental choisi : installations de renseignement, centres techniques protégés, dépôts sécurisés ou établissements analogues. Un contrôle régulier confirme votre autorisation d’y entrer et de circuler dans les zones couvertes, sans demander une faveur au responsable. Le secteur peut regrouper plusieurs sites pertinents. Cette habilitation n’accorde ni commandement, ni accès universel aux fichiers des personnes présentes : les données confidentielles relèvent d’Accès aux registres.",
    lore: "Vous êtes accrédité à des installations qui restent fermées aux agents ordinaires. Votre présence y est légitime même lorsque votre affectation quotidienne se trouve ailleurs."
  },
  acces_aux_registres: {
    effect: "Choisissez une grande catégorie de données confidentielles : dossiers de police et enquêtes, dossiers médicaux institutionnels, Logifate et historiques administratifs, ou une catégorie comparable pertinente. Vous disposez d’un droit réel de consultation et de recoupement de cette catégorie, y compris hors du besoin ordinaire de votre poste. La consultation d’un dossier identifié ne demande pas un nouveau jet de négociation ; les recherches complexes et l’interprétation peuvent demander Investigation ou Savoirs. L’accès peut passer par un terminal habilité ou une interface sécurisée. Les données inexistantes, détruites ou exceptionnellement compartimentées hors de l’habilitation restent inaccessibles ; l’historique des accès n’est pas supprimé.",
    lore: "Une catégorie de dossiers confidentiels vous est réellement ouverte. Cette habilitation fournit des renseignements autrement inaccessibles, sans remplacer le travail d’enquête qui leur donne un sens."
  },
  procedure_acceleree: {
    effect: "Vous conservez +2 aux tests visant à faire progresser une démarche de votre domaine. Une fois par scénario, vous pouvez obtenir une autorisation provisoire exécutoire immédiatement après un échange avec le service, les validations et formalités détaillées étant régularisées après l’opération. Cela peut permettre le transport d’un témoin, l’usage d’un moyen ordinaire ou une intervention recevable sans attendre le circuit complet. Le service doit avoir compétence pour autoriser l’acte ; le talent ne crée pas une ressource et ne remplace ni une accréditation secrète ni une décision formellement interdite.",
    lore: "Vous savez obtenir une décision opérationnelle avant que le dossier ait fini de circuler. Les formalités suivent l’intervention au lieu de lui faire manquer sa fenêtre utile."
  },
  fonctionnaire_experimente: {
    effect: "Vous conservez +1 Diplomatie dans les rapports professionnels avec l’administration. Une fois par démarche, après un refus discrétionnaire ou une mauvaise orientation, vous obtenez le réexamen du dossier par un responsable compétent sans perdre l’avancement déjà acquis. Cela autorise une nouvelle tentative normalement interdite à situation identique ; un défaut de forme doit être corrigé. Le refus fondé sur une interdiction légale ne peut être contourné ainsi.",
    lore: "Vous connaissez les recours et les responsables capables de débloquer un dossier. Un premier refus ne vous condamne pas à recommencer toute la démarche."
  },
  requisition_de_service: {
    effect: "Pour une mission autorisée, vous pouvez obtenir un moyen supplémentaire disponible : voiture ou utilitaire de service, local utilisable, ou lot matériel d’une valeur maximale de 10 000 $. Un seul moyen est réquisitionné par ce talent à la fois, jusqu’à la fin de la mission. L’affectation ne nécessite pas de négociation de faveur. Le moyen doit exister, pouvoir être confié à votre fonction et être restitué ; conducteur ou spécialiste ne sont pas fournis automatiquement.",
    lore: "Votre mission peut mobiliser un moyen matériel qui dépasse votre dotation personnelle. Il vous est réellement affecté, avec les responsabilités qu’implique son emploi."
  },
  couverture_fonctionnelle: {
    effect: "Une fois par scénario, votre institution peut étouffer les conséquences institutionnelles d’une infraction défendable commise pendant une opération ou qu’elle a intérêt à couvrir. Elle fait classer la procédure ordinaire dans son ressort, tolère une initiative irrégulière ou écarte un élément compromettant qu’elle contrôle. Le bénéfice est effectif, sans nouveau jet pour convaincre le protecteur après validation du périmètre. Il ne réécrit ni les faits ni toutes les preuves détenues par des tiers ; une affaire publiquement indéfendable, une trahison ou un acte que l’institution refuse fondamentalement de couvrir reste hors de portée. Le MJ annonce si l’affaire est couverte avant consommation du bénéfice.",
    lore: "L’institution considère certaines de vos initiatives comme des écarts qu’elle peut assumer. Sa protection a un effet réel sur les procédures qu’elle contrôle, pas sur la mémoire du monde entier."
  },
  dossier_institutionnel: {
    effect: "Vous disposez d’une identité opérationnelle de couverture entretenue par l’administration, avec les pièces et inscriptions officielles correspondant à une profession ou affectation plausible. Les vérifications ordinaires auprès des organismes couverts confirment cette identité sans remonter automatiquement à votre identité réelle. Une seule couverture est active par ce talent. Le service peut la remplacer entre deux opérations si elle est abandonnée ou compromise ; la nouvelle couverture ne change pas votre visage, vos compétences ni les traces déjà découvertes. Elle ne confère pas d’elle-même les accès secrets d’Habilitation administrative et d’Accès aux registres.",
    lore: "Votre couverture possède une existence officielle plutôt qu’un simple faux nom. Les services compétents la soutiennent et l’entretiennent pour vos opérations."
  },
  priorite_interservices: {
    effect: "Une fois par scénario, vous pouvez obtenir l’engagement coordonné de votre service et d’un autre service compétent sur une opération locale précise. Le résultat doit prendre une forme concrète : sécurisation d’un accès, évacuation, contrôle d’un périmètre, prise en charge de victimes ou autre intervention dans leurs attributions. Un responsable de liaison, un objectif, les moyens engagés et un délai sont annoncés. La rivalité administrative ne peut suffire à refuser. Les agents agissent selon leur hiérarchie et résolvent normalement les dangers ; vous n’obtenez pas un commandement général sur eux ni la neutralisation automatique de toute opposition.",
    lore: "Vous pouvez faire converger deux services vers un même objectif local. La coopération change réellement le dispositif autour de votre intervention."
  },
  appui_du_service: {
    effect: "Une fois par scénario, pour une mission autorisée, vous choisissez l’affectation d’un spécialiste pour une tâche d’expertise, ou d’une petite équipe de trois agents pour une tâche de terrain relevant de votre service. Leur fonction, leur profil, leur équipement courant et leur délai sont connus avant engagement. Ils peuvent analyser une pièce, surveiller un accès, sécuriser une position, accompagner un transfert ou intervenir techniquement ; ils effectuent leurs propres tests si la tâche est contestée ou dangereuse. L’affectation dure le temps de cette tâche, pas toute la campagne. Une expertise ordinaire matériellement réalisable donne ses conclusions, pas seulement le nom d’un autre interlocuteur.",
    lore: "Votre service affecte de vraies personnes à une tâche pendant que vous poursuivez l’opération. Leur compétence est connue et leur présence n’est pas une promesse abstraite."
  },
  protection: {
    effect: "Une fois par scène, lors d’une confrontation où les adversaires peuvent encore choisir de reculer, vous pouvez faire valoir une affiliation criminelle réelle et crédible. Comparez leur Renommée pertinente à la meilleure entre votre Renommée et celle de votre organisation dans ce territoire ; elles ne s’additionnent pas. Si votre valeur est supérieure, un adversaire ou petit groupe qui reconnaît cette protection doit abandonner une intimidation, un racket ou une hostilité limitée et vous laisser vous retirer, sans jet. Face à une Renommée égale ou supérieure, la confrontation se résout normalement ; la réputation invoquée peut fournir la circonstance pertinente. Le talent ne soumet pas une faction en guerre ouverte à votre organisation, ne fait pas oublier une vendetta majeure et ne retire pas des actions de combat à une cible.",
    lore: "Votre organisation place un poids derrière votre nom. Là où sa protection est réellement redoutée, un adversaire moins influent doit réfléchir aux conséquences de s’en prendre à vous."
  },
  marche_noir: {
    effect: "Pour une marchandise illégale non unique et réellement distribuée dans les filières de votre organisation, vous obtenez une offre ferme et la fourniture du bien au prix annoncé, sans mission préalable uniquement destinée à trouver un vendeur ou gagner sa confiance. Un bien courant disponible localement peut être retiré dans la journée ; un bien rare commandable est livré avec un délai annoncé avant engagement : trois jours hors transport exceptionnel annoncé. Le circuit peut fournir un bien interdit au marché ordinaire, sans exiger les justificatifs de vente habituels ; cela ne lève pas les conditions physiques, techniques ou mécaniques nécessaires pour l’utiliser. Marché noir ne fixe pas une remise : Recéleur et Maître du Troc traitent les prix.",
    lore: "Vous avez accès à une filière qui fournit réellement les marchandises qu’elle distribue. Le prix et le transport restent des questions concrètes, mais trouver un vendeur n’est plus une aventure supplémentaire."
  },
  dette_de_faveur: {
    effect: "Vous disposez d’une faveur importante reconnue par un débiteur nommé, dont les moyens et les limites sont définis. L’appeler obtient un service qui demanderait normalement paiement, risque mesuré ou contrepartie, sans nouveau jet de persuasion ni paiement pour le service convenu : cacher temporairement une personne, prêter un véhicule pour une opération, fournir une information confidentielle possédée ou ouvrir une rencontre délicate. Le débiteur fournit le service ou un équivalent dans ses moyens ; il n’est pas tenu au suicide ou à une trahison fondamentale. La faveur est consommée lorsque la prestation est engagée. Après un nouveau service significatif rendu et reconnu, vous pouvez reconstituer une faveur active garantie par ce talent, sans rachat d’XP. Aucune recharge au seul changement de scénario.",
    lore: "Quelqu’un s’est réellement engagé envers vous. Cette obligation porte sur un service significatif et peut se reconstituer par de nouveaux actes, pas par le simple passage du temps."
  },
  omerta: {
    effect: "Vous bénéficiez de +2 Force Mentale contre les pressions visant à vous faire trahir votre organisation. Votre cercle professionnel proche et coopérant organise aussi le silence : demandes banales sans réponse sur vos informations sensibles, et alerte en cas de demande ciblée dès qu’il peut vous prévenir. Exception explicite : lorsque le même test relève également d’Omerta familiale, les deux bonus se cumulent pour +4 au total. La relance une fois par scène d’Omerta familiale reste utilisable et bénéficie de ce total. Mental d’acier ne fournit pas un troisième bonus équivalent et aucun test ne bénéficie de plusieurs relances de talent. Trahison d’un associé, contrainte réelle et preuves extérieures restent possibles.",
    lore: "Le silence est une pratique collective autant qu’une résistance personnelle. Vos associés savent ce qu’ils ne doivent pas raconter et vous préviennent lorsqu’on cherche à en apprendre davantage."
  },
  homme_femme_du_milieu: {
    effect: "Vous conservez +1 Diplomatie ou Autorité, choisi à l’acquisition, dans votre organisation. Une fois par scénario, elle passe l’éponge sur un écart limité que vous avez commis envers ses règles ou intérêts : négligence, initiative non autorisée, altercation interne mineure ou manquement comparable. La sanction interne normalement attendue est abandonnée, sans nouvelle dette automatique qui remplacerait simplement cette sanction. La faute doit rester réparable et l’organisation doit pouvoir assumer ce pardon ; trahison, pertes majeures ou attaque contre ses dirigeants restent hors de portée. Le pardon interne n’efface pas une procédure menée par une institution extérieure.",
    lore: "Votre place dans le milieu est assez solide pour qu’on vous pardonne certains écarts. Cette indulgence ne vaut ni trahison impunie ni immunité auprès de la police."
  },
  armurier_du_milieu: {
    effect: "Votre organisation met à votre disposition une arme non unique de son catalogue disponible, sans prix d’achat, choisie pour l’opération. Vous pouvez la restituer et en changer à l’armurerie entre deux missions. Une seule arme de ce talent est sortie à la fois ; elle reste prêtée et n’est pas revendable. Son entretien courant est pris en charge. Le plafond de valeur est 5 000 $ ; les armes exigeant une installation, un équipage, un accès spécial ou un programme expérimental ne sont pas ouvertes automatiquement. Les munitions restent des consommables payés normalement.",
    lore: "L’armurerie de votre organisation vous confie une arme adaptée à l’opération. Vous pouvez en changer au retour plutôt que financer un arsenal personnel pour chaque mission."
  },
  fiable: {
    effect: "Vous conservez +2 pour obtenir un contrat grâce à votre réputation professionnelle. Une référence réelle et vérifiable rend ce bonus utilisable auprès d’un nouveau commanditaire. Une fois par scénario, sur un contrat accepté et financé, vous pouvez demander et obtenir une avance de 25 %, sans concession supplémentaire ; elle est déduite du solde. Elle n’est pas versée si vous ne la demandez pas et ne s’ajoute pas à une avance déjà au moins équivalente. Le contrat conserve ses obligations de justification ou de restitution en cas de non-exécution.",
    lore: "Votre réputation de professionnel sérieux peut être vérifiée. Un commanditaire peut vous confier une avance parce que votre engagement a déjà fait ses preuves."
  },
  dans_le_coup: {
    effect: "Vous connaissez les lieux de rencontre et réseaux Neopunks réellement implantés dans la scène que vous fréquentez, ainsi que l’actualité courante qui y circule. Une fois par scénario, vous pouvez demander au MJ un point de situation sur ce milieu, sans quota de questions : qui est banni ou influent, quel groupe monte, où joindre un relais, ou quels mouvements corporatifs connus pourraient le viser. Les réponses distinguent faits, rumeurs et informations encore contradictoires. Les connaissances ordinaires restent disponibles en permanence. Vous pouvez apprendre une menace signalée par le réseau, pas un plan absolument secret inconnu de tous. Connaître un refuge ne garantit pas d’y être accueilli : Nid de frelons fournit cet accueil.",
    lore: "Vous suivez la scène Neopunk de l’intérieur : lieux, collectifs, exclusions et nouvelles influences. Les pressions corporatives dont on parle dans les réseaux font aussi partie de cette actualité."
  },
  maitrise_des_codes_de_la_rue: {
    effect: "Vous conservez +1 Langages & Argot sur la culture Crawler. Après quelques minutes d’observation et d’échanges dans une scène locale accessible, vous identifiez qui y fait réellement autorité, quelle règle de passage ou de respect s’applique et quel comportement risque de provoquer un incident. Ces conclusions portent sur les signes et usages visibles, non sur les intentions cachées. Elles donnent une manière appropriée d’aborder le milieu, pas son amitié automatique.",
    lore: "Vous lisez les rapports de force actuels de la rue, pas seulement son vocabulaire. Vous savez qui approcher et quelles règles sont vraiment appliquées ici."
  },
  nid_de_frelons: {
    effect: "Dans une implantation Neopunk alliée réellement accessible, votre reconnaissance vous donne un accueil discret pour vous et jusqu’à deux compagnons, pendant trois nuits par scénario au total. Le refuge fournit couchage simple, relais de communication et alerte en cas de recherche visible, sans négociation de service à chaque arrivée. Il faut respecter ses règles et ne pas avoir trahi le réseau. Aucun refuge n’apparaît dans une zone dépourvue d’implantation. Changer de refuge ne réinitialise pas les trois nuits.",
    lore: "Les réseaux Neopunks vous reconnaissent comme quelqu’un qu’ils peuvent accueillir. Un lieu existant devient un repli concret avec des communications et des personnes attentives aux recherches visibles."
  },
  black_clinic: {
    effect: "Une clinique noire ou un réseau Meditech nommé vous reçoit sans exiger de dossier institutionnel compatible. Les urgences bénéficient d’une prise en charge prioritaire selon la gravité, sans attendre une avance financière ; le règlement devient une dette convenue. Les soins ne sont pas automatiquement transmis à une institution extérieure. Honoraires, capacités médicales et risques matériels restent réels : ni implant gratuit, ni guérison impossible, ni effacement des preuves déjà existantes.",
    lore: "Une clinique clandestine accepte de vous traiter sans vous faire entrer d’abord dans les cases d’une institution. La discrétion et le crédit d’urgence ne rendent pas la médecine gratuite."
  },
  communaute_de_fideles: {
    effect: "Vous disposez d’un réseau local identifié de fidèles volontaires. Une fois par scénario, vous pouvez lui confier une question concrète sur une personne, un lieu ou une activité. En une journée, le réseau rassemble aussi bien les observations de ses membres que les rumeurs qu’ils ont entendues, sans que vous meniez chaque entretien. Il distingue ce qui a été vu, rapporté ou simplement supposé, et indique une provenance exploitable lorsque possible. Le talent peut ainsi faire remonter une information dont les fidèles ne sont pas les témoins directs ; il n’invente pas un secret qui ne circule nulle part et n’impose pas aux fidèles une infiltration dangereuse.",
    lore: "Les fidèles ont des voisins, des métiers et des conversations. Leur vie quotidienne fait remonter des observations et des rumeurs qu’aucun enquêteur isolé ne pourrait recueillir aussi facilement."
  },
  ministere: {
    effect: "Vous connaissez un domaine confidentiel des activités de votre religion, choisi à l’acquisition : exorcistes, protection de reliques, ordres de Chasse présentés comme unités spécialisées, dossiers d’incidents ou dispositifs analogues. Vous savez qu’ils existent, comment reconnaître leurs principaux signes institutionnels et quel canal réel contacter pour leur signaler un cas ou leur poser une question. Vous connaissez une partie de leurs méthodes et explications profanes, pas automatiquement leurs pouvoirs ou la véritable nature des créatures. Cette préparation accorde +2 au premier test de Stress provoqué par la confrontation avec un phénomène correspondant à ce domaine, par scénario. Aucun passage automatique de Profane à Initié ni talent de Vérité n’est accordé.",
    lore: "Votre fonction vous a donné connaissance d’activités que l’institution ne présente pas à tous ses fidèles. Vous pouvez connaître ses exorcistes et ses unités spécialisées tout en expliquant encore leurs affaires de manière profane."
  },
  mission_ecclesiastique: {
    effect: "Une fois par scénario, l’institution mandate une mission extérieure compatible avec votre rôle, y compris sur une proposition que vous lui soumettez. Elle fournit une lettre de mission et prend en charge jusqu’à 1 000 $ de frais justifiés de déplacement, hébergement et logistique, pour vous et vos accompagnants dans cette enveloppe commune. Le mandat donne une légitimité institutionnelle à votre présence ; il ne constitue ni immunité, ni droit d’entrée forcée, ni revenu personnel supplémentaire.",
    lore: "Vous partez avec un mandat réel et les moyens de déplacement de la mission. Cette légitimité vous accompagne hors de votre affectation, sans effacer les règles des lieux où vous intervenez."
  },
  hebergement_religieux: {
    effect: "Une implantation réelle met durablement à votre disposition un espace simple pour vous et jusqu’à deux compagnons, avec rangement privatif verrouillable. Le logement et ses charges ordinaires sont pris en charge tant que le lien institutionnel est maintenu. La capacité convenue est réservée, et ne dépend pas chaque soir des places d’hospitalité restantes. Ce n’est ni une propriété revendable ni une planque secrète. Un loyer équivalent compté séparément est supprimé, sans hausse automatique du Train de vie.",
    lore: "Vous disposez d’une base où revenir et laisser votre matériel. Cet espace réservé dépasse l’hospitalité d’une nuit, mais reste un lieu réel connu de l’institution."
  },
  reseau_caritatif: {
    effect: "Une fois par scénario, vous pouvez faire engager une opération caritative locale réelle, en choisissant l’un des deux usages suivants. Mise à l’abri : un moyen de transport accessible prend en charge jusqu’à cinq personnes en difficulté et les confie au réseau pour sept jours d’hébergement simple, de repas et de soins ordinaires disponibles. Couverture d’intervention : un convoi, une distribution ou un dispositif d’assistance réel vous intègre, avec jusqu’à deux compagnons aptes à y participer, pour rejoindre une zone ou des interlocuteurs accessibles à cette mission humanitaire. Le déplacement, le responsable et la mission sont annoncés ; il ne s’agit pas seulement d’une adresse d’association. Aucun blocus inviolable n’est franchi automatiquement, aucun accès secret n’est créé et l’opération doit rester compatible avec l’aide réellement fournie.",
    lore: "Le réseau engage une véritable opération d’assistance. Il peut prendre en charge des personnes que vous devez protéger ou vous intégrer à une activité humanitaire qui ouvre un terrain d’intervention."
  },
  education_theologique: {
    effect: "Vous conservez +1 Savoirs sur religion, doctrine et histoire religieuse. Une fois par scène, devant des auditeurs reconnaissant la doctrine concernée, vous pouvez dénoncer une contradiction précise entre les actes ou ordres d’un interlocuteur et les obligations qu’il revendique. Sous pression, cela prend 1 PA et un test Esprit + Savoirs + 1d10e contre Charisme + Autorité + 1d10e de l’interlocuteur. En réussite, il subit −3 à ses tests d’Autorité fondés sur cette légitimité religieuse devant cet auditoire jusqu’à la fin de la scène. Les auditeurs restent libres de leurs convictions et peuvent le suivre pour d’autres raisons ; ses pouvoirs éventuels ne disparaissent pas. Une seule contestation réussie de ce talent est comptée contre la même légitimité dans la scène.",
    lore: "Vous savez confronter une autorité aux principes qu’elle prétend représenter. Une contradiction exposée devant ses fidèles peut ébranler son ascendant sans changer magiquement leurs convictions."
  },
  conseiller_spirituel: {
    effect: "Vous conservez +1 Diplomatie auprès d’une personne acceptant votre conseil. Après dix minutes d’échange réel sur une épreuve précise, elle peut relancer une fois un test de Stress raté face à cette épreuve avant la fin du scénario, hors échec narratif ; le second résultat est conservé. Une seule personne peut bénéficier à la fois de votre préparation, qui ne se cumule pas avec une autre relance du même test. Ni Trauma durable ni minima dus aux blessures ne sont supprimés.",
    lore: "Vous aidez quelqu’un à se préparer à l’épreuve qui l’attend. L’écoute et les repères construits ensemble peuvent lui donner une seconde chance lorsque le choc survient."
  },
  ordre_religieux: {
    effect: "L’Ordre vous attribue un correspondant spécialisé dans une discipline choisie et documentée. Une fois par scénario, vous obtenez une consultation ou expertise de cette discipline prise en charge : examen d’un dossier, diagnostic, analyse ou préparation professionnelle compatible. Le spécialiste accomplit le travail et fournit ses conclusions, avec ses propres tests si nécessaire. Entre les missions, il peut aussi assurer un enseignement cohérent. Aucun talent, rang ou point de Compétence n’est acquis gratuitement.",
    lore: "Un spécialiste de votre Ordre entretient avec vous une relation de travail et de transmission. Il peut accomplir une expertise réelle, pas seulement vous renvoyer vers une autre adresse."
  },
  reseau_confessionnel: {
    effect: "Dans une implantation alliée existante où vous arrivez, le réseau vous fournit une recommandation vérifiable et un répondant local qui accepte une première rencontre. Celui-ci peut vous présenter à un interlocuteur pertinent de son environnement, y compris extérieur à votre religion, lorsqu’il dispose réellement de cette relation. La recommandation remplace l’absence de présentation et la méfiance liée au seul fait d’être inconnu ; elle ne garantit ni faveur, ni accord politique, ni ressources exceptionnelles.",
    lore: "Vous arrivez avec un garant plutôt qu’en parfait inconnu. Le réseau confessionnel peut vous présenter aux personnes que son implantation locale connaît réellement."
  }
};

export const REALITY_TALENT_REVISION_VERSION = "reality-talents-2026-09-27";
export const REALITY_TALENT_XP_COST = 10;

export function reviseRealityTalent<T extends {id: string; effect: string}>(talent: T): T {
  const revision = realityTalentRevision[talent.id];
  return revision ? {...talent, effect: revision.effect} : talent;
}

export function reviseRealityLore<T extends Record<string, string>>(lore: T): T {
  return Object.fromEntries(Object.entries(lore).map(([id, text]) => [id, realityTalentRevision[id]?.lore ?? text])) as T;
}
