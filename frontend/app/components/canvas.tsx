"use client";
import React, { useEffect, useRef, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CardStackPlusIcon, CheckIcon, DownloadIcon } from "@radix-ui/react-icons";
import { Tooltip } from "@radix-ui/themes";
import styles from "./styles/canvas.module.css";
import { nodeTypes, LocalNodeObject, generateLocalNodeObject } from "./nodes";
import { edgeTypes, LocalEdgeObject, generateLocalEdgeObject } from "./edges";
import { Edge } from "@xyflow/react";
import { SharedProgramData } from "../page";
import { AppNode } from "./nodes/types";

// interface
interface CanvasProps {
  props: SharedProgramData;
}

// object
export default function CanvasWindow({ props }: CanvasProps) {
  // variables
  const [nodes, setNodes, onNodesChange] = useNodesState([] as AppNode[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  // ------------------------------------- //
  // function

  // event -- when an "edge" b/t 2 nodes is created
  const onConnect = useCallback(
    (connection: Connection) => {
      // Generate a unique ID for the new edge
      const edgeId = `${connection.source}->${connection.target}`;

      // Create the edge object without type casting
      const newEdge: Edge = {
        ...connection,
        id: edgeId,
        animated: true,
      };

      // Update ReactFlow edges state
      setEdges((edges) => addEdge(newEdge, edges));

      // Also update your global edge state
      props.edgeInformation.activeEdges.setter(
        new Map([
          ...props.edgeInformation.activeEdges.getter,
          [
            edgeId,
            {
              source: connection.source,
              target: connection.target,
            } as LocalEdgeObject,
          ],
        ])
      );
    },
    [setEdges, props.edgeInformation.activeEdges]
  );

  // ------------------------------------- //
  // setup + starting code
  useEffect(() => {
    // check if empty nodes
    if (nodes && nodes.length === 0) {
      // add default nodes
      const defaultValues = [
        {
          ...generateLocalNodeObject({
            name: "wire",
            position: { x: 0, y: 0 },
            data: { label: "wire" },
            props: props,
          }),
          id: "a",
        },
        {
          ...generateLocalNodeObject({
            name: "drag me!",
            position: { x: -100, y: 100 },
            data: { label: "drag me!" },
            props: props,
          }),
          id: "b",
        },
        {
          ...generateLocalNodeObject({
            name: "your ideas",
            position: { x: 100, y: 100 },
            data: { label: "your ideas" },
            props: props,
          }),
          id: "c",
        },
        {
          ...generateLocalNodeObject({
            name: "with React Flow",
            position: { x: 0, y: 200 },
            data: { label: "with React Flow" },
            props: props,
          }),
          id: "d",
        },
      ] as LocalNodeObject[];
      setNodes(defaultValues as AppNode[]);

      // update values in props.activeNodes
      props.nodeInformation.activeNodes.setter(
        new Map(
          defaultValues.map((node) => {
            return [
              node.id,
              {
                id: node.id,
                name: node.data.label,
                type: node.type,
                position: node.position,
              } as LocalNodeObject,
            ];
          })
        )
      );

      // -- also setup edges
      const defaultEdges: Edge[] = [
        generateLocalEdgeObject({
          id: "a->c",
          source: "a",
          target: "c",
          animated: true,
        }),
        generateLocalEdgeObject({ id: "b->d", source: "b", target: "d" }),
        generateLocalEdgeObject({
          id: "c->d",
          source: "c",
          target: "d",
          animated: true,
        }),
      ];
      setEdges(defaultEdges as Edge[]);

      // store local edge data
      props.edgeInformation.activeEdges.setter(
        new Map(
          defaultEdges.map((edge) => {
            return [
              edge.id,
              {
                source: edge.source,
                target: edge.target,
              } as LocalEdgeObject,
            ];
          })
        )
      );
    }
  }, []); // <-- Empty dependency array added

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

  // ------------------------------------- //
  // Control Button Functions
  const downloadFlow = useCallback(() => {
    const flow = {
      nodes: nodes,
      edges: edges,
    };
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flow, null, 2));
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
      type: "base",
      position: {
        x: Math.random() * 250,
        y: Math.random() * 250,
      },
      data: {
        label: `new node ${id}`,
      },
    } as AppNode;

    // update local node storage
    setNodes((nodes) => nodes.concat(newNode));
    console.log(nodes);

    // update global node storage -- different storage method
    // stored as: Map<string, LocalNodeObject>
    // where key is id and value is LocalNodeObject
    //      LocalNodeObject:
    //       {
    //          id: string; name: string; type: string;
    //          position: { x: number; y: number }
    //       }

    props.nodeInformation.activeNodes.setter(
      new Map([
        ...props.nodeInformation.activeNodes.getter,
        [
          id,
          {
            id: id,
            name: newNode.data.label,
            type: "base",
            position: newNode.position,
          } as LocalNodeObject,
        ],
      ])
    );
    reactFlowInstance.addNodes(newNode);
  }, [setNodes, nodes, props.nodeInformation.activeNodes, reactFlowInstance]);

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
                <button className={styles["control-btn"]} onClick={button.onClick}>
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
