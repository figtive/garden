import { type GroupPageProps, groupBy } from "@figtive/garden-engine";
import Layout from "../../component/Layout.tsx";
import PostList from "../../component/PostList.tsx";
import Row from "../../component/Row.tsx";
import Stage, { stages } from "../../component/Stage.tsx";
import type { BlogPost } from "../../plugin.ts";

const countPosts = (count: number) =>
  `${count} ${count === 1 ? "post" : "posts"}`;

function Topic({ group }: GroupPageProps<BlogPost>) {
  const { key: tag, posts } = group;

  const stageCounts = [...stages]
    .reverse()
    .map((stage) => ({
      stage,
      count: posts.filter((post) => post.pluginOutput.stage === stage).length,
    }))
    .filter(({ count }) => count > 0);

  const tended = (post: BlogPost) => post.meta.updated ?? post.meta.date;
  const byTended = [...posts].sort((a, b) =>
    tended(b).localeCompare(tended(a)),
  );
  const years = groupBy(byTended, (post) => tended(post).slice(0, 4));

  return (
    <Layout
      crumbs={[{ label: "topics", href: "/topics/" }, { label: `#${tag}` }]}
    >
      <main className="topic">
        <Row side="topic">
          <h1 className="text-title">#{tag}</h1>
          <p className="topic__stages text-meta">
            <span>{countPosts(posts.length)}</span>
            {stageCounts.map(({ stage, count }) => (
              <Stage key={stage} stage={stage} label={`${count} ${stage}`} />
            ))}
          </p>
        </Row>

        {years.map(({ key: year, posts: yearPosts }) => (
          <Row key={year}>
            <section className="topic__year" aria-labelledby={`year-${year}`}>
              <div className="topic__year-head text-meta">
                <h2 id={`year-${year}`}>{year}</h2>
                <span>{countPosts(yearPosts.length)}</span>
              </div>
              <PostList posts={yearPosts} descriptions hideYear currentTag={tag} />
            </section>
          </Row>
        ))}
      </main>
    </Layout>
  );
}

export default Topic;
