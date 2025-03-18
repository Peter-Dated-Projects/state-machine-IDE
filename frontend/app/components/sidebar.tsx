"use client";
import React, { useState, useEffect, useMemo } from "react";
import styles from "./styles/sidebar.module.css";
import { StateManagerProps, SharedProgramData } from "../page";
import { BACKEND_IP } from "../globals";
import AccordionItem from "./ui/Accordion";
import { Accordion } from "radix-ui";
import { Select } from "@radix-ui/themes";
import ClassEditor from "./classeditor";

interface SideBarProps {
  props: SharedProgramData;
}

interface BackendQueryVariable {
  name: string;
  value: string;
}

interface NodeData {
  id: string;
  type: string;
}

export interface classInfoProps {
  isSaved: StateManagerProps<boolean>;
  editorWidth: StateManagerProps<number>;
  classCode: StateManagerProps<string>;
  classLanguage: StateManagerProps<string>;
  classVariables: StateManagerProps<BackendQueryVariable[]>;
}

const SUPPORTED_LANGUAGES = [
  "python",
  "javascript",
  "typescript",
  "java",
  "c++",
  "c#",
];

const SideBar: React.FC<SideBarProps> = ({ props }) => {
  const [isSaved, setIsSaved] = useState(true);
  const [classCode, setClassCode] = useState("");
  const [classLanguage, setClassLanguage] = useState("python");
  const [classVariables, setClassVariables] = useState<BackendQueryVariable[]>(
    []
  );
  const [readyToParse, setReadyToParse] = useState(false);
  const [nodeData, setNodeData] = useState<NodeData | null>(null);

  // Component Functions
  const generateCode = () => {
    // send information to backend and retrieve active variables
    // take parsed information after saving, then request backend to generate rest of code
    console.log("sending generate request");
    window.dispatchEvent(new CustomEvent("generatecode"));

    // Fills in the rest of the code in baseCode and changes it in the editor
    // TODO: popup for chatbot - later

    // ============== LlamaIndex or Gemini API===============
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
  const classInfo = useMemo(
    () => ({
      isSaved: { getter: isSaved, setter: setIsSaved },
      editorWidth: props.editorWidth,
      classCode: { getter: classCode, setter: setClassCode },
      classLanguage: {
        getter: classLanguage,
        setter: setClassLanguage,
      },
      classVariables: {
        getter: classVariables,
        setter: setClassVariables,
      },
    }),
    [classCode, classLanguage, classVariables, props.editorWidth, isSaved]
  );

  // Log the class code
  useEffect(() => {
    console.log("Class Code:", classInfo.classCode.getter);
  }, [classInfo.classCode.getter]);

  // Parse the class code
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
        code: classInfo.classCode.getter,
        language: classInfo.classLanguage.getter,
      }),
    })
      .then((res) => res.json())
      .then((data) => classInfo.classVariables.setter(data.variables))
      .catch(console.error);
    setReadyToParse(false);
  }, [readyToParse, classInfo]);

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
              value={classLanguage}
              onValueChange={(value) => setClassLanguage(value)}
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
              title={"Base Class"}
              content={<ClassEditor key={"Base Class"} props={classInfo} />}
              value={"baseClass"}
            />
            {Array.from(props.nodeInformation.activeNodes.getter.values()).map(
              (node) => (
                <AccordionItem
                  key={node.id}
                  title={`${node.id}`}
                  content={
                    <ClassEditor key={`${node.id}ClassTab`} props={classInfo} />
                  }
                  value={node.id}
                />
              )
            )}
          </Accordion.Root>
        </div>
      </section>
      <button className={styles["generate-btn"]} onClick={generateCode}>
        Save & Generate
      </button>
    </div>
  );
};

export default SideBar;
