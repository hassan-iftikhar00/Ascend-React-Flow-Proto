import React from "react";
import { Handle, Position } from "@xyflow/react";
import { List } from "lucide-react";
import "./menu.css";

export default function MenuNode({ data }) {
  return (
    <div className="menu-node">
      <div className="menu-header">
        <List size={16} style={{ marginRight: 6 }} />
        <span>{data.label || "Menu"}</span>
      </div>

      <div className="menu-body">
        <p>{data.promptText || "Enter prompt text..."}</p>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{ background: "#00796b" }}
      />
    </div>
  );
}
