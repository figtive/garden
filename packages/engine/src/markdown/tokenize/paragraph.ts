import type { Paragraph } from "mdast";
import { parseDirectiveLine } from "../../directives/parseDirectiveLine.ts";
import { parseDirectiveProps } from "../../directives/parseDirectiveProps.ts";
import { parseEmbedCaption } from "../../embeds/parseEmbedCaption.ts";
import type { Block, Inline } from "../../types/index.ts";
import type { TokenContext } from "./index.ts";
import { convertInlines } from "./inline.ts";

export function convertParagraph(
  node: Paragraph,
  context: TokenContext,
): Block[] {
  const directives = readDirectives(node, context);
  if (directives) {
    return directives;
  }

  const children = convertInlines(node.children);

  return [
    readEmbed(children) ?? {
      type: "block:paragraph",
      children,
    },
  ];
}

function readDirectives(
  node: Paragraph,
  context: TokenContext,
): Block[] | null {
  const { position } = node;

  if (!position) {
    return null;
  }

  const lines = context.source
    .slice(position.start.offset, position.end.offset)
    .split("\n");

  const directives: Block[] = [];

  for (const [index, line] of lines.entries()) {
    const found = parseDirectiveLine(line);
    if (!found || !context.directives.has(found.name)) {
      return null;
    }

    directives.push({
      type: "block:directive",
      name: found.name,
      props: parseDirectiveProps(found.rawProps),
      line: position.start.line + index,
    });
  }

  return directives;
}

function readEmbed(children: Inline[]): Block | null {
  const [embed] = children;

  if (children.length !== 1 || embed?.type !== "inline:embed") {
    return null;
  }

  const { label, caption } = parseEmbedCaption(embed.title);

  return {
    type: "block:embed",
    source: embed.source,
    label,
    caption,
    line: embed.line,
  };
}
