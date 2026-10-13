import { createElement, Fragment, type ReactElement } from "react";
import type { HeadMeta, SiteConfig } from "../types/index.ts";

const absoluteUrl = (site: SiteConfig, path: string) =>
  path.startsWith("http") ? path : `${site.url}${site.basePath ?? ""}${path}`;

const meta = (key: string, content: string) =>
  key.startsWith("og:") || key.startsWith("article:")
    ? createElement("meta", {
        key: `${key}-${content}`,
        property: key,
        content,
      })
    : createElement("meta", { key, name: key, content });

export function withMeta(
  element: ReactElement,
  head: HeadMeta,
  site: SiteConfig,
) {
  const url = absoluteUrl(site, head.url);
  const description = head.description ?? site.description;
  const image = head.image ?? site.image;
  const title =
    head.title === site.title ? site.title : `${head.title} · ${site.title}`;

  const ogTags = [
    meta("og:title", head.title),
    meta("og:url", url),
    meta("og:type", head.type ?? "website"),
    meta("og:site_name", site.title),

    description && meta("og:description", description),
    image && meta("og:image", absoluteUrl(site, image)),
  ];

  const articleTags = [
    head.publishedTime && meta("article:published_time", head.publishedTime),
    head.modifiedTime && meta("article:modified_time", head.modifiedTime),
    ...(head.tags ?? []).map((tag) => meta("article:tag", tag)),
  ];

  const tags = [
    createElement("meta", { key: "charset", charSet: "utf-8" }),
    createElement("title", { key: "title" }, title),
    createElement("link", { key: "canonical", rel: "canonical", href: url }),
    description && meta("description", description),
    ...ogTags,
    meta("twitter:card", image ? "summary_large_image" : "summary"),
    ...articleTags,
  ].filter(Boolean);

  return createElement(Fragment, null, ...tags, element);
}
