import {
  COMPENDIUM_VERITE_FLEAUX_ARTICLES,
  COMPENDIUM_VERITE_FLEAUX_ENRICHMENTS
} from "./compendium-verite-fleaux-focus.js";

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

const lore = (text: string): Block => ({ type: "p", style: "lore", text });
const table = (rows: unknown[][]): Block => ({ type: "table", rows });

const norm = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const cultSection = (id: string, title: string, blocks: Block[]): Section => ({
  id,
  title,
  level: 2,
  blocks
});

const CULT_SECTION_REWRITES: Record<string, Section> = {
  "cult-1-l'ordre-de-longinus-histoire": cultSection(
    "cult-1-l'ordre-de-longinus-histoire",
    "L’ordre de Longinus — Histoire",
    [
      lore(
        "Longinus était un ordre de Chasseurs chrétiens. Lors de la réforme qui devait réunir les anciens ordres en trois institutions, il refusa de se soumettre à l’ordre d’Arianwen. En 1235, son maître Vicente Valerio affirma posséder la lance de Longinus et voulut l’offrir au pape Grégoire IX ; il fut assassiné en chemin et la relique disparut."
      ),
      lore(
        "Ivan Aguinaldo, second de Valerio, déclara alors que le pape était un démon et conduisit l’ordre dans la clandestinité. Valerio fut canonisé comme martyr par ses propres compagnons. Aguinaldo puis ses successeurs prétendirent recevoir de lui des révélations sur le « démon papal », le véritable héritier de Jésus et un pape caché qui détiendrait la lance."
      ),
      lore(
        "Vers 1288, l’Ombre-Pape se révéla à l’ordre et en prit la direction. Son visage comme la continuité de son identité restent tabous. Il annonça qu’un nouveau Messie, second enfant de Dieu venu accomplir le Jugement dernier, naîtrait à la fin des années 1980. Depuis cette prophétie, Longinus prépare son avènement."
      )
    ]
  ),
  "cult-2-l'ordre-de-longinus-fonctionnement": cultSection(
    "cult-2-l'ordre-de-longinus-fonctionnement",
    "L’ordre de Longinus — Fonctionnement",
    [
      lore(
        "L’Ombre-Pape, fragment de V’Aagor, dirige l’ordre avec ses Cardinaux. Les ombre-prêtres diffusent le culte tandis que les ombre-templiers assurent la Chasse et la protection de la secte."
      ),
      lore(
        "Longinus se dissimule parmi d’anciens religieux et des groupes chrétiens en rupture. Il récupéra notamment de nombreux chevaliers après la dissolution des Saintes Lagunes. Moines, nonnes et prêtres fragilisés de l’Église réformée peuvent être orientés à leur insu depuis les échelons inférieurs."
      ),
      lore(
        "L’ordre est surtout implanté en Asie. Après la guerre, sa communauté la plus importante se trouvait en Corée. Son secret repose moins sur l’absence de membres que sur l’usage de structures religieuses ordinaires comme couverture."
      )
    ]
  ),
  "cult-4-la-secte-de-l'-il-blanc-histoire": cultSection(
    "cult-4-la-secte-de-l'-il-blanc-histoire",
    "La secte de l’Œil Blanc — Histoire",
    [
      lore(
        "Les premiers Effismes auraient atteint la Terre il y a plusieurs millénaires, attirés par une gravité fluctuante. La gravité terrestre, trop faible pour leur physiologie, les rendit rapidement malades. Leur repli religieux attira V’Aagor et donna naissance à Rnael’Gem, fragment du Fléau façonné à leur image."
      ),
      lore(
        "Rnael’Gem corrompit la communauté et arracha les femelles à leur dimension afin qu’elles puissent se matérialiser auprès des mâles. Le culte resta peu nombreux, mais chacun de ses véritables membres devint une Abomination supérieure capable de menacer l’Ombre-Monde."
      ),
      lore(
        "Les Effismes qui ne furent pas rejetés dans l’Ombre-Monde sont des femmes aux yeux blancs ou gris, souvenir de leur teinte d’origine. Cette particularité donna son nom à la secte de l’Œil Blanc."
      )
    ]
  ),
  "cult-5-la-secte-de-l'-il-blanc-fonctionnement": cultSection(
    "cult-5-la-secte-de-l'-il-blanc-fonctionnement",
    "La secte de l’Œil Blanc — Fonctionnement",
    [
      lore(
        "Rnael’Gem demeure le maître absent de l’ordre. Il comprend imparfaitement sa nature de fragment de V’Aagor et dort le plus souvent dans son tombeau. Son corps sert pourtant aux cultistes pour conférer des pouvoirs temporaires à leurs « messagers »."
      ),
      lore(
        "On ne devient pas Effisme par conversion. Les véritables Sœurs ont l’apparence de nonnes aux yeux gris, portent des tatouages sombres sur les membres et un trou noir tentaculaire dans le dos. Elles recherchent des Mages ou des Voyageurs capables d’ouvrir l’Ombre-Monde."
      ),
      lore(
        "La secte entretient trois couvents, en Autriche, en Afrique du Sud et près de Salem aux États-Unis. Elle recrute de nombreux sorciers comme messagers jetables : ceux-ci croient appartenir au culte et espèrent une récompense s’ils livrent un Mage."
      ),
      lore(
        "Les Mages exécutent ces messagers dès qu’ils les identifient. Leur seule présence étouffe la magie des sorciers soumis aux Loges et révèle assez clairement l’influence de l’Œil Blanc."
      )
    ]
  ),
  "cult-7-la-fontaine-de-tenebres-histoire": cultSection(
    "cult-7-la-fontaine-de-tenebres-histoire",
    "La Fontaine des Ténèbres — Histoire",
    [
      lore(
        "Le culte d’Osh’bawa existait déjà chez les Vampires d’Afrique centrale avant la naissance de Neeba. Osh’bawa n’y est pas un dieu nocturne, mais la Force des Ténèbres : principe de l’intangible et de ce qui échappe à la vue comme au toucher."
      ),
      lore(
        "La Fontaine des Ténèbres est présentée comme sa création. Elle promet les ténèbres aux êtres de lumière, la force aux faibles, le savoir aux ignorants, l’immortalité aux mortels et une existence transcendante aux vivants. Des descendants corrompus des Khinae lui sacrifièrent pour recevoir sang et pouvoirs."
      ),
      lore(
        "Les Oru Ayeraye conservent ainsi une intuition juste sur les racines khinae des Vampires. Leur refus d’un fondateur unique, qu’il soit nommé Arawn ou Caïn, leur fait toutefois écarter l’intervention d’Awan, ou R’Gahanath, pourtant essentielle dans cette histoire."
      )
    ]
  ),
  "cult-8-la-fontaine-de-tenebres-fonctionnement": cultSection(
    "cult-8-la-fontaine-de-tenebres-fonctionnement",
    "La Fontaine des Ténèbres — Fonctionnement",
    [
      lore(
        "Le culte appartient à la faction vampirique Oru Ayeraye et reprend une forme de chamanisme. Tout membre qui affirme sentir l’appel de la Fontaine peut être formé comme prêtre d’Osh’bawa ; il n’existe pas de caste sacerdotale fermée."
      ),
      lore(
        "Le sang du prêtre devient oshirique, c’est-à-dire chargé de Sombre-Vérité. Le Vampire perd les dons propres à son ancien sang mais renforce sa télékinésie et ses capacités physiques. Il dépend alors de la Fontaine et ne peut plus se nourrir normalement que de personnes ayant consommé de la Sombre-Vérité."
      ),
      lore(
        "Un autre sang accélère sa soif, même s’il peut corrompre temporairement une victime pour s’en nourrir. Boire son propre sang ou celui d’un autre Oshirique risque de produire une Strygoï noire : une Abomination de plusieurs mètres qui aspire les fluides vitaux la nuit et s’enterre pendant le jour."
      )
    ]
  ),
  "cult-10-la-confrerie-de-la-faux-histoire": cultSection(
    "cult-10-la-confrerie-de-la-faux-histoire",
    "La Confrérie de la Faux — Histoire",
    [
      lore(
        "Les confréries d’assassins étaient nombreuses sur Aèr, surtout chez les Elyë noirs. L’une d’elles survécut sur Terre sous plusieurs noms, toujours associée à une faux et à la Mort. Elle ne recrutait que des descendants d’Elyë noirs ou sylvains."
      ),
      lore(
        "Obéron voulut mettre fin aux organisations attachées à une seule lignée afin d’unifier les Elyë terrestres. Nerediath Lisindrith, maître de la confrérie, y vit une manœuvre destinée à renforcer des élus qui n’étaient jamais issus des Elyë noirs et dénonça le racisme de cette politique."
      ),
      lore(
        "Sa rébellion provoqua la mobilisation de la Chasse Fantastique. Titania massacra les membres et partisans de la confrérie, réduisant brutalement la population issue des Elyë noirs. Nerediath survécut grâce à V’Aagor, qui le posséda et en fit une incarnation."
      ),
      lore(
        "La Confrérie reconstituée rompit avec les autres institutions elfiques. Elle accueillit parias, semi-Elyë ignorants de la Vérité, opposants aux élus, Azménoriens, Whurtens et tout Exilé susceptible de servir son nouveau Père."
      )
    ]
  ),
  "cult-11-la-confrerie-de-la-faux-fonctionnement": cultSection(
    "cult-11-la-confrerie-de-la-faux-fonctionnement",
    "La Confrérie de la Faux — Fonctionnement",
    [
      lore(
        "La Confrérie est une société secrète de Crawlers, principalement des Voidrunners assassins. Comme la Blanchisserie, elle distribue missions, informations et armement, mais ajoute à cette offre des dons obtenus par conversion au culte sombre."
      ),
      lore(
        "Ses membres disent vénérer Alyera Scytheri, première reine des Elyë noirs. Ce nom masque V’Aagor et surtout R’Gahanath, aussi appelée Awan, Aklima et parfois Arawn, dont l’apparence rappelle la souveraine elfique."
      ),
      lore(
        "Trois actes de foi ouvrent l’accès à la confrérie et corrompent définitivement le corps comme l’âme. Nerediath, le Père, peut ensuite posséder un membre, employer ses réflexes pour le sauver ou le tuer instantanément. Cette dépendance fonde la loyauté presque absolue des assassins."
      )
    ]
  ),
  "cult-13-le-gouffre-infini-histoire": cultSection(
    "cult-13-le-gouffre-infini-histoire",
    "Le Gouffre Infini — Histoire",
    [
      lore(
        "Les Whurtens se divisèrent sous la double pression des purges humaines et de l’influence elyë au Conseil des Anciens. Motsognir refusa une surface privée de magie et de ressources technologiques, puis conduisit ses alliés dans les profondeurs où vivaient déjà d’anciennes Abominations."
      ),
      lore(
        "Sa fille Fredegonda naquit frêle au milieu de cette guerre souterraine. La moindre magie abîmait son âme et son père la jugeait inutile. Elle traversa l’Ombre-Monde pour absorber davantage de pouvoir, mais revint plus malade encore, avec une âme qui s’émiettait."
      ),
      lore(
        "Motsognir ordonna qu’elle soit jetée dans le Gouffre Infini afin de protéger la communauté. Il ignorait que ce gouffre était une partie de V’Aagor. Fredegonda y reçut les Ténèbres, devint un fragment du Fléau et acquit le pouvoir de commander puis de créer des Deimons."
      ),
      lore(
        "Ses victoires dépassèrent celles de son père. Les Duergars rejetèrent ses partisans comme des traîtres, mais le culte avait pris racine et Fredegonda commença à l’étendre vers la surface."
      )
    ]
  ),
  "cult-14-le-gouffre-infini-fonctionnement": cultSection(
    "cult-14-le-gouffre-infini-fonctionnement",
    "Le Gouffre Infini — Fonctionnement",
    [
      lore(
        "Fredegonda dirige un culte restreint avec dix grands Deimons à forme whurtenne, créés pour lui tenir compagnie. Ces Ombres commandent aux prêtres, qui n’ont aucun accès direct à leur maîtresse. Elles leur ordonnent de recruter des Whurtens de la surface et d’aider les autres cultes de V’Aagor."
      ),
      lore(
        "Fredegonda entend pourtant V’Aagor et Thul sans parvenir à les différencier. Elle croit servir un seul Dieu malgré des commandements contradictoires. Certains prêtres se rapprochent donc des cultes de V’Aagor, tandis que d’autres suivent les réseaux thuliens."
      )
    ]
  ),
  "cult-1-l'ordre-des-saintes-lagunes-histoire": cultSection(
    "cult-1-l'ordre-des-saintes-lagunes-histoire",
    "L’ordre des Saintes Lagunes — Histoire",
    [
      lore(
        "Aldebert de Vandrick, cousin d’Otton Ier, fonda les Saintes Lagunes après avoir noyé des sorcières accusées d’avoir tué des guerriers pendant des orgies païennes. L’ordre devait exterminer les sorcières et n’avait initialement aucun lien conscient avec Ux’Sharith."
      ),
      lore(
        "En traquant les communautés psycolors, les chevaliers comprirent que la foi et la noyade ne suffisaient pas. Ils capturèrent des sorcières et les forcèrent à repérer les autres. Comme les pouvoirs apparaissaient surtout chez les femmes, les hommes de l’ordre prétendirent rester purs tout en organisant violences, unions forcées et sélection des descendances."
      ),
      lore(
        "Le réseau d’extermination devint ainsi un système d’asservissement. Une théologie nouvelle rapprocha les couleurs psycolors d’un Archange lumineux que Lucifer aurait brisé, et chargea l’ordre de rassembler ces fragments. Ce récit permit au culte d’Ux’Sharith de pénétrer l’institution sans être nommé."
      )
    ]
  ),
  "cult-2-l'ordre-des-saintes-lagunes-fonctionnement": cultSection(
    "cult-2-l'ordre-des-saintes-lagunes-fonctionnement",
    "L’ordre des Saintes Lagunes — Fonctionnement",
    [
      lore(
        "Le grand maître commandait aux sénéchaux, puis aux capitaines et aux chevaliers. Chaque chevalier contrôlait un « troupeau » de sorcières : elles payaient pour ne pas être dénoncées et devaient signaler toute Psycolor non enregistrée. Orphelinats et couvents formaient les captives à la foi chrétienne et au service de l’ordre."
      ),
      lore(
        "En 2020, l’institution tirait des profits de l’esclavage moderne, de la prostitution et de mariages organisés pour étendre son emprise. L’éveil de Sharith détruisit sa structure officielle, mais une partie du réseau et de ses anciens agents survécut."
      )
    ]
  ),
  "cult-4-la-secte-de-bellatheis-histoire": cultSection(
    "cult-4-la-secte-de-bellatheis-histoire",
    "La secte de Bellatheis — Histoire",
    [
      lore(
        "Les descendantes d’Ux’Sharith ne furent pas toutes des Psycolors. Son titre de « Reine des Fléaux » exprimait son égalité avec V’Aagor, et non un statut de compagne. La secte de Bellatheis conserva surtout le souvenir de sa fertilité et de sa liberté, ainsi que de son aptitude à engendrer avec des êtres, des matières et des formes de vie incompatibles."
      ),
      lore(
        "Ses sorcières recherchèrent des lignées khinae, garoues et animales pour reproduire ce miracle. Jugées obscènes et dangereuses, elles furent traquées pendant des siècles mais développèrent une capacité propre, la Porte des Secrets."
      )
    ]
  ),
  "cult-5-la-secte-de-bellatheis-fonctionnement": cultSection(
    "cult-5-la-secte-de-bellatheis-fonctionnement",
    "La secte de Bellatheis — Fonctionnement",
    [
      lore(
        "Les cultistes portent aussi un héritage garou. La Porte des Secrets leur permet de copier un pouvoir après un contact charnel intime : leur ascendance khinae imite les attributs physiques, tandis que l’essence de Sharith reproduit les propriétés immatérielles."
      ),
      lore(
        "La fondatrice, engeance anonyme de Sharith, prit plus tard le nom de Raghnaid Maccalmain. La secte exige une ascendance liée au Fléau ou aux Loups-Garous ; la Grande Orbe sert à la détecter."
      ),
      lore(
        "Les sorcières recherchent ensuite des créatures aux capacités rares afin de s’en approprier les secrets. Elles agissent donc comme des Chasseuses surnaturelles, bien que leur méthode transforme la prédation en rite d’initiation."
      )
    ]
  ),
  "cult-7-le-culte-du-grand-savoir-histoire": cultSection(
    "cult-7-le-culte-du-grand-savoir-histoire",
    "Le culte du Grand Savoir — Histoire",
    [
      lore(
        "Le Grand Savoir naquit dans l’empire d’Akkad autour d’Ashlultum, sorcière Psycolor et rivale d’Enheduana. Cette dernière, fille de Sargon, haute prêtresse de Sîn, écrivaine et Mage de la Loge d’Ur, dominait les domaines politique, religieux et magique où Ashlultum voulait s’imposer."
      ),
      lore(
        "Anahita, Mage sans Loge, enseigna à Ashlultum des techniques destinées à compenser l’absence de pouvoir. L’élève ne cherchait pourtant qu’à surpasser sa rivale. Après plusieurs humiliations et erreurs politiques, Anahita l’abandonna et Ashlultum fut bannie avec ses filles."
      ),
      lore(
        "Un incarnat de V’Aagor l’approcha pendant son exil. Elle le tua mais ne put comprendre ni dissiper l’essence qui restait. Elle conclut que le Secret rendait l’ennemi invulnérable tandis que la Vérité permettait de le vaincre, puis retourna à Ur pour servir Enheduana jusqu’à sa mort."
      ),
      lore(
        "Ses filles poursuivirent secrètement son œuvre. Elles inscrivirent savoirs magiques, alchimiques puis scientifiques dans leur corps, leur peau et leurs yeux, et retrouvèrent dans la Division de Sharith une méthode pour démonter toute chose. Le culte, d’abord sémitique, gagna l’Espagne et l’Empire mongol avec l’expansion de l’islam."
      )
    ]
  ),
  "cult-8-le-culte-du-grand-savoir-fonctionnement": cultSection(
    "cult-8-le-culte-du-grand-savoir-fonctionnement",
    "Le culte du Grand Savoir — Fonctionnement",
    [
      lore(
        "Les membres sont des scientifiques appelés Archilogomanciens. Ils perçoivent les mécanismes : un corps comme écorché, une machine comme démontée, un pouvoir comme ralenti. Cette lecture leur donne en quelques instants les éléments nécessaires pour chercher une solution dans leurs connaissances."
      ),
      lore(
        "Le culte était exclusivement féminin à l’origine, mais accueille désormais tous les genres. Les femmes peuvent aussi manifester des pouvoirs de Psycogrey. Ana Diana de la Caza en est la grande prêtresse, assistée notamment des frères Karamov."
      )
    ]
  ),
  "cult-1-la-loge-d'ecume-histoire": cultSection(
    "cult-1-la-loge-d'ecume-histoire",
    "La Loge d’Écume — Histoire",
    [
      lore(
        "À la fin du XVIIIe siècle, plusieurs familles de Mages s’exilèrent en Alaska pendant la colonisation russe. Les Voroshilov forèrent un puissant nœud de magie sans savoir qu’il s’agissait du tombeau de Vhodhal. Les ouvriers sombrèrent dans la folie et la mine échoua, mais les Mages atteignirent une griffe du Fléau."
      ),
      lore(
        "Ils comprirent alors la fréquence des Wendigos et des morts inexplicables autour du site : la dépouille dévorait la vie à distance. La Loge locale renonça au pouvoir de la griffe et scella le tombeau."
      ),
      lore(
        "En 1907, les Voroshilov restés après la vente de l’Alaska purgèrent leurs pairs. Un intermédiaire du Fléau leur offrait des fragments de pouvoir en échange de Mageius consommés par la Famine Blanche. L’année suivante, Miluska Voroshilov dévora sa propre famille pour accroître encore ses dons."
      ),
      lore(
        "La Loge d’Anchorage donna à ces renégats le nom de Loge d’Écume. On ignore combien de véritables Mages la composent encore. Miluska reste sa présidente et la grande prêtresse de la Famine."
      )
    ]
  ),
  "cult-2-la-loge-d'ecume-fonctionnement": cultSection(
    "cult-2-la-loge-d'ecume-fonctionnement",
    "La Loge d’Écume — Fonctionnement",
    [
      lore(
        "Miluska seule entend la voix qui négocie au nom du « Chien des Fléaux ». Elle ignore l’identité de l’intermédiaire, mais le décrit comme intelligible, calme, logique et incapable de mentir. Les autres cultistes pensent que cette voix n’est qu’un symptôme de sa folie."
      ),
      lore(
        "Les sorciers de la Famine ne possèdent aucun répertoire stable. Un sacrifice accompli sur l’autel transmet au meurtrier, et parfois à un autre membre présent, un fragment aléatoire des dons de la victime. Hors de ce rite, tuer n’accorde rien."
      ),
      lore(
        "Ces cultistes restent faibles en puissance brute, mais portent sainement la Famine Blanche et peuvent la transmettre par contact. Les rares prêtres dotés d’un Mageius volent beaucoup plus efficacement les pouvoirs des Mages sacrifiés."
      )
    ]
  ),
  "cult-4-le-sang-d'ivoire-histoire": cultSection(
    "cult-4-le-sang-d'ivoire-histoire",
    "Le Sang d’Ivoire — Histoire",
    [
      lore(
        "Siadara rivalisait avec R’Gahanath : l’une participa à l’histoire des Wendigos, l’autre à celle des Vampires. Jalouse de la réussite d’Awan, Siadara tenta d’abord de corrompre les derniers Khinae immortels, mais ses sujets s’entretuèrent. Elle choisit alors d’altérer les Vampires eux-mêmes."
      ),
      lore(
        "La Famine Blanche transformait ces héritiers khinae en prédateurs brutaux, mais les Cours contenaient chaque épidémie. Siadara comprit qu’elle devait atteindre une lignée pure et visa le jeune époux d’une princesse Krovni, fille de Gahanath, dans l’espoir de toucher Hécate."
      ),
      lore(
        "Le plan échoua, mais le duc refusa la purification et trouva comment préserver sa conscience. Il devint le premier Sang d’Ivoire : un Vampire qui ne relève plus pleinement de sa Nature d’origine et doit se nourrir d’autres Vampires."
      )
    ]
  ),
  "cult-5-le-sang-d'ivoire-fonctionnement": cultSection(
    "cult-5-le-sang-d'ivoire-fonctionnement",
    "Le Sang d’Ivoire — Fonctionnement",
    [
      lore(
        "Le Sang d’Ivoire est à la fois un sang vampirique corrompu par Vhodhal et une faction appelée Elfenbeinblut. Née dans la Krovni, elle reproduit à petite échelle les hiérarchies des Cours et place un roi au sommet."
      ),
      lore(
        "Les recrues conservent le rang qu’elles avaient auparavant. La faction accueille donc peu de nobles durables, davantage de chevaliers, beaucoup de Moroï et plus encore de Strygoï issus de Vampires ayant régressé sous l’effet de la Famine Blanche."
      ),
      lore(
        "Sa reine est inerte : Xinya Ming, souveraine des Shì Hun Zhe, l’a décapitée et conserve sa tête. L’Elfenbeinblut protège le corps en espérant récupérer le crâne et la ramener à la vie."
      ),
      lore(
        "Les « Blafards » résistent mieux que les Vampires ordinaires mais contrôlent moins leurs instincts. Leurs pouvoirs peuvent dissiper ceux d’autrui au prix d’une grande souffrance, et leur corruption se transmet à de nombreuses espèces. Ils détruisent souvent les cadavres afin d’empêcher leurs victimes de se relever comme Wendigos."
      ),
      lore(
        "Seuls les membres expérimentés trouvent un projet durable dans cette condition. Beaucoup de recrues restent des parias qui ont dû choisir entre rejoindre la faction et mourir."
      )
    ]
  ),
  "lore-plagues-eden-gris-histoire": cultSection(
    "lore-plagues-eden-gris-histoire",
    "Histoire",
    [
      lore(
        "Au IVe siècle avant notre ère, des alchimistes chinois découvrirent la métastasismancie grâce à des billes de nacre noire. Les Mages de la Loge voisine purgèrent ces autodidactes, puis comprirent que les billes étaient les yeux d’Abominations."
      ),
      lore(
        "Am’Mleeac détruisit la Loge lorsqu’il apprit la mort de ses cultistes. Il choisit ensuite d’autres alchimistes et encouragea leurs recherches sur l’immortalité. Certaines traditions attribuent à l’Éden Gris des racines communes avec des courants qui nourrirent plus tard le taoïsme."
      ),
      lore(
        "Le culte suivit les savoirs alchimiques pendant des siècles. La proximité des Mages et des institutions religieuses provoqua de nombreuses purges sans le faire disparaître."
      ),
      lore(
        "Au XXe siècle, la science remplaça l’alchimie comme langage principal. Évolution, génétique et biologie renforcèrent la doctrine, tandis que le recul des religions classiques et l’essor de l’occultisme lui offrirent un nouvel âge d’or."
      )
    ]
  ),
  "lore-plagues-eden-gris-fonctionnement": cultSection(
    "lore-plagues-eden-gris-fonctionnement",
    "Fonctionnement",
    [
      lore(
        "Un grand maître dirige l’Éden Gris avec trois Éveillées, toujours des femmes. Chaque croyant doit accomplir sept actes de foi par an pendant sept ans avant de devenir Initié. Un manquement remet le cycle à zéro ; abandonner entraîne une exécution confiée à un proche resté fidèle."
      ),
      lore(
        "La secte ne demande pas d’argent. Ses prêtresses combinent alchimie et pouvoirs pour produire diamants, or ou terres rares. Cette autonomie finance une doctrine tournée vers l’évolution, l’espoir et la promesse d’un avenir meilleur."
      ),
      lore(
        "L’aide offerte aux personnes malades, perdues ou marginalisées rend le recrutement efficace. Le culte cache que son Éden Gris est l’Enfer de Lucifer où Vhadhi demeure prisonnière : les âmes promises y sont condamnées à changer, se diviser et se tordre sans fin."
      )
    ]
  ),
  "lore-plagues-mere-primordiale-histoire": cultSection(
    "lore-plagues-mere-primordiale-histoire",
    "Histoire",
    [
      lore(
        "Avant sa chute sur Terre, Shaoggith traversa la galaxie sous la forme d’un astre vivant aux innombrables tentacules. Ses écailles semaient des mutations. La doctrine de la Mère Primordiale lui attribue la dégénérescence d’une ancienne espèce reptilienne dont seraient issus les Mo’sen, Chez’zons et Xe’wens."
      ),
      lore(
        "Ces peuples peuvent encore connaître des cycles rapides de mutation, mais cette tradition ne prouve pas que chaque individu soit actuellement corrompu. Le culte transforme une mémoire biologique et religieuse en filiation sacrée."
      ),
      lore(
        "Pendant des millions d’années, des lignées reptiliennes cherchèrent instinctivement le tombeau de leur Mère jusqu’à identifier la Terre. Le culte agit à l’échelle galactique, mais sa force n’a pas d’égale sur ce monde. Il influence désormais certains projets climatiques mo’sens sans en révéler la cause. Li’Loth, qui a traversé plus de quatre Cycles de mutation, incarne cette continuité."
      )
    ]
  ),
  "lore-plagues-mere-primordiale-fonctionnement": cultSection(
    "lore-plagues-mere-primordiale-fonctionnement",
    "Fonctionnement",
    [
      lore(
        "Li’Loth dirige le culte avec neuf Maîtres des Abominations. Ces prêtres élèvent les créatures produites par Shaoggith ou son influence. Krerath, fille de Li’Loth et possible origine du mythe de Godzilla, reste leur monstre le plus redouté après les armes technologiques."
      ),
      lore(
        "Le recrutement vise surtout les Extrals. Le culte connaît l’existence des Dragons, même lorsque certains de ses membres doutent encore des Elyë ou des Whurtens, et cherche à intégrer ces créatures à son histoire sacrée."
      ),
      lore(
        "La Mère Primordiale considère les autres cultes de Fléaux comme des hérésies à détruire. Des Humains sont néanmoins recrutés puis progressivement mutés, afin de prouver que toute espèce peut rejoindre la prolifération de Shaoggith."
      )
    ]
  ),
  "lore-plagues-sombre-culte-histoire": cultSection(
    "lore-plagues-sombre-culte-histoire",
    "Histoire",
    [
      lore(
        "Les récits du Sombre Culte décrivent Thul parcourant l’espace pendant des millions d’années après une guerre entre Fléaux. Ils le présentent comme l’ennemi de la puissance qui engendra les Ombres wolféennes et attribuent à cette poursuite une part de l’histoire de V’Aagor. Cette cosmologie reste celle du culte."
      ),
      lore(
        "Thul cherche à figer le Temps, l’évolution et tout changement. Ses dons prennent donc souvent la forme d’une immortalité ou d’un savoir infini qui immobilise le bénéficiaire dans un état définitif. Sur chaque monde visité, ses graines auraient produit des Thuliens proches des Mollusques."
      ),
      lore(
        "Le culte naquit lorsque certaines de ces créatures reçurent l’intelligence. Selon ses archives, des vaisseaux azménoriens emportèrent ensuite des organismes microscopiques qui contribuèrent à l’apparition des ancêtres rocréens et d’autres peuples extrals. La résonance entre foyers terrestres et galactiques nourrit alors la Source malgré la chute répétée de ses empires."
      ),
      lore(
        "Sur Terre, le soulèvement de Mû commença à réveiller Thul. Depuis sa prison, il appelle ses anciens serviteurs et leurs descendants afin qu’ils le libèrent."
      )
    ]
  ),
  "lore-plagues-sombre-culte-fonctionnement": cultSection(
    "lore-plagues-sombre-culte-fonctionnement",
    "Fonctionnement",
    [
      lore(
        "Chaque foyer du Sombre Culte obéit à une Abomination majeure. Celle-ci confie à un ou plusieurs grands cultistes des rites, des sacrifices et une mission. Les fidèles, presque toujours humains au départ, sont progressivement métissés avec le peuple de leur maître."
      ),
      lore(
        "Les Thuliens recherchent notamment le sang royal des Atlantes. Ils veulent créer un héritier hybride, décrit comme leur Antéchrist, dont la nature permettrait d’ouvrir la prison de Thul. Les cultes restent autonomes mais partagent cette finalité."
      )
    ]
  )
};

