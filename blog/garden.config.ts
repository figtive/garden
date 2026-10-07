import { defineGardenConfig } from "@figtive/garden-engine";
import Post from "./component/Post.tsx";

export default defineGardenConfig({
  content: "./content",
  layouts: { post: Post },
});
