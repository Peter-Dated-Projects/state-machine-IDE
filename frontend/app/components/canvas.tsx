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
} from "@radix-ui/react-icons";
import { Tooltip } from "@radix-ui/themes";
import html2canvas from "html2canvas";

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

  const reactFlowInstance = useReactFlow();
  const nodeId = 0;
  const nodeIdRef = useRef(nodeId);

  // Control Button Functions
  const downloadFlow = useCallback(() => {
    const flow = {
      nodes: nodes,
      edges: edges,
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(flow, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "flow.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    // const flowElement = document.querySelector(".react-flow");
    // if (flowElement) {
    //   html2canvas(flowElement).then((canvas) => {
    //     const dataURL = canvas.toDataURL("image/jpeg");
    //     const downloadAnchorNode = document.createElement("a");
    //     downloadAnchorNode.setAttribute("href", dataURL);
    //     downloadAnchorNode.setAttribute("download", "flow.jpg");
    //     document.body.appendChild(downloadAnchorNode); // required for firefox
    //     downloadAnchorNode.click();
    //     downloadAnchorNode.remove();
    //   });
    // }
  }, [nodes, edges]);

  const saveFlow = useCallback(() => {
    console.log("saving flow");

    // save and update generate base class code in backend!! // - TODO
  }, []);

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
    setNodes((nodes) => nodes.concat(newNode));
    console.log(nodes);
    props.activeNodes.setter(
      new Map([
        ...props.activeNodes.getter,
        [
          id,
          {
            id: id,
            name: newNode.data.label,
            type: "base",
            position: newNode.position,
          },
        ],
      ])
    );
    reactFlowInstance.addNodes(newNode);
  }, [setNodes, nodes, props.activeNodes, reactFlowInstance]);

  const controlButtons = [
    {
      icon: <DownloadIcon width={20} height={20} />,
      tooltip: "Download Flow",
      onClick: downloadFlow,
    },
    {
      icon: <CheckIcon width={20} height={20} />,
      tooltip: "Save Flow",
      onClick: saveFlow,
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
