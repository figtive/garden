import type { Post, PostMeta } from "../types.ts";

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

export function definePlugin<const P extends Plugin>(plugin: P): P {
  return plugin;
}

export const isFilter = (p: Plugin): p is FilterPlugin =>
  p.pluginType === "filter";
export const isTransformer = (p: Plugin): p is TransformerPlugin =>
  p.pluginType === "transformer";
export const isEmitter = (p: Plugin): p is EmitterPlugin =>
  p.pluginType === "emitter";
