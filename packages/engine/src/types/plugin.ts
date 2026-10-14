import type { SiteConfig } from "./config.ts";
import type { HeadTag } from "./head.ts";
import type { Post, PostMeta } from "./post.ts";

export type PluginHead = HeadTag[] | ((site: SiteConfig) => HeadTag[]);

type BasePlugin<T extends string> = {
  name: string;
  head?: PluginHead;
  pluginType: T;
};

export type FilterPlugin = BasePlugin<"filter"> & {
  filter: (meta: PostMeta) => boolean;
};

export type TransformerPlugin<Out extends object = object> =
  BasePlugin<"transformer"> & {
    transform: (post: Post) => Out;
  };

export type EmitterPlugin = BasePlugin<"emitter"> & {
  emit: (options: {
    posts: Post[];
    site: SiteConfig;
  }) => EmittedFile[] | Promise<EmittedFile[]>;
};

export type EmittedFile =
  | { path: string; content: string }
  | { path: string; from: string };

export type Plugin = FilterPlugin | TransformerPlugin | EmitterPlugin;

type ExtractIntersection<U> = {
  [k in U extends unknown ? keyof U : never]: U extends { [P in k]: infer V }
    ? V
    : never;
};

type OutputOf<P> = P extends TransformerPlugin<infer Out> ? Out : never;

export type InferPluginOutput<P extends readonly Plugin[]> = [
  OutputOf<P[number]>,
] extends [never]
  ? Record<never, never>
  : ExtractIntersection<OutputOf<P[number]>>;

export type InferPost<P extends readonly Plugin[]> = Post<InferPluginOutput<P>>;
