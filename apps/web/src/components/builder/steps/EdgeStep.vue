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
        <p class="eyebrow">10 · EDGE</p>
        <h2>Edge</h2>
      </div>
      <span class="schema-badge">{{ edgeRemaining }} restant / {{ edgeTotal }}</span>
    </div>

    <p class="builder-intro">
      Vous commencez avec {{ edgeRules?.base || 5 }} Edge, plus 1 par Désavantage.
      Ce qui n’est pas dépensé à la création reste disponible en jeu. L’Edge ne peut jamais acheter de PTV.
    </p>

    <div v-if="!edgeRules" class="rule-note bad">Règles Edge indisponibles.</div>

    <template v-else>
      <div class="edge-grid">
        <section v-for="option in edgeOptionUi" :key="option.key" class="edge-card">
          <div class="edge-card-head">
            <strong>{{ option.label }}</strong>
            <span>{{ Number(draft.edge[option.key] || 0) }}/{{ edgeRules.options[option.key]?.max || 0 }}</span>
          </div>
          <em>{{ edgeRules.lore[option.key]?.lore }}</em>
          <p>{{ edgeRules.lore[option.key]?.mechanic }}</p>
          <div v-if="edgeOptionResult(option.key)" class="edge-result">
            {{ edgeOptionResult(option.key) }}
          </div>
          <div class="stepper">
            <button
              type="button"
              :aria-label="`Retirer un achat ${option.label}`"
              :disabled="edgePurchaseMinusDisabled(option.key)"
              @click="changeEdgePurchase(option.key,-1)"
            >−</button>
            <strong>{{ Number(draft.edge[option.key] || 0) }}</strong>
            <button
              type="button"
              :aria-label="`Acheter ${option.label}`"
              :disabled="edgePurchasePlusDisabled(option.key)"
              @click="changeEdgePurchase(option.key,1)"
            >+</button>
          </div>
        </section>
      </div>

      <div v-if="hasUnknownDisadvantage" class="rule-note">
        <strong>Inconnu :</strong> Renommée initiale 0 et achat de Renommée interdit à la création.
      </div>
      <div v-if="hasRenownedTalent" class="rule-note">
        <strong>Renommé :</strong> la Renommée initiale est déjà fixée à 2 ; acheter +1 Renommée par Edge serait sans effet.
      </div>

      <section v-if="Number(draft.edge.attributePack || 0) > 0" class="edge-allocation">
        <div class="subsection-title">
          <div>
            <h3>Attribuer les +2 Attributs</h3>
            <p>Ces points sont séparés du budget de base de 22 et le plafond final reste 7.</p>
          </div>
          <span class="schema-badge">{{ edgeAttributePointsUsed }}/{{ edgeAttributeBudget }}</span>
        </div>
        <div class="edge-five-grid">
          <div v-for="attribute in rules.attributes" :key="attribute.id" class="edge-alloc-card">
            <div class="edge-card-head">
              <strong>{{ attribute.name }}</strong>
              <span>{{ finalAttribute(attribute.id) }}/7</span>
            </div>
            <p>{{ lore.attribute[attribute.id] }}</p>
            <div class="stepper">
              <button type="button" :aria-label="`Retirer un point Edge en ${attribute.name}`" @click="changeEdgeAttribute(attribute.id,-1)">−</button>
              <strong>+{{ Number(draft.edgeAttributes[attribute.id] || 0) }}</strong>
              <button type="button" :aria-label="`Ajouter un point Edge en ${attribute.name}`" @click="changeEdgeAttribute(attribute.id,1)">+</button>
            </div>
          </div>
        </div>
      </section>

      <section v-if="Number(draft.edge.skillPacks || 0) > 0" class="edge-allocation">
        <div class="subsection-title">
          <div>
            <h3>Attribuer les points de Compétence Edge</h3>
            <p>{{ draft.edge.skillPacks }} achat(s) donnent {{ edgeSkillBudget }} points, sans dépasser 5 brut.</p>
          </div>
          <span class="schema-badge">{{ edgeSkillPointsUsed }}/{{ edgeSkillBudget }}</span>
        </div>

        <details
          v-for="attribute in rules.attributes"
          :key="attribute.id"
          class="edge-skill-group"
          :open="edgeSkillPointsForAttribute(attribute.id) > 0"
        >
          <summary>
            <span>
              <strong>{{ attribute.name }}</strong>
              <small>Compétences liées à cet Attribut</small>
            </span>
            <span class="schema-badge">{{ edgeSkillPointsForAttribute(attribute.id) }} Edge</span>
          </summary>
          <div class="edge-five-grid">
            <div
              v-for="skill in edgeSkillsForAttribute(attribute.id)"
              :key="skill.id"
              class="edge-alloc-card"
            >
              <div class="edge-card-head">
                <strong>{{ skill.name }}</strong>
                <span>{{ skillRaw(skill.id) }}/5</span>
              </div>
              <p>{{ lore.skill[skill.id] }}</p>
              <div class="stepper">
                <button type="button" :aria-label="`Retirer un point Edge en ${skill.name}`" @click="changeEdgeSkill(skill.id,-1)">−</button>
                <strong>+{{ Number(draft.skills[skill.id]?.edge || 0) }}</strong>
                <button type="button" :aria-label="`Ajouter un point Edge en ${skill.name}`" @click="changeEdgeSkill(skill.id,1)">+</button>
              </div>
            </div>
          </div>
        </details>
      </section>

      <section v-if="Number(draft.edge.talentPacks || 0) > 0" class="edge-allocation">
        <div class="subsection-title">
          <div>
            <h3>Choisir les Talents achetés avec Edge</h3>
            <p>Une Expertise achetée avec Edge n’est pas limitée aux familles du Style.</p>
          </div>
          <span class="schema-badge">
            {{ draft.talents.edge.filter(Boolean).length }}/{{ draft.edge.talentPacks }}
          </span>
        </div>

        <TalentSelector
          v-for="(_,index) in draft.talents.edge"
          :key="index"
          :label="`Talent Edge ${index + 1}`"
          placeholder="— Choisir un Talent —"
          :groups="edgeTalentGroupsFor(index)"
          category-picker
          :model-value="draft.talents.edge[index] || ''"
          :selected-lore="talentNarrative(talentById(draft.talents.edge[index] || ''))"
          :choice-spec="talentChoiceSpec(draft.talents.edge[index] || '')"
          :choice-value="talentChoiceValue(draft.talents.edge[index] || '')"
          :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.edge[index] || ''))"
          @update:model-value="setEdgeTalent(index,$event)"
          @update:choice-value="setTalentChoice(draft.talents.edge[index] || '', $event)"
        />
      </section>

      <div class="rule-note" :class="{ bad: !stepDone('edge') }">
        <strong>Edge conservé : {{ edgeRemaining }}.</strong>
        <template v-if="!stepDone('edge')">
          Terminez les allocations correspondant aux achats effectués et corrigez les incompatibilités éventuelles.
        </template>
        <template v-else>
          Le reliquat pourra notamment servir à Forcer le Destin ou Échapper au Destin.
        </template>
      </div>
    </template>
  </article>
</template>
