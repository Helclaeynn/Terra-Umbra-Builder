import { SOURCE, HUB_BASE_SECTIONS, WAR_ARTICLE } from "./compendium-realite-v9-corporations-general.js";
import P0, { FAMILY as F0, FAMILY_INTRO as I0, INVENTORY as V0 } from "./compendium-realite-v9-corporations-payload-0.js";
import P1, { FAMILY as F1, FAMILY_INTRO as I1, INVENTORY as V1 } from "./compendium-realite-v9-corporations-payload-1.js";
import P2, { FAMILY as F2, FAMILY_INTRO as I2, INVENTORY as V2 } from "./compendium-realite-v9-corporations-payload-2.js";
import P3, { FAMILY as F3, FAMILY_INTRO as I3, INVENTORY as V3 } from "./compendium-realite-v9-corporations-payload-3.js";
import P4, { FAMILY as F4, FAMILY_INTRO as I4, INVENTORY as V4 } from "./compendium-realite-v9-corporations-payload-4.js";
import P5, { FAMILY as F5, FAMILY_INTRO as I5, INVENTORY as V5 } from "./compendium-realite-v9-corporations-payload-5.js";
import P6, { FAMILY as F6, FAMILY_INTRO as I6, INVENTORY as V6 } from "./compendium-realite-v9-corporations-payload-6.js";
import P7, { FAMILY as F7, FAMILY_INTRO as I7, INVENTORY as V7 } from "./compendium-realite-v9-corporations-payload-7.js";

export const COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ID = "realite-v9-corporations-territoires";

const FAMILY_GROUPS = [
  { family: F0, intro: I0, inventory: V0, articles: P0 },
  { family: F1, intro: I1, inventory: V1, articles: P1 },
  { family: F2, intro: I2, inventory: V2, articles: P2 },
  { family: F3, intro: I3, inventory: V3, articles: P3 },
  { family: F4, intro: I4, inventory: V4, articles: P4 },
  { family: F5, intro: I5, inventory: V5, articles: P5 },
  { family: F6, intro: I6, inventory: V6, articles: P6 },
  { family: F7, intro: I7, inventory: V7, articles: P7 }
] as Array<Record<string, any>>;

export const COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ENRICHMENT = {
  source: SOURCE,
  tags: ["Corporations","mégacorporations","PCRC","Pentaverat","Septemvirat","guerres corporatives","territoires corporatistes"],
  sections: [
    ...HUB_BASE_SECTIONS,
    {
      id: "corporations-source-familles",
      title: "Les huit familles corporatives",
      level: 2,
      blocks: FAMILY_GROUPS.map((entry) => ({
        type: "p",
        text: entry.family + " — " + (entry.intro ?? []).map((block: Record<string, any>) => String(block.text ?? "")).filter(Boolean).join(" ")
      }))
    },
    {
      id: "corporations-source-inventaire",
      title: "Inventaire des corporations du document",
      level: 2,
      blocks: [
        {
          type: "p",
          text: "Le document est explicitement inachevé : les corporations marquées « Citée » disposent d’un emplacement et d’une classification, mais d’aucun développement exploitable. Elles sont conservées ici sans leur inventer de lore."
        },
        {
          type: "table",
          rows: [
            ["Famille","Corporation","État de la source"],
            ...FAMILY_GROUPS.flatMap((entry) => (entry.inventory ?? []).map((item: Record<string, any>) => [
              entry.family,
              String(item.title ?? ""),
              item.substantive ? "Fiche développée" : "Citée dans le document ; fiche laissée inachevée"
            ]))
          ]
        }
      ]
    }
  ]
} as Record<string, any>;

export const COMPENDIUM_REALITE_V9_CORPORATIONS_ARTICLES = [
  WAR_ARTICLE,
  ...FAMILY_GROUPS.flatMap((entry) => entry.articles ?? [])
] as Array<Record<string, any>>;

export const COMPENDIUM_REALITE_V9_CORPORATIONS_NAVIGATION = [
  {
    id: "realite-v9-guerres-corporatives",
    dataset: "realite-v9-corporations",
    category: "Réalité",
    group: "Grande Californie & société",
    groupOrder: 20,
    subgroup: "Corporations",
    subgroupOrder: 31,
    pageOrder: 1,
    displayTitle: "Guerres corporatives"
  },
  ...FAMILY_GROUPS.flatMap((entry, familyIndex) =>
    (entry.articles ?? []).map((article: Record<string, any>, articleIndex: number) => ({
      id: article.id,
      dataset: "realite-v9-corporations",
      category: "Réalité",
      group: "Grande Californie & société",
      groupOrder: 20,
      subgroup: "Corporations · " + entry.family,
      subgroupOrder: 32 + familyIndex,
      pageOrder: articleIndex + 1,
      displayTitle: article.title
    }))
  )
] as Array<Record<string, any>>;
