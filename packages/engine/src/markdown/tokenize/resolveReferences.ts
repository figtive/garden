import type { Definition, Nodes, Root } from "mdast";

type Definitions = Map<string, Definition>;

function collectDefinitions(node: Nodes, definitions: Definitions) {
  if (node.type === "definition" && !definitions.has(node.identifier)) {
    definitions.set(node.identifier, node);
  }

  if ("children" in node) {
    for (const child of node.children) {
      collectDefinitions(child, definitions);
    }
  }
}

function resolveReference(node: Nodes, definitions: Definitions): Nodes {
  if (node.type !== "linkReference" && node.type !== "imageReference") {
    return node;
  }

  const definition = definitions.get(node.identifier);

  if (!definition) {
    return node;
  }

  if (node.type === "linkReference") {
    return {
      type: "link",
      url: definition.url,
      title: definition.title,
      children: node.children,
      position: node.position,
    };
  }

  return {
    type: "image",
    url: definition.url,
    title: definition.title,
    alt: node.alt,
    position: node.position,
  };
}

function replaceReferences(node: Nodes, definitions: Definitions) {
  if (!("children" in node)) {
    return;
  }

  const children: Nodes[] = node.children;

  for (const [index, child] of children.entries()) {
    const resolved = resolveReference(child, definitions);

    children[index] = resolved;
    replaceReferences(resolved, definitions);
  }
}

export function resolveReferences(tree: Root) {
  const definitions: Definitions = new Map();

  collectDefinitions(tree, definitions);
  replaceReferences(tree, definitions);
}
