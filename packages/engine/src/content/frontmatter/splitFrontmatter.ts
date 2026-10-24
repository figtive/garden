import { fail } from "../../utils/fail.ts";

export function splitFrontmatter(source: string, file: string) {
  const lines = source.split(/\r?\n/);

  if (lines[0] !== "---") {
    fail({ file, line: 1 }, `front matter must start with "---"`);
  }

  const end = lines.indexOf("---", 1);

  if (end === -1) {
    fail({ file }, `front matter is missing its closing "---"`);
  }

  return {
    frontmatter: lines.slice(1, end).join("\n"),
    body: lines.slice(end + 1).join("\n"),
    bodyLineOffset: end + 1,
  };
}
