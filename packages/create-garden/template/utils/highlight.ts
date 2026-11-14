import MiniSearch from "minisearch";

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

export const getMatchRanges = (
  root: ParentNode,
  terms: string[],
  slots: string,
) => {
  const ranges: Range[] = [];

  for (const slot of root.querySelectorAll(slots)) {
    const walker = document.createTreeWalker(slot, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const textNode = walker.currentNode as Text;

      for (const match of findTermMatches(textNode.data, terms)) {
        const range = document.createRange();

        range.setStart(textNode, match.start);
        range.setEnd(textNode, match.end);
        ranges.push(range);
      }
    }
  }

  return ranges;
};
