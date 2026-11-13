import {
  defineDirective,
  defineGardenConfig,
  generatePostPages,
  generateStaticPage,
  generateTagPages,
} from "@figtive/garden-engine";
import YoutubePlayer from "./component/directives/YoutubePlayer.tsx";
import Home from "./pages/Home.tsx";
import Post from "./pages/Post.tsx";
import Thoughts from "./pages/Thoughts.tsx";
import Topic from "./pages/Topic/Topic.tsx";
import Topics from "./pages/Topics/Topics.tsx";
import Writings from "./pages/Writings.tsx";
import { plugins } from "./plugin.ts";

export default defineGardenConfig({
  content: "./content",
  site: {
    title: "This is a blog site.",
    url: process.env.GARDEN_SITE_URL ?? "http://localhost:3000",
    head: [
      {
        tag: "meta",
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { tag: "link", rel: "icon", href: "/figtive-icon.png" },
      {
        tag: "link",
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        tag: "link",
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&family=Fira+Code:wght@400;500&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
        precedence: "fonts",
      },
    ],
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
    generateStaticPage("/topics/", Topics, { styles: ["/topics.css"] }),
    generateStaticPage("/writings/", Writings, {
      styles: ["/topic.css"],
    }),
    generateStaticPage("/thoughts/", Thoughts, {
      styles: ["/topic.css"],
    }),
    generatePostPages(Post, {
      meta: { image: "/figtive-icon.png" },
      styles: ["/post.css"],
    }),
    generateTagPages(Topic, { styles: ["/topic.css"] }),
  ],
  directives: {
    youtube: defineDirective({
      props: (raw) => {
        if (typeof raw.videoId !== "string") {
          throw new Error("videoId is required");
        }
        return {
          videoId: raw.videoId,
          title:
            typeof raw.title === "string" && raw.title.trim() !== ""
              ? raw.title
              : undefined,
        };
      },
      component: YoutubePlayer,
    }),
  },
});
