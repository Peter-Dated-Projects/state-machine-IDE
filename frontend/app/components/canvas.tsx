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

  const onNodeDelete = useCallback(
    (deletedNodes: AppNode[]) => {
      console.log("nodedata", deletedNodes);
      const mapTemp = props.nodeInformation.activeNodes.getter;

      for (let i = 0; i < deletedNodes.length; i++) {
        console.log(deletedNodes[i]);
        // update local node storage
        setNodes((nodes) => nodes.filter((node) => node.id !== deletedNodes[i].id));

        // check if current node
        if (props.nodeInformation.selectedNode.getter === deletedNodes[i].id) {
          props.nodeInformation.selectedNode.setter(undefined);
        }

        // update global node storage
        mapTemp.delete(deletedNodes[i].id);
      }
      props.nodeInformation.activeNodes.setter(mapTemp);
    },
    [setNodes, props.nodeInformation.activeNodes, props.nodeInformation.selectedNode]
  );

  const onEdgeDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      const mapTemp = props.edgeInformation.activeEdges.getter;

      for (let i = 0; i < edgesToDelete.length; i++) {
        // update local edge storage
        setEdges((edges) => edges.filter((edge) => edge.id !== edgesToDelete[i].id));

        // check if current edge
        if (props.edgeInformation.selectedEdge.getter === edgesToDelete[i].id) {
          props.edgeInformation.selectedEdge.setter(undefined);
        }

        // update global edge storage
        mapTemp.delete(edgesToDelete[i].id);
      }

      props.edgeInformation.activeEdges.setter(mapTemp);
    },
    [setEdges, props.edgeInformation.activeEdges, props.edgeInformation.selectedEdge]
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

      console.log(defaultValues);

      // update values in props.activeNodes
      props.nodeInformation.activeNodes.setter(
        new Map(
          defaultValues.map((node) => {
            return [node.id, node];
          })
        )
      );

      // -- also setup edges
      const defaultEdges: Edge[] = [
        generateLocalEdgeObject({
          id: crypto.randomUUID(),
          source: "a",
          target: "c",
          sourceHandle: "bottom_source",
          targetHandle: "top_target",
          animated: true,
        }),
        generateLocalEdgeObject({
          id: crypto.randomUUID(),
          source: "b",
          target: "d",
          sourceHandle: "bottom_source",
          targetHandle: "top_target",
          animated: true,
        }),
        generateLocalEdgeObject({
          id: crypto.randomUUID(),
          source: "c",
          target: "d",
          sourceHandle: "bottom_source",
          targetHandle: "top_target",
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
    });

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
    mapTemp.set(newNode.id, newNode);
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
          // -------------------------------------------------------------------------- //
          // node events
          onNodesChange={(changes) => {
            setNodes((nds) => applyNodeChanges(changes, nds));

            // console.log(changes);

            // update position of local nodes
            // for (let i = 0; i < changes.length; i++) {
            //   const change = changes[i];

            //   if (change.type == "position") {
            //     const node = props.nodeInformation.activeNodes.getter.get(change.id);
            //     if (change.position != undefined && node != undefined) {
            //       node.position = change.position;
            //     }
            //   }
            // }
          }}
          onNodeClick={(event, node) => {
            // this is a node click event
            props.nodeInformation.selectedNode.setter(node.id);
          }}
          onNodeMouseEnter={(event, node) => {
            // this is a mouse enter event
            // console.log("mouse enter", node);
            props.nodeInformation.hoveringNode.setter(node.id);
          }}
          onPaneClick={() => {
            // this is a pane click event
            props.nodeInformation.selectedNode.setter(undefined);
            props.edgeInformation.selectedEdge.setter(undefined);
          }}
          // -------------------------------------------------------------------------- //
          // edge events
          onEdgesChange={(changes) => {
            setEdges((eds) => applyEdgeChanges(changes, eds));
          }}
          onEdgeClick={(event, edge) => {
            // this is an edge click event
            props.edgeInformation.selectedEdge.setter(edge.id);
          }}
          // no edge double click event
          // no edge right click event
          // -------------------------------------------------------------------------- //
          // connection events
          onConnect={(connection: Connection) => {
            // Generate a unique ID for the new edge
            const edgeId = crypto.randomUUID();

            // Retrieve the source and target node objects
            const sourceNode = props.nodeInformation.activeNodes.getter.get(connection.source);
            const targetNode = props.nodeInformation.activeNodes.getter.get(connection.target);

            // Compute a flow direction based on node positions.
            // This is a simple rule: if the source's x is less than the target's x,
            // then "normal" (i.e. animation flows left-to-right from source to target).
            // Otherwise, use "reverse".
            let flowDirection = "normal";
            if (sourceNode && targetNode) {
              flowDirection = sourceNode.position.x < targetNode.position.x ? "normal" : "reverse";

              console.log(sourceNode, targetNode);

              sourceNode.data.connections.push(edgeId);
              targetNode.data.connections.push(edgeId);
            }

            // Create the edge object, adding the computed animationDirection in its data
            const newEdge: Edge = {
              ...connection,
              id: edgeId,
              type: "base",
              animated: true,
              data: { animationDirection: flowDirection },
            };

            // Update ReactFlow edges state
            setEdges((edges) => addEdge(newEdge, edges));

            // Also update your global edge state
            const mapTemp = props.edgeInformation.activeEdges.getter;
            mapTemp.set(edgeId, newEdge as LocalEdgeObject);
            props.edgeInformation.activeEdges.setter(mapTemp);
            props.edgeInformation.creatingNewEdge.setter(undefined);
          }}
          onConnectStart={() => {
            props.edgeInformation.selectedEdge.setter(undefined);
            props.edgeInformation.creatingNewEdge.setter(props.nodeInformation.selectedNode.getter);
            console.log("connect start");
          }}
          onConnectEnd={() => {
            props.edgeInformation.creatingNewEdge.setter(undefined);
          }}
          // -------------------------------------------------------------------------- //
          // delete events
          onEdgesDelete={onEdgeDelete}
          onNodesDelete={onNodeDelete}
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
