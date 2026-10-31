import type {
  SearchIndex,
  SearchPage,
  SearchSection,
} from "@figtive/garden-engine";
import MiniSearch, { type SearchResult } from "minisearch";
import { addKeyHandlers } from "../../utils/addKeyHandlers.ts";
import { formatDate } from "../../utils/date.ts";
import { debounce } from "../../utils/debounce.ts";
import { qs } from "../../utils/query-selector.ts";

const HIGHLIGHT_NAME = "search";
const HIGHLIGHT_SLOTS =
  '[data-slot="title"], [data-slot="heading"], [data-slot="snippet"]';

const SNIPPET_LENGTH = 140;
const SNIPPET_LEAD = 40;

const SECTIONS_PER_NOTE = 1;

const tokenize: (text: string) => string[] = MiniSearch.getDefault("tokenize");

type TextNodeOffset = { node: Text; start: number };

const loadSearchIndex = async (): Promise<SearchIndex> => {
  const response = await fetch("/search-index.json");

  if (!response.ok) {
    throw new Error(`search-index.json: response status ${response.status}`);
  }

  return response.json();
};

const buildSearchEngine = async () => {
  const { pages, sections } = await loadSearchIndex();

  const miniSearch = new MiniSearch<SearchSection>({
    idField: "url",
    fields: ["title", "heading", "text"],
    storeFields: ["page", "heading", "text"],
    tokenize,
    extractField: (section, field) => {
      const page = pages[section.page];

      if (field === "title") {
        return page?.title ?? "";
      }

      return String(section[field as keyof SearchSection] ?? "");
    },
    searchOptions: {
      boost: { title: 3, heading: 2 },
      combineWith: "AND",
      prefix: true,
    },
  });

  miniSearch.addAll(sections);

  return {
    miniSearch,
    pages,
  };
};

const setSlotText = (parent: ParentNode, slot: string, text: string) => {
  qs(`[data-slot="${slot}"]`, parent).textContent = text;
};

const resultMatchedField = (result: SearchResult, field: string) =>
  Object.values(result.match).some((fields) => fields.includes(field));

const getOwnMatchedSections = (results: SearchResult[], page: SearchPage) => {
  const matches = results.filter(
    (result) =>
      resultMatchedField(result, "heading") ||
      resultMatchedField(result, "text"),
  );

  if (matches.length > 0) {
    return matches;
  }

  const intro = results.find((result) => result.heading === page.title);

  return intro ? [intro] : results.slice(0, 1);
};

const findTermMatches = (text: string, terms: string[]) => {
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
      matches.push({ start, end: cursor });
    }
  }

  return matches;
};

const getSnippetAroundMatch = (text: string, terms: string[]) => {
  const match = findTermMatches(text, terms)[0]?.start ?? 0;

  let start = Math.max(0, match - SNIPPET_LEAD);
  let end = Math.min(text.length, start + SNIPPET_LENGTH);

  if (start > 0) {
    const space = text.indexOf(" ", start);
    start = space !== -1 && space < match ? space + 1 : match;
  }

  if (end < text.length) {
    const space = text.lastIndexOf(" ", end);
    if (space > match) {
      end = space;
    }
  }

  const lead = start > 0 ? "…" : "";
  const tail = end < text.length ? "…" : "";

  return lead + text.slice(start, end).trim() + tail;
};

const getTextNodeOffsets = (element: Element) => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const offsets: TextNodeOffset[] = [];
  let text = "";

  let node: Text | null;

  while (walker.nextNode()) {
    node = walker.currentNode as Text;
    offsets.push({
      node,
      start: text.length,
    });
    text += node.data;
  }

  return { text, offsets };
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

