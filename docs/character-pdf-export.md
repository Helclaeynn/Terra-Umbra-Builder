# Dossiers de personnage PDF

Les modèles publics sont sous `apps/web/public/pdf/dossiers/`. Le manifeste versionné fournit les fichiers couleur/impression, le nombre de pages et les identifiants stables des champs AcroForm. `reality.*` est commun; `truth.*` décrit les pages de Nature. Les identifiants constituent le contrat d’export, sans signets de navigation.

`character-pdf-model.ts` projette le personnage avec les mêmes calculs que la fiche existante. Le Builder et la Progression utilisent le brouillon affiché; la fiche indépendante utilise sa dernière version sauvegardée. Le mode création exclut les acquisitions de campagne. L’export ne sauvegarde ni ne modifie le personnage.

`CharacterPdfActions.vue` capture un instantané au clic, puis charge le moteur PDF à la demande dans un Web Worker. Aucun personnage rempli n’est envoyé au serveur. Seuls les modèles vierges et la police sont téléchargés. Un Humain sans tradition de Chasse reçoit les deux pages de Réalité; les autres routages utilisent la Nature, le peuple exilé ou le profil extral.

Le PDF téléchargé conserve ses formulaires. L’impression prend le modèle délavé, remplit les mêmes valeurs et aplatit uniquement sa copie pour stabiliser l’impression. La fenêtre est ouverte au clic avant le travail asynchrone; un lien de téléchargement reste disponible si la fenêtre ou le dialogue d’impression est bloqué.

La génération ne dépend pas des pauses `setTimeout(0)` de pdf-lib : l’ouverture de la fenêtre d’impression met la page d’origine en arrière-plan, où ces pauses peuvent être fortement ralenties par le navigateur. Le worker exécute la lecture et l’écriture PDF sans ces pauses et laisse l’interface réactive. Le PDF terminé est transféré sans recopier son buffer, puis le worker est arrêté. Un navigateur sans Web Workers conserve un parcours de génération local.

Les zones en session non enregistrées par l’application (PV actuels, PA, jet d’initiative, état de Révélation, relation au Voile, Mues, Frénésie...) restent vides. L’initiative imprimée est sa base calculée, avant le dé indiqué sur la fiche. Les effets et identités trop longs, les acquisitions au-delà des lignes disponibles et les données sans zone dédiée passent en annexes éditables, avec un intitulé identifiant leur talent/objet. Les bonus conditionnels ne deviennent jamais des attributs permanents.

La police complète DejaVu Sans est embarquée pour conserver l’édition après téléchargement. Des caractères rares absents de la police sont affichés sous leur code Unicode et signalés au téléchargement. Les formulaires générés par pypdf peuvent encoder `/Helv` avec une échappée octale; l’export normalise cette apparence avant de mettre à jour la police via pdf-lib.

Vérification : `npm run test:pdf` depuis `apps/web` contrôle les 21 modèles, les routages, les champs éditables, les annexes, les valeurs de campagne, les talents acquis, la corruption dormante, les variantes de Mage/Garou et les boutons (instantané, fenêtre, erreurs, nettoyage). `node tests/homo-superior-phasing-check.mjs` contrôle la règle de phasage. Ces tests sont intégrés au workflow de déploiement V2.
