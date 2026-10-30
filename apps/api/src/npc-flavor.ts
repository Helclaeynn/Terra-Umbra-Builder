// Fictional identities and hooks; independent from the mechanical profile.
export const NPC_FIRST_NAMES = {
 male: ['Adam','Adrian','Alan','Albert','André','Anthony','Arthur','Benjamin','Brandon','Carlos','Charles','Christian','Daniel','David','Diego','Dylan','Edward','Elias','Emilio','Ethan','Felix','Gabriel','George','Hector','Henry','Hugo','Isaac','Ivan','Jack','Jacob','James','Javier','Jeremy','Jonas','Joshua','Julian','Kevin','Léon','Liam','Lucas','Luis','Marcus','Martin','Mateo','Matthew','Michael','Nathan','Nicolas','Noah','Oliver','Oscar','Owen','Pablo','Peter','Rafael','Raymond','Samuel','Simon','Theo','Thomas','Victor','Vincent','William','Zachary'],
 female: ['Abigail','Ada','Adriana','Alice','Amelia','Ana','Anna','Audrey','Beatrice','Camila','Carmen','Caroline','Cecilia','Charlotte','Chloe','Clara','Daniela','Diana','Elena','Elisa','Elizabeth','Ella','Emily','Emma','Eva','Florence','Gabriela','Grace','Hannah','Hazel','Helena','Inès','Iris','Isabel','Jade','Julia','Juliette','Laura','Leila','Lena','Lily','Lucia','Luna','Maya','Mia','Nadia','Naomi','Natalia','Nina','Nora','Olivia','Paula','Rachel','Rebecca','Rosa','Sarah','Sofia','Stella','Teresa','Valeria','Vanessa','Victoria','Vivian','Zoe'],
 neutral: ['Alex','Morgan','Sam','Jordan','Camille','Robin','Charlie','Andrea','Lee','Noa','Sasha','Lou','Taylor','Drew','Casey','Riley','Avery','Blair','Cameron','Dakota','Eden','Emery','Harper','Jamie','Jesse','Kendall','Logan','Quinn','Reese','Rowan','Skyler','Sydney']
};
export const NPC_LAST_NAMES = [
 'Vega','Park','Mercer','Reyes','Chen','Moreau','Cole','Navarro','Stone','Mori','Singh','Rivera','Novak','Blake','Kim','Costa',
 'Adams','Alvarez','Anderson','Archer','Baker','Bennett','Brooks','Brown','Campbell','Carter','Castillo','Clark','Collins','Cooper','Cruz','Davis',
 'Delgado','Diaz','Dubois','Edwards','Ellis','Evans','Fischer','Flores','Ford','Foster','Garcia','Gomez','Grant','Gray','Green','Hall',
 'Harris','Hayes','Hernandez','Hill','Howard','Hughes','Jackson','James','Johnson','Jones','Khan','King','Lambert','Laurent','Lopez','Martin',
 'Martinez','Mason','Mendoza','Miller','Mitchell','Moore','Morales','Morgan','Murphy','Nelson','Nguyen','Ortiz','Owens','Patel','Perez','Perry',
 'Price','Ramirez','Reed','Reynolds','Roberts','Robinson','Romero','Ross','Ruiz','Sanchez','Scott','Silva','Soto','Torres','Walker','Wright'
];
export const NPC_APPEARANCE = {
 bearing: [
  'Une silhouette élancée et une posture très droite.','Une carrure compacte et des gestes économes.','Une démarche souple, presque silencieuse.','Une présence discrète, toujours légèrement en retrait.',
  'Une posture relâchée qui contraste avec un regard attentif.','Une démarche rapide, même sans urgence apparente.','Des épaules larges et un port de tête tranquille.','Un maintien impeccable et des mouvements mesurés.',
  'Un visage rond, traversé de petites rides d’expression.','Un visage anguleux et un regard qui s’attarde sur les détails.','Des mains calleuses et des ongles soigneusement entretenus.','Des mains fines, rarement immobiles.',
  'Une voix grave et des phrases posées.','Une voix claire qui porte facilement dans le bruit.','Un débit lent, entrecoupé de silences.','Une voix basse qui oblige à tendre l’oreille.',
  'Des cernes marqués et un sourire poli.','Un sourire facile, mais peu de gestes.','Un regard vif qui suit les entrées et les sorties.','Une expression impassible, même dans l’agitation.',
  'Des cheveux courts, coupés sans recherche particulière.','Une longue chevelure attachée pour dégager le visage.','Des tempes grisonnantes et un regard chaleureux.','Un crâne rasé et des sourcils très expressifs.'
 ],
 clothing: [
  'Une veste élimée, soigneusement réparée.','Un manteau ample aux nombreuses poches.','Une tenue de travail propre mais délavée.','Une chemise sobre aux manches toujours retroussées.',
  'Des vêtements confortables dans des tons sombres.','Une veste bien coupée sur un haut sans marque.','Un blouson usé, gardé même à l’intérieur.','Un imperméable léger, plié sur l’avant-bras.',
  'Des chaussures impeccables malgré la poussière.','Des bottes entretenues avec un soin maniaque.','Des baskets discrètes, visiblement très utilisées.','Un pantalon renforcé et une ceinture fonctionnelle.',
  'Un foulard coloré sur une tenue très sobre.','Un pull large dont les poignets sont reprisés.','Un gilet ancien, ajusté sur mesure.','Une veste de sport sans logo visible.',
  'Une tenue claire dont chaque pli paraît calculé.','Des vêtements de seconde main bien assortis.','Une chemise froissée et un col toujours ouvert.','Une tenue soigneusement repassée, devenue un peu trop grande.',
  'Un manteau dont les boutons ont été remplacés.','Un chapeau banal posé à portée de main.','Une veste doublée d’un tissu aux couleurs vives.','Un sac en bandoulière maintes fois réparé.'
 ],
 detail: [
  'Une montre ancienne consultée sans cesse.','Une mèche décolorée tranche avec le reste des cheveux.','Un carnet couvert de petites annotations.','Une broche artisanale portée près du col.',
  'Un anneau mat, poli par l’habitude de le faire tourner.','Une paire de lunettes réparée avec discrétion.','Une petite cicatrice coupe un sourcil.','Un tatouage géométrique dépasse d’une manche.',
  'Une odeur de café accompagne chaque arrivée.','Un parfum léger de savon et de linge frais.','Un trousseau de clés soigneusement ordonné.','Un stylo métallique rarement prêté.',
  'Des écouteurs rangés dans un étui abîmé.','Un bracelet de tissu aux couleurs passées.','Une photographie dépasse brièvement du portefeuille.','Une trace de peinture persiste sur une manche.',
  'Un badge retourné empêche de lire son inscription.','Une pièce usée passe souvent entre les doigts.','Un mouchoir brodé dépasse d’une poche.','Un petit pendentif disparaît sous le col.',
  'Une bouteille réutilisable couverte d’autocollants.','Une tache d’encre colore le côté d’un doigt.','Une couture contrastée dessine le bord d’une poche.','Un téléphone ancien dans une coque très résistante.'
 ]
};
export const NPC_PERSONALITY = {
 attitude: [
  'Parle peu et pose des questions directes.','Détourne les conversations difficiles par l’humour.','Se montre serviable, mais tient les comptes des services rendus.','Vérifie les détails avant de s’engager.',
  'S’impatiente quand on évite de répondre.','Reste calme tant que ses proches ne sont pas menacés.','Accueille chaque nouvelle idée avec curiosité.','Préfère les accords simples aux promesses solennelles.',
  'Répond avec franchise, parfois sans ménagement.','Accorde facilement le bénéfice du doute.','Cache son inquiétude derrière une politesse irréprochable.','Ne supporte pas qu’on humilie quelqu’un devant témoins.',
  'Aime raconter ce que les autres auraient préféré oublier.','Respecte les usages, même quand personne ne regarde.','Négocie presque tout, y compris les petits services.','Évite les conflits jusqu’au moment de trancher nettement.',
  'Se laisse convaincre par des faits concrets.','Défend son point de vue avec un enthousiasme contagieux.','Préfère écouter plusieurs versions avant de juger.','A du mal à reconnaître une erreur sur le moment.',
  'S’intéresse davantage aux personnes qu’aux titres.','Garde une réserve prudente face aux inconnus.','Cherche une solution pratique avant de discuter des principes.','Prend les engagements au sérieux, même les plus modestes.'
 ],
 habit: [
  'Reformule souvent les demandes pour éviter les malentendus.','Se souvient des prénoms après une seule rencontre.','Tapote doucement un objet pendant les silences.','Commence ses réponses par une question.',
  'Laisse toujours une place libre autour de soi.','Note les rendez-vous sur papier.','Observe d’abord les réactions du groupe.','Baisse la voix quand la conversation devient importante.',
  'Interrompt une phrase pour chercher le mot exact.','Ponctue ses récits de détails très concrets.','Propose volontiers de boire quelque chose.','Regarde rarement l’heure en présence d’un interlocuteur.',
  'Vérifie discrètement ses affaires avant de partir.','Rit brièvement avant de reprendre son sérieux.','Évite les expressions trop familières.','Utilise des comparaisons tirées de la vie quotidienne.',
  'Remercie les gens pour les petites attentions.','S’arrête de bouger pour écouter une réponse.','Range machinalement ce qui se trouve à portée de main.','Fait préciser les noms, les lieux et les dates.',
  'Prend un instant de silence avant toute promesse.','S’excuse lorsqu’une conversation déborde du temps prévu.','Ramène régulièrement la discussion au problème initial.','Conclut les échanges par un rappel de ce qui a été décidé.'
 ]
};
export const NPC_MOTIVATIONS = [
 'Mettre un proche à l’abri.','Réunir de quoi quitter le quartier.','Éviter de perdre sa place.','Comprendre ce qui est arrivé à un ancien collègue.',
 'Rembourser une dette sans attirer l’attention.','Obtenir la reconnaissance de son entourage.','Rétablir le contact avec une personne perdue de vue.','Terminer un projet commencé avec quelqu’un qui n’est plus là.',
 'Protéger un lieu auquel s’attachent de bons souvenirs.','Prouver qu’une décision passée n’était pas une erreur.','Trouver un travail plus stable.','Sauver une petite activité qui traverse une mauvaise période.',
 'Honorer une promesse devenue difficile à tenir.','Récupérer un objet de famille.','Faire reconnaître un travail attribué à quelqu’un d’autre.','Éviter qu’un conflit ancien n’atteigne la génération suivante.',
 'Se construire une réputation de personne fiable.','Réunir assez d’informations pour prendre une décision importante.','Obtenir un rendez-vous longtemps refusé.','Préserver son indépendance face à un appui trop envahissant.',
 'Aider un voisin sans mettre sa propre situation en danger.','Trouver un logement pour une personne de son entourage.','Réparer une relation abîmée par un malentendu.','Mettre de l’ordre dans des affaires laissées en suspens.',
 'Conserver un accès utile qui risque de disparaître.','Organiser un départ sans inquiéter ses proches.','Transmettre un savoir avant qu’il ne se perde.','Obtenir des excuses pour une humiliation publique.',
 'Éclaircir une disparition de matériel dans son environnement.','Éviter de devoir choisir entre deux loyautés.','S’assurer qu’un arrangement profite aussi aux plus discrets.','Gagner du temps avant l’échéance d’un engagement.'
];
export const NPC_HOOKS = [
 'Reconnaît un détail de l’affaire, mais hésite à en parler.','A promis le même service à deux personnes.','Cache une faute professionnelle récente.','Conserve un objet dont quelqu’un réclame le retour.',
 'Protège discrètement un témoin.','Prépare un départ que son entourage ignore.','A donné un faux prétexte pour se trouver ici.','Possède une copie d’un document que l’on croit perdu.',
 'A reçu un message destiné à quelqu’un d’autre.','Connaît une entrée secondaire que personne ne surveille.','Se rappelle une conversation dont les participants nient l’existence.','Doit un service à une personne liée à l’affaire.',
 'A reconnu une voix sans parvenir à lui associer un visage.','Cache un lien ancien avec une personne mal vue localement.','A prêté un objet qui n’a jamais été rendu.','Attend un rendez-vous dont l’autre partie n’a pas confirmé la date.',
 'A remarqué qu’une routine avait changé juste avant les événements.','A conservé un reçu qui contredit une version officielle.','A couvert une absence sans demander d’explication.','Cherche à réparer une erreur avant qu’elle ne soit découverte.',
 'Sait qui a posé une question inhabituelle dans le quartier.','Garde un double de clé confié depuis longtemps.','A aperçu une personne dans un lieu où elle ne devait pas être.','A échangé deux colis pour rendre service et le regrette.',
 'A accepté de garder un sac sans en vérifier le contenu.','A été prévenu d’éviter un lieu sans savoir pourquoi.','A noté une plaque, une heure ou un numéro par simple habitude.','Attend le remboursement d’une petite somme devenue un sujet sensible.',
 'A conservé une ancienne liste de contacts.','Connaît l’origine banale d’une rumeur inquiétante.','A accepté un arrangement qui met désormais un proche en difficulté.','Possède un témoignage incomplet et craint de tirer une mauvaise conclusion.'
];
