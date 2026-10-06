import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import MarkdownIt from "markdown-it";
import { loadConfig } from "./config.ts";
import findPosts from "./content/findPosts.ts";
import parseFrontmatter from "./content/parseFrontmatter.ts";
import splitFrontmatter from "./content/splitFrontMatter.ts";
import validateFrontmatter from "./content/validateFrontmatter.ts";

export default async () => {
  const config = await loadConfig();
  const posts = await findPosts(config);

  const md = new MarkdownIt();

  for (const post of posts) {
    const source = await readFile(post.file, "utf-8");
    const { frontmatter, body } = splitFrontmatter(source);
    const metaObj = parseFrontmatter(frontmatter);

    const meta = validateFrontmatter(metaObj, post.file);

    const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>${meta.title}</title></head>
  <body>${md.render(body)}</body>
</html>`;

    const outDir = join("dist", post.folder, post.slug);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, "index.html"), html);
  }
};
