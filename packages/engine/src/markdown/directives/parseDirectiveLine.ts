export type FoundDirective = { name: string; rawProps: string };

const isValidChar = (char: string) => {
  const uniformedChar = char.toLowerCase();
  if (
    (uniformedChar >= "a" && uniformedChar <= "z") ||
    (uniformedChar >= "0" && uniformedChar <= "9") ||
    uniformedChar === "-"
  ) {
    return true;
  }

  return false;
};

export function parseDirectiveLine(line: string): FoundDirective | null {
  const str = line.trim();

  if (!str.startsWith("@") || !str.endsWith("}")) {
    return null;
  }

  const open = str.indexOf("{");

  if (open === -1) {
    return null;
  }

  const name = str.slice(1, open);

  if (name === "" || ![...name].every(isValidChar)) {
    return null;
  }

  const rawProps = str.slice(open + 1, -1);

  return { name, rawProps };
}
