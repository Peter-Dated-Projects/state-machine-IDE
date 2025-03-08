import styles from "./styles/baseclasstab.module.css";
import React, { useEffect, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";

import { TabInfoProps } from "./sidebar";
import { SUPPORTED_LANGUAGES, DEFAULT_CLASS_TEXT } from "./tabinformation";
import { Select } from "@radix-ui/themes";
// import nordTheme from "monaco-themes/themes/Nord.json";

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
  const [isSaved, setIsSaved] = useState(true);

  const handleSave = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      setIsSaved(true);

      // console.log("sending request parsing signal");

      // send information to backend and retrieve active variables
      window.dispatchEvent(new CustomEvent("requestparsing"));
    }
  };

  const generateBaseCode = () => {
    // send information to backend and retrieve active variables
    // take parsed information after saving, then request backend to generate rest of code
    console.log("sending generate request");
    window.dispatchEvent(new CustomEvent("generatecode"));

    // Fills in the rest of the code in baseCode and changes it in the editor
    // TODO: popup for chatbot - later
  };

  useEffect(() => {
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
              value={props.baseClassLanguage.getter}
              onValueChange={(value) => props.baseClassLanguage.setter(value)}
            >
              <Select.Trigger />
              <Select.Content position="popper">
                {SUPPORTED_LANGUAGES.map((language) => (
                  <Select.Item key={language} value={language}>
                    {language}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <div className="code-editor-container">
          <Editor
            height="50vh"
            width={props.editorWidth.getter}
            language={props.baseClassLanguage.getter}
            value={props.baseClassCode.getter}
            defaultValue={DEFAULT_CLASS_TEXT}
            theme="vs-dark"
            onChange={(value) => {
              props.baseClassCode.setter(value || "");
              setIsSaved(false);
            }}
            onMount={(editor, monaco) => {
              editor.focus();
              props.baseClassCode.setter(editor.getValue());
              window.dispatchEvent(new CustomEvent("requestparsing"));

              // loader.init().then((monacoInstance) => {
              //   monacoInstance.editor.defineTheme("nord", nordTheme);
              //   monacoInstance.editor.setTheme("nord");
              // });
            }}
          />
        </div>
      </div>

      {/* secon section */}
      <div className={styles["nocode-container"]}>
        <div>
          <div>
            <h3>Class Variables</h3>
          </div>
          <div className={styles["class-variables-container"]}>
            {/* a section for class variables */}
              {props.baseClassVariables.getter.map((variable, index) => (
                <div key={index} className={styles["class-variable"]}>
                  <div>
                    <span>self.{variable.name}</span> ={" "}
                    <span>{variable.value}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <button className={styles["generate-btn"]} onClick={generateBaseCode}>
        Save & Generate
      </button>
    </div>
  );
};

export default BaseClassTab;
