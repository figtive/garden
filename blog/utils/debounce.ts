export function debounce<This, Args extends unknown[]>(
  callback: (this: This, ...args: Args) => void,
  ms: number,
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function (this: This, ...args: Args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, ms);
  };
}
