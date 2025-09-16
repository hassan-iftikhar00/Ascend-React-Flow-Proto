import React, { useState, useEffect } from "react";
import "./rightsidebar.css";

export default function RightSidebar({
  selectedNode,
  updateNodeData,
  onClose,
}) {
  // local state is always initialized (hooks must run unconditionally)
  const [prompt, setPrompt] = useState("");
  const [br, setBr] = useState(false);
  const [promptText, setPromptText] = useState("");

  useEffect(() => {
    if (!selectedNode) return;
    setPrompt(selectedNode.data?.prompt || "");
    setBr(!!selectedNode.data?.br);
  setPromptText(selectedNode.data?.promptText || "");
  }, [selectedNode]);

  if (!selectedNode) return null;

  const isPlay = selectedNode.data?.type === "play";
  const isMenu = selectedNode.data?.type === "menu";

  return (
    <aside className="rf-rightsidebar">
      <div className="rf-right-header">
        <div>{selectedNode.data?.type || "Properties"}</div>
        <button onClick={onClose}>Close</button>
      </div>

      {isPlay && (
        <div className="rf-right-content">
          <label className="rf-field">
            <div className="rf-field-label">Prompt Text</div>
            <input
              className="rf-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </label>

          <div className="rf-field">
            <div className="rf-field-label">BR</div>
            <select
              value={br ? "true" : "false"}
              onChange={(e) => setBr(e.target.value === "true")}
              className="rf-select"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <div>
            <button
              className="rf-save"
              onClick={() => {
                // apply changes temporarily to node data and update node label to prompt
                updateNodeData(selectedNode.id, {
                  ...selectedNode.data,
                  prompt,
                  br,
                  label: prompt,
                });
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {isMenu && (
        <div className="rf-right-content">
          <label className="rf-field">
            <div className="rf-field-label">Prompt Text</div>
            <input
              className="rf-textarea"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
          </label>

          <div>
            <button
              className="rf-save"
              onClick={() => {
                updateNodeData(selectedNode.id, {
                  ...selectedNode.data,
                  promptText,
                  label: promptText || selectedNode.data.label,
                });
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
