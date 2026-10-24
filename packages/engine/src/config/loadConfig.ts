import { existsSync } from "node:fs";
import { join } from "node:path";
import { tsImport } from "tsx/esm/api";
import { defaultEmbeds } from "../embeds/defaultEmbeds.ts";
import {
  type DefaultPlugins,
  defaultPlugins,
} from "../plugins/defaultPlugins.ts";
import type { Config, Plugin, UserConfig } from "../types/index.ts";
import {
  DEFAULT_ATTACHMENTS_PATH,
  DEFAULT_CONTENT_PATH,
  GARDEN_CONFIG_FILE,
} from "./constants.ts";

const defineGardenConfig = <const P extends readonly Plugin[] = DefaultPlugins>(
  config: UserConfig<P>,
): Config<P> => ({
  ...config,
  content: config.content ?? DEFAULT_CONTENT_PATH,
  attachments: config.attachments ?? DEFAULT_ATTACHMENTS_PATH,
  plugins: (config.plugins ?? defaultPlugins) as unknown as P,
  embeds: {
    ...defaultEmbeds,
    ...config.embeds,
  },
  directives: config.directives ?? {},
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
