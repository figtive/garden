import { existsSync } from "node:fs";
import { join } from "node:path";
import { tsImport } from "tsx/esm/api";
import { DEFAULT_CONTENT_PATH, GARDEN_CONFIG_FILE } from "./constants.ts";
import {
  type DefaultPlugins,
  defaultPlugins,
} from "./plugins/defaultPlugins.ts";
import type { Plugin } from "./plugins/definePlugin.ts";
import type { Config, UserConfig } from "./types.ts";

const defineGardenConfig = <const P extends readonly Plugin[] = DefaultPlugins>(
  config: UserConfig<P>,
): Config<P> => ({
  ...config,
  content: config.content ?? DEFAULT_CONTENT_PATH,
  plugins: (config.plugins ?? defaultPlugins) as unknown as P,
});

const loadConfig = async (root = process.cwd()): Promise<Config> => {
  const file = join(root, GARDEN_CONFIG_FILE);

  if (!existsSync(file)) {
    throw new Error(`No ${GARDEN_CONFIG_FILE} found in ${root}`);
  }

  const mod = await tsImport(file, import.meta.url);
  if (!mod.default) {
    throw new Error(
      `${GARDEN_CONFIG_FILE} must export default defineGardenConfig({ ... })`,
    );
  }
  return mod.default;
};

export { defineGardenConfig, loadConfig };
