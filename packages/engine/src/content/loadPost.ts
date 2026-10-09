import { readFile } from "node:fs/promises";
import type { MarkdownIt } from "markdown-it";
import type { Post, PostFile } from "../types.ts";
import { parseFrontmatter } from "./parseFrontmatter.ts";
import { splitFrontmatter } from "./splitFrontmatter.ts";
import { validateFrontmatter } from "./validateFrontmatter.ts";

export async function loadPost(file: PostFile, md: MarkdownIt) {
  const source = await readFile(file.file, "utf-8");
  const { frontmatter, body } = splitFrontmatter(source);
  const metaObj = parseFrontmatter(frontmatter);

  const meta = validateFrontmatter(metaObj, file.file);

  const post: Post = {
    meta,
    route: {
      collection: file.collection,
      slug: file.slug,
      url: `/${file.collection}/${file.slug}/`,
    },
    content: {
      html: md.render(body),
    },
    pluginOutput: {},
  };

  return post;
}