const rewriteCultSection = (section: Record<string, any>): Section => {
  const id = String(section.id ?? "");
  const rewritten = CULT_SECTION_REWRITES[id];
  if (!rewritten) throw new Error(`Section de culte Fléau sans réécriture explicite: ${id}`);
  return rewritten;
};

export const COMPENDIUM_VERITE_FLEAUX_LORE_ARTICLES = COMPENDIUM_VERITE_FLEAUX_ARTICLES.map(
  (article) => ({
    ...article,
    sections: (article.sections ?? [])
      .filter((section: Record<string, any>) => !norm(section.title).includes("figures liees"))
      .map(rewriteCultSection)
  })
) as Array<Record<string, any>>;

const CONTEXTE_FLEAUX: Section = {
  id: "fleaux-focus-contexte",
  title: "Focus Fléaux — nature générale, hiérarchie et rapport au Néant",
  level: 2,
  blocks: [
    lore(
      "Les Fléaux sont les dieux des Abominations et les ennemis de toute continuité ordinaire. Leur influence peut commencer par des rêves, des voix, des absences ou une attirance impossible à repousser, bien avant qu’une mutation visible ne révèle la Source qui s’approche."
    ),
    lore(
      "Un Fléau Ancien est un agrégat déséquilibré d’énergie, de matière et de volontés issu de la guerre des Puissances Anciennes ou de ses conséquences. Aucun nouvel Ancien ne semble pouvoir apparaître aujourd’hui ; certains ont été détruits, d’autres demeurent endormis, scellés ou encore inconnus."
    ),
    lore(
      "Chaque Fléau est singulier et a pu changer profondément depuis son éveil. Leur puissance et leur savoir les rendent presque impossibles à distinguer des dieux pour un mortel, mais ils n’appartiennent pas à la même catégorie cosmologique. Sur Terre, l’action involontaire des Dieux Anciens contribua à leur réveil, puis à des guerres destinées à les tuer ou les enfermer."
    ),
    lore(
      "Les Fléaux supérieurs naissent d’un fragment, d’une convergence ou d’une conséquence devenue autonome. Le mot « enfant » décrit mal ces relations : créateur et création peuvent s’ignorer, se mépriser ou se combattre. Les Fléaux inférieurs, ou Abominations supérieures, sont des êtres conçus, transformés ou utilisés par ces puissances."
    ),
    lore(
      "Les pouvoirs accordés à un mortel ne sont jamais neutres. La corruption peut déchirer l’esprit, reconstruire le corps ou laisser une conscience intacte prisonnière d’actes qu’elle ne contrôle plus. Plus le don rapproche de la Source, plus l’identité propre devient difficile à préserver."
    ),
    lore(
      "Les Fléaux ne servent pas consciemment le Néant. Leur essence en provient toutefois assez pour que leurs créations tendent vers l’annihilation totale. Ils cherchent souvent à échapper à cette fin, tandis que les forces de la Création refusent de les accueillir par crainte de partager leur destin."
    )
  ]
};

