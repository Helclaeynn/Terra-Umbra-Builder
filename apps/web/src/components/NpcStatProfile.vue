<script setup lang="ts">
import { computed } from "vue";
import { profileBlockKind, profileTableRows, type NpcProfileBlock } from "../lib/npc-stat-profile";

const props = defineProps<{
  blocks: NpcProfileBlock[];
  // Use the article's existing escaped/linkified renderer; never interpolate raw HTML.
  renderInline: (text: string) => string;
}>();

const presentation = computed(() => props.blocks.map(block => ({
  block,
  kind: profileBlockKind(block),
  rows: profileTableRows(block)
})));
</script>

<template>
  <div class="npc-stat-profile">
    <div
      v-for="(item, blockIndex) in presentation"
      :key="blockIndex"
      class="npc-profile-block"
      :data-profile-block-index="blockIndex"
      :data-profile-kind="item.kind"
    >
      <p
        v-if="item.kind === 'paragraph'"
        :class="['npc-profile-paragraph', String(item.block.style || '')]"
        v-html="renderInline(String(item.block.text ?? ''))"
      ></p>

      <template v-else-if="item.kind === 'attributes'">
        <div class="npc-profile-labels">
          <h4><span data-profile-source-cell="0:0" v-html="renderInline(item.rows[0][0])"></span></h4>
          <span class="npc-profile-column-label" data-profile-source-cell="1:0" v-html="renderInline(item.rows[1][0])"></span>
        </div>
        <dl class="npc-profile-attributes">
          <div v-for="(name, column) in item.rows[0].slice(1)" :key="column" class="npc-profile-attribute">
            <dt><span :data-profile-source-cell="`0:${column + 1}`" v-html="renderInline(name)"></span></dt>
            <dd><span :data-profile-source-cell="`1:${column + 1}`" v-html="renderInline(item.rows[1][column + 1])"></span></dd>
          </div>
        </dl>
      </template>

      <template v-else-if="item.kind === 'skills'">
        <div class="npc-profile-labels">
          <h4><span data-profile-source-cell="0:0" v-html="renderInline(item.rows[0][0])"></span></h4>
          <span class="npc-profile-column-label" data-profile-source-cell="0:1" v-html="renderInline(item.rows[0][1])"></span>
        </div>
        <dl class="npc-profile-skills">
          <div v-for="(row, rowIndex) in item.rows.slice(1)" :key="rowIndex" class="npc-profile-skill-group">
            <dt><span :data-profile-source-cell="`${rowIndex + 1}:0`" v-html="renderInline(row[0])"></span></dt>
            <dd><span :data-profile-source-cell="`${rowIndex + 1}:1`" v-html="renderInline(row[1])"></span></dd>
          </div>
        </dl>
      </template>

      <template v-else-if="item.kind === 'derived'">
        <div class="npc-profile-labels">
          <h4><span data-profile-source-cell="0:0" v-html="renderInline(item.rows[0][0])"></span></h4>
          <div class="npc-profile-column-key">
            <span v-for="(header, column) in item.rows[0].slice(1)" :key="column" :data-profile-source-cell="`0:${column + 1}`" v-html="renderInline(header)"></span>
          </div>
        </div>
        <dl class="npc-profile-derived">
          <div v-for="(row, rowIndex) in item.rows.slice(1)" :key="rowIndex" class="npc-profile-derived-value">
            <dt><span :data-profile-source-cell="`${rowIndex + 1}:0`" v-html="renderInline(row[0])"></span></dt>
            <dd class="npc-profile-result"><span :data-profile-source-cell="`${rowIndex + 1}:${row.length - 1}`" v-html="renderInline(row[row.length - 1])"></span></dd>
            <dd v-if="row.length === 3" class="npc-profile-calculation"><span :data-profile-source-cell="`${rowIndex + 1}:1`" v-html="renderInline(row[1])"></span></dd>
          </div>
        </dl>
      </template>

      <template v-else-if="item.kind === 'talents'">
        <div class="npc-profile-labels">
          <h4><span data-profile-source-cell="0:0" v-html="renderInline(item.rows[0][0])"></span></h4>
          <div class="npc-profile-column-key">
            <span v-for="(header, column) in item.rows[0].slice(1)" :key="column" :data-profile-source-cell="`0:${column + 1}`" v-html="renderInline(header)"></span>
          </div>
        </div>
        <div class="npc-profile-talents">
          <article v-for="(row, rowIndex) in item.rows.slice(1)" :key="rowIndex" class="npc-profile-talent">
            <h5><span :data-profile-source-cell="`${rowIndex + 1}:0`" v-html="renderInline(row[0])"></span></h5>
            <p v-for="(cell, column) in row.slice(1)" :key="column" :class="{ 'npc-profile-prerequisite': row.length === 3 && column === 0 }">
              <span :data-profile-source-cell="`${rowIndex + 1}:${column + 1}`" v-html="renderInline(cell)"></span>
            </p>
          </article>
        </div>
      </template>

      <div v-else-if="item.kind === 'table'" class="npc-profile-table" tabindex="0" role="region" aria-label="Tableau du profil statistique, défilement horizontal si nécessaire">
        <table>
          <tbody>
            <tr v-for="(row, rowIndex) in item.rows" :key="rowIndex">
              <td v-for="(cell, column) in row" :key="column"><span :data-profile-source-cell="`${rowIndex}:${column}`" v-html="renderInline(cell)"></span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <slot v-else name="fallback" :block="item.block" :index="blockIndex"></slot>
    </div>
  </div>
