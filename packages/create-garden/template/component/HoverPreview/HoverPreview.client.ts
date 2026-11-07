import { clamp } from "../../utils/calculation.ts";
import { qs } from "../../utils/query-selector.ts";
import { createPreview } from "../Preview/createPreview.ts";

const POST_LINK_SELECTOR = "[data-post-link]";

const SHOW_DELAY = 200;
const HIDE_DELAY = 150;
const GAP = 8;

const HOVER_QUERY = "(hover: hover)";

const isPointerWithinLine = (line: DOMRect, pointerY: number) =>
  pointerY >= line.top && pointerY <= line.bottom;

const getHoveredLineRect = (link: HTMLElement, event: MouseEvent) => {
  const lines = [...link.getClientRects()];
  const hoveredLine = lines.find((line) =>
    isPointerWithinLine(line, event.clientY),
  );

  return hoveredLine ?? link.getBoundingClientRect();
};

export default function () {
  if (!matchMedia(HOVER_QUERY).matches) {
    return;
  }

  const popover = qs<HTMLElement>(".hover-preview");

  const { renderPostPreview, clearPostPreview } = createPreview(
    qs<HTMLElement>(".hover-preview__body", popover),
    "hover-preview",
  );

  let previewedLink: HTMLAnchorElement | undefined;
  let pendingActionId: ReturnType<typeof setTimeout> | undefined;

  const clearPendingAction = () => {
    clearTimeout(pendingActionId);
  };

  const setPendingAction = (action: () => void, ms: number) => {
    clearPendingAction();
    pendingActionId = setTimeout(action, ms);
  };

  const getPostLink = (target: EventTarget | null) => {
    if (!(target instanceof Element)) {
      return undefined;
    }

    const link = target.closest<HTMLAnchorElement>(POST_LINK_SELECTOR);

    return link && !popover.contains(link) ? link : undefined;
  };

  const isPointerStillWithinLink = (link: HTMLElement, event: MouseEvent) =>
    event.relatedTarget instanceof Node && link.contains(event.relatedTarget);

  const placePreview = (rect: DOMRect) => {
    const { width, height } = popover.getBoundingClientRect();

    const left = clamp(rect.left, GAP, innerWidth - width - GAP);
    const fitsBelow = rect.bottom + GAP + height <= innerHeight;
    const top = fitsBelow ? rect.bottom + GAP : rect.top - height - GAP;

    popover.style.translate = `${left}px ${top}px`;
  };

  const openPreview = async (link: HTMLAnchorElement, rect: DOMRect) => {
    previewedLink = link;
    clearPostPreview();

    if (!popover.matches(":popover-open")) {
      popover.showPopover();
    }

    await renderPostPreview(`${link.dataset.postLink}${link.hash}`);

    if (previewedLink === link) {
      placePreview(rect);
    }
  };

  const closePreview = () => {
    previewedLink = undefined;
    popover.hidePopover();
  };

  document.addEventListener("mouseover", (event) => {
    const link = getPostLink(event.target);

    if (!link || isPointerStillWithinLink(link, event)) {
      return;
    }

    if (previewedLink === link) {
      clearPendingAction();
      return;
    }

    const rect = getHoveredLineRect(link, event);
    setPendingAction(() => openPreview(link, rect), SHOW_DELAY);
  });

  document.addEventListener("mouseout", (event) => {
    const link = getPostLink(event.target);

    if (link && !isPointerStillWithinLink(link, event)) {
      setPendingAction(closePreview, HIDE_DELAY);
    }
  });

  popover.addEventListener("mouseenter", clearPendingAction);

  popover.addEventListener("mouseleave", () =>
    setPendingAction(closePreview, HIDE_DELAY),
  );

  addEventListener("scroll", closePreview, {
    passive: true,
  });
}
