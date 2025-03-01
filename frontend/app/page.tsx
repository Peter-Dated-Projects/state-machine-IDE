import styles from "./page.module.css";
import React from "react";
import SideBar from "./components/sidebar";
import CanvasWindow from "./components/canvas";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div style={{ width: "100%" }}>
          <SideBar />
        </div>
        <div style={{ height: "100vh", width: "100%" }}>
          <CanvasWindow />
        </div>
      </div>
    </div>
  );
}
