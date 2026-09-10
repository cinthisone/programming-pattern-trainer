"use client";

import Editor from "@monaco-editor/react";

export function CodeEditor({
  language,
  value,
  onChange,
  theme,
}: {
  language: string;
  value: string;
  onChange: (value: string) => void;
  theme: "vs" | "vs-dark";
}) {
  return (
    <Editor
      className="h-full min-h-0"
      language={language}
      value={value}
      theme={theme}
      onChange={(next) => onChange(next ?? "")}
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
        tabSize: 4,
        insertSpaces: true,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        lineNumbers: "on",
        matchBrackets: "always",
        renderLineHighlight: "line",
        padding: { top: 8, bottom: 8 },
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        contextmenu: true,
      }}
    />
  );
}
