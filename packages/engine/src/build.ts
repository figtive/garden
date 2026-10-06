import { readFile } from "node:fs/promises";
import { loadConfig } from "./config.ts";
import findPosts from "./content/findPosts.ts";
import parseFrontmatter from "./content/parseFrontmatter.ts";
import splitFrontMatter from "./content/splitFrontMatter.ts";

export default async () => {
  const config = await loadConfig();
  const posts = await findPosts(config);
  for (const post of posts) {
    const source = await readFile(post.file, "utf-8");
    const { frontmatter, body } = splitFrontMatter(source);
    console.log(post.slug, parseFrontmatter(frontmatter));
  }
};
