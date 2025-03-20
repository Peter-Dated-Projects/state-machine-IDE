import { Position } from "@xyflow/react";

// Define HandleType as a union of valid handle strings
export type HandleType = "source" | "target";

// ------------------------------------- //

export interface LocalHandleObject {
  position: Position;
  type: HandleType;
}

export function generateLocalHandleObject({ position, type }: LocalHandleObject) {
  return {
    id: `${position}_${type}`,
    position,
    type,
  };
}
