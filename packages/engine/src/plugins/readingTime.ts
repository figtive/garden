import { extractTokenText } from "../content/extractTextContent.ts";
import { definePlugin } from "./definePlugin.ts";

function readingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const readingTimePlugin = () =>
  definePlugin({
    name: "readingTime",
    pluginType: "transformer",
    transform: (post) => ({
      readingTime: readingTime(extractTokenText(post.content.tokens)),
    }),
  });
