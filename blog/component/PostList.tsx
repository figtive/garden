import type { BlogPost } from "../plugin.ts";
import { formatDate } from "../utils/date.ts";
import Stage from "./Stage.tsx";
import Tag from "./Tag.tsx";

const TAG_LIMIT = 3;

function PostList({
  posts,
  limit = Infinity,
  compact = false,
  descriptions = false,
  hideYear = false,
  currentTag,
}: {
  posts: BlogPost[];
  limit?: number;
  compact?: boolean;
  descriptions?: boolean;
  hideYear?: boolean;
  currentTag?: string;
}) {
  if (posts.length === 0) {
    return <p className="text-meta">No posts yet.</p>;
  }

  return (
    <ul className={compact ? "post-list post-list--compact" : "post-list"}>
      {posts.slice(0, limit).map((post) => {
        const tended = post.meta.updated ?? post.meta.date;
        const allTags = post.meta.tags ?? [];
        const tags =
          currentTag && allTags.includes(currentTag)
            ? [currentTag, ...allTags.filter((tag) => tag !== currentTag)]
            : allTags;

        return (
          <li key={post.route.url} className="post-list__row">
            <a className="post-list__title" href={post.route.url}>
              {post.meta.title}
            </a>
            {descriptions && (
              <span className="post-list__description">
                {post.meta.description}
              </span>
            )}
            {!compact && tags.length > 0 && (
              <span className="post-list__tags tag-group">
                {tags.slice(0, TAG_LIMIT).map((tag) => (
                  <Tag key={tag} tag={tag} />
                ))}
                {tags.length > TAG_LIMIT && (
                  <span className="post-list__more">
                    +{tags.length - TAG_LIMIT}
                  </span>
                )}
              </span>
            )}
            <span className="post-list__stage">
              <Stage stage={post.pluginOutput.stage} />
            </span>
            <time className="post-list__date" dateTime={tended}>
              {formatDate(tended, { short: true, year: !hideYear })}
            </time>
          </li>
        );
      })}
    </ul>
  );
}

export default PostList;
