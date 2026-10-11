import { groupBy, type PageProps } from "@figtive/garden-engine";
import type { BlogPost } from "../plugin.ts";

function Home({ posts }: PageProps<BlogPost>) {
  const latest = posts[0];
  const topics = groupBy(posts, (p) => p.meta.tags ?? []);
  const years = groupBy(posts, (p) => p.meta.date.slice(0, 4));

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Home</title>
      </head>
      <body>
        <h2>latest</h2>
        {latest && (
          <p>
            <a href={latest.route.url}>{latest.meta.title}</a> ·{" "}
            {latest.meta.date} · {latest.pluginOutput.readingTime} min
            <br />
            {latest.meta.description}
          </p>
        )}

        <h2>topics</h2>
        <ul>
          {topics.map((topic) => (
            <li key={topic.key}>
              <a href={`/${topic.key}/`}>#{topic.key}</a> ({topic.posts.length})
            </li>
          ))}
        </ul>

        <h2>writing</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.route.url}>
              {post.meta.date} · <a href={post.route.url}>{post.meta.title}</a>{" "}
              · {post.pluginOutput.readingTime} min
            </li>
          ))}
        </ul>

        <h2>archive</h2>
        <ul>
          {years.map((year) => (
            <li key={year.key}>
              <a href={`/${year.key}/`}>{year.key}</a> ({year.posts.length})
            </li>
          ))}
        </ul>
      </body>
    </html>
  );
}

export default Home;
