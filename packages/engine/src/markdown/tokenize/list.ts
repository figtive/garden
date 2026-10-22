import type { List } from "mdast";
import type { Block } from "../../types/index.ts";
import { convertBlocks, type TokenContext } from "./index.ts";

export function convertList(node: List, context: TokenContext): Block {
  return {
    type: "block:list",
    ordered: node.ordered ?? false,
    start: node.start ?? undefined,
    spread: Boolean(node.spread || node.children.some((item) => item.spread)),
    items: node.children.map((item) => ({
      checked: item.checked ?? undefined,
      children: convertBlocks(item.children, context),
    })),
  };
}
