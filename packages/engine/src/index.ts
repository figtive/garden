import { build } from "./build.ts";
import { defineGardenConfig } from "./config.ts";
import { groupBy } from "./content/groupBy.ts";
import { definePage } from "./pages/definePage.ts";
import {
  generatePostPages,
  generateStaticPage,
  generateTagPages,
} from "./pages/pageGenerator.ts";

import { defaultPlugins } from "./plugins/defaultPlugins.ts";
import { definePlugin } from "./plugins/definePlugin.ts";

export type {
  GroupPageProps,
  PageProps,
  PostPageProps,
} from "./pages/definePage.ts";

export type { InferPost } from "./plugins/definePlugin.ts";

export type {
  Group,
  PostMeta,
  PostWithDefaultPlugins,
  SiteData,
  UserConfig,
} from "./types.ts";

export {
  build,
  defaultPlugins,
  defineGardenConfig,
  definePage,
  definePlugin,
  generatePostPages,
  generateStaticPage,
  generateTagPages,
  groupBy,
};
