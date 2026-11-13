import {
  defaultPlugins,
  definePlugin,
  type InferPost,
  searchPlugin,
} from "@figtive/garden-engine";
import { isStageName, type StageName, stages } from "./component/Stage.tsx";
import { linksInBlocks, pagePath } from "./utils/links.ts";

export const gardenStage = () =>
  definePlugin({
    name: "gardenStage",
    pluginType: "transformer",
    transform: (post): { stage: StageName } => {
      const { stage = "seedling" } = post.meta.customFields;

      if (!isStageName(stage)) {
        throw new Error(
          `${post.route.collection}/${post.route.slug}: "stage" must be one of ${stages.join(", ")}, got "${stage}"`,
        );
      }

      return {
        stage,
      };
    },
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
  gardenStage(),
  pageLinks(),
  gardenSearch(),
];
export type BlogPost = InferPost<typeof plugins>;
