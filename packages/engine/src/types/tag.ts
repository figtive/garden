import type { Post } from "./post.ts";

export type TagInfo = {
  name: string;
  file: string;
  description?: string;
  content: Post["content"];
};
