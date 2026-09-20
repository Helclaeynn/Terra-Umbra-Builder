type Block =
  | { type: "p"; text: string; style?: string }
  | { type: "table"; rows: unknown[][] };

type Section = {
  id: string;
  title: string;
  level: number;
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

const SOURCE = "TUC_Moteur_V4_FINAL_2026-09-10.pdf";

const p = (text: string, style?: string): Block => ({ type: "p", text, ...(style ? { style } : {}) });
const table = (rows: unknown[][]): Block => ({ type: "table", rows });

export const COMPENDIUM_MOTEUR_V4_ARTICLES: Article[] = [
  {
    id: "regles-moteur-de-jeu",
    dataset: "moteur-v4",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Moteur de jeu — règles fondamentales",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: [
      "Moteur", "règles", "socle commun", "résolution", "profil", "statut",
      "combat", "tir", "santé", "stress", "Réalité", "Vérité"
    ],
    sections: [
      {
        id: "role-du-moteur",
        title: "Le socle commun de Terra Umbra California",
        level: 2,
        blocks: [
          p("Le Moteur rassemble les règles communes de Terra Umbra California : résolution des tests, profil dérivé, Initiative et Points d’Action, déplacement, Edge, Renommée, combat, tir, santé, soins et Stress."),
          p("Les règles spécifiques de Réalité et de Vérité se branchent sur ce socle sans le redéfinir, sauf lorsqu’une exception est explicitement écrite. En cas de doute, cette rubrique constitue donc la référence générale avant d’appliquer une règle plus spécifique.")
        ]
      },
      {
        id: "acces-rapide",
        title: "Accès rapide",
        level: 2,
        blocks: [
          table([
            ["Besoin en jeu", "Page de référence"],
            ["Faire un test, lire une Difficulté, calculer une DR, gérer opposition ou assistance", "Résolution des tests"],
            ["Retrouver une formule de fiche, Edge, Renommée ou Réputation", "Profil, valeurs dérivées & statut"],
            ["Déterminer l’Initiative, les PA, les passes, une Réaction ou un Déplacement", "Initiative, Points d’Action & déplacement"],
            ["Résoudre une attaque de Mêlée, de Pugilat, une Défense, une Zone ou la propriété Fiable", "Combat & défenses"],
            ["Résoudre un Tir, la portée, le couvert, Viser, Verrouillage, Rafale ou Suppression", "Tir, portée & tirs particuliers"],
            ["Gérer des blessures, l’Agonie, les soins, la récupération ou la mort", "Santé, blessures & soins"],
            ["Gérer un test de Stress ou les états Normal, Tendu et Paniqué", "Stress & états psychologiques"]
          ])
        ]
      },
      {
        id: "principe-de-specificite",
        title: "Règle générale et exception spécifique",
        level: 2,
        blocks: [
          p("Une règle de Réalité, de Vérité, de Talent, d’équipement, d’augmentation ou de créature peut modifier une règle du Moteur lorsqu’elle l’indique explicitement. Sans exception écrite, appliquer le Moteur tel quel."),
          p("Les valeurs de départ et les dépenses de création ne sont pas définies ici lorsqu’elles appartiennent au corpus de Création de personnage. Le Moteur décrit leur fonctionnement commun une fois en jeu.")
        ]
      }
    ]
  },
  {
    id: "regles-resolution-des-tests",
    dataset: "moteur-v4",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Résolution des tests",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: [
      "test", "jet", "Attribut", "Compétence", "1d10e", "d10 explosif", "Difficulté",
      "DR", "marge", "échec narratif", "circonstance", "opposition", "assistance",
      "prendre son temps", "action combinée", "Facile", "Normale", "Difficile"
    ],
    sections: [
      {
        id: "attributs-competences",
        title: "Attributs et Compétences",
        level: 2,
        blocks: [
          p("Les cinq Attributs sont Vigueur, Agilité, Esprit, Volonté et Charisme. Chaque Compétence est rattachée à son Attribut de référence pour les tests standards."),
          table([
            ["Attribut", "Compétences"],
            ["Vigueur", "Athlétisme · Pugilat · Humanité · Mêlée · Constitution"],
            ["Agilité", "Tir · Pilotage · Furtivité · Esquive · Larcin"],
            ["Esprit", "Mécanique · Langages & Argot · Savoirs · Soin · Investigation"],
            ["Volonté", "Neurodive · Perception · Maîtrise spirituelle · Survie · Force Mentale"],
            ["Charisme", "Séduction · Diplomatie · Commerce · Représentation · Autorité"]
          ])
        ]
      },
      {
        id: "test-standard",
        title: "Test standard",
        level: 2,
        blocks: [
          p("Test standard : Attribut + Compétence + 1d10e, comparé à une Difficulté. Un résultat naturel produisant un échec narratif l’emporte toujours sur une réussite numérique."),
          table([
            ["Difficulté", "Seuil"],
            ["Facile", "12"],
            ["Normale", "15"],
            ["Difficile", "18"],
            ["Très difficile", "21"],
            ["Impossible", "25"]
          ])
        ]
      },
      {
        id: "d10-explosif",
        title: "d10 explosif et échec narratif",
        level: 2,
        blocks: [
          p("À l’état Normal, un 10 naturel explose : lancer un second d10 et l’ajouter. Le second dé n’explose jamais. La contribution maximale normale du dé est donc 20."),
          p("Les états Tendu et Paniqué modifient l’explosion et la plage d’échec narratif. Ces effets sont détaillés dans Stress & états psychologiques."),
          table([
            ["État", "Échec narratif", "Explosion du d10"],
            ["Normal", "1 naturel", "10"],
            ["Tendu", "1–2 naturel", "9–10"],
            ["Paniqué", "1–3 naturel", "10"]
          ]),
          p("Un échec narratif est un échec même si le total aurait atteint ou dépassé la Difficulté.")
        ]
      },
      {
        id: "marge-et-dr",
        title: "Marge de réussite et DR",
        level: 2,
        blocks: [
          p("Lorsqu’un test réussit, calculer la Marge de réussite : résultat total moins Difficulté. Cette Marge détermine le nombre de DR."),
          table([
            ["Marge de réussite", "DR"],
            ["0–2", "0"],
            ["3–5", "1"],
            ["6–8", "2"],
            ["9–11", "3"],
            ["12–14", "4"],
            ["15+", "5"]
          ])
        ]
      },
      {
        id: "circonstances-opposition-cooperation",
        title: "Circonstances, opposition et coopération",
        level: 2,
        blocks: [
          p("Circonstance favorable : +3. Circonstance défavorable : −3. Des circonstances substantiellement identiques ne se cumulent pas : retenir le meilleur modificateur applicable."),
          p("Opposition : chaque camp effectue son test ; le résultat le plus élevé l’emporte. Une égalité maintient normalement le statu quo, sauf règle ou Talent contraire."),
          p("Assistance : un assistant possédant au moins 1 point dans une Compétence pertinente apporte +2. Une seule Assistance effective est normalement comptée. Elle n’est pas automatique en combat, sauf règle ou Talent."),
          p("Prendre son temps : lorsque la fiction le permet réellement, le MJ peut réduire la Difficulté d’un niveau. Une même Difficulté ne descend normalement pas de plusieurs niveaux par empilement de préparation ordinaire."),
          p("Action combinée : lorsque deux Compétences distinctes sont toutes deux indispensables, utiliser la plus faible pour le test, sauf Talent ou règle contraire.")
        ]
      },
      {
        id: "exemple-resolution",
        title: "Exemple de résolution",
        level: 2,
        blocks: [
          p("Exemple pédagogique : un personnage totalise 7 avec son Attribut et sa Compétence et tente une action de Difficulté Normale 15. Il obtient 9 au premier d10 ; à l’état Normal, ce résultat n’explose pas. Son total est 16 : la réussite a une Marge de 1 et vaut donc 0 DR. Cet exemple illustre uniquement la procédure générale.")
        ]
      }
    ]
  },
  {
    id: "regles-profil-valeurs-derivees-statut",
    dataset: "moteur-v4",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Profil, valeurs dérivées & statut",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: [
      "profil", "valeurs dérivées", "PV", "Seuil de Mort", "Défense passive",
      "Défense occulte", "Initiative", "Déplacement", "Intégrité", "Stress augmentique",
      "PA maximum", "état actuel", "Edge", "Forcer le Destin", "Échapper au Destin",
      "Renommée", "Réputation"
    ],
    sections: [
      {
        id: "valeurs-derivees",
        title: "Valeurs dérivées",
        level: 2,
        blocks: [
          p("Sauf indication explicite, les valeurs dérivées sont calculées à partir des valeurs permanentes d’Attribut et de Compétence. Les bonus de circonstances, d’équipement, de Talent ou les modificateurs temporaires ne les recalculent pas, sauf exception explicitement écrite."),
          table([
            ["Valeur", "Calcul"],
            ["PV maximum", "2 × Vigueur + Constitution"],
            ["Seuil de Mort", "−(Vigueur + Constitution)"],
            ["Défense passive", "Agilité + Esquive"],
            ["Défense occulte passive", "Volonté + Force Mentale"],
            ["Initiative", "Agilité + Athlétisme + 1d10e"],
            ["Déplacement", "5 + Athlétisme mètres par PA"],
            ["Intégrité", "Force Mentale + Humanité, minimum 1"],
            ["Stress augmentique max", "Vigueur + Humanité"],
            ["PA maximum", "3 normalement ; une capacité peut porter ce total à 4, une exception explicitement écrite à 5"]
          ])
        ]
      },
      {
        id: "etat-actuel",
        title: "État actuel",
        level: 2,
        blocks: [
          p("La fiche synthétise l’état dominant du personnage. Normal, Tendu et Paniqué relèvent du Stress ; Agonisant et Stabilisé relèvent de la Santé. Les pages Stress & états psychologiques et Santé, blessures & soins détaillent leurs effets.")
        ]
      },
      {
        id: "edge",
        title: "Edge",
        level: 2,
        blocks: [
          p("Edge est une ressource rare de Destin, conservée d’une session à l’autre. Maximum conservé : 8. Edge ne revient pas automatiquement par session et ne s’achète ni en XP ni en PTV."),
          p("Forcer le Destin — 1 Edge : remplacer la contribution du 1d10e par 20 = 10 + 10. Le total, la Marge et les DR sont ensuite calculés normalement ; cela ne garantit pas la réussite."),
          p("Échapper au Destin — 1 Edge : lorsqu’une conséquence devrait tuer le personnage, il survit. Les autres conséquences restent possibles selon la fiction."),
          p("Un seul Edge peut être utilisé pour le même jet ou la même conséquence. Le MJ peut exceptionnellement en rendre 1 lors d’un accomplissement personnel majeur, d’un sacrifice significatif ou d’une étape importante de campagne."),
          p("Les valeurs de départ et les dépenses d’Edge pendant la création appartiennent aux règles de Création de personnage.")
        ]
      },
      {
        id: "renommee",
        title: "Renommée",
        level: 2,
        blocks: [
          table([
            ["Score", "Niveau", "Portée"],
            ["0", "Inconnu", "Le nom ne signifie pratiquement rien."],
            ["1", "Connu du milieu", "Le réseau immédiat peut avoir entendu parler du personnage."],
            ["2", "Établi", "Professionnel reconnu dans son milieu local ; le nom circule réellement."],
            ["3", "Notable", "Figure connue à l’échelle de sa Sphère, de sa ville ou d’un secteur important."],
            ["4", "Célèbre", "Le nom est largement répandu, y compris hors du milieu immédiat."],
            ["5", "Figure majeure", "Personnalité incontournable dans le domaine concerné."]
          ])
        ]
      },
      {
        id: "renommee-reputation",
        title: "Renommée et Réputation ne sont pas la même chose",
        level: 2,
        blocks: [
          p("La Renommée mesure combien le nom circule ; la Réputation décrit ce qu’on raconte. Lorsqu’une réputation connue est réellement pertinente, appliquer normalement une circonstance favorable (+3), défavorable (−3) ou une conséquence fictionnelle évidente. Le score de Renommée seul n’accorde aucun bonus social universel.")
        ]
      }
    ]
  },
  {
    id: "regles-initiative-pa-deplacement",
    dataset: "moteur-v4",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Initiative, Points d’Action & déplacement",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: [
      "Initiative", "PA", "Points d’Action", "passes", "round", "Réaction",
      "Défense active", "PA gagné", "Déplacement", "se relever", "terrain",
      "Encombrement", "Encombrant", "portage", "traction"
    ],
    sections: [
      {
        id: "initiative-et-pa",
        title: "Initiative et nombre de PA",
        level: 2,
        blocks: [
          p("Initiative : Agilité + Athlétisme + 1d10e."),
          table([
            ["Résultat d’Initiative", "PA"],
            ["1–10", "1"],
            ["11–15", "2"],
            ["16+", "3"],
            ["1 naturel", "1 PA maximum"]
          ]),
          p("Le plafond normal est de 3 PA. Une capacité peut normalement porter ce total à 4. Une exception explicitement écrite peut atteindre 5 PA.")
        ]
      },
      {
        id: "ordre-des-passes",
        title: "Ordre des passes",
        level: 2,
        blocks: [
          p("Un round comporte jusqu’à cinq passes : 1 → 2 → 3 → 4 → 5. La passe 1 est celle où tout le monde agit ; les passes suivantes ne concernent que les personnages disposant initialement d’au moins autant de PA."),
          p("Chaque PA dépensé en Réaction ou en Défense active consomme un des PA du round. Lorsqu’un PA est dépensé hors de sa passe, il supprime en priorité la plus haute passe future encore disponible."),
          p("Un PA volontairement conservé peut rester disponible pour une Réaction jusqu’à la fin du round. S’il n’est pas utilisé, il est perdu.")
        ]
      },
      {
        id: "pa-gagne-en-cours-de-round",
        title: "PA gagné en cours de round",
        level: 2,
        blocks: [
          p("Lorsqu’un effet accorde +1 PA en cours de round, il ouvre la prochaine passe normalement inaccessible au personnage, dans la limite du plafond indiqué. Si cette passe est déjà passée, ce PA peut uniquement être conservé pour une Réaction avant la fin du round ; sinon il est perdu."),
          p("Exemple canonique : un personnage à 4 PA agit en passe 1. Il dépense ensuite 1 PA en Défense active : sa passe 4 est consommée. Il peut encore agir en passes 2 et 3. Dans la plupart des combats, les passes 4 et 5 servent donc surtout de réserve défensive.")
        ]
      },
      {
        id: "deplacement",
        title: "Déplacement",
        level: 2,
        blocks: [
          p("1 PA permet de parcourir 5 + Athlétisme mètres."),
          p("Un test n’est demandé que si le déplacement est difficile, dangereux ou contesté. Plusieurs PA peuvent être consacrés à plusieurs Déplacements. Se relever peut être intégré à un Déplacement.")
        ]
      },
      {
        id: "encombrement",
        title: "Équipement ordinaire et objets Encombrants",
        level: 2,
        blocks: [
          p("La jauge générale d’Encombrement est supprimée. Les petits objets, chargeurs, Holophone, outils courants et vêtements ne sont pas comptés individuellement."),
          p("Un personnage peut transporter normalement un nombre d’objets possédant la propriété Encombrant égal à sa Vigueur. Un objet exceptionnellement massif peut compter comme plusieurs objets Encombrants si sa fiche le précise."),
          p("Au-delà de cette limite, le transport exige un moyen approprié, devient une action de portage ou de traction, ou provoque les contraintes fictionnelles pertinentes.")
        ]
      }
    ]
  },
  {
    id: "regles-combat-defenses",
    dataset: "moteur-v4",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Combat & défenses",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: [
      "combat", "Défense passive", "Défense active", "surprise", "Mêlée",
      "Pugilat", "Armure", "dégâts", "DGT", "Zone", "Zone X m", "Fiable",
      "Réaction", "égalité", "alliés"
    ],
    sections: [
      {
        id: "defenses",
        title: "Défenses",
        level: 2,
        blocks: [
          p("Défense passive : Agilité + Esquive."),
          p("Défense active : 1 PA en Réaction, pour effectuer Agilité + Esquive + 1d10e. Une attaque surprise ne permet normalement pas de Défense active."),
          p("Une attaque doit dépasser la Défense. Une égalité maintient le statu quo et n’inflige ni dégâts ni effet.")
        ]
      },
      {
        id: "melee",
        title: "Mêlée",
        level: 2,
        blocks: [
          p("Attaque de Mêlée : Vigueur + Mêlée + 1d10e contre la Défense."),
          p("Dégâts : Marge + DGT de l’arme − Armure applicable."),
          p("L’Armure réduit les dégâts ; elle ne s’ajoute jamais à la Défense.")
        ]
      },
      {
        id: "pugilat",
        title: "Pugilat",
        level: 2,
        blocks: [
          p("Pugilat : Vigueur + Pugilat + 1d10e. DGT de base 1, sauf Talent, augmentation, arme naturelle ou autre règle.")
        ]
      },
      {
        id: "zones-effet",
        title: "Zones d’effet",
        level: 2,
        blocks: [
          p("Zone X m : une attaque Zone affecte toutes les cibles exposées dans la zone indiquée. Un seul jet d’attaque est effectué. Chaque cible compare séparément ce résultat à sa propre Défense ; sa marge et ses dégâts sont donc calculés individuellement."),
          p("Une cible consciente peut utiliser une Défense active pour 1 PA. Le couvert s’applique normalement ; un couvert total réellement interposé peut annuler l’exposition."),
          p("Une attaque de Zone ne sélectionne normalement pas une localisation anatomique précise. Une Altération éventuelle peut viser une conséquence cohérente avec la zone : projection, renversement, incendie du décor, rupture d’un support, etc."),
          p("Toutes les cibles exposées sont concernées, alliées comprises, sauf propriété explicitement sélective.")
        ]
      },
      {
        id: "fiable",
        title: "Propriété Fiable",
        level: 2,
        blocks: [
          p("Avec une arme Fiable, un 1 naturel reste un échec mais ne provoque ni échec narratif ni enrayement ou panne lié à l’arme."),
          p("Fiable ne protège pas d’un échec narratif provenant d’un autre résultat, par exemple un 2 lorsque le personnage est Tendu. Fiable ne transforme jamais l’échec en réussite.")
        ]
      }
    ]
  },
  {
    id: "regles-tir-portee-tirs-particuliers",
    dataset: "moteur-v4",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Tir, portée & tirs particuliers",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: [
      "Tir", "Altération", "Marge", "Portée", "couvert", "Viser", "Verrouillage",
      "Rafale", "Suppression", "Automatique", "tir au contact", "tir dans une mêlée",
      "localisation", "impact", "DGT"
    ],
    sections: [
      {
        id: "attaque-de-tir",
        title: "Attaque de Tir",
        level: 2,
        blocks: [
          p("Attaque de Tir : Agilité + Tir + 1d10e contre la Défense de la cible."),
          table([
            ["Marge", "Résultat"],
            ["1–5", "DGT de l’arme − Armure"],
            ["6–10", "DGT − Armure + une Altération cohérente"],
            ["11+", "2 × DGT − Armure + une Altération cohérente"]
          ]),
          p("L’Armure n’est jamais doublée.")
        ]
      },
      {
        id: "alteration",
        title: "Altération",
        level: 2,
        blocks: [
          p("Une Altération traduit une réussite particulièrement propre : localisation, désarmement, destruction d’un équipement exposé, projection, panne, rupture de support ou autre conséquence cohérente."),
          p("Une Altération ne crée pas automatiquement un état universel supplémentaire.")
        ]
      },
      {
        id: "viser",
        title: "Viser",
        level: 2,
        blocks: [
          p("Viser coûte 1 PA et donne +3 au prochain Tir. Si une Altération est obtenue, Viser permet d’annoncer une zone ou localisation précise lorsqu’elle est physiquement possible."),
          p("Viser est incompatible avec Rafale et Suppression.")
        ]
      },
      {
        id: "portee",
        title: "Portée",
        level: 2,
        blocks: [
          table([
            ["Distance", "Modificateur de Tir"],
            ["≤ 1/2 portée", "+3"],
            ["≤ portée", "normal"],
            ["≤ 2 × portée", "−3"],
            ["> 2 × portée", "normalement impossible sans effet explicite"]
          ])
        ]
      },
      {
        id: "couvert-et-melee",
        title: "Couvert, contact et mêlée",
        level: 2,
        blocks: [
          p("Couvert partiel : +3 Défense. Un couvert total réellement interposé rend normalement la cible impossible à atteindre directement."),
          p("Tir au contact : −3. Tir dans une mêlée : −3, sauf règle contraire.")
        ]
      },
      {
        id: "verrouillage",
        title: "Verrouillage",
        level: 2,
        blocks: [
          p("Verrouillage : 1 PA sur une cible détectée et suivie. Le tireur reçoit +3 au Tir tant que le suivi est maintenu. Une seule cible ou un seul système peut être verrouillé ; il n’existe pas de jauge de Verrouillage."),
          p("Viser et Verrouillage peuvent se cumuler car ils représentent deux préparations distinctes.")
        ]
      },
      {
        id: "rafale",
        title: "Rafale",
        level: 2,
        blocks: [
          p("Rafale nécessite la propriété Rafale. Elle coûte 1 PA et utilise un seul jet."),
          table([
            ["Marge", "Impacts"],
            ["1–5", "1 impact"],
            ["6–10", "2 impacts"],
            ["11+", "3 impacts"]
          ]),
          p("Chaque impact inflige DGT − Armure. Une Rafale ne produit aucune Altération et est incompatible avec Viser.")
        ]
      },
      {
        id: "suppression",
        title: "Suppression",
        level: 2,
        blocks: [
          p("Suppression nécessite Automatique et coûte 1 PA. Le résultat du test devient la valeur de Suppression jusqu’à la fin du round."),
          p("Toute cible qui s’expose ou traverse la zone et dont la Défense passive est inférieure à la valeur de Suppression subit 1 impact DGT − Armure."),
          p("La Suppression ne permet ni Altération ni Défense active ; elle peut déclencher un test de Stress. Elle est incompatible avec Viser.")
        ]
      }
    ]
  },
  {
    id: "regles-sante-blessures-soins",
    dataset: "moteur-v4",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Santé, blessures & soins",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: [
      "Santé", "PV", "blessures", "50%", "25%", "Agonisant", "Stabilisé",
      "Agonie", "Test d’Agonie", "Stabiliser", "Premiers soins", "Repos",
      "Soins prolongés", "Mort", "Seuil de Mort", "Séquelles", "récupération"
    ],
    sections: [
      {
        id: "pv-et-seuils",
        title: "PV et seuils de blessure",
        level: 2,
        blocks: [
          p("PV maximum : 2 × Vigueur + Constitution."),
          table([
            ["PV actuels", "Conséquence minimale"],
            ["50 % des PV ou moins", "Le personnage est au minimum Tendu."],
            ["25 % des PV ou moins", "Le personnage est au minimum Paniqué."],
            ["0 PV ou moins", "Le personnage est Agonisant."]
          ])
        ]
      },
      {
        id: "agonisant",
        title: "Agonisant",
        level: 2,
        blocks: [
          p("À 0 PV ou moins, un personnage Agonisant dispose au maximum de 1 PA par round. Il peut ramper, tenter des Premiers soins sur lui-même ou accomplir une action extrêmement simple ; il ne peut ni attaquer ni effectuer de Défense active."),
          p("Test d’Agonie : à la fin de chaque round tant qu’il n’est pas Stabilisé, effectuer Vigueur + Constitution + 1d10e contre 15. En échec, le personnage perd 1 PV. En échec narratif, il perd 2 PV.")
        ]
      },
      {
        id: "stabiliser",
        title: "Stabiliser",
        level: 2,
        blocks: [
          p("Stabiliser : Esprit + Soin, Difficulté 15. En réussite, l’Agonisant revient exactement à 0 PV et devient Stabilisé."),
          p("Un personnage Stabilisé ne fait plus de test d’Agonie mais ne peut pas agir normalement avant d’avoir récupéré au moins 1 PV.")
        ]
      },
      {
        id: "premiers-soins",
        title: "Premiers soins",
        level: 2,
        blocks: [
          p("Premiers soins : Esprit + Soin, Difficulté 15 par défaut, modifiable si les circonstances médicales le justifient. En réussite, la cible récupère 1 + DR PV."),
          p("Une seule tentative efficace de Premiers soins est possible par ensemble de blessures.")
        ]
      },
      {
        id: "repos-soins-prolonges",
        title: "Repos et soins prolongés",
        level: 2,
        blocks: [
          p("Repos : récupération de Constitution PV par jour, minimum 1."),
          p("Soins prolongés : dans des conditions médicales adaptées, la récupération de repos est doublée.")
        ]
      },
      {
        id: "mort",
        title: "Mort",
        level: 2,
        blocks: [
          p("Seuil de Mort : −(Vigueur + Constitution). Lorsqu’un personnage atteint ce seuil, il meurt.")
        ]
      },
      {
        id: "sequelles",
        title: "Séquelles",
        level: 2,
        blocks: [
          p("Une blessure particulièrement grave peut laisser une Séquelle physique si la fiction le justifie. Une prothèse, un traitement ou une augmentation peuvent la mitiger.")
        ]
      }
    ]
  },
  {
    id: "regles-stress-etats-psychologiques",
    dataset: "moteur-v4",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Stress & états psychologiques",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: [
      "Stress", "test de Stress", "Normal", "Tendu", "Paniqué", "échec narratif",
      "d10 explosif", "blessures", "retour au calme", "Traumatisme", "Raison",
      "Maîtrise spirituelle", "phobie", "obsession"
    ],
    sections: [
      {
        id: "test-de-stress",
        title: "Test de Stress",
        level: 2,
        blocks: [
          p("Test de Stress : Volonté + Maîtrise spirituelle + 1d10e contre une Difficulté adaptée à l’événement."),
          p("En échec, le personnage devient Tendu ou Paniqué selon la gravité de l’événement et les circonstances. Certains effets peuvent imposer directement un état.")
        ]
      },
      {
        id: "normal-tendu-panique",
        title: "Normal, Tendu et Paniqué",
        level: 2,
        blocks: [
          table([
            ["État", "Échec narratif", "Explosion du d10"],
            ["Normal", "1 naturel", "10"],
            ["Tendu", "1–2 naturel", "9–10"],
            ["Paniqué", "1–3 naturel", "10"]
          ])
        ]
      },
      {
        id: "stress-impose-blessures",
        title: "Stress minimum imposé par les blessures",
        level: 2,
        blocks: [
          p("À 50 % des PV ou moins, le personnage est au minimum Tendu. À 25 % des PV ou moins, il est au minimum Paniqué."),
          p("Un effet de repos ne peut pas faire descendre le Stress sous le minimum imposé par les blessures.")
        ]
      },
      {
        id: "remontee-seuil",
        title: "Remontée au-dessus d’un seuil de blessure",
        level: 2,
        blocks: [
          p("Lorsqu’une guérison, des Premiers soins ou une Régénération font remonter les PV au-dessus de 25 % ou 50 %, le minimum de Stress imposé uniquement par ce seuil cesse immédiatement."),
          p("Si Tendu ou Paniqué provenait seulement des blessures, l’état redescend au minimum encore applicable. Une autre source indépendante de Stress continue normalement.")
        ]
      },
      {
        id: "retour-au-calme",
        title: "Retour au calme",
        level: 2,
        blocks: [
          p("Quelques minutes de sécurité et de calme peuvent normalement faire passer Paniqué à Tendu."),
          p("Une nuit sûre ou une activité réellement réconfortante peut faire passer Tendu à Normal, si aucune autre règle n’impose un état minimum.")
        ]
      },
      {
        id: "traumatisme-durable",
        title: "Traumatisme durable",
        level: 2,
        blocks: [
          p("Une expérience exceptionnellement destructrice peut laisser une séquelle mentale, une phobie, une obsession ou le Désavantage Traumatisé."),
          p("Une simple rencontre avec le surnaturel ne crée pas automatiquement une jauge de Raison en Terra Umbra California.")
        ]
      }
    ]
  }
];

