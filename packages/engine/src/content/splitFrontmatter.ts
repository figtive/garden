export function splitFrontmatter(source: string) {
  const lines = source.split(/\r?\n/);

  if (lines[0] !== "---") {
    throw new Error();
  }

  const end = lines.indexOf("---", 1);
  if (end === -1) {
    throw new Error();
  }

  return {
    frontmatter: lines.slice(1, end).join("\n"),
    body: lines.slice(end + 1).join("\n"),
  };
}
