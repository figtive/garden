import type { BlogPost } from "../plugin.ts";
import { formatDate } from "../utils/date.ts";
import Stage from "./Stage.tsx";
import Tag from "./Tag.tsx";

type MetaProps = Pick<BlogPost, "meta" | "pluginOutput">;

const SHOWN_TAGS = 5;

function Meta({ meta, pluginOutput }: MetaProps) {
  const { date, updated, tags = [] } = meta;
  const hiddenTags = tags.length - SHOWN_TAGS;

  return (
    <ul className="post-meta">
      <li className="post-meta__stage">
        <Stage stage={pluginOutput.stage} />
      </li>
      <li>
        planted <time dateTime={date}>{formatDate(date)}</time>
      </li>
      {updated && (
        <li>
          tended <time dateTime={updated}>{formatDate(updated)}</time>
        </li>
      )}
      <li>{pluginOutput.readingTime} min read</li>
      {tags.length > 0 && (
        <li className="post-meta__tags">
          <ul className="tag-group" aria-label="Topics">
            {tags.slice(0, SHOWN_TAGS).map((tag) => (
              <li key={tag}>
                <Tag tag={tag} />
              </li>
            ))}
          </ul>
          {hiddenTags > 0 && (
            <a className="post-meta__more" href="#topics">
              +{hiddenTags} more ↓
            </a>
          )}
        </li>
      )}
    </ul>
  );
}

export default Meta;
