import { definePlugin } from "./definePlugin.ts";

export const embedsPlugin = () =>
  definePlugin({
    name: "embeds",
    pluginType: "emitter",
    emit: ({ posts }) => {
      const copied = new Set<string>();
      const files = [];

      for (const post of posts) {
        for (const asset of post.content.assets) {
          if (copied.has(asset.to)) {
            continue;
          }

          copied.add(asset.to);
          files.push({ path: asset.to, from: asset.from });
        }
      }

      return files;
    },
  });
