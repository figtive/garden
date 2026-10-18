import type { PageProps } from "@figtive/garden-engine";
import Layout from "../component/Layout.tsx";
import PostList from "../component/PostList.tsx";
import Row from "../component/Row.tsx";
import Stage, { stages, stageText } from "../component/Stage.tsx";
import type { BlogPost } from "../plugin.ts";

const startHere = ["hello-world", "second"];

const tended = (post: BlogPost) => post.meta.updated ?? post.meta.date;

function Home({ posts }: PageProps<BlogPost>) {
  const recent = [...posts]
    .sort((a, b) => tended(b).localeCompare(tended(a)))
    .slice(0, 6);

  const picks = startHere
    .map((slug) => posts.find((post) => post.route.slug === slug))
    .filter((post) => post !== undefined);

  return (
    <Layout
      footer={
        <>
          <span>@figtive/garden by figtive</span>
          <a
            className="ext"
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          >
            CC BY-NC-SA 4.0
          </a>
        </>
      }
    >
      <main className="home">
        <Row side="hello">
          <p className="text-intro">
            Hello welcome to @figtive/garden, lets grow and make some posts!
          </p>
        </Row>

        <Row side="recently tended">
          <PostList posts={recent} />
        </Row>

        {picks.length > 0 && (
          <Row side="start here">
            <ul className="start-list">
              {picks.map((post) => (
                <li key={post.route.url}>
                  <a
                    className="start-list__title text-subheading"
                    href={post.route.url}
                  >
                    {post.meta.title}
                  </a>
                  <p className="start-list__description text-description">
                    {post.meta.description}
                  </p>
                </li>
              ))}
            </ul>
          </Row>
        )}

        <Row side="stages">
          <ul className="stage-list">
            {stages.map((stage) => {
              const count = posts.filter(
                (post) => post.pluginOutput.stage === stage,
              ).length;

              return (
                <li key={stage} className="stage-list__item">
                  <Stage stage={stage} />
                  <span>
                    {stageText[stage]} · {count}{" "}
                    {count === 1 ? "note" : "notes"}
                  </span>
                </li>
              );
            })}
          </ul>
        </Row>
      </main>
    </Layout>
  );
}

export default Home;
