// packages/engine/src/build.ts
import { loadConfig } from "./config.ts";
import findPosts from "./content/findPosts.ts";

export default async () => {
  const config = await loadConfig();
  const posts = await findPosts(config);
  console.log(posts);
};
