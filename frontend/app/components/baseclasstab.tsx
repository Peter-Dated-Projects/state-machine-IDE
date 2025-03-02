import styles from "./styles/baseclasstab.module.css";
import React, { useEffect } from "react";
import Editor from "@monaco-editor/react";

interface BaseClassTabProps {
    width: number;
}

// supported languages
const SUPPORTED_LANGUAGES = [
    "python",
    "javascript",
    "typescript",
    "java",
    "csharp",
];
const DEFAULT_CLASS_TEXT = `
class BaseClass(StateComponent):
    def __init__(self):
        pass
        
    def update(self):
        pass
`;

const BaseClassTab: React.FC<BaseClassTabProps> = ({ width }) => {
    const [baseClassCode, setBaseClassCode] = React.useState("");
    const [baseClassLanguage, setBaseClassLanguage] = React.useState("python");
    const [parsedClass, setParsedClass] = React.useState({});
    const [classVariables, setClassVariables] = React.useState([]);
    const editorWidth = React.useRef(width);

    useEffect(() => {
        editorWidth.current = width - 30;
        console.log("editor width", width);

        // run parsing code here
        console.log(baseClassCode);

        // talk with backend for parsing
    }, [baseClassCode, width]);

    return (
        <div className={styles.container}>
            <div className={styles["code-editor-container"]}>
                <div className={styles["code-editor-admin-bar"]}>
                    <div style={{ display: "flex" }}>
                        Base Class Code Editor
                    </div>
                    <div
                        className={styles["code-editor-language-select"]}
                        style={{ marginLeft: "auto" }}
                    >
                        <select
                            value={baseClassLanguage}
                            onChange={(e) =>
                                setBaseClassLanguage(e.target.value)
                            }
                            className={styles.languageSelector}
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
                        width={editorWidth.current}
                        language={baseClassLanguage}
                        value={baseClassCode}
                        defaultValue={DEFAULT_CLASS_TEXT}
                        theme="vs-dark"
                        onChange={(value) => setBaseClassCode(value || "")}
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
                        test
                        <div>
                            {classVariables.map((variable) => (
                                <div key={variable.name}>
                                    <div>{variable.name}</div>
                                    <div>{variable.type}</div>
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
