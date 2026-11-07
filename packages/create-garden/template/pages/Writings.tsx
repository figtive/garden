import type { PageProps } from "@figtive/garden-engine";
import CollectionPage from "../component/CollectionPage.tsx";
import type { BlogPost } from "../plugin.ts";

function Writings({ posts }: PageProps<BlogPost>) {
  return <CollectionPage collection="writings" posts={posts} />;
}

export default Writings;
