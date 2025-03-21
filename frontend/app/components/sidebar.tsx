"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "./styles/sidebar.module.css";
import { StateManagerProps, SharedProgramData } from "../page";
import { BACKEND_IP } from "../globals";
import AccordionItem from "./ui/Accordion";
import { Accordion } from "radix-ui";
import { Select } from "@radix-ui/themes";
import * as Dialog from "@radix-ui/react-dialog";
import ClassEditor from "./classeditor";
import { DEFAULT_CLASS_TEXT } from "./tabinformation";
import { NODE_NAME_CHANGE_EVENT } from "../globals";

interface SideBarProps {
  props: SharedProgramData;
}

interface BackendQueryVariable {
  name: string;
  value: string;
}

interface NodeData {
  id: string;
  name: string;
  type: string;
}

export interface classInfoProps {
  isSaved: StateManagerProps<boolean>;
  editorWidth: StateManagerProps<number>;
  classCode: StateManagerProps<string>;
  classLanguage: StateManagerProps<string>;
  classVariables: StateManagerProps<BackendQueryVariable[]>;
  nodeId?: string;
}

const SUPPORTED_LANGUAGES = ["python", "javascript", "typescript", "java", "c++", "c#"];

const SideBar: React.FC<SideBarProps> = ({ props }) => {
  const [isSaved, setIsSaved] = useState(true);
  const [nodeCodeMap, setNodeCodeMap] = useState<Map<string, string>>(() => {
    const initialMap = new Map();
    initialMap.set("baseClass", DEFAULT_CLASS_TEXT);
    return initialMap;
  });
  const [classLanguage, setClassLanguage] = useState("python");
  const [classVariables, setClassVariables] = useState<BackendQueryVariable[]>([]);
  const [readyToParse, setReadyToParse] = useState(false);
  const [nodeData, setNodeData] = useState<NodeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Component Functions
  const generateCode = () => {
    setIsModalOpen(true);
  };

  const handleConfirmGenerate = () => {
    console.log("sending generate request");
    window.dispatchEvent(new CustomEvent("generatecode"));
    setIsModalOpen(false);
  };

  // ------------------------------------- //
  // create a custom event handler for node name changes
  useEffect(() => {
    const nodeNameChangeEventHandler = (event: CustomEvent<{ nodeid: string; value: string }>) => {
      // change name of node in activenodes
      const eNode = props.nodeInformation.activeNodes.getter.get(event.detail.nodeid);
      if (eNode) {
        eNode.data.label = event.detail.value;
        eNode.name = event.detail.value;

        props.nodeInformation.activeNodes.getter.set(eNode.id, { ...eNode });

        console.log("Changed", eNode.name);
      }
    };

    window.addEventListener(NODE_NAME_CHANGE_EVENT, nodeNameChangeEventHandler as EventListener);

    return () => {
      window.removeEventListener(
        NODE_NAME_CHANGE_EVENT,
        nodeNameChangeEventHandler as EventListener
      );
    };
  }, [props.nodeInformation.activeNodes]);

  // create nodedata effect manager
  useEffect(() => {
    const nodeInfo = props.nodeInformation.selectedNode.getter
      ? props.nodeInformation.activeNodes.getter.get(
          props.nodeInformation.selectedNode.getter || ""
        )
      : null;
    if (nodeInfo) {
      setNodeData({
        id: nodeInfo.id,
        name: nodeInfo.name,
        type: nodeInfo.type,
      });
    } else {
      setNodeData(null);
    }
  }, [props.nodeInformation.activeNodes.getter, props.nodeInformation.selectedNode.getter]);

  // Get the code for a given node
  const getNodeCode = useCallback(
    (nodeId: string) => {
      return nodeCodeMap.get(nodeId) || "";
    },
    [nodeCodeMap]
  );

  const setNodeCode = useCallback(
    (nodeId: string, code: string) => {
      setNodeCodeMap(new Map(nodeCodeMap.set(nodeId, code)));
      setIsSaved(true);
    },
    [nodeCodeMap]
  );

  // Memoize the base class info
  const baseClassInfo = useMemo(
    () => ({
      isSaved: { getter: isSaved, setter: setIsSaved },
      editorWidth: props.editorWidth,
      classCode: {
        getter: getNodeCode("baseClass"),
        setter: (code: string) => setNodeCode("baseClass", code),
      },
      classLanguage: {
        getter: classLanguage,
        setter: setClassLanguage,
      },
      classVariables: {
        getter: classVariables,
        setter: setClassVariables,
      },
      nodeId: "baseClass",
    }),
    [classLanguage, classVariables, props.editorWidth, isSaved, getNodeCode, setNodeCode]
  );

  // Parse the class code
  useEffect(() => {
    const handleRequestParsing = () => setReadyToParse(true);
    window.addEventListener("requestparsing", handleRequestParsing);
    return () => window.removeEventListener("requestparsing", handleRequestParsing);
  }, []);

  // Send the class code to the backend for parsing
  useEffect(() => {
    if (!readyToParse) return;
    fetch(`${BACKEND_IP}/api/code-parser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: nodeData ? getNodeCode(nodeData.id) : getNodeCode("baseClass"),
        language: classLanguage,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClassVariables(data.variables))
      .catch(console.error);
    setReadyToParse(false);
  }, [readyToParse, nodeData, classLanguage, nodeCodeMap, getNodeCode]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.nodeInfo}>
        <h3>Current Node:</h3>
        <div className={styles.currentNodeDisplay}>
          {nodeData ? `${nodeData.name} — ${nodeData.type}` : "No Selected Node"}
        </div>
      </div>
      <section className={styles["editorSection"]}>
        <div className={styles["code-editor-admin-bar"]}>
          <div style={{ display: "flex" }}>
            <h2>Editor</h2>
          </div>
          <div className={styles["code-editor-language-selector"]}>
            <svg height="17" width="17" style={{ alignSelf: "center" }}>
              <circle cx="8.5" cy="8.5" r="8" fill={isSaved ? "lightgreen" : "red"} />
            </svg>

            <Select.Root value={classLanguage} onValueChange={(value) => setClassLanguage(value)}>
              <Select.Trigger style={{ cursor: "pointer" }} />
              <Select.Content position="popper">
                {SUPPORTED_LANGUAGES.map((language) => (
                  <Select.Item key={language} value={language} style={{ cursor: "pointer" }}>
                    {language}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <div
          className={styles["accordion-container"]}
          style={{ overflowY: "auto", maxHeight: "calc(100vh - 230px)" }}
        >
          <Accordion.Root
            className={styles["AccordionRoot"]}
            type="single"
            collapsible
            defaultValue="baseState"
          >
            {/* base class object */}
            <AccordionItem
              title={"State Template Code"}
              content={<ClassEditor key={"BaseState"} props={baseClassInfo} />}
              value={"baseState"}
            />

            {/* load all other accordian objects */}
            {Array.from(props.nodeInformation.activeNodes.getter.values()).map((node) => {
              const nodeClassInfo = {
                ...baseClassInfo,
                classCode: {
                  getter: getNodeCode(node.id),
                  setter: (code: string) => setNodeCode(node.id, code),
                },
                nodeId: node.id,
              };

              console.log(node);

              return (
                <AccordionItem
                  key={node.id}
                  title={`${node.name}`}
                  content={<ClassEditor key={`${node.id}-classtab`} props={nodeClassInfo} />}
                  value={node.id}
                />
              );
            })}
          </Accordion.Root>
        </div>
      </section>
      <button className={styles["generate-btn"]} onClick={generateCode}>
        Save & Generate
      </button>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles["modal-overlay"]} />
          <Dialog.Content className={styles["modal-content"]}>
            <Dialog.Title className={styles["modal-title"]}>Generate Code</Dialog.Title>
            <Dialog.Description className={styles["modal-description"]}>
              Are you sure you want to generate code for the current state machine? This will create
              implementation files based on your current setup.
            </Dialog.Description>
            <div className={styles["modal-actions"]}>
              <button
                className={`${styles["modal-button"]} ${styles["modal-button-secondary"]}`}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`${styles["modal-button"]} ${styles["modal-button-primary"]}`}
                onClick={handleConfirmGenerate}
              >
                Generate
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default SideBar;
