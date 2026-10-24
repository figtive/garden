import type { CodeOptions } from "./code.ts";
import type { Directive } from "./directives.ts";
import type { Embed } from "./embeds.ts";
import type { HeadTag } from "./head.ts";
import type { Page } from "./page.ts";
import type { InferPost, Plugin } from "./plugin.ts";

export type UserConfig<P extends readonly Plugin[] = readonly Plugin[]> = {
  content?: string;
  plugins?: P;
  directives?: Record<string, Directive>;
  embeds?: Record<string, Embed>;
  attachments?: string;
  pages: readonly Page<InferPost<NoInfer<P>>>[];
  styles?: string[];
  code?: CodeOptions;
} & {
  site: SiteConfig;
};

export type Config<P extends readonly Plugin[] = readonly Plugin[]> =
  UserConfig<P> & {
    content: string;
    attachments: string;
  } & {
    plugins: P;
    directives: Record<string, Directive>;
    embeds: Record<string, Embed>;
  };

export type SiteConfig = {
  title: string;
  url: string;
  basePath?: string;
  description?: string;
  lang?: string;
  image?: string;
  author?: string;
  head?: HeadTag[];
};
