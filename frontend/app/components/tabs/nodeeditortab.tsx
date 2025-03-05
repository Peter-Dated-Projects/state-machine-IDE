import styles from "./styles/nodeeditortab.module.css";
import baseclassstyles from "./styles/baseclasstab.module.css";

import { TabInfoProps } from "../sidebar";
import { SUPPORTED_LANGUAGES } from "./tabinformation";

import React from "react";
import { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";

interface NodeEditorTabProps {
  props: TabInfoProps;
}

// object
function NodeEditorTab({ props }: NodeEditorTabProps) {
  const [classVariables, setClassVariables] = useState([]);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    const handleSave = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        console.log("saved file");
        setIsSaved(true);
      }
    };

    window.addEventListener("keydown", handleSave);

    return () => {
      window.removeEventListener("keydown", handleSave);
    };
  }, []);

  // object
  return (
    <div className={styles.container}>
      <div className={baseclassstyles["code-editor-container"]}>
        <div className={baseclassstyles["code-editor-admin-bar"]}>
          <div style={{ display: "flex" }}>
            <p>Base Class Code Editor</p>
          </div>
          <div className={baseclassstyles["code-editor-language-selector"]}>
            <svg height="17" width="17" style={{ alignSelf: "center" }}>
              <circle
                cx="8.5"
                cy="8.5"
                r="8"
                fill={isSaved ? "green" : "red"}
              />
            </svg>
            <select
              value={props.baseClassLanguage.getter}
              onChange={(e) => props.baseClassLanguage.setter(e.target.value)}
            >
              {SUPPORTED_LANGUAGES.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          {
            // show editor if there is a current selected node
            // else show no editor
            <div className="code-editor-container">
              <Editor
                height="40vh"
                width={props.editorWidth.getter}
                language={props.baseClassLanguage.getter}
                value={props.baseClassCode.getter}
                theme="vs-dark"
                onChange={(value) => {
                  props.baseClassCode.setter(value || "");
                  setIsSaved(false);
                }}
              />
            </div>
          }
          <p>
            Someitmes we don&apos;t want to display the editor. Therefore we
            must create an emtpy div of equal height
          </p>
        </div>
      </div>
      <div>
        <div>
          <h3>Class Variables</h3>
        </div>
        <div>
          <div>
            {/* a section for class variables */}
            test
            <div>
              {/* a section for class variables */}
              test
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NodeEditorTab;
