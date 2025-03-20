import React from "react";
import { getBezierPath, EdgeProps } from "@xyflow/react";
import { BaseEdge as CustomBaseEdge } from "@xyflow/react";

import "@/app/components/edges/edge.css";

export const BaseEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  animated,
  data,
}: EdgeProps) => {
  // TODO - eventually implement pivot points
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <CustomBaseEdge id={id} path={edgePath} className={"baseedge"} />
    </>
  );
};
