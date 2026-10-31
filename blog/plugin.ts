import {
  defaultPlugins,
  definePlugin,
  type InferPost,
  searchPlugin,
} from "@figtive/garden-engine";
import type { StageName } from "./component/Stage.tsx";
import { linksInBlocks, pagePath } from "./utils/links.ts";

export const mood = () =>
  definePlugin({
    name: "mood",
    pluginType: "transformer",
    transform: (post) => ({
      mood: post.meta.title.includes("!") ? "HAPPY!" : "sad",
    }),
  });

export const gardenStage = () =>
  definePlugin({
    name: "gardenStage",
    pluginType: "transformer",
    transform: (): { stage: StageName } => ({
      stage: "evergreen",
    }),
  });

export const pageLinks = () =>
  definePlugin({
    name: "pageLinks",
    pluginType: "transformer",
    transform: (post) => ({
      links: [
        ...new Set(
          linksInBlocks(post.content.tokens)
            .filter((href) => href.startsWith("/"))
            .map(pagePath),
        ),
      ],
    }),
  });

export const gardenSearch = () =>
  searchPlugin({
    pageData: ({ pluginOutput }) => ({
      stage: String(pluginOutput.stage),
      readingTime: `${pluginOutput.readingTime} min read`,
    }),
  });

export const plugins = [
  ...defaultPlugins.filter((plugin) => plugin.name !== "search-content"),
  mood(),
  gardenStage(),
  pageLinks(),
  gardenSearch(),
];
export type BlogPost = InferPost<typeof plugins>;
