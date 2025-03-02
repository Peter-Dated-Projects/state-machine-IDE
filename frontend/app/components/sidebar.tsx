"use client";

import BaseClassTab from "./tabs/baseclasstab";
import NodeEditorTab from "./tabs/nodeeditortab";

import styles from "./styles/sidebar.module.css";
import TabCard from "./tabcard";
import React from "react";

interface SideBarProps {
  width: number;
}

interface StateManagerProps<T> {
  getter: T;
  setter: (value: T) => void;
}

export interface TabInfoProps {
  baseClassCode: StateManagerProps<string>;
  baseClassLanguage: StateManagerProps<string>;
}

// side bar object
const SideBar: React.FC<SideBarProps> = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  // tab state variables
  const [baseClassCode, setBaseClassCode] = React.useState("");
  const [baseClassLanguage, setBaseClassLanguage] = React.useState("python");

  // tab data
  const info_blob: TabInfoProps = {
    baseClassCode: { getter: baseClassCode, setter: setBaseClassCode },
    baseClassLanguage: { getter: baseClassLanguage, setter: setBaseClassLanguage },
  };
  const TAB_DATA = ["Base Class", "Node Editor"];
  const TAB_DATA_OBJECTS = [
    <BaseClassTab key={0} props={info_blob} />,
    <NodeEditorTab key={1} props={info_blob} />,
  ];

  // testing
  React.useEffect(() => {
    console.log("base class code", info_blob.baseClassCode.getter);
  }, [info_blob.baseClassCode]);

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
        <div className={styles["container-grid-item"]} style={{ flex: 1 }}>
          <div>{TAB_DATA_OBJECTS[activeTab]}</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
