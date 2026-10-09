import {
  defaultPlugins,
  definePlugin,
  type InferPost,
} from "@figtive/garden-engine";

export const mood = () =>
  definePlugin({
    name: "mood",
    pluginType: "transformer",
    transform: (post) => ({
      mood: post.meta.title.includes("!") ? "HAPPY!" : "sad",
    }),
  });

export const plugins = [...defaultPlugins, mood()];
export type Post = InferPost<typeof plugins>;
