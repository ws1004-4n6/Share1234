import { useState } from "react";
import { invoke } from "@tauri-apps/api/core"; // Tauri 에서 사용하는 Rust 함수를 호출하기 위한 모듈
import { open } from '@tauri-apps/plugin-dialog';

function HexEditor() {
  const [filePath, setFilePath] = useState("");
  const [hexData, setHexData] = useState("");

  const handleSelectFile = async () => {
    const selectedPath = await open({
      multiple: false,
      filters: [
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (selectedPath) {
      setFilePath(selectedPath as string);
    }
  };

  const handleReadFile = async () => {
    try {
      console.log("Invoking Rust command with file path:", filePath);
      const hex = await invoke<string>("read_file_as_hex", { file_path: filePath });
      //const hex = await invoke<string>("read_file_as_hex", { filePath });
      console.log("Hex data received:", hex);
      setHexData(hex);
    } catch (error) {
      console.error("Error reading file :", error);
    }
  };

  return (
    <div style={{ fontFamily: "monospace", padding: "16px" }}>
      <h1>Hex Editor</h1>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <input type="text" placeholder="Enter file path" value={filePath} onChange={(e) => setFilePath(e.target.value)} style={{ flex: 1, height: "36px", padding: "8px", fontSize: "14px", margin: 0, border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}/>
        <button onClick={handleSelectFile} style={{ height: "36px", padding: "0 12px", marginLeft: "8px", fontSize: "14px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#f9f9f9", cursor: "pointer" }}>Select File</button>
      </div>

      <button onClick={() => {console.log("Load File button clicked"); handleReadFile();}}>Load File</button>

      <pre style={{ marginTop: "16px", whiteSpace: "pre-wrap" }}>
        {hexData || "No data loaded"}
      </pre>
    </div>
  );
}

export default HexEditor;