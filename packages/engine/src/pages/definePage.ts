import { createElement } from "react";
import type { Page, PageDefinition } from "../types/index.ts";

export function definePage<TPost, Props extends object>(
  page: PageDefinition<TPost, Props>,
): Page<TPost> {
  return {
    routes: async (site) => {
      const routes = await page.paths(site);
      return routes.map((route) => ({
        url: route.url,
        element: createElement(page.component, { ...site, ...route.props }),
      }));
    },
  };
}
