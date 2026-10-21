import type { RootContent } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { Block } from "../../types/index.ts";
import { convertCode } from "./code.ts";
import { convertHeading } from "./heading.ts";
import { convertList } from "./list.ts";
import { convertParagraph } from "./paragraph.ts";
import { convertQuote } from "./quote.ts";
import { convertTable } from "./table.ts";

export type TokenContext = {
  source: string;
  directives: Set<string>;
  ids: Map<string, number>;
};

const markdownParser = unified().use(remarkParse).use(remarkGfm);

export function tokenizeMarkdown(
  markdown: string,
  directives: Set<string>,
): Block[] {
  const tree = markdownParser.parse(markdown);
  return convertBlocks(tree.children, {
    source: markdown,
    directives,
    ids: new Map(),
  });
}

export function convertBlocks(
  nodes: RootContent[],
  context: TokenContext,
): Block[] {
  return nodes.flatMap((node) => convertBlock(node, context));
}

function convertBlock(node: RootContent, context: TokenContext): Block[] {
  switch (node.type) {
    case "heading":
      return [convertHeading(node, context)];
    case "paragraph":
      return convertParagraph(node, context);
    case "blockquote":
      return [convertQuote(node, context)];
    case "code":
      return [convertCode(node)];
    case "table":
      return [convertTable(node)];
    case "list":
      return [convertList(node, context)];
    case "thematicBreak":
      return [
        {
          type: "block:divider",
        },
      ];
    default:
      return [];
  }
}
