import {
  COMPENDIUM_REALITE_V9_AGENCIES_HUB,
  COMPENDIUM_REALITE_V9_AGENCIES_ARTICLES
} from "./compendium-realite-v9-agencies.js";
import {
  COMPENDIUM_REALITE_V9_GOVERNMENT_HUB_SECTIONS,
  COMPENDIUM_REALITE_V9_GOVERNMENT_ARTICLES
} from "./compendium-realite-v9-government.js";
import {
  COMPENDIUM_REALITE_V9_CRAWLERS_HUB_SECTIONS,
  COMPENDIUM_REALITE_V9_CRAWLERS_ARTICLE_ENRICHMENTS
} from "./compendium-realite-v9-crawlers.js";
import {
  COMPENDIUM_VERITE_ANGELUS_ARTICLES,
  COMPENDIUM_VERITE_ANGELUS_ENRICHMENTS
} from "./compendium-verite-angelus-source.js";
import { COMPENDIUM_VERITE_LOGES_MAGES_HUB_SECTIONS } from "./compendium-verite-loges-mages.js";

const TEXT_REWRITES = new Map<string, string>([
  [
    "Le quatrième cercle entretient des listes de continuité politique : la source mentionne vingt-cinq profils susceptibles de succéder à Dina Page et dix scénarios de formation ou de vie pour chacun. Le protocole affirme ne pas choisir le futur président mais s’assurer que plusieurs profils compétents restent effectivement présidentiables.",
    "Le quatrième cercle entretient des listes de continuité politique : vingt-cinq profils sont susceptibles de succéder à Dina Page, avec dix scénarios de formation ou de vie pour chacun. Le protocole ne choisit pas le futur président ; il veille à ce que plusieurs profils compétents restent effectivement présidentiables."
  ],
  [
    "La source assume aussi des contacts avec des organisations mafieuses dont une partie des activités est devenue légale. Ces relations facilitent le renseignement et l’infiltration, sans rendre légales les activités criminelles poursuivies.",
    "Le CBII entretient aussi des contacts avec des organisations mafieuses dont une partie des activités est devenue légale. Ces relations facilitent le renseignement et l’infiltration, sans rendre légales les activités criminelles poursuivies."
  ],
  [
    "La source décrit des infiltrations spécifiques dans les cartels pour les drogues, les motards pour les armes et les Crawlers pour les augmentations illégales.",
    "Des agents spécialisés infiltrent les cartels pour les drogues, les motards pour les armes et les Crawlers pour les augmentations illégales."
  ],
  [
    "Dans cette source, l’ATF subsiste sous le contrôle d’un comité de corporations, notamment Raven, Owl et Phoenix, avec une participation résiduelle du gouvernement américain. Le CPP la considère comme un acteur défendant davantage un monopole industriel qu’une politique publique de lutte contre les armes.",
    "L’ATF subsiste sous le contrôle d’un comité de corporations, notamment Raven, Owl et Phoenix, avec une participation résiduelle du gouvernement américain. Le CPP la considère comme un acteur défendant davantage un monopole industriel qu’une politique publique de lutte contre les armes."
  ],
  [
    "Le document Agences présente Tasunke comme directeur de l’INATA. La source Gouvernement, plus récente dans le corpus, donne cependant Ikasha — anciennement Tashca — comme directrice actuelle. Cette dernière information prévaut pour l’état du monde en 2035.",
    "Tasunke a dirigé l’INATA dans une organisation antérieure. En 2035, Ikasha — anciennement Tashca — en assure la direction."
  ],
  [
    "La biographie de Tasunke reste conservée comme trajectoire d’un ancien ou autre cadre de l’INATA ; sa fonction de directeur n’est simplement plus présentée comme actuelle.",
    "Tasunke demeure une figure de l’INATA, mais n’en exerce plus la direction en 2035."
  ],
  [
    "Le NRMD n’est pas repris parmi les dix directions d’agences du cabinet dans la source Gouvernement plus récente, mais aucune source ne signale sa suppression. Il reste donc intégré comme structure spécialisée de gestion et de contrôle des ressources.",
    "Le NRMD ne figure pas parmi les dix directions d’agences du cabinet en 2035. Il demeure toutefois une structure spécialisée de gestion et de contrôle des ressources."
  ],
  [
    "L’EIO contrôle et analyse aussi bien les établissements publics que les écoles corporatives ou associatives. La source cite notamment l’EAEM et le Hopes Center parmi les acteurs avec lesquels il travaille.",
    "L’EIO contrôle et analyse aussi bien les établissements publics que les écoles corporatives ou associatives. Il travaille notamment avec l’EAEM et le Hopes Center."
  ],
  [
    "Le présent document décrit le Corporate Standards Control Office (CSCO), surnommé « Cisco ». La source Gouvernement plus récente emploie désormais CSC — California Standards Control Branch — et donne Seul-Ki Kae comme direction actuelle.",
    "Le Corporate Standards Control Office (CSCO), surnommé « Cisco », a précédé l’actuelle California Standards Control Branch (CSC), dirigée en 2035 par Seul-Ki Kae."
  ],
  [
    "Les méthodes et missions compatibles du CSCO sont conservées ici comme base de fonctionnement du CSC ; Gavin Clay et Luna Eckelberg restent des figures historiques ou cadres documentés sans être présentés comme la direction actuelle.",
    "Le CSC a hérité des méthodes et missions compatibles du CSCO. Gavin Clay et Luna Eckelberg appartiennent à son histoire ou à ses cadres, mais n’en assurent pas la direction actuelle."
  ],
  [
    "Les contrôles peuvent déboucher sur amendes, arrestations de cadres et enquêtes croisées. La source signale que certaines corporations font assassiner des inspecteurs, souvent par intermédiaires, afin de gagner du temps pour dissimuler les défauts de conformité.",
    "Les contrôles peuvent déboucher sur des amendes, des arrestations de cadres et des enquêtes croisées. Certaines corporations font assassiner des inspecteurs, souvent par des intermédiaires, afin de gagner du temps pour dissimuler leurs défauts de conformité."
  ],
  [
    "La source décrit également les CyberKnights et les Black Cyclops comme partenaires opérationnels de certaines interventions.",
    "Les CyberKnights et les Black Cyclops participent comme partenaires opérationnels à certaines interventions."
  ],
  [
    "La STAB est née en Californie mais la source la présente comme devenue une structure à vocation mondiale. Cette extension ne lui donne toutefois pas autorité automatique sur les technologies qui ne sont ni commercialisées ni introduites sur le territoire californien.",
    "La STAB est née en Californie avant de devenir une structure à vocation mondiale. Cette extension ne lui donne toutefois pas autorité automatique sur les technologies qui ne sont ni commercialisées ni introduites sur le territoire californien."
  ],
  [
    "Cette liste reprend la source Gouvernement plus récente lorsqu’elle contredit le présent document. Le document Agences apporte cependant le fonctionnement détaillé des structures qu’il décrit.",
    "En 2035, le cabinet emploie les dénominations et directions présentées ci-dessus. Certaines agences, comme le CSC, prolongent des structures antérieures dont elles conservent les méthodes et les missions compatibles."
  ],
  [
    "Ces agences restent largement indépendantes de leur secrétariat de rattachement afin de préserver l’immunité et la sécurité de leurs missions. Dina Page consulte régulièrement leurs directions. Le document renvoie explicitement au fichier consacré aux agences pour leur détail.",
    "Ces agences restent largement indépendantes de leur secrétariat de rattachement afin de préserver l’immunité et la sécurité de leurs missions. Dina Page consulte régulièrement leurs directions."
  ],
  [
    "Ethan Gaines travaille étroitement avec Leslie Wright, directrice de Caltech ; la source présente Wright comme celle qui dicte de fait de nombreuses règles sur la recherche par son intermédiaire.",
    "Ethan Gaines travaille étroitement avec Leslie Wright, directrice de Caltech ; celle-ci dicte de fait par son intermédiaire une grande partie des règles appliquées à la recherche."
  ],
  [
    "La source décrit la justice comme composée de deux branches, juges et avocats, chacune dotée de ses propres mécanismes de contrôle. La présidence de la Cour suprême dispose d’un conseiller de justice qui traite les dossiers et assure la suppléance.",
    "La justice comprend deux branches, les juges et les avocats, chacune dotée de ses propres mécanismes de contrôle. La présidence de la Cour suprême dispose d’un conseiller de justice qui traite les dossiers et assure la suppléance."
  ],
  [
    "La source affirme qu’aucune autorité ne peut casser ses décisions en Californie et décrit une procédure de négociation extrêmement risquée lorsqu’un conflit de compétence subsiste avec la Cour suprême des États-Unis.",
    "Aucune autorité ne peut casser les décisions de la Cour suprême en Californie. Lorsqu’un conflit de compétence subsiste avec la Cour suprême des États-Unis, une procédure de négociation extrêmement risquée s’engage."
  ],
  [
    "La peine finale remplace dans certains cas l’ancienne peine capitale : elle peut aller de la déchéance de nationalité jusqu’à la déchéance des droits fondamentaux. Le document Prisons emploie aussi les notions de mort civique et de déchéance des droits ; ces formulations décrivent le même ensemble de sanctions extrêmes et doivent être lues ensemble.",
    "La peine finale remplace dans certains cas l’ancienne peine capitale : elle peut aller de la déchéance de nationalité jusqu’à la déchéance des droits fondamentaux. Les notions de mort civique et de déchéance des droits désignent ce même ensemble de sanctions extrêmes."
  ],
  [
    "Dans les formes les plus absolues, le condamné cesse d’être protégé comme un citoyen et peut être vendu à des structures corporatives. La source insiste sur le caractère très controversé de cette réforme.",
    "Dans les formes les plus absolues, le condamné cesse d’être protégé comme un citoyen et peut être vendu à des structures corporatives. Cette réforme reste très controversée."
  ],
  [
    "La Grande Réserve est créée le 25 août 2033 pour accueillir des communautés amérindiennes issues de l’ensemble des États-Unis. La source estime sa population à environ 500 000 personnes, soit près d’un sixième de la population mondiale de ces peuples selon ses propres chiffres.",
    "La Grande Réserve est créée le 25 août 2033 pour accueillir des communautés amérindiennes issues de l’ensemble des États-Unis. Sa population est estimée à environ 500 000 personnes, soit près d’un sixième de la population mondiale de ces peuples."
  ],
  [
    "Le document gouvernemental insiste sur trois singularités californiennes : le poids ancien des mafias face aux corporations, le traumatisme du Big One qui a détourné une partie des investissements, et surtout l’ascension de Dina Page, autour de laquelle se reconstruit un appareil d’État fort.",
    "Trois singularités façonnent la Californie : le poids ancien des mafias face aux corporations, le traumatisme du Big One qui a détourné une partie des investissements et surtout l’ascension de Dina Page, autour de laquelle se reconstruit un appareil d’État fort."
  ],
  [
    "La carte source place le nouvel ensemble autour des grands pôles de San Francisco, San José, Los Angeles, San Diejuana, Mexicali, Tucson, Phoenix et Las Vegas. Les frontières exactes restent celles du corpus Réalité V9 lorsqu’une version plus récente les précise.",
    "La Grande Californie s’articule autour des grands pôles de San Francisco, San José, Los Angeles, San Diejuana, Mexicali, Tucson, Phoenix et Las Vegas. Ses frontières exactes demeurent liées à une souveraineté encore en transition."
  ],
  [
    "Les exemples Xtremeat et Secuford servent dans la source à montrer que les autorités californiennes entendent imposer leurs normes jusque dans des installations corporatives lorsque la justice valide l’intervention.",
    "Les interventions contre Xtremeat et Secuford montrent que les autorités californiennes imposent leurs normes jusque dans les installations corporatives lorsque la justice valide leur action."
  ],
  [
    "Fait établi par cette source : Dina Page dispose officieusement d’un cabinet secret chargé de superviser l’aide apportée aux États-Unis afin qu’ils puissent se redresser grâce aux fonds reçus lors de la cession de territoires. Elle n’a aucun intérêt politique ni personnel à voir le pays voisin s’effondrer.",
    "Dina Page dispose officieusement d’un cabinet secret chargé de superviser l’aide apportée aux États-Unis afin qu’ils puissent se redresser grâce aux fonds reçus lors de la cession de territoires. Elle n’a aucun intérêt politique ni personnel à voir le pays voisin s’effondrer."
  ],
  [
    "Le corpus décrit précisément six familles — Fixers, DeathRunners, Neurodivers, Meditechs, Gundrivers et Neopunks. Les « chats » sont attestés par la taxonomie mais ne sont pas davantage définis dans la source.",
    "Six familles disposent d’une définition précise : Fixers, DeathRunners, Neurodivers, Meditechs, Gundrivers et Neopunks. Les « chats » figurent aussi dans la taxonomie, mais leurs fonctions restent inconnues."
  ],
  [
    "Dans le document, les crawlers seront appelés par la première catégorie les représentants, par exemples il y aura les « Fixers » qui comprennent « les fixers », les « streetrackers » et les « hookers », ces trois sous-catégories sont toutes des formes de « fixers » bien que leurs spécificités soient légèrement différentes.",
    "L’usage retient la première catégorie comme terme générique : les « Fixers » comprennent ainsi les fixers, les streetrackers et les hookers, trois sous-catégories aux spécificités légèrement différentes."
  ],
  [
    "Les catégories policières ne couvrent pas tous les Crawlers. Le corpus cite notamment les gladiateurs des tournois illégaux et certains pilotes spécialisés dans des véhicules exigeant des augmentations ou une connexion complète à la machine.",
    "Les catégories policières ne couvrent pas tous les Crawlers. Les gladiateurs des tournois illégaux et certains pilotes spécialisés dans des véhicules exigeant des augmentations ou une connexion complète à la machine échappent notamment à cette classification."
  ],
  [
    "Figures séraphiques documentées dans cette source : Purim / Adriana Bienvenida ; Ochotiel / Zivko Voronov.",
    "Séraphins de la lignée actuelle : Purim / Adriana Bienvenida ; Ochotiel / Zivko Voronov."
  ],
  [
    "Figures séraphiques documentées dans cette source : Belohim / Brandon Smith ; Arathim / Ragnil Sundström.",
    "Séraphins de la lignée actuelle : Belohim / Brandon Smith ; Arathim / Ragnil Sundström."
  ],
  [
    "Figures séraphiques documentées dans cette source : Assim / Stephania Lawrence ; Razael / Zamari Wilkerson.",
    "Séraphins de la lignée actuelle : Assim / Stephania Lawrence ; Razael / Zamari Wilkerson."
  ],
  [
    "Figures séraphiques documentées dans cette source : Hazel / Hazel Salz ; Sobronielle / Scarlet MacBride.",
    "Séraphins de la lignée actuelle : Hazel / Hazel Salz ; Sobronielle / Scarlet MacBride."
  ],
  [
    "Figures séraphiques documentées dans cette source : Esdrael / Shayna Arc ; Graphiel / Dragomir Mikhaïlovich.",
    "Séraphins de la lignée actuelle : Esdrael / Shayna Arc ; Graphiel / Dragomir Mikhaïlovich."
  ],
  [
    "Figures séraphiques documentées dans cette source : Georah / Jamal Jace Jayson ; Thirielle / Shihoko Baisho.",
    "Séraphins de la lignée actuelle : Georah / Jamal Jace Jayson ; Thirielle / Shihoko Baisho."
  ],
  [
    "Figures séraphiques documentées dans cette source : Nehemiel / Nei Helm ; Hassiel / Shaheed El’Kabir.",
    "Séraphins de la lignée actuelle : Nehemiel / Nei Helm ; Hassiel / Shaheed El’Kabir."
  ],
  [
    "Figures séraphiques documentées dans cette source : Danael / Daniel Melton ; Agriel / Hans Griever.",
    "Séraphins de la lignée actuelle : Danael / Daniel Melton ; Agriel / Hans Griever."
  ],
  [
    "Figures séraphiques documentées dans cette source : Jachim / Jaquina Morales ; Sabbathiel / Kurt Kriemenschneider.",
    "Séraphins de la lignée actuelle : Jachim / Jaquina Morales ; Sabbathiel / Kurt Kriemenschneider."
  ],
  [
    "Figures séraphiques documentées dans cette source : Barabbiel / Barbara Amble ; Pithormim / Rei Shinkai.",
    "Séraphins de la lignée actuelle : Barabbiel / Barbara Amble ; Pithormim / Rei Shinkai."
  ],
  [
    "La structure essentielle est la marque elle-même : l’Arbre à dix Sephiroth agit à la fois comme filet sur un attribut et comme dispositif lié à l’âme. Lorsqu’elle transcende effectivement l’âme, la marque d’Elynea se comporte dans la source comme une architecture spirituelle primaire comparable, par certains aspects, à un Mageius.",
    "La structure essentielle est la marque elle-même : l’Arbre à dix Sephiroth agit à la fois comme filet sur un attribut et comme dispositif lié à l’âme. Lorsqu’elle transcende effectivement l’âme, la marque d’Elynea constitue une architecture spirituelle primaire comparable, par certains aspects, à un Mageius."
  ],
  [
    "Le document distingue treize Anges ayant poussé leur fonction jusqu’à un niveau pouvant approcher les Archanges : les sept Vertus transcendées devenues Péchés capitaux, les quatre Dominations transcendées associées aux Cavaliers de l’Apocalypse et les deux Trônes transcendés associés aux Bêtes de l’Apocalypse.",
    "Treize Anges ont poussé leur fonction jusqu’à un niveau pouvant approcher les Archanges : les sept Vertus transcendées devenues Péchés capitaux, les quatre Dominations transcendées associées aux Cavaliers de l’Apocalypse et les deux Trônes transcendés associés aux Bêtes de l’Apocalypse."
  ],
  [
    "L’Arbre n’a que dix fonctions centrales mais Elynea avait rassemblé plus d’une vingtaine d’Archanges supérieurs. Le document distingue quatre grands Archanges, deux grands Archanges déchus, quatre Archanges supérieurs et dix Archanges renégats.",
    "L’Arbre n’a que dix fonctions centrales mais Elynea avait rassemblé plus d’une vingtaine d’Archanges supérieurs : quatre grands Archanges, deux grands Archanges déchus, quatre Archanges supérieurs et dix Archanges renégats."
  ],
  [
    "Le document « Loges des mages » détaille 6 figures rattachées à Loge de New-York. Les fiches individuelles conservent les identités, Mageius, affinités magiques et informations de Vérité de la source.",
    "Six figures sont rattachées à la Loge de New-York. Leurs entrées individuelles réunissent leurs identités, Mageius, affinités magiques et informations de Vérité."
  ],
  [
    "Le document « Loges des mages » détaille 6 figures rattachées à Loge de Los Angeles. Les fiches individuelles conservent les identités, Mageius, affinités magiques et informations de Vérité de la source.",
    "Six figures sont rattachées à la Loge de Los Angeles. Leurs entrées individuelles réunissent leurs identités, Mageius, affinités magiques et informations de Vérité."
  ],
  [
    "Le document « Loges des mages » détaille 6 figures rattachées à Loge de San Diejuana. Les fiches individuelles conservent les identités, Mageius, affinités magiques et informations de Vérité de la source.",
    "Six figures sont rattachées à la Loge de San Diejuana. Leurs entrées individuelles réunissent leurs identités, Mageius, affinités magiques et informations de Vérité."
  ],
  [
    "Le document « Loges des mages » détaille 4 figures rattachées à Loge de Las Vegas. Les fiches individuelles conservent les identités, Mageius, affinités magiques et informations de Vérité de la source.",
    "Quatre figures sont rattachées à la Loge de Las Vegas. Leurs entrées individuelles réunissent leurs identités, Mageius, affinités magiques et informations de Vérité."
  ],
  [
    "Le document « Loges des mages » détaille 4 figures rattachées à Loge de Phoenix. Les fiches individuelles conservent les identités, Mageius, affinités magiques et informations de Vérité de la source.",
    "Quatre figures sont rattachées à la Loge de Phoenix. Leurs entrées individuelles réunissent leurs identités, Mageius, affinités magiques et informations de Vérité."
  ],
  [
    "Le document « Loges des mages » détaille 4 figures rattachées à Loge de la Grande Réserve. Les fiches individuelles conservent les identités, Mageius, affinités magiques et informations de Vérité de la source.",
    "Quatre figures sont rattachées à la Loge de la Grande Réserve. Leurs entrées individuelles réunissent leurs identités, Mageius, affinités magiques et informations de Vérité."
  ],
  [
    "Le document « Loges des mages » détaille 8 figures rattachées à Autres Loges. Les fiches individuelles conservent les identités, Mageius, affinités magiques et informations de Vérité de la source.",
    "Huit figures sont rattachées à d’autres Loges. Leurs entrées individuelles réunissent leurs identités, Mageius, affinités magiques et informations de Vérité."
  ]
]);

