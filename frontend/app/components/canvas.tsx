"use client";
import React, { useEffect, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  CardStackPlusIcon,
  CheckIcon,
  DownloadIcon,
} from "@radix-ui/react-icons";
import { Tooltip } from "@radix-ui/themes";
import styles from "./styles/canvas.module.css";
import { nodeTypes, LocalNodeObject, generateLocalNodeObject } from "./nodes";
import { edgeTypes, LocalEdgeObject, generateLocalEdgeObject } from "./edges";
import { Edge } from "@xyflow/react";
import { SharedProgramData } from "../page";
import { AppNode } from "./nodes/types";
// import { ToastComponent } from "./ui/Toast";
// import ReactDOM from "react-dom";

// interface
interface CanvasProps {
  props: SharedProgramData;
}

// object
export default function CanvasWindow({ props }: CanvasProps) {
  // ------------------------------------- //
  const [nodes, setNodes] = useNodesState([] as AppNode[]);
  const [edges, setEdges] = useEdgesState([] as Edge[]);

  useEffect(() => {
    // initialize getters
    if (nodes.length === 0) setNodes(props.nodes.getter as AppNode[]);
    if (edges.length === 0) setEdges(props.edges.getter as Edge[]);

    // update global node & edge storage when local storage changes in CanvasWindow
    props.nodes.setter(nodes);
    props.edges.setter(edges);
  }, [nodes, edges, props.nodes, props.edges, setNodes, setEdges]);

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
      const mapTemp = props.edgeInformation.activeEdges.getter;
      mapTemp.set(edgeId, newEdge as LocalEdgeObject);
      props.edgeInformation.activeEdges.setter(mapTemp);
      props.edgeInformation.creatingNewEdge.setter(undefined);

      console.log(mapTemp, props.edgeInformation.activeEdges.getter);
    },
    [
      setEdges,
      props.edgeInformation.activeEdges,
      props.edgeInformation.creatingNewEdge,
    ]
  );

  const onNodeDelete = useCallback(
    (deletedNodes: AppNode[]) => {
      console.log("nodedata", deletedNodes);
      const mapTemp = props.nodeInformation.activeNodes.getter;

      for (let i = 0; i < deletedNodes.length; i++) {
        console.log(deletedNodes[i]);
        // update local node storage
        setNodes((nodes) =>
          nodes.filter((node) => node.id !== deletedNodes[i].id)
        );

        // check if current node
        if (props.nodeInformation.selectedNode.getter === deletedNodes[i].id) {
          props.nodeInformation.selectedNode.setter(undefined);
        }

        // update global node storage
        mapTemp.delete(deletedNodes[i].id);
      }
      props.nodeInformation.activeNodes.setter(mapTemp);
    },
    [
      setNodes,
      props.nodeInformation.activeNodes,
      props.nodeInformation.selectedNode,
    ]
  );

  const onEdgeDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      const mapTemp = props.edgeInformation.activeEdges.getter;

      for (let i = 0; i < edgesToDelete.length; i++) {
        // update local edge storage
        setEdges((edges) =>
          edges.filter((edge) => edge.id !== edgesToDelete[i].id)
        );

        // check if current edge
        if (props.edgeInformation.selectedEdge.getter === edgesToDelete[i].id) {
          props.edgeInformation.selectedEdge.setter(undefined);
        }

        // update global edge storage
        mapTemp.delete(edgesToDelete[i].id);
      }

      props.edgeInformation.activeEdges.setter(mapTemp);
    },
    [
      setEdges,
      props.edgeInformation.activeEdges,
      props.edgeInformation.selectedEdge,
    ]
  );

  const onConnectStart = useCallback(() => {
    props.edgeInformation.selectedEdge.setter(undefined);
    props.edgeInformation.creatingNewEdge.setter(
      props.nodeInformation.selectedNode.getter
    );
    console.log("connect start");

    // Trigger a re-render of all nodes in props.nodeInformation.activeNodes
    props.nodeInformation.activeNodes.setter(
      new Map(props.nodeInformation.activeNodes.getter)
    );
  }, [props.edgeInformation, props.nodeInformation]);

  // ------------------------------------- //
  // setup + starting code
  useEffect(() => {
    // check if empty nodes
    if (nodes && nodes.length === 0) {
      // add default nodes
      const defaultValues = [
        {
          ...generateLocalNodeObject({
            name: "state",
            position: { x: 0, y: 0 },
            data: { label: "state", classCode: "" },
            props: props,
          }),
          id: "a",
        },
        {
          ...generateLocalNodeObject({
            name: "next-state",
            position: { x: -100, y: 100 },
            data: { label: "state 2", classCode: "" },
            props: props,
          }),
          id: "b",
        },
        {
          ...generateLocalNodeObject({
            name: "state 3",
            position: { x: 100, y: 100 },
            data: { label: "state 3", classCode: "" },
            props: props,
          }),
          id: "c",
        },
        {
          ...generateLocalNodeObject({
            name: "next state",
            position: { x: 0, y: 200 },
            data: { label: "state 4", classCode: "" },
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
  }); // <-- Empty dependency array added

  // ------------------------------------- //
  // edge + node options
  const edgeOptions = {
    animated: true,
    style: {
      stroke: "white",
    },
  };
  const connectionLineStyle = { stroke: "white" };

  // no custom default node options .. all coded in basenode.tsx + etc

  // ------------------------------------- //
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
    const newNode = generateLocalNodeObject({
      name: "new node",
      type: "base",
      position:
        typeof window !== "undefined"
          ? {
              x: Math.random() * 250,
              y: Math.random() * 250,
            }
          : undefined,
      data: {
        label: `new node ${props.nodeInformation.activeNodes.getter.size + 1}`,
        classCode: "",
      },
      props: props,
    }) as AppNode;

    console.log(newNode);

    // update local node storage
    setNodes((nodes) => nodes.concat(newNode));

    // update global node storage -- different storage method
    // stored as: Map<string, LocalNodeObject>
    // where key is id and value is LocalNodeObject
    //      LocalNodeObject:
    //       {
    //          id: string; name: string; type: string;
    //          position: { x: number; y: number }
    //       }

    const mapTemp = props.nodeInformation.activeNodes.getter;
    mapTemp.set(newNode.id, {
      id: newNode.id,
      name: newNode.data.label,
      type: newNode.type,
      position: newNode.position,
    });
    props.nodeInformation.activeNodes.setter(mapTemp);

    console.log(props.nodeInformation.activeNodes.getter);
  }, [props, setNodes]);

  const debugItems = useCallback(() => {
    console.log("activeNodes", props.nodeInformation.activeNodes.getter);
    console.log("activeEdges", props.edgeInformation.activeEdges.getter);
  }, [props.edgeInformation, props.nodeInformation]);

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
    {
      icon: "Debug",
      tooltip: "Outputs all active nodes and edges to console",
      onClick: debugItems,
    },
  ];

  // ------------------------------------- //
  // Render
  return (
    <div className={styles.container}>
      <div className={styles["flow-container"]}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={edgeOptions}
          onNodesChange={(changes) => {
            setNodes((nds) => applyNodeChanges(changes, nds));
          }}
          onEdgesChange={(changes) => {
            setEdges((eds) => applyEdgeChanges(changes, eds));
          }}
          onEdgesDelete={onEdgeDelete}
          onNodesDelete={onNodeDelete}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
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
