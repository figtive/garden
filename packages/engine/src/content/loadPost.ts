import { readFile } from "node:fs/promises";
import { resolveEmbeds } from "../embeds/resolveEmbeds.ts";
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
  const { frontmatter, body, bodyLineOffset } = splitFrontmatter(
    source,
    file.file,
  );
  const metaObj = parseFrontmatter(frontmatter);

  const registeredDirectives = new Set(Object.keys(config.directives));

  const meta = validateFrontmatter(metaObj, file.file);

  const url = `/${file.collection}/${file.slug}/`;

  const tokens = tokenizeMarkdown(body, registeredDirectives);

  const assets = resolveEmbeds(tokens, {
    postFile: file.file,
    postUrl: url,
    lineOffset: bodyLineOffset,
    attachments: config.attachments,
    embeds: config.embeds,
  });

  const highlightedTokens = await highlightTokens(tokens, highlighter);

  const defaultComponents = createBlockComponents(
    config.directives,
    config.embeds,
  );

  const post: Post = {
    meta,
    route: {
      collection: file.collection,
      slug: file.slug,
      url,
    },
    content: {
      tokens: highlightedTokens,
      assets,
      Content: ({ components }) =>
        renderBlocks(highlightedTokens, {
          components: { ...defaultComponents, ...components },
          embeds: config.embeds,
        }),
    },
    pluginOutput: {},
  };

  return post;
}
