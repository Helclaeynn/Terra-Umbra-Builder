<script setup lang="ts">
import TruthBuildChoices from "../TruthBuildChoices.vue";
import TruthTrainingChoices from "../TruthTrainingChoices.vue";
import NatureStartGuide from "../NatureStartGuide.vue";
import TruthTalentText from "../TruthTalentText.vue";
import AserynTalentChoices from "../AserynTalentChoices.vue";
import CharacterGallery from "../../CharacterGallery.vue";
import BuilderWikiLink from "../BuilderWikiLink.vue";
import TruthEquipmentPanel from "../TruthEquipmentPanel.vue";
import CorruptionPanel from "../CorruptionPanel.vue";
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
        <p class="eyebrow">{{activeStep === 'truth' ? '07 · NATURE' : '08 · VÉRITÉ'}}</p>
        <h2>{{activeStep === 'truth' ? 'Nature & origines' : 'Talents & équipement de Vérité'}}</h2>
      </div>
      <span class="schema-badge">
        {{ truthPtvRemaining }} / {{ truthRules?.structure.ptvInitial || 0 }} PTV restant
      </span>
    </div>

    <p v-if="activeStep === 'truth'" class="builder-intro">
      La Nature décrit ce que le personnage est réellement derrière le Voile. Les choix
      structurels ouvrent uniquement les branches qui lui appartiennent ; les Traits gratuits
      sont accordés automatiquement et les Talents de Vérité consomment les PTV de création.
    </p>

    <div v-if="!truthRules || !currentTruthState" class="rule-note" :class="{ bad: !supplementalLoading }">
      {{ supplementalLoading ? "Chargement des règles de Vérité…" : "Règles de Vérité indisponibles." }}
    </div>

    <template v-else>
      <section v-if="activeStep === 'truth'" class="truth-picker">
        <div class="truth-picker-grid">
          <label>
            <span>Nature</span>
            <div class="v1-select-shell">
              <select
                :value="currentTruthState.nature"
                @change="setTruthNature(($event.target as HTMLSelectElement).value)"
              >
                <option
                  v-for="nature in Object.values(truthRules.structure.natures)"
                  :key="nature.id"
                  :value="nature.id"
                  :title="nature.description"
                >
                  {{ nature.name }}
                </option>
              </select>
            </div>
          </label>

          <label>
            <span>Conscience</span>
            <div class="v1-select-shell">
              <select
                ref="truthConsciousnessInput"
                :value="currentTruthState.consciousness"
                @change="setTruthConsciousness(($event.target as HTMLSelectElement).value)"
              >
                <option
                  v-for="entry in truthRules.structure.consciousness"
                  :key="entry.id"
                  :value="entry.id"
                  :title="truthConsciousnessHelp(entry.id)"
                >
                  {{ entry.name }}
                </option>
              </select>
            </div>
            <small class="field-help">{{ truthConsciousnessHelp(currentTruthState.consciousness) }}</small>
          </label>
        </div>

        <article v-if="selectedTruthNature" class="truth-nature-summary">
          <div class="truth-nature-summary-copy">
            <p class="eyebrow">NATURE</p>
            <h3>
              <BuilderWikiLink
                :label="selectedTruthNature.name"
                :article-id="selectedTruthNature.compendiumId"
                category="Vérité"
              />
            </h3>
            <p>{{ selectedTruthNature.description }}</p>
            <small v-if="currentTruthState.consciousness === 'profane'">
              Profane : les PTV restent en réserve tant que le personnage n’est pas Initié.
            </small>
            <small v-else>
              Initié : les branches réellement ouvertes par cette Nature sont accessibles.
            </small>
          </div>
          <div class="truth-reserve">
            <strong>{{ truthPtvRemaining }}</strong>
            <span>PTV en réserve</span>
          </div>
        </article>
      </section>

      <NatureStartGuide :state="currentTruthState" />
      <template v-if="selectedTruthNature">
        <template v-if="activeStep === 'truth'">
        <CharacterGallery v-if="character" v-model="draft.appearances" layer="truth" :character-id="character.id" :forms="['garou','khinae'].includes(String(draft.truth.nature))" editable />
        <section v-if="creationTruthChoices.length" class="truth-choice-section">
          <div class="subsection-title">
            <div>
              <h3>Choix structurels</h3>
              <p>Ces choix déterminent les branches, traditions, lignées ou écoles réellement accessibles.</p>
            </div>
            <span class="schema-badge">{{ truthChoicesValid(truthRules,currentTruthState) ? "complet" : "à compléter" }}</span>
          </div>

          <div class="truth-choice-grid">
            <label v-for="choice in creationTruthChoices" :key="choice.key" class="truth-choice-field">
              <span>
                <strong>{{ choice.label }}</strong>
                <small v-if="choice.optional">optionnel</small>
              </span>
              <div class="v1-select-shell">
                <select
                  :value="truthChoiceValue(choice)"
                  @change="setTruthChoice(choice.key,($event.target as HTMLSelectElement).value)"
                >
                  <option v-if="!(choice.optional&&truthChoiceValue(choice)&&resolvedTruthChoiceOptions(choice).some(option=>option.id==='aucune'))" value="">{{ choice.optional ? "— Aucun —" : "— Choisir —" }}</option>
                  <option
                    v-for="option in resolvedTruthChoiceOptions(choice)"
                    :key="option.id"
                    :value="option.id"
                    :title="option.description || ''"
                  >
                    {{ option.name }}
                  </option>
                </select>
              </div>
              <em v-if="selectedTruthChoice(choice)?.description">
                {{ selectedTruthChoice(choice)?.description }}
              </em>
              <em v-if="choice.key === 'dominantAffinity'">Cette Affinité native commence gratuitement en Maîtrise Initiale / Amplitude Mineure et permet une relance de son d10e de magie par scène, en conservant le second résultat. Les autres Affinités restent seulement improvisables en Initiale / Mineure avec +1 niveau de Difficulté tant qu’elles ne sont pas éveillées.</em>
              <em v-else-if="choice.dependsOn && !String(currentTruthState.choices[choice.dependsOn] || '')">
                Choisissez d’abord {{ selectedTruthNature.choices.find(item=>item.key===choice.dependsOn)?.label || choice.dependsOn }}.
              </em>
            </label>
          </div>
        </section>

        <details v-if="truthRevealProfile" class="truth-reveal-section" open>
          <summary class="truth-disclosure-summary"><span><strong>Voile & Révélation</strong><small>Profils de manifestation</small></span><span class="schema-badge">{{ truthRevealProfile.label }}</span></summary>
          <p class="truth-disclosure-intro">
            Chaque état détermine ce que la Nature matérialise réellement et quelles
            capacités peuvent fonctionner. Le profil Révélé remplace toujours le
            Semi-Révélé : les deux ne se cumulent jamais.
          </p>

          <div class="truth-reveal-grid">
            <article
              v-for="stage in (['v','sr','r'] as const)"
              :key="stage"
              class="truth-reveal-card"
            >
              <div class="truth-reveal-head">
                <strong>{{ truthRevealProfile.stages[stage].name }}</strong>
                <span>{{ truthRevealProfile.stages[stage].code }}</span>
              </div>
              <div class="truth-reveal-stats">
                {{ truthRevealProfile.stats[stage] }}
              </div>
              <p>{{ truthRevealProfile.body[stage] }}</p>
              <div
                v-if="truthRevealProfile.stages[stage].traits.length"
                class="truth-reveal-traits"
              >
                <small>Capacités de Nature accessibles</small>
                <span
                  v-for="trait in truthRevealProfile.stages[stage].traits"
                  :key="`${stage}:${trait.name}:${trait.source || ''}`"
                >
                  {{ trait.name }}
                </span>
              </div>
            </article>
          </div>

          <div v-if="truthRevealProfile.vigorAffectsPv" class="rule-note">
            <strong>Vigueur et PV :</strong>
            lorsqu’un état ou une forme modifie la Vigueur, le maximum et les PV actuels
            varient immédiatement de
            {{ truthRevealProfile.rules.vigorPvMultiplier }} × cette variation.
            Changer de forme ne soigne jamais les blessures déjà subies.
          </div>
        </details>

        <details v-if="selectedTruthFreeTraits.length" class="truth-free-section" open>
          <summary class="truth-disclosure-summary"><span><strong>Traits gratuits de Vérité</strong><small>Acquis automatiques de la Nature</small></span><span class="schema-badge">{{ selectedTruthFreeTraits.length }}</span></summary>
          <p class="truth-disclosure-intro">
            Ils découlent directement de la Nature et des choix structurels. Ils ne coûtent aucun PTV.
          </p>

          <div class="truth-free-grid">
            <article
              v-for="trait in selectedTruthFreeTraits"
              :key="`${trait.name}:${trait.source || ''}:${trait.effect}`"
              class="truth-free-card"
            >
              <div class="truth-talent-head">
                <strong>{{ trait.name }}</strong>
                <span>{{ trait.access || "Gratuit" }}</span>
              </div>
              <small v-if="trait.source">{{ trait.source }}</small>
              <p>{{ trait.effect }}</p>
            </article>
          </div>
        </details>

        <TruthBuildChoices v-if="truthHasInnateBuildChoice(currentTruthState)" :state="currentTruthState" :rules="truthRules" talent-id="innate-spectre" @change="setGuidedTruthChoices" />

        </template>
        <template v-else>
        <TruthTrainingChoices :state="currentTruthState" :rules="truthRules" @change="setGuidedTruthChoices" />
        <section class="truth-talents-section">
          <div class="subsection-title">
            <div>
              <h3>Talents de Vérité</h3>
              <p>
                Seuls les Talents compatibles avec la Nature et les choix de la page précédente sont proposés.
                Ouvrez une famille pour consulter ses talents. Les acquisitions déjà payées restent enregistrées si les choix changent.
              </p>
            </div>
            <span class="schema-badge">
              {{ truthPtvSpentValue }} / {{ truthRules.structure.ptvInitial }} PTV
            </span>
          </div>

          <div v-if="currentTruthState.consciousness === 'profane'" class="rule-note">
            <strong>Profane :</strong> aucun Talent de Vérité n’est achetable. Les PTV restent disponibles
            tant que le personnage n’est pas Initié.
          </div>
          <div v-if="selectedTruthTalents.length" class="truth-selected-recap" aria-label="Talents de Vérité sélectionnés">
            <h4>Talents acquis · {{ selectedTruthTalents.length }}</h4>
            <div class="truth-owned-list">
              <article v-for="talent in selectedTruthTalents" :key="talent.id" class="truth-owned-card">
              <small v-if="truthRules&&currentTruthState&&[...truthUnavailableHunters(truthRules,currentTruthState),...khinaeUnavailable(truthRules,currentTruthState),...vampireUnavailable(truthRules,currentTruthState)].includes(talent.id)" class="rule-note bad">Acquisition conservée et payée ; indisponible avec les choix ou prérequis actuels.</small>
                <div><strong>{{ talent.name }}</strong><span>{{ talent.cost }} PTV</span></div>
                <p>{{ talent.effect }}</p>
                <button type="button" :aria-label="`Retirer ${talent.name}`" @click="toggleTruthTalent(talent)">Retirer</button>
                <button v-if="truthBuildChoiceLabel(currentTruthState,talent.id)" type="button" :data-configure-talent="talent.id" @click="configuredTruthTalent=configuredTruthTalent===talent.id?'':talent.id">{{truthBuildChoiceLabel(currentTruthState,talent.id)}}</button>
                <TruthBuildChoices v-if="configuredTruthTalent===talent.id" :state="currentTruthState" :rules="truthRules" :talent-id="talent.id" @change="setGuidedTruthChoices" />
              </article>
            </div>
          </div>

          <div
            v-if="!truthChoicesValid(truthRules,currentTruthState)"
            class="rule-note bad"
          >
            Complétez d’abord les choix structurels obligatoires de cette Nature.
          </div>

          <section v-else class="truth-available-catalog" aria-label="Catalogue des Talents de Vérité">
            <h4>Ajouter des Talents</h4>
            <p>Dépensez vos PTV dans les Talents accessibles à votre personnage. Vos acquis sont regroupés au-dessus.</p>
            <label class="truth-search">
              Rechercher dans les Talents accessibles
              <input
                v-model="truthSearch"
                type="search"
                placeholder="Nom, groupe, effet, prérequis…"
              />
            </label>

            <div v-if="!visibleTruthGroups.length" class="rule-note">
              Aucun Talent ne correspond aux choix actuels ou à la recherche.
            </div>

            <details
              v-for="group in visibleTruthGroups"
              :key="group.name"
              class="truth-group"
            >
              <summary>
                <span>
                  <strong>{{ group.name }}</strong>
                  <small><template v-if="group.couche">{{ group.couche }} · </template>{{ group.items.length }} Talent{{ group.items.length > 1 ? "s" : "" }}</small>
                </span>
              </summary>

              <p v-if="!group.items.length" class="rule-note">Tous les Talents de cette catégorie sont déjà acquis. Choisissez une autre catégorie pour continuer.</p>
              <div v-else class="truth-talent-grid">
                <div
                  v-for="talent in group.items"
                  :key="talent.id"
                  class="truth-talent-entry"
                >
                  <button
                    type="button"
                    class="truth-talent-card"
                    :class="{ selected: truthTalentSelected(talent.id) }"
                    :disabled="!truthTalentSelected(talent.id) && !truthTalentCanAdd(talent)"
                    @click="toggleTruthTalent(talent)"
                  >
                    <div class="truth-talent-head">
                      <strong>{{ talent.name }}</strong>
                      <span>{{ talent.cost }} PTV</span>
                    </div>
                    <div class="truth-talent-meta">
                      <span v-if="talent.voie && truthVoieStep(talent.voie)" class="truth-voie-step" data-voie-step>{{ truthVoieStep(talent.voie) }}</span>
                      <span v-if="talent.access">{{ talent.access }}</span>
                      <span v-if="talent.prerequisiteName">
                        Prérequis : {{ talent.prerequisiteName }}
                        <template v-if="!truthTalentPrereqOk(talent)"> · non rempli</template>
                      </span>
                    </div>
                    <em v-if="talent.runtimeLore&&!talent.effectDetails">{{ talent.runtimeLore }}</em>
                    <small v-if="talent.activation">{{talent.activation}}</small><p><b>Effet :</b> {{ talent.effect }}</p>
                    <small v-if="!truthTalentCanAdd(talent)">{{ !truthTalentPrereqOk(talent) ? 'Prérequis manquants — voir les conditions ci-dessous' : 'PTV disponibles insuffisants' }}</small>
                    <span v-else>Ajouter ce Talent</span>
                  </button>
                  <div v-if="!truthTalentPrereqOk(talent)" class="rule-note bad" data-truth-prerequisites>
                    <strong>Conditions à remplir avant l’achat</strong>
                    <ul><li v-for="issue in truthPrerequisiteIssues(truthRules,currentTruthState,talent)" :key="issue">{{ issue }}</li></ul>
                  </div>
                  <button v-if="truthBuildChoiceLabel(currentTruthState,talent.id)" type="button" class="secondary" :data-configure-talent="talent.id" @click="configuredTruthTalent=configuredTruthTalent===talent.id?'':talent.id">{{truthBuildChoiceLabel(currentTruthState,talent.id)}}</button>
                  <TruthBuildChoices v-if="configuredTruthTalent===talent.id" :state="currentTruthState" :rules="truthRules" :talent-id="talent.id" @change="setGuidedTruthChoices" />
                  <TruthTalentText v-if="talent.effectDetails" :effect="talent.effect" :details="talent.effectDetails" :lore="talent.runtimeLore" :activation="talent.activation" :show-summary="false" />
                </div>
              </div>
            </details>
          </section>
        </section>

        <AserynTalentChoices :state="currentTruthState" @change="setTruthChoice" />
        <TruthEquipmentPanel
          v-if="currentTruthState.truthEquipment.length || truthRules.equipment.some(item=>!item.referenceOnly && truthEquipmentAccess(item,currentTruthState!).ok)"
          :model-value="currentTruthState"
          :rules="truthRules"
          @update:model-value="writeTruthState($event)"
        />

        <CorruptionPanel v-if="!campaignRewardsLocked || currentTruthState.corruptionMjAuthorized" :rewards-locked="campaignRewardsLocked"
          :model-value="currentTruthState"
          :rules="truthRules"
          :integrity="derivedStats.integrity"
          :ptv-remaining="truthPtvRemaining"
          @update:model-value="writeTruthState($event)"
          @request-initiation="focusTruthConsciousness"
        />

        </template>
        <div class="rule-note" :class="{ bad: !stepDone(activeStep) }">
          <strong v-if="stepDone(activeStep)">Vérité cohérente.</strong>
          <strong v-else>Vérité à compléter.</strong>
          {{ truthPtvRemaining }} PTV restent disponibles à la création.
        </div>
      </template>
    </template>
  </article>
</template>
