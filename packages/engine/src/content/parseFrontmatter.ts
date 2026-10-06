export type FrontmatterValue = string | boolean | string[];

function unquote(value: string): string {
  const first = value[0];
  if (
    value.length >= 2 &&
    (first === '"' || first === "'") &&
    value.endsWith(first)
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function parseValue(raw: string, lineNumber: number) {
  if (raw === "true") {
    return true;
  }

  if (raw === "false") {
    return false;
  }

  if (raw.startsWith("[")) {
    if (!raw.endsWith("]")) {
      throw new Error(`Line ${lineNumber}: list is missing a closing "]"`);
    }
    const inner = raw.slice(1, -1).trim();
    return inner === ""
      ? []
      : inner.split(",").map((item) => unquote(item.trim()));
  }

  return unquote(raw);
}

function parseFrontmatter(source: string) {
  const data: Record<string, FrontmatterValue> = {};

  for (const [i, line] of source.split("\n").entries()) {
    const lineNumber = i + 2;

    if (line.trim() === "" || line.trim().startsWith("#")) {
      continue;
    }

    const firstColon = line.indexOf(":");

    if (firstColon === -1) {
      throw new Error(
        `Line ${lineNumber}: expected a "key: value" pair, got ${line}`,
      );
    }

    const key = line.slice(0, firstColon).trim();
    const raw = line.slice(firstColon + 1).trim();

    if (key === "") {
      throw new Error(`Line ${lineNumber}: missing key before ":"`);
    }
    if (key in data) {
      throw new Error(`Line ${lineNumber}: "${key}" is defined twice`);
    }

    data[key] = parseValue(raw, lineNumber);
  }
  return data;
}

export default parseFrontmatter;
