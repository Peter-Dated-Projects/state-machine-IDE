import type { NodeTypes } from "@xyflow/react";
import { SharedProgramData } from "@/app/page";
import { AppNode } from "./types";

import { BaseNode } from "./basenode";

export interface LocalNodeObject {
  // local storage -- not under react flow
  id: string;
  type: keyof typeof nodeTypes;
  position: { x: number; y: number };
  area: { width: number; height: number };
  data: {
    props: SharedProgramData;
    label: string;
    connections: string[];
    classCode: string;
    color?: string;
    onNodeDelete?: (nodes: AppNode[]) => void;
  };
}

interface localNodeGeneratorProps {
  type?: string;
  position?: { x: number; y: number };
  area?: { width: number; height: number };
  data?: {
    label: string;
    classCode: string;
    connections: string[];
    color?: string;
    onNodeDelete?: (nodes: AppNode[]) => void;
  };
  props: SharedProgramData;
}

export function generateLocalNodeObject({
  type,
  position,
  area,
  data,
  props,
}: localNodeGeneratorProps): LocalNodeObject {
  const id = crypto.randomUUID();

  const result = {
    id,
    type: type ?? "base",
    position: position ?? { x: 0, y: 0 },
    area: area ?? { width: 80, height: 40 },
    data: { ...data, props: props, connections: [], classCode: "" },
  };

  console.log(result);
  return result as LocalNodeObject;
}

export const nodeTypes = {
  base: BaseNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
