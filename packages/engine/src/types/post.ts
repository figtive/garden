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
    html: string;
  };
  pluginOutput: Out;
};
