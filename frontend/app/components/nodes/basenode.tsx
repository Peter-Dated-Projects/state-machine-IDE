import { Handle, Position, type NodeProps } from "@xyflow/react";
import { type BaseNodeType } from "./types";
import { generateLocalHandleObject } from "../edges/handle";
import styles from "./styles/basenode.module.css";
import { useState } from "react";
import { NODE_NAME_CHANGE_EVENT } from "@/app/globals";
import { NodeContextMenu } from "./contextmenu";
import { LocalNodeObject } from "./index";

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

  const [labelValue, setLabelValue] = useState<string>(data.label);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    const nodeElement = event.currentTarget as HTMLElement;
    const rect = nodeElement.getBoundingClientRect();
    setContextMenu({
      x: rect.left - 800,
      y: rect.top - 600,
    });
  };

  const handleColorSelect = (color: string) => {
    console.log("Color selected:", color);
    console.log("Current node data:", data);

    // Try to find the node in activeNodes map
    let node = data.props.nodeInformation.activeNodes.getter.get(id);

    // If not found, try to find it by matching other properties
    if (!node) {
      console.log("Node not found by ID, searching by other properties...");
      for (const [
        nodeId,
        nodeData,
      ] of data.props.nodeInformation.activeNodes.getter.entries()) {
        if (
          nodeData.data.label === data.label &&
          nodeData.position.x === positionAbsoluteX &&
          nodeData.position.y === positionAbsoluteY
        ) {
          node = nodeData;
          console.log("Found matching node:", node);
          break;
        }
      }
    }

    if (node) {
      // Update local node data
      const updatedNode: LocalNodeObject = {
        ...node,
        data: {
          ...node.data,
          color: color,
        },
      };
      console.log("Updating node with:", updatedNode);

      // Update the map
      const mapTemp = data.props.nodeInformation.activeNodes.getter;
      mapTemp.set(node.id, updatedNode); // Use the found node's ID
      data.props.nodeInformation.activeNodes.setter(mapTemp);

      // Update React Flow node data
      data.color = color;
      console.log("Updated React Flow data:", data);
    } else {
      console.error("Node not found in activeNodes map:", id);
    }
  };

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div style={{ margin: "0px" }}>
      <div
        className={`react-flow__node-default ${
          selected ? styles.selected : ""
        }`}
        style={{
          padding: 2,
          zIndex: `${zIndex}`,
          backgroundColor: data.color || "var(--background)",
          borderColor: data.color || "var(--mauve-7)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
        onContextMenu={handleContextMenu}
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
          <div>
            <input
              value={labelValue}
              onChange={(e) => {
                // check if value is null now
                if (e.target.value == "" || e.target.value == null) {
                  setLabelValue("");
                } else {
                  setLabelValue(e.target.value);
                }

                const newEvent = new CustomEvent(NODE_NAME_CHANGE_EVENT, {
                  detail: { nodeid: id, value: e.target.value },
                  bubbles: true,
                  cancelable: true,
                });
                document.dispatchEvent(newEvent);
              }}
              onClick={(e) => e.stopPropagation()}
            ></input>
          </div>
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
            data.props.edgeInformation.creatingNewEdge.getter != undefined
              ? "visible"
              : "hidden",
        }}
      >
        {targetHandles.map((handle) => {
          return (
            <Handle
              key={handle.id}
              position={handle.position}
              type={handle.type}
              id={handle.id}
              isConnectable={
                data.props.edgeInformation.creatingNewEdge.getter != id
              }
            />
          );
        })}
      </div>

      {/* context menu opens when right clicking on node */}
      {contextMenu && (
        <NodeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onColorSelect={handleColorSelect}
        />
      )}
    </div>
  );
}
