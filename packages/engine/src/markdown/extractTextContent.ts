import type { Block, Inline } from "../types/index.ts";

export function extractTokenText(blocks: Block[]): string {
  return blocks.map(extractBlockText).join(" ");
}

function extractBlockText(block: Block): string {
  switch (block.type) {
    case "block:heading":
    case "block:paragraph":
      return extractInlineText(block.children);
    case "block:quote":
    case "block:alert":
      return extractTokenText(block.children);
    case "block:list":
      return block.items
        .map((item) => extractTokenText(item.children))
        .join(" ");
    case "block:table":
      return [block.head, ...block.rows]
        .flat()
        .map(extractInlineText)
        .join(" ");
    case "block:code":
      return block.code;
    case "block:embed":
      return block.caption ?? "";
    default:
      return "";
  }
}

export function extractInlineText(inlines: Inline[]): string {
  return inlines
    .map((inline) => {
      switch (inline.type) {
        case "inline:text":
        case "inline:code":
          return inline.value;
        case "inline:strong":
        case "inline:emphasis":
        case "inline:strike":
        case "inline:link":
          return extractInlineText(inline.children);
        default:
          return "";
      }
    })
    .join(" ");
}
