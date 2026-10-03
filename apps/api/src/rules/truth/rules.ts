import {truthCoreRules} from './core-rules.js';
import {truthEquipmentCatalog} from './equipment.js';
import {corruptionPrecedence,corruptionSources,corruptionTalents} from './corruption.js';
export const terraUmbraTruthRules={...truthCoreRules,equipment:truthEquipmentCatalog,corruption:{sources:corruptionSources,precedence:corruptionPrecedence,talents:corruptionTalents}} as const;
export type TerraUmbraTruthRules=typeof terraUmbraTruthRules;