const getMatchRanges = (root: ParentNode, terms: string[]) => {
  const ranges: StaticRange[] = [];

  for (const slot of root.querySelectorAll(HIGHLIGHT_SLOTS)) {
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

const groupResultsByPage = (results: SearchResult[]) => {
  const groups = new Map<number, SearchResult[]>();

  for (const result of results) {
    let group: SearchResult[] = [];

    if (groups.has(result.page)) {
      group = groups.get(result.page) as SearchResult[];
    }
    group.push(result);
    groups.set(result.page, group);
  }

  return groups;
};

const pluralize = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

export default function () {
  const dialog = qs<HTMLDialogElement>(".search");
  const openButton = qs<HTMLButtonElement>(".search__open");
  const closeButton = qs<HTMLButtonElement>(".search__close");
  const searchInput = qs<HTMLInputElement>(".search__input");
  const rowTemplate = qs<HTMLTemplateElement>("#search-row");
  const groupTemplate = qs<HTMLTemplateElement>("#search-group");
  const resultsList = qs<HTMLElement>(".search__results");
  const status = qs<HTMLElement>(".search__status");

  let searchEngine: ReturnType<typeof buildSearchEngine> | undefined;
  let matchedTerms: string[] = [];

  const createResultRow = (result: SearchResult, page: SearchPage) => {
    const row = rowTemplate.content.cloneNode(true) as DocumentFragment;
    const heading = result.heading === page.title ? "intro" : result.heading;
    const snippet = resultMatchedField(result, "text")
      ? getSnippetAroundMatch(result.text, result.terms)
      : "";

    qs<HTMLAnchorElement>("a", row).href = result.id;
    setSlotText(row, "heading", heading);
    setSlotText(row, "snippet", snippet);

    return row;
  };

  const createPageGroup = (page: SearchPage, results: SearchResult[]) => {
    const group = groupTemplate.content.cloneNode(true) as DocumentFragment;
    const groupElement = qs<HTMLElement>(".search__group", group);
    const titleLink = qs<HTMLAnchorElement>(".search__group-title", group);
    const rows = qs(".search__group-rows", group);
    const moreButton = qs<HTMLButtonElement>(".search__more", group);

    const shown = results.slice(0, SECTIONS_PER_NOTE);
    const hidden = results.slice(SECTIONS_PER_NOTE);

    groupElement.dataset.showStage = page.data.stage ?? "";
    groupElement.setAttribute("aria-label", page.title);
    titleLink.href = page.url;
    setSlotText(group, "title", page.title);
    setSlotText(
      group,
      "date",
      formatDate(page.updated ?? page.date, { short: true }),
    );

    rows.append(...shown.map((result) => createResultRow(result, page)));

    if (hidden.length === 0) {
      moreButton.remove();
      return group;
    }

    const showHidden = () => {
      const lastShown = rows.lastElementChild;

      rows.append(...hidden.map((result) => createResultRow(result, page)));
      moreButton.remove();
      highlightMatches(matchedTerms);

      const firstHidden = lastShown?.nextElementSibling;

      if (firstHidden instanceof HTMLElement) {
        firstHidden.focus();
      }
    };

    moreButton.textContent = `show ${hidden.length} more`;
    moreButton.addEventListener("click", showHidden);

    return group;
  };

  const highlightMatches = (terms: string[]) => {
    CSS.highlights.set(
      HIGHLIGHT_NAME,
      new Highlight(...getMatchRanges(resultsList, terms)),
    );
  };

  const openSearch = () => {
    dialog.showModal();
    searchInput.select();

    if (!searchEngine) {
      searchEngine = buildSearchEngine().catch((error) => {
        searchEngine = undefined;
        throw error;
      });
    }
  };

  const runSearch = debounce(async () => {
    if (!searchEngine) {
      return;
    }

    try {
      const { miniSearch, pages } = await searchEngine;
      const query = searchInput.value;
      const results = miniSearch.search(query);

      console.log(results);

      const groups = [...groupResultsByPage(results)].flatMap(
        ([pageIndex, pageResults]) => {
          const page = pages[pageIndex];

          if (!page) {
            return [];
          }

          return [
            {
              page,
              sections: getOwnMatchedSections(pageResults, page),
            },
          ];
        },
      );

      const sections = groups.flatMap((group) => group.sections);
      matchedTerms = [...new Set(sections.flatMap((section) => section.terms))];

      resultsList.replaceChildren(
        ...groups.map((group) => createPageGroup(group.page, group.sections)),
      );
      highlightMatches(matchedTerms);

      status.textContent = query
        ? `${pluralize(sections.length, "section")} · ${pluralize(groups.length, "note")}`
        : "";

      return results;
    } catch (error) {
      console.error(error);
    }
  }, 100);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => CSS.highlights.delete(HIGHLIGHT_NAME));

  openButton.addEventListener("click", openSearch);
  closeButton.addEventListener("click", () => dialog.close());
  searchInput.addEventListener("input", runSearch);

  addKeyHandlers(document, {
    "Mod+k": () => {
      if (dialog.open) {
        dialog.close();
      } else {
        openSearch();
      }
    },
  });
}
