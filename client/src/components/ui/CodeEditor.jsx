"use client";
import { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector, { LANGUAGE_VERSIONS } from "./LanguageSelector";
import Output from "./Output";
import { FaPlay } from "react-icons/fa";

const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
      'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Alex';\necho $name;\n",
};

export const executeCode = async (language, sourceCode) => {
  const response = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [{ content: sourceCode }],
    }),
  });
  return await response.json();
};

const CodeEditor = () => {
  const editorRef = useRef();
  const resizerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState("Editor");
  const [output, setOutput] = useState([]);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
      setActiveTab("Output");
    } catch (error) {
      console.log(error);
      alert("An error occurred: " + (error.message || "Unable to run code"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const resizer = resizerRef.current;
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;

    if (!resizer || !leftPanel || !rightPanel) return;

    const handleMouseDown = (e) => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
      const rect = leftPanel.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      leftPanel.style.width = `${newWidth}px`;
      rightPanel.style.width = `calc(100% - ${newWidth}px - 4px)`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    resizer.addEventListener("mousedown", handleMouseDown);

    return () => {
      resizer.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
      <div className="flex flex-col bg-white h-screen">
        <div className="flex justify-between items-center py-2 px-6 bg-gray-100">
          <LanguageSelector language={language} onSelect={onSelect} />
          <div className="flex">
            <button
                onClick={() => setActiveTab("Editor")}
                className={`px-4 py-2 ${
                    activeTab === "Editor"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-50 text-gray-900"
                } rounded-l-sm`}
            >
              Editor
            </button>
            <button
                onClick={() => setActiveTab("Output")}
                className={`px-4 py-2 ${
                    activeTab === "Output"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-50 text-gray-900"
                }`}
            >
              Output
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
                onClick={runCode}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-500 p-2 rounded text-white text-sm hover:bg-blue-600 transition-colors"
            >
              {loading ? (
                  "Running..."
              ) : (
                  <>
                    <FaPlay className="inline-block" /> Run Code
                  </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          <div
              ref={leftPanelRef}
              className="flex-1 overflow-auto"
              style={{ width: "50%" }}
          >
            {activeTab === "Editor" ? (
                <Editor
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                    }}
                    height="100%"
                    theme="vs-light"
                    language={language}
                    defaultValue={CODE_SNIPPETS[language]}
                    onMount={onMount}
                    value={value}
                    onChange={(value) => setValue(value)}
                />
            ) : (
                <Output output={output} isError={isError} />
            )}
          </div>

          <div
              ref={resizerRef}
              className="w-1 bg-gray-200 hover:bg-blue-500 cursor-ew-resize z-10"
          />

          <div
              ref={rightPanelRef}
              className="flex-1 overflow-hidden bg-gray-50 p-4"
              style={{ width: "50%" }}
          >
            <div className="text-gray-500 text-sm">
              Additional panel content can go here
            </div>
          </div>
        </div>
      </div>
  );
};

export default CodeEditor;