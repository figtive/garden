import type { PostPageProps } from "@figtive/garden-engine";
import Layout from "../component/Layout.tsx";
import Meta from "../component/Meta.tsx";
import Row from "../component/Row.tsx";
import Stage from "../component/Stage.tsx";
import Tag from "../component/Tag.tsx";
import type { BlogPost } from "../plugin.ts";
import { formatDate } from "../utils/date.ts";

function Post({ post, posts }: PostPageProps<BlogPost>) {
  const crumbs = [{ label: post.route.collection }, { label: post.meta.title }];
  const { tags = [] } = post.meta;

  const backlinks = posts.filter(
    (other) =>
      other !== post && other.pluginOutput.links.includes(post.route.url),
  );

  return (
    <Layout crumbs={crumbs}>
      <main className="post">
        <Row side={<Meta meta={post.meta} pluginOutput={post.pluginOutput} />}>
          {" "}
          <h1 className="text-title">{post.meta.title}</h1>
          <p className="text-lede">{post.meta.description}</p>
        </Row>

        <Row>
          <article className="prose">
            <post.content.Content />
          </article>
        </Row>

        {backlinks.length > 0 && (
          <Row side="linked from">
            <ul className="backlinks">
              {backlinks.map((other) => {
                const tended = other.meta.updated ?? other.meta.date;

                return (
                  <li key={other.route.url} className="backlinks__row">
                    <Stage stage={other.pluginOutput.stage} iconOnly />
                    <a className="backlinks__link" href={other.route.url}>
                      <span className="backlinks__title">
                        {other.meta.title}
                      </span>
                      <span className="backlinks__description">
                        {other.meta.description}
                      </span>
                    </a>
                    <time className="backlinks__date" dateTime={tended}>
                      {formatDate(tended, { short: true })}
                    </time>
                  </li>
                );
              })}
            </ul>
          </Row>
        )}

        {tags.length > 0 && (
          <Row side="topics">
            <ul
              id="topics"
              className="post-topics tag-group"
              aria-label="Topics"
            >
              {tags.map((tag) => (
                <li key={tag}>
                  <Tag tag={tag} />
                </li>
              ))}
            </ul>
          </Row>
        )}
      </main>
    </Layout>
  );
}

export default Post;
