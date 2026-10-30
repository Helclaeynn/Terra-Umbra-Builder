import {
  terraUmbraCreationLore as baseline,
  terraUmbraTalentChoiceSpecs as baselineChoices,
  terraUmbraRealitySkillTalentMap
} from "./terra-umbra-creation-lore-base.js";
import { reviseRealityLore } from "./reality-talents-revision.js";

export const terraUmbraCreationLore = {
  ...baseline,
  originTalent: reviseRealityLore(baseline.originTalent),
  sphereTalent: reviseRealityLore(baseline.sphereTalent),
  talent: reviseRealityLore(baseline.talent)
} as const;

export const terraUmbraTalentChoiceSpecs = {
  ...baselineChoices,
  badge_interne: {kind:"text",label:"Programme ou branche confidentielle",placeholder:"Périmètre de sites sécurisés et secrets",help:"L’accès physique est réel dans ce périmètre ; il ne donne aucun droit MJ sur le site."},
  profil_calibre: {kind:"skill",styleSkills:true,permanent:false,bonus:0,label:"Compétence professionnelle du Style",help:"Une relance par scénario, hors échec narratif. Aucun bonus permanent. Un ancien choix libre est conservé et doit être vérifié."},
  programme_pilote: {kind:"text",label:"Prototype et fonction expérimentale",placeholder:"Modèle, amélioration unique, limites et programme d’essai",help:"Définir la fiche complète avec le MJ avant l’achat du talent. Un seul prototype prêté à la fois ; aucun pouvoir de Vérité automatique."},
  habilitation_administrative: {kind:"text",label:"Secteur gouvernemental secret",placeholder:"Ex. installations de renseignement ou dépôts sécurisés",help:"Accréditation physique des sites de ce secteur ; les données confidentielles relèvent d’Accès aux registres."},
  acces_aux_registres: {kind:"text",label:"Catégorie de données confidentielles",placeholder:"Police et enquêtes, dossiers médicaux, Logifate…",help:"Choisir une grande catégorie cohérente. L’habilitation ouvre les données, mais ne remplace pas les tests d’interprétation."},
  dossier_institutionnel: {kind:"text",label:"Identité opérationnelle de couverture",placeholder:"Nom, profession de couverture et service répondant",help:"Une couverture officielle active, remplaçable entre deux opérations. Elle ne modifie ni le visage ni les traces déjà découvertes."},
  ministere: {kind:"text",label:"Domaine confidentiel religieux et canal connu",placeholder:"Exorcistes, protection de reliques, dossiers d’incidents…",help:"Connaissances institutionnelles et explications profanes. Aucun passage automatique de Profane à Initié."},
  ordre_religieux: {kind:"text",label:"Discipline et correspondant de l’Ordre",placeholder:"Nom ou fonction du spécialiste, discipline et moyens",help:"Une expertise réelle par scénario ; les apprentissages restent payés avec leurs XP normaux."}
} as const;

export { terraUmbraRealitySkillTalentMap };
export type TerraUmbraCreationLore = typeof terraUmbraCreationLore;
export type TerraUmbraRealitySkillTalentMap = typeof terraUmbraRealitySkillTalentMap;
export type TerraUmbraTalentChoiceSpecs = typeof terraUmbraTalentChoiceSpecs;
