import { existsSync } from "node:fs";
import { join } from "node:path";
import { globby } from "globby";
import { definePlugin } from "./definePlugin.ts";

type StaticPluginOptions = {
  dir?: string;
};

export const staticPlugin = ({ dir = "public" }: StaticPluginOptions = {}) =>
  definePlugin({
    name: "static",
    pluginType: "emitter",
    emit: async () => {
      if (!existsSync(dir)) {
        throw new Error(`Static folder with the path: ${dir} not found`);
      }
      const files = await globby("**/*", { cwd: dir });

      return files.map((file) => ({
        path: file,
        from: join(dir, file),
      }));
    },
  });