const CORRUPTION_FLEAUX: Section = {
  id: "fleaux-focus-corruption",
  title: "Focus Fléaux — corruption des mortels et annihilation",
  level: 2,
  blocks: [
    lore(
      "Un don de Fléau altère toujours son porteur. L’effet peut d’abord ressembler à une guérison, une adaptation, une protection ou un pouvoir utile, mais il introduit la logique de la Source dans le corps, l’esprit ou les liens de la personne."
    ),
    lore(
      "Cette altération ne produit pas une forme unique. Un même Fléau peut provoquer des Ruptures différentes selon la Nature d’origine, le vecteur d’exposition, le culte et les dons déjà reçus. Détruire une Abomination ne détruit donc pas automatiquement la Source qui l’a rendue possible."
    ),
    lore(
      "À un stade avancé, le corps peut agir alors que l’esprit assiste impuissant à sa propre transformation ; ailleurs, la volonté elle-même se fragmente avant toute mutation visible. La puissance offerte ne constitue jamais la preuve que le bénéficiaire contrôle encore le lien."
    ),
    lore(
      "Les engeances des Fléaux tendent vers le Néant et l’annihilation, même lorsque leur Source cherche à l’éviter. Une purification doit donc viser l’exposition, la corruption et les objets souillés concernés ; elle ne réécrit pas rétroactivement l’histoire du porteur ni n’anéantit le Fléau."
    )
  ]
};

