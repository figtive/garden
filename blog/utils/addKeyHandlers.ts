type KeyHandlers = Record<string, (event: KeyboardEvent) => void>;

export function addKeyHandlers(target: HTMLElement, handlers: KeyHandlers) {
  const listener = (event: KeyboardEvent) => {
    const handler = handlers[event.key];
    if (!handler) {
      return;
    }

    event.preventDefault();
    handler(event);
  };

  target.addEventListener("keydown", listener as EventListener);

  return () => {
    return target.removeEventListener("keydown", listener as EventListener);
  };
}
