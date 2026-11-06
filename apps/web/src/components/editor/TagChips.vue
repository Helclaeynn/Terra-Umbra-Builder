<script setup lang="ts">
// Tags en pastilles : Entrée ou virgule pour ajouter, croix pour retirer.
import { ref } from "vue";

const props = defineProps<{ modelValue: string[]; label: string; tone: "public" | "verite" | "mj"; hint?: string }>();
const emit = defineEmits<{ (event: "update:modelValue", value: string[]): void }>();
const draft = ref("");

function add() {
  const tags = draft.value.split(/[,;]+/).map((tag) => tag.trim()).filter(Boolean);
  draft.value = "";
  const next = [...props.modelValue];
  for (const tag of tags) if (!next.includes(tag)) next.push(tag);
  if (next.length !== props.modelValue.length) emit("update:modelValue", next);
}

function remove(tag: string) {
  emit("update:modelValue", props.modelValue.filter((item) => item !== tag));
}

function onKey(event: KeyboardEvent) {
  if (event.key === "Enter" || event.key === ",") { event.preventDefault(); add(); }
  else if (event.key === "Backspace" && !draft.value && props.modelValue.length) {
    remove(props.modelValue[props.modelValue.length - 1]);
  }
}
</script>

<template>
  <div class="tag-chips" :class="tone">
    <span class="tag-chips-label" :title="hint">{{ label }}</span>
    <span v-for="tag in modelValue" :key="tag" class="chip">
      {{ tag }}<button type="button" :aria-label="`Retirer ${tag}`" @click="remove(tag)">×</button>
    </span>
    <input v-model="draft" :aria-label="`Ajouter un tag : ${label}`" placeholder="Ajouter…" @keydown="onKey" @blur="add" />
  </div>
</template>

<style scoped>
.tag-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 6px 8px; border: 1px solid var(--c-line); border-radius: 6px; background: var(--c-surface); }
.tag-chips-label { font-size: 12px; color: var(--c-muted); margin-right: 4px; min-width: 64px; }
.chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 4px 2px 10px; border-radius: 999px; font-size: 13px; border: 1px solid; }
.chip button { background: none; border: 0; color: inherit; cursor: pointer; font-size: 15px; line-height: 1; padding: 0 4px; min-height: 0; }
.public .chip { color: #cfe3f5; border-color: #3d6a8a; background: var(--c-relief); }
.verite .chip { color: var(--c-reality-soft); border-color: var(--c-reality-deep); background: var(--c-relief); }
.mj .chip { color: var(--c-truth-soft); border-color: #615078; background: var(--c-truth-bg); }
.tag-chips input { flex: 1; min-width: 90px; background: transparent; border: 0; color: var(--c-text); padding: 4px; outline: none; }
</style>
