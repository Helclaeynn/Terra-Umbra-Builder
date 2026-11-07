// Conversion entre les blocs d'un article du compendium (format enregistré)
// et le document de l'éditeur de texte (TipTap / ProseMirror).
//
// Blocs : { type: "p", text, style? } où style vaut "list" (une ligne par
// puce), "lore", "callout" ou un style d'origine conservé tel quel ;
// { type: "table", rows } ; { type: "image", src, alt?, caption? }.
// Dans le texte : [libellé](lien), '''gras''', ''italique''.

export type ArticleBlock = {
  type: string;
  text?: string;
  style?: string;
  rows?: string[][];
  src?: string;
  alt?: string;
  caption?: string;
  [key: string]: unknown;
};

type Mark = { type: string; attrs?: Record<string, unknown> };
export type RichNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: RichNode[];
  text?: string;
  marks?: Mark[];
};

const INLINE = /\[([^\]\n]+)\]\(([^\s)]+)\)|'''(.+?)'''|''(.+?)''/g;

function textNode(text: string, marks: Mark[]): RichNode[] {
  if (!text) return [];
  return [{ type: "text", text, ...(marks.length ? { marks } : {}) }];
}

/** Texte enregistré → nœuds en ligne (liens, gras, italique, retours à la ligne). */
export function parseInline(source: string, marks: Mark[] = []): RichNode[] {
  const out: RichNode[] = [];
  const lines = String(source ?? "").split("\n");
  lines.forEach((line, index) => {
    if (index > 0) out.push({ type: "hardBreak" });
    let offset = 0;
    for (const match of line.matchAll(INLINE)) {
      out.push(...textNode(line.slice(offset, match.index), marks));
      if (match[1] !== undefined) {
        out.push(...textNode(match[1], [...marks, { type: "link", attrs: { href: match[2] } }]));
      } else if (match[3] !== undefined) {
        out.push(...parseInline(match[3], [...marks, { type: "bold" }]));
      } else {
        out.push(...parseInline(match[4], [...marks, { type: "italic" }]));
      }
      offset = match.index! + match[0].length;
    }
    out.push(...textNode(line.slice(offset), marks));
  });
  return out;
}

/** Nœuds en ligne → texte enregistré. */
export function serializeInline(nodes: RichNode[] = []): string {
  let out = "";
  for (const node of nodes) {
    if (node.type === "hardBreak") { out += "\n"; continue; }
    if (node.type !== "text") { out += serializeInline(node.content); continue; }
    const text = node.text ?? "";
    const marks = node.marks ?? [];
    const link = marks.find((mark) => mark.type === "link");
    if (link) { out += `[${text.replace(/[[\]\n]/g, " ")}](${String(link.attrs?.href ?? "")})`; continue; }
    // Le compendium ne sait pas combiner gras et italique : le gras l'emporte.
    if (marks.some((mark) => mark.type === "bold")) out += `'''${text}'''`;
    else if (marks.some((mark) => mark.type === "italic")) out += `''${text}''`;
    else out += text;
  }
  return out;
}

function paragraph(text: string, style?: string): RichNode {
  return {
    type: "paragraph",
    ...(style ? { attrs: { blockStyle: style } } : {}),
    content: parseInline(text)
  };
}

/** Blocs d'une section → document de l'éditeur. */
export function blocksToDoc(blocks: ArticleBlock[] = []): RichNode {
  const content: RichNode[] = [];
  for (const block of blocks) {
    if (block.type === "image" && block.src) {
      content.push({ type: "image", attrs: { src: block.src, alt: block.alt ?? "", title: block.caption ?? "" } });
    } else if (block.type === "table") {
      const rows = Array.isArray(block.rows) ? block.rows : [];
      if (!rows.length) continue;
      const width = Math.max(1, ...rows.map((row) => row.length));
      content.push({
        type: "table",
        content: rows.map((row) => ({
          type: "tableRow",
          content: Array.from({ length: width }, (_, index) => ({
            type: "tableCell",
            content: [paragraph(String(row[index] ?? ""))]
          }))
        }))
      });
    } else if (block.style === "list") {
      const items = String(block.text ?? "").split(/\r?\n/).map((line) => line.replace(/^\s*[•*-]\s*/, "")).filter(Boolean);
      if (items.length) {
        content.push({ type: "bulletList", content: items.map((item) => ({ type: "listItem", content: [paragraph(item)] })) });
      }
    } else {
      const text = String(block.text ?? "");
      if (text.trim()) content.push(paragraph(text, block.style));
    }
  }
  if (!content.length) content.push({ type: "paragraph" });
  return { type: "doc", content };
}

function plainCell(cell: RichNode): string {
  return (cell.content ?? []).map((node) => serializeInline(node.content)).join(" ").trim();
}

/** Document de l'éditeur → blocs d'une section. */
export function docToBlocks(doc: RichNode): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  for (const node of doc.content ?? []) {
    if (node.type === "paragraph" || node.type === "heading") {
      const text = serializeInline(node.content).trim();
      if (!text) continue;
      const style = node.attrs?.blockStyle ? String(node.attrs.blockStyle) : "";
      blocks.push({ type: "p", text, ...(style ? { style } : {}) });
    } else if (node.type === "bulletList" || node.type === "orderedList") {
      const lines = (node.content ?? [])
        .map((item) => (item.content ?? []).map((child) => serializeInline(child.content)).join(" ").trim())
        .filter(Boolean);
      if (lines.length) blocks.push({ type: "p", style: "list", text: lines.join("\n") });
    } else if (node.type === "table") {
      const rows = (node.content ?? []).map((row) => (row.content ?? []).map(plainCell));
      if (rows.length) blocks.push({ type: "table", rows });
    } else if (node.type === "image" && node.attrs?.src) {
      const alt = String(node.attrs.alt ?? "").trim();
      const caption = String(node.attrs.title ?? "").trim();
      blocks.push({ type: "image", src: String(node.attrs.src), ...(alt ? { alt } : {}), ...(caption ? { caption } : {}) });
    } else if (node.type === "blockquote") {
      for (const child of docToBlocks({ type: "doc", content: node.content })) {
        blocks.push(child.type === "p" && !child.style ? { ...child, style: "lore" } : child);
      }
    }
  }
  return blocks;
}
