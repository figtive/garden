import type { Table } from "mdast";
import type { Block } from "../../types/index.ts";
import type { TokenContext } from "./index.ts";
import { convertInlines } from "./inline.ts";

export function convertTable(node: Table, context: TokenContext): Block {
  const [head = [], ...rows] = node.children.map((row) =>
    row.children.map((cell) => convertInlines(cell.children, context)),
  );

  return {
    type: "block:table",
    align: node.align ?? [],
    head,
    rows,
  };
}
