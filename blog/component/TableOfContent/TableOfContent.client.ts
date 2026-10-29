import { clamp } from "../../utils/calculation.ts";

const WIDE_QUERY = "(width >= 73.75rem)";

export default function () {
  const element =
    document.querySelector<HTMLDetailsElement>(".table-of-content");

  const article = document.querySelector<HTMLElement>(".prose");

  if (!element || !article) {
    return;
  }

  const progressLabel = element.querySelector<HTMLElement>(
    ".table-of-content__progress-label",
  );
  const tocNav = element.querySelector<HTMLElement>(".table-of-content__nav");

  const links = [
    ...element.querySelectorAll<HTMLAnchorElement>(".table-of-content__link"),
  ];

  const sections = links.flatMap((link) => {
    const id = decodeURIComponent(link.hash.slice(1));
    const heading = document.getElementById(id);

    if (!heading) {
      return [];
    }

    const item = link.closest("li");
    const level = Number(item?.dataset.level);

    return [
      {
        link,
        heading,
        item,
        level,
        group: -1,
      },
    ];
  });

  const topLevel = Math.min(...sections.map((section) => section.level));

  let group = -1;

  sections.forEach((section, index) => {
    if (section.level === topLevel) {
      group = index;
    }

    section.group = group;
  });

  const folded = new Map<number, number>();

  for (const section of sections) {
    if (section.level !== topLevel) {
      folded.set(section.group, (folded.get(section.group) ?? 0) + 1);
    }
  }

  const wide = matchMedia(WIDE_QUERY);

  const updateOpen = () => {
    element.open = wide.matches;
  };

  wide.addEventListener("change", updateOpen);
  updateOpen();

  if (progressLabel) {
    progressLabel.hidden = false;
  }

  const getReadProgress = () => {
    const articleBound = article.getBoundingClientRect();

    const scrollDistance = articleBound.height - innerHeight;
    const scrolledPast = -articleBound.top;

    const readProgress =
      scrollDistance > 0 ? clamp(scrolledPast / scrollDistance, 0, 1) : 1;

    return `${Math.round(readProgress * 100)}% read`;
  };

  const updateNavFade = () => {
    if (!tocNav) {
      return;
    }

    const hasMore =
      tocNav.scrollTop + tocNav.clientHeight < tocNav.scrollHeight - 1;

    tocNav.classList.toggle("table-of-content__nav--more", hasMore);
  };

  tocNav?.addEventListener("scroll", updateNavFade, { passive: true });
  tocNav?.addEventListener("transitionend", updateNavFade);
  window.addEventListener("resize", updateNavFade);

  updateNavFade();

  const findCurrentSectionIndex = () => {
    const remainingHeight =
      document.documentElement.scrollHeight - (scrollY + innerHeight);
    const slide = Math.max(0, innerHeight * 0.75 - remainingHeight);
    const line = innerHeight * 0.25 + slide;

    let current = 0;

    sections.forEach((section, index) => {
      if (section.heading.getBoundingClientRect().top < line) {
        current = index;
      }
    });

    return current;
  };

  const updateActive = (current: number) => {
    sections.forEach((section, index) => {
      if (index === current) {
        section.link.setAttribute("aria-current", "true");
      } else {
        section.link.removeAttribute("aria-current");
      }
    });
  };

  const updateFolding = (current: number) => {
    const openGroup = sections[current]?.group;

    sections.forEach((section, index) => {
      if (section.item) {
        section.item.inert =
          section.level !== topLevel && section.group !== openGroup;
      }

      const count = folded.get(index);

      const isFolded =
        section.level === topLevel && count && index !== openGroup;

      if (isFolded) {
        section.link.dataset.folded = String(count);
      } else {
        delete section.link.dataset.folded;
      }
    });

    requestAnimationFrame(() => {
      updateNavFade();

      if (wide.matches) {
        sections[current]?.link.scrollIntoView({ block: "nearest" });
      }
    });
  };

  const state = {
    frame: 0,
    shown: -1,
  };

  const update = () => {
    state.frame = 0;
    const current = findCurrentSectionIndex();
    const readProgress = progressLabel ? getReadProgress() : "";

    if (current !== state.shown) {
      state.shown = current;
      updateActive(current);
      updateFolding(current);
    }

    if (progressLabel && progressLabel.textContent !== readProgress) {
      progressLabel.textContent = readProgress;
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!state.frame) {
        state.frame = requestAnimationFrame(update);
      }
    },
    { passive: true },
  );

  update();
}
