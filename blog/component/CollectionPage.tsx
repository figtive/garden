import { groupBy } from "@figtive/garden-engine";
import type { BlogPost } from "../plugin.ts";
import { pluralize } from "../utils/text.ts";
import Layout from "./Layout.tsx";
import PostList from "./PostList.tsx";
import Row from "./Row.tsx";
import StageCounts from "./StageCounts.tsx";

type CollectionPageProps = {
  collection: string;
  posts: BlogPost[];
};

const tended = (post: BlogPost) => post.meta.updated ?? post.meta.date;

function CollectionPage({ collection, posts }: CollectionPageProps) {
  const collectionPosts = posts
    .filter((post) => post.route.collection === collection)
    .sort((a, b) => tended(b).localeCompare(tended(a)));
  const years = groupBy(collectionPosts, (post) => tended(post).slice(0, 4));

  return (
    <Layout
      crumbs={[
        {
          label: collection,
        },
      ]}
    >
      <main className="topic">
        <Row>
          <h1 className="text-title">{collection}</h1>
          <StageCounts posts={collectionPosts} />
        </Row>

        {years.map(({ key: year, posts: yearPosts }) => (
          <Row key={year}>
            <section className="topic__year" aria-labelledby={`year-${year}`}>
              <div className="topic__year-head text-meta">
                <h2 id={`year-${year}`}>{year}</h2>
                <span>{pluralize(yearPosts.length, "post")}</span>
              </div>
              <PostList posts={yearPosts} descriptions hideYear />
            </section>
          </Row>
        ))}
      </main>
    </Layout>
  );
}

export default CollectionPage;
