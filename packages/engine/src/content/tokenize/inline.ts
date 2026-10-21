import type { PhrasingContent } from "mdast";
import type { Inline } from "../../types/index.ts";

export function convertInlines(nodes: PhrasingContent[]): Inline[] {
  return nodes.flatMap((node): Inline[] => {
    switch (node.type) {
      case "text":
        return [
          {
            type: "inline:text",
            value: node.value,
          },
        ];
      case "strong":
        return [
          {
            type: "inline:strong",
            children: convertInlines(node.children),
          },
        ];
      case "emphasis":
        return [
          {
            type: "inline:emphasis",
            children: convertInlines(node.children),
          },
        ];
      case "delete":
        return [
          {
            type: "inline:strike",
            children: convertInlines(node.children),
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
            children: convertInlines(node.children),
          },
        ];
      case "image":
        return [
          {
            type: "inline:image",
            src: node.url,
            alt: node.alt ?? "",
            title: node.title ?? undefined,
          },
        ];
      case "break":
        return [
          {
            type: "inline:break",
          },
        ];

      default:
        return "children" in node ? convertInlines(node.children) : [];
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
