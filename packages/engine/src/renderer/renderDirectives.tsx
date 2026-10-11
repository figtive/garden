import { renderToStaticMarkup } from "react-dom/server";
import { GARDEN_DIRECTIVE_PLACEHOLDER } from "../constants.ts";
import { parseDirectiveProps } from "../content/parseDirectiveProps.ts";
import type { FoundDirective } from "../content/parseDirectives.ts";
import type { Directive } from "../types/index.ts";

export function renderDirectives(
  html: string,
  found: FoundDirective[],
  directives: Record<string, Directive>,
) {
  let result = html;

  for (const { name, rawProps } of found) {
    const directive = directives[name];
    if (!directive) {
      continue;
    }

    const rendered = renderToStaticMarkup(
      directive.render(parseDirectiveProps(rawProps)),
    );

    result = result.replace(GARDEN_DIRECTIVE_PLACEHOLDER, () => rendered);
  }

  return result;
}
