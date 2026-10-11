import {
  defineGardenConfig,
  generatePostPages,
  generateStaticPage,
} from "@figtive/garden-engine";
import Home from "./component/Home.tsx";
import Post from "./component/Post.tsx";
import { plugins } from "./plugin.ts";

export default defineGardenConfig({
  content: "./content",
  plugins,
  pages: [generateStaticPage("/", Home), generatePostPages(Post)],
});
