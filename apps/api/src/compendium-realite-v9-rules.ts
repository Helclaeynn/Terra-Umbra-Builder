type Block =
  | { type: "p"; text: string; style?: string }
  | { type: "table"; rows: unknown[][] };

type Section = {
  id: string;
  title: string;
  level: number;
  audience?: "mj";
  blocks: Block[];
};

type Article = {
  id: string;
  dataset: string;
  category: string;
  sourceCategory: string;
  title: string;
  source: string;
  status: string;
  rebuildV2: true;
  tags: string[];
  sections: Section[];
};

const SOURCE = "TUC_Realite_V9_CROSSAUDIT_2026-09-10.pdf";

const p = (text: string, style?: string): Block => ({ type: "p", text, ...(style ? { style } : {}) });
const table = (rows: unknown[][]): Block => ({ type: "table", rows });

export const COMPENDIUM_REALITE_V9_RULE_ARTICLES: Article[] = [
  {
    id: "regles-realite-v9-reperes-sociaux",
    dataset: "realite-v9",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Réalité — repères sociaux",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "Sphères", "Origine", "Renommée", "Logifate", "Contacts", "Compte", "langues"],
    sections: [
      {
        id: "spheres-et-origine",
        title: "Sphères et Origine",
        level: 2,
        blocks: [
          p("Les cinq Sphères de Réalité sont Corporatiste, Gouvernementale, Mafieuse, Religieuse et Crawler."),
          p("L'Origine décrit le milieu de départ du personnage ; la Sphère actuelle décrit son appartenance présente. À la création, l'Origine donne accès à un Talent d'Origine. Ce Talent reste acquis même si le personnage change ensuite de Sphère."),
          p("Les Talents de Sphère représentent des accès, privilèges, réseaux, ressources et savoir-faire liés à l'appartenance actuelle. Leur usage peut dépendre du maintien de cette appartenance.")
        ]
      },
      {
        id: "langues",
        title: "Langues",
        level: 2,
        blocks: [
          p("Une langue maternelle est gratuite. Chaque point de Langages & Argot permet normalement une langue parlée supplémentaire.")
        ]
      },
      {
        id: "renommee-logifate-contacts-compte",
        title: "Renommée, Logifate, Contacts et Compte",
        level: 2,
        blocks: [
          table([
            ["Élément", "Rôle"],
            ["Renommée", "Jauge contextuelle persistante qui mesure combien le nom circule dans un milieu."],
            ["Logifate", "Profil social et administratif numérique : identité, fiabilité, habilitations et historique connus des systèmes."],
            ["Contacts", "Personnes nommées disposant de leurs propres moyens, intérêts, disponibilités et limites."],
            ["Compte", "Argent liquide ou numérique explicitement disponible pour les achats significatifs."]
          ]),
          p("Les valeurs initiales et dépenses de création sont définies par le corpus de Création de personnage. Cette page décrit leur place dans Réalité, pas une seconde table de création.")
        ]
      },
      {
        id: "statut-et-acces",
        title: "Appartenance, statut et accès",
        level: 2,
        blocks: [
          p("Dans Réalité, accès et propriété sont distincts. Un poste, une Sphère, une corporation, une administration, une famille mafieuse ou une institution religieuse peuvent donner droit à des services, logements, véhicules, informations ou protections qui cessent lorsque le lien institutionnel disparaît."),
          p("Une réputation personnelle, un Logifate ou un réseau de Contacts peuvent ouvrir une porte sans créer pour autant un droit permanent sur la ressource obtenue.")
        ]
      }
    ]
  },
  {
    id: "regles-realite-v9-talents",
    dataset: "realite-v9",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Talents de Réalité — structure & principes",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "Talents", "Talents communs", "expertise", "Origine", "Sphère", "Builder"],
    sections: [
      {
        id: "catalogue-canonique",
        title: "Un catalogue canonique de 122 Talents",
        level: 2,
        blocks: [
          table([
            ["Famille", "Nombre"],
            ["Talents communs", "12"],
            ["Talents d'expertise", "25"],
            ["Talents d'Origine", "25"],
            ["Talents de Sphère", "60"],
            ["Total", "122"]
          ]),
          p("Le détail des 122 Talents est alimenté par le catalogue canonique du Builder et ne doit pas être recopié dans une seconde source mécanique. Cette page conserve les principes qui structurent le catalogue.")
        ]
      },
      {
        id: "principes-communs",
        title: "Principes communs",
        level: 2,
        blocks: [
          p("Les Talents communs sont accessibles indépendamment de la Sphère."),
          p("Il existe exactement un Talent d'expertise par Compétence, soit cinq Talents d'expertise par Attribut et vingt-cinq au total."),
          p("Le modèle fréquent d'un Talent d'expertise est un bonus ciblé à la Compétence accompagné d'un effet signature. Un bonus de Talent n'augmente pas la valeur brute permanente d'une Compétence pour calculer une valeur dérivée, sauf indication explicite.")
        ]
      },
      {
        id: "origine",
        title: "Talents d'Origine",
        level: 2,
        blocks: [
          p("Chaque personnage choisit une Origine sociale et reçoit gratuitement un des cinq Talents correspondant à cette Origine. L'Origine n'est pas le métier actuel : elle représente ce qui reste de l'éducation et du milieu d'enfance."),
          p("Changer de Sphère ne retire jamais le Talent d'Origine déjà acquis.")
        ]
      },
      {
        id: "sphere",
        title: "Talents de Sphère",
        level: 2,
        blocks: [
          p("Les Talents de Sphère actuelle représentent privilèges, réseaux, ressources, accès ou savoir-faire liés à l'appartenance présente. Leur usage peut dépendre du maintien de cette appartenance."),
          p("Les cinq Sphères disposent chacune de douze Talents de Sphère : Crawler, Corporatiste, Gouvernementale, Pègre et Religieuse.")
        ]
      },
      {
        id: "neurodriver-stabilite",
        title: "Deux repères particuliers",
        level: 2,
        blocks: [
          p("Stabilité augmentique occupe la case d'expertise Humanité."),
          p("Neurodriver est le Talent d'expertise associé à Neurodive. Il exige Neurodive 1+, accorde +1 aux tests de Neurodive et +1 Neuroprogramme chargé au-delà du maximum normal du Rang. Il n'augmente jamais le Rang de Neurodive."),
          p("Neurodiver désigne toute personne pratiquant le Neurodive. Neurodriver désigne la neuroarchitecture rare représentée par le Talent ; les deux termes ne sont pas synonymes.")
        ]
      },
      {
        id: "progression",
        title: "Progression",
        level: 2,
        blocks: [
          p("Apprentissage fulgurant intervient dans le coût d'XP d'une hausse de Compétence réellement pratiquée ou entraînée pendant le scénario. Son effet complet appartient aux règles de progression de Création de personnage."),
          p("Sens surnaturels reste exclu du catalogue profane : la prescience relève de Vérité.")
        ]
      }
    ]
  },
  {
    id: "regles-realite-v9-desavantages",
    dataset: "realite-v9",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Désavantages de Réalité — structure & principes",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "Désavantages", "Edge", "Attributs", "Sphères", "Unsinkable", "Neurocompatibilité"],
    sections: [
      {
        id: "principe",
        title: "Principe",
        level: 2,
        blocks: [
          p("Les Désavantages sont des contraintes réelles. Ils ne servent jamais à obtenir gratuitement une ressource de création en annulant artificiellement leur propre effet."),
          p("Ils sont facultatifs. Un personnage peut choisir au maximum trois Désavantages à la création ; chacun accorde +1 Edge. Un Désavantage acquis ultérieurement en jeu n'accorde pas rétroactivement d'Edge."),
          p("Un Désavantage ne peut pas être choisi si un Talent, une Nature de Vérité ou une propriété permanente annule pratiquement son effet. Les couples Talent/Désavantage créés uniquement pour gagner une ressource de création sont donc à éviter.")
        ]
      },
      {
        id: "structure",
        title: "Structure du catalogue",
        level: 2,
        blocks: [
          table([
            ["Famille", "Nombre"],
            ["Désavantages communs", "15"],
            ["Faiblesses liées aux Attributs", "15"],
            ["Désavantages de Sphère", "25 — cinq par Sphère"],
            ["Total structurel", "55"]
          ]),
          p("Le détail des 55 entrées reste alimenté par le catalogue canonique du Builder. La structure et les règles générales sont conservées ici afin d'éviter de transformer le Compendium en seconde source mécanique.")
        ]
      },
      {
        id: "echelle",
        title: "Échelle et philosophie",
        level: 2,
        blocks: [
          p("Échelle indicative : −1 correspond à une faiblesse générale modérée, −2 à un handicap spécialisé ; une circonstance défavorable (−3) représente une vraie situation problématique."),
          p("Un Désavantage doit contraindre réellement les choix sans prendre complètement le contrôle du personnage. Violent n'oblige jamais automatiquement à attaquer un PJ ; Obsédé et Scrupuleux contraignent une décision mais laissent au joueur la manière dont le personnage agit."),
          p("Logifate, Renommée et Réputation décrivent le poids social sans multiplier les malus génériques de Charisme. Les Désavantages de Sphère modifient surtout confiance, accès et connaissance institutionnelle du personnage.")
        ]
      },
      {
        id: "cas-structurants",
        title: "Cas structurants",
        level: 2,
        blocks: [
          p("Unsinkable est un Désavantage ordinaire de création : +1 Edge, incompatibilité avec Neurodriver, impossibilité définitive de Neurodive et de guidage neuroassisté personnel. L'usage de surface de l'Holonet et des interfaces non immersives reste possible."),
          p("Neurocompatibilité nulle ajoute +2 au Stress augmentique de base total dès qu'au moins une augmentation générant du Stress est installée. Ce +2 s'applique au total, jamais à chaque augmentation."),
          p("Mauvais tireur réduit de 3 la marge uniquement pour déterminer une Altération de précision ou de localisation ; les dégâts du tir ne changent pas."),
          p("Aucun Désavantage n'augmente durablement le coût d'XP.")
        ]
      }
    ]
  },
  {
    id: "regles-realite-v9-charge-stress-frenesie",
    dataset: "realite-v9",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Charge, Stress & Frénésie augmentique",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "augmentations", "Charge", "Stress augmentique", "Frénésie", "Intégrité", "N-Sta"],
    sections: [
      {
        id: "valeurs",
        title: "Intégrité, Charge et Stress",
        level: 2,
        blocks: [
          p("Charge, Stress augmentique et Frénésie décrivent le coût d'intégration des augmentations terrestres."),
          p("Intégrité = Force Mentale + Humanité, minimum 1. Seules les valeurs permanentes comptent."),
          p("Stress augmentique maximum = Vigueur + Humanité."),
          p("Le Stress augmentique de base est la somme des valeurs de Stress des augmentations installées. Il représente une sollicitation permanente et ne disparaît pas par une simple nuit de repos."),
          p("Le Stress augmentique temporaire peut provenir d'Overclock, de dommages, de drogues, de programmes ou d'effets particuliers. Il disparaît selon la durée ou la condition de sa source.")
        ]
      },
      {
        id: "difficultes",
        title: "Saturation, dépassement et Difficulté de Maîtrise",
        level: 2,
        blocks: [
          table([
            ["Situation", "Difficulté de Maîtrise"],
            ["Charge = Intégrité ou Stress = maximum", "15"],
            ["Dépassement de 1", "18"],
            ["Dépassement de 2", "21"],
            ["Dépassement de 3 ou plus", "25"]
          ]),
          p("Lors d'un déclencheur majeur en Saturation ou Surcharge, ou lorsque le Stress atteint ou dépasse son maximum, effectuer Volonté + Maîtrise spirituelle contre la Difficulté correspondante."),
          p("Si Charge et Stress déclenchent simultanément une crise, effectuer un seul test avec la Difficulté la plus élevée. En échec, le personnage entre en Frénésie augmentique.")
        ]
      },
      {
        id: "frenesie",
        title: "Frénésie augmentique",
        level: 2,
        blocks: [
          p("La Frénésie possède une impulsion claire liée au déclencheur : violence, fuite, élimination d'une menace, accomplissement compulsif d'une fonction ou autre réaction cohérente."),
          p("À chaque round où cela est possible, le personnage doit consacrer au moins 1 PA à poursuivre directement cette impulsion."),
          p("Les actions exigeant calme, précision cognitive ou concentration subissent une circonstance défavorable (−3). La Frénésie n'accorde aucun PA et n'annule ni blessures, ni dégâts, ni Surcharge."),
          p("Sortie volontaire : Volonté + Maîtrise spirituelle difficulté 15 ; difficulté 12 si la cause a disparu.")
        ]
      },
      {
        id: "n-sta",
        title: "N-Sta",
        level: 2,
        blocks: [
          p("Pendant environ une heure, N-Sta réduit de 1 le Stress augmentique effectif et donne +2 aux tests de Maîtrise spirituelle provoqués par le Stress augmentique ou la Surcharge."),
          p("N-Sta ne modifie ni Charge ni Intégrité. Son emploi, son prix et ses contraintes de consommation appartiennent au catalogue d'Équipement & Objets.")
        ]
      }
    ]
  },
  {
    id: "regles-realite-v9-supports-slots-compatibilites",
    dataset: "realite-v9",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Augmentations — Supports, Slots & compatibilités",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "augmentations", "Supports", "Slots", "CyberŒil", "CyberAudio", "cybermembres", "Cyborg lourd", "Biogénétique"],
    sections: [
      {
        id: "support-et-module",
        title: "Support et module",
        level: 2,
        blocks: [
          p("Un Support crée l'architecture permettant d'installer des modules : câblage neuronal, CyberŒil, Kit CyberAudio, cybermembre ou architecture cyborg lourde. Les Slots appartiennent au Support concerné et ne forment pas une réserve globale."),
          p("Un support n'accorde pas automatiquement les effets des modules qu'il pourrait recevoir. Une fonction doit être réellement installée pour exister.")
        ]
      },
      {
        id: "neural",
        title: "NeuroWare",
        level: 2,
        blocks: [
          p("Le câblage neuronal est le Support des NeuroWares. Les modules neuronaux consomment leurs Slots dans ce câblage. Une interface ou un Port neuronal ne modifie jamais le Rang de Neurodive sauf texte explicite."),
          p("Le NeuroWare est une surface privilégiée du Stress augmentique et du piratage : une attaque Neuro ne cible cependant que les éléments réellement accessibles à la connexion.")
        ]
      },
      {
        id: "cyberoptique",
        title: "CyberOptique",
        level: 2,
        blocks: [
          p("Chaque CyberŒil est un Support distinct possédant ses propres Slots. Deux CyberYeux ne fusionnent donc pas leurs capacités en un seul Support ; ils forment deux architectures séparées."),
          p("Les bonus provenant de deux exemplaires d'un même module ne se cumulent pas, sauf mention explicite. Dupliquer un module sert surtout de redondance en cas de perte ou de panne d'un œil."),
          p("Un seul œil équipé d'un capteur suffit normalement pour utiliser sa fonction : le cerveau apprend à intégrer son flux avec celui de l'autre œil.")
        ]
      },
      {
        id: "ciblage-et-zoom",
        title: "Ciblage et Zoom",
        level: 2,
        blocks: [
          p("Le bonus d'un Dispositif de visée est un bonus de ciblage. Il ne se cumule ni avec le bonus de Viser, ni avec celui de Verrouillage : utiliser le meilleur bonus de ciblage disponible. Viser et Verrouillage conservent néanmoins leurs autres fonctions propres."),
          p("Un Zoom optique utilisé avec Viser peut ignorer le −3 de longue portée au-delà de la portée nominale et jusqu'à 2 × la portée. Cet effet est équivalent à celui d'une Optique de précision montée sur l'arme et ne se cumule pas avec elle. Il n'augmente jamais la portée maximale au-delà de 2 × sans autre règle explicite.")
        ]
      },
      {
        id: "cyberaudio",
        title: "CyberAudio",
        level: 2,
        blocks: [
          p("Le Kit CyberAudio remplace l'ensemble fonctionnel auditif : oreilles, tympans, capteurs et interfaces avec l'oreille interne. Filtrage, spatialisation, traduction et brouillage concernent l'ensemble du système auditif sauf indication contraire."),
          p("Deux modules identiques ne cumulent jamais le même bonus. La duplication peut fournir de la redondance mais pas un empilement numérique gratuit.")
        ]
      },
      {
        id: "implants-internes",
        title: "Implants internes",
        level: 2,
        blocks: [
          p("Les implants internes n'utilisent généralement pas de Slots. Ils occupent directement un organe, une structure ou une zone anatomique."),
          p("Deux dispositifs incompatibles sur le même organe ne peuvent pas cohabiter sans une architecture explicitement prévue pour cela.")
        ]
      },
      {
        id: "dermique",
        title: "Transformations dermiques",
        level: 2,
        blocks: [
          p("Les transformations dermiques n'utilisent pas de Slots génériques de peau : elles modifient directement une zone corporelle ou le revêtement du corps."),
          p("Une seule peau globale fonctionnelle principale peut normalement occuper le même revêtement corporel. Deux systèmes couvrant tout le même revêtement ne se superposent pas gratuitement ; Armure dermique et Camouflage dermique exigent un modèle combiné ou compatible, sinon il faut choisir la couche fonctionnelle principale."),
          p("Le SynthéDerm standard est un habillage : il peut recouvrir une augmentation compatible sans occuper la fonction dermique principale et sans modifier les performances de l'implant.")
        ]
      },
      {
        id: "membres",
        title: "Membres cybernétiques",
        level: 2,
        blocks: [
          p("Un membre cybernétique de base restaure les fonctions humaines normales. Il n'accorde pas automatiquement de Vigueur ou d'Agilité supplémentaire simplement parce qu'il est mécanique."),
          p("Chaque bras, main, jambe ou pied possède ses propres Slots. Un module monté dans le membre ne consomme normalement pas de Charge supplémentaire : la Charge structurelle a déjà été payée par le remplacement. Un module particulièrement massif peut toutefois générer du Stress."),
          p("Une arme intégrée est considérée comme toujours portée et prête. Son déploiement peut faire partie de l'action d'attaque sans Manipulation supplémentaire. Recharger, changer une cartouche ou effectuer une maintenance suit les règles normales.")
        ]
      },
      {
        id: "cyborg-lourd",
        title: "Cyborg lourd",
        level: 2,
        blocks: [
          p("Un support cyborg surnuméraire crée de nouveaux ancrages corporels ; il ne fournit pas gratuitement les membres, yeux ou capteurs fixés dessus."),
          p("Des appendices ou capteurs surnuméraires augmentent les possibilités matérielles, jamais l'économie de PA : ils ne donnent ni attaque, ni Défense active, ni Réaction gratuite."),
          p("Un élément exposé peut être ciblé par une Altération lorsque la fiction le permet. Sa destruction désactive localement le support ou capteur ; la Charge du personnage ne disparaît pas avant une véritable chirurgie.")
        ]
      },
      {
        id: "biogenetique",
        title: "Biogénétique terrestre",
        level: 2,
        blocks: [
          p("La Biogénétique n'utilise ni Génération ni Slots. Chaque traitement est développé à partir du patrimoine génétique du bénéficiaire."),
          p("Une fonction humaine restaurée ou optimisée tend vers Charge 0 / Stress 0. Une fonction corporelle réellement nouvelle produit de la Charge ; si elle exige une commande neurologique inhabituelle ou impose une tension physiologique permanente, elle produit aussi du Stress."),
          p("La Biogénétique est beaucoup plus chère et plus lente à cultiver que le Cyber à fonction comparable, moins interchangeable et sans modularité de garage. En contrepartie, elle est biologiquement intégrée, normalement non hackable et ne réclame pas de N-Sta lorsqu'elle génère 0 Stress."),
          p("Une blessure de Bioware se traite avec Soin plutôt qu'avec Mécanique. Un remplacement biologique ordinaire restaure la fonction humaine sans bonus ; accumuler sur ce même membre des fonctions non natives réintroduit Charge et Stress.")
        ]
      },
      {
        id: "esthetique-charisme",
        title: "Esthétique et Charisme",
        level: 2,
        blocks: [
          p("Les caractéristiques corporelles, choix esthétiques, implants mammaires, organes reproducteurs, implants sexuels ou modifications cosmétiques n'accordent jamais automatiquement de bonus ou malus global de Charisme. Une conséquence sociale dépend toujours du contexte réel de la scène.")
        ]
      },
      {
        id: "lecture-generations",
        title: "Lecture des trois familles terrestres",
        level: 2,
        blocks: [
          p("Gen 1 Cyber : brutale, bon marché, spécialisée et souvent très coûteuse en Stress."),
          p("Gen 2 Cyber : compacte, modulaire, bien intégrée et généralement plus légère en Stress."),
          p("Bio : très chère, personnalisée, organique, non hackable et souvent légère en Charge/Stress, mais sans Slots ni modularité immédiate.")
        ]
      }
    ]
  },
  {
    id: "regles-realite-v9-neurodive-principes-rang",
    dataset: "realite-v9",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Neurodive — principes, connexion & Rang",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "Neurodive", "Neurodiver", "Neurodriver", "Unsinkable", "Pressure", "Rang", "Holonet"],
    sections: [
      {
        id: "lexique",
        title: "Lexique",
        level: 2,
        blocks: [
          table([
            ["Terme", "Définition"],
            ["Neurodive", "Discipline et acte de plonger dans l'Holonet."],
            ["Neurodiver", "Toute personne capable de pratiquer le Neurodive."],
            ["Neurodriver", "Neurodiver doté d'une neuroarchitecture extrêmement rare, représentée par le Talent Neurodriver."],
            ["Unsinkable", "Architecture neurologique inverse : le cerveau rejette le Neurodive ; l'Holonet de surface reste utilisable."]
          ])
        ]
      },
      {
        id: "moteur-unique",
        title: "Un seul moteur",
        level: 2,
        blocks: [
          p("Test standard de Neurodive : Volonté + Neurodive + 1d10e."),
          p("Le Neurodive utilise le même pool de PA, la même Initiative et les mêmes PV que les actions physiques. Il n'existe ni réserve d'actions virtuelles ni jauge de PV Neuro séparée."),
          p("Neurodive permet accès, intrusion, analyse et contrôle. Les Neuroprogrammes permettent les actions spécialisées : Défense active, attaque, masquage de traces, évacuation sous opposition, sabotage autonome ou attaque d'augmentations."),
          p("Seule la valeur permanente de Neurodive détermine le Rang. Les bonus de Talent, d'équipement ou de programme ne relèvent jamais le Rang. Les Applications Holonet ordinaires ne consomment jamais de slot de Neuroprogramme.")
        ]
      },
      {
        id: "pressure",
        title: "Pressure",
        level: 2,
        blocks: [
          p("La sécurité, la profondeur et la difficulté de sortie d'un environnement sont représentées par sa Difficulté, ses IA, ses Neuroprogrammes de défense et les conséquences d'un échec."),
          p("Un environnement peut exiger une connexion profonde ou une immersion complète sans fournir automatiquement de bonus chiffré. Une architecture agressive peut prévoir verrouillage, Stress augmentique temporaire ou dégâts neuronaux.")
        ]
      },
      {
        id: "modes-connexion",
        title: "Modes de connexion",
        level: 2,
        blocks: [
          table([
            ["Mode", "Usage", "Contraintes", "Règle"],
            ["Holonet standard", "Navigation, applications, communication, recherche courante", "Le personnage reste incarné et conscient.", "Pas de bonus générique."],
            ["Neuro-hack local", "Intrusion, Contrôle et Neurocombat", "Attention partagée avec le monde physique.", "Les actions physiques exigeant forte concentration peuvent subir −3."],
            ["Plongée / immersion complète", "Environnements à forte Pressure", "Le corps est largement délaissé et vulnérable.", "Pas de bonus générique ; peut être exigée par l'environnement."],
            ["Connexion physique directe", "Port, prise, câble ou interface sur le système précis", "Expose physiquement l'utilisateur et son interface.", "+2 Intrusion et Contrôle contre le système exactement connecté."]
          ]),
          p("La connexion physique directe contourne portée radio, brouillage et isolement réseau du système câblé. Elle ne contourne ni chiffrement, ni authentification, ni sécurité logicielle. Son +2 ne s'applique ni aux Neuroattaques ni à la Défense Neuro.")
        ]
      },
      {
        id: "compatibilite",
        title: "Compatibilité et cibles",
        level: 2,
        blocks: [
          p("Un système électronique ou connecté n'est pas automatiquement Neurodive-compatible : il faut une voie de données réelle et une interface ou un protocole effectivement compatibles. Un câble ne traduit pas à lui seul un protocole alien."),
          p("Magie pure, âme, tissu biologique, pouvoir de Nature ou substrat technobiologique sans interface de contrôle accessible ne sont pas des cibles Neuro. Une couche de commande cybernétique explicitement connectée peut constituer une surface d'attaque distincte.")
        ]
      },
      {
        id: "interfaces",
        title: "Interfaces Neurodive",
        level: 2,
        blocks: [
          p("Un Holophone avec NavIA suffit pour l'usage ordinaire de l'Holonet. Charger et employer des Neuroprogrammes en intrusion ou Neurocombat exige une interface Neurodive compatible : cyberconsole, câblage neural, équipement de Neurodiver ou dispositif équivalent."),
          p("Une Cyberconsole permet les Neuroprogrammes sans implant neural mais n'accorde aucun Rang et ne fournit pas à elle seule le +2 de connexion directe. Un Kit hardline permet cette connexion lorsque l'accès physique compatible existe réellement."),
          p("Le Neuromaster est une interface d'immersion profonde et fournit Réduction 3 [Neuro] contre les pertes de PV neuronales ; il n'augmente ni Rang, ni slots, ni PA.")
        ]
      },
      {
        id: "rang",
        title: "Rang de Neurodive",
        level: 2,
        blocks: [
          table([
            ["Neurodive brut", "Rang", "Neuroprogrammes chargés"],
            ["0", "0", "0"],
            ["1–3", "1", "1"],
            ["4–6", "2", "2"],
            ["7–9", "3", "3"],
            ["10–15", "4", "4"]
          ]),
          p("Le Rang mesure uniquement la capacité cognitive et technique à maintenir des Neuroprogrammes. Il ne représente ni une portée spéciale, ni une réserve de PA, ni l'aptitude Neurodriver.")
        ]
      },
      {
        id: "neurodriver",
        title: "Neurodriver",
        level: 2,
        blocks: [
          p("Neurodriver exige Neurodive 1+. Il donne +1 aux tests de Neurodive et +1 Neuroprogramme chargé au-delà du maximum normal du Rang. Le bonus n'augmente jamais le Rang."),
          p("La présence fictionnelle d'un Neurodriver peut être décrite comme relayée par les nœuds et objets qu'il a réellement atteints. Cela ne contourne jamais une Intrusion, ne crée pas une ligne de données inexistante et ne donne aucune action ou portée mécanique gratuite.")
        ]
      },
      {
        id: "unsinkable",
        title: "Unsinkable",
        level: 2,
        blocks: [
          p("Un Unsinkable peut utiliser l'Holonet de surface, les applications et interfaces non immersives, mais ne peut jamais effectuer de Neurodive, charger ou employer un Neuroprogramme, ni acquérir Neurodriver. Sa valeur de Neurodive est inutilisable tant que le Désavantage existe."),
          p("Il ne peut pas bénéficier de Smartlink, Interface de ciblage, Verrouillage personnel ou autre guidage exigeant une liaison neurale avec l'utilisateur. Optiques ordinaires, commandes manuelles et systèmes Autoguidés réellement autonomes continuent de fonctionner."),
          p("Plongée forcée : la connexion échoue toujours. Vigueur + Constitution difficulté 15 permet de rejeter proprement la connexion ; échec : 1 PV neural et Tendu ; échec narratif : 2 PV neuronaux et Paniqué.")
        ]
      }
    ]
  },
  {
    id: "regles-realite-v9-neurodive-actions-intrusion",
    dataset: "realite-v9",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Neurodive — actions, intrusion, contrôle & trace",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "Neurodive", "Intrusion", "Contrôle", "Trace", "Masquage", "Neuroprogrammes", "sécurité"],
    sections: [
      {
        id: "chargement",
        title: "Chargement et programmes engagés",
        level: 2,
        blocks: [
          p("Un programme chargé occupe un slot et est immédiatement disponible. Hors pression, modifier le chargement est libre ; en combat, poursuite ou intrusion chronométrée, remplacer un programme chargé coûte 1 PA."),
          p("Utiliser la fonction d'un programme coûte uniquement le PA indiqué par cette fonction : aucun PA supplémentaire n'est requis pour l'allumer."),
          p("Un même test ne reçoit qu'un seul bonus numérique direct provenant des Neuroprogrammes. Les effets qui permettent l'action, modifient une conséquence ou protègent un environnement peuvent coexister s'ils ne représentent pas le même bonus."),
          p("Une Défense Neuro active n'emploie qu'un seul programme défensif ; seuls le bonus et les effets de ce programme s'appliquent à cette Défense, sauf effet explicitement passif."),
          p("Un effet entretenu depuis le loadout personnel cesse lorsque le programme est déchargé. Une installation persistante dans une infrastructure exige une copie ou instance dédiée ; une même copie ne peut pas protéger une infinité de systèmes.")
        ]
      },
      {
        id: "actions",
        title: "Actions de Neurodive",
        level: 2,
        blocks: [
          p("Hors pression, les actions triviales ne demandent ni PA ni jet. Sous opposition, en combat ou lorsqu'un compte à rebours importe, les actions significatives coûtent normalement 1 PA."),
          table([
            ["Action", "Programme ?", "Résolution"],
            ["Navigation / consultation", "Non", "Accéder à une information déjà autorisée ; pas de test sans obstacle réel."],
            ["Analyse", "Non", "Étudier une donnée accessible ; test seulement si elle est complexe, cachée ou trompeuse."],
            ["Cartographie", "Non", "Identifier la topologie accessible d'un sous-réseau ; test si des zones sont dissimulées."],
            ["Intrusion", "Non", "Volonté + Neurodive contre la Difficulté de sécurité."],
            ["Contrôle", "Non", "Prendre la main sur un nœud atteint ; test si sécurité ou opposition subsiste."],
            ["Action sur système contrôlé", "Non", "Chaque action significative coûte normalement 1 PA."],
            ["Copie ordinaire", "Non", "Copier des données accessibles ; 1 PA sous pression."],
            ["Neuroattaque", "Oui — offensif", "Volonté + Neurodive + 1d10e contre Défense Neuro."],
            ["Défense Neuro active", "Oui — défensif", "1 PA en Réaction : Volonté + Force Mentale + 1d10e."],
            ["Masquage / nettoyage", "Oui — spécialisé", "Généralement 1 PA et test de Neurodive."],
            ["Fuite sous verrouillage", "Oui — spécialisé", "Programme d'évacuation si une contre-mesure empêche la déconnexion."],
            ["Sabotage / copie d'IA / attaque d'augmentations", "Oui — spécialisé", "Le programme correspondant définit l'effet."]
          ])
        ]
      },
      {
        id: "securite",
        title: "Niveaux de sécurité",
        level: 2,
        blocks: [
          table([
            ["Niveau", "Difficulté"],
            ["Faible / civile", "12"],
            ["Standard", "15"],
            ["Renforcée", "18"],
            ["Haute sécurité", "21"],
            ["Exceptionnelle", "25"]
          ])
        ]
      },
      {
        id: "intrusion-controle",
        title: "Intrusion et Contrôle",
        level: 2,
        blocks: [
          p("Une Intrusion réussie franchit l'obstacle annoncé : authentification, verrou, porte logique ou accès local. Elle ne donne jamais automatiquement le contrôle de tout le système."),
          p("Une fois le nœud atteint, Contrôle permet de prendre la main sur une fonction réellement accessible : porte, caméra, arme, ventilation, véhicule, terminal, etc. Une autre fonction ou un autre nœud peut exiger une nouvelle action.")
        ]
      },
      {
        id: "echec",
        title: "Échec et échec narratif",
        level: 2,
        blocks: [
          p("En échec, l'accès n'est pas obtenu. Selon la sécurité, l'échec peut déclencher alerte, verrouillage, IA ou trace."),
          p("En échec narratif, le MJ peut notamment provoquer localisation, alerte prioritaire, verrouillage, trace forte, expulsion ou corruption du Neuroprogramme effectivement utilisé. Un équipement connecté peut aussi être endommagé si la contre-mesure a réellement accès à lui.")
        ]
      },
      {
        id: "trace",
        title: "Trace",
        level: 2,
        blocks: [
          p("Réussir l'objectif ne supprime jamais automatiquement les preuves. Sans Masquage approprié, un autre Neurodiver, une IA ou une enquête peut déterminer qu'une intrusion a eu lieu et remonter les opérations selon les traces disponibles.")
        ]
      },
      {
        id: "deconnexion",
        title: "Déconnexion",
        level: 2,
        blocks: [
          p("Hors pression, se déconnecter est libre. Sous opposition, une déconnexion simple coûte 1 PA. Si la connexion est verrouillée ou si l'utilisateur veut sortir malgré une contre-mesure, un programme d'évacuation peut être requis.")
        ]
      }
    ]
  },
  {
    id: "regles-realite-v9-neurocombat-integrite-logicielle",
    dataset: "realite-v9",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Neurocombat & intégrité logicielle",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "Neurocombat", "Défense Neuro", "Neuroattaque", "dégâts neuronaux", "programmes grillés", "IA"],
    sections: [
      {
        id: "debut",
        title: "Début du Neurocombat",
        level: 2,
        blocks: [
          p("Dès qu'une IA, un Neurodiver ou une défense active s'oppose directement à l'intrus, lancer l'Initiative normale. Les passes, PA et Réactions restent ceux du moteur général."),
          p("Défense passive : Volonté + Force Mentale."),
          p("Défense active : 1 PA en Réaction, nécessite un programme défensif chargé, Volonté + Force Mentale + 1d10e, plus l'effet éventuel du programme choisi."),
          p("Neuroattaque : 1 PA, nécessite un programme offensif chargé, Volonté + Neurodive + 1d10e contre la Défense Neuro.")
        ]
      },
      {
        id: "cible-vivante",
        title: "Cible vivante",
        level: 2,
        blocks: [
          p("Si une Neuroattaque dépasse la Défense, la cible perd un nombre de PV égal à la marge. L'Armure physique ordinaire ne réduit pas ces dégâts ; seule une protection explicitement [Neuro] peut les réduire ou les empêcher."),
          p("Les dégâts neuronaux utilisent les PV normaux et peuvent donc imposer Tendu, Paniqué, Agonisant et Mort. Ils représentent douleur neurale, surcharge des interfaces, crise sensorielle, convulsions ou lésions physiologiques provoquées par la connexion.")
        ]
      },
      {
        id: "ia-programmes",
        title: "IA et programmes hostiles",
        level: 2,
        blocks: [
          p("Les IA et programmes ordinaires n'utilisent pas une jauge universelle de PV. Une attaque réussie produit un état de fonctionnement selon la marge, sauf effet particulier du Neuroprogramme."),
          table([
            ["Marge", "Effet standard"],
            ["1–5", "Perturbé : −3 à la prochaine action de l'IA ou du programme."],
            ["6–10", "Désactivé : l'instance cesse de fonctionner jusqu'à relance, réparation ou restauration."],
            ["11+", "Détruit : l'instance doit être restaurée, réinstallée ou remplacée."]
          ]),
          p("Une IA majeure, un agent autonome de scénario ou un système stratégique peut recevoir un profil spécifique et plusieurs couches de protection.")
        ]
      },
      {
        id: "alteration-neuro",
        title: "Marge majeure et Altération Neuro",
        level: 2,
        blocks: [
          p("Sur une Neuroattaque infligeant normalement des PV à une cible vivante, une marge 11+ permet de convertir 3 points de dégâts en une Altération Neuro ciblée et techniquement plausible."),
          p("Exemples : désactiver une interface ou un périphérique connecté jusqu'à réparation, forcer une déconnexion si l'architecture et le programme le permettent, créer une trace exploitable, exposer une identité numérique ou rendre un canal local inutilisable jusqu'à réinitialisation."),
          p("Une Altération Neuro ne détruit jamais arbitrairement un organe, une augmentation vitale ou un matériel hors ligne ou inaccessible. Les programmes spécialisés gardent la priorité.")
        ]
      },
      {
        id: "corruption",
        title: "Corruption de programme",
        level: 2,
        blocks: [
          p("Lorsqu'un personnage obtient un échec narratif en utilisant un Neuroprogramme, le MJ peut choisir de corrompre ce programme si la conséquence est cohérente avec l'action."),
          p("Une corruption ordinaire rend la copie indisponible jusqu'à réinstallation ou réparation. Une contre-mesure particulièrement destructrice peut griller la copie si elle y a réellement accès.")
        ]
      },
      {
        id: "sacrifice",
        title: "Sacrifice de programme",
        level: 2,
        blocks: [
          p("Après calcul de la Neuroattaque, application de la Défense, des effets défensifs et des Réductions [Neuro], mais avant de perdre les PV restants, la cible peut sacrifier un ou plusieurs Neuroprogrammes chargés."),
          p("Chaque Neuroprogramme sacrifié annule 3 PV de dégâts neuronaux restants. Plusieurs programmes peuvent être sacrifiés sur la même attaque ; l'excédent de réduction est perdu. Le programme défensif utilisé peut lui-même être sacrifié."),
          p("Un programme sacrifié est grillé : sa copie ou clé locale est détruite et son slot devient indisponible jusqu'à la fin du Neurocombat et à un redémarrage sûr. Pour le réutiliser ensuite, il faut une autre copie valide ou en racheter une, sauf contrat ou licence prévoyant explicitement un remplacement.")
        ]
      },
      {
        id: "materiel",
        title: "Matériel physique et restauration",
        level: 2,
        blocks: [
          p("Holophone, cyberconsole, port d'interface, relais, combinaison de Neurodiver ou périphérique connecté peuvent être briqués ou endommagés si l'attaque y a réellement accès. Un équipement hors ligne ou physiquement séparé n'est jamais une cible magique."),
          p("Une copie légale simplement corrompue peut souvent être réinstallée hors pression si la licence et le support existent encore. Une copie grillée par sacrifice, une clé brûlée, une copie clandestine ou un sabotage destructeur exige une nouvelle copie valide. La perte d'un programme reste une conséquence significative, jamais une taxe automatique sur chaque échec.")
        ]
      },
      {
        id: "profils-ia",
        title: "Profils rapides d'IA de sécurité",
        level: 2,
        audience: "mj",
        blocks: [
          table([
            ["IA", "Attaque Neuro", "Défense", "PA", "Usage"],
            ["Routine", "+6 + 1d10e", "12", "1", "Assistant, verrou civil, drone logiciel simple."],
            ["Standard", "+8 + 1d10e", "15", "2", "Sécurité privée ordinaire."],
            ["Renforcée", "+10 + 1d10e", "18", "2", "Corpo sensible, système professionnel."],
            ["Haute sécurité", "+12 + 1d10e", "21", "3", "Infrastructure critique, cadre, agence."],
            ["Exceptionnelle", "+15 + 1d10e", "25", "3", "Nœud stratégique, prototype, système majeur."]
          ]),
          p("La Difficulté d'Intrusion d'un système et la Défense Neuro de son IA sont deux valeurs distinctes. Une IA utilise son bonus d'Attaque Neuro + 1d10e pour l'Initiative ; ses PA restent ceux de son profil.")
        ]
      },
      {
        id: "exemple",
        title: "Exemple canonique d'intrusion sous opposition",
        level: 2,
        blocks: [
          p("Un Neurodiver tente d'ouvrir une porte corporatiste de sécurité Renforcée, difficulté 18. Il échoue : une IA se déclenche et une trace apparaît. Il reste connecté pour récupérer une information ; le Neurocombat commence avec l'Initiative normale."),
          p("L'IA attaque. Le Neurodiver dépense 1 PA en Défense active avec un programme défensif mais perd 1 PV neural sur une marge adverse de 1. Il utilise son PA restant pour accomplir son objectif. Au round suivant, il attaque l'IA, puis emploie un programme de Masquage avant de se déconnecter. Si la connexion avait été verrouillée, un programme d'évacuation aurait été nécessaire.")
        ]
      },
      {
        id: "reference-rapide",
        title: "Référence rapide",
        level: 2,
        blocks: [
          table([
            ["Élément", "Règle"],
            ["Test Neurodive", "Volonté + Neurodive + 1d10e"],
            ["Défense passive", "Volonté + Force Mentale"],
            ["Défense active", "1 PA + programme défensif : Volonté + Force Mentale + 1d10e"],
            ["Neuroattaque", "1 PA + programme offensif : Volonté + Neurodive + 1d10e"],
            ["Dégâts vivants", "Marge en PV ; Armure physique ignorée"],
            ["Sécurité", "12 / 15 / 18 / 21 / 25"],
            ["Connexion directe", "+2 Intrusion et Contrôle contre le système exactement connecté"],
            ["Changement de programme", "Libre hors pression ; 1 PA sous pression"],
            ["Applications", "Aucun slot"],
            ["Sacrifice", "1 programme chargé = −3 PV neuronaux restants ; programme grillé"]
          ])
        ]
      }
    ]
  },
  {
    id: "regles-realite-v9-economie-compte-train-vie",
    dataset: "realite-v9",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Économie, Compte, Train de vie & accès",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "économie", "Compte", "Train de vie", "Charges fixes", "revenus", "marché noir", "Crawler"],
    sections: [
      {
        id: "economie",
        title: "Économie et pouvoir d'achat",
        level: 2,
        blocks: [
          p("L'économie combine prix réels, Compte disponible, Train de vie et Charges fixes."),
          p("Le symbole $ représente une unité de compte numérique. Les espèces sont rares ; paiements, crédits, abonnements et comptes sont principalement dématérialisés."),
          p("Le prix catalogue est le prix de référence normal d'un produit ou service terrestre disponible légalement. Il ne garantit ni stock, ni autorisation, ni absence de contrôle."),
          p("Le Compte représente l'argent explicitement disponible pour les gros achats. Les petites dépenses ordinaires couvertes par le Train de vie ne sont pas retirées une à une.")
        ]
      },
      {
        id: "echelle-prix",
        title: "Lecture intuitive des montants",
        level: 2,
        blocks: [
          table([
            ["Montant", "Lecture intuitive"],
            ["1 $", "Eau, micro-dépense, consommation triviale."],
            ["10 $", "Repas populaire, petit service banal."],
            ["50 $", "Petite prestation, munitions, sortie ordinaire."],
            ["100 $", "Dépense personnelle notable."],
            ["500 $", "Arme, armure ou gadget de base ; gros achat du quotidien."],
            ["1 000 $", "Équipement professionnel sérieux."],
            ["5 000 $", "Matériel haut de gamme, armure lourde, grosse dépense."],
            ["10 000 $", "Véhicule bon marché ou augmentation importante."],
            ["50 000 $", "Véhicule majeur, package augmentique lourd, technologie rare."],
            ["100 000 $+", "Actif corporatif, blindé, prototype ou patrimoine lourd."]
          ])
        ]
      },
      {
        id: "revenus",
        title: "Revenus mensuels indicatifs",
        level: 2,
        blocks: [
          table([
            ["Profil", "Revenu net / disponible mensuel indicatif"],
            ["Underlife / irrégulier", "0–900 $"],
            ["Précaire / exploité", "900–1 500 $"],
            ["Ouvrier / service", "1 500–2 300 $"],
            ["Ouvrier qualifié / agent public", "2 300–3 500 $"],
            ["Technicien / professionnel", "3 500–5 000 $"],
            ["Spécialiste / cadre junior", "5 000–8 000 $"],
            ["Cadre", "8 000–15 000 $"],
            ["Directeur / haut spécialiste", "15 000–30 000 $"],
            ["Élite", "30 000 $+"]
          ]),
          p("Le revenu en cash ne suffit pas à mesurer le niveau de vie : logement corporatif, véhicule de fonction, assurances, entretien augmentique et services peuvent représenter des milliers de dollars sans apparaître comme salaire.")
        ]
      },
      {
        id: "disponibilite",
        title: "Prix, disponibilité et marché",
        level: 2,
        blocks: [
          table([
            ["Contexte", "Multiplicateur / lecture"],
            ["Légal courant", "Prix catalogue ; variation locale typique ±20 %."],
            ["Contrôle, licence, zone chère", "×1 à ×1,2 selon frais et disponibilité."],
            ["Marché noir courant", "×1,25 à ×1,5."],
            ["Militaire / fortement restreint", "×1,5 à ×3 ; l'accès peut être le vrai problème."],
            ["Volé / chaud / tracé", "×0,5 à ×0,8 avec un risque réel."],
            ["Prototype / actif institutionnel", "Pas de prix automatique : accès, contrat, scénario ou dotation."]
          ])
        ]
      },
      {
        id: "train-vie",
        title: "Train de vie",
        level: 2,
        blocks: [
          p("Le Train de vie représente ce que le personnage peut consacrer à son quotidien après ses engagements : nourriture, sorties, vêtements courants, petits achats, loisirs et confort. Ce n'est pas son salaire."),
          table([
            ["Train de vie", "Référence mensuelle", "Quotidien typique"],
            ["Survie", "200 $", "Rations ou synthétique, récupération, presque aucun loisir."],
            ["Modeste", "400 $", "Vie populaire, achats surveillés, quelques sorties bon marché."],
            ["Standard", "650 $", "Quotidien confortable normal, services usuels."],
            ["Confortable", "1 200 $", "Sorties et services réguliers, qualité choisie."],
            ["Aisé", "2 500 $", "Consommation premium, vraie nourriture plus fréquente, services faciles."],
            ["Luxe", "5 000 $+", "Standing, restauration haut de gamme, services et disponibilité privilégiés."]
          ])
        ]
      },
      {
        id: "charges-fixes",
        title: "Charges fixes",
        level: 2,
        blocks: [
          p("Logement principal, véhicule personnel ou leasing, abonnement de mobilité haut de gamme, entretien ou remboursement d'augmentations, dettes, pensions, assurances privées coûteuses, planque, second logement et tout engagement mensuel durable peuvent constituer des Charges fixes."),
          p("Pour chaque tranche complète de Charges fixes égale à la valeur de référence du Train de vie de base, le Train de vie effectif baisse d'un cran."),
          p("La référence reste toujours celle du Train de vie de base : les seuils ne sont pas recalculés après chaque baisse."),
          p("Le Train de vie effectif ne descend pas sous Survie. Au-delà, le personnage est en déficit structurel et doit puiser dans son Compte, s'endetter, vendre un actif, réduire ses charges ou perdre un service."),
          p("Un avantage pris en charge par une corporation, organisation ou Talent ne compte que pour le reste réellement payé par le personnage. Un abonnement annuel est divisé par 12 pour mesurer son poids mensuel.")
        ]
      },
      {
        id: "acces",
        title: "Accès typique par Train de vie",
        level: 2,
        blocks: [
          table([
            ["Base", "Logement normalement accessible", "Mobilité normalement accessible", "Planque / refuge"],
            ["Survie", "Squat, urgence, dortoir très bon marché", "Trajet unitaire, marche, récupération", "Cache improvisée ou squat"],
            ["Modeste", "Dortoir, micro-logement, vieux studio ou chambre", "Pass transports, MAS occasionnel, petit abonnement", "Pièce louée, box, squat discret"],
            ["Standard", "Studio urbain ancien, logement connecté simple", "Bull Basic/Standard, vieille voiture correcte, moto, CityPod financé", "Studio anonyme, garage ou local"],
            ["Confortable", "Bon appartement connecté ou logement protégé", "VAP familial, moto haut de gamme, Bull Premium", "Planque dédiée simple"],
            ["Aisé", "Résidence sécurisée de cadre ou grand appartement", "Nymphrover Executive, plusieurs solutions, Bull Executive", "Planque sécurisée et anonyme"],
            ["Luxe", "Penthouse, villa, résidence corporative premium", "Véhicules multiples, Nymphrover Security, blindé plausible", "Plusieurs planques spécialisées et haute sécurité"]
          ]),
          p("Accès n'est pas propriété. Un employeur peut fournir un logement ou véhicule bien au-dessus du Train de vie en cash ; perdre le statut peut faire disparaître l'avantage immédiatement.")
        ]
      },
      {
        id: "compte-dotations",
        title: "Compte, achats et dotations",
        level: 2,
        blocks: [
          p("Le Train de vie couvre alimentation, boissons ordinaires, hygiène, vêtements courants, transports usuels, petits loisirs et dépenses domestiques du niveau correspondant."),
          p("Le Compte paie les biens durables et les dépenses dont rareté ou quantité comptent : armes, munitions, N-Sta, drogues à effet mécanique, medkits, matériel de mission, pots-de-vin, achats clandestins et réparations significatives."),
          p("Un achat comptant payé une seule fois n'est pas une Charge fixe. Seuls remboursement, leasing, abonnement, entretien, assurance ou autre engagement mensuel durable l'alimentent."),
          p("Une dotation institutionnelle est un droit d'usage, pas un patrimoine revendable, sauf texte explicite contraire.")
        ]
      },
      {
        id: "logements-securite",
        title: "Logements, planques et sécurité",
        level: 2,
        blocks: [
          p("La sécurité d'un logement utilise les Difficultés ordinaires 12 / 15 / 18 / 21 / 25 pour intrusion physique ou numérique selon le niveau."),
          p("Discrétion, isolement et sécurité sont trois axes distincts. Un logement ouvert offre de nombreuses commodités mais davantage de surface d'attaque ; un logement sécurisé durcit ses services ; un lieu isolé réduit sa surface de hack au prix du confort et des services.")
        ]
      },
      {
        id: "services-drogues",
        title: "Services et consommables",
        level: 2,
        blocks: [
          p("Un service achète du temps, une compétence, un accès, une infrastructure ou une prise en charge réelle ; il ne produit pas automatiquement un bonus abstrait au personnage."),
          p("La nourriture ordinaire n'accorde ni PV ni bonus statistique. Un bon repas peut participer à la sortie de Tendu ou Paniqué dans un contexte de repos et de réconfort, mais n'est jamais un consommable de soin."),
          p("Les drogues ont des effets réels sans devenir une seconde économie de buffs permanents. Leurs risques passent par Constitution, Stress, dépendance, surcharge et conséquences de scène.")
        ]
      },
      {
        id: "credit-crawler",
        title: "Crédit et économie Crawler",
        level: 2,
        blocks: [
          p("Une corporation peut financer opération, implants, entretien, logement, repas, formation, assurance et emploi contre dette ou engagement de travail. Il n'existe pas de taux d'intérêt universel : la contrepartie peut être durée, propriété intellectuelle, clause de non-concurrence, saisie d'actif ou service."),
          p("Un personnage peut porter 120 000 $ d'augmentations tout en étant pauvre, endetté et incapable de payer une grosse facture en cash."),
          table([
            ["Contrat Crawler", "Prime brute indicative"],
            ["Petit boulot", "1 000–3 000 $"],
            ["Professionnel", "5 000–15 000 $"],
            ["Dangereux / armé", "20 000–50 000 $"],
            ["Très gros contrat", "50 000–200 000 $"],
            ["Majeur / Vérité / crise", "200 000 $+ ou considération spéciale"]
          ]),
          p("Un Fixer ou réseau peut prendre environ 10–25 % à titre indicatif. La Blanchisserie peut retenir une part importante des primes et demander un abonnement ; son taux dépend du contrat. Accès et réputation comptent autant que le prix.")
        ]
      },
      {
        id: "frontiere-verite",
        title: "Frontière économique avec Vérité",
        level: 2,
        blocks: [
          p("Les marchés xéno peuvent utiliser Dykal, dettes, services et accès ; l'AIDH moderne fonctionne surtout par dotation et autorisation. Il n'existe aucune conversion forcée Dykal ↔ $. L'équipement terrestre reste technologiquement en dessous des bonnes technologies xéno et surtout de l'AIDH.")
        ]
      }
    ]
  },
  {
    id: "regles-realite-v9-equipement-proprietes-protections",
    dataset: "realite-v9",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Équipement terrestre — propriétés & protections",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "équipement", "armes", "Armure", "Réductions", "Camo", "Smartlink", "Autoguide", "EMP", "Deep Fake Live"],
    sections: [
      {
        id: "principes",
        title: "Règles communes",
        level: 2,
        blocks: [
          p("Les vêtements ordinaires n'accordent pas de bonus fixe. Une tenue réellement adaptée ou inadaptée peut produire une circonstance favorable (+3) ou défavorable (−3)."),
          p("Deux bonus substantiellement identiques ne se cumulent pas : utiliser le meilleur, sauf texte explicite contraire."),
          p("Les objets portant la propriété Encombrant suivent la règle de portage du Moteur : la capacité normale est liée à la Vigueur, et un objet massif peut compter pour plusieurs.")
        ]
      },
      {
        id: "proprietes-armes",
        title: "Propriétés d'armes",
        level: 2,
        blocks: [
          table([
            ["Propriété", "Effet"],
            ["Rafale", "Autorise l'action Rafale du Moteur."],
            ["Automatique", "Autorise l'action Suppression."],
            ["Fiable", "Un 1 naturel reste un échec mais n'entraîne ni échec narratif ni enrayement lié à l'arme."],
            ["Perforant X", "Ignore X points de protection matérielle applicable."],
            ["Dispersion X", "Au-delà de la moitié de la portée nominale, DGT −X."],
            ["Smartlink", "Compatible avec Interface de ciblage et Verrouillage."],
            ["Autoguide", "Peut exploiter un Verrouillage maintenu par le tireur ou un désignateur compatible ; permet un tir guidé avec trajectoire plausible, jamais une touche automatique."],
            ["EMP", "Permet aux Altérations de viser électronique, capteurs, interface, arme ou mobilité technologique."],
            ["Zone X m", "Affecte toutes les cibles exposées dans la zone selon le moteur général."],
            ["Encombrant", "Compte dans la limite de portage et peut exiger appui, harnais ou moyen adapté."]
          ])
        ]
      },
      {
        id: "portee-verrouillage",
        title: "Portée et Verrouillage",
        level: 2,
        blocks: [
          table([
            ["Distance", "Modificateur de Tir"],
            ["≤ 1/2 portée", "+3"],
            ["≤ portée", "normal"],
            ["≤ 2 × portée", "−3"],
            ["> 2 × portée", "normalement impossible sans effet explicite"]
          ]),
          p("Verrouillage : 1 PA sur une cible détectée et suivie ; +3 au Tir tant que le suivi est maintenu. Une seule cible ou un seul système peut être verrouillé ; la perte du suivi annule le Verrouillage."),
          p("Viser et Verrouillage peuvent se cumuler si les deux actions sont payées et leurs conditions remplies. Certains niveaux de Camo peuvent annuler leurs bonus.")
        ]
      },
      {
        id: "armure-reductions",
        title: "Armure de base et Réductions",
        level: 2,
        blocks: [
          p("L'Armure est la couche matérielle de base et s'applique aux dégâts matériels lorsqu'une protection physique peut réellement s'interposer. Les Réductions typées s'ajoutent ensuite seulement contre leur vecteur. Aucun plafond global d'Armure 10 n'est imposé."),
          table([
            ["Protection", "Couvre"],
            ["Armure", "Projectiles, armes de contact, impacts et autres dommages physiques lorsque la protection s'interpose."],
            ["Réduction [Balistique]", "Protection supplémentaire contre projectiles et tirs physiques."],
            ["Réduction [Mêlée]", "Protection supplémentaire contre armes de contact et armes naturelles de mêlée."],
            ["Réduction [Antichoc]", "Pugilat non armé, chute, collision, écrasement, projection et impact brutal."],
            ["Réduction [type]", "Feu, froid, électricité, Neuro, chimique ou autre vecteur explicitement indiqué."]
          ]),
          p("Superposition : utiliser la meilleure Armure portée compatible et la meilleure Armure corporelle applicable ; ces deux couches peuvent se cumuler. Deux Armures portées ordinaires ne s'additionnent pas entre elles, pas plus que deux Armures corporelles. Une Réduction typée s'ajoute uniquement contre son vecteur.")
        ]
      },
      {
        id: "ablatif",
        title: "Ablatif",
        level: 2,
        blocks: [
          p("Ablatif X indique le nombre d'impacts pendant lesquels une protection supplémentaire est disponible. Chaque impact applicable consomme une charge d'Ablatif ; une fois les charges épuisées, le bonus disparaît jusqu'à remplacement ou recharge prévue par l'équipement.")
        ]
      },
      {
        id: "camo",
        title: "Camo et tromperie électronique",
        level: 2,
        blocks: [
          table([
            ["Niveau", "Effet"],
            ["Camo 1", "+2 Furtivité lorsque le spectre de camouflage est pertinent."],
            ["Camo 2", "Comme Camo 1 et annule le +3 de Viser lorsque le tireur dépend du spectre masqué."],
            ["Camo 3", "Comme Camo 2 et annule le +3 de Verrouillage lorsque le suivi dépend du spectre masqué."],
            ["Electro-trompeur", "Le Verrouillage électronique est ignoré contre le porteur ; la cible reste attaquable si elle est autrement détectée."]
          ]),
          p("Camo n'agit que contre les sens et capteurs que l'équipement masque réellement. Une combinaison visuelle ne rend pas automatiquement invisible au radar, à l'odorat ou à un senseur biologique.")
        ]
      },
      {
        id: "holo-dfl",
        title: "Holo-tissage et Deep Fake Live",
        level: 2,
        blocks: [
          p("Holo-tissage : +2 Furtivité uniquement pour cacher ou falsifier l'identité, la silhouette ou l'apparence."),
          p("Deep Fake Live avec projecteur et modélisation compatibles : circonstance favorable (+3) en Représentation pour incarner l'identité simulée, ou en Furtivité si l'objectif est seulement de cacher qui est le porteur. L'effet ne s'applique pas deux fois au même test."),
          p("DFL simule l'apparence, pas la masse, la voix sans module dédié, la rétine, l'ADN, les empreintes ou une authentification physique réelle.")
        ]
      },
      {
        id: "modules-armure",
        title: "Capacité de personnalisation des armures",
        level: 2,
        blocks: [
          table([
            ["Type d'armure", "Capacité standard"],
            ["Gilet basique", "1 module"],
            ["Armure légère", "2 modules"],
            ["Armure lourde", "3 modules"],
            ["Protection environnementale", "2 modules"],
            ["Armure de furtivité", "2 modules"]
          ]),
          p("Un même module ne se cumule pas avec lui-même. Les profils précis des modules, armures, armes, munitions et accessoires restent dans Équipement & Objets.")
        ]
      }
    ]
  },
  {
    id: "regles-realite-v9-vehicules-poursuites-reparations",
    dataset: "realite-v9",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Véhicules, poursuites & réparations",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Réalité", "véhicules", "Pilotage", "Structure", "Blindage", "poursuite", "collision", "Neurodive", "réparation"],
    sections: [
      {
        id: "moteur-vehicule",
        title: "Le moteur véhicule",
        level: 2,
        blocks: [
          p("Les véhicules utilisent le moteur général de Réalité. Il n'existe pas de sous-système de combat véhicule séparé. Une fiche utilise surtout Structure, Blindage, Défense, Sécurité réseau, Pilotage autonome, prix, entretien et places.")
        ]
      },
      {
        id: "structure-blindage",
        title: "Structure, Blindage et Altérations",
        level: 2,
        blocks: [
          p("Le Blindage réduit les dégâts matériels reçus. Perforant X ignore X points de Blindage lorsqu'il est applicable."),
          p("Les dégâts restant après Blindage réduisent la Structure. À 0 Structure, le véhicule est hors service et ne peut plus se déplacer normalement ; il n'explose pas automatiquement."),
          p("Un véhicule n'est ni Tendu ni Paniqué. Avant 0 Structure, les pertes fonctionnelles passent par des Altérations pouvant viser roue ou train roulant, propulsion, moteur, batterie, capteurs, arme embarquée, autopilote, liaison Holonet, portes ou autre sous-système réellement accessible."),
          table([
            ["Catégorie", "Structure indicative"],
            ["Moto / petit drone", "8"],
            ["Voiture", "15"],
            ["Gros SUV / utilitaire", "20"],
            ["Véhicule blindé léger", "25"],
            ["APC / blindé militaire", "35"]
          ])
        ]
      },
      {
        id: "defense-conduite",
        title: "Défense et conduite",
        level: 2,
        blocks: [
          p("Un véhicule en mouvement piloté manuellement utilise Agilité + Pilotage comme Défense passive."),
          p("Évasion active : 1 PA du conducteur, Agilité + Pilotage + 1d10e. Le véhicule n'a pas de pool de PA séparé."),
          p("Un VAP autonome utilise son score fixe de Pilotage autonome comme Défense et pour ses manœuvres ordinaires sous pression. Il ne lance pas de dé et n'effectue pas de Défense active."),
          p("Sous pression, passer du pilotage autonome au manuel ou inversement est une Manipulation simple de 1 PA ; hors pression, c'est libre."),
          p("Un véhicule stationnaire, immobilisé ou abandonné ne bénéficie pas d'une Défense de Pilotage ; le tir se résout comme contre un objet selon taille, distance et circonstances.")
        ]
      },
      {
        id: "poursuites",
        title: "Poursuites",
        level: 2,
        blocks: [
          p("Une poursuite n'utilise pas de jauge. Chaque phase significative demande un test opposé Agilité + Pilotage + 1d10e ; un VAP autonome oppose son score fixe."),
          p("Le vainqueur gagne ou perd la distance ou position recherchée. Un nouveau jet n'intervient qu'à l'apparition d'un enjeu réel distinct.")
        ]
      },
      {
        id: "tir-occupants",
        title: "Tir et occupants",
        level: 2,
        blocks: [
          p("Les armes tirées depuis un véhicule utilisent leurs profils normaux. Une circonstance défavorable (−3) peut s'appliquer si le tireur conduit simultanément, subit une manœuvre violente ou dispose d'une mauvaise ligne de tir."),
          p("Un occupant visible peut être visé directement. La carrosserie lui donne un couvert partiel (+3 Défense) lorsqu'elle masque réellement une partie du corps."),
          p("Si la trajectoire traverse une partie blindée ou une vitre blindée, le Blindage du véhicule réduit d'abord les dégâts, puis l'Armure personnelle de l'occupant s'applique."),
          p("La perte de Structure ne blesse pas automatiquement les occupants : attaque, collision, incendie ou Altération doivent réellement pouvoir les atteindre.")
        ]
      },
      {
        id: "collisions",
        title: "Collisions",
        level: 2,
        blocks: [
          table([
            ["Collision", "DGT indicatif"],
            ["Choc léger / faible vitesse", "6"],
            ["Collision routière violente", "10"],
            ["Haute vitesse / véhicule lourd", "14"],
            ["Impact catastrophique", "18"]
          ]),
          p("Le Blindage s'applique normalement au véhicule. Les occupants ne subissent des dégâts Antichoc que si le choc est assez violent pour les atteindre malgré les dispositifs de sécurité ; le MJ choisit un DGT adapté plutôt que de recopier automatiquement les dégâts du véhicule.")
        ]
      },
      {
        id: "neurodive",
        title: "Neurodive et véhicules",
        level: 2,
        blocks: [
          p("La Sécurité réseau du véhicule est une Difficulté normale d'Intrusion Neurodive : 12 / 15 / 18 / 21 / 25."),
          p("Après avoir atteint le nœud, une action de Contrôle permet d'agir sur les fonctions accessibles : portes, destination, autopilote, capteurs, communication, ralentissement ou arrêt, ou arme automatisée connectée."),
          p("Neurodive ne remplace pas Pilotage. Le pirate peut commander l'autopilote et utiliser son score fixe ; s'il veut exécuter lui-même une manœuvre complexe ou tactique, il utilise Pilotage normalement."),
          p("Un vieux véhicule manuel ou un Gundriver déconnecté peut avoir Sécurité réseau « — » pour sa propulsion : il n'existe alors aucun contrôle à pirater à distance. Ses fonctions secondaires connectées peuvent conserver leur propre sécurité."),
          p("Le +2 de connexion Neurodive physique directe s'applique normalement au système exactement câblé.")
        ]
      },
      {
        id: "reparation",
        title: "Réparation",
        level: 2,
        blocks: [
          p("Réparation d'urgence : avec un kit technique et environ 10 minutes, Esprit + Mécanique difficulté 15. En réussite, restaurer 1 + DR Structure OU remettre temporairement en service un sous-système non catastrophiquement détruit."),
          p("Une même avarie ne peut recevoir qu'une Réparation d'urgence avant un véritable passage en atelier ou remplacement de pièces."),
          p("Une remise en état complète demande temps, pièces et infrastructure. L'entretien mensuel ne couvre pas automatiquement les destructions de combat.")
        ]
      },
      {
        id: "longue-distance",
        title: "Longue distance",
        level: 2,
        blocks: [
          p("Les vactrains magnétiques sous vide relient les grandes capitales à environ 7 000 km/h. L'aviation classique et supersonique, notamment à piles à combustible et hydrogène solide, domine les longues distances aériennes."),
          p("Transport balistique, cavitation, bateaux et aéroglisseurs restent disponibles selon les zones et usages."),
          p("Un voyage ordinaire peut rester absorbé par le Train de vie lorsque son coût n'est pas un enjeu. Un voyage exceptionnel, premium, clandestin ou orbital touche le Compte.")
        ]
      }
    ]
  }
];

