export type HeadMeta = {
  title: string;
  url: string;

  description?: string;
  type?: "website" | "article";
  image?: string;

  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
};

export type HeadTag = { tag: "link" | "meta" | "script" } & Record<
  string,
  string | boolean
>;
