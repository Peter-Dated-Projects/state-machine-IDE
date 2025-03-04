import type { Node, BuiltInNode } from "@xyflow/react";

export type BaseNodeType = Node<{ label: string }, "base">;
export type AppNode = BuiltInNode | BaseNodeType;
