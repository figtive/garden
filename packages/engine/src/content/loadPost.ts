import { readFile } from "node:fs/promises";
import { renderBlocks } from "../renderer/renderBlock.tsx";
import { createBlockComponents } from "../renderer/tokenMapper.tsx";
import type { Config, Post, PostFile } from "../types/index.ts";
import type { CodeHighlighter } from "./codeHighlighter.ts";
import { highlightTokens } from "./highlightTokens.ts";
import { parseFrontmatter } from "./parseFrontmatter.ts";
import { splitFrontmatter } from "./splitFrontmatter.ts";
import { tokenizeMarkdown } from "./tokenize/index.ts";
import { validateFrontmatter } from "./validateFrontmatter.ts";

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
