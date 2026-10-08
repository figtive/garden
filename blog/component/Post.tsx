import type { LayoutProps } from "@figtive/garden-engine";

function Post({ post }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{post.meta.title}</title>
      </head>
      <body>
        <h1> This is a Post Component on Blog </h1>
        {/** biome-ignore lint/security/noDangerouslySetInnerHtml: expected to render .md */}
        <article dangerouslySetInnerHTML={{ __html: post.content.html }} />
      </body>
    </html>
  );
}

export default Post;
