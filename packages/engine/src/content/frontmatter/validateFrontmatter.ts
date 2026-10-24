import { REQUIRED_FRONTMATTER_KEYS } from "../../config/constants.ts";
import type { FrontmatterValue, PostMeta } from "../../types/index.ts";
import { fail } from "../../utils/fail.ts";

function isValidDate(dateString: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const parts = dateString.split("-");

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function validateFrontmatter(
  meta: Record<string, FrontmatterValue>,
  file: string,
): PostMeta {
  const location = { file };

  const {
    title,
    date,
    description,
    tags = [],
    draft = false,
    updated,
    image,
  } = meta;

  const missing = REQUIRED_FRONTMATTER_KEYS.filter(
    (key) => !Object.hasOwn(meta, key),
  );

  if (missing.length > 0) {
    fail(
      location,
      `missing required ${missing.length === 1 ? "field" : "fields"}: ${missing.join(", ")}`,
    );
  }

  if (typeof title !== "string" || !title) {
    fail(location, `missing "title"`);
  }

  if (typeof description !== "string" || !description) {
    fail(location, `missing "description"`);
  }

  if (typeof date !== "string") {
    fail(location, `missing "date"`);
  }

  if (!isValidDate(date)) {
    fail(
      location,
      `"date" must be a real date in YYYY-MM-DD format, got "${date}"`,
    );
  }

  if (
    updated !== undefined &&
    (typeof updated !== "string" || !isValidDate(updated))
  ) {
    fail(
      location,
      `"updated" must be a real date in YYYY-MM-DD format, got "${updated}"`,
    );
  }

  if (image !== undefined && typeof image !== "string") {
    fail(location, `"image" must be a path`);
  }

  if (!Array.isArray(tags)) {
    fail(location, `"tags" must be a list, e.g. [a, b]`);
  }

  if (typeof draft !== "boolean") {
    fail(location, `"draft" must be true or false`);
  }

  return { title, date, description, tags, draft, updated, image } as PostMeta;
}
