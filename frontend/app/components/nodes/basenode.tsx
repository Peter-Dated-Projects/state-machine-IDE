import { Handle, Position, type NodeProps } from "@xyflow/react";

import { type BaseNodeType } from "./types";

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

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div
      className={`react-flow__node-default ${selected ? "selected" : ""}`}
      style={{ padding: 2, zIndex: `${zIndex}` }}
      onClick={() => {
        // set current node to self
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

      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
}