export const COMPENDIUM_MOTEUR_V4_NAVIGATION = [
  { id: "regles-moteur-de-jeu", dataset: "moteur-v4", category: "Règles", group: "Moteur de jeu", groupOrder: 10, pageOrder: 1, displayTitle: "Moteur de jeu — règles fondamentales" },
  { id: "regles-resolution-des-tests", dataset: "moteur-v4", category: "Règles", group: "Moteur de jeu", groupOrder: 10, pageOrder: 2, displayTitle: "Résolution des tests" },
  { id: "regles-profil-valeurs-derivees-statut", dataset: "moteur-v4", category: "Règles", group: "Moteur de jeu", groupOrder: 10, pageOrder: 3, displayTitle: "Profil, valeurs dérivées & statut" },
  { id: "regles-initiative-pa-deplacement", dataset: "moteur-v4", category: "Règles", group: "Moteur de jeu", groupOrder: 10, pageOrder: 4, displayTitle: "Initiative, Points d’Action & déplacement" },
  { id: "regles-combat-defenses", dataset: "moteur-v4", category: "Règles", group: "Moteur de jeu", groupOrder: 10, pageOrder: 5, displayTitle: "Combat & défenses" },
  { id: "regles-tir-portee-tirs-particuliers", dataset: "moteur-v4", category: "Règles", group: "Moteur de jeu", groupOrder: 10, pageOrder: 6, displayTitle: "Tir, portée & tirs particuliers" },
  { id: "regles-sante-blessures-soins", dataset: "moteur-v4", category: "Règles", group: "Moteur de jeu", groupOrder: 10, pageOrder: 7, displayTitle: "Santé, blessures & soins" },
  { id: "regles-stress-etats-psychologiques", dataset: "moteur-v4", category: "Règles", group: "Moteur de jeu", groupOrder: 10, pageOrder: 8, displayTitle: "Stress & états psychologiques" }
];
