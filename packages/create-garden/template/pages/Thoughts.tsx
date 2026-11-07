import type { PageProps } from "@figtive/garden-engine";
import CollectionPage from "../component/CollectionPage.tsx";
import type { BlogPost } from "../plugin.ts";

function Thoughts({ posts }: PageProps<BlogPost>) {
  return <CollectionPage collection="thoughts" posts={posts} />;
}

export default Thoughts;
