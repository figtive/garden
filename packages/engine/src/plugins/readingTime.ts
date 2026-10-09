import { definePlugin } from "./definePlugin.ts";

function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const readingTimePlugin = () =>
  definePlugin({
    name: "readingTime",
    pluginType: "transformer",
    transform: (post) => ({ readingTime: readingTime(post.content.html) }),
  });
