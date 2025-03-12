import type { EdgeTypes } from "@xyflow/react";

// information on this page:
// https://reactflow.dev/api-reference/types/edge

export interface LocalEdgeObject {
  id: string;
  source: string;
  target: string;

  animated: boolean;
}

interface LocalEdgeGeneratorProps {
  id?: string;
  source?: string;
  target?: string;

  animated?: boolean;
}

export function generateLocalEdgeObject({
  id,
  source,
  target,
  animated,
}: LocalEdgeGeneratorProps = {}): LocalEdgeObject {
  return {
    id: id ?? crypto.randomUUID(),
    source: source ?? "defaultSource",
    target: target ?? "defaultTarget",
    animated: animated ?? false,
  };
}

export const edgeTypes = {
  // Add your custom edge types here!
} satisfies EdgeTypes;
