"use client";

import BaseClassTab from "./tabs/baseclasstab";
import NodeEditorTab from "./tabs/nodeeditortab";

import styles from "./styles/sidebar.module.css";
import TabCard from "./tabcard";
import React from "react";

import { StateManagerProps } from "../page";
import { SharedProgramData } from "../page";
import { BACKEND_IP } from "../globals";

// ------------------------------------------ //
interface SideBarProps {
  props: SharedProgramData;
}

// ------------------------------------------ //

export interface TabInfoProps {
  baseClassCode: StateManagerProps<string>;
  baseClassLanguage: StateManagerProps<string>;
  baseClassVariables: StateManagerProps<string[]>;
}

// ------------------------------------------ //
// side bar object
const SideBar = ({ props }: SideBarProps) => {
  const [activeTab, setActiveTab] = React.useState(0);

  // tab state variables
  const [baseClassCode, setBaseClassCode] = React.useState("");
  const [baseClassLanguage, setBaseClassLanguage] = React.useState("python");
  const [baseClassVariables, setBaseClassVariables] = React.useState<string[]>([]);
  const [readyToParse, setReadyToParse] = React.useState(false);

  // ------------------------------------------ //
  // tab data
  const info_blob: TabInfoProps = React.useMemo(
    () => ({
      baseClassCode: { getter: baseClassCode, setter: setBaseClassCode },
      baseClassLanguage: { getter: baseClassLanguage, setter: setBaseClassLanguage },
      baseClassVariables: { getter: baseClassVariables, setter: setBaseClassVariables },
    }),
    [baseClassCode, baseClassLanguage, baseClassVariables]
  );
  const TAB_DATA = ["Base Class", "Node Editor"];
  const TAB_DATA_OBJECTS = [
    <BaseClassTab key={0} props={info_blob} />,
    <NodeEditorTab key={1} props={info_blob} />,
  ];

  // ------------------------------------------ //
  // testing
  React.useEffect(() => {
    console.log("base class code", info_blob.baseClassCode.getter);
  }, [info_blob.baseClassCode]);

  // ------------------------------------------ //
  // Event listener for request parsing
  React.useEffect(() => {
    const handleRequestParsing = () => {
      // update ready to parse
      setReadyToParse(true);
      //   console.log("ready to request parsing");
    };

    window.addEventListener("requestparsing", handleRequestParsing as EventListener);

    return () => {
      window.removeEventListener("requestparsing", handleRequestParsing as EventListener);
    };
  }, []);

  // request parsing
  React.useEffect(() => {
    // check if ready to parse
    if (!readyToParse) return;
    // console.log("ready to parse", readyToParse);

    // console.log(info_blob.baseClassCode.getter);
    // console.log(info_blob.baseClassLanguage.getter);

    const TARGET_IP = `${BACKEND_IP}/api/code-parser`;
    console.log("target: ", TARGET_IP);
    fetch(TARGET_IP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify({
        code: info_blob.baseClassCode.getter,
        language: info_blob.baseClassLanguage.getter,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("parsed data", data);
        info_blob.baseClassVariables.setter(data.variables);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // cannot parse anymore!
    setReadyToParse(false);
  }, [readyToParse, info_blob]);

  // ------------------------------------------ //
  // object
  return (
    <div className={styles.container}>
      <div className={styles["container-grid"]}>
        <div className={styles["container-grid-item"]} style={{ paddingBottom: "0px" }}>
          <div className={styles["tab-cards-container"]} style={{ paddingBottom: "0px" }}>
            {TAB_DATA.map((tab, index) => (
              <div
                key={index}
                onClick={() => {
                  setActiveTab(index);
                  console.log("clicked", index);
                }}
              >
                <TabCard key={index} title={tab} />
              </div>
            ))}
          </div>
        </div>
        <div className={`${styles["container-grid-item"]} ${styles["sidebar-node-info"]}`}>
          <div style={{ paddingLeft: "5px" }}>
            <b>Current Node: </b>
            {props.selectedNode.getter ? props.selectedNode.getter.name : "Not Selected"}
          </div>
        </div>
        <div className={styles["container-grid-item"]} style={{ flex: 1 }}>
          <div>{TAB_DATA_OBJECTS[activeTab]}</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
