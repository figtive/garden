import MarkdownIt from "markdown-it";
import { loadConfig } from "./config.ts";
import { findPosts } from "./content/findPosts.ts";
import { loadPost } from "./content/loadPost.ts";
import { isPublished } from "./plugins/drafts.ts";
import { renderPage } from "./renderer/renderPage.tsx";
import type { Post } from "./types.ts";
import { byDateNewestFirst } from "./utils/sort.ts";

export async function build() {
  const config = await loadConfig();
  const files = await findPosts(config);

  const md = new MarkdownIt();

  const all = await Promise.all(files.map((file) => loadPost(file, md)));

  // all the filters
  const posts = all
    .filter(({ meta }: Post) => isPublished(meta))
    .sort(({ meta: metaA }, { meta: metaB }) =>
      byDateNewestFirst(metaA.date, metaB.date),
    );

  for (const post of posts) {
    await renderPage(config.layouts.post, { post, posts }, post.route.url);
  }
}
