import { type GroupPageProps, groupBy } from "@figtive/garden-engine";
import HoverPreview from "../../component/HoverPreview/HoverPreview.tsx";
import Layout from "../../component/Layout.tsx";
import PostList from "../../component/PostList.tsx";
import Row from "../../component/Row.tsx";
import StageCounts from "../../component/StageCounts.tsx";
import type { BlogPost } from "../../plugin.ts";

const countPosts = (count: number) =>
  `${count} ${count === 1 ? "post" : "posts"}`;

function Topic({ group, tagInfo }: GroupPageProps<BlogPost>) {
  const { key: tag, posts } = group;
  const Intro = tagInfo?.content.tokens.length ? tagInfo.content.Content : null;

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
          {tagInfo?.description && (
            <p className="topic__description text-description">
              {tagInfo.description}
            </p>
          )}
          <StageCounts posts={posts} />
        </Row>

        {Intro && (
          <Row>
            <article className="prose">
              <Intro />
            </article>
          </Row>
        )}

        {years.map(({ key: year, posts: yearPosts }) => (
          <Row key={year}>
            <section className="topic__year" aria-labelledby={`year-${year}`}>
              <div className="topic__year-head text-meta">
                <h2 id={`year-${year}`}>{year}</h2>
                <span>{countPosts(yearPosts.length)}</span>
              </div>
              <PostList
                posts={yearPosts}
                descriptions
                hideYear
                currentTag={tag}
              />
            </section>
          </Row>
        ))}
      </main>
      {Intro && <HoverPreview />}
    </Layout>
  );
}

export default Topic;
