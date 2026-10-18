import {
  defaultPlugins,
  definePlugin,
  type InferPost,
} from "@figtive/garden-engine";
import type { StageName } from "./component/Stage.tsx";

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

export const plugins = [...defaultPlugins, mood(), gardenStage()];
export type BlogPost = InferPost<typeof plugins>;
