import { Handle, Position, type NodeProps } from "@xyflow/react";

import { type BaseNodeType } from "./types";
import { useRef, useEffect, useState } from "react";

import styles from "./styles/basenode.module.css";

// more node information:
// https://reactflow.dev/api-reference/types/node

// how to create a node system similar to miro?
// https://www.youtube.com/watch?v=ADJKbuayubE&ab_channel=CodeWithAntonio

// TODO - consider creating own node system
// like screw react-flow lol

export function BaseNode({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
  id,
  selected,
  zIndex,
}: NodeProps<BaseNodeType>) {
  // Note: data is type: { props: SharedProgramData; label: string }
  //    SharedProgramData is defined in frontend/app/page.ts
  //      of form:
  //        {
  //          selectedNode: {
  //            value: string,
  //            setter: (value: string) => void,
  //          },
  //          activeNodes: {
  //            value: Map<string, LocalNodeObject>,
  //            setter: (value: Map<string, LocalNodeObject>) => void,
  //          },
  //          editorWidth: {
  //            value: number,
  //            setter: (value: number) => void,
  //          },
  //        }

  // Add a local state to track the current selected node
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined);

  // Update the local state whenever the component renders
  useEffect(() => {
    const currentSelectedId = data.props.nodeInformation.selectedNode.getter;
    if (currentSelectedId !== selectedNodeId) {
      console.log("Selected node changed to:", currentSelectedId);
      setSelectedNodeId(currentSelectedId);
    }
  });

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div
      className={`react-flow__node-default ${selected ? styles.selected : ""}`}
      style={{ padding: 2, zIndex: `${zIndex}` }}
      onClick={() => {
        data.props.nodeInformation.selectedNode.setter(id);
      }}
    >
      <div className={styles.container}>
        <div>
          <span>
            {Math.round(positionAbsoluteX)},{Math.round(positionAbsoluteY)}
          </span>
        </div>
      </div>
      <div className={styles["content-container"]}>
        <div style={{ visibility: "hidden", position: "absolute" }}>{id}</div>
        {data.label && <div>{data.label}</div>}
      </div>
      <div style={{ height: "10px" }}></div>

      {/* write some logic about edge hovering + input + output handling */}

      <div style={{ visibility: selected ? "visible" : "hidden" }}>
        <Handle type="source" position={Position.Bottom} />
      </div>

      <div
        style={{
          visibility: !selected ? "visible" : "hidden",
        }}
      >
        <Handle type="target" position={Position.Top} />
      </div>
    </div>
  );
}
