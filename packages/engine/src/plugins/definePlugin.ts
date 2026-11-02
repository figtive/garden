import type {
  EmitterPlugin,
  FilterPlugin,
  Plugin,
  TransformerPlugin,
} from "../types/index.ts";

export function definePlugin<const P extends Plugin>(plugin: P): P {
  return plugin;
}

export const isFilterPlugin = (p: Plugin): p is FilterPlugin =>
  p.pluginType === "filter";

export const isTransformerPlugin = (p: Plugin): p is TransformerPlugin =>
  p.pluginType === "transformer";

export const isEmitterPlugin = (p: Plugin): p is EmitterPlugin =>
  p.pluginType === "emitter";
