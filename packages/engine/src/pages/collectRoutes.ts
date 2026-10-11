import type { ReactElement } from "react";
import type { SiteData } from "../types.ts";
import { isValidUrl } from "../utils/validator.ts";
import type { Page } from "./definePage.ts";

type ResolvedRoute = { url: string; element: ReactElement };

function checkUrls(routes: ResolvedRoute[]) {
  const seen = new Set<string>();
  for (const { url } of routes) {
    if (!url.startsWith("/") || !url.endsWith("/")) {
      throw new Error(`Page url must start and ends with "/": got "${url}"`);
    }
    if (seen.has(url)) {
      throw new Error(`Page path must be unique: "${url}"`);
    }

    if (isValidUrl(url)) {
      throw new Error(
        `URL is currently supported using only letters, numbers, and hyphens("-"): got "${url}"`,
      );
    }

    seen.add(url);
  }
}

export async function collectRoutes<TPost>(
  pages: readonly Page<TPost>[],
  site: SiteData<TPost>,
) {
  const routes = (await Promise.all(pages.map((p) => p.routes(site)))).flat();
  checkUrls(routes);
  return routes;
}