const CELL_REWRITES = new Map<string, string>([
  ["Direction retenue", "Direction en 2035"],
  ["Ikasha (anciennement Tashca) — source Gouvernement plus récente", "Ikasha (anciennement Tashca)"],
  ["Seul-Ki Kae — remplace le CSCO historique dans la source Gouvernement", "Seul-Ki Kae — CSC actuel, héritier du CSCO"],
  ["Structures spécialisées documentées par la présente source", "Structures spécialisées hors des dix directions principales"],
  ["Agences principales attestées par la source Gouvernement, sans détail dans ce document", "Agences principales du cabinet en 2035"],
  ["Variantes de source", "Variantes de nom"],
  ["Gabriel dans la liste synthétique du document", "Gabriel"],
  ["Barrachiel apparaît ponctuellement dans le document", "Barrachiel"],
  ["Michael dans la liste synthétique ; Gheburah apparaît aussi comme variante orthographique", "Michael ; Gheburah"],
  ["Tiph'ereth et Tihereth apparaissent aussi dans la source", "Tiph’ereth ; Tihereth"],
  ["Uriel dans la liste synthétique du document", "Uriel"],
  ["Camael dans la liste synthétique du document", "Camael"],
  ["Malkouth apparaît dans un intertitre de la source", "Malkouth"]
]);

