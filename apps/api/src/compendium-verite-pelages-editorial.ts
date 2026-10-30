import {
  COMPENDIUM_VERITE_PELAGES_ARTICLES,
  COMPENDIUM_VERITE_PELAGES_ENRICHMENTS
} from "./compendium-verite-pelages-lore.js";

const TEXT_REWRITES = new Map<string, string>([
  [
    "Le document cite notamment le clan inuit des Neige-Pattes, des lignées sibériennes et d’Alaska, ainsi que des réseaux modernes pouvant passer par la police, les Crawlers et les corporations.",
    "Les Pelages blancs comprennent notamment le clan inuit des Neige-Pattes, des lignées sibériennes et d’Alaska, ainsi que des réseaux modernes liés à la police, aux Crawlers ou aux corporations."
  ],
  [
    "Le document montre aussi des formes modernes de clan, comme les Untamed Fangs constitués en prison, capables d’absorber des Garous issus d’autres Pelages malgré leurs idéologies d’origine.",
    "La faction comprend aussi des clans modernes comme les Untamed Fangs, constitués en prison et capables d’absorber des Garous issus d’autres Pelages malgré leurs idéologies d’origine."
  ],
  [
    "Le document les décrit comme les Garous les plus proches des esprits : leur essence s’est mêlée au fil des millénaires à celle des Kami, identifiés ici aux Keltas. Ils contrôlent mieux leurs instincts mais disposent en moyenne d’une puissance bestiale moindre.",
    "Les Pelages bruns sont les Garous les plus proches des esprits : leur essence s’est mêlée au fil des millénaires à celle des Kami, identifiés ici aux Keltas. Ils contrôlent mieux leurs instincts, mais disposent en moyenne d’une puissance bestiale moindre."
  ],
  [
    "Les Meneurs cités dans le document se retrouvent dans l’éducation, les corporations et le gouvernement californien, montrant une implantation qui dépasse largement les seules communautés traditionnelles.",
    "Leurs Meneurs occupent des positions dans l’éducation, les corporations et le gouvernement californien. Leur implantation dépasse donc largement les seules communautés traditionnelles."
  ],
  [
    "Le document mentionne les Pelages crème, associés aux Dingos d’Australie et à une culture moins grégaire et ouvertement eugénique ; les Pelages livides, ou Bêtes faramines, liés au Fléau Vhodhal ; et les Chiennes de Bellatheis, nonnes corrompues par Sharith portant du sang garou.",
    "Les Pelages crème sont associés aux Dingos d’Australie et à une culture moins grégaire et ouvertement eugénique. Les Pelages livides, ou Bêtes faramines, sont liés au Fléau Vhodhal ; les Chiennes de Bellatheis sont des nonnes corrompues par Sharith et porteuses de sang garou."
  ],
  [
    "Le document signale des Chrysocyons en Amérique du Sud, des Lycaons en Afrique et des Dholes en Inde, presque jamais compatibles avec les principales factions. Il évoque aussi les Dingos d’Australie, les Bêtes faramines de Vhodhal et les Chiennes de Bellatheis corrompues par Sharith.",
    "Les Chrysocyons d’Amérique du Sud, les Lycaons d’Afrique et les Dholes d’Inde sont presque toujours incompatibles avec les principales factions. D’autres lignées périphériques comprennent les Dingos d’Australie, les Bêtes faramines de Vhodhal et les Chiennes de Bellatheis corrompues par Sharith."
  ]
]);

const rewriteSections = (sections: Array<Record<string, any>>, articleId?: string) =>
  sections.map((section) => ({
    ...section,
    title:
      section.id === "dossier"
        ? articleId === "verite-pelages-autres"
          ? "Lignées périphériques"
          : "Origines, direction et implantation"
        : section.title,
    blocks: (section.blocks ?? []).map((block: Record<string, any>) => {
      if (block.type !== "p") return block;
      const replacement = TEXT_REWRITES.get(String(block.text ?? ""));
      return replacement ? { ...block, text: replacement } : block;
    })
  }));

export const COMPENDIUM_VERITE_PELAGES_EDITORIAL_ARTICLES =
  COMPENDIUM_VERITE_PELAGES_ARTICLES.map((article) => ({
    ...article,
    sections: rewriteSections(article.sections ?? [], String(article.id))
  })) as Array<Record<string, any>>;

export const COMPENDIUM_VERITE_PELAGES_EDITORIAL_ENRICHMENTS =
  COMPENDIUM_VERITE_PELAGES_ENRICHMENTS.map((enrichment) => ({
    ...enrichment,
    sections: rewriteSections(enrichment.sections ?? [])
  })) as Array<Record<string, any>>;
