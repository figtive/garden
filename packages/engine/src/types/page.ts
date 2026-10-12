import type { ComponentType, ReactElement } from "react";
import type { DefaultPlugins } from "../plugins/defaultPlugins.ts";
import type { InferPost } from "./plugin.ts";

export type PostWithDefaultPlugins = InferPost<DefaultPlugins>;

export type Group<TPost> = { key: string; posts: TPost[] };

export type SiteData<TPost> = {
  posts: TPost[];
};

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
export type StyleGroup = {
  files: string[];
  precedence?: string;
};

export type Styles = string[] | StyleGroup;

export type PageOptions = {
  styles?: Styles;
};
