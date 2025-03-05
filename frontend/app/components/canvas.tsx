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

import { defaultStarterNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import { useCallback } from "react";
import { SharedProgramData } from "../page";

// interface
interface CanvasProps {
  props: SharedProgramData;
}

// object
export default function CanvasWindow({ props }: CanvasProps) {
  // variables
  const [nodes, , onNodesChange] = useNodesState(defaultStarterNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // function
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

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