</template>

<style scoped>
.npc-stat-profile{--npc-line:var(--tu-border,#2c4858);--npc-muted:var(--tu-muted,#9fb4c3);--npc-accent:var(--tu-accent,#8cd7de);display:grid;gap:24px;min-width:0;color:inherit}
.npc-profile-block{min-width:0}
.npc-profile-paragraph{margin:0;line-height:1.8;overflow-wrap:anywhere}
.npc-profile-labels{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:12px;min-width:0}
.npc-profile-labels h4{margin:0;color:var(--npc-accent);font-size:15px;font-weight:600;line-height:1.5}
.npc-profile-column-label,.npc-profile-column-key{color:var(--npc-muted);font-size:12px;line-height:1.6}
.npc-profile-column-key{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px 14px}
.npc-stat-profile dl,.npc-stat-profile dd{margin:0}
.npc-profile-attributes{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,105px),1fr));gap:10px}
.npc-profile-attribute{padding:16px 12px 14px;border:1px solid var(--npc-line);border-radius:8px;background:linear-gradient(145deg,rgba(37,74,89,.28),rgba(9,19,28,.45));text-align:center;min-width:0}
.npc-profile-attribute dt{font-size:13px;line-height:1.5;overflow-wrap:anywhere}
.npc-profile-attribute dd{margin-top:8px;font-size:clamp(28px,4vw,40px);line-height:1.15;font-weight:600;color:#e5f5f5;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
.npc-profile-skills{display:grid;border:1px solid var(--npc-line);border-radius:8px;overflow:hidden}
.npc-profile-skill-group{display:grid;grid-template-columns:minmax(0,1fr) minmax(62px,max-content);gap:16px;align-items:center;padding:13px 16px;background:rgba(13,28,39,.45)}
.npc-profile-skill-group+.npc-profile-skill-group{border-top:1px solid var(--npc-line)}
.npc-profile-skill-group dt{font-size:14px;line-height:1.7;overflow-wrap:anywhere}
.npc-profile-skill-group dd{text-align:right;font-size:18px;line-height:1.45;color:#d8edef;font-weight:600;font-variant-numeric:tabular-nums}
.npc-profile-derived{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,225px),1fr));gap:10px}
.npc-profile-derived-value{display:flex;flex-direction:column;gap:9px;min-width:0;padding:16px;border:1px solid var(--npc-line);border-radius:8px;background:rgba(12,26,37,.5)}
.npc-profile-derived-value dt{font-size:13px;line-height:1.55;color:var(--npc-muted);overflow-wrap:anywhere}
.npc-profile-result{font-size:20px;font-weight:600;line-height:1.5;color:#dff1f3;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
.npc-profile-calculation{padding-top:9px;border-top:1px solid var(--npc-line);font-size:12px;line-height:1.65;color:var(--npc-muted);overflow-wrap:anywhere}
.npc-profile-talents{display:grid;gap:12px}
.npc-profile-talent{padding:18px;border:1px solid var(--npc-line);border-left:3px solid var(--npc-accent);border-radius:7px;background:rgba(13,28,39,.5);min-width:0}
.npc-profile-talent h5{font-size:16px;line-height:1.55;font-weight:600;margin:0 0 10px;overflow-wrap:anywhere}
.npc-profile-talent p{margin:0;font-size:14px;line-height:1.8;overflow-wrap:anywhere}
.npc-profile-talent p+p{margin-top:10px}
.npc-profile-talent .npc-profile-prerequisite{font-size:12px;color:var(--npc-muted)}
.npc-profile-table{max-width:100%;overflow:auto;border:1px solid var(--npc-line);border-radius:7px}
.npc-profile-table table{border-collapse:collapse;width:100%;font-size:13px;line-height:1.7}
.npc-profile-table td{padding:10px 12px;border:1px solid var(--npc-line);min-width:8rem;vertical-align:top}
.npc-profile-table tr:first-child{background:rgba(37,74,89,.25)}
.npc-profile-table:focus-visible,.npc-stat-profile :deep(a:focus-visible){outline:2px solid var(--npc-accent);outline-offset:3px}
.npc-stat-profile :deep(a){color:inherit;text-decoration:underline;text-underline-offset:3px}
@media(max-width:600px){.npc-profile-labels{flex-wrap:wrap}.npc-profile-column-key{justify-content:flex-start}.npc-profile-skill-group{gap:12px;padding:12px}.npc-profile-derived{grid-template-columns:minmax(0,1fr)}.npc-profile-talent{padding:14px}.npc-profile-result{font-size:19px}}
</style>
