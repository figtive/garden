import type { Block, Inline } from "@figtive/garden-engine";

function linksInInlines(inlines: Inline[]): string[] {
  return inlines.flatMap((inline) => {
    if (inline.type === "inline:link") {
      return [inline.href, ...linksInInlines(inline.children)];
    }
    return "children" in inline ? linksInInlines(inline.children) : [];
  });
}

export function linksInBlocks(blocks: Block[]): string[] {
  return blocks.flatMap((block) => {
    switch (block.type) {
      case "block:heading":
      case "block:paragraph":
        return linksInInlines(block.children);
      case "block:list":
        return block.items.flatMap((item) => linksInBlocks(item.children));
      case "block:quote":
      case "block:alert":
        return linksInBlocks(block.children);
      case "block:table":
        return [...block.head, ...block.rows.flat()].flatMap(linksInInlines);
      default:
        return [];
    }
  });
}

export function pagePath(href: string) {
  const path = href.split(/[?#]/)[0] ?? "";
  return path.endsWith("/") ? path : `${path}/`;
}
