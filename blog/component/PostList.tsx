import type { BlogPost } from "../plugin.ts";
import { formatDate } from "../utils/date.ts";
import Stage from "./Stage.tsx";

function PostList({
  posts,
  limit = Infinity,
}: {
  posts: BlogPost[];
  limit?: number;
}) {
  if (posts.length === 0) {
    return <p className="text-meta">No posts yet.</p>;
  }

  return (
    <ul className="post-list">
      {posts.slice(0, limit).map((post) => {
        const tended = post.meta.updated ?? post.meta.date;

        return (
          <li key={post.route.url} className="post-list__row">
            <a className="post-list__link" href={post.route.url}>
              <span className="post-list__title">{post.meta.title}</span>
              <span className="post-list__tags">
                {(post.meta.tags ?? []).map((tag) => `#${tag}`).join(" ")}
              </span>
              <span className="post-list__stage">
                <Stage stage={post.pluginOutput.stage} />
              </span>
              <time className="post-list__date" dateTime={tended}>
                {formatDate(tended, { short: true })}
              </time>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default PostList;
