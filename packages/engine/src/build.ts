import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import MarkdownIt from "markdown-it";
import { loadConfig } from "./config.ts";
import findPosts from "./content/findPosts.ts";
import parseFrontmatter from "./content/parseFrontmatter.ts";
import splitFrontmatter from "./content/splitFrontMatter.ts";
import validateFrontmatter from "./content/validateFrontmatter.ts";
import postRenderer from "./renderer/postRenderer.tsx";
import type { LayoutProps } from "./types.ts";

export default async () => {
  const config = await loadConfig();
  const posts = await findPosts(config);

  const md = new MarkdownIt();

  for (const post of posts) {
    const source = await readFile(post.file, "utf-8");
    const { frontmatter, body } = splitFrontmatter(source);
    const metaObj = parseFrontmatter(frontmatter);

    const meta = validateFrontmatter(metaObj, post.file);

    const props: LayoutProps = {
      post: {
        ...meta,
        html: md.render(body),
        slug: post.slug,
      },
    };

    await postRenderer(config.layouts.post, props, post);
  }
};
