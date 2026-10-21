import type { ComponentType } from "react";
import type { Block, ContentProps } from "./tokens.ts";

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
  updated?: string;
  image?: string;
};

export type Post<Out = Record<never, never>> = {
  route: {
    collection: string;
    slug: string;
    url: string;
  };
  meta: PostMeta;
  content: {
    tokens: Block[];
    Content: ComponentType<ContentProps>;
  };
  pluginOutput: Out;
};
