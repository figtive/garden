import { definePlugin } from "./definePlugin.ts";

export const draftsPlugin = () =>
  definePlugin({
    name: "drafts",
    pluginType: "filter",
    filter: (meta) => !meta.draft,
  });
