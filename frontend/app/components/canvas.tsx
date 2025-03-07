"use client";

import styles from "./styles/canvas.module.css";

import "@xyflow/react/dist/style.css";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from "@xyflow/react";

import React from "react";

import { nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import { useCallback } from "react";
import { SharedProgramData } from "../page";

import { AppNode } from "./nodes/types";
import { KeyNodePair } from "../page";

// interface
interface CanvasProps {
  props: SharedProgramData;
}

// object
export default function CanvasWindow({ props }: CanvasProps) {
  // variables
  const [nodes, setNodes, onNodesChange] = useNodesState([] as AppNode[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // function
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  // ------------------------------------- //
  // setup + starting code
  React.useEffect(() => {
    // check if empty nodes
    if (nodes && nodes.length === 0) {
      // add default nodes
      const defaultValues = [
        { id: "a", type: "base", position: { x: 0, y: 0 }, data: { props: props, label: "wire" } },
        {
          id: "b",
          type: "base",
          position: { x: -100, y: 100 },
          data: { props: props, label: "drag me!" },
        },
        {
          id: "c",
          type: "base",
          position: { x: 100, y: 100 },
          data: { props: props, label: "your ideas" },
        },
        {
          id: "d",
          type: "base",
          position: { x: 0, y: 200 },
          data: { props: props, label: "with React Flow" },
        },
      ];
      setNodes(defaultValues as AppNode[]);

      // update values in props.activeNodes
      props.activeNodes.setter(
        new Map(
          defaultValues.map((node) => {
            return [
              node.id,
              { id: node.id, name: node.data.label, type: node.type, position: node.position },
            ];
          })
        )
      );
    }
  });

  React.useEffect(() => {
    console.log("nodes were changed!");

    // TODO -  figure out how to add nodes into canvas.
  }, [props.activeNodes.getter]);

  // return object
  return (
    <div className={styles.container}>
      <div className={styles["flow-container"]}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          edges={edges}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          colorMode="dark"
        >
          {/* controls inside canvas */}
          {/* <div className={styles.controls}>
            <h1 className={styles.header}>Canvas</h1>
          </div> */}
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
