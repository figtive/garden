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
  const occurrences = context.ids.get(baseId) ?? 0;
  const nextOccurrence = occurrences + 1;

  context.ids.set(baseId, nextOccurrence);

  return nextOccurrence === 1 ? baseId : `${baseId}-${nextOccurrence}`;
}
