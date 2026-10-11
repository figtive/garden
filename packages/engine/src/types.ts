import type { Page } from "./pages/definePage.ts";
import type { DefaultPlugins } from "./plugins/defaultPlugins.ts";
import type { InferPost, Plugin } from "./plugins/definePlugin.ts";

export type FrontmatterValue = string | boolean | string[];

export type PostFile = {
  file: string; // "content/posts/hello-world/index.md"
  collection: string; // "posts"
  slug: string; // "hello-world"
};

export type Group<TPost> = { key: string; posts: TPost[] };

export type PostMeta = {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  draft?: boolean;
};

export type Post<Out = Record<never, never>> = {
  route: {
    collection: string;
    slug: string;
    url: string;
  };
  meta: PostMeta;
  content: {
    html: string;
  };
  pluginOutput: Out;
};

export type SiteData<TPost> = {
  posts: TPost[];
};

export type PostWithDefaultPlugins = InferPost<DefaultPlugins>;

export type Config<P extends readonly Plugin[] = readonly Plugin[]> =
  UserConfig<P> & { content: string } & { plugins: P };

export type PostLayoutProps<TPost = PostWithDefaultPlugins> =
  SiteData<TPost> & {
    post: TPost;
  };

export type IndexLayoutProps<TPost = PostWithDefaultPlugins> = SiteData<TPost>;

export type TagsLayoutProps<TPost = PostWithDefaultPlugins> = SiteData<TPost>;

export type TagLayoutProps<TPost = PostWithDefaultPlugins> = SiteData<TPost>;

export type UserConfig<P extends readonly Plugin[] = readonly Plugin[]> = {
  content?: string;
  plugins?: P;
  pages: readonly Page<InferPost<NoInfer<P>>>[];
};
