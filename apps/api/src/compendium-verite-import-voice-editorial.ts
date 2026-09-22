import {
  COMPENDIUM_VERITE_SPECIES_LORE_ARTICLES,
  COMPENDIUM_VERITE_SPECIES_ENRICHMENTS
} from "./compendium-verite-species-lore.js";
import {
  COMPENDIUM_VERITE_FANTASTIQUES_ARTICLES,
  COMPENDIUM_VERITE_FANTASTIQUES_ENRICHMENTS
} from "./compendium-verite-fantastiques-lore.js";
import {
  COMPENDIUM_VERITE_EXTRATERRESTRES_ARTICLES,
  COMPENDIUM_VERITE_EXTRATERRESTRES_ENRICHMENTS
} from "./compendium-verite-extraterrestres-lore.js";

const TEXT_REWRITES = new Map<string, string>([
  [
    "Les Immortels sont des êtres qui ont perdu la vie sans parvenir à mourir : corps et âme subsistent, mais leur Nature n’est plus celle de leur espèce d’origine. Certains Chasseurs y rangent les Vampires, mais le document considère cette classification comme trop large et réserve plutôt la catégorie aux Liches et à d’autres cas singuliers.",
    "Les Immortels sont des êtres qui ont perdu la vie sans parvenir à mourir : corps et âme subsistent, mais leur Nature n’est plus celle de leur espèce d’origine. Certains Chasseurs y rangent les Vampires, mais cette classification est trop large ; la catégorie désigne plutôt les Liches et d’autres cas singuliers."
  ],
  [
    "Les Golems sont des Fées artificielles créées à l’origine par les Voyageurs et les Mages pour leur protection. Très matériels là où beaucoup de Djinns sont immatériels, ils disposent de peu de pouvoirs propres mais peuvent posséder des capacités physiques considérables. Le document regroupe sous cette famille des êtres argileux, marionnettes, Homoncules ou androïdes. Certains peuvent parfaitement ressembler à des Humains ; comme les Cadavres, ils sont décrits comme privés d’âme et leur existence devient souvent instable lorsqu’ils prennent conscience de cette absence.",
    "Les Golems sont des Fées artificielles créées à l’origine par les Voyageurs et les Mages pour leur protection. Très matériels là où beaucoup de Djinns sont immatériels, ils disposent de peu de pouvoirs propres mais peuvent posséder des capacités physiques considérables. Cette famille comprend des êtres argileux, des marionnettes, des Homoncules ou des androïdes. Certains peuvent parfaitement ressembler à des Humains ; comme les Cadavres, ils sont privés d’âme et leur existence devient souvent instable lorsqu’ils prennent conscience de cette absence."
  ],
  [
    "Les Zoanides sont les Fées animales, esprits totémiques et protecteurs des bêtes. Les Khinae furent leurs protégés et de nombreuses lignées khinae bénéficient encore de leur bienveillance ; certaines partageraient même leur sang. Leur rapport aux mortels est contradictoire, fait à la fois d’attachement et de rejet. Le document souligne aussi la difficulté à distinguer certains Zoanides de Keltas venus d’Aèr, les deux pouvant être perçus comme des esprits animaux.",
    "Les Zoanides sont les Fées animales, esprits totémiques et protecteurs des bêtes. Les Khinae furent leurs protégés et de nombreuses lignées khinae bénéficient encore de leur bienveillance ; certaines partageraient même leur sang. Leur rapport aux mortels est contradictoire, fait à la fois d’attachement et de rejet. Certains Zoanides sont difficiles à distinguer des Keltas venus d’Aèr, les deux pouvant être perçus comme des esprits animaux."
  ],
  [
    "Ces Créatures vivent davantage dans la Vérité que dans la Réalité et influencent rarement directement les sociétés visibles. Le document les présente comme les adversaires les plus fréquents des Chasseurs. Vampires, Garous, Mages, Atlantes, Daemons et Angelus ne connaissent pas nécessairement ces familles tant qu’elles n’entrent pas en conflit avec eux.",
    "Ces Créatures vivent davantage dans la Vérité que dans la Réalité et influencent rarement directement les sociétés visibles. Elles sont les adversaires les plus fréquents des Chasseurs. Vampires, Garous, Mages, Atlantes, Daemons et Angelus ne connaissent pas nécessairement ces familles tant qu’elles n’entrent pas en conflit avec eux."
  ],
  [
    "Les Abominations constituent un dernier genre à part. Comme les ancêtres des Vampires, elles ont été déformées par la puissance des Fléaux ; contrairement aux Vampires, elles n’ont jamais échappé à leur domination et forment leurs principales forces. Toutes les espèces peuvent être touchées. Le document donne les Duergars whurtens et les Abyssaux possiblement issus des Aseryns comme exemples de peuples transformés.",
    "Les Abominations constituent un dernier genre à part. Comme les ancêtres des Vampires, elles ont été déformées par la puissance des Fléaux ; contrairement aux Vampires, elles n’ont jamais échappé à leur domination et forment leurs principales forces. Toutes les espèces peuvent être touchées. Les Duergars whurtens et les Abyssaux, possiblement issus des Aseryns, sont des exemples de peuples transformés."
  ],
  [
    "Certaines communautés établies près des tombeaux ou portails de leurs maîtres possèdent une forme d’immortalité. Chaque Fléau dispose en outre de sectes humaines qui glorifient les Abominations, les envient ou cherchent à en devenir. Le document rattache explicitement ces thèmes à l’imaginaire lovecraftien.",
    "Certaines communautés établies près des tombeaux ou portails de leurs maîtres possèdent une forme d’immortalité. Chaque Fléau dispose en outre de sectes humaines qui glorifient les Abominations, les envient ou cherchent à en devenir. Ces thèmes s’inscrivent explicitement dans l’imaginaire lovecraftien."
  ],
  [
    "Les Dragons sont peu portés sur la création artistique et accordent beaucoup d’importance à une activité suffisamment rémunératrice pour assurer notamment leur alimentation. Ils manifestent peu d’intérêt pour l’Holonet et privilégient fortement leur propre corps ; le document les décrit également comme ne pratiquant pas les augmentations.",
    "Les Dragons sont peu portés sur la création artistique et accordent beaucoup d’importance à une activité suffisamment rémunératrice pour assurer notamment leur alimentation. Ils manifestent peu d’intérêt pour l’Holonet, privilégient fortement leur propre corps et ne pratiquent pas les augmentations."
  ],
  [
    "Les Exilés issus de ces peuples plus rares ne forment généralement pas de communautés aussi structurées que les Elyë, Whurtens, Ashylls, Thulkars ou Azménoriens. Ils se rapprochent des communautés expatriées qui acceptent de les accueillir. Le document rappelle aussi que des Humains peuvent faire partie des Expatriés.",
    "Les Exilés issus de ces peuples plus rares ne forment généralement pas de communautés aussi structurées que les Elyë, Whurtens, Ashylls, Thulkars ou Azménoriens. Ils se rapprochent des communautés expatriées qui acceptent de les accueillir. Des Humains peuvent aussi faire partie des Expatriés."
  ],
  [
    "Le document source laisse volontairement plusieurs dates sous la forme « ??? ». Ces événements sont donc conservés comme repères d’ordre historique sans leur attribuer artificiellement une datation plus précise.",
    "Plusieurs dates demeurent volontairement sous la forme « ??? ». Ces événements sont conservés comme repères d’ordre historique sans leur attribuer artificiellement une datation plus précise."
  ],
  [
    "En 2035, la structure décrite par cette source comporte trois sièges elfiques, trois sièges nains, un siège azménorien, un siège dragon, un siège vala’eraï et le siège de la Guide. Un candidat doit exercer une influence majeure dans sa communauté, posséder ancienneté et connaissance de l’histoire des Expatriés, puis obtenir le parrainage de deux sièges. Le Conseil cherche ainsi un équilibre entre figures très anciennes, parfois semi-immortelles, et membres actifs, riches ou influents dans la Réalité.",
    "En 2035, le Conseil comporte trois sièges elfiques, trois sièges nains, un siège azménorien, un siège dragon, un siège vala’eraï et le siège de la Guide. Un candidat doit exercer une influence majeure dans sa communauté, posséder ancienneté et connaissance de l’histoire des Expatriés, puis obtenir le parrainage de deux sièges. Le Conseil cherche ainsi un équilibre entre figures très anciennes, parfois semi-immortelles, et membres actifs, riches ou influents dans la Réalité."
  ],
  [
    "Ces centres proposent commerce d’objets enchantés, augmentations adaptées, soins médicaux spécifiques et autres services impossibles à traiter normalement dans la Réalité. Leurs bars servent aussi de réseaux d’information et permettent de suivre les codes utilisés pour se reconnaître ; la source donne l’exemple d’une époque où un papillon vert porté dans le dos signalait les Elfes sans nécessiter de Révélation.",
    "Ces centres proposent commerce d’objets enchantés, augmentations adaptées, soins médicaux spécifiques et autres services impossibles à traiter normalement dans la Réalité. Leurs bars servent aussi de réseaux d’information et permettent de suivre les codes utilisés pour se reconnaître. À une époque, un papillon vert porté dans le dos signalait ainsi les Elfes sans nécessiter de Révélation."
  ],
  [
    "Le document décrit les Elyë comme généralement beaux, fins, agiles, sensibles à l’esthétique, doués pour la Magie et le tir grâce à des sens affinés. Leurs oreilles sont pointues et même sous Hologramme une certaine grâce ou dignité tend à transparaître.",
    "Les Elyë sont généralement beaux, fins, agiles, sensibles à l’esthétique, doués pour la Magie et le tir grâce à des sens affinés. Leurs oreilles sont pointues et même sous Hologramme une certaine grâce ou dignité tend à transparaître."
  ],
  [
    "Parce qu’ils étaient classés parmi les peuples « nuisibles », la source ne sait pas si leurs premiers passages sur Terre résultèrent de captivité ou de grandes invasions. Ils constituent néanmoins la troisième grande communauté expatriée d’Aèr et leur aptitude à la discrétion les a probablement aidés à survivre aux purges historiques.",
    "Parce qu’ils étaient classés parmi les peuples « nuisibles », on ignore si leurs premiers passages sur Terre résultèrent de captivité ou de grandes invasions. Ils constituent néanmoins la troisième grande communauté expatriée d’Aèr et leur aptitude à la discrétion les a probablement aidés à survivre aux purges historiques."
  ],
  [
    "Le document ne leur attribue ni charisme exceptionnel ni talent universel, mais insiste sur leur inventivité. Leur fragilité et leur durée de vie plus courte favoriseraient des tempéraments extrêmes : très prudents ou, au contraire, audacieux jusqu’au « tout pour le tout ».",
    "Les Ashylls ne possèdent ni charisme exceptionnel ni talent universel, mais se distinguent par leur inventivité. Leur fragilité et leur durée de vie plus courte favoriseraient des tempéraments extrêmes : très prudents ou, au contraire, audacieux jusqu’au « tout pour le tout »."
  ],
  [
    "Sous leur forme réelle, ce sont de grands humanoïdes verts, nettement plus grands, larges et lourds que les Humains et impossibles à confondre avec les Ashylls. Leur corps est puissant, résistant et relativement peu sensible à la douleur. Le document leur attribue aussi moins d’affect et une perception moyenne plus faible. Les lignées terrestres apparaissent moins robustes que les guerriers d’Aèr mais plus rapides, physiquement comme intellectuellement.",
    "Sous leur forme réelle, ce sont de grands humanoïdes verts, nettement plus grands, larges et lourds que les Humains et impossibles à confondre avec les Ashylls. Leur corps est puissant, résistant et relativement peu sensible à la douleur. Ils manifestent aussi moins d’affect et possèdent une perception moyenne plus faible. Les lignées terrestres apparaissent moins robustes que les guerriers d’Aèr mais plus rapides, physiquement comme intellectuellement."
  ],
  [
    "Les Azménoriens naquirent de la rencontre entre Elfes gris et Archanges noirs. La source rattache leur apparition à de graves épidémies elfiques : les grossesses portant des hybrides d’Archanges noirs protégeaient les mères de ces maladies. Cette nouvelle espèce devint ensuite l’un des moteurs de l’expansion spatiale, de l’installation des Portails des Mondes et de plusieurs épisodes majeurs de l’histoire d’Aèr et de la galaxie.",
    "Les Azménoriens naquirent de la rencontre entre Elfes gris et Archanges noirs. Leur apparition est liée à de graves épidémies elfiques : les grossesses portant des hybrides d’Archanges noirs protégeaient les mères de ces maladies. Cette nouvelle espèce devint ensuite l’un des moteurs de l’expansion spatiale, de l’installation des Portails des Mondes et de plusieurs épisodes majeurs de l’histoire d’Aèr et de la galaxie."
  ],
  [
    "La source leur attribue une tendance plus fréquente aux réactions excessives et à aller jusqu’au bout d’une décision au point de devenir destructeurs, sans présenter cela comme une pathologie individuelle.",
    "Les Azménoriens tendent plus fréquemment aux réactions excessives et peuvent aller jusqu’au bout d’une décision au point de devenir destructeurs, sans que ce comportement constitue une pathologie individuelle."
  ],
  [
    "En Grande Californie, ils sont rares et très intégrés. Certains alterhumanistes interprètent leurs différences comme une mutation et acceptent l’idée d’une reproduction difficile ou impossible ; les familles plus conscientes de leur histoire sont souvent proches des réseaux elfiques. Le document ne leur attribue pas d’avantage général sur les Humains en dehors de leur héritage historique exceptionnel.",
    "En Grande Californie, ils sont rares et très intégrés. Certains alterhumanistes interprètent leurs différences comme une mutation et acceptent l’idée d’une reproduction difficile ou impossible ; les familles plus conscientes de leur histoire sont souvent proches des réseaux elfiques. Ils ne disposent pas d’un avantage général sur les Humains en dehors de leur héritage historique exceptionnel."
  ],
  [
    "La source distingue les cinq grandes espèces officiellement autorisées par l’AIDH des autres présences extraterrestres. Talass, Mo’sens, Baséanhs, Rocréens et Thalsios sont soumis à des passeports, des réglementations et un recensement aussi complet que possible ; la majorité de leurs ressortissants est considérée comme pacifique.",
    "Cinq grandes espèces sont officiellement autorisées par l’AIDH : les Talass, Mo’sens, Baséanhs, Rocréens et Thalsios. Elles sont soumises à des passeports, des réglementations et un recensement aussi complet que possible ; la majorité de leurs ressortissants est considérée comme pacifique."
  ],
  [
    "Les Triphoriens formaient une espèce systémique adaptée aux très fortes gravités et alliée aux Effismes. Le document les décrit comme physiquement surpuissants dans des conditions terrestres.",
    "Les Triphoriens formaient une espèce systémique adaptée aux très fortes gravités et alliée aux Effismes. Dans des conditions terrestres, ils étaient physiquement surpuissants."
  ],
  [
    "Les Letrophodiens sont une espèce « systémique », c’est-à-dire limitée à un système solaire, parfois deux. La source oppose ce statut aux espèces planétaires, confinées à un seul monde, et aux espèces galactiques présentes à très grande échelle.",
    "Les Letrophodiens sont une espèce « systémique », c’est-à-dire limitée à un système solaire, parfois deux. Ce statut se distingue de celui des espèces planétaires, confinées à un seul monde, et des espèces galactiques présentes à très grande échelle."
  ],
  [
    "Les entités wolféennes sont très mal connues. La source rapporte qu’elles peuvent posséder des cadavres et récupérer leurs souvenirs. Leur possible interaction avec une dimension déphasée telle que l’Ombre-Monde constitue une inquiétude explicite de l’AIDH.",
    "Les entités wolféennes sont très mal connues. Elles peuvent posséder des cadavres et récupérer leurs souvenirs. Leur possible interaction avec une dimension déphasée telle que l’Ombre-Monde constitue une inquiétude explicite de l’AIDH."
  ],
  [
    "La source distingue cinq espèces extrales majeures officiellement autorisées sur Terre : Talass, Mo’sens, Baséanhs, Rocréens et Thalsios. Elles sont soumises à des passeports, des réglementations et un recensement destiné à contrôler les flux d’arrivée et de séjour.",
    "Cinq espèces extrales majeures sont officiellement autorisées sur Terre : les Talass, Mo’sens, Baséanhs, Rocréens et Thalsios. Elles sont soumises à des passeports, des réglementations et un recensement destiné à contrôler les flux d’arrivée et de séjour."
  ],
  [
    "Les mentions « ??? » de la source sont conservées comme des inconnues ; aucune date n’est reconstituée artificiellement.",
    "Les mentions « ??? » indiquent des dates inconnues ; aucune date n’est reconstituée artificiellement."
  ]
]);