const editSections = (sections: Array<Record<string, any>>) =>
  sections.map((section) => ({
    ...section,
    blocks: (section.blocks ?? []).map((block: Record<string, any>) => {
      if (block.type === "p") {
        const replacement = TEXT_REWRITES.get(String(block.text ?? ""));
        return replacement ? { ...block, text: replacement } : block;
      }
      if (block.type === "table") {
        return {
          ...block,
          rows: (block.rows ?? []).map((row: unknown[]) =>
            row.map((cell) => CELL_REWRITES.get(String(cell ?? "")) ?? cell)
          )
        };
      }
      return block;
    })
  })) as Array<Record<string, any>>;

const editEntries = (
  entries: Array<Record<string, any>>
): Array<Record<string, any>> =>
  entries.map((entry) => ({ ...entry, sections: editSections(entry.sections ?? []) }));

export const COMPENDIUM_REALITE_V9_AGENCIES_EDITORIAL_HUB: Record<string, any> = {
  ...COMPENDIUM_REALITE_V9_AGENCIES_HUB,
  sections: editSections(COMPENDIUM_REALITE_V9_AGENCIES_HUB.sections ?? [])
};
export const COMPENDIUM_REALITE_V9_AGENCIES_EDITORIAL_ARTICLES: Array<Record<string, any>> = editEntries(
  COMPENDIUM_REALITE_V9_AGENCIES_ARTICLES
);
export const COMPENDIUM_REALITE_V9_GOVERNMENT_EDITORIAL_HUB_SECTIONS: Array<Record<string, any>> = editSections(
  COMPENDIUM_REALITE_V9_GOVERNMENT_HUB_SECTIONS
);
export const COMPENDIUM_REALITE_V9_GOVERNMENT_EDITORIAL_ARTICLES: Array<Record<string, any>> = editEntries(
  COMPENDIUM_REALITE_V9_GOVERNMENT_ARTICLES
);
export const COMPENDIUM_REALITE_V9_CRAWLERS_EDITORIAL_HUB_SECTIONS: Array<Record<string, any>> = editSections(
  COMPENDIUM_REALITE_V9_CRAWLERS_HUB_SECTIONS
);
export const COMPENDIUM_REALITE_V9_CRAWLERS_EDITORIAL_ARTICLE_ENRICHMENTS: Array<Record<string, any>> = editEntries(
  COMPENDIUM_REALITE_V9_CRAWLERS_ARTICLE_ENRICHMENTS
);
export const COMPENDIUM_VERITE_ANGELUS_EDITORIAL_ARTICLES: Array<Record<string, any>> = editEntries(
  COMPENDIUM_VERITE_ANGELUS_ARTICLES
);
export const COMPENDIUM_VERITE_ANGELUS_EDITORIAL_ENRICHMENTS: Array<Record<string, any>> = editEntries(
  COMPENDIUM_VERITE_ANGELUS_ENRICHMENTS
);
export const COMPENDIUM_VERITE_LOGES_MAGES_EDITORIAL_HUB_SECTIONS: Array<Record<string, any>> = editSections(
  COMPENDIUM_VERITE_LOGES_MAGES_HUB_SECTIONS
);
