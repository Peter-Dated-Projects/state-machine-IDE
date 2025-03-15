"use client";
import React, { useState, useEffect, useMemo } from "react";
import styles from "./styles/sidebar.module.css";
import { StateManagerProps, SharedProgramData } from "../page";
import { BACKEND_IP } from "../globals";
import BaseClassTab from "./baseclasstab";
import AccordionItem from "./ui/Accordion";
import { Accordion } from "radix-ui";
import { Select } from "@radix-ui/themes";
import { SUPPORTED_LANGUAGES } from "./tabinformation";

interface SideBarProps {
  props: SharedProgramData;
}

interface BackendQueryVariable {
  name: string;
  value: string;
}

export interface classInfoProps {
  isSaved: StateManagerProps<boolean>;
  editorWidth: StateManagerProps<number>;
  baseClassCode: StateManagerProps<string>;
  baseClassLanguage: StateManagerProps<string>;
  baseClassVariables: StateManagerProps<BackendQueryVariable[]>;
}

const SideBar: React.FC<SideBarProps> = ({ props }) => {
  const [isSaved, setIsSaved] = useState(true);
  const [baseClassCode, setBaseClassCode] = useState("");
  const [baseClassLanguage, setBaseClassLanguage] = useState("python");
  const [baseClassVariables, setBaseClassVariables] = useState<
    BackendQueryVariable[]
  >([]);
  const [readyToParse, setReadyToParse] = useState(false);

  interface NodeData {
    id: string;
    type: string;
  }
  const [nodeData, setNodeData] = useState<NodeData | null>(null);

  const generateBaseCode = () => {
    // send information to backend and retrieve active variables
    // take parsed information after saving, then request backend to generate rest of code
    console.log("sending generate request");
    window.dispatchEvent(new CustomEvent("generatecode"));

    // Fills in the rest of the code in baseCode and changes it in the editor
    // TODO: popup for chatbot - later
  };

  // create nodedata effect manager
  useEffect(() => {
    // get node information
    const nodeInfo = props.nodeInformation.selectedNode.getter
      ? props.nodeInformation.activeNodes.getter.get(
          props.nodeInformation.selectedNode.getter || ""
        )
      : null;
    if (nodeInfo) {
      setNodeData({ id: nodeInfo.id, type: nodeInfo.type });
    } else {
      setNodeData(null);
    }
  }, [
    props.nodeInformation.activeNodes.getter,
    props.nodeInformation.selectedNode.getter,
  ]);

  // Memoize the tab information
  const tabInfo = useMemo(
    () => ({
      isSaved: { getter: isSaved, setter: setIsSaved },
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
    [
      baseClassCode,
      baseClassLanguage,
      baseClassVariables,
      props.editorWidth,
      isSaved,
    ]
  );

  // Log the base class code
  useEffect(() => {
    console.log("Base Class Code:", tabInfo.baseClassCode.getter);
  }, [tabInfo.baseClassCode.getter]);

  // Parse the base class code
  useEffect(() => {
    const handleRequestParsing = () => setReadyToParse(true);
    window.addEventListener("requestparsing", handleRequestParsing);
    return () =>
      window.removeEventListener("requestparsing", handleRequestParsing);
  }, []);

  // Send the base class code to the backend for parsing
  useEffect(() => {
    if (!readyToParse) return;
    fetch(`${BACKEND_IP}/api/code-parser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: tabInfo.baseClassCode.getter,
        language: tabInfo.baseClassLanguage.getter,
      }),
    })
      .then((res) => res.json())
      .then((data) => tabInfo.baseClassVariables.setter(data.variables))
      .catch(console.error);
    setReadyToParse(false);
  }, [readyToParse, tabInfo]);

  // Generate the base class code
  return (
    <div className={styles.container}>
      <div className={styles.nodeInfo}>
        <h3>Current Node:</h3>
        <div className={styles.currentNodeDisplay}>
          {nodeData ? `${nodeData.id} — ${nodeData.type}` : "No Selected Node"}
        </div>
      </div>
      <section className={styles["editorSection"]}>
        <div className={styles["code-editor-admin-bar"]}>
          <div style={{ display: "flex" }}>
            <h2>Editor</h2>
          </div>
          <div className={styles["code-editor-language-selector"]}>
            <svg height="17" width="17" style={{ alignSelf: "center" }}>
              <circle
                cx="8.5"
                cy="8.5"
                r="8"
                fill={isSaved ? "lightgreen" : "red"}
              />
            </svg>

            <Select.Root
              value={baseClassLanguage}
              onValueChange={(value) => setBaseClassLanguage(value)}
            >
              <Select.Trigger style={{ cursor: "pointer" }} />
              <Select.Content position="popper">
                {SUPPORTED_LANGUAGES.map((language) => (
                  <Select.Item
                    key={language}
                    value={language}
                    style={{ cursor: "pointer" }}
                  >
                    {language}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <div className={styles["accordion-container"]}>
          <Accordion.Root
            className={styles["AccordionRoot"]}
            type="single"
            collapsible
            defaultValue="baseClass"
          >
            <AccordionItem
              title="Base Class"
              content={<BaseClassTab key="baseClassTab" props={tabInfo} />}
              value="baseClass"
            />
          </Accordion.Root>
        </div>
      </section>
      <button className={styles["generate-btn"]} onClick={generateBaseCode}>
        Save & Generate
      </button>
    </div>
  );
};

export default SideBar;
