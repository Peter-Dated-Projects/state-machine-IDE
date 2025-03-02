"use client";
import styles from "./page.module.css";
import React from "react";
import { useState } from "react";
import SideBar from "./components/sidebar";
import CanvasWindow from "./components/canvas";

export default function Home() {
    const [sidebarWidth, setSidebarWidth] = useState(500); // Initial sidebar width

    const handleMouseDown = (event: React.MouseEvent) => {
        const startX = event.clientX;
        const startWidth = sidebarWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = Math.max(
                200,
                startWidth + moveEvent.clientX - startX
            ); // Minimum width of 200px
            setSidebarWidth(newWidth);
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    return (
        <div className={styles.page}>
            <div
                className={styles.container}
                style={{ display: "flex", height: "100vh" }}
            >
                <div
                    style={{
                        width: `${sidebarWidth}px`,
                        height: "100vh",
                        background: "#eee",
                    }}
                >
                    <SideBar width={sidebarWidth} />
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
                    <CanvasWindow />
                </div>
            </div>
        </div>
    );
}
