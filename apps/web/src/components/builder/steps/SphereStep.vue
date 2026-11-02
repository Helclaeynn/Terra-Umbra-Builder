<script setup lang="ts">
import BuilderWikiLink from "../BuilderWikiLink.vue";
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
        <p class="eyebrow">03 · SPHÈRE & STYLE</p>
        <h2>Sphère actuelle & Style</h2>
      </div>
      <span class="schema-badge">Style {{ stylePointsUsed }}/5</span>
    </div>

    <p class="builder-intro">
      La Sphère décrit le milieu dans lequel vous vivez et travaillez aujourd’hui.
      Elle pose cinq Compétences fixes à +1. Le Style décrit votre pratique de départ
      et fournit cinq points guidés à répartir.
    </p>

    <div class="rule-note">
      <strong>Sphère ≠ Origine :</strong> l’Origine raconte d’où vous venez ; la Sphère raconte
      où vous vivez et travaillez aujourd’hui. <strong>Style ≠ classe :</strong> il décrit votre
      pratique de départ mais ne vous enferme pas dans une progression. L’Enveloppe augmentique
      d’un Style représente ce qui a déjà pu être investi dans le corps avant le scénario 1 :
      ce n’est pas de l’argent liquide.
    </div>

    <div class="choice-grid">
      <div v-for="(sphere,id) in rules.spheres" :key="id" class="choice-card-shell">
        <button
          type="button"
          class="choice-card sphere-card"
          :class="{ selected: draft.creation.sphere === id }"
          @click="selectSphere(String(id))"
        >
          <strong>{{ sphere.name }}</strong>
          <span>{{ lore.sphere[String(id)] }}</span>
          <small><b>5 points fixes :</b> {{ sphere.fixedSkills.map((skill)=>skillName(skill)+" +1").join(" · ") }}</small>
          <small><b>Appui :</b> {{ sphere.support }}</small>
        </button>
        <div class="choice-card-wiki">
          <BuilderWikiLink :label="sphere.name" :article-id="sphere.compendiumId" compact>
            <span>Compendium</span>
          </BuilderWikiLink>
        </div>
      </div>
    </div>

    <template v-if="selectedSphere">
      <div class="subsection">
        <h3>Choisir le Style</h3>
        <div class="choice-grid">
          <div v-for="style in styleOptions" :key="style.id" class="choice-card-shell">
            <button
              type="button"
              class="choice-card style-card"
              :class="{ selected: draft.creation.style === style.id }"
              @click="selectStyle(style.id)"
            >
              <strong>{{ style.name }}</strong>
              <span>{{ lore.style[style.id] }}</span>
              <small>
                <b>Train de vie :</b> {{ style.lifestyle }} · <b>Compte :</b> {{ formatMoney(style.account) }}
                · <b>Augmentique :</b> {{ formatMoney(style.augmentationEnvelope) }}
                <template v-if="style.vehicleCapital"> · <b>Véhicule :</b> {{ formatMoney(style.vehicleCapital) }}</template>
              </small>
            </button>
            <div class="choice-card-wiki">
              <BuilderWikiLink :label="style.name" :article-id="style.compendiumId" compact>
                <span>Compendium</span>
              </BuilderWikiLink>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedStyle" class="subsection">
        <div class="subsection-title">
          <div>
            <h3>Répartir les 5 points du Style</h3>
            <p>Maximum +2 dans une même Compétence. Le brut de création ne peut pas dépasser 5.</p>
          </div>
          <span class="schema-badge">{{ stylePointsUsed }}/5</span>
        </div>

        <div class="allocator-grid">
          <div v-for="skillId in selectedStyle.skills" :key="skillId" class="allocator-card">
            <div class="allocator-copy">
              <strong>{{ skillName(skillId) }}</strong>
              <small>Brut actuel {{ skillRaw(skillId) }}/5</small>
              <p>{{ lore.skill[skillId] }}</p>
            </div>
            <div class="allocator-point-line">
              <span>Points du Style</span>
              <div class="stepper">
                <button type="button" :aria-label="`Retirer un point de Style en ${skillName(skillId)}`" @click="changeStylePoint(skillId,-1)">−</button>
                <strong>{{ draft.skills[skillId]?.style || 0 }}</strong>
                <button type="button" :aria-label="`Ajouter un point de Style en ${skillName(skillId)}`" @click="changeStylePoint(skillId,1)">+</button>
              </div>
            </div>
          </div>
        </div>

        <div class="rule-note">
          <strong>Expertises autorisées :</strong>
          {{ selectedStyle.expertiseFamilies.map(attributeName).join(" / ") }}
          <br />
          <strong>Appui de Sphère :</strong> {{ selectedSphere.support }}
        </div>
      </div>
    </template>
  </article>
</template>
