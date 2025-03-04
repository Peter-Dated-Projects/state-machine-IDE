"use client";
import styles from "./page.module.css";
import React from "react";
import { useState } from "react";
import SideBar from "./components/sidebar";
import CanvasWindow from "./components/canvas";

// ------------------------------------------ //
// interfaces

interface NodeInterface {
  // TODO - idk @jonz can u update this plz
  id: number;
  name: string;
  x: number;
  y: number;
}

export interface StateManagerProps<T> {
  getter: T;
  setter: (value: T) => void;
}

// i will add any other information i think canvas and sidebar need to share here
export interface SharedProgramData {
  selectedNode: StateManagerProps<NodeInterface | null>;
}

// ------------------------------------------ //
// main function
export default function Home() {
  // states
  const [sidebarWidth, setSidebarWidth] = useState(500); // Initial sidebar width

  // mouse positino
  const handleMouseDown = (event: React.MouseEvent) => {
    const startX = event.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(200, startWidth + moveEvent.clientX - startX); // Minimum width of 200px
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // ------------------------------------------ //
  // shared program variables
  // @jonz this is what im talking about
  // i need selected node information so i can update info on sidebar

  const [selectedNode, setSelectedNode] = useState<NodeInterface | null>(null);

  const shared_information: SharedProgramData = {
    selectedNode: { getter: selectedNode, setter: setSelectedNode },
  };

  // ------------------------------------------ //
  // return object
  return (
    <div className={styles.page}>
      <div className={styles.container} style={{ display: "flex", height: "100vh" }}>
        <div
          style={{
            width: `${sidebarWidth}px`,
            height: "100vh",
            background: "#eee",
          }}
        >
          <SideBar props={shared_information} />
        </div>

        <div
          onMouseDown={handleMouseDown}
          style={{
            width: "5px",
            cursor: "ew-resize",
            background: "#888",
            height: "100vh",
          }}
        />

        {/* CanvasWindow takes remaining space */}
        <div style={{ flexGrow: 1, height: "100vh" }}>
          <CanvasWindow props={shared_information} />
        </div>
      </div>
    </div>
  );
}
