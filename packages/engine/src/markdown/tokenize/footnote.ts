import type { FootnoteReference, Nodes } from "mdast";
import type { FootnoteDefinitions } from "../../types/footnote.ts";
import type { Inline } from "../../types/tokens.ts";
import type { TokenContext } from "./index.ts";

export function convertFootnoteReference(
  node: FootnoteReference,
  context: TokenContext,
): Inline {
  let item = context.footnotes.get(node.identifier);

  if (!item) {
    item = {
      id: `footnote-${node.identifier}`,
      number: context.footnotes.size + 1,
      referenceIds: [],
      children: [],
    };
    context.footnotes.set(node.identifier, item);
  }

  const referenceId = `footnote_ref-${node.identifier}-${item.referenceIds.length + 1}`;

  item.referenceIds.push(referenceId);

  return {
    type: "inline:footnote",
    id: item.id,
    referenceId,
    number: item.number,
  };
}

export function collectFootnoteDefinitions(
  node: Nodes,
  definitions: FootnoteDefinitions,
) {
  if (node.type === "footnoteDefinition" && !definitions.has(node.identifier)) {
    definitions.set(node.identifier, node);
  }

  if ("children" in node) {
    for (const child of node.children) {
      collectFootnoteDefinitions(child, definitions);
    }
  }
}
