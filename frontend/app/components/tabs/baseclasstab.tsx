import styles from "./styles/baseclasstab.module.css";
import React, { useEffect } from "react";
import Editor from "@monaco-editor/react";

import { TabInfoProps } from "../sidebar";
import { SUPPORTED_LANGUAGES, DEFAULT_CLASS_TEXT } from "./tabinformation";

// ------------------------------------------ //
// base class input props
// ------------------------------------------ //
interface BaseClassTabProps {
  props: TabInfoProps;
}

// ------------------------------------------ //
// object
// ------------------------------------------ //
const BaseClassTab = ({ props }: BaseClassTabProps) => {
  // is saved or not saved
  const [isSaved, setIsSaved] = React.useState(true);

  useEffect(() => {
    const handleSave = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        setIsSaved(true);

        // console.log("sending request parsing signal");

        // send information to backend and retrieve active variables
        window.dispatchEvent(new CustomEvent("requestparsing"));
      }
    };

    window.addEventListener("keydown", handleSave);

    return () => {
      window.removeEventListener("keydown", handleSave);
    };
  }, []);

  // return object
  return (
    <div className={styles.container}>
      <div className={styles["code-editor-container"]}>
        <div className={styles["code-editor-admin-bar"]}>
          <div style={{ display: "flex" }}>
            <p>Base Class Code Editor</p>
          </div>
          <div className={styles["code-editor-language-selector"]}>
            <svg height="17" width="17" style={{ alignSelf: "center" }}>
              <circle cx="8.5" cy="8.5" r="8" fill={isSaved ? "green" : "red"} />
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
        <div className="code-editor-container">
          <Editor
            height="40vh"
            language={props.baseClassLanguage.getter}
            value={props.baseClassCode.getter}
            defaultValue={DEFAULT_CLASS_TEXT}
            theme="vs-dark"
            onChange={(value) => {
              props.baseClassCode.setter(value || "");
              setIsSaved(false);
            }}
            onMount={(editor) => {
              editor.focus();
              props.baseClassCode.setter(editor.getValue());
              window.dispatchEvent(new CustomEvent("requestparsing"));
            }}
          />
        </div>
      </div>

      {/* secon section */}
      <div className={styles["nocode-container"]}>
        <div>No Code Editor</div>
        <div>
          <div>
            <h3>Class Variables</h3>
          </div>
          <div className={styles["class-variables-container"]}>
            {/* a section for class variables */}
            <div>
              {props.baseClassVariables.getter.map((variable, index) => (
                <div key={index} className={styles["class-variable"]}>
                  <div>
                    <span>self.{variable.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseClassTab;
