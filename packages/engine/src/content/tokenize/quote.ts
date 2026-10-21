import type { Blockquote } from "mdast";
import type { Block, Inline } from "../../types/index.ts";
import { convertBlocks, type TokenContext } from "./index.ts";

const ALERT_MARKER = /^\[!(?<kind>[\w-]+)(?:\|(?<emoji>[^\]]*))?\]\s*/;

export function convertQuote(node: Blockquote, context: TokenContext): Block {
  const children = convertBlocks(node.children, context);
  return readAlert(children) ?? { type: "block:quote", children };
}

function readAlert(children: Block[]): Block | null {
  const [firstBlock, ...otherBlocks] = children;

  if (firstBlock?.type !== "block:paragraph") {
    return null;
  }

  const [firstInline, ...otherInlines] = firstBlock.children;

  if (firstInline?.type !== "inline:text") {
    return null;
  }

  const marker = ALERT_MARKER.exec(firstInline.value);

  if (!marker?.groups?.kind) {
    return null;
  }

  const { kind, emoji } = marker.groups;

  const textAfterMarker = firstInline.value.slice(marker[0].length);

  const paragraphChildren: Inline[] = textAfterMarker
    ? [
        {
          type: "inline:text",
          value: textAfterMarker,
        },
        ...otherInlines,
      ]
    : otherInlines;

  return {
    type: "block:alert",
    kind: kind.toLowerCase(),
    emoji: emoji?.trim() || undefined,
    children: paragraphChildren.length
      ? [
          { type: "block:paragraph", children: paragraphChildren },
          ...otherBlocks,
        ]
      : otherBlocks,
  };
}
