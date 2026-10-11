export function parseDirectiveProps(str: string) {
  const props: Record<string, string | true> = {};
  let i = 0;
  const STR_LEN = str.length;

  while (i < STR_LEN) {
    if (str[i] === " ") {
      i += 1;
      continue;
    }

    let key = "";

    while (i < STR_LEN && str[i] !== "=" && str[i] !== " ") {
      key += str[i];
      i++;
    }

    if (str[i] !== "=") {
      props[key] = true;
      continue;
    }

    i += 1;

    let value = "";

    if (str[i] === '"') {
      i += 1;
      while (i < STR_LEN && str[i] !== '"') {
        value += str[i];
        i += 1;
      }
      i += 1;
    } else {
      while (i < STR_LEN && str[i] !== " ") {
        value += str[i];
        i++;
      }
    }

    props[key] = value;
  }

  return props;
}