const DETAIL_SECTIONS: Record<string, Section> = {
  "fleaux-focus-mloxol-v'aagor": {
    id: "fleaux-focus-mloxol-v'aagor",
    title: "Dossier détaillé — Mloxol V’Aagor",
    level: 2,
    blocks: [
      lore(
        "Le titre de « Roi des Fléaux » ne décrit pas une monarchie. Mloxol V’Aagor ne commanda qu’à trois autres Fléaux majeurs, dont Ux’Sharith, qu’il contraignait sans dominer réellement sa volonté. Les Dieux employaient surtout ce nom pour désigner l’une des puissances les plus ambitieuses et dangereuses de leur époque."
      ),
      lore(
        "Sa forme première ressemblait à une masse de matière noire ou de pétrole bouillonnant, sans yeux ni bouche. Elle pouvait devenir fluide, se durcir comme le diamant, ramper sur les parois et assimiler ce qu’elle recouvrait. Toute ombre projetée par sa masse devenait une extension de son corps ; ses fragments finissaient pourtant par fusionner de nouveau."
      ),
      lore(
        "Son alliance avec Sharith associait l’Unité à la Division. Après que Lilith eut fait découvrir les plaisirs charnels à Sharith, Mloxol s’unit lui aussi à elle ; contrairement à la Reine, il ne perdait aucune puissance en engendrant. Les traditions lui attribuent parfois l’origine des Deimons, la corruption des Khinae à l’origine des Vampires ou un lien avec les Effismes terrestres. Ces rapprochements sont des hypothèses de cultes et d’érudits, pas des filiations toutes établies."
      ),
      lore(
        "Belial et Lucifer l’enfermèrent dans une prison de feu et de lumière où son existence ne pouvait se manifester. Tant que le sceau tient, Mloxol est à la fois contenu et nécessairement présent pour que la prison conserve un objet. Ses fragments subsistent ailleurs comme des entités partiellement autonomes ; l’Ombre-Pape cherche ainsi son retour sans être Mloxol lui-même."
      ),
      lore(
        "Gabrielle tenta déjà d’employer cette essence et fit corrompre un Ange plutôt que de s’y exposer elle-même. V’Aagor parle encore à certains cultistes et aurait annoncé un retour lié à Ux’Sharith. Rien ne prouve que celle-ci partage ce projet, ni si le Fléau compte obtenir son aide par accord ou par contrainte."
      )
    ]
  },
  "fleaux-focus-ux'sharith-bellatheis": {
    id: "fleaux-focus-ux'sharith-bellatheis",
    title: "Dossier détaillé — Ux’Sharith Bellatheis",
    level: 2,
    blocks: [
      lore(
        "Ux’Sharith atteignit la Terre après la guerre des légions. Elle décomposait lumière et magie comme un prisme brise une unité en composantes distinctes. Elle commandait à Vhodhal’nact’ru et C’Thath Vhadhi, mais restait elle-même soumise par la force à Mloxol V’Aagor, dont elle constituait le complément naturel."
      ),
      lore(
        "Aucun Dieu ne parvenait à la vaincre directement. Lilith se présenta donc comme une servante et lui façonna un corps humain. Sharith s’attacha à elle, adopta ce corps et engendra d’innombrables créatures ; chaque naissance emporta une part de sa puissance jusqu’à ce que l’enveloppe offerte devienne une prison."
      ),
      lore(
        "Lorsque Lilith la tua et voulut emporter son esprit, Sharith fragmenta sa propre âme entre ses descendantes. Celles-ci se dispersèrent puis multiplièrent encore les lignées susceptibles d’abriter une part du Fléau. Cette survie par division explique que la destruction d’une incarnation ne suffise pas à effacer toute son essence."
      ),
      lore(
        "En 2020, Alisa Svalisdottir révéla l’esprit de Sharith pendant un tournoi de l’Académie. Elle absorba les pouvoirs des Psycolors présentes, détruisit l’ordre des Saintes Lagunes puis pourchassa les sorcières de cette lignée, dont elle ne conserva qu’un petit nombre."
      ),
      lore(
        "Marquée par la trahison de Lilith, l’incarnation actuelle refuse de reprendre simplement son ancienne place. Elle se pense l’égale d’Elynea ou de Belial et cherche à purger les Fléaux, en priorité V’Aagor. Elle perçoit néanmoins la souffrance de son ancien allié et soupçonne que son appel annonce un plan plutôt qu’une simple agonie."
      )
    ]
  },
  "fleaux-focus-vhodhal'nact'ru": {
    id: "fleaux-focus-vhodhal'nact'ru",
    title: "Dossier détaillé — Vhodhal’nact’ru",
    level: 2,
    blocks: [
      lore(
        "Vhodhal est la Famine véritable, issue du Chaos et du Néant. Elle dévore l’animé comme l’inanimé, la matière, l’énergie et jusqu’aux phénomènes immatériels qu’elle parvient à percevoir. Malgré une intelligence immense, elle fut la plus bestiale des grandes Sources terrestres."
      ),
      table([
        ["Regard", "Ce qu’il perçoit"],
        ["Forme", "Les structures physiques."],
        ["Temps", "La trame temporelle."],
        ["Énergie", "Les forces et flux."],
        ["Volonté", "L’intention et la conscience."]
      ]),
      lore(
        "Vhodhal ne concentre pleinement qu’un regard à la fois ; ce qu’il comprend devient alors un repas possible. Ux’Sharith seule savait interrompre ses chasses et la nourrissait de sa propre énergie. Le nom Vhodhal’nact signifie ainsi « Chien de la Reine » dans la langue des Fléaux terrestres."
      ),
      lore(
        "Sa Famine liquide contamine les victimes, qui produisent un mucus blanc et collant capable de dissoudre pierre ou acier après évaporation de son eau. Ses engeances ressemblent à des limaces munies de tentacules et d’un bec tranchant ; elles sécrètent le même mucus. Une odeur d’ozone et de soufre annonçait l’arrivée du Fléau à plusieurs kilomètres."
      ),
      lore(
        "À l’apogée d’Ux’Sharith, quelques groupes honoraient Vhodhal comme un sous-culte de la Reine plutôt que comme une puissance indépendante. Le Fléau servait alors à dévorer les ennemis que ses alliés jugeaient sans valeur."
      ),
      lore(
        "Mammon tua Vhodhal avec l’aide de Rae’kath. Le Fléau dévorait sa propre mort puis la trame où elle survenait ; Mammon dut donc répéter l’acte jusqu’à ce que la Vala’eraï stabilise le temps. Son immense dépouille demeure au nord de l’Alaska et les premiers Wendigos seraient nés de ce vestige."
      )
    ]
  },
  "fleaux-focus-c'thath-vhadhi": {
    id: "fleaux-focus-c'thath-vhadhi",
    title: "Dossier détaillé — C’Thath Vhadhi",
    level: 2,
    blocks: [
      lore(
        "C’Thath Vhadhi était la plus discrète des quatre Sources alliées et restait soumise à Mloxol V’Aagor. Née des entrelacs de causalité, elle s’éveilla lorsque les Dieux structurèrent leurs forces. Son corps gigantesque éventra la croûte terrestre : un amas de fibres et de racines plus longues qu’une montagne, dominé par un petit buste au visage bleu et sans émotion."
      ),
      lore(
        "Tout ce qu’elle regarde peut recevoir une autre fonction. Vhadhi ne commande pas au destin et ne poursuit aucun grand dessein : elle mêle buts, usages et causalités de façon anarchique. Ses « Attributs flottants » peuvent se greffer à un être, jusqu’à changer la nature d’un Dieu ou lui imposer une fonction dérisoire et humiliante."
      ),
      lore(
        "Elle semblait moins menaçante pour les mortels que les Sources ouvertement destructrices, mais représentait un danger extrême pour les Dieux liés à leurs Attributs. Son culte promettait une nouvelle vie en échange d’un sacrifice suffisant ; la personnalité et les dons du bénéficiaire changeaient avec la fonction reçue."
      ),
      lore(
        "Elynea affronta Vhadhi après l’installation du Paradis. Le Fléau la réduisit successivement à des états mortels, malades ou méprisables, mais ne sut pas la tuer autrement qu’en lui réassignant une nature. Elynea refusa de fuir et finit par l’enfermer dans l’Enfer de Lucifer, ajoutant cette prison à l’humiliation de l’ancien dieu de la Lumière."
      )
    ]
  },
  "fleaux-focus-gajh'-shaoggith": {
    id: "fleaux-focus-gajh'-shaoggith",
    title: "Dossier détaillé — Gajh’Shaoggith",
    level: 2,
    blocks: [
      lore(
        "Gajh’Shaoggith resta indépendante de Mloxol comme d’Ux’Sharith. Sa forme habituelle était une hydre impossible à orienter : une sphère titanesque de tentacules dont les extrémités portaient des têtes reptiliennes. Chaque écaille, dent ou lambeau abandonné dans une crevasse pouvait commencer à vivre."
      ),
      lore(
        "Ses hordes proliférantes en firent le premier Fléau que les Dieux cherchèrent réellement à anéantir. Belial, Abigor et Alabor unirent leurs forces pour la noyer, l’ensevelir puis fondre la pierre sur elle. Cette défaite ne fut pas définitive : Shaoggith se réveilla bien plus tard en Mésopotamie."
      ),
      lore(
        "Elle prit la forme d’une dragonne pour être fécondée par l’ancien dragon Shorolth. Les créatures nées de cette union inspirèrent le mythe de Tiamat. Baal, Michael puis Caïn tentèrent de l’abattre ; après la dévoration du prince, le Dieu et l’Archange durent s’allier."
      ),
      lore(
        "Un Nephilim, fils de Michael, fut créé pour garder sa dépouille. Ses descendants donnèrent la lignée de Georges de Lydda, spécialisée dans la traque des Enfants de Tiamat. Shaoggith ne fut pourtant que démembrée, jamais totalement tuée."
      ),
      lore(
        "Son esprit possède désormais une enveloppe humaine mais ne peut rejoindre directement ses restes. Il cherche à fusionner avec Tiamandra Vecellio, porteuse de Nahfr, l’armure occulte façonnée à partir du corps du Fléau."
      )
    ]
  },
  "fleaux-focus-k'thuhuth'lul": {
    id: "fleaux-focus-k'thuhuth'lul",
    title: "Dossier détaillé — K’thuhuth’lul / Thul",
    level: 2,
    blocks: [
      lore(
        "K’thuhuth’lul, ou Thul, se forma hors de la Terre. Des Rocréens primitifs l’arrachèrent à sa dimension plusieurs centaines de millions d’années auparavant. Sa présence radioactive et mutagène crée des formes de vie souvent difformes, tue à distance et peut provoquer la folie avant même qu’une victime ne voie ou ne comprenne ce qui l’approche."
      ),
      lore(
        "Thul fut le grand rival de V’Aagor. L’un de leurs affrontements poussa les Dieux à engager véritablement la guerre contre les Fléaux. Alabor devint son adversaire principal, car le titan altérait l’eau, les éléments et jusqu’aux atomes."
      ),
      lore(
        "Entre 380 et 360 millions d’années avant 2035, Alabor provoqua assèchements et inondations pour purger les créations de Thul ; le dossier attribue ainsi au conflit une part de l’extinction du Dévonien. Les esprits aquatiques se divisèrent : certains suivirent Alabor, comme Amphitrite, tandis que d’autres furent corrompus ou dévorés."
      ),
      lore(
        "Thul fut finalement enfermé sous la capitale de Mû, cité fondée par ses serviteurs bien avant les civilisations humaines. Les Atlantes s’emparèrent plus tard du continent et de ses villes sous-marines, puis découvrirent trop tard le tombeau placé sous le palais du roi Kyriak. La prison est désormais exposée, mais le Fléau y dort encore."
      ),
      lore(
        "R’Lyeh est une déformation littéraire : le lieu véritable est Mû. Dans son sommeil, Thul projette images et récits vers les esprits réceptifs. H. P. Lovecraft fut l’Humain qui reçut le plus nettement ces visions sans disposer des clés nécessaires pour les interpréter comme une archive exacte."
      )
    ]
  }
};

