import { GARDEN_DIRECTIVE_PLACEHOLDER } from "../constants.ts";
import { type FoundDirective, parseDirectiveLine } from "./parseDirectives.ts";

export function extractDirectives(
  body: string,
  registeredDirectives: Set<string>,
) {
  const directives: (FoundDirective & { line: number })[] = [];
  let withinCodeBlock = false;

  const lines = body.split("\n").map((text, i) => {
    if (text.trim().startsWith("```")) {
      withinCodeBlock = !withinCodeBlock;
      return text;
    }
    if (withinCodeBlock) {
      return text;
    }

    const found = parseDirectiveLine(text);

    if (!found || !registeredDirectives.has(found.name)) {
      return text;
    }

    directives.push({ ...found, line: i + 1 });

    return GARDEN_DIRECTIVE_PLACEHOLDER;
  });

  return {
    body: lines.join("\n"),
    directives,
  };
}
