import styles from "./styles/classeditor.module.css";
import React, { useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { classInfoProps } from "./sidebar";
import { DEFAULT_CLASS_TEXT } from "./tabinformation";

interface classEditorProps {
  props: classInfoProps;
}

const ClassEditor: React.FC<classEditorProps> = ({ props }) => {
  const handleSave = useCallback(
    (event: KeyboardEvent) => {
      if (!document.activeElement?.closest(".monaco-editor")) return;
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        props.isSaved.setter(true);
        // send information to backend and retrieve active variables
        window.dispatchEvent(new CustomEvent("requestparsing"));
      }
    },
    [props.isSaved]
  );

  // keyboard event listener for save
  useEffect(() => {
    window.addEventListener("keydown", handleSave);

    return () => {
      window.removeEventListener("keydown", handleSave);
    };
  }, [handleSave]);

  // return object
  return (
    <div className={styles.container}>
      <div className={styles["code-editor-container"]} style={{ position: "relative" }}>
        <Editor
          height="40vh"
          width={props.editorWidth.getter}
          language={props.classLanguage.getter}
          value={props.classCode.getter}
          defaultValue={DEFAULT_CLASS_TEXT}
          theme="vs-dark"
          onChange={(value) => {
            props.classCode.setter(value || "");
            props.isSaved.setter(false);
          }}
          onMount={(editor) => {
            editor.focus();
            props.classCode.setter(editor.getValue());
            window.dispatchEvent(new CustomEvent("requestparsing"));
          }}
        />
      </div>
    </div>
  );
};

export default ClassEditor;
