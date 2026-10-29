import {
  ClientScript,
  type Group,
  groupBy,
  type PageProps,
} from "@figtive/garden-engine";
import Layout from "../../component/Layout.tsx";
import Row from "../../component/Row.tsx";
import Tag from "../../component/Tag.tsx";
import type { BlogPost } from "../../plugin.ts";
import topicsScript from "./Topics.client.ts";

const alphabet = [..."abcdefghijklmnopqrstuvwxyz".split(""), "misc."];

const tagLink = (tag: Group<BlogPost>) => (
  <span key={tag.key} className="tag-list__tag">
    <Tag tag={tag.key} />
  </span>
);

function Topics({ posts }: PageProps<BlogPost>) {
  const topics = groupBy(posts, (post) => post.meta.tags ?? []).sort((a, b) =>
    a.key.localeCompare(b.key),
  );
  const letters = groupBy(topics, (topic) => {
    const firstLetter = (topic.key[0] as string).toLowerCase();
    return alphabet.includes(firstLetter) ? firstLetter : "misc.";
  });
  const usedLetters = new Set(letters.map((letter) => letter.key));

  const byCount = [...topics].sort((a, b) => b.posts.length - a.posts.length);
  const minPosts = topics.length > 40 ? 3 : 2;
  const popular = byCount
    .filter((tag) => tag.posts.length >= minPosts)
    .slice(0, 18);

  const mainTopics = popular.length >= 4 ? popular : byCount.slice(0, 6);
  const otherTopics = byCount.filter((tag) => !mainTopics.includes(tag));
  const shownOther = otherTopics.slice(0, 48);
  const hiddenOther = otherTopics.slice(48);

  return (
    <Layout crumbs={[{ label: "topics" }]}>
      <ClientScript src={topicsScript} />
      <main className="topics">
        <Row
          side={
            <div className="topics__jump">
              jump to
              <nav className="topics__jump-letters" aria-label="Jump to letter">
                {alphabet.map((letter) =>
                  usedLetters.has(letter) ? (
                    <a
                      key={letter}
                      href={`#letter-${letter}`}
                      data-letter={letter}
                    >
                      {letter}
                    </a>
                  ) : (
                    <span key={letter}>{letter}</span>
                  ),
                )}
              </nav>
            </div>
          }
        >
          <h1 className="text-title">topics</h1>
          <p className="topics__sub text-meta">
            {topics.length} topics across {posts.length} posts
          </p>

          <div
            className="topic-tabs"
            role="tablist"
            aria-label="Show topics"
            hidden
          >
            <button
              type="button"
              role="tab"
              className="topic-tabs__tab"
              id="tab-popular"
              aria-controls="panel-popular"
              aria-selected="true"
              tabIndex={0}
            >
              most posts
            </button>
            <button
              type="button"
              role="tab"
              className="topic-tabs__tab"
              id="tab-alphabetical"
              aria-controls="panel-alphabetical"
              aria-selected="false"
              tabIndex={-1}
            >
              a–z
            </button>
          </div>

          <div
            className="letter-rows"
            id="panel-alphabetical"
            role="tabpanel"
            aria-labelledby="tab-alphabetical"
          >
            {topics.length === 0 ? (
              <p className="text-meta">No topics yet.</p>
            ) : (
              letters.map(({ key: letter, posts: tags }) => (
                <div
                  key={letter}
                  id={`letter-${letter}`}
                  className="letter-row"
                >
                  <div className="letter-row__letter">{letter}</div>
                  <p className="tag-list tag-group">{tags.map(tagLink)}</p>
                </div>
              ))
            )}
          </div>
        </Row>

        <div id="panel-popular" role="tabpanel" aria-labelledby="tab-popular">
          {mainTopics.length > 0 && (
            <Row>
              <h2 className="topics__heading text-meta">
                main topics <span>{mainTopics.length}</span>
              </h2>
              <div className="main-topics tag-group">
                {mainTopics.map((tag) => (
                  <div key={tag.key} className="main-topics__tag">
                    <Tag tag={tag.key} />
                    <span>{tag.posts.length}</span>
                  </div>
                ))}
              </div>
            </Row>
          )}
          {otherTopics.length > 0 && (
            <Row>
              <h2 className="topics__heading text-meta">
                everything else <span>{otherTopics.length}</span>
              </h2>
              <p className="tag-list tag-group">{shownOther.map(tagLink)}</p>
              {hiddenOther.length > 0 && (
                <details className="show-all">
                  <summary>show all {otherTopics.length} →</summary>
                  <p className="tag-list tag-group">
                    {hiddenOther.map(tagLink)}
                  </p>
                </details>
              )}
            </Row>
          )}
        </div>
      </main>
    </Layout>
  );
}

export default Topics;
