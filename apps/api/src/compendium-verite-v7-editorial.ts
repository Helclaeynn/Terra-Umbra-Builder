type ParagraphBlock = { type: "p"; text: string; style?: string };
type TableBlock = { type: "table"; rows: unknown[][] };
type Block = ParagraphBlock | TableBlock;
export type TruthSection = { id: string; title: string; level: number; audience?: "mj"; blocks: Block[] };

const TARGET = 520;

function splitSentences(text: string): string[] {
  const sentences = text.match(/[^.!?…]+(?:[.!?…]+[»”']?|$)/gu) ?? [text];
  const result: string[] = [];
  let current = "";
  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;
    if (current && current.length + sentence.length + 1 > TARGET) {
      result.push(current);
      current = sentence;
    } else current = current ? `${current} ${sentence}` : sentence;
  }
  if (current) result.push(current);
  return result.length ? result : [text];
}

function editorializeParagraph(block: ParagraphBlock): ParagraphBlock[] {
  const text = block.text.trim().replaceAll("￾", "-");
  if (!text) return [{ ...block, text }];
  if (text.includes("{{Talents|")) {
    return text.split(/(\{\{Talents\|[^}]+\}\})/gu).map((part) => part.trim()).filter(Boolean)
      .flatMap((part) => part.startsWith("{{Talents|") ? [{ type: "p" as const, text: part }] : editorializeParagraph({ ...block, text: part }));
  }
  const bullets = text.split(/\s+•\s+/u).map((part) => part.trim()).filter(Boolean);
  if (bullets.length > 1) {
    const [lead, ...items] = bullets;
    return [...splitSentences(lead).map((part) => ({ ...block, text: part })), ...items.map((part) => ({ type: "p" as const, style: "list", text: `• ${part}` }))];
  }
  if (text.length <= TARGET) return [{ ...block, text }];
  return splitSentences(text).map((part) => ({ ...block, text: part }));
}

export function editorializeTruthSections(sections: TruthSection[]): TruthSection[] {
  return sections.map((section) => ({ ...section, blocks: section.blocks.reduce<Block[]>((result, block) => {
    if (block.type === "p") result.push(...editorializeParagraph(block)); else result.push(block);
    return result;
  }, []) }));
}
