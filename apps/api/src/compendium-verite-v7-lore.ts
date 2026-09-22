type Block={type:"p";text:string;style?:string}|{type:"table";rows:unknown[][]};
type Section={id:string;title:string;level:number;audience?:"mj";blocks:Block[]};
type Article={id:string;dataset:string;category:string;sourceCategory:string;title:string;source:string;status:string;rebuildV2:true;tags:string[];sections:Section[]};
const SOURCE="TUC_Verite_V7_CROSSAUDIT_2026-09-10.docx";
const SOURCE_ARTICLES=[
  {
    "id": "verite-v7-derriere-le-voile",
    "title": "Vérité — derrière le Voile",
    "tags": [
      "Vérité",
      "Voile",
      "Profane",
      "Éveillé",
      "Initié",
      "Chasseurs",
      "monde caché"
    ],
    "sections": [
      {
        "id": "la-verite-n-est-pas-un-second-monde",
        "title": "La Vérité n'est pas un second monde",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "La Vérité n'est pas une dimension secrète superposée à la Terre comme un décor que l'on pourrait rejoindre en ouvrant la bonne porte. Elle est le nom donné à tout ce que le monde visible ne montre pas correctement : la nature réelle de certains êtres, les phénomènes occultes, les héritages venus d'Aèr, les espèces galactiques cachées parmi les Humains, les traces laissées par des puissances antérieures à l'Histoire et les mécanismes qui permettent à tout cela de coexister avec une civilisation convaincue d'habiter un univers beaucoup plus simple. Un Vampire qui traverse Los Angeles ne marche pas dans une ville différente de celle du passant humain qui le croise. Ils empruntent le même trottoir, paient dans les mêmes commerces et sont filmés par les mêmes caméras. Ce qui change est la manière dont le monde présente l'un à l'autre. Pour le profane, l'être impossible possède un corps, une silhouette et une histoire immédiatement compatibles avec la Réalité. Pour celui qui sait regarder autrement, cette cohérence devient une surface : derrière elle apparaissent une seconde anatomie, une autre origine, des signes que la majorité des témoins n'a jamais appris à nommer. La Vérité n'est donc pas l'opposé de la Réalité. Les deux occupent le même espace et produisent des conséquences réelles. Une dette mafieuse reste une dette même si son créancier est un Ashyll. Une balle reste dangereuse pour un Mage. Une corporation peut employer un Exilé sans connaître son origine. Un Angelus peut avoir une identité civile, un salaire, une famille et un appartement sans que ces éléments soient des déguisements. La vie visible n'est pas fausse ; elle est incomplète."
          },
          {
            "type": "p",
            "text": "C'est ce caractère incomplet qui rend la découverte de la Vérité si déstabilisante. L'initié n'apprend pas seulement que « les monstres existent ». Il découvre que certaines certitudes historiques, religieuses, scientifiques et personnelles n'étaient valables que dans un monde dont une partie essentielle lui était inaccessible. Les légendes cessent d'être de simples histoires, mais elles ne deviennent pas pour autant des manuels fiables. Les religions contiennent des souvenirs authentiques mêlés à des siècles d'interprétation. Les archives peuvent avoir été corrigées. Les témoins peuvent dire sincèrement ce qu'ils croient avoir vu tout en décrivant autre chose que ce qui s'est réellement produit."
          }
        ]
      },
      {
        "id": "entrer-dans-la-verite-savoir-n-est-pas-voir",
        "title": "Entrer dans la Vérité : savoir n'est pas voir",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les initiés emploient facilement des mots qui donnent l'impression d'une progression claire : Profane, Éveillé, Initié. Dans la vie réelle, le passage de l'un à l'autre est rarement une cérémonie parfaitement ordonnée. Une personne peut connaître l'existence des Vampires et ne rien savoir des Extrals. Elle peut avoir vécu dix ans dans une famille exilée sans comprendre la cosmologie que ses grands-parents tiennent pour évidente. Elle peut reconnaître une manifestation magique et continuer à rationaliser tout le reste. Le **Profane** n'est donc pas simplement quelqu'un qui n'a jamais été exposé à l'impossible. Beaucoup de profanes ont déjà croisé la Vérité. Le Voile, leur propre besoin de cohérence et les explications de la société visible ont rendu l'expérience compatible avec leur vision du monde. Ils se souviennent d'un animal, d'une panne, d'un homme extrêmement fort, d'une crise de panique ou d'une silhouette mal éclairée. L'**Éveillé** a franchi une limite intérieure. Il sait que le monde contient des éléments que la Réalité publique ne décrit pas correctement. Cette certitude ne lui fournit aucune encyclopédie. Elle lui permet surtout de poser enfin les bonnes questions et de cesser de jeter automatiquement les réponses impossibles. L'**Initié** possède en plus une culture de Vérité suffisamment structurée pour agir. Il connaît des noms, des dangers, des règles de prudence, des personnes à contacter et des manières de vérifier ce qu'il croit avoir compris. Cette compétence peut venir d'une naissance dans une communauté, d'une Loge, d'un Silcenter, d'une Cour, du GAAC, d'une tradition de Chasse ou simplement de plusieurs années passées à survivre. Aucun de ces termes ne constitue un bonus universel."
          },
          {
            "type": "p",
            "text": "Ils décrivent une position narrative face au monde caché. Un Profane peut être un excellent enquêteur ; il attribuera simplement ses découvertes à un cadre qui lui paraît possible. Un Initié peut être parfaitement incompétent en dehors de la petite partie de Vérité qu'il connaît."
          }
        ]
      },
      {
        "id": "le-cas-particulier-des-chasseurs-reconnus",
        "title": "Le cas particulier des Chasseurs reconnus",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "Le véritable Chasseur finit par devenir une anomalie pour le fonctionnement ordinaire du Voile. Il ne se contente plus d'avoir vu une scène impossible : l'Hologramme le reconnaît comme quelqu'un qui agit durablement dans la Vérité. Les corrections banales de mémoire ne suffisent alors plus à lui faire oublier ce qu'il a réellement vécu. Cette reconnaissance ne lui accorde pas pour autant une vision surnaturelle universelle. Un Chasseur peut se souvenir parfaitement d'avoir vu un Vampire Révélé et être incapable d'identifier le même individu lorsqu'il est ensuite Voilé. Il peut conserver un souvenir qu'une caméra a perdu sans voir à travers la traduction. Il reste vulnérable aux pouvoirs explicitement capables d'altérer l'esprit ou la mémoire. La différence est plus subtile et plus importante : le monde ne peut plus compter sur l'oubli ordinaire pour le remettre à sa place. C'est l'une des raisons pour lesquelles les Chasseurs isolés vivent souvent très mal leurs premières années. Ils conservent des souvenirs que leur entourage perd, et la persistance même de leur mémoire devient une preuve qu'ils ne peuvent montrer à personne."
          }
        ]
      },
      {
        "id": "aucune-capitale-du-monde-cache",
        "title": "Aucune capitale du monde caché",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "La diversité des Natures ne débouche pas sur un parlement universel. Il n'existe pas d'administration secrète où Vampires, Garous, Mages, Exilés, Extrals, Angelus et Daemons se réuniraient pour décider collectivement de ce que les Humains ont le droit de savoir. Une telle structure supposerait une histoire commune, une confiance et des intérêts partagés qui n'existent tout simplement pas. Il existe en revanche des lieux de négociation, des accords, des dettes, des neutralités et des réseaux personnels. Un bar peut être considéré comme neutre parce que la personne qui le tient a passé trente ans à rendre les représailles trop coûteuses. Un Silcenter peut accueillir une délégation sans reconnaître sa doctrine. Une Loge peut servir d'intermédiaire. Une corporation contrôlée par un initié peut devenir le terrain de discussion le plus sûr simplement parce qu'elle possède des salles privées et des contrats de sécurité efficaces. Cette diplomatie sans gouvernement central donne à la Vérité sa texture politique. Le statut dépend toujours du contexte. Un ancien Vampire peut être terrifiant dans sa Cour et n'avoir aucune autorité sur un Thalsios du GAAC. Un Archange peut inspirer un Angelus sans pouvoir donner un ordre à un Chasseur catholique. Un haut responsable du Conseil des Anciens peut ne représenter aucun Exilé qui refuse l'institution. Les alliances personnelles comptent donc énormément. Elles permettent de franchir les limites que les grandes structures ne peuvent officiellement traverser. Une campagne entière peut naître du fait qu'une personne possède trois numéros de téléphone que personne ne s'attendrait à trouver dans le même carnet."
          }
        ]
      },
      {
        "id": "la-limite-la-plus-importante-le-monde-doit-rester-jouable",
        "title": "La limite la plus importante : le monde doit rester jouable",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Pour ceux qui vivent dans la Vérité, la tentation est grande de considérer chaque coïncidence comme une manœuvre occulte. C'est une erreur. La majorité des accidents sont des accidents, la majorité des criminels sont Humains et les corporations n'ont pas besoin de magie pour être dangereuses. Le Voile cache un monde plus vaste ; il ne remplace pas la causalité ordinaire par une conspiration permanente. Cette limite est également ce qui rend les phénomènes de Vérité significatifs. Une attaque de Fléau est inquiétante parce qu'elle n'est pas le fonctionnement normal de la ville. Une Révélation publique est grave parce que la plupart des journées se passent sans qu'un monstre traverse un carrefour. Une fissure attire l'attention parce que l'Ombremonde ne s'ouvre pas au milieu de chaque parking. La Vérité enrichit donc la Réalité au lieu de l'annuler. Los Angeles reste Los Angeles : ses loyers, ses mafias, ses corporations, son LAUS, ses transports et ses quartiers existent indépendamment du surnaturel. Mais derrière une partie de ces mêmes portes vivent des gens dont le corps, l'histoire ou les fidélités ne peuvent être expliqués par le monde visible seul."
          }
        ]
      },
      {
        "id": "les-limites-de-la-connaissance-ce-que-meme-ce-livre-ne-rend-pas-banal",
        "title": "Les limites de la connaissance : ce que même ce livre ne rend pas banal",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Comprendre les règles générales du Voile ne signifie pas que chaque phénomène devienne prévisible. Les Fléaux, certaines divinités, les plus anciennes œuvres technomagiques et les entités de l'Ombremonde peuvent dépasser l'échelle des procédures ordinaires. Une règle qui décrit la manière habituelle dont l'Hologramme traduit un corps n'est pas une garantie contre une puissance explicitement capable de briser cette traduction. De même, connaître une Nature ne signifie pas connaître tous ses représentants. Un Vampire peut ignorer un secret de sa propre Cour. Un Aseryn peut n'avoir jamais rencontré de Paleo-Atlante. Un membre du GAAC peut connaître plusieurs espèces et ne rien savoir d'un peuple galactique qui n'a aucun contact officiel avec la Terre. La Vérité reste vaste parce qu'elle est composée d'histoires séparées, pas parce que l'information est artificiellement refusée. Les personnages peuvent apprendre, cartographier, transmettre et réduire l'inconnu. Mais chaque réponse ouvre naturellement sur des domaines que personne autour d'eux n'avait encore eu besoin d'étudier. C'est cette échelle qui distingue le monde caché d'un simple bestiaire. La question n'est jamais seulement « qu'est-ce que cette créature peut faire ? ». Elle devient « d'où vient-elle, qui la connaît, à quoi appartient-elle, qu'est-ce que sa présence change ici et qu'avons-nous tort de supposer parce que nous avons déjà rencontré quelque chose qui lui ressemblait ? » LA VÉRITÉ — Le monde visible reste réel, mais incomplet. Le Voile traduit, protège une cohérence et corrige une partie des traces ; il ne remplace ni les conséquences matérielles ni la nécessité de comprendre ce qui se cache derrière lui."
          }
        ]
      }
    ]
  },
  {
    "id": "verite-v7-voile-hologramme",
    "title": "Le Voile & l'Hologramme",
    "tags": [
      "Vérité",
      "Voile",
      "Hologramme",
      "Révélation",
      "Semi-Révélation",
      "preuves",
      "mémoire",
      "AIDH",
      "Azménoriens"
    ],
    "sections": [
      {
        "id": "le-voile-et-l-hologramme",
        "title": "Le Voile et l'Hologramme",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les initiés parlent indifféremment du Voile et de l'Hologramme, même si les deux mots ne portent pas exactement la même nuance. « Voile » décrit l'expérience : quelque chose recouvre la Vérité, adoucit ses contours et empêche le monde humain d'en percevoir toute la profondeur. « Hologramme » rappelle qu'il existe derrière cette expérience un mécanisme construit, planétaire, technomagique, capable d'agir sur la matière, la perception, les souvenirs et les traces laissées par les événements. L'Hologramme n'est pas une projection visuelle. Il ne pose pas une image humaine devant un corps monstrueux en espérant que personne ne passe la main au travers. Lorsqu'une créature est Voilée, la Réalité ordinaire interagit avec une version cohérente de son existence. Une main humaine serre une main humaine. Un siège supporte un poids compatible avec ce que le monde est en train de présenter. Un vêtement, une prothèse intégrée ou une cicatrice durable trouve une traduction qui conserve sa fonction et sa continuité. La créature n'est pas « invisible sous un costume » : elle est temporairement inscrite dans le monde selon une forme que le système sait faire accepter. Cette traduction n'abolit cependant jamais totalement ce qu'elle recouvre. Elle doit maintenir une continuité entre la Vérité et la Réalité. Une blessure n'est pas effacée par un changement de forme. Une prothèse perdue ne repousse pas parce qu'une anatomie différente apparaît. Un membre artificiel durablement intégré au corps se traduit avec lui ; une arme portée à la main reste une arme portée à la main. L'Hologramme protège la cohérence, pas le confort de l'individu. Il agit de la même manière sur les restes."
          },
          {
            "type": "p",
            "text": "Un cadavre peut demeurer Voilé tant qu'il reste dans une zone où le système s'impose. Un fragment biologique détaché reçoit une apparence plausible. Un objet fabriqué à partir d'une matière surnaturelle peut lui aussi être ramené vers une lecture acceptable si rien ne le maintient activement dans sa Vérité. Hors de la zone d'influence, la traduction cesse et ce qui reste reprend sa forme réelle. Revenir sous l'Hologramme permet ensuite à la cohérence de se réimposer. Cette propriété explique pourquoi tant d'enquêtes profanes produisent des dossiers sincères et pourtant faux. Les médecins décrivent ce que leurs instruments ont réellement pu constater dans la version du monde à laquelle ils avaient accès. Les laboratoires analysent des échantillons déjà traduits. Les photographies montrent ce que leurs capteurs ont été autorisés à percevoir. L'erreur n'est pas toujours introduite après coup : elle peut commencer au moment même où l'information est captée."
          }
        ]
      },
      {
        "id": "une-uvre-de-plusieurs-mondes",
        "title": "Une œuvre de plusieurs mondes",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Le Voile n'est pas un phénomène naturel apparu spontanément avec l'Humanité. Sa forme actuelle résulte d'une construction dont les racines mêlent des savoirs que la plupart des civilisations modernes seraient incapables de reproduire seules. La technomagie azménorienne a fourni une partie des principes permettant de faire coopérer lois physiques et transgressions magiques. L'AIDH a participé à la conception, à l'ingénierie et à la stabilisation de dispositifs capables d'agir à cette échelle. Des puissances beaucoup plus anciennes ont fourni ce qu'aucune infrastructure matérielle ne pouvait apporter : des ancrages capables de soutenir une cohérence planétaire. Même parmi les initiés, personne ne possède nécessairement l'ensemble de cette histoire. Un technomage azménorien peut connaître des fragments de théorie sans savoir quels acteurs politiques ont réellement participé au chantier. Un officier de l'AIDH peut manipuler des protocoles de Cohérence sans avoir accès aux archives les plus anciennes. Même certaines puissances ayant contribué à l'œuvre n'en connaissent qu'une fonction, un ancrage ou une période de son histoire. Le résultat n'est donc pas une machine que l'on pourrait trouver dans un bunker central et éteindre avec un interrupteur. L'Hologramme est une architecture distribuée, nourrie par plusieurs familles de moyens et maintenue à l'échelle du monde. Il possède une forme de conscience opératoire : il n'est pas une personne avec des opinions, mais il est capable de maintenir une intention de cohérence, de réagir à certaines agressions et de chercher à réparer ce qui menace de devenir une rupture durable. Pour la majorité des habitants de la Vérité, cette origine importe moins que l'expérience quotidienne."
          },
          {
            "type": "p",
            "text": "Le Voile est là. Il était là avant leur naissance. Il modifie leur corps depuis l'enfance, corrige les témoins après leurs erreurs et transforme une ville humaine en espace habitable pour des espèces qui n'ont parfois rien d'humain. On peut le haïr, le remercier, l'étudier ou tenter de le tromper ; il reste une infrastructure fondamentale de la Terre moderne."
          }
        ]
      },
      {
        "id": "ce-que-l-hologramme-cherche-a-preserver",
        "title": "Ce que l'Hologramme cherche à préserver",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Le système ne semble pas poursuivre un objectif moral. Il ne protège pas les innocents, ne punit pas le crime et ne distingue pas spontanément un monstre d'un héros. Ce qu'il défend est une cohérence : l'idée qu'à l'échelle de la civilisation humaine, le monde doit continuer à produire une histoire dans laquelle l'impossible n'est pas la première explication de chaque événement. Cette logique explique pourquoi il traduit plus volontiers qu'il ne détruit. Un être non humain n'est pas expulsé du monde parce qu'il existe : il reçoit une forme plausible. Un phénomène surnaturel n'est pas systématiquement annulé : il peut être interprété comme incendie, accident, délire, violence humaine ou catastrophe naturelle si les conséquences le permettent. Un témoin n'est pas forcément plongé dans l'amnésie : son souvenir peut glisser vers une version plus cohérente de ce qu'il a vécu. L'Hologramme travaille avec ce qui existe. Plus un événement produit des conséquences ordinaires, plus il est facile de les intégrer. Une porte arrachée reste une porte arrachée, même si la chose qui l'a détruite n'apparaît plus correctement sur les caméras. Un corps humain mort reste un corps humain mort pour les services qui le découvrent. Une explosion laisse une enquête, des dégâts et des responsabilités. Le Voile peut corriger l'explication ; il ne reconstruit pas gratuitement un immeuble ni ne ramène les morts à la vie. Il ne possède pas non plus une omniscience absolue. Des phénomènes peuvent lui résister, des zones peuvent devenir instables, certains dispositifs enregistrent des informations qu'il ne sait pas réécrire facilement et des consciences suffisamment préparées conservent ce qu'elles ont vu."
          },
          {
            "type": "p",
            "text": "Les habitants de la Vérité apprennent donc une règle simple : le Voile est immense, mais il n'est pas une excuse pour être imprudent."
          }
        ]
      },
      {
        "id": "voir-sans-faire-apparaitre",
        "title": "Voir sans faire apparaître",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "L'une des erreurs les plus fréquentes chez les nouveaux initiés consiste à croire que percevoir la Vérité d'une créature suffit à la rendre réelle pour tout le monde. Ce n'est pas le cas. Un observateur doté d'un sens adapté, d'un Talent particulier ou d'une Optique de Vérité peut voir ce que l'Hologramme traduit sans modifier l'état de la cible. La distinction est capitale. Un Vampire parfaitement Voilé peut être perçu sous sa forme véritable par un observateur spécialisé tout en continuant à occuper physiquement l'espace selon sa traduction humaine. L'observateur sait ce qui se cache là ; il ne peut pas pour autant saisir une aile, une corne ou un membre qui n'est pas actuellement matérialisé. Les passants continuent de voir un Humain. Les caméras ordinaires continuent d'enregistrer un Humain. La cible conserve les capacités correspondant à son état réel de Révélation. Cette asymétrie explique la valeur des dispositifs de Vérité. Une lunette, un capteur ou un sens surnaturel ne transforme pas la scène entière : il donne à son utilisateur un accès supplémentaire à l'information. Deux personnes regardant le même individu peuvent donc littéralement ne pas voir le même corps, et toutes deux interagir correctement avec le monde qu'elles perçoivent. Elle explique également pourquoi la chasse, l'espionnage et la diplomatie occultes reposent autant sur la qualité de l'observation. Reconnaître qu'un interlocuteur est un Exilé, un Vampire ou un être angélique peut changer entièrement la manière de négocier avec lui, alors même que personne d'autre dans la pièce n'a conscience qu'une seconde conversation vient de commencer."
          }
        ]
      },
      {
        "id": "voile-semi-revele-revele",
        "title": "Voilé, Semi-Révélé, Révélé",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les habitants de la Vérité décrivent généralement trois états. Voilé, l'individu reste inscrit dans la cohérence humaine de l'Hologramme. Semi-Révélé, une partie de sa nature véritable se matérialise ou devient accessible sans que la traduction soit totalement abandonnée. Révélé, il assume suffisamment sa Vérité pour que le monde ordinaire soit confronté à ce qu'il est réellement. Ces états ne sont pas des costumes. Ils sont des rapports différents entre un être et la couche de cohérence qui l'entoure. La Semi-Révélation est particulièrement étrange parce qu'elle fait coexister deux lectures qui ne devraient pas naturellement partager le même corps. Des yeux changent, une densité augmente, des traits deviennent impossibles, une aura ou une structure surnaturelle s'exprime. Pour ceux qui savent regarder, l'être n'est plus entièrement humain ; pour le profane, l'Hologramme continue pourtant à maintenir autant de normalité qu'il le peut. La Révélation complète est plus brutale. Lorsqu'un corps véritable, une paire d'ailes transcendées, une morphologie extrale ou un prédateur Khinae s'impose pleinement, les témoins présents voient l'impossible. Le Voile ne leur évite pas nécessairement la scène. Il intervient surtout sur ce qu'il adviendra ensuite : ce qu'ils retiendront, ce que leurs appareils conserveront et la manière dont l'événement sera intégré à la mémoire collective. La transition est personnelle. On ne Révèle pas quelqu'un en le touchant, en le frappant ou en le portant. Une créature Voilée ne devient pas soudain visible parce qu'elle traverse les bras d'un être Révélé. Certains pouvoirs peuvent bloquer ou perturber une transition, mais il n'existe pas de geste universel permettant de forcer n'importe qui à abandonner le Voile."
          }
        ]
      },
      {
        "id": "se-reveler-n-est-pas-s-eveiller",
        "title": "Se révéler n'est pas s'éveiller",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Deux expériences sont souvent confondues : découvrir ce que l'on est et manifester ce que l'on est. Un descendant de Khinae peut porter son héritage pendant des années sans savoir le nom de sa lignée. Un Angelus incarné peut vivre une enfance authentiquement humaine avant que son origine ne s'ouvre à lui. Un Vampire transformé sait généralement qu'un changement s'est produit, mais peut ignorer tout de sa Cour, de ses Sangs ou de l'histoire réelle de son espèce. Un Exilé né dans une famille intégrée peut connaître parfaitement son peuple tout en ayant rarement besoin de quitter le Voile. L'Éveil est une prise de conscience, une activation ou une maturation propre à la Nature. Il peut être brutal, progressif, familial, accidentel ou provoqué par une initiation. La Révélation est l'expression de cette Nature dans le monde. Les deux peuvent se croiser sans se confondre. Quelqu'un peut posséder une capacité latente avant de savoir la nommer ; inversement, connaître toute la théorie d'un pouvoir ne donne pas automatiquement le moyen de l'employer. Cette différence explique pourquoi les communautés de Vérité accordent tant d'importance à l'accompagnement. La première manifestation n'est pas toujours dangereuse parce qu'elle est puissante. Elle l'est parce que l'individu ignore ce qui est en train de lui arriver, ce que le Voile va faire, ce que les témoins verront et quelles institutions pourraient déjà chercher à le retrouver. Dans certaines familles, l'Éveil est attendu depuis l'enfance. Dans d'autres, il survient après plusieurs générations sans manifestation connue. Des parents parfaitement humains en apparence peuvent voir s'éveiller chez leur enfant un héritage Khinae dont ils ignoraient eux-mêmes l'existence."
          },
          {
            "type": "p",
            "text": "À l'inverse, une personne élevée parmi les initiés peut ne jamais développer la Nature espérée et rester simplement humaine au milieu d'un monde qu'elle connaît trop bien pour redevenir profane."
          }
        ]
      },
      {
        "id": "comment-les-profanes-vivent-l-impossible",
        "title": "Comment les profanes vivent l'impossible",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Le profane n'est pas stupide. Le Voile ne transforme pas chaque témoin en caricature incapable de relier deux faits. Lorsqu'une créature Révélée traverse une pièce, les personnes présentes peuvent la voir, la fuir, la filmer, la combattre ou en mourir. La différence apparaît ensuite, lorsque le cerveau, les récits collectifs et les traces ordinaires cherchent à ramener l'événement vers une explication supportable. Chez certains, le souvenir s'émousse. Une gueule animale devient un masque. Une silhouette ailée devient un drone, un effet de lumière ou la confusion d'un instant. Un hurlement impossible se transforme en sirène. Chez d'autres, le souvenir reste étonnamment précis mais perd sa conclusion : la personne se rappelle les faits sans accepter l'idée qu'ils prouvent l'existence d'une autre couche du monde. Elle parle d'une drogue, d'une hallucination, d'un prototype militaire ou d'une mise en scène. Le processus n'est ni instantané ni identique pour tous. La volonté, la préparation, la répétition, le traumatisme et l'environnement modifient ce qui subsiste. Certains témoins se souviennent toute leur vie d'un détail qu'ils ne parviennent pas à expliquer. D'autres font le même cauchemar pendant vingt ans. Quelques-uns commencent à chercher. C'est souvent ainsi que naît un futur Chasseur : non pas parce que le Voile n'a rien fait, mais parce qu'il n'a pas réussi à refermer complètement la fissure laissée dans une personne. Le monde moderne multiplie ces fissures. Une catastrophe de Vérité peut être filmée par cent appareils, commentée en direct, recopiée sur des serveurs et analysée par des milliers de personnes avant que les corrections aient eu le temps de produire une version stable."
          },
          {
            "type": "p",
            "text": "Le Voile reste capable d'une puissance immense ; l'Holonet lui impose simplement de travailler sur une société où l'information se duplique plus vite que dans toutes les époques précédentes."
          }
        ]
      },
      {
        "id": "memoire-preuves-et-mensonges-sinceres",
        "title": "Mémoire, preuves et mensonges sincères",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Une preuve ordinaire n'est pas nécessairement fausse parce qu'elle a été corrigée. Elle peut être la trace parfaitement authentique de ce que l'Hologramme a laissé le système mesurer. Une caméra n'a pas « menti » lorsqu'elle montre un Humain à l'endroit où se trouvait un Thulkar Voilé. Elle a enregistré le monde auquel elle avait accès. Après une Révélation, la situation devient plus complexe. Les enregistrements peuvent avoir capté l'impossible puis évoluer vers une version cohérente. Des métadonnées disparaissent, une image devient ambiguë, un son se dégrade, un dossier médical cesse de contenir la mesure qui avait alerté le technicien. Toutes les corrections ne sont pas spectaculaires. Beaucoup ressemblent simplement aux erreurs que les systèmes humains produisent déjà en permanence. Cette propriété rend les témoignages de Vérité difficiles à transmettre. Une personne peut posséder une vidéo extraordinaire et la voir perdre progressivement ce qui la rendait extraordinaire. Elle peut envoyer le fichier à quelqu'un qui ne voit déjà plus la même chose. Elle peut se retrouver avec plusieurs copies contradictoires d'un événement dont elle se souvient parfaitement. Dans un monde où la confiance numérique est déjà fragile, la Vérité se cache souvent derrière des anomalies que les profanes attribuent à la fraude, au montage ou à la panne. Les supports invariants existent précisément pour résister à cette réécriture. Ils ne voient pas magiquement tout. Un capteur invariant qui n'était pas capable de percevoir la Vérité au moment de la scène conservera fidèlement une donnée incomplète."
          },
          {
            "type": "p",
            "text": "En revanche, lorsqu'un dispositif combine perception adaptée et stockage invariant, il devient extrêmement précieux : il peut rapporter hors de la scène une information que le Voile aurait normalement tenté de réintégrer. C'est l'une des raisons pour lesquelles l'AIDH, certains technomages azménoriens, des Chasseurs spécialisés et quelques institutions secrètes possèdent une avance considérable sur le profane. Ils ne sont pas seulement mieux informés ; ils disposent de moyens pour empêcher leur information de se dissoudre."
          }
        ]
      },
      {
        "id": "les-limites-du-voile",
        "title": "Les limites du Voile",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Parce qu'il agit à l'échelle planétaire, l'Hologramme donne parfois l'impression d'être omnipotent. Il ne l'est pas. Il ne peut pas transformer toutes les conséquences d'un événement en quelque chose d'innocent. Il ne peut pas faire disparaître des tonnes de gravats, ressusciter les morts, rembourser un compte bancaire, rétablir un réseau électrique ou remplacer une infrastructure détruite. Plus la Vérité laisse de conséquences ordinaires, plus les sociétés humaines doivent malgré tout les gérer. Il ne crée pas non plus les ressources nécessaires à ses propres traductions. Une créature blessée ne reçoit pas un corps neuf. Une arme consommée n'est pas recréée. Un projectile qui porte brièvement une propriété de Vérité cesse de bénéficier de la volonté qui le soutenait lorsque l'effet est résolu, sauf règle spécifique. Une technologie de Vérité abandonnée sans protection peut finir par être ramenée vers une lecture plus plausible, mais ce processus ne garantit ni son bon fonctionnement ni sa récupération par son propriétaire. Le Voile est enfin vulnérable à la contradiction volontaire. Des rites, technologies et capacités savent maintenir une manifestation, empêcher une transition ou observer directement la couche cachée. Les HDS et Holojamers exploitent la cohérence elle-même pour contraindre certaines Révélations. Les technomages savent créer des fenêtres locales. L'AIDH possède des protocoles de terrain. Les Mages, Angelus, Chasseurs et plusieurs espèces disposent de leurs propres moyens de perception. Aucun de ces outils n'abolit l'Hologramme. Ils négocient avec lui, le trompent, le contraignent ou ouvrent une fenêtre. C'est une différence essentielle entre une faiblesse locale et l'effondrement du système."
          }
        ]
      },
      {
        "id": "une-relation-pas-seulement-un-masque",
        "title": "Une relation, pas seulement un masque",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les communautés de Vérité parlent parfois de leur « relation au Voile ». L'expression ne décrit pas un sentiment humain de la part de l'Hologramme, mais la manière dont le système traite un individu dont les actions s'accordent ou se heurtent régulièrement à sa fonction. Quelqu'un qui vit depuis des décennies sans produire de contradictions publiques peut traverser le monde avec une remarquable stabilité. À l'inverse, un être qui force constamment des Révélations spectaculaires, multiplie les témoins, crée des ruptures visibles et résiste aux corrections attire une pression croissante. Cette pression peut prendre des formes très différentes : instabilité de la traduction, réactions de cohérence, difficultés à maintenir certains états ou, dans les cas extrêmes, rupture avec la couche protégée du monde. Il serait trompeur d'imaginer le Voile comme une police cosmique distribuant des sanctions morales. Un Vampire prudent qui assassine dans le secret peut être beaucoup moins perturbant pour l'Hologramme qu'un Angelus bienveillant qui déploie publiquement six ailes de lumière au-dessus d'une autoroute. Le système ne juge pas le bien et le mal ; il mesure, à sa manière, la compatibilité avec la continuité qu'il cherche à préserver. Cette neutralité alimente des philosophies opposées. Certains Exilés considèrent le Voile comme un pacte de survie nécessaire. D'autres le voient comme une prison qui les oblige à habiter un corps emprunté. Des Vampires l'utilisent comme la meilleure protection jamais offerte à un prédateur. Des Chasseurs le maudissent lorsqu'il efface un témoin et le remercient lorsqu'il empêche une panique générale."
          },
          {
            "type": "p",
            "text": "Les Azménoriens les plus anciens savent surtout qu'aucune infrastructure de cette taille n'est gratuite, même lorsque son prix n'apparaît pas dans une monnaie humaine."
          }
        ]
      },
      {
        "id": "les-endroits-ou-le-monde-tient-moins-bien",
        "title": "Les endroits où le monde tient moins bien",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "L'Hologramme ne possède pas partout la même stabilité. Les fissures les plus graves apparaissent souvent là où le monde est peu observé, où des forces de Vérité s'accumulent ou où une contradiction majeure a déjà fragilisé la cohérence. Il n'existe pas de carte simple permettant de prévoir chaque rupture. Certaines zones restent parfaitement stables pendant des siècles ; d'autres s'ouvrent après une série d'événements qui n'auraient eu séparément aucune importance. Ces fissures peuvent donner accès à l'Ombremonde, le reste du monde qui n'est pas contenu de la même manière dans la dimension protégée par l'Hologramme. Là, la magie est plus abondante, les présences humaines beaucoup plus rares et les horreurs moins contraintes par la nécessité de paraître normales. Atlantis y prospère, rappel brutal qu'une partie de l'histoire terrestre ne s'est pas simplement effondrée : elle a continué ailleurs. Le passage n'est pas forcément stable. Une ouverture peut chercher à se refermer comme une blessure. Un être éjecté hors de la cohérence peut survivre et trouver un moyen de revenir. Des expéditions s'y perdent parce qu'elles ont confondu une déchirure locale avec une route. La prudence des anciennes communautés de Vérité vient en partie de cette expérience : derrière le monde caché que l'on connaît existe encore un monde plus vaste que l'Hologramme ne contient pas entièrement. Les zones peu peuplées attirent naturellement les activités qui supporteraient mal une correction permanente. Temples, refuges, laboratoires, points de passage et sites de confinement s'installent volontiers loin des regards. Cela ne signifie pas que les villes soient sûres."
          },
          {
            "type": "p",
            "text": "Elles offrent simplement une autre forme de stabilité : des millions de vies ordinaires renforcent la cohérence sociale au moment même où elles fournissent aux créatures de Vérité des foules dans lesquelles disparaître."
          }
        ]
      },
      {
        "id": "voir-n-est-pas-reveler",
        "title": "Voir n'est pas Révéler",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "L'erreur la plus fréquente des nouveaux initiés consiste à confondre trois situations : une créature se Révèle ; un observateur voit au travers du Voile ; le Voile échoue localement. Elles peuvent produire des images similaires, mais leurs conséquences sont profondément différentes. Lorsqu'un être Voilé est perçu par quelqu'un qui possède une capacité permettant de voir au travers de la traduction, cet être n'a pas changé d'état. Il reste Voilé. Ses capacités qui exigent une Semi-Révélation ou une Révélation ne deviennent pas disponibles, son corps continue d'interagir avec la Réalité selon les règles de son état, et les autres témoins ne voient rien de plus. Seul le regard capable de franchir la traduction reçoit davantage d'information. Cette asymétrie produit des scènes très particulières. Un Mage peut discuter avec quelqu'un dont il reconnaît la Nature alors que tous les autres clients du restaurant ne voient qu'une personne ordinaire. Un Chasseur disposant du bon outil peut identifier qu'une silhouette n'est pas humaine sans être capable de forcer quoi que ce soit à apparaître. À l'inverse, être soi-même Révélé n'accorde pas une vision universelle des autres êtres Voilés. La Vérité ne devient jamais une vision thermique permettant de scanner une foule. Cette règle protège aussi la diversité des perceptions. Certains êtres sentent la Magie, d'autres lisent des traces, d'autres distinguent une translation corporelle, d'autres encore ne voient que ce que leur tradition leur a appris à reconnaître. Deux initiés peuvent regarder la même personne et savoir chacun quelque chose que l'autre ignore."
          }
        ]
      },
      {
        "id": "la-semi-revelation-espace-du-compromis",
        "title": "La Semi-Révélation, espace du compromis",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "La Semi-Révélation existe précisément parce que la relation entre Voile et Nature n'est pas toujours binaire. Dans cet état, une partie de la Vérité parvient à s'exprimer sans que toute la cohérence humaine disparaisse. Un regard peut devenir impossible à soutenir, une force anormale apparaître, une physiologie se modifier juste assez pour employer une capacité, ou une présence occulte devenir perceptible aux autres initiés. Cet état est instable par nature. Il correspond à une coexistence temporaire entre deux descriptions incompatibles du même être. Par défaut, il ne constitue pas une seconde apparence permanente dans laquelle on pourrait vivre indéfiniment. Il est utile parce qu'il permet d'agir sans franchir immédiatement le seuil de la Révélation complète ; il est dangereux parce qu'il place l'être exactement à l'endroit où les contradictions deviennent les plus visibles à ceux qui savent les chercher. Les cultures de Vérité n'accordent pas toutes la même valeur à cet état. Certaines l'enseignent comme discipline de contrôle, d'autres le considèrent comme une concession ou un signe d'hésitation, d'autres encore n'y voient qu'une étape pratique entre deux formes. Les différences de doctrine ne changent pas sa nature fondamentale : la Semi-Révélation n'est ni une illusion décorative ni une Révélation affaiblie, mais un état réel et limité."
          }
        ]
      },
      {
        "id": "quand-le-monde-refuse-une-preuve",
        "title": "Quand le monde refuse une preuve",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Le Voile n'a pas besoin d'effacer chaque témoin pour rester efficace. Il lui suffit souvent de rendre les preuves incompatibles entre elles. Une personne se souvient d'un monstre ; une caméra montre une silhouette humaine. Une trace biologique paraît aberrante au premier test puis cohérente après une nouvelle analyse. Un rapport de police contient une phrase que son auteur ne se rappelle pas avoir écrite. Une vidéo circule quelques heures avant que les copies restantes ne paraissent être un montage convaincant. Dans une société moins connectée, ces corrections produisaient surtout des légendes. En 2035, elles produisent des controverses numériques. L'Holonet peut donner à un incident surnaturel des millions de témoins indirects avant que la cohérence ne se réinstalle. Les commentaires, extraits, copies, réactions et analyses deviennent eux-mêmes des objets sociaux. Même lorsqu'une image est corrigée, la discussion qu'elle a provoquée ne disparaît pas nécessairement au même rythme. Le résultat n'est pas une révélation publique progressive de la Vérité. C'est un bruit permanent. Les réseaux humains sont déjà saturés de faux, d'images générées, de propagande, de simulations et de canulars. Une preuve impossible peut donc survivre sous les yeux de tous précisément parce qu'elle ressemble à mille choses fausses. L'Hologramme n'a pas besoin de rendre l'Humanité stupide ; le fonctionnement normal de l'information moderne lui fournit une grande partie du camouflage dont il a besoin. Les communautés de Vérité ont adapté leurs méthodes. Elles n'écrivent pas toutes leurs archives dans des grimoires enterrés."
          },
          {
            "type": "p",
            "text": "Certaines utilisent des serveurs isolés, des supports technomagiques, des enregistrements invariants ou des chaînes de témoins où la confiance compte davantage que l'image brute. L'AIDH maîtrise des solutions institutionnelles capables de conserver des données que la correction ordinaire altérerait. Mais aucune technologie ne peut enregistrer ce que son capteur n'a jamais perçu : l'invariance protège une observation ; elle ne transforme pas un appareil aveugle en perception de Vérité."
          }
        ]
      },
      {
        "id": "ce-que-l-hologramme-ne-protege-pas",
        "title": "Ce que l'Hologramme ne protège pas",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Le Voile protège une cohérence, pas les personnes qui vivent dessous. Il ne détourne pas une balle, ne guérit pas une victime, ne transforme pas une mauvaise décision en accident sans conséquence. Une créature peut rester parfaitement Voilée tout en commettant un meurtre qui déclenchera une enquête humaine ordinaire. L'Hologramme peut corriger ce que les témoins pensent avoir vu de son corps ; il n'efface pas automatiquement le cadavre, les dettes, les rivalités ou les motivations. Cette limite est fondamentale pour comprendre pourquoi les communautés de Vérité ont besoin de véritables institutions. Un Vampire ne peut pas compter sur le Voile pour supprimer toutes les conséquences de ses crimes. Un Exilé ne reçoit pas automatiquement une identité légale. Un Extral doit toujours négocier l'accès à des soins compatibles. Un Mage qui détruit un immeuble devra faire face au fait qu'un immeuble a été détruit, même si personne ne comprend correctement comment. L'Hologramme cherche souvent la traduction la plus plausible. Un effet surnaturel peut être requalifié par les témoins en explosion, panne, attaque, animal, accident ou phénomène météorologique lorsque le contexte le permet. Plus l'événement est massif, répété, public et difficile à traduire, plus cette cohérence coûte à maintenir et plus le Voile peut réagir durement à ceux qui la menacent. Ce rapport explique une partie de la prudence des vieilles communautés. Elles ne se cachent pas seulement par peur des Humains. Elles savent qu'un comportement suffisamment irresponsable peut attirer l'attention de l'Hologramme lui-même, fragiliser un lieu ou rendre plus difficile la vie de tous ceux qui dépendent de sa traduction."
          }
        ]
      },
      {
        "id": "la-relation-au-voile",
        "title": "La Relation au Voile",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les initiés parlent parfois d'une personne « bien tenue » par le Voile ou, au contraire, d'une présence que l'Hologramme semble refuser. Cette Relation n'est pas une réputation sociale ni une moralité cosmique. Elle décrit la facilité avec laquelle un individu s'inscrit dans la cohérence locale de l'œuvre. Une relation favorable ne signifie pas que le Voile aime quelqu'un. Elle peut simplement indiquer que ses habitudes, ses méthodes et sa manière d'employer sa Nature ne forcent pas continuellement la traduction à réparer des contradictions. À l'inverse, une relation répressive peut apparaître chez un être qui Révèle trop souvent, provoque des phénomènes impossibles ou travaille volontairement contre les mécanismes de cohérence. Les conséquences sont d'abord narratives. Des signes deviennent plus difficiles à dissimuler, des corrections prennent une forme moins confortable, des incidents attirent plus facilement d'autres acteurs de Vérité. Aux extrêmes, Rupture et Éjection cessent d'être de simples complications : l'être peut être rejeté vers l'Ombremonde au lieu de continuer à bénéficier normalement de la traduction terrestre. Cette possibilité donne à l'Hologramme un caractère politique sans le transformer en police consciente distribuant des sanctions selon un code écrit. Les cultures ont développé des superstitions, des théories et des méthodes pour interpréter ses réactions. Aucune ne possède un règlement complet du Voile, parce qu'aucune n'est son auteur unique."
          }
        ]
      },
      {
        "id": "reveler-sa-nature-est-un-acte-personnel",
        "title": "Révéler sa Nature est un acte personnel",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Le Voile ne fonctionne pas comme une membrane que l'on arracherait à quelqu'un. Le contact physique, l'agression, l'examen médical ou le fait d'être reconnu par un autre initié ne forcent pas automatiquement une créature à se Révéler. La transition appartient à la relation entre l'individu, sa Nature et l'Hologramme. Cette règle a une conséquence culturelle profonde : la Révélation est souvent vécue comme un acte de vulnérabilité ou d'autorité. Montrer sa forme réelle à quelqu'un peut signifier confiance, défi, urgence ou rupture avec les règles habituelles d'une communauté. Pour un être ayant grandi sous le Voile, il peut s'agir de la première fois qu'un proche profane voit réellement ce qu'il est. Dans d'autres cultures, la Révélation possède beaucoup moins de solennité. Un Garou entraîné peut considérer le passage à une autre forme comme l'équivalent de sortir une arme lorsque le combat l'exige. Un Extral récemment arrivé peut trouver absurde que la silhouette humaine traduite ait davantage de poids social que son vrai corps. Un ancien Vampire peut au contraire associer la Révélation publique à des siècles de persécution et y voir une faute presque politique. Ces attitudes ne changent pas la mécanique du Voile. Elles changent ce que signifie le geste."
          }
        ]
      },
      {
        "id": "etre-vu-revele",
        "title": "Être vu Révélé",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "Pendant une Révélation complète, les témoins présents voient la Nature réelle. Le Voile n'empêche pas l'expérience immédiate. Une aile est une aile, une gueule animale est une gueule animale, une anatomie extrale est réellement là. Les réactions dépendent alors de ce qui apparaît et de ce que le témoin peut en comprendre. La panique n'est pas automatique. La société de 2035 a habitué les gens aux prothèses lourdes, aux modifications corporelles, aux projections, aux robots et à des environnements visuellement impossibles. Une manifestation brève peut d'abord être interprétée comme technologie, costume ou agression augmentique. Plus le comportement contredit ces explications, plus le témoin comprend qu'il regarde quelque chose qui ne devrait pas exister. Après l'événement, l'Hologramme reprend son travail de cohérence. Les souvenirs ordinaires peuvent se déplacer, se simplifier ou recevoir une explication plausible. La force de la correction dépend du contexte, de la protection du témoin, de sa relation à la Vérité et de la manière dont les preuves ont été conservées. Ce processus n'est pas un bouton qui transforme instantanément cent personnes en amnésiques identiques. C'est ce décalage entre vision immédiate et souvenir stabilisé qui nourrit une grande partie du folklore moderne. Des dizaines de personnes peuvent être certaines d'avoir vu quelque chose pendant quelques heures, puis ne plus être d'accord le lendemain sur ce qu'était cette chose."
          }
        ]
      },
      {
        "id": "la-grande-uvre-et-ses-auteurs-incomplets",
        "title": "La grande œuvre et ses auteurs incomplets",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "L'Hologramme est trop vaste pour être compris comme l'invention isolée d'une seule civilisation. Sa forme actuelle est le résultat d'une construction technomagique planétaire où plusieurs puissances ont apporté des connaissances, des moyens ou une part de stabilité. L'AIDH en fait partie. Son rôle n'est pas celui d'un observateur extérieur arrivé après coup pour étudier un mystère terrestre. Les humains galactiques ont participé à la création de l'œuvre et disposent encore de moyens institutionnels capables d'interagir avec certains de ses invariants. Cette implication explique en partie la prudence extrême avec laquelle ils traitent les phénomènes susceptibles d'endommager sa cohérence. Les héritages azménoriens furent également essentiels. Leur maîtrise de la Technomagie permettait de penser une construction qui ne soit ni seulement un dispositif scientifique ni seulement un rituel. Dans leur propre histoire, cette capacité est associée à des réussites immenses et à des catastrophes tout aussi vastes. Participer à une œuvre de l'échelle de l'Hologramme n'est donc pas, pour eux, une preuve que la Technomagie serait sûre : c'est presque l'inverse. D'autres contributions, beaucoup plus difficiles à documenter, ont également participé à l'œuvre. Les archives accessibles parlent d'ancrages, d'accords anciens, d'interventions divines ou de fonctions dont l'origine exacte n'est plus connue. Ces fragments suffisent à montrer que l'Hologramme n'a jamais dépendu d'une seule institution, sans révéler pour autant son architecture profonde. Pour la majorité des initiés, ces informations restent fragmentaires. Ils savent que le Voile existe bien avant de savoir qui l'a construit."
          },
          {
            "type": "p",
            "text": "Les communautés utilisent donc souvent des explications partielles, parfois contradictoires. Une tradition décrit un pacte, une autre une machine, une autre encore un acte divin. Chacune peut avoir touché une partie de la vérité sans posséder l'ensemble."
          }
        ]
      },
      {
        "id": "le-monde-visible-fabrique-lui-meme-du-camouflage",
        "title": "Le monde visible fabrique lui-même du camouflage",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "L'Hologramme n'agit pas seul. La société moderne produit quotidiennement des phénomènes qui rendent la Vérité plus facile à dissimuler. Les augmentations permettent d'expliquer une force anormale. Les hologrammes et effets visuels banalisent des images improbables. Les drones expliquent des mouvements aériens. Les neurotechnologies fournissent une réponse plausible à des troubles de perception. Les laboratoires génétiques rendent moins inconcevable l'idée d'un organisme modifié. Cette évolution aurait pu fragiliser le Voile en donnant à l'Humanité de meilleurs instruments. Elle lui fournit aussi une quantité prodigieuse de fausses explications. Un témoin de 1900 voyant un bras métallique fonctionnel n'avait presque aucune catégorie ordinaire pour le décrire. En 2035, un témoin voyant un membre anormal suppose spontanément une augmentation avant d'imaginer une anatomie non humaine. Les communautés de Vérité exploitent consciemment cette ambiguïté. Certaines choisissent des vêtements, des prothèses visibles ou des métiers qui fournissent une explication sociale à leurs particularités. Un Extral traduit peut prétendre avoir subi une modification lourde. Un être aux yeux anormaux porte des lentilles ostensibles. Une manifestation partielle est présentée comme interface augmentée. Le futur technologique n'a donc pas remplacé le secret par la transparence. Il a donné au secret de nouveaux costumes."
          }
        ]
      },
      {
        "id": "le-prix-de-la-surveillance-totale",
        "title": "Le prix de la surveillance totale",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "La multiplication des capteurs reste néanmoins un problème. Une ville de 2035 produit constamment des images, des données de déplacement, des biométries et des historiques. Le Voile peut maintenir une cohérence, mais chaque incident important lui demande de résoudre beaucoup plus de contradictions qu'une scène équivalente un siècle plus tôt. Les acteurs de Vérité le savent. Ils surveillent les caméras, neutralisent certains réseaux, privilégient des lieux dont ils comprennent l'infrastructure et utilisent des systèmes invariants lorsqu'ils ont besoin de conserver ce qui s'est réellement passé. Les techniques de dissimulation profanes restent donc précieuses même dans un monde protégé par l'Hologramme. Cette réalité est particulièrement importante pour les Chasseurs et les organisations d'investigation. Une preuve ordinaire peut disparaître ou changer, mais les métadonnées autour de sa disparition peuvent elles-mêmes devenir informatives. Une caméra qui redémarre exactement pendant une anomalie, trois systèmes qui enregistrent des versions incompatibles ou un ensemble de témoins dont les souvenirs divergent selon un motif précis constituent des traces de la correction, même lorsque l'image initiale n'est plus exploitable. L'étude de la Vérité en 2035 ressemble ainsi parfois moins à regarder le monstre qu'à étudier la forme du trou qu'il a laissé dans les données."
          }
        ]
      }
    ]
  },
  {
    "id": "verite-v7-habiter-la-verite",
    "title": "Habiter la Vérité",
    "tags": [
      "Vérité",
      "vie quotidienne",
      "identités",
      "lieux",
      "réseaux",
      "institutions",
      "droit"
    ],
    "sections": [
      {
        "id": "habiter-la-verite",
        "title": "Habiter la Vérité",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Connaître la Vérité ne signifie pas vivre en permanence au milieu de monstres Révélés. La majorité des initiés travaille, se loge, voyage et communique dans la même société que tout le monde. La différence tient à une seconde géographie composée de lieux que le profane peut traverser sans comprendre ce qu'ils représentent. Un Silcenter peut être un quartier parfaitement identifiable dont seule une partie des fonctions est cachée. Un bar de Chasseurs peut avoir une clientèle ordinaire au rez-de-chaussée et servir de relais à l'étage. Une Maison vampirique peut posséder légalement une clinique, un club ou une société financière. Une Loge de Mages peut occuper un bâtiment banal dont l'architecture intérieure est conçue pour protéger des travaux occultes. Une communauté extrale peut dépendre d'un centre du GAAC, d'une clinique xénobiologique et de fournisseurs humains qui ignorent la destination exacte de leurs produits. La Vérité forme donc des réseaux, pas une société unique. Il n'existe pas de parlement mondial du surnaturel, pas de loi secrète reconnue par toutes les Natures et pas de « Mascarade » universelle imposant le même code à chacun. Le secret est maintenu par la puissance de l'Hologramme, par les intérêts convergents de groupes qui n'ont aucune envie de devenir publics et par des accords locaux dont les motivations peuvent être totalement différentes. Les relations entre communautés suivent la même logique. Un Exilé peut considérer un Vampire comme un voisin dangereux mais parfaitement civilisé. Un Chasseur peut travailler avec un Mage et refuser toute coopération avec l'AIDH. Un Angelus peut être accueilli dans une institution religieuse ou regardé comme une menace doctrinale."
          },
          {
            "type": "p",
            "text": "Les catégories du livre décrivent des origines et des traditions ; elles ne distribuent pas automatiquement alliés et ennemis."
          }
        ]
      },
      {
        "id": "secret-politique-et-pouvoir",
        "title": "Secret, politique et pouvoir",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Le secret de la Vérité n'est pas absolu. Des gouvernements, des corporations, des services de renseignement, des institutions religieuses et des réseaux criminels en connaissent des fragments. Le niveau de connaissance varie énormément. Une cellule peut savoir que des « anomalies biologiques » existent sans connaître le mot Khinae. Un laboratoire peut travailler sur une technologie extrale sans savoir comment elle est arrivée sur Terre. Une direction religieuse peut posséder des dossiers sur les Angelus tout en interdisant à la majorité de son clergé d'y accéder. Cette fragmentation est volontaire autant qu'accidentelle. La connaissance est dangereuse parce qu'elle donne accès à des acteurs qui n'ont aucune raison d'accepter d'être étudiés. Elle attire aussi les rivalités internes. Une agence qui révèle à une autre qu'elle peut voir sous le Voile lui révèle simultanément l'existence de ses capteurs, de ses sources et de ses méthodes de protection des preuves. Le secret devient donc une monnaie politique. Les dossiers s'échangent, les accès se négocient et certaines alliances reposent sur le fait de ne pas poser une question dont tout le monde connaît pourtant la réponse. L'Hologramme aide à maintenir le silence du grand public ; il ne simplifie en rien les rapports entre ceux qui ont appris à vivre derrière ce silence. La Grande Californie de 2035 est particulièrement riche en ces chevauchements. Ses institutions publiques se reconstruisent, ses mégacorporations disposent de moyens immenses, les mafias exploitent toutes les frontières de juridiction, les Exilés sont présents depuis des générations et les Extrals plus récents cherchent encore leur place."
          },
          {
            "type": "p",
            "text": "Dans la même ville peuvent ainsi opérer une clinique noire capable de soigner une physiologie non humaine, un laboratoire AIDH, une Loge, un réseau de Chasseurs et une Maison vampirique qui n'ont aucune vision commune de ce que « protéger le secret » signifie."
          }
        ]
      },
      {
        "id": "apprendre-trop-peu-apprendre-trop-vite",
        "title": "Apprendre trop peu, apprendre trop vite",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "La première erreur de l'initié est souvent de croire qu'une révélation explique toutes les autres. Quelqu'un découvre les Vampires et commence à interpréter chaque phénomène comme une histoire de sang. Un Chasseur spécialisé dans les esprits applique ses rites à une technologie extrale. Un agent du GAAC rencontre un Mage et cherche un protocole biologique à un problème qui n'obéit pas aux mêmes lois. La Vérité résiste à ce besoin de simplicité. Elle rassemble des phénomènes issus d'histoires différentes. Les Khinae, les Aseryns, les Exilés, les Extrals, les Angelus, les Daemons et les Mages ne partagent pas une origine unique sous prétexte qu'ils sont tous cachés. Même deux traditions utilisant le même mot, comme « âme », « Néant », « sang » ou « magie », peuvent désigner des mécanismes dont les ressemblances ne sont que partielles. Les anciens sont souvent dangereux moins par puissance que par contexte. Ils savent quelles règles ne sont pas universelles. Ils savent qu'un rite efficace contre une chose peut nourrir une autre. Ils savent que certains noms historiques sont des propagandes devenues vraies dans la mémoire collective. Ils ont appris à demander d'où vient une information avant de décider ce qu'elle vaut. C'est aussi pourquoi les grandes institutions accumulent des archives incompatibles. Les dossiers de l'AIDH, les traditions de Loge, les archives vampiriques, la Confrérie du Bestiaire et les mémoires exilées décrivent parfois le même événement avec des vocabulaires différents. Reconstruire la Vérité exige souvent de comprendre que plusieurs témoins ont raison à des échelles différentes."
          }
        ]
      },
      {
        "id": "une-journee-derriere-le-monde-visible",
        "title": "Une journée derrière le monde visible",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "À huit heures, une employée d'une corporation prend le métro avec plusieurs centaines de personnes. Elle est Elyë, née sur Terre, et n'a jamais vu Aèr. Son apparence humaine n'est pas un déguisement qu'elle enfile le matin : c'est la forme dans laquelle l'Hologramme l'inscrit depuis l'enfance. Personne dans la rame ne remarque que son organisme pourrait vivre bien plus longtemps que le leur. À neuf heures, un technicien du LAUS examine une vidéo d'agression. Il voit un homme projeter un autre homme contre une voiture. Dans une salle différente, une analyste utilisant un support invariant et une optique adaptée voit un corps thulkar partiellement Révélé au moment de l'impact. Les deux dossiers concernent le même événement. Aucun des deux observateurs n'a besoin d'être incompétent pour que leurs conclusions divergent. À midi, un jeune descendant de Khinae déjeune avec ses parents. Il sait depuis trois jours que quelque chose ne va pas : ses sens ont changé, ses rêves sont devenus trop précis et une colère a fait apparaître une morphologie qu'il ne connaissait que dans les films. Ses parents ne sont pas des Garous. Ils ne se sont jamais éveillés. L'un d'eux se souvient pourtant soudain d'une histoire racontée par une grand-mère et commence à comprendre qu'un héritage a dormi plus longtemps que la mémoire familiale. À quinze heures, un membre de la Mafia Shaediri négocie l'arrivée d'un composant interdit. Il ne voyage pas vers les étoiles. Le réseau externe se charge de faire parvenir la marchandise jusqu'à une route utilisable autour de la Terre. Son travail consiste à rendre le dernier segment possible : identité, transport, entrepôt, paiement et silence."
          },
          {
            "type": "p",
            "text": "À quelques kilomètres, une équipe du GAAC aide légalement une famille extrale à résoudre un problème d'habitat qui n'a rien de criminel ni de spectaculaire. À dix-neuf heures, un Chasseur pousse la porte d'un bar qui accueille aussi des clients ordinaires. Il vient chercher quelqu'un capable de lui dire si les traces trouvées dans un appartement correspondent à un Vampire, un esprit ou une technologie. La réponse sera peut-être « aucun des trois ». La chose la plus importante qu'il apprendra ce soir n'est pas un nouveau moyen de tuer, mais le nom de la personne à appeler avant de décider ce qu'il a vu. À minuit, une silhouette se Révèle dans un parking souterrain. Pendant quelques secondes, des témoins voient quelque chose qu'ils n'auraient jamais dû rencontrer. Certains fuient. Une caméra filme. Un téléphone transmet déjà un extrait. Le lendemain, l'événement existe toujours : véhicule endommagé, blessés, enquête, rumeurs. Ce qui change est l'histoire que le monde commence à raconter sur ce qui s'est passé. La Vérité fonctionne ainsi la plupart du temps. Elle ne remplace pas la Réalité. Elle la traverse. Toutes les théories du Voile conservent pourtant des angles morts. Isabella la Cartomancienne constitue l'une des exceptions les plus dérangeantes connues : elle peut franchir le Voile à volonté d'une manière qui ne ressemble pas aux routes ordinaires. Son existence rappelle qu'un corpus de Vérité, aussi vaste soit-il, ne transforme jamais l'inconnu en système parfaitement fermé."
          }
        ]
      },
      {
        "id": "vivre-sous-une-traduction-permanente",
        "title": "Vivre sous une traduction permanente",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Le Voile ne s'active pas seulement lorsque quelqu'un commet l'imprudence de montrer des crocs, des ailes ou une anatomie impossible. Il accompagne des existences entières. Des personnes naissent, grandissent, travaillent, tombent malades et meurent à l'intérieur d'une traduction qui leur permet de partager la même ville que des Humains sans obliger chaque interaction quotidienne à devenir une crise surnaturelle. Cette permanence est l'une des raisons pour lesquelles la Vérité ne ressemble pas à une clandestinité ordinaire. Un espion doit fabriquer une couverture ; le Voile fournit déjà une cohérence corporelle à une créature qui, autrement, ne pourrait pas prendre le métro ou traverser un hall d'immeuble sans être immédiatement identifiée. Cela ne lui donne ni papiers, ni emploi, ni compte bancaire, ni histoire sociale. Tout ce qui relève de l'existence administrative reste à construire dans la Réalité. Le Voile résout l'impossibilité physique ; il ne fabrique pas une vie réussie. Pour les communautés anciennes, cette distinction est devenue banale. Un Exilé né en Californie peut avoir une identité légale aussi ordinaire que celle de son voisin. Un Vampire peut posséder des sociétés, des diplômes et des dettes parfaitement réels. Un Garou peut passer quarante ans sans prendre sa forme hybride devant un témoin. L'Hologramme n'efface pas ces biographies : il leur permet de ne pas être immédiatement contredites par l'anatomie réelle de ceux qui les portent. Les nouveaux arrivants vivent cette situation de manière beaucoup plus brutale. Un Extral peut comprendre intellectuellement que son corps sera traduit sans saisir ce que signifie être soudain regardé comme Humain par toute une planète."
          },
          {
            "type": "p",
            "text": "Les gestes changent de sens, les distances sociales se modifient, les vêtements deviennent possibles ou absurdes, et des réactions qui étaient normales dans l'espèce d'origine paraissent étranges dans une silhouette humaine. Les Silcenters, le GAAC et d'autres infrastructures de Vérité consacrent donc beaucoup d'énergie à ce qui ne relève d'aucun pouvoir : apprendre à vivre dans une traduction."
          }
        ]
      },
      {
        "id": "naitre-derriere-le-voile",
        "title": "Naître derrière le Voile",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Un enfant de Vérité n'attend pas nécessairement l'adolescence pour « devenir » ce qu'il est. Sa Nature peut être présente bien avant qu'il en ait conscience. Ce qui change avec l'éveil n'est pas toujours la biologie fondamentale, mais l'accès conscient à une partie de celle-ci, la capacité à reconnaître ses manifestations et la compréhension du monde dans lequel elles prennent sens. Cette distinction est essentielle chez les descendants de Khinae. Une lignée peut rester latente plusieurs générations. Des parents persuadés d'être Humains peuvent avoir un enfant chez qui l'héritage s'exprime. Le premier problème de la famille n'est alors pas de choisir une faction ou d'acheter des pouvoirs, mais de comprendre pourquoi un corps jusque-là ordinaire commence à réagir à des instincts, des perceptions ou des transformations que personne n'avait préparés. Chez les Exilés, la situation peut être inverse. Une famille connaît parfaitement sa Nature depuis des générations et enseigne très tôt à l'enfant ce que le Voile traduit. Le jeune Elyë sait qu'il n'est pas biologiquement Humain bien avant de pouvoir employer consciemment la moindre capacité de Vérité. Il apprend deux descriptions de son corps : celle qui permet de vivre dans le monde visible et celle qui explique ce qu'il est réellement. L'Hologramme peut même influer sur le développement physique lorsque la cohérence humaine l'exige. Les espèces dont l'enfance naturelle durerait des décennies ou des siècles peuvent connaître sous le Voile une maturation accélérée."
          },
          {
            "type": "p",
            "text": "Chez les Elyë, cette adaptation permet à un enfant maintenu Voilé de grandir à un rythme compatible avec une enfance humaine et d'atteindre l'âge adulte autour de la vingtaine plutôt qu'après une durée incompatible avec toute identité terrestre ordinaire. Ce phénomène ne rend pas l'espèce plus fertile et ne change pas sa longévité : il adapte la maturation du corps traduit. Cette propriété a produit des débats profonds. Certains Exilés la considèrent comme une protection indispensable ayant permis à des générations entières de vivre et de survivre sur Terre. D'autres y voient la preuve que le Voile ne se contente pas de masquer : il peut modeler la relation entre un être et son propre développement. Les familles n'ont pas toutes la même réponse, et un enfant n'a pas toujours le même rapport que ses parents à une adaptation qu'il a vécue comme parfaitement naturelle."
          }
        ]
      },
      {
        "id": "un-seul-corps-plusieurs-expressions",
        "title": "Un seul corps, plusieurs expressions",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "La Révélation ne crée pas un nouveau corps à chaque changement d'état. Elle modifie la manière dont la Nature réelle s'exprime face à la cohérence imposée par l'Hologramme. Cette continuité explique pourquoi une blessure ne disparaît pas lorsqu'un être retourne sous le Voile et pourquoi une prothèse intégrée ne tombe pas au sol sous prétexte que la silhouette qui la porte change d'apparence. Une augmentation installée dans le corps, une prothèse, une modification organique durable ou un implant correctement intégré suivent la traduction. Leur forme visible peut devenir compatible avec l'anatomie humaine tout en conservant leurs fonctions. Cette capacité a rendu possible une rencontre que les concepteurs les plus anciens du Voile n'avaient probablement jamais imaginée : en 2035, une créature surnaturelle peut être biologiquement non humaine, cachée par une œuvre technomagique antique et porter en même temps une augmentation terrestre de deuxième génération parfaitement fonctionnelle. À l'inverse, ce qui est simplement porté reste un objet. Une arme, un sac, un vêtement, un véhicule ou un outil ne change pas automatiquement de nature parce que son propriétaire se Révèle. Les communautés qui utilisent plusieurs formes ont appris depuis longtemps à penser leur équipement en conséquence. Les vêtements déchirés, les armes impossibles à saisir avec une morphologie différente ou les véhicules devenus impraticables ne sont pas des détails comiques : ils déterminent parfois si une Révélation permet réellement de fuir ou de combattre. La même continuité vaut pour les restes. Sous l'Hologramme, un cadavre demeure généralement cohérent avec sa traduction. Un fragment biologique détaché reçoit lui aussi une forme plausible."
          },
          {
            "type": "p",
            "text": "Hors de l'influence du Voile, la matière révèle ce qu'elle est réellement. Cette propriété explique pourquoi tant d'enquêtes humaines ont pu traverser des siècles sans conclure publiquement à l'existence d'espèces impossibles tout en conservant, dans des collections privées ou des lieux sortis du Voile, des preuves autrement inexplicables."
          }
        ]
      },
      {
        "id": "les-metiers-qui-voient-trop-de-choses",
        "title": "Les métiers qui voient trop de choses",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Certains métiers humains se trouvent plus souvent que d'autres au bord de la Vérité. Les urgentistes voient des blessures incompatibles avec l'accident déclaré. Les médecins légistes rencontrent des corps qui ne correspondent pas tout à fait aux souvenirs d'une scène. Les techniciens de sécurité récupèrent des données dont plusieurs versions ne concordent pas. Les enquêteurs, pompiers, militaires, personnels de laboratoire et employés de maintenance entrent régulièrement dans des lieux après que tout le monde est parti. La plupart n'en concluent pas que le surnaturel existe. Le système leur fournit presque toujours une explication plus acceptable : erreur de mesure, contamination, stress, sabotage, mauvais protocole, logiciel défectueux. Les institutions modernes sont extrêmement douées pour absorber une anomalie individuelle parce qu'elles disposent déjà de procédures pour traiter les erreurs ordinaires. Les rares professionnels qui accumulent trop de contradictions peuvent suivre plusieurs chemins. Certains deviennent obsédés et perdent leur crédibilité. D'autres rencontrent une organisation de Vérité qui préfère les recruter ou les détourner. Quelques-uns finissent Chasseurs. D'autres encore choisissent consciemment de ne pas savoir davantage, parce qu'ils ont compris qu'une réponse correcte peut être plus dangereuse qu'un dossier mal classé."
          }
        ]
      },
      {
        "id": "la-verite-et-les-lieux",
        "title": "La Vérité et les lieux",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "La géographie de la Vérité ne se superpose pas proprement aux frontières humaines. Un quartier peut être banal pour la majorité de ses habitants et contenir un sanctuaire, une clinique extrale, une Maison vampirique, une petite Loge et un bar de Chasseurs qui ne se reconnaissent pas mutuellement comme appartenant au même monde social. Ces lieux existent rarement « hors de la Réalité ». Ils paient des loyers, consomment de l'électricité, emploient des gens et reçoivent des livraisons. Leur fonction de Vérité s'ajoute à leur fonction visible. Une épicerie peut réellement être une épicerie tout en servant de point de contact à une diaspora. Un restaurant peut être rentable et accueillir les réunions d'une organisation. Un atelier peut réparer des véhicules humains le jour et travailler la nuit sur un dispositif impossible à déclarer à un assureur. Cette double vie est plus solide que le cliché du repaire secret. Elle permet à des communautés de durer parce qu'elles ne dépendent pas exclusivement d'une activité occulte. Elle crée aussi des vulnérabilités. Fermer un commerce pour fraude fiscale peut détruire un point de rencontre de Vérité sans que l'administration sache ce qu'elle vient réellement de disperser. Les Silcenters représentent une version particulièrement développée de cette logique. Ce ne sont pas seulement des refuges pour personnes récemment arrivées d'Aèr. Ce sont des infrastructures culturelles où l'on peut trouver logements, commerces, enseignement, réseaux familiaux et savoirs adaptés à plusieurs générations nées sur Terre. Ils permettent à une identité exilée d'exister autrement que dans le secret familial. Les communautés extrales construisent des équivalents plus récents, souvent plus spécialisés."
          },
          {
            "type": "p",
            "text": "Une biobar, une clinique xénobiologique, un hangar adapté à une atmosphère particulière ou une interface de communication peuvent être indispensables là où un Exilé ancien dispose déjà d'une chaîne de services éprouvée depuis des siècles."
          }
        ]
      },
      {
        "id": "les-institutions-qui-ne-savent-pas-tout",
        "title": "Les institutions qui ne savent pas tout",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Aucune organisation de 2035 ne possède une carte complète de la Vérité. Même les puissances anciennes connaissent surtout les domaines qu'elles ont eu le temps, la nécessité ou la capacité d'étudier. Cette ignorance partagée est l'une des principales raisons pour lesquelles le monde caché reste dangereux. Une Cour vampirique peut avoir des archives remontant à l'Antiquité et ignorer presque tout d'une technologie extrale arrivée récemment. Le GAAC peut comprendre parfaitement les besoins de plusieurs espèces galactiques et disposer de connaissances dérisoires sur un Fléau terrestre. Une Loge de Mages peut avoir étudié pendant des siècles les phénomènes d'un territoire et être prise de court par une infrastructure technomagique azménorienne. Les Chasseurs compilent ce que leurs morts ont appris, mais leurs archives sont pleines de contradictions parce que les traditions n'ont jamais observé le monde depuis le même angle. Cette fragmentation limite les guerres totales. Détruire un rival peut signifier détruire la seule personne capable de fermer un phénomène que l'on ne comprend pas. Les alliances temporaires sont donc communes sans devenir de véritables unions. Un ennemi peut recevoir un appel parce que son expertise est irremplaçable, puis redevenir un rival dès que la crise est terminée. Elle explique aussi le prix de l'information. Dans la Vérité, un nom exact, une traduction ancienne, un trajet sûr ou la description fiable d'un effet peut valoir davantage qu'une arme. Ce n'est pas parce que le monde caché serait artificiellement mystérieux : c'est parce que les siècles de secret, de migrations, de destructions d'archives et de correction par le Voile ont rendu la continuité du savoir extraordinairement difficile."
          }
        ]
      },
      {
        "id": "verite-droit-et-culpabilite",
        "title": "Vérité, droit et culpabilité",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Le droit californien n'a pas de catégorie publique « Vampire », « Garou » ou « Mage ». Lorsqu'une personne de Vérité agit dans le monde visible, les institutions humaines travaillent avec les faits qu'elles peuvent reconnaître. Une agression reste une agression. Un homicide reste un homicide. Une intrusion reste une intrusion, même si la manière exacte dont elle a été commise ne survit pas correctement au rapport. Cette situation crée des zones grises pour les initiés travaillant dans l'État. Un enquêteur qui sait qu'un suspect a utilisé une capacité impossible doit encore produire une preuve admissible. Un médecin peut comprendre qu'une blessure est surnaturelle sans pouvoir inscrire cette conclusion dans un dossier ordinaire. Une administration peut identifier une menace réelle et devoir inventer une catégorie de sécurité qui permette d'agir sans expliquer publiquement ce qu'elle protège. Les communautés de Vérité développent donc leurs propres formes de justice, de médiation ou de vengeance, mais aucune ne possède une souveraineté universelle. Une Maison vampirique juge ses membres selon ses codes. Une Meute règle certains conflits selon ses liens. Le GAAC défend des intérêts extrals. Les Loges arbitrent des affaires magiques locales. Ces systèmes se chevauchent avec la loi humaine au lieu de là remplacer. Les conflits les plus intéressants naissent précisément lorsque plusieurs légitimités se rencontrent. Un Extral peut être légalement victime selon la Californie, politiquement embarrassant pour le GAAC et coupable selon les règles de son organisation d'origine. Un Vampire peut avoir respecté un serment de Cour en commettant un crime humain. Un Chasseur peut sauver plusieurs personnes par une opération que la police ne peut voir que comme une attaque armée."
          }
        ]
      },
      {
        "id": "identites-doubles-identites-entieres",
        "title": "Identités doubles, identités entières",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Le vocabulaire de « couverture » peut devenir trompeur. Pour une personne née sur Terre, le nom de la Réalité n'est pas forcément un faux nom et la vie visible n'est pas une comédie. L'emploi, les amis, les études et les relations amoureuses sont réels. La Nature secrète ajoute une dimension à cette identité ; elle ne l'annule pas. Cette évidence est particulièrement forte chez les Exilés de plusieurs générations, les Angelus incarnés, les Daemons réincarnés et les Natures latentes qui se découvrent tardivement. Leur révélation personnelle ne permet pas de déclarer que tout ce qui précédait était « faux ». L'individu doit intégrer une histoire supplémentaire dans une vie qui existait déjà. Les vieux initiés peuvent parfois avoir du mal à comprendre cette position. Une institution qui pense en siècles tend à privilégier le nom ancien, la lignée ou la fonction de Vérité. Un jeune adulte peut au contraire considérer que son identité administrative, ses amis profanes et sa culture californienne sont aussi constitutifs de lui que l'origine que l'on vient de lui révéler. Cette tension produit des conflits générationnels beaucoup plus intéressants que le simple choix entre « accepter » ou « refuser » sa Nature. La question est souvent : combien de place l'ancien monde a-t-il le droit de réclamer dans une vie moderne qu'il n'a pas construite ?"
          }
        ]
      }
    ]
  },
  {
    "id": "verite-v7-cycle-neant-ombremonde-histoire-cachee",
    "title": "Cycle, Néant, Ombremonde & histoire cachée",
    "tags": [
      "Vérité",
      "Cycle",
      "Néant",
      "Ombremonde",
      "Atlantide",
      "science",
      "magie",
      "religions",
      "mythes"
    ],
    "sections": [
      {
        "id": "religions-mythes-et-souvenirs-deformes",
        "title": "Religions, mythes et souvenirs déformés",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "La Vérité traverse les traditions humaines sans se laisser réduire à elles. Des événements réels ont nourri des mythes ; des mythes ont ensuite transformé la manière dont les événements étaient racontés. La Guerre céleste, l'ascension d'Elynea et la défaite des anciens dieux ont laissé une empreinte immense sur les religions monothéistes. Les Daemons servent des puissances autrefois vénérées sous des noms divins avant d'être reclassées comme démons par la propagande des vainqueurs. Les Angelus ont contribué à cette histoire sans contrôler automatiquement les Églises qui existent aujourd'hui. Cette distinction est importante. Une religion moderne est une institution humaine ayant ses siècles de théologie, de politique, de réforme, de schismes et de pratiques sociales. Découvrir qu'une entité angélique existe ne transforme pas une hiérarchie religieuse en administration céleste. Un prêtre peut rencontrer un Angelus et le soupçonner d'hérésie, d'imposture ou de manipulation. Une Église peut posséder une tradition de Chasse tout en refusant de traiter les êtres célestes comme des supérieurs hiérarchiques. Les anciens cultes polythéistes connaissent le problème inverse. Certaines divinités ont réellement existé ou existent encore sous des formes que l'histoire humaine a reclassées. Cela ne signifie pas que chaque récit mythologique soit littéralement vrai. Les traditions ont conservé des fragments, les ont combinés, déplacés et interprétés. La Vérité donne aux mythes une profondeur historique ; elle ne transforme pas chaque texte sacré en rapport de mission exact."
          }
        ]
      },
      {
        "id": "l-ombremonde-le-reste-du-monde",
        "title": "L'Ombremonde, le reste du monde",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "L'Ombremonde est souvent décrit comme « de l'autre côté du Voile », formule utile mais imparfaite. Il ne s'agit pas d'un univers parallèle créé pour recevoir les monstres. C'est ce qui demeure du monde lorsque l'on se trouve hors de l'emprise normale de l'Hologramme : un espace où la Magie est plus abondante, où les traductions humaines cessent de s'imposer et où des formes de vie que la Terre voilée a rendues rares ou invisibles peuvent exister ouvertement. Les voyageurs y découvrent surtout combien la Réalité visible est une exception soigneusement maintenue. Les distances, les dangers et les phénomènes occultes ne se comportent pas toujours comme les habitudes terrestres le laisseraient croire. Les zones habitées sont rares par comparaison avec l'immensité des espaces dangereux. Une route connue peut être plus précieuse qu'une arme parce qu'elle permet simplement de traverser sans rencontrer ce qui vit entre deux refuges. Atlantide y constitue l'un des exemples les plus spectaculaires d'une civilisation ayant continué à exister alors que le monde humain la transformait en mythe. Pour les Aseryns, l'Ombremonde n'est donc pas seulement un territoire hostile : il contient aussi des lieux où leur histoire possède encore une matérialité que la Terre visible a perdue. Les passages prennent des formes variées. Certains sont entretenus, ritualisés ou surveillés. D'autres apparaissent comme des fissures lorsque la cohérence locale se fragilise. Ces fissures ont tendance à se produire loin du regard humain et à se refermer, comme si l'Hologramme cherchait à restaurer lui-même la continuité de sa frontière. Elles n'obéissent cependant pas à un calendrier exploitable et ne constituent jamais un réseau de transport sûr par défaut."
          },
          {
            "type": "p",
            "text": "Une Éjection vers l'Ombremonde n'est donc pas une téléportation punitive vers une cellule. C'est être rejeté dans un monde où la traduction protectrice n'assure plus la compatibilité avec la société humaine et où les dangers naturels de la Vérité redeviennent immédiats. Revenir reste possible dans certaines circonstances. Survivre assez longtemps pour le faire est une autre question."
          }
        ]
      },
      {
        "id": "fissures-catastrophes-et-opportunistes",
        "title": "Fissures, catastrophes et opportunistes",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Chaque fissure crée un problème local avant de devenir un problème cosmologique. Un animal peut passer. Une créature peut trouver un chemin vers une zone industrielle. Une équipe de récupération peut essayer de franchir la frontière avant qu'elle ne se ferme. Une corporation peut enregistrer un phénomène qu'elle ne comprend pas et décider qu'il s'agit d'une opportunité de recherche. Les groupes de Vérité réagissent selon leurs intérêts. Des Chasseurs cherchent à empêcher une menace de s'installer. Une Loge veut comprendre ce qui a rompu. Un Exilé peut reconnaître un paysage ou une signature. L'AIDH s'intéresse à la stabilité du phénomène. Une organisation criminelle peut ne voir qu'une route de contrebande impossible à surveiller par les autorités humaines. La plupart des incidents ne deviennent pas des crises planétaires parce que l'Hologramme se répare et que les communautés qui connaissent ces phénomènes ont intérêt à les contenir. Ce fonctionnement explique aussi pourquoi la Vérité peut rester cachée sans supposer une conspiration parfaitement coordonnée : des acteurs qui se détestent peuvent tous vouloir fermer la même brèche pour des raisons totalement différentes."
          }
        ]
      },
      {
        "id": "science-magie-et-technologie-sous-le-voile",
        "title": "Science, Magie et technologie sous le Voile",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "La découverte de la Vérité ne détruit pas la science. Elle révèle que le modèle utilisé par l'Humanité décrit extraordinairement bien une partie du réel tout en excluant des phénomènes qu'un mécanisme planétaire a précisément contribué à rendre inobservables ou incohérents. Un Mage compétent ne méprise pas la physique parce qu'il peut la transgresser. Au contraire, comprendre ce qu'une force devrait faire lui permet de savoir exactement ce qu'il est en train de modifier. Un biologiste extral n'abandonne pas la médecine face à une régénération surnaturelle ; il cherche quelles parties sont biologiques, quelles parties relèvent d'une Nature et lesquelles cessent d'être reproductibles hors de cet être précis. Cette rencontre est devenue beaucoup plus importante en 2035. Les augmentations, la neurotechnologie, les matériaux vivants et l'Holonet donnent aux chercheurs des instruments qu'aucune civilisation terrestre récente n'avait possédés. Dans le même temps, la Vérité fournit des phénomènes que ces instruments n'ont jamais été conçus pour mesurer. Le résultat n'est ni la victoire de la Magie ni celle de la science, mais une frontière de recherche extrêmement dangereuse. Les Azménoriens connaissent mieux que beaucoup le risque de cette convergence. Leur histoire conserve le souvenir d'une Technomagie capable d'associer transgression magique et architecture scientifique jusqu'à produire des œuvres qui ne respectent plus les limites ordinaires de l'une ou de l'autre. Les Servants de Pluton voient donc avec inquiétude une Terre qui progresse technologiquement à une vitesse exceptionnelle tout en possédant une densité de phénomènes magiques que la plupart des civilisations galactiques ne rencontrent jamais."
          },
          {
            "type": "p",
            "text": "L'AIDH partage une partie de cette inquiétude pour d'autres raisons. Elle sait que la Terre n'est pas seulement un monde technologiquement arriéré cachant quelques anomalies. C'est une planète où l'Hologramme lui-même constitue une œuvre technomagique à l'échelle globale, œuvre à laquelle l'AIDH a participé et qu'elle continue d'aider à stabiliser."
          }
        ]
      },
      {
        "id": "religions-mythes-et-souvenirs-mal-classes",
        "title": "Religions, mythes et souvenirs mal classés",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "La Vérité donne parfois une base réelle à des mythes sans les transformer en comptes rendus historiques exacts. Les religions humaines ont absorbé, oublié, réinterprété et mélangé des rencontres avec des créatures, des puissances et des événements dont le contexte véritable avait disparu. La victoire d'Elynea après la Guerre céleste a profondément marqué cette mémoire. Les anciens dieux furent diabolisés dans la narration monothéiste qui s'imposa progressivement, tandis qu'Elynea devint le Dieu unique des grandes traditions concernées. Cette histoire n'implique cependant pas que les Églises humaines modernes connaissent le dossier cosmologique ou obéissent aux Angelus. Des siècles de foi humaine ont produit leurs propres institutions, débats et autorités. De la même manière, une créature correspondant à une légende n'est pas nécessairement l'origine unique de celle-ci. Les mythes peuvent avoir fusionné plusieurs événements, déplacé un lieu, donné le même nom à des Natures différentes ou attribué à une divinité l'action d'une organisation. Les initiés qui lisent les traditions humaines comme un bestiaire littéral se trompent souvent autant que ceux qui les rejettent entièrement. Les vieilles communautés apprennent donc à lire les mythes comme des archives endommagées. Une répétition étrange, un motif partagé par plusieurs cultures ou une contradiction persistante peut conserver davantage de Vérité qu'un récit pris mot à mot."
          }
        ]
      },
      {
        "id": "le-cycle-le-neant-et-ce-que-la-mort-revele",
        "title": "Le Cycle, le Néant et ce que la mort révèle",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Les peuples de Vérité ne partagent pas tous la même destinée métaphysique. C'est l'une des différences que le monde visible masque le plus efficacement, parce qu'elle n'apparaît qu'au moment où la vie cesse réellement. Les descendants ordinaires de Khinae appartiennent au **Cycle**. Leur Nature animale, leur Mue et leurs Sangs vifs ne les en expulsent pas. Cette continuité distingue radicalement les Garous et les autres thérianthropes des Vampires, malgré leur origine khinae commune. Les Vampires portent la marque de leur ancienne corruption. Leur vraie mort les conduit au **Néant** plutôt qu'au Cycle. Cette certitude, plus ou moins comprise selon les Cours, donne à leur culture de survie une profondeur que la simple peur de mourir n'explique pas. Pour eux, certaines destructions sont réellement définitives d'une manière que beaucoup d'autres Natures n'expérimentent pas. Les Daemons constituent encore un autre cas : leur âme a été choisie, retirée du Cycle et reforgée par une ancienne divinité. Leur continuité dépend donc d'une intervention divine qui a déjà modifié ce que la mort signifiait pour eux. Les Angelus ont une histoire liée à la Transcendance et à une création artificielle antérieure à leur état céleste. Les Mages restent fondamentalement Humains malgré leur Mageius. Les Extrals, eux, rappellent que la cosmologie terrestre n'est pas un catalogue simple où chaque espèce reçoit automatiquement une case connue. Les initiés prudents évitent donc d'appliquer à tout le monde la théologie de leur propre tradition. Savoir ce qui arrive après la mort est déjà difficile ; supposer que la même réponse vaut pour chaque Nature est souvent une erreur plus grave encore."
          }
        ]
      }
    ]
  }
] as const;
export const COMPENDIUM_VERITE_V7_LORE_ARTICLES:Article[]=SOURCE_ARTICLES.map(a=>({...a,tags:[...a.tags],dataset:"verite-v7",category:"Vérité",sourceCategory:"Vérité",source:SOURCE,status:"canon_enrichi",rebuildV2:true,sections:a.sections as unknown as Section[]}));
export const COMPENDIUM_VERITE_V7_LORE_NAVIGATION=[
{id:"verite-v7-derriere-le-voile",dataset:"verite-v7",category:"Vérité",group:"Derrière le Voile",groupOrder:20,subgroup:"Cadre général",subgroupOrder:10,pageOrder:10,displayTitle:"Vérité — derrière le Voile"},
{id:"verite-v7-voile-hologramme",dataset:"verite-v7",category:"Vérité",group:"Derrière le Voile",groupOrder:20,subgroup:"Cadre général",subgroupOrder:10,pageOrder:20,displayTitle:"Le Voile & l'Hologramme"},
{id:"verite-v7-habiter-la-verite",dataset:"verite-v7",category:"Vérité",group:"Derrière le Voile",groupOrder:20,subgroup:"Vie derrière le monde visible",subgroupOrder:20,pageOrder:10,displayTitle:"Habiter la Vérité"},
{id:"verite-v7-cycle-neant-ombremonde-histoire-cachee",dataset:"verite-v7",category:"Vérité",group:"Derrière le Voile",groupOrder:20,subgroup:"Cosmologie & histoire",subgroupOrder:30,pageOrder:10,displayTitle:"Cycle, Néant, Ombremonde & histoire cachée"}
];
