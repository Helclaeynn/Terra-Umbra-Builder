<script setup lang="ts">
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
        <p class="eyebrow">05 · COMPÉTENCES</p>
        <h2>Compétences libres</h2>
      </div>
      <span class="schema-badge" role="status">{{ freeSkillBudget - freeSkillPointsUsed }} points restants · {{ freeSkillPointsUsed }} / {{ freeSkillBudget }}</span>
    </div>

    <p class="builder-intro">
      Les cinq points fixes de Sphère et les cinq points de Style sont déjà intégrés.
      Répartissez ici uniquement les {{ rules.creation.skills.freePoints }} points libres.
      Les éventuels points achetés avec Edge sont affichés dans les valeurs mais se répartissent
      à l’étape Edge. Le Brut ne peut pas dépasser {{ rules.creation.skills.rawMax }} à la création.
    </p>

    <div v-if="!selectedStyle" class="rule-note bad">
      Choisissez d’abord une Sphère et un Style.
    </div>

    <template v-else>
      <div v-if="edgeSkillBudget > 0" class="rule-note">
        <strong>Edge déjà acheté :</strong> {{ edgeSkillPointsUsed }} / {{ edgeSkillBudget }}
        point{{ edgeSkillBudget > 1 ? "s" : "" }} attribué{{ edgeSkillPointsUsed > 1 ? "s" : "" }}.
        Cette enveloppe sera modifiable uniquement au bloc Edge.
      </div>

      <details
        v-for="(attribute,index) in rules.attributes"
        :key="attribute.id"
        class="skill-family skill-group"
        :open="skillGroupIsOpen(attribute.id,index)"
        @toggle="setSkillGroupOpen(attribute.id,$event)"
      >
        <summary>
          <span>
            <strong>{{ attribute.name }}</strong>
            <small>{{ rules.skills.filter((item)=>item.attribute===attribute.id).length }} Compétences</small>
          </span>
          <span class="schema-badge">{{ skillFreePointsForAttribute(attribute.id) }} point{{ skillFreePointsForAttribute(attribute.id) > 1 ? 's' : '' }} attribué{{ skillFreePointsForAttribute(attribute.id) > 1 ? 's' : '' }} ici</span>
        </summary>
        <div class="skill-grid">
          <div
            v-for="skill in rules.skills.filter((item)=>item.attribute===attribute.id)"
            :key="skill.id"
            class="skill-card"
          >
            <div class="skill-head">
              <strong>{{ skill.name }}</strong>
              <span>
                {{ skillRaw(skill.id) }}/{{ rules.creation.skills.rawMax }}
                <template v-if="skillTalentBonus(skill.id)"> · final {{ skillFinal(skill.id) }}</template>
              </span>
            </div>

            <p class="skill-lore">{{ lore.skill[skill.id] }}</p>

            <div class="skill-free-line">
              <span>Points libres</span>
              <div class="stepper">
                <button type="button" :aria-label="`Retirer un point libre en ${skill.name}`" @click="changeFreeSkillPoint(skill.id,-1)">−</button>
                <strong>{{ draft.skills[skill.id]?.free || 0 }}</strong>
                <button type="button" :aria-label="`Ajouter un point libre en ${skill.name}`" @click="changeFreeSkillPoint(skill.id,1)">+</button>
              </div>
            </div>
          </div>
        </div>
      </details>

      <div class="rule-note" :class="{ bad: freeSkillPointsUsed !== freeSkillBudget }">
        <strong v-if="freeSkillPointsUsed === freeSkillBudget">
          Tous les points libres sont répartis.
        </strong>
        <strong v-else-if="freeSkillPointsUsed < freeSkillBudget">
          Il reste {{ freeSkillBudget - freeSkillPointsUsed }} point{{ freeSkillBudget - freeSkillPointsUsed > 1 ? "s" : "" }} libre{{ freeSkillBudget - freeSkillPointsUsed > 1 ? "s" : "" }}.
        </strong>
        <strong v-else>
          Budget dépassé de {{ freeSkillPointsUsed - freeSkillBudget }}.
        </strong>
      </div>
    </template>
  </article>
</template>
