import { draftsPlugin } from "./drafts.ts";
import { embedsPlugin } from "./embedsPlugin.ts";
import { readingTimePlugin } from "./readingTime.ts";
import { rssPlugin } from "./rss.ts";
import { searchPlugin } from "./search.ts";
import { staticPlugin } from "./static.ts";
import { tocPlugin } from "./toc.ts";

export const defaultPlugins = [
  draftsPlugin(),
  readingTimePlugin(),
  staticPlugin(),
  rssPlugin(),
  embedsPlugin(),
  tocPlugin(),
  searchPlugin(),
];

export type DefaultPlugins = typeof defaultPlugins;
