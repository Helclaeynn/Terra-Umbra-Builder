import { talentRegistryMeta } from "./rules/talent-registry.js";

type TalentHubSpec = {
  id: string;
  title: string;
  natureId: string;
  groupPrefix: string;
  subgroup: string;
  pageOrder: number;
};

const TALENT_HUB_SPECS: TalentHubSpec[] = [
  {
    id: "regles-verite-chasseur-lavandieres",
    title: "Lavandières — tradition vampirique de Chasse",
    natureId: "humain",
    groupPrefix: "Lavandières — tradition vampirique de Chasse",
    subgroup: "Humains & Chasseurs",
    pageOrder: 20
  },
  {
    id: "regles-verite-chasseur-catholiques",
    title: "Chasseurs catholiques",
    natureId: "humain",
    groupPrefix: "Chasseurs catholiques",
    subgroup: "Humains & Chasseurs",
    pageOrder: 30
  },
  {
    id: "regles-verite-chasseur-khalsa",
    title: "Khālsā — Serment, protection et liberté",
    natureId: "humain",
    groupPrefix: "Khālsā — Serment, protection et liberté",
    subgroup: "Humains & Chasseurs",
    pageOrder: 40
  },
  {
    id: "regles-verite-chasseur-taoistes",
    title: "Taoïstes — Gu, Shimazu et secrets Shi",
    natureId: "humain",
    groupPrefix: "Taoïstes — Gu, Shimazu et secrets Shi",
    subgroup: "Humains & Chasseurs",
    pageOrder: 50
  },
  {
    id: "regles-verite-chasseur-kabbale",
    title: "Kabbale — les Dix Sephiroth",
    natureId: "humain",
    groupPrefix: "Kabbale — les Dix Sephiroth",
    subgroup: "Humains & Chasseurs",
    pageOrder: 60
  },
  {
    id: "regles-verite-chasseur-nizarites-asasiyun",
    title: "Nizarites / Asāsīyūn — Arts du Djinn et doctrine de chasse",
    natureId: "humain",
    groupPrefix: "Nizarites / Asāsīyūn — Arts du Djinn et doctrine de chasse",
    subgroup: "Humains & Chasseurs",
    pageOrder: 70
  },
  {
    id: "regles-verite-chasseur-onmyoji",
    title: "Onmyoji — Shikigami, sceaux et pactes spirituels",
    natureId: "humain",
    groupPrefix: "Onmyoji — Shikigami, sceaux et pactes spirituels",
    subgroup: "Humains & Chasseurs",
    pageOrder: 80
  },
  {
    id: "regles-verite-chasseur-neopaiens",
    title: "Néopaïens — pratiques communes et Mystères",
    natureId: "humain",
    groupPrefix: "Néopaïens — pratiques communes et Mystères",
    subgroup: "Humains & Chasseurs",
    pageOrder: 90
  },
  {
    id: "regles-verite-chasseur-chasse-fantastique",
    title: "Chasse Fantastique — la Vénerie surnaturelle",
    natureId: "humain",
    groupPrefix: "Chasse Fantastique — la Vénerie surnaturelle",
    subgroup: "Humains & Chasseurs",
    pageOrder: 100
  },
  {
    id: "regles-verite-chasseur-lueurs-azmenor",
    title: "Lueurs d’Azménor — visions et Néant",
    natureId: "humain",
    groupPrefix: "Lueurs d’Azménor — visions et Néant",
    subgroup: "Humains & Chasseurs",
    pageOrder: 110
  },
  {
    id: "regles-verite-chasseur-xenoshield",
    title: "Xenoshield — contre-intrusion Extral",
    natureId: "humain",
    groupPrefix: "Xenoshield — contre-intrusion Extral",
    subgroup: "Humains & Chasseurs",
    pageOrder: 120
  },
  {
    id: "regles-verite-chasseur-independants",
    title: "Chasseurs indépendants — Héritages modulaires",
    natureId: "humain",
    groupPrefix: "Chasseurs indépendants — Héritages modulaires",
    subgroup: "Humains & Chasseurs",
    pageOrder: 130
  },
  {
    id: "regles-verite-chasseur-table-ronde",
    title: "Table Ronde — lignées et armes de Merlin",
    natureId: "humain",
    groupPrefix: "Table Ronde — lignées et armes de Merlin",
    subgroup: "Humains & Chasseurs",
    pageOrder: 140
  },
  {
    id: "regles-verite-extral-protocoles-de-continuite",
    title: "Extral — Protocoles de Continuité",
    natureId: "extral",
    groupPrefix: "Protocoles de Continuité — 7 PTV",
    subgroup: "Extrals",
    pageOrder: 100
  }
];

function cleanGroupTitle(value: string): string {
  return value
    .replace(/\s+[—-]\s+\d+\s*PTV\b/gi, "")
    .trim();
}

function sectionTitle(spec: TalentHubSpec, groupLabel: string): string {
  const parts = groupLabel.split(/\s*›\s*/).map(cleanGroupTitle).filter(Boolean);
  if (parts.length <= 1) return "Talents";
  const rootParts = spec.groupPrefix.split(/\s*›\s*/).map(cleanGroupTitle).filter(Boolean);
  const remaining = parts.slice(Math.min(rootParts.length, parts.length - 1));
  return remaining.join(" — ") || parts[parts.length - 1] || "Talents";
}

export function generatedTalentHubCorpus() {
  const meta = talentRegistryMeta();

  const articles = TALENT_HUB_SPECS.map((spec) => {
    const groups = meta.groups.filter(
      (group) =>
        group.natureId === spec.natureId &&
        (group.label === spec.groupPrefix || group.label.startsWith(spec.groupPrefix + " ›"))
    );

    return {
      id: spec.id,
      title: spec.title,
      category: "Règles",
      sourceCategory: "Règles",
      dataset: "generated-talents",
      source: "Builder V2 — registre canonique des Talents",
      status: "canon_enrichi",
      tags: [spec.natureId, "talents", "hub"],
      __generatedTalentHub: true,
      sections: [
        {
          id: "talents-intro",
          title: "Talents",
          level: 2,
          blocks: [
            {
              type: "p",
              style: "lore",
              text:
                "Cette page rassemble les Talents de cette famille. Leurs coûts, prérequis, effets et textes associés sont alimentés directement par le registre canonique du Builder."
            }
          ]
        },
        ...groups.map((group, index) => ({
          id: "talents-" + (index + 1),
          title: sectionTitle(spec, group.label),
          level: 3,
          blocks: [
            {
              type: "p",
              text: `{{Talents|group=${group.groupId}}}`
            }
          ]
        }))
      ]
    };
  });

  const navigation = TALENT_HUB_SPECS.map((spec) => ({
    id: spec.id,
    dataset: "generated-talents",
    category: "Règles",
    group: "Vérité — Natures & capacités",
    groupOrder: 80,
    subgroup: spec.subgroup,
    subgroupOrder:
      spec.subgroup === "Humains & Chasseurs"
        ? 10
        : spec.subgroup === "Daemons"
          ? 50
          : spec.subgroup === "Aseryns"
            ? 70
            : 100,
    pageOrder: spec.pageOrder,
    displayTitle: spec.title
  }));

  return { articles, navigation };
}
