import { createElement } from "react";
import { withStyles } from "../renderer/withStyles.tsx";
import type { Page, PageDefinition, PageOptions } from "../types/page.ts";
import { resolveOption } from "../utils/resolver.ts";

export function definePage<TPost, Props extends object>(
  page: PageDefinition<TPost, Props>,
  options: PageOptions<Props> = {},
): Page<TPost> {
  return {
    routes: async (site) => {
      const routes = await page.paths(site);

      return routes.map((route) => ({
        url: route.url,
        meta: resolveOption(options.meta, route.props, {}),
        element: withStyles(
          createElement(page.component, { ...site, ...route.props }),
          options.styles ?? [],
          "page",
        ),
      }));
    },
  };
}
