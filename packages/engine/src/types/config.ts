import type { Directive } from "./directives.ts";
import type { HeadTag } from "./head.ts";
import type { Page } from "./page.ts";
import type { InferPost, Plugin } from "./plugin.ts";

export type UserConfig<P extends readonly Plugin[] = readonly Plugin[]> = {
  content?: string;
  plugins?: P;
  directives?: Record<string, Directive>;
  pages: readonly Page<InferPost<NoInfer<P>>>[];
  styles?: string[];
} & {
  site: SiteConfig;
};

export type Config<P extends readonly Plugin[] = readonly Plugin[]> =
  UserConfig<P> & {
    content: string;
  } & {
    plugins: P;
    directives: Record<string, Directive>;
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
