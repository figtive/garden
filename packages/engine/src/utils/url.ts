import type { SiteConfig } from "../types/config.ts";

export const isValidUrl = (url: string) => /^\/(?:[a-zA-Z0-9-]+\/)*$/.test(url);

export const absoluteUrl = (site: SiteConfig, path: string) =>
  path.startsWith("http") ? path : `${site.url}${site.basePath ?? ""}${path}`;

export const pagePath = (href: string) => {
  if (!href.startsWith("/") || href.startsWith("//")) {
    return undefined;
  }

  const path = href.split(/[?#]/)[0] ?? "";

  return path.endsWith("/") ? path : `${path}/`;
};
