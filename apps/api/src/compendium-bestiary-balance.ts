import { bestiaryBalanceData } from "./compendium-bestiary-balance-data.js";

type JsonObject = Record<string, any>;
type Article = JsonObject & { id: string; sections?: JsonObject[] };
export const BESTIARY_BALANCE_VERSION = "2026-09-30";
export const BESTIARY_ENCOUNTER_GUIDE_ID = "bestiaire-guide-rencontres";
const p = (text: string, style = "lore"): JsonObject => ({ type: "p", style, text });
const table = (rows: string[][]): JsonObject => ({ type: "table", rows });
const section = (id: string, title: string, blocks: JsonObject[]): JsonObject =>
  ({ id, title, level: 2, audience: "mj", blocks });

export const bestiaryProgressionTiers = [
  ["Création", "0 XP", "5 PTV"],
  ["Premières aventures", "1–15 XP", "5–7 PTV"],
  ["Aguerris", "16–30 XP", "8–10 PTV"],
  ["Confirmés", "31–50 XP", "11–15 PTV"],
  ["Vétérans", "51–80 XP", "16–20 PTV"],
  ["Experts", "81–120 XP", "21–30 PTV"],
  ["Exceptionnels", "Plus de 120 XP", "Plus de 30 PTV"]
];

const endurance: Record<string, number> = {
  "bestiaire-v15-momie": 30, "bestiaire-v15-draugar": 28,
  "bestiaire-v15-jiangshi": 25, "bestiaire-v15-golem-feerique": 28,
  "bestiaire-v15-manananggal": 20, "bestiaire-v15-krasue": 17,
  "bestiaire-v15-penanggalan": 18, "bestiaire-v15-mapinguari": 42,
  "bestiaire-v15-chupacabra": 20, "bestiaire-v15-manticore": 36,
  "bestiaire-v15-leviathan-de-bassin": 45, "bestiaire-v15-wendigo": 42,
  "bestiaire-v15-traqueur-de-soute": 15
};
const superior: Record<string, [string, number, number, number]> = {
  "bestiaire-v15-momie": ["Momie de sanctuaire", 40, 10, 3],
  "bestiaire-v15-draugar": ["Draugar champion", 32, 10, 3],
  "bestiaire-v15-jiangshi": ["Jiangshi ancien", 28, 11, 3],
  "bestiaire-v15-manananggal": ["Manananggal mature", 24, 12, 3]
};

function variantBlocks(article: Article, hp: number, defense?: number, pa?: number): JsonObject[] {
  // Copy the full printed profile: all attacks, armour, limits and resources remain visible.
  const dossier = article.sections?.find(s => s.id === "dossier-mj");
  return (dossier?.blocks ?? []).filter((b: JsonObject) => b.type === "p" &&
    /^(MOUVEMENT|PERCEPTION|DÉF\.|ATTAQUE|TESTS UTILES|CAPACITÉ|FAIBLESSE|EXPOSITION)/.test(b.text ?? ""))
    .map((b: JsonObject) => {
      let text = String(b.text).replace(/\bPV\s+\d+/, `PV ${hp}`);
      if (defense !== undefined) text = text.replace(/DÉF\. PHYSIQUE\s+\d+/, `DÉF. PHYSIQUE ${defense}`);
      if (pa !== undefined) text = text.replace(/ACTIONS\s+\d+\s+PA/, `ACTIONS ${pa} PA`);
      return { ...b, text };
    });
}

