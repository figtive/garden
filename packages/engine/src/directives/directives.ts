import { createElement } from "react";
import type {
  Directive,
  LooseDirectiveDefinitions,
  StrictDirectiveDefinitions,
} from "../types/index.ts";

export function defineDirective(options: LooseDirectiveDefinitions): Directive;

export function defineDirective<Props extends object>(
  options: StrictDirectiveDefinitions<Props>,
): Directive;

export function defineDirective(
  options: LooseDirectiveDefinitions | StrictDirectiveDefinitions<object>,
): Directive {
  return {
    render: (raw) =>
      "props" in options
        ? createElement(options.component, options.props(raw))
        : createElement(options.component, raw),
  };
}
