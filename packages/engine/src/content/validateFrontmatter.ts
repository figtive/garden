import { REQUIRED_FRONTMATTER_KEYS } from "../constants.ts";
import type { FrontmatterValue, PostMeta } from "../types.ts";

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

function validateFrontmatter(
  meta: Record<string, FrontmatterValue>,
  file: string,
): PostMeta {
  const fail = (message: string): never => {
    throw new Error(`${file}: ${message}`);
  };

  const { title, date, description, tags = [], draft = false } = meta;

  const missing = REQUIRED_FRONTMATTER_KEYS.filter(
    (key) => !Object.hasOwn(meta, key),
  );

  if (missing.length > 0) {
    fail(
      `missing required ${missing.length === 1 ? "field" : "fields"}: ${missing.join(", ")}`,
    );
  }

  if (typeof title !== "string" || !title) {
    fail(`missing "title"`);
  }

  if (typeof description !== "string" || !description) {
    fail(`missing "description"`);
  }

  if (typeof date !== "string") {
    fail(`missing "date"`);
  }

  if (!isValidDate(date as string)) {
    fail(`"date" must be a real date in YYYY-MM-DD format, got "${date}"`);
  }

  if (!Array.isArray(tags)) {
    fail(`"tags" must be a list, e.g. [a, b]`);
  }

  if (typeof draft !== "boolean") {
    fail(`"draft" must be true or false`);
  }

  return { title, date, description, tags, draft } as PostMeta;
}

export default validateFrontmatter;
