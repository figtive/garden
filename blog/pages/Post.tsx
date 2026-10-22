import type { PostPageProps } from "@figtive/garden-engine";
import Layout from "../component/Layout.tsx";
import Row from "../component/Row.tsx";
import type { BlogPost } from "../plugin.ts";

function Post({ post }: PostPageProps<BlogPost>) {
  const crumbs = [{ label: post.route.collection }, { label: post.meta.title }];

  return (
    <Layout crumbs={crumbs}>
      <main className="post">
        <Row side={<time dateTime={post.meta.date}>{post.meta.date}</time>}>
          <h1 className="text-title">{post.meta.title}</h1>
          <p className="text-lede">{post.meta.description}</p>
        </Row>

        <Row side={`${post.pluginOutput.readingTime} min read`}>
          <article className="prose">
            <post.content.Content />
          </article>
        </Row>
      </main>
    </Layout>
  );
}

export default Post;
