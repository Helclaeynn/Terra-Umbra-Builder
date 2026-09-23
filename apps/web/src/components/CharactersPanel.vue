<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { api } from "../lib/api";
import type { Character, Revision } from "../types/character";

const router = useRouter();
type CharacterListItem=Omit<Character,"data">;
const characters = ref<CharacterListItem[]>([]);
const selected = ref<CharacterListItem | null>(null);
const revisions = ref<Revision[]>([]);
const editName = ref("");
const loading = ref(false);
const creating = ref(false);
const notice = ref("");
const error = ref("");
const importInput = ref<HTMLInputElement | null>(null);

const hasCharacters = computed(() => characters.value.length > 0);

function humanError(code: string): string {
  const labels: Record<string, string> = {
    invalid_character_name: "Le nom du personnage doit contenir entre 1 et 120 caractères.",
    invalid_character_version: "La version du personnage est invalide.",
    character_version_conflict: "Ce personnage a été modifié ailleurs. Recharge sa fiche avant de réessayer.",
    character_not_found: "Ce personnage n’existe plus ou ne t’appartient pas.",
    character_create_failed: "La création du personnage a échoué.",
    invalid_v1_character: "Ce fichier n’est pas un export JSON compatible du Builder V1.",
    character_import_failed: "L’import du personnage a échoué.",
    character_update_failed: "La sauvegarde du personnage a échoué.",
    character_archive_failed: "L’archivage du personnage a échoué.",
    revision_not_found: "Cette révision n’existe plus.",
    character_restore_failed: "La restauration a échoué."
  };
  return labels[code] ?? "Une erreur est survenue.";
}

function setSelected(character: CharacterListItem | null) {
  selected.value = character;
  editName.value = character?.name ?? "";
  revisions.value = [];
  if (character) void loadRevisions(character.id);
}

async function loadCharacters() {
  loading.value = true;
  error.value = "";
  try {
    const result = await api<{ characters: CharacterListItem[] }>("/api/characters?summary=1");
    characters.value = result.characters;

    if (selected.value) {
      const refreshed = result.characters.find((item) => item.id === selected.value?.id) ?? null;
      setSelected(refreshed);
    } else if (result.characters.length > 0) {
      setSelected(result.characters[0]);
    }
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  } finally {
    loading.value = false;
  }
}

async function createCharacter() {
  loading.value = true;
  creating.value = true;
  notice.value = "";
  error.value = "";
  try {
    const result = await api<{ character: Character }>("/api/characters", {
      method: "POST",
      body: JSON.stringify({})
    });
    await router.push(`/characters/${result.character.id}/builder`);
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  } finally {
    loading.value = false;
    creating.value = false;
  }
}

async function importV1Character(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  loading.value = true;
  notice.value = "";
  error.value = "";

  try {
    if (file.size > 1024 * 1024) throw new Error("invalid_character_data");
    const parsed = JSON.parse(await file.text()) as Record<string, unknown>;
    const result = await api<{ character: Character }>("/api/characters/import-v1", {
      method: "POST",
      body: JSON.stringify({ data: parsed })
    });
    await loadCharacters();
    const imported =
      characters.value.find((item) => item.id === result.character.id) ?? result.character;
    setSelected(imported);
    notice.value = `« ${result.character.name} » importé depuis le Builder V1.`;
  } catch (cause) {
    const code =
      cause instanceof SyntaxError ? "invalid_v1_character" : (cause as Error).message;
    error.value = humanError(code);
  } finally {
    input.value = "";
    loading.value = false;
  }
}

