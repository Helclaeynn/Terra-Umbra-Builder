import { COMPENDIUM_SHI_QI_ARTICLES } from "./compendium-shi-qi.js";

type Block =
  | { type: "p"; text: string; style?: string }
  | { type: "table"; rows: string[][] };

const lore = (text: string): Block => ({ type: "p", style: "lore", text });
const table = (rows: string[][]): Block => ({ type: "table", rows });

const SECTION_BLOCKS: Record<string, Record<string, Block[]>> = {
  "verite-clan-shi-taoisme-veritable": {
    histoire: [
      lore(
        "La Cour vampirique Shì Hun Zhe cherchait à s’affranchir des limites du vampirisme. L’impératrice Xinya finança donc des penseurs et des maîtres spirituels qui apprirent d’abord à renforcer le Yang des vampires. Cette énergie continuant à les blesser, leurs recherches s’orientèrent vers l’annulation des contraintes et des pouvoirs vampiriques afin de permettre une véritable renaissance."
      ),
      lore(
        "Shi Xuyan fonda ainsi le Taoïsme véritable. Il croyait combattre les vampires en annihilant leurs pouvoirs, alors que ses travaux pouvaient en réalité conduire à leur immunité. Son épouse Shi Xin, qui était elle-même vampire, le tua pour s’en emparer. La tradition ne tranche pas entre deux identités : Xin pouvait être Xinya ou l’une de ses servantes."
      ),
      lore(
        "Gu Lan, premier disciple de Xuyan, sauva deux des sept enfants du fondateur et une partie de ses travaux. Il forma la fille aînée, l’épousa, puis ils enseignèrent ensemble au plus jeune fils. La famille centrale Shi descend de ce fils ; les Gu, issus de Gu Lan et de la fille aînée, devinrent l’aile orientale du clan."
      ),
      lore(
        "Les cinq familles essaimèrent ensuite dans des directions différentes. Les Gu gagnèrent la Corée et le Japon, où apparurent notamment les Shimazu, Shiba, Shinoda, Shinaga et Togoshi. Les Laodong descendirent vers le Cambodge, le Vietnam et l’Indonésie ; les Zhan progressèrent jusqu’au Moyen-Orient avant de devenir plus secrets ; les Xiong s’établirent en Mongolie et en Russie. Les Shi demeurèrent au centre de l’ancien espace impérial."
      ),
      table([
        ["Branche", "Direction", "Symbole"],
        ["Shi", "Centre", "Kirin"],
        ["Gu", "Est", "Dragon azur"],
        ["Laodong", "Sud", "Oiseau vermillon"],
        ["Zhan", "Ouest", "Tigre blanc"],
        ["Xiong", "Nord", "Tortue noire"]
      ]),
      lore(
        "Pendant plus d’un millénaire, ce Grand Clan de chasseurs survécut malgré des pouvoirs politiques régulièrement tenus par les vampires. Xinya l’épargna largement, car elle le considérait comme un instrument utile. Les familles restaient inféodées aux Shi véritables, mais leurs ramifications se percevaient aussi comme des clans à part entière et revendiquaient une égale légitimité."
      ),
      lore(
        "En 1220, l’Alliance martiale rassembla les principaux clans chinois afin d’écraser les écoles dérivées non chinoises, puis voulut absorber les Shi. Ses grands maîtres sous-estimèrent Shi Xiaren parce qu’une femme dirigeait le clan. Elle obtint deux années de préparation et les employa à réunir les cinq familles et leurs branches dispersées dans le monde."
      ),
      lore(
        "La première guerre des Maîtres prit la forme d’un tournoi : 448 maîtres Shi affrontèrent 51 grands maîtres de l’Alliance. Les Shi conservèrent leur indépendance et l’Alliance abandonna sa politique de destruction au profit de l’intégration. Ce changement affaiblit pourtant les Shi, car de nombreuses petites branches éloignées rejoignirent progressivement l’Alliance."
      ),
      lore(
        "À l’époque moderne, l’Alliance acheta aux gouvernements la possibilité de poursuivre combats à mort, entraînements fondés sur la torture, vendettas et affrontements extrajudiciaires. Les Shi refusèrent ces arrangements et remportèrent une nouvelle guerre des Maîtres, mais leur clan très diminué dut finalement accepter un accord politique. Celui-ci le protégea en partie de l’Alliance et de nouveaux rivaux, dont les Ryong de Corée."
      ),
      lore(
        "En 2035, l’éveil du Grand Traqueur acheva de déchirer le clan. Les Shi croyaient que seul l’héritier véritable, désigné ou élu, pourrait vaincre cette entité ennemie des Taoïstes. Ils cherchèrent cet héritier par des duels à mort entre parents, persuadés que le survivant éveillerait les pouvoirs nécessaires. Le massacre détruisit ce qui restait de leur ancienne puissance."
      )
    ]
  },
  "verite-clan-shi-cinq-familles": {
    structure: [
      lore(
        "Les cinq familles forment un même Grand Clan, mais leurs dirigeants, leurs branches et leurs interprétations du Taoïsme véritable entretiennent de fortes rivalités. Shi Wei dirige désormais le Clan Shi ; Xuegang appartient à l’état antérieur de la famille centrale et n’en est plus le maître actuel."
      ),
      table([
        ["Famille", "Direction", "Situation"],
        ["YuánShí shì — centre", "Shi Wei ; Xuegang, ancien grand maître central", "Famille centrale, associée au Kirin mais utilisant surtout le symbole du Taoïsme"],
        ["Dōng Gù shì — Est", "Gu Jin", "Vieux maître tacticien dont plusieurs branches japonaises contestent ou ignorent l’autorité"],
        ["Xī Zhān shì — Ouest", "Zhan Zheon-ju", "Chef agressif qui supporte mal la prééminence de la famille centrale"],
        ["Nán láodòng shì — Sud", "Laodong Zexi", "Maîtresse rigoureuse à la tête de nombreuses petites lignées de chasseurs d’Asie du Sud"],
        ["Běi Xióng shì — Nord", "Xiong Chun", "Jeune chasseuse froide et méthodique, redoutable assassine vouée à la traque"]
      ]),
      lore(
        "Les Gu se considèrent comme les descendants légitimes de Gu Lan et de la fille aînée de Shi Xuyan. Plusieurs sous-clans japonais portent toutefois « Shi » dans leur nom et se rattachent directement à la famille centrale plutôt qu’aux Gu, ce qui complique l’autorité de Gu Jin."
      ),
      lore(
        "Les Zhan restèrent majoritairement en Chine après avoir été repoussés dans leur expansion occidentale. Ils comptent peu de sous-clans, mais leurs mariages avec la famille centrale furent nombreux et certains de leurs membres adoptèrent le nom Shi. Cette proximité nourrit autant leur ambition que leur ressentiment."
      ),
      lore(
        "Laodong Zexi cache sous une attitude chaleureuse et séductrice une discipline martiale inflexible. Elle se crut autrefois l’Élue, jusqu’à frôler la mort face à Xuegang. Son ancien mari Lu Shun siège parmi les treize grands maîtres du Haut Conseil de l’Alliance martiale ; leur hostilité demeure mêlée d’attirance."
      ),
      lore(
        "Xiong Chun consacre sa vie à la chasse. Sa grande taille et sa carrure nourrissent chez elle une relation difficile à sa propre féminité : elle jalouse autant qu’elle admire les femmes plus fines. Cette insécurité ne diminue ni sa précision ni son efficacité d’assassine."
      ),
      table([
        ["Famille", "Spécialité du Taoïsme véritable"],
        ["Shi", "Maîtrise du Vide et absorption des énergies ennemies"],
        ["Gu", "Équilibre du Qi, du Yin, du Yang, du Vide et de la vie"],
        ["Zhan", "Arrachement offensif du Yin ou du Yang, provoquant un déséquilibre comparable à un choc thermique et une hémorragie vitale"],
        ["Laodong", "Restructuration spirituelle du corps, pour l’améliorer ou le dégrader, associée à un art martial très violent"],
        ["Xiong", "Perception, traque et pièges énergétiques à longue portée ; plus rarement, bombes d’énergie"]
      ]),
      lore(
        "Les sous-clans ont souvent abandonné une partie de la doctrine familiale. Leurs techniques témoignent moins d’une école uniforme que d’adaptations successives à d’autres cultures, ennemis ou héritages surnaturels."
      ),
      table([
        ["Sous-clan", "Évolution"],
        ["Shinoda", "Sur Yakushima, alliance avec un puissant Deimon et transmission de son sang ; maîtrise du Yin des Yokai. Ralliement à l’Alliance en 1592 pour échapper au jugement des Gu, puis oubli progressif de leur filiation."],
        ["Shiung", "En Corée, conservation des arts du Vide par contact. La paume Shiung anéantit progressivement ce qu’elle touche ; le clan est devenu une lignée d’assassins sans fonction religieuse ou chasseuse."],
        ["Krushienmayer", "Famille allemande issue de lointains ancêtres Zhan. Ces chasseurs non taoïstes déséquilibrent leur propre énergie vitale et résistent ainsi aux manipulations et aux enchantements."]
      ])
    ]
  },
  "verite-qi-yin-yang-vide": {
    taoisme: [
      lore(
        "Les Taoïstes véritables sont des chasseurs liés de près ou de loin au Clan Shi. Comme les pratiquants de l’Alliance, ils commencent par produire du Qi, puis le teintent d’une essence lumineuse, le Yang, ou ténébreuse, le Yin. Cette étape supplémentaire les rend généralement plus lents que les artistes martiaux de l’Alliance."
      ),
      lore(
        "Chaque unité de Qi devient une unité de Yin ou de Yang. Tant qu’elle n’est pas détruite, cette unité teintée demeure dans le corps : elle peut encore être employée sans coût de Qi, mais elle gêne la production de l’essence opposée. Après avoir transformé 1 Qi en 1 Yang, il faut ainsi 2 Qi pour produire 2 Yin, dont un annulera le Yang résiduel."
      ),
      lore(
        "Les Taoïstes possèdent leur propre Charte, consacrée à la transformation des essences. Ils connaissent celle de l’Alliance, mais peuvent en contourner les principes parce qu’ils emploient moins souvent le Qi sous sa forme neutre."
      ),
      table([
        ["Essence", "Manifestations courantes"],
        ["Yin", "Froid, ombre, furtivité, charme féminin et vision nocturne"],
        ["Yang", "Chaleur, lumière, bruit, charme masculin et résistance au sommeil"]
      ]),
      lore(
        "Le Yin et le Yang ne sont stockés ni dans les Dantian ni dans les méridiens. Les techniques qui visent les portes, les centres ou les méridiens ne peuvent donc pas neutraliser directement ces réserves ; les deux essences peuvent même réparer les blessures infligées à ces structures."
      ),
      lore(
        "Chaque seuil atteint dans une essence confère des facultés qui rapprochent le pratiquant d’une créature inhumaine. Au-delà du deuxième seuil, ni le Yin ni le Yang ne sont naturels pour un corps humain : les transformations peuvent alors l’endommager selon les mêmes principes que les créatures surnaturelles."
      ),
      lore(
        "Des techniques de segmentation ou de rotation permettent de garder simultanément du Yin et du Yang sans les laisser s’annuler. Une unité de Qi sert alors à maintenir leur séparation dans le corps."
      ),
      lore(
        "Le Taoïsme véritable ajoute le Vide : lorsqu’une unité de Yin et une unité de Yang opposées se détruisent dans le corps du pratiquant, elles peuvent produire deux unités de Xuwu. Les maîtres ordinaires n’en tirent rien, puisque ce Vide n’est, par nature, rien."
      ),
      lore(
        "Les grands maîtres Shi peuvent employer une unité de Xuwu à la place d’une unité de Qi pour détruire le Qi, le Yin ou le Yang d’un adversaire et lui infliger des dégâts vitaux. Le Vide ne se stocke pas : s’il ne trouve plus de Qi, il dévore d’abord les excédents résiduels de Yin ou de Yang, puis attaque le corps de son utilisateur."
      ),
      lore(
        "Les Shi utilisent aussi le Vide pour séparer le Yin du Yang sans annulation. Ils peuvent ainsi entretenir des réserves beaucoup plus importantes d’une essence, au prix d’une grande quantité de Xuwu interne et de blessures différées. Seuls les grands maîtres des familles Shi manient réellement le Vide ; la famille centrale et surtout l’Élue Shi Wei en possèdent la maîtrise la plus complète."
      )
    ]
  },
  "verite-qi-shinoda-pouvoir-oni": {
    heritage: [
      lore(
        "Les Shinoda descendent des branches Shi orientales parties au Japon, puis ont oublié leurs origines. Leur doctrine privilégia le déséquilibre : ils abandonnèrent le Yang, plus rare, pour se consacrer au Yin. Incapables de vaincre les Oni — des Deimons — de l’île de Yakushima, ils devinrent leurs disciples et mêlèrent leur sang au leur. Leurs descendants sont des Ombres-humaines dont le Taoïsme a perdu la moitié de son essence."
      ),
      lore(
        "Leur héritage deimoniaque leur permet d’absorber et de transcender le Yin sans devenir plus inhumains qu’ils ne le sont de naissance. Le Pouvoir de l’Oni s’active à chaque seuil de Yin franchi, avec des effets plus stables que chez les Taoïstes ordinaires. Leur art martial s’est entièrement adapté à ces facultés et se montre particulièrement efficace chez les femmes du clan."
      ),
      lore(
        "Les Shinoda ont conservé la Charte taoïste, mais leur méditation génère nativement du Yin plutôt que du Qi. Pour employer une technique classique, ils doivent purifier cette énergie en Qi neutre. Ils ne peuvent pas aller plus loin jusqu’au Yang sans mettre leur corps en danger. Cette conversion immédiate vers le Yin leur donne une vitesse redoutable, même si le Yang d’un Taoïste reste pour eux une menace majeure."
      ),
      lore(
        "Chaque tour où un Shinoda utilise du Yin sans produire de Qi, chaque blessure reçue sans réserve de Qi et chaque changement d’état de santé le font avancer d’un seuil vers l’Oni. Cette progression ne régresse pas pendant un combat : il doit gagner ou fuir, puis accomplir une longue méditation. Les transformations finissent par disparaître, mais peuvent laisser durablement une corne ou une altération de la peau et des yeux."
      ),
      lore(
        "Alors qu’un artiste martial ne restaure habituellement son Qi en combat qu’en éveillant un centre, le Shinoda peut puiser l’énergie ténébreuse d’un adversaire lié au Yin ou aux ténèbres, notamment un Taoïste, un vampire ou un Deimon."
      ),
      lore(
        "Au-delà du septième seuil, le Shinoda perd l’esprit et atteint une puissance comparable à celle d’un Deimon médian ou supérieur. L’un de ses ancêtres peut alors le posséder et chercher à conserver définitivement ce corps."
      )
    ]
  }
};

export const COMPENDIUM_SHI_QI_EDITORIAL_ARTICLES = COMPENDIUM_SHI_QI_ARTICLES.map((article) => {
  const replacements = SECTION_BLOCKS[String(article.id)];
  if (!replacements) return article;

  return {
    ...article,
    sections: (article.sections ?? []).map((section: Record<string, any>) => {
      const blocks = replacements[String(section.id)];
      return blocks ? { ...section, blocks } : section;
    })
  };
}) as Array<Record<string, any>>;
