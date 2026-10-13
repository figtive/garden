import { createElement, Fragment, type ReactElement } from "react";
import type { HeadTag, SiteConfig } from "../types/index.ts";

const withBase = (site: SiteConfig, value: string | boolean) =>
  typeof value === "string" && value.startsWith("/")
    ? `${site.basePath ?? ""}${value}`
    : value;

const headTag = (site: SiteConfig, { tag, ...attrs }: HeadTag, i: number) =>
  createElement(tag, {
    key: i,
    ...Object.fromEntries(
      Object.entries(attrs).map(([name, value]) => [
        name,
        name === "href" || name === "src" ? withBase(site, value) : value,
      ]),
    ),
    ...(tag === "script" && { async: true }),
  });

export function withHead(element: ReactElement, site: SiteConfig) {
  const tags = (site.head ?? []).map((tag, i) => headTag(site, tag, i));

  return createElement(Fragment, null, ...tags, element);
}