export const COMPENDIUM_REALITE_V9_RULE_NAVIGATION = [
  { id: "regles-realite-v9-reperes-sociaux", dataset: "realite-v9", category: "Règles", group: "Réalité — règles spécifiques", groupOrder: 30, subgroup: "Profil & création", subgroupOrder: 10, pageOrder: 10, displayTitle: "Réalité — repères sociaux" },
  { id: "regles-realite-v9-talents", dataset: "realite-v9", category: "Règles", group: "Réalité — règles spécifiques", groupOrder: 30, subgroup: "Profil & création", subgroupOrder: 10, pageOrder: 20, displayTitle: "Talents de Réalité — structure & principes" },
  { id: "regles-realite-v9-desavantages", dataset: "realite-v9", category: "Règles", group: "Réalité — règles spécifiques", groupOrder: 30, subgroup: "Profil & création", subgroupOrder: 10, pageOrder: 30, displayTitle: "Désavantages de Réalité — structure & principes" },
  { id: "regles-realite-v9-charge-stress-frenesie", dataset: "realite-v9", category: "Règles", group: "Réalité — règles spécifiques", groupOrder: 30, subgroup: "Augmentations", subgroupOrder: 20, pageOrder: 10, displayTitle: "Charge, Stress & Frénésie augmentique" },
  { id: "regles-realite-v9-supports-slots-compatibilites", dataset: "realite-v9", category: "Règles", group: "Réalité — règles spécifiques", groupOrder: 30, subgroup: "Augmentations", subgroupOrder: 20, pageOrder: 20, displayTitle: "Augmentations — Supports, Slots & compatibilités" },
  { id: "regles-realite-v9-neurodive-principes-rang", dataset: "realite-v9", category: "Règles", group: "Réalité — règles spécifiques", groupOrder: 30, subgroup: "Neurodive", subgroupOrder: 30, pageOrder: 10, displayTitle: "Neurodive — principes, connexion & Rang" },
  { id: "regles-realite-v9-neurodive-actions-intrusion", dataset: "realite-v9", category: "Règles", group: "Réalité — règles spécifiques", groupOrder: 30, subgroup: "Neurodive", subgroupOrder: 30, pageOrder: 20, displayTitle: "Neurodive — actions, intrusion, contrôle & trace" },
  { id: "regles-realite-v9-neurocombat-integrite-logicielle", dataset: "realite-v9", category: "Règles", group: "Réalité — règles spécifiques", groupOrder: 30, subgroup: "Neurodive", subgroupOrder: 30, pageOrder: 30, displayTitle: "Neurocombat & intégrité logicielle" },
  { id: "regles-realite-v9-economie-compte-train-vie", dataset: "realite-v9", category: "Règles", group: "Réalité — règles spécifiques", groupOrder: 30, subgroup: "Économie & équipement", subgroupOrder: 40, pageOrder: 10, displayTitle: "Économie, Compte, Train de vie & accès" },
  { id: "regles-realite-v9-equipement-proprietes-protections", dataset: "realite-v9", category: "Règles", group: "Réalité — règles spécifiques", groupOrder: 30, subgroup: "Économie & équipement", subgroupOrder: 40, pageOrder: 20, displayTitle: "Équipement terrestre — propriétés & protections" },
  { id: "regles-realite-v9-vehicules-poursuites-reparations", dataset: "realite-v9", category: "Règles", group: "Réalité — règles spécifiques", groupOrder: 30, subgroup: "Économie & équipement", subgroupOrder: 40, pageOrder: 30, displayTitle: "Véhicules, poursuites & réparations" }
];
