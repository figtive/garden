#!/usr/bin/env node
import { register } from "tsx/esm/api";

register();

await import("@figtive/garden-engine/cli");
