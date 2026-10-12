import { createElement } from "react";
import { withStyles } from "../renderer/withStyles.tsx";
import type { Page, PageDefinition, PageOptions } from "../types/index.ts";

export function definePage<TPost, Props extends object>(
  page: PageDefinition<TPost, Props>,
  extraOptions?: PageOptions,
): Page<TPost> {
  return {
    routes: async (site) => {
      const routes = await page.paths(site);

      return routes.map((route) => ({
        url: route.url,
        element: withStyles(
          createElement(page.component, { ...site, ...route.props }),
          extraOptions?.styles ?? [],
          "page",
        ),
      }));
    },
  };
}
