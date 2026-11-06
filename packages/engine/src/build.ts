import { rm } from "node:fs/promises";
import { loadConfig } from "./config/loadConfig.ts";
import { findPosts } from "./content/findPosts.ts";
import { loadPost } from "./content/loadPost.ts";
import { checkTagInfosAreUsed, loadTagInfos } from "./content/loadTagInfos.ts";
import { createCodeHighlighter } from "./markdown/highlight/createCodeHighlighter.ts";
import { writeEmittedFile } from "./output/writeEmittedFile.ts";
import { collectRoutes } from "./pages/collectRoutes.ts";
import {
  isEmitterPlugin,
  isFilterPlugin,
  isTransformerPlugin,
} from "./plugins/definePlugin.ts";
import { renderPage } from "./render/page/renderPage.tsx";
import { withHead } from "./render/page/withHead.tsx";
import { withLocalPostUrls } from "./render/page/withLocalPostUrls.tsx";
import { withMeta } from "./render/page/withMeta.tsx";
import { withStyles } from "./render/page/withStyles.tsx";
import type { HeadMeta } from "./types/head.ts";
import { resolveOption } from "./utils/resolver.ts";
import { byDateNewestFirst } from "./utils/sort.ts";

export async function build() {
  await rm("dist", {
    recursive: true,
    force: true,
  });
  const config = await loadConfig();
  const postFiles = await findPosts(config);

  const highlighter = await createCodeHighlighter(config.code);

  const allPosts = await Promise.all(
    postFiles.map((postFile) => loadPost(postFile, config, highlighter)),
  );

  const tagInfos = await loadTagInfos(config, highlighter);
  checkTagInfosAreUsed(tagInfos, allPosts);

  const filterPlugins = config.plugins.filter(isFilterPlugin);
  const transformerPlugins = config.plugins.filter(isTransformerPlugin);
  const emitterPlugins = config.plugins.filter(isEmitterPlugin);

  const filteredPosts = allPosts.filter((post) =>
    filterPlugins.every((filterPlugin) => filterPlugin.filter(post.meta)),
  );

  const posts = filteredPosts
    .map((post) =>
      transformerPlugins.reduce(
        (transformedPost, transformerPlugin) => ({
          ...transformedPost,
          pluginOutput: {
            ...transformedPost.pluginOutput,
            ...transformerPlugin.transform(transformedPost),
          },
        }),
        post,
      ),
    )
    .sort((firstPost, secondPost) =>
      byDateNewestFirst(firstPost.meta.date, secondPost.meta.date),
    );

  const siteData = {
    posts,
    tagInfos,
  };

  const routes = await collectRoutes(config.pages, siteData);

  const pluginHeadTags = config.plugins.flatMap((plugin) =>
    resolveOption(plugin.head, config.site, []),
  );
  const headTags = [...(config.site.head ?? []), ...pluginHeadTags];

  const localPostUrls = new Set(posts.map((post) => post.route.url));

  for (const route of routes) {
    const headMeta: HeadMeta = {
      title: config.site.title,
      ...route.meta,
      url: route.url,
    };

    const pageElement = withHead(
      withMeta(
        withStyles(
          withLocalPostUrls(route.element, localPostUrls),
          config.styles ?? [],
          "global",
        ),
        headMeta,
        config.site,
      ),
      headTags,
      config.site,
    );

    await renderPage(pageElement, route.url);
  }

  const emittedFiles = (
    await Promise.all(
      emitterPlugins.map((emitterPlugin) =>
        emitterPlugin.emit({
          posts,
          tagInfos,
          site: config.site,
        }),
      ),
    )
  ).flat();

  await Promise.all(emittedFiles.map(writeEmittedFile));
}
