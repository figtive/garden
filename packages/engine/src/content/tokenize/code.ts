import type { Code } from "mdast";
import type { Block } from "../../types/index.ts";

const TITLE_META = /title="(?<title>[^"]*)"/;
const HIGHLIGHT_META = /\{(?<lines>[\d,\s-]+)\}/;

export function convertCode(node: Code): Block {
  const meta = node.meta ?? "";

  return {
    type: "block:code",
    language: node.lang ?? undefined,
    title: TITLE_META.exec(meta)?.groups?.title,
    highlight: parseLineRanges(HIGHLIGHT_META.exec(meta)?.groups?.lines ?? ""),
    code: node.value,
  };
}

function parseLineRanges(ranges: string): number[] {
  return ranges.split(",").flatMap((range) => {
    const [first, last = first] = range
      .split("-")
      .map((n) => Number.parseInt(n, 10));

    if (!first || !last || last < first) {
      return [];
    }

    return Array.from({ length: last - first + 1 }, (_, i) => first + i);
  });
}
