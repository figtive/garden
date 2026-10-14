import { draftsPlugin } from "./drafts.ts";
import { readingTimePlugin } from "./readingTime.ts";
import { rssPlugin } from "./rss.ts";
import { staticPlugin } from "./static.ts";

export const defaultPlugins = [
  draftsPlugin(),
  readingTimePlugin(),
  staticPlugin(),
  rssPlugin(),
];

export type DefaultPlugins = typeof defaultPlugins;
