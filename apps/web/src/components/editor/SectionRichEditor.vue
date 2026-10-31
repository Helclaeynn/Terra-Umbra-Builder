<script setup lang="ts">
// Texte d'une section d'article, modifiable comme dans un traitement de texte.
// La barre d'outils est commune à toutes les sections : celle qui a le focus
// se signale au parent par l'événement « focus ».
import { onBeforeUnmount, watch } from "vue";
import { EditorContent, Extension, useEditor, type Editor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import { blocksToDoc, docToBlocks, type ArticleBlock, type RichNode } from "../../lib/article-rich-text";

const props = defineProps<{
  modelValue: ArticleBlock[];
  uploadImage: (file: File) => Promise<string>;
}>();
const emit = defineEmits<{
  (event: "update:modelValue", value: ArticleBlock[]): void;
  (event: "focus", editor: Editor): void;
  (event: "error", message: string): void;
}>();

// Style d'un paragraphe : lore, encadré, ou style d'origine conservé.
const BlockStyle = Extension.create({
  name: "blockStyle",
  addGlobalAttributes() {
    return [{
      types: ["paragraph"],
      attributes: {
        blockStyle: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute("data-style"),
          renderHTML: (attributes: Record<string, unknown>) =>
            attributes.blockStyle ? { "data-style": attributes.blockStyle, class: `rt-${attributes.blockStyle}` } : {}
        }
      }
    }];
  }
});

let lastEmitted = "";

async function insertImages(editor: Editor, files: File[], position?: number) {
  for (const file of files.filter((item) => item.type.startsWith("image/"))) {
    try {
      const src = await props.uploadImage(file);
      const node = { type: "image", attrs: { src, alt: file.name.replace(/\.[^.]+$/, ""), title: "" } };
      if (position === undefined) editor.chain().focus().insertContent(node).run();
      else editor.chain().focus().insertContentAt(position, node).run();
    } catch {
      emit("error", `L'image « ${file.name} » n'a pas pu être envoyée.`);
    }
  }
}

const editor = useEditor({
  content: blocksToDoc(props.modelValue),
  extensions: [
    StarterKit.configure({ heading: false, codeBlock: false, code: false, strike: false, horizontalRule: false, blockquote: false, orderedList: false }),
    BlockStyle,
    Link.configure({ openOnClick: false, autolink: false, linkOnPaste: false }),
    Image,
    Table.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell,
    Placeholder.configure({ placeholder: "Écris le texte de la section…" })
  ],
  editorProps: {
    handleDrop(view, event) {
      const files = [...(event.dataTransfer?.files ?? [])];
      if (!files.some((file) => file.type.startsWith("image/")) || !editor.value) return false;
      event.preventDefault();
      const position = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
      void insertImages(editor.value, files, position);
      return true;
    },
    handlePaste(_view, event) {
      const files = [...(event.clipboardData?.files ?? [])];
      if (!files.some((file) => file.type.startsWith("image/")) || !editor.value) return false;
      void insertImages(editor.value, files);
      return true;
    }
  },
  onUpdate({ editor: current }) {
    const blocks = docToBlocks(current.getJSON() as RichNode);
    lastEmitted = JSON.stringify(blocks);
    emit("update:modelValue", blocks);
  },
  onFocus({ editor: current }) {
    emit("focus", current as Editor);
  }
});

// Une version rechargée (historique, brouillon abandonné) remplace le texte.
watch(() => props.modelValue, (blocks) => {
  if (!editor.value || JSON.stringify(blocks) === lastEmitted) return;
  lastEmitted = JSON.stringify(blocks);
  editor.value.commands.setContent(blocksToDoc(blocks), false);
});

onBeforeUnmount(() => editor.value?.destroy());
</script>

<template>
  <EditorContent v-if="editor" :editor="editor" class="section-rich-editor" />
</template>

<style scoped>
.section-rich-editor :deep(.ProseMirror) {
  min-height: 3.2em;
  padding: 10px 12px;
  border-radius: 6px;
  outline: none;
  color: #c0d2e5;
  line-height: 1.75;
}
.section-rich-editor :deep(.ProseMirror:focus) { box-shadow: inset 0 0 0 1px #3d6a8a; background: #0d1b29; }
.section-rich-editor :deep(.ProseMirror p) { margin: 0 0 0.8em; }
.section-rich-editor :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder); color: #5f7890; float: left; height: 0; pointer-events: none;
}
.section-rich-editor :deep(.rt-lore) { color: #dce7f5; font-style: italic; border-left: 3px solid #7c6aa8; padding-left: 12px; }
.section-rich-editor :deep(.rt-callout) { border-left: 3px solid #64def5; background: #102539; padding: 8px 12px; border-radius: 4px; }
.section-rich-editor :deep(a) { color: #8fd3ff; text-decoration: underline; }
.section-rich-editor :deep(img) { max-width: 100%; border-radius: 6px; display: block; margin: 8px 0; }
.section-rich-editor :deep(img.ProseMirror-selectednode) { outline: 2px solid #64def5; }
.section-rich-editor :deep(table) { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 14px; }
.section-rich-editor :deep(td), .section-rich-editor :deep(th) { border: 1px solid #314d63; padding: 4px 8px; vertical-align: top; min-width: 60px; }
.section-rich-editor :deep(td p), .section-rich-editor :deep(th p) { margin: 0; }
.section-rich-editor :deep(.selectedCell) { background: #17324a; }
.section-rich-editor :deep(ul) { padding-left: 1.4em; margin: 0 0 0.8em; }
</style>
