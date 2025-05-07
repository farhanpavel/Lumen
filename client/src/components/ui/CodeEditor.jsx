"use client";
import { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector, { LANGUAGE_VERSIONS } from "./LanguageSelector";
import Output from "./Output";
import { FaPlay } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Add state for dropdown visibility




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
  const router = useRouter();
  // ... (keep existing refs and state)
  const [showPopup, setShowPopup] = useState(false);
  const resizerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState("Editor");
  const [output, setOutput] = useState([]);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
    setIsLanguageOpen(false); // Close dropdown when language is selected
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
      setShowPopup(true); // Show popup after code execution
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
        {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
              <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Code Submitted!</h3>
                <p className="text-gray-600 mb-6">
                  Your code has been successfully executed. Would you like to
                  proceed to the live interview page?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                      onClick={() => setShowPopup(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    Stay Here
                  </button>
                  <button
                      onClick={() => router.push("/userdashboard/interview")}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Go to Live Interview
                  </button>
                </div>
              </div>
            </div>
        )}
        <div className="flex justify-between items-center py-2 px-6 bg-gray-100">
          <LanguageSelector language={language} onSelect={onSelect}
                            isOpen={isLanguageOpen}
                            toggle={() => setIsLanguageOpen(!isLanguageOpen)}
          />
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
                  "Submitting..."
              ) : (
                  <>
                    <FaPlay className="inline-block" /> Submit Code
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
            <div className="text-gray-500 text-sm mb-10">
              <div className="font-bold text-lg mb-2 text-gray-700">Problem #215 - Distinct Common Palindromic
                Subsequences
              </div>
              <div className="space-y-4">
                <p><strong>Difficulty:</strong> 🔴 Hard</p>

                <p><strong>Problem Statement:</strong><br/>
                  Given two strings <code>s1</code> and <code>s2</code>, return the number of <strong>distinct
                    palindromic subsequences</strong> that appear in both strings. A subsequence is palindromic if it
                  reads the same forward and backward.</p>

                <p><strong>Constraints:</strong>
                  <ul className="list-disc pl-6">
                    <li><code>1 ≤ s1.length, s2.length ≤ 1000</code></li>
                    <li>Strings consist of lowercase English letters only</li>
                    <li>Result must fit in 32-bit integer</li>
                  </ul>
                </p>

                <p><strong>Sample Input 1:</strong><br/>
                  <code>s1 = "bcdcb", s2 = "bcdcbe"</code><br/>
                  <strong>Output:</strong> 7<br/>
                  <strong>Explanation:</strong> Common palindromic subsequences are ["b", "c", "d", "bcb", "cdc",
                  "bcdcb", "cbc"]</p>

                <p><strong>Sample Input 2:</strong><br/>
                  <code>s1 = "abac", s2 = "acab"</code><br/>
                  <strong>Output:</strong> 4<br/>
                  <strong>Explanation:</strong> Common palindromic subsequences are ["a", "b", "c", "aa"]</p>

                <div className="bg-yellow-100 p-3 rounded">
                  <strong>💡 Solution Approach Hints:</strong>
                  <ol className="list-decimal pl-6 mt-2">
                    <li>Use dynamic programming with 3D memoization (i, j, k)</li>
                    <li>Track start and end characters for palindrome formation</li>
                    <li>Handle duplicate subsequences using bitmask or set operations</li>
                    <li>Optimize space complexity using rolling arrays</li>
                  </ol>
                </div>

                <div className="bg-blue-100 p-3 rounded">
                  <strong>⚡ Expected Complexity:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Time: O(n^3) with optimizations</li>
                    <li>Space: O(n^2) using clever state compression</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CodeEditor;