"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import BaseClassTab from "./tabs/baseclasstab";
import NodeEditorTab from "./tabs/nodeeditortab";
import styles from "./styles/sidebar.module.css";
import TabCard from "./tabcard";
import { StateManagerProps, SharedProgramData } from "../page";
import { BACKEND_IP } from "../globals";

interface SideBarProps {
  props: SharedProgramData;
}

interface BackendQueryVariable {
  name: string;
  value: string;
}

// Tab Info Props -- for backend communication
export interface TabInfoProps {
  editorWidth: StateManagerProps<number>;
  baseClassCode: StateManagerProps<string>;
  baseClassLanguage: StateManagerProps<string>;
  baseClassVariables: StateManagerProps<BackendQueryVariable[]>;
}

const TABS = ["Base Class", "Node Editor"];

// side bar compenent
const SideBar: React.FC<SideBarProps> = ({ props }) => {
  // State Management
  const [activeTab, setActiveTab] = useState(0);
  const [baseClassCode, setBaseClassCode] = useState("");
  const [baseClassLanguage, setBaseClassLanguage] = useState("python");
  const [baseClassVariables, setBaseClassVariables] = useState<BackendQueryVariable[]>([]);
  const [readyToParse, setReadyToParse] = useState(false);

  // display current Node Information
  const [currentNodeDisplay, setCurrentNodeDisplay] = useState<string>("");

  React.useEffect(() => {
    // update display value
    // if null value
    if (!props.selectedNode.getter) {
      setCurrentNodeDisplay("No Selected Node");
      return;
    } else {
      const n_id = props.selectedNode.getter;
      const n_data = props.activeNodes.getter.get(n_id);
      console.log(n_id, n_data);
      if (!n_data) {
        setCurrentNodeDisplay("No Selected Node");
        return;
      }
      console.log(n_data);

      if (!n_data) {
        setCurrentNodeDisplay("No Selected Node");
        return;
      }
      setCurrentNodeDisplay(`${n_data.id} -- ${n_data.type}`);
    }
  }, [props.selectedNode.getter, props.activeNodes.getter]);

  // Memoized Tab Info Object
  const tabInfo = useMemo(
    () => ({
      editorWidth: props.editorWidth,
      baseClassCode: { getter: baseClassCode, setter: setBaseClassCode },
      baseClassLanguage: {
        getter: baseClassLanguage,
        setter: setBaseClassLanguage,
      },
      baseClassVariables: {
        getter: baseClassVariables,
        setter: setBaseClassVariables,
      },
    }),
    [baseClassCode, baseClassLanguage, baseClassVariables, props.editorWidth]
  );

  // Map tab components dynamically
  const TAB_COMPONENTS = useMemo(
    () => [
      <BaseClassTab key="baseClassTab" props={tabInfo} />,
      <NodeEditorTab key="nodeEditorTab" props={tabInfo} />,
    ],
    [tabInfo]
  );

  // Log base class code changes for debugging
  useEffect(() => {
    console.log("Base Class Code:", tabInfo.baseClassCode.getter);
  }, [tabInfo.baseClassCode.getter, tabInfo.editorWidth.getter]);

  // Handle Request Parsing Event
  useEffect(() => {
    const handleRequestParsing = () => setReadyToParse(true);
    window.addEventListener("requestparsing", handleRequestParsing);
    return () => window.removeEventListener("requestparsing", handleRequestParsing);
  }, []);

  // Handle Code Parsing Request
  useEffect(() => {
    if (!readyToParse) return;

    const TARGET_IP = `${BACKEND_IP}/api/code-parser`;
    console.log("Parsing request to:", TARGET_IP);

    fetch(TARGET_IP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({
        code: tabInfo.baseClassCode.getter,
        language: tabInfo.baseClassLanguage.getter,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Parsed Data:", data);
        tabInfo.baseClassVariables.setter(data.variables);
      })
      .catch((error) => console.error("Parsing Error:", error));

    setReadyToParse(false);
  }, [readyToParse, tabInfo]);

  // Handle Tab Click
  const handleTabClick = useCallback((index: number) => {
    setActiveTab(index);
    console.log("Tab Clicked:", index);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles["container-grid"]}>
        {/* Tab Selection */}
        <div className={styles["container-grid-item"]} style={{ paddingBottom: 0 }}>
          <div className={styles["tab-cards-container"]} style={{ paddingBottom: 0 }}>
            {TABS.map((tab, index) => (
              <TabCard
                title={tab}
                activeTab={activeTab}
                tabKey={index}
                key={index}
                onClick={() => handleTabClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Node Info */}
        <div className={`${styles["container-grid-item"]} ${styles["sidebar-node-info"]}`}>
          <div style={{ paddingLeft: "5px" }}>
            <b>Current Node: </b>
            {currentNodeDisplay}
          </div>
        </div>

        {/* Active Tab Content */}
        <div className={styles["container-grid-item"]} style={{ flex: 1 }}>
          {TAB_COMPONENTS[activeTab]}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
