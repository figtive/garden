// packages/engine/src/content/findPosts.ts

import { posix } from "node:path";
import { globby } from "globby";
import type { Config, PostFile } from "../types.ts";

export const findPosts = async (config: Config): Promise<PostFile[]> => {
  const files = await globby("*/*/index.md", {
    cwd: config.content,
    ignore: ["**/_*/**"],
  });

  return files.sort().map((file) => {
    const dir = posix.dirname(file);
    return {
      file: posix.join(config.content, file),
      collection: posix.dirname(dir),
      slug: posix.basename(dir),
    };
  });
};
