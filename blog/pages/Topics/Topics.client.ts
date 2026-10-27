import { addKeyHandlers } from "../../utils/addKeyHandlers.ts";

export default function () {
  const tablist = document.querySelector<HTMLElement>(".topic-tabs");

  const alphabeticalTab =
    document.querySelector<HTMLButtonElement>("#tab-alphabetical");

  const jumpLetters = document.querySelector<HTMLElement>(
    ".topics__jump-letters",
  );

  if (!tablist || !alphabeticalTab) {
    return;
  }

  const tabs = [...tablist.querySelectorAll<HTMLButtonElement>("[role='tab']")];

  const selectTab = (selected: HTMLButtonElement, focus = false) => {
    for (const tab of tabs) {
      const isSelected = tab === selected;

      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;

      const panel = document.getElementById(
        tab.getAttribute("aria-controls") ?? "",
      );

      if (panel) {
        panel.hidden = !isSelected;
      }
    }

    if (focus) {
      selected.focus();
    }
  };

  const focusTab = (event: KeyboardEvent, step: number) => {
    const current = tabs.indexOf(event.target as HTMLButtonElement);
    const next = tabs.at((current + step) % tabs.length);

    if (next) {
      selectTab(next, true);
    }
  };

  const showLetter = (letter: string) => {
    selectTab(alphabeticalTab);

    const row = document.getElementById(`letter-${letter}`);

    row?.scrollIntoView();

    history.pushState(null, "", `#letter-${letter}`);
  };

  addKeyHandlers(tablist, {
    ArrowRight: (event) => {
      return focusTab(event, 1);
    },
    ArrowLeft: (event) => {
      focusTab(event, -1);
    },
    Home: () => {
      if (tabs.at(0)) {
        selectTab(tabs.at(0) as HTMLButtonElement, true);
      }
    },
    End: () => {
      if (tabs.at(-1)) {
        selectTab(tabs.at(-1) as HTMLButtonElement, true);
      }
    },
  });

  tablist.addEventListener("click", (event) => {
    const tab = (event.target as Element).closest<HTMLButtonElement>(
      "[role='tab']",
    );
    if (tab) {
      selectTab(tab);
    }
  });

  jumpLetters?.addEventListener("click", (event) => {
    const link = (event.target as Element).closest("a");
    const letter = link?.dataset.letter;
    if (!letter) {
      return;
    }

    event.preventDefault();
    showLetter(letter);
  });

  const openedOnLetter = location.hash.startsWith("#letter-");

  const startTab = openedOnLetter ? alphabeticalTab : tabs[0];

  tablist.hidden = false;

  if (startTab) {
    selectTab(startTab);
  }
}
