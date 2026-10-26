import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
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

registerHooks({
  load(url, context, nextLoad) {
    if (!url.endsWith(".client.ts") || url.includes("/node_modules/")) {
      return nextLoad(url, context);
    }
    return {
      format: "module",
      source: `export default ${JSON.stringify(url)};`,
      shortCircuit: true,
    };
  },
});

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

  const mod = await import(pathToFileURL(file).href);
  if (!mod.default) {
    throw new Error(
      `${GARDEN_CONFIG_FILE} must export default defineGardenConfig({ ... })`,
    );
  }
  return mod.default;
};

export { defineGardenConfig, loadConfig };
