import { draftsPlugin } from "./drafts.ts";
import { readingTimePlugin } from "./readingTime.ts";

export const defaultPlugins = [draftsPlugin(), readingTimePlugin()];
export type DefaultPlugins = typeof defaultPlugins;
