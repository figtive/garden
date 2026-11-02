import { definePlugin } from "./definePlugin.ts";

export const embedsPlugin = () =>
  definePlugin({
    name: "embeds",
    pluginType: "emitter",
    emit: ({ posts, tagInfos }) => {
      const copied = new Set<string>();
      const files = [];

      for (const { content } of [...posts, ...tagInfos.values()]) {
        for (const asset of content.assets) {
          if (copied.has(asset.to)) {
            continue;
          }

          copied.add(asset.to);
          files.push({
            path: asset.to,
            from: asset.from,
          });
        }
      }

      return files;
    },
  });