const CELL_REWRITES = new Map<string, string>([
  ["Datation donnée par la source", "Datation conservée"],
  ["Non renseignés dans le document", "Date inconnue"]
]);

const editEntries = (entries: Array<Record<string, any>>) =>
  entries.map((entry) => ({
    ...entry,
    sections: (entry.sections ?? []).map((section: Record<string, any>) => ({
      ...section,
      blocks: (section.blocks ?? []).map((block: Record<string, any>) => {
        if (block.type === "p") {
          const replacement = TEXT_REWRITES.get(String(block.text ?? ""));
          return replacement ? { ...block, text: replacement } : block;
        }
        if (block.type === "table") {
          const rows = (block.rows ?? []).map((row: unknown[]) =>
            row.map((cell) => CELL_REWRITES.get(String(cell ?? "")) ?? cell)
          );
          return { ...block, rows };
        }
        return block;
      })
    }))
  })) as Array<Record<string, any>>;

export const COMPENDIUM_VERITE_SPECIES_EDITORIAL_ARTICLES = editEntries(
  COMPENDIUM_VERITE_SPECIES_LORE_ARTICLES
);
export const COMPENDIUM_VERITE_SPECIES_EDITORIAL_ENRICHMENTS = editEntries(
  COMPENDIUM_VERITE_SPECIES_ENRICHMENTS
);
export const COMPENDIUM_VERITE_FANTASTIQUES_EDITORIAL_ARTICLES = editEntries(
  COMPENDIUM_VERITE_FANTASTIQUES_ARTICLES
);
export const COMPENDIUM_VERITE_FANTASTIQUES_EDITORIAL_ENRICHMENTS = editEntries(
  COMPENDIUM_VERITE_FANTASTIQUES_ENRICHMENTS
);
export const COMPENDIUM_VERITE_EXTRATERRESTRES_EDITORIAL_ARTICLES = editEntries(
  COMPENDIUM_VERITE_EXTRATERRESTRES_ARTICLES
);
export const COMPENDIUM_VERITE_EXTRATERRESTRES_EDITORIAL_ENRICHMENTS = editEntries(
  COMPENDIUM_VERITE_EXTRATERRESTRES_ENRICHMENTS
);
