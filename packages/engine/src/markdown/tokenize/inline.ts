import type { PhrasingContent } from "mdast";
import {
  createEmbedSource,
  splitEmbedLinks,
} from "../../embeds/parseEmbedLinks.ts";
import type { Inline } from "../../types/index.ts";
import { convertFootnoteReference } from "./footnote.ts";
import type { TokenContext } from "./index.ts";

export function convertInlines(
  nodes: PhrasingContent[],
  context: TokenContext,
): Inline[] {
  return nodes.flatMap((node): Inline[] => {
    switch (node.type) {
      case "text":
        return splitEmbedLinks(node.value, node.position?.start.line ?? 0);
      case "strong":
        return [
          {
            type: "inline:strong",
            children: convertInlines(node.children, context),
          },
        ];
      case "emphasis":
        return [
          {
            type: "inline:emphasis",
            children: convertInlines(node.children, context),
          },
        ];
      case "delete":
        return [
          {
            type: "inline:strike",
            children: convertInlines(node.children, context),
          },
        ];
      case "inlineCode":
        return [
          {
            type: "inline:code",
            value: node.value,
          },
        ];
      case "link":
        return [
          {
            type: "inline:link",
            href: node.url,
            title: node.title ?? undefined,
            children: convertInlines(node.children, context),
          },
        ];
      case "image":
        return [
          {
            type: "inline:embed",
            source: createEmbedSource(node.url, (node.alt ?? "").split("|")),
            title: node.title ?? undefined,
            line: node.position?.start.line ?? 0,
          },
        ];
      case "footnoteReference":
        return [convertFootnoteReference(node, context)];
      case "break":
        return [
          {
            type: "inline:break",
          },
        ];

      default:
        return "children" in node ? convertInlines(node.children, context) : [];
    }
  });
}

export function extractText(nodes: PhrasingContent[]): string {
  return nodes
    .map((node) => {
      if ("value" in node) {
        return node.value;
      }
      return "children" in node ? extractText(node.children) : "";
    })
    .join("");
}
