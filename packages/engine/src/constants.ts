const GARDEN_CONFIG_FILE = "garden.config.ts";
const DEFAULT_CONTENT_PATH = "./content";

const REQUIRED_FRONTMATTER_KEYS = ["title", "date", "description"] as const;

const GARDEN_DIRECTIVE_PLACEHOLDER = "<garden-directive></garden-directive>";

export {
  DEFAULT_CONTENT_PATH,
  GARDEN_CONFIG_FILE,
  GARDEN_DIRECTIVE_PLACEHOLDER,
  REQUIRED_FRONTMATTER_KEYS,
};
