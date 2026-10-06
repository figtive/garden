export type FrontmatterValue = string | boolean | string[];

export type PostMeta = {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  draft?: boolean;
};
