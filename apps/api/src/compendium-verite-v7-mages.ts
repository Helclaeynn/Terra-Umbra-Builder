type Block={type:"p";text:string;style?:string}|{type:"table";rows:unknown[][]};
type Section={id:string;title:string;level:number;audience?:"mj";blocks:readonly Block[]};
type Article={id:string;dataset:string;category:string;sourceCategory:string;title:string;source:string;status:string;rebuildV2:true;tags:string[];sections:Section[]};
const SOURCE="TUC_Verite_V7_CROSSAUDIT_2026-09-10.docx";
const SOURCE_PAYLOAD={
  "lore": [
    {
      "id": "ouverture",
      "title": "Repère",
      "level": 2,
      "blocks": []
    },
    {
      "id": "le-mageius",
      "title": "Le Mageius",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Un Mage est un Humain lié à un Mageius, structure magique quasi autonome servant de conduit entre sa volonté et la Magie. Le Mageius n’est ni un organe ordinaire, ni une réserve de mana, ni une personne enfermée dans le corps du Mage. Il possède une continuité faite d’affinités, de résonances, d’instincts et parfois des traces de ses porteurs précédents."
        }
      ]
    },
    {
      "id": "avant-les-societes-humaines",
      "title": "Avant les sociétés humaines",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Mageius sont plus anciens que les traditions qui les étudient. Lorsque la Terre baignait davantage dans la Magie, certains agrégats finirent par acquérir une forme de conscience et s’incarnèrent dans des êtres vivants. Sur de très longues périodes, certaines lignées devinrent particulièrement compatibles avec eux et donnèrent naissance aux Voyageurs : Dives, Gorgones, Amazones, Kochtchei, Babayaga et autres êtres dont les mythologies ont conservé des souvenirs déformés. Les Mageius finirent également par se fixer aux Humains. Cette association produisit les premiers grands Mages et des traditions que les Elfes d’Aèr désignèrent sous le terme de Myrddin. La transmission n’est cependant pas un simple héritage sanguin : la descendance d’un grand Mage ne garantit pas qu’un enfant recevra un Mageius, et un Mage peut apparaître dans une famille qui n’en a aucune mémoire."
        }
      ]
    },
    {
      "id": "la-guerre-de-la-magie",
      "title": "La Guerre de la Magie",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Mages apprirent que les Mageius pouvaient survivre à leurs porteurs et rejoindre d’autres hôtes. Les grands Voyageurs cessèrent alors d’être seulement des rivaux ou des monstres : ils devinrent aussi des réservoirs de structures magiques convoitées. La Guerre de la Magie vit des sociétés humaines lever des forces contre plusieurs lignées de Voyageurs afin de les détruire et de libérer les Mageius qu’elles portaient. La victoire fut presque complète et profondément ironique. Les sociétés humaines que les Mages avaient contribué à renforcer finirent par se retourner contre eux. La magie devint superstition, hérésie ou crime ; ceux qui avaient détruit une partie de leurs anciens rivaux durent apprendre à se cacher au milieu des civilisations qu’ils avaient aidé à bâtir."
        }
      ]
    },
    {
      "id": "la-roue-magique",
      "title": "La Roue magique",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Cinq grandes familles décrivent le point d’entrée naturel d’un Mageius dans la Roue. Le Kaharal résonne avec la matière et la forme ; le Meldir avec l’ordre, la restauration et la lumière ; l’Elinaeth avec les forces, l’information et le continuum ; le Mestherak avec l’âme, la mort et l’essence vitale ; le Discella avec l’ombre, l’illusion et la malédiction. Ces Types ne sont pas cinq écoles fermées. Un Kaharal peut étudier la Chronomancie sans cesser d’être Kaharal ; il doit simplement parcourir une portion plus éloignée de la Roue. L’âge et l’expérience des grands Mages sont donc dangereux parce qu’ils ont parfois eu des siècles pour apprendre des domaines que leur affinité initiale ne laissait pas deviner."
        }
      ]
    },
    {
      "id": "comprendre-avant-d-imposer",
      "title": "Comprendre avant d’imposer",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "La magie ne comprend pas les mots à la place du Mage. Connaître le nom d’un organe ne permet pas de le manipuler si l’on ne sait pas où il se trouve ni comment il fonctionne. Un Alchimiste ne fabrique pas une molécule complexe qu’il ne comprend pas simplement parce qu’il en connaît la désignation. La connaissance profane détermine donc directement la finesse et l’étendue de ce qu’un Mage peut imposer au monde. Cette relation explique l’importance des sciences, de la médecine, de l’histoire et des savoirs techniques dans les communautés magiques. Un chirurgien Morphomancien est terrifiant parce qu’il connaît l’anatomie. Un chimiste Alchimiste parce qu’il sait réellement ce qui se produira lorsque deux structures se rencontrent. La Magie ne remplace pas l’expertise ; elle la prolonge jusqu’à l’impossible."
        }
      ]
    },
    {
      "id": "uvres-echos-et-heritage",
      "title": "Œuvres, Échos et héritage",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "À mesure qu’un Mage affine une technique, sa manière de faire peut s’inscrire dans son Mageius. Après sa mort, il peut rester un Écho : réflexe, méthode ou technique qu’un porteur ultérieur découvrira comme presque naturelle. Inversement, une technique suffisamment aboutie peut devenir une Œuvre personnelle puis, si elle est transmise, une Magie familiale. Chez les Mages, une famille peut donc être une généalogie d’idées autant qu’une lignée de sang."
        }
      ]
    },
    {
      "id": "les-loges",
      "title": "Les Loges",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Mages se regroupent en Loges qui servent à la fois d’écoles, de refuges, d’autorités et de réseaux de transmission. Elles coopèrent sans former un gouvernement mondial cohérent. Leur organisation valorise fortement la maîtrise et l’enseignement : apprentis, Singularis, Tutors, Referrers, Magisters et quelques figures hors norme structurent un milieu où le savoir est à la fois prestige et moyen de survie. La naissance de la Grande Californie a provoqué une crise très concrète parmi elles. Les anciennes juridictions américaines et mexicaines ne correspondaient plus au territoire politique, ouvrant un conflit entre Los Angeles et Tijuana pour le contrôle de la nouvelle organisation régionale. Los Angeles l’emporta, mais les affrontements affaiblirent durablement la communauté magique locale."
        }
      ]
    },
    {
      "id": "puissance-et-revers",
      "title": "Puissance et Revers",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Un Mageius peut être forcé. Plus un Mage pousse de puissance au-delà de ce qu’il maîtrise confortablement, plus il augmente le risque d’un Revers et d’une Dormance qui peut fermer son accès à la Magie pendant plusieurs jours. Les plus expérimentés ne sont donc pas ceux qui forcent systématiquement davantage, mais ceux qui savent exactement quand le prix d’un échec justifie de risquer de perdre leur propre magie."
        }
      ]
    },
    {
      "id": "les-mages-en-2035",
      "title": "Les Mages en 2035",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "La modernité a rendu le savoir plus accessible que jamais. Imagerie médicale, bases scientifiques, modélisation, capteurs et bibliothèques numériques donnent aux Mages des moyens d’étude que leurs prédécesseurs auraient considérés comme miraculeux. La technologie ne concurrence pas nécessairement la Magie : elle produit de nouveaux phénomènes à comprendre et de nouvelles manières de vérifier ce que l’on croit savoir. Elle augmente aussi l’échelle des erreurs. Une faute qui aurait autrefois brûlé une pièce peut désormais perturber un réseau automatisé, un laboratoire ou une infrastructure urbaine. Le Mage contemporain possède davantage de connaissances que presque tous ses prédécesseurs ; il possède donc aussi davantage de manières de se tromper."
        }
      ]
    },
    {
      "id": "vivre-avec-un-mageius",
      "title": "Vivre avec un Mageius",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Le Mageius n'est ni une batterie ni un simple organe magique. Il agit comme conduit, résonateur et mémoire. Il permet à un Humain d'imposer au réel une compréhension suffisamment précise pour devenir magie, tout en conservant des Échos de ceux qui l'ont porté auparavant. Cette quasi-autonomie donne à chaque Mage une relation intime avec quelque chose qui n'est pas tout à fait une seconde personne et certainement pas un outil neutre. Certains Mages perçoivent leur Mageius comme une présence familière, d'autres comme un ensemble d'intuitions, de rêves ou de réflexes intellectuels. Les Échos peuvent transmettre une manière de penser, une peur, un geste, parfois une compréhension que le porteur actuel n'aurait pas pu acquérir seul. Ils ne remplacent cependant ni l'étude ni l'expérience. Recevoir le souvenir d'une solution n'est pas nécessairement comprendre pourquoi elle fonctionne. Cette tension structure la magie de TUC. Le pouvoir ne récompense pas seulement la volonté de produire un effet ; il récompense la compréhension de ce que l'on manipule. La médecine élargit la guérison, la physique enrichit la télékinésie, la chimie transforme l'alchimie, l'histoire et la linguistique donnent des outils aux pratiques qui dépendent de symboles ou de morts. Un Mage qui cesse d'apprendre finit par rencontrer les limites de sa propre bibliothèque mentale."
        }
      ]
    },
    {
      "id": "la-roue-n-est-pas-une-prison",
      "title": "La Roue n'est pas une prison",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les cinq portes de la Roue — Kaharal, Meldir, Elinaeth, Mestherak et Discella — décrivent des affinités et des familles de compréhension. Elles ne sont pas des classes fermées. Un Mage peut commencer avec une sensibilité évidente à une porte puis consacrer des années à apprendre loin de cette première affinité. Ce principe explique la diversité des Loges. Certaines se spécialisent dans une tradition précise parce qu'elles possèdent les maîtres, les archives et les protections adaptées. D'autres valorisent au contraire la circulation entre disciplines. Une Loge n'est pas un gouvernement mondial des Mages : c'est un lieu d'étude, de sécurité, d'autorité locale et souvent de mémoire collective. La Guerre de la Magie a rendu cette fonction de protection particulièrement importante. Les archives ne sont pas seulement des bibliothèques ; elles peuvent contenir des œuvres dangereuses, des noms, des fragments de Mageius et des traces d'expériences dont la répétition serait catastrophique. L'autorité d'une Loge vient autant de ce qu'elle sait empêcher que de ce qu'elle sait enseigner."
        }
      ]
    },
    {
      "id": "la-technologie-comme-nouvelle-matiere-de-magie",
      "title": "La technologie comme nouvelle matière de magie",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Le monde de 2035 offre aux Mages une situation sans précédent. Jamais l'Humanité n'avait produit autant d'objets complexes dont le fonctionnement peut être étudié, modélisé et compris. Pour certaines traditions, la technologie est donc moins un adversaire qu'une bibliothèque nouvelle. Un moteur, un réseau, une interface neuronale ou un matériau de synthèse deviennent des structures que la magie peut aborder dès lors que le Mage en comprend réellement les principes. Cela ne signifie pas qu'un sort puisse remplacer gratuitement toute ingénierie. Plus le système est complexe, plus l'ignorance devient dangereuse. La magie n'offre pas une permission de sauter les étapes intellectuelles ; elle rend les étapes utiles d'une manière que la science profane n'avait jamais envisagée. Cette proximité explique aussi la méfiance réciproque entre certains Mages et technomages. Les uns improvisent à partir d'une compréhension personnelle du réel ; les autres construisent des procédures qui font coopérer science et transgression magique dans un dispositif reproductible. Les résultats peuvent se ressembler tout en reposant sur des philosophies profondément différentes."
        }
      ]
    },
    {
      "id": "uvres-personnelles-et-familles-de-pratique",
      "title": "Œuvres personnelles et familles de pratique",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Mages les plus marquants laissent rarement seulement une liste de sorts. Ils laissent des Œuvres : solutions, formes, méthodes, constructions qui portent leur manière propre de comprendre la magie. Certaines deviennent des Magies familiales transmises à des descendants ou à des élèves, parfois modifiées pendant des générations. Cette transmission donne à la magie une histoire humaine. Deux Mages capables d'obtenir un résultat comparable peuvent le faire par des raisonnements totalement différents, et cette différence compte lorsque l'effet rencontre une limite imprévue. Connaître l'Œuvre de quelqu'un, c'est parfois connaître sa manière de penser. En 2035, un Mage n'est donc pas seulement un être capable d'imposer sa volonté. C'est quelqu'un dont l'éducation transforme littéralement l'étendue de ce que cette volonté peut accomplir."
        }
      ]
    },
    {
      "id": "les-cinq-portes-de-la-roue-comme-cultures-de-pensee",
      "title": "Les cinq portes de la Roue comme cultures de pensée",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Kaharal, Meldir, Elinaeth, Mestherak et Discella ne sont pas cinq professions ni cinq classes fermées. Ils décrivent les grandes affinités par lesquelles un Mageius entre plus naturellement en résonance avec la Roue. Un Mage peut étudier loin de sa porte d'origine ; il le fera simplement sans la même familiarité initiale. Cette possibilité a des conséquences culturelles. Les Loges ne peuvent pas réduire un élève à son affinité sans gaspiller une partie de son potentiel. Les traditions sérieuses enseignent donc d'abord une manière de raisonner : identifier ce qui est réellement manipulé, distinguer une analogie d'une propriété et savoir quand un effet exige une compréhension que le Mage ne possède pas encore. Les rivalités entre portes viennent moins d'une incompatibilité magique que de façons différentes de poser les problèmes. Deux Mages peuvent obtenir des résultats proches en décrivant la même situation par des chemins intellectuels opposés. Ce désaccord peut devenir fécond dans une équipe ou produire des querelles doctrinales de plusieurs générations dans une Loge."
        }
      ]
    },
    {
      "id": "la-loge-maison-d-etude-et-puissance-locale",
      "title": "La Loge, maison d'étude et puissance locale",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Une Loge est rarement seulement une école. Elle accumule des bibliothèques, des lieux sûrs, des objets, des dettes et surtout des Mages capables de reconnaître les conséquences d'une erreur occulte. Dans un territoire où aucune autorité mondiale des Mages n'existe, cette concentration produit naturellement une forme de pouvoir local. Certaines Loges deviennent protectrices : elles surveillent des lieux dangereux, transmettent des méthodes et interviennent lorsqu'un phénomène menace la population. D'autres deviennent aristocratiques, familiales, académiques ou presque corporatives. Une Loge peut être bienveillante envers son quartier et impitoyable envers un rival. Le mot décrit une structure de continuité, pas une morale. La Guerre de la Magie a laissé une méfiance durable envers les organisations qui prétendent posséder la seule manière légitime d'employer la Roue. Les Voyageurs, les lignées dispersées et les survivants de traditions détruites ont transmis l'idée qu'aucune institution ne devrait pouvoir décider seule quels savoirs ont le droit d'exister. Cette mémoire explique la résistance à toute tentative de gouvernement magique global."
        }
      ]
    },
    {
      "id": "echos-heriter-sans-consentement-total",
      "title": "Échos : hériter sans consentement total",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Le Mageius conserve des traces de porteurs précédents. Un Écho peut être une technique, une intuition, une sensation ou une structure mentale assez complète pour guider le Mage actuel. Cette transmission est précieuse parce qu'elle traverse des destructions d'archives auxquelles aucun livre n'aurait survécu. Elle peut aussi être inconfortable. Un Écho n'a pas été écrit pour un lecteur futur ; il vient d'une personne qui a vécu, aimé, eu peur et parfois commis des erreurs. Le porteur actuel peut recevoir un réflexe dont il désapprouve la source ou une compréhension liée à une époque dont les catégories n'existent plus. Les Mages apprennent donc à distinguer mémoire et autorité. Le fait qu'un ancien porteur ait réussi quelque chose ne prouve pas qu'il avait raison sur le monde, seulement qu'il a laissé une trace suffisamment forte pour survivre."
        }
      ]
    },
    {
      "id": "la-technologie-comme-nouvel-alphabet-magique",
      "title": "La technologie comme nouvel alphabet magique",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "La révolution technologique de 2030 a bouleversé l'étude magique moins parce qu'elle a produit des machines plus puissantes que parce qu'elle a multiplié les systèmes que l'on peut réellement comprendre. Réseaux, implants, matériaux biosynthétiques, neurointerfaces et architectures autonomes offrent aux Mages des objets dont les propriétés n'existaient pas dans les bibliothèques des siècles précédents. Un Mage moderne peut donc être dangereux dans un laboratoire pour des raisons que ses ancêtres auraient eu du mal à imaginer. Comprendre un protocole, une chaîne de capteurs ou la chimie d'un matériau devient une manière d'élargir ce que la Magie peut viser avec précision. La frontière entre « savoir profane » et « savoir magique » n'a jamais été aussi artificielle. Cette évolution inquiète les traditionalistes mais ne rend pas leurs connaissances obsolètes. Les anciens textes décrivent des principes, des erreurs et des catastrophes que la nouveauté technique ne supprime pas. Le Mage de 2035 a simplement accès à une bibliothèque beaucoup plus grande - et donc à beaucoup plus de façons de se tromper."
        }
      ]
    }
  ],
  "r1": [
    {
      "id": "architecture-du-mage",
      "title": "Architecture du Mage",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Le Mage est un humain lié à un Mageius, structure magique quasi autonome servant de conduit entre sa volonté et la Magie. Un Mageius peut théoriquement apprendre à exploiter les quinze domaines de la Roue, mais son Type détermine ses affinités naturelles et les chemins de progression les plus faciles. Affinité = ce que je peux manipuler. Maîtrise = à quel point je peux le manipuler avec finesse. Amplitude = à quelle échelle je peux l’imposer au monde. • Nature Mage : Vision du Voile, Perception magique, Protection du Mageius, Défense occulte et capacité innée de Volonté supérieure. • Type de Mageius : Kaharal, Meldir, Elinaeth, Mestherak ou Discella. • Affinité dominante : première langue magique du Mage, plus naturellement résonnante. • Maîtrise : Initiale Affinée Supérieure → → → Magistrale. Elle donne des permissions qualitatives, pas un simple bonus chiffré. • Amplitude : Mineure Significative Majeure → → → Cataclysmique. Mythique reste hors progression PJ. • Techniques : usages particuliers appris ; elles n’annulent jamais les limites générales sans le dire explicitement. • Œuvre personnelle : sort signature inventé par un Mage arrivé à maturité magique. • Magie familiale : Œuvre personnelle transmise et devenue tradition. • Écho du Mageius : technique laissée par un ancien porteur dans la mémoire du Mageius."
        }
      ]
    },
    {
      "id": "etats-de-revelation",
      "title": "États de Révélation",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Voilé (V) Aspect: Humain ordinaire sous l’Hologramme. • Modifications: Aucune modification. Accès magique: Pas de lancement direct par le Mageius. Semi-Révélé (SR) Aspect: Toujours physiquement humain ; le Mageius affleure. • Modifications: +1 Esprit, +1 Volonté. Accès magique: Vision du Voile, Perception magique, Protection du Mageius. Amplitude maximale : Mineure. Révélé (R) Aspect: Peut rester parfaitement humain d’apparence ; le Mageius est pleinement ouvert. • Modifications: +1 Esprit, +2 Volonté (remplace les bonus SR). Accès magique: Toute Affinité, Maîtrise et Amplitude réellement acquises. La Révélation d’un Mage n’est pas forcément spectaculaire. Un Mage peut donc rester Révélé très longtemps s’il accepte les risques sociaux et métaphysiques liés au Voile. Certains Mages très anciens ou arrogants n’éprouvent aucune raison de refermer leur Mageius tant que personne ne peut les contraindre à le faire. Passer V SR R suit les règles générales de → → Révélation de TUC : 1 PA sous pression, sans jet sauf opposition active. Un passage direct V R est → possible. Le marqueur d’état reste externe à la fiche."
        }
      ]
    },
    {
      "id": "mageius-et-roue-magique",
      "title": "Mageius et Roue magique",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les quinze domaines sont répartis en cinq groupes naturels. Le Type du Mageius ne rend pas les autres domaines impossibles : il détermine le point d’entrée du Mage dans la Roue et le coût de la traversée vers des familles magiques étrangères. Kaharal Nature: Matière, forme, monde physique Affinités natives: Architétramancie • Morphomancie • Alchimie Meldir Nature: Ordre, restauration, lumière Affinités natives: Photomancie • Acratomancie • Médéomancie Elinaeth Nature: Forces, information, continuum Affinités natives: Télékinésie • Divination • Chronomancie Mestherak Nature: Âme, mort, essence vitale Affinités natives: Spectromancie • Hématomancie • Nécromancie Discella Nature: Ombre, illusion, malédiction Affinités natives: Skiamancie • Pseudomancie • Pathomancie Roue : Kaharal Meldir Elinaeth Mestherak ↔ ↔ ↔ ↔ ↔ Discella Kaharal Un Kaharal reste un Kaharal même s’il apprend la Chronomancie. Il n’a pas changé de Mageius : il a appris à faire résonner son Mageius avec une portion éloignée de la Roue."
        }
      ]
    },
    {
      "id": "progression-par-points-de-verite",
      "title": "Progression par Points de Vérité",
      "level": 2,
      "blocks": []
    },
    {
      "id": "affinite-dominante",
      "title": "Affinité dominante",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": ": première langue magique du Mage, plus naturellement résonnante. •"
        }
      ]
    },
    {
      "id": "maitrise",
      "title": "Maîtrise",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Initiale est le niveau de base : effet direct et simple, un phénomène évident. Les niveaux Affinée, Supérieure et Magistrale sont achetés en PTV depuis le catalogue canonique du Builder."
        },
        {
          "type": "p",
          "text": "{{Talents|group=mage:progression-par-points-de-verite-maitrise}}"
        },
        {
          "type": "p",
          "text": "Mythique reste hors progression PJ. Les coûts sont cumulatifs : atteindre Magistrale depuis Initiale représente 1 + 2 + 3 = 6 PTV."
        }
      ]
    },
    {
      "id": "amplitude",
      "title": "Amplitude",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Mineure est l'Amplitude de base : un individu, un objet ou une petite manifestation. Les niveaux Significative, Majeure et Cataclysmique sont achetés en PTV depuis le catalogue canonique du Builder."
        },
        {
          "type": "p",
          "text": "{{Talents|group=mage:progression-par-points-de-verite-amplitude}}"
        },
        {
          "type": "p",
          "text": "Mythique reste hors progression PJ et correspond à l'échelle ville/région et au-delà. Les coûts sont cumulatifs : atteindre Cataclysmique depuis Mineure représente 1 + 2 + 3 = 6 PTV."
        }
      ]
    },
    {
      "id": "affinites-supplementaires",
      "title": "Affinités supplémentaires",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Éveiller une deuxième Affinité native coûte 1 PTV et exige d’avoir déjà progressé au moins une fois dans la première Affinité. Éveiller la troisième coûte également 1 PTV et exige une nouvelle progression dans une Affinité native. Accord adjacent — 3 PTV : prérequis, au moins une Affinité native à Maîtrise Supérieure. Le Mage ouvre une Affinité d’un Mageius adjacent en Initiale / Mineure. Les deux autres domaines de ce Type peuvent ensuite être éveillés pour 1 PTV chacun, avec la même logique de progression. Traversée de la Roue — 2 PTV : prérequis, avoir établi un Accord avec le Mageius intermédiaire. Le Mage ouvre une Affinité du Type éloigné en Initiale / Mineure. Ainsi, atteindre une première Affinité à deux segments de son Mageius natal coûte 5 PTV au total. Il n’existe pas de limite théorique au nombre d’Affinités qu’un Mage peut apprendre. En pratique, Maîtrise, Amplitude, Techniques et traversées coûtent suffisamment de PTV pour qu’un PJ se spécialise naturellement ; les monstres de plusieurs millénaires peuvent, eux, avoir parcouru une grande partie de la Roue."
        }
      ]
    },
    {
      "id": "construire-et-lancer-un-sort",
      "title": "Construire et lancer un sort",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Jet de magie : Volonté + Maîtrise spirituelle + 1d10e Le Mage ne choisit pas un sort dans une liste. Il décrit ce qu’il veut imposer à la Réalité puis fixe les paramètres suivants : Affinité intention/"
        }
      ]
    },
    {
      "id": "essence",
      "title": "Essence",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "→ →"
        }
      ]
    },
    {
      "id": "polarite",
      "title": "Polarité",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Amplitude portée. La Maîtrise doit → → rendre l’effet concevable ; l’Amplitude doit rendre son échelle possible. Essence Essence Fonction Destructive Endommager, briser, consumer. Reconstructive Réparer, guérir, restaurer. Créative Façonner, produire ou ajouter une fonction. Invocative Faire venir une entité ou chose qui préexiste ailleurs. Restrictive Neutraliser, diminuer ou empêcher une fonction. Invasive Créer un flux, transfert ou influence entre le Mage et une cible. L’Essence sert à clarifier l’intention ; elle n’ajoute pas à elle seule un modificateur mathématique. Polarité Polarité Cible Endo Le Mage lui-même. Exo Une cible identifiée. Stato Un lieu, un point ou une zone indépendamment de ce qui s’y trouve."
        }
      ]
    },
    {
      "id": "difficulte-pa-et-tension-par-amplitude",
      "title": "Difficulté, PA et Tension par Amplitude",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Insignifiante Difficulté de base: Automatique hors pression • PA de base: 0 / 1 si enjeu tactique Tension à la libération: +0 Mineure Difficulté de base: 15 • PA de base: 1 Tension à la libération: +1 Significative Difficulté de base: 18 • PA de base: 2 Tension à la libération: +2 Majeure Difficulté de base: 21 • PA de base: 3 Tension à la libération: +3 Cataclysmique Difficulté de base: 25 • PA de base: 4 Tension à la libération: +4 Mythique Difficulté de base: Inaccessible aux PJ • PA de base: — Tension à la libération: — La difficulté dépend de l’Amplitude réellement utilisée, pas du maximum possédé. Pour chaque palier d’Amplitude possédé au-dessus de l’effet utilisé, la difficulté descend d’un niveau sur l’échelle 25 21 18 15 12. Si le Mage possède au moins → → → → deux paliers d’avance, l’effet devient automatique uniquement lorsqu’il n’existe ni opposition, ni urgence, ni difficulté réelle de contexte."
        }
      ]
    },
    {
      "id": "portee",
      "title": "Portée",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Portée Règle Endo / Contact Difficulté 1 niveau. − Portée de Volonté Volonté × 5 mètres ; difficulté normale. À vue Difficulté +1 niveau. Hors vue / éloignée Nécessite un lien, un ancrage, un rituel, une Technique, un Écho ou une Magie personnelle qui l’autorise. Une difficulté ne dépasse pas 25. Si la portée ou un autre facteur devrait la pousser au-delà, chaque niveau excédentaire impose au moins 1 PA de Canalisation avant même que le sort puisse être tenté. Cette Canalisation obligatoire ramène d’abord le sort à 25."
        }
      ]
    },
    {
      "id": "principe-de-designation-et-role-des-savoirs",
      "title": "Principe de désignation et rôle des Savoirs",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "La magie n’agit pas sur les mots employés par le joueur. Elle agit sur ce que le Mage est réellement capable d’identifier. Pour manipuler quelque chose, le Mage doit pouvoir se représenter et désigner sa cible de façon suffisante. Voir une personne permet de viser cette personne ; voir sa main permet de viser cette main ; voir du sang exposé permet de viser ce sang. En revanche, connaître le mot « cervelet » ne permet pas de sélectionner automatiquement un cervelet caché derrière un crâne. • Visibilité : voir directement une cible ou une partie de cible est la méthode la plus simple de désignation. • Connaissance : une cible technique, anatomique, chimique, historique ou symbolique exige que le Mage comprenne réellement ce qu’il cherche à manipuler. • Localisation : même connue, une structure invisible doit pouvoir être localisée par un moyen crédible : perception spécialisée, connaissance clinique précise, retour magique, imagerie, lien, Sceau, Technique ou Magie personnelle. • Compétences profanes : Savoirs, Soin, Perception, Investigation, Langages & Argot ou autres Compétences pertinentes peuvent servir de permission fictionnelle. On ne fait un jet séparé que lorsque l’expertise elle-même est incertaine et importante. Maîtrise magique = « est-ce que je sais modeler cet effet ? » Savoir profane = « est-ce que je comprends suffisamment ce que j’essaie de modeler ? » Cette règle empêche les exécutions absurdes par simple formulation (« je pince son artériole cérébrale ») tout en récompensant les Mages cultivés. Un chirurgien Morphomancien, un chimiste Alchimiste ou un historien Divinateur deviennent terrifiants précisément parce qu’ils savent de quoi ils parlent."
        }
      ]
    },
    {
      "id": "defenses-et-degats-magiques",
      "title": "Défenses et dégâts magiques",
      "level": 2,
      "blocks": []
    },
    {
      "id": "defense-occulte",
      "title": "Défense occulte",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "et capacité innée de Volonté supérieure. • Type de Mageius : Kaharal, Meldir, Elinaeth, Mestherak ou Discella. • Affinité dominante : première langue magique du Mage, plus naturellement résonnante. • Maîtrise : Initiale Affinée Supérieure → → → Magistrale. Elle donne des permissions qualitatives, pas un simple bonus chiffré. • Amplitude : Mineure Significative Majeure → → → Cataclysmique. Mythique reste hors progression PJ. • Techniques : usages particuliers appris ; elles n’annulent jamais les limites générales sans le dire explicitement. • Œuvre personnelle : sort signature inventé par un Mage arrivé à maturité magique. • Magie familiale : Œuvre personnelle transmise et devenue tradition. • Écho du Mageius : technique laissée par un ancien porteur dans la mémoire du Mageius. États de Révélation Voilé (V) Aspect: Humain ordinaire sous l’Hologramme. • Modifications: Aucune modification. Accès magique: Pas de lancement direct par le Mageius. Semi-Révélé (SR) Aspect: Toujours physiquement humain ; le Mageius affleure. • Modifications: +1 Esprit, +1 Volonté. Accès magique: Vision du Voile, Perception magique, Protection du Mageius. Amplitude maximale : Mineure. Révélé (R) Aspect: Peut rester parfaitement humain d’apparence ; le Mageius est pleinement ouvert. • Modifications: +1 Esprit, +2 Volonté (remplace les bonus SR). Accès magique: Toute Affinité, Maîtrise et Amplitude réellement acquises. La Révélation d’un Mage n’est pas forcément spectaculaire. Un Mage peut donc rester Révélé très longtemps s’il accepte les risques sociaux et métaphysiques liés au Voile. Certains Mages très anciens ou arrogants n’éprouvent aucune raison de refermer leur Mageius tant que personne ne peut les contraindre à le faire."
        },
        {
          "type": "p",
          "text": "Passer V SR R suit les règles générales de → → Révélation de TUC : 1 PA sous pression, sans jet sauf opposition active. Un passage direct V R est → possible. Le marqueur d’état reste externe à la fiche. Mageius et Roue magique Les quinze domaines sont répartis en cinq groupes naturels. Le Type du Mageius ne rend pas les autres domaines impossibles : il détermine le point d’entrée du Mage dans la Roue et le coût de la traversée vers des familles magiques étrangères. Kaharal Nature: Matière, forme, monde physique Affinités natives: Architétramancie • Morphomancie • Alchimie Meldir Nature: Ordre, restauration, lumière Affinités natives: Photomancie • Acratomancie • Médéomancie Elinaeth Nature: Forces, information, continuum Affinités natives: Télékinésie • Divination • Chronomancie Mestherak Nature: Âme, mort, essence vitale Affinités natives: Spectromancie • Hématomancie • Nécromancie Discella Nature: Ombre, illusion, malédiction Affinités natives: Skiamancie • Pseudomancie • Pathomancie Roue : Kaharal Meldir Elinaeth Mestherak ↔ ↔ ↔ ↔ ↔ Discella Kaharal Un Kaharal reste un Kaharal même s’il apprend la Chronomancie. Il n’a pas changé de Mageius : il a appris à faire résonner son Mageius avec une portion éloignée de la Roue. Progression par Points de Vérité Affinité dominante À l’éveil, le Mage choisit une Affinité native de son Mageius. Elle commence gratuitement à Maîtrise Initiale / Amplitude Mineure. Résonance dominante — 1 fois par scène, le Mage peut relancer le 1d10e d’un sort de son Affinité dominante et conserver le second résultat. Maîtrise Initiale Coût: Base Permission générale: Effet direct et simple ; un phénomène évident."
        },
        {
          "type": "p",
          "text": "Affinée Coût: 1 PTV Permission générale: Précision élevée, formes complexes, division simple d’un effet. Supérieure Coût: 2 PTV Permission générale: Plusieurs paramètres simultanés, effets indirects, comportements élaborés. Magistrale Coût: 3 PTV Permission générale: Exploitation extrême du concept ; ouvre l’accès à une Œuvre personnelle. Mythique Coût: — Permission générale: Hors progression PJ. Les coûts sont cumulatifs : atteindre Magistrale depuis Initiale représente 1 + 2 + 3 = 6 PTV. Amplitude Mineure Coût: Base Échelle indicative: Un individu, un objet, une petite manifestation. Significative Coût: 1 PTV Échelle indicative: Petit groupe, véhicule, pièce, effet de combat conséquent. Majeure Coût: 2 PTV Échelle indicative: Bâtiment, grande zone, phénomène surnaturel considérable. Cataclysmique Coût: 3 PTV Échelle indicative: Quartier, vaste terrain, événement historique local. Mythique Coût: — Échelle indicative: Ville/région et au-delà : hors progression PJ. Les coûts sont cumulatifs : atteindre Cataclysmique depuis Mineure représente 1 + 2 + 3 = 6 PTV. Affinités supplémentaires Éveiller une deuxième Affinité native coûte 1 PTV et exige d’avoir déjà progressé au moins une fois dans la première Affinité. Éveiller la troisième coûte également 1 PTV et exige une nouvelle progression dans une Affinité native. Accord adjacent — 3 PTV : prérequis, au moins une Affinité native à Maîtrise Supérieure. Le Mage ouvre une Affinité d’un Mageius adjacent en Initiale / Mineure. Les deux autres domaines de ce Type peuvent ensuite être éveillés pour 1 PTV chacun, avec la même logique de progression. Traversée de la Roue — 2 PTV : prérequis, avoir établi un Accord avec le Mageius intermédiaire."
        },
        {
          "type": "p",
          "text": "Le Mage ouvre une Affinité du Type éloigné en Initiale / Mineure. Ainsi, atteindre une première Affinité à deux segments de son Mageius natal coûte 5 PTV au total. Il n’existe pas de limite théorique au nombre d’Affinités qu’un Mage peut apprendre. En pratique, Maîtrise, Amplitude, Techniques et traversées coûtent suffisamment de PTV pour qu’un PJ se spécialise naturellement ; les monstres de plusieurs millénaires peuvent, eux, avoir parcouru une grande partie de la Roue. Construire et lancer un sort Jet de magie : Volonté + Maîtrise spirituelle + 1d10e Le Mage ne choisit pas un sort dans une liste. Il décrit ce qu’il veut imposer à la Réalité puis fixe les paramètres suivants : Affinité intention/Essence → → Polarité Amplitude portée. La Maîtrise doit → → rendre l’effet concevable ; l’Amplitude doit rendre son échelle possible. Essence Essence Fonction Destructive Endommager, briser, consumer. Reconstructive Réparer, guérir, restaurer. Créative Façonner, produire ou ajouter une fonction. Invocative Faire venir une entité ou chose qui préexiste ailleurs. Restrictive Neutraliser, diminuer ou empêcher une fonction. Invasive Créer un flux, transfert ou influence entre le Mage et une cible. L’Essence sert à clarifier l’intention ; elle n’ajoute pas à elle seule un modificateur mathématique. Polarité Polarité Cible Endo Le Mage lui-même. Exo Une cible identifiée. Stato Un lieu, un point ou une zone indépendamment de ce qui s’y trouve."
        },
        {
          "type": "p",
          "text": "Difficulté, PA et Tension par Amplitude Insignifiante Difficulté de base: Automatique hors pression • PA de base: 0 / 1 si enjeu tactique Tension à la libération: +0 Mineure Difficulté de base: 15 • PA de base: 1 Tension à la libération: +1 Significative Difficulté de base: 18 • PA de base: 2 Tension à la libération: +2 Majeure Difficulté de base: 21 • PA de base: 3 Tension à la libération: +3 Cataclysmique Difficulté de base: 25 • PA de base: 4 Tension à la libération: +4 Mythique Difficulté de base: Inaccessible aux PJ • PA de base: — Tension à la libération: — La difficulté dépend de l’Amplitude réellement utilisée, pas du maximum possédé. Pour chaque palier d’Amplitude possédé au-dessus de l’effet utilisé, la difficulté descend d’un niveau sur l’échelle 25 21 18 15 12. Si le Mage possède au moins → → → → deux paliers d’avance, l’effet devient automatique uniquement lorsqu’il n’existe ni opposition, ni urgence, ni difficulté réelle de contexte. Portée Portée Règle Endo / Contact Difficulté 1 niveau. − Portée de Volonté Volonté × 5 mètres ; difficulté normale. À vue Difficulté +1 niveau. Hors vue / éloignée Nécessite un lien, un ancrage, un rituel, une Technique, un Écho ou une Magie personnelle qui l’autorise. Une difficulté ne dépasse pas 25. Si la portée ou un autre facteur devrait la pousser au-delà, chaque niveau excédentaire impose au moins 1 PA de Canalisation avant même que le sort puisse être tenté. Cette Canalisation obligatoire ramène d’abord le sort à 25. Principe de désignation et rôle des Savoirs La magie n’agit pas sur les mots employés par le joueur. Elle agit sur ce que le Mage est réellement capable d’identifier."
        },
        {
          "type": "p",
          "text": "Pour manipuler quelque chose, le Mage doit pouvoir se représenter et désigner sa cible de façon suffisante. Voir une personne permet de viser cette personne ; voir sa main permet de viser cette main ; voir du sang exposé permet de viser ce sang. En revanche, connaître le mot « cervelet » ne permet pas de sélectionner automatiquement un cervelet caché derrière un crâne. • Visibilité : voir directement une cible ou une partie de cible est la méthode la plus simple de désignation. • Connaissance : une cible technique, anatomique, chimique, historique ou symbolique exige que le Mage comprenne réellement ce qu’il cherche à manipuler. • Localisation : même connue, une structure invisible doit pouvoir être localisée par un moyen crédible : perception spécialisée, connaissance clinique précise, retour magique, imagerie, lien, Sceau, Technique ou Magie personnelle. • Compétences profanes : Savoirs, Soin, Perception, Investigation, Langages & Argot ou autres Compétences pertinentes peuvent servir de permission fictionnelle. On ne fait un jet séparé que lorsque l’expertise elle-même est incertaine et importante. Maîtrise magique = « est-ce que je sais modeler cet effet ? » Savoir profane = « est-ce que je comprends suffisamment ce que j’essaie de modeler ? » Cette règle empêche les exécutions absurdes par simple formulation (« je pince son artériole cérébrale ») tout en récompensant les Mages cultivés. Un chirurgien Morphomancien, un chimiste Alchimiste ou un historien Divinateur deviennent terrifiants précisément parce qu’ils savent de quoi ils parlent."
        },
        {
          "type": "p",
          "text": "Défenses et dégâts magiques Défense occulte Défense occulte passive : Volonté + Force Mentale Défense occulte active : Volonté + Force Mentale + 1d10e — 1 PA La Défense occulte s’applique lorsqu’un effet magique est imposé directement à une personne : malédiction, intrusion mentale, altération interne du corps, manipulation directe du sang contenu dans l’organisme, etc. Une Défense active suppose que la cible puisse percevoir ou comprendre qu’elle est attaquée ; la Défense passive s’applique toujours lorsqu’une résistance est pertinente. Un phénomène devenu physiquement évitable utilise une défense physique : pierre télékinétique, lame de glace, explosion, chute provoquée, etc. On n’utilise jamais simultanément Défense physique et Défense occulte pour la même attaque."
        }
      ]
    },
    {
      "id": "resolution-d-une-attaque-magique",
      "title": "Résolution d’une attaque magique",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Le résultat du Mage doit à la fois atteindre la Difficulté intrinsèque du sort et dépasser la Défense applicable. Une égalité avec la Défense conserve le statu quo : l’attaque n’impose pas son effet. Dégâts magiques = Résultat du lancement Défense − applicable + bonus d’Amplitude Protection − applicable Amplitude offensive Bonus de dégâts Mineure +6 Significative +12 Majeure +18 Cataclysmique +24 La Protection applicable dépend de la nature finale de l’effet : une armure peut réduire une pierre propulsée ou une lame de glace ; elle n’arrête pas une malédiction qui agit directement dans l’organisme. Une protection magique spécifique peut fonctionner lorsque son texte le permet. Zone : un seul jet de lancement est effectué ; chaque cible compare ce résultat à sa propre Défense et reçoit des dégâts calculés individuellement. Une cible consciente et capable de réagir peut payer 1 PA pour une Défense active. Objets : contre un objet non défendu, la Difficulté intrinsèque du sort sert de seuil pour calculer la marge offensive, sauf si une Résistance structurelle supérieure est fixée par le MJ. L’Armure ou la solidité de l’objet s’applique ensuite normalement."
        }
      ]
    },
    {
      "id": "canalisation-maintien-et-sorts-longs",
      "title": "Canalisation, maintien et sorts longs",
      "level": 2,
      "blocks": []
    },
    {
      "id": "canalisation-concentration",
      "title": "Canalisation / Concentration",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Chaque PA supplémentaire investi avant la résolution réduit la Difficulté intrinsèque du sort d’un niveau, minimum 12. La Canalisation échange du temps contre de la fiabilité. Elle ne réduit ni la Défense d’une cible ni la Tension produite par le sort. Un Cataclysmique de base coûte 4 PA pour difficulté 25 ; avec 2 PA de Canalisation il coûte 6 PA et tombe à difficulté 18. Pour un Mage à 2 PA, cela peut représenter trois rounds entiers consacrés au même sort."
        }
      ]
    },
    {
      "id": "preparation-sur-plusieurs-rounds",
      "title": "Préparation sur plusieurs rounds",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Un sort de 2 PA ou plus peut être payé sur plusieurs rounds consécutifs. Le Mage peut effectuer d’autres actions compatibles avec sa concentration entre les PA investis. Une interruption significative — grosse blessure, projection, effet mental, tentative volontaire d’interruption — peut imposer Volonté + Force Mentale. En cas d’échec, les PA déjà investis sont perdus. La Tension est ajoutée lorsque le sort est effectivement libéré, qu’il réussisse ou échoue. Un sort interrompu avant sa libération ne produit normalement pas sa Tension complète ; le MJ peut néanmoins appliquer +1 Tension en cas de surcharge narrative manifeste."
        }
      ]
    },
    {
      "id": "maintien-et-permanence",
      "title": "Maintien et permanence",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Effet maintenu : 1 PA par round, sans nouveau jet d’activation automatique. Un phénomène qui existe ensuite par lui-même ne nécessite pas de maintien : feu réellement allumé, métal réellement remodelé, plaie réellement guérie. Un phénomène qui dépend d’un flux continu — lévitation, champ de force, accélération temporelle, hallucination active — exige un maintien. Une formulation comme « pour toujours » ne rend jamais gratuitement un effet permanent. Une durée hostile ou une permanence surnaturelle importante augmente l’Amplitude, la complexité, nécessite un ancrage ou relève d’une Technique/Magie personnelle."
        }
      ]
    },
    {
      "id": "une-fonction-principale",
      "title": "Une fonction principale",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Un sort générique possède une fonction mécanique principale. Une boule de feu ne gagne pas gratuitement dégâts + aveuglement + repoussement + destruction d’armure + mur persistant. Une Maîtrise élevée permet des comportements complexes, mais chaque fonction distincte doit être justifiée par la Maîtrise, l’Amplitude ou une Technique explicite."
        }
      ]
    }
  ],
  "r2": [
    {
      "id": "tension-revers-et-dormance",
      "title": "Tension, Revers et Dormance",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Le Mageius ne fonctionne pas comme une réserve de mana. Il supporte une certaine pression puis commence à protester. La Tension mesure l’insistance du Mage et la quantité de magie qu’il force à travers son conduit."
        }
      ]
    },
    {
      "id": "monter-et-reduire-la-tension",
      "title": "Monter et réduire la Tension",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Événement Variation Sort Insignifiant +0 Sort Mineur +1 Sort Significatif +2 Sort Majeur +3 Sort Cataclysmique +4 Changer d’Affinité −1 Tension avant d’ajouter la Tension du nouveau sort. Événement Variation Un round complet sans utiliser le Mageius −1 Tension. Quelques minutes de véritable calme hors scène Le MJ peut ramener progressivement la Tension à 0. Changer de domaine soulage le Mageius sans le remettre miraculeusement à neuf. C’est l’une des raisons pour lesquelles les jeunes Mages apprennent à alterner leurs Affinités."
        }
      ]
    },
    {
      "id": "test-de-revers",
      "title": "Test de Revers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Aucun test n’est nécessaire tant que la Tension reste à 0–2. Dès qu’un sort fait atteindre ou augmenter une Tension de 3 ou plus, le sort est résolu puis le Mage teste : Volonté + Force Mentale + 1d10e Tension après le sort Difficulté de Revers 3 12 4 15 5 18 6 21 7+ 25"
        }
      ]
    },
    {
      "id": "consequences-du-revers",
      "title": "Conséquences du Revers",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Revers — Tension 3–4 Contrecoup immédiat: 3 PV irréductibles. Maintiens/concentrations cessent. PA restants du round perdus. Dormance: Environ 2 jours. Revers sévère — Tension 5–6 Contrecoup immédiat: 5 PV irréductibles. Le Mage est hagard et n’agit plus jusqu’à la fin de son prochain round ; Défense passive seulement. Dormance: Environ 3 jours. Revers catastrophique — Tension 7+ ou échec narratif Contrecoup immédiat: 7 PV irréductibles. Le Mage s’effondre généralement inconscient ; s’il reste conscient, il est au minimum hors d’état d’agir normalement pour la scène. Dormance: Environ 3 à 5 jours, selon violence. La Dormance est le cœur de la peur du Revers. Le Mageius s’endort réellement : aucun sort, aucune Affinité, aucune Magie personnelle/familiale, aucune Protection du Mageius et aucune Perception magique provenant du Mageius. Le Mage conserve son corps, ses Attributs, Compétences, équipements et relations, mais surnaturellement il redevient presque un humain ordinaire. Dormir huit heures, prendre des stimulants ou réussir un bon jet ne réveille pas un Mageius en Dormance. Seuls des procédés extraordinairement rares et spécifiquement capables d’agir sur un Mageius pourraient raccourcir cette période."
        }
      ]
    },
    {
      "id": "capacites-et-talents-communs",
      "title": "Capacités et Talents communs",
      "level": 2,
      "blocks": []
    },
    {
      "id": "capacites-gratuites",
      "title": "Capacités gratuites",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Vision à travers le Voile — SR/R : le Mage voit normalement les créatures et phénomènes accessibles à un observateur de son niveau de Révélation, conformément aux règles générales du Voile. Perception magique — SR/R : Esprit + Perception lorsque l’information est incertaine. Permet de ressentir nœuds, zones, enchantements, traces ou présences magiques, y compris lorsqu’elles ne sont pas pleinement révélées. Ne donne pas automatiquement leur Nature, leur histoire ou leur fonctionnement exact. Protection du Mageius — SR/R : +3 à la Défense occulte passive ou active contre les effets surnaturels agissant directement sur le Mage. Ne protège pas contre une conséquence devenue purement physique. Disparaît totalement pendant la Dormance. Canalisation — SR/R : action universelle décrite au §8 ; aucun Talent requis."
        }
      ]
    },
    {
      "id": "volonte-superieure-capacite-innee",
      "title": "Volonté supérieure — capacité innée",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Tout Mage peut forcer son Mageius au-delà de ses limites. Aucun achat en PTV n’est requis. Avant de commencer un sort, le Mage peut augmenter pour ce sort seulement sa Maîtrise d’un palier, son Amplitude d’un palier, ou les deux si l’effet déclaré exige réellement les deux dépassements. Il ne peut jamais atteindre Mythique par ce moyen et ne peut pas improviser une Affinité qu’il ne possède pas. Le sort utilise ensuite sa vraie difficulté, ses vrais PA, sa portée, sa Canalisation et sa Tension correspondant au niveau forcé. Après résolution, réussite ou échec : Revers catastrophique automatique. Aucun test de Revers ne peut l’éviter. Volonté supérieure est le bouton « Revers ou mort ». Les Mages savent qu’il existe ; ils font tout pour ne jamais avoir à l’utiliser."
        }
      ]
    },
    {
      "id": "talents-communs",
      "title": "Talents communs",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Les Talents communs du Mage sont alimentés directement par le catalogue canonique du Builder ; coûts, accès, prérequis, effet et lore mécanique ne sont pas recopiés ici."
        },
        {
          "type": "p",
          "text": "{{Talents|group=mage:capacites-et-talents-communs-talents-communs}}"
        }
      ]
    },
    {
      "id": "echos-uvres-personnelles-et-magies-familiales",
      "title": "Échos, Œuvres personnelles et Magies familiales",
      "level": 2,
      "blocks": []
    },
    {
      "id": "echo-du-mageius",
      "title": "Écho du Mageius",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": ": technique laissée par un ancien porteur dans la mémoire du Mageius. États de Révélation Voilé (V) Aspect: Humain ordinaire sous l’Hologramme. • Modifications: Aucune modification. Accès magique: Pas de lancement direct par le Mageius. Semi-Révélé (SR) Aspect: Toujours physiquement humain ; le Mageius affleure. • Modifications: +1 Esprit, +1 Volonté. Accès magique: Vision du Voile, Perception magique, Protection du Mageius. Amplitude maximale : Mineure. Révélé (R) Aspect: Peut rester parfaitement humain d’apparence ; le Mageius est pleinement ouvert. • Modifications: +1 Esprit, +2 Volonté (remplace les bonus SR). Accès magique: Toute Affinité, Maîtrise et Amplitude réellement acquises. La Révélation d’un Mage n’est pas forcément spectaculaire. Un Mage peut donc rester Révélé très longtemps s’il accepte les risques sociaux et métaphysiques liés au Voile. Certains Mages très anciens ou arrogants n’éprouvent aucune raison de refermer leur Mageius tant que personne ne peut les contraindre à le faire. Passer V SR R suit les règles générales de → → Révélation de TUC : 1 PA sous pression, sans jet sauf opposition active. Un passage direct V R est → possible. Le marqueur d’état reste externe à la fiche. Mageius et Roue magique Les quinze domaines sont répartis en cinq groupes naturels. Le Type du Mageius ne rend pas les autres domaines impossibles : il détermine le point d’entrée du Mage dans la Roue et le coût de la traversée vers des familles magiques étrangères."
        },
        {
          "type": "p",
          "text": "Kaharal Nature: Matière, forme, monde physique Affinités natives: Architétramancie • Morphomancie • Alchimie Meldir Nature: Ordre, restauration, lumière Affinités natives: Photomancie • Acratomancie • Médéomancie Elinaeth Nature: Forces, information, continuum Affinités natives: Télékinésie • Divination • Chronomancie Mestherak Nature: Âme, mort, essence vitale Affinités natives: Spectromancie • Hématomancie • Nécromancie Discella Nature: Ombre, illusion, malédiction Affinités natives: Skiamancie • Pseudomancie • Pathomancie Roue : Kaharal Meldir Elinaeth Mestherak ↔ ↔ ↔ ↔ ↔ Discella Kaharal Un Kaharal reste un Kaharal même s’il apprend la Chronomancie. Il n’a pas changé de Mageius : il a appris à faire résonner son Mageius avec une portion éloignée de la Roue. Progression par Points de Vérité Affinité dominante À l’éveil, le Mage choisit une Affinité native de son Mageius. Elle commence gratuitement à Maîtrise Initiale / Amplitude Mineure. Résonance dominante — 1 fois par scène, le Mage peut relancer le 1d10e d’un sort de son Affinité dominante et conserver le second résultat. Maîtrise Initiale Coût: Base Permission générale: Effet direct et simple ; un phénomène évident. Affinée Coût: 1 PTV Permission générale: Précision élevée, formes complexes, division simple d’un effet. Supérieure Coût: 2 PTV Permission générale: Plusieurs paramètres simultanés, effets indirects, comportements élaborés. Magistrale Coût: 3 PTV Permission générale: Exploitation extrême du concept ; ouvre l’accès à une"
        }
      ]
    },
    {
      "id": "uvre-personnelle",
      "title": "Œuvre personnelle",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "puis, si elle est transmise, une"
        }
      ]
    },
    {
      "id": "magie-familiale",
      "title": "Magie familiale",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": ". Chez les Mages, une famille peut donc être une généalogie d’idées autant qu’une lignée de sang. Les Loges Les Mages se regroupent en Loges qui servent à la fois d’écoles, de refuges, d’autorités et de réseaux de transmission. Elles coopèrent sans former un gouvernement mondial cohérent. Leur organisation valorise fortement la maîtrise et l’enseignement : apprentis, Singularis, Tutors, Referrers, Magisters et quelques figures hors norme structurent un milieu où le savoir est à la fois prestige et moyen de survie. La naissance de la Grande Californie a provoqué une crise très concrète parmi elles. Les anciennes juridictions américaines et mexicaines ne correspondaient plus au territoire politique, ouvrant un conflit entre Los Angeles et Tijuana pour le contrôle de la nouvelle organisation régionale. Los Angeles l’emporta, mais les affrontements affaiblirent durablement la communauté magique locale. Puissance et Revers Un Mageius peut être forcé. Plus un Mage pousse de puissance au-delà de ce qu’il maîtrise confortablement, plus il augmente le risque d’un Revers et d’une Dormance qui peut fermer son accès à la Magie pendant plusieurs jours. Les plus expérimentés ne sont donc pas ceux qui forcent systématiquement davantage, mais ceux qui savent exactement quand le prix d’un échec justifie de risquer de perdre leur propre magie. Les Mages en 2035 La modernité a rendu le savoir plus accessible que jamais. Imagerie médicale, bases scientifiques, modélisation, capteurs et bibliothèques numériques donnent aux Mages des moyens d’étude que leurs prédécesseurs auraient considérés comme miraculeux."
        },
        {
          "type": "p",
          "text": "La technologie ne concurrence pas nécessairement la Magie : elle produit de nouveaux phénomènes à comprendre et de nouvelles manières de vérifier ce que l’on croit savoir. Elle augmente aussi l’échelle des erreurs. Une faute qui aurait autrefois brûlé une pièce peut désormais perturber un réseau automatisé, un laboratoire ou une infrastructure urbaine. Le Mage contemporain possède davantage de connaissances que presque tous ses prédécesseurs ; il possède donc aussi davantage de manières de se tromper. Vivre avec un Mageius Le Mageius n'est ni une batterie ni un simple organe magique. Il agit comme conduit, résonateur et mémoire. Il permet à un Humain d'imposer au réel une compréhension suffisamment précise pour devenir magie, tout en conservant des Échos de ceux qui l'ont porté auparavant. Cette quasi-autonomie donne à chaque Mage une relation intime avec quelque chose qui n'est pas tout à fait une seconde personne et certainement pas un outil neutre. Certains Mages perçoivent leur Mageius comme une présence familière, d'autres comme un ensemble d'intuitions, de rêves ou de réflexes intellectuels. Les Échos peuvent transmettre une manière de penser, une peur, un geste, parfois une compréhension que le porteur actuel n'aurait pas pu acquérir seul. Ils ne remplacent cependant ni l'étude ni l'expérience. Recevoir le souvenir d'une solution n'est pas nécessairement comprendre pourquoi elle fonctionne. Cette tension structure la magie de TUC. Le pouvoir ne récompense pas seulement la volonté de produire un effet ; il récompense la compréhension de ce que l'on manipule."
        },
        {
          "type": "p",
          "text": "La médecine élargit la guérison, la physique enrichit la télékinésie, la chimie transforme l'alchimie, l'histoire et la linguistique donnent des outils aux pratiques qui dépendent de symboles ou de morts. Un Mage qui cesse d'apprendre finit par rencontrer les limites de sa propre bibliothèque mentale. La Roue n'est pas une prison Les cinq portes de la Roue — Kaharal, Meldir, Elinaeth, Mestherak et Discella — décrivent des affinités et des familles de compréhension. Elles ne sont pas des classes fermées. Un Mage peut commencer avec une sensibilité évidente à une porte puis consacrer des années à apprendre loin de cette première affinité. Ce principe explique la diversité des Loges. Certaines se spécialisent dans une tradition précise parce qu'elles possèdent les maîtres, les archives et les protections adaptées. D'autres valorisent au contraire la circulation entre disciplines. Une Loge n'est pas un gouvernement mondial des Mages : c'est un lieu d'étude, de sécurité, d'autorité locale et souvent de mémoire collective. La Guerre de la Magie a rendu cette fonction de protection particulièrement importante. Les archives ne sont pas seulement des bibliothèques ; elles peuvent contenir des œuvres dangereuses, des noms, des fragments de Mageius et des traces d'expériences dont la répétition serait catastrophique. L'autorité d'une Loge vient autant de ce qu'elle sait empêcher que de ce qu'elle sait enseigner. La technologie comme nouvelle matière de magie Le monde de 2035 offre aux Mages une situation sans précédent. Jamais l'Humanité n'avait produit autant d'objets complexes dont le fonctionnement peut être étudié, modélisé et compris."
        },
        {
          "type": "p",
          "text": "Pour certaines traditions, la technologie est donc moins un adversaire qu'une bibliothèque nouvelle. Un moteur, un réseau, une interface neuronale ou un matériau de synthèse deviennent des structures que la magie peut aborder dès lors que le Mage en comprend réellement les principes. Cela ne signifie pas qu'un sort puisse remplacer gratuitement toute ingénierie. Plus le système est complexe, plus l'ignorance devient dangereuse. La magie n'offre pas une permission de sauter les étapes intellectuelles ; elle rend les étapes utiles d'une manière que la science profane n'avait jamais envisagée. Cette proximité explique aussi la méfiance réciproque entre certains Mages et technomages. Les uns improvisent à partir d'une compréhension personnelle du réel ; les autres construisent des procédures qui font coopérer science et transgression magique dans un dispositif reproductible. Les résultats peuvent se ressembler tout en reposant sur des philosophies profondément différentes. Œuvres personnelles et familles de pratique Les Mages les plus marquants laissent rarement seulement une liste de sorts. Ils laissent des Œuvres : solutions, formes, méthodes, constructions qui portent leur manière propre de comprendre la magie. Certaines deviennent des Magies familiales transmises à des descendants ou à des élèves, parfois modifiées pendant des générations. Cette transmission donne à la magie une histoire humaine. Deux Mages capables d'obtenir un résultat comparable peuvent le faire par des raisonnements totalement différents, et cette différence compte lorsque l'effet rencontre une limite imprévue. Connaître l'Œuvre de quelqu'un, c'est parfois connaître sa manière de penser."
        },
        {
          "type": "p",
          "text": "En 2035, un Mage n'est donc pas seulement un être capable d'imposer sa volonté. C'est quelqu'un dont l'éducation transforme littéralement l'étendue de ce que cette volonté peut accomplir. Les cinq portes de la Roue comme cultures de pensée Kaharal, Meldir, Elinaeth, Mestherak et Discella ne sont pas cinq professions ni cinq classes fermées. Ils décrivent les grandes affinités par lesquelles un Mageius entre plus naturellement en résonance avec la Roue. Un Mage peut étudier loin de sa porte d'origine ; il le fera simplement sans la même familiarité initiale. Cette possibilité a des conséquences culturelles. Les Loges ne peuvent pas réduire un élève à son affinité sans gaspiller une partie de son potentiel. Les traditions sérieuses enseignent donc d'abord une manière de raisonner : identifier ce qui est réellement manipulé, distinguer une analogie d'une propriété et savoir quand un effet exige une compréhension que le Mage ne possède pas encore. Les rivalités entre portes viennent moins d'une incompatibilité magique que de façons différentes de poser les problèmes. Deux Mages peuvent obtenir des résultats proches en décrivant la même situation par des chemins intellectuels opposés. Ce désaccord peut devenir fécond dans une équipe ou produire des querelles doctrinales de plusieurs générations dans une Loge. La Loge, maison d'étude et puissance locale Une Loge est rarement seulement une école. Elle accumule des bibliothèques, des lieux sûrs, des objets, des dettes et surtout des Mages capables de reconnaître les conséquences d'une erreur occulte. Dans un territoire où aucune autorité mondiale des Mages n'existe, cette concentration produit naturellement une forme de pouvoir local."
        },
        {
          "type": "p",
          "text": "Certaines Loges deviennent protectrices : elles surveillent des lieux dangereux, transmettent des méthodes et interviennent lorsqu'un phénomène menace la population. D'autres deviennent aristocratiques, familiales, académiques ou presque corporatives. Une Loge peut être bienveillante envers son quartier et impitoyable envers un rival. Le mot décrit une structure de continuité, pas une morale. La Guerre de la Magie a laissé une méfiance durable envers les organisations qui prétendent posséder la seule manière légitime d'employer la Roue. Les Voyageurs, les lignées dispersées et les survivants de traditions détruites ont transmis l'idée qu'aucune institution ne devrait pouvoir décider seule quels savoirs ont le droit d'exister. Cette mémoire explique la résistance à toute tentative de gouvernement magique global. Échos : hériter sans consentement total Le Mageius conserve des traces de porteurs précédents. Un Écho peut être une technique, une intuition, une sensation ou une structure mentale assez complète pour guider le Mage actuel. Cette transmission est précieuse parce qu'elle traverse des destructions d'archives auxquelles aucun livre n'aurait survécu. Elle peut aussi être inconfortable. Un Écho n'a pas été écrit pour un lecteur futur ; il vient d'une personne qui a vécu, aimé, eu peur et parfois commis des erreurs. Le porteur actuel peut recevoir un réflexe dont il désapprouve la source ou une compréhension liée à une époque dont les catégories n'existent plus. Les Mages apprennent donc à distinguer mémoire et autorité. Le fait qu'un ancien porteur ait réussi quelque chose ne prouve pas qu'il avait raison sur le monde, seulement qu'il a laissé une trace suffisamment forte pour survivre."
        },
        {
          "type": "p",
          "text": "La technologie comme nouvel alphabet magique La révolution technologique de 2030 a bouleversé l'étude magique moins parce qu'elle a produit des machines plus puissantes que parce qu'elle a multiplié les systèmes que l'on peut réellement comprendre. Réseaux, implants, matériaux biosynthétiques, neurointerfaces et architectures autonomes offrent aux Mages des objets dont les propriétés n'existaient pas dans les bibliothèques des siècles précédents. Un Mage moderne peut donc être dangereux dans un laboratoire pour des raisons que ses ancêtres auraient eu du mal à imaginer. Comprendre un protocole, une chaîne de capteurs ou la chimie d'un matériau devient une manière d'élargir ce que la Magie peut viser avec précision. La frontière entre « savoir profane » et « savoir magique » n'a jamais été aussi artificielle. Cette évolution inquiète les traditionalistes mais ne rend pas leurs connaissances obsolètes. Les anciens textes décrivent des principes, des erreurs et des catastrophes que la nouveauté technique ne supprime pas. Le Mage de 2035 a simplement accès à une bibliothèque beaucoup plus grande - et donc à beaucoup plus de façons de se tromper. Architecture du Mage Le Mage est un humain lié à un Mageius, structure magique quasi autonome servant de conduit entre sa volonté et la Magie. Un Mageius peut théoriquement apprendre à exploiter les quinze domaines de la Roue, mais son Type détermine ses affinités naturelles et les chemins de progression les plus faciles. Affinité = ce que je peux manipuler. Maîtrise = à quel point je peux le manipuler avec finesse. Amplitude = à quelle échelle je peux l’imposer au monde."
        },
        {
          "type": "p",
          "text": "• Nature Mage : Vision du Voile, Perception magique, Protection du Mageius, Défense occulte et capacité innée de Volonté supérieure. • Type de Mageius : Kaharal, Meldir, Elinaeth, Mestherak ou Discella. • Affinité dominante : première langue magique du Mage, plus naturellement résonnante. • Maîtrise : Initiale Affinée Supérieure → → → Magistrale. Elle donne des permissions qualitatives, pas un simple bonus chiffré. • Amplitude : Mineure Significative Majeure → → → Cataclysmique. Mythique reste hors progression PJ. • Techniques : usages particuliers appris ; elles n’annulent jamais les limites générales sans le dire explicitement. • Œuvre personnelle : sort signature inventé par un Mage arrivé à maturité magique. • Magie familiale : Œuvre personnelle transmise et devenue tradition. • Écho du Mageius : technique laissée par un ancien porteur dans la mémoire du Mageius. États de Révélation Voilé (V) Aspect: Humain ordinaire sous l’Hologramme. • Modifications: Aucune modification. Accès magique: Pas de lancement direct par le Mageius. Semi-Révélé (SR) Aspect: Toujours physiquement humain ; le Mageius affleure. • Modifications: +1 Esprit, +1 Volonté. Accès magique: Vision du Voile, Perception magique, Protection du Mageius. Amplitude maximale : Mineure. Révélé (R) Aspect: Peut rester parfaitement humain d’apparence ; le Mageius est pleinement ouvert. • Modifications: +1 Esprit, +2 Volonté (remplace les bonus SR). Accès magique: Toute Affinité, Maîtrise et Amplitude réellement acquises. La Révélation d’un Mage n’est pas forcément spectaculaire. Un Mage peut donc rester Révélé très longtemps s’il accepte les risques sociaux et métaphysiques liés au Voile."
        },
        {
          "type": "p",
          "text": "Certains Mages très anciens ou arrogants n’éprouvent aucune raison de refermer leur Mageius tant que personne ne peut les contraindre à le faire. Passer V SR R suit les règles générales de → → Révélation de TUC : 1 PA sous pression, sans jet sauf opposition active. Un passage direct V R est → possible. Le marqueur d’état reste externe à la fiche. Mageius et Roue magique Les quinze domaines sont répartis en cinq groupes naturels. Le Type du Mageius ne rend pas les autres domaines impossibles : il détermine le point d’entrée du Mage dans la Roue et le coût de la traversée vers des familles magiques étrangères. Kaharal Nature: Matière, forme, monde physique Affinités natives: Architétramancie • Morphomancie • Alchimie Meldir Nature: Ordre, restauration, lumière Affinités natives: Photomancie • Acratomancie • Médéomancie Elinaeth Nature: Forces, information, continuum Affinités natives: Télékinésie • Divination • Chronomancie Mestherak Nature: Âme, mort, essence vitale Affinités natives: Spectromancie • Hématomancie • Nécromancie Discella Nature: Ombre, illusion, malédiction Affinités natives: Skiamancie • Pseudomancie • Pathomancie Roue : Kaharal Meldir Elinaeth Mestherak ↔ ↔ ↔ ↔ ↔ Discella Kaharal Un Kaharal reste un Kaharal même s’il apprend la Chronomancie. Il n’a pas changé de Mageius : il a appris à faire résonner son Mageius avec une portion éloignée de la Roue. Progression par Points de Vérité Affinité dominante À l’éveil, le Mage choisit une Affinité native de son Mageius. Elle commence gratuitement à Maîtrise Initiale / Amplitude Mineure. Résonance dominante — 1 fois par scène, le Mage peut relancer le 1d10e d’un sort de son Affinité dominante et conserver le second résultat."
        },
        {
          "type": "p",
          "text": "Maîtrise Initiale Coût: Base Permission générale: Effet direct et simple ; un phénomène évident. Affinée Coût: 1 PTV Permission générale: Précision élevée, formes complexes, division simple d’un effet. Supérieure Coût: 2 PTV Permission générale: Plusieurs paramètres simultanés, effets indirects, comportements élaborés. Magistrale Coût: 3 PTV Permission générale: Exploitation extrême du concept ; ouvre l’accès à une Œuvre personnelle. Mythique Coût: — Permission générale: Hors progression PJ. Les coûts sont cumulatifs : atteindre Magistrale depuis Initiale représente 1 + 2 + 3 = 6 PTV. Amplitude Mineure Coût: Base Échelle indicative: Un individu, un objet, une petite manifestation. Significative Coût: 1 PTV Échelle indicative: Petit groupe, véhicule, pièce, effet de combat conséquent. Majeure Coût: 2 PTV Échelle indicative: Bâtiment, grande zone, phénomène surnaturel considérable. Cataclysmique Coût: 3 PTV Échelle indicative: Quartier, vaste terrain, événement historique local. Mythique Coût: — Échelle indicative: Ville/région et au-delà : hors progression PJ. Les coûts sont cumulatifs : atteindre Cataclysmique depuis Mineure représente 1 + 2 + 3 = 6 PTV. Affinités supplémentaires Éveiller une deuxième Affinité native coûte 1 PTV et exige d’avoir déjà progressé au moins une fois dans la première Affinité. Éveiller la troisième coûte également 1 PTV et exige une nouvelle progression dans une Affinité native. Accord adjacent — 3 PTV : prérequis, au moins une Affinité native à Maîtrise Supérieure. Le Mage ouvre une Affinité d’un Mageius adjacent en Initiale / Mineure. Les deux autres domaines de ce Type peuvent ensuite être éveillés pour 1 PTV chacun, avec la même logique de progression."
        },
        {
          "type": "p",
          "text": "Traversée de la Roue — 2 PTV : prérequis, avoir établi un Accord avec le Mageius intermédiaire. Le Mage ouvre une Affinité du Type éloigné en Initiale / Mineure. Ainsi, atteindre une première Affinité à deux segments de son Mageius natal coûte 5 PTV au total. Il n’existe pas de limite théorique au nombre d’Affinités qu’un Mage peut apprendre. En pratique, Maîtrise, Amplitude, Techniques et traversées coûtent suffisamment de PTV pour qu’un PJ se spécialise naturellement ; les monstres de plusieurs millénaires peuvent, eux, avoir parcouru une grande partie de la Roue. Construire et lancer un sort Jet de magie : Volonté + Maîtrise spirituelle + 1d10e Le Mage ne choisit pas un sort dans une liste. Il décrit ce qu’il veut imposer à la Réalité puis fixe les paramètres suivants : Affinité intention/Essence → → Polarité Amplitude portée. La Maîtrise doit → → rendre l’effet concevable ; l’Amplitude doit rendre son échelle possible. Essence Essence Fonction Destructive Endommager, briser, consumer. Reconstructive Réparer, guérir, restaurer. Créative Façonner, produire ou ajouter une fonction. Invocative Faire venir une entité ou chose qui préexiste ailleurs. Restrictive Neutraliser, diminuer ou empêcher une fonction. Invasive Créer un flux, transfert ou influence entre le Mage et une cible. L’Essence sert à clarifier l’intention ; elle n’ajoute pas à elle seule un modificateur mathématique. Polarité Polarité Cible Endo Le Mage lui-même. Exo Une cible identifiée. Stato Un lieu, un point ou une zone indépendamment de ce qui s’y trouve."
        },
        {
          "type": "p",
          "text": "Difficulté, PA et Tension par Amplitude Insignifiante Difficulté de base: Automatique hors pression • PA de base: 0 / 1 si enjeu tactique Tension à la libération: +0 Mineure Difficulté de base: 15 • PA de base: 1 Tension à la libération: +1 Significative Difficulté de base: 18 • PA de base: 2 Tension à la libération: +2 Majeure Difficulté de base: 21 • PA de base: 3 Tension à la libération: +3 Cataclysmique Difficulté de base: 25 • PA de base: 4 Tension à la libération: +4 Mythique Difficulté de base: Inaccessible aux PJ • PA de base: — Tension à la libération: — La difficulté dépend de l’Amplitude réellement utilisée, pas du maximum possédé. Pour chaque palier d’Amplitude possédé au-dessus de l’effet utilisé, la difficulté descend d’un niveau sur l’échelle 25 21 18 15 12. Si le Mage possède au moins → → → → deux paliers d’avance, l’effet devient automatique uniquement lorsqu’il n’existe ni opposition, ni urgence, ni difficulté réelle de contexte. Portée Portée Règle Endo / Contact Difficulté 1 niveau. − Portée de Volonté Volonté × 5 mètres ; difficulté normale. À vue Difficulté +1 niveau. Hors vue / éloignée Nécessite un lien, un ancrage, un rituel, une Technique, un Écho ou une Magie personnelle qui l’autorise. Une difficulté ne dépasse pas 25. Si la portée ou un autre facteur devrait la pousser au-delà, chaque niveau excédentaire impose au moins 1 PA de Canalisation avant même que le sort puisse être tenté. Cette Canalisation obligatoire ramène d’abord le sort à 25. Principe de désignation et rôle des Savoirs La magie n’agit pas sur les mots employés par le joueur. Elle agit sur ce que le Mage est réellement capable d’identifier."
        },
        {
          "type": "p",
          "text": "Pour manipuler quelque chose, le Mage doit pouvoir se représenter et désigner sa cible de façon suffisante. Voir une personne permet de viser cette personne ; voir sa main permet de viser cette main ; voir du sang exposé permet de viser ce sang. En revanche, connaître le mot « cervelet » ne permet pas de sélectionner automatiquement un cervelet caché derrière un crâne. • Visibilité : voir directement une cible ou une partie de cible est la méthode la plus simple de désignation. • Connaissance : une cible technique, anatomique, chimique, historique ou symbolique exige que le Mage comprenne réellement ce qu’il cherche à manipuler. • Localisation : même connue, une structure invisible doit pouvoir être localisée par un moyen crédible : perception spécialisée, connaissance clinique précise, retour magique, imagerie, lien, Sceau, Technique ou Magie personnelle. • Compétences profanes : Savoirs, Soin, Perception, Investigation, Langages & Argot ou autres Compétences pertinentes peuvent servir de permission fictionnelle. On ne fait un jet séparé que lorsque l’expertise elle-même est incertaine et importante. Maîtrise magique = « est-ce que je sais modeler cet effet ? » Savoir profane = « est-ce que je comprends suffisamment ce que j’essaie de modeler ? » Cette règle empêche les exécutions absurdes par simple formulation (« je pince son artériole cérébrale ») tout en récompensant les Mages cultivés. Un chirurgien Morphomancien, un chimiste Alchimiste ou un historien Divinateur deviennent terrifiants précisément parce qu’ils savent de quoi ils parlent."
        },
        {
          "type": "p",
          "text": "Défenses et dégâts magiques Défense occulte Défense occulte passive : Volonté + Force Mentale Défense occulte active : Volonté + Force Mentale + 1d10e — 1 PA La Défense occulte s’applique lorsqu’un effet magique est imposé directement à une personne : malédiction, intrusion mentale, altération interne du corps, manipulation directe du sang contenu dans l’organisme, etc. Une Défense active suppose que la cible puisse percevoir ou comprendre qu’elle est attaquée ; la Défense passive s’applique toujours lorsqu’une résistance est pertinente. Un phénomène devenu physiquement évitable utilise une défense physique : pierre télékinétique, lame de glace, explosion, chute provoquée, etc. On n’utilise jamais simultanément Défense physique et Défense occulte pour la même attaque. Résolution d’une attaque magique Le résultat du Mage doit à la fois atteindre la Difficulté intrinsèque du sort et dépasser la Défense applicable. Une égalité avec la Défense conserve le statu quo : l’attaque n’impose pas son effet. Dégâts magiques = Résultat du lancement Défense − applicable + bonus d’Amplitude Protection − applicable Amplitude offensive Bonus de dégâts Mineure +6 Significative +12 Majeure +18 Cataclysmique +24 La Protection applicable dépend de la nature finale de l’effet : une armure peut réduire une pierre propulsée ou une lame de glace ; elle n’arrête pas une malédiction qui agit directement dans l’organisme. Une protection magique spécifique peut fonctionner lorsque son texte le permet. Zone : un seul jet de lancement est effectué ; chaque cible compare ce résultat à sa propre Défense et reçoit des dégâts calculés individuellement. Une cible consciente et capable de réagir peut payer 1 PA pour une Défense active."
        },
        {
          "type": "p",
          "text": "Objets : contre un objet non défendu, la Difficulté intrinsèque du sort sert de seuil pour calculer la marge offensive, sauf si une Résistance structurelle supérieure est fixée par le MJ. L’Armure ou la solidité de l’objet s’applique ensuite normalement. Canalisation, maintien et sorts longs Canalisation / Concentration Chaque PA supplémentaire investi avant la résolution réduit la Difficulté intrinsèque du sort d’un niveau, minimum 12. La Canalisation échange du temps contre de la fiabilité. Elle ne réduit ni la Défense d’une cible ni la Tension produite par le sort. Un Cataclysmique de base coûte 4 PA pour difficulté 25 ; avec 2 PA de Canalisation il coûte 6 PA et tombe à difficulté 18. Pour un Mage à 2 PA, cela peut représenter trois rounds entiers consacrés au même sort. Préparation sur plusieurs rounds Un sort de 2 PA ou plus peut être payé sur plusieurs rounds consécutifs. Le Mage peut effectuer d’autres actions compatibles avec sa concentration entre les PA investis. Une interruption significative — grosse blessure, projection, effet mental, tentative volontaire d’interruption — peut imposer Volonté + Force Mentale. En cas d’échec, les PA déjà investis sont perdus. La Tension est ajoutée lorsque le sort est effectivement libéré, qu’il réussisse ou échoue. Un sort interrompu avant sa libération ne produit normalement pas sa Tension complète ; le MJ peut néanmoins appliquer +1 Tension en cas de surcharge narrative manifeste. Maintien et permanence Effet maintenu : 1 PA par round, sans nouveau jet d’activation automatique. Un phénomène qui existe ensuite par lui-même ne nécessite pas de maintien : feu réellement allumé, métal réellement remodelé, plaie réellement guérie."
        },
        {
          "type": "p",
          "text": "Un phénomène qui dépend d’un flux continu — lévitation, champ de force, accélération temporelle, hallucination active — exige un maintien. Une formulation comme « pour toujours » ne rend jamais gratuitement un effet permanent. Une durée hostile ou une permanence surnaturelle importante augmente l’Amplitude, la complexité, nécessite un ancrage ou relève d’une Technique/Magie personnelle. Une fonction principale Un sort générique possède une fonction mécanique principale. Une boule de feu ne gagne pas gratuitement dégâts + aveuglement + repoussement + destruction d’armure + mur persistant. Une Maîtrise élevée permet des comportements complexes, mais chaque fonction distincte doit être justifiée par la Maîtrise, l’Amplitude ou une Technique explicite. Tension, Revers et Dormance Le Mageius ne fonctionne pas comme une réserve de mana. Il supporte une certaine pression puis commence à protester. La Tension mesure l’insistance du Mage et la quantité de magie qu’il force à travers son conduit. Monter et réduire la Tension Événement Variation Sort Insignifiant +0 Sort Mineur +1 Sort Significatif +2 Sort Majeur +3 Sort Cataclysmique +4 Changer d’Affinité −1 Tension avant d’ajouter la Tension du nouveau sort. Événement Variation Un round complet sans utiliser le Mageius −1 Tension. Quelques minutes de véritable calme hors scène Le MJ peut ramener progressivement la Tension à 0. Changer de domaine soulage le Mageius sans le remettre miraculeusement à neuf. C’est l’une des raisons pour lesquelles les jeunes Mages apprennent à alterner leurs Affinités. Test de Revers Aucun test n’est nécessaire tant que la Tension reste à 0–2."
        },
        {
          "type": "p",
          "text": "Dès qu’un sort fait atteindre ou augmenter une Tension de 3 ou plus, le sort est résolu puis le Mage teste : Volonté + Force Mentale + 1d10e Tension après le sort Difficulté de Revers 3 12 4 15 5 18 6 21 7+ 25 Conséquences du Revers Revers — Tension 3–4 Contrecoup immédiat: 3 PV irréductibles. Maintiens/concentrations cessent. PA restants du round perdus. Dormance: Environ 2 jours. Revers sévère — Tension 5–6 Contrecoup immédiat: 5 PV irréductibles. Le Mage est hagard et n’agit plus jusqu’à la fin de son prochain round ; Défense passive seulement. Dormance: Environ 3 jours. Revers catastrophique — Tension 7+ ou échec narratif Contrecoup immédiat: 7 PV irréductibles. Le Mage s’effondre généralement inconscient ; s’il reste conscient, il est au minimum hors d’état d’agir normalement pour la scène. Dormance: Environ 3 à 5 jours, selon violence. La Dormance est le cœur de la peur du Revers. Le Mageius s’endort réellement : aucun sort, aucune Affinité, aucune Magie personnelle/familiale, aucune Protection du Mageius et aucune Perception magique provenant du Mageius. Le Mage conserve son corps, ses Attributs, Compétences, équipements et relations, mais surnaturellement il redevient presque un humain ordinaire. Dormir huit heures, prendre des stimulants ou réussir un bon jet ne réveille pas un Mageius en Dormance. Seuls des procédés extraordinairement rares et spécifiquement capables d’agir sur un Mageius pourraient raccourcir cette période. Capacités et Talents communs Capacités gratuites Vision à travers le Voile — SR/R : le Mage voit normalement les créatures et phénomènes accessibles à un observateur de son niveau de Révélation, conformément aux règles générales du Voile."
        },
        {
          "type": "p",
          "text": "Perception magique — SR/R : Esprit + Perception lorsque l’information est incertaine. Permet de ressentir nœuds, zones, enchantements, traces ou présences magiques, y compris lorsqu’elles ne sont pas pleinement révélées. Ne donne pas automatiquement leur Nature, leur histoire ou leur fonctionnement exact. Protection du Mageius — SR/R : +3 à la Défense occulte passive ou active contre les effets surnaturels agissant directement sur le Mage. Ne protège pas contre une conséquence devenue purement physique. Disparaît totalement pendant la Dormance. Canalisation — SR/R : action universelle décrite au §8 ; aucun Talent requis. Volonté supérieure — capacité innée Tout Mage peut forcer son Mageius au-delà de ses limites. Aucun achat en PTV n’est requis. Avant de commencer un sort, le Mage peut augmenter pour ce sort seulement sa Maîtrise d’un palier, son Amplitude d’un palier, ou les deux si l’effet déclaré exige réellement les deux dépassements. Il ne peut jamais atteindre Mythique par ce moyen et ne peut pas improviser une Affinité qu’il ne possède pas. Le sort utilise ensuite sa vraie difficulté, ses vrais PA, sa portée, sa Canalisation et sa Tension correspondant au niveau forcé. Après résolution, réussite ou échec : Revers catastrophique automatique. Aucun test de Revers ne peut l’éviter. Volonté supérieure est le bouton « Revers ou mort ». Les Mages savent qu’il existe ; ils font tout pour ne jamais avoir à l’utiliser. Talents communs Équilibrage du Flux Coût: 1 PTV SR/R. La première fois par round que le Mage change d’Affinité, la Tension baisse de 2 au lieu de 1 avant l’ajout du nouveau sort. Décharge contrôlée Coût: 1 PTV SR/R. 1 PA, Volonté + Maîtrise spirituelle, difficulté 15. Réussite : 1 Tension."
        },
        {
          "type": "p",
          "text": "Une seule fois par round. Échec − narratif : +1 Tension. Ancrage du Mageius Coût: 1 PTV SR/R. +3 pour résister aux effets visant spécifiquement à sceller, corrompre, arracher, déplacer ou désolidariser le Mageius. Résonance héritée Coût: 2 PTV SR/R. Déverrouille un Écho magique gravé dans le Mageius par un ancien porteur ; voir §11. Œuvre personnelle Coût: 3 PTV R. Prérequis : Maîtrise Magistrale + Amplitude Majeure dans l’Affinité principale et développement narratif. Permet de créer une technique signature. Héritage familial Coût: 2 PTV R. Permet d’apprendre une Magie familiale transmise, avec les prérequis de Maîtrise/Amplitude fixés par cette tradition. Échos, Œuvres personnelles et Magies familiales Écho du Mageius Un Mageius peut conserver le sort de prédilection d’un ancien porteur comme une habitude gravée dans sa structure. Résonance héritée déverrouille un Écho précis défini avec le MJ, généralement après une découverte narrative sur l’histoire du Mageius. • Pour cet effet exact, la Difficulté est réduite d’un niveau, minimum 12. • Si le Mage ne possède pas encore l’Affinité correspondante, il peut néanmoins reproduire l’Écho exact en Initiale / Mineure, sans en déduire d’autres usages du domaine. • S’il apprend ensuite l’Affinité, l’Écho peut être utilisé jusqu’à sa propre Maîtrise et Amplitude. Œuvre personnelle L’Œuvre personnelle marque le passage d’un Mage compétent à un véritable maître. Le joueur ne choisit pas un pouvoir standard : il invente avec le MJ une technique qui découle de ses Affinités et de son savoir mais possède une règle spéciale propre."
        },
        {
          "type": "p",
          "text": "Une Œuvre personnelle peut briser une règle générale de la magie, mais doit être définie par une idée forte et identifiable — jamais « tous mes sorts sont meilleurs ». Elle peut par exemple contourner une limite de désignation, réduire un coût en PA pour un sort signature, créer une portée normalement impossible, fusionner deux domaines, permettre une permanence particulière, modifier la défense applicable ou exploiter une structure que la magie générique ne sait pas cibler. Magie familiale Une Magie personnelle devient familiale lorsqu’elle est transmise. Le fondateur a dû inventer la méthode ; ses descendants ou disciples bénéficient d’un enseignement déjà structuré. Une famille peut donc transmettre un sort extrêmement sophistiqué sans que tous ses membres soient capables de l’utiliser : posséder le nom ou le sang ne remplace jamais les prérequis magiques. Une Magie familiale peut combiner plusieurs domaines si la tradition l’exige. Un héritier dont le Mageius natal n’est pas naturellement adapté doit malgré tout ouvrir les Affinités nécessaires par la Roue ou accepter les restrictions spécifiques prévues par la tradition."
        }
      ]
    }
  ],
  "r3": [
    {
      "id": "quinze-domaines",
      "title": "Les cinq portes et les quinze domaines",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Architétramancie — magie des éléments L’Architétramancie manifeste et manipule des phénomènes élémentaires : feu, eau, air, terre, glace, foudre, vibrations et autres orientations cohérentes avec la tradition du Mage. À l’éveil, le Mage choisit au moins une orientation élémentaire qu’il connaît réellement ; élargir son répertoire demande entraînement, progression ou Technique. Maîtrise Ce qu’elle autorise Initiale Créer, déplacer, intensifier ou diminuer un phénomène simple. Affinée Formes précises, plusieurs manifestations simples, sélection partielle des zones touchées. Maîtrise Ce qu’elle autorise Supérieure Pression, température, propagation, courants, gradients et interactions complexes. Magistrale Exploitation profonde d’un principe élémentaire ; ouvre les spécialisations dignes d’une Magie personnelle. Exemples de sorts (repères, pas une liste fermée) Allumer une torche ou produire une flamme contrôlée. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Pas de défense hors opposition. Projeter une lance de feu sur un adversaire. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense physique si projectile évitable ; DGT magique +6. Créer un mur de flammes fermant une pièce. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Stato ; dégâts à ceux qui le traversent selon effet annoncé. Geler un véhicule ou projeter plusieurs ennemis par une onde d’air. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense physique des cibles affectées. Embraser un bâtiment ou provoquer un séisme destructeur local. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 La finesse de sélection dépend de la Maîtrise."
        },
        {
          "type": "p",
          "text": "Déclencher un séisme ou une tempête affectant un quartier. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Très forte Tension ; Canalisation souvent indispensable. Limites et garde-fous • Une forte Amplitude n’accorde pas automatiquement la finesse nécessaire pour épargner précisément les alliés au cœur d’une vaste zone. • La magie ne donne pas une connaissance scientifique gratuite : exploiter un phénomène subtil exige de comprendre suffisamment ce phénomène. • Les formes extrêmes comme une magie sismique parfaitement contrôlée peuvent devenir des Œuvres personnelles/familiales. Morphomancie — magie du Modelage La Morphomancie modifie la forme, la densité et l’organisation de la matière sans nécessairement changer sa substance. Elle excelle sur le corps vivant, mais toute modification hostile interne doit vaincre la Défense occulte et respecter le Principe de désignation. Maîtrise Ce qu’elle autorise Initiale Modifier simplement forme, densité ou proportions. Affinée Remodelage précis d’anatomie ou de structures complexes. Supérieure Organes fonctionnels, métamorphoses cohérentes, plusieurs systèmes interdépendants. Magistrale Réorganisation radicale tout en conservant un ensemble fonctionnel ; base des grandes métamorphoses personnelles. Exemples de sorts (repères, pas une liste fermée) Modifier temporairement son visage ou ses empreintes. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Endo : difficulté 1 niveau. − Densifier localement ses os ou former des griffes. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Bonus mécanique limité par l’effet annoncé ; maintien si nécessaire. Se métamorphoser en animal fonctionnel."
        },
        {
          "type": "p",
          "text": "Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Endo ; connaissances anatomiques pertinentes. Altérer lourdement le corps d’un adversaire. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense occulte ; pas d’instakill anatomique par simple formulation. Créer une chimère pleinement fonctionnelle ou transformer complètement un autre être. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Défense occulte si hostile ; permanence non gratuite. Transformer simultanément une foule ou remodeler massivement une structure. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 La sélection fine des victimes exige une très haute Maîtrise. Limites et garde-fous • La Morphomancie ne remplace pas la Médéomancie : fermer mécaniquement une plaie n’efface pas automatiquement les PV perdus. • Une transformation durable et avantageuse ne donne pas gratuitement des augmentations permanentes d’Attributs ; elle relève d’une Technique, d’un maintien ou d’une Œuvre personnelle. • Cibler un organe interne précis exige connaissance + localisation crédible ; le nom de l’organe ne suffit pas. Alchimie — magie des atomes L’Alchimie manipule composition, séparation et recombinaison de la matière. Elle devient d’autant plus redoutable que le Mage possède de vrais savoirs en chimie, matériaux, pharmacologie ou physique. Maîtrise Ce qu’elle autorise Initiale Déplacer, séparer ou concentrer une substance connue. Affinée Recombinaisons chimiques et contrôle précis des réactions. Supérieure Chaînes complexes sans respecter toutes les conditions normales de pression, température ou catalyse."
        },
        {
          "type": "p",
          "text": "Magistrale Manipulation atomique extrêmement fine ; les phénomènes nucléaires restent hors usage générique. Exemples de sorts (repères, pas une liste fermée) Purifier un verre d’eau ou séparer une contamination simple. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Aucun effet inventé sans connaître la substance ciblée. Concentrer un acide ou produire un composé irritant connu. Maîtrise min.: Affinée • Amplitude: Mineure • PA: 1 • Diff. base: 15 Si attaque directe : défense appropriée selon vecteur. Transformer chimiquement le contenu d’un réservoir ou saturer une pièce de gaz. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Stato possible ; exposition physique après création. Fragiliser une structure métallique importante. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Objet : difficulté ou résistance structurelle comme seuil. Modifier plusieurs tonnes de matériau ou neutraliser une contamination industrielle. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Exige connaissances réelles des matériaux. Altérer la composition d’une vaste zone environnementale. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Les conséquences secondaires restent réelles. Limites et garde-fous • « Je transforme ça en neurotoxine » exige de connaître ce que le Mage cherche réellement à produire. • Fusion/fission nucléaire, transformation de matière en arme nucléaire et transmutations énergétiques extrêmes sont des Œuvres personnelles/familiales, pas des conséquences automatiques d’Alchimie Magistrale. • La magie ne fournit pas gratuitement les données de laboratoire manquantes."
        },
        {
          "type": "p",
          "text": "Meldir — ordre, lumière et restauration Photomancie — magie de la Lumière La Photomancie contrôle la lumière comme phénomène réel et, aux niveaux élevés, comme principe surnaturel. Elle se distingue de l’illusion : un effet photomantique modifie réellement la lumière présente dans le monde. Maîtrise Ce qu’elle autorise Initiale Créer, réduire, diriger ou intensifier la lumière. Affinée Spectres, réflexion, réfraction et plusieurs trajectoires. Supérieure Constructions lumineuses complexes, focalisation, protections et interactions surnaturelles. Magistrale Lumière utilisée comme principe magique, pas seulement comme illumination. Exemples de sorts (repères, pas une liste fermée) Créer une source lumineuse ou éteindre une zone sombre. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Pas de défense si purement utilitaire. Éblouir une cible ou lancer un faisceau offensif. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense physique si faisceau évitable ; +6 dégâts. Aveugler un groupe ou illuminer intégralement une grande pièce. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense physique/Perception selon l’effet. Créer plusieurs faisceaux indépendants ou un écran lumineux. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Comportement multiple permis par la Maîtrise. Baigner un bâtiment dans une Lumière surnaturelle hostile à certaines entités. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Effets spéciaux dépendent de Techniques appropriées. Créer une manifestation lumineuse majeure à l’échelle d’un quartier. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff."
        },
        {
          "type": "p",
          "text": "base: 25 Très visible ; conséquences sur le Voile évidentes. Limites et garde-fous • Photomancie ne crée pas automatiquement des hallucinations : elle agit sur la lumière réelle. • Une caméra peut normalement enregistrer une modification photomantique si l’Hologramme ne la réécrit pas ensuite. • Les effets sacrés/divins ne sont pas inclus gratuitement : la Lumière magique n’est pas automatiquement une énergie religieuse. Acratomancie — magie des Sceaux L’Acratomancie attache une règle magique à un support, un objet, un emplacement ou une condition. Elle récompense la préparation, la logique et l’anticipation. Maîtrise Ce qu’elle autorise Initiale Un déclencheur, une condition et un effet simples. Affinée Délais, identités, exceptions et plusieurs conditions. Supérieure Réseaux de Sceaux, enchantements élaborés et stockage d’effets. Magistrale Architectures magiques complètes orchestrant plusieurs fonctions. Exemples de sorts (repères, pas une liste fermée) Poser une alarme sur une porte. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Sceau passif, peut durer tant que son ancrage reste intact. Créer une rune qui libère un effet Mineur au contact. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Compte comme Sceau chargé. Protéger une pièce avec un piège sélectif. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Déclenchement selon conditions définies. Stocker temporairement un objet ou un sort dans un Sceau. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 La capacité exacte dépend de la nature du stockage. Sécuriser un bâtiment entier par un réseau de Sceaux. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff."
        },
        {
          "type": "p",
          "text": "base: 21 Peut demander préparation matérielle/temps narratif. Structurer magiquement une zone urbaine par un vaste réseau. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4+ • Diff. base: 25 Rituel long presque obligatoire. Limites et garde-fous • Sceaux chargés actifs simultanément : 1 / 2 / 3 / 4 selon Maîtrise Initiale / Affinée / Supérieure / Magistrale. Les alarmes et marquages passifs ancrés dans un lieu ne comptent pas nécessairement dans cette limite. • La Tension d’un Sceau chargé est payée lors de son inscription/chargement ; son déclenchement ultérieur n’exige pas que le Mageius soit actif. • Préparer une réserve infinie de « grenades magiques » est impossible sans Magie personnelle ou infrastructure spéciale. Médéomancie — magie de Guérison La Médéomancie restaure l’intégrité fonctionnelle d’un être vivant. Les connaissances médicales permettent des soins beaucoup plus précis ; la magie ne remplace pas automatiquement un diagnostic que le Mage ne sait pas faire. Maîtrise Ce qu’elle autorise Initiale Plaies, saignements, stabilisation et traumatismes simples. Maîtrise Ce qu’elle autorise Affinée Fractures, tissus profonds et organes simples. Supérieure Organes complexes, membres, lésions surnaturelles. Magistrale Reconstruction biologique extrême et restauration au-delà de la médecine normale. Exemples de sorts (repères, pas une liste fermée) Stabiliser un Agonisant. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Contact conseillé ; peut être automatique pour un grand Mage hors pression. Refermer des blessures et rendre 1 + DR PV. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Une cible ne peut pas être « farmée » en soins."
        },
        {
          "type": "p",
          "text": "Réparer une blessure grave et rendre 3 + DR PV. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Connaissance médicale utile pour effets précis. Réparer un organe sévèrement endommagé. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Peut exiger Soin/Savoirs comme permission fictionnelle. Reconstruire un membre ou rendre 5 + DR PV à défaut d’effet ciblé. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Permanence naturelle si véritable réparation biologique. Traiter simultanément de nombreuses victimes d’un désastre biologique. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Logistique et diagnostic restent pertinents. Limites et garde-fous • Un organisme ayant récupéré des PV par Médéomancie ne peut plus en récupérer par Médéomancie avant la fin de la scène ou une véritable période de repos. De nouvelles blessures peuvent toujours être stabilisées. • Résurrection véritable : hors magie générique. Elle exige Œuvre personnelle, sacrifices, conditions ou autres exceptions majeures. • Médéomancie restaure ; elle ne remplace pas la Morphomancie pour fabriquer arbitrairement de nouvelles anatomies. Elinaeth — forces, information et continuum Télékinésie — magie des forces La Télékinésie applique forces, pressions et mouvements sans contact. Sa dangerosité dépend énormément de la précision du Mage et de sa compréhension des systèmes qu’il manipule. Maîtrise Ce qu’elle autorise Initiale Pousser, tirer, soulever, maintenir une force simple. Affinée Plusieurs vecteurs et manipulations précises. Supérieure Champs de force, pressions différenciées, mouvements autonomes complexes."
        },
        {
          "type": "p",
          "text": "Magistrale Ingénierie de forces invisibles : armures, lames de pression, architectures dynamiques. Exemples de sorts (repères, pas une liste fermée) Attirer une arme posée ou repousser une personne. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense physique si hostile et évitable. Projeter un objet comme projectile. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense physique ; +6 dégâts avant protection physique. Soulever une voiture ou immobiliser plusieurs personnes. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Vigueur/Athlétisme ou Défense selon la forme de contrainte. Former un écran de pression ou manipuler plusieurs trajectoires. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Maintien si champ persistant. Soutenir une portion de bâtiment ou écraser une structure massive. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Objet : résistance structurelle possible. Déplacer une masse colossale ou exercer une force cohérente sur une vaste zone. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Précision sélective très coûteuse en Maîtrise. Limites et garde-fous • La Télékinésie ne donne pas de vision interne. On ne « télékinèse » pas un cervelet caché sans moyen de désignation approprié. • Un objet projeté est une menace physique : armure et défense physique s’appliquent normalement. • Créer une armure/lame invisible extrêmement efficace peut relever d’une Œuvre personnelle comme spécialisation du domaine. Divination — magie de l’information et des possibles La Divination extrait des informations du présent, des traces, des relations et des futurs possibles."
        },
        {
          "type": "p",
          "text": "Elle ne transforme pas le Mage en narrateur omniscient et ne fournit pas automatiquement des connaissances qu’il ne sait pas formuler. Maîtrise Ce qu’elle autorise Initiale Question immédiate, impression, danger proche, trace simple. Affinée Recherche ciblée, observation éloignée liée, plusieurs futurs proches. Supérieure Ramifications causales, prévisions complexes, analyse stratégique. Magistrale Lecture très large des conséquences, probabilités et relations entre événements. Exemples de sorts (repères, pas une liste fermée) Pressentir un danger immédiat. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Information courte, souvent qualitative. Retrouver une chose proche à partir d’un lien pertinent. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Le lien doit réellement désigner la cible. Observer magiquement un lieu connu ou lié. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Hors vue autorisé si le lien fait partie de l’effet. Comparer plusieurs futurs immédiats avant une opération. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Les décisions futures peuvent invalider une branche. Prévoir les principales issues d’une bataille ou d’un projet majeur. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Informations riches mais non omniscientes. Lire les tendances d’une catastrophe ou d’une guerre à l’échelle urbaine. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Le résultat porte sur tendances, pivots et probabilités. Limites et garde-fous • Le Mage doit poser une question, définir un sujet ou disposer d’un lien. « Dis-moi tout » n’est pas une cible valable."
        },
        {
          "type": "p",
          "text": "• Le futur est probabiliste : les choix de personnes informées de la prophétie peuvent modifier ce qui était le plus probable. • Divination donne un avantage informationnel, pas le scénario du MJ page par page. Chronomancie — magie du temps La Chronomancie modifie l’écoulement local du temps. Les altérations du continuum sont dangereuses ; le voyage physique dans le passé ou le futur dépasse la magie générique des PJ. Maîtrise Ce qu’elle autorise Initiale Accélérer ou ralentir légèrement un processus simple. Affinée Plusieurs rythmes et petites bulles temporelles. Supérieure Accélérations fortes, suspension brève, véritables effets tactiques sur le rythme d’action. Magistrale Altérations très poussées du continuum local, à la frontière de ce qui reste raisonnablement sûr. Exemples de sorts (repères, pas une liste fermée) Ralentir une chute ou accélérer une action non￾combattante. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Effet bref ; maintien si prolongé. Déplacer légèrement l’ordre d’initiative ou ralentir un adversaire. Maîtrise min.: Affinée • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense occulte si imposé directement. Accorder +1 PA/round à une cible. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Maintien 1 PA/round ; ne se cumule pas avec autre Chronomancie identique. Accélérer ou ralentir un petit groupe. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense occulte pour cibles hostiles. Modifier fortement le rythme temporel d’une grande zone. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Les interactions entre intérieur/extérieur peuvent être complexes."
        },
        {
          "type": "p",
          "text": "Placer une portion de quartier dans une altération temporelle majeure. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Risque de conséquences narratives importantes. Limites et garde-fous • +1 PA/round exige au minimum Maîtrise Supérieure + Amplitude Significative. Une cible ne peut gagner plus de +1 PA/round par Chronomancie générique. • Voyage physique dans le passé/futur, réécriture sûre de l’Histoire ou boucle temporelle stable : Œuvres personnelles/NPC exceptionnels. Mestherak — âme, mort et essence vitale Spectromancie — magie spectrale La Spectromancie agit sur les âmes désincarnées, spectres, empreintes spirituelles et formes incorporelles. Elle ne réanime pas la chair et ne remplace pas la Nécromancie. Maîtrise Ce qu’elle autorise Initiale Percevoir, communiquer et toucher magiquement un spectre. Affinée Déplacer, protéger, contraindre ou ancrer une âme. Supérieure Projection de l’âme, possession contrôlée, manipulation de plusieurs spectres. Magistrale Restructuration complexe d’une existence spectrale et vastes phénomènes spirituels. Exemples de sorts (repères, pas une liste fermée) Voir et parler à un spectre présent. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Pas de contrôle automatique. Repousser ou maintenir un esprit. Maîtrise min.: Affinée • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense occulte de l’entité. Forcer une manifestation ou projeter brièvement sa conscience. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Maintien selon durée. Contraindre plusieurs spectres ou déplacer une âme sur une grande distance liée. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff."
        },
        {
          "type": "p",
          "text": "base: 21 Défense occulte des esprits concernés. Projeter durablement son âme dans un réceptacle préparé. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Connaissance du réceptacle et ancrage nécessaires. Provoquer une manifestation spectrale massive sur une zone urbaine. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Faire venir ne signifie pas contrôler. Limites et garde-fous • Spectromancie = âme ; Nécromancie = cadavre/état de mort ; Médéomancie = vie/restauration. • L’Essence Invocative fait venir une entité qui préexiste. Elle ne la crée pas et ne l’asservit pas gratuitement. • Possession et projection exigent des conditions de désignation/ancrage cohérentes. Hématomancie — magie du Sang L’Hématomancie manipule le sang comme matière, système biologique et support magique. Elle est très directe mais reste soumise à la désignation : le Mage peut viser une personne et sa circulation globale, pas sélectionner gratuitement une microstructure invisible qu’il ne sait pas localiser. Maîtrise Ce qu’elle autorise Initiale Sang visible ou accessible ; mouvements et effets globaux simples. Affinée Circulation, coagulation, pression et contrôle précis. Supérieure Sang comme vecteur autonome, lien ou extension de la volonté. Magistrale Contrôle hématique extrêmement poussé, effets de masse et techniques signatures. Exemples de sorts (repères, pas une liste fermée) Faire ramper du sang exposé ou arrêter une hémorragie. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Pas de Défense si sang libre et non contesté. Perturber globalement la circulation d’une cible. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff."
        },
        {
          "type": "p",
          "text": "base: 15 Défense occulte ; attaque directe +6 dégâts si destructive. Bloquer un membre par circulation ou contrôler plusieurs litres de sang. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense occulte si sang interne. Utiliser son propre sang comme plusieurs vecteurs actifs. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Comportement autonome limité par Maîtrise/maintien. Manipuler le sang de plusieurs individus dans une vaste scène. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Chaque cible compare sa Défense occulte. Affecter la circulation d’une population importante dans une vaste zone. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Sélection fine et létalité restent limitées par le sort annoncé. Limites et garde-fous • Une cible vivante contenant son sang peut être visée globalement parce que le Mage identifie la personne ; cibler une artériole invisible précise exige connaissance + localisation. • « J’arrête son cœur » ou « je bouche un vaisseau cérébral » ne contourne pas les PV : c’est une description d’attaque à résoudre normalement. • Les gouttes autonomes, liens hématiques à distance ou effets chirurgicalement précis sont d’excellents candidats à des Magies personnelles/familiales. Nécromancie — magie de la Mort La Nécromancie travaille sur les cadavres, l’état de mort et les structures mortes. Elle peut animer un corps sans lui rendre son âme. Maîtrise Ce qu’elle autorise Initiale Préserver, mouvoir ou modifier un cadavre simple. Affinée Animation cohérente et contrôle de plusieurs corps."
        },
        {
          "type": "p",
          "text": "Maîtrise Ce qu’elle autorise Supérieure Morts-vivants spécialisés, autonomies simples et cohorte organisée. Magistrale Systèmes nécromantiques durables, armées ou territoires de mort. Exemples de sorts (repères, pas une liste fermée) Empêcher un cadavre de se décomposer. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Effet reconstructif/restrictif sur matière morte. Animer un cadavre simple pour une tâche directe. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Maintien si comportement actif complexe. Animer plusieurs serviteurs morts. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Une cohorte générique active à la fois. Créer un mort-vivant spécialisé et relativement autonome. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Fonctions spéciales exigent vraie conception magique. Lever une unité importante de morts. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Ordres complexes peuvent exiger maintien/commandement. Éveiller un cimetière ou imposer un domaine nécromantique local. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Rituel/Canalisation souvent nécessaire. Limites et garde-fous • Un Mage ne peut entretenir qu’une cohorte nécromantique générique pleinement liée et active à la fois ; créer une nouvelle cohorte remplace ou libère la précédente, sauf Technique/Magie personnelle. • Les armées historiques permanentes de grands nécromanciens sont des accomplissements spécialisés, pas un stockpile gratuit de sorts Mineurs. • Animer un corps ≠ remettre son âme dedans. La résurrection véritable traverse d’autres domaines et reste exceptionnelle."
        },
        {
          "type": "p",
          "text": "Discella — ombre, mensonge et malédiction Pseudomancie — magie des Illusions La Pseudomancie manipule apparence et perception. Une illusion placée dans le monde et une hallucination imposée directement à un esprit ne se défendent pas de la même manière. Maîtrise Ce qu’elle autorise Initiale Un sens, un son, une image ou une apparence simple. Affinée Illusion multisensorielle cohérente. Supérieure Illusions multiples, réactives et partiellement autonomes. Magistrale Environnement perceptif complet et cohérent à grande échelle. Exemples de sorts (repères, pas une liste fermée) Modifier une voix ou cacher visuellement un petit objet. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Observation opposée si quelqu’un a une raison de douter. Créer un déguisement visuel et sonore cohérent. Maîtrise min.: Affinée • Amplitude: Mineure • PA: 1 • Diff. base: 15 Esprit + Perception contre résultat si l’illusion est examinée. Transformer l’apparence d’une pièce entière. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Maintien si illusion active et réactive. Imposer une hallucination ciblée à une personne. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense occulte. Remplacer perceptivement un bâtiment ou une rue. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Les interactions physiques réelles peuvent trahir l’illusion. Imposer une fausse réalité cohérente à un quartier. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Très forte charge de maintien/Canalisation selon durée."
        },
        {
          "type": "p",
          "text": "Limites et garde-fous • Illusion placée dans le monde : Esprit + Perception peut la confronter si le personnage dispose d’un motif de doute. Hallucination imposée : Défense occulte. • Une illusion ne devient pas physiquement réelle grâce à un gros DR. • Créer du sommeil, un monde de rêve autonome ou une illusion qui acquiert des effets matériels relève d’Œuvres personnelles/familiales. Pathomancie — magie des Malédictions La Pathomancie attache à une cible une règle négative surnaturelle : faiblesse, contrainte, condition, interdiction ou dégradation. Plus la règle est durable et sophistiquée, plus Maîtrise et Amplitude montent. Maîtrise Ce qu’elle autorise Initiale Gêne précise, courte et simple. Affinée Condition, déclencheur ou durée sérieuse. Supérieure Malédictions complexes, transmissibles ou multiconditionnelles. Magistrale Véritable loi personnelle surnaturelle ou fléau de grande ampleur. Exemples de sorts (repères, pas une liste fermée) Imposer 3 sur une famille précise d’actions pendant − un court moment. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Défense occulte. Faire dysfonctionner un objet ou fragiliser temporairement une capacité. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Objet : résistance éventuelle selon nature. Bloquer une capacité pendant une scène. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 Défense occulte ; préciser exactement ce qui est bloqué. Attacher une malédiction conditionnelle durable à une personne. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Durée/ancrage contribuent à l’Amplitude. Maudire durablement un groupe limité ou une organisation locale."
        },
        {
          "type": "p",
          "text": "Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Cibles identifiables nécessaires. Imposer un fléau à une importante population ou zone. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Conditions et sélection doivent être définies avant le jet. Limites et garde-fous • « Pour toujours » n’est jamais gratuit : durée longue, transmission et permanence font partie de la puissance réelle du sort. • Une malédiction doit définir clairement sa cible et sa règle ; les formulations vagues ne donnent pas plus de puissance. • Attaquer directement le Mageius d’un autre Mage, forcer le Revers ou arracher le Mageius sont des techniques spécialisées exceptionnelles. Skiamancie — magie des Ombres La Skiamancie contrôle l’Ombre comme substance et milieu surnaturel réel. Elle ne se confond ni avec l’absence de lumière ni avec une illusion. Maîtrise Ce qu’elle autorise Initiale Étendre, déplacer ou épaissir une Ombre. Affinée Lui donner forme, consistance ou fonction simple. Supérieure Ombres autonomes, passages et zones occultantes complexes. Magistrale Utiliser l’Ombre comme véritable milieu métaphysique à grande échelle. Exemples de sorts (repères, pas une liste fermée) Étendre une ombre ou créer un appendice sombre. Maîtrise min.: Initiale • Amplitude: Mineure • PA: 1 • Diff. base: 15 Peut fournir couvert/interaction selon effet annoncé. Engloutir une petite zone dans des ténèbres surnaturelles. Maîtrise min.: Affinée • Amplitude: Significative • PA: 2 • Diff. base: 18 La Photomancie peut interagir mais ne « dissipe » pas automatiquement l’Ombre. Créer plusieurs formes d’ombre capables d’interagir. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff."
        },
        {
          "type": "p",
          "text": "base: 18 Maintien si autonomie active. Passer entre deux ombres identifiées dans la portée autorisée. Maîtrise min.: Supérieure • Amplitude: Significative • PA: 2 • Diff. base: 18 Les deux extrémités doivent être désignables ; hors vue exige Technique/ancrage. Faire vivre les ombres d’un bâtiment entier. Maîtrise min.: Supérieure • Amplitude: Majeure • PA: 3 • Diff. base: 21 Sélection et comportement dépendent de la Maîtrise. Transformer une portion urbaine en manifestation active de l’Ombre. Maîtrise min.: Magistrale • Amplitude: Cataclysmique • PA: 4 • Diff. base: 25 Effet métaphysique massif, très risqué pour le Voile. Limites et garde-fous • Photomancie = lumière réelle ; Pseudomancie = perception ; Skiamancie = Ombre surnaturelle. • Un passage d’ombre générique ne permet pas de téléporter vers un lieu inconnu non désignable. • Créer des Deimons, royaumes d’ombre autonomes ou passages intermondes durables relève de Magies personnelles/familiales."
        }
      ]
    }
  ]
} as const;
const article=(id:string,category:"Vérité"|"Règles",title:string,tags:string[],sections:readonly Section[]):Article=>({id,dataset:"verite-v7",category,sourceCategory:category,title,source:SOURCE,status:"canon_enrichi",rebuildV2:true,tags,sections:sections as Section[]});
export const COMPENDIUM_VERITE_V7_MAGE_ARTICLES:Article[]=[
article("verite-v7-mages-mageius-roue-loges","Vérité","Mages — Mageius, Roue & Loges",["Vérité","Mages","Mageius","Roue magique","Loges","Guerre de la Magie","Échos","Œuvres"],SOURCE_PAYLOAD.lore),
article("regles-verite-v7-mage-maitrise-amplitude-lancement","Règles","Moteur de magie — Maîtrise, Amplitude & lancement",["Vérité","Mages","Mageius","Maîtrise","Amplitude","sorts","Canalisation"],SOURCE_PAYLOAD.r1),
article("regles-verite-v7-mage-tension-revers-echos-oeuvres","Règles","Tension, Revers, Échos & Œuvres",["Vérité","Mages","Tension","Revers","Dormance","Échos","Œuvres","Magie familiale"],SOURCE_PAYLOAD.r2),
article("regles-verite-v7-mage-roue-5-portes-15-ecoles","Règles","Roue magique — 5 portes & 15 écoles",["Vérité","Mages","Roue magique","Kaharal","Meldir","Elinaeth","Mestherak","Discella","écoles"],SOURCE_PAYLOAD.r3)
];
export const COMPENDIUM_VERITE_V7_MAGE_NAVIGATION=[
{id:"verite-v7-mages-mageius-roue-loges",dataset:"verite-v7",category:"Vérité",group:"Peuples & Natures",groupOrder:30,subgroup:"Mages",subgroupOrder:20,pageOrder:10,displayTitle:"Mages — Mageius, Roue & Loges"},
{id:"regles-verite-v7-mage-maitrise-amplitude-lancement",dataset:"verite-v7",category:"Règles",group:"Vérité — Natures & capacités",groupOrder:80,subgroup:"Mages",subgroupOrder:40,pageOrder:10,displayTitle:"Moteur de magie — Maîtrise, Amplitude & lancement"},
{id:"regles-verite-v7-mage-tension-revers-echos-oeuvres",dataset:"verite-v7",category:"Règles",group:"Vérité — Natures & capacités",groupOrder:80,subgroup:"Mages",subgroupOrder:40,pageOrder:20,displayTitle:"Tension, Revers, Échos & Œuvres"},
{id:"regles-verite-v7-mage-roue-5-portes-15-ecoles",dataset:"verite-v7",category:"Règles",group:"Vérité — Natures & capacités",groupOrder:80,subgroup:"Mages",subgroupOrder:40,pageOrder:30,displayTitle:"Roue magique — 5 portes & 15 écoles"}
];