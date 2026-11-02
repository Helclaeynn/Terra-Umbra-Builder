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
        <p class="eyebrow">09 · DÉSAVANTAGES</p>
        <h2>Désavantages</h2>
      </div>
      <span class="schema-badge">{{ draft.disadvantages.length }}/3 · Edge {{ edgeTotal }}</span>
    </div>

    <p class="builder-intro">
      Les Désavantages sont facultatifs, de 0 à 3, avec <strong>un seul Désavantage par famille</strong>. Chacun rapporte +1 Edge, mais doit
      représenter une faiblesse ou une complication qui peut réellement peser dans la fiction.
    </p>

    <div v-if="!disadvantages" class="rule-note bad">Catalogue indisponible.</div>

    <template v-else>
      <div class="disadvantage-controls">
        <label>
          <span>Famille de Désavantage</span>
          <select v-model="disadvantageCategory" @change="disadvantagePick=''">
            <option v-for="category in disadvantageCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </label>

        <label>
          <span>Désavantage</span>
          <div class="v1-select-shell">
            <select v-model="disadvantagePick" :disabled="draft.disadvantages.length >= 3 || Boolean(selectedDisadvantageInFamily)" aria-describedby="disadvantage-family-help">
              <option value="">— Choisir —</option>
              <option
                v-for="item in availableDisadvantages"
                :key="item.id"
                :value="item.id"
                :title="`Ambiance : ${disadvantageNarrative(item)}\nMécanique : ${item.effect}`"
              >
                {{ item.name }}
              </option>
            </select>
          </div>
        </label>

        <button
          class="secondary compact disadvantage-add"
          type="button"
          :disabled="!disadvantagePick || draft.disadvantages.length >= 3"
          @click="addDisadvantagePick"
        >
          Ajouter le Désavantage
        </button>
      </div>

      <p id="disadvantage-family-help" class="rule-note" role="status">
        <template v-if="selectedDisadvantageInFamily">
          <strong>{{ selectedDisadvantageInFamily.name }}</strong> occupe déjà cette famille : un seul Désavantage par famille est autorisé.
          Retirez-le pour choisir un autre Désavantage de cette famille, ou changez de famille.
        </template>
        <template v-else>Un seul Désavantage par famille est autorisé : Communs, Sphère, ou Faiblesse d’un même Attribut.</template>
      </p>

      <article v-if="disadvantagePreview" class="choice-preview">
        <div>
          <strong>{{ disadvantagePreview.name }}</strong>
          <span>Prévisualisation — pas encore ajouté</span>
        </div>
        <em>{{ disadvantageNarrative(disadvantagePreview) }}</em>
        <p><b>Effet mécanique :</b> {{ disadvantagePreview.effect }}</p>
      </article>

      <div v-if="draft.disadvantages.length" class="selected-disadvantage-list">
        <article
          v-for="item in selectedDisadvantageItems()"
          :key="`${item.sphere || item.category}:${item.id}`"
          class="selected-disadvantage-card"
        >
          <div class="selected-disadvantage-head">
            <div>
              <strong>{{ item.name }}</strong>
              <small v-if="item.category === 'sphere'">Sphère — {{ selectedSphere?.name || item.sphere }}</small>
              <small v-else-if="item.category === 'attribute'">Faiblesse de {{ attributeName(item.attribute || "") }}</small>
              <small v-else>Commun</small>
            </div>
            <button class="ghost danger compact" type="button" @click="toggleDisadvantage(item.id)">
              Retirer
            </button>
          </div>
          <em>{{ disadvantageNarrative(item) }}</em>
          <p><b>Effet mécanique :</b> {{ item.effect }}</p>
          <BuilderWikiLink :label="item.name" :article-id="item.compendiumId" category="Règles" compact>
            <span>Compendium</span>
          </BuilderWikiLink>
        </article>
      </div>
      <div v-else class="disadvantage-empty">
        Aucun Désavantage choisi.
      </div>

      <div v-if="!disadvantagesCompatible()" class="rule-note bad">
        Une combinaison choisie se neutralise ou est incompatible avec un Talent :
        vérifiez notamment Résistance/Sensible à la chaleur ou au froid, Brave/Lâche
        et Neurodriver/Unsinkable.
      </div>
    </template>
  </article>
</template>
