import type { EdgeTypes } from "@xyflow/react";

// information on this page:
// https://reactflow.dev/api-reference/types/edge

export interface LocalEdgeObject {
  id: string;
  source: string;
  sourceHandle: string | null;
  target: string;
  targetHandle: string | null;

  animated: boolean;
}

interface LocalEdgeGeneratorProps {
  id?: string;
  source?: string;
  sourceHandle?: string | null;
  target?: string;
  targetHandle?: string | null;

  animated?: boolean;
}

export function generateLocalEdgeObject({
  id,
  source,
  sourceHandle,
  target,
  targetHandle,
  animated,
}: LocalEdgeGeneratorProps = {}): LocalEdgeObject {
  return {
    id: id ?? crypto.randomUUID(),
    source: source ?? "defaultSource",
    sourceHandle: sourceHandle ?? null,
    target: target ?? "defaultTarget",
    targetHandle: targetHandle ?? null,
    animated: animated ?? false,
  };
}

export const edgeTypes = {
  // Add your custom edge types here!
} satisfies EdgeTypes;
