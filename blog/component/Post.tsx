import type { PostPageProps } from "@figtive/garden-engine";
import type { BlogPost } from "../plugin.ts";

function Post({ post, posts }: PostPageProps<BlogPost>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{post.meta.title}</title>
      </head>
      <body>
        <h1>
          {" "}
          This is a Post Component on Blog {post.pluginOutput.mood} | readtime:{" "}
          {post.pluginOutput.readingTime} minutes
        </h1>
        <p>
          Post date: {post.meta.date} | from a collection of{" "}
          {posts.map((post) => post.meta.date).join(", ")}
        </p>
        {/** biome-ignore lint/security/noDangerouslySetInnerHtml: expected to render .md */}
        <article dangerouslySetInnerHTML={{ __html: post.content.html }} />
      </body>
    </html>
  );
}

export default Post;
