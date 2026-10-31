import { ClientScript } from "@figtive/garden-engine";
import Preview from "../Preview/Preview.tsx";
import searchScript from "./Search.client.ts";
import SearchTemplates from "./SearchTemplates.tsx";

function Search() {
  return (
    <>
      <ClientScript src={searchScript} />
      <button type="button" className="search__open">
        search<kbd className="search__shortcut">ctrl + k</kbd>
      </button>
      <dialog className="search" aria-label="Search posts">
        <div className="search__panel">
          <div className="search__bar">
            <input
              className="search__input"
              type="search"
              placeholder="search posts"
              aria-label="Search posts"
              aria-controls="search-results"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="button" className="search__close">
              esc
            </button>
          </div>
          <div className="search__body">
            <div className="search__list">
              <p className="search__status" aria-live="polite" />
              <div
                className="search__results"
                id="search-results"
                role="listbox"
                aria-label="Results"
              />
            </div>
            <Preview className="search__preview" />
          </div>
          <p className="search__keys">
            <span>
              <kbd>↑</kbd> <kbd>↓</kbd> move
            </span>
            <span>
              <kbd>enter</kbd> open
            </span>
            <span>
              <kbd>esc</kbd> close
            </span>
          </p>
        </div>
      </dialog>
      <SearchTemplates />
    </>
  );
}

export default Search;
