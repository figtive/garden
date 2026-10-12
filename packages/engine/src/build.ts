import MarkdownIt from "markdown-it";
import { loadConfig } from "./config.ts";
import { findPosts } from "./content/findPosts.ts";
import { loadPost } from "./content/loadPost.ts";
import { collectRoutes } from "./pages/collectRoutes.ts";
import { isEmitter, isFilter, isTransformer } from "./plugins/definePlugin.ts";
import { renderPage } from "./renderer/renderPage.tsx";
import { withStyles } from "./renderer/withStyles.tsx";
import { writeEmittedFile } from "./renderer/writeEmittedFile.ts";
import { byDateNewestFirst } from "./utils/sort.ts";

export async function build() {
  const config = await loadConfig();
  const files = await findPosts(config);
  const md = new MarkdownIt({ html: true });

  const all = await Promise.all(
    files.map((file) => loadPost(file, md, config)),
  );

  const filters = config.plugins.filter(isFilter);
  const transformers = config.plugins.filter(isTransformer);
  const emitters = config.plugins.filter(isEmitter);

  const kept = all.filter((post) => filters.every((f) => f.filter(post.meta)));

  const posts = kept
    .map((post) =>
      transformers.reduce(
        (acc, curr) => ({
          ...acc,
          pluginOutput: { ...acc.pluginOutput, ...curr.transform(acc) },
        }),
        post,
      ),
    )
    .sort((a, b) => byDateNewestFirst(a.meta.date, b.meta.date));

  const site = { posts };

  const routes = await collectRoutes(config.pages, site);

  for (const route of routes) {
    await renderPage(
      withStyles(route.element, config?.styles ?? [], "global"),
      route.url,
    );
  }

  const emitted = (
    await Promise.all(emitters.map((e) => e.emit({ posts })))
  ).flat();

  await Promise.all(emitted.map(writeEmittedFile));
}
