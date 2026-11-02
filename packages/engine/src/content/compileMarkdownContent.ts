import { useContext } from "react";
import { resolveEmbeds } from "../embeds/resolveEmbeds.ts";
import type { CodeHighlighter } from "../markdown/highlight/createCodeHighlighter.ts";
import { highlightTokens } from "../markdown/highlight/highlightTokens.ts";
import { tokenizeMarkdown } from "../markdown/tokenize/index.ts";
import { createBlockComponents } from "../render/content/blockComponents.tsx";
import { LocalPostUrlsContext } from "../render/content/localPostUrls.ts";
import { renderBlocks } from "../render/content/renderBlocks.tsx";
import type { Config, Post } from "../types/index.ts";

type CompileOptions = {
  file: string;
  url: string;
  lineOffset: number;
  config: Config;
  highlighter: CodeHighlighter;
};

export async function compileMarkdownContent(
  body: string,
  { file, url, lineOffset, config, highlighter }: CompileOptions,
): Promise<Post["content"]> {
  const registeredDirectives = new Set(Object.keys(config.directives));

  const tokens = tokenizeMarkdown(body, registeredDirectives);

  const assets = resolveEmbeds(tokens, {
    postFile: file,
    postUrl: url,
    lineOffset,
    attachments: config.attachments,
    embeds: config.embeds,
  });

  const highlightedTokens = await highlightTokens(tokens, highlighter);

  const defaultComponents = createBlockComponents(
    config.directives,
    config.embeds,
  );

  return {
    tokens: highlightedTokens,
    assets,
    Content: ({ components }) => {
      const allPostUrls = useContext(LocalPostUrlsContext);

      return renderBlocks(highlightedTokens, {
        components: {
          ...defaultComponents,
          ...components,
        },
        embeds: config.embeds,
        allPostUrls,
        currentPostUrl: url,
      });
    },
  };
}
