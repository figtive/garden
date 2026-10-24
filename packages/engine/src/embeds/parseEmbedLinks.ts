import type { EmbedSource, Inline } from "../types/index.ts";

const EMBED_LINK = /!\[\[([^\]\n]+)\]\]/g;
const EMBED_SIZE = /^(?<width>\d+)(?:x(?<height>\d+))?$/;

type EmbedOptions = {
  alt?: string;
  width?: number;
  height?: number;
};

export function createEmbedSource(
  target: string,
  parts: string[],
): EmbedSource {
  const { src, fragment } = splitFragment(target.trim());
  const { alt, width, height } = parseEmbedOptions(parts);

  return {
    kind: "",
    src,
    alt: alt ?? fileName(src),
    width,
    height,
    fragment,
  };
}

export function splitEmbedLinks(text: string, line: number): Inline[] {
  const inlines: Inline[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(EMBED_LINK)) {
    const before = text.slice(lastIndex, match.index);

    if (before) {
      inlines.push({
        type: "inline:text",
        value: before,
      });
    }

    const [target = "", ...parts] = (match[1] ?? "").split("|");

    inlines.push({
      type: "inline:embed",
      source: createEmbedSource(target, parts),
      line: line + countLineBreaks(text.slice(0, match.index)),
    });

    lastIndex = match.index + match[0].length;
  }

  const after = text.slice(lastIndex);

  if (after) {
    inlines.push({
      type: "inline:text",
      value: after,
    });
  }

  return inlines;
}

function parseEmbedOptions(parts: string[]): EmbedOptions {
  const size = EMBED_SIZE.exec(parts.at(-1)?.trim() ?? "");
  const altParts = size ? parts.slice(0, -1) : parts;
  const alt = altParts.join("|").trim();

  return {
    alt: alt || undefined,
    width: size?.groups?.width ? Number(size.groups.width) : undefined,
    height: size?.groups?.height ? Number(size.groups.height) : undefined,
  };
}

function splitFragment(target: string): { src: string; fragment?: string } {
  const hashIndex = target.indexOf("#");

  if (hashIndex === -1) {
    return { src: target };
  }

  return {
    src: target.slice(0, hashIndex),
    fragment: target.slice(hashIndex + 1) || undefined,
  };
}

function fileName(src: string) {
  const name = src.split("/").at(-1) ?? "";
  return name.replace(/\.[^.]+$/, "");
}

function countLineBreaks(text: string) {
  return text.split("\n").length - 1;
}
