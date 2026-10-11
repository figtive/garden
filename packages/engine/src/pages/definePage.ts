import { type ComponentType, createElement, type ReactElement } from "react";
import type { Group, PostWithDefaultPlugins, SiteData } from "../types.ts";

export type PageProps<
  TPost = PostWithDefaultPlugins,
  Props = object,
> = SiteData<TPost> & Props;

export type PostPageProps<TPost = PostWithDefaultPlugins> = PageProps<
  TPost,
  { post: TPost }
>;
export type GroupPageProps<TPost = PostWithDefaultPlugins> = PageProps<
  TPost,
  { group: Group<TPost> }
>;

export type Route<Props> = { url: string; props: Props };

export type PageDefinition<TPost, Props> = {
  paths: (site: SiteData<TPost>) => Route<Props>[];
  component: ComponentType<SiteData<TPost> & Props>;
};

export type Page<TPost> = {
  routes: (
    site: SiteData<TPost>,
  ) => Promise<{ url: string; element: ReactElement }[]>;
};

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