export function applyBestiaryBalance(byId: Map<string, Article>): void {
  for (const data of bestiaryBalanceData) {
    const article = byId.get(data.id);
    if (!article) continue;
    // Replace our own sections on a repeated pass, never duplicate or stack variants.
    article.sections = (article.sections ?? []).filter(s => !String(s.id).startsWith("rencontres-") &&
      !String(s.id).startsWith("variante-balance-"));
    if (data.id === "bestiaire-v15-soldato") {
      for (const s of article.sections) for (const b of s.blocks ?? []) {
        if (typeof b.text !== "string") continue;
        if (b.text.startsWith("DÉF. PHYSIQUE")) b.text = b.text
          .replace(/DÉF\. PHYSIQUE\s+\d+/, "DÉF. PHYSIQUE 8").replace(/\bPV\s+\d+/, "PV 16");
        if (b.text.startsWith("CAPACITÉ / INFO MJ — Combat coordonné")) b.text =
          "CAPACITÉ / INFO MJ — Combat coordonné — Pour 1 PA, peut fournir l’Assistance normale (+2 au test de combat) à un autre Soldato sur un même objectif réellement coordonné. Aucun PA ni tir gratuit ; ne pas cumuler plusieurs Assistances sur la même attaque.";
      }
    }
    if (data.id === "bestiaire-v15-leviathan-de-bassin") {
      for (const s of article.sections) for (const b of s.blocks ?? []) {
        if (String(b.text ?? "").startsWith("CAPACITÉ / INFO MJ — Traction")) b.text =
          "CAPACITÉ / INFO MJ — Traction — Sur une Mâchoire de bassin qui inflige au moins 1 PV avec une marge de 6 ou plus, peut entraîner une cible compatible de taille humaine de 3 m vers l’eau, au lieu d’une autre Altération. Ce déplacement ne provoque aucune noyade automatique. Marge 6 correspond à DR 2 ; le seuil ne signifie pas DR 6.";
      }
    }
    const recommendations = data.recommendations as Record<string, string>;
    const rows = [["Groupe", "XP / PTV totaux par PJ", "Spécimens identiques · profil courant"]];
    if (data.eligible) {
      for (const size of [3, 4, 5, 6]) rows.push([`${size} PJ · ${size / 2} combattants équivalents`,
        "0 XP / 5 PTV", recommendations[`G${size}_0XP_5PTV`]]);
      for (const size of [5, 6]) rows.push([`${size} PJ · socle physique`, "35 XP / 10 PTV",
        recommendations[`G${size}_35XP_10PTV_physique`]]);
    }
    const blocks = [
      p(`MENACE INDIVIDUELLE — ${data.individual}. Indice du profil physique courant face à un PJ isolé ; les pouvoirs conditionnels peuvent modifier ce risque.`, "spec"),
      p(`RÔLE TACTIQUE — ${data.role}`, "spec"), p(data.scene),
      p(`AVERTISSEMENTS — ${data.warning.length ? data.warning.join(" ; ") : "Pas d’alerte particulière relevée dans le profil ; prévoir les conséquences propres à la scène."}`, "callout"),
      p(`VICTOIRE — ${data.victory}`, "callout")
    ];
    if (data.eligible) {
      blocks.push(table(rows), p("Effectifs indicatifs : 1, 2, 3, 4 et 6 adversaires testés. Sérieux signifie un coût réel en blessures ; dangereux peut laisser un PJ à terre même si le groupe gagne ; extrême exige préparation ou autre objectif. Les chiffres ne mesurent ni les soins entre scènes ni tous les pouvoirs et terrains.", "callout"));
      const vampireRows = [["Groupe avec un Vampire martial", "35 XP / 10 PTV par PJ · profil courant"]];
      for (const size of [5, 6]) vampireRows.push([`${size} PJ`, recommendations[`G${size}_35XP_10PTV_vampire`]]);
      blocks.push(table(vampireRows), p("Cette référence utilise un seul combattant de contact Vampire Krovni / Sang Écarlate révélé, avec Déferlement, Surrégime et Maître de guerre. Elle n’accorde pas ces bonus aux autres natures et ne convertit pas automatiquement les PTV en puissance."));
    }
    blocks.push(p("BONUS INCLUS — Utiliser directement les valeurs imprimées. Les PA des PNJ sont fixes ; ne pas les recalculer sur leur Initiative. Ne pas ajouter une deuxième fois Révélation, Cour, forme ou bonus présenté comme inclus. Un talent activable paie ses PA, ressources et limites décrits dans le dossier."),
      p(`[Paliers, composition du groupe et méthode de préparation](/compendium?article=${BESTIARY_ENCOUNTER_GUIDE_ID}). XP et PTV se lisent séparément ; à 40 % de combattants, la même rencontre est plus exigeante qu’à 50 %.`));
    article.sections.push(section("rencontres-recommandees", "Menace & rencontres recommandées", blocks));
    const hp = endurance[data.id];
    if (hp !== undefined) {
      const name = data.id === "bestiaire-v15-traqueur-de-soute" ? "Chef / individu mature" : "Solitaire endurci";
      article.sections.push(section("variante-balance-endurcie", `Variante · ${name}`, [
        p(`Choisir cette variante pour une confrontation solitaire renforcée : ${hp} PV. Ce bloc remplace le profil courant ; il ne se cumule avec aucune autre variante. Les effectifs du tableau précédent concernent le profil courant.`, "callout"),
        p("Éviter l’emploi automatique contre trois débutants : l’augmentation des PV prolonge le combat et peut accroître le risque de mise à terre. Elle ne garantit pas un boss difficile face à un grand groupe expérimenté."),
        ...variantBlocks(article, hp)
      ]));
    }
    const boss = superior[data.id];
    if (boss) article.sections.push(section("variante-balance-superieure", `Variante · ${boss[0]}`, [
      p(`Profil distinct : ${boss[1]} PV, Défense physique ${boss[2]}, ${boss[3]} PA. Remplace le profil courant et la variante endurcie ; Armure, dégâts, Défense occulte et Initiative conservés.`, "callout"),
      p("Gardien supérieur ou boss d’enquête selon le scénario. Le pouvoir central, les Ancres et l’objectif déterminent sa difficulté complète ; les effectifs du profil courant ne calibrent pas cette variante."),
      ...variantBlocks(article, boss[1], boss[2], boss[3])
    ]));
  }
  byId.set(BESTIARY_ENCOUNTER_GUIDE_ID, {
    id: BESTIARY_ENCOUNTER_GUIDE_ID, title: "Bestiaire · préparer une rencontre", category: "Bestiaire",
    dataset: "bestiaire", audience: "mj", status: "canon_recent", source: "Calibrage du bestiaire · 30 septembre 2026",
    tags: ["Rencontres", "Paliers", "Difficulté", "MJ"],
    navigation: { group: "Guide des rencontres", groupOrder: 1, subgroup: "", subgroupOrder: 0, pageOrder: 0 },
    sections: [
      section("rencontres-paliers", "Paliers & groupes de référence", [
        p("La grille couvre les groupes de 3, 4, 5 et 6 PJ à chaque palier. Compter 40 à 50 % de combattants équivalents : un spécialiste compte pour 1, un personnage avec des capacités de combat secondaires pour environ 0,5. Ce repère décrit la composition ; ce n’est pas un multiplicateur de dégâts."),
        table([["Palier d’XP", "XP cumulés par PJ", "Repère de PTV totaux indépendant", "Tailles de groupe"],
          ...bestiaryProgressionTiers.map(t => [...t, "3 / 4 / 5 / 6 PJ"])]),
        p("Les colonnes XP et PTV sont indépendantes. Un PJ à 35 XP et 10 PTV est confirmé en XP, avec une enveloppe de Vérité du repère aguerri. Lire les talents réellement achetés : détection, accès spirituel, contrôle et dégâts n’ont pas le même impact."),
        table([["Groupe", "Exemple à 50 % de combattants", "Combattants équivalents"],
          ["3 PJ", "1 principal + 1 secondaire + 1 soutien", "1,5"],
          ["4 PJ", "1 principal + 2 secondaires + 1 soutien", "2"],
          ["5 PJ", "2 principaux + 1 secondaire + 2 soutiens", "2,5"],
          ["6 PJ", "2 principaux + 2 secondaires + 2 soutiens", "3"]]),
        p("Calibrage chiffré disponible : création à 0 XP / 5 PTV pour les quatre tailles ; point de contrôle à 35 XP / 10 PTV pour 5 et 6 PJ, avec et sans Vampire martial. Les autres paliers sont des repères de préparation, encore sans effectifs chiffrés validés. Ne pas extrapoler un nombre automatique d’adversaires depuis les XP.", "callout"),
        table([["Palier", "Préparation de la rencontre"],
          ["Création", "Partir du tableau du profil courant ; annoncer les alertes et laisser une issue de retrait."],
          ["Premières aventures", "Comparer les achats réels au groupe de création : un petit budget peut financer un pouvoir qui change l’accès à la cible."],
          ["Aguerris", "Examiner hausse des compétences, moyens de protection, soins et interactions occultes ; conserver les variantes séparées."],
          ["Confirmés", "Le point 35 XP / 10 PTV sert de comparaison pour 5–6 PJ ; un autre choix de talents peut modifier fortement la rencontre."],
          ["Vétérans", "Évaluer les ressources, le contrôle et l’accès au terrain ; préférer une mission ou des rôles complémentaires à une hausse générale des PV."],
          ["Experts", "Évaluer les synergies et les interruptions possibles ; préparer une manifestation locale et ses limites pour les menaces majeures."],
          ["Exceptionnels", "Construire une rencontre spécifique aux capacités du groupe, avec objectif, phases et condition de victoire explicites."]])
      ]),
      section("rencontres-lecture", "Lire les niveaux de menace", [
        table([["Indice individuel", "Cible de référence"], ["M0", "Non-combattant"], ["M1", "Combattant ou obstacle individuel"],
          ["M2", "Dangereux pour un PJ secondaire"], ["M3", "Supérieur à un spécialiste dans le duel physique de référence"], ["M4", "Dominant même sur un spécialiste"]]),
        p("La menace individuelle est celle du profil courant. Elle ne représente pas la difficulté d’une escouade ni celle d’une variante. Une cible sans défense physique exploitable ou sans attaque physique chiffrée reçoit une lecture conditionnelle."),
        table([["Rencontre physique", "Repères du modèle"],
          ["Faible", "Victoire des PJ ≥98 % ; risque d’au moins un PJ à terre <10 %"],
          ["Mineure", "Victoire ≥90 % ; risque à terre <25 %"],
          ["Sérieuse", "Victoire ≥75 % ; risque à terre <65 %"],
          ["Dangereuse", "Victoire <75 % ou risque à terre ≥65 %, hors extrême"],
          ["Extrême", "Victoire <40 %"]]),
        p("La mise à terre signifie 0 PV, pas une mort définitive. Les résultats sont indicatifs et sensibles à la composition ; une victoire probable peut coûter plusieurs blessures. Les nombres indiqués sont des spécimens identiques, sans interpolation d’un cinquième adversaire."),
        p("Le socle simule PA, attaques physiques, armures, initiative, défense active, blessures et certaines régénérations explicitement chiffrées. Il ne couvre pas intégralement occultisme, possession, zones, invisibilité, vol, terrain, Ancres ni toutes les doctrines. Pour une défense active en échec narratif, il conserve le passif : cette hypothèse de simulation ne crée pas une nouvelle règle du moteur."),
        p("Les PNJ insensibles à la douleur et les constructs ont été traités sans pénalité de blessure physique dans le socle. Cela ne leur attribue aucune immunité nouvelle à la peur ou au contrôle mental. Leur nature et leurs capacités écrites restent la règle."),
        p("Références : équipement initial accessible dans les comptes des styles, un tireur principal au fusil d’assaut, aucun implant ni argent supplémentaire accordé à 35 XP, aucun Edge dépensé. Une politique tactique de référence ne décrit pas tous les comportements de table.")
      ]),
      section("rencontres-preparation", "Terrain, pouvoirs & victoire", [
        p("Avant la scène, vérifier les talents et protections réellement possédés, l’accès à la cible, la portée, les obstacles, l’exposition et les moyens de retrait. Un couvert protège des tirs concernés ; il ne constitue pas une défense universelle."),
        p("Toute Assistance paie l’action prévue ; aucun commandement ne fournit des attaques gratuites. Pour une composition mixte, distinguer tireurs, soutien, contrôleur et chef ; les tableaux homogènes ne prédisent pas automatiquement leurs synergies."),
        p("Pour chaque pouvoir utilisé, relever dans le dossier : déclencheur, coût en PA, portée, test ou opposition, protection, durée, fréquence et moyen de rupture. Si une valeur manque, préparer l’arbitrage avant la scène et informer les joueurs des signes perceptibles ; ne pas inventer des dégâts automatiques."),
        p("Quand un nom correspond à un talent de Vérité révisé, appliquer sa définition actuelle et ses prérequis. Une capacité propre au PNJ conserve uniquement l’effet écrit dans son dossier ; elle ne donne pas tout un Sang ou toute une doctrine."),
        p("Séparer l’issue immédiate de la victoire durable : dispersion, fuite, victime sauvée, corps neutralisé, Ancre rompue ou destruction. Un retour, une phase ou des renforts doivent être annoncés par des indices et définis avant le combat."),
        p("Pour les solitaires, sélectionner un seul bloc : courant, endurci ou supérieur. Les variantes améliorent l’endurance sans hausse universelle des dégâts. Conserver les profils majeurs de Grand Thulien, Sœur effisme, Dagon, R’Sheraag, Telipinu et Li’loth ; leur difficulté demande aussi les pouvoirs et objectifs décrits.")
      ])
    ]
  });
}
