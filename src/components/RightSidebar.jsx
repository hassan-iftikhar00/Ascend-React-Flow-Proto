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
  const [timeout, setTimeoutVal] = useState(1);
  const [trackInvalid, setTrackInvalid] = useState(false);
  const [trackNoResponse, setTrackNoResponse] = useState(false);
  const [invalidPromptChecked, setInvalidPromptChecked] = useState(false);
  const [invalidAction, setInvalidAction] = useState("repeat");
  const [noResponsePromptChecked, setNoResponsePromptChecked] = useState(false);
  const [noResponseAction, setNoResponseAction] = useState("repeat");
  const [invalidFrequency, setInvalidFrequency] = useState(1);
  const [invalidGotoOption, setInvalidGotoOption] = useState("HangUp");
  const [noResponseFrequency, setNoResponseFrequency] = useState(1);
  const [noResponseGotoOption, setNoResponseGotoOption] = useState("HangUp");

  useEffect(() => {
    if (!selectedNode) return;
    setPrompt(selectedNode.data?.prompt || "");
    setBr(!!selectedNode.data?.br);
    setPromptText(selectedNode.data?.promptText || "");
    setTimeoutVal(selectedNode.data?.timeout ?? 1);
    setTrackInvalid(!!selectedNode.data?.trackInvalid);
    setTrackNoResponse(!!selectedNode.data?.trackNoResponse);
    setInvalidPromptChecked(!!selectedNode.data?.invalidPromptChecked);
    setInvalidAction(selectedNode.data?.invalidAction || "repeat");
    setInvalidFrequency(selectedNode.data?.invalidFrequency ?? 1);
    setInvalidGotoOption(selectedNode.data?.invalidGotoOption || "HangUp");
    setNoResponsePromptChecked(!!selectedNode.data?.noResponsePromptChecked);
    setNoResponseAction(selectedNode.data?.noResponseAction || "repeat");
    setNoResponseFrequency(selectedNode.data?.noResponseFrequency ?? 1);
    setNoResponseGotoOption(
      selectedNode.data?.noResponseGotoOption || "HangUp"
    );
    // DEBUG: inspect selected node and computed flags
    // (temporary - will remove after diagnosis)
    console.log(
      "RightSidebar selectedNode:",
      selectedNode?.id,
      selectedNode?.data,
      "isPlay?",
      selectedNode?.data?.type === "play"
    );
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

          <div className="rf-field">
            <div className="rf-field-label">Timeout (sec)</div>
            <select
              value={String(timeout)}
              onChange={(e) => setTimeoutVal(Number(e.target.value))}
              className="rf-select"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="rf-field">
            <label>
              <input
                type="checkbox"
                checked={trackInvalid}
                onChange={(e) => setTrackInvalid(e.target.checked)}
              />{" "}
              Track Invalid
            </label>
          </div>

          <div className="rf-field">
            <label>
              <input
                type="checkbox"
                checked={trackNoResponse}
                onChange={(e) => setTrackNoResponse(e.target.checked)}
              />{" "}
              Track No Response
            </label>
          </div>

          {/* Invalid Response block */}
          <div className="rf-field rf-panel">
            <div className="rf-panel-header">Invalid Response</div>
            <label>
              <input
                type="checkbox"
                checked={invalidPromptChecked}
                onChange={(e) => setInvalidPromptChecked(e.target.checked)}
              />{" "}
              Standard Invalid Message Prompt
            </label>
            <div style={{ marginTop: 8 }}>
              <label style={{ marginRight: 12 }}>
                <input
                  type="radio"
                  name={`invalid-action-${selectedNode.id}`}
                  value="repeat"
                  checked={invalidAction === "repeat"}
                  onChange={(e) => setInvalidAction(e.target.value)}
                />{" "}
                Repeat
              </label>
              <label>
                <input
                  type="radio"
                  name={`invalid-action-${selectedNode.id}`}
                  value="goto"
                  checked={invalidAction === "goto"}
                  onChange={(e) => setInvalidAction(e.target.value)}
                />{" "}
                Go To
              </label>
              {/* conditional selects */}
              {invalidAction === "repeat" && (
                <div style={{ marginTop: 8 }}>
                  <label className="rf-field-label">Frequency</label>
                  <select
                    value={String(invalidFrequency)}
                    onChange={(e) =>
                      setInvalidFrequency(Number(e.target.value))
                    }
                    className="rf-select"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              )}
              {invalidAction === "goto" && (
                <div style={{ marginTop: 8 }}>
                  <select
                    value={invalidGotoOption}
                    onChange={(e) => setInvalidGotoOption(e.target.value)}
                    className="rf-select"
                  >
                    <option>HangUp</option>
                    <option>W|1</option>
                    <option>W|2</option>
                    <option>T|3</option>
                    <option>M|4</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* No Response block */}
          <div className="rf-field rf-panel">
            <div className="rf-panel-header">No Response</div>
            <label>
              <input
                type="checkbox"
                checked={noResponsePromptChecked}
                onChange={(e) => setNoResponsePromptChecked(e.target.checked)}
              />{" "}
              Standard no response Message prompt
            </label>
            <div style={{ marginTop: 8 }}>
              <label style={{ marginRight: 12 }}>
                <input
                  type="radio"
                  name={`noresponse-action-${selectedNode.id}`}
                  value="repeat"
                  checked={noResponseAction === "repeat"}
                  onChange={(e) => setNoResponseAction(e.target.value)}
                />{" "}
                Repeat
              </label>
              <label>
                <input
                  type="radio"
                  name={`noresponse-action-${selectedNode.id}`}
                  value="goto"
                  checked={noResponseAction === "goto"}
                  onChange={(e) => setNoResponseAction(e.target.value)}
                />{" "}
                Go To
              </label>
              {noResponseAction === "repeat" && (
                <div style={{ marginTop: 8 }}>
                  <label className="rf-field-label">Frequency</label>
                  <select
                    value={String(noResponseFrequency)}
                    onChange={(e) =>
                      setNoResponseFrequency(Number(e.target.value))
                    }
                    className="rf-select"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              )}
              {noResponseAction === "goto" && (
                <div style={{ marginTop: 8 }}>
                  <select
                    value={noResponseGotoOption}
                    onChange={(e) => setNoResponseGotoOption(e.target.value)}
                    className="rf-select"
                  >
                    <option>HangUp</option>
                    <option>W|1</option>
                    <option>W|2</option>
                    <option>T|3</option>
                    <option>M|4</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              className="rf-save"
              onClick={() => {
                updateNodeData(selectedNode.id, {
                  ...selectedNode.data,
                  promptText,
                  timeout,
                  trackInvalid,
                  trackNoResponse,
                  invalidPromptChecked,
                  invalidAction,
                  invalidFrequency,
                  invalidGotoOption,
                  noResponsePromptChecked,
                  noResponseAction,
                  noResponseFrequency,
                  noResponseGotoOption,
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
