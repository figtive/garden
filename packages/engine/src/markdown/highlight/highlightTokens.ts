import type { Block } from "../../types/index.ts";
import type { CodeHighlighter } from "./createCodeHighlighter.ts";

export function highlightTokens(
  blocks: Block[],
  highlighter: CodeHighlighter,
): Promise<Block[]> {
  return Promise.all(blocks.map((block) => highlightBlock(block, highlighter)));
}

async function highlightBlock(
  block: Block,
  highlighter: CodeHighlighter,
): Promise<Block> {
  switch (block.type) {
    case "block:code":
      return {
        ...block,
        lines: await highlighter.highlight(block.code, block.language),
        theme: highlighter.theme,
      };
    case "block:quote":
    case "block:alert":
      return {
        ...block,
        children: await highlightTokens(block.children, highlighter),
      };
    case "block:list":
      return {
        ...block,
        items: await Promise.all(
          block.items.map(async (item) => ({
            ...item,
            children: await highlightTokens(item.children, highlighter),
          })),
        ),
      };
    default:
      return block;
  }
}
