import type { ComponentType } from "react";

export type FrontmatterValue = string | boolean | string[];

export type PostFile = {
  file: string; // "content/posts/hello-world/index.md"
  folder: string; // "posts"
  slug: string; // "hello-world"
};

export type PostMeta = {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  draft?: boolean;
};

export type LayoutProps = {
  post: PostMeta & { html: string; slug: string };
};

export type UserConfig = {
  content?: string;
  layouts: { post: ComponentType<LayoutProps> };
};
export type Config = UserConfig & { content: string };
