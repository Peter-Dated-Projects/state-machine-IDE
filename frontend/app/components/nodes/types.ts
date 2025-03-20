import type { Node, BuiltInNode } from "@xyflow/react";
import { SharedProgramData } from "@/app/page";

export type BaseNodeType = Node<{ props: SharedProgramData; label: string }, "base">;
export type AppNode = BuiltInNode | BaseNodeType;
