import {
  defineDirective,
  defineGardenConfig,
  generatePostPages,
  generateStaticPage,
} from "@figtive/garden-engine";
import GiganticText from "./component/directives/GiganticText.tsx";
import YoutubePlayer from "./component/directives/YoutubePlayer.tsx";
import Home from "./component/Home.tsx";
import Post from "./component/Post.tsx";
import { plugins } from "./plugin.ts";

export default defineGardenConfig({
  content: "./content",
  styles: ["/base.css"],
  plugins,
  pages: [
    generateStaticPage("/", Home, { styles: ["/home.css"] }),
    generatePostPages(Post),
  ],
  directives: {
    youtube: defineDirective({
      props: (raw) => {
        if (typeof raw.videoId !== "string") {
          throw new Error("videoId is required");
        }
        return { videoId: raw.videoId };
      },
      component: YoutubePlayer,
    }),
    "gigantic-text": defineDirective({
      component: GiganticText,
    }),
  },
});
