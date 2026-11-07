<script setup lang="ts">
import TalentSelector from "../TalentSelector.vue";
import { useBuilder } from "../../../lib/character-builder";

const {
  route, progressionMode, character, campaignRewardsLocked, draft, rules, lore, talentChoiceSpecs, skillTalentMap, disadvantages, disadvantageLore,
  edgeRules, truthRules, realityRules, disadvantageCategory, disadvantagePick, truthSearch, skillGroupOpen, loading, supplementalLoading, saving,
  error, notice, baseline, activeStep, reviewedOptionalSteps, sheetReturnStep, knowledgeOpen, stepNavigationOpen, knowledgeTrigger, knowledgeDrawer,
  portraitInput, displayPortrait, truthConsciousnessInput, sections, activeStepIndex, previousBuilderStep, nextBuilderStep, goToBuilderStep,
  toggleCharacterSheet, edgeOptionUi, dirty, identityDisplayName, selectedSphere, selectedStyle, styleOptions, originTalents, sphereTalents,
  expertiseTalents, commonTalents, stylePointsUsed, freeSkillPointsUsed, freeSkillBudget, skillFreePointsForAttribute, skillGroupIsOpen,
  setSkillGroupOpen, edgeSkillPointsUsed, edgeSkillBudget, attributeTotal, attributeBudget, edgeAttributePointsUsed, edgeAttributeBudget,
  disadvantageCategories, visibleDisadvantages, availableDisadvantages, disadvantageFamily, selectedDisadvantageInFamily, disadvantagePreview,
  edgeTotal, edgePurchaseKeys, edgePurchaseCost, edgeSpent, edgeRemaining, hasUnknownDisadvantage, hasRenownedTalent, hasRenownContactTalent,
  currentTruthState, exileActiveIds, selectedTruthNature, availableTruthTalents, selectedTruthFreeTraits, truthRevealProfile, truthPtvSpentValue,
  truthPtvRemaining, creationTruthChoices, truthGroupOptions, selectedTruthTalents, visibleTruthGroups, edgeTalentGroups, humanError, skillName,
  attributeName, talentById, talentNarrative, talentChoiceSpec, talentChoiceValue, setTalentChoice, talentChoiceOptions, talentChoiceValid, setTalent,
  selectedRealityTalentIds, skillTalentBonus, skillFinal, disadvantageNarrative, disadvantageById, disadvantagesCompatible, edgeTalentValid,
  edgePurchaseDisabled, edgePurchasePlusDisabled, edgePurchaseMinusDisabled, edgeOptionResult, edgeSkillPointsForAttribute, edgeSkillsForAttribute,
  selectedDisadvantageItems, finalAttribute, skillPermanent, ownedRealityTalentIds, derivedStats, realityState, realityItems, realityEconomyValue,
  lifestyleBaseValue, lifestylePressureValue, augmentationLoadValue, requiredLanguageCount, socialLanguages, selectedNpcContact, socialValidation,
  equipmentValidation, formatMoney, validationReasons, creationStepIds, creationValidationMap, finalValidationStatuses, progressionSkillBases,
  progressionSkillFinalBases, progressionAttributeBases, truthConsciousnessName, originNameValue, sphereNameValue, styleNameValue, renownScore,
  campaignCashValue, pdfInput, characterSheet, knowledgeRefs, knowledgeGroups, navigateFromFinalization, builderProgress, stepDone, loadCharacter,
  saveCharacter, readImage, loadImage, canvasData, resizePortrait, setPortrait, removePortrait, selectOrigin, selectOriginTalent,
  resetStyleAllocations, selectSphere, selectStyle, sphereFixed, skillRaw, changeStylePoint, changeFreeSkillPoint, writeTruthState, setTruthNature,
  setTruthConsciousness, focusTruthConsciousness, truthConsciousnessHelp, setTruthChoice, configuredTruthTalent, setGuidedTruthChoices, setExileBuild,
  setBeneficiaryBenefits, setExtralBuild, setAngelusBuild, setDaemonBuild, setMageTechniques, truthChoiceValue, resolvedTruthChoiceOptions,
  selectedTruthChoice, truthTalentSelected, truthTalentPrereqOk, truthTalentCanAdd, toggleTruthTalent, toggleDisadvantage, addDisadvantagePick,
  trimEdgeTalentSlots, changeEdgePurchase, changeEdgeAttribute, changeEdgeSkill, setEdgeTalent, edgeTalentGroupsFor, changeAttribute, beforeUnload,
  confirmBuilderLeave, handleBuilderKeydown, phoneQuery, isPhone, syncPhone, usePageTitle, truthUnavailableHunters, vampireUnavailable,
  vampireNativeBlood, isKhinae, khinaeNativeBlood, khinaeUnavailable, truthBuildChoiceLabel, truthHasInnateBuildChoice, exileOwnedItems,
  exileUsableTalents, normalizeExileBuild, normalizeBeneficiaryBenefits, normalizeExtralBuild, extralOwnedItems, truthKnownTalents,
  normalizeAngelusBuild, normalizeDaemonBuild, normalizeMageTechniques, appearanceGallery, permanentSkillBonus, pruneBenefits, uniqueTalents,
  computeRenown, builderDraftFingerprint, normalizeBuilderDraft, reconcileBuilderSave, compareTruthTalents, api, ApiError, characterDerivedStats,
  augmentationAccess, augmentationCopyCount, augmentationLoad, augmentationMaxCopies, augmentationSupportSatisfied, ensureRealityState, neuroCapacity,
  priceSelectionValid, realityEconomic, realityItemMap, realityLifestyleBase, realityPriceSpec, lifestylePressure, syncRealityTalentBenefits,
  campaignCash, ensureProgression, ensureTruthRulesPackage, truthAvailableTalents, truthChoiceOptions, truthChoicesValid, truthCreationGroups,
  truthVoieStep, truthPrerequisiteSatisfied, truthPrerequisiteIssues, truthEquipmentAccess, truthPermanentAttributeBonus, truthPtvSpent,
  truthRevelationProfile, truthSanitizeChoices, truthSanitizeCorruptionTalents, truthSanitizeTalents, truthCorruptionPrerequisiteSatisfied,
  truthEquipmentInvalidIds, truthSelectedFreeTraits, buildCharacterSheet
} = useBuilder();
</script>

