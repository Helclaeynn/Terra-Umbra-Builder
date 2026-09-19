<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

type Character = {
  id: string;
  name: string;
  data: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
};

type Revision = {
  revision: number;
  name: string;
  reason: string;
  createdAt: string;
};

const characters = ref<Character[]>([]);
const selected = ref<Character | null>(null);
const revisions = ref<Revision[]>([]);
const newName = ref("");
const editName = ref("");
const loading = ref(false);
const notice = ref("");
const error = ref("");

const hasCharacters = computed(() => characters.value.length > 0);

function humanError(code: string): string {
  const labels: Record<string, string> = {
    invalid_character_name: "Le nom du personnage doit contenir entre 1 et 120 caractères.",
    invalid_character_version: "La version du personnage est invalide.",
    character_version_conflict: "Ce personnage a été modifié ailleurs. Recharge sa fiche avant de réessayer.",
    character_not_found: "Ce personnage n’existe plus ou ne t’appartient pas.",
    character_create_failed: "La création du personnage a échoué.",
    character_update_failed: "La sauvegarde du personnage a échoué.",
    character_archive_failed: "L’archivage du personnage a échoué.",
    revision_not_found: "Cette révision n’existe plus.",
    character_restore_failed: "La restauration a échoué."
  };
  return labels[code] ?? "Une erreur est survenue.";
}

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...options,
    credentials: "same-origin",
    headers
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? `http_${response.status}`);
  return body as T;
}

function setSelected(character: Character | null) {
  selected.value = character;
  editName.value = character?.name ?? "";
  revisions.value = [];
  if (character) void loadRevisions(character.id);
}

async function loadCharacters() {
  loading.value = true;
  error.value = "";
  try {
    const result = await api<{ characters: Character[] }>("/api/characters");
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
  const name = newName.value.trim();
  if (!name) return;

  loading.value = true;
  notice.value = "";
  error.value = "";
  try {
    const result = await api<{ character: Character }>("/api/characters", {
      method: "POST",
      body: JSON.stringify({ name, data: {} })
    });
    newName.value = "";
    await loadCharacters();
    const created = characters.value.find((item) => item.id === result.character.id) ?? result.character;
    setSelected(created);
    notice.value = "Personnage créé et sauvegardé.";
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  } finally {
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
  <article class="panel characters-panel">
    <div class="section-heading">
      <div>
        <p class="eyebrow">MES PERSONNAGES</p>
        <h2>Fiches sauvegardées</h2>
      </div>
      <span class="character-count">{{ characters.length }}</span>
    </div>

    <form class="character-create" @submit.prevent="createCharacter">
      <input
        v-model="newName"
        aria-label="Nom du nouveau personnage"
        placeholder="Nom du nouveau personnage"
        maxlength="120"
        required
      />
      <button class="secondary" :disabled="loading" type="submit">
        Créer
      </button>
    </form>

    <div v-if="notice || error" class="character-feedback" :class="{ error: !!error }">
      {{ error || notice }}
    </div>

    <div v-if="!hasCharacters && !loading" class="characters-empty">
      <p>Aucun personnage pour le moment.</p>
      <small>Crée ta première fiche : elle sera stockée directement dans PostgreSQL.</small>
    </div>

    <div v-else class="characters-layout">
      <nav class="character-list" aria-label="Mes personnages">
        <button
          v-for="character in characters"
          :key="character.id"
          type="button"
          :class="{ active: selected?.id === character.id }"
          @click="setSelected(character)"
        >
          <strong>{{ character.name }}</strong>
          <small>v{{ character.version }} · {{ formatDate(character.updatedAt) }}</small>
        </button>
      </nav>

      <section v-if="selected" class="character-detail">
        <div class="character-detail-head">
          <div>
            <p class="eyebrow">FICHE #{{ selected.version }}</p>
            <h3>{{ selected.name }}</h3>
          </div>
          <div class="character-detail-actions">
            <a class="ghost compact builder-link" :href="`/builder/?character=${selected.id}`">
              Ouvrir le Builder
            </a>
            <button class="ghost compact danger" type="button" :disabled="loading" @click="archiveCharacter">
              Archiver
            </button>
          </div>
        </div>

        <form class="rename-form" @submit.prevent="saveName">
          <label>
            Nom du personnage
            <input v-model="editName" maxlength="120" required />
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
          <strong>Fiche de personnage</strong>
          <p>
            La sauvegarde serveur est opérationnelle. Le Builder TUC sera branché ici
            pour enregistrer directement l’intégralité de la fiche dans ce personnage.
          </p>
        </div>

        <div class="revision-block">
          <div class="revision-title">
            <h4>Historique</h4>
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
  padding: 1.5rem;
}

.character-count {
  min-width: 2rem;
  min-height: 2rem;
  display: grid;
  place-items: center;
  border: 1px solid rgba(199, 173, 120, .22);
  color: #c7ad78;
  font-size: .8rem;
}

.character-create {
  grid-template-columns: 1fr auto;
  margin-bottom: 1rem;
}

.character-feedback {
  margin-bottom: 1rem;
  padding: .65rem .8rem;
  border: 1px solid rgba(92, 142, 99, .28);
  color: #b8d2b6;
  background: rgba(49, 80, 54, .14);
  font-size: .82rem;
}

.character-feedback.error {
  border-color: rgba(166, 81, 72, .3);
  color: #dab0aa;
  background: rgba(93, 42, 37, .16);
}

.characters-empty {
  min-height: 190px;
  display: grid;
  place-content: center;
  text-align: center;
  color: #8f897f;
}

.characters-empty p {
  margin: 0 0 .4rem;
  color: #cfc6b6;
}

.characters-layout {
  display: grid;
  grid-template-columns: minmax(170px, .72fr) minmax(0, 1.28fr);
  min-height: 340px;
  border-top: 1px solid rgba(255, 255, 255, .07);
}

.character-list {
  padding: .7rem .7rem .7rem 0;
  border-right: 1px solid rgba(255, 255, 255, .07);
}

.character-list button {
  width: 100%;
  display: grid;
  gap: .25rem;
  padding: .75rem;
  border: 0;
  border-left: 2px solid transparent;
  text-align: left;
  color: #bcb4a7;
  background: transparent;
}

.character-list button:hover,
.character-list button.active {
  border-left-color: #a17d45;
  background: rgba(161, 125, 69, .08);
}

.character-list strong,
.character-list small {
  display: block;
}

.character-list small {
  color: #746f67;
  font-size: .7rem;
}

.character-detail {
  padding: 1rem 0 0 1.2rem;
}

.character-detail-head,
.revision-title,
.revision-list article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .8rem;
}

.character-detail h3 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 1.5rem;
  font-weight: 500;
}

