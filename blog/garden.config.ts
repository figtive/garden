import { defineGardenConfig } from "@figtive/garden-engine";
import Post from "./component/Post.tsx";
import { plugins } from "./plugin.ts";

export default defineGardenConfig({
  content: "./content",
  layouts: { post: Post },
  plugins: plugins,
});
