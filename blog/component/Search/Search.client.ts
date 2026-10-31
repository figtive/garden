import type {
  SearchIndex,
  SearchPage,
  SearchSection,
} from "@figtive/garden-engine";
import MiniSearch, { type SearchResult } from "minisearch";
import { addKeyHandlers } from "../../utils/addKeyHandlers.ts";
import { clamp } from "../../utils/calculation.ts";
import { formatDate } from "../../utils/date.ts";
import { debounce } from "../../utils/debounce.ts";
import {
  findTermMatches,
  getMatchRanges,
  tokenize,
} from "../../utils/highlight.ts";
import { qs } from "../../utils/query-selector.ts";
import { createPreview } from "../Preview/createPreview.ts";

const HIGHLIGHT_NAME = "search";
const HIGHLIGHT_SLOTS =
  '[data-slot="title"], [data-slot="heading"], [data-slot="snippet"]';

const SNIPPET_LENGTH = 140;
const SNIPPET_LEAD = 40;

const SECTIONS_PER_NOTE = 1;

const WIDE_QUERY = "(width >= 50rem)";

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
      boost: {
        title: 3,
        heading: 2,
      },
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
  const resultsScroller = qs<HTMLElement>(".search__list");
  const status = qs<HTMLElement>(".search__status");
  const preview = createPreview(qs<HTMLElement>(".search__preview"));

  const wide = matchMedia(WIDE_QUERY);

  let searchEngine: ReturnType<typeof buildSearchEngine> | undefined;
  let matchedTerms: string[] = [];
  let resultRows: HTMLAnchorElement[] = [];
  let activeRow: HTMLAnchorElement | undefined;

  const scrollRowIntoView = (row: HTMLElement) => {
    const scrollerBound = resultsScroller.getBoundingClientRect();
    const rowBound = row.getBoundingClientRect();

    if (rowBound.top < scrollerBound.top) {
      resultsScroller.scrollTop -= scrollerBound.top - rowBound.top;
    } else if (rowBound.bottom > scrollerBound.bottom) {
      resultsScroller.scrollTop += rowBound.bottom - scrollerBound.bottom;
    }
  };

  const showPreview = debounce((row: HTMLAnchorElement | undefined) => {
    if (!row || !wide.matches || !dialog.open) {
      preview.clear();
      return;
    }

    preview.show(row.href, matchedTerms);
  }, 80);

  const updateResultRows = () => {
    resultRows = [
      ...resultsList.querySelectorAll<HTMLAnchorElement>(".search__link"),
    ];

    resultRows.forEach((row, index) => {
      row.id = `search-option-${index}`;
    });
  };

  const selectRow = (index: number) => {
    activeRow?.removeAttribute("data-active");
    activeRow?.setAttribute("aria-selected", "false");

    activeRow = resultRows[clamp(index, 0, resultRows.length - 1)];

    showPreview(activeRow);

    if (!activeRow) {
      searchInput.removeAttribute("aria-activedescendant");
      return;
    }

    activeRow.setAttribute("data-active", "");
    activeRow.setAttribute("aria-selected", "true");
    scrollRowIntoView(activeRow);
    searchInput.setAttribute("aria-activedescendant", activeRow.id);
  };

  const moveSelection = (step: number) => {
    const current = activeRow ? resultRows.indexOf(activeRow) : -1;
    selectRow(current + step);
  };

  const createResultRow = (result: SearchResult, page: SearchPage) => {
    const row = rowTemplate.content.cloneNode(true) as DocumentFragment;
    const isIntro = !result.heading || result.heading === page.title;
    const heading = isIntro ? "intro" : result.heading;
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
      formatDate(page.updated ?? page.date, {
        short: true,
      }),
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
      updateResultRows();

      const firstHidden = lastShown?.nextElementSibling;

      if (firstHidden instanceof HTMLAnchorElement) {
        selectRow(resultRows.indexOf(firstHidden));
      }

      searchInput.focus();
    };

    moreButton.textContent = `show ${hidden.length} more`;
    moreButton.addEventListener("click", showHidden);

    return group;
  };

  const highlightMatches = (terms: string[]) => {
    CSS.highlights.set(
      HIGHLIGHT_NAME,
      new Highlight(...getMatchRanges(resultsList, terms, HIGHLIGHT_SLOTS)),
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

      activeRow = undefined;
      updateResultRows();
      selectRow(0);

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

  const resetSearch = () => {
    searchInput.value = "";
    searchInput.removeAttribute("aria-activedescendant");
    resultsList.replaceChildren();
    resultsScroller.scrollTop = 0;
    status.textContent = "";

    matchedTerms = [];
    resultRows = [];
    activeRow = undefined;

    CSS.highlights.delete(HIGHLIGHT_NAME);
    preview.clear();
  };

  dialog.addEventListener("close", resetSearch);

  openButton.addEventListener("click", openSearch);
  closeButton.addEventListener("click", () => dialog.close());
  searchInput.addEventListener("input", runSearch);

  addKeyHandlers(searchInput, {
    ArrowDown: () => moveSelection(1),
    ArrowUp: () => moveSelection(-1),
    Enter: () => activeRow?.click(),
  });

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
