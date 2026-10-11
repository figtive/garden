import type { Page } from "./page.ts";
import type { InferPost, Plugin } from "./plugin.ts";

export type UserConfig<P extends readonly Plugin[] = readonly Plugin[]> = {
  content?: string;
  plugins?: P;
  pages: readonly Page<InferPost<NoInfer<P>>>[];
};

export type Config<P extends readonly Plugin[] = readonly Plugin[]> =
  UserConfig<P> & {
    content: string;
  } & {
    plugins: P;
  };
