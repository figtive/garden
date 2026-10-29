import { extractInlineText } from "../markdown/extractTextContent.ts";
import { definePlugin } from "./definePlugin.ts";

export type TocEntry = {
  id: string;
  level: number;
  text: string;
};

export const tocPlugin = ({ maxLevel = 3 } = {}) =>
  definePlugin({
    name: "toc",
    pluginType: "transformer",
    transform: (post) => {
      const toc: TocEntry[] = [];

      for (const block of post.content.tokens) {
        if (
          block.type === "block:heading" &&
          block.level >= 1 &&
          block.level <= maxLevel
        ) {
          toc.push({
            id: block.id,
            level: block.level,
            text: extractInlineText(block.children),
          });
        }
      }

      const headContent = toc[0];
      const isTitle =
        headContent?.level === 1 &&
        headContent.text.trim().toLowerCase() ===
          post.meta.title.trim().toLowerCase();

      return { toc: isTitle ? toc.slice(1) : toc };
    },
  });
