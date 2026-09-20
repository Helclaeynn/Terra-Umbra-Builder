type Block={type:"p";text:string;style?:string}|{type:"table";rows:unknown[][]};
type Section={id:string;title:string;level:number;audience?:"mj";blocks:Block[]};
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
      "id": "les-enfants-de-serathe",
      "title": "Les enfants de Serathè",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Aseryns sont un peuple terrestre créé par Serathè, une Ssrynn dont la lignée fut destinée à s’implanter sur le continent qui deviendrait l’Atlantide. Leur apparence extérieure converge avec celle des Humains, mais leur anatomie interne, leur activité électrique, leur métabolisme et leur système nerveux sont profondément différents. Ils vivent naturellement plusieurs siècles."
        }
      ]
    },
    {
      "id": "serathe-avant-les-aseryns",
      "title": "Serathè avant les Aseryns",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Avant d’être la Mère d’un peuple, Serathè fut une créature prédatrice parcourant une Terre extrêmement ancienne. Après une longue phase larvaire et une métamorphose majeure, elle chassa plusieurs menaces de l’Atlantide primitive, façonna une langue et prépara progressivement l’environnement dans lequel sa descendance pourrait exister. Elle n’était cependant pas une fondatrice immobile. Alors qu’elle préparait ses archives et son héritage, Serathè abandonna un jour son travail, construisit une embarcation ridiculement petite et partit découvrir le monde. Son goût du voyage et de la nouveauté est resté profondément attaché à la culture aseryne : changer de vie, partir ou refuser une existence devenue stérile n’est pas automatiquement considéré comme une faute."
        }
      ]
    },
    {
      "id": "les-treize",
      "title": "Les Treize",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "À la fin de son existence, Serathè prépara quatorze stèles pour autant d’héritiers, répartissant entre eux savoirs, passions, regrets et responsabilités. Kalirath, chargé de trouver un moyen de vaincre les Fléaux, fut finalement corrompu et rejeté ; l’Histoire ne retint plus que les Treize. Athegos devait guider ; Sundosia explorer ; Caendis protéger ; Cairiah bâtir ; Eydreas douter et rechercher ; Seryn créer ; Natyel nourrir ; Erith surveiller ; Lisirast préserver ; Dratyn transmettre la Foudre ; Lisithas juger ; Selerias maintenir la cohésion ; Theana soigner. Ces fonctions sont devenues des Traditions culturelles pouvant être apprises indépendamment de la filiation."
        }
      ]
    },
    {
      "id": "une-physiologie-faite-pour-l-orage",
      "title": "Une physiologie faite pour l’orage",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Aseryns disposent d’une réactivité neuromusculaire exceptionnelle et d’un sens électromagnétique capable de leur faire percevoir certains courants, champs et activités technologiques sans équipement. L’Accelyr exploite cette rapidité au point qu’un échange naturel entre Aseryns peut être impossible à suivre pour un cerveau humain ordinaire. Tous possèdent également un potentiel lié à la Foudre, mais tous ne savent pas la maîtriser. La discipline de Dratyn doit être apprise. La civilisation aseryne distingue depuis longtemps plusieurs conceptions fondamentales associées au Créateur, à l’Esprit, à l’Érosion et à la Fin, principes cosmologiques qui ne se répartissent pas simplement entre Bien et Mal."
        }
      ]
    },
    {
      "id": "atlantide-catastrophes-et-diasporas",
      "title": "Atlantide, catastrophes et diasporas",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "L’Atlantide était un continent fortement marqué par le Stroethil, les phénomènes magnétiques, les vents et les orages. Sa disparition dispersa les Aseryns et donna naissance à plusieurs trajectoires historiques. Les Aériliens puis Néo-Atlantes furent marqués par Aèr et sa Magie ; les Mûliens développèrent un héritage davantage psychique ; les Hyperboréens portent une tradition plus physique ; les Lémurians un rapport plus étroit à certains héritages nymphaux et élémentaires ; les Serathéens rassemblent des lignées très métissées et dispersées. Quelques Paleo-Atlantes existaient déjà avant le cataclysme et ont parfois survécu en stase. Leur réveil peut être plus violent encore que celui d’un ancien Vampire : ils découvrent non seulement une civilisation transformée, mais un monde où leur propre continent est devenu une légende humaine."
        }
      ]
    },
    {
      "id": "civilisation-et-traditions",
      "title": "Civilisation et traditions",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les différents peuples aseryns ne forment pas un ensemble politique parfaitement unifié. Plusieurs héritages, couronnes et mémoires se superposent encore. Les Traditions des Treize constituent néanmoins un langage culturel capable de franchir nombre de ces divisions : protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas ou soigner selon Theana restent des références compréhensibles bien au-delà d’une seule branche. Chez les Serathéens d’Amérique du Nord existe notamment le Conseil de la Foudre, tradition régionale marquée par des pratiques chamaniques et un rapport particulier aux Ancêtres. Il ne constitue pas une institution centrale de tous les Aseryns ni une seconde école de Foudre : c’est l’un des nombreux développements culturels apparus après les diasporas."
        }
      ]
    },
    {
      "id": "les-aseryns-en-2035",
      "title": "Les Aseryns en 2035",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Jamais une société humaine n’a produit autant d’électricité, de réseaux et de systèmes réagissant en fractions de seconde. Le monde moderne peut donc sembler étrangement familier à une physiologie aseryne, tout en restant parfois désespérément lent. Une conversation en Accelyr, une perception électromagnétique ou des réflexes accélérés donnent une relation au quotidien que les Humains ne partagent pas. Les Aseryns ne vivent cependant pas tous dans des communautés anciennes. Certains sont pleinement intégrés à la Californie depuis plusieurs générations et connaissent leur héritage surtout par leur famille. Leur civilisation est vieille ; chaque individu conserve pourtant le droit de découvrir le monde comme s’il était neuf, ce qui est probablement l’une des choses les plus fidèles à Serathè."
        }
      ]
    },
    {
      "id": "heritiers-de-serathe-pas-gardiens-d-un-musee",
      "title": "Héritiers de Serathè, pas gardiens d'un musée",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "La civilisation aseryne est ancienne, mais son rapport au passé n'est pas celui d'un peuple condamné à le répéter. Serathè elle-même abandonna un jour ses travaux pour construire une embarcation dérisoire et partir découvrir le monde. Cette curiosité est restée une référence culturelle profonde : quitter une vie devenue stérile, voyager ou recommencer n'est pas nécessairement une trahison de la tradition. Cette disposition explique la manière dont les Aseryns ont survécu aux catastrophes. La disparition d'Atlantide n'a pas produit une seule diaspora mais plusieurs trajectoires. Aériliens et Néo-Atlantes furent marqués par Aèr et sa Magie ; les Mûliens développèrent davantage leur héritage psychique ; les Hyperboréens cultivèrent des traditions plus physiques ; les Lémurians conservèrent des relations particulières avec des héritages nymphaux et élémentaires ; les Serathéens devinrent un ensemble très métissé de lignées dispersées. Ces peuples ne forment pas un État aseryn unique. Ils partagent des mémoires, des références et des traditions, mais leurs histoires ont eu le temps de produire des intérêts différents. L'idée d'une civilisation aseryne homogène appartient souvent davantage au regard extérieur qu'à l'expérience de ceux qui la vivent."
        }
      ]
    },
    {
      "id": "les-treize-comme-langage-commun",
      "title": "Les Treize comme langage commun",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Treize Fondateurs ne sont pas des ancêtres biologiques distribuant automatiquement des pouvoirs par le sang. Leurs Traditions sont enseignées. Elles représentent des modèles culturels capables de voyager entre diasporas : gouverner selon Athegos, protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas, créer selon Seryn, nourrir selon Natyel, veiller selon Erith, conserver selon Lisirast, juger selon Lisithas, aimer selon Selerias ou soigner selon Theana. Un Aseryn peut se reconnaître dans plusieurs de ces héritages au cours de sa vie. Leur force vient précisément de ce qu'ils ne réduisent pas une personne à sa naissance. Dans une civilisation où l'espérance de vie se compte en siècles, la possibilité de changer de fonction ou d'idéal n'est pas une exception : elle est une condition pour ne pas devenir prisonnier de sa propre durée. Dratyn occupe une place différente parce qu'elle préserve la Foudre. Tous les Aseryns en portent le potentiel, mais la maîtrise doit être apprise. Les conceptions du Créateur, de l'Esprit, de l'Érosion et de la Fin ne sont pas des alignements moraux. Elles décrivent des manières différentes de comprendre une puissance qui appartient au corps aseryn autant qu'à sa cosmologie."
        }
      ]
    },
    {
      "id": "vivre-vite-dans-un-corps-qui-dure-longtemps",
      "title": "Vivre vite dans un corps qui dure longtemps",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "L'Accelyr révèle l'un des paradoxes les plus étrangers de la physiologie aseryne. Leur système nerveux peut fonctionner à une vitesse qui rend certains échanges impossibles à suivre pour un Humain ordinaire, alors même que leur vie s'étend sur plusieurs siècles. Ils peuvent donc connaître des instants d'une densité exceptionnelle au sein d'existences très longues. La société technologique de 2035 produit un environnement qui leur est étrangement adapté : électricité omniprésente, réseaux, champs électromagnétiques et systèmes réagissant en fractions de seconde. Le même monde qui émerveille un Humain par sa vitesse peut encore sembler lent à quelqu'un qui traite naturellement certaines informations autrement. Cette proximité ne signifie pas que tous les Aseryns soient ingénieurs ou passionnés de technologie. Elle donne simplement à leur perception du quotidien une texture différente. Une panne électrique peut être ressentie avant d'être annoncée. Un espace saturé d'équipements possède une présence que d'autres espèces ne perçoivent pas de la même manière."
        }
      ]
    },
    {
      "id": "le-conseil-de-la-foudre-et-les-seratheens",
      "title": "Le Conseil de la Foudre et les Serathéens",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Le Conseil de la Foudre appartient aux traditions serathéennes d'Amérique du Nord. Ses pratiques, marquées par des approches chamaniques et par le rapport aux Ancêtres, sont importantes pour ces communautés mais ne constituent ni un gouvernement de tous les Aseryns ni une deuxième école universelle de Foudre. Cette distinction est essentielle pour comprendre la diversité aseryne. Une institution régionale peut être très ancienne, puissante et respectée sans devenir le centre naturel d'une civilisation entière. Les Aseryns ont trop de siècles de diasporas pour que toutes leurs histoires tiennent dans un seul Conseil."
        }
      ]
    },
    {
      "id": "les-treize-comme-langage-commun",
      "title": "Les Treize comme langage commun",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Treize Fondateurs ne sont pas des ancêtres biologiques distribuant automatiquement des pouvoirs par le sang. Leurs Traditions sont enseignées. Elles représentent des modèles culturels capables de voyager entre diasporas : gouverner selon Athegos, protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas, créer selon Seryn, nourrir selon Natyel, veiller selon Erith, conserver selon Lisirast, juger selon Lisithas, aimer selon Selerias ou soigner selon Theana. Un Aseryn peut se reconnaître dans plusieurs de ces héritages au cours de sa vie. Leur force vient précisément de ce qu'ils ne réduisent pas une personne à sa naissance. Dans une civilisation où l'espérance de vie se compte en siècles, la possibilité de changer de fonction ou d'idéal n'est pas une exception : elle est une condition pour ne pas devenir prisonnier de sa propre durée. Dratyn occupe une place différente parce qu'elle préserve la Foudre. Tous les Aseryns en portent le potentiel, mais la maîtrise doit être apprise. Les conceptions du Créateur, de l'Esprit, de l'Érosion et de la Fin ne sont pas des alignements moraux. Elles décrivent des manières différentes de comprendre une puissance qui appartient au corps aseryn autant qu'à sa cosmologie. Vivre vite dans un corps qui dure longtemps L'Accelyr révèle l'un des paradoxes les plus étrangers de la physiologie aseryne. Leur système nerveux peut fonctionner à une vitesse qui rend certains échanges impossibles à suivre pour un Humain ordinaire, alors même que leur vie s'étend sur plusieurs siècles. Ils peuvent donc connaître des instants d'une densité exceptionnelle au sein d'existences très longues."
        },
        {
          "type": "p",
          "text": "La société technologique de 2035 produit un environnement qui leur est étrangement adapté : électricité omniprésente, réseaux, champs électromagnétiques et systèmes réagissant en fractions de seconde. Le même monde qui émerveille un Humain par sa vitesse peut encore sembler lent à quelqu'un qui traite naturellement certaines informations autrement. Cette proximité ne signifie pas que tous les Aseryns soient ingénieurs ou passionnés de technologie. Elle donne simplement à leur perception du quotidien une texture différente. Une panne électrique peut être ressentie avant d'être annoncée. Un espace saturé d'équipements possède une présence que d'autres espèces ne perçoivent pas de la même manière. Le Conseil de la Foudre et les Serathéens Le Conseil de la Foudre appartient aux traditions serathéennes d'Amérique du Nord. Ses pratiques, marquées par des approches chamaniques et par le rapport aux Ancêtres, sont importantes pour ces communautés mais ne constituent ni un gouvernement de tous les Aseryns ni une deuxième école universelle de Foudre. Cette distinction est essentielle pour comprendre la diversité aseryne. Une institution régionale peut être très ancienne, puissante et respectée sans devenir le centre naturel d'une civilisation entière. Les Aseryns ont trop de siècles de diasporas pour que toutes leurs histoires tiennent dans un seul Conseil. Les Treize comme langage commun Athegos devait guider ; Sundosia explorer ; Caendis protéger ; Cairiah bâtir ; Eydreas douter et rechercher ; Seryn créer ; Natyel nourrir ; Erith surveiller ; Lisirast préserver ; Dratyn transmettre la Foudre ; Lisithas juger ; Selerias maintenir la cohésion ; Theana soigner."
        },
        {
          "type": "p",
          "text": "Ces fonctions attribuées aux Treize Fondateurs sont devenues des Traditions parce qu'elles décrivaient des besoins qu'aucune catastrophe n'a fait disparaître. La force du système vient précisément de ce qu'il n'est pas biologique. Un enfant ne reçoit pas automatiquement « sa » Tradition par le sang. Il peut être formé, changer de voie ou combiner plusieurs héritages au fil de sa vie. Les lignées familiales influencent naturellement l'éducation, mais elles ne rendent pas une fonction innée. Cette distinction a permis aux différentes diasporas de continuer à se reconnaître après des siècles d'histoires divergentes. Un Hyperboréen et un Néo￾Atlante peuvent désapprouver presque tout de la politique de l'autre et comprendre néanmoins ce que signifie agir selon Caendis ou Theana. Les Treize forment moins un gouvernement qu'un vocabulaire moral et professionnel partagé."
        }
      ]
    },
    {
      "id": "accelyr-une-culture-a-la-vitesse-du-corps",
      "title": "Accelyr : une culture à la vitesse du corps",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "L'Accelyr vient d'une physiologie capable de traiter et d'échanger des informations à un rythme qui dépasse facilement les capacités humaines. Entre Aseryns entraînés, une conversation peut paraître faite de ruptures, de gestes et de phrases trop rapides pour un observateur ordinaire. Cette vitesse n'est pas seulement un avantage de combat. Elle a influencé l'éducation, le débat et la manière de travailler collectivement. Une réunion aseryne peut parcourir en quelques minutes une quantité d'hypothèses qui exigerait des heures dans une institution humaine, puis sembler étrangement lente lorsqu'elle doit produire un document compréhensible par des partenaires profanes. Le Voile crée donc un problème quotidien spécifique : vivre dans une société qui pense et parle plus lentement sans transformer cette différence en mépris. Les communautés qui travaillent avec des Humains apprennent à ralentir volontairement, à découper leurs raisonnements et à reconnaître que la vitesse cognitive ne remplace ni l'expérience ni la justesse."
        }
      ]
    },
    {
      "id": "les-diasporas-ne-sont-pas-des-castes",
      "title": "Les diasporas ne sont pas des castes",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Néo-Atlantes et Aériliens, les Mûliens, les Hyperboréens, les Lémurians et les Serathéens portent des histoires différentes nées des catastrophes et des migrations. Ces noms décrivent des peuples et des trajectoires, pas des spécialisations mécaniques obligatoires. Les Néo-Atlantes conservent une relation particulièrement forte avec Aèr et les héritages magiques qui ont transformé une partie de leur histoire. Les Mûliens ont développé davantage certains héritages psychiques. Les Hyperboréens sont associés à des traditions plus physiques et à des environnements exigeants. Les Lémurians ont entretenu des rapports singuliers avec des héritages nymphaux et élémentaires. Les Serathéens forment des ensembles métissés et dispersés dont les cultures se sont adaptées aux régions où elles ont survécu. Aucune de ces descriptions n'enferme un individu. Des millénaires de rencontres et de déplacements ont produit des familles mêlées, des apprentissages croisés et des personnes qui se reconnaissent dans plusieurs héritages à la fois."
        }
      ]
    },
    {
      "id": "les-paleo-atlantes-et-le-traumatisme-du-temps",
      "title": "Les Paleo-Atlantes et le traumatisme du temps",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les rares Paleo-Atlantes ayant survécu en stase représentent une fracture plus profonde que la simple ancienneté. Ils ont connu une civilisation dont les autres Aseryns parlent déjà comme d'une histoire fondatrice. Leur réveil signifie découvrir que des institutions, des paysages et parfois des catégories entières de pensée ont disparu. Ils ne sont pas automatiquement plus sages. Comme les Vampires réveillés après une longue torpeur, ils peuvent être extraordinairement compétents dans un monde qui n'existe plus et profondément démunis devant ce qui est devenu banal. Leur présence est précieuse pour les archives et dangereuse pour les mythes : un témoin direct peut confirmer certaines légendes et en détruire d'autres simplement en se souvenant autrement."
        }
      ]
    },
    {
      "id": "le-conseil-de-la-foudre-une-reponse-seratheenne",
      "title": "Le Conseil de la Foudre, une réponse serathéenne",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "En Amérique du Nord, certains Serathéens ont développé le Conseil de la Foudre, tradition régionale marquée par les Ancêtres et des pratiques chamaniques nées de leur histoire locale. Il possède une importance réelle pour ces communautés et peut jouer un rôle politique ou spirituel majeur dans leurs affaires. Il ne représente cependant ni tous les Aseryns ni une seconde autorité universelle parallèle aux Treize. Un Mûlien ou un Néo-Atlante peut connaître son existence sans lui devoir la moindre obéissance. Cette modestie d'échelle rend le Conseil plus crédible : c'est une institution née d'une diaspora particulière, pas la réponse automatique de toute une espèce à chaque problème moderne."
        }
      ]
    }
  ],
  "r1": [
    {
      "id": "nature-aseryne",
      "title": "Nature aseryne",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Aseryns sont une espèce ssrynnesque propre à la Terre, créée par Serathè. Leur apparence converge fortement avec celle des humains, mais leur anatomie interne, leur métabolisme, leur système nerveux et leur activité électromusculaire diffèrent profondément. Leur longévité se compte normalement en siècles. Leur identité mécanique ne repose pas sur une longue liste de pouvoirs innés. Elle repose sur un socle racial commun, de petites particularités d'origine, puis sur des Traditions apprises. Un Aseryn peu intéressé par la Foudre doit disposer d'autant de choix structurants qu'un Aseryn qui en fait sa spécialité."
        }
      ]
    },
    {
      "id": "voile-semi-revelation-et-revelation",
      "title": "Voile, Semi-Révélation et Révélation",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "État Modificateur commun Voilé (V) Aucun modificateur racial commun. Semi-Révélé (SR) +1 Agilité. Révélé (R) +2 Agilité. Ces modificateurs représentent la véritable vitesse neuromusculaire de l'Aseryn. Ils s'ajoutent aux éventuels modificateurs de l'Origine. Ils n'accordent pas, à eux seuls, de PA supplémentaires automatiques : les PA restent déterminés par le jet d'Initiative normal."
        }
      ]
    },
    {
      "id": "variation-de-vigueur-et-points-de-vie",
      "title": "Variation de Vigueur et Points de Vie",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "Lorsqu'une forme modifie la Vigueur, les PV maximum et les PV actuels varient immédiatement de 2 × la variation de Vigueur. Une diminution de Vigueur ne peut toutefois pas, à elle seule, faire passer un personnage qui possédait encore des PV positifs sous 1 PV. Un changement de forme ne constitue jamais une méthode de soin : il ne restitue pas des blessures déjà subies. Le supplément de PV représente uniquement la robustesse momentanée du corps plus vigoureux."
        }
      ]
    },
    {
      "id": "traits-communs-gratuits",
      "title": "Traits communs gratuits",
      "level": 3,
      "blocks": []
    },
    {
      "id": "accelyr",
      "title": "Accelyr",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "exploite cette rapidité au point qu’un échange naturel entre Aseryns peut être impossible à suivre pour un cerveau humain ordinaire. Tous possèdent également un potentiel lié à la Foudre, mais tous ne savent pas la maîtriser. La discipline de Dratyn doit être apprise. La civilisation aseryne distingue depuis longtemps plusieurs conceptions fondamentales associées au Créateur, à l’Esprit, à l’Érosion et à la Fin, principes cosmologiques qui ne se répartissent pas simplement entre Bien et Mal. Atlantide, catastrophes et diasporas L’Atlantide était un continent fortement marqué par le Stroethil, les phénomènes magnétiques, les vents et les orages. Sa disparition dispersa les Aseryns et donna naissance à plusieurs trajectoires historiques. Les Aériliens puis Néo-Atlantes furent marqués par Aèr et sa Magie ; les Mûliens développèrent un héritage davantage psychique ; les Hyperboréens portent une tradition plus physique ; les Lémurians un rapport plus étroit à certains héritages nymphaux et élémentaires ; les Serathéens rassemblent des lignées très métissées et dispersées. Quelques Paleo-Atlantes existaient déjà avant le cataclysme et ont parfois survécu en stase. Leur réveil peut être plus violent encore que celui d’un ancien Vampire : ils découvrent non seulement une civilisation transformée, mais un monde où leur propre continent est devenu une légende humaine. Civilisation et traditions Les différents peuples aseryns ne forment pas un ensemble politique parfaitement unifié. Plusieurs héritages, couronnes et mémoires se superposent encore."
        },
        {
          "type": "p",
          "text": "Les Traditions des Treize constituent néanmoins un langage culturel capable de franchir nombre de ces divisions : protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas ou soigner selon Theana restent des références compréhensibles bien au-delà d’une seule branche. Chez les Serathéens d’Amérique du Nord existe notamment le Conseil de la Foudre, tradition régionale marquée par des pratiques chamaniques et un rapport particulier aux Ancêtres. Il ne constitue pas une institution centrale de tous les Aseryns ni une seconde école de Foudre : c’est l’un des nombreux développements culturels apparus après les diasporas. Les Aseryns en 2035 Jamais une société humaine n’a produit autant d’électricité, de réseaux et de systèmes réagissant en fractions de seconde. Le monde moderne peut donc sembler étrangement familier à une physiologie aseryne, tout en restant parfois désespérément lent. Une conversation en Accelyr, une perception électromagnétique ou des réflexes accélérés donnent une relation au quotidien que les Humains ne partagent pas. Les Aseryns ne vivent cependant pas tous dans des communautés anciennes. Certains sont pleinement intégrés à la Californie depuis plusieurs générations et connaissent leur héritage surtout par leur famille. Leur civilisation est vieille ; chaque individu conserve pourtant le droit de découvrir le monde comme s’il était neuf, ce qui est probablement l’une des choses les plus fidèles à Serathè. Héritiers de Serathè, pas gardiens d'un musée La civilisation aseryne est ancienne, mais son rapport au passé n'est pas celui d'un peuple condamné à le répéter. Serathè elle-même abandonna un jour ses travaux pour construire une embarcation dérisoire et partir découvrir le monde."
        },
        {
          "type": "p",
          "text": "Cette curiosité est restée une référence culturelle profonde : quitter une vie devenue stérile, voyager ou recommencer n'est pas nécessairement une trahison de la tradition. Cette disposition explique la manière dont les Aseryns ont survécu aux catastrophes. La disparition d'Atlantide n'a pas produit une seule diaspora mais plusieurs trajectoires. Aériliens et Néo-Atlantes furent marqués par Aèr et sa Magie ; les Mûliens développèrent davantage leur héritage psychique ; les Hyperboréens cultivèrent des traditions plus physiques ; les Lémurians conservèrent des relations particulières avec des héritages nymphaux et élémentaires ; les Serathéens devinrent un ensemble très métissé de lignées dispersées. Ces peuples ne forment pas un État aseryn unique. Ils partagent des mémoires, des références et des traditions, mais leurs histoires ont eu le temps de produire des intérêts différents. L'idée d'une civilisation aseryne homogène appartient souvent davantage au regard extérieur qu'à l'expérience de ceux qui la vivent. Les Treize comme langage commun Les Treize Fondateurs ne sont pas des ancêtres biologiques distribuant automatiquement des pouvoirs par le sang. Leurs Traditions sont enseignées. Elles représentent des modèles culturels capables de voyager entre diasporas : gouverner selon Athegos, protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas, créer selon Seryn, nourrir selon Natyel, veiller selon Erith, conserver selon Lisirast, juger selon Lisithas, aimer selon Selerias ou soigner selon Theana. Un Aseryn peut se reconnaître dans plusieurs de ces héritages au cours de sa vie. Leur force vient précisément de ce qu'ils ne réduisent pas une personne à sa naissance."
        },
        {
          "type": "p",
          "text": "Dans une civilisation où l'espérance de vie se compte en siècles, la possibilité de changer de fonction ou d'idéal n'est pas une exception : elle est une condition pour ne pas devenir prisonnier de sa propre durée. Dratyn occupe une place différente parce qu'elle préserve la Foudre. Tous les Aseryns en portent le potentiel, mais la maîtrise doit être apprise. Les conceptions du Créateur, de l'Esprit, de l'Érosion et de la Fin ne sont pas des alignements moraux. Elles décrivent des manières différentes de comprendre une puissance qui appartient au corps aseryn autant qu'à sa cosmologie. Vivre vite dans un corps qui dure longtemps L'Accelyr révèle l'un des paradoxes les plus étrangers de la physiologie aseryne. Leur système nerveux peut fonctionner à une vitesse qui rend certains échanges impossibles à suivre pour un Humain ordinaire, alors même que leur vie s'étend sur plusieurs siècles. Ils peuvent donc connaître des instants d'une densité exceptionnelle au sein d'existences très longues. La société technologique de 2035 produit un environnement qui leur est étrangement adapté : électricité omniprésente, réseaux, champs électromagnétiques et systèmes réagissant en fractions de seconde. Le même monde qui émerveille un Humain par sa vitesse peut encore sembler lent à quelqu'un qui traite naturellement certaines informations autrement. Cette proximité ne signifie pas que tous les Aseryns soient ingénieurs ou passionnés de technologie. Elle donne simplement à leur perception du quotidien une texture différente. Une panne électrique peut être ressentie avant d'être annoncée. Un espace saturé d'équipements possède une présence que d'autres espèces ne perçoivent pas de la même manière."
        },
        {
          "type": "p",
          "text": "Le Conseil de la Foudre et les Serathéens Le Conseil de la Foudre appartient aux traditions serathéennes d'Amérique du Nord. Ses pratiques, marquées par des approches chamaniques et par le rapport aux Ancêtres, sont importantes pour ces communautés mais ne constituent ni un gouvernement de tous les Aseryns ni une deuxième école universelle de Foudre. Cette distinction est essentielle pour comprendre la diversité aseryne. Une institution régionale peut être très ancienne, puissante et respectée sans devenir le centre naturel d'une civilisation entière. Les Aseryns ont trop de siècles de diasporas pour que toutes leurs histoires tiennent dans un seul Conseil. Les Treize comme langage commun Athegos devait guider ; Sundosia explorer ; Caendis protéger ; Cairiah bâtir ; Eydreas douter et rechercher ; Seryn créer ; Natyel nourrir ; Erith surveiller ; Lisirast préserver ; Dratyn transmettre la Foudre ; Lisithas juger ; Selerias maintenir la cohésion ; Theana soigner. Ces fonctions attribuées aux Treize Fondateurs sont devenues des Traditions parce qu'elles décrivaient des besoins qu'aucune catastrophe n'a fait disparaître. La force du système vient précisément de ce qu'il n'est pas biologique. Un enfant ne reçoit pas automatiquement « sa » Tradition par le sang. Il peut être formé, changer de voie ou combiner plusieurs héritages au fil de sa vie. Les lignées familiales influencent naturellement l'éducation, mais elles ne rendent pas une fonction innée. Cette distinction a permis aux différentes diasporas de continuer à se reconnaître après des siècles d'histoires divergentes."
        },
        {
          "type": "p",
          "text": "Un Hyperboréen et un Néo￾Atlante peuvent désapprouver presque tout de la politique de l'autre et comprendre néanmoins ce que signifie agir selon Caendis ou Theana. Les Treize forment moins un gouvernement qu'un vocabulaire moral et professionnel partagé. Accelyr : une culture à la vitesse du corps L'Accelyr vient d'une physiologie capable de traiter et d'échanger des informations à un rythme qui dépasse facilement les capacités humaines. Entre Aseryns entraînés, une conversation peut paraître faite de ruptures, de gestes et de phrases trop rapides pour un observateur ordinaire. Cette vitesse n'est pas seulement un avantage de combat. Elle a influencé l'éducation, le débat et la manière de travailler collectivement. Une réunion aseryne peut parcourir en quelques minutes une quantité d'hypothèses qui exigerait des heures dans une institution humaine, puis sembler étrangement lente lorsqu'elle doit produire un document compréhensible par des partenaires profanes. Le Voile crée donc un problème quotidien spécifique : vivre dans une société qui pense et parle plus lentement sans transformer cette différence en mépris. Les communautés qui travaillent avec des Humains apprennent à ralentir volontairement, à découper leurs raisonnements et à reconnaître que la vitesse cognitive ne remplace ni l'expérience ni la justesse. Les diasporas ne sont pas des castes Les Néo-Atlantes et Aériliens, les Mûliens, les Hyperboréens, les Lémurians et les Serathéens portent des histoires différentes nées des catastrophes et des migrations. Ces noms décrivent des peuples et des trajectoires, pas des spécialisations mécaniques obligatoires."
        },
        {
          "type": "p",
          "text": "Les Néo-Atlantes conservent une relation particulièrement forte avec Aèr et les héritages magiques qui ont transformé une partie de leur histoire. Les Mûliens ont développé davantage certains héritages psychiques. Les Hyperboréens sont associés à des traditions plus physiques et à des environnements exigeants. Les Lémurians ont entretenu des rapports singuliers avec des héritages nymphaux et élémentaires. Les Serathéens forment des ensembles métissés et dispersés dont les cultures se sont adaptées aux régions où elles ont survécu. Aucune de ces descriptions n'enferme un individu. Des millénaires de rencontres et de déplacements ont produit des familles mêlées, des apprentissages croisés et des personnes qui se reconnaissent dans plusieurs héritages à la fois. Les Paleo-Atlantes et le traumatisme du temps Les rares Paleo-Atlantes ayant survécu en stase représentent une fracture plus profonde que la simple ancienneté. Ils ont connu une civilisation dont les autres Aseryns parlent déjà comme d'une histoire fondatrice. Leur réveil signifie découvrir que des institutions, des paysages et parfois des catégories entières de pensée ont disparu. Ils ne sont pas automatiquement plus sages. Comme les Vampires réveillés après une longue torpeur, ils peuvent être extraordinairement compétents dans un monde qui n'existe plus et profondément démunis devant ce qui est devenu banal. Leur présence est précieuse pour les archives et dangereuse pour les mythes : un témoin direct peut confirmer certaines légendes et en détruire d'autres simplement en se souvenant autrement."
        },
        {
          "type": "p",
          "text": "Le Conseil de la Foudre, une réponse serathéenne En Amérique du Nord, certains Serathéens ont développé le Conseil de la Foudre, tradition régionale marquée par les Ancêtres et des pratiques chamaniques nées de leur histoire locale. Il possède une importance réelle pour ces communautés et peut jouer un rôle politique ou spirituel majeur dans leurs affaires. Il ne représente cependant ni tous les Aseryns ni une seconde autorité universelle parallèle aux Treize. Un Mûlien ou un Néo-Atlante peut connaître son existence sans lui devoir la moindre obéissance. Cette modestie d'échelle rend le Conseil plus crédible : c'est une institution née d'une diaspora particulière, pas la réponse automatique de toute une espèce à chaque problème moderne. Nature aseryne Les Aseryns sont une espèce ssrynnesque propre à la Terre, créée par Serathè. Leur apparence converge fortement avec celle des humains, mais leur anatomie interne, leur métabolisme, leur système nerveux et leur activité électromusculaire diffèrent profondément. Leur longévité se compte normalement en siècles. Leur identité mécanique ne repose pas sur une longue liste de pouvoirs innés. Elle repose sur un socle racial commun, de petites particularités d'origine, puis sur des Traditions apprises. Un Aseryn peu intéressé par la Foudre doit disposer d'autant de choix structurants qu'un Aseryn qui en fait sa spécialité. Voile, Semi-Révélation et Révélation État Modificateur commun Voilé (V) Aucun modificateur racial commun. Semi-Révélé (SR) +1 Agilité. Révélé (R) +2 Agilité. Ces modificateurs représentent la véritable vitesse neuromusculaire de l'Aseryn. Ils s'ajoutent aux éventuels modificateurs de l'Origine."
        },
        {
          "type": "p",
          "text": "Ils n'accordent pas, à eux seuls, de PA supplémentaires automatiques : les PA restent déterminés par le jet d'Initiative normal. Variation de Vigueur et Points de Vie Lorsqu'une forme modifie la Vigueur, les PV maximum et les PV actuels varient immédiatement de 2 × la variation de Vigueur. Une diminution de Vigueur ne peut toutefois pas, à elle seule, faire passer un personnage qui possédait encore des PV positifs sous 1 PV. Un changement de forme ne constitue jamais une méthode de soin : il ne restitue pas des blessures déjà subies. Le supplément de PV représente uniquement la robustesse momentanée du corps plus vigoureux. Traits communs gratuits Accelyr Tous les Aseryns comprennent l'Accelyr, une langue parlée à une vitesse que l'oreille et le cerveau humains ne peuvent normalement pas suivre. L'Accelyr ne donne aucun bonus chiffré par lui￾même ; il permet surtout une communication extrêmement rapide entre Aseryns et sert souvent de signe de reconnaissance culturelle."
        }
      ]
    },
    {
      "id": "physiologie-aseryne",
      "title": "Physiologie aseryne",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "Longévité exceptionnelle, activité neuromusculaire rapide et activité électrique corporelle supérieure font partie de la physiologie de l'espèce. Ces éléments sont principalement narratifs tant qu'un Talent ne leur donne pas un effet précis. La physiologie aseryne n'accorde pas de résistance universelle aux maladies, poisons ou fatigues."
        }
      ]
    },
    {
      "id": "sens-electromagnetique",
      "title": "Sens électromagnétique",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "SR/R — Passif. L'Aseryn perçoit les sources électromagnétiques significatives, les courants importants, les anomalies magnétiques marquées et les variations soudaines du champ environnant. En se concentrant 1 PA, il peut effectuer Esprit + Perception + 1d10e afin d'obtenir une direction, une proximité approximative et la nature générale de la source. Ce sens ne lit pas des données, ne remplace pas un scanner, ne révèle pas automatiquement tous les êtres vivants derrière les murs et peut être perturbé par un blindage, un brouillage ou un environnement électromagnétique saturé."
        }
      ]
    },
    {
      "id": "potentiel-foudroyant",
      "title": "Potentiel foudroyant",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Tout Aseryn possède biologiquement le potentiel d'apprendre à maîtriser la Foudre. Ce potentiel n'est pas une Affinité achetée en PTV et n'est pas binaire. Chez un PJ, on considère par défaut une affinité moyenne : il peut apprendre, mais cela demande un véritable enseignement et du temps. Certaines lignées ou individus exceptionnels apprennent beaucoup plus vite, voire manifestent spontanément la Foudre. Ces prodiges relèvent du lore et des PNJ extraordinaires ; ils ne constituent pas le profil normal d'un PJ."
        }
      ]
    },
    {
      "id": "routes-communes-aserynes",
      "title": "Routes communes aserynes",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les trois routes suivantes approfondissent des capacités présentes chez tous les Aseryns. Elles sont indépendantes des Origines et des Traditions des Fondateurs."
        }
      ]
    },
    {
      "id": "vivacite-aseryne",
      "title": "Vivacité aseryne",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:routes-communes-aserynes-vivacite-aseryne}}"
        }
      ]
    },
    {
      "id": "esprit-fulgurant",
      "title": "Esprit fulgurant",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:routes-communes-aserynes-esprit-fulgurant}}"
        }
      ]
    },
    {
      "id": "perception-electromagnetique",
      "title": "Perception électromagnétique",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:routes-communes-aserynes-perception-electromagnetique}}"
        }
      ]
    },
    {
      "id": "origines-jouables",
      "title": "Origines jouables",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Les Origines décrivent des branches historiques et biologiques de l'espèce. Les différences restent volontairement modestes : les Aseryns demeurent une espèce relativement uniforme. Les Paleo￾Atlantes et les Australisiens ne sont pas proposés comme Origines normales de PJ dans ce corpus."
        }
      ]
    },
    {
      "id": "aerilien-neo-atlante",
      "title": "Aérilien / Néo-Atlante",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "SR: +1 Agi, +1 Vol • R: +2 Agi, +1 Vol Orientation: Affinité magique, lecture des flux Mûlien SR: +1 Agi, +1 Esp • R: +2 Agi, +1 Esp Orientation: Psychisme, télépathie Hyperboréen SR: +1 Agi, +1 Vig • R: +2 Agi, +1 Vig Orientation: Physique, endurance, explosivité Lémurian SR: +1 Agi, +1 Vol • R: +2 Agi, +1 Vol Orientation: Héritage nymphal et élémentaire Serathèen SR: +1 Agi • R: +2 Agi Orientation: Ascendance composite, Traces multiples Aérilien / Néo-Atlante"
        }
      ]
    },
    {
      "id": "empreinte-resonance-d-aer",
      "title": "Empreinte — Résonance d’Aèr",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "SR : +1 Agilité, +1 Volonté. R : +2 Agilité, +1 Volonté. L'Aérilien sent instinctivement une manifestation magique active directement perceptible : il sait que de la magie est présente, sans en connaître automatiquement la source, le domaine ou la puissance. Esprit + Perception permet d'affiner cette impression. Acclimatation arcanique — SR/R : +3 pour résister aux effets nocifs d'un environnement saturé de magie brute ou instable. Ce bonus ne protège pas contre un sort ou un pouvoir ciblé."
        },
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:origines-jouables-aerilien-neo-atlante-empreinte-resonance-d-aer}}"
        }
      ]
    },
    {
      "id": "mulien",
      "title": "Mûlien",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "s développèrent un héritage davantage psychique ; les Hyperboréens portent une tradition plus physique ; les Lémurians un rapport plus étroit à certains héritages nymphaux et élémentaires ; les Serathéens rassemblent des lignées très métissées et dispersées. Quelques Paleo-Atlantes existaient déjà avant le cataclysme et ont parfois survécu en stase. Leur réveil peut être plus violent encore que celui d’un ancien Vampire : ils découvrent non seulement une civilisation transformée, mais un monde où leur propre continent est devenu une légende humaine. Civilisation et traditions Les différents peuples aseryns ne forment pas un ensemble politique parfaitement unifié. Plusieurs héritages, couronnes et mémoires se superposent encore. Les Traditions des Treize constituent néanmoins un langage culturel capable de franchir nombre de ces divisions : protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas ou soigner selon Theana restent des références compréhensibles bien au-delà d’une seule branche. Chez les Serathéens d’Amérique du Nord existe notamment le Conseil de la Foudre, tradition régionale marquée par des pratiques chamaniques et un rapport particulier aux Ancêtres. Il ne constitue pas une institution centrale de tous les Aseryns ni une seconde école de Foudre : c’est l’un des nombreux développements culturels apparus après les diasporas. Les Aseryns en 2035 Jamais une société humaine n’a produit autant d’électricité, de réseaux et de systèmes réagissant en fractions de seconde. Le monde moderne peut donc sembler étrangement familier à une physiologie aseryne, tout en restant parfois désespérément lent."
        },
        {
          "type": "p",
          "text": "Une conversation en Accelyr, une perception électromagnétique ou des réflexes accélérés donnent une relation au quotidien que les Humains ne partagent pas. Les Aseryns ne vivent cependant pas tous dans des communautés anciennes. Certains sont pleinement intégrés à la Californie depuis plusieurs générations et connaissent leur héritage surtout par leur famille. Leur civilisation est vieille ; chaque individu conserve pourtant le droit de découvrir le monde comme s’il était neuf, ce qui est probablement l’une des choses les plus fidèles à Serathè. Héritiers de Serathè, pas gardiens d'un musée La civilisation aseryne est ancienne, mais son rapport au passé n'est pas celui d'un peuple condamné à le répéter. Serathè elle-même abandonna un jour ses travaux pour construire une embarcation dérisoire et partir découvrir le monde. Cette curiosité est restée une référence culturelle profonde : quitter une vie devenue stérile, voyager ou recommencer n'est pas nécessairement une trahison de la tradition. Cette disposition explique la manière dont les Aseryns ont survécu aux catastrophes. La disparition d'Atlantide n'a pas produit une seule diaspora mais plusieurs trajectoires. Aériliens et Néo-Atlantes furent marqués par Aèr et sa Magie ; les Mûliens développèrent davantage leur héritage psychique ; les Hyperboréens cultivèrent des traditions plus physiques ; les Lémurians conservèrent des relations particulières avec des héritages nymphaux et élémentaires ; les Serathéens devinrent un ensemble très métissé de lignées dispersées. Ces peuples ne forment pas un État aseryn unique. Ils partagent des mémoires, des références et des traditions, mais leurs histoires ont eu le temps de produire des intérêts différents."
        },
        {
          "type": "p",
          "text": "L'idée d'une civilisation aseryne homogène appartient souvent davantage au regard extérieur qu'à l'expérience de ceux qui la vivent. Les Treize comme langage commun Les Treize Fondateurs ne sont pas des ancêtres biologiques distribuant automatiquement des pouvoirs par le sang. Leurs Traditions sont enseignées. Elles représentent des modèles culturels capables de voyager entre diasporas : gouverner selon Athegos, protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas, créer selon Seryn, nourrir selon Natyel, veiller selon Erith, conserver selon Lisirast, juger selon Lisithas, aimer selon Selerias ou soigner selon Theana. Un Aseryn peut se reconnaître dans plusieurs de ces héritages au cours de sa vie. Leur force vient précisément de ce qu'ils ne réduisent pas une personne à sa naissance. Dans une civilisation où l'espérance de vie se compte en siècles, la possibilité de changer de fonction ou d'idéal n'est pas une exception : elle est une condition pour ne pas devenir prisonnier de sa propre durée. Dratyn occupe une place différente parce qu'elle préserve la Foudre. Tous les Aseryns en portent le potentiel, mais la maîtrise doit être apprise. Les conceptions du Créateur, de l'Esprit, de l'Érosion et de la Fin ne sont pas des alignements moraux. Elles décrivent des manières différentes de comprendre une puissance qui appartient au corps aseryn autant qu'à sa cosmologie. Vivre vite dans un corps qui dure longtemps L'Accelyr révèle l'un des paradoxes les plus étrangers de la physiologie aseryne. Leur système nerveux peut fonctionner à une vitesse qui rend certains échanges impossibles à suivre pour un Humain ordinaire, alors même que leur vie s'étend sur plusieurs siècles."
        },
        {
          "type": "p",
          "text": "Ils peuvent donc connaître des instants d'une densité exceptionnelle au sein d'existences très longues. La société technologique de 2035 produit un environnement qui leur est étrangement adapté : électricité omniprésente, réseaux, champs électromagnétiques et systèmes réagissant en fractions de seconde. Le même monde qui émerveille un Humain par sa vitesse peut encore sembler lent à quelqu'un qui traite naturellement certaines informations autrement. Cette proximité ne signifie pas que tous les Aseryns soient ingénieurs ou passionnés de technologie. Elle donne simplement à leur perception du quotidien une texture différente. Une panne électrique peut être ressentie avant d'être annoncée. Un espace saturé d'équipements possède une présence que d'autres espèces ne perçoivent pas de la même manière. Le Conseil de la Foudre et les Serathéens Le Conseil de la Foudre appartient aux traditions serathéennes d'Amérique du Nord. Ses pratiques, marquées par des approches chamaniques et par le rapport aux Ancêtres, sont importantes pour ces communautés mais ne constituent ni un gouvernement de tous les Aseryns ni une deuxième école universelle de Foudre. Cette distinction est essentielle pour comprendre la diversité aseryne. Une institution régionale peut être très ancienne, puissante et respectée sans devenir le centre naturel d'une civilisation entière. Les Aseryns ont trop de siècles de diasporas pour que toutes leurs histoires tiennent dans un seul Conseil."
        },
        {
          "type": "p",
          "text": "Les Treize comme langage commun Athegos devait guider ; Sundosia explorer ; Caendis protéger ; Cairiah bâtir ; Eydreas douter et rechercher ; Seryn créer ; Natyel nourrir ; Erith surveiller ; Lisirast préserver ; Dratyn transmettre la Foudre ; Lisithas juger ; Selerias maintenir la cohésion ; Theana soigner. Ces fonctions attribuées aux Treize Fondateurs sont devenues des Traditions parce qu'elles décrivaient des besoins qu'aucune catastrophe n'a fait disparaître. La force du système vient précisément de ce qu'il n'est pas biologique. Un enfant ne reçoit pas automatiquement « sa » Tradition par le sang. Il peut être formé, changer de voie ou combiner plusieurs héritages au fil de sa vie. Les lignées familiales influencent naturellement l'éducation, mais elles ne rendent pas une fonction innée. Cette distinction a permis aux différentes diasporas de continuer à se reconnaître après des siècles d'histoires divergentes. Un Hyperboréen et un Néo￾Atlante peuvent désapprouver presque tout de la politique de l'autre et comprendre néanmoins ce que signifie agir selon Caendis ou Theana. Les Treize forment moins un gouvernement qu'un vocabulaire moral et professionnel partagé. Accelyr : une culture à la vitesse du corps L'Accelyr vient d'une physiologie capable de traiter et d'échanger des informations à un rythme qui dépasse facilement les capacités humaines. Entre Aseryns entraînés, une conversation peut paraître faite de ruptures, de gestes et de phrases trop rapides pour un observateur ordinaire. Cette vitesse n'est pas seulement un avantage de combat. Elle a influencé l'éducation, le débat et la manière de travailler collectivement."
        },
        {
          "type": "p",
          "text": "Une réunion aseryne peut parcourir en quelques minutes une quantité d'hypothèses qui exigerait des heures dans une institution humaine, puis sembler étrangement lente lorsqu'elle doit produire un document compréhensible par des partenaires profanes. Le Voile crée donc un problème quotidien spécifique : vivre dans une société qui pense et parle plus lentement sans transformer cette différence en mépris. Les communautés qui travaillent avec des Humains apprennent à ralentir volontairement, à découper leurs raisonnements et à reconnaître que la vitesse cognitive ne remplace ni l'expérience ni la justesse. Les diasporas ne sont pas des castes Les Néo-Atlantes et Aériliens, les Mûliens, les Hyperboréens, les Lémurians et les Serathéens portent des histoires différentes nées des catastrophes et des migrations. Ces noms décrivent des peuples et des trajectoires, pas des spécialisations mécaniques obligatoires. Les Néo-Atlantes conservent une relation particulièrement forte avec Aèr et les héritages magiques qui ont transformé une partie de leur histoire. Les Mûliens ont développé davantage certains héritages psychiques. Les Hyperboréens sont associés à des traditions plus physiques et à des environnements exigeants. Les Lémurians ont entretenu des rapports singuliers avec des héritages nymphaux et élémentaires. Les Serathéens forment des ensembles métissés et dispersés dont les cultures se sont adaptées aux régions où elles ont survécu. Aucune de ces descriptions n'enferme un individu. Des millénaires de rencontres et de déplacements ont produit des familles mêlées, des apprentissages croisés et des personnes qui se reconnaissent dans plusieurs héritages à la fois."
        },
        {
          "type": "p",
          "text": "Les Paleo-Atlantes et le traumatisme du temps Les rares Paleo-Atlantes ayant survécu en stase représentent une fracture plus profonde que la simple ancienneté. Ils ont connu une civilisation dont les autres Aseryns parlent déjà comme d'une histoire fondatrice. Leur réveil signifie découvrir que des institutions, des paysages et parfois des catégories entières de pensée ont disparu. Ils ne sont pas automatiquement plus sages. Comme les Vampires réveillés après une longue torpeur, ils peuvent être extraordinairement compétents dans un monde qui n'existe plus et profondément démunis devant ce qui est devenu banal. Leur présence est précieuse pour les archives et dangereuse pour les mythes : un témoin direct peut confirmer certaines légendes et en détruire d'autres simplement en se souvenant autrement. Le Conseil de la Foudre, une réponse serathéenne En Amérique du Nord, certains Serathéens ont développé le Conseil de la Foudre, tradition régionale marquée par les Ancêtres et des pratiques chamaniques nées de leur histoire locale. Il possède une importance réelle pour ces communautés et peut jouer un rôle politique ou spirituel majeur dans leurs affaires. Il ne représente cependant ni tous les Aseryns ni une seconde autorité universelle parallèle aux Treize. Un Mûlien ou un Néo-Atlante peut connaître son existence sans lui devoir la moindre obéissance. Cette modestie d'échelle rend le Conseil plus crédible : c'est une institution née d'une diaspora particulière, pas la réponse automatique de toute une espèce à chaque problème moderne. Nature aseryne Les Aseryns sont une espèce ssrynnesque propre à la Terre, créée par Serathè."
        },
        {
          "type": "p",
          "text": "Leur apparence converge fortement avec celle des humains, mais leur anatomie interne, leur métabolisme, leur système nerveux et leur activité électromusculaire diffèrent profondément. Leur longévité se compte normalement en siècles. Leur identité mécanique ne repose pas sur une longue liste de pouvoirs innés. Elle repose sur un socle racial commun, de petites particularités d'origine, puis sur des Traditions apprises. Un Aseryn peu intéressé par la Foudre doit disposer d'autant de choix structurants qu'un Aseryn qui en fait sa spécialité. Voile, Semi-Révélation et Révélation État Modificateur commun Voilé (V) Aucun modificateur racial commun. Semi-Révélé (SR) +1 Agilité. Révélé (R) +2 Agilité. Ces modificateurs représentent la véritable vitesse neuromusculaire de l'Aseryn. Ils s'ajoutent aux éventuels modificateurs de l'Origine. Ils n'accordent pas, à eux seuls, de PA supplémentaires automatiques : les PA restent déterminés par le jet d'Initiative normal. Variation de Vigueur et Points de Vie Lorsqu'une forme modifie la Vigueur, les PV maximum et les PV actuels varient immédiatement de 2 × la variation de Vigueur. Une diminution de Vigueur ne peut toutefois pas, à elle seule, faire passer un personnage qui possédait encore des PV positifs sous 1 PV. Un changement de forme ne constitue jamais une méthode de soin : il ne restitue pas des blessures déjà subies. Le supplément de PV représente uniquement la robustesse momentanée du corps plus vigoureux. Traits communs gratuits Accelyr Tous les Aseryns comprennent l'Accelyr, une langue parlée à une vitesse que l'oreille et le cerveau humains ne peuvent normalement pas suivre."
        },
        {
          "type": "p",
          "text": "L'Accelyr ne donne aucun bonus chiffré par lui￾même ; il permet surtout une communication extrêmement rapide entre Aseryns et sert souvent de signe de reconnaissance culturelle. Physiologie aseryne Longévité exceptionnelle, activité neuromusculaire rapide et activité électrique corporelle supérieure font partie de la physiologie de l'espèce. Ces éléments sont principalement narratifs tant qu'un Talent ne leur donne pas un effet précis. La physiologie aseryne n'accorde pas de résistance universelle aux maladies, poisons ou fatigues. Sens électromagnétique SR/R — Passif. L'Aseryn perçoit les sources électromagnétiques significatives, les courants importants, les anomalies magnétiques marquées et les variations soudaines du champ environnant. En se concentrant 1 PA, il peut effectuer Esprit + Perception + 1d10e afin d'obtenir une direction, une proximité approximative et la nature générale de la source. Ce sens ne lit pas des données, ne remplace pas un scanner, ne révèle pas automatiquement tous les êtres vivants derrière les murs et peut être perturbé par un blindage, un brouillage ou un environnement électromagnétique saturé. Potentiel foudroyant Tout Aseryn possède biologiquement le potentiel d'apprendre à maîtriser la Foudre. Ce potentiel n'est pas une Affinité achetée en PTV et n'est pas binaire. Chez un PJ, on considère par défaut une affinité moyenne : il peut apprendre, mais cela demande un véritable enseignement et du temps. Certaines lignées ou individus exceptionnels apprennent beaucoup plus vite, voire manifestent spontanément la Foudre. Ces prodiges relèvent du lore et des PNJ extraordinaires ; ils ne constituent pas le profil normal d'un PJ."
        },
        {
          "type": "p",
          "text": "Routes communes aserynes Les trois routes suivantes approfondissent des capacités présentes chez tous les Aseryns. Elles sont indépendantes des Origines et des Traditions des Fondateurs. Vivacité aseryne Départ fulgurant — 1 PTV | SR/R — Passif Après avoir déterminé normalement le nombre de PA du personnage, ajoutez +3 à son score d'Initiative uniquement pour déterminer son ordre d'action dans les passes. Ce bonus ne modifie jamais le nombre de PA obtenu. Réflexe impossible — 2 PTV | Prérequis : Départ fulgurant | SR/R — Réaction Lorsqu’il est Surpris, l’Aseryn peut malgré tout dépenser 1 PA pour effectuer une Défense active contre une attaque dont il a conscience. Il reste Surpris pour les autres effets applicables. Surcadence nerveuse — 3 PTV | Prérequis : Réflexe impossible | SR/R — Réaction — 1/Scène L'Aseryn gagne immédiatement 1 PA utilisable avant la fin du round. Ce PA ne peut servir qu'à un Déplacement, une Défense active ou une action significative non offensive. Il ne peut pas servir à attaquer, activer un pouvoir offensif ou déclencher une chaîne de gains de PA. Esprit fulgurant Traitement accéléré — 1 PTV | SR/R — 1/Scène Sur une tâche intellectuelle où le temps supplémentaire ne sert qu'à réfléchir, calculer ou comparer des informations déjà disponibles, l'Aseryn peut bénéficier de Prendre son temps sans consommer le délai supplémentaire. Pensée parallèle — 1 PTV | SR/R — Passif L'Aseryn peut conserver une activité mentale simple en arrière-plan pendant qu'il agit : garder un compte, suivre plusieurs communications, poursuivre une comparaison simple ou maintenir un bref échange Accelyr. Cela n'autorise jamais deux tests simultanés, deux actions, deux pouvoirs maintenus ou deux concentrations complexes."
        },
        {
          "type": "p",
          "text": "Décision fulgurante — 2 PTV | Prérequis : Traitement accéléré | SR/R — 1/Scène Après un échec non narratif à un test reposant principalement sur Esprit, relancez le 1d10e et conservez le second résultat. Perception électromagnétique Lecture de champ — 1 PTV | SR/R Lors d'une utilisation focalisée du Sens électromagnétique, l'Aseryn bénéficie de +3 pour déterminer la nature, l'intensité et l'origine probable d'un phénomène électromagnétique. Cartographie inductive — 2 PTV | SR/R — 1 PA Dans un rayon d'environ 10 m, l'Aseryn peut dresser une cartographie grossière des câbles actifs, machines alimentées et principales sources électromagnétiques à travers des obstacles ordinaires. Il n'en lit ni le contenu ni la fonction exacte. Signature électrique — 2 PTV | SR/R Après avoir étudié une machine, un artefact alimenté ou une source énergétique, l'Aseryn peut mémoriser sa signature électromagnétique et la reconnaître ultérieurement si elle reste suffisamment similaire. Perception neuromotrice — 3 PTV | SR/R À très courte portée, lorsqu'il sait qu'une cible est présente, l'Aseryn peut percevoir le déclenchement de mouvements reposant sur une activité nerveuse ou électromécanique détectable. Les pénalités provenant uniquement de l'impossibilité de voir son mouvement ne s'appliquent pas à ses Défenses contre elle. Une fois par scène, il peut en outre recevoir +3 à une Défense active contre une telle cible. Blindage, brouillage ou absence de signature pertinente peuvent neutraliser ce Talent. Origines jouables Les Origines décrivent des branches historiques et biologiques de l'espèce. Les différences restent volontairement modestes : les Aseryns demeurent une espèce relativement uniforme."
        },
        {
          "type": "p",
          "text": "Les Paleo￾Atlantes et les Australisiens ne sont pas proposés comme Origines normales de PJ dans ce corpus. Aérilien / Néo-Atlante SR: +1 Agi, +1 Vol • R: +2 Agi, +1 Vol Orientation: Affinité magique, lecture des flux Mûlien SR: +1 Agi, +1 Esp • R: +2 Agi, +1 Esp Orientation: Psychisme, télépathie Hyperboréen SR: +1 Agi, +1 Vig • R: +2 Agi, +1 Vig Orientation: Physique, endurance, explosivité Lémurian SR: +1 Agi, +1 Vol • R: +2 Agi, +1 Vol Orientation: Héritage nymphal et élémentaire Serathèen SR: +1 Agi • R: +2 Agi Orientation: Ascendance composite, Traces multiples Aérilien / Néo-Atlante Empreinte — Résonance d’Aèr SR : +1 Agilité, +1 Volonté. R : +2 Agilité, +1 Volonté. L'Aérilien sent instinctivement une manifestation magique active directement perceptible : il sait que de la magie est présente, sans en connaître automatiquement la source, le domaine ou la puissance. Esprit + Perception permet d'affiner cette impression. Acclimatation arcanique — SR/R : +3 pour résister aux effets nocifs d'un environnement saturé de magie brute ou instable. Ce bonus ne protège pas contre un sort ou un pouvoir ciblé. Lecture des flux — 1 PTV | SR/R — 1 PA Esprit + Perception permet de distinguer la grande nature d'une manifestation : sort actif, rituel, objet imprégné, lieu saturé, portail, etc. Le DR augmente la précision sans révéler automatiquement l'auteur ou tous les mécanismes. Mémoire de résonance — 1 PTV | SR/R Après avoir étudié une signature magique directement perceptible, l'Aérilien peut reconnaître ultérieurement la même signature ou la même source si elle n'a pas été profondément altérée."
        },
        {
          "type": "p",
          "text": "Ancrage d’Aèr — 2 PTV | SR/R — Réaction — 1/Scène Après un échec non narratif à une défense occulte contre un effet explicitement magique ou lié à un Mageius, relancez le 1d10e et conservez le second résultat. Mûlien"
        }
      ]
    },
    {
      "id": "empreinte-etincelle-psychique",
      "title": "Empreinte — Étincelle psychique",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "SR : +1 Agilité, +1 Esprit. R : +2 Agilité, +1 Esprit. En 1 PA, à courte portée, le Mûlien peut envoyer à une cible consentante un mot mental simple, une image, une sensation, une direction ou une intention immédiate. Il ne lit pas l'esprit, ne dialogue pas encore et ne contrôle rien. Présence mentale — SR/R : +3 contre lecture mentale surnaturelle forcée, intrusion télépathique, confusion psychique ou effets similaires visant directement l'esprit."
        },
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:origines-jouables-mulien-empreinte-etincelle-psychique}}"
        }
      ]
    },
    {
      "id": "hyperboreen",
      "title": "Hyperboréen",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "s portent une tradition plus physique ; les Lémurians un rapport plus étroit à certains héritages nymphaux et élémentaires ; les Serathéens rassemblent des lignées très métissées et dispersées. Quelques Paleo-Atlantes existaient déjà avant le cataclysme et ont parfois survécu en stase. Leur réveil peut être plus violent encore que celui d’un ancien Vampire : ils découvrent non seulement une civilisation transformée, mais un monde où leur propre continent est devenu une légende humaine. Civilisation et traditions Les différents peuples aseryns ne forment pas un ensemble politique parfaitement unifié. Plusieurs héritages, couronnes et mémoires se superposent encore. Les Traditions des Treize constituent néanmoins un langage culturel capable de franchir nombre de ces divisions : protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas ou soigner selon Theana restent des références compréhensibles bien au-delà d’une seule branche. Chez les Serathéens d’Amérique du Nord existe notamment le Conseil de la Foudre, tradition régionale marquée par des pratiques chamaniques et un rapport particulier aux Ancêtres. Il ne constitue pas une institution centrale de tous les Aseryns ni une seconde école de Foudre : c’est l’un des nombreux développements culturels apparus après les diasporas. Les Aseryns en 2035 Jamais une société humaine n’a produit autant d’électricité, de réseaux et de systèmes réagissant en fractions de seconde. Le monde moderne peut donc sembler étrangement familier à une physiologie aseryne, tout en restant parfois désespérément lent. Une conversation en Accelyr, une perception électromagnétique ou des réflexes accélérés donnent une relation au quotidien que les Humains ne partagent pas."
        },
        {
          "type": "p",
          "text": "Les Aseryns ne vivent cependant pas tous dans des communautés anciennes. Certains sont pleinement intégrés à la Californie depuis plusieurs générations et connaissent leur héritage surtout par leur famille. Leur civilisation est vieille ; chaque individu conserve pourtant le droit de découvrir le monde comme s’il était neuf, ce qui est probablement l’une des choses les plus fidèles à Serathè. Héritiers de Serathè, pas gardiens d'un musée La civilisation aseryne est ancienne, mais son rapport au passé n'est pas celui d'un peuple condamné à le répéter. Serathè elle-même abandonna un jour ses travaux pour construire une embarcation dérisoire et partir découvrir le monde. Cette curiosité est restée une référence culturelle profonde : quitter une vie devenue stérile, voyager ou recommencer n'est pas nécessairement une trahison de la tradition. Cette disposition explique la manière dont les Aseryns ont survécu aux catastrophes. La disparition d'Atlantide n'a pas produit une seule diaspora mais plusieurs trajectoires. Aériliens et Néo-Atlantes furent marqués par Aèr et sa Magie ; les Mûliens développèrent davantage leur héritage psychique ; les Hyperboréens cultivèrent des traditions plus physiques ; les Lémurians conservèrent des relations particulières avec des héritages nymphaux et élémentaires ; les Serathéens devinrent un ensemble très métissé de lignées dispersées. Ces peuples ne forment pas un État aseryn unique. Ils partagent des mémoires, des références et des traditions, mais leurs histoires ont eu le temps de produire des intérêts différents. L'idée d'une civilisation aseryne homogène appartient souvent davantage au regard extérieur qu'à l'expérience de ceux qui la vivent."
        },
        {
          "type": "p",
          "text": "Les Treize comme langage commun Les Treize Fondateurs ne sont pas des ancêtres biologiques distribuant automatiquement des pouvoirs par le sang. Leurs Traditions sont enseignées. Elles représentent des modèles culturels capables de voyager entre diasporas : gouverner selon Athegos, protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas, créer selon Seryn, nourrir selon Natyel, veiller selon Erith, conserver selon Lisirast, juger selon Lisithas, aimer selon Selerias ou soigner selon Theana. Un Aseryn peut se reconnaître dans plusieurs de ces héritages au cours de sa vie. Leur force vient précisément de ce qu'ils ne réduisent pas une personne à sa naissance. Dans une civilisation où l'espérance de vie se compte en siècles, la possibilité de changer de fonction ou d'idéal n'est pas une exception : elle est une condition pour ne pas devenir prisonnier de sa propre durée. Dratyn occupe une place différente parce qu'elle préserve la Foudre. Tous les Aseryns en portent le potentiel, mais la maîtrise doit être apprise. Les conceptions du Créateur, de l'Esprit, de l'Érosion et de la Fin ne sont pas des alignements moraux. Elles décrivent des manières différentes de comprendre une puissance qui appartient au corps aseryn autant qu'à sa cosmologie. Vivre vite dans un corps qui dure longtemps L'Accelyr révèle l'un des paradoxes les plus étrangers de la physiologie aseryne. Leur système nerveux peut fonctionner à une vitesse qui rend certains échanges impossibles à suivre pour un Humain ordinaire, alors même que leur vie s'étend sur plusieurs siècles. Ils peuvent donc connaître des instants d'une densité exceptionnelle au sein d'existences très longues."
        },
        {
          "type": "p",
          "text": "La société technologique de 2035 produit un environnement qui leur est étrangement adapté : électricité omniprésente, réseaux, champs électromagnétiques et systèmes réagissant en fractions de seconde. Le même monde qui émerveille un Humain par sa vitesse peut encore sembler lent à quelqu'un qui traite naturellement certaines informations autrement. Cette proximité ne signifie pas que tous les Aseryns soient ingénieurs ou passionnés de technologie. Elle donne simplement à leur perception du quotidien une texture différente. Une panne électrique peut être ressentie avant d'être annoncée. Un espace saturé d'équipements possède une présence que d'autres espèces ne perçoivent pas de la même manière. Le Conseil de la Foudre et les Serathéens Le Conseil de la Foudre appartient aux traditions serathéennes d'Amérique du Nord. Ses pratiques, marquées par des approches chamaniques et par le rapport aux Ancêtres, sont importantes pour ces communautés mais ne constituent ni un gouvernement de tous les Aseryns ni une deuxième école universelle de Foudre. Cette distinction est essentielle pour comprendre la diversité aseryne. Une institution régionale peut être très ancienne, puissante et respectée sans devenir le centre naturel d'une civilisation entière. Les Aseryns ont trop de siècles de diasporas pour que toutes leurs histoires tiennent dans un seul Conseil. Les Treize comme langage commun Athegos devait guider ; Sundosia explorer ; Caendis protéger ; Cairiah bâtir ; Eydreas douter et rechercher ; Seryn créer ; Natyel nourrir ; Erith surveiller ; Lisirast préserver ; Dratyn transmettre la Foudre ; Lisithas juger ; Selerias maintenir la cohésion ; Theana soigner."
        },
        {
          "type": "p",
          "text": "Ces fonctions attribuées aux Treize Fondateurs sont devenues des Traditions parce qu'elles décrivaient des besoins qu'aucune catastrophe n'a fait disparaître. La force du système vient précisément de ce qu'il n'est pas biologique. Un enfant ne reçoit pas automatiquement « sa » Tradition par le sang. Il peut être formé, changer de voie ou combiner plusieurs héritages au fil de sa vie. Les lignées familiales influencent naturellement l'éducation, mais elles ne rendent pas une fonction innée. Cette distinction a permis aux différentes diasporas de continuer à se reconnaître après des siècles d'histoires divergentes. Un Hyperboréen et un Néo￾Atlante peuvent désapprouver presque tout de la politique de l'autre et comprendre néanmoins ce que signifie agir selon Caendis ou Theana. Les Treize forment moins un gouvernement qu'un vocabulaire moral et professionnel partagé. Accelyr : une culture à la vitesse du corps L'Accelyr vient d'une physiologie capable de traiter et d'échanger des informations à un rythme qui dépasse facilement les capacités humaines. Entre Aseryns entraînés, une conversation peut paraître faite de ruptures, de gestes et de phrases trop rapides pour un observateur ordinaire. Cette vitesse n'est pas seulement un avantage de combat. Elle a influencé l'éducation, le débat et la manière de travailler collectivement. Une réunion aseryne peut parcourir en quelques minutes une quantité d'hypothèses qui exigerait des heures dans une institution humaine, puis sembler étrangement lente lorsqu'elle doit produire un document compréhensible par des partenaires profanes. Le Voile crée donc un problème quotidien spécifique : vivre dans une société qui pense et parle plus lentement sans transformer cette différence en mépris."
        },
        {
          "type": "p",
          "text": "Les communautés qui travaillent avec des Humains apprennent à ralentir volontairement, à découper leurs raisonnements et à reconnaître que la vitesse cognitive ne remplace ni l'expérience ni la justesse. Les diasporas ne sont pas des castes Les Néo-Atlantes et Aériliens, les Mûliens, les Hyperboréens, les Lémurians et les Serathéens portent des histoires différentes nées des catastrophes et des migrations. Ces noms décrivent des peuples et des trajectoires, pas des spécialisations mécaniques obligatoires. Les Néo-Atlantes conservent une relation particulièrement forte avec Aèr et les héritages magiques qui ont transformé une partie de leur histoire. Les Mûliens ont développé davantage certains héritages psychiques. Les Hyperboréens sont associés à des traditions plus physiques et à des environnements exigeants. Les Lémurians ont entretenu des rapports singuliers avec des héritages nymphaux et élémentaires. Les Serathéens forment des ensembles métissés et dispersés dont les cultures se sont adaptées aux régions où elles ont survécu. Aucune de ces descriptions n'enferme un individu. Des millénaires de rencontres et de déplacements ont produit des familles mêlées, des apprentissages croisés et des personnes qui se reconnaissent dans plusieurs héritages à la fois. Les Paleo-Atlantes et le traumatisme du temps Les rares Paleo-Atlantes ayant survécu en stase représentent une fracture plus profonde que la simple ancienneté. Ils ont connu une civilisation dont les autres Aseryns parlent déjà comme d'une histoire fondatrice. Leur réveil signifie découvrir que des institutions, des paysages et parfois des catégories entières de pensée ont disparu. Ils ne sont pas automatiquement plus sages."
        },
        {
          "type": "p",
          "text": "Comme les Vampires réveillés après une longue torpeur, ils peuvent être extraordinairement compétents dans un monde qui n'existe plus et profondément démunis devant ce qui est devenu banal. Leur présence est précieuse pour les archives et dangereuse pour les mythes : un témoin direct peut confirmer certaines légendes et en détruire d'autres simplement en se souvenant autrement. Le Conseil de la Foudre, une réponse serathéenne En Amérique du Nord, certains Serathéens ont développé le Conseil de la Foudre, tradition régionale marquée par les Ancêtres et des pratiques chamaniques nées de leur histoire locale. Il possède une importance réelle pour ces communautés et peut jouer un rôle politique ou spirituel majeur dans leurs affaires. Il ne représente cependant ni tous les Aseryns ni une seconde autorité universelle parallèle aux Treize. Un Mûlien ou un Néo-Atlante peut connaître son existence sans lui devoir la moindre obéissance. Cette modestie d'échelle rend le Conseil plus crédible : c'est une institution née d'une diaspora particulière, pas la réponse automatique de toute une espèce à chaque problème moderne. Nature aseryne Les Aseryns sont une espèce ssrynnesque propre à la Terre, créée par Serathè. Leur apparence converge fortement avec celle des humains, mais leur anatomie interne, leur métabolisme, leur système nerveux et leur activité électromusculaire diffèrent profondément. Leur longévité se compte normalement en siècles. Leur identité mécanique ne repose pas sur une longue liste de pouvoirs innés. Elle repose sur un socle racial commun, de petites particularités d'origine, puis sur des Traditions apprises."
        },
        {
          "type": "p",
          "text": "Un Aseryn peu intéressé par la Foudre doit disposer d'autant de choix structurants qu'un Aseryn qui en fait sa spécialité. Voile, Semi-Révélation et Révélation État Modificateur commun Voilé (V) Aucun modificateur racial commun. Semi-Révélé (SR) +1 Agilité. Révélé (R) +2 Agilité. Ces modificateurs représentent la véritable vitesse neuromusculaire de l'Aseryn. Ils s'ajoutent aux éventuels modificateurs de l'Origine. Ils n'accordent pas, à eux seuls, de PA supplémentaires automatiques : les PA restent déterminés par le jet d'Initiative normal. Variation de Vigueur et Points de Vie Lorsqu'une forme modifie la Vigueur, les PV maximum et les PV actuels varient immédiatement de 2 × la variation de Vigueur. Une diminution de Vigueur ne peut toutefois pas, à elle seule, faire passer un personnage qui possédait encore des PV positifs sous 1 PV. Un changement de forme ne constitue jamais une méthode de soin : il ne restitue pas des blessures déjà subies. Le supplément de PV représente uniquement la robustesse momentanée du corps plus vigoureux. Traits communs gratuits Accelyr Tous les Aseryns comprennent l'Accelyr, une langue parlée à une vitesse que l'oreille et le cerveau humains ne peuvent normalement pas suivre. L'Accelyr ne donne aucun bonus chiffré par lui￾même ; il permet surtout une communication extrêmement rapide entre Aseryns et sert souvent de signe de reconnaissance culturelle. Physiologie aseryne Longévité exceptionnelle, activité neuromusculaire rapide et activité électrique corporelle supérieure font partie de la physiologie de l'espèce. Ces éléments sont principalement narratifs tant qu'un Talent ne leur donne pas un effet précis."
        },
        {
          "type": "p",
          "text": "La physiologie aseryne n'accorde pas de résistance universelle aux maladies, poisons ou fatigues. Sens électromagnétique SR/R — Passif. L'Aseryn perçoit les sources électromagnétiques significatives, les courants importants, les anomalies magnétiques marquées et les variations soudaines du champ environnant. En se concentrant 1 PA, il peut effectuer Esprit + Perception + 1d10e afin d'obtenir une direction, une proximité approximative et la nature générale de la source. Ce sens ne lit pas des données, ne remplace pas un scanner, ne révèle pas automatiquement tous les êtres vivants derrière les murs et peut être perturbé par un blindage, un brouillage ou un environnement électromagnétique saturé. Potentiel foudroyant Tout Aseryn possède biologiquement le potentiel d'apprendre à maîtriser la Foudre. Ce potentiel n'est pas une Affinité achetée en PTV et n'est pas binaire. Chez un PJ, on considère par défaut une affinité moyenne : il peut apprendre, mais cela demande un véritable enseignement et du temps. Certaines lignées ou individus exceptionnels apprennent beaucoup plus vite, voire manifestent spontanément la Foudre. Ces prodiges relèvent du lore et des PNJ extraordinaires ; ils ne constituent pas le profil normal d'un PJ. Routes communes aserynes Les trois routes suivantes approfondissent des capacités présentes chez tous les Aseryns. Elles sont indépendantes des Origines et des Traditions des Fondateurs. Vivacité aseryne Départ fulgurant — 1 PTV | SR/R — Passif Après avoir déterminé normalement le nombre de PA du personnage, ajoutez +3 à son score d'Initiative uniquement pour déterminer son ordre d'action dans les passes. Ce bonus ne modifie jamais le nombre de PA obtenu."
        },
        {
          "type": "p",
          "text": "Réflexe impossible — 2 PTV | Prérequis : Départ fulgurant | SR/R — Réaction Lorsqu’il est Surpris, l’Aseryn peut malgré tout dépenser 1 PA pour effectuer une Défense active contre une attaque dont il a conscience. Il reste Surpris pour les autres effets applicables. Surcadence nerveuse — 3 PTV | Prérequis : Réflexe impossible | SR/R — Réaction — 1/Scène L'Aseryn gagne immédiatement 1 PA utilisable avant la fin du round. Ce PA ne peut servir qu'à un Déplacement, une Défense active ou une action significative non offensive. Il ne peut pas servir à attaquer, activer un pouvoir offensif ou déclencher une chaîne de gains de PA. Esprit fulgurant Traitement accéléré — 1 PTV | SR/R — 1/Scène Sur une tâche intellectuelle où le temps supplémentaire ne sert qu'à réfléchir, calculer ou comparer des informations déjà disponibles, l'Aseryn peut bénéficier de Prendre son temps sans consommer le délai supplémentaire. Pensée parallèle — 1 PTV | SR/R — Passif L'Aseryn peut conserver une activité mentale simple en arrière-plan pendant qu'il agit : garder un compte, suivre plusieurs communications, poursuivre une comparaison simple ou maintenir un bref échange Accelyr. Cela n'autorise jamais deux tests simultanés, deux actions, deux pouvoirs maintenus ou deux concentrations complexes. Décision fulgurante — 2 PTV | Prérequis : Traitement accéléré | SR/R — 1/Scène Après un échec non narratif à un test reposant principalement sur Esprit, relancez le 1d10e et conservez le second résultat. Perception électromagnétique Lecture de champ — 1 PTV | SR/R Lors d'une utilisation focalisée du Sens électromagnétique, l'Aseryn bénéficie de +3 pour déterminer la nature, l'intensité et l'origine probable d'un phénomène électromagnétique."
        },
        {
          "type": "p",
          "text": "Cartographie inductive — 2 PTV | SR/R — 1 PA Dans un rayon d'environ 10 m, l'Aseryn peut dresser une cartographie grossière des câbles actifs, machines alimentées et principales sources électromagnétiques à travers des obstacles ordinaires. Il n'en lit ni le contenu ni la fonction exacte. Signature électrique — 2 PTV | SR/R Après avoir étudié une machine, un artefact alimenté ou une source énergétique, l'Aseryn peut mémoriser sa signature électromagnétique et la reconnaître ultérieurement si elle reste suffisamment similaire. Perception neuromotrice — 3 PTV | SR/R À très courte portée, lorsqu'il sait qu'une cible est présente, l'Aseryn peut percevoir le déclenchement de mouvements reposant sur une activité nerveuse ou électromécanique détectable. Les pénalités provenant uniquement de l'impossibilité de voir son mouvement ne s'appliquent pas à ses Défenses contre elle. Une fois par scène, il peut en outre recevoir +3 à une Défense active contre une telle cible. Blindage, brouillage ou absence de signature pertinente peuvent neutraliser ce Talent. Origines jouables Les Origines décrivent des branches historiques et biologiques de l'espèce. Les différences restent volontairement modestes : les Aseryns demeurent une espèce relativement uniforme. Les Paleo￾Atlantes et les Australisiens ne sont pas proposés comme Origines normales de PJ dans ce corpus."
        },
        {
          "type": "p",
          "text": "Aérilien / Néo-Atlante SR: +1 Agi, +1 Vol • R: +2 Agi, +1 Vol Orientation: Affinité magique, lecture des flux Mûlien SR: +1 Agi, +1 Esp • R: +2 Agi, +1 Esp Orientation: Psychisme, télépathie Hyperboréen SR: +1 Agi, +1 Vig • R: +2 Agi, +1 Vig Orientation: Physique, endurance, explosivité Lémurian SR: +1 Agi, +1 Vol • R: +2 Agi, +1 Vol Orientation: Héritage nymphal et élémentaire Serathèen SR: +1 Agi • R: +2 Agi Orientation: Ascendance composite, Traces multiples Aérilien / Néo-Atlante Empreinte — Résonance d’Aèr SR : +1 Agilité, +1 Volonté. R : +2 Agilité, +1 Volonté. L'Aérilien sent instinctivement une manifestation magique active directement perceptible : il sait que de la magie est présente, sans en connaître automatiquement la source, le domaine ou la puissance. Esprit + Perception permet d'affiner cette impression. Acclimatation arcanique — SR/R : +3 pour résister aux effets nocifs d'un environnement saturé de magie brute ou instable. Ce bonus ne protège pas contre un sort ou un pouvoir ciblé. Lecture des flux — 1 PTV | SR/R — 1 PA Esprit + Perception permet de distinguer la grande nature d'une manifestation : sort actif, rituel, objet imprégné, lieu saturé, portail, etc. Le DR augmente la précision sans révéler automatiquement l'auteur ou tous les mécanismes. Mémoire de résonance — 1 PTV | SR/R Après avoir étudié une signature magique directement perceptible, l'Aérilien peut reconnaître ultérieurement la même signature ou la même source si elle n'a pas été profondément altérée. Ancrage d’Aèr — 2 PTV | SR/R — Réaction — 1/Scène Après un échec non narratif à une défense occulte contre un effet explicitement magique ou lié à un Mageius, relancez le 1d10e et conservez le second résultat."
        },
        {
          "type": "p",
          "text": "Mûlien Empreinte — Étincelle psychique SR : +1 Agilité, +1 Esprit. R : +2 Agilité, +1 Esprit. En 1 PA, à courte portée, le Mûlien peut envoyer à une cible consentante un mot mental simple, une image, une sensation, une direction ou une intention immédiate. Il ne lit pas l'esprit, ne dialogue pas encore et ne contrôle rien. Présence mentale — SR/R : +3 contre lecture mentale surnaturelle forcée, intrusion télépathique, confusion psychique ou effets similaires visant directement l'esprit. Télépathie mûlienne — 1 PTV | SR/R — 1 PA — Scène L'Étincelle psychique devient une communication bidirectionnelle avec une cible consentante, tant que les conditions de portée et de contact mental sont maintenues. Perception mentale — 1 PTV | SR/R — 1 PA Esprit + Perception permet de sentir approximativement la présence de consciences proches. Le Talent ne révèle ni pensées ni identité et ne produit pas une cartographie exacte à travers les murs. Une dissimulation ou défense occulte peut s'y opposer. Effleurement de pensée — 2 PTV | Prérequis : Télépathie mûlienne | SR/R — 1 PA Volonté + Maîtrise spirituelle contre la Défense occulte de la cible. En réussite, le Mûlien perçoit la pensée consciente dominante ou l'intention immédiate, jamais des souvenirs complets, des secrets profonds ou l'ensemble de l'esprit. Réseau mûlien — 3 PTV | Prérequis : Télépathie mûlienne | SR/R — 1 PA — Scène Jusqu'à trois participants consentants peuvent partager un réseau mental tant qu'ils restent dans la même zone opérationnelle et que la liaison n'est pas rompue. Hyperboréen"
        }
      ]
    },
    {
      "id": "empreinte-corps-hyperboreen",
      "title": "Empreinte — Corps hyperboréen",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "SR : +1 Agilité, +1 Vigueur. R : +2 Agilité, +1 Vigueur. SR/R : +3 pour résister à la fatigue physique, à l'effort prolongé, au froid naturel et aux conditions corporelles hostiles comparables. Ce bonus ne protège pas automatiquement contre une attaque surnaturelle de glace ou de froid."
        },
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:origines-jouables-hyperboreen-empreinte-corps-hyperboreen}}"
        }
      ]
    },
    {
      "id": "lemurian",
      "title": "Lémurian",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "s un rapport plus étroit à certains héritages nymphaux et élémentaires ; les Serathéens rassemblent des lignées très métissées et dispersées. Quelques Paleo-Atlantes existaient déjà avant le cataclysme et ont parfois survécu en stase. Leur réveil peut être plus violent encore que celui d’un ancien Vampire : ils découvrent non seulement une civilisation transformée, mais un monde où leur propre continent est devenu une légende humaine. Civilisation et traditions Les différents peuples aseryns ne forment pas un ensemble politique parfaitement unifié. Plusieurs héritages, couronnes et mémoires se superposent encore. Les Traditions des Treize constituent néanmoins un langage culturel capable de franchir nombre de ces divisions : protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas ou soigner selon Theana restent des références compréhensibles bien au-delà d’une seule branche. Chez les Serathéens d’Amérique du Nord existe notamment le Conseil de la Foudre, tradition régionale marquée par des pratiques chamaniques et un rapport particulier aux Ancêtres. Il ne constitue pas une institution centrale de tous les Aseryns ni une seconde école de Foudre : c’est l’un des nombreux développements culturels apparus après les diasporas. Les Aseryns en 2035 Jamais une société humaine n’a produit autant d’électricité, de réseaux et de systèmes réagissant en fractions de seconde. Le monde moderne peut donc sembler étrangement familier à une physiologie aseryne, tout en restant parfois désespérément lent. Une conversation en Accelyr, une perception électromagnétique ou des réflexes accélérés donnent une relation au quotidien que les Humains ne partagent pas."
        },
        {
          "type": "p",
          "text": "Les Aseryns ne vivent cependant pas tous dans des communautés anciennes. Certains sont pleinement intégrés à la Californie depuis plusieurs générations et connaissent leur héritage surtout par leur famille. Leur civilisation est vieille ; chaque individu conserve pourtant le droit de découvrir le monde comme s’il était neuf, ce qui est probablement l’une des choses les plus fidèles à Serathè. Héritiers de Serathè, pas gardiens d'un musée La civilisation aseryne est ancienne, mais son rapport au passé n'est pas celui d'un peuple condamné à le répéter. Serathè elle-même abandonna un jour ses travaux pour construire une embarcation dérisoire et partir découvrir le monde. Cette curiosité est restée une référence culturelle profonde : quitter une vie devenue stérile, voyager ou recommencer n'est pas nécessairement une trahison de la tradition. Cette disposition explique la manière dont les Aseryns ont survécu aux catastrophes. La disparition d'Atlantide n'a pas produit une seule diaspora mais plusieurs trajectoires. Aériliens et Néo-Atlantes furent marqués par Aèr et sa Magie ; les Mûliens développèrent davantage leur héritage psychique ; les Hyperboréens cultivèrent des traditions plus physiques ; les Lémurians conservèrent des relations particulières avec des héritages nymphaux et élémentaires ; les Serathéens devinrent un ensemble très métissé de lignées dispersées. Ces peuples ne forment pas un État aseryn unique. Ils partagent des mémoires, des références et des traditions, mais leurs histoires ont eu le temps de produire des intérêts différents. L'idée d'une civilisation aseryne homogène appartient souvent davantage au regard extérieur qu'à l'expérience de ceux qui la vivent."
        },
        {
          "type": "p",
          "text": "Les Treize comme langage commun Les Treize Fondateurs ne sont pas des ancêtres biologiques distribuant automatiquement des pouvoirs par le sang. Leurs Traditions sont enseignées. Elles représentent des modèles culturels capables de voyager entre diasporas : gouverner selon Athegos, protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas, créer selon Seryn, nourrir selon Natyel, veiller selon Erith, conserver selon Lisirast, juger selon Lisithas, aimer selon Selerias ou soigner selon Theana. Un Aseryn peut se reconnaître dans plusieurs de ces héritages au cours de sa vie. Leur force vient précisément de ce qu'ils ne réduisent pas une personne à sa naissance. Dans une civilisation où l'espérance de vie se compte en siècles, la possibilité de changer de fonction ou d'idéal n'est pas une exception : elle est une condition pour ne pas devenir prisonnier de sa propre durée. Dratyn occupe une place différente parce qu'elle préserve la Foudre. Tous les Aseryns en portent le potentiel, mais la maîtrise doit être apprise. Les conceptions du Créateur, de l'Esprit, de l'Érosion et de la Fin ne sont pas des alignements moraux. Elles décrivent des manières différentes de comprendre une puissance qui appartient au corps aseryn autant qu'à sa cosmologie. Vivre vite dans un corps qui dure longtemps L'Accelyr révèle l'un des paradoxes les plus étrangers de la physiologie aseryne. Leur système nerveux peut fonctionner à une vitesse qui rend certains échanges impossibles à suivre pour un Humain ordinaire, alors même que leur vie s'étend sur plusieurs siècles. Ils peuvent donc connaître des instants d'une densité exceptionnelle au sein d'existences très longues."
        },
        {
          "type": "p",
          "text": "La société technologique de 2035 produit un environnement qui leur est étrangement adapté : électricité omniprésente, réseaux, champs électromagnétiques et systèmes réagissant en fractions de seconde. Le même monde qui émerveille un Humain par sa vitesse peut encore sembler lent à quelqu'un qui traite naturellement certaines informations autrement. Cette proximité ne signifie pas que tous les Aseryns soient ingénieurs ou passionnés de technologie. Elle donne simplement à leur perception du quotidien une texture différente. Une panne électrique peut être ressentie avant d'être annoncée. Un espace saturé d'équipements possède une présence que d'autres espèces ne perçoivent pas de la même manière. Le Conseil de la Foudre et les Serathéens Le Conseil de la Foudre appartient aux traditions serathéennes d'Amérique du Nord. Ses pratiques, marquées par des approches chamaniques et par le rapport aux Ancêtres, sont importantes pour ces communautés mais ne constituent ni un gouvernement de tous les Aseryns ni une deuxième école universelle de Foudre. Cette distinction est essentielle pour comprendre la diversité aseryne. Une institution régionale peut être très ancienne, puissante et respectée sans devenir le centre naturel d'une civilisation entière. Les Aseryns ont trop de siècles de diasporas pour que toutes leurs histoires tiennent dans un seul Conseil. Les Treize comme langage commun Athegos devait guider ; Sundosia explorer ; Caendis protéger ; Cairiah bâtir ; Eydreas douter et rechercher ; Seryn créer ; Natyel nourrir ; Erith surveiller ; Lisirast préserver ; Dratyn transmettre la Foudre ; Lisithas juger ; Selerias maintenir la cohésion ; Theana soigner."
        },
        {
          "type": "p",
          "text": "Ces fonctions attribuées aux Treize Fondateurs sont devenues des Traditions parce qu'elles décrivaient des besoins qu'aucune catastrophe n'a fait disparaître. La force du système vient précisément de ce qu'il n'est pas biologique. Un enfant ne reçoit pas automatiquement « sa » Tradition par le sang. Il peut être formé, changer de voie ou combiner plusieurs héritages au fil de sa vie. Les lignées familiales influencent naturellement l'éducation, mais elles ne rendent pas une fonction innée. Cette distinction a permis aux différentes diasporas de continuer à se reconnaître après des siècles d'histoires divergentes. Un Hyperboréen et un Néo￾Atlante peuvent désapprouver presque tout de la politique de l'autre et comprendre néanmoins ce que signifie agir selon Caendis ou Theana. Les Treize forment moins un gouvernement qu'un vocabulaire moral et professionnel partagé. Accelyr : une culture à la vitesse du corps L'Accelyr vient d'une physiologie capable de traiter et d'échanger des informations à un rythme qui dépasse facilement les capacités humaines. Entre Aseryns entraînés, une conversation peut paraître faite de ruptures, de gestes et de phrases trop rapides pour un observateur ordinaire. Cette vitesse n'est pas seulement un avantage de combat. Elle a influencé l'éducation, le débat et la manière de travailler collectivement. Une réunion aseryne peut parcourir en quelques minutes une quantité d'hypothèses qui exigerait des heures dans une institution humaine, puis sembler étrangement lente lorsqu'elle doit produire un document compréhensible par des partenaires profanes. Le Voile crée donc un problème quotidien spécifique : vivre dans une société qui pense et parle plus lentement sans transformer cette différence en mépris."
        },
        {
          "type": "p",
          "text": "Les communautés qui travaillent avec des Humains apprennent à ralentir volontairement, à découper leurs raisonnements et à reconnaître que la vitesse cognitive ne remplace ni l'expérience ni la justesse. Les diasporas ne sont pas des castes Les Néo-Atlantes et Aériliens, les Mûliens, les Hyperboréens, les Lémurians et les Serathéens portent des histoires différentes nées des catastrophes et des migrations. Ces noms décrivent des peuples et des trajectoires, pas des spécialisations mécaniques obligatoires. Les Néo-Atlantes conservent une relation particulièrement forte avec Aèr et les héritages magiques qui ont transformé une partie de leur histoire. Les Mûliens ont développé davantage certains héritages psychiques. Les Hyperboréens sont associés à des traditions plus physiques et à des environnements exigeants. Les Lémurians ont entretenu des rapports singuliers avec des héritages nymphaux et élémentaires. Les Serathéens forment des ensembles métissés et dispersés dont les cultures se sont adaptées aux régions où elles ont survécu. Aucune de ces descriptions n'enferme un individu. Des millénaires de rencontres et de déplacements ont produit des familles mêlées, des apprentissages croisés et des personnes qui se reconnaissent dans plusieurs héritages à la fois. Les Paleo-Atlantes et le traumatisme du temps Les rares Paleo-Atlantes ayant survécu en stase représentent une fracture plus profonde que la simple ancienneté. Ils ont connu une civilisation dont les autres Aseryns parlent déjà comme d'une histoire fondatrice. Leur réveil signifie découvrir que des institutions, des paysages et parfois des catégories entières de pensée ont disparu. Ils ne sont pas automatiquement plus sages."
        },
        {
          "type": "p",
          "text": "Comme les Vampires réveillés après une longue torpeur, ils peuvent être extraordinairement compétents dans un monde qui n'existe plus et profondément démunis devant ce qui est devenu banal. Leur présence est précieuse pour les archives et dangereuse pour les mythes : un témoin direct peut confirmer certaines légendes et en détruire d'autres simplement en se souvenant autrement. Le Conseil de la Foudre, une réponse serathéenne En Amérique du Nord, certains Serathéens ont développé le Conseil de la Foudre, tradition régionale marquée par les Ancêtres et des pratiques chamaniques nées de leur histoire locale. Il possède une importance réelle pour ces communautés et peut jouer un rôle politique ou spirituel majeur dans leurs affaires. Il ne représente cependant ni tous les Aseryns ni une seconde autorité universelle parallèle aux Treize. Un Mûlien ou un Néo-Atlante peut connaître son existence sans lui devoir la moindre obéissance. Cette modestie d'échelle rend le Conseil plus crédible : c'est une institution née d'une diaspora particulière, pas la réponse automatique de toute une espèce à chaque problème moderne. Nature aseryne Les Aseryns sont une espèce ssrynnesque propre à la Terre, créée par Serathè. Leur apparence converge fortement avec celle des humains, mais leur anatomie interne, leur métabolisme, leur système nerveux et leur activité électromusculaire diffèrent profondément. Leur longévité se compte normalement en siècles. Leur identité mécanique ne repose pas sur une longue liste de pouvoirs innés. Elle repose sur un socle racial commun, de petites particularités d'origine, puis sur des Traditions apprises."
        },
        {
          "type": "p",
          "text": "Un Aseryn peu intéressé par la Foudre doit disposer d'autant de choix structurants qu'un Aseryn qui en fait sa spécialité. Voile, Semi-Révélation et Révélation État Modificateur commun Voilé (V) Aucun modificateur racial commun. Semi-Révélé (SR) +1 Agilité. Révélé (R) +2 Agilité. Ces modificateurs représentent la véritable vitesse neuromusculaire de l'Aseryn. Ils s'ajoutent aux éventuels modificateurs de l'Origine. Ils n'accordent pas, à eux seuls, de PA supplémentaires automatiques : les PA restent déterminés par le jet d'Initiative normal. Variation de Vigueur et Points de Vie Lorsqu'une forme modifie la Vigueur, les PV maximum et les PV actuels varient immédiatement de 2 × la variation de Vigueur. Une diminution de Vigueur ne peut toutefois pas, à elle seule, faire passer un personnage qui possédait encore des PV positifs sous 1 PV. Un changement de forme ne constitue jamais une méthode de soin : il ne restitue pas des blessures déjà subies. Le supplément de PV représente uniquement la robustesse momentanée du corps plus vigoureux. Traits communs gratuits Accelyr Tous les Aseryns comprennent l'Accelyr, une langue parlée à une vitesse que l'oreille et le cerveau humains ne peuvent normalement pas suivre. L'Accelyr ne donne aucun bonus chiffré par lui￾même ; il permet surtout une communication extrêmement rapide entre Aseryns et sert souvent de signe de reconnaissance culturelle. Physiologie aseryne Longévité exceptionnelle, activité neuromusculaire rapide et activité électrique corporelle supérieure font partie de la physiologie de l'espèce. Ces éléments sont principalement narratifs tant qu'un Talent ne leur donne pas un effet précis."
        },
        {
          "type": "p",
          "text": "La physiologie aseryne n'accorde pas de résistance universelle aux maladies, poisons ou fatigues. Sens électromagnétique SR/R — Passif. L'Aseryn perçoit les sources électromagnétiques significatives, les courants importants, les anomalies magnétiques marquées et les variations soudaines du champ environnant. En se concentrant 1 PA, il peut effectuer Esprit + Perception + 1d10e afin d'obtenir une direction, une proximité approximative et la nature générale de la source. Ce sens ne lit pas des données, ne remplace pas un scanner, ne révèle pas automatiquement tous les êtres vivants derrière les murs et peut être perturbé par un blindage, un brouillage ou un environnement électromagnétique saturé. Potentiel foudroyant Tout Aseryn possède biologiquement le potentiel d'apprendre à maîtriser la Foudre. Ce potentiel n'est pas une Affinité achetée en PTV et n'est pas binaire. Chez un PJ, on considère par défaut une affinité moyenne : il peut apprendre, mais cela demande un véritable enseignement et du temps. Certaines lignées ou individus exceptionnels apprennent beaucoup plus vite, voire manifestent spontanément la Foudre. Ces prodiges relèvent du lore et des PNJ extraordinaires ; ils ne constituent pas le profil normal d'un PJ. Routes communes aserynes Les trois routes suivantes approfondissent des capacités présentes chez tous les Aseryns. Elles sont indépendantes des Origines et des Traditions des Fondateurs. Vivacité aseryne Départ fulgurant — 1 PTV | SR/R — Passif Après avoir déterminé normalement le nombre de PA du personnage, ajoutez +3 à son score d'Initiative uniquement pour déterminer son ordre d'action dans les passes. Ce bonus ne modifie jamais le nombre de PA obtenu."
        },
        {
          "type": "p",
          "text": "Réflexe impossible — 2 PTV | Prérequis : Départ fulgurant | SR/R — Réaction Lorsqu’il est Surpris, l’Aseryn peut malgré tout dépenser 1 PA pour effectuer une Défense active contre une attaque dont il a conscience. Il reste Surpris pour les autres effets applicables. Surcadence nerveuse — 3 PTV | Prérequis : Réflexe impossible | SR/R — Réaction — 1/Scène L'Aseryn gagne immédiatement 1 PA utilisable avant la fin du round. Ce PA ne peut servir qu'à un Déplacement, une Défense active ou une action significative non offensive. Il ne peut pas servir à attaquer, activer un pouvoir offensif ou déclencher une chaîne de gains de PA. Esprit fulgurant Traitement accéléré — 1 PTV | SR/R — 1/Scène Sur une tâche intellectuelle où le temps supplémentaire ne sert qu'à réfléchir, calculer ou comparer des informations déjà disponibles, l'Aseryn peut bénéficier de Prendre son temps sans consommer le délai supplémentaire. Pensée parallèle — 1 PTV | SR/R — Passif L'Aseryn peut conserver une activité mentale simple en arrière-plan pendant qu'il agit : garder un compte, suivre plusieurs communications, poursuivre une comparaison simple ou maintenir un bref échange Accelyr. Cela n'autorise jamais deux tests simultanés, deux actions, deux pouvoirs maintenus ou deux concentrations complexes. Décision fulgurante — 2 PTV | Prérequis : Traitement accéléré | SR/R — 1/Scène Après un échec non narratif à un test reposant principalement sur Esprit, relancez le 1d10e et conservez le second résultat. Perception électromagnétique Lecture de champ — 1 PTV | SR/R Lors d'une utilisation focalisée du Sens électromagnétique, l'Aseryn bénéficie de +3 pour déterminer la nature, l'intensité et l'origine probable d'un phénomène électromagnétique."
        },
        {
          "type": "p",
          "text": "Cartographie inductive — 2 PTV | SR/R — 1 PA Dans un rayon d'environ 10 m, l'Aseryn peut dresser une cartographie grossière des câbles actifs, machines alimentées et principales sources électromagnétiques à travers des obstacles ordinaires. Il n'en lit ni le contenu ni la fonction exacte. Signature électrique — 2 PTV | SR/R Après avoir étudié une machine, un artefact alimenté ou une source énergétique, l'Aseryn peut mémoriser sa signature électromagnétique et la reconnaître ultérieurement si elle reste suffisamment similaire. Perception neuromotrice — 3 PTV | SR/R À très courte portée, lorsqu'il sait qu'une cible est présente, l'Aseryn peut percevoir le déclenchement de mouvements reposant sur une activité nerveuse ou électromécanique détectable. Les pénalités provenant uniquement de l'impossibilité de voir son mouvement ne s'appliquent pas à ses Défenses contre elle. Une fois par scène, il peut en outre recevoir +3 à une Défense active contre une telle cible. Blindage, brouillage ou absence de signature pertinente peuvent neutraliser ce Talent. Origines jouables Les Origines décrivent des branches historiques et biologiques de l'espèce. Les différences restent volontairement modestes : les Aseryns demeurent une espèce relativement uniforme. Les Paleo￾Atlantes et les Australisiens ne sont pas proposés comme Origines normales de PJ dans ce corpus."
        },
        {
          "type": "p",
          "text": "Aérilien / Néo-Atlante SR: +1 Agi, +1 Vol • R: +2 Agi, +1 Vol Orientation: Affinité magique, lecture des flux Mûlien SR: +1 Agi, +1 Esp • R: +2 Agi, +1 Esp Orientation: Psychisme, télépathie Hyperboréen SR: +1 Agi, +1 Vig • R: +2 Agi, +1 Vig Orientation: Physique, endurance, explosivité Lémurian SR: +1 Agi, +1 Vol • R: +2 Agi, +1 Vol Orientation: Héritage nymphal et élémentaire Serathèen SR: +1 Agi • R: +2 Agi Orientation: Ascendance composite, Traces multiples Aérilien / Néo-Atlante Empreinte — Résonance d’Aèr SR : +1 Agilité, +1 Volonté. R : +2 Agilité, +1 Volonté. L'Aérilien sent instinctivement une manifestation magique active directement perceptible : il sait que de la magie est présente, sans en connaître automatiquement la source, le domaine ou la puissance. Esprit + Perception permet d'affiner cette impression. Acclimatation arcanique — SR/R : +3 pour résister aux effets nocifs d'un environnement saturé de magie brute ou instable. Ce bonus ne protège pas contre un sort ou un pouvoir ciblé. Lecture des flux — 1 PTV | SR/R — 1 PA Esprit + Perception permet de distinguer la grande nature d'une manifestation : sort actif, rituel, objet imprégné, lieu saturé, portail, etc. Le DR augmente la précision sans révéler automatiquement l'auteur ou tous les mécanismes. Mémoire de résonance — 1 PTV | SR/R Après avoir étudié une signature magique directement perceptible, l'Aérilien peut reconnaître ultérieurement la même signature ou la même source si elle n'a pas été profondément altérée. Ancrage d’Aèr — 2 PTV | SR/R — Réaction — 1/Scène Après un échec non narratif à une défense occulte contre un effet explicitement magique ou lié à un Mageius, relancez le 1d10e et conservez le second résultat."
        },
        {
          "type": "p",
          "text": "Mûlien Empreinte — Étincelle psychique SR : +1 Agilité, +1 Esprit. R : +2 Agilité, +1 Esprit. En 1 PA, à courte portée, le Mûlien peut envoyer à une cible consentante un mot mental simple, une image, une sensation, une direction ou une intention immédiate. Il ne lit pas l'esprit, ne dialogue pas encore et ne contrôle rien. Présence mentale — SR/R : +3 contre lecture mentale surnaturelle forcée, intrusion télépathique, confusion psychique ou effets similaires visant directement l'esprit. Télépathie mûlienne — 1 PTV | SR/R — 1 PA — Scène L'Étincelle psychique devient une communication bidirectionnelle avec une cible consentante, tant que les conditions de portée et de contact mental sont maintenues. Perception mentale — 1 PTV | SR/R — 1 PA Esprit + Perception permet de sentir approximativement la présence de consciences proches. Le Talent ne révèle ni pensées ni identité et ne produit pas une cartographie exacte à travers les murs. Une dissimulation ou défense occulte peut s'y opposer. Effleurement de pensée — 2 PTV | Prérequis : Télépathie mûlienne | SR/R — 1 PA Volonté + Maîtrise spirituelle contre la Défense occulte de la cible. En réussite, le Mûlien perçoit la pensée consciente dominante ou l'intention immédiate, jamais des souvenirs complets, des secrets profonds ou l'ensemble de l'esprit. Réseau mûlien — 3 PTV | Prérequis : Télépathie mûlienne | SR/R — 1 PA — Scène Jusqu'à trois participants consentants peuvent partager un réseau mental tant qu'ils restent dans la même zone opérationnelle et que la liaison n'est pas rompue. Hyperboréen Empreinte — Corps hyperboréen SR : +1 Agilité, +1 Vigueur. R : +2 Agilité, +1 Vigueur."
        },
        {
          "type": "p",
          "text": "SR/R : +3 pour résister à la fatigue physique, à l'effort prolongé, au froid naturel et aux conditions corporelles hostiles comparables. Ce bonus ne protège pas automatiquement contre une attaque surnaturelle de glace ou de froid. Détente hyperboréenne — 1 PTV | SR/R — 1/round Lors d'un Déplacement, l'Hyperboréen peut parcourir 2 m supplémentaires. Ce bonus est additif, jamais multiplicatif. Appuis du Nord — 1 PTV | SR/R +3 pour résister à une saisie, un renversement ou un déplacement physique forcé. Percussion — 2 PTV | R — 1/round Après avoir volontairement parcouru au moins 3 m avant une attaque de mêlée réussie, choisissez : +2 DGT, ou repousser la cible de 2 m si sa morphologie et la situation le permettent. Réflexe de duel — 2 PTV | R — 1/round Après une Défense active réussie contre une attaque de mêlée, l'Hyperboréen peut immédiatement se repositionner de 2 m vers une position valide. Ce n'est pas un Déplacement complet. Exploit physique — 3 PTV | SR/R — 1/Scène Après un échec non narratif à un test reposant principalement sur des capacités physiques, relancez le 1d10e et conservez le second résultat. Lémurian"
        }
      ]
    },
    {
      "id": "empreinte-heritage-nymphal",
      "title": "Empreinte — Héritage nymphal",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "SR : +1 Agilité, +1 Volonté. R : +2 Agilité, +1 Volonté. Choisissez une Résonance élémentaire héritée de l'ascendance nymphale : Air, Eau, Terre ou Feu. L'Aseryn sent intuitivement les manifestations significatives de cet élément et reçoit +3 pour résister aux conditions naturelles ordinaires directement liées à celui-ci. Ce bonus ne réduit pas automatiquement les dégâts d'une attaque surnaturelle."
        },
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:origines-jouables-lemurian-empreinte-heritage-nymphal}}"
        }
      ]
    },
    {
      "id": "seratheen",
      "title": "Serathèen",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "SR: +1 Agi • R: +2 Agi Orientation: Ascendance composite, Traces multiples Aérilien / Néo-Atlante Empreinte — Résonance d’Aèr SR : +1 Agilité, +1 Volonté. R : +2 Agilité, +1 Volonté. L'Aérilien sent instinctivement une manifestation magique active directement perceptible : il sait que de la magie est présente, sans en connaître automatiquement la source, le domaine ou la puissance. Esprit + Perception permet d'affiner cette impression. Acclimatation arcanique — SR/R : +3 pour résister aux effets nocifs d'un environnement saturé de magie brute ou instable. Ce bonus ne protège pas contre un sort ou un pouvoir ciblé. Lecture des flux — 1 PTV | SR/R — 1 PA Esprit + Perception permet de distinguer la grande nature d'une manifestation : sort actif, rituel, objet imprégné, lieu saturé, portail, etc. Le DR augmente la précision sans révéler automatiquement l'auteur ou tous les mécanismes. Mémoire de résonance — 1 PTV | SR/R Après avoir étudié une signature magique directement perceptible, l'Aérilien peut reconnaître ultérieurement la même signature ou la même source si elle n'a pas été profondément altérée. Ancrage d’Aèr — 2 PTV | SR/R — Réaction — 1/Scène Après un échec non narratif à une défense occulte contre un effet explicitement magique ou lié à un Mageius, relancez le 1d10e et conservez le second résultat. Mûlien Empreinte — Étincelle psychique SR : +1 Agilité, +1 Esprit. R : +2 Agilité, +1 Esprit. En 1 PA, à courte portée, le Mûlien peut envoyer à une cible consentante un mot mental simple, une image, une sensation, une direction ou une intention immédiate. Il ne lit pas l'esprit, ne dialogue pas encore et ne contrôle rien."
        },
        {
          "type": "p",
          "text": "Présence mentale — SR/R : +3 contre lecture mentale surnaturelle forcée, intrusion télépathique, confusion psychique ou effets similaires visant directement l'esprit. Télépathie mûlienne — 1 PTV | SR/R — 1 PA — Scène L'Étincelle psychique devient une communication bidirectionnelle avec une cible consentante, tant que les conditions de portée et de contact mental sont maintenues. Perception mentale — 1 PTV | SR/R — 1 PA Esprit + Perception permet de sentir approximativement la présence de consciences proches. Le Talent ne révèle ni pensées ni identité et ne produit pas une cartographie exacte à travers les murs. Une dissimulation ou défense occulte peut s'y opposer. Effleurement de pensée — 2 PTV | Prérequis : Télépathie mûlienne | SR/R — 1 PA Volonté + Maîtrise spirituelle contre la Défense occulte de la cible. En réussite, le Mûlien perçoit la pensée consciente dominante ou l'intention immédiate, jamais des souvenirs complets, des secrets profonds ou l'ensemble de l'esprit. Réseau mûlien — 3 PTV | Prérequis : Télépathie mûlienne | SR/R — 1 PA — Scène Jusqu'à trois participants consentants peuvent partager un réseau mental tant qu'ils restent dans la même zone opérationnelle et que la liaison n'est pas rompue. Hyperboréen Empreinte — Corps hyperboréen SR : +1 Agilité, +1 Vigueur. R : +2 Agilité, +1 Vigueur. SR/R : +3 pour résister à la fatigue physique, à l'effort prolongé, au froid naturel et aux conditions corporelles hostiles comparables. Ce bonus ne protège pas automatiquement contre une attaque surnaturelle de glace ou de froid. Détente hyperboréenne — 1 PTV | SR/R — 1/round Lors d'un Déplacement, l'Hyperboréen peut parcourir 2 m supplémentaires. Ce bonus est additif, jamais multiplicatif."
        },
        {
          "type": "p",
          "text": "Appuis du Nord — 1 PTV | SR/R +3 pour résister à une saisie, un renversement ou un déplacement physique forcé. Percussion — 2 PTV | R — 1/round Après avoir volontairement parcouru au moins 3 m avant une attaque de mêlée réussie, choisissez : +2 DGT, ou repousser la cible de 2 m si sa morphologie et la situation le permettent. Réflexe de duel — 2 PTV | R — 1/round Après une Défense active réussie contre une attaque de mêlée, l'Hyperboréen peut immédiatement se repositionner de 2 m vers une position valide. Ce n'est pas un Déplacement complet. Exploit physique — 3 PTV | SR/R — 1/Scène Après un échec non narratif à un test reposant principalement sur des capacités physiques, relancez le 1d10e et conservez le second résultat. Lémurian Empreinte — Héritage nymphal SR : +1 Agilité, +1 Volonté. R : +2 Agilité, +1 Volonté. Choisissez une Résonance élémentaire héritée de l'ascendance nymphale : Air, Eau, Terre ou Feu. L'Aseryn sent intuitivement les manifestations significatives de cet élément et reçoit +3 pour résister aux conditions naturelles ordinaires directement liées à celui-ci. Ce bonus ne réduit pas automatiquement les dégâts d'une attaque surnaturelle. Sens élémentaire — 1 PTV | SR/R L'Aseryn perçoit avec précision la présence, le mouvement et les perturbations de son élément à proximité, dans les limites naturelles de ce que l'élément peut transmettre. Façonnage nymphal — 1 PTV | SR/R — 1 PA sous pression L'Aseryn peut manipuler une quantité modeste de son élément déjà présent pour un usage utilitaire et non directement dommageable. Manifestation élémentaire — 2 PTV | R — 1 PA L'Aseryn peut produire une quantité limitée de son élément pour un usage utilitaire. Ce Talent n'est pas, à lui seul, une attaque."
        },
        {
          "type": "p",
          "text": "Corps accordé — 2 PTV | R Air — Corps des hauteurs : Les chutes ordinaires ne causent normalement plus de dégâts tant que l’Aseryn est conscient et dispose d’un minimum d’espace pour se stabiliser. Un Déplacement peut devenir un grand bond soutenu permettant de franchir un vide ou de gagner/perdre fortement de l’altitude ; il doit terminer sur un support réel. Ce n’est jamais du vol stationnaire. Eau — Corps amphibie : L’Aseryn respire indéfiniment dans l’eau, voit et agit normalement sous l’eau, supporte les pressions naturelles correspondant à des profondeurs où un humain ne pourrait pas fonctionner et se déplace sans les pénalités ordinaires d’un corps humain. Les environnements surnaturels ou abyssaux peuvent toujours le menacer. Terre — Corps de pierre : En R : Armure corporelle 2 contre les dommages matériels. Une force physique humaine ordinaire ne suffit normalement pas à le renverser ou à le déplacer contre sa volonté s’il est solidement appuyé au sol. Feu — Corps incandescent : Le corps supporte sans dommage les flammes ordinaires, la chaleur naturelle extrême et la fumée/chaleur produite directement par son propre feu nymphal. Il reçoit Réduction 2 [Feu] contre les dégâts principalement thermiques ou de feu ; les attaques surnaturelles ou armes suffisamment puissantes restent capables de le blesser. Déchaînement nymphal — 3 PTV | R — 2 PA — 1/Scène Air — Front de tempête : Cône d’environ 10 m. Chaque cible exposée oppose sa Défense physique ; en réussite elle est repoussée jusqu’à environ 5 m selon masse et terrain et peut être Renversée si approprié. Fumées, gaz, poussières et flammes ordinaires non protégés sont dispersés. Pas de dégâts automatiques."
        },
        {
          "type": "p",
          "text": "Eau — Marée suspendue : Petite zone d’environ 4 m de rayon à courte portée, saturée d’eau en mouvement pendant un round. Les flammes ordinaires sont éteintes ; mouvements et projectiles non adaptés sont fortement gênés. Sortir précipitamment de la masse peut demander Vigueur + Athlétisme contre le jet nymphal. Un round ne suffit pas à noyer magiquement une cible. Terre — Soulèvement tellurique : Sur un support minéral connecté, créer pour la scène un couvert total de quelques mètres, un fossé/obstacle, une rampe/plateforme, fermer brutalement une ouverture terrestre ou soulever une petite zone pour Renverser ses occupants. Ne détruit pas automatiquement un bâtiment et ne manipule pas une structure entière hors échelle. Feu — Brasier primordial : Zone d’environ 4 m de rayon, portée courte/moyenne. Attaque surnaturelle directe DGT 8, Incendiaire ; une Altération appropriée peut provoquer Enflammé. Pas de second effet gratuit. L’héritage lémurian s’étend aux quatre grands éléments : Air, Eau, Terre et Feu. Serathèen SR : +1 Agilité. R : +2 Agilité. Le Serathèen ne reçoit pas de troisième modificateur d'Attribut : sa force est sa plasticité d'ascendance et de formation."
        }
      ]
    },
    {
      "id": "empreinte-sang-mele",
      "title": "Empreinte — Sang mêlé",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "Choisissez deux Traces ancestrales différentes parmi les quatre suivantes. Trace Effet mineur gratuit Aérilienne 1 PA de concentration : Esprit + Perception pour sentir une magie active directement perceptible. Mûlienne 1/Scène : envoyer une Étincelle psychique simple à une cible consentante. Hyperboréenne +3 pour résister au renversement et au déplacement physique forcé. Lémurienne Choisir une Résonance élémentaire et sentir les manifestations significatives de cet élément ; aucune manipulation."
        },
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:origines-jouables-seratheen-empreinte-sang-mele}}"
        }
      ]
    },
    {
      "id": "origines-exceptionnelles-non-proposees-normalement-aux-pj",
      "title": "Origines exceptionnelles non proposées normalement aux PJ",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Paleo-Atlantes : Aseryns nés avant le cataclysme et demeurés en stase. Leur potentiel foudroyant, leur longévité anormale et surtout leur décalage culturel en font des origines de campagne ou des PNJ exceptionnels, pas une option normale de création. Australisiens : les survivants connus sont trop rares et leur profil est insuffisamment documenté pour constituer une Origine jouable standard."
        }
      ]
    }
  ],
  "r2": [
    {
      "id": "traditions-des-treize",
      "title": "Traditions des Treize",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "constituent néanmoins un langage culturel capable de franchir nombre de ces divisions : protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas ou soigner selon Theana restent des références compréhensibles bien au-delà d’une seule branche. Chez les Serathéens d’Amérique du Nord existe notamment le Conseil de la Foudre, tradition régionale marquée par des pratiques chamaniques et un rapport particulier aux Ancêtres. Il ne constitue pas une institution centrale de tous les Aseryns ni une seconde école de Foudre : c’est l’un des nombreux développements culturels apparus après les diasporas. Les Aseryns en 2035 Jamais une société humaine n’a produit autant d’électricité, de réseaux et de systèmes réagissant en fractions de seconde. Le monde moderne peut donc sembler étrangement familier à une physiologie aseryne, tout en restant parfois désespérément lent. Une conversation en Accelyr, une perception électromagnétique ou des réflexes accélérés donnent une relation au quotidien que les Humains ne partagent pas. Les Aseryns ne vivent cependant pas tous dans des communautés anciennes. Certains sont pleinement intégrés à la Californie depuis plusieurs générations et connaissent leur héritage surtout par leur famille. Leur civilisation est vieille ; chaque individu conserve pourtant le droit de découvrir le monde comme s’il était neuf, ce qui est probablement l’une des choses les plus fidèles à Serathè. Héritiers de Serathè, pas gardiens d'un musée La civilisation aseryne est ancienne, mais son rapport au passé n'est pas celui d'un peuple condamné à le répéter. Serathè elle-même abandonna un jour ses travaux pour construire une embarcation dérisoire et partir découvrir le monde."
        },
        {
          "type": "p",
          "text": "Cette curiosité est restée une référence culturelle profonde : quitter une vie devenue stérile, voyager ou recommencer n'est pas nécessairement une trahison de la tradition. Cette disposition explique la manière dont les Aseryns ont survécu aux catastrophes. La disparition d'Atlantide n'a pas produit une seule diaspora mais plusieurs trajectoires. Aériliens et Néo-Atlantes furent marqués par Aèr et sa Magie ; les Mûliens développèrent davantage leur héritage psychique ; les Hyperboréens cultivèrent des traditions plus physiques ; les Lémurians conservèrent des relations particulières avec des héritages nymphaux et élémentaires ; les Serathéens devinrent un ensemble très métissé de lignées dispersées. Ces peuples ne forment pas un État aseryn unique. Ils partagent des mémoires, des références et des traditions, mais leurs histoires ont eu le temps de produire des intérêts différents. L'idée d'une civilisation aseryne homogène appartient souvent davantage au regard extérieur qu'à l'expérience de ceux qui la vivent. Les Treize comme langage commun Les Treize Fondateurs ne sont pas des ancêtres biologiques distribuant automatiquement des pouvoirs par le sang. Leurs Traditions sont enseignées. Elles représentent des modèles culturels capables de voyager entre diasporas : gouverner selon Athegos, protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas, créer selon Seryn, nourrir selon Natyel, veiller selon Erith, conserver selon Lisirast, juger selon Lisithas, aimer selon Selerias ou soigner selon Theana. Un Aseryn peut se reconnaître dans plusieurs de ces héritages au cours de sa vie. Leur force vient précisément de ce qu'ils ne réduisent pas une personne à sa naissance."
        },
        {
          "type": "p",
          "text": "Dans une civilisation où l'espérance de vie se compte en siècles, la possibilité de changer de fonction ou d'idéal n'est pas une exception : elle est une condition pour ne pas devenir prisonnier de sa propre durée. Dratyn occupe une place différente parce qu'elle préserve la Foudre. Tous les Aseryns en portent le potentiel, mais la maîtrise doit être apprise. Les conceptions du Créateur, de l'Esprit, de l'Érosion et de la Fin ne sont pas des alignements moraux. Elles décrivent des manières différentes de comprendre une puissance qui appartient au corps aseryn autant qu'à sa cosmologie. Vivre vite dans un corps qui dure longtemps L'Accelyr révèle l'un des paradoxes les plus étrangers de la physiologie aseryne. Leur système nerveux peut fonctionner à une vitesse qui rend certains échanges impossibles à suivre pour un Humain ordinaire, alors même que leur vie s'étend sur plusieurs siècles. Ils peuvent donc connaître des instants d'une densité exceptionnelle au sein d'existences très longues. La société technologique de 2035 produit un environnement qui leur est étrangement adapté : électricité omniprésente, réseaux, champs électromagnétiques et systèmes réagissant en fractions de seconde. Le même monde qui émerveille un Humain par sa vitesse peut encore sembler lent à quelqu'un qui traite naturellement certaines informations autrement. Cette proximité ne signifie pas que tous les Aseryns soient ingénieurs ou passionnés de technologie. Elle donne simplement à leur perception du quotidien une texture différente. Une panne électrique peut être ressentie avant d'être annoncée. Un espace saturé d'équipements possède une présence que d'autres espèces ne perçoivent pas de la même manière."
        },
        {
          "type": "p",
          "text": "Le Conseil de la Foudre et les Serathéens Le Conseil de la Foudre appartient aux traditions serathéennes d'Amérique du Nord. Ses pratiques, marquées par des approches chamaniques et par le rapport aux Ancêtres, sont importantes pour ces communautés mais ne constituent ni un gouvernement de tous les Aseryns ni une deuxième école universelle de Foudre. Cette distinction est essentielle pour comprendre la diversité aseryne. Une institution régionale peut être très ancienne, puissante et respectée sans devenir le centre naturel d'une civilisation entière. Les Aseryns ont trop de siècles de diasporas pour que toutes leurs histoires tiennent dans un seul Conseil. Les Treize comme langage commun Athegos devait guider ; Sundosia explorer ; Caendis protéger ; Cairiah bâtir ; Eydreas douter et rechercher ; Seryn créer ; Natyel nourrir ; Erith surveiller ; Lisirast préserver ; Dratyn transmettre la Foudre ; Lisithas juger ; Selerias maintenir la cohésion ; Theana soigner. Ces fonctions attribuées aux Treize Fondateurs sont devenues des Traditions parce qu'elles décrivaient des besoins qu'aucune catastrophe n'a fait disparaître. La force du système vient précisément de ce qu'il n'est pas biologique. Un enfant ne reçoit pas automatiquement « sa » Tradition par le sang. Il peut être formé, changer de voie ou combiner plusieurs héritages au fil de sa vie. Les lignées familiales influencent naturellement l'éducation, mais elles ne rendent pas une fonction innée. Cette distinction a permis aux différentes diasporas de continuer à se reconnaître après des siècles d'histoires divergentes."
        },
        {
          "type": "p",
          "text": "Un Hyperboréen et un Néo￾Atlante peuvent désapprouver presque tout de la politique de l'autre et comprendre néanmoins ce que signifie agir selon Caendis ou Theana. Les Treize forment moins un gouvernement qu'un vocabulaire moral et professionnel partagé. Accelyr : une culture à la vitesse du corps L'Accelyr vient d'une physiologie capable de traiter et d'échanger des informations à un rythme qui dépasse facilement les capacités humaines. Entre Aseryns entraînés, une conversation peut paraître faite de ruptures, de gestes et de phrases trop rapides pour un observateur ordinaire. Cette vitesse n'est pas seulement un avantage de combat. Elle a influencé l'éducation, le débat et la manière de travailler collectivement. Une réunion aseryne peut parcourir en quelques minutes une quantité d'hypothèses qui exigerait des heures dans une institution humaine, puis sembler étrangement lente lorsqu'elle doit produire un document compréhensible par des partenaires profanes. Le Voile crée donc un problème quotidien spécifique : vivre dans une société qui pense et parle plus lentement sans transformer cette différence en mépris. Les communautés qui travaillent avec des Humains apprennent à ralentir volontairement, à découper leurs raisonnements et à reconnaître que la vitesse cognitive ne remplace ni l'expérience ni la justesse. Les diasporas ne sont pas des castes Les Néo-Atlantes et Aériliens, les Mûliens, les Hyperboréens, les Lémurians et les Serathéens portent des histoires différentes nées des catastrophes et des migrations. Ces noms décrivent des peuples et des trajectoires, pas des spécialisations mécaniques obligatoires."
        },
        {
          "type": "p",
          "text": "Les Néo-Atlantes conservent une relation particulièrement forte avec Aèr et les héritages magiques qui ont transformé une partie de leur histoire. Les Mûliens ont développé davantage certains héritages psychiques. Les Hyperboréens sont associés à des traditions plus physiques et à des environnements exigeants. Les Lémurians ont entretenu des rapports singuliers avec des héritages nymphaux et élémentaires. Les Serathéens forment des ensembles métissés et dispersés dont les cultures se sont adaptées aux régions où elles ont survécu. Aucune de ces descriptions n'enferme un individu. Des millénaires de rencontres et de déplacements ont produit des familles mêlées, des apprentissages croisés et des personnes qui se reconnaissent dans plusieurs héritages à la fois. Les Paleo-Atlantes et le traumatisme du temps Les rares Paleo-Atlantes ayant survécu en stase représentent une fracture plus profonde que la simple ancienneté. Ils ont connu une civilisation dont les autres Aseryns parlent déjà comme d'une histoire fondatrice. Leur réveil signifie découvrir que des institutions, des paysages et parfois des catégories entières de pensée ont disparu. Ils ne sont pas automatiquement plus sages. Comme les Vampires réveillés après une longue torpeur, ils peuvent être extraordinairement compétents dans un monde qui n'existe plus et profondément démunis devant ce qui est devenu banal. Leur présence est précieuse pour les archives et dangereuse pour les mythes : un témoin direct peut confirmer certaines légendes et en détruire d'autres simplement en se souvenant autrement."
        },
        {
          "type": "p",
          "text": "Le Conseil de la Foudre, une réponse serathéenne En Amérique du Nord, certains Serathéens ont développé le Conseil de la Foudre, tradition régionale marquée par les Ancêtres et des pratiques chamaniques nées de leur histoire locale. Il possède une importance réelle pour ces communautés et peut jouer un rôle politique ou spirituel majeur dans leurs affaires. Il ne représente cependant ni tous les Aseryns ni une seconde autorité universelle parallèle aux Treize. Un Mûlien ou un Néo-Atlante peut connaître son existence sans lui devoir la moindre obéissance. Cette modestie d'échelle rend le Conseil plus crédible : c'est une institution née d'une diaspora particulière, pas la réponse automatique de toute une espèce à chaque problème moderne. Nature aseryne Les Aseryns sont une espèce ssrynnesque propre à la Terre, créée par Serathè. Leur apparence converge fortement avec celle des humains, mais leur anatomie interne, leur métabolisme, leur système nerveux et leur activité électromusculaire diffèrent profondément. Leur longévité se compte normalement en siècles. Leur identité mécanique ne repose pas sur une longue liste de pouvoirs innés. Elle repose sur un socle racial commun, de petites particularités d'origine, puis sur des Traditions apprises. Un Aseryn peu intéressé par la Foudre doit disposer d'autant de choix structurants qu'un Aseryn qui en fait sa spécialité. Voile, Semi-Révélation et Révélation État Modificateur commun Voilé (V) Aucun modificateur racial commun. Semi-Révélé (SR) +1 Agilité. Révélé (R) +2 Agilité. Ces modificateurs représentent la véritable vitesse neuromusculaire de l'Aseryn. Ils s'ajoutent aux éventuels modificateurs de l'Origine."
        },
        {
          "type": "p",
          "text": "Ils n'accordent pas, à eux seuls, de PA supplémentaires automatiques : les PA restent déterminés par le jet d'Initiative normal. Variation de Vigueur et Points de Vie Lorsqu'une forme modifie la Vigueur, les PV maximum et les PV actuels varient immédiatement de 2 × la variation de Vigueur. Une diminution de Vigueur ne peut toutefois pas, à elle seule, faire passer un personnage qui possédait encore des PV positifs sous 1 PV. Un changement de forme ne constitue jamais une méthode de soin : il ne restitue pas des blessures déjà subies. Le supplément de PV représente uniquement la robustesse momentanée du corps plus vigoureux. Traits communs gratuits Accelyr Tous les Aseryns comprennent l'Accelyr, une langue parlée à une vitesse que l'oreille et le cerveau humains ne peuvent normalement pas suivre. L'Accelyr ne donne aucun bonus chiffré par lui￾même ; il permet surtout une communication extrêmement rapide entre Aseryns et sert souvent de signe de reconnaissance culturelle. Physiologie aseryne Longévité exceptionnelle, activité neuromusculaire rapide et activité électrique corporelle supérieure font partie de la physiologie de l'espèce. Ces éléments sont principalement narratifs tant qu'un Talent ne leur donne pas un effet précis. La physiologie aseryne n'accorde pas de résistance universelle aux maladies, poisons ou fatigues. Sens électromagnétique SR/R — Passif. L'Aseryn perçoit les sources électromagnétiques significatives, les courants importants, les anomalies magnétiques marquées et les variations soudaines du champ environnant. En se concentrant 1 PA, il peut effectuer Esprit + Perception + 1d10e afin d'obtenir une direction, une proximité approximative et la nature générale de la source."
        },
        {
          "type": "p",
          "text": "Ce sens ne lit pas des données, ne remplace pas un scanner, ne révèle pas automatiquement tous les êtres vivants derrière les murs et peut être perturbé par un blindage, un brouillage ou un environnement électromagnétique saturé. Potentiel foudroyant Tout Aseryn possède biologiquement le potentiel d'apprendre à maîtriser la Foudre. Ce potentiel n'est pas une Affinité achetée en PTV et n'est pas binaire. Chez un PJ, on considère par défaut une affinité moyenne : il peut apprendre, mais cela demande un véritable enseignement et du temps. Certaines lignées ou individus exceptionnels apprennent beaucoup plus vite, voire manifestent spontanément la Foudre. Ces prodiges relèvent du lore et des PNJ extraordinaires ; ils ne constituent pas le profil normal d'un PJ. Routes communes aserynes Les trois routes suivantes approfondissent des capacités présentes chez tous les Aseryns. Elles sont indépendantes des Origines et des Traditions des Fondateurs. Vivacité aseryne Départ fulgurant — 1 PTV | SR/R — Passif Après avoir déterminé normalement le nombre de PA du personnage, ajoutez +3 à son score d'Initiative uniquement pour déterminer son ordre d'action dans les passes. Ce bonus ne modifie jamais le nombre de PA obtenu. Réflexe impossible — 2 PTV | Prérequis : Départ fulgurant | SR/R — Réaction Lorsqu’il est Surpris, l’Aseryn peut malgré tout dépenser 1 PA pour effectuer une Défense active contre une attaque dont il a conscience. Il reste Surpris pour les autres effets applicables. Surcadence nerveuse — 3 PTV | Prérequis : Réflexe impossible | SR/R — Réaction — 1/Scène L'Aseryn gagne immédiatement 1 PA utilisable avant la fin du round."
        },
        {
          "type": "p",
          "text": "Ce PA ne peut servir qu'à un Déplacement, une Défense active ou une action significative non offensive. Il ne peut pas servir à attaquer, activer un pouvoir offensif ou déclencher une chaîne de gains de PA. Esprit fulgurant Traitement accéléré — 1 PTV | SR/R — 1/Scène Sur une tâche intellectuelle où le temps supplémentaire ne sert qu'à réfléchir, calculer ou comparer des informations déjà disponibles, l'Aseryn peut bénéficier de Prendre son temps sans consommer le délai supplémentaire. Pensée parallèle — 1 PTV | SR/R — Passif L'Aseryn peut conserver une activité mentale simple en arrière-plan pendant qu'il agit : garder un compte, suivre plusieurs communications, poursuivre une comparaison simple ou maintenir un bref échange Accelyr. Cela n'autorise jamais deux tests simultanés, deux actions, deux pouvoirs maintenus ou deux concentrations complexes. Décision fulgurante — 2 PTV | Prérequis : Traitement accéléré | SR/R — 1/Scène Après un échec non narratif à un test reposant principalement sur Esprit, relancez le 1d10e et conservez le second résultat. Perception électromagnétique Lecture de champ — 1 PTV | SR/R Lors d'une utilisation focalisée du Sens électromagnétique, l'Aseryn bénéficie de +3 pour déterminer la nature, l'intensité et l'origine probable d'un phénomène électromagnétique. Cartographie inductive — 2 PTV | SR/R — 1 PA Dans un rayon d'environ 10 m, l'Aseryn peut dresser une cartographie grossière des câbles actifs, machines alimentées et principales sources électromagnétiques à travers des obstacles ordinaires. Il n'en lit ni le contenu ni la fonction exacte."
        },
        {
          "type": "p",
          "text": "Signature électrique — 2 PTV | SR/R Après avoir étudié une machine, un artefact alimenté ou une source énergétique, l'Aseryn peut mémoriser sa signature électromagnétique et la reconnaître ultérieurement si elle reste suffisamment similaire. Perception neuromotrice — 3 PTV | SR/R À très courte portée, lorsqu'il sait qu'une cible est présente, l'Aseryn peut percevoir le déclenchement de mouvements reposant sur une activité nerveuse ou électromécanique détectable. Les pénalités provenant uniquement de l'impossibilité de voir son mouvement ne s'appliquent pas à ses Défenses contre elle. Une fois par scène, il peut en outre recevoir +3 à une Défense active contre une telle cible. Blindage, brouillage ou absence de signature pertinente peuvent neutraliser ce Talent. Origines jouables Les Origines décrivent des branches historiques et biologiques de l'espèce. Les différences restent volontairement modestes : les Aseryns demeurent une espèce relativement uniforme. Les Paleo￾Atlantes et les Australisiens ne sont pas proposés comme Origines normales de PJ dans ce corpus. Aérilien / Néo-Atlante SR: +1 Agi, +1 Vol • R: +2 Agi, +1 Vol Orientation: Affinité magique, lecture des flux Mûlien SR: +1 Agi, +1 Esp • R: +2 Agi, +1 Esp Orientation: Psychisme, télépathie Hyperboréen SR: +1 Agi, +1 Vig • R: +2 Agi, +1 Vig Orientation: Physique, endurance, explosivité Lémurian SR: +1 Agi, +1 Vol • R: +2 Agi, +1 Vol Orientation: Héritage nymphal et élémentaire Serathèen SR: +1 Agi • R: +2 Agi Orientation: Ascendance composite, Traces multiples Aérilien / Néo-Atlante Empreinte — Résonance d’Aèr SR : +1 Agilité, +1 Volonté. R : +2 Agilité, +1 Volonté."
        },
        {
          "type": "p",
          "text": "L'Aérilien sent instinctivement une manifestation magique active directement perceptible : il sait que de la magie est présente, sans en connaître automatiquement la source, le domaine ou la puissance. Esprit + Perception permet d'affiner cette impression. Acclimatation arcanique — SR/R : +3 pour résister aux effets nocifs d'un environnement saturé de magie brute ou instable. Ce bonus ne protège pas contre un sort ou un pouvoir ciblé. Lecture des flux — 1 PTV | SR/R — 1 PA Esprit + Perception permet de distinguer la grande nature d'une manifestation : sort actif, rituel, objet imprégné, lieu saturé, portail, etc. Le DR augmente la précision sans révéler automatiquement l'auteur ou tous les mécanismes. Mémoire de résonance — 1 PTV | SR/R Après avoir étudié une signature magique directement perceptible, l'Aérilien peut reconnaître ultérieurement la même signature ou la même source si elle n'a pas été profondément altérée. Ancrage d’Aèr — 2 PTV | SR/R — Réaction — 1/Scène Après un échec non narratif à une défense occulte contre un effet explicitement magique ou lié à un Mageius, relancez le 1d10e et conservez le second résultat. Mûlien Empreinte — Étincelle psychique SR : +1 Agilité, +1 Esprit. R : +2 Agilité, +1 Esprit. En 1 PA, à courte portée, le Mûlien peut envoyer à une cible consentante un mot mental simple, une image, une sensation, une direction ou une intention immédiate. Il ne lit pas l'esprit, ne dialogue pas encore et ne contrôle rien. Présence mentale — SR/R : +3 contre lecture mentale surnaturelle forcée, intrusion télépathique, confusion psychique ou effets similaires visant directement l'esprit."
        },
        {
          "type": "p",
          "text": "Télépathie mûlienne — 1 PTV | SR/R — 1 PA — Scène L'Étincelle psychique devient une communication bidirectionnelle avec une cible consentante, tant que les conditions de portée et de contact mental sont maintenues. Perception mentale — 1 PTV | SR/R — 1 PA Esprit + Perception permet de sentir approximativement la présence de consciences proches. Le Talent ne révèle ni pensées ni identité et ne produit pas une cartographie exacte à travers les murs. Une dissimulation ou défense occulte peut s'y opposer. Effleurement de pensée — 2 PTV | Prérequis : Télépathie mûlienne | SR/R — 1 PA Volonté + Maîtrise spirituelle contre la Défense occulte de la cible. En réussite, le Mûlien perçoit la pensée consciente dominante ou l'intention immédiate, jamais des souvenirs complets, des secrets profonds ou l'ensemble de l'esprit. Réseau mûlien — 3 PTV | Prérequis : Télépathie mûlienne | SR/R — 1 PA — Scène Jusqu'à trois participants consentants peuvent partager un réseau mental tant qu'ils restent dans la même zone opérationnelle et que la liaison n'est pas rompue. Hyperboréen Empreinte — Corps hyperboréen SR : +1 Agilité, +1 Vigueur. R : +2 Agilité, +1 Vigueur. SR/R : +3 pour résister à la fatigue physique, à l'effort prolongé, au froid naturel et aux conditions corporelles hostiles comparables. Ce bonus ne protège pas automatiquement contre une attaque surnaturelle de glace ou de froid. Détente hyperboréenne — 1 PTV | SR/R — 1/round Lors d'un Déplacement, l'Hyperboréen peut parcourir 2 m supplémentaires. Ce bonus est additif, jamais multiplicatif. Appuis du Nord — 1 PTV | SR/R +3 pour résister à une saisie, un renversement ou un déplacement physique forcé."
        },
        {
          "type": "p",
          "text": "Percussion — 2 PTV | R — 1/round Après avoir volontairement parcouru au moins 3 m avant une attaque de mêlée réussie, choisissez : +2 DGT, ou repousser la cible de 2 m si sa morphologie et la situation le permettent. Réflexe de duel — 2 PTV | R — 1/round Après une Défense active réussie contre une attaque de mêlée, l'Hyperboréen peut immédiatement se repositionner de 2 m vers une position valide. Ce n'est pas un Déplacement complet. Exploit physique — 3 PTV | SR/R — 1/Scène Après un échec non narratif à un test reposant principalement sur des capacités physiques, relancez le 1d10e et conservez le second résultat. Lémurian Empreinte — Héritage nymphal SR : +1 Agilité, +1 Volonté. R : +2 Agilité, +1 Volonté. Choisissez une Résonance élémentaire héritée de l'ascendance nymphale : Air, Eau, Terre ou Feu. L'Aseryn sent intuitivement les manifestations significatives de cet élément et reçoit +3 pour résister aux conditions naturelles ordinaires directement liées à celui-ci. Ce bonus ne réduit pas automatiquement les dégâts d'une attaque surnaturelle. Sens élémentaire — 1 PTV | SR/R L'Aseryn perçoit avec précision la présence, le mouvement et les perturbations de son élément à proximité, dans les limites naturelles de ce que l'élément peut transmettre. Façonnage nymphal — 1 PTV | SR/R — 1 PA sous pression L'Aseryn peut manipuler une quantité modeste de son élément déjà présent pour un usage utilitaire et non directement dommageable. Manifestation élémentaire — 2 PTV | R — 1 PA L'Aseryn peut produire une quantité limitée de son élément pour un usage utilitaire. Ce Talent n'est pas, à lui seul, une attaque."
        },
        {
          "type": "p",
          "text": "Corps accordé — 2 PTV | R Air — Corps des hauteurs : Les chutes ordinaires ne causent normalement plus de dégâts tant que l’Aseryn est conscient et dispose d’un minimum d’espace pour se stabiliser. Un Déplacement peut devenir un grand bond soutenu permettant de franchir un vide ou de gagner/perdre fortement de l’altitude ; il doit terminer sur un support réel. Ce n’est jamais du vol stationnaire. Eau — Corps amphibie : L’Aseryn respire indéfiniment dans l’eau, voit et agit normalement sous l’eau, supporte les pressions naturelles correspondant à des profondeurs où un humain ne pourrait pas fonctionner et se déplace sans les pénalités ordinaires d’un corps humain. Les environnements surnaturels ou abyssaux peuvent toujours le menacer. Terre — Corps de pierre : En R : Armure corporelle 2 contre les dommages matériels. Une force physique humaine ordinaire ne suffit normalement pas à le renverser ou à le déplacer contre sa volonté s’il est solidement appuyé au sol. Feu — Corps incandescent : Le corps supporte sans dommage les flammes ordinaires, la chaleur naturelle extrême et la fumée/chaleur produite directement par son propre feu nymphal. Il reçoit Réduction 2 [Feu] contre les dégâts principalement thermiques ou de feu ; les attaques surnaturelles ou armes suffisamment puissantes restent capables de le blesser. Déchaînement nymphal — 3 PTV | R — 2 PA — 1/Scène Air — Front de tempête : Cône d’environ 10 m. Chaque cible exposée oppose sa Défense physique ; en réussite elle est repoussée jusqu’à environ 5 m selon masse et terrain et peut être Renversée si approprié. Fumées, gaz, poussières et flammes ordinaires non protégés sont dispersés. Pas de dégâts automatiques."
        },
        {
          "type": "p",
          "text": "Eau — Marée suspendue : Petite zone d’environ 4 m de rayon à courte portée, saturée d’eau en mouvement pendant un round. Les flammes ordinaires sont éteintes ; mouvements et projectiles non adaptés sont fortement gênés. Sortir précipitamment de la masse peut demander Vigueur + Athlétisme contre le jet nymphal. Un round ne suffit pas à noyer magiquement une cible. Terre — Soulèvement tellurique : Sur un support minéral connecté, créer pour la scène un couvert total de quelques mètres, un fossé/obstacle, une rampe/plateforme, fermer brutalement une ouverture terrestre ou soulever une petite zone pour Renverser ses occupants. Ne détruit pas automatiquement un bâtiment et ne manipule pas une structure entière hors échelle. Feu — Brasier primordial : Zone d’environ 4 m de rayon, portée courte/moyenne. Attaque surnaturelle directe DGT 8, Incendiaire ; une Altération appropriée peut provoquer Enflammé. Pas de second effet gratuit. L’héritage lémurian s’étend aux quatre grands éléments : Air, Eau, Terre et Feu. Serathèen SR : +1 Agilité. R : +2 Agilité. Le Serathèen ne reçoit pas de troisième modificateur d'Attribut : sa force est sa plasticité d'ascendance et de formation. Empreinte — Sang mêlé Choisissez deux Traces ancestrales différentes parmi les quatre suivantes. Trace Effet mineur gratuit Aérilienne 1 PA de concentration : Esprit + Perception pour sentir une magie active directement perceptible. Mûlienne 1/Scène : envoyer une Étincelle psychique simple à une cible consentante. Hyperboréenne +3 pour résister au renversement et au déplacement physique forcé. Lémurienne Choisir une Résonance élémentaire et sentir les manifestations significatives de cet élément ; aucune manipulation."
        },
        {
          "type": "p",
          "text": "Atavisme marqué — 1 PTV | Passif Choisissez l'une de vos Traces. Elle devient la Signature complète de l'Origine correspondante, sans accorder son bonus d'Attribut : Aérilienne = Résonance d'Aèr + Acclimatation arcanique ; Mûlienne = Étincelle psychique + Présence mentale ; Hyperboréenne = Corps hyperboréen ; Lémurienne = Héritage nymphal complet. Sang pluriel — 1 PTV | Passif — une seule fois Gagnez une troisième Trace ancestrale mineure différente. Héritage éveillé — 2 PTV | Prérequis : Atavisme marqué | Passif Le personnage peut acheter les Talents d'Origine associés à la Trace choisie comme s'il appartenait à cette Origine. Il ne gagne aucun Talent gratuitement. Mosaïque ancestrale — 3 PTV | Prérequis : Héritage éveillé | Passif Héritage éveillé peut désormais s'appliquer à une seconde Trace, permettant de développer deux lignées d'Origine différentes. Origines exceptionnelles non proposées normalement aux PJ Paleo-Atlantes : Aseryns nés avant le cataclysme et demeurés en stase. Leur potentiel foudroyant, leur longévité anormale et surtout leur décalage culturel en font des origines de campagne ou des PNJ exceptionnels, pas une option normale de création. Australisiens : les survivants connus sont trop rares et leur profil est insuffisamment documenté pour constituer une Origine jouable standard. Traditions des Treize Quatorze enfants reçurent autrefois une stèle et une mission. Kalirath fut ensuite rejeté et ne resta pas parmi les Fondateurs ; la tradition historique retient donc les Treize. Les Traditions ne sont pas des lignées génétiques ni des droits attachés à un nom de famille. Elles représentent des savoirs et disciplines culturels hérités des fonctions des Fondateurs."
        },
        {
          "type": "p",
          "text": "Un Aseryn n'a pas besoin de porter le nom de la Maison correspondante pour apprendre une Tradition. Les Traditions ordinaires sont cumulables. Il n'existe ni taxe générique d'ouverture ni limite numérique arbitraire. En revanche, chaque Tradition exige une véritable formation fictionnelle : Maison, communauté, maître, institution ou apprentissage crédible. Dépenser des PTV représente la maîtrise acquise, pas l'achat d'un enseignement sorti de nulle part. Tous les Fondateurs savaient manier la Foudre à des degrés divers. Cela ne transforme pas leurs Traditions en écoles de Foudre : Dratyn avait précisément pour devoir de préserver et transmettre cette discipline."
        }
      ]
    },
    {
      "id": "athegos-le-seigneur",
      "title": "Athegos — le Seigneur",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:traditions-des-treize-athegos-le-seigneur}}"
        }
      ]
    },
    {
      "id": "sundosia-l-aventuriere",
      "title": "Sundosia — l’Aventurière",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:traditions-des-treize-sundosia-l-aventuriere}}"
        }
      ]
    },
    {
      "id": "caendis-le-protecteur",
      "title": "Caendis — le Protecteur",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:traditions-des-treize-caendis-le-protecteur}}"
        }
      ]
    },
    {
      "id": "cairiah-l-architecte",
      "title": "Cairiah — l’Architecte",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:traditions-des-treize-cairiah-l-architecte}}"
        }
      ]
    },
    {
      "id": "eydreas-le-chercheur",
      "title": "Eydreas — le Chercheur",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:traditions-des-treize-eydreas-le-chercheur}}"
        }
      ]
    },
    {
      "id": "seryn-l-artisane",
      "title": "Seryn — l’Artisane",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:traditions-des-treize-seryn-l-artisane}}"
        }
      ]
    },
    {
      "id": "natyel-le-nourricier",
      "title": "Natyel — le Nourricier",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:traditions-des-treize-natyel-le-nourricier}}"
        }
      ]
    },
    {
      "id": "erith-la-sentinelle",
      "title": "Erith — la Sentinelle",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:traditions-des-treize-erith-la-sentinelle}}"
        }
      ]
    },
    {
      "id": "lisirast-l-archiviste",
      "title": "Lisirast — l’Archiviste",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:traditions-des-treize-lisirast-l-archiviste}}"
        }
      ]
    },
    {
      "id": "lisithas-le-juge",
      "title": "Lisithas — le Juge",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:traditions-des-treize-lisithas-le-juge}}"
        }
      ]
    },
    {
      "id": "selerias-l-aimante",
      "title": "Selerias — l’Aimante",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:traditions-des-treize-selerias-l-aimante}}"
        }
      ]
    },
    {
      "id": "theana-la-guerisseuse",
      "title": "Theana — la Guérisseuse",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:traditions-des-treize-theana-la-guerisseuse}}"
        }
      ]
    },
    {
      "id": "dratyn-la-maitresse-de-la-foudre",
      "title": "Dratyn — la Maîtresse de la Foudre",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": "Dratyn est l'exception volontaire parmi les Traditions : sa mission était d'assurer la continuité de la maîtrise de la Foudre, de l'enseigner et d'en contrôler la transmission. Elle dispose donc d'un développement plus profond que les autres Fondateurs. Tout Aseryn possède le potentiel physiologique requis. Pour un PJ, l'affinité est moyenne par défaut. L'accès mécanique dépend d'un véritable enseignement : Temple, prêtresse renégate, maître indépendant, tradition familiale ou autre source crédible. Être prêtresse n'est pas nécessaire pour apprendre la Foudre, et être prêtresse ne l'accorde pas automatiquement."
        }
      ]
    },
    {
      "id": "regles-communes-de-foudre",
      "title": "Règles communes de Foudre",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Élément Règle V2 État requis La génération de Foudre exige normalement R. Conduction peut fonctionner en SR/R. Activation d’une attaque 1 PA sauf Talent contraire. Jet de Foudre Volonté + Maîtrise spirituelle + 1d10e contre la Défense pertinente. Résolution Dégâts = Marge de réussite + DGT - Protection électrique applicable. Portée normale 20 m. Armure conventionnelle Kevlar, plaques, armure de combat ordinaire : aucune réduction contre la Foudre. Protection pertinente Isolation électrique réelle, cage de Faraday, équipement conçu pour canaliser la décharge ou protection surnaturelle adaptée. Élément Règle V2 Paliers de Tir Ne s’appliquent pas. Pas de double DGT ni d’Altération automatique à marge 6/11. Foudre aseryne DGT 7. Foudre originelle DGT 9. Déferlement originel DGT 13. Une armure métallique n'augmente pas automatiquement les dégâts : elle ne protège simplement pas, sauf si sa conception lui donne une véritable fonction électrique."
        }
      ]
    },
    {
      "id": "talents-communs-de-dratyn",
      "title": "Talents communs de Dratyn",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:dratyn-la-maitresse-de-la-foudre-talents-communs-de-dratyn}}"
        }
      ]
    },
    {
      "id": "specialisation-de-foudre",
      "title": "Spécialisation de Foudre",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "Après Foudre aseryne, un personnage peut recevoir l'enseignement d'une tradition spécialisée. Pour un PJ, une seule des quatre spécialisations suivantes est normalement maîtrisable : Créateur, Esprit, Érosion ou Fin. Apprendre une seconde tradition relève d'un événement de campagne exceptionnel et de l'accord du MJ. La spécialisation représente un enseignement reçu, pas nécessairement une appartenance institutionnelle actuelle. Une prêtresse renégate peut transmettre sa tradition hors de son Temple."
        }
      ]
    },
    {
      "id": "createur-foudre-originelle",
      "title": "Créateur — Foudre originelle",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "La Foudre du Créateur est la Foudre pure, originelle : puissance brute et capacité à détruire la magie."
        },
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:dratyn-la-maitresse-de-la-foudre-specialisation-de-foudre-createur-foudre-originelle}}"
        }
      ]
    },
    {
      "id": "esprit-noire-foudre",
      "title": "Esprit — Noire-Foudre",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "La Noire-Foudre applique la Foudre au monde immatériel : esprits, Ombres, projections et phénomènes métaphysiques. Elle est presque invisible et ne doit pas devenir un simple bouton permettant d'attaquer la défense la plus faible d'un adversaire ordinaire."
        },
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:dratyn-la-maitresse-de-la-foudre-specialisation-de-foudre-esprit-noire-foudre}}"
        }
      ]
    },
    {
      "id": "erosion-foudre-vaporeuse",
      "title": "Érosion — Foudre vaporeuse",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "La Foudre vaporeuse ne cherche pas à surpasser le Créateur en dégâts. Elle ronge les protections, malédictions, corruptions et manifestations jusqu'à les amoindrir ou les faire céder."
        },
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:dratyn-la-maitresse-de-la-foudre-specialisation-de-foudre-erosion-foudre-vaporeuse}}"
        }
      ]
    },
    {
      "id": "fin-foudre-du-silence",
      "title": "Fin — Foudre du Silence",
      "level": 4,
      "blocks": [
        {
          "type": "p",
          "text": "La Foudre du Silence est la Foudre du Néant. Elle ne se contente pas de détruire : elle efface. C'est l'une des armes aserynes les plus terrifiantes et l'une des rares capables de donner une véritable fin à certaines manifestations des Fléaux."
        },
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:dratyn-la-maitresse-de-la-foudre-specialisation-de-foudre-fin-foudre-du-silence}}"
        }
      ]
    },
    {
      "id": "conseil-de-la-foudre",
      "title": "Conseil de la Foudre",
      "level": 2,
      "blocks": [
        {
          "type": "p",
          "text": ", tradition régionale marquée par des pratiques chamaniques et un rapport particulier aux Ancêtres. Il ne constitue pas une institution centrale de tous les Aseryns ni une seconde école de Foudre : c’est l’un des nombreux développements culturels apparus après les diasporas. Les Aseryns en 2035 Jamais une société humaine n’a produit autant d’électricité, de réseaux et de systèmes réagissant en fractions de seconde. Le monde moderne peut donc sembler étrangement familier à une physiologie aseryne, tout en restant parfois désespérément lent. Une conversation en Accelyr, une perception électromagnétique ou des réflexes accélérés donnent une relation au quotidien que les Humains ne partagent pas. Les Aseryns ne vivent cependant pas tous dans des communautés anciennes. Certains sont pleinement intégrés à la Californie depuis plusieurs générations et connaissent leur héritage surtout par leur famille. Leur civilisation est vieille ; chaque individu conserve pourtant le droit de découvrir le monde comme s’il était neuf, ce qui est probablement l’une des choses les plus fidèles à Serathè. Héritiers de Serathè, pas gardiens d'un musée La civilisation aseryne est ancienne, mais son rapport au passé n'est pas celui d'un peuple condamné à le répéter. Serathè elle-même abandonna un jour ses travaux pour construire une embarcation dérisoire et partir découvrir le monde. Cette curiosité est restée une référence culturelle profonde : quitter une vie devenue stérile, voyager ou recommencer n'est pas nécessairement une trahison de la tradition. Cette disposition explique la manière dont les Aseryns ont survécu aux catastrophes. La disparition d'Atlantide n'a pas produit une seule diaspora mais plusieurs trajectoires."
        },
        {
          "type": "p",
          "text": "Aériliens et Néo-Atlantes furent marqués par Aèr et sa Magie ; les Mûliens développèrent davantage leur héritage psychique ; les Hyperboréens cultivèrent des traditions plus physiques ; les Lémurians conservèrent des relations particulières avec des héritages nymphaux et élémentaires ; les Serathéens devinrent un ensemble très métissé de lignées dispersées. Ces peuples ne forment pas un État aseryn unique. Ils partagent des mémoires, des références et des traditions, mais leurs histoires ont eu le temps de produire des intérêts différents. L'idée d'une civilisation aseryne homogène appartient souvent davantage au regard extérieur qu'à l'expérience de ceux qui la vivent. Les Treize comme langage commun Les Treize Fondateurs ne sont pas des ancêtres biologiques distribuant automatiquement des pouvoirs par le sang. Leurs Traditions sont enseignées. Elles représentent des modèles culturels capables de voyager entre diasporas : gouverner selon Athegos, protéger selon Caendis, construire selon Cairiah, rechercher selon Eydreas, créer selon Seryn, nourrir selon Natyel, veiller selon Erith, conserver selon Lisirast, juger selon Lisithas, aimer selon Selerias ou soigner selon Theana. Un Aseryn peut se reconnaître dans plusieurs de ces héritages au cours de sa vie. Leur force vient précisément de ce qu'ils ne réduisent pas une personne à sa naissance. Dans une civilisation où l'espérance de vie se compte en siècles, la possibilité de changer de fonction ou d'idéal n'est pas une exception : elle est une condition pour ne pas devenir prisonnier de sa propre durée. Dratyn occupe une place différente parce qu'elle préserve la Foudre. Tous les Aseryns en portent le potentiel, mais la maîtrise doit être apprise."
        },
        {
          "type": "p",
          "text": "Les conceptions du Créateur, de l'Esprit, de l'Érosion et de la Fin ne sont pas des alignements moraux. Elles décrivent des manières différentes de comprendre une puissance qui appartient au corps aseryn autant qu'à sa cosmologie. Vivre vite dans un corps qui dure longtemps L'Accelyr révèle l'un des paradoxes les plus étrangers de la physiologie aseryne. Leur système nerveux peut fonctionner à une vitesse qui rend certains échanges impossibles à suivre pour un Humain ordinaire, alors même que leur vie s'étend sur plusieurs siècles. Ils peuvent donc connaître des instants d'une densité exceptionnelle au sein d'existences très longues. La société technologique de 2035 produit un environnement qui leur est étrangement adapté : électricité omniprésente, réseaux, champs électromagnétiques et systèmes réagissant en fractions de seconde. Le même monde qui émerveille un Humain par sa vitesse peut encore sembler lent à quelqu'un qui traite naturellement certaines informations autrement. Cette proximité ne signifie pas que tous les Aseryns soient ingénieurs ou passionnés de technologie. Elle donne simplement à leur perception du quotidien une texture différente. Une panne électrique peut être ressentie avant d'être annoncée. Un espace saturé d'équipements possède une présence que d'autres espèces ne perçoivent pas de la même manière. Le Conseil de la Foudre et les Serathéens Le Conseil de la Foudre appartient aux traditions serathéennes d'Amérique du Nord. Ses pratiques, marquées par des approches chamaniques et par le rapport aux Ancêtres, sont importantes pour ces communautés mais ne constituent ni un gouvernement de tous les Aseryns ni une deuxième école universelle de Foudre."
        },
        {
          "type": "p",
          "text": "Cette distinction est essentielle pour comprendre la diversité aseryne. Une institution régionale peut être très ancienne, puissante et respectée sans devenir le centre naturel d'une civilisation entière. Les Aseryns ont trop de siècles de diasporas pour que toutes leurs histoires tiennent dans un seul Conseil. Les Treize comme langage commun Athegos devait guider ; Sundosia explorer ; Caendis protéger ; Cairiah bâtir ; Eydreas douter et rechercher ; Seryn créer ; Natyel nourrir ; Erith surveiller ; Lisirast préserver ; Dratyn transmettre la Foudre ; Lisithas juger ; Selerias maintenir la cohésion ; Theana soigner. Ces fonctions attribuées aux Treize Fondateurs sont devenues des Traditions parce qu'elles décrivaient des besoins qu'aucune catastrophe n'a fait disparaître. La force du système vient précisément de ce qu'il n'est pas biologique. Un enfant ne reçoit pas automatiquement « sa » Tradition par le sang. Il peut être formé, changer de voie ou combiner plusieurs héritages au fil de sa vie. Les lignées familiales influencent naturellement l'éducation, mais elles ne rendent pas une fonction innée. Cette distinction a permis aux différentes diasporas de continuer à se reconnaître après des siècles d'histoires divergentes. Un Hyperboréen et un Néo￾Atlante peuvent désapprouver presque tout de la politique de l'autre et comprendre néanmoins ce que signifie agir selon Caendis ou Theana. Les Treize forment moins un gouvernement qu'un vocabulaire moral et professionnel partagé. Accelyr : une culture à la vitesse du corps L'Accelyr vient d'une physiologie capable de traiter et d'échanger des informations à un rythme qui dépasse facilement les capacités humaines."
        },
        {
          "type": "p",
          "text": "Entre Aseryns entraînés, une conversation peut paraître faite de ruptures, de gestes et de phrases trop rapides pour un observateur ordinaire. Cette vitesse n'est pas seulement un avantage de combat. Elle a influencé l'éducation, le débat et la manière de travailler collectivement. Une réunion aseryne peut parcourir en quelques minutes une quantité d'hypothèses qui exigerait des heures dans une institution humaine, puis sembler étrangement lente lorsqu'elle doit produire un document compréhensible par des partenaires profanes. Le Voile crée donc un problème quotidien spécifique : vivre dans une société qui pense et parle plus lentement sans transformer cette différence en mépris. Les communautés qui travaillent avec des Humains apprennent à ralentir volontairement, à découper leurs raisonnements et à reconnaître que la vitesse cognitive ne remplace ni l'expérience ni la justesse. Les diasporas ne sont pas des castes Les Néo-Atlantes et Aériliens, les Mûliens, les Hyperboréens, les Lémurians et les Serathéens portent des histoires différentes nées des catastrophes et des migrations. Ces noms décrivent des peuples et des trajectoires, pas des spécialisations mécaniques obligatoires. Les Néo-Atlantes conservent une relation particulièrement forte avec Aèr et les héritages magiques qui ont transformé une partie de leur histoire. Les Mûliens ont développé davantage certains héritages psychiques. Les Hyperboréens sont associés à des traditions plus physiques et à des environnements exigeants. Les Lémurians ont entretenu des rapports singuliers avec des héritages nymphaux et élémentaires. Les Serathéens forment des ensembles métissés et dispersés dont les cultures se sont adaptées aux régions où elles ont survécu."
        },
        {
          "type": "p",
          "text": "Aucune de ces descriptions n'enferme un individu. Des millénaires de rencontres et de déplacements ont produit des familles mêlées, des apprentissages croisés et des personnes qui se reconnaissent dans plusieurs héritages à la fois. Les Paleo-Atlantes et le traumatisme du temps Les rares Paleo-Atlantes ayant survécu en stase représentent une fracture plus profonde que la simple ancienneté. Ils ont connu une civilisation dont les autres Aseryns parlent déjà comme d'une histoire fondatrice. Leur réveil signifie découvrir que des institutions, des paysages et parfois des catégories entières de pensée ont disparu. Ils ne sont pas automatiquement plus sages. Comme les Vampires réveillés après une longue torpeur, ils peuvent être extraordinairement compétents dans un monde qui n'existe plus et profondément démunis devant ce qui est devenu banal. Leur présence est précieuse pour les archives et dangereuse pour les mythes : un témoin direct peut confirmer certaines légendes et en détruire d'autres simplement en se souvenant autrement. Le Conseil de la Foudre, une réponse serathéenne En Amérique du Nord, certains Serathéens ont développé le Conseil de la Foudre, tradition régionale marquée par les Ancêtres et des pratiques chamaniques nées de leur histoire locale. Il possède une importance réelle pour ces communautés et peut jouer un rôle politique ou spirituel majeur dans leurs affaires. Il ne représente cependant ni tous les Aseryns ni une seconde autorité universelle parallèle aux Treize. Un Mûlien ou un Néo-Atlante peut connaître son existence sans lui devoir la moindre obéissance."
        },
        {
          "type": "p",
          "text": "Cette modestie d'échelle rend le Conseil plus crédible : c'est une institution née d'une diaspora particulière, pas la réponse automatique de toute une espèce à chaque problème moderne. Nature aseryne Les Aseryns sont une espèce ssrynnesque propre à la Terre, créée par Serathè. Leur apparence converge fortement avec celle des humains, mais leur anatomie interne, leur métabolisme, leur système nerveux et leur activité électromusculaire diffèrent profondément. Leur longévité se compte normalement en siècles. Leur identité mécanique ne repose pas sur une longue liste de pouvoirs innés. Elle repose sur un socle racial commun, de petites particularités d'origine, puis sur des Traditions apprises. Un Aseryn peu intéressé par la Foudre doit disposer d'autant de choix structurants qu'un Aseryn qui en fait sa spécialité. Voile, Semi-Révélation et Révélation État Modificateur commun Voilé (V) Aucun modificateur racial commun. Semi-Révélé (SR) +1 Agilité. Révélé (R) +2 Agilité. Ces modificateurs représentent la véritable vitesse neuromusculaire de l'Aseryn. Ils s'ajoutent aux éventuels modificateurs de l'Origine. Ils n'accordent pas, à eux seuls, de PA supplémentaires automatiques : les PA restent déterminés par le jet d'Initiative normal. Variation de Vigueur et Points de Vie Lorsqu'une forme modifie la Vigueur, les PV maximum et les PV actuels varient immédiatement de 2 × la variation de Vigueur. Une diminution de Vigueur ne peut toutefois pas, à elle seule, faire passer un personnage qui possédait encore des PV positifs sous 1 PV. Un changement de forme ne constitue jamais une méthode de soin : il ne restitue pas des blessures déjà subies. Le supplément de PV représente uniquement la robustesse momentanée du corps plus vigoureux."
        },
        {
          "type": "p",
          "text": "Traits communs gratuits Accelyr Tous les Aseryns comprennent l'Accelyr, une langue parlée à une vitesse que l'oreille et le cerveau humains ne peuvent normalement pas suivre. L'Accelyr ne donne aucun bonus chiffré par lui￾même ; il permet surtout une communication extrêmement rapide entre Aseryns et sert souvent de signe de reconnaissance culturelle. Physiologie aseryne Longévité exceptionnelle, activité neuromusculaire rapide et activité électrique corporelle supérieure font partie de la physiologie de l'espèce. Ces éléments sont principalement narratifs tant qu'un Talent ne leur donne pas un effet précis. La physiologie aseryne n'accorde pas de résistance universelle aux maladies, poisons ou fatigues. Sens électromagnétique SR/R — Passif. L'Aseryn perçoit les sources électromagnétiques significatives, les courants importants, les anomalies magnétiques marquées et les variations soudaines du champ environnant. En se concentrant 1 PA, il peut effectuer Esprit + Perception + 1d10e afin d'obtenir une direction, une proximité approximative et la nature générale de la source. Ce sens ne lit pas des données, ne remplace pas un scanner, ne révèle pas automatiquement tous les êtres vivants derrière les murs et peut être perturbé par un blindage, un brouillage ou un environnement électromagnétique saturé. Potentiel foudroyant Tout Aseryn possède biologiquement le potentiel d'apprendre à maîtriser la Foudre. Ce potentiel n'est pas une Affinité achetée en PTV et n'est pas binaire. Chez un PJ, on considère par défaut une affinité moyenne : il peut apprendre, mais cela demande un véritable enseignement et du temps. Certaines lignées ou individus exceptionnels apprennent beaucoup plus vite, voire manifestent spontanément la Foudre."
        },
        {
          "type": "p",
          "text": "Ces prodiges relèvent du lore et des PNJ extraordinaires ; ils ne constituent pas le profil normal d'un PJ. Routes communes aserynes Les trois routes suivantes approfondissent des capacités présentes chez tous les Aseryns. Elles sont indépendantes des Origines et des Traditions des Fondateurs. Vivacité aseryne Départ fulgurant — 1 PTV | SR/R — Passif Après avoir déterminé normalement le nombre de PA du personnage, ajoutez +3 à son score d'Initiative uniquement pour déterminer son ordre d'action dans les passes. Ce bonus ne modifie jamais le nombre de PA obtenu. Réflexe impossible — 2 PTV | Prérequis : Départ fulgurant | SR/R — Réaction Lorsqu’il est Surpris, l’Aseryn peut malgré tout dépenser 1 PA pour effectuer une Défense active contre une attaque dont il a conscience. Il reste Surpris pour les autres effets applicables. Surcadence nerveuse — 3 PTV | Prérequis : Réflexe impossible | SR/R — Réaction — 1/Scène L'Aseryn gagne immédiatement 1 PA utilisable avant la fin du round. Ce PA ne peut servir qu'à un Déplacement, une Défense active ou une action significative non offensive. Il ne peut pas servir à attaquer, activer un pouvoir offensif ou déclencher une chaîne de gains de PA. Esprit fulgurant Traitement accéléré — 1 PTV | SR/R — 1/Scène Sur une tâche intellectuelle où le temps supplémentaire ne sert qu'à réfléchir, calculer ou comparer des informations déjà disponibles, l'Aseryn peut bénéficier de Prendre son temps sans consommer le délai supplémentaire. Pensée parallèle — 1 PTV | SR/R — Passif L'Aseryn peut conserver une activité mentale simple en arrière-plan pendant qu'il agit : garder un compte, suivre plusieurs communications, poursuivre une comparaison simple ou maintenir un bref échange Accelyr."
        },
        {
          "type": "p",
          "text": "Cela n'autorise jamais deux tests simultanés, deux actions, deux pouvoirs maintenus ou deux concentrations complexes. Décision fulgurante — 2 PTV | Prérequis : Traitement accéléré | SR/R — 1/Scène Après un échec non narratif à un test reposant principalement sur Esprit, relancez le 1d10e et conservez le second résultat. Perception électromagnétique Lecture de champ — 1 PTV | SR/R Lors d'une utilisation focalisée du Sens électromagnétique, l'Aseryn bénéficie de +3 pour déterminer la nature, l'intensité et l'origine probable d'un phénomène électromagnétique. Cartographie inductive — 2 PTV | SR/R — 1 PA Dans un rayon d'environ 10 m, l'Aseryn peut dresser une cartographie grossière des câbles actifs, machines alimentées et principales sources électromagnétiques à travers des obstacles ordinaires. Il n'en lit ni le contenu ni la fonction exacte. Signature électrique — 2 PTV | SR/R Après avoir étudié une machine, un artefact alimenté ou une source énergétique, l'Aseryn peut mémoriser sa signature électromagnétique et la reconnaître ultérieurement si elle reste suffisamment similaire. Perception neuromotrice — 3 PTV | SR/R À très courte portée, lorsqu'il sait qu'une cible est présente, l'Aseryn peut percevoir le déclenchement de mouvements reposant sur une activité nerveuse ou électromécanique détectable. Les pénalités provenant uniquement de l'impossibilité de voir son mouvement ne s'appliquent pas à ses Défenses contre elle. Une fois par scène, il peut en outre recevoir +3 à une Défense active contre une telle cible. Blindage, brouillage ou absence de signature pertinente peuvent neutraliser ce Talent. Origines jouables Les Origines décrivent des branches historiques et biologiques de l'espèce."
        },
        {
          "type": "p",
          "text": "Les différences restent volontairement modestes : les Aseryns demeurent une espèce relativement uniforme. Les Paleo￾Atlantes et les Australisiens ne sont pas proposés comme Origines normales de PJ dans ce corpus. Aérilien / Néo-Atlante SR: +1 Agi, +1 Vol • R: +2 Agi, +1 Vol Orientation: Affinité magique, lecture des flux Mûlien SR: +1 Agi, +1 Esp • R: +2 Agi, +1 Esp Orientation: Psychisme, télépathie Hyperboréen SR: +1 Agi, +1 Vig • R: +2 Agi, +1 Vig Orientation: Physique, endurance, explosivité Lémurian SR: +1 Agi, +1 Vol • R: +2 Agi, +1 Vol Orientation: Héritage nymphal et élémentaire Serathèen SR: +1 Agi • R: +2 Agi Orientation: Ascendance composite, Traces multiples Aérilien / Néo-Atlante Empreinte — Résonance d’Aèr SR : +1 Agilité, +1 Volonté. R : +2 Agilité, +1 Volonté. L'Aérilien sent instinctivement une manifestation magique active directement perceptible : il sait que de la magie est présente, sans en connaître automatiquement la source, le domaine ou la puissance. Esprit + Perception permet d'affiner cette impression. Acclimatation arcanique — SR/R : +3 pour résister aux effets nocifs d'un environnement saturé de magie brute ou instable. Ce bonus ne protège pas contre un sort ou un pouvoir ciblé. Lecture des flux — 1 PTV | SR/R — 1 PA Esprit + Perception permet de distinguer la grande nature d'une manifestation : sort actif, rituel, objet imprégné, lieu saturé, portail, etc. Le DR augmente la précision sans révéler automatiquement l'auteur ou tous les mécanismes. Mémoire de résonance — 1 PTV | SR/R Après avoir étudié une signature magique directement perceptible, l'Aérilien peut reconnaître ultérieurement la même signature ou la même source si elle n'a pas été profondément altérée."
        },
        {
          "type": "p",
          "text": "Ancrage d’Aèr — 2 PTV | SR/R — Réaction — 1/Scène Après un échec non narratif à une défense occulte contre un effet explicitement magique ou lié à un Mageius, relancez le 1d10e et conservez le second résultat. Mûlien Empreinte — Étincelle psychique SR : +1 Agilité, +1 Esprit. R : +2 Agilité, +1 Esprit. En 1 PA, à courte portée, le Mûlien peut envoyer à une cible consentante un mot mental simple, une image, une sensation, une direction ou une intention immédiate. Il ne lit pas l'esprit, ne dialogue pas encore et ne contrôle rien. Présence mentale — SR/R : +3 contre lecture mentale surnaturelle forcée, intrusion télépathique, confusion psychique ou effets similaires visant directement l'esprit. Télépathie mûlienne — 1 PTV | SR/R — 1 PA — Scène L'Étincelle psychique devient une communication bidirectionnelle avec une cible consentante, tant que les conditions de portée et de contact mental sont maintenues. Perception mentale — 1 PTV | SR/R — 1 PA Esprit + Perception permet de sentir approximativement la présence de consciences proches. Le Talent ne révèle ni pensées ni identité et ne produit pas une cartographie exacte à travers les murs. Une dissimulation ou défense occulte peut s'y opposer. Effleurement de pensée — 2 PTV | Prérequis : Télépathie mûlienne | SR/R — 1 PA Volonté + Maîtrise spirituelle contre la Défense occulte de la cible. En réussite, le Mûlien perçoit la pensée consciente dominante ou l'intention immédiate, jamais des souvenirs complets, des secrets profonds ou l'ensemble de l'esprit."
        },
        {
          "type": "p",
          "text": "Réseau mûlien — 3 PTV | Prérequis : Télépathie mûlienne | SR/R — 1 PA — Scène Jusqu'à trois participants consentants peuvent partager un réseau mental tant qu'ils restent dans la même zone opérationnelle et que la liaison n'est pas rompue. Hyperboréen Empreinte — Corps hyperboréen SR : +1 Agilité, +1 Vigueur. R : +2 Agilité, +1 Vigueur. SR/R : +3 pour résister à la fatigue physique, à l'effort prolongé, au froid naturel et aux conditions corporelles hostiles comparables. Ce bonus ne protège pas automatiquement contre une attaque surnaturelle de glace ou de froid. Détente hyperboréenne — 1 PTV | SR/R — 1/round Lors d'un Déplacement, l'Hyperboréen peut parcourir 2 m supplémentaires. Ce bonus est additif, jamais multiplicatif. Appuis du Nord — 1 PTV | SR/R +3 pour résister à une saisie, un renversement ou un déplacement physique forcé. Percussion — 2 PTV | R — 1/round Après avoir volontairement parcouru au moins 3 m avant une attaque de mêlée réussie, choisissez : +2 DGT, ou repousser la cible de 2 m si sa morphologie et la situation le permettent. Réflexe de duel — 2 PTV | R — 1/round Après une Défense active réussie contre une attaque de mêlée, l'Hyperboréen peut immédiatement se repositionner de 2 m vers une position valide. Ce n'est pas un Déplacement complet. Exploit physique — 3 PTV | SR/R — 1/Scène Après un échec non narratif à un test reposant principalement sur des capacités physiques, relancez le 1d10e et conservez le second résultat. Lémurian Empreinte — Héritage nymphal SR : +1 Agilité, +1 Volonté. R : +2 Agilité, +1 Volonté. Choisissez une Résonance élémentaire héritée de l'ascendance nymphale : Air, Eau, Terre ou Feu."
        },
        {
          "type": "p",
          "text": "L'Aseryn sent intuitivement les manifestations significatives de cet élément et reçoit +3 pour résister aux conditions naturelles ordinaires directement liées à celui-ci. Ce bonus ne réduit pas automatiquement les dégâts d'une attaque surnaturelle. Sens élémentaire — 1 PTV | SR/R L'Aseryn perçoit avec précision la présence, le mouvement et les perturbations de son élément à proximité, dans les limites naturelles de ce que l'élément peut transmettre. Façonnage nymphal — 1 PTV | SR/R — 1 PA sous pression L'Aseryn peut manipuler une quantité modeste de son élément déjà présent pour un usage utilitaire et non directement dommageable. Manifestation élémentaire — 2 PTV | R — 1 PA L'Aseryn peut produire une quantité limitée de son élément pour un usage utilitaire. Ce Talent n'est pas, à lui seul, une attaque. Corps accordé — 2 PTV | R Air — Corps des hauteurs : Les chutes ordinaires ne causent normalement plus de dégâts tant que l’Aseryn est conscient et dispose d’un minimum d’espace pour se stabiliser. Un Déplacement peut devenir un grand bond soutenu permettant de franchir un vide ou de gagner/perdre fortement de l’altitude ; il doit terminer sur un support réel. Ce n’est jamais du vol stationnaire. Eau — Corps amphibie : L’Aseryn respire indéfiniment dans l’eau, voit et agit normalement sous l’eau, supporte les pressions naturelles correspondant à des profondeurs où un humain ne pourrait pas fonctionner et se déplace sans les pénalités ordinaires d’un corps humain. Les environnements surnaturels ou abyssaux peuvent toujours le menacer. Terre — Corps de pierre : En R : Armure corporelle 2 contre les dommages matériels."
        },
        {
          "type": "p",
          "text": "Une force physique humaine ordinaire ne suffit normalement pas à le renverser ou à le déplacer contre sa volonté s’il est solidement appuyé au sol. Feu — Corps incandescent : Le corps supporte sans dommage les flammes ordinaires, la chaleur naturelle extrême et la fumée/chaleur produite directement par son propre feu nymphal. Il reçoit Réduction 2 [Feu] contre les dégâts principalement thermiques ou de feu ; les attaques surnaturelles ou armes suffisamment puissantes restent capables de le blesser. Déchaînement nymphal — 3 PTV | R — 2 PA — 1/Scène Air — Front de tempête : Cône d’environ 10 m. Chaque cible exposée oppose sa Défense physique ; en réussite elle est repoussée jusqu’à environ 5 m selon masse et terrain et peut être Renversée si approprié. Fumées, gaz, poussières et flammes ordinaires non protégés sont dispersés. Pas de dégâts automatiques. Eau — Marée suspendue : Petite zone d’environ 4 m de rayon à courte portée, saturée d’eau en mouvement pendant un round. Les flammes ordinaires sont éteintes ; mouvements et projectiles non adaptés sont fortement gênés. Sortir précipitamment de la masse peut demander Vigueur + Athlétisme contre le jet nymphal. Un round ne suffit pas à noyer magiquement une cible. Terre — Soulèvement tellurique : Sur un support minéral connecté, créer pour la scène un couvert total de quelques mètres, un fossé/obstacle, une rampe/plateforme, fermer brutalement une ouverture terrestre ou soulever une petite zone pour Renverser ses occupants. Ne détruit pas automatiquement un bâtiment et ne manipule pas une structure entière hors échelle. Feu — Brasier primordial : Zone d’environ 4 m de rayon, portée courte/moyenne."
        },
        {
          "type": "p",
          "text": "Attaque surnaturelle directe DGT 8, Incendiaire ; une Altération appropriée peut provoquer Enflammé. Pas de second effet gratuit. L’héritage lémurian s’étend aux quatre grands éléments : Air, Eau, Terre et Feu. Serathèen SR : +1 Agilité. R : +2 Agilité. Le Serathèen ne reçoit pas de troisième modificateur d'Attribut : sa force est sa plasticité d'ascendance et de formation. Empreinte — Sang mêlé Choisissez deux Traces ancestrales différentes parmi les quatre suivantes. Trace Effet mineur gratuit Aérilienne 1 PA de concentration : Esprit + Perception pour sentir une magie active directement perceptible. Mûlienne 1/Scène : envoyer une Étincelle psychique simple à une cible consentante. Hyperboréenne +3 pour résister au renversement et au déplacement physique forcé. Lémurienne Choisir une Résonance élémentaire et sentir les manifestations significatives de cet élément ; aucune manipulation. Atavisme marqué — 1 PTV | Passif Choisissez l'une de vos Traces. Elle devient la Signature complète de l'Origine correspondante, sans accorder son bonus d'Attribut : Aérilienne = Résonance d'Aèr + Acclimatation arcanique ; Mûlienne = Étincelle psychique + Présence mentale ; Hyperboréenne = Corps hyperboréen ; Lémurienne = Héritage nymphal complet. Sang pluriel — 1 PTV | Passif — une seule fois Gagnez une troisième Trace ancestrale mineure différente. Héritage éveillé — 2 PTV | Prérequis : Atavisme marqué | Passif Le personnage peut acheter les Talents d'Origine associés à la Trace choisie comme s'il appartenait à cette Origine. Il ne gagne aucun Talent gratuitement."
        },
        {
          "type": "p",
          "text": "Mosaïque ancestrale — 3 PTV | Prérequis : Héritage éveillé | Passif Héritage éveillé peut désormais s'appliquer à une seconde Trace, permettant de développer deux lignées d'Origine différentes. Origines exceptionnelles non proposées normalement aux PJ Paleo-Atlantes : Aseryns nés avant le cataclysme et demeurés en stase. Leur potentiel foudroyant, leur longévité anormale et surtout leur décalage culturel en font des origines de campagne ou des PNJ exceptionnels, pas une option normale de création. Australisiens : les survivants connus sont trop rares et leur profil est insuffisamment documenté pour constituer une Origine jouable standard. Traditions des Treize Quatorze enfants reçurent autrefois une stèle et une mission. Kalirath fut ensuite rejeté et ne resta pas parmi les Fondateurs ; la tradition historique retient donc les Treize. Les Traditions ne sont pas des lignées génétiques ni des droits attachés à un nom de famille. Elles représentent des savoirs et disciplines culturels hérités des fonctions des Fondateurs. Un Aseryn n'a pas besoin de porter le nom de la Maison correspondante pour apprendre une Tradition. Les Traditions ordinaires sont cumulables. Il n'existe ni taxe générique d'ouverture ni limite numérique arbitraire. En revanche, chaque Tradition exige une véritable formation fictionnelle : Maison, communauté, maître, institution ou apprentissage crédible. Dépenser des PTV représente la maîtrise acquise, pas l'achat d'un enseignement sorti de nulle part. Tous les Fondateurs savaient manier la Foudre à des degrés divers. Cela ne transforme pas leurs Traditions en écoles de Foudre : Dratyn avait précisément pour devoir de préserver et transmettre cette discipline."
        },
        {
          "type": "p",
          "text": "Athegos — le Seigneur Ordre fulgurant — 1 PTV | V/SR/R — 1/round L'Aseryn peut fournir une Assistance +2 en combat, normalement interdite, à un allié qu'il peut réellement conseiller et avec lequel il peut communiquer. Les conditions normales d'Assistance restent valables, notamment la Compétence minimale requise. Avec un autre Aseryn, l'ordre peut être transmis en Accelyr. Prendre la tête — 2 PTV | 1/Scène Au début d'un round, désignez jusqu'à deux alliés capables de comprendre Athegos. Jusqu'à la fin du round, ils peuvent volontairement agir après lui au sein de leur passe d'Initiative, même si leur ordre normal les placerait avant. Aucun PA n'est gagné. Une seule décision — 3 PTV | 1 PA — 1/Scène Athegos transmet un plan bref à jusqu'à trois alliés consentants. Chacun reçoit +2 à sa première action directement nécessaire à ce plan avant le début du prochain round d'Athegos. Ce bonus est une Assistance. Sundosia — l’Aventurière Toujours une issue — 1 PTV | 1/Scène Quand une approche, un accès ou un itinéraire vient de se révéler impraticable, le joueur peut demander au MJ quelle autre possibilité réaliste peut immédiatement être tentée avec ce que le personnage perçoit ou sait. Le Talent n'invente aucun passage qui n'existe pas. Improvisation d’aventurier — 2 PTV | 1/Scène Lorsqu'un objet, véhicule, équipement ou élément du décor est utilisé de manière crédible hors de son usage prévu, ignorez jusqu'à -3 de malus circonstanciel provenant uniquement de cette improvisation."
        },
        {
          "type": "p",
          "text": "S’adapter ou mourir — 3 PTV | 1/Scène Après un échec non narratif principalement causé par un environnement, un moyen de déplacement ou une situation que Sundosia n'avait encore jamais rencontrée, la prochaine tentative pertinente de la scène voit sa difficulté réduite d'un niveau. Cette réduction reste soumise au plafond général de réduction de difficulté. Caendis — le Protecteur Interposition — 1 PTV | Réaction — 1 PA Lorsqu'un allié situé à 2 m maximum est directement ciblé par une attaque physique, Caendis peut se déplacer dans la trajectoire si cela est matériellement possible et devenir la cible de l'attaque. Garde rapprochée — 2 PTV | Prérequis : Interposition | 1/round +3 à une Défense active effectuée alors que Caendis protège directement quelqu'un d'autre. Aucun ne passera — 3 PTV | Prérequis : Garde rapprochée | 1/Scène Lorsqu'il utilise Interposition, Caendis peut déclarer ce Talent. Jusqu'au début de son prochain round, il peut effectuer jusqu'à deux Interpositions supplémentaires sans payer leur coût en PA, à condition que chaque déplacement reste physiquement possible. Les Défenses actives éventuelles coûtent toujours leurs PA normaux. Cairiah — l’Architecte Œil de structure — 1 PTV | Passif Après une observation suffisante d'une construction, fortification, installation fixe ou structure naturelle, Cairiah identifie les supports principaux, fragilités structurelles manifestes, zones protégées, risques d'effondrement et possibilités réalistes de consolidation. Les défauts cachés ou structures très complexes peuvent nécessiter un test."
        },
        {
          "type": "p",
          "text": "Fortification — 2 PTV | Préparation de quelques minutes Avec des matériaux adaptés et des outils raisonnables, Cairiah peut aménager une vraie position : barricade, accès renforcé, couvert, abri, consolidation ou poste protégé. Une position correctement construite procure Couvert +3 contre les menaces auxquelles elle a été conçue pour faire face. Aucun usage instantané en combat. Position maîtresse — 3 PTV | Prérequis : Fortification | Préparation d’environ 30 minutes minimum Avec une zone réellement aménageable et des ressources suffisantes, Cairiah peut préparer jusqu'à trois ouvrages cohérents avec le terrain. Ouvrage Effet possible Couvert préparé Couvert +3 pour les personnes réellement protégées."
        }
      ]
    },
    {
      "id": "acces",
      "title": "Accès",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "renforcé +3 à la difficulté des tentatives physiques visant à forcer ou franchir cet accès. Ouvrage Effet possible Goulet Un passage est aménagé pour ralentir une intrusion ; le premier Déplacement hostile à travers lui est réduit de moitié. Poste d’observation +3 Perception pour surveiller une approche déterminée. Voie de repli Un itinéraire préparé permet au groupe d’éviter le premier obstacle circonstanciel prévu lors du retrait. Consolidation +3 pour résister aux effets menaçant directement l’intégrité de la structure aménagée. Eydreas — le Chercheur Hypothèse adverse — 1 PTV | 1/Scène Après avoir construit une hypothèse à partir d'indices, le joueur peut demander : « Quel élément que j'ai déjà observé cadre le moins bien avec mon hypothèse ? » Le MJ désigne un détail existant s'il y en a un ; aucune information nouvelle n'est créée. Reprendre le raisonnement — 2 PTV | 1/Scène Après un échec non narratif à un test d'analyse, compréhension, enquête ou diagnostic intellectuel, relancez le 1d10e et conservez le second résultat. Détruire la fausse certitude — 3 PTV | 1/Scénario Quand le groupe s'est engagé dans une explication ou un plan fondé sur des faits connus, le joueur peut demander quelle hypothèse importante actuellement tenue pour vraie repose sur les preuves les plus fragiles. Le MJ désigne la faiblesse du raisonnement, pas la vérité objective. Seryn — l’Artisane Main de Seryn — 1 PTV | 1/Scène Pour fabriquer, réparer ou modifier quelque chose que Seryn maîtrise réellement, elle peut bénéficier de Prendre son temps sans consommer le délai supplémentaire."
        },
        {
          "type": "p",
          "text": "Adaptation de terrain — 2 PTV | Préparation de quelques minutes Seryn modifie un équipement connu pour répondre à une contrainte précise : ergonomie, montage, étanchéité, alimentation, équilibre, protection d'une partie fragile, etc. Jusqu'à la fin de la scène, l'équipement ignore jusqu'à -3 de malus provenant de cette contrainte. Refuser la panne — 3 PTV | 1/Scène — 1 PA Un équipement que Seryn utilise ou peut immédiatement atteindre devient inutilisable à cause d'une panne ou détérioration réparable. Elle le remet provisoirement en fonctionnement jusqu'à la fin de la scène. Il reste réellement endommagé et devra être réparé ensuite. Natyel — le Nourricier Lire la terre — 1 PTV | Passif après quelques minutes Dans un environnement naturel, Natyel identifie les sources plausibles d'eau et de nourriture, les déséquilibres écologiques manifestes, les passages récents de faune significative et les zones les plus adaptées à la subsistance. Prélèvement efficace — 2 PTV | Passif Après une chasse, collecte ou récupération naturelle réussie, comptez DR +1 uniquement pour déterminer la quantité ou la qualité des ressources obtenues, sans dépasser DR 5 et sans accroître les dégâts écologiques. La famille ne manque de rien — 3 PTV | 1/Scénario Quand nourriture, eau, abri ou ressource naturelle devient une menace réelle, Natyel peut révéler avoir raisonnablement anticipé une réserve ou une solution de subsistance lors d'une occasion antérieure où cela était possible. Il ne peut pas inventer rétroactivement de l'argent, une arme, un équipement rare ou une ressource qui n'aurait pas pu être préparée."
        },
        {
          "type": "p",
          "text": "Erith — la Sentinelle Veille d’Erith — 1 PTV | Passif +3 pour détecter une embuscade, une intrusion ou une approche hostile lorsque le personnage assure réellement une surveillance. Alerte fulgurante — 2 PTV | Réaction — 1/Scène Lorsqu'Erith détecte un danger avant un allié capable de recevoir son avertissement, cet allié n'est pas considéré Surpris par ce danger. Périmètre sous contrôle — 3 PTV | Préparation de 10 minutes Après avoir étudié un lieu raisonnablement délimité — appartement, étage, petit camp, portion d’entrepôt, cour — Erith établit son périmètre pour la scène. Il conserve instinctivement l’état pertinent des accès et zones qu’il a pu intégrer et sait immédiatement qu’un changement physique grossier s’y produit. Une intrusion hostile empruntant un accès ou trajet intégré au périmètre ne peut pas le Surprendre par de simples moyens ordinaires de Furtivité. L’intrus peut rester caché après son entrée et Erith ne connaît pas automatiquement son identité ni sa position précise. Téléportation, passage dimensionnel, accès réellement inconnu, capacité surnaturelle spécifiquement adaptée ou altération du périmètre depuis l’extérieur peuvent contourner la veille. Lisirast — l’Archiviste Mémoire d’archive — 1 PTV | Passif Ce que Lisirast a volontairement décidé d'archiver mentalement peut être restitué avec une très grande précision. Le Talent n'accorde pas une mémoire eidétique permanente de tout ce qu'il a vécu. Index vivant — 2 PTV | 1/Scène Sur un sujet déjà étudié, le joueur peut demander au MJ de lui rappeler une information pertinente déjà rencontrée par le personnage mais oubliée par le joueur. Aucune information nouvelle n'est créée."
        },
        {
          "type": "p",
          "text": "Chambre scellée — 3 PTV | Passif Lisirast peut compartimenter un secret majeur à la fois. Une lecture mentale superficielle ne peut pas tomber dessus accidentellement et une tentative visant spécifiquement ce secret subit +3 à la difficulté ou à la Défense appropriée. La perte de conscience n'ouvre pas automatiquement le compartiment. Lisithas — le Juge Contradiction — 1 PTV | V/SR/R — Passif Lorsqu'une personne exprime pendant la scène deux affirmations directement incompatibles, Lisithas remarque automatiquement la contradiction. Cela ne détecte pas le mensonge et ne remplace pas une enquête lorsque la contradiction dépend d'informations extérieures complexes. Plaidoyer raisonné — 2 PTV | V/SR/R Lorsqu'il cherche à convaincre par un raisonnement construit sur des faits, règles, contrats, obligations ou engagements connus, Lisithas peut utiliser Esprit + Diplomatie à la place de Charisme + Diplomatie. Ce Talent ne s'applique pas à la séduction, la flatterie ou l'inspiration purement émotionnelle. Arbitrage — 2 PTV | 1/Scène Lorsque deux parties acceptent réellement Lisithas comme arbitre, il peut conduire une discussion contradictoire puis demander au MJ : quel est le véritable point de désaccord ? quel fait connu est le plus déterminant ? quelle concession réaliste de chaque côté permettrait un compromis ? Les réponses sont limitées à ce que Lisithas peut déduire des informations exposées. Autorité du jugement — 3 PTV | Prérequis : Plaidoyer raisonné | 1/Scène Après avoir réellement exposé son raisonnement, Lisithas effectue un test social approprié."
        },
        {
          "type": "p",
          "text": "En réussite, les personnes neutres, hésitantes ou ayant volontairement accepté son arbitrage cessent l'escalade immédiate assez longtemps pour entendre la décision et pouvoir y répondre. Ce n'est pas une domination mentale. Selerias — l’Aimante Lien entretenu — 1 PTV | Passif Lorsqu'elle aide une personne avec laquelle elle entretient un lien établi, Selerias peut fournir une Assistance fondée sur son soutien, sa connaissance de la personne ou sa coordination même si elle possède 0 dans la Compétence technique concernée, à condition que ce ne soit précisément pas l'expertise technique qui constitue l'aide. Je te connais — 2 PTV | 1/Scène Lorsqu'un proche résiste à une manipulation surnaturelle émotionnelle, une peur, une rupture forcée de confiance ou un effet affectif comparable, Selerias peut lui fournir Assistance +2, y compris en combat si elle peut communiquer avec lui. La famille tient — 3 PTV | 1 PA — 1/Scène Choisissez un allié avec lequel Selerias possède un lien personnel réel et avec lequel elle peut communiquer. Si les circonstances permettraient normalement à cet allié d'effectuer un test pour sortir de Tendu ou Paniqué, il en sort automatiquement sans effectuer le test. Si aucun test ne serait normalement possible, le Talent ne contourne pas cette impossibilité. Theana — la Guérisseuse Theana est la Fondatrice. Theanai désigne la Maison/lignée moderne. Œil de Theana — 1 PTV | V/SR/R Pour un diagnostic courant dans son domaine, aucun jet n'est nécessaire dès lors qu'un examen réel est possible et que rien ne masque anormalement le problème. Face à un cas rare, complexe, masqué ou surnaturel, +3 au test de diagnostic."
        },
        {
          "type": "p",
          "text": "Médecine de terrain — 2 PTV | Passif Ignorez jusqu'à -3 de malus circonstanciel provenant d'un lieu inadéquat, du déplacement du patient ou d'outils improvisés mais réellement fonctionnels. Le Talent ne crée jamais un matériel indispensable absent. Geste salvateur — 2 PTV | 1/Scène Après un échec non narratif à un test de soins d'urgence ou de stabilisation, relancez le 1d10e et conservez le second résultat. L’impossible reste possible — 3 PTV | 1/Scénario Un acte médical normalement réalisable serait impossible uniquement à cause des conditions matérielles présentes. Si Theana dispose malgré tout des éléments absolument indispensables, elle peut tenter l'intervention à Difficulté 21, ou à sa difficulté normale si celle-ci est supérieure. Dratyn — la Maîtresse de la Foudre Dratyn est l'exception volontaire parmi les Traditions : sa mission était d'assurer la continuité de la maîtrise de la Foudre, de l'enseigner et d'en contrôler la transmission. Elle dispose donc d'un développement plus profond que les autres Fondateurs. Tout Aseryn possède le potentiel physiologique requis. Pour un PJ, l'affinité est moyenne par défaut. L'accès mécanique dépend d'un véritable enseignement : Temple, prêtresse renégate, maître indépendant, tradition familiale ou autre source crédible. Être prêtresse n'est pas nécessaire pour apprendre la Foudre, et être prêtresse ne l'accorde pas automatiquement. Règles communes de Foudre Élément Règle V2 État requis La génération de Foudre exige normalement R. Conduction peut fonctionner en SR/R. Activation d’une attaque 1 PA sauf Talent contraire. Jet de Foudre Volonté + Maîtrise spirituelle + 1d10e contre la Défense pertinente."
        },
        {
          "type": "p",
          "text": "Résolution Dégâts = Marge de réussite + DGT - Protection électrique applicable. Portée normale 20 m. Armure conventionnelle Kevlar, plaques, armure de combat ordinaire : aucune réduction contre la Foudre. Protection pertinente Isolation électrique réelle, cage de Faraday, équipement conçu pour canaliser la décharge ou protection surnaturelle adaptée. Élément Règle V2 Paliers de Tir Ne s’appliquent pas. Pas de double DGT ni d’Altération automatique à marge 6/11. Foudre aseryne DGT 7. Foudre originelle DGT 9. Déferlement originel DGT 13. Une armure métallique n'augmente pas automatiquement les dégâts : elle ne protège simplement pas, sauf si sa conception lui donne une véritable fonction électrique. Talents communs de Dratyn Conduction — 1 PTV | SR/R — 1 PA sous pression L'Aseryn peut guider, attirer, interrompre ou redistribuer un courant électrique déjà existant : exploiter un conducteur, provoquer ou empêcher un arc, charger ou décharger un objet, influencer un circuit simple. Il ne produit pas encore sa propre Foudre. Foudre aseryne — 2 PTV | Prérequis : Conduction | R — 1 PA L'Aseryn peut générer et projeter sa propre Foudre. Il gagne l'attaque de Foudre standard, DGT 7, selon les règles communes ci-dessus. Décharge maîtrisée — 1 PTV | Prérequis : Foudre aseryne | R L'Aseryn sait moduler intensité et durée : alimenter ou décharger un appareil, provoquer un choc non destiné à tuer, neutraliser une installation électrique ordinaire accessible, souder ou brûler localement un matériau conducteur, etc. En cas d'incertitude, utilisez un Jet de Foudre contre une difficulté appropriée."
        },
        {
          "type": "p",
          "text": "Paratonnerre — 2 PTV | Prérequis : Foudre aseryne | SR/R — Réaction — 1 PA — 1/round Lorsqu'une attaque ou manifestation principalement électrique frappe l'Aseryn ou passe suffisamment près, il peut opposer un Jet de Foudre au résultat de l'effet. En réussite, il détourne la décharge vers un conducteur ou une zone valide proche et annule les dégâts qu'il aurait personnellement subis. Il ne renvoie pas automatiquement l'attaque sur un adversaire. Arc en chaîne — 2 PTV | Prérequis : Foudre aseryne | R — 1/Scène Après un Jet de Foudre réussi contre une cible, une seconde cible située à 3 m maximum de la première peut être frappée par le même résultat. Elle se défend normalement. La seconde décharge est DGT 5. Un seul rebond. Orage aseryn — 3 PTV | Prérequis : Foudre aseryne | R — 2 PA — 1/Scène L'Aseryn libère une décharge dans une zone de 3 m de rayon à portée. Un seul Jet de Foudre est comparé individuellement à la Défense de chaque cible. DGT 7. Spécialisation de Foudre Après Foudre aseryne, un personnage peut recevoir l'enseignement d'une tradition spécialisée. Pour un PJ, une seule des quatre spécialisations suivantes est normalement maîtrisable : Créateur, Esprit, Érosion ou Fin. Apprendre une seconde tradition relève d'un événement de campagne exceptionnel et de l'accord du MJ. La spécialisation représente un enseignement reçu, pas nécessairement une appartenance institutionnelle actuelle. Une prêtresse renégate peut transmettre sa tradition hors de son Temple. Créateur — Foudre originelle La Foudre du Créateur est la Foudre pure, originelle : puissance brute et capacité à détruire la magie."
        },
        {
          "type": "p",
          "text": "Foudre originelle — 1 PTV | Prérequis : Foudre aseryne + enseignement du Créateur | R Lorsque le personnage le souhaite, ses attaques de Foudre deviennent originelles : DGT 9. La magie active et ses constructions deviennent des cibles valides : mur magique, manifestation élémentaire maintenue, familier constitué de magie, protection de Mageius, etc. Brise-magie — 2 PTV | Prérequis : Foudre originelle | R — 1 PA L'Aseryn vise directement un effet magique actif. Effectuez un Jet de Foudre contre son résultat de lancement s'il est connu, sinon contre une difficulté 15 / 18 / 21 / 25 selon sa puissance. En réussite, un effet temporaire ou maintenu est détruit. Un enchantement permanent, un lieu magique ou un artefact majeur n'est au mieux neutralisé pour la scène que si sa nature permet réellement une interruption. Déferlement originel — 3 PTV | Prérequis : Brise-magie | R — 2 PA — 1/Scène Une attaque de Foudre originelle passe à DGT 13. Les Protections d'origine magique ne réduisent pas ses dégâts. Si la cible est elle-même une manifestation magique, le résultat du Jet peut également servir à la briser selon Brise-magie, sans second jet. Esprit — Noire-Foudre La Noire-Foudre applique la Foudre au monde immatériel : esprits, Ombres, projections et phénomènes métaphysiques. Elle est presque invisible et ne doit pas devenir un simple bouton permettant d'attaquer la défense la plus faible d'un adversaire ordinaire. Noire-Foudre — 1 PTV | Prérequis : Foudre aseryne + enseignement de l’Esprit | R La décharge devient presque invisible et ne révèle pas automatiquement la position de son utilisateur par un éclair lumineux."
        },
        {
          "type": "p",
          "text": "Elle peut affecter normalement les esprits, Ombres et créatures immatérielles ; contre une cible purement immatérielle, utilisez sa Défense occulte et sa Protection occulte plutôt que l'armure physique. Atteindre l’immatériel — 2 PTV | Prérequis : Noire￾Foudre | R Lorsqu'il attaque une créature réellement immatérielle qu'il peut effectivement percevoir, les obstacles purement matériels ne lui fournissent pas de Protection et l'armure matérielle est ignorée. Ce Talent ne localise pas une cible inconnue et ne permet pas de frapper au hasard à travers plusieurs étages. Fulguration spirituelle — 2 PTV | Prérequis : Noire￾Foudre | R — 1/Scène L'Aseryn peut viser la composante immatérielle d'un être seulement lorsque celle-ci est réellement exposée ou activement engagée : possession, projection astrale, forme spirituelle, pouvoir mental maintenu ou phénomène comparable. L'attaque est alors opposée à la Défense occulte et ignore les Protections purement matérielles. Les dégâts restent des PV normaux. Éclipse noire — 3 PTV | Prérequis : Fulguration spirituelle | R — 2 PA — 1/Scène Contre un esprit, une Ombre, une construction immatérielle ou un phénomène magique principalement métaphysique : DGT 9, sans Protection matérielle. Si la cible est un effet plutôt qu'une créature et que le Jet dépasse sa difficulté ou son résultat d'origine, l'effet est détruit. Érosion — Foudre vaporeuse La Foudre vaporeuse ne cherche pas à surpasser le Créateur en dégâts. Elle ronge les protections, malédictions, corruptions et manifestations jusqu'à les amoindrir ou les faire céder. Foudre vaporeuse — 1 PTV | Prérequis : Foudre aseryne + enseignement de l’Érosion | R Après une attaque réussie, l'Aseryn peut sacrifier 2 points de dégâts."
        },
        {
          "type": "p",
          "text": "Une Protection directement touchée est alors réduite de 2 jusqu'à la fin de la scène. Une même Protection ne peut subir cette réduction qu'une fois par cette version du Talent. La Foudre peut dégrader une armure physique ordinaire même si celle-ci n'aurait pas protégé contre la décharge elle￾même, afin d'ouvrir la cible aux attaques des alliés. Éroder l’affliction — 2 PTV | Prérequis : Foudre vaporeuse | R — 1 PA Une malédiction, corruption, maladie surnaturelle ou altération occulte active peut être ciblée directement. Jet de Foudre contre son résultat d'origine ou une difficulté 15 / 18 / 21 / 25. En réussite, l'affliction est affaiblie pour la scène : un malus chiffré est réduit de 3 ; si elle impose des tests de résistance, leur difficulté baisse d'un niveau. L'effet n'est pas nécessairement guéri. Ruine des protections — 2 PTV | Prérequis : Foudre vaporeuse | R La réduction de Protection de Foudre vaporeuse passe de -2 à -3 et peut affecter une Protection issue d'un pouvoir surnaturel même sans matérialité physique. Réduire en poussière — 3 PTV | Prérequis : Éroder l’affliction | R — 1/Scène Après avoir réussi à cibler directement une malédiction, corruption, protection surnaturelle, effet magique ou manifestation immatérielle, l'Aseryn peut pousser l'Érosion jusqu'à la rupture. Si l'effet n'est ni primordial ni explicitement indestructible, il est supprimé pour la scène. S'il était déjà temporaire, il est détruit définitivement ; une altération durable peut revenir ensuite. Fin — Foudre du Silence La Foudre du Silence est la Foudre du Néant. Elle ne se contente pas de détruire : elle efface."
        },
        {
          "type": "p",
          "text": "C'est l'une des armes aserynes les plus terrifiantes et l'une des rares capables de donner une véritable fin à certaines manifestations des Fléaux. Foudre du Silence — 1 PTV | Prérequis : Foudre aseryne + enseignement de la Fin | R La décharge ne produit pratiquement ni tonnerre ni crépitement. DGT 7. Hors attaque, l'Aseryn peut appliquer son effet d'effacement avec une extrême précision pour graver, sectionner ou supprimer de très petites quantités de matière sans ravager ce qui les entoure, lorsque la fiction le permet. Trace du Néant — 2 PTV | Prérequis : Foudre du Silence | R Les dégâts infligés par la Foudre du Silence ne peuvent pas être récupérés par une Régénération surnaturelle avant la fin de la scène. Contre un Fléau ou une engeance directement issue d'un Fléau, cette propriété affecte réellement les mécanismes qui lui permettent de persister. Trait du Silence — 2 PTV | Prérequis : Foudre du Silence | R — 2 PA — 1/Scène L'Aseryn concentre la Foudre du Silence en un trait extrêmement fin : DGT 9. Toute Protection électrique réellement applicable est divisée par deux, arrondie à l'inférieur. Lorsque la marge et la situation le permettent, le Trait peut effacer un composant physique précis ; il ne permet jamais d'annoncer arbitrairement « j'efface son cerveau » sur une réussite ordinaire."
        },
        {
          "type": "p",
          "text": "Fin véritable — 3 PTV | Prérequis : Trace du Néant + Trait du Silence | R — Passif Lorsqu'un Fléau ou une de ses engeances subit de la Foudre du Silence et remplit les conditions qui permettraient réellement sa destruction, ses mécanismes habituels de régénération, reconstitution, retour depuis des restes, transfert dans une autre enveloppe ou survie par simple persistance surnaturelle ne suffisent pas automatiquement à l'en sauver. Le Talent ne contourne jamais les conditions narratives nécessaires pour rendre un Fléau majeur vulnérable. Conseil de la Foudre Le Conseil de la Foudre est une tradition serathéenne nord-américaine à forte dimension chamanique. Malgré son nom, ce n'est pas une école de Foudre : les grands manieurs qui en sont issus utilisent Dratyn comme les autres Aseryns. Sa singularité vient surtout de ses Ancêtres, des spectres conservés par la Grotte du Conseil et de la possession rituelle. Accès Profil Accès Serathèen issu du Conseil Naturel : son milieu culturel peut justifier directement la formation. Autre Serathèen Ouvert : nécessite accueil et enseignement réel. Aseryn d’une autre Origine Ouvert ou Restreint selon le contexte ; aucun verrou biologique absolu. Les Voies du Conseil sont cumulables. L'accès aux spectres dépend aussi du lieu, des liens avec la communauté et de la coopération des Ancêtres."
        }
      ]
    },
    {
      "id": "technique-commune",
      "title": "Technique commune",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:conseil-de-la-foudre-technique-commune}}"
        }
      ]
    },
    {
      "id": "voie-des-ancetres",
      "title": "Voie des Ancêtres",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:conseil-de-la-foudre-voie-des-ancetres}}"
        }
      ]
    },
    {
      "id": "voie-du-vaisseau",
      "title": "Voie du Vaisseau",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:conseil-de-la-foudre-voie-du-vaisseau}}"
        }
      ]
    },
    {
      "id": "voie-du-gardien-de-la-grotte",
      "title": "Voie du Gardien de la Grotte",
      "level": 3,
      "blocks": [
        {
          "type": "p",
          "text": "{{Talents|group=aseryn:conseil-de-la-foudre-voie-du-gardien-de-la-grotte}}"
        }
      ]
    }
  ]
} as const;
const article=(id:string,category:"Vérité"|"Règles",title:string,tags:string[],sections:readonly unknown[]):Article=>({id,dataset:"verite-v7",category,sourceCategory:category,title,source:SOURCE,status:"canon_enrichi",rebuildV2:true,tags,sections:sections as unknown as Section[]});
export const COMPENDIUM_VERITE_V7_ASERYN_ARTICLES:Article[]=[
article("verite-v7-aseryns-serathe-atlantide-treize","Vérité","Aseryns — Serathè, Atlantide & Treize",["Vérité","Aseryns","Serathè","Atlantide","Treize","Accelyr","Paleo-Atlantes"],SOURCE_PAYLOAD.lore),
article("regles-verite-v7-aseryn-nature-accelyr-origines","Règles","Nature, Accelyr & Origines",["Vérité","Aseryns","Nature","Accelyr","Origines","Résonance","Serathéens"],SOURCE_PAYLOAD.r1),
article("regles-verite-v7-aseryn-treize-dratyn-conseil-foudre","Règles","Treize Traditions, Dratyn & Conseil de la Foudre",["Vérité","Aseryns","Treize","Dratyn","Foudre","Conseil de la Foudre"],SOURCE_PAYLOAD.r2)
];
export const COMPENDIUM_VERITE_V7_ASERYN_NAVIGATION=[
{id:"verite-v7-aseryns-serathe-atlantide-treize",dataset:"verite-v7",category:"Vérité",group:"Peuples & Natures",groupOrder:30,subgroup:"Aseryns",subgroupOrder:50,pageOrder:10,displayTitle:"Aseryns — Serathè, Atlantide & Treize"},
{id:"regles-verite-v7-aseryn-nature-accelyr-origines",dataset:"verite-v7",category:"Règles",group:"Vérité — Natures & capacités",groupOrder:80,subgroup:"Aseryns",subgroupOrder:70,pageOrder:10,displayTitle:"Nature, Accelyr & Origines"},
{id:"regles-verite-v7-aseryn-treize-dratyn-conseil-foudre",dataset:"verite-v7",category:"Règles",group:"Vérité — Natures & capacités",groupOrder:80,subgroup:"Aseryns",subgroupOrder:70,pageOrder:20,displayTitle:"Treize Traditions, Dratyn & Conseil de la Foudre"}
];