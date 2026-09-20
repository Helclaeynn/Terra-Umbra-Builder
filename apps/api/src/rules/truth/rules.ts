import { truthRuntimeStructure } from "./runtime-structure.js";
import { truthCatalogHumain } from "./catalog-humain.js";
import { truthCatalogVampire } from "./catalog-vampire.js";
import { truthCatalogGarou } from "./catalog-garou.js";
import { truthCatalogKhinae } from "./catalog-khinae.js";
import { truthCatalogMage } from "./catalog-mage.js";
import { truthCatalogDaemon } from "./catalog-daemon.js";
import { truthCatalogAngelus } from "./catalog-angelus.js";
import { truthCatalogAseryn } from "./catalog-aseryn.js";
import { truthCatalogExile } from "./catalog-exile.js";
import { truthCatalogExtral } from "./catalog-extral.js";
import { truthVisibilityNeedles, truthSharedHunterNatures } from "./visibility.js";
import { truthRevelationRules } from "./revelation.js";

type TruthTalent = {
  group?: string;
  compendiumId?: string;
  [key: string]: unknown;
};

function bindCompendium<T extends readonly TruthTalent[]>(
  catalog: T,
  resolve: (group: string) => string | undefined
) {
  return catalog.map((talent) => ({
    ...talent,
    compendiumId: talent.compendiumId ?? resolve(String(talent.group ?? ""))
  }));
}

const vampireCatalog = bindCompendium(truthCatalogVampire, (group) => {
  if (group === "Vampire — commun" || group.includes("Talents de Cour")) {
    return "regles-verite-v7-vampire-nature-predation-cours";
  }
  if (group.startsWith("Sang ")) return "regles-verite-v7-vampire-sangs-transformations";
  return undefined;
});

const garouCatalog = bindCompendium(truthCatalogGarou, (group) => {
  if (group === "Garou — commun" || group.startsWith("Pelages ")) {
    return "regles-verite-v7-garou-nature-formes-frenesie-pelages";
  }
  if (group.startsWith("Sang ")) return "regles-verite-v7-garou-sangs-vifs";
  return undefined;
});

const khinaeCatalog = bindCompendium(
  truthCatalogKhinae,
  () => "regles-verite-v7-khinae-moteur-lignees"
);

const mageCatalog = bindCompendium(truthCatalogMage, (group) => {
  if (group.includes("Maîtrise") || group.includes("Amplitude")) {
    return "regles-verite-v7-mage-maitrise-amplitude-lancement";
  }
  return "regles-verite-v7-mage-tension-revers-echos-oeuvres";
});

const daemonCatalog = bindCompendium(
  truthCatalogDaemon,
  () => "regles-verite-v7-daemon-nature-fonctions-divinites-facettes"
);

const angelusCatalog = bindCompendium(truthCatalogAngelus, (group) => {
  if (group.startsWith("Les dix Sephiroth")) {
    return "regles-verite-v7-angelus-sephiroth-archanges-seraphins";
  }
  return "regles-verite-v7-angelus-nature-revelation-transcendance";
});

const aserynCatalog = bindCompendium(truthCatalogAseryn, (group) => {
  if (
    group.startsWith("Traditions des Treize") ||
    group.startsWith("Dratyn ") ||
    group.startsWith("Conseil de la Foudre")
  ) {
    return "regles-verite-v7-aseryn-treize-dratyn-conseil-foudre";
  }
  return "regles-verite-v7-aseryn-nature-accelyr-origines";
});

export const terraUmbraTruthRules = {
  structure: truthRuntimeStructure,
  catalogs: {
    humain: truthCatalogHumain,
    vampire: vampireCatalog,
    garou: garouCatalog,
    khinae: khinaeCatalog,
    mage: mageCatalog,
    daemon: daemonCatalog,
    angelus: angelusCatalog,
    aseryn: aserynCatalog,
    exile: truthCatalogExile,
    extral: truthCatalogExtral
  },
  visibility: {
    needles: truthVisibilityNeedles,
    sharedHunterNatures: truthSharedHunterNatures
  },
  revelation: truthRevelationRules
} as const;

export type TerraUmbraTruthRules = typeof terraUmbraTruthRules;
