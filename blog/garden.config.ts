import {
  defineDirective,
  defineGardenConfig,
  generatePostPages,
  generateStaticPage,
} from "@figtive/garden-engine";
import GiganticText from "./component/directives/GiganticText.tsx";
import YoutubePlayer from "./component/directives/YoutubePlayer.tsx";
import Home from "./pages/Home.tsx";
import Post from "./pages/Post.tsx";
import { plugins } from "./plugin.ts";

export default defineGardenConfig({
  content: "./content",
  site: {
    title: "This is a blog site.",
    url: process.env.GARDEN_SITE_URL ?? "http://localhost:3000",
    head: [{ tag: "link", rel: "icon", href: "/figtive-icon.png" }],
  },
  styles: [
    "/theme/tokens.css",
    "/theme/base.css",
    "/theme/typography.css",
    "/theme/layout.css",
    "/components/components.css",
  ],
  plugins,
  pages: [
    generateStaticPage("/", Home, { styles: ["/home.css"] }),
    generatePostPages(Post, { meta: { image: "/figtive-icon.png" } }),
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
