import { getMatchRanges } from "../../utils/highlight.ts";

const POST_SELECTOR = "[data-preview]";
const SKIP_SELECTOR = ".table-of-content, [data-preview-skip]";
const FOCUSABLE_SELECTOR =
  "a, button, input, select, textarea, iframe, summary, [tabindex]";

const postCache = new Map<string, Promise<Element | null>>();

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
      );

    post.catch(() => postCache.delete(pageUrl));
    postCache.set(pageUrl, post);
  }

  return post;
};

const clonePost = (post: Element, pageUrl: string) => {
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

export function createPreview(
  container: HTMLElement,
  highlightName = "preview",
) {
  let currentUrl = "";
  let headingId = "";
  let terms: string[] = [];

  const scrollToHeading = () => {
    const heading = headingId
      ? container.querySelector(`[data-preview-id="${CSS.escape(headingId)}"]`)
      : null;

    if (!heading) {
      container.scrollTop = 0;
      return;
    }

    const scrollMargin = parseFloat(getComputedStyle(heading).scrollMarginTop);
    const offset =
      heading.getBoundingClientRect().top -
      container.getBoundingClientRect().top;

    container.scrollTop += offset - (scrollMargin || 0);
  };

  const highlight = () => {
    CSS.highlights.set(
      highlightName,
      new Highlight(...getMatchRanges(container, terms, POST_SELECTOR)),
    );
  };

  const clear = () => {
    currentUrl = "";
    container.replaceChildren();
    CSS.highlights.delete(highlightName);
  };

  const show = async (url: string, matchedTerms: string[] = []) => {
    const target = new URL(url, location.href);

    headingId = decodeURIComponent(target.hash.slice(1));
    terms = matchedTerms;
    target.hash = "";

    if (currentUrl !== target.href) {
      currentUrl = target.href;

      const post = await fetchPost(target.href).catch(() => null);

      if (currentUrl !== target.href) {
        return;
      }

      if (!post) {
        clear();
        return;
      }

      container.replaceChildren(clonePost(post, target.href));
    }

    scrollToHeading();
    highlight();
  };

  return {
    show,
    clear,
  };
}
