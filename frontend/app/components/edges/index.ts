import type { EdgeTypes } from "@xyflow/react";
import { BaseEdge } from "@/app/components/edges/baseedge";

// information on this page:
// https://reactflow.dev/api-reference/types/edge

export interface LocalEdgeObject {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;

  data: { animationDirection: string };
  animated: boolean;
}

interface LocalEdgeGeneratorProps {
  id?: string;
  source?: string;
  target?: string;
  sourceHandle?: string;
  targetHandle?: string;

  data?: { animationDirection: string };
  animated?: boolean;
}

export function generateLocalEdgeObject({
  id,
  source,
  target,
  sourceHandle,
  targetHandle,
  data,
  animated,
}: LocalEdgeGeneratorProps = {}): LocalEdgeObject {
  return {
    id: id ?? crypto.randomUUID(),
    source: source ?? "defaultSource",
    target: target ?? "defaultTarget",
    sourceHandle: sourceHandle, //?? `handle_${Position.Top}_source`,
    targetHandle: targetHandle, //?? `handle_${Position.Bottom}_target`,
    data: data ?? { animationDirection: "none" },
    animated: animated ?? false,
  };
}

export const edgeTypes = {
  // Add your custom edge types here!
  base: BaseEdge,
} satisfies EdgeTypes;
