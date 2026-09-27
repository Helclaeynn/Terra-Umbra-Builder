<script setup lang="ts">
import { ref, watch } from "vue";
import { api } from "../lib/api";

type Portrait = { lot: string; media: string; visibility: "mj" | "public" };
const props = defineProps<{ articleId: string }>();
const portraits = ref<Portrait[]>([]);
const busy = ref(false);
const error = ref("");
const notice = ref("");
const uploadVisibility = ref<"mj" | "public">("public");
const emit = defineEmits<{ change: [portraits: Portrait[]] }>();
const endpoint = () => `/api/admin/compendium-quality/${encodeURIComponent(props.articleId)}/portraits`;
watch(() => props.articleId, async () => {
  error.value = "";
  try { portraits.value = (await api<{ portraits: Portrait[] }>(endpoint())).portraits; }
  catch { error.value = "Impossible de charger les portraits."; }
}, { immediate: true });
async function setVisibility(portrait: Portrait, visibility: "mj" | "public") {
  busy.value = true; error.value = ""; notice.value = "";
  try {
    portraits.value = (await api<{ portraits: Portrait[] }>(endpoint(), {
      method: "PATCH", body: JSON.stringify({ src: portrait.media, visibility })
    })).portraits;
    notice.value = "Visibilité enregistrée.";
    emit("change", portraits.value);
  } catch { error.value = "La visibilité n’a pas été enregistrée."; }
  finally { busy.value = false; }
}
async function upload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  busy.value = true; error.value = ""; notice.value = "";
  try {
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    portraits.value = (await api<{ portraits: Portrait[] }>(endpoint(), {
      method: "POST", body: JSON.stringify({ data, visibility: uploadVisibility.value })
    })).portraits;
    notice.value = "Portrait ajouté.";
    emit("change", portraits.value);
  } catch { error.value = "Le portrait n’a pas été ajouté (JPG, PNG ou WebP, 15 Mo maximum)."; }
  finally { busy.value = false; input.value = ""; }
}
function src(value: string) { return value.startsWith("/api/") ? value : `/api/compendium/media/${value.replace(/^\/+/, "")}`; }
</script>

<template>
  <section class="portrait-admin">
    <strong>Visibilité des portraits</strong>
    <p v-if="!portraits.length">Aucun portrait sur cette fiche. Vous pouvez en ajouter un ci-dessous.</p>
    <div v-for="portrait in portraits" :key="portrait.media" class="portrait-row">
      <img :src="src(portrait.media)" alt="Aperçu du portrait" loading="lazy" />
      <div>
        <small>{{ portrait.lot === 'fiche' ? 'Portrait de la fiche' : portrait.lot === 'ajout' ? 'Portrait ajouté' : `Archive · ${portrait.lot}` }}</small>
        <div class="portrait-actions" role="group" aria-label="Visibilité du portrait">
          <button type="button" :aria-pressed="portrait.visibility === 'public'" :disabled="busy" @click="setVisibility(portrait, 'public')">All</button>
          <button type="button" :aria-pressed="portrait.visibility === 'mj'" :disabled="busy" @click="setVisibility(portrait, 'mj')">MJ uniquement</button>
        </div>
      </div>
    </div>
    <label class="portrait-upload">Ajouter un portrait
      <select v-model="uploadVisibility"><option value="public">All</option><option value="mj">MJ only</option></select>
      <input type="file" accept="image/jpeg,image/png,image/webp" :disabled="busy" @change="upload" />
    </label>
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-if="notice" role="status">{{ notice }}</p>
  </section>
</template>

<style scoped>
.portrait-admin{padding:12px;border:1px solid #38556b;border-radius:8px;background:#0b1c2b;color:#ecf4ff;text-align:left}.portrait-admin>strong{display:block;margin-bottom:8px}.portrait-row{display:flex;align-items:center;gap:12px;margin:10px 0}.portrait-row img{width:78px;height:78px;object-fit:contain;border-radius:5px;background:#132638}.portrait-row small{display:block;margin-bottom:8px}.portrait-actions{display:flex;gap:8px}.portrait-actions button,.portrait-upload select{padding:6px 10px;border:1px solid #6486a1;border-radius:5px;background:#142a3d;color:#fff;cursor:pointer}.portrait-actions button[aria-pressed="true"]{background:#276d64;border-color:#72cbb3;font-weight:700}.portrait-actions button:disabled{opacity:.5;cursor:default}.portrait-upload{display:grid;gap:8px;margin-top:16px;font-size:14px}.portrait-upload input{max-width:100%}
</style>
