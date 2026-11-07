import MiniSearch from "minisearch";

type TextNodeOffset = {
  node: Text;
  start: number;
};

export const tokenize: (text: string) => string[] =
  MiniSearch.getDefault("tokenize");

export const findTermMatches = (text: string, terms: string[]) => {
  const termSet = new Set(terms);
  const matches: { start: number; end: number }[] = [];
  let cursor = 0;

  for (const word of tokenize(text)) {
    if (!word) {
      continue;
    }

    const start = text.indexOf(word, cursor);
    cursor = start + word.length;

    if (termSet.has(word.toLowerCase())) {
      matches.push({
        start,
        end: cursor,
      });
    }
  }

  return matches;
};

const getTextNodeOffsets = (element: Element) => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const offsets: TextNodeOffset[] = [];
  let text = "";

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;

    offsets.push({
      node,
      start: text.length,
    });
    text += node.data;
  }

  return {
    text,
    offsets,
  };
};

const findTextPosition = (
  offsets: TextNodeOffset[],
  offset: number,
  edge: "start" | "end",
) => {
  for (const { node, start } of offsets) {
    const end = start + node.length;
    const isInside = edge === "start" ? offset < end : offset <= end;

    if (isInside) {
      return {
        node,
        offset: offset - start,
      };
    }
  }
};

export const getMatchRanges = (
  root: ParentNode,
  terms: string[],
  slots: string,
) => {
  const ranges: StaticRange[] = [];

  for (const slot of root.querySelectorAll(slots)) {
    const { text, offsets } = getTextNodeOffsets(slot);

    for (const match of findTermMatches(text, terms)) {
      const start = findTextPosition(offsets, match.start, "start");
      const end = findTextPosition(offsets, match.end, "end");

      if (start && end) {
        ranges.push(
          new StaticRange({
            startContainer: start.node,
            startOffset: start.offset,
            endContainer: end.node,
            endOffset: end.offset,
          }),
        );
      }
    }
  }

  return ranges;
};
