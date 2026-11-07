<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { confirmRequest, dialogHost } from "../lib/confirm-dialog";

const dialog = ref<HTMLDialogElement | null>(null);
const confirmButton = ref<HTMLButtonElement | null>(null);

watch(confirmRequest, async (request) => {
  await nextTick();
  if (!dialog.value) return;
  if (request && !dialog.value.open) {
    dialog.value.showModal();
    // Sur une action risquée, le bouton sûr (Annuler) a le focus.
    if (!request.danger) confirmButton.value?.focus();
  } else if (!request && dialog.value.open) dialog.value.close();
});

onMounted(() => { dialogHost.mounted = typeof dialog.value?.showModal === "function"; });
onUnmounted(() => { dialogHost.mounted = false; });

function answer(ok: boolean) {
  const request = confirmRequest.value;
  confirmRequest.value = null;
  request?.resolve(ok);
}
</script>

<template>
  <dialog ref="dialog" class="tu-confirm" aria-labelledby="tu-confirm-title" @cancel.prevent="answer(false)">
    <template v-if="confirmRequest">
      <h2 id="tu-confirm-title">{{ confirmRequest.title ?? "Confirmer" }}</h2>
      <p>{{ confirmRequest.message }}</p>
      <div class="tu-confirm-actions">
        <button type="button" class="ghost" @click="answer(false)">{{ confirmRequest.cancel ?? "Annuler" }}</button>
        <button ref="confirmButton" type="button" :class="confirmRequest.danger ? 'danger' : 'primary'" @click="answer(true)">
          {{ confirmRequest.confirm ?? "Confirmer" }}
        </button>
      </div>
    </template>
  </dialog>
</template>

<style scoped>
.tu-confirm {
  width: min(440px, calc(100vw - 32px)); padding: 20px 22px; border: 1px solid var(--c-line-strong); border-radius: 10px;
  background: var(--c-surface); color: var(--c-text); box-shadow: 0 24px 60px rgba(0, 0, 0, .55);
}
.tu-confirm::backdrop { background: color-mix(in srgb, var(--c-night) 75%, transparent); }
.tu-confirm h2 { margin: 0 0 8px; font: 600 18px var(--font-title); }
.tu-confirm p { margin: 0 0 18px; color: var(--c-text-soft); line-height: 1.5; white-space: pre-line; }
.tu-confirm-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
.tu-confirm-actions button { min-height: 40px; padding: 8px 16px; border-radius: 6px; font: 600 14px var(--font-text); cursor: pointer; }
.tu-confirm-actions .ghost { border: 1px solid var(--c-line-strong); background: transparent; color: var(--c-text-soft); }
.tu-confirm-actions .primary { border: 1px solid var(--c-reality); background: var(--c-reality); color: var(--c-night); }
.tu-confirm-actions .danger { border: 1px solid var(--c-danger); background: color-mix(in srgb, var(--c-danger) 22%, var(--c-surface)); color: var(--c-text); }
.tu-confirm-actions button:focus-visible { outline: 2px solid var(--c-reality); outline-offset: 2px; }
@media (prefers-reduced-motion: no-preference) { .tu-confirm[open] { animation: tu-confirm-in .18s ease-out; } }
@keyframes tu-confirm-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
</style>
