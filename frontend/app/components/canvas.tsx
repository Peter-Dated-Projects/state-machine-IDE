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
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";

import React, { useEffect, useRef } from "react";

import { nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import { useCallback } from "react";
import { SharedProgramData } from "../page";

import { AppNode } from "./nodes/types";
import { KeyNodePair } from "../page";
import {
  CardStackPlusIcon,
  CheckIcon,
  DownloadIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { Tooltip } from "@radix-ui/themes";

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
  useEffect(() => {
    // check if empty nodes
    if (nodes && nodes.length === 0) {
      // add default nodes
      const defaultValues = [
        {
          id: "a",
          type: "base",
          position: { x: 0, y: 0 },
          data: { props: props, label: "wire" },
        },
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
              {
                id: node.id,
                name: node.data.label,
                type: node.type,
                position: node.position,
              },
            ];
          })
        )
      );
    }
  });

  useEffect(() => {
    console.log("nodes were changed!");
  }, [props.activeNodes.getter]);

  const edgeOptions = {
    animated: true,
    style: {
      stroke: "white",
    },
  };

  const connectionLineStyle = { stroke: "white" };

  const nodeId = 0;

  const reactFlowInstance = useReactFlow();
  const nodeIdRef = useRef(nodeId);

  const clickedAddNode = useCallback(() => {
    const id = `${++nodeIdRef.current}`;
    const newNode = {
      id,
      position: {
        x: Math.random() * 250,
        y: Math.random() * 250,
      },
      data: {
        label: `new node ${id}`,
      },
    };
    reactFlowInstance.addNodes(newNode);
  }, [reactFlowInstance]);

  const controlButtons = [
    {
      icon: <DownloadIcon width={20} height={20} />,
      tooltip: "Download Flow",
      onClick: () => {},
    },
    {
      icon: <CheckIcon width={20} height={20} />,
      tooltip: "Save Flow",
      onClick: () => {},
    },
    {
      icon: <CardStackPlusIcon width={20} height={20} />,
      tooltip: "Add Node",
      onClick: clickedAddNode,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles["flow-container"]}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          edges={edges}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={edgeOptions}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          connectionLineStyle={connectionLineStyle}
          fitView
          colorMode="dark"
        >
          {/* Controls in Absolute Positioning */}
          <div className={styles["add-components-container"]}>
            {controlButtons.map((button, index) => (
              <Tooltip key={index} content={button.tooltip}>
                <button
                  className={styles["control-btn"]}
                  onClick={button.onClick}
                >
                  {button.icon}
                </button>
              </Tooltip>
            ))}
          </div>

          <Background />
          <MiniMap style={{ width: 150, height: 120 }} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
