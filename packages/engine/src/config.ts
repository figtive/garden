import { existsSync } from "node:fs";
import { join } from "node:path";
import { tsImport } from "tsx/esm/api";
import { DEFAULT_CONTENT_PATH, GARDEN_CONFIG_FILE } from "./constants.ts";

export type Config = {
    content: string;
}


const defineGardenConfig = (config: Partial<Config>): Config => {
    return {
        content: config.content || DEFAULT_CONTENT_PATH
    }
};


const loadConfig = async (root = process.cwd()): Promise<Config> => {
    const file = join(root, GARDEN_CONFIG_FILE);

    if (!existsSync(file)) {
        return defineGardenConfig({});
    }

    const mod = await tsImport(file, import.meta.url);
    return defineGardenConfig(mod.default ?? {});
}



export { defineGardenConfig, loadConfig };
