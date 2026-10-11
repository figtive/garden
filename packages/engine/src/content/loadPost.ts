import { readFile } from "node:fs/promises";
import type { MarkdownIt } from "markdown-it";
import { renderDirectives } from "../renderer/renderDirectives.tsx";
import type { Config, Post, PostFile } from "../types/index.ts";
import { extractDirectives } from "./extractDirectives.ts";
import { parseFrontmatter } from "./parseFrontmatter.ts";
import { splitFrontmatter } from "./splitFrontmatter.ts";
import { validateFrontmatter } from "./validateFrontmatter.ts";

export async function loadPost(file: PostFile, md: MarkdownIt, config: Config) {
  const source = await readFile(file.file, "utf-8");
  const { frontmatter, body } = splitFrontmatter(source);
  const metaObj = parseFrontmatter(frontmatter);

  const registeredDirectives = new Set(Object.keys(config.directives));

  const meta = validateFrontmatter(metaObj, file.file);

  const { body: bodyWithPlaceholders, directives } = extractDirectives(
    body,
    registeredDirectives,
  );
  const html = renderDirectives(
    md.render(bodyWithPlaceholders),
    directives,
    config.directives,
  );

  const post: Post = {
    meta,
    route: {
      collection: file.collection,
      slug: file.slug,
      url: `/${file.collection}/${file.slug}/`,
    },
    content: {
      html: html,
    },
    pluginOutput: {},
  };

  return post;
}
