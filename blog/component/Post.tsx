import type { LayoutProps } from "@figtive/garden-engine";

function Post({ post }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{post.title}</title>
      </head>
      <body>
        <h1> This is a Post Component on Blog </h1>
        {/** biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <article dangerouslySetInnerHTML={{ __html: post.html }} />
      </body>
    </html>
  );
}

export default Post;
