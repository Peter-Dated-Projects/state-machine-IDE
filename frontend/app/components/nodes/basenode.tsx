import { Handle, Position, type NodeProps } from "@xyflow/react";
import { type BaseNodeType } from "./types";
import { generateLocalHandleObject } from "../edges/handle";
import styles from "./styles/basenode.module.css";

// more node information:
// https://reactflow.dev/api-reference/types/node

// how to create a node system similar to miro?
// https://www.youtube.com/watch?v=ADJKbuayubE&ab_channel=CodeWithAntonio

// TODO - consider creating own node system
// like screw react-flow lol

// ------------------------------------- //
// Base Node
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

  const sourceHandles = [
    generateLocalHandleObject({ position: Position.Top, type: "source" }),
    generateLocalHandleObject({ position: Position.Bottom, type: "source" }),
    generateLocalHandleObject({ position: Position.Left, type: "source" }),
    generateLocalHandleObject({ position: Position.Right, type: "source" }),
  ];

  const targetHandles = [
    generateLocalHandleObject({ position: Position.Bottom, type: "target" }),
    generateLocalHandleObject({ position: Position.Top, type: "target" }),
    generateLocalHandleObject({ position: Position.Left, type: "target" }),
    generateLocalHandleObject({ position: Position.Right, type: "target" }),
  ];

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div style={{ margin: "0px" }}>
      <div
        className={`react-flow__node-default ${selected ? styles.selected : ""}`}
        style={{ padding: 2, zIndex: `${zIndex}` }}
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
      </div>

      {/* source handles*/}
      <div
        style={{
          visibility: selected ? "visible" : "hidden",
        }}
      >
        {sourceHandles.map((handle) => {
          // console.log(handle.id);
          return (
            <Handle
              key={handle.id}
              position={handle.position}
              type={handle.type}
              id={handle.id}
              isConnectable={true}
            />
          );
        })}
      </div>

      {/* target handles */}
      <div
        style={{
          visibility:
            data.props.edgeInformation.creatingNewEdge.getter != undefined ? "visible" : "hidden",
        }}
      >
        {targetHandles.map((handle) => {
          return (
            <Handle
              key={handle.id}
              position={handle.position}
              type={handle.type}
              id={handle.id}
              isConnectable={data.props.edgeInformation.creatingNewEdge.getter != id}
            />
          );
        })}
      </div>
    </div>
  );
}
