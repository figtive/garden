import type { SiteConfig } from "../types/config.ts";

export const isValidUrl = (url: string) => /^\/[a-zA-Z0-9-]+\/$/.test(url);

export const absoluteUrl = (site: SiteConfig, path: string) =>
  path.startsWith("http") ? path : `${site.url}${site.basePath ?? ""}${path}`;
