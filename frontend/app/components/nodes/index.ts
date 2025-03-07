import type { NodeTypes } from "@xyflow/react";

import { BaseNode } from "./basenode";

export const nodeTypes = {
  base: BaseNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
