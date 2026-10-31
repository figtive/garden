import { parseDirectiveLine } from "../directives/parseDirectiveLine.ts";
import {
  extractBlockText,
  extractInlineText,
} from "../markdown/extractTextContent.ts";
import type {
  Post,
  SearchIndex,
  SearchPage,
  SearchSection,
} from "../types/index.ts";
import { definePlugin } from "./definePlugin.ts";

const removeDirectiveLines = (text: string) =>
  text
    .split("\n")
    .filter((line) => !parseDirectiveLine(line))
    .join("\n");

type SearchPluginOptions = {
  path?: string;
  maxLevel?: number;
  pageData?: (post: Post<Record<string, unknown>>) => Record<string, string>;
};

export const searchPlugin = ({
  path = "search-index.json",
  maxLevel = 3,
  pageData,
}: SearchPluginOptions = {}) =>
  definePlugin({
    name: "search-content",
    pluginType: "emitter",
    emit: ({ posts }) => {
      const pages = posts.map(
        (post): SearchPage => ({
          url: post.route.url,
          title: post.meta.title,
          description: post.meta.description,
          date: post.meta.date,
          updated: post.meta.updated,
          tags: post.meta.tags ?? [],
          data: pageData?.(post) ?? {},
        }),
      );

      const sections = posts.flatMap((post, page) => {
        const result: SearchSection[] = [];

        let current = {
          url: post.route.url,
          heading: "",
          text: [] as string[],
        };

        const pushSection = () => {
          const text = current.text.join(" ").replace(/\s+/g, " ").trim();

          if (!text && !current.heading) {
            return;
          }

          result.push({
            url: current.url,
            page,
            heading: current.heading,
            text,
          });
        };

        for (const block of post.content.tokens) {
          if (block.type === "block:heading" && block.level <= maxLevel) {
            pushSection();
            current = {
              url: `${post.route.url}#${block.id}`,
              heading: extractInlineText(block.children),
              text: [],
            };
          } else {
            current.text.push(removeDirectiveLines(extractBlockText(block)));
          }
        }

        pushSection();
        return result;
      });

      const index: SearchIndex = {
        pages,
        sections,
      };

      return [
        {
          path,
          content: JSON.stringify(index),
        },
      ];
    },
  });
