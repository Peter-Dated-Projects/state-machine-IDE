import type { NodeTypes } from "@xyflow/react";

import { BaseNode } from "./basenode";
import { AppNode } from "./types";

export const defaultStarterNodes: AppNode[] = [
  { id: "a", type: "base", position: { x: 0, y: 0 }, data: { label: "wire" } },
  {
    id: "b",
    type: "base",
    position: { x: -100, y: 100 },
    data: { label: "drag me!" },
  },
  { id: "c", type: "base", position: { x: 100, y: 100 }, data: { label: "your ideas" } },
  {
    id: "d",
    type: "base",
    position: { x: 0, y: 200 },
    data: { label: "with React Flow" },
  },
];

export const nodeTypes = {
  base: BaseNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
