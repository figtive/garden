import { readFile } from "node:fs/promises";
import type { CodeHighlighter } from "../markdown/highlight/createCodeHighlighter.ts";
import type { Config, Post, PostFile } from "../types/index.ts";
import { compileMarkdownContent } from "./compileMarkdownContent.ts";
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

  const meta = validateFrontmatter(metaObj, file.file);

  const url = `/${file.collection}/${file.slug}/`;

  const content = await compileMarkdownContent(body, {
    file: file.file,
    url,
    lineOffset: bodyLineOffset,
    config,
    highlighter,
  });

  const post: Post = {
    meta,
    route: {
      collection: file.collection,
      slug: file.slug,
      url,
    },
    content,
    pluginOutput: {},
  };

  return post;
}
