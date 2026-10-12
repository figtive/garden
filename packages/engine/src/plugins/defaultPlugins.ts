import { draftsPlugin } from "./drafts.ts";
import { readingTimePlugin } from "./readingTime.ts";
import { staticPlugin } from "./static.ts";

export const defaultPlugins = [
  draftsPlugin(),
  readingTimePlugin(),
  staticPlugin(),
];

export type DefaultPlugins = typeof defaultPlugins;
