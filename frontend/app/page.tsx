"use client";
import styles from "./page.module.css";
import React, { useState, useCallback } from "react";
import SideBar from "./components/sidebar";
import CanvasWindow from "./components/canvas";

// ------------------------------------------ //
// Interfaces
interface NodeInterface {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
}

export interface StateManagerProps<T> {
  getter: T;
  setter: (value: T) => void;
  onChange?: (callback: (value: T) => void) => void;
}

export interface KeyNodePair {
  [key: string]: NodeInterface;
}

export interface SharedProgramData {
  editorWidth: StateManagerProps<number>;
  selectedNode: StateManagerProps<string | undefined>;
  activeNodes: StateManagerProps<Map<string, NodeInterface>>;
}

// ------------------------------------------ //
// Main Component
export default function Home() {
  // Sidebar and editor state
  const [sidebarWidth, setSidebarWidth] = useState(500);
  const [editorWidth, setEditorWidth] = useState(sidebarWidth - 40);
  const [selectedNode, setSelectedNode] = useState<string | undefined>(undefined);
  const [activeNodes, setActiveNodes] = useState<Map<string, NodeInterface>>(new Map());

  // Handle sidebar resize
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      const startX = event.clientX;
      const startWidth = sidebarWidth;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = Math.max(300, startWidth + moveEvent.clientX - startX);
        setSidebarWidth(newWidth);
        setEditorWidth(newWidth - 40);
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [sidebarWidth]
  );

  // Shared program state
  const sharedData: SharedProgramData = {
    editorWidth: { getter: editorWidth, setter: setEditorWidth },
    selectedNode: { getter: selectedNode, setter: setSelectedNode },
    activeNodes: { getter: activeNodes, setter: setActiveNodes },
  };

  return (
    <div className={styles.page}>
      <div className={styles.container} style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <div
          style={{
            width: `${sidebarWidth}px`,
            height: "100vh",
            background: "#eee",
          }}
        >
          <SideBar props={sharedData} />
        </div>

        {/* Resize Handle */}
        <div onMouseDown={handleMouseDown} className={styles.resizeHandle} />

        {/* Canvas Window */}
        <div style={{ flexGrow: 1, height: "100vh" }}>
          <CanvasWindow props={sharedData} />
        </div>
      </div>
    </div>
  );
}
