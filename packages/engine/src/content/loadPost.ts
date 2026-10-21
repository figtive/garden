import { readFile } from "node:fs/promises";
import { renderBlocks } from "../renderer/renderBlock.tsx";
import { createBlockComponents } from "../renderer/tokenMapper.tsx";
import type { Config, Post, PostFile } from "../types/index.ts";
import { parseFrontmatter } from "./parseFrontmatter.ts";
import { splitFrontmatter } from "./splitFrontmatter.ts";
import { tokenizeMarkdown } from "./tokenize/index.ts";
import { validateFrontmatter } from "./validateFrontmatter.ts";

export async function loadPost(file: PostFile, config: Config) {
  const source = await readFile(file.file, "utf-8");
  const { frontmatter, body } = splitFrontmatter(source);
  const metaObj = parseFrontmatter(frontmatter);

  const registeredDirectives = new Set(Object.keys(config.directives));

  const meta = validateFrontmatter(metaObj, file.file);

  const tokens = tokenizeMarkdown(body, registeredDirectives);
  const defaultComponents = createBlockComponents(config.directives);

  const post: Post = {
    meta,
    route: {
      collection: file.collection,
      slug: file.slug,
      url: `/${file.collection}/${file.slug}/`,
    },
    content: {
      tokens,
      Content: ({ components }) =>
        renderBlocks(tokens, { ...defaultComponents, ...components }),
    },
    pluginOutput: {},
  };

  return post;
}
