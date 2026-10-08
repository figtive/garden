import type { PostMeta } from "../types.ts";

export function isPublished(meta: PostMeta) {
  return !meta.draft;
}
