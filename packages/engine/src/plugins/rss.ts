import { absoluteUrl } from "../utils/url.ts";
import { definePlugin } from "./definePlugin.ts";

type RssPluginOptions = { path?: string; limit?: number };

function escapeXml(str: string): string {
  const charDictionary = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  } as const;

  return str.replace(/[<>&'"]/g, (char: string) => {
    return charDictionary[char as keyof typeof charDictionary];
  });
}

export const rssPlugin = ({
  path = "rss.xml",
  limit = 10,
}: RssPluginOptions = {}) =>
  definePlugin({
    name: "rss",
    pluginType: "emitter",
    head: [
      {
        tag: "link",
        rel: "alternate",
        type: "application/rss+xml",
        href: `/${path}`,
      },
    ],
    emit: ({ posts, site }) => {
      if (!site) {
        throw new Error("RSS plugin needs a `site: SiteConfig` to process.");
      }
      const mainUrl = absoluteUrl(site, "/");
      const mainDescription = escapeXml(site.description || site.title);

      const postRss = ({
        url,
        title,
        description,
        date,
      }: {
        url: string;
        title: string;
        description: string;
        date: string;
      }) => `
          <item>
          <title>${title}</title>
          <link>${url}</link>
          <description>${description}</description>
          <pubDate>${date}</pubDate>
          <guid isPermaLink="true">${url}</guid>
          </item>
      `;

      const rssDate = (date: string) =>
        new Date(`${date}T00:00:00Z`).toUTCString();

      const postItems = posts.slice(0, limit).map((post) => {
        const url = absoluteUrl(site, post.route.url);
        return postRss({
          title: escapeXml(post.meta.title),
          url,
          description: escapeXml(post.meta.description),
          date: rssDate(post.meta.date),
        });
      });

      const rss = `<?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0">

        <channel>
            <title>${escapeXml(site.title)}</title>
            <link>${mainUrl}</link>
            <description>${mainDescription}</description>

            ${postItems.join("\n")}

        </channel>

        </rss>
      `;

      return [{ path, content: rss }];
    },
  });
