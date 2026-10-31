import type { Heading } from "mdast";
import type { Block } from "../../types/index.ts";
import { slugify } from "../../utils/slugify.ts";
import type { TokenContext } from "./index.ts";
import { convertInlines, extractText } from "./inline.ts";

export function convertHeading(node: Heading, context: TokenContext): Block {
  return {
    type: "block:heading",
    level: node.depth,
    id: createHeadingId(extractText(node.children), context),
    children: convertInlines(node.children),
  };
}

function createHeadingId(text: string, context: TokenContext) {
  const baseId = slugify(text);
  let occurrence = context.ids.get(baseId) ?? 1;
  let id = baseId;

  while (context.ids.has(id)) {
    occurrence += 1;
    id = `${baseId}-${occurrence}`;
  }

  context.ids.set(baseId, occurrence);
  context.ids.set(id, 1);

  return id;
}
