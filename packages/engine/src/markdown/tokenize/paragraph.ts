import type { Paragraph } from "mdast";
import type { Block } from "../../types/index.ts";
import { parseDirectiveLine } from "../directives/parseDirectiveLine.ts";
import { parseDirectiveProps } from "../directives/parseDirectiveProps.ts";
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

  return [
    readFigure(node) ?? {
      type: "block:paragraph",
      children: convertInlines(node.children),
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

function readFigure(node: Paragraph): Block | null {
  const [image] = node.children;

  if (node.children.length !== 1 || image?.type !== "image") {
    return null;
  }

  return {
    type: "block:image",
    src: image.url,
    alt: image.alt ?? "",
    caption: image.title ?? undefined,
  };
}
