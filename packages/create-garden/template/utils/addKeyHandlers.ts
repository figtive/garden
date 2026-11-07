type KeyHandler = (event: KeyboardEvent) => void;

type KeyHandlers = Record<string, KeyHandler>;

function getShortcut(event: KeyboardEvent) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

  return event.metaKey || event.ctrlKey ? `Mod+${key}` : key;
}

export function addKeyHandlers(
  target: HTMLElement | Document,
  handlers: KeyHandlers,
) {
  const listener = (event: KeyboardEvent) => {
    const handler = handlers[getShortcut(event)];

    if (!handler) {
      return;
    }

    event.preventDefault();
    handler(event);
  };

  target.addEventListener("keydown", listener as EventListener);

  return () => {
    target.removeEventListener("keydown", listener as EventListener);
  };
}
