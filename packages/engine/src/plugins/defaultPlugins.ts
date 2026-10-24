import { draftsPlugin } from "./drafts.ts";
import { embedsPlugin } from "./embedsPlugin.ts";
import { readingTimePlugin } from "./readingTime.ts";
import { rssPlugin } from "./rss.ts";
import { staticPlugin } from "./static.ts";

export const defaultPlugins = [
  draftsPlugin(),
  readingTimePlugin(),
  staticPlugin(),
  rssPlugin(),
  embedsPlugin(),
];

export type DefaultPlugins = typeof defaultPlugins;
