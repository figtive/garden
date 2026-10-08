import type { ComponentType } from "react";

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

export type Post = {
  route: {
    collection: string;
    slug: string;
    url: string;
  };
  meta: PostMeta;
  content: {
    html: string;
  };
  // to do for plugin infer types
};

export type UserConfig = {
  content?: string;
  layouts: { post: ComponentType<LayoutProps> };
};

export type Config = UserConfig & { content: string };

export type LayoutProps = { post: Post; posts: Post[] };
