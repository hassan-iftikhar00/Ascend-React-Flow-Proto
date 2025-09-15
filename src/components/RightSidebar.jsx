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

  useEffect(() => {
    if (!selectedNode) return;
    setPrompt(selectedNode.data?.prompt || "");
    setBr(!!selectedNode.data?.br);
  }, [selectedNode]);

  if (!selectedNode) return null;

  const isPlay = selectedNode.data?.type === "play";

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
    </aside>
  );
}
