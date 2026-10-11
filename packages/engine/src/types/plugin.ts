import type { Post, PostMeta } from "./post.ts";

export type FilterPlugin = {
  name: string;
  pluginType: "filter";
  filter: (meta: PostMeta) => boolean;
};

export type TransformerPlugin<Out extends object = object> = {
  name: string;
  pluginType: "transformer";
  transform: (post: Post) => Out;
};

export type EmitterPlugin = {
  name: string;
  pluginType: "emitter";
  emit: (posts: Post[]) => EmittedFile[];
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
