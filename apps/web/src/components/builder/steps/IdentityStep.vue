<script setup lang="ts">
import CharacterGallery from "../../CharacterGallery.vue";
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
    <div class="section-heading builder-heading">
      <div>
        <p class="eyebrow">01 · IDENTITÉ</p>
        <h2>Concept et identité</h2>
      </div>
      <span class="schema-badge">{{ stepDone("identity") ? "complet" : "à compléter" }}</span>
    </div>

    <p class="builder-intro">
      Commencez par la personne avant les chiffres. Le portrait est stocké avec la fiche
      après redimensionnement ; il suivra donc le personnage sur les autres navigateurs.
    </p>

    <div class="identity-layout">
      <aside class="portrait-card">
        <div class="portrait-frame" :class="{ empty: !displayPortrait }">
          <img
            v-if="displayPortrait"
            :src="displayPortrait"
            :alt="`Portrait de ${identityDisplayName || 'personnage'}`"
          />
          <div v-else class="portrait-empty">
            <strong>Portrait</strong>
            <span>Ajoutez une image pour incarner visuellement le personnage.</span>
          </div>
        </div>

        <button class="ghost" type="button" @click="portraitInput?.click()">
          {{ draft.identity.portraitDataUrl ? "Changer le portrait" : "Choisir une image" }}
        </button>
        <input ref="portraitInput" type="file" accept="image/*" hidden @change="setPortrait" />
        <button
          v-if="draft.identity.portraitDataUrl"
          class="ghost danger"
          type="button"
          @click="removePortrait"
        >
          Retirer le portrait
        </button>
        <small>Image redimensionnée à 640 px maximum avant enregistrement.</small>
      </aside>

      <div>
        <div class="identity-grid">
          <label>
            Nom
            <input v-model="draft.identity.name" maxlength="120" />
            <small class="field-help">Le nom principal sous lequel le personnage est identifié.</small>
          </label>
          <label>
            Prénom
            <input v-model="draft.identity.firstName" maxlength="120" />
            <small class="field-help">Le prénom courant du personnage.</small>
          </label>
          <label>
            Alias
            <input v-model="draft.identity.alias" />
            <small class="field-help">Surnom, indicatif, nom de scène, pseudonyme de réseau ou identité utilisée dans certains milieux.</small>
          </label>
          <label>
            Occupation
            <input v-model="draft.identity.occupation" />
            <small class="field-help">Ce que le personnage fait aujourd’hui ; la Sphère et le Style préciseront son milieu et sa pratique de départ.</small>
          </label>
          <label>
            Nationalité
            <input v-model="draft.identity.nationality" maxlength="120" />
          </label>
          <label>
            Âge
            <input v-model="draft.identity.age" />
            <small class="field-help">Âge réel, légal ou apparent si cela a du sens pour le concept.</small>
          </label>
          <label>
            Sexe
            <select v-model="draft.identity.sex">
              <option value="">— Choisir —</option>
              <option>Femme</option><option>Homme</option><option>Non binaire</option><option>Autre</option>
              <option v-if="draft.identity.sex && !['Femme','Homme','Non binaire','Autre'].includes(draft.identity.sex)" :value="draft.identity.sex">{{ draft.identity.sex }}</option>
            </select>
            <small class="field-help">Information descriptive sans conséquence mécanique.</small>
          </label>
          <label>
            Taille
            <input v-model="draft.identity.height" />
            <small class="field-help">Information descriptive ; gardez l’unité qui vous convient.</small>
          </label>
          <label>
            Poids
            <input v-model="draft.identity.weight" />
            <small class="field-help">Information descriptive sans conséquence mécanique.</small>
          </label>
        </div>

        <div class="narrative-grid">
          <label>
            Ce que les autres voient / savent (facultatif)
            <textarea v-model="draft.identity.publicDescription" rows="4" maxlength="2000"></textarea>
            <small class="field-help">Visible par les autres joueurs dans la table en jeu : apparence, attitude, faits connus ou possessions visibles. Gardez vos secrets dans les notes / background.</small>
          </label>
          <label>
            Concept
            <textarea v-model="draft.identity.concept" rows="3"></textarea>
            <small class="field-help">Une phrase qui résume l’idée du personnage : rôle, tempérament, contradiction ou image forte.</small>
          </label>
          <label>
            Objectif
            <textarea v-model="draft.identity.objective" rows="3"></textarea>
            <small class="field-help">Ce que le personnage veut concrètement aujourd’hui : retrouver quelqu’un, gagner une place, payer une dette, comprendre un secret…</small>
          </label>
          <label>
            Notes / background
            <textarea v-model="draft.identity.notes" rows="7"></textarea>
            <small class="field-help">Caractère, apparence, relations, histoire ou événements marquants ; inutile d’écrire une biographie complète avant de jouer.</small>
          </label>
        </div>
      </div>
    </div>
    <CharacterGallery v-if="character" v-model="draft.appearances" layer="reality" :character-id="character.id" :legacy="draft.identity" editable @remove-legacy="removePortrait" />
    <label class="field-help"><input type="checkbox" :checked="draft.social.civicIdentity !== false" @change="draft.social.civicIdentity=($event.target as HTMLInputElement).checked" /> Le personnage possède une identité civique (IDpass et puce citoyenne inclus).</label>
  </article>
</template>
