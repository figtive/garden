import { rm } from "node:fs/promises";
import { loadConfig } from "./config/loadConfig.ts";
import { findPosts } from "./content/findPosts.ts";
import { loadPost } from "./content/loadPost.ts";
import { createCodeHighlighter } from "./markdown/highlight/createCodeHighlighter.ts";
import { writeEmittedFile } from "./output/writeEmittedFile.ts";
import { collectRoutes } from "./pages/collectRoutes.ts";
import { isEmitter, isFilter, isTransformer } from "./plugins/definePlugin.ts";
import { renderPage } from "./render/page/renderPage.tsx";
import { withHead } from "./render/page/withHead.tsx";
import { withMeta } from "./render/page/withMeta.tsx";
import { withStyles } from "./render/page/withStyles.tsx";
import type { HeadMeta } from "./types/head.ts";
import { resolveOption } from "./utils/resolver.ts";
import { byDateNewestFirst } from "./utils/sort.ts";

export async function build() {
  await rm("dist", { recursive: true, force: true });
  const config = await loadConfig();
  const files = await findPosts(config);

  const highlighter = await createCodeHighlighter(config.code);

  const all = await Promise.all(
    files.map((file) => loadPost(file, config, highlighter)),
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

  const pluginHead = config.plugins.flatMap((plugin) =>
    resolveOption(plugin.head, config.site, []),
  );
  const headTags = [...(config.site.head ?? []), ...pluginHead];

  for (const route of routes) {
    const head: HeadMeta = {
      title: config.site.title,
      ...route.meta,
      url: route.url,
    };

    const element = withHead(
      withMeta(
        withStyles(route.element, config.styles ?? [], "global"),
        head,
        config.site,
      ),
      headTags,
      config.site,
    );
    await renderPage(element, route.url);
  }

  const emitted = (
    await Promise.all(emitters.map((e) => e.emit({ posts, site: config.site })))
  ).flat();

  await Promise.all(emitted.map(writeEmittedFile));
}
