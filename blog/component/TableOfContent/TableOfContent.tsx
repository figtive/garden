import { ClientScript } from "@figtive/garden-engine";
import type { BlogPost } from "../../plugin.ts";
import type { MultiLevelPick } from "../../utils/types.ts";
import tableOfContentScript from "./TableOfContent.client.ts";

type TableOfContentProps = {
  toc: MultiLevelPick<BlogPost, "pluginOutput.toc">;
};

function TableOfContent({ toc }: TableOfContentProps) {
  return (
    <>
      <ClientScript src={tableOfContentScript} />
      <details className="table-of-content">
        <summary className="table-of-content__summary">contents</summary>
        <p className="table-of-content__label">on this page</p>
        <div className="table-of-content__progress">
          <span className="table-of-content__progress-label" hidden>
            0% read
          </span>
        </div>
        <nav className="table-of-content__nav" aria-label="Contents">
          <ol className="table-of-content__list">
            {toc.map((entry) => (
              <li key={entry.id} data-level={entry.level}>
                <div className="table-of-content__fold">
                  <a className="table-of-content__link" href={`#${entry.id}`}>
                    <span className="table-of-content__text">{entry.text}</span>
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </nav>
        {/** biome-ignore lint/a11y/useValidAnchor:  intentional back-to-top anchor  */}
        <a className="table-of-content__top" href="#">
          ↑ top
        </a>
      </details>
    </>
  );
}

export default TableOfContent;
