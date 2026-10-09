import type { ComponentType } from "react";
import type { DefaultPlugins } from "./plugins/defaultPlugins.ts";
import type { InferPost, Plugin } from "./plugins/definePlugin.ts";

export type FrontmatterValue = string | boolean | string[];

export type PostFile = {
  file: string; // "content/posts/hello-world/index.md"
  collection: string; // "posts"
  slug: string; // "hello-world"
};

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

export type UserConfig<P extends readonly Plugin[] = readonly Plugin[]> = {
  content?: string;
  plugins?: P;
  layouts: { post: ComponentType<LayoutProps<InferPost<NoInfer<P>>>> };
};

export type Config<P extends readonly Plugin[] = readonly Plugin[]> =
  UserConfig<P> & { content: string } & { plugins: P };

export type LayoutProps<TPost = InferPost<DefaultPlugins>> = {
  post: TPost;
  posts: TPost[];
};
