const GARDEN_CONFIG_FILE = "garden.config.ts";
const DEFAULT_CONTENT_PATH = "./content";

const REQUIRED_FRONTMATTER_KEYS = ["title", "date", "description"] as const;

export { DEFAULT_CONTENT_PATH, GARDEN_CONFIG_FILE, REQUIRED_FRONTMATTER_KEYS };
