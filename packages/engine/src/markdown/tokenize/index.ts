import type { RootContent } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { FootnoteDefinitions } from "../../types/footnote.ts";
import type { Block, FootnoteItem } from "../../types/index.ts";
import { convertCode } from "./code.ts";
import { collectFootnoteDefinitions } from "./footnote.ts";
import { convertHeading } from "./heading.ts";
import { convertList } from "./list.ts";
import { convertParagraph } from "./paragraph.ts";
import { convertQuote } from "./quote.ts";
import { resolveReferences } from "./resolveReferences.ts";
import { convertTable } from "./table.ts";

export type TokenContext = {
  source: string;
  directives: Set<string>;
  ids: Map<string, number>;
  footnotes: Map<string, FootnoteItem>;
  footnoteDefinitions: FootnoteDefinitions;
};

const markdownParser = unified().use(remarkParse).use(remarkGfm);

export function tokenizeMarkdown(
  markdown: string,
  directives: Set<string>,
): Block[] {
  const tree = markdownParser.parse(markdown);

  resolveReferences(tree);

  const footnoteDefinitions: FootnoteDefinitions = new Map();

  collectFootnoteDefinitions(tree, footnoteDefinitions);

  const context: TokenContext = {
    source: markdown,
    directives,
    ids: new Map(),
    footnotes: new Map(),
    footnoteDefinitions,
  };

  const blocks = convertBlocks(tree.children, context);

  for (const [identifier, item] of context.footnotes) {
    const definition = context.footnoteDefinitions.get(identifier);

    item.children = convertBlocks(definition?.children ?? [], context);
  }

  if (context.footnotes.size === 0) {
    return blocks;
  }

  return [
    ...blocks,
    {
      type: "block:footnotes",
      items: [...context.footnotes.values()],
    },
  ];
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
      return [convertTable(node, context)];
    case "list":
      return [convertList(node, context)];
    case "thematicBreak":
      return [
        {
          type: "block:divider",
        },
      ];
    case "definition":
      return [];
    default:
      return [];
  }
}
