import type { Group } from "../types/index.ts";

export function groupBy<TPost>(
  posts: TPost[],
  key: (post: TPost) => string | string[],
): Group<TPost>[] {
  const groups = new Map<string, TPost[]>();
  for (const post of posts) {
    for (const k of [key(post)].flat()) {
      groups.set(k, [...(groups.get(k) ?? []), post]);
    }
  }
  return [...groups].map(([k, groupPosts]) => ({ key: k, posts: groupPosts }));
}