async function saveName() {
  if (!selected.value) return;
  const name = editName.value.trim();
  if (!name || name === selected.value.name) return;

  loading.value = true;
  notice.value = "";
  error.value = "";
  try {
    const result = await api<{ character: Character }>(`/api/characters/${selected.value.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name,
        version: selected.value.version
      })
    });
    selected.value = result.character;
    editName.value = result.character.name;
    await loadCharacters();
    notice.value = "Personnage sauvegardé.";
  } catch (cause) {
    error.value = humanError((cause as Error).message);
    if ((cause as Error).message === "character_version_conflict") {
      await loadCharacters();
    }
  } finally {
    loading.value = false;
  }
}

async function archiveCharacter() {
  if (!selected.value) return;
  if (!confirm(`Archiver « ${selected.value.name} » ? La fiche disparaîtra de la liste active mais son historique restera conservé.`)) {
    return;
  }

  loading.value = true;
  notice.value = "";
  error.value = "";
  try {
    await api(`/api/characters/${selected.value.id}`, {
      method: "DELETE",
      body: JSON.stringify({ version: selected.value.version })
    });
    selected.value = null;
    revisions.value = [];
    await loadCharacters();
    notice.value = "Personnage archivé.";
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  } finally {
    loading.value = false;
  }
}

async function loadRevisions(id: string) {
  try {
    const result = await api<{ revisions: Revision[] }>(`/api/characters/${id}/revisions`);
    if (selected.value?.id === id) revisions.value = result.revisions;
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  }
}

async function restoreRevision(revision: Revision) {
  if (!selected.value) return;
  if (!confirm(`Restaurer la révision ${revision.revision} (« ${revision.name} ») ? Une nouvelle révision sera créée, l’historique existant sera conservé.`)) {
    return;
  }

  loading.value = true;
  notice.value = "";
  error.value = "";
  try {
    const result = await api<{ character: Character }>(
      `/api/characters/${selected.value.id}/revisions/${revision.revision}/restore`,
      { method: "POST" }
    );
    selected.value = result.character;
    editName.value = result.character.name;
    await loadCharacters();
    await loadRevisions(result.character.id);
    notice.value = `Révision ${revision.revision} restaurée.`;
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  } finally {
    loading.value = false;
  }
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function reasonLabel(reason: string): string {
  if (reason === "created") return "Création";
  if (reason === "saved") return "Sauvegarde";
  if (reason === "archived") return "Archivage";
  if (reason === "imported") return "Import";
  if (reason.startsWith("restored:")) return `Restauration de #${reason.split(":")[1]}`;
  return reason;
}

onMounted(loadCharacters);
</script>

<template>
  <article id="characters" class="panel characters-panel" aria-labelledby="characters-title" :aria-busy="loading">
    <div class="section-heading">
      <div>
        <p class="eyebrow">MES PERSONNAGES</p>
        <h2 id="characters-title">Fiches sauvegardées</h2>
      </div>
      <span class="character-count">{{ characters.length }}</span>
    </div>

    <div class="character-entry-actions">
      <button class="primary character-create-direct" :disabled="loading" type="button" @click="createCharacter">
        {{ creating ? "Création…" : "Créer un personnage" }}
      </button>

      <button class="ghost import-v1" type="button" :disabled="loading" @click="importInput?.click()">
        Importer un JSON V1
      </button>
      <input
        ref="importInput"
        type="file"
        accept=".json,application/json"
        hidden
        aria-label="Choisir un export JSON V1"
        @change="importV1Character"
      />
    </div>

    <div v-if="notice || error" class="character-feedback" :class="{ error: !!error }" :role="error ? 'alert' : 'status'">
      {{ error || notice }}
    </div>

    <div v-if="!hasCharacters && !loading" class="characters-empty">
      <p>Aucun personnage pour le moment.</p>
      <small>Crée ta première fiche pour la retrouver ici et la reprendre à tout moment.</small>
    </div>

    <p v-else-if="!hasCharacters" class="characters-loading" role="status">Chargement de tes personnages…</p>

    <div v-else class="characters-layout">
      <nav class="character-list" aria-label="Mes personnages">
        <button
          v-for="character in characters"
          :key="character.id"
          type="button"
          :class="{ active: selected?.id === character.id }"
          :aria-pressed="selected?.id === character.id"
          :disabled="loading"
          @click="setSelected(character)"
        >
          <strong>{{ character.name }}</strong><small>{{ character.campaignName?`Campagne · ${character.campaignName}`:'Fiche hors campagne' }}</small>
          <small>v{{ character.version }} · {{ formatDate(character.updatedAt) }}</small>
        </button>
      </nav>

      <section v-if="selected" class="character-detail">
        <div class="character-detail-head">
          <div>
            <p class="eyebrow">FICHE #{{ selected.version }}</p>
            <h3>{{ selected.name }}</h3><p v-if="selected.campaignName">Version indépendante · {{ selected.campaignName }}</p>
          </div>
          <div class="character-detail-actions">
            <RouterLink class="primary compact builder-link" :to="`/characters/${selected.id}/sheet`">Voir la fiche actuelle</RouterLink>
            <RouterLink class="ghost compact builder-link" :to="`/characters/${selected.id}/builder`">
              Ouvrir le Builder
            </RouterLink>
            <RouterLink class="ghost compact builder-link" :to="`/characters/${selected.id}/progression`">
              Progression
            </RouterLink>
            <RouterLink class="ghost compact builder-link" :to="`/characters/${selected.id}/journal`">Journal d’aventure</RouterLink>
            <RouterLink class="ghost compact builder-link" :to="`/characters/${selected.id}/history`">Historique de progression</RouterLink>
            <button class="ghost compact danger" type="button" :disabled="loading" @click="archiveCharacter">
              Archiver
            </button>
          </div>
        </div>

        <form class="rename-form" @submit.prevent="saveName">
          <label>
            Nom du personnage
            <input v-model="editName" maxlength="120" autocomplete="off" required />
          </label>
          <button
            class="secondary"
            type="submit"
            :disabled="loading || !editName.trim() || editName.trim() === selected.name"
          >
            Sauvegarder le nom
          </button>
        </form>

        <div class="builder-slot">
          <div>
            <span>BUILDER V2</span>
            <strong>Fiche active · version {{ selected.version }}</strong>
          </div>
          <p>
            La création se modifie dans le Builder. Une fois la fiche en jeu, les dépenses XP/PTV
            et l’évolution du personnage se suivent dans l’espace Progression.
          </p>
        </div>

        <div class="revision-block">
          <div class="revision-title">
            <h4>Sauvegardes et restauration</h4>
            <small>{{ revisions.length }} révision{{ revisions.length > 1 ? "s" : "" }}</small>
          </div>

          <div class="revision-list">
            <article v-for="revision in revisions" :key="revision.revision">
              <div>
                <strong>#{{ revision.revision }} · {{ revision.name }}</strong>
                <small>{{ reasonLabel(revision.reason) }} · {{ formatDate(revision.createdAt) }}</small>
              </div>
              <button
                v-if="revision.revision !== selected.version"
                class="ghost compact"
                type="button"
                :disabled="loading"
                @click="restoreRevision(revision)"
              >
                Restaurer
              </button>
              <span v-else class="current-revision">Actuelle</span>
            </article>
          </div>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
.characters-panel {
  min-width: 0;
  padding: clamp(22px, 3vw, 36px);
  scroll-margin-top: 100px;
  border: 1px solid #293f55;
  border-radius: 8px;
  color: #e8f0ff;
  background: #0c1725;
  box-shadow: none;
  font-family: Inter, "Segoe UI", sans-serif;
}

.characters-panel .section-heading { align-items: center; }
.characters-panel h2 { color: #edf4ff; font-family: inherit; font-size: clamp(22px, 2vw, 28px); font-weight: 650; letter-spacing: -.035em; }
.characters-panel .eyebrow { color: #8edff5; font: 600 11px/1.5 "SFMono-Regular", Consolas, monospace; letter-spacing: .14em; }
.characters-panel :is(button, a, input):focus-visible { outline: 2px solid #85e6ff; outline-offset: 4px; }
.characters-panel :is(.primary, .secondary, .ghost) { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; padding: 11px 16px; border: 1px solid #35536e; border-radius: 6px; color: #cedef0; background: #0c1725; font-size: 14px; line-height: 1.4; text-align: center; }
.characters-panel .primary { color: #071522; border-color: #a4edff; background: #a4edff; }
.characters-panel .primary:not(:disabled):hover { border-color: #c2f3ff; background: #c2f3ff; }
.characters-panel :is(.secondary, .ghost):not(:disabled):hover { color: #fff; border-color: #80d4ee; background: #142739; }
.characters-panel .danger { color: #ffafb9; border-color: #724453; }
.character-count { min-width: 36px; min-height: 36px; flex: none; display: grid; place-items: center; border: 1px solid #355c74; border-radius: 6px; color: #a4edff; background: #112539; font-size: 14px; }
.character-entry-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
.character-feedback { margin-bottom: 20px; padding: 14px 18px; border: 1px solid #375f69; border-radius: 6px; color: #c5f4e8; background: #112d32; font-size: 14px; line-height: 1.6; }
.character-feedback.error { border-color: #845063; color: #ffd3da; background: #321c2b; }
.characters-empty { min-height: 180px; display: grid; align-content: center; gap: 10px; padding: 24px; border: 1px dashed #35536e; border-radius: 8px; color: #a4b8cf; background: #09131f; text-align: center; }
.characters-empty p { margin: 0; color: #e8f0ff; font-size: 18px; }
.characters-empty small { font-size: 14px; line-height: 1.7; }
.characters-loading { padding: 24px 0; color: #a4b8cf; font-size: 15px; }
.characters-layout { display: grid; grid-template-columns: minmax(210px, .65fr) minmax(0, 1.65fr); min-height: 300px; gap: 28px; border-top: 1px solid #293f55; }
.character-list { min-width: 0; max-height: 560px; overflow-y: auto; padding: 20px 18px 20px 0; border-right: 1px solid #293f55; scrollbar-width: thin; scrollbar-color: #35536e transparent; }
.character-list button { width: 100%; min-height: 70px; display: grid; gap: 7px; margin-bottom: 8px; padding: 15px; border: 1px solid transparent; border-radius: 6px; text-align: left; color: #c5d7ec; background: transparent; overflow-wrap: anywhere; }
.character-list button:hover { border-color: #35536e; background: #102337; }
.character-list button.active { border-color: #477895; background: #132b40; box-shadow: inset 3px 0 #85e6ff; }
.character-list strong { font-size: 16px; line-height: 1.5; }
.character-list small { color: #a4b8cf; font-size: 12px; line-height: 1.5; }
.character-detail { min-width: 0; padding: 24px 0 0; }
.character-detail-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 18px 24px; }
.character-detail-head > div:first-child { min-width: 0; flex: 1 1 220px; }
.character-detail h3 { margin: 0; color: #edf4ff; font-family: inherit; font-size: 25px; line-height: 1.2; font-weight: 650; letter-spacing: -.025em; overflow-wrap: anywhere; }
.character-detail-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.builder-link { text-decoration: none; }
.rename-form { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 12px; margin-top: 28px; }
.rename-form label { min-width: 0; color: #c8d8e9; font-size: 14px; gap: 8px; }
.rename-form input { min-width: 0; min-height: 46px; border: 1px solid #35536e; border-radius: 6px; color: #e8f0ff; background: #09121e; }
.rename-form input:focus { border-color: #85e6ff; box-shadow: 0 0 0 3px #85e6ff1f; }
.builder-slot { display: grid; gap: 10px; margin-top: 26px; padding: 18px; border: 1px solid #304b65; border-radius: 6px; color: #b6cade; background: #0e1d2d; line-height: 1.7; }
.builder-slot > div { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; }
.builder-slot span { color: #8edff5; font: 11px/1.5 Consolas, monospace; letter-spacing: .1em; }
.builder-slot strong { color: #e0edff; font-size: 14px; }
.builder-slot p { margin: 0; font-size: 14px; }
.revision-block { margin-top: 30px; }
.revision-title { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; }
.revision-title h4 { margin: 0; color: #e8f0ff; font-size: 17px; }
.revision-title small { color: #a4b8cf; font-size: 12px; }
.revision-list { margin-top: 14px; max-height: 390px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #35536e transparent; }
.revision-list article { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 4px 16px 0; border-top: 1px solid #263d54; }
.revision-list article > div { min-width: 0; }
.revision-list strong, .revision-list small { display: block; overflow-wrap: anywhere; }
.revision-list strong { color: #cfdef0; font-size: 14px; line-height: 1.5; }
.revision-list small { margin-top: 5px; color: #a4b8cf; font-size: 12px; line-height: 1.5; }
.revision-list button { flex: none; }
.current-revision { flex: none; padding: 6px 9px; border: 1px solid #355c74; border-radius: 4px; color: #a4edff; font-size: 12px; }

@media (max-width: 1000px) {
  .characters-layout { grid-template-columns: minmax(180px, .7fr) minmax(0, 1.3fr); gap: 22px; }
  .rename-form { grid-template-columns: 1fr; }
  .rename-form button { justify-self: start; }
}

@media (max-width: 720px) {
  .characters-panel { padding: 22px; scroll-margin-top: 20px; }
  .characters-layout { grid-template-columns: 1fr; gap: 0; }
  .character-list { display: flex; gap: 10px; max-height: none; overflow-x: auto; padding: 16px 0; border-right: 0; border-bottom: 1px solid #293f55; }
  .character-list button { flex: 0 0 210px; margin-bottom: 0; }
  .character-detail { padding-top: 22px; }
  .character-detail h3 { font-size: 23px; }
  .character-detail-actions { width: 100%; }
  .character-detail-actions > * { flex: 1 1 auto; }
  .character-entry-actions > *, .rename-form button { width: 100%; }
  .revision-list article { flex-wrap: wrap; }
  .revision-list article > div { flex: 1 1 160px; }
}
</style>
