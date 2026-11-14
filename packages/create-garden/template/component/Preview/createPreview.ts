import { getMatchRanges } from "../../utils/highlight.ts";

const POST_SELECTOR = "[data-preview]";
const SKIP_SELECTOR = ".table-of-content, [data-preview-skip]";
const FOCUSABLE_SELECTOR =
  "a, button, input, select, textarea, iframe, summary, [tabindex]";

const MATCH_SCROLL_POSITION = 1 / 3;

const postCache = new Map<string, Promise<Element | null>>();

const preparePost = (post: Element, pageUrl: string) => {
  const clone = document.importNode(post, true);

  for (const element of clone.querySelectorAll(SKIP_SELECTOR)) {
    element.remove();
  }

  for (const element of clone.querySelectorAll(FOCUSABLE_SELECTOR)) {
    element.setAttribute("tabindex", "-1");
  }

  for (const element of clone.querySelectorAll<HTMLElement>("[id]")) {
    element.dataset.previewId = element.id;
    element.removeAttribute("id");
  }

  for (const element of clone.querySelectorAll("[src], [href]")) {
    for (const name of ["src", "href"]) {
      const value = element.getAttribute(name);

      if (value) {
        element.setAttribute(name, new URL(value, pageUrl).href);
      }
    }
  }

  return clone;
};

const fetchPost = (pageUrl: string) => {
  let post = postCache.get(pageUrl);

  if (!post) {
    post = fetch(pageUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${pageUrl}: response status ${response.status}`);
        }

        return response.text();
      })
      .then((html) =>
        new DOMParser()
          .parseFromString(html, "text/html")
          .querySelector(POST_SELECTOR),
      )
      .then((post) => (post ? preparePost(post, pageUrl) : null));

    post.catch(() => postCache.delete(pageUrl));
    postCache.set(pageUrl, post);
  }

  return post;
};

export function createPreview(
  container: HTMLElement,
  highlightName = "preview",
) {
  let currentUrl = "";
  let headingId = "";
  let terms: string[] = [];
  let matchRanges: Range[] = [];

  const scrollToSectionHeading = () => {
    const sectionHeading = headingId
      ? container.querySelector(`[data-preview-id="${CSS.escape(headingId)}"]`)
      : null;

    if (!sectionHeading) {
      container.scrollTop = 0;
      return null;
    }

    const scrollMargin = parseFloat(
      getComputedStyle(sectionHeading).scrollMarginTop,
    );
    const offsetFromContainerTop =
      sectionHeading.getBoundingClientRect().top -
      container.getBoundingClientRect().top;

    container.scrollTop += offsetFromContainerTop - (scrollMargin || 0);

    return sectionHeading;
  };

  const highlight = () => {
    matchRanges = getMatchRanges(container, terms, POST_SELECTOR);
    CSS.highlights.set(highlightName, new Highlight(...matchRanges));
  };

  const scrollToFirstMatchInSection = (sectionHeading: Element | null) => {
    const firstMatchInSection = matchRanges.find(
      (match) =>
        !sectionHeading ||
        sectionHeading.compareDocumentPosition(match.startContainer) &
          Node.DOCUMENT_POSITION_FOLLOWING,
    );

    if (!firstMatchInSection) {
      return;
    }

    const containerBounds = container.getBoundingClientRect();
    const matchBounds = firstMatchInSection.getBoundingClientRect();
    const isMatchInsideContainer =
      matchBounds.top >= containerBounds.top &&
      matchBounds.bottom <= containerBounds.bottom;

    if (!isMatchInsideContainer) {
      container.scrollTop +=
        matchBounds.top -
        containerBounds.top -
        containerBounds.height * MATCH_SCROLL_POSITION;
    }
  };

  const clearPostPreview = () => {
    currentUrl = "";
    matchRanges = [];
    container.replaceChildren();
    CSS.highlights.delete(highlightName);
  };

  const renderPostPreview = async (
    url: string,
    matchedTerms: string[] = [],
  ) => {
    const target = new URL(url, location.href);
    const isNewTerms = terms !== matchedTerms;

    headingId = decodeURIComponent(target.hash.slice(1));
    terms = matchedTerms;
    target.hash = "";

    const isNewPost = currentUrl !== target.href;

    if (isNewPost) {
      currentUrl = target.href;

      const post = await fetchPost(target.href).catch(() => null);

      if (currentUrl !== target.href) {
        return;
      }

      if (!post) {
        clearPostPreview();
        return;
      }

      container.replaceChildren(post);
    }

    const sectionHeading = scrollToSectionHeading();

    if (isNewPost || isNewTerms) {
      highlight();
    }

    scrollToFirstMatchInSection(sectionHeading);
  };

  return {
    renderPostPreview,
    clearPostPreview,
  };
}