<template>
  <article v-if="draft && character && rules && lore" class="panel builder-card">
    <div class="section-heading">
      <div>
        <p class="eyebrow">06 · TALENTS</p>
        <h2>Talents de Réalité</h2>
      </div>
      <span class="schema-badge">{{ stepDone("talents") ? "complet" : "à compléter" }}</span>
    </div>

    <p class="builder-intro">
      Choisissez un Talent gratuit pour chacune des quatre provenances de création.
      Pour l’Expertise, choisissez un seul Talent au total parmi les deux familles ouvertes par votre Style.
      Les précisions et choix secondaires sont enregistrés avec la fiche.
    </p>

    <div v-if="!draft.creation.origin || !draft.creation.sphere || !selectedStyle" class="rule-note bad">
      Choisissez d’abord Origine, Sphère et Style.
    </div>

    <template v-else>
      <TalentSelector
        label="Talent d’Origine"
        placeholder="— Choisir le Talent d’Origine —"
        :groups="[{ label: `Origine — ${rules.origins[draft.creation.origin]?.name || ''}`, items: originTalents }]"
        :model-value="draft.talents.origin"
        :selected-lore="talentNarrative(talentById(draft.talents.origin))"
        :choice-spec="talentChoiceSpec(draft.talents.origin)"
        :choice-value="talentChoiceValue(draft.talents.origin)"
        :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.origin))"
        @update:model-value="setTalent('origin',$event)"
        @update:choice-value="setTalentChoice(draft.talents.origin,$event)"
      />

      <TalentSelector
        label="Talent de Sphère"
        placeholder="— Choisir le Talent de Sphère —"
        :groups="[{ label: `Sphère — ${rules.spheres[draft.creation.sphere]?.name || ''}`, items: sphereTalents }]"
        :model-value="draft.talents.sphere"
        :selected-lore="talentNarrative(talentById(draft.talents.sphere))"
        :choice-spec="talentChoiceSpec(draft.talents.sphere)"
        :choice-value="talentChoiceValue(draft.talents.sphere)"
        :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.sphere))"
        @update:model-value="setTalent('sphere',$event)"
        @update:choice-value="setTalentChoice(draft.talents.sphere,$event)"
      />

      <section class="expertise-talent-section" aria-label="Talent d’Expertise">
        <h3>Talent d’Expertise · 1 seul choix</h3>
        <p>Choisissez un seul Talent parmi ces deux familles. Un nouveau choix remplace le précédent, même dans l’autre famille.</p>
        <TalentSelector
          label="Talent d’Expertise"
          placeholder="— Choisir une Expertise —"
          :groups="selectedStyle.expertiseFamilies.map((attribute)=>({
            label: attributeName(attribute),
            items: expertiseTalents.filter((talent)=>talent.attribute===attribute)
          }))"
          :model-value="draft.talents.expertise"
          :selected-lore="talentNarrative(talentById(draft.talents.expertise))"
          :choice-spec="talentChoiceSpec(draft.talents.expertise)"
          :choice-value="talentChoiceValue(draft.talents.expertise)"
          :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.expertise))"
          @update:model-value="setTalent('expertise',$event)"
          @update:choice-value="setTalentChoice(draft.talents.expertise,$event)"
        />
      </section>

      <TalentSelector
        label="Talent Commun"
        placeholder="— Choisir un Talent Commun —"
        :groups="[{ label: 'Communs', items: commonTalents }]"
        :model-value="draft.talents.common"
        :selected-lore="talentNarrative(talentById(draft.talents.common))"
        :choice-spec="talentChoiceSpec(draft.talents.common)"
        :choice-value="talentChoiceValue(draft.talents.common)"
        :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.common))"
        @update:model-value="setTalent('common',$event)"
        @update:choice-value="setTalentChoice(draft.talents.common,$event)"
      />

      <div v-if="draft.talents.expertise === 'neurodriver' && skillRaw('neurodive') < 1" class="rule-note bad">
        Neurodriver exige Neurodive 1+.
      </div>

      <div v-if="Number(draft.edge.talentPacks || 0) > 0" class="rule-note">
        <strong>Talents achetés avec Edge :</strong>
        ils restent enregistrés dans la fiche importée et seront configurés nativement à l’étape Edge.
      </div>
    </template>
  </article>
</template>
