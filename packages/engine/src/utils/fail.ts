type ErrorLocation = {
  file: string;
  line?: number;
};

export function fail(location: ErrorLocation, message: string): never {
  const errorLocation =
    location.line === undefined
      ? location.file
      : `${location.file}: line ${location.line}`;

  throw new Error(`${errorLocation}: ${message}`);
}