.character-detail-actions {
  display: flex;
  align-items: center;
  gap: .55rem;
  flex-wrap: wrap;
}

.builder-link {
  text-decoration: none;
}

.danger {
  color: #ca948b;
}

.rename-form {
  margin-top: 1.2rem;
}

.builder-slot {
  margin-top: 1.3rem;
  padding: 1rem;
  border: 1px dashed rgba(199, 173, 120, .2);
  color: #8f897f;
  line-height: 1.55;
}

.builder-slot strong {
  color: #cfc5b3;
}

.builder-slot p {
  margin: .4rem 0 0;
}

.revision-block {
  margin-top: 1.4rem;
}

.revision-title h4 {
  margin: 0;
  font-size: .95rem;
}

.revision-title small {
  color: #716c64;
}

.revision-list {
  margin-top: .6rem;
}

.revision-list article {
  padding: .65rem 0;
  border-top: 1px solid rgba(255, 255, 255, .06);
}

.revision-list strong,
.revision-list small {
  display: block;
}

.revision-list strong {
  color: #bbb3a6;
  font-size: .78rem;
}

.revision-list small {
  margin-top: .2rem;
  color: #716c64;
  font-size: .68rem;
}

.current-revision {
  color: #9fba9d;
  font-size: .72rem;
}

@media (max-width: 720px) {
  .characters-layout {
    grid-template-columns: 1fr;
  }

  .character-list {
    display: flex;
    gap: .4rem;
    overflow-x: auto;
    padding-right: 0;
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, .07);
  }

  .character-list button {
    min-width: 180px;
  }

  .character-detail {
    padding-left: 0;
  }
}
</style>