const PERE_OMBRE: Section = {
  id: "fleaux-focus-pere-ombre",
  title: "Le Père de l’Ombre — histoire et fonctionnement",
  level: 2,
  blocks: [
    lore(
      "Delanial tenta d’instruire les Voyageurs afin qu’ils ne soutiennent pas les Dieux. Les connaissances transmises furent plus tard retournées contre eux. Les Dives bâtirent alors le culte du Démiurge obscur, ou Père de l’Ombre, bientôt adopté par d’autres Ombres et par des Deimons refusant les Dieux Anciens."
    ),
    lore(
      "Delanial voulut juguler ce culte en éliminant certaines Ombres qui le vénéraient. Chaque purge renforça pourtant la colère de leurs semblables contre les Dieux et donna au récit de persécution de nouveaux martyrs. Le culte grandit donc précisément parce que son objet refusait d’être adoré."
    ),
    lore(
      "Aucune autorité n’unifie cette croyance. Certains Vampires revenus de l’Ombre-Monde identifient Delanial à Arawn, père des Vampires ; des Vala’eraï ou des Atlantes voient dans le « vieux solitaire » le Créateur ou le Démiurge. Ces interprétations ne changent pas sa véritable classification : Delanial n’est pas un Fléau."
    )
  ]
};

export const COMPENDIUM_VERITE_FLEAUX_LORE_ENRICHMENTS = COMPENDIUM_VERITE_FLEAUX_ENRICHMENTS.flatMap(
  (enrichment) => {
    const sectionId = String(enrichment.section?.id ?? "");
    if (sectionId === "fleaux-focus-delanial") return [];
    if (sectionId === CONTEXTE_FLEAUX.id) return [{ ...enrichment, section: CONTEXTE_FLEAUX }];
    if (sectionId === CORRUPTION_FLEAUX.id) return [{ ...enrichment, section: CORRUPTION_FLEAUX }];
    if (sectionId === PERE_OMBRE.id) return [{ ...enrichment, section: PERE_OMBRE }];
    if (DETAIL_SECTIONS[sectionId]) return [{ ...enrichment, section: DETAIL_SECTIONS[sectionId] }];
    return [enrichment];
  }
) as Array<Record<string, any>>;
