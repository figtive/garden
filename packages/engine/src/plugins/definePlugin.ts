import type {
  EmitterPlugin,
  FilterPlugin,
  Plugin,
  TransformerPlugin,
} from "../types/index.ts";

export function definePlugin<const P extends Plugin>(plugin: P): P {
  return plugin;
}

export const isFilter = (p: Plugin): p is FilterPlugin =>
  p.pluginType === "filter";

export const isTransformer = (p: Plugin): p is TransformerPlugin =>
  p.pluginType === "transformer";

export const isEmitter = (p: Plugin): p is EmitterPlugin =>
  p.pluginType === "emitter";
