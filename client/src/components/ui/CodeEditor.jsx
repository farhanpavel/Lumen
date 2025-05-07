"use client";
import { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { useRouter } from "next/navigation";
import {
  Play,
  Code,
  FileText,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Loader2,
  ArrowRight,
  Clock,
  Sparkles,
  Lightbulb,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
};

const LANGUAGE_LABELS = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  csharp: "C#",
  php: "PHP",
};

const LANGUAGE_ICONS = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  csharp: "cs",
  php: "php",
};

const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log(&quot;Hello, &quot; + name + &quot;!&quot;);\n}\n\ngreet(&quot;Alex&quot;);\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log(&quot;Hello, &quot; + data.name + &quot;!&quot;);\n}\n\ngreet({ name: &quot;Alex&quot; });\n`,
  python: `\ndef greet(name):\n\tprint(&quot;Hello, &quot; + name + &quot;!&quot;)\n\ngreet(&quot;Alex&quot;)\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(&quot;Hello World&quot;);\n\t}\n}\n`,
  csharp:
    "using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine(&quot;Hello World in C#&quot;);\n\t\t}\n\t}\n}\n",
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

const Output = ({ output, isError }) => {
  return (
    <div className="h-full overflow-auto bg-gray-900 text-white p-4 font-mono text-sm">
      <div className="mb-2 flex items-center">
        <Badge
          variant="outline"
          className="bg-gray-800 text-gray-300 border-gray-700"
        >
          Output
        </Badge>
        {isError && (
          <Badge
            variant="outline"
            className="ml-2 bg-red-900/30 text-red-300 border-red-800"
          >
            <AlertTriangle className="h-3 w-3 mr-1" /> Error
          </Badge>
        )}
      </div>
      <div className={`${isError ? "text-red-400" : "text-green-400"}`}>
        {output.length > 0 ? (
          output.map((line, i) => <div key={i}>{line || " "}</div>)
        ) : (
          <div className="text-gray-400 italic">No output to display</div>
        )}
      </div>
    </div>
  );
};

const CodeEditor = ({ jobId }) => {
  const editorRef = useRef();
  const router = useRouter();
  const resizerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState("editor");
  const [output, setOutput] = useState([]);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [fullscreen, setFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

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
      setActiveTab("output");

      // Simulate progress for demo purposes
      setProgress(25);
      setTimeout(() => setProgress(50), 500);
      setTimeout(() => setProgress(75), 1000);
      setTimeout(() => setProgress(100), 1500);
      setTimeout(() => setShowDialog(true), 2000);
    } catch (error) {
      console.log(error);
      setIsError(true);
      setOutput([
        "An error occurred: " + (error.message || "Unable to run code"),
      ]);
      setActiveTab("output");
    } finally {
      setLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Resizer functionality
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
      const rect = leftPanel.parentElement.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;

      // Limit the minimum width to 20% and maximum to 80%
      const limitedWidth = Math.min(Math.max(newWidth, 20), 80);

      leftPanel.style.width = `${limitedWidth}%`;
      rightPanel.style.width = `${100 - limitedWidth}%`;
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeLeft < 300) return "text-red-600"; // Less than 5 minutes
    if (timeLeft < 600) return "text-amber-600"; // Less than 10 minutes
    return "text-[#322372]";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm py-2 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-[#322372]">
              Coding Assessment
            </h1>
            <Badge
              variant="outline"
              className="bg-[#7657ff]/10 text-[#7657ff] border-[#7657ff]/20"
            >
              Problem #215
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <Clock className={`h-4 w-4 ${getTimeColor()}`} />
              <span className={`font-mono font-medium ${getTimeColor()}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setFullscreen(!fullscreen)}
              className="border-[#7657ff]/30 text-[#7657ff] hover:bg-[#7657ff]/10"
            >
              {fullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-1 overflow-hidden ${
          fullscreen ? "fixed inset-0 z-50 bg-white" : ""
        }`}
      >
        {/* Left Panel - Editor/Output */}
        <div
          ref={leftPanelRef}
          className="h-full overflow-hidden"
          style={{ width: "50%" }}
        >
          {/* Editor Controls */}
          <div className="flex justify-between items-center py-2 px-4 bg-gray-50 border-b border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-[#7657ff]/30 text-[#7657ff] hover:bg-[#7657ff]/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 text-gray-700 w-5 h-5 rounded flex items-center justify-center text-xs font-mono">
                      {LANGUAGE_ICONS[language]}
                    </div>
                    <span>{LANGUAGE_LABELS[language]}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {Object.keys(LANGUAGE_LABELS).map((lang) => (
                  <DropdownMenuItem key={lang} onClick={() => onSelect(lang)}>
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-200 text-gray-700 w-5 h-5 rounded flex items-center justify-center text-xs font-mono">
                        {LANGUAGE_ICONS[lang]}
                      </div>
                      <span>{LANGUAGE_LABELS[lang]}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gray-100 border border-gray-200">
                <TabsTrigger
                  value="editor"
                  className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger
                  value="output"
                  className="data-[state=active]:bg-[#7657ff] data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Output
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              onClick={runCode}
              disabled={loading}
              className="bg-[#7657ff] hover:bg-[#322372]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Running...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span>Run &amp; Submit</span>
                </div>
              )}
            </Button>
          </div>

          {/* Editor/Output Content */}
          <div className="h-[calc(100%-48px)] overflow-hidden">
            {activeTab === "editor" ? (
              <Editor
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: true,
                  fontSize: 14,
                  fontFamily: "'Fira Code', monospace",
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBars: "auto",
                  cursorStyle: "line",
                  automaticLayout: true,
                }}
                height="100%"
                theme="vs-dark"
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
        </div>

        {/* Resizer */}
        <div
          ref={resizerRef}
          className="w-1 bg-gray-200 hover:bg-[#7657ff] cursor-ew-resize z-10 transition-colors"
        />

        {/* Right Panel - Problem Statement */}
        <div
          ref={rightPanelRef}
          className="h-full overflow-auto bg-white"
          style={{ width: "50%" }}
        >
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#322372] mb-2">
                  Distinct Common Palindromic Subsequences
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    Hard
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-[#322372]/10 text-[#322372] border-[#322372]/20"
                  >
                    Dynamic Programming
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-[#322372]/10 text-[#322372] border-[#322372]/20"
                  >
                    Strings
                  </Badge>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold text-[#322372]">
                  Problem Statement
                </h3>
                <p>
                  Given two strings <code>s1</code> and <code>s2</code>, return
                  the number of{" "}
                  <strong>distinct palindromic subsequences</strong> that appear
                  in both strings. A subsequence is palindromic if it reads the
                  same forward and backward.
                </p>

                <h3 className="text-lg font-semibold text-[#322372] mt-6">
                  Constraints
                </h3>
                <ul className="list-disc pl-6">
                  <li>
                    <code>1 ≤ s1.length, s2.length ≤ 1000</code>
                  </li>
                  <li>Strings consist of lowercase English letters only</li>
                  <li>Result must fit in 32-bit integer</li>
                </ul>

                <h3 className="text-lg font-semibold text-[#322372] mt-6">
                  Examples
                </h3>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                  <p className="font-semibold">Example 1:</p>
                  <p>
                    <strong>Input:</strong>{" "}
                    <code>s1 = &quot;bcdcb&quot;, s2 = &quot;bcdcbe&quot;</code>
                    <br />
                    <strong>Output:</strong> <code>7</code>
                    <br />
                    <strong>Explanation:</strong> Common palindromic
                    subsequences are [&quot;b&quot;, &quot;c&quot;,
                    &quot;d&quot;, &quot;bcb&quot;, &quot;cdc&quot;,
                    &quot;bcdcb&quot;, &quot;cbc&quot;]
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="font-semibold">Example 2:</p>
                  <p>
                    <strong>Input:</strong>{" "}
                    <code>s1 = &quot;abac&quot;, s2 = &quot;acab&quot;</code>
                    <br />
                    <strong>Output:</strong> <code>4</code>
                    <br />
                    <strong>Explanation:</strong> Common palindromic
                    subsequences are [&quot;a&quot;, &quot;b&quot;,
                    &quot;c&quot;, &quot;aa&quot;]
                  </p>
                </div>
              </div>

              <Alert className="bg-[#7657ff]/10 border-[#7657ff]/20">
                <Lightbulb className="h-4 w-4 text-[#7657ff]" />
                <AlertDescription className="text-[#322372]">
                  <p className="font-semibold mb-2">Solution Approach Hints:</p>
                  <ol className="list-decimal pl-6 space-y-1">
                    <li>
                      Use dynamic programming with 3D memoization (i, j, k)
                    </li>
                    <li>
                      Track start and end characters for palindrome formation
                    </li>
                    <li>
                      Handle duplicate subsequences using bitmask or set
                      operations
                    </li>
                    <li>Optimize space complexity using rolling arrays</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="font-semibold text-[#322372] mb-2">
                  Expected Complexity:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Time: O(n³) with optimizations</li>
                  <li>Space: O(n²) using clever state compression</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#322372]">
              <Sparkles className="h-5 w-5 text-[#7657ff]" /> Code Submission
              Complete
            </DialogTitle>
            <DialogDescription>
              Your code has been successfully executed and submitted for review.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Submission Status</span>
                <span className="font-medium text-green-600">Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your solution has been submitted. Would you like to proceed to
                the live interview?
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="flex sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-[#7657ff]/30 text-[#7657ff] hover:bg-[#7657ff]/10"
            >
              <X className="h-4 w-4 mr-2" /> Stay Here
            </Button>
            <Button
              onClick={() => router.push("/userdashboard/interview")}
              className="bg-[#7657ff] hover:bg-[#322372]"
            >
              <ArrowRight className="h-4 w-4 mr-2" /> Go to Live Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CodeEditor;
