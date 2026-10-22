import { readFile } from "node:fs/promises";
import type { CodeHighlighter } from "../markdown/highlight/createCodeHighlighter.ts";
import { highlightTokens } from "../markdown/highlight/highlightTokens.ts";
import { tokenizeMarkdown } from "../markdown/tokenize/index.ts";
import { createBlockComponents } from "../render/content/blockComponents.tsx";
import { renderBlocks } from "../render/content/renderBlocks.tsx";
import type { Config, Post, PostFile } from "../types/index.ts";
import { parseFrontmatter } from "./frontmatter/parseFrontmatter.ts";
import { splitFrontmatter } from "./frontmatter/splitFrontmatter.ts";
import { validateFrontmatter } from "./frontmatter/validateFrontmatter.ts";

export async function loadPost(
  file: PostFile,
  config: Config,
  highlighter: CodeHighlighter,
) {
  const source = await readFile(file.file, "utf-8");
  const { frontmatter, body } = splitFrontmatter(source);
  const metaObj = parseFrontmatter(frontmatter);

  const registeredDirectives = new Set(Object.keys(config.directives));

  const meta = validateFrontmatter(metaObj, file.file);

  const tokens = await highlightTokens(
    tokenizeMarkdown(body, registeredDirectives),
    highlighter,
  );
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
