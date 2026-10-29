import {
  defaultPlugins,
  definePlugin,
  type InferPost,
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

export const plugins = [...defaultPlugins, mood(), gardenStage(), pageLinks()];
export type BlogPost = InferPost<typeof plugins>;
